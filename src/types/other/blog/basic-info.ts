import {BasePageModel} from "@/types/common/page";

export interface Blog {
    blogId: string
    title: string
    summary: string
    content: string
    createdAt: string
    delFlag: string
}


export interface BlogPage extends BasePageModel{
    search_name: string
}
