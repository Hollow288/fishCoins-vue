<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="sidebar.collapse"
            :background-color="sidebar.bgColor"
            :text-color="sidebar.textColor"
            popper-effect="dark"
            router
        >
            <template v-for="item in menuData">
                <template v-if="item.children">
                    <el-sub-menu :index="item.index" :key="item.index" v-permiss="item.id" :background-color="sidebar.bgColor">
                        <template #title>
                            <el-icon>
                                <component :is="item.icon"></component>
                            </el-icon>
                            <span>{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.children">
                            <el-sub-menu
                                v-if="subItem.children"
                                :index="subItem.index"
                                :key="subItem.index"
                                :background-color="sidebar.bgColor"
                                v-permiss="item.id"
                            >
                                <template #title>
                                    <el-icon>
                                        <component :is="subItem.icon"></component>
                                    </el-icon>
                                    {{ subItem.title }}
                                </template>
                                <el-menu-item
                                    v-for="(threeItem, i) in subItem.children"
                                    :key="i"
                                    :index="threeItem.index"
                                    :background-color="sidebar.bgColor"
                                >
                                    <el-icon>
                                        <component :is="threeItem.icon"></component>
                                    </el-icon>
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-sub-menu>
                            <el-menu-item v-else :index="subItem.index" v-permiss="item.id" :background-color="sidebar.bgColor">
                                <el-icon>
                                    <component :is="subItem.icon"></component>
                                </el-icon>
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-sub-menu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index" v-permiss="item.id">
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <template #title>{{ item.title }}</template>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSidebarStore } from '@/store/sidebar';
import { useRoute } from 'vue-router';
import { menuData } from '@/components/BaseLayout/menu';

const route = useRoute();
const onRoutes = computed(() => {
    return route.path;
});

const sidebar = useSidebarStore();
</script>

<style scoped>
.sidebar {
    display: block;
    overflow-y: auto;
    height: 100%;
    overflow-x: hidden

}

.sidebar::-webkit-scrollbar {
    width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
    width: 220px;
    height: 100%;
}

.sidebar-el-menu {
    min-height: 100%;
}
</style>
