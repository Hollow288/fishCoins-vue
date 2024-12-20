import {acceptHMRUpdate, defineStore} from 'pinia'

import type {User} from '@/types/user'
import {ref} from "vue";

export const useUserStore = defineStore('user', () => {
  /**
   * 当前登录系统的用户数据
   */
  const user = ref<User>({})

  /**
   * 判断当前用户是否存在
   * @description 判断依据：当前用户数据是否存在 ID
   */
  const hasData = () => user.value.userId

  /**
   * 设置当前用户数据
   * @description 更新方式为“非覆盖式更新”
   * @param data 用户数据
   */
  const setUser = (data: User) => {
    user.value = {...user.value, ...data}
  }


  const getUser = (): User => user.value

  /**
   * 清空当前用户数据
   */
  const clearUser = () => {
    user.value = {}
  }

  return {
    user,
    hasData,
    setUser,
    getUser,
    clearUser
  }
}, {
  persist: true,
})

/**
 * HMR
 * @see https://pinia.vuejs.org/zh/cookbook/hot-module-replacement.html
 */
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
