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

interface JoinAdminData {
  adminName: string;
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

  constructor(private readonly chatService: ChatService) {
    console.log('ChatGateway initialized');
  }

  async handleConnection(client: Socket) {
    console.log(`🔌 [CONNECTION] Client connected: ${client.id}`);
    console.log(
      `🔌 [CONNECTION] Total connected clients: ${this.server.sockets.sockets.size}`,
    );

    const recentMessages = await this.chatService.getRecentMessages();
    client.emit('recentMessages', recentMessages.reverse());
    console.log(
      `🔌 [CONNECTION] Sent ${recentMessages.length} recent messages to client ${client.id}`,
    );
  }

  handleDisconnect(client: Socket) {
    console.log(`🔌 [DISCONNECT] Client disconnected: ${client.id}`);
    console.log(
      `🔌 [DISCONNECT] Total connected clients: ${this.server.sockets.sockets.size}`,
    );

    const supportTicket = this.findTicketByUserId(client.id);
    if (supportTicket) {
      console.log(
        `🔌 [DISCONNECT] Support user ${supportTicket.userName} (${client.id}) disconnected from ticket ${supportTicket.id}`,
      );

      this.server.to('admin-room').emit('userDisconnected', {
        ticketId: supportTicket.id,
        userName: supportTicket.userName,
        userId: client.id,
      });
      console.log(
        `🔌 [DISCONNECT] Sent userDisconnected event to admin-room for user ${supportTicket.userName}`,
      );
    }

    const userName = this.connectedUsers.get(client.id) || 'Anonymous';
    console.log(
      `🔌 [DISCONNECT] User ${userName} (${client.id}) left the chat`,
    );
    this.server.emit('userLeft', {
      userId: client.id,
      userName: userName,
    });
    this.connectedUsers.delete(client.id);
    console.log(
      `🔌 [DISCONNECT] Removed user ${client.id} from connectedUsers`,
    );
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(client: Socket, joinData: JoinChatDto) {
    this.connectedUsers.set(client.id, joinData.userName);
    console.log(joinData);
    console.log(this.connectedUsers);

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
    console.log(
      '🎫 [CREATE_TICKET] Creating support ticket for client:',
      client.id,
    );
    console.log('🎫 [CREATE_TICKET] Ticket data:', data);

    const ticketId = `ticket_${Date.now()}`;
    const roomId = `support_${ticketId}`;

    await client.join(roomId);
    console.log(
      `🎫 [CREATE_TICKET] Client ${client.id} joined room: ${roomId}`,
    );

    console.log('🎫 [CREATE_TICKET] Created room:', roomId);
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

    console.log(
      '🎫 [CREATE_TICKET] Ticket saved. Total tickets:',
      this.supportTickets.size,
    );
    console.log('🎫 [CREATE_TICKET] Initial message saved:', initialMessage);

    console.log(
      '🎫 [CREATE_TICKET] Sending notification to admin-room about new ticket',
    );
    this.server.to('admin-room').emit('newSupportTicket', {
      id: ticketId,
      userName: data.userName,
      message: data.initialMessage,
      userId: client.id,
    });
    console.log('🎫 [CREATE_TICKET] Notification sent to admin-room');
  }

  @SubscribeMessage('sendSupportMessage')
  handleSupportMessage(client: Socket, data: SupportMessageData) {
    console.log(
      '💬 [USER_MESSAGE] Received sendSupportMessage from client:',
      client.id,
    );
    console.log('💬 [USER_MESSAGE] Message data:', data);

    let ticket = this.findTicketByUserId(client.id);
    console.log(
      '💬 [USER_MESSAGE] Found ticket by userId:',
      ticket?.id || 'NOT_FOUND',
    );

    if (!ticket && data.userName) {
      console.log('💬 [USER_MESSAGE] Searching by userName:', data.userName);
      for (const [, t] of this.supportTickets) {
        if (t.userName === data.userName && t.status === 'open') {
          ticket = t;
          console.log('💬 [USER_MESSAGE] Found ticket by userName:', ticket.id);
          ticket.userId = client.id;
          console.log(
            '💬 [USER_MESSAGE] Updated userId for reconnected user:',
            client.id,
          );
          break;
        }
      }
    }

    console.log('💬 [USER_MESSAGE] Final ticket:', ticket?.id || 'NOT_FOUND');

    if (ticket) {
      const messageData = {
        message: data.message,
        userName: data.userName,
        timestamp: new Date(),
      };

      const ticketMessages = this.supportMessages.get(ticket.id) || [];
      ticketMessages.push(messageData);
      this.supportMessages.set(ticket.id, ticketMessages);

      console.log(
        `💬 [USER_MESSAGE] Saved message to ticket ${ticket.id}. Total messages: ${ticketMessages.length}`,
      );

      console.log('💬 [USER_MESSAGE] Sending message to room:', ticket.roomId);
      this.server.to(ticket.roomId).emit('newMessage', messageData);
      console.log('💬 [USER_MESSAGE] Message sent to room');

      this.server.to('admin-room').emit('userReconnected', {
        ticketId: ticket.id,
        userName: ticket.userName,
        userId: client.id,
      });
      console.log('💬 [USER_MESSAGE] Sent userReconnected event to admin-room');
    } else {
      console.log('💬 [USER_MESSAGE] No ticket found for client:', client.id);
    }
  }

  @SubscribeMessage('sendAdminMessage')
  handleAdminMessage(
    client: Socket,
    data: { ticketId: string; message: string; userName: string },
  ) {
    console.log(
      '👨‍💼 [ADMIN_MESSAGE] Received sendAdminMessage from admin:',
      client.id,
    );
    console.log('👨‍💼 [ADMIN_MESSAGE] Admin message data:', data);

    const ticket = this.supportTickets.get(data.ticketId);
    console.log('👨‍💼 [ADMIN_MESSAGE] Found ticket:', ticket?.id || 'NOT_FOUND');

    if (ticket) {
      const messageData = {
        message: data.message,
        userName: data.userName,
        timestamp: new Date(),
      };

      const ticketMessages = this.supportMessages.get(ticket.id) || [];
      ticketMessages.push(messageData);
      this.supportMessages.set(ticket.id, ticketMessages);

      console.log(
        `👨‍💼 [ADMIN_MESSAGE] Saved admin message to ticket ${ticket.id}. Total messages: ${ticketMessages.length}`,
      );

      console.log(
        '👨‍💼 [ADMIN_MESSAGE] Sending admin message to room:',
        ticket.roomId,
      );
      this.server.to(ticket.roomId).emit('newMessage', messageData);
      console.log('👨‍💼 [ADMIN_MESSAGE] Admin message sent to room');
    } else {
      console.log(
        `👨‍💼 [ADMIN_MESSAGE] Ticket ${data.ticketId} not found for admin message`,
      );
    }
  }

  @SubscribeMessage('joinAsAdmin')
  async handleJoinAsAdmin(client: Socket, data: JoinAdminData) {
    console.log('👨‍💼 [JOIN_ADMIN] Admin trying to join admin-room:', client.id);
    await client.join('admin-room');
    console.log(`👨‍💼 [JOIN_ADMIN] Admin ${data.adminName} joined admin room`);

    const openTickets = Array.from(this.supportTickets.values()).filter(
      (ticket) => ticket.status === 'open',
    );

    console.log(
      `👨‍💼 [JOIN_ADMIN] Found ${openTickets.length} open tickets for admin`,
    );
    client.emit('supportTicketsList', openTickets);
    console.log(
      `👨‍💼 [ADMIN_MESSAGE] Sent ${openTickets.length} open tickets to admin`,
    );
  }

  @SubscribeMessage('joinTicket')
  async handleJoinTicket(client: Socket, data: JoinTicketData) {
    console.log('👨‍💼 [JOIN_TICKET] Admin trying to join ticket:', data.ticketId);
    const ticket = this.supportTickets.get(data.ticketId);
    console.log('👨‍💼 [JOIN_TICKET] Found ticket:', ticket?.id || 'NOT_FOUND');

    if (ticket) {
      await client.join(ticket.roomId);
      console.log(
        `👨‍💼 [JOIN_TICKET] Admin ${client.id} joined ticket room: ${ticket.roomId}`,
      );

      const ticketMessages = this.supportMessages.get(ticket.id) || [];
      console.log(
        `👨‍💼 [JOIN_TICKET] Sending ${ticketMessages.length} messages to admin for ticket ${data.ticketId}`,
      );
      console.log('👨‍💼 [JOIN_TICKET] Ticket messages:', ticketMessages);
      client.emit('ticketMessages', ticketMessages);
      console.log('👨‍💼 [JOIN_TICKET] Sent ticket messages to admin');
    } else {
      console.log(`👨‍💼 [JOIN_TICKET] Ticket ${data.ticketId} not found`);
    }
  }

  private findTicketByUserId(userId: string) {
    console.log('🔍 [FIND_TICKET] Searching for ticket with userId:', userId);
    console.log(
      '🔍 [FIND_TICKET] Available tickets:',
      Array.from(this.supportTickets.values()).map((t) => ({
        id: t.id,
        userId: t.userId,
        userName: t.userName,
      })),
    );

    for (const [, ticket] of this.supportTickets) {
      if (ticket.userId === userId) {
        console.log('🔍 [FIND_TICKET] Found ticket:', ticket.id);
        return ticket;
      }
    }
    console.log('🔍 [FIND_TICKET] No ticket found for userId:', userId);
    return null;
  }
}
