import {BasePageModel} from "@/types/common/page";

export interface ItemsBasic {
    itemsId: string
    itemsName: string,
    itemsDescribe: string
}

export interface WillpowerClassification extends ItemsBasic{
    classificationType: string
}



export interface WillpowerSuit extends ItemsBasic{
}

export interface WillpowerPage extends BasePageModel{
    search_name: string
}


export interface WillpowerInfo {
    willpowerId: string,
    willpowerName: string,
    willpowerRarity: string,
    willpowerDescription: string,
    willpowerThumbnailUrl: string,
    willpowerClassification: WillpowerClassification[],
    willpowerSuit: WillpowerSuit[]
}


export const willpowerTypeList = [
    {
        value: '思想',
        label: '思想',
    },
    {
        value: '记忆',
        label: '记忆',
    },
    {
        value: '信念',
        label: '信念',
    },
    {
        value: '情感',
        label: '情感',
    }
]