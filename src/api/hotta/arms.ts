import {GlobalEnvConfig} from "@/constants/environments";
import {httpRequest} from "@/api/axios";
import {BaseResponse, PageResponse} from "@/types/axios";
import {UserTokenResponse} from "@/types/auth";
import type {ItemsBasic,ArmsInfo } from '@/types/hotta/arms/basic-info'
import {ArmsPage} from "@/types/hotta/arms/basic-info";

export class ArmsAPI {
    private static ARMS_API_PREFIX = `${GlobalEnvConfig.BASE_API_PREFIX}/base`


    /**
     * 新增
     */
    static addArmsInfo(data: object) {
      return httpRequest.post<BaseResponse<ArmsInfo>>(`${this.ARMS_API_PREFIX}/add-arms`, {
        ...data
      })
    }

    static selectPageArmsInfo(params:ArmsPage) {
        return httpRequest.get<PageResponse<ArmsInfo[]>>(`${this.ARMS_API_PREFIX}/page-arms`,{
          ...params
        })
    }

    static selectIdArmsInfo(params:number) {
        return httpRequest.get<BaseResponse<ArmsInfo>>(`${this.ARMS_API_PREFIX}/id-arms/${params}`,)
    }

}