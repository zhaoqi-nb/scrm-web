const baseSize = 12
// 设置 rem 函数
function setRem() {
  // 当前页面宽度相对于 1440 宽的缩放比例，可根据自己需要修改。
  const scale = Math.max(document.documentElement.clientWidth, 1280) / 1440
  // console.log()
  // 设置页面根节点字体大小
  document.documentElement.style.fontSize = `${baseSize * Math.min(scale, 2)}px`
}
// 初始化
setRem()
// 改变窗口大小时重新设置 rem
window.onresize = function () {
  setRem()
}
