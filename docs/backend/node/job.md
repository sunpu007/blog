# 使用Node.js实现一个定时任务调度中心

> 前言

在日常开发中共，除了给前端开发接口，还要写一些定时处理任务，比如每天定时非所有用户推送消息。一个成熟的定时任务调度中心，是可以通过管理系统来管理所有任务的信息，可以动态更改任务执行时间和立即执行等。

公司最近业务需求需要一个定时任务调度中心的系统，但搜索全网没有找到一个Node开发的定时任务调度中心系统，所以自己实现一个定时任务调度中心系统。

> 需要实现的功能

- 任务的增删改查
- 任务的立即执行
- 任务的启动/关闭
- 服务重启自动加载定时任务

> 数据库设计

```sql
CREATE TABLE `schedule_job` (
  `job_id` int(11) NOT NULL AUTO_INCREMENT,
  `cron` varchar(50) NOT NULL DEFAULT '' COMMENT 'cron表达式',
  `jobName` varchar(100) NOT NULL DEFAULT '' COMMENT '任务名',
  `jobHandler` varchar(100) NOT NULL DEFAULT '' COMMENT '任务处理方法',
  `params` varchar(255) NOT NULL COMMENT '参数',
  `description` varchar(255) NOT NULL DEFAULT '' COMMENT '描述',
  `status` int(1) NOT NULL DEFAULT '-1' COMMENT '状态 0启用 -1停止',
  `create_by` varchar(100) NOT NULL COMMENT '创建人',
  `update_by` varchar(100) NOT NULL COMMENT '更新人',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`job_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='定时任务表';
```

> 任务的增删改查

```js
// app/routers/task.js
'use strict';
module.exports = app => {
  const { router, controller, config, middleware } = app;
  const checkTokenHandler = middleware.checkTokenHandler();
  // 定时任务列表
  router.get(`${config.contextPath}/task/schedule/list`, checkTokenHandler, controller.task.scheduleList);
  // 修改/新增定时任务
  router.post(`${config.contextPath}/task/schedule/edit`, checkTokenHandler, controller.task.editSchedule);
  // 删除定时任务
  router.post(`${config.contextPath}/task/schedule/delete`, checkTokenHandler, controller.task.deleteSchedule);
  // 更新定时任务状态
  router.post(`${config.contextPath}/task/schedule/status/update`, checkTokenHandler, controller.task.updateStatusSchedule);
};

// app/controller/task.js
'use strict';
const Controller = require('egg').Controller;
const { setResult } = require('../utils');
class TaskController extends Controller {
  /**
   * 定时任务管理
   */
  async scheduleList() {
    const { ctx } = this;
    const result = await ctx.service.taskService.scheduleList(ctx.request.query);
    ctx.body = setResult({ data: result });
  }
  /**
   * 修改/新增定时任务
   */
  async editSchedule() {
    const { ctx } = this;
    const { username } = ctx.request.headers;
    await ctx.service.taskService.editSchedule(username, ctx.request.body);
    ctx.body = setResult();
  }
  /**
   * 删除定时任务
   */
  async deleteSchedule() {
    const { ctx } = this;
    await ctx.service.taskService.deleteSchedule(ctx.request.body);
    ctx.body = setResult();
  }
  /**
   * 更新定时任务状态
   */
  async updateStatusSchedule() {
    const { ctx } = this;
    await ctx.service.taskService.updateStatusSchedule(ctx.request.body);
    ctx.body = setResult();
  }
}
module.exports = TaskController;

// app/service/taskService.js
'use strict';
const { Service } = require('egg');
const { SCHEDULE_STATUS } = require('../constants');
class TaskService extends Service {
  // 定时任务管理
  async scheduleList({ page = 1, size = 20 }) {
    const limit = parseInt(size),
      offset = parseInt(page - 1) * parseInt(size);

    const [ list, total ] = await Promise.all([
      this.app.mysql.select('schedule_job', {
        orders: [[ 'create_time', 'desc' ]],
        limit,
        offset,
      }),
      this.app.mysql.count('schedule_job'),
    ]);
    return { list, total };
  }
  // 修改/新增定时任务
  async editSchedule(userName, { job_id, cron, jobName, jobHandler, params = '', description = '' }) {
    if (!job_id) {
      // 新增
      await this.app.mysql.insert('schedule_job', {
        cron,
        jobName,
        jobHandler,
        description,
        params,
        create_by: userName,
        update_by: userName,
        create_time: new Date(),
        update_time: new Date(),
      });
      return;
    }
    // 修改
    await this.app.mysql.update('schedule_job', {
      cron,
      jobName,
      jobHandler,
      description,
      params,
      update_by: userName,
      update_time: new Date(),
    }, { where: { job_id } });
  }
  // 删除定时任务
  async deleteSchedule({ job_id }) {
    await this.app.mysql.delete('schedule_job', { job_id });
  }
  // 更新定时任务状态
  async updateStatusSchedule({ job_id, status }) {
    await this.app.mysql.update('schedule_job', { status }, { where: { job_id } });
  }
}
module.exports = TaskService;
```

> 实现定时任务的启动、取消与所有任务

[`node-schedule`](https://github.com/node-schedule/node-schedule)是用于Node.js的灵活的cron类和非cron类作业调度程序。它允许使用可选的重复规则来安排（任意函数）在特定日期执行。它在任何给定时间仅使用一个计时器（而不是每秒/分钟重新评估即将到来的作业），提供了启动与停止等方法来管理任务。

```js
// app/extend/helper.js
'use strict';
const schedule = require('node-schedule');
/**
 * 用于存放定时任务的堆栈
 */
const scheduleStacks = {};

module.exports = {
  /**
   * 获取当前在执行所有任务
   */
  async getScheduleStacks() {
    return scheduleStacks;
  },
  /**
   * 创建定时任务
   * @param {*} id 任务ID
   * @param {*} cron Cron
   * @param {*} jobName 任务名
   * @param {*} jobHandler 任务方法
   * 在日常使用中，可能会存在同一处理程序有不同的处理逻辑，所以需要传入任务的ID
   * 如：在消息推送中，会存在不同时间对相同用户推送不同内容，而内容存放在任务信息中，业务代码需要查询到对应的任务信息读取推送信息，处理下一步逻辑
   */
  async generateSchedule(id, cron, jobName, jobHandler) {
    this.ctx.logger.info('[创建定时任务]，任务ID: %s，cron: %s，任务名: %s，任务方法: %s', id, cron, jobName, jobHandler);
    scheduleStacks[jobName] = schedule.scheduleJob(cron, () => {
      this.service.scheduleService[jobHandler](id);
    });
  },
  /**
   * 取消/停止定时任务
   * @param {*} jobName 任务名
   */
  async cancelSchedule(jobName) {
    this.ctx.logger.info('[取消定时任务]，任务名：%s', jobName);
    scheduleStacks[jobName] && scheduleStacks[jobName].cancel();
  },
};
```

> 任务的具体处理程序

`scheduleService`存放所有任务处理程序，目前只实现少量任务的管理，如果任务叫庞大的时候可根据不同的任务类型调用不同service的方法.

*当前只实现了一次性执行，未考虑到任务的失败、异常等现象，后面有时间了再完善*

```js
// app/service/scheduleService.js
'use strict';
const { Service } = require("egg");
class ScheduleService extends Service {
  /**
   * 测试处理程序
   */
  async testHandler(job_id) {
    // 读取锁,保证一个任务同时只能有一个进程执行
    const locked = await this.app.redlock.lock('sendAllUserBroadcast:' + job_id, 'sendAllUserBroadcast', 180);
    if (!locked) return false;

    const schedule = await this.app.mysql.get('schedule_job', { job_id });
    // 此处替换成具体业务代码
    await this.logger.info('我是测试任务，任务信息: %j', schedule);

    // 释放锁
    await this.app.redlock.unlock('sendAllUserBroadcast:' + job_id);
  }
}
module.exports = ScheduleService;
```

> 服务重启自动加载定时任务

```js
// app.js
'use strict';
const { SCHEDULE_STATUS } = require('./app/constants');
class AppBootHook {
  constructor(app) {
    this.app = app;
    this.ctx = app.createAnonymousContext();
  }
  async willReady() {
    await this.app.logger.info('【初始化定时任务】开始...');
    // 查询当前启动状态的定时任务
    const schedules = await this.app.mysql.select('schedule_job', { where: { status: SCHEDULE_STATUS.RUN } });
      // 循环注册定时任务
    schedules.forEach(async schedule => {
      await this.ctx.helper.generateSchedule(schedule.job_id, schedule.cron, schedule.jobName, schedule.jobHandler);
    });
    await this.app.logger.info('【初始化定时任务】初始化定时任务: %d，结束...', schedules.length);
  }
  async beforeClose() {
    await this.app.logger.info('【销毁定时任务】开始...');
    const scheduleStacks = await this.ctx.helper.getScheduleStacks();
    Reflect.ownKeys(scheduleStacks).forEach(async key => {
      await this.ctx.helper.cancelSchedule(key);
    });
    await this.app.logger.info('【销毁定时任务】销毁定时任务数: %d，结束...', Reflect.ownKeys(scheduleStacks).length);
  }
}
module.exports = AppBootHook;
```

> 完善任务的管理

```js
// app/routers/task.js
...
// 执行任务
router.post(`${config.contextPath}/task/schedule/run`, checkTokenHandler, controller.task.runSchedule);
...

// app/controller/task.js
/**
 * 执行任务
 */
async runSchedule() {
  const { ctx } = this;
  await ctx.service.taskService.runSchedule(ctx.request.body);
  ctx.body = setResult();
}

// app/service/taskService.js
// 修改/新增定时任务
async editSchedule(userName, { job_id, cron, jobName, jobHandler, params = '', description = '' }) {
  ...
  const schedule = await this.app.mysql.get('schedule_job', { job_id });
  // 此处在版本允许的情况下可使用可选链操作符`?`
  if (schedule && schedule.status === SCHEDULE_STATUS.RUN) {
    // 启动状态下重置任务
    await this.ctx.helper.cancelSchedule(jobName);
    await this.ctx.helper.generateSchedule(job_id, cron, jobName, jobHandler);
  }
}
// 更新定时任务状态
async updateStatusSchedule({ job_id, status }) {
  ...
  const schedule = await this.app.mysql.get('schedule_job', { job_id });
  if (schedule !== null) {
    if (status === SCHEDULE_STATUS.RUN) {
      // 启动任务
      await this.ctx.helper.generateSchedule(job_id, schedule.cron, schedule.jobName, schedule.jobHandler);
    } else {
      // 停止任务
      await this.ctx.helper.cancelSchedule(schedule.jobName);
    }
  }
}
// 执行任务
async runSchedule({ job_id }) {
  const schedule = await this.app.mysql.get('schedule_job', { job_id });
  if (schedule === null) throw new VideoError(RESULT_FAIL, '任务不存在');
  // 执行任务
  this.service.scheduleService[schedule.jobHandler]();
}
```

> 管理系统页面实现

UI的实现相对简单，就不做解释了

```js
// src/api/task.js
import request from '@/utils/request'
/**
 * 定时任务列表
 * @param {*} params
 */
export function scheduleList(params) {
  return request({
    url: '/task/schedule/list',
    method: 'GET',
    params
  })
}
/**
 * 修改/新增定时任务
 * @param {*} data
 */
export function editSchedule(data) {
  return request({
    url: '/task/schedule/edit',
    method: 'post',
    data
  })
}
/**
 * 删除定时任务
 * @param {*} data
 */
export function deleteSchedule(data) {
  return request({
    url: '/task/schedule/delete',
    method: 'post',
    data
  })
}
/**
 * 更新定时任务状态
 * @param {*} data
 */
export function updateStatusSchedule(data) {
  return request({
    url: '/task/schedule/status/update',
    method: 'post',
    data
  })
}
/**
 * 执行任务
 * @param {*} data
 */
export function runSchedule(data) {
  return request({
    url: '/task/schedule/run',
    method: 'post',
    data
  })
}
```



```vue
// src/views/task/schedule.vue
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="handleEdit(null)">新增</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" prop="job_id" label="任务ID" />
      <el-table-column align="center" prop="jobName" label="任务名" />
      <el-table-column align="center" prop="cron" label="Cron" />
      <el-table-column align="center" prop="jobHandler" label="jobHandler" />
      <el-table-column align="center" prop="params" label="参数" />
      <el-table-column align="center" prop="remark" label="任务描述" />
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="{row}">
          <el-tag v-if="row.status==0" type="success">run</el-tag>
          <el-tag v-else type="info">stop</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="{row}">
          <el-button v-if="row.status==-1" type="text" @click="updateStatus(row.job_id, 0)">启动</el-button>
          <el-button v-else type="text" @click="updateStatus(row.job_id, -1)">停止</el-button>
          <el-button type="text" @click="run(row.job_id)">执行</el-button>
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="del(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑任务':'新增任务'" width="400px">
      <el-form ref="editForm" :rules="rules" :model="fromData" label-width="100px" label-position="right">
        <el-form-item label="Cron" prop="cron">
          <el-input v-model="fromData.cron" placeholder="请输入Cron" />
        </el-form-item>
        <el-form-item label="任务名" prop="jobName">
          <el-input v-model="fromData.jobName" placeholder="请输入任务名" />
        </el-form-item>
        <el-form-item label="jobHandler" prop="jobHandler">
          <el-input v-model="fromData.jobHandler" placeholder="请输入jobHandler" />
        </el-form-item>
        <el-form-item label="参数" prop="params">
          <el-input v-model="fromData.params" type="textarea" placeholder="请输入参数" />
        </el-form-item>
        <el-form-item label="任务描述" prop="remark">
          <el-input v-model="fromData.remark" type="textarea" placeholder="请输入任务描述" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirm">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { scheduleList, editSchedule, deleteSchedule, updateStatusSchedule, runSchedule } from '@/api/task'
export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      listLoading: false,
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        size: 20
      },

      dialogVisible: false,
      dialogType: 'new',
      fromData: {},
      rules: {
        cron: { required: true, message: '请输入Cron', trigger: 'blur' },
        jobName: { required: true, message: '请输入任务名', trigger: 'blur' },
        jobHandler: { required: true, message: '请输入jobHandler', trigger: 'blur' }
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { code, data } = await scheduleList(this.listQuery)
      this.listLoading = false
      if (code === 0) {
        this.list = data.list
        this.total = data.total
      }
    },
    handleEdit(row) {
      this.fromData = {}
      if (row) {
        this.fromData = JSON.parse(JSON.stringify(row))
        this.dialogType = 'edit'
      } else {
        this.dialogType = 'new'
      }
      this.dialogVisible = true
    },
    async confirm() {
      this.$refs.editForm.validate(async valid => {
        if (!valid) return false
        const { code } = await editSchedule(this.fromData)
        if (code === 0) {
          this.$message({
            message: this.dialogType === 'edit' ? '编辑成功' : '新增成功',
            type: 'success'
          })
          this.dialogVisible = false
          this.getList()
        }
      })
    },
    del(row) {
      this.$confirm('确定要删除该任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { code } = await deleteSchedule({ job_id: row.job_id })
        if (code === 0) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getList()
        }
      })
    },
    async updateStatus(job_id, status) {
      const { code } = await updateStatusSchedule({ job_id, status })
      if (code === 0) {
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
        this.getList()
      }
    },
    async run(job_id) {
      const { code } = await runSchedule({ job_id })
      if (code === 0) {
        this.$message({
          message: '执行成功',
          type: 'success'
        })
      }
    }
  }
}
</script>
```

> 项目地址



前端源码：[admin-web](https://github.com/sunpu007/admin-web)



服务端源码：[admin-server](https://github.com/sunpu007/admin-server)



预览地址：[admin-demo](http://admin-demo.myjerry.cn)



<Vssue :title="$title" />