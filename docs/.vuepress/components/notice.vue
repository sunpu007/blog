<template>
  <div class="notice">
    <div class="dialog-modal" v-if="isShowDialog" @click.stop="hideDialog">
      <div class="dialog-container" @click.stop="to618">
        <img src="/close.png" @click.stop="hideDialog" alt="close">
        <h4>阿里云618活动</h4>
        <p>618年中钜惠大促</p>
        <p class="time" v-if="timeStr">倒计时：{{ timeStr }}</p>
      </div>
    </div>
    <div class="footer-icon" v-if="!isShowDialog" @click="isShowDialog=true">618</div>
    <div class="footer-icon footer-min" @click="to618s">618</div>
  </div>
</template>

<script>
export default {
  name: 'notice',
  data() {
    return {
      isShowDialog: true,
      timeStr: '',
      timer: null
    }
  },
  mounted() {
    const endTime = new Date('2021-07-01').getTime()
    this.timer = setInterval(() => {
      // 计算时间差
      const timeDiff = parseInt((endTime - Date.now()) / 1000)
      // 获取天
      const day = Math.floor(timeDiff / 86400)
      // 获取时
      const hours = Math.floor((timeDiff - day * 86400) / (60 * 60))
      // 获取分
      const minutes = Math.floor((timeDiff - day * 86400 - hours * 3600) / 60)
      // 获取秒
      const seconds = timeDiff - day * 86400 - hours * 3600 - minutes * 60
      this.timeStr = `${day}天${hours}时${minutes}分${seconds}秒`
    }, 1000)
  },
  methods: {
    hideDialog() {
      this.isShowDialog = false
      sessionStorage.setItem('isShowDialog', false)
    },
    to618() {
      _hmt.push(['_trackEvent', '2021_618', 'click']);
      window.open('https://www.aliyun.com/activity/618/2021?userCode=6mto7kqp', '_black')
    }
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer)
  }
}
</script>

<style lang="stylus" scoped>
.notice {
  .dialog-modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index 99
    background: rgba(0, 0, 0, .4);
    .dialog-container {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      width: 600px;
      height: 244px;
      border-radius: 5px;
      padding: 40px;
      background: linear-gradient(90deg, #775ffa, #8D9DFF);
      // background-image: url('https://img.alicdn.com/imgextra/i1/O1CN01JOLCyL1MysL7GoLbX_!!6000000001504-2-tps-638-244.png');
      color: #fff;
      img {
        position: absolute;
        right: 10px;
        top: 10px;
        width: 35px;
        height: 35px;
        cursor: pointer;
      }
      h4 {
        font-size: 36px;
        font-weight: 600;
        line-height: 66px;
      }
      p {
        font-size: 28px;
        line-height: 40px;
        &.time {
          font-size: 20px;
        }
      }
    }
  }
  .footer-icon {
    position: fixed;
    right: 50px;
    bottom: 50px;
    overflow: hidden;
    width: 50px;
    height: 50px;
    line-height 50px;
    text-align: center;
    border-radius: 50px;
    color: #fff;
    cursor: pointer;
    background: linear-gradient(90deg, #775ffa, #8D9DFF);
    box-shadow 0 0 10px rgba(119, 95, 250, .3);
    &:hover {
      box-shadow 0 0 10px rgba(119, 95, 250, .5);
    }
    &.footer-min {
      display: none;
      right: 20px;
      bottom: 20px;
    }
  }
}
@media (max-width: 750px) {
  .dialog-modal {
    display: none;
  }
  .footer-icon {
    display: none;
  }
  .footer-min {
    display: block !important;
  }
}
</style>