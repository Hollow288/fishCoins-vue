import {GlobalEnvConfig} from "@/constants/environments";
import {httpRequest} from "@/api/axios";
import {BaseResponse, PageResponse} from "@/types/axios";
import {MimicryInfo, MimicryPage} from "@/types/hotta/mimicry/basic-info";

export class MimicryAPI {
    private static MIMICRY_API_PREFIX = `${GlobalEnvConfig.BASE_API_PREFIX}/base/mimicry`


    static addMimicryInfo(data: object) {
        return httpRequest.post<BaseResponse<MimicryInfo>>(`${this.MIMICRY_API_PREFIX}/add-mimicry`, {
            ...data
        })
    }


    static selectPageMimicryInfo(params:MimicryPage) {
        return httpRequest.get<PageResponse<MimicryInfo[]>>(`${this.MIMICRY_API_PREFIX}/page-mimicry`,{
          ...params
        })
    }

    static deleteMimicryInfo(data: object) {
        return httpRequest.put<BaseResponse<MimicryInfo>>(`${this.MIMICRY_API_PREFIX}/delete-mimicry`, {
            ...data
        })
    }


    static editMimicryInfo(data: object) {
        return httpRequest.put<BaseResponse<MimicryInfo>>(`${this.MIMICRY_API_PREFIX}/edit-mimicry`, {
            ...data
        })
    }

    static selectIdMimicryInfo(params:number) {
        return httpRequest.get<BaseResponse<MimicryInfo>>(`${this.MIMICRY_API_PREFIX}/id-mimicry/${params}`,)
    }



}