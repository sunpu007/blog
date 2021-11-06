<template>
  <div class="fixed_container">
    <div class="tencent_code">
      <h4>添加微信</h4>
      <p>获取阿里云更多优惠</p>
      <img src="https://oss-blog.myjerry.cn/files/wechat-accout-img.jpg" alt="" />
    </div>
    <div class="tencent_code">
      <p>阿里云最新活动</p>
      <img src="https://oss-blog.myjerry.cn/files/aliyun-202012021638.png" alt="" />
    </div>
  </div>
</template>
<script>
  export default {
    name: 'fixed',
  }
</script>

<style>
.fixed_container {
  position: fixed;
  right: 0;
  top: 150px;
  padding: 20px 10px;
  text-align: center;
  background-color: #fff;
  border-radius: 3px 0 0 3px;
  box-shadow: -1px 0 2px 0.5px rgba(0,127,255,.2);
}
.fixed_container:hover {
  box-shadow: 0px 0 10px 5px rgb(0 127 255 / 20%);
}
.tencent_code h4 {
  font-size: 15px;
  color: #007fff;
  margin: 0;
}
.tencent_code p {
  font-size: 12px;
  margin: 10px 0;
}
.tencent_code img{
  width: 140px;
}
@media screen and (max-width: 1360px) {
  .fixed_container {
    display: none;
  }
}

</style>
