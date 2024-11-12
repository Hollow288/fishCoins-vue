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
        value: 'Option1',
        label: 'Option1',
    },
    {
        value: 'Option2',
        label: 'Option2',
    },
    {
        value: 'Option3',
        label: 'Option3',
    },
    {
        value: 'Option4',
        label: 'Option4',
    }
]