import {GlobalEnvConfig} from "@/constants/environments";
import {httpRequest} from "@/api/axios";
import type { BaseResponse} from "@/types/axios"
import {UserTokenResponse} from "@/types/auth";
// 登录类型
enum LoginType {
  USERNAME = 1, // 用户名登录
  EMAIL = 2 // 邮箱登录
}

export class AuthAPI {
  private static AUTH_API_PREFIX = `${GlobalEnvConfig.BASE_API_PREFIX}/auth`

  static REFRESH_API_URL = `${this.AUTH_API_PREFIX}/refresh`

  /**
   * 登录
   */
  static login(data) {
    return httpRequest.post<BaseResponse<UserTokenResponse>>(
      `${this.AUTH_API_PREFIX}/login`,
      { ...data }
    )
  }

  // /**
  //  * 注册
  //  */
  // static signup(data: SignupModel) {
  //   return httpRequest.post<BaseResponse<UserTokenResponse>>(`${this.AUTH_API_PREFIX}/signup`, {
  //     ...data
  //   })
  // }
  //
  /**
   * 刷新令牌
   */
  static async refresh(token: string) {
    return httpRequest.post<object>(
      this.REFRESH_API_URL,
      {},
      { params: { token } }
    )
  }

  /**
   * GitHub 登录
   */
  // static loginWithGitHub(code: string) {
  //   return httpRequest.post<object>(
  //     `${this.AUTH_API_PREFIX}/login/github`,
  //     { code }
  //   )
  // }


  // static bindWithGitHub(code: string) {
  //   return httpRequest.post<BaseResponse>(
  //     `${this.AUTH_API_PREFIX}/bind/github`,
  //     { code }
  //   )
  // }
  //
  // /**
  //  * Google 登录
  //  */
  // static loginWithGoogle(code: string) {
  //   return httpRequest.post<BaseResponse<UserTokenResponse>>(
  //     `${this.AUTH_API_PREFIX}/login/google`,
  //     { code }
  //   )
  // }
  //
  //
  // /**
  //  * 登出
  //  */
  // static  logout(){
  //   return  httpRequest.post<ResponseResult>(`${this.AUTH_API_PREFIX}/logout`)
  // }
  //
  //
  // static hasRoleToInterface(userId:string,toPath:object){
  //   return  httpRequest.post<ResponseResult>(`${this.AUTH_API_PREFIX}/${userId}/has-role-interface`,{
  //     ...toPath
  //   })
  // }
}
