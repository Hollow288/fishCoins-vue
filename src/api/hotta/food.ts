import {GlobalEnvConfig} from "@/constants/environments";
import {httpRequest} from "@/api/axios";
import {BaseResponse, PageResponse} from "@/types/axios";
import {Food, FoodBasic, FoodBasicResponse, FoodPage} from "@/types/hotta/food/basic-info";

export class FoodAPI {
    private static NEWS_API_PREFIX = `${GlobalEnvConfig.BASE_API_PREFIX}/base/food`


    static addOrEditFoodInfo(data: object) {
        return httpRequest.post<BaseResponse<Food>>(`${this.NEWS_API_PREFIX}/add-or-edit-food`, {
            ...data
        })
    }


    static selectPageFoodInfo(params:FoodPage) {
        return httpRequest.get<PageResponse<Food[]>>(`${this.NEWS_API_PREFIX}/page-food`,{
            ...params
        })
    }

    static deleteFoodInfo(data: object) {
        return httpRequest.put<BaseResponse<Food>>(`${this.NEWS_API_PREFIX}/delete-food`, {
            ...data
        })
    }


    static selectIdFoodInfo(params:number) {
        return httpRequest.get<BaseResponse<Food>>(`${this.NEWS_API_PREFIX}/id-food/${params}`,)
    }


    static selectFoodBasic() {
        return httpRequest.get<BaseResponse<FoodBasicResponse>>(`${this.NEWS_API_PREFIX}/food-basic`,)
    }



}