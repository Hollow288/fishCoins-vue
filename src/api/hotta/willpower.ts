import {GlobalEnvConfig} from "@/constants/environments";
import {httpRequest} from "@/api/axios";
import {BaseResponse, PageResponse} from "@/types/axios";
import {WillpowerInfo, WillpowerPage} from "@/types/hotta/willpower/basic-info";
import type {ArmsInfo} from "@/types/hotta/arms/basic-info";

export class WillpowerAPI {
    private static WILLPOWER_API_PREFIX = `${GlobalEnvConfig.BASE_API_PREFIX}/base/willpower`


    static addWillpowerInfo(data: object) {
        return httpRequest.post<BaseResponse<WillpowerInfo>>(`${this.WILLPOWER_API_PREFIX}/add-willpower`, {
            ...data
        })
    }


    static selectPageWillpowerInfo(params:WillpowerPage) {
        return httpRequest.get<PageResponse<WillpowerInfo[]>>(`${this.WILLPOWER_API_PREFIX}/page-willpower`,{
          ...params
        })
    }


    static editWillpowerInfo(data: object) {
        return httpRequest.put<BaseResponse<WillpowerInfo>>(`${this.WILLPOWER_API_PREFIX}/edit-willpower`, {
            ...data
        })
    }



}