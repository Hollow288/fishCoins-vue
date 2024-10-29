<script setup lang="ts">
import AppIcon from '@/assets/img/logo.svg';


const toGithub = ()=>{
    window.open('https://github.com', '_blank');
}
</script>

<template>
    <footer>
        <div class="footer-main">
            <el-icon>
                <img :src="AppIcon" alt="Element Plus" class="icon"/>
            </el-icon>
            <el-text style="margin-left: 10px;" class="mx-1">Fish Coins - by&nbsp;</el-text>
            <el-text class="mx-1 clickable" @click="toGithub">Hollow288</el-text>
        </div>
    </footer>
</template>

<style scoped>
.footer-main {
    background-color: #ffffff;
    height: 30px;
    border-top: 1px solid #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
}

.icon {
    width: 24px;
    height: 24px;

}

.clickable {
    cursor: pointer; /* 鼠标手势 */
    text-decoration: none; /* 默认无下划线 */
    transition: color 0.3s;
}

.clickable:hover {
    color: #409eff; /* 悬停变蓝色 */
    text-decoration: underline; /* 悬停时带下划线 */
}
</style>
