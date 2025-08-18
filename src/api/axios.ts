import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import axios from 'axios'

import {AuthUtils} from '@/utils/auth'
import {StatusCode} from '@/constants/status-code'
import router from '@/router'

interface PendingTask {
  config?: AxiosRequestConfig
  resolve: (value: AxiosResponse<any, any> | PromiseLike<AxiosResponse<any, any>>) => void;
}
import { ElMessage } from 'element-plus'
import {GlobalEnvConfig} from "@/constants/environments";
import {AuthAPI} from "@/api/auth";

class Request {
  instance: AxiosInstance

  // 刷新令牌的标识
  isRefreshing : boolean = false

  // 等待请求队列
  pendingQueue: PendingTask[] = []

  // Axios 配置
  private readonly config: AxiosRequestConfig = {
    baseURL: '/',
    timeout: 300000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  }

  public constructor() {
    this.instance = axios.create(this.config)

    this.instance.interceptors.request.use(
      (req: InternalAxiosRequestConfig) => {
        // 设置 token
        const { url } = req
        // debugger
        // 如果是基础接口请求，添加 token
        if (AuthUtils.isAuthenticated() && url?.startsWith(GlobalEnvConfig.BASE_API_PREFIX) && !url?.endsWith('/user/login') && !url?.endsWith('/user/refresh')) {
          req.headers.Authorization = AuthUtils.getAuthorization()
        }
        // 设置语言 TODO: 使用 Web 标准的 Accept-Language
        req.headers.Language = 'en-US'
        return req
      },
      (err: AxiosError) => Promise.reject(err)
    )

    this.instance.interceptors.response.use(
      async (res: AxiosResponse)=> {

        const { config } = res
        // 处理成功响应时的数据
        const responseData = res.data
        // 判断状态码是否为40001
        if (res.data.code === StatusCode.ACCESS_TOKEN_ERR) {
          // 存在刷新令牌，认证令牌过期时，需要通过刷新令牌获取新的认证令牌
          const currentRefreshToken = AuthUtils.getRefreshToken()

          if (currentRefreshToken != null && currentRefreshToken !== '' && currentRefreshToken !== undefined && currentRefreshToken !== 'undefined') {
            if (!this.isRefreshing) {
              this.isRefreshing = true
              try {
                const response = (await AuthAPI.refresh(currentRefreshToken)) ?? {}
                // @ts-ignore
                const { refreshToken, accessToken} = response.data ?? {}
                if(refreshToken && accessToken){
                  AuthUtils.setAccessToken(accessToken)
                  AuthUtils.setRefreshToken(refreshToken)
                  this.isRefreshing = false

                  const originalRequest = res.config
                  // 重新发起本次请求
                  const resEnd =  await this.request<object>(originalRequest)

                  // 重新发起上次失败的请求
                  if (this.pendingQueue.length > 0) {
                    this.pendingQueue.forEach((task) => task.resolve(this.request(task.config!)))
                    this.pendingQueue = []
                  }

                  return resEnd
                }
                  this.handleUnauthorized()
              } catch {
                // 处理刷新令牌认证失败的情况
                this.handleUnauthorized()
              }
            }else {
              // 如果正在刷新令牌，将当前的请求加入待请求队列
                return new Promise((resolve) => {
                  this.pendingQueue.push({ config, resolve })
                })
            }
          } else {
            // 不存在刷新令牌，需要处理认证失败
            ElMessage.error('用户登录信息已过期')
            this.handleUnauthorized()
          }
        }
        else if(res.data.code === StatusCode.FORBIDDEN_ROLE_ERR) {
          ElMessage.error('请求被理解但拒绝执行')
          router.replace('/403')
        }else if(res.data.code === StatusCode.REQUEST_SERVER_ERROR){
          ElMessage.error('服务器错误')
        }else if(res.data.code === StatusCode.REFRESH_TOKEN_ERR){
          ElMessage.error('用户登录信息已过期')
          this.handleUnauthorized()
        }
        // 将处理后的数据传递到 Promise 链的下一步
        return responseData
      },
      async (err: AxiosError<Response>) => {
        const { response } = err
        const { data, status } = response ?? {}

        switch (status) {
          case StatusCode.FORBIDDEN:
            ElMessage.error("服务端错误!")
            router.replace('/403')
            break
          case StatusCode.INTERNAL_SERVER_ERROR:
            ElMessage.error("服务端错误!")
            break
          case  StatusCode.BAD_DOWNSTREAM:
            ElMessage.error("下游服务错误!")
            break
          case StatusCode.BAD_GATEWAY:
          case StatusCode.GATEWAY_TIMEOUT:
            // NMessage.error(errorMessage)
            router.replace('/404')
            break
          default:
        }
        // 网络错误，跳转到 404 页面
        if (!window.navigator.onLine) {
          // NMessage.error(t('COMMON.NETWORK.ERROR'))
          ElMessage.error("网络连接超时!")
          router.replace('/error-pages/404')
        }
        // 处理返回的数据和状态码
        return Promise.reject(data)
      }
    )
  }

  /**
   * 处理认证失败
   * @description
   * - 清除 token
   * - 跳转到登录页
   */
  handleUnauthorized() {
    AuthUtils.clearAccessToken()
    AuthUtils.clearRefreshToken()
    // 如果非登录页面，需要重定向到登录页，且需要带上 redirect 参数
    // router.replace({
    //   path: '/login',
    //   ...(router.currentRoute.value.fullPath && {
    //     query: {
    //       redirect: router.currentRoute.value.fullPath
    //     }
    //   })
    // })

    // 检查是否已经包含 `redirect` 参数，避免重复添加
    const currentRoute = router.currentRoute.value;
    const isRedirected = !!currentRoute.query.redirect;

    if (!isRedirected) {
      router.replace({
        path: '/login',
        query: {
          redirect: currentRoute.fullPath
        }
      });
    } else {
      // 如果已经包含了 redirect 参数，直接跳转到登录页
      router.replace('/login');
    }

  }

  /**
   * 通用请求
   * @param config 请求配置
   */
  request<T>(config: AxiosRequestConfig): Promise<T> {
    return this.instance.request(config)
  }

  /**
   * GET 请求
   * @param url 请求地址
   * @param params 请求参数
   * @param config 请求配置
   */
  get<T>(
    url: string,
    params?: Record<string, unknown> ,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.get(url, { params, ...config })
  }

  /**
   * POST 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   */
  post<T>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config)
  }

  /**
   * PUT 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   */
  put<T>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config)
  }

  /**
   * DELETE 请求
   * @param url 请求地址
   * @param params 请求参数
   * @param config 请求配置
   */
  delete<T>(
    url: string,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.delete(url, { params, ...config })
  }

  /**
   * PATCH 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   */
  patch<T>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch(url, data, config)
  }
}

export const httpRequest = new Request()
