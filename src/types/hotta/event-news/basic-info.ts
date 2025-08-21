import {BasePageModel} from "@/types/common/page";



export interface EventNewsPage extends BasePageModel{
    search_name: string
}


export interface EventNewsInfo {
    newsId: string,
    newsTitle: string,
    newsDescribe: string,
    newsImgUrl: string,
    newsShowImgUrl: string,
    newsStart: string,
    newsEnd: string,
}

