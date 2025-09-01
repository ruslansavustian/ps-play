import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat-service';
import { ChatMessageDto } from './dto/chat-message.dto';
import { JoinChatDto } from './dto/join-chat-dto';

interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  roomId: string;
  status: 'open' | 'closed';
}

interface SupportMessageData {
  message: string;
  userName: string;
}

interface SupportTicketData {
  userName: string;
  initialMessage: string;
}

interface JoinTicketData {
  ticketId: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>();
  private supportTickets = new Map<string, SupportTicket>();
  private supportMessages = new Map<string, any[]>();

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    const recentMessages = await this.chatService.getRecentMessages();
    client.emit('recentMessages', recentMessages.reverse());
  }

  handleDisconnect(client: Socket) {
    const supportTicket = this.findTicketByUserId(client.id);
    if (supportTicket) {
      this.server.to('admin-room').emit('userDisconnected', {
        ticketId: supportTicket.id,
        userName: supportTicket.userName,
        userId: client.id,
      });
    }

    const userName = this.connectedUsers.get(client.id) || 'Anonymous';

    this.server.emit('userLeft', {
      userId: client.id,
      userName: userName,
    });
    this.connectedUsers.delete(client.id);
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(client: Socket, joinData: JoinChatDto) {
    this.connectedUsers.set(client.id, joinData.userName);

    this.server.emit('userJoined', {
      userId: client.id,
      userName: joinData.userName,
    });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, messageData: ChatMessageDto) {
    const userName =
      this.connectedUsers.get(client.id) || messageData.userName || 'Anonymous';

    const savedMessage = await this.chatService.saveMessage({
      ...messageData,
      userName,
      userId: client.id,
    });

    this.server.emit('newMessage', {
      id: savedMessage.id,
      message: savedMessage.message,
      userName: savedMessage.userName,
      userId: savedMessage.userId,
      createdAt: savedMessage.createdAt,
    });
  }

  @SubscribeMessage('createSupportTicket')
  async handleCreateTicket(client: Socket, data: SupportTicketData) {
    const ticketId = `ticket_${Date.now()}`;
    const roomId = `support_${ticketId}`;

    await client.join(roomId);

    this.supportTickets.set(ticketId, {
      id: ticketId,
      userId: client.id,
      userName: data.userName,
      roomId: roomId,
      status: 'open',
    });

    const initialMessage = {
      message: data.initialMessage,
      userName: data.userName,
      timestamp: new Date(),
    };
    this.supportMessages.set(ticketId, [initialMessage]);

    this.server.to('admin-room').emit('newSupportTicket', {
      id: ticketId,
      userName: data.userName,
      message: data.initialMessage,
      userId: client.id,
    });
  }

  @SubscribeMessage('sendSupportMessage')
  handleSupportMessage(client: Socket, data: SupportMessageData) {
    let ticket = this.findTicketByUserId(client.id);

    if (!ticket && data.userName) {
      for (const [, t] of this.supportTickets) {
        if (t.userName === data.userName && t.status === 'open') {
          ticket = t;
          ticket.userId = client.id;
          break;
        }
      }
    }

    if (ticket) {
      const messageData = {
        message: data.message,
        userName: data.userName,
        timestamp: new Date(),
      };

      const ticketMessages = this.supportMessages.get(ticket.id) || [];
      ticketMessages.push(messageData);
      this.supportMessages.set(ticket.id, ticketMessages);

      this.server.to(ticket.roomId).emit('newMessage', messageData);

      this.server.to('admin-room').emit('userReconnected', {
        ticketId: ticket.id,
        userName: ticket.userName,
        userId: client.id,
      });
    }
  }

  @SubscribeMessage('sendAdminMessage')
  handleAdminMessage(
    client: Socket,
    data: { ticketId: string; message: string; userName: string },
  ) {
    const ticket = this.supportTickets.get(data.ticketId);

    if (ticket) {
      const messageData = {
        message: data.message,
        userName: data.userName,
        timestamp: new Date(),
      };

      const ticketMessages = this.supportMessages.get(ticket.id) || [];
      ticketMessages.push(messageData);
      this.supportMessages.set(ticket.id, ticketMessages);

      this.server.to(ticket.roomId).emit('newMessage', messageData);
    }
  }

  @SubscribeMessage('joinAsAdmin')
  async handleJoinAsAdmin(client: Socket) {
    await client.join('admin-room');

    const openTickets = Array.from(this.supportTickets.values()).filter(
      (ticket) => ticket.status === 'open',
    );

    client.emit('supportTicketsList', openTickets);
  }

  @SubscribeMessage('joinTicket')
  async handleJoinTicket(client: Socket, data: JoinTicketData) {
    const ticket = this.supportTickets.get(data.ticketId);

    if (ticket) {
      await client.join(ticket.roomId);

      const ticketMessages = this.supportMessages.get(ticket.id) || [];
      client.emit('ticketMessages', ticketMessages);
      client.emit('ticketMessages', ticketMessages);
    }
  }

  private findTicketByUserId(userId: string) {
    for (const [, ticket] of this.supportTickets) {
      if (ticket.userId === userId) {
        return ticket;
      }
    }

    return null;
  }
}
