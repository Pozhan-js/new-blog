<template>
  <footer class="page_footer">
    <div class="author">
      Copyright ©{{ currentYear }} by
      <a href="https://github.com/Pozhan-js" target="_blank">Pozhanjs</a>&nbsp;
      |&nbsp; Vercel：
      <a href="https://new-blog-two-ruddy.vercel.app/" target="_blank">
        跳转 >>>
      </a>
    </div>
    <div class="badge">
      <img src="https://img.shields.io/badge/-vite-ffffff?logo=vite" alt="" />
      <img src="https://img.shields.io/badge/-Vue3-34495e?logo=vue.js" alt="" />
      <img
        src="https://img.shields.io/badge/-TypeScript-f2f2f2?logo=TypeScript"
        alt=""
      />
    </div>
  </footer>
</template>
<script setup>
const currentYear = new Date().getFullYear();
</script>
<style lang="less" scoped>
.page_footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 90px;
  background-color: var(--vp-c-bg);
  border-top: 1px solid #f2f2f2;
  .author {
    font-size: 14px;
    color: #a8a8a8;
    a:hover {
      color: #3b82f6;
    }
  }
  .badge {
    display: flex;
    gap: 1rem;
  }
}

.dark {
  .page_footer {
    border-color: #4b4b4b;
  }
}
</style>
