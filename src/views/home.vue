<template>
    <div class="wrapper">
        <v-header />
        <v-sidebar />
        <div class="content-box" :class="{ 'content-collapse': sidebar.collapse }">
            <v-tabs></v-tabs>
            <div class="content">
                <router-view v-slot="{ Component }">
                    <transition name="move" mode="out-in">
                        <keep-alive :include="tabs.nameList">
                            <component :is="Component"></component>
                        </keep-alive>
                    </transition>
                </router-view>
            </div>
        </div>
        <v-footer />
    </div>
</template>
<script setup lang="ts">
import { useSidebarStore } from '@/store/sidebar';
import { useTabsStore } from '@/store/tabs';
import VHeader from '@/components/header.vue';
import VSidebar from '@/components/sidebar.vue';
import VTabs from '@/components/tabs.vue';
import VFooter from '@/components/footer.vue';
import {useUserStore} from "@/store/user";
import {onBeforeMount} from "vue";
import {useRoute, useRouter} from "vue-router";
import {ElMessage} from "element-plus";

const sidebar = useSidebarStore();
const tabs = useTabsStore();
const userStore = useUserStore()
const route = useRoute();
const router = useRouter();

// 检查登录状态
const checkLogin = async () => {
    // 如果有 token，获取用户信息
    if (AuthUtils.isAuthenticated()) {
        if (!userStore.hasData()) {
            //Todo 重新获取数据
            // const { data } = (await UserAPI.me()) ?? {}
            // userStore.setUser(data)
        }
        // loading.value = false
        // sendSystemNotification()
    } else {
        // 否则清除用户信息并跳转到登录页
        ElMessage.error('用户登录信息已过期')
        userStore.clearUser()
        router.replace({
            path: '/login',
            query: {
                redirect: route.fullPath
            }
        })
    }
}

onBeforeMount(() => checkLogin())

</script>

<style>
.wrapper {
    height: 100vh;
    overflow: hidden;
}
.content-box {
    position: absolute;
    left: 250px;
    right: 0;
    top: 70px;
    bottom: 0;
    padding-bottom: 30px;
    -webkit-transition: left 0.3s ease-in-out;
    transition: left 0.3s ease-in-out;
    background: #eef0fc;
    overflow: hidden;
}

.content {
    width: auto;
    height: 100%;
    padding: 20px;
    overflow-y: scroll;
    box-sizing: border-box;
}

.content::-webkit-scrollbar {
    width: 0;
}

.content-collapse {
    left: 65px;
}
</style>
