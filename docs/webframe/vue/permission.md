# 菜单的动态权限控制

### 前言

vue实现动态路由的方式大体分为两种：

1、路由表写死在项目中，登录时根据返回的用户角色权限匹配展示路由

2、后端传回当前用户对应权限的路由表，前端通过调用`addRoutes`添加到路由表

### 服务端实现

项目创建忽略，大家可以自行百度，使用的是阿里的Egg.js框架

首先我们需要创建数据库，总共需要四个表，分别是sys_admin（管理员表）、sys_menu（菜单表）、sys_role（角色表）sys_roles_menus（角色菜单关联表）

```sql
-- 管理员表
CREATE TABLE `sys_admin`  (
  `admin_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '管理员ID',
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '用户名',
  `avatar_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '头像',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '密码',
  `role_id` int(2) NOT NULL DEFAULT 0 COMMENT '角色',
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '状态',
  `create_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '创建人',
  `update_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '更新人',
  `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `update_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`admin_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '系统管理员' ROW_FORMAT = Dynamic;
-- 菜单表
CREATE TABLE `sys_menu`  (
  `menu_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
  `pid` int(11) NOT NULL DEFAULT 0 COMMENT '上一级菜单ID',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '菜单标题',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '组件名称',
  `component` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '组件',
  `menu_sort` int(2) NOT NULL DEFAULT 0 COMMENT '排序',
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '图标',
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '路径',
  `redirect` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '重定向',
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '状态',
  `create_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '创建人',
  `update_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '更新人',
  `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `update_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`menu_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '系统菜单' ROW_FORMAT = Dynamic;
-- 角色表
CREATE TABLE `sys_role`  (
  `role_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '角色名',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '描述',
  `create_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '创建人',
  `update_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '更新人',
  `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `update_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`role_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '角色表' ROW_FORMAT = Dynamic;
-- 角色菜单关联表
CREATE TABLE `sys_roles_menus`  (
  `menu_id` int(11) NOT NULL COMMENT '菜单ID',
  `role_id` int(11) NOT NULL COMMENT '角色ID'
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '角色菜单关联' ROW_FORMAT = Dynamic;
```

实现登录后的用户菜单路由表获取

```js
// app/service/loginService.js
// 生成菜单
async generateMenu(adminId) {
  let routers = await this.app.mysql.query('SELECT * FROM sys_menu WHERE menu_id IN (SELECT sys_roles_menus.menu_id FROM sys_admin, sys_roles_menus WHERE sys_admin.role_id = sys_roles_menus.role_id AND sys_admin.admin_id = ?) OR pid = 0', [ adminId ]);
  if (routers.length === 0) return [];

  routers = routers.map(router => {
    return {
      menu_id: router.menu_id,
      pid: router.pid,
      path: router.path,
      component: router.component,
      name: router.name,
      menu_sort: router.menu_sort,
      meta: {
        title: router.title,
        icon: router.icon,
      },
    };
  });
  let routersByOne = routers.filter(router => router.pid === 0).sort((a, b) => a.menu_sort - b.menu_sort);
  const routersByTwo = routers.filter(router => router.pid !== 0);
  const tempObj = {};
  routersByTwo.forEach(router => {
    if (!tempObj[router.pid] || tempObj[router.pid].length <= 0) {
      tempObj[router.pid] = [ router ];
    } else {
      tempObj[router.pid].push(router);
    }
  });
  routersByOne = routersByOne.map(router => {
    router.children = tempObj[router.menu_id] ? tempObj[router.menu_id].sort((a, b) => a.menu_sort - b.menu_sort) : [];
    return router;
  });
  return routersByOne.filter(item => item.children.length > 0);
}
```

实现管理员的增删改查

```js
// app/routers/system.js
// 获取管理员账号
router.get(`${config.contextPath}/system/admin/list`, checkTokenHandler, controller.system.adminList);
// 编辑/新增管理员账号
router.post(`${config.contextPath}/system/admin/edit`, checkTokenHandler, controller.system.editAdmin);
// 删除管理员
router.post(`${config.contextPath}/system/admin/delete`, checkTokenHandler, controller.system.deleteAdmin);
// 重置管理员密码
router.post(`${config.contextPath}/system/admin/pwd/reset`, checkTokenHandler, controller.system.resetAdminPwd);

// app/controller/system.js
/**
 * 获取管理员账号
 */
async adminList() {
  const { ctx } = this;
  const list = await ctx.service.systemService.adminList();
  ctx.body = setResult({ data: { list } });
}
/**
 * 编辑/新增管理员账号
 */
async editAdmin() {
  const { ctx } = this;
  const { username } = ctx.request.headers;
  const pwd = await ctx.service.systemService.editAdmin(username, ctx.request.body);
  ctx.body = setResult({ data: { pwd } });
}
/**
 * 删除管理员
 */
async deleteAdmin() {
  const { ctx } = this;
  await ctx.service.systemService.deleteAdmin(ctx.request.body);
  ctx.body = setResult();
}

// app/service/systemService.js
// 获取管理员账号
async adminList() {
  return await this.app.mysql.query(`SELECT admin.admin_id adminId, admin.username username, admin.avatar_url avatarUrl, admin.status status, admin.role_id roleId,
    IFNULL(role.name, '') roleName, admin.create_by createBy, admin.create_time createTime, admin.update_by updateBy, admin.update_time updateTime FROM sys_admin admin
    LEFT JOIN sys_role role ON admin.role_id = role.role_id ORDER BY admin.create_time DESC;`);
}
// 编辑/新增管理员账号
async editAdmin(userName, { adminId, username, avatarUrl, roleId }) {
  if (!adminId) {
    // 新增
    const pwd = generateAdminPwd(8);
    await this.app.mysql.insert('sys_admin', {
      username,
      avatar_url: avatarUrl,
      role_id: roleId,
      password: getMd5(pwd),
      create_time: new Date(),
      create_by: userName,
      update_time: new Date(),
      update_by: userName,
    })
    return pwd;
  }
  // 修改
  await this.app.mysql.update('sys_admin', {
    update_time: new Date(),
    update_by: userName,
    username,
    avatar_url: avatarUrl,
    role_id: roleId,
  }, { where: { admin_id: adminId } });
}
// 删除管理员
async deleteAdmin({ adminId }) {
  if (adminId === 1) throw new GlobalError(RESULT_FAIL, '超级管理员禁止删除！！！');
  await this.app.mysql.delete('sys_admin', { admin_id: adminId });
}
// 重置管理员密码
async resetAdminPwd(username, { adminId }) {
  const pwd = generateAdminPwd(8);
  await this.app.mysql.update('sys_admin', { password: getMd5(pwd), update_by: username, update_time: new Date() }, { where: { admin_id: adminId } });
  return pwd;
}
```

实现菜单的增删改查

```js
// app/routers/system.js
// 获取菜单列表
router.get(`${config.contextPath}/system/menu/list`, checkTokenHandler, controller.system.menuList);
// 编辑菜单
router.post(`${config.contextPath}/system/menu/edit`, checkTokenHandler, controller.system.editMenu);
// 删除菜单
router.post(`${config.contextPath}/system/menu/delete`, checkTokenHandler, controller.system.deleteMenu);

// app/controller/system.js
/**
 * 获取菜单列表
 */
async menuList() {
  const { ctx } = this;
  const list = await ctx.service.systemService.menuList();
  ctx.body = setResult({ data: { list } });
}
/**
 * 编辑菜单
 */
async editMenu() {
  const { ctx } = this;
  const { username } = ctx.request.headers;
  await ctx.service.systemService.editMenu(username, ctx.request.body);
  ctx.body = setResult();
}
/**
 * 删除菜单
 */
async deleteMenu() {
  const { ctx } = this;
  const { username } = ctx.request.headers;
  await ctx.service.systemService.deleteMenu(username, ctx.request.body);
  ctx.body = setResult();
}

// app/service/systemService.js
// 获取菜单列表
async menuList() {
  const routers = await this.app.mysql.select('sys_menu', { where: { status: 0 } });
  // 过滤出一级菜单并排序
  let routersByOne = routers.filter(router => router.pid === 0).sort((a, b) => a.menu_sort - b.menu_sort);
  // 过滤出非一级菜单
  const routersByTwo = routers.filter(router => router.pid !== 0);
  const tempObj = {};
  routersByTwo.forEach(router => {
    if (!tempObj[router.pid] || tempObj[router.pid].length <= 0) {
      tempObj[router.pid] = [ router ];
    } else {
      tempObj[router.pid].push(router);
    }
  });
  routersByOne = routersByOne.map(router => {
    // 将子菜单排序
    router.children = tempObj[router.menu_id] ? tempObj[router.menu_id].sort((a, b) => a.menu_sort - b.menu_sort) : [];
    return router;
  });
  return routersByOne;
}
// 编辑菜单
async editMenu(username, { menu_id, title, name, component, icon, path, redirect, pid, menu_sort }) {
  if (menu_id) {
    // 修改
    await this.app.mysql.update('sys_menu', { title, name, component, icon, path, redirect, pid, menu_sort, update_by: username, update_time: new Date() },
      { where: { menu_id } });
  } else {
    // 创建
    await this.app.mysql.insert('sys_menu', { title, name, component, icon, path, redirect: redirect || '', pid, menu_sort, update_by: username,
      update_time: new Date(), create_by: username, create_time: new Date() });
  }
}
// 删除菜单
async deleteMenu(username, { menu_id }) {
  this.app.mysql.update('sys_menu', { status: -1, update_by: username, update_time: new Date() }, { where: { menu_id } });
}

```

实现角色的增删改查

```js
// app/routers/system.js
// 获取角色列表
router.get(`${config.contextPath}/system/role/list`, checkTokenHandler, controller.system.roleList);
// 编辑角色
router.post(`${config.contextPath}/system/role/edit`, checkTokenHandler, controller.system.editRole);
// 编辑角色菜单
router.post(`${config.contextPath}/system/role/menu/edit`, checkTokenHandler, controller.system.editRoleMenu);

// app/controller/system.js
/**
 * 获取角色列表
 */
async roleList() {
  const { ctx } = this;
  const list = await ctx.service.systemService.roleList();
  ctx.body = setResult({ data: { list } });
}
/**
 * 编辑角色
 */
async editRole() {
  const { ctx } = this;
  const { username } = ctx.request.headers;
  await ctx.service.systemService.editRole(username, ctx.request.body);
  ctx.body = setResult();
}
/**
 * 编辑角色菜单
 */
async editRoleMenu() {
  const { ctx } = this;
  await ctx.service.systemService.editRoleMenu(ctx.request.body);
  ctx.body = setResult();
}

// app/service/systemService.js
// 获取角色列表
async roleList() {
  const list = await this.app.mysql.query('SELECT sys_role.*, IFNULL(GROUP_CONCAT(sys_roles_menus.menu_id), \'\') menus FROM sys_role LEFT JOIN sys_roles_menus ON (sys_roles_menus.role_id = sys_role.role_id) GROUP BY sys_role.role_id');
  return list.map(item => {
    item.menus = item.menus.split(',').map(Number);
    return item;
  });
}
// 编辑角色
async editRole(username, { role_id, name, description }) {
  if (role_id) {
    // 修改
    await this.app.mysql.update('sys_role', { name, description, update_by: username, update_time: new Date() }, { where: { role_id } });
  } else {
    await this.app.mysql.insert('sys_role', { name, description, update_by: username, update_time: new Date(), create_by: username, create_time: new Date() });
  }
}
// 编辑角色菜单
async editRoleMenu({ role_id, menuIds }) {
  // 删除当前所有绑定关系
  await this.app.mysql.delete('sys_roles_menus', { role_id });
  // 保存更新后的绑定关系
  const insertArr = menuIds.map(id => {
    return { menu_id: id, role_id };
  });
  await this.app.mysql.insert('sys_roles_menus', insertArr);
}
```

2、编写相关接口

### 前端实现

*注：前端项目是基于花裤衩[vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)改造*

首先，修改路由相关文件，使其可以读取后端返回动态路由表并添加到当前路由表

```js
// src/permission.js
...
// 获取后端返回动态路由表数据
const { asyncRoutes } = await store.dispatch('user/getInfo')
// 生成动态路由表
const accessRoutes = await store.dispatch('permission/generateRoutes', asyncRoutes)
// 将动态路由表添加到当前路由表中
router.addRoutes(accessRoutes)

// 中断当前导航，执行新的导航。重要！！！
next({ ...to, replace: true })
...

// src\store\modules\permission.js
import { constantRoutes } from '@/router'

import Layout from '@/layout'

/**
 * 递归过滤异步路由表
 * @param routes asyncRoutes
 */
export function filterAsyncRoutes(routers) {
  const res = []

  routers.forEach(route => {
    const temp = { ...route }
    if (temp.component) {
      // 判断是不是一级菜单
      if (temp.component === 'layout') {
        temp.component = Layout
        temp.path = `/${temp.path}`
      } else {
        // 非一级菜单修改组件引入
        temp.component = loadView(temp.component)
      }
    }
	// 判断是否有子菜单
    if (temp.children) {
      temp.children = filterAsyncRoutes(temp.children)
    }
    res.push(temp)
  })
  // 添加404页面
  res.push({ path: '*', redirect: '/404', hidden: true })
  return res
}

const loadView = (view) => {
  return resolve => require([`@/views/${view}`], resolve)
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, asyncRoutes) {
    return new Promise(resolve => {
      // 递归过滤异步路由表，生成最终的路由表
      const accessedRoutes = filterAsyncRoutes(asyncRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
```

修改菜单的渲染数据源

```js
// src\store\getters.js
...
permission_routes: state => state.permission.routes
...

// src\layout\components\Sidebar\index.vue
...
<sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
...

...
...mapGetters([
  'sidebar',
  'permission_routes'
]),
...
```

实现管理员的增删改查

```vue
// src\views\system\admin.vue
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="handleEdit(null)">添加</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" prop="adminId" label="ID" />
      <el-table-column align="center" prop="username" label="用户名" />
      <el-table-column align="center" prop="avatarUrl" label="头像">
        <template slot-scope="{row}">
           <el-image style="width: 50px; height: 50px" :src="row.avatarUrl" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="roleName" label="角色" />
      <el-table-column align="center" prop="status" label="状态" />
      <el-table-column align="center" prop="updateBy" label="更新人" />
      <el-table-column align="center" label="更新时间">
        <template slot-scope="{row}">
          {{ row.updateTime | dateTimeFilter('yyyy-MM-dd hh:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createBy" label="创建人" />
      <el-table-column align="center" label="创建时间">
        <template slot-scope="{row}">
          {{ row.createTime | dateTimeFilter('yyyy-MM-dd hh:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="{row}" v-if="row.adminId!==1">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="delAdmin(row)">删除</el-button>
          <el-button type="text" @click="resetPwd(row)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑管理员':'添加管理员'" width="400px">
      <el-form ref="editForm" :model="formData" :rules="rules" label-width="80px" label-position="right">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="头像" prop="avatarUrl">
          <el-input v-model="formData.avatarUrl" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="formData.role_id" placeholder="角色">
            <el-option v-for="item in roleList" :key="item.role_id" :label="item.name" :value="item.role_id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="confirmRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { getAdminList, editAdmin, delAdmin, resetPassword } from '@/api/system'
export default {
  directives: { waves },
  data() {
    return {
      listLoading: false,
      list: [],

      dialogVisible: false,
      dialogType: 'new',
      formData: {
        username: '',
        role: ''
      },
      rules: {
        username: { required: true, message: '请输入用户名', trigger: 'blur' }
      },

      roleList: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { code, data } = await getAdminList();
      this.listLoading = false
      if (code === 0) {
        this.list = data.list
      }
    },
    handleEdit(row) {
      if (row) {
        this.dialogType = 'edit'
        this.formData = JSON.parse(JSON.stringify(row))
      } else {
        this.dialogType = 'new'
        this.formData = {}
      }
      this.dialogVisible = true
    },
    async confirmRole() {
      this.$refs.editForm.validate(async valid => {
        if (!valid) return false
        const { code, data } = await editAdmin(this.formData)
        if (code === 0) {
          this.$message({
            message: this.dialogType === 'edit' ? '编辑成功' : '添加成功',
            type: 'success'
          })
          if (this.dialogType === 'new') {
            this.$confirm(`${this.formData.username}的初始登陆密码为${data.pwd}，请妥善保管`, '警告', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
          }
          this.dialogVisible = false
          this.getList()
        }
      })
    },
    async delAdmin(row) {
      this.$confirm('确定删除该账户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { code } = await delAdmin({ username: row.username })
        if (code === 0) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
        this.getList()
      })
    },
    resetPwd(row) {
      this.$confirm('确定要重置该账号的密码吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { code, data } = await resetPassword({ username: row.username })
        if (code === 0) {
          this.$message({
            message: '重置成功',
            type: 'success'
          })
          this.$confirm(`重置后的登陆密码为${data.pwd}，请妥善保管`, '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>
```

实现菜单的增删改查

```vue
// src\views\system\menu.vue
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="handleEdit(null)">添加</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" row-key="menu_id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column align="center" prop="title" label="菜单标题" />
      <el-table-column align="center" prop="icon" label="图标">
        <template slot-scope="{row}">
          <svg-icon :icon-class="row.icon" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="menu_sort" label="排序" />
      <el-table-column align="center" prop="component" label="组建路径" />
      <el-table-column align="center" prop="create_by" label="创建人" />
      <el-table-column align="center" label="创建时间">
        <template slot-scope="{row}">
          {{ row.create_time | dateTimeFilter('yyyy-MM-dd hh:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="update_by" label="更新人" />
      <el-table-column align="center" label="更新时间">
        <template slot-scope="{row}">
          {{ row.update_time | dateTimeFilter('yyyy-MM-dd hh:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="{row}">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑菜单':'添加菜单'" width="450px">
      <el-form ref="editForm" :model="formData" :rules="rules" label-width="80px" label-position="right">
        <el-form-item label="菜单标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入菜单标题" />
        </el-form-item>
        <el-form-item label="组件名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入组件名" />
        </el-form-item>
        <el-form-item label="组件" prop="component">
          <el-input v-model="formData.component" placeholder="请输入组件" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-select v-model="formData.icon" placeholder="请选择图标">
            <el-option v-for="item in icons" :key="item" :label="item" :value="item">
              <svg-icon :icon-class="item" />
              <span style="padding-left: 5px;">{{ item }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="formData.path" placeholder="请输入路径" />
        </el-form-item>
        <el-form-item label="上级菜单" prop="pid">
          <el-select v-model="formData.pid" placeholder="请选择上级菜单">
            <el-option label="一级菜单" :value="0" />
            <el-option v-for="item in list" :key="item.menu_id" :label="item.title" :value="item.menu_id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.pid === 0" label="重定向" prop="redirect">
          <el-input v-model="formData.redirect" placeholder="请输入重定向路径" />
        </el-form-item>
        <el-form-item label="排序" prop="menu_sort">
          <el-input-number v-model="formData.menu_sort" style="width: 100%" type="number" placeholder="请输入菜单排序" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="confirmRole">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { icons } from '@/icons'
import { menuList, editMenu, deleteMenu } from '@/api/system'
export default {
  directives: { waves },
  data() {
    return {
      listLoading: false,
      list: [],

      dialogVisible: false,
      dialogType: 'new',
      formData: {},
      rules: {
        title: { required: true, message: '请输入菜单标题', trigger: 'blur' },
        name: { required: true, message: '请输入组件名', trigger: 'blur' },
        component: { required: true, message: '请输入组件', trigger: 'blur' },
        icon: { required: true, message: '请选择图标', trigger: 'blur' },
        path: { required: true, message: '请输入路径', trigger: 'blur' },
        pid: { required: true, message: '请选择上级菜单', trigger: 'blur' },
        menu_sort: { required: true, message: '请输入菜单排序', trigger: 'blur' }
      },

      icons
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { code, data } = await menuList()
      this.listLoading = false
      if (code === 0) {
        this.list = data.list
      }
    },
    handleEdit(row) {
      if (row) {
        this.dialogType = 'edit'
        this.formData = JSON.parse(JSON.stringify(row))
      } else {
        this.dialogType = 'new'
        this.formData = {}
      }
      this.dialogVisible = true
    },
    confirmRole() {
      this.$refs.editForm.validate(async valid => {
        if (!valid) return false
        const { code } = await editMenu(this.formData)
        if (code === 0) {
          this.$message({
            message: this.dialogType === 'edit' ? '编辑成功' : '添加成功',
            type: 'success'
          })
          this.dialogVisible = false
          this.getList()
        }
      })
    },
    async handleDelete({ menu_id }) {
      this.$confirm('确定删除该菜单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { code } = await deleteMenu({ menu_id })
        if (code === 0) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
        this.getList()
      })
    }
  }
}
</script>
```

实现角色添加与菜单绑定

```vue
// src\views\system\role.vue
<template>
  <div class="app-container">
    <el-row :gutter="15">
      <el-col :span="17">
        <el-card class="box-card">
          <div slot="header">
            <span>角色列表</span>
            <el-button v-waves class="filter-item" style="float: right;" type="primary" icon="el-icon-plus" @click="handleEdit(null)">添加</el-button>
          </div>
          <el-table v-loading="listLoading" :data="list" fit highlight-current-row style="width: 100%" @row-click="clickRow">
            <el-table-column align="center" prop="name" label="名称" />
            <el-table-column align="center" prop="description" label="描述" />
            <el-table-column align="center" prop="create_by" label="创建人" />
            <el-table-column align="center" label="创建时间">
              <template slot-scope="{row}">
                {{ row.create_time | dateTimeFilter('yyyy-MM-dd hh:mm:ss') }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="update_by" label="更新人" />
            <el-table-column align="center" label="更新时间">
              <template slot-scope="{row}">
                {{ row.update_time | dateTimeFilter('yyyy-MM-dd hh:mm:ss') }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="{row}">
                <el-button type="text" @click.stop="handleEdit(row)">编辑</el-button>
                <!-- <el-button type="text" @click="handleDelete(row)">{{ $t('table.delete') }}</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card class="box-card">
          <div slot="header">
            <span>菜单分配</span>
            <el-button v-waves class="filter-item" style="float: right;" type="primary" icon="el-icon-check" :disabled="menuIds.length <= 0" @click="confirmRoleMenu">保存</el-button>
          </div>
          <el-tree ref="tree" :data="menuList" show-checkbox node-key="menu_id" :expand-on-click-node="false" @check-change="handleCheckChange">
            <template slot-scope="{ data }">
              <span>{{ data.title }}</span>
            </template>
          </el-tree>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'新增角色'" width="450px">
      <el-form ref="editForm" :model="formData" :rules="rules" label-width="80px" label-position="right">
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" type="textarea" placeholder="请输入名称" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="confirmRole">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { menuList, roleList, editRole, editRoleMenu } from '@/api/system'
export default {
  directives: { waves },
  data() {
    return {
      menuList: [],
      menuOneIds: [],

      roleId: '',
      menuIds: [],

      listLoading: false,
      list: [],

      dialogVisible: false,
      dialogType: 'new',
      formData: {},
      rules: {
        name: { required: true, message: '请输入名称', trigger: 'blur' }
      }
    }
  },
  created() {
    this.getMenuList()
  },
  mounted() {
    this.roleList()
  },
  methods: {
    async roleList() {
      this.listLoading = true
      const { code, data } = await roleList()
      this.listLoading = false
      if (code === 0) {
        this.list = data.list
      }
    },
    async getMenuList() {
      const { code, data } = await menuList()
      if (code === 0) {
        this.menuList = data.list
        this.menuOneIds = data.list.map(item => item.menu_id)
      }
    },
    handleEdit(row) {
      if (row) {
        this.dialogType = 'edit'
        this.formData = JSON.parse(JSON.stringify(row))
      } else {
        this.dialogType = 'new'
        this.formData = {}
      }
      this.dialogVisible = true
    },
    confirmRole() {
      this.$refs.editForm.validate(async valid => {
        if (!valid) return false
        const { code } = await editRole(this.formData)
        if (code === 0) {
          this.$message({
            message: this.dialogType === 'edit' ? '编辑成功' : '添加成功',
            type: 'success'
          })
          this.dialogVisible = false
          this.roleList()
        }
      })
    },
    clickRow(row) {
      this.roleId = row.role_id
      this.$refs.tree.setCheckedKeys(row.menus)
    },
    handleCheckChange(data) {
      const menuIds = this.$refs.tree.getCheckedKeys()
      this.menuIds = menuIds.filter(id => !this.menuOneIds.includes(id))
    },
    async confirmRoleMenu() {
      const { code } = await editRoleMenu({ role_id: this.roleId, menuIds: this.menuIds })
      if (code === 0) {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.role_id = ''
        this.menuIds = []
        this.$refs.tree.setCheckedKeys(this.menuIds)
        this.roleList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  box-shadow: 0 0 0 !important;
}
</style>
```

### 项目地址

前端源码：[admin-web](https://github.com/sunpu007/admin-web)

服务端源码：[admin-server](https://github.com/sunpu007/admin-server)

预览地址：[admin-demo](http://admin-demo.myjerry.cn)

<Vssue :title="$title" />