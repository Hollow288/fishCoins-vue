import {BasePageModel} from "@/types/common/page";

export interface FoodPage extends BasePageModel{
    search_name: string
}


export interface Food extends FoodBasic{
    foodRarity: string
    foodType: string
    foodEffect: string
    foodSource: string
    foodDescribe: string
    foodThumbnailUrl: string
    foodFormula: FoodFormula[]

}


export interface FoodBasic {
    foodId: string
    foodName: string
}

export interface FoodBasicResponse{
    foodIdNames: FoodBasic[];
}


export interface FoodFormula {
    formulaId: string
    foodId: string
    ingredientsId: string
    ingredientsNum: string
}
