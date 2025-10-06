-- ========================================
-- Ticketing System Database Schema
-- PostgreSQL Database Initialization
-- ========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 1. Role Table
-- ========================================
CREATE TABLE IF NOT EXISTS role (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 2. User Table
-- ========================================
CREATE TABLE IF NOT EXISTS "user" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID REFERENCES role(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  title_name VARCHAR(50),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 3. Permission Table
-- ========================================
CREATE TABLE IF NOT EXISTS permission (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 4. Role-Permission Junction Table
-- ========================================
CREATE TABLE IF NOT EXISTS role_permission (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID NOT NULL REFERENCES role(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permission(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(role_id, permission_id)
);

-- ========================================
-- 5. Customer Table
-- ========================================
CREATE TABLE IF NOT EXISTS customer (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 6. Project Table
-- ========================================
CREATE TABLE IF NOT EXISTS project (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(100),
  description TEXT,
  customer_id UUID NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
  start_date DATE,
  end_date DATE,
  created_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  deleted_date TIMESTAMP,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_closed BOOLEAN DEFAULT false
);

-- ========================================
-- 7. SLA Table
-- ========================================
CREATE TABLE IF NOT EXISTS sla (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  resolve_time INTEGER NOT NULL, -- in minutes
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 8. Project-SLA Junction Table
-- ========================================
CREATE TABLE IF NOT EXISTS project_sla (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE,
  sla_id UUID NOT NULL REFERENCES sla(id) ON DELETE CASCADE,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, sla_id)
);

-- ========================================
-- 9. Status Table
-- ========================================
CREATE TABLE IF NOT EXISTS status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 10. Ticket Table
-- ========================================
CREATE TABLE IF NOT EXISTS ticket (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  status_id UUID REFERENCES status(id) ON DELETE SET NULL,
  sla_id UUID REFERENCES sla(id) ON DELETE SET NULL,
  owner UUID REFERENCES "user"(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  deleted_date TIMESTAMP,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 11. Ticket File Table
-- ========================================
CREATE TABLE IF NOT EXISTS ticket_file (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES ticket(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT,
  file_type VARCHAR(100),
  uploaded_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- Create Indexes for Performance
-- ========================================
CREATE INDEX IF NOT EXISTS idx_user_email ON "user"(email);
CREATE INDEX IF NOT EXISTS idx_user_role_id ON "user"(role_id);
CREATE INDEX IF NOT EXISTS idx_project_customer_id ON project(customer_id);
CREATE INDEX IF NOT EXISTS idx_ticket_project_id ON ticket(project_id);
CREATE INDEX IF NOT EXISTS idx_ticket_status_id ON ticket(status_id);
CREATE INDEX IF NOT EXISTS idx_ticket_owner ON ticket(owner);
CREATE INDEX IF NOT EXISTS idx_ticket_file_ticket_id ON ticket_file(ticket_id);
CREATE INDEX IF NOT EXISTS idx_role_permission_role_id ON role_permission(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permission_permission_id ON role_permission(permission_id);
CREATE INDEX IF NOT EXISTS idx_project_sla_project_id ON project_sla(project_id);

-- ========================================
-- Insert Default Data
-- ========================================

-- Default Roles
INSERT INTO role (name, description) VALUES
  ('Admin', 'ผู้ดูแลระบบมีสิทธิ์เต็ม')
ON CONFLICT (name) DO NOTHING;

-- Default Permissions
INSERT INTO permission (name, description) VALUES
  ('user-read', 'ดูข้อมูลผู้ใช้'),
  ('user-create', 'สร้างผู้ใช้ใหม่'),
  ('user-update', 'แก้ไขข้อมูลผู้ใช้'),
  ('user-delete', 'ลบผู้ใช้'),
  ('project-read', 'ดูข้อมูลโครงการ'),
  ('project-create', 'สร้างโครงการใหม่'),
  ('project-update', 'แก้ไขข้อมูลโครงการ'),
  ('project-delete', 'ลบโครงการ'),
  ('ticket-read', 'ดูข้อมูล Ticket'),
  ('ticket-create', 'สร้าง Ticket ใหม่'),
  ('ticket-update', 'แก้ไข Ticket'),
  ('ticket-delete', 'ลบ Ticket'),
  ('settings', 'ดูการตั้งค่า')
ON CONFLICT (name) DO NOTHING;

-- Assign all permissions to Admin role
INSERT INTO role_permission (role_id, permission_id, is_active)
SELECT r.id, p.id, true
FROM role r
CROSS JOIN permission p
WHERE r.name = 'Admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Default Admin User (password: admin123)
-- Hash generated using bcrypt with salt rounds 10
INSERT INTO "user" (role_id, email, password, title_name, first_name, last_name, phone, is_active)
SELECT 
  r.id,
  'admin@example.com',
  '$2a$10$X8JqEKv0rLYJHl1h2XQKEO7GZl0w5zV4hY.KZcGvUdJvJ4YEYfWPa', -- admin123
  'นาย',
  'Admin',
  'System',
  '0812345678',
  true
FROM role r
WHERE r.name = 'Admin'
ON CONFLICT (email) DO NOTHING;

-- Default Statuses
INSERT INTO status (name) VALUES
  ('Open'),
  ('In Progress'),
  ('Pending'),
  ('Resolved'),
  ('Closed'),
  ('Cancelled')
ON CONFLICT (name) DO NOTHING;

-- Default SLAs (in minutes)
INSERT INTO sla (name, resolve_time) VALUES
  ('Critical', 60),      -- 1 hour
  ('High', 240),         -- 4 hours
  ('Medium', 480),       -- 8 hours
  ('Low', 1440),         -- 24 hours
  ('Very Low', 4320)     -- 3 days
ON CONFLICT DO NOTHING;

-- Default Customer
INSERT INTO customer (name, code) VALUES
  ('ออมสิน', 'GSB')
ON CONFLICT (code) DO NOTHING;

-- ========================================
-- Success Message
-- ========================================
DO $$
BEGIN
  RAISE NOTICE '✅ Database schema created successfully!';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Default Admin Credentials:';
  RAISE NOTICE '   Email: admin@example.com';
  RAISE NOTICE '   Password: admin123';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  Please change the password after first login!';
END $$;

