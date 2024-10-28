<template>
    <div class="tabs-container">
        <el-tabs v-model="activePath"  class="tabs"  closable @tab-click="clickTabls" @tab-remove="closeTabs">
            <el-tab-pane
                v-for="(item,index) in tabs.list"
                :key="item.path"
                :label="item.title"
                :name="item.path"
                @click="setTags(item)"
            >
                <template #label>
                    <span class="custom-tabs-label">
                       <el-icon >
                           <component :is="item.icon"></component>
                       </el-icon>
                        <el-text class="mx-1" :type="getTextType(index)">{{ item.title }}</el-text>
<!--                      <span style="font-size: 15px;font-weight: bold">{{ item.title }}</span>-->
                    </span>
                </template>

            </el-tab-pane>
        </el-tabs>
        <div class="Tabs-close-box">
            <el-dropdown @command="handleTags">
                <el-button size="small" type="info" plain text>
                    标签选项
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu size="small">
                        <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                        <el-dropdown-item command="current">关闭当前</el-dropdown-item>
                        <el-dropdown-item command="all">关闭所有</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTabsStore } from '@/store/tabs';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import {ArrowDown} from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();
const activePath = ref(route.fullPath);
const tabs = useTabsStore();
// 设置标签
const setTags = (route: any) => {
    const isExist = tabs.list.some((item) => {
        return item.path === route.fullPath;
    });
    if (!isExist) {
        tabs.setTabsItem({
            name: route.name,
            title: route.meta.title,
            path: route.fullPath,
            icon: route.meta.icon
        });
    }
};
setTags(route);
onBeforeRouteUpdate((to) => {
    setTags(to);
});

// 关闭全部标签
const closeAll = () => {
    tabs.clearTabs();
    router.push('/');
};
// 关闭其他标签
const closeOther = () => {
    const curItem = tabs.list.filter((item) => {
        return item.path === route.fullPath;
    });
    tabs.closeTabsOther(curItem);
};
const handleTags = (command: string) => {
    switch (command) {
        case 'current':
            // 关闭当前页面的标签页
            tabs.closeCurrentTag({
                $router: router,
                $route: route,
            });
            break;
        case 'all':
            closeAll();
            break;

        case 'other':
            closeOther();
            break;
    }
};


const getTextType = (index: number): "primary" | "success" | "warning" | "danger" | "info" => {
    const types = ["primary", "success", "info", "warning", "danger"];
    return types[index % types.length] as "primary" | "success" | "warning" | "danger" | "info";
};

const clickTabls = (item: any) => {
    router.push(item.props.name);
};
const closeTabs = (path: string) => {
    const index = tabs.list.findIndex((item) => item.path === path);
    tabs.delTabsItem(index);
    const item = tabs.list[index] || tabs.list[index - 1];
    router.push(item ? item.path : '/');
};

watch(
    () => route.fullPath,
    (newVal, oldVal) => {
        activePath.value = newVal;
    }
);
</script>

<style scss>
.tabs-container {
    position: relative;
    overflow: hidden;
    background: #fff;
    padding: 0 90px 0 5px;
}

.tabs-container::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #dcdcdc;
}

.tabs {
    .el-tabs__header {
        margin-bottom: 0;
        border-top: none !important;
    }

    .el-tabs__nav {
        height: 28px;
    }

    .el-tabs__header .el-tabs__item {
        border-top: none !important;
    }

    .el-tabs__nav-next,
    .el-tabs__nav-prev {
        line-height: 32px;
    }

    &.el-tabs {
        --el-tabs-header-height: 28px;
        border: none;
    }

    .el-tabs__item{
        padding: 0 5px;
        font-size: 15px;
        font-family: 'PingFang SC', 'Helvetica Neue', Helvetica, 'microsoft yahei', arial, STHeiTi, 'sans-serif';
    }

}

.Tabs-close-box {
    position: absolute;
    right: 10px;
    top: 2px;
    padding-top: 0;
    text-align: center;
    width: 80px;
    background: #fff;
    z-index: 10;
    margin-bottom: 0;
}
.custom-tabs-label .el-icon {
    margin-top: 1px;
    vertical-align: middle;
}
.custom-tabs-label span {
    vertical-align: middle;
    margin-left: 4px;
}{}
</style>
