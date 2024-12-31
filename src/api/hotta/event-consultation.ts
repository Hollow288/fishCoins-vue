import {GlobalEnvConfig} from "@/constants/environments";
import {httpRequest} from "@/api/axios";
import {BaseResponse, PageResponse} from "@/types/axios";
import {EventConsultationInfo, EventConsultationPage} from "@/types/hotta/event-consultation/basic-info";
import type {ArmsInfo} from "@/types/hotta/arms/basic-info";

export class EventConsultationAPI {
    private static CONSULTATION_API_PREFIX = `${GlobalEnvConfig.BASE_API_PREFIX}/base/event-consultation`


    static addOrEditEventConsultationInfo(data: object) {
        return httpRequest.post<BaseResponse<EventConsultationInfo>>(`${this.CONSULTATION_API_PREFIX}/add-or-edit-event-consultation`, {
            ...data
        })
    }


    static selectPageEventConsultationInfo(params:EventConsultationPage) {
        return httpRequest.get<PageResponse<EventConsultationInfo[]>>(`${this.CONSULTATION_API_PREFIX}/page-event-consultation`,{
            ...params
        })
    }

    static deleteEventConsultationInfo(data: object) {
        return httpRequest.put<BaseResponse<EventConsultationInfo>>(`${this.CONSULTATION_API_PREFIX}/delete-event-consultation`, {
            ...data
        })
    }


    static selectIdEventConsultationInfo(params:number) {
        return httpRequest.get<BaseResponse<EventConsultationInfo>>(`${this.CONSULTATION_API_PREFIX}/id-event-consultation/${params}`,)
    }



}