

export interface NuoCoinsTaskType {
    taskTypeId: string
    taskTypeRegion: string,
    taskTypeNpc: string,
    taskTypePosition: string,
    taskTypeDetails: string,
    taskTypeReward: string,
    delFlag: string
}


export interface NuoCoinsTaskWeekly {
    taskWeeklyId: string
    taskWeeklyDate: string,
    delFlag: string
    weeklyDetailIds: string[]
}




