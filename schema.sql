-- Ticketing System Database Schema
-- PostgreSQL Database

-- Create UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if exists (for clean setup)
DROP TABLE IF EXISTS ticket_file CASCADE;
DROP TABLE IF EXISTS ticket CASCADE;
DROP TABLE IF EXISTS project_sla CASCADE;
DROP TABLE IF EXISTS project CASCADE;
DROP TABLE IF EXISTS customer CASCADE;
DROP TABLE IF EXISTS sla CASCADE;
DROP TABLE IF EXISTS status CASCADE;
DROP TABLE IF EXISTS role_permission CASCADE;
DROP TABLE IF EXISTS permission CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS role CASCADE;

-- Create Role table
CREATE TABLE role (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Permission table
CREATE TABLE permission (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Role-Permission junction table
CREATE TABLE role_permission (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID NOT NULL REFERENCES role(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permission(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(role_id, permission_id)
);

-- Create User table
CREATE TABLE "user" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID REFERENCES role(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  title_name VARCHAR(50),
  first_name VARCHAR(100) NOT NULL DEFAULT 'ไม่ระบุ',
  last_name VARCHAR(100) NOT NULL DEFAULT 'ไม่ระบุ',
  image_url TEXT,
  phone VARCHAR(20),
  activate BOOLEAN DEFAULT true,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Customer table
CREATE TABLE customer (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Project table
CREATE TABLE project (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  description TEXT,
  customer_id UUID NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
  start_date DATE,
  end_date DATE,
  created_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_date TIMESTAMP
);

-- Create Status table
CREATE TABLE status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create SLA table
CREATE TABLE sla (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  resolve_time INTEGER NOT NULL, -- in hours
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Project-SLA junction table
CREATE TABLE project_sla (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE,
  sla_id UUID NOT NULL REFERENCES sla(id) ON DELETE CASCADE,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, sla_id)
);

-- Create Ticket table
CREATE TABLE ticket (
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
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_date TIMESTAMP
);

-- Create Ticket File table
CREATE TABLE ticket_file (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES ticket(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  file_type VARCHAR(100),
  uploaded_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_user_email ON "user"(email);
CREATE INDEX idx_user_role_id ON "user"(role_id);
CREATE INDEX idx_project_customer_id ON project(customer_id);
CREATE INDEX idx_ticket_project_id ON ticket(project_id);
CREATE INDEX idx_ticket_status_id ON ticket(status_id);
CREATE INDEX idx_ticket_owner ON ticket(owner);
CREATE INDEX idx_ticket_created_date ON ticket(created_date);
CREATE INDEX idx_ticket_file_ticket_id ON ticket_file(ticket_id);
CREATE INDEX idx_role_permission_role_id ON role_permission(role_id);
CREATE INDEX idx_role_permission_permission_id ON role_permission(permission_id);

-- Insert default roles
INSERT INTO role (name, description) VALUES
  ('Admin', 'Administrator with full access'),
  ('Manager', 'Manager with project management access'),
  ('Support', 'Support staff with ticket access'),
  ('User', 'Regular user with limited access');

-- Insert default permissions
INSERT INTO permission (name, description) VALUES
  ('user.create', 'Create new users'),
  ('user.read', 'View user information'),
  ('user.update', 'Update user information'),
  ('user.delete', 'Delete users'),
  ('project.create', 'Create new projects'),
  ('project.read', 'View project information'),
  ('project.update', 'Update project information'),
  ('project.delete', 'Delete projects'),
  ('ticket.create', 'Create new tickets'),
  ('ticket.read', 'View ticket information'),
  ('ticket.update', 'Update ticket information'),
  ('ticket.delete', 'Delete tickets'),
  ('settings.manage', 'Manage system settings');

-- Assign all permissions to Admin role
INSERT INTO role_permission (role_id, permission_id, is_active)
SELECT r.id, p.id, true
FROM role r, permission p
WHERE r.name = 'Admin';

-- Insert default statuses
INSERT INTO status (name) VALUES
  ('New'),
  ('In Progress'),
  ('Pending'),
  ('Resolved'),
  ('Closed');

-- Insert default SLAs
INSERT INTO sla (name, resolve_time) VALUES
  ('Critical', 4),
  ('High', 8),
  ('Medium', 24),
  ('Low', 72);

-- Insert default admin user (password: admin123)
-- Note: Change this password immediately after deployment!
INSERT INTO "user" (role_id, email, password, first_name, last_name, title_name)
SELECT 
  r.id,
  'admin@example.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash of 'admin123'
  'Admin',
  'User',
  'Mr.'
FROM role r
WHERE r.name = 'Admin';

-- Insert sample customer
INSERT INTO customer (name, code) VALUES
  ('Sample Company', 'SAMPLE');

COMMIT;

