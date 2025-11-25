import {GlobalEnvConfig} from "@/constants/environments";
import {httpRequest} from "@/api/axios";
import {BaseResponse, PageResponse} from "@/types/axios";
import {Blog, BlogPage} from "@/types/other/blog/basic-info";

export class BlogAPI {
    private static BLOG_API_PREFIX = `${GlobalEnvConfig.BASE_API_PREFIX}/blog`


    static addBlogInfo(data: object) {
        return httpRequest.post<BaseResponse<Blog>>(`${this.BLOG_API_PREFIX}`, {
            ...data
        })
    }

    static editBlogInfo(data: object,news_id: string) {
        return httpRequest.put<BaseResponse<Blog>>(`${this.BLOG_API_PREFIX}/${news_id}`, {
            ...data
        })
    }


    static selectPageBlogInfo(params:BlogPage) {
        return httpRequest.get<PageResponse<Blog[]>>(`${this.BLOG_API_PREFIX}/page/search`,{
            ...params
        })
    }

    static deleteBlogInfo(data: object) {
        return httpRequest.put<BaseResponse<Blog>>(`${this.BLOG_API_PREFIX}/delete`, {
            ...data
        })
    }


    static selectIdBlogInfo(params:number) {
        return httpRequest.get<BaseResponse<Blog>>(`${this.BLOG_API_PREFIX}/${params}`,)
    }



}