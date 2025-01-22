import {BaseResponse} from "@/types/axios";
import {GlobalEnvConfig} from "@/constants/environments";

export class UploadAPI {
  private static UPLOAD_API_PREFIX = `${GlobalEnvConfig.BASE_API_PREFIX}/base/upload`

  private static headers = { 'Content-Type': 'multipart/form-data' }


  /**
   * 上传文件
   * @param data 文件数据
   * @param armsId
   *
   *
   */
  static uploadArmsImgFile(data: any, armsId: string) {
    return httpRequest.post<BaseResponse<{ path: string }>>(`${this.UPLOAD_API_PREFIX}/${armsId}/arms-img`, data, {
      headers: this.headers
    })
  }

  static uploadWillpowerImgFile(data: any, willpowerId: string) {
    return httpRequest.post<BaseResponse<{ path: string }>>(`${this.UPLOAD_API_PREFIX}/${willpowerId}/willpower-img`, data, {
      headers: this.headers
    })
  }

  static uploadEventConsultationImgFile(data: any, consultationId: string) {
    return httpRequest.post<BaseResponse<{ path: string }>>(`${this.UPLOAD_API_PREFIX}/${consultationId}/event-consultation-img`, data, {
      headers: this.headers
    })
  }

  static uploadFoodImgFile(data: any, foodId: string) {
    return httpRequest.post<BaseResponse<{ path: string }>>(`${this.UPLOAD_API_PREFIX}/${foodId}/food-img`, data, {
      headers: this.headers
    })
  }
}
