

export interface YuCoinsTaskType {
    taskTypeId: string
    taskTypeRegion: string,
    taskTypeNpc: string,
    taskTypePosition: string,
    taskTypeDetails: string,
    taskTypeReward: string,
    delFlag: string
}


export interface YuCoinsTaskWeekly {
    taskWeeklyId: string
    taskWeeklyDate: string,
    delFlag: string
    weeklyDetailIds: string[]
}




