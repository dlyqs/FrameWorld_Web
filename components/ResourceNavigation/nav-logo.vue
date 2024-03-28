<template>
  <div class="nav-logo">
    <svg class="nav-logo__svg" viewBox="0 0 1000 1000">
      <polygon style="opacity:0.33" points="653.9,507.7 693.1,614.5 862.2,228.2 475.9,397.3 582.2,437 344.5,674.7 191.5,523.1 92.8,565.2 344.8,816.6 344.8,816.6 344.9,816.7 "></polygon>
      <polygon points="698.9,462.7 738.1,569.5 907.2,183.2 520.9,352.3 627.2,392 389.5,629.7 236.5,478.1 137.8,520.2 389.8,771.6 389.8,771.6 389.9,771.7 "></polygon>
    </svg>
  </div>
</template>

<script>

</script>

<style>
.nav-logo__svg {
  width: 10rem; /* Logo尺寸，根据需要自行调整 */
  display: block;
  margin: auto; /* 让Logo居中显示 */
  fill: #f89898; /* 使用文字颜色，以便于自适应深浅模式 */
  opacity: 0.7; /* 透明度可以根据需求调整 */
  transition: transform 0.3s ease-in-out, fill 0.3s; /* 优化动画时长 */
}

.nav-logo__svg:hover {
  transform: rotate(720deg); /* 轻微的旋转动效 */
}

</style>
