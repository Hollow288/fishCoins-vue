import {GlobalEnvConfig} from "@/constants/environments";
import {httpRequest} from "@/api/axios";
import {BaseResponse, PageResponse} from "@/types/axios";
import {YuCoinsTaskType, YuCoinsTaskWeekly} from "@/types/hotta/yu-coins/basic-info";
import {BasePageModel} from "@/types/common/page";

export class YuCoinsAPI {
    private static YU_COINS_API_PREFIX = `${GlobalEnvConfig.BASE_API_PREFIX}/base/yu-coins`


    static addEditYuCoinsWeeklyInfo(data: object) {
        return httpRequest.post<BaseResponse<YuCoinsTaskWeekly>>(`${this.YU_COINS_API_PREFIX}/add-edit-yu-coins-weekly`, {
            ...data
        })
    }


    static selectPageYuCoinsWeeklyInfo(params:BasePageModel) {
        return httpRequest.get<PageResponse<YuCoinsTaskWeekly[]>>(`${this.YU_COINS_API_PREFIX}/page-yu-coins-weekly`,{
            ...params
        })
    }

    static deleteYuCoinsWeeklyInfo(data: object) {
        return httpRequest.put<BaseResponse>(`${this.YU_COINS_API_PREFIX}/delete-yu-coins-weekly`, {
            ...data
        })
    }



    static selectYuCoinsTaskTypeInfo() {
        return httpRequest.get<BaseResponse<YuCoinsTaskType[]>>(`${this.YU_COINS_API_PREFIX}/yu-coins-type`,)
    }


    static selectIdYuCoinsWeeklyInfo(params:number) {
        return httpRequest.get<BaseResponse<YuCoinsTaskWeekly>>(`${this.YU_COINS_API_PREFIX}/id-yu-coins-weekly/${params}`,)
    }



}