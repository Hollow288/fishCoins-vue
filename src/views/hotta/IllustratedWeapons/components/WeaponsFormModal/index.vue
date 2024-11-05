<script setup lang="ts">

import {Delete, Plus} from "@element-plus/icons-vue";
import {reactive, ref} from "vue";
import {FormInstance, FormRules, UploadProps} from "element-plus";
import {v4 as uuidv4} from 'uuid';
import {weaponAttributes, weaponType} from "@/types/hotta/arms/basic-info";

const armsCharacteristics = ref()
const armsExclusives = ref()
const armsStarRatings = ref()
const armsPrimaryAttacks = ref()
const armsDodgeAttacks = ref()
const armsSkillAttacks = ref()
const armsCooperationAttacks = ref()
const formRef = ref<FormInstance | null>(null);

const {formDataId, isEdit} = defineProps({
    formDataId: {
        type: String,
    },
    isEdit: {
        type: Boolean,
        required: false
    }
});

interface ItemsBasic {
    itemsId: string
    itemsName: string,
    itemsDescribe: string
}

interface ArmsInfo {
    armsId: string,
    armsName: string,
    armsRarity: string,
    armsType: string,
    armsAttribute: string,
    armsOverwhelmed: number,
    armsChargingEnergy: number,
    armsAggressivityStart: number,
    armsBloodVolumeStart: number,
    armsDefenseCapabilityStart: number,
    armsCriticalStrikeStart: number,
    armsAggressivityEnd: number,
    armsBloodVolumeEnd: number,
    armsDefenseCapabilityEnd: number,
    armsCriticalStrikeEnd: number,
    armsCharacteristics: ItemsBasic[],
    armsExclusives: ItemsBasic[],
    armsStarRatings: ItemsBasic[],
    armsPrimaryAttacks: ItemsBasic[],
    armsDodgeAttacks: ItemsBasic[],
    armsSkillAttacks: ItemsBasic[],
    armsCooperationAttacks: ItemsBasic[]
}

const formData = reactive<ArmsInfo>({
    armsId: '',
    armsName: '',
    armsRarity: '',
    armsType: '',
    armsAttribute: '',
    armsOverwhelmed: null,
    armsChargingEnergy: null,
    armsAggressivityStart: null,
    armsBloodVolumeStart: null,
    armsDefenseCapabilityStart: null,
    armsCriticalStrikeStart: null,
    armsAggressivityEnd: null,
    armsBloodVolumeEnd: null,
    armsDefenseCapabilityEnd: null,
    armsCriticalStrikeEnd: null,
    armsCharacteristics: [],
    armsExclusives: [],
    armsStarRatings: [],
    armsPrimaryAttacks: [],
    armsDodgeAttacks: [],
    armsSkillAttacks: [],
    armsCooperationAttacks: []
})


const rules = reactive<FormRules<ArmsInfo>>({
    armsName: [
        { required: true, message: '请输入名称', trigger: 'blur' },
    ]
})


const findAttributeImgSrcByValue = (value: string) : string =>{
    return weaponAttributes.find(n=>n.value == value).src
}

const findTypeImgSrcByValue = (value: string) : string =>{
    return weaponType.find(n=>n.value == value).src
}



const emit = defineEmits<{
    (e: 'save'): void
}>()


const formLabelWidth = '100px'

const imageUrl = ref('')

const getRowKey = (row: ItemsBasic) => {
    return row.itemsId;
}

const addOneRow = (params: ItemsBasic[]) => {
    const temItemsBasic: ItemsBasic = {itemsId: uuidv4(), itemsName: '', itemsDescribe: ''}
    params.push(temItemsBasic)
}

const deleteArmsCharacteristics = () => {
    const selectedIds = armsCharacteristics.value.getSelectionRows().map(row => row.itemsId);
    formData.armsCharacteristics = formData.armsCharacteristics.filter(item => !selectedIds.includes(item.itemsId));
}

const deleteArmsExclusives = () => {
    const selectedIds = armsExclusives.value.getSelectionRows().map(row => row.itemsId);
    formData.armsExclusives = formData.armsExclusives.filter(item => !selectedIds.includes(item.itemsId));
}

const deleteArmsStarRatings = () => {
    const selectedIds = armsStarRatings.value.getSelectionRows().map(row => row.itemsId);
    formData.armsStarRatings = formData.armsStarRatings.filter(item => !selectedIds.includes(item.itemsId));
}

const deleteArmsPrimaryAttacks = () => {
    const selectedIds = armsPrimaryAttacks.value.getSelectionRows().map(row => row.itemsId);
    formData.armsPrimaryAttacks = formData.armsPrimaryAttacks.filter(item => !selectedIds.includes(item.itemsId));
}

const deleteArmsDodgeAttacks = () => {
    const selectedIds = armsDodgeAttacks.value.getSelectionRows().map(row => row.itemsId);
    formData.armsDodgeAttacks = formData.armsDodgeAttacks.filter(item => !selectedIds.includes(item.itemsId));
}

const deleteArmsSkillAttacks = () => {
    const selectedIds = armsSkillAttacks.value.getSelectionRows().map(row => row.itemsId);
    formData.armsSkillAttacks = formData.armsSkillAttacks.filter(item => !selectedIds.includes(item.itemsId));
}

const deleteArmsCooperationAttacks = () => {
    const selectedIds = armsCooperationAttacks.value.getSelectionRows().map(row => row.itemsId);
    formData.armsCooperationAttacks = formData.armsCooperationAttacks.filter(item => !selectedIds.includes(item.itemsId));
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        ElMessage.error('Avatar picture must be JPG format!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('Avatar picture size can not exceed 2MB!')
        return false
    }
    return true
}

const handleChange = (file) => {
    imageUrl.value = URL.createObjectURL(file.raw!)
};

const save = async () => {
    if (!formRef.value) return;
    await formRef.value.validate((valid, fields) => {
        if (valid) {
            console.log("这是子表单的save");
            console.log(formData);
            emit('save');
            console.log('submit!');
        } else {
            console.log('error submit!', fields);
        }
    });
};

defineExpose({
    save
})


</script>

<template>
    <el-form ref="formRef" :model="formData" style="width: 100%;height: 600px;overflow-y: auto;padding: 5px" :rules="rules">
        <el-divider content-position="left">基础信息</el-divider>
        <el-row>
            <el-col :span="8">
                <el-form-item label="缩略图" :label-width="formLabelWidth" style="display: flex">
                    <el-upload
                            class="avatar-uploader"
                            :show-file-list="false"
                            :limit="1"
                            :before-upload="beforeAvatarUpload"
                            :on-change="handleChange"
                    >
                        <img v-if="imageUrl" :src="imageUrl" class="avatar"/>
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus/>
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="武器名称" :label-width="formLabelWidth" prop="armsName">
                            <el-input v-model="formData.armsName" placeholder="武器名称"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="武器定位" :label-width="formLabelWidth">
<!--                            <el-input v-model="formData.armsType" placeholder="武器定位"/>-->
                                <el-select  v-model="formData.armsType"  placeholder="武器定位"  >
                                    <template #label="{ value }">
                                        <div style="display: flex; align-items: center;">
                                            <img  :src="findTypeImgSrcByValue(formData.armsType)" :alt="findTypeImgSrcByValue(formData.armsType)"  style="width: 18px; height: 18px;margin-right: 5px">
                                            <span>{{ value }} </span>
                                        </div>
                                    </template>
                                    <el-option
                                        v-for="item in weaponType"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                        <div style="display: flex; align-items: center;">
                                            <img :src="item.src" :alt="item.src"  style="width: 18px; height: 18px;margin-right: 5px">
                                            <span>{{ item.label }}</span>
                                        </div>
                                    </el-option>
                                </el-select>

                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="武器破防" :label-width="formLabelWidth">
                            <el-input v-model="formData.armsOverwhelmed" placeholder="武器破防"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="8">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="武器稀有度" :label-width="formLabelWidth">
                            <el-input v-model="formData.armsRarity" placeholder="武器稀有度"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="武器属性" :label-width="formLabelWidth">
                            <el-select v-model="formData.armsAttribute"  placeholder="武器属性"  >
                                <template #label="{ value }">
                                    <div style="display: flex; align-items: center;">
                                        <img  :src="findAttributeImgSrcByValue(formData.armsAttribute)" :alt="findAttributeImgSrcByValue(formData.armsAttribute)"  style="width: 18px; height: 18px;margin-right: 5px">
                                        <span>{{ value }} </span>
                                    </div>
                                </template>
                                <el-option
                                    v-for="item in weaponAttributes"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                >
                                    <div style="display: flex; align-items: center;">
                                        <img :src="item.src" :alt="item.src"  style="width: 18px; height: 18px;margin-right: 5px">
                                        <span>{{ item.label }}</span>
                                    </div>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="武器充能" :label-width="formLabelWidth">
                            <el-input v-model="formData.armsChargingEnergy" placeholder="武器充能"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-divider content-position="left">升级属性</el-divider>
        <el-row>
            <el-col :span="6">
                <el-form-item label="初始攻击" :label-width="formLabelWidth">
                    <el-input v-model="formData.armsAggressivityStart" placeholder="初始攻击"/>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="初始血量" :label-width="formLabelWidth">
                    <el-input v-model="formData.armsBloodVolumeStart" placeholder="初始血量"/>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="初始全抗" :label-width="formLabelWidth">
                    <el-input v-model="formData.armsDefenseCapabilityStart" placeholder="初始全抗"/>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="初始暴击" :label-width="formLabelWidth">
                    <el-input v-model="formData.armsCriticalStrikeStart" placeholder="初始暴击"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6">
                <el-form-item label="满级攻击" :label-width="formLabelWidth">
                    <el-input v-model="formData.armsAggressivityEnd" placeholder="满级攻击"/>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="满级血量" :label-width="formLabelWidth">
                    <el-input v-model="formData.armsBloodVolumeEnd" placeholder="满级血量"/>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="满级全抗" :label-width="formLabelWidth">
                    <el-input v-model="formData.armsDefenseCapabilityEnd" placeholder="满级全抗"/>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="满级暴击" :label-width="formLabelWidth">
                    <el-input v-model="formData.armsCriticalStrikeEnd" placeholder="满级暴击"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-divider content-position="left">武器特质</el-divider>
        <el-table ref="armsCharacteristics" :data="formData.armsCharacteristics" style="width: 100%" max-height="300" :row-key="getRowKey">
            <el-table-column type="selection" width="55" />
            <el-table-column label="名称" width="300">
                <template #default="scope">
                    <el-input v-model="scope.row.itemsName" placeholder="名称"/>
                </template>
            </el-table-column>
            <el-table-column label="描述">
                <template #header>
                    <div style="display: flex; align-items: center;">
                        <span style="margin-right: auto">描述</span>
                        <el-button text bg :icon="Plus" @click="addOneRow(formData.armsCharacteristics)">
                            新增
                        </el-button>
                        <el-button text bg :icon="Delete" @click="deleteArmsCharacteristics">
                            删除
                        </el-button>
                    </div>

                </template>
                <template #default="scope">
                    <el-input type="textarea" v-model="scope.row.itemsDescribe" placeholder="描述"
                              autosize="autosize"/>
                </template>
            </el-table-column>
        </el-table>
        <el-divider content-position="left">武器专属</el-divider>
        <el-table ref="armsExclusives" :data="formData.armsExclusives" style="width: 100%" max-height="300" :row-key="getRowKey">
            <el-table-column type="selection"  width="55"/>
            <el-table-column label="名称" width="300">
                <template #default="scope">
                    <el-input v-model="scope.row.itemsName" placeholder="名称"/>
                </template>
            </el-table-column>
            <el-table-column label="描述">
                <template #header>
                    <div style="display: flex; align-items: center;">
                        <span style="margin-right: auto">描述</span>
                        <el-button text bg :icon="Plus" @click="addOneRow(formData.armsExclusives)">
                            新增
                        </el-button>
                        <el-button text bg :icon="Delete" @click="deleteArmsExclusives">
                            删除
                        </el-button>
                    </div>

                </template>
                <template #default="scope">
                    <el-input type="textarea" v-model="scope.row.itemsDescribe" placeholder="描述"
                              autosize="autosize"/>
                </template>
            </el-table-column>
        </el-table>
        <el-divider content-position="left">武器星级</el-divider>
        <el-table ref="armsStarRatings" :data="formData.armsStarRatings" style="width: 100%" max-height="300" :row-key="getRowKey">
            <el-table-column type="selection"  width="55"/>
            <el-table-column label="名称" width="300">
                <template #default="scope">
                    <el-input v-model="scope.row.itemsName" placeholder="名称"/>
                </template>
            </el-table-column>
            <el-table-column label="描述">
                <template #header>
                    <div style="display: flex; align-items: center;">
                        <span style="margin-right: auto">描述</span>
                        <el-button text bg :icon="Plus" @click="addOneRow(formData.armsStarRatings)">
                            新增
                        </el-button>
                        <el-button text bg :icon="Delete" @click="deleteArmsStarRatings">
                            删除
                        </el-button>
                    </div>

                </template>
                <template #default="scope">
                    <el-input type="textarea" v-model="scope.row.itemsDescribe" placeholder="描述"
                              autosize="autosize"/>
                </template>
            </el-table-column>
        </el-table>
        <el-divider content-position="left">普通攻击</el-divider>
        <el-table ref="armsPrimaryAttacks" :data="formData.armsPrimaryAttacks" style="width: 100%" max-height="300" :row-key="getRowKey">
            <el-table-column type="selection" width="55"/>
            <el-table-column label="名称" width="300">
                <template #default="scope">
                    <el-input v-model="scope.row.itemsName" placeholder="名称"/>
                </template>
            </el-table-column>
            <el-table-column label="描述">
                <template #header>
                    <div style="display: flex; align-items: center;">
                        <span style="margin-right: auto">描述</span>
                        <el-button text bg :icon="Plus" @click="addOneRow(formData.armsPrimaryAttacks)">
                            新增
                        </el-button>
                        <el-button text bg :icon="Delete" @click="deleteArmsPrimaryAttacks">
                            删除
                        </el-button>
                    </div>

                </template>
                <template #default="scope">
                    <el-input type="textarea" v-model="scope.row.itemsDescribe" placeholder="描述"
                              autosize="autosize"/>
                </template>
            </el-table-column>
        </el-table>
        <el-divider content-position="left">闪避攻击</el-divider>
        <el-table ref="armsDodgeAttacks" :data="formData.armsDodgeAttacks" style="width: 100%" max-height="300" :row-key="getRowKey">
            <el-table-column type="selection" width="55"/>
            <el-table-column label="名称" width="300">
                <template #default="scope">
                    <el-input v-model="scope.row.itemsName" placeholder="名称"/>
                </template>
            </el-table-column>
            <el-table-column label="描述">
                <template #header>
                    <div style="display: flex; align-items: center;">
                        <span style="margin-right: auto">描述</span>
                        <el-button text bg :icon="Plus" @click="addOneRow(formData.armsDodgeAttacks)">
                            新增
                        </el-button>
                        <el-button text bg :icon="Delete" @click="deleteArmsDodgeAttacks">
                            删除
                        </el-button>
                    </div>

                </template>
                <template #default="scope">
                    <el-input type="textarea" v-model="scope.row.itemsDescribe" placeholder="描述"
                              autosize="autosize"/>
                </template>
            </el-table-column>
        </el-table>
        <el-divider content-position="left">技能攻击</el-divider>
        <el-table ref="armsSkillAttacks" :data="formData.armsSkillAttacks" style="width: 100%" max-height="300" :row-key="getRowKey">
            <el-table-column type="selection" width="55"/>
            <el-table-column label="名称" width="300">
                <template #default="scope">
                    <el-input v-model="scope.row.itemsName" placeholder="名称"/>
                </template>
            </el-table-column>
            <el-table-column label="描述">
                <template #header>
                    <div style="display: flex; align-items: center;">
                        <span style="margin-right: auto">描述</span>
                        <el-button text bg :icon="Plus" @click="addOneRow(formData.armsSkillAttacks)">
                            新增
                        </el-button>
                        <el-button text bg :icon="Delete" @click="deleteArmsSkillAttacks">
                            删除
                        </el-button>
                    </div>

                </template>
                <template #default="scope">
                    <el-input type="textarea" v-model="scope.row.itemsDescribe" placeholder="描述"
                              autosize="autosize"/>
                </template>
            </el-table-column>
        </el-table>
        <el-divider content-position="left">联携攻击</el-divider>
        <el-table ref="armsCooperationAttacks" :data="formData.armsCooperationAttacks" style="width: 100%" max-height="300" :row-key="getRowKey">
            <el-table-column type="selection" width="55"/>
            <el-table-column label="名称" width="300">
                <template #default="scope">
                    <el-input v-model="scope.row.itemsName" placeholder="名称"/>
                </template>
            </el-table-column>
            <el-table-column label="描述">
                <template #header>
                    <div style="display: flex; align-items: center;">
                        <span style="margin-right: auto">描述</span>
                        <el-button text bg :icon="Plus" @click="addOneRow(formData.armsCooperationAttacks)">
                            新增
                        </el-button>
                        <el-button text bg :icon="Delete" @click="deleteArmsCooperationAttacks">
                            删除
                        </el-button>
                    </div>

                </template>
                <template #default="scope">
                    <el-input type="textarea" v-model="scope.row.itemsDescribe" placeholder="描述"
                              autosize="autosize"/>
                </template>
            </el-table-column>
        </el-table>
    </el-form>
</template>


<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    text-align: center;
}


/* 设置滚动条的宽度和颜色 */
::-webkit-scrollbar {
    width: 8px; /* 宽度 */
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
    background-color: #f1f1f1; /* 轨道背景色 */
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
    background-color: rgba(85, 85, 85, 0.4); /* 滑块颜色 */
    border-radius: 6px; /* 滑块圆角 */
}

/* 滚动条滑块悬停样式 */
::-webkit-scrollbar-thumb:hover {
    background-color: rgba(85, 85, 85, 0.3); /* 悬停时滑块颜色 */
}


</style>
