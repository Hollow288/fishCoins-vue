<template>
    <div class="login-bg">
        <div class="login-container">
            <div class="login-header">
                <img class="logo mr10" src="../../assets/img/logo.svg" alt="" />
                <div class="login-title">Fish Coins</div>
            </div>
            <el-form :model="param" :rules="rules" ref="login" size="large">
                <el-tabs v-model="param.type" class="demo-tabs" @tab-click="handleClick" :stretch="true">
                    <el-tab-pane label="密码登录" name="password">
                        <el-form-item prop="userName">
                            <el-input v-model="param.userName" placeholder="用户名">
                                <template #prepend>
                                    <el-icon>
                                        <User />
                                    </el-icon>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="passWord">
                            <el-input
                                type="password"
                                placeholder="密码"
                                v-model="param.passWord"
                                @keyup.enter="submitForm(login)"
                                show-password
                            >
                                <template #prepend>
                                    <el-icon>
                                        <Lock />
                                    </el-icon>
                                </template>
                            </el-input>
                        </el-form-item>
                        <div class="pwd-tips">
                            <el-checkbox class="pwd-checkbox" v-model="checked" label="记住密码" />
                            <el-link type="primary" @click="$router.push('/reset-pwd')">忘记密码</el-link>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="免密登录" name="code">
                        <el-form-item prop="phone">
                            <el-input v-model="param.phone" placeholder="手机号" >
                                <template #prepend>
                                    <el-icon>
                                        <Iphone />
                                    </el-icon>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="code">
                            <el-input
                                placeholder="验证码"
                                v-model="param.code"
                                @keyup.enter="submitForm(login)"
                            >
                                <template #prepend>
                                    <el-icon>
                                        <Message />
                                    </el-icon>
                                </template>
                                <template #append>
                                    <el-button :disabled="isCounting" @click="startCountdown">
                                        <div v-if="isCounting">
                                            {{`${countdown}s`}}
                                        </div>
                                        <el-icon v-else>
                                            <Promotion />
                                        </el-icon>
                                    </el-button>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-tab-pane>

                </el-tabs>

                <el-button class="login-btn" type="primary" size="large" @click="submitForm(login)">登录</el-button>
                <p class="login-text">
                    没有账号？<el-link type="primary" @click="$router.push('/register')">立即注册</el-link>
                    <span class="icon-container">
<!--                        <el-tooltip content="Bottom center" placement="bottom" effect="light" hide-after="0">-->
<!--                            <el-icon :size="25" class="clickable-icon">-->
<!--                                <PhonePortraitOutline />-->
<!--                            </el-icon>-->
<!--                        </el-tooltip>-->
                        <el-tooltip content="Github" placement="bottom" effect="light" hide-after="0">
                            <el-icon :size="25" class="clickable-icon" @click="oauth2Login">
                                <LogoGithub />
                            </el-icon>
                        </el-tooltip>
                    </span>
                </p>

            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, reactive, computed} from 'vue';
import { useTabsStore } from '@/store/tabs';
import { usePermissStore } from '@/store/permiss';
import { useUserStore } from '@/store/user';
import {useRoute, useRouter} from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import {LogoGithub} from '@vicons/ionicons5'
import {AuthAPI} from "@/api/auth";
import type { TabsPaneContext } from 'element-plus'
import {Iphone, Lock, Message, Promotion, Search, User} from "@element-plus/icons-vue";
import {GlobalEnvConfig} from "@/constants/environments";


interface LoginInfo {
    userName: string;
    passWord: string;
    phone: string;
    code: string;
    type: string;
}

const route = useRoute()
const lgStr = localStorage.getItem('login-param');
const defParam = lgStr ? JSON.parse(lgStr) : null;
const checked = ref(lgStr ? true : false);
const redirectUrl = computed(() => route.query.redirect as string)

const router = useRouter();
const param = reactive<LoginInfo>({
    userName: defParam ? defParam.userName : '',
    passWord: defParam ? defParam.passWord : '',
    phone: '',
    code: '',
    type: 'password',
});


const countdown = ref(60); // 初始倒计时时间
const isCounting = ref(false); // 是否正在倒计时
let timer = null;
// 开始倒计时逻辑
const startCountdown = () => {
    if (isCounting.value) return; // 防止重复点击

    isCounting.value = true;
    countdown.value = 60;

    timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
            clearInterval(timer); // 停止计时
            isCounting.value = false; // 恢复按钮可用
        }
    }, 1000);
};

const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab.props, event)
    if(tab.props.name==='password'){
        param.type = 'password'
        param.phone = ''
        param.code = ''
    }

    if(tab.props.name==='code'){
        param.type = 'code'
        param.userName = ''
        param.passWord = ''
    }
}

const oauth2Login = () => {
    const basicGithubUrl = 'https://github.com/login/oauth/authorize'

    const clientId = GlobalEnvConfig.GITHUB_CLIENT_ID; // 替换为你的 GitHub 应用的 Client ID
    const redirectUri = encodeURIComponent('http://localhost:5173/auth-redirect?type=github'); // 替换为你的回调地址
    const state = Math.random().toString(36).substring(7); // 防止CSRF攻击，生成随机状态值
    sessionStorage.setItem('oauth_state', state);
    const githubUrl = `${basicGithubUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

    // 跳转到 GitHub 授权页面
    window.location.href = githubUrl;

}

const rules: FormRules = {
    userName: [
        {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
        },
    ],
    passWord: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};
const permiss = usePermissStore();
const userStore = useUserStore()
const login = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {

    if (!formEl) return;
    formEl.validate((valid: boolean) => {
        if (valid) {

            // localStorage.setItem('vuems_name', param.userName);
            AuthAPI.login(param).then(res=>{
                const { code, data, message } = res
                const { access_token, refresh_token, user } = data ?? {}
                if(code == '200'){
                    ElMessage.success(message);
                    AuthUtils.setAccessToken(access_token)
                    AuthUtils.setRefreshToken(refresh_token)
                    userStore.setUser(user)

                    if (checked.value) {
                        localStorage.setItem('login-param', JSON.stringify(param));
                    } else {
                        localStorage.removeItem('login-param');
                    }

                    if (redirectUrl.value) {
                        router.replace(redirectUrl.value)
                    } else {
                        router.replace('/')
                    }

                }else{
                    ElMessage.error(message);
                }
            })

        } else {
            ElMessage.warning('请填写完整信息');
            return false;
        }
    });



};

const tabs = useTabsStore();
tabs.clearTabs();
</script>

<style scoped>
.login-bg {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    //background: url(../../assets/img/login-bg.jpg) center/cover no-repeat;
    background: #e3e3e3;
}

.login-header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
}

.logo {
    width: 35px;
}

.login-title {
    font-size: 22px;
    color: #333;
    font-weight: bold;
}

.login-container {
    width: 450px;
    border-radius: 5px;
    background: #fff;
    padding: 40px 50px 50px;
    box-sizing: border-box;
}

.pwd-tips {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    margin: 0 0 10px;
    color: #787878;
}

.pwd-checkbox {
    height: auto;
}

.login-btn {
    display: block;
    width: 100%;
}

.login-tips {
    font-size: 12px;
    color: #999;
}

.login-text {
    display: flex;
    align-items: center;
    margin-top: 20px;
    font-size: 14px;
    color: #787878;
}


.icon-container {
    margin-left: auto; /* 将图标推到右侧 */
    display: flex;
    align-items: center; /* 垂直居中图标 */
    gap: 5px;
}

.icon-container {
    display: flex;
    align-items: center; /* 垂直居中图标 */
}

.clickable-icon {
    cursor: pointer; /* 显示可点击手势 */
    transition: color 0.3s ease; /* 添加过渡效果 */
}

/* 鼠标悬停时改变图标颜色 */
.clickable-icon:hover {
    color: #4b9bd9; /* 鼠标悬停时图标变蓝 */
}

.demo-tabs > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}
</style>
