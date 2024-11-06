<template>
    <div style="display: flex; justify-content: space-between; width: 100%; padding: 0 0 10px 0">
        <el-button text bg :icon="Plus" @click="add">
            新增
        </el-button>
        <el-select v-model="value" multiple placeholder="属性筛选" style="width: 300px;margin-left: 10px; margin-right: auto;" @change="filterWeaponAttributes">
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
            <template #tag>
                <img v-for="item in value" :src="findAttributeImgSrcByValue(item)" :alt="findAttributeImgSrcByValue(item)"  style="width: 18px; height: 18px;margin-right: 5px">
            </template>
        </el-select>

        <div style="display: flex; gap: 5px;">
            <el-button text bg :icon="Edit" @click="edit">
                修改
            </el-button>
            <el-button text bg :icon="Delete">
                删除
            </el-button>
            <el-button :icon="RefreshRight" circle @click="queryList"/>
        </div>
    </div>

    <el-table ref="formRef" :data="tableData" style="width: 100%; height: 100%;" size="large" >
        <el-table-column type="selection"  width="55"/>
        <el-table-column fixed prop="armsName" label="武器名称" width="150"/>
        <el-table-column prop="armsId" label="武器ID" width="120"/>
        <el-table-column prop="armsAttribute" label="武器属性" width="120">
            <template #default="scope">
                <div style="display: flex; align-items: center;">
                    <img  :src="findAttributeImgSrcByValue(scope.row.armsAttribute)" :alt="findAttributeImgSrcByValue(scope.row.armsAttribute)"  style="width: 18px; height: 18px;margin-right: 5px">
                    <span>{{ scope.row.armsAttribute }} </span>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="armsType" label="武器定位" width="120">
            <template #default="scope">
                <div style="display: flex; align-items: center;">
                    <img  :src="findTypeImgSrcByValue(scope.row.armsType)" :alt="findTypeImgSrcByValue(scope.row.armsType)"  style="width: 18px; height: 18px;margin-right: 5px">
                    <span>{{ scope.row.armsType }} </span>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="armsThumbnailUrl" label="武器缩略图" width="120"/>
        <el-table-column prop="armsDescription" label="武器描述" min-width="300"/>
        <el-table-column fixed="right" label="操作" width="120" header-align="center">
            <template #default>
                <el-button link type="primary" size="small" @click="handleClick">
                    Detail
                </el-button>
                <el-button link type="primary" size="small">Edit</el-button>
            </template>
        </el-table-column>
    </el-table>

    <div style="display: flex; justify-content: flex-end; padding: 20px 0 0;">
        <el-pagination
                :page-size="10"
                background
                layout="prev, pager, next"
                :total="1000"
        />
    </div>

    <el-dialog v-model="dialogFormVisible" title="Arms Info" width="1200"  draggable  align-center destroy-on-close>
        <WeaponsFormModal :form-data-id="rowDataId" :is-edit="isEdit" ref="weaponsFormModalRef" @save="queryList"/>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click="saveFormData">
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>

</template>

<script lang="ts" setup>
import {Delete, Edit, Plus, RefreshRight} from "@element-plus/icons-vue";
import {WeaponsFormModal} from './components'
import {onMounted, reactive, ref} from "vue";
import {ArmsPage, weaponAttributes, weaponType} from '@/types/hotta/arms/basic-info'
import {ElMessage} from "element-plus";
import {ArmsAPI} from "@/api/hotta/arms";
import type {ItemsBasic,ArmsInfo } from '@/types/hotta/arms/basic-info'

const dialogFormVisible = ref(false)

const weaponsFormModalRef = ref()
const formRef = ref()

const rowDataId = ref(null)
const isEdit = ref('')
const value = ref<string[]>([])
let tableData = reactive<ArmsInfo[]>([])
const armsQueryParams = ref<ArmsPage>({page:1,pageSize:10,attributeType:''})

const handleClick = () => {
    console.log('click')
}



const findAttributeImgSrcByValue = (value: string) : string =>{
    return weaponAttributes.find(n=>n.value == value).src
}

const findTypeImgSrcByValue = (value: string) : string =>{
    return weaponType.find(n=>n.value == value).src
}


const filterWeaponAttributes = (value: string[]): void =>{
    debugger
    console.log(value)
    armsQueryParams.value.attributeType = value.join(',')
    console.log(armsQueryParams.value.attributeType)
}


const add = () => {
    weaponsFormModalRef.value
    isEdit.value = 'add'
    rowDataId.value = null
    dialogFormVisible.value = true
}

const edit = () => {
    const editList = formRef.value.getSelectionRows()
    if(editList.length == 0 || editList.length > 1){
        ElMessage.warning('仅能选择一条数据修改！');
    }
}

const queryList = ()=>{
    ArmsAPI.selectAllArmsInfo(armsQueryParams.value).then(request=>{
        tableData.splice(0, tableData.length, ...request.data);
    })
    dialogFormVisible.value = false
}

const saveFormData=()=>{
    weaponsFormModalRef.value.save()
}

onMounted(() => queryList())

</script>


<style>
</style>

