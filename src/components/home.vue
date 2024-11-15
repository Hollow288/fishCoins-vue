<template>
    <div class="wrapper">
        <v-header />
        <div class="content-box">
            <v-sidebar :class="{ 'content-collapse': sidebar.collapse }"/>
            <div class="content" :class="{ 'collapse-content': sidebar.collapse }">
                <v-tabs></v-tabs>
                <div class="main">

                        <router-view v-slot="{ Component }">
                            <transition name="move" mode="out-in">
                                <keep-alive :include="tabs.nameList">

                                        <el-card style="height: 100%;" :body-style="bodyStyle">
                                            <component :is="Component">
                                            </component>
                                        </el-card>

                                </keep-alive>
                            </transition>
                        </router-view>

                </div>
            </div>
        </div>
        <v-footer />
    </div>
</template>

<script setup lang="ts">
import { useSidebarStore } from '@/store/sidebar';
import { useTabsStore } from '@/store/tabs';
import VHeader from '@/components/BaseLayout/header.vue';
import VSidebar from '@/components/BaseLayout/sidebar.vue';
import VTabs from '@/components/BaseLayout/tabs.vue';
import VFooter from '@/components/BaseLayout/footer.vue';
import { useUserStore } from "@/store/user";
import {CSSProperties, onBeforeMount} from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const sidebar = useSidebarStore();
const tabs = useTabsStore();
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();


const bodyStyle: CSSProperties = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box'
}as CSSProperties


const checkLogin = async () => {
    if (AuthUtils.isAuthenticated()) {
        if (!userStore.hasData()) {
            // 重新获取数据逻辑
            // const { data } = (await UserAPI.me()) ?? {};
            // userStore.setUser(data);
        }
    } else {
        ElMessage.error('用户登录信息已过期');
        userStore.clearUser();
        router.replace({
            path: '/login',
            query: { redirect: route.fullPath },
        });
    }
};

onBeforeMount(() => checkLogin());
</script>

<style>
.wrapper {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
}

.content-box {
    flex: 1;
    display: flex;
    flex-direction: row;
    padding-bottom: 0;
    background: #eef0fc;
    transition: left 0.3s ease-in-out;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
}

.content {
    flex: 1;
    transition: width 0.3s ease-in-out;
    width: calc(100% - 240px); /* 默认 sidebar 展开时 */
}

.collapse-content {
    width: calc(100% - 60px); /* sidebar 折叠时 */
}

.main {
    height: calc(100vh - 140px);
    scrollbar-width: none;
    background-color: #ffffff;
    padding: 5px;
}


.main::-webkit-scrollbar {
    display: none;
}




</style>
