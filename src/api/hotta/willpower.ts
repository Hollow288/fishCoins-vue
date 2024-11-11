import {GlobalEnvConfig} from "@/constants/environments";
import {httpRequest} from "@/api/axios";
import {BaseResponse, PageResponse} from "@/types/axios";
import type {ItemsBasic,ArmsInfo } from '@/types/hotta/arms/basic-info'
import {WillpowerPage} from "@/types/hotta/willpower/basic-info";

export class WillpowerAPI {
    private static WILLPOWER_API_PREFIX = `${GlobalEnvConfig.BASE_API_PREFIX}/base/willpower`



    static selectPageWillpowerInfo(params:WillpowerPage) {
        return httpRequest.get<PageResponse<ArmsInfo[]>>(`${this.WILLPOWER_API_PREFIX}/page-willpower`,{
          ...params
        })
    }



}