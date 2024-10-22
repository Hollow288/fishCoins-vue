<template>
<!--    <div style="background: #e3e3e3;height: calc(100vh) "></div>-->
</template>

<script setup>
import {onMounted, ref} from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
import { ElLoading } from 'element-plus'
import { ElMessage } from 'element-plus'

onMounted(() => {
    const query = new URLSearchParams(window.location.search)
    const code = query.get('code')  // 获取授权码
    const state = query.get('state')  // 获取 state 参数
    const type = query.get('type')  // 获取 state 参数
    const stateFromSession = sessionStorage.getItem('oauth_state');
    debugger


    const openFullScreen2 = () => {
        const loading = ElLoading.service({
            lock: true,
            text: '正在处理登录...',
            background: '#e3e3e3',
        })

        if (!state || !stateFromSession) {
            ElMessage.warning('会话已过期，请重新登录！');
            loading.close()
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000)
        } else if (stateFromSession === state) {
            // console.log('State 校验成功');
            // 进行后续处理，比如请求后端获取用户信息
            window.history.replaceState(null, '', window.location.pathname); // 清理 URL 参数
        } else {
            ElMessage.error('认证失败，请重试！');
            loading.close()
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000)
        }

    }

    openFullScreen2()
    // if (code) {
    //     // 将授权码发送给后端，获取访问令牌
    //     fetch('http://localhost:8800/oauth/token', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ code }),
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log('Token:', data)
    //             router.replace('/')  // 跳转到首页
    //         })
    //         .catch(err => console.error('Error:', err))
    // } else {
    //     console.error('Authorization code not found.')
    //     router.replace('/login')  // 没有授权码时跳转回登录页
    // }
})
</script>


<style>

</style>
