import {BaseResponse} from "@/types/axios";
import {GlobalEnvConfig} from "@/constants/environments";

export class UploadAPI {
  private static UPLOAD_API_PREFIX = `${GlobalEnvConfig.BASE_API_PREFIX}/upload`

  private static headers = { 'Content-Type': 'multipart/form-data' }


  /**
   * 上传文件
   * @param data 文件数据
   * @param bucketName
   *
   *
   */
  static uploadFile(data: any, bucketName: string) {
    return httpRequest.post<BaseResponse<string>>(`${this.UPLOAD_API_PREFIX}/${bucketName}`, data, {
      headers: this.headers
    })
  }

}
