<script setup lang="ts">

import {Delete, Edit, Plus, RefreshRight} from "@element-plus/icons-vue";
import {NuoCoinsTaskWeeklyModal} from './components'
import {onMounted, reactive, ref, watch} from "vue";

import {Action, ElMessage, ElMessageBox} from "element-plus";
import {NuoCoinsAPI} from "@/api/hotta/nuo-coins";
import {NuoCoinsTaskWeekly} from "@/types/hotta/nuo-coins/basic-info";
import {BasePageModel} from "@/types/common/page";
const dialogFormVisible = ref(false)
const nuoCoinsQueryParams = ref<BasePageModel>({page:1,page_size:10})
let tableData = reactive<NuoCoinsTaskWeekly[]>([])
const formTotal = ref<number>(0)
const loading = ref(false)
const dialogName =ref('')
const nuoCoinsTaskWeeklyModalRef = ref()
const rowDataId = ref(null)
const isEdit = ref('')
const formRef = ref()

const queryList = ()=>{
  loading.value = true
  NuoCoinsAPI.selectPageNuoCoinsWeeklyInfo(nuoCoinsQueryParams.value).then(request=>{
    tableData.splice(0, tableData.length, ...request.data.data);
    formTotal.value = request.data.total || 0
    loading.value = false
  })
  dialogFormVisible.value = false
}

const add = () => {
  nuoCoinsTaskWeeklyModalRef.value
  dialogName.value = "TaskWeekly Info - ADD"
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
  rowDataId.value = editList[0].taskWeeklyId
  dialogName.value = "TaskWeekly Info - EDIT"
  isEdit.value = 'edit'
  dialogFormVisible.value = true
}



const deletes = () => {
  const editList = formRef.value.getSelectionRows()
  if(editList.length == 0){
    ElMessage.warning('还没有选数据！');
    return
  }

  ElMessageBox.confirm(
      '要删这些数据吗?',
      '选择',
      {
        distinguishCancelAndClose: true,
        cancelButtonText: '取消',
        confirmButtonText: '删除',
        type: 'warning',
      }
  )
      .then(() => {
        let temList = []
        editList.map((n: NuoCoinsTaskWeekly)=>temList.push(n.taskWeeklyId))
        NuoCoinsAPI.deleteNuoCoinsWeeklyInfo({taskWeeklyIds:temList}).then(request=>{
          if(request.code === 200){
            ElMessage.success(request.message)
            queryList()
          }else{
            ElMessage.error(request.message)
          }
        })

      })
      .catch((action: Action) => {
        ElMessage({
          type: 'info',
          message:
              action === 'cancel' ? '取消操作' : '取消操作',
        })
      })

}

const view = (row: NuoCoinsTaskWeekly) =>{
  rowDataId.value = row.taskWeeklyId
  dialogName.value = "TaskWeekly Info - VIEW"
  isEdit.value = 'view'
  dialogFormVisible.value = true
}


const saveFormData=()=>{
  nuoCoinsTaskWeeklyModalRef.value.save()
}


const formatDate = (row, column, cellValue)=> {
  if (!cellValue) return ''; // 如果值为空则返回空
  const date = new Date(cellValue);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，所以要加1
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}


watch(
    () => nuoCoinsQueryParams.value.page,
    async () => {
      queryList()
    },
    {immediate: true,deep:true}
)


// onMounted(() => queryList())
</script>

<template>
  <div style="display: flex; justify-content: space-between; width: 100%; padding: 0 0 10px 0">
    <el-button text bg :icon="Plus" @click="add">
      新增
    </el-button>

    <div style="display: flex; gap: 5px;">
      <el-button text bg :icon="Edit" @click="edit">
        修改
      </el-button>
      <el-button text bg :icon="Delete" @click="deletes">
        删除
      </el-button>
      <el-button :icon="RefreshRight" circle @click="queryList"/>
    </div>
  </div>


  <el-table ref="formRef" :data="tableData" style="width: 100%; height: 100%;" size="large" v-loading="loading" @row-dblclick="view">
    <el-table-column type="selection"  width="55"/>
    <el-table-column fixed prop="taskWeeklyId" label="任务ID" />
    <el-table-column
        prop="taskWeeklyDate"
        label="发布时间"
        :formatter="formatDate"
    />
  </el-table>

  <div style="display: flex; justify-content: flex-end; padding: 20px 0 0;">
    <el-pagination
        :page-size="10"
        background
        layout="prev, pager, next"
        :total="formTotal"
        v-model:current-page="nuoCoinsQueryParams.page"
    />
  </div>

  <el-dialog v-model="dialogFormVisible" :title="dialogName" width="800"  draggable  align-center destroy-on-close :close-on-click-modal="false">
    <NuoCoinsTaskWeeklyModal :form-data-id="rowDataId" :is-edit="isEdit" ref="nuoCoinsTaskWeeklyModalRef" @save="queryList"/>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveFormData" v-if="isEdit != 'view'">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>

</template>

<style scoped>

</style>