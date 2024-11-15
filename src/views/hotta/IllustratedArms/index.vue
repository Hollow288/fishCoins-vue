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
          <el-popconfirm title="要删除它们吗?" @confirm="deletes">
            <template #reference>
              <el-button text bg :icon="Delete" >
                删除
              </el-button>
            </template>
          </el-popconfirm>

            <el-button :icon="RefreshRight" circle @click="queryList"/>
        </div>
    </div>

    <el-table ref="formRef" :data="tableData" style="width: 100%; height: 100%;" size="large" v-loading="loading" @row-dblclick="view">
        <el-table-column type="selection"  width="55"/>
        <el-table-column fixed prop="armsName" label="武器名称" width="150"/>
        <el-table-column prop="armsId" label="武器ID" width="120"/>
        <el-table-column prop="armsAttribute" label="武器属性" width="120">
            <template #default="scope">
                <div style="display: flex; align-items: center;" v-if="scope.row.armsAttribute != null && scope.row.armsAttribute != ''">
                    <img  :src="findAttributeImgSrcByValue(scope.row.armsAttribute)" :alt="findAttributeImgSrcByValue(scope.row.armsAttribute)"  style="width: 18px; height: 18px;margin-right: 5px">
                    <span>{{ scope.row.armsAttribute }} </span>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="armsType" label="武器定位" width="120">
            <template #default="scope">
                <div style="display: flex; align-items: center;" v-if="scope.row.armsType != null && scope.row.armsType != ''">
                    <img  :src="findTypeImgSrcByValue(scope.row.armsType)" :alt="findTypeImgSrcByValue(scope.row.armsType)"  style="width: 18px; height: 18px;margin-right: 5px">
                    <span>{{ scope.row.armsType }} </span>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="armsThumbnailUrl" label="武器缩略图" width="120">
            <template #default="scope">
                <el-image  preview-teleported :src="scope.row.armsThumbnailUrl">
                    <template #error>
                        <div class="image-slot">
                            <el-image preview-teleported src="src/assets/img/zwtp.jpg"/>
                        </div>
                    </template>
                </el-image>
            </template>
        </el-table-column>
        <el-table-column prop="armsDescription" label="武器描述" min-width="300"/>
        <el-table-column fixed="right" label="绑定" width="155" header-align="center">
            <template #default="scope">
              <div style="display: flex;align-items: center;justify-content: center;">
                <el-button link  size="default" @click="handleClick(scope.row.armsId,scope.row.armsName)">意志&拟态</el-button>
              </div>
            </template>
        </el-table-column>
    </el-table>

    <div style="display: flex; justify-content: flex-end; padding: 20px 0 0;">
        <el-pagination
                :page-size="10"
                background
                layout="prev, pager, next"
                :total="formTotal"
                v-model:current-page="armsQueryParams.page"
        />
    </div>

    <el-dialog v-model="dialogFormVisible" :title="dialogName" width="1200"  draggable  align-center destroy-on-close :close-on-click-modal="false">
        <ArmsFormModal :form-data-id="rowDataId" :is-edit="isEdit" ref="armsFormModalRef" @save="queryList"/>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="saveFormData" v-if="isEdit != 'view'">
                    保存
                </el-button>
            </div>
        </template>
    </el-dialog>


    <el-dialog v-model="dialogFormVisibleBind" title="绑定" width="1000"  draggable  align-center destroy-on-close :close-on-click-modal="false">
      <BindFormModal :form-data-id="rowBindDataId" :form-data-name="rowBindDataName"  ref="bindFormModalRef"  @save="dialogFormVisibleBind = false"/>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisibleBind = false">取消</el-button>
          <el-button type="primary" @click="saveBindFormData" >
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>

</template>

<script lang="ts" setup>
import {Delete, Edit, Plus, RefreshRight} from "@element-plus/icons-vue";
import {ArmsFormModal, BindFormModal} from './components'
import {reactive, ref, watch} from "vue";
import {ArmsPage, weaponAttributes, weaponType} from '@/types/hotta/arms/basic-info'
import {ElMessage} from "element-plus";
import {ArmsAPI} from "@/api/hotta/arms";
import type {ArmsInfo } from '@/types/hotta/arms/basic-info'

const dialogFormVisible = ref(false)
const dialogFormVisibleBind = ref(false)

const armsFormModalRef = ref()
const bindFormModalRef = ref()
const formRef = ref()

const rowDataId = ref(null)
const rowBindDataId = ref(null)
const rowBindDataName = ref('')
const isEdit = ref('')
const value = ref<string[]>([])
let tableData = reactive<ArmsInfo[]>([])
const armsQueryParams = ref<ArmsPage>({page:1,page_size:10,attribute_type:''})
const formTotal = ref<number>(0)
const loading = ref(false)
const dialogName =ref('')

const handleClick = (armsId:number,armsName:string) => {
  rowBindDataId.value = armsId
  rowBindDataName.value = armsName
  dialogFormVisibleBind.value = true
}

const queryList = ()=>{
  loading.value = true
  ArmsAPI.selectPageArmsInfo(armsQueryParams.value).then(request=>{
    tableData.splice(0, tableData.length, ...request.data.data);
    formTotal.value = request.data.total || 0
    loading.value = false
  })
  dialogFormVisible.value = false
}



const findAttributeImgSrcByValue = (value: string) : string =>{
    return weaponAttributes.find(n=>n.value == value).src
}

const findTypeImgSrcByValue = (value: string) : string =>{
    return weaponType.find(n=>n.value == value).src
}


const filterWeaponAttributes = (value: string[]): void =>{
    armsQueryParams.value.attribute_type = value.join(',')
    queryList()
}


const add = () => {
    armsFormModalRef.value
    dialogName.value = "Arms Info - ADD"
    isEdit.value = 'add'
    rowDataId.value = null
    dialogFormVisible.value = true
}

const edit = () => {
    const editList = formRef.value.getSelectionRows()
    if(editList.length == 0 || editList.length > 1){
        ElMessage.warning('仅能选择一条数据修改！');
        return
    }
    rowDataId.value = editList[0].armsId
    dialogName.value = "Arms Info - EDIT"
    isEdit.value = 'edit'
    dialogFormVisible.value = true
}



// const handleCurrentChange = (val: number) => {
//     armsQueryParams.value.page = val
//     queryList()
// }




const deletes = () => {
  const editList = formRef.value.getSelectionRows()
  if(editList.length == 0){
    ElMessage.warning('还没有选数据！');
    return
  }
  let temList = []
  editList.map((n: ArmsInfo)=>temList.push(n.armsId))
  ArmsAPI.deleteArmsInfo({armsIds:temList}).then(request=>{
    if(request.code === 200){
      ElMessage.success(request.message)
      queryList()
    }else{
      ElMessage.error(request.message)
    }
  })

}


const view = (row: ArmsInfo) =>{
  rowDataId.value = row.armsId
  dialogName.value = "Arms Info - VIEW"
  isEdit.value = 'view'
  dialogFormVisible.value = true
}


const saveFormData=()=>{
    armsFormModalRef.value.save()
}

const saveBindFormData=()=>{
    bindFormModalRef.value.save()
}

watch(
    () => armsQueryParams.value.page,
    async () => {
       queryList()
    },
    {immediate: true,deep:true}
)

// onMounted(() => queryList())

</script>


<style>
</style>

