<template>
    <main class="center-container">
        <img
            src="../assets/img/logo.svg"
            alt="Description of SVG"
            width="200"
            height="200"
            class="zoom-image"
        />
    </main>
</template>

<script setup lang="ts" >

</script>

<style scoped>
.center-container {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    height: 100%; /* 使 main 元素占满视口高度 */
}

.zoom-image {
    transition: transform 0.3s ease; /* 平滑过渡效果 */
}

.zoom-image:hover {
    transform: scale(1.3); /* 鼠标悬停时放大 10% */
}

.image-caption {
    margin-top: 10px;
    font-size: 16px;
    color: #555; /* 字体颜色 */
}
</style>
