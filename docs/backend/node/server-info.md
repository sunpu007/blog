# Node获取服务器信息

在管理系统的日常开发中，可能会遇到需要实时监控服务器运行信息，用来监控服务器运行情况，是否需要进行服务器的改配等操作。虽然服务器提供平台会有一系列监控数据，但是运营人员不可能频繁的登录控制台来查看服务器运行情况，所以需要在管理系统上展示出服务器的基本运行情况。如：CPU的占用率、内存的占用率、磁盘使用率、系统负载、运行时长等一系列信息。

> 获取CPU的占用情况

```javascript
const getCPU = async () => {
  function cpuAverage() {
    // Initialise sum of idle and time of cores and fetch CPU info
    var totalIdle = 0, totalTick = 0;
    var cpus = os.cpus();
    // Loop through CPU cores
    for(var i = 0, len = cpus.length; i < len; i++) {
      // Select CPU core
      var cpu = cpus[i];
      // Total up the time in the cores tick
      for(const type in cpu.times) {
        totalTick += cpu.times[type];
     }     
      // Total up the idle time of the core
      totalIdle += cpu.times.idle;
    }
    // Return the average Idle and Tick times
    return { idle: totalIdle / cpus.length,  total: totalTick / cpus.length };
  }

  const startMeasure = cpuAverage();
  return new Promise((resolve) => {
    setTimeout(function() { 
      // Grab second Measure
      var endMeasure = cpuAverage(); 
      // Calculate the difference in idle and total time between the measures
      var idleDifference = endMeasure.idle - startMeasure.idle;
      var totalDifference = endMeasure.total - startMeasure.total;
      // Calculate the average percentage CPU usage
      var percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);
      // Output the result
      resolve({ used: percentageCPU, name: os.cpus()[0].model, threadNumber: os.cpus().length });
    }, 100);
  });
}
```

> 获取内存占用情况

在多次测试中发现Node提供的内存API所计算的内存占用数据存在较大的偏差，所以此处使用系统命令来获取相应的数据。（*但是在windows与macOS上目前没有找到好的解决方案，所以此处使用Node提供的API来处理*）

```javascript
const getMem = async () => {
  return new Promise(async (resolve) => {
    // 初始化内存总量、空闲总量、使用总量与占用率
    let totalmem = 0,
      freemem = 0,
      usedmem = 0,
      usageRate = 0;
    
    // 判断操作系统
    if (os.type() === 'Linux') {
      // 执行系统命令，命令输出结果如下图
      const { stdout } = await exec('free -m');
      // 获取到输出数据后截取计算所需要的信息
      let str = stdout.split('\n')[1].split(' ').filter(item => item != '');

      totalmem = str[1];
      freemem = str[1] - str[2];
      usedmem = str[2];
      // 计算占用率
      usageRate = (usedmem / totalmem * 100).toFixed(2);
    } else {
      totalmem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
      freemem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
      usedmem = ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2);
      usageRate = parseInt(usedmem / totalmem * 100);
    }
	// 返回计算结果
    resolve({ totalmem, freemem, usedmem, usageRate });
  })
}
```

![image-20210517141218705](https://oss-blog.myjerry.cn/image-20210517141218705.png)

> 获取服务器基本信息

```javascript
sys = async () => {
  // 获取系统运行时间
  let date = '',sys = '',ip = '';

  const time = os.uptime();
  const day = Math.floor(time / 86400);
  const hour = Math.floor((time - day * 86400) / 3600);
  const minute = Math.floor((time - day * 86400 - hour * 3600) / 60);
  const second = Math.floor(time - day * 86400 - hour * 3600 - minute * 60);

  date = formatStr('{0}天{1}时{2}分{3}秒', day, hour, minute, second);

  // 获取系统信息
  if (os.type() === 'Linux') {
    const { stdout } = await exec('cat /etc/redhat-release');
    sys = stdout.trim();
  } else if (os.type() === 'Darwin') {
    const { stdout } = await exec('sw_vers');
    stdout.split('\n').forEach(item => {
      sys += item.split(':')[1] ? item.split(':')[1] : '';
    })
    sys = sys.trim();
  } else if (os.type() === 'Windows_NT') {
    const { stdout } = await exec('ver');
    sys = stdout.trim();
  }

  // 获取系统负载
  const loadavg = os.loadavg();
  const loadavg1m = loadavg[0].toFixed(2);
  const loadavg5m = loadavg[1].toFixed(2);
  const loadavg12m = loadavg[2].toFixed(2);

  return Promise.resolve({ date, sys, loadavg1m, loadavg5m, loadavg12m });
}
```


<Vssue :title="$title" />