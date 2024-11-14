import {BasePageModel} from "@/types/common/page";
export interface MimicryFavors{
    favorsId: number,
    favorsLevel: string,
    favorsReward: string
}

export interface MimicryInfo {
    mimicryId: number,
    mimicryName: string,
    mimicryCv: string,
    mimicrySex: string,
    mimicryHeight: number,
    mimicryFactions: string,
    mimicryBirthday: string,
    mimicryLike: string,
    mimicryFavors: MimicryFavors[],
}

export interface MimicryPage extends BasePageModel{
    search_name: string
}