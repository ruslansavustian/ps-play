-- Создаем роли, если их нет
INSERT INTO roles (id, name, description, permissions) VALUES 
(1, 'ADMIN', 'Administrator role', '["all"]'),
(2, 'USER', 'Regular user role', '["read", "create"]'),
(3, 'MODERATOR', 'Moderator role', '["read", "create", "update"]')
ON CONFLICT (id) DO NOTHING;

-- Обновляем пользователей без роли на роль USER (id=2)
UPDATE users SET "roleId" = 2 WHERE "roleId" IS NULL OR "roleId" NOT IN (SELECT id FROM roles);
