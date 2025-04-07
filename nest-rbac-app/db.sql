DROP DATABASE IF EXISTS nestjs_rbac;
CREATE DATABASE IF NOT EXISTS nestjs_rbac DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci;
USE nestjs_rbac;

INSERT INTO permissions (name, description, identifier, status) VALUES
                                                                    ('查看运营报告', '允许查看运营报告', 'perm:view_reports', 'active'),
                                                                    ('管理用户', '允许管理用户', 'perm:manage_user', 'active'),
                                                                    ('批准预算', '允许批准预算', 'perm:approve_budgets', 'active'),
                                                                    ('创建新产品', '允许创建新产品', 'perm:create_product', 'active'),
                                                                    ('更新产品信息', '允许更新产品信息', 'perm:update_product', 'active'),
                                                                    ('删除产品', '允许删除产品', 'perm:delete_product', 'active'),
                                                                    ('分配任务', '允许分配任务', 'perm:assign_tasks', 'active'),
                                                                    ('跟踪项目进度', '允许跟踪项目进度', 'perm:track_progress', 'active'),
                                                                    ('提交项目报告', '允许提交项目报告', 'perm:submit_reports', 'active'),
                                                                    ('查看财务报表', '允许查看财务报表', 'perm:view_financials', 'active'),
                                                                    ('处理发票', '允许处理发票', 'perm:process_invoices', 'active'),
                                                                    ('管理费用', '允许管理费用', 'perm:manage_expenses', 'active');

INSERT INTO roles (name, remark, description) VALUES
                                                  ('运营经理', '负责运营管理工作', '运营管理角色，具有查看报告、管理用户、批准预算等权限'),
                                                  ('产品经理', '负责产品管理工作', '产品管理角色，具有创建、更新、删除产品等权限'),
                                                  ('项目经理', '负责项目管理工作', '项目管理角色，具有分配任务、跟踪进度、提交报告等权限'),
                                                  ('财务经理', '负责财务管理', '财务管理角色，具有查看财务报表、处理发票、管理费用等权限');


INSERT INTO user (username, password, email) VALUES
                                                  ('yunyingjingli', 'hashed_password_1', 'yunying@example.com'),
                                                  ('chanpinjingli', 'hashed_password_2', 'chanpin@example.com'),
                                                  ('xiangmujiangli', 'hashed_password_3', 'xiangmu@example.com'),
                                                  ('caiwujingli', 'hashed_password_4', 'caiwu@example.com');

-- 运营经理
INSERT INTO role_permissions (role_id, permission_id) VALUES
                                                          ((SELECT id FROM roles WHERE name = '运营经理'), (SELECT id FROM permissions WHERE identifier = 'perm:view_reports')),
                                                          ((SELECT id FROM roles WHERE name = '运营经理'), (SELECT id FROM permissions WHERE identifier = 'perm:manage_user')),
                                                          ((SELECT id FROM roles WHERE name = '运营经理'), (SELECT id FROM permissions WHERE identifier = 'perm:approve_budgets'));

-- 产品经理
INSERT INTO role_permissions (role_id, permission_id) VALUES
                                                          ((SELECT id FROM roles WHERE name = '产品经理'), (SELECT id FROM permissions WHERE identifier = 'perm:create_product')),
                                                          ((SELECT id FROM roles WHERE name = '产品经理'), (SELECT id FROM permissions WHERE identifier = 'perm:update_product')),
                                                          ((SELECT id FROM roles WHERE name = '产品经理'), (SELECT id FROM permissions WHERE identifier = 'perm:delete_product'));

-- 项目经理
INSERT INTO role_permissions (role_id, permission_id) VALUES
                                                          ((SELECT id FROM roles WHERE name = '项目经理'), (SELECT id FROM permissions WHERE identifier = 'perm:assign_tasks')),
                                                          ((SELECT id FROM roles WHERE name = '项目经理'), (SELECT id FROM permissions WHERE identifier = 'perm:track_progress')),
                                                          ((SELECT id FROM roles WHERE name = '项目经理'), (SELECT id FROM permissions WHERE identifier = 'perm:submit_reports'));

-- 财务经理
INSERT INTO role_permissions (role_id, permission_id) VALUES
                                                          ((SELECT id FROM roles WHERE name = '财务经理'), (SELECT id FROM permissions WHERE identifier = 'perm:view_financials')),
                                                          ((SELECT id FROM roles WHERE name = '财务经理'), (SELECT id FROM permissions WHERE identifier = 'perm:process_invoices')),
                                                          ((SELECT id FROM roles WHERE name = '财务经理'), (SELECT id FROM permissions WHERE identifier = 'perm:manage_expenses'));

-- 用户与角色关系
INSERT INTO user_roles (user_id, role_id) VALUES
                                              ((SELECT id FROM user WHERE username = 'yunyingjingli'), (SELECT id FROM roles WHERE name = '运营经理')),
                                              ((SELECT id FROM user WHERE username = 'chanpinjingli'), (SELECT id FROM roles WHERE name = '产品经理')),
                                              ((SELECT id FROM user WHERE username = 'xiangmujiangli'), (SELECT id FROM roles WHERE name = '项目经理')),
                                              ((SELECT id FROM user WHERE username = 'caiwujingli'), (SELECT id FROM roles WHERE name = '财务经理'));

# --------------------
-- 运营部职工权限
INSERT INTO permissions (name, description, identifier, status) VALUES
                                                                    ('查看基本报告', '允许查看基本运营报告', 'perm:view_basic_reports', 'active'),
                                                                    ('提交请求', '允许提交工作请求', 'perm:submit_requests', 'active');

-- 产品部职工权限
INSERT INTO permissions (name, description, identifier, status) VALUES
                                                                    ('查看产品详情', '允许查看产品详细信息', 'perm:view_product_details', 'active'),
                                                                    ('建议更新', '允许提出产品更新建议', 'perm:suggest_updates', 'active');

-- 项目部职工权限
INSERT INTO permissions (name, description, identifier, status) VALUES
                                                                    ('查看任务状态', '允许查看任务状态', 'perm:view_task_status', 'active'),
                                                                    ('更新进度', '允许更新个人任务进度', 'perm:update_progress', 'active');

-- 财务部职工权限
INSERT INTO permissions (name, description, identifier, status) VALUES
                                                                    ('查看费用报告', '允许查看费用报告', 'perm:view_expense_reports', 'active'),
                                                                    ('提交发票', '允许提交发票申请', 'perm:submit_invoices', 'active');

-- 运营部职工权限
INSERT INTO permissions (name, description, identifier, status) VALUES
                                                                    ('查看基本报告', '允许查看基本运营报告', 'perm:view_basic_reports', 'active'),
                                                                    ('提交请求', '允许提交工作请求', 'perm:submit_requests', 'active');

-- 产品部职工权限
# INSERT INTO permissions (name, description, identifier, status) VALUES
#                                                                     ('查看产品详情', '允许查看产品详细信息', 'perm:view_product_details', 'active'),
#                                                                     ('建议更新', '允许提出产品更新建议', 'perm:suggest_updates', 'active');

-- 项目部职工权限
# INSERT INTO permissions (name, description, identifier, status) VALUES
#                                                                     ('查看任务状态', '允许查看任务状态', 'perm:view_task_status', 'active'),
#                                                                     ('更新进度', '允许更新个人任务进度', 'perm:update_progress', 'active');

-- 财务部职工权限
# INSERT INTO permissions (name, description, identifier, status) VALUES
#                                                                     ('查看费用报告', '允许查看费用报告', 'perm:view_expense_reports', 'active'),
#                                                                     ('提交发票', '允许提交发票申请', 'perm:submit_invoices', 'active');

# -- 运营部职工角色
# INSERT INTO roles (name, remark, description) VALUES
#     ('运营部职工', '负责日常运营工作的普通员工', '运营部职工角色，具有查看基本报告、提交请求等权限');

-- 产品部职工角色
# INSERT INTO roles (name, remark, description) VALUES
#     ('产品部职工', '负责产品相关工作的普通员工', '产品部职工角色，具有查看产品详情、建议更新等权限');

-- 项目部职工角色
# INSERT INTO roles (name, remark, description) VALUES
#     ('项目部职工', '负责项目执行的普通员工', '项目部职工角色，具有查看任务状态、更新进度等权限');

-- 财务部职工角色
# INSERT INTO roles (name, remark, description) VALUES
#     ('财务部职工', '负责财务管理工作的普通员工', '财务部职工角色，具有查看费用报告、提交发票等权限');

-- 运营部职工
INSERT INTO user (username, password, email) VALUES
                                                  ('yunyingzhigong1', 'hashed_password_5', 'yunyingzhigong1@example.com'),
                                                  ('yunyingzhigong2', 'hashed_password_6', 'yunyingzhigong2@example.com');

-- 产品部职工
INSERT INTO user (username, password, email) VALUES
                                                  ('chanpinzhigong1', 'hashed_password_7', 'chanpinzhigong1@example.com'),
                                                  ('chanpinzhigong2', 'hashed_password_8', 'chanpinzhigong2@example.com');

-- 项目部职工
INSERT INTO user (username, password, email) VALUES
                                                  ('xiangmuzhigong1', 'hashed_password_9', 'xiangmuzhigong1@example.com'),
                                                  ('xiangmuzhigong2', 'hashed_password_10', 'xiangmuzhigong2@example.com');

-- 财务部职工
INSERT INTO user (username, password, email) VALUES
                                                  ('caiwuzhigong1', 'hashed_password_11', 'caiwuzhigong1@example.com'),
                                                  ('caiwuzhigong2', 'hashed_password_12', 'caiwuzhigong2@example.com');

-- 运营部职工
INSERT INTO role_permissions (role_id, permission_id) VALUES
                                                          ((SELECT id FROM roles WHERE name = '运营部职工'), (SELECT id FROM permissions WHERE identifier = 'perm:view_basic_reports')),
                                                          ((SELECT id FROM roles WHERE name = '运营部职工'), (SELECT id FROM permissions WHERE identifier = 'perm:submit_requests'));

-- 产品部职工
INSERT INTO role_permissions (role_id, permission_id) VALUES
                                                          ((SELECT id FROM roles WHERE name = '产品部职工'), (SELECT id FROM permissions WHERE identifier = 'perm:view_product_details')),
                                                          ((SELECT id FROM roles WHERE name = '产品部职工'), (SELECT id FROM permissions WHERE identifier = 'perm:suggest_updates'));

-- 项目部职工
INSERT INTO role_permissions (role_id, permission_id) VALUES
                                                          ((SELECT id FROM roles WHERE name = '项目部职工'), (SELECT id FROM permissions WHERE identifier = 'perm:view_task_status')),
                                                          ((SELECT id FROM roles WHERE name = '项目部职工'), (SELECT id FROM permissions WHERE identifier = 'perm:update_progress'));

-- 财务部职工
INSERT INTO role_permissions (role_id, permission_id) VALUES
                                                          ((SELECT id FROM roles WHERE name = '财务部职工'), (SELECT id FROM permissions WHERE identifier = 'perm:view_expense_reports')),
                                                          ((SELECT id FROM roles WHERE name = '财务部职工'), (SELECT id FROM permissions WHERE identifier = 'perm:submit_invoices'));

-- 运营部职工
INSERT INTO user_roles (user_id, role_id) VALUES
                                              ((SELECT id FROM user WHERE username = 'yunyingzhigong1'), (SELECT id FROM roles WHERE name = '运营部职工')),
                                              ((SELECT id FROM user WHERE username = 'yunyingzhigong2'), (SELECT id FROM roles WHERE name = '运营部职工'));

-- 产品部职工
INSERT INTO user_roles (user_id, role_id) VALUES
                                              ((SELECT id FROM user WHERE username = 'chanpinzhigong1'), (SELECT id FROM roles WHERE name = '产品部职工')),
                                              ((SELECT id FROM user WHERE username = 'chanpinzhigong2'), (SELECT id FROM roles WHERE name = '产品部职工'));

-- 项目部职工
INSERT INTO user_roles (user_id, role_id) VALUES
                                              ((SELECT id FROM user WHERE username = 'xiangmuzhigong1'), (SELECT id FROM roles WHERE name = '项目部职工')),
                                              ((SELECT id FROM user WHERE username = 'xiangmuzhigong2'), (SELECT id FROM roles WHERE name = '项目部职工'));

-- 财务部职工
INSERT INTO user_roles (user_id, role_id) VALUES
                                              ((SELECT id FROM user WHERE username = 'caiwuzhigong1'), (SELECT id FROM roles WHERE name = '财务部职工')),
                                              ((SELECT id FROM user WHERE username = 'caiwuzhigong2'), (SELECT id FROM roles WHERE name = '财务部职工'));