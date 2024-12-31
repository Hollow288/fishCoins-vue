import {BasePageModel} from "@/types/common/page";



export interface EventConsultationPage extends BasePageModel{
    search_name: string
}


export interface EventConsultationInfo {
    consultationId: string,
    consultationTitle: string,
    consultationDescribe: string,
    consultationThumbnailUrl: string,
    consultationStart: string,
    consultationEnd: string,
}

