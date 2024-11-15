import {BasePageModel} from "@/types/common/page";

export const weaponAttributes = [
    {
        label: '物理',
        value: '物理',
        src: new URL('@/assets/hotta/weapons-attribute-icon/Phy.png', import.meta.url).href
    },
    {
        label: '火焰',
        value: '火焰',
        src: new URL('@/assets/hotta/weapons-attribute-icon/fire.png', import.meta.url).href
    },
    {
        label: '寒冰',
        value: '寒冰',
        src: new URL('@/assets/hotta/weapons-attribute-icon/ice.png', import.meta.url).href
    },
    {
        label: '雷电',
        value: '雷电',
        src: new URL('@/assets/hotta/weapons-attribute-icon/elec.png', import.meta.url).href
    },
    {
        label: '异能',
        value: '异能',
        src: new URL('@/assets/hotta/weapons-attribute-icon/Extr.png', import.meta.url).href
    },
    {
        label: '物火',
        value: '物火',
        src: new URL('@/assets/hotta/weapons-attribute-icon/phy-fire.png', import.meta.url).href
    },
    {
        label: '火物',
        value: '火物',
        src: new URL('@/assets/hotta/weapons-attribute-icon/fire-phy.png', import.meta.url).href
    },
    {
        label: '冰雷',
        value: '冰雷',
        src: new URL('@/assets/hotta/weapons-attribute-icon/ice-elec.png', import.meta.url).href
    },
    {
        label: '雷冰',
        value: '雷冰',
        src: new URL('@/assets/hotta/weapons-attribute-icon/elec-ice.png', import.meta.url).href
    }
]



export const weaponType = [
    {
        label: '坚毅',
        value: '坚毅',
        src: new URL('@/assets/hotta/weapons-type-icon/tt.png', import.meta.url).href
    },
    {
        label: '恩赐',
        value: '恩赐',
        src: new URL('@/assets/hotta/weapons-type-icon/nn.png', import.meta.url).href
    },
    {
        label: '强攻',
        value: '强攻',
        src: new URL('@/assets/hotta/weapons-type-icon/cc.png', import.meta.url).href
    }
]


export interface ItemsBasic {
    itemsId: string;
    itemsName: string;
    itemsDescribe: string
}

export interface ArmsInfo {
    armsId: string;
    armsName: string;
    armsRarity: string;
    armsType: string;
    armsAttribute: string;
    armsThumbnailUrl: string;
    armsOverwhelmed: number;
    armsChargingEnergy: number;
    armsDescription:string;
    armsAggressivityStart: number;
    armsBloodVolumeStart: number;
    armsDefenseCapabilityStart: number;
    armsCriticalStrikeStart: number;
    armsAggressivityEnd: number;
    armsBloodVolumeEnd: number;
    armsDefenseCapabilityEnd: number;
    armsCriticalStrikeEnd: number;
    armsCharacteristics: ItemsBasic[];
    armsExclusives: ItemsBasic[];
    armsStarRatings: ItemsBasic[];
    armsPrimaryAttacks: ItemsBasic[];
    armsDodgeAttacks: ItemsBasic[];
    armsSkillAttacks: ItemsBasic[];
    armsCooperationAttacks: ItemsBasic[];
}


export interface ArmsPage extends BasePageModel{
    attribute_type: string;
}

export interface ArmsIdName{
    armsId: number;
    armsName: string;
}

export interface MimicryIdName{
    mimicryId: number;
    mimicryName: string;
}

export interface WillpowerIdName{
    willpowerId: number;
    willpowerName: string;
}

export interface ArmsMimicryWillpower {
    armsId: number;
    mimicryId: number;
    willpowerId: number;
}


export interface ArmsMimicryWillpowerResponse{
    armsIdNames: ArmsIdName[];
    mimicryIdNames: MimicryIdName[];
    willpowerIdNames: WillpowerIdName[];
}