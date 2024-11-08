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
}
