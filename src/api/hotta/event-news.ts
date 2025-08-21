import {GlobalEnvConfig} from "@/constants/environments";
import {httpRequest} from "@/api/axios";
import {BaseResponse, PageResponse} from "@/types/axios";
import {EventNewsInfo, EventNewsPage} from "@/types/hotta/event-news/basic-info";

export class EventNewsAPI {
    private static NEWS_API_PREFIX = `${GlobalEnvConfig.BASE_API_PREFIX}/event-news`


    static addEventNewsInfo(data: object) {
        return httpRequest.post<BaseResponse<EventNewsInfo>>(`${this.NEWS_API_PREFIX}`, {
            ...data
        })
    }

    static editEventNewsInfo(data: object,news_id: string) {
        return httpRequest.put<BaseResponse<EventNewsInfo>>(`${this.NEWS_API_PREFIX}/${news_id}`, {
            ...data
        })
    }


    static selectPageEventNewsInfo(params:EventNewsPage) {
        return httpRequest.get<PageResponse<EventNewsInfo[]>>(`${this.NEWS_API_PREFIX}`,{
            ...params
        })
    }

    static deleteEventNewsInfo(data: object) {
        return httpRequest.put<BaseResponse<EventNewsInfo>>(`${this.NEWS_API_PREFIX}/delete`, {
            ...data
        })
    }


    static selectIdEventNewsInfo(params:number) {
        return httpRequest.get<BaseResponse<EventNewsInfo>>(`${this.NEWS_API_PREFIX}/${params}`,)
    }



}