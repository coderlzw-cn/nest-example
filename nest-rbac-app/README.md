RBAC1（Role-Based Access Control Level
1）是基于角色的访问控制模型的一个层次，它在RBAC0的基础上增加了角色层次结构的支持。这意味着一个角色可以继承另一个角色的所有权限，从而形成一种角色间的层级关系。通过这种方式，RBAC1允许更灵活和动态地管理权限分配，简化了角色与权限的管理过程。

# 核心概念

- 用户 (User)：系统的使用者。
- 角色 (Role)：一组权限的集合。
- 权限 (Permission)：对系统资源的具体操作（如读、写、删除等）。
- 用户-角色分配 (User-Role Assignment, URA)：将用户与角色关联起来。
- 角色-权限分配 (Role-Permission Assignment, RPA)：将角色与权限关联起来。
- 角色层次结构 (Role Hierarchy)：允许角色之间存在继承关系，即子角色可以继承父角色的所有权限。

# 角色层次结构
在RBAC1中，角色层次结构是一个重要的特性。它使得一个角色可以作为另一个角色的上级或下级。这种层次结构可以是直接的也可以是间接的，例如：

- 直接继承：如果角色A是角色B的父角色，则角色B可以直接继承角色A的所有权限。
- 间接继承：如果角色A是角色B的父角色，角色B是角色C的父角色，则角色C可以通过角色B间接继承角色A的所有权限。
  
这种机制极大地提高了权限分配的灵活性和可维护性，尤其是在大型组织或应用中。


# 实现示例
假设在一个内容管理系统(CMS)中，有如下角色及其权限需求：

- 超级管理员 (Super Admin)：拥有所有权限。
- 管理员 (Admin)：可以管理用户和内容。
- 编辑 (Editor)：只能编辑内容。
- 读者 (Reader)：只能阅读内容。

其中，Admin角色可以被设计为从Super Admin继承，而Editor可以从Admin继承某些权限，但不包括用户管理权限。

```sql
-- 用户表
CREATE TABLE users
(
    id       INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email    VARCHAR(255) NOT NULL UNIQUE
);

-- 角色表
CREATE TABLE roles
(
    id        INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- 权限表
CREATE TABLE permissions
(
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- 用户角色关联表
CREATE TABLE user_roles
(
    user_id INT,
    role_id INT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
);

-- 角色权限关联表
CREATE TABLE role_permissions
(
    role_id       INT,
    permission_id INT,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE
);

-- 角色层次结构表
CREATE TABLE role_hierarchy
(
    parent_role_id INT,
    child_role_id  INT,
    PRIMARY KEY (parent_role_id, child_role_id),
    FOREIGN KEY (parent_role_id) REFERENCES roles (id) ON DELETE CASCADE,
    FOREIGN KEY (child_role_id) REFERENCES roles (id) ON DELETE CASCADE
);
```


**优点**
- 增强的灵活性：通过角色继承，可以轻松实现复杂的权限分配策略，减少重复配置工作。
- 易于管理和扩展：新角色可以通过继承现有角色快速创建，并根据需要添加或移除特定权限。
- 降低维护成本：当权限需求发生变化时，只需调整少数几个顶层角色的权限设置，即可影响整个角色层次结构下的所有相关角色。
**缺点**
- 复杂性增加：随着角色层次结构的增长，理解和管理这些关系可能会变得复杂。
- 性能问题：在处理大量数据时，查询角色及其所有继承权限可能会影响系统性能。
- 潜在的安全风险：如果不小心配置了过于宽松的继承关系，可能会导致不必要的权限扩散，增加安全漏洞的风险。

RBAC1模型提供了一个强大的框架来管理复杂的权限分配场景，特别是在具有多层组织结构的企业环境中。然而，正确设计和维护角色层次结构至关重要，以确保系统的安全性和效率。