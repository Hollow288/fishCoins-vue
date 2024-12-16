import {GlobalEnvConfig} from "@/constants/environments";
import {httpRequest} from "@/api/axios";
import {BaseResponse, PageResponse} from "@/types/axios";
import {NuoCoinsTaskType, NuoCoinsTaskWeekly} from "@/types/hotta/nuo-coins/basic-info";
import {BasePageModel} from "@/types/common/page";

export class NuoCoinsAPI {
    private static YU_COINS_API_PREFIX = `${GlobalEnvConfig.BASE_API_PREFIX}/base/nuo-coins`


    static addEditNuoCoinsWeeklyInfo(data: object) {
        return httpRequest.post<BaseResponse<NuoCoinsTaskWeekly>>(`${this.YU_COINS_API_PREFIX}/add-edit-nuo-coins-weekly`, {
            ...data
        })
    }


    static selectPageNuoCoinsWeeklyInfo(params:BasePageModel) {
        return httpRequest.get<PageResponse<NuoCoinsTaskWeekly[]>>(`${this.YU_COINS_API_PREFIX}/page-nuo-coins-weekly`,{
            ...params
        })
    }

    static deleteNuoCoinsWeeklyInfo(data: object) {
        return httpRequest.put<BaseResponse>(`${this.YU_COINS_API_PREFIX}/delete-nuo-coins-weekly`, {
            ...data
        })
    }



    static selectNuoCoinsTaskTypeInfo() {
        return httpRequest.get<BaseResponse<NuoCoinsTaskType[]>>(`${this.YU_COINS_API_PREFIX}/nuo-coins-type`,)
    }


    static selectIdNuoCoinsWeeklyInfo(params:number) {
        return httpRequest.get<BaseResponse<NuoCoinsTaskWeekly>>(`${this.YU_COINS_API_PREFIX}/id-nuo-coins-weekly/${params}`,)
    }



}