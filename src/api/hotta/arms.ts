import {GlobalEnvConfig} from "@/constants/environments";
import {httpRequest} from "@/api/axios";
import {BaseResponse, PageResponse} from "@/types/axios";
import {ArmsInfo, ArmsMimicryWillpower, ArmsMimicryWillpowerResponse} from '@/types/hotta/arms/basic-info'
import {ArmsPage} from "@/types/hotta/arms/basic-info";

export class ArmsAPI {
    private static ARMS_API_PREFIX = `${GlobalEnvConfig.BASE_API_PREFIX}/base/arms`


    /**
     * 新增
     */
    static addArmsInfo(data: object) {
      return httpRequest.post<BaseResponse<ArmsInfo>>(`${this.ARMS_API_PREFIX}/add-arms`, {
        ...data
      })
    }

    static editArmsInfo(data: object) {
        return httpRequest.put<BaseResponse<ArmsInfo>>(`${this.ARMS_API_PREFIX}/edit-arms`, {
            ...data
        })
    }

    static deleteArmsInfo(data: object) {
        return httpRequest.put<BaseResponse<ArmsInfo>>(`${this.ARMS_API_PREFIX}/delete-arms`, {
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


    static selectArmsMimicryWillpower() {
        return httpRequest.get<BaseResponse<ArmsMimicryWillpowerResponse>>(`${this.ARMS_API_PREFIX}/arms-mimicry-willpower`,)
    }

    static selectArmsMimicryWillpowerBindInfo(armsIds:number) {
        return httpRequest.get<BaseResponse<ArmsMimicryWillpower>>(`${this.ARMS_API_PREFIX}/bind/${armsIds}/arms-mimicry-willpower`,)
    }


    static editArmsMimicryWillpower(data: object) {
        return httpRequest.put<BaseResponse<ArmsMimicryWillpower>>(`${this.ARMS_API_PREFIX}/edit-arms-mimicry-willpower`, {
            ...data
        })
    }

}