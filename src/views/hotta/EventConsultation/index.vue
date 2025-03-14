<script setup lang="ts">

import {Delete, Edit, Plus, RefreshRight} from "@element-plus/icons-vue";
import {EventConsultationFormModal} from './components'
import {onMounted, reactive, ref, watch} from "vue";

import {EventConsultationInfo, EventConsultationPage} from "@/types/hotta/event-consultation/basic-info";
import {EventConsultationAPI} from "@/api/hotta/event-consultation";
import {Action, ElMessage, ElMessageBox} from "element-plus";
import {Search } from '@element-plus/icons-vue'
const dialogFormVisible = ref(false)
const eventConsultationQueryParams = ref<EventConsultationPage>({page:1,page_size:10,search_name:''})
let tableData = reactive<EventConsultationInfo[]>([])
const formTotal = ref<number>(0)
const loading = ref(false)
const dialogName =ref('')
const eventConsultationFormModalRef = ref()
const rowDataId = ref(null)
const isEdit = ref('')
const formRef = ref()

const queryList = ()=>{
  loading.value = true
  EventConsultationAPI.selectPageEventConsultationInfo(eventConsultationQueryParams.value).then(request=>{
    tableData.splice(0, tableData.length, ...request.data.data);
    formTotal.value = request.data.total || 0
    loading.value = false
  })
  dialogFormVisible.value = false
}

const add = () => {
  eventConsultationFormModalRef.value
  dialogName.value = "EventConsultation Info - ADD"
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
  rowDataId.value = editList[0].consultationId
  dialogName.value = "EventConsultation Info - EDIT"
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
        editList.map((n: EventConsultationInfo)=>temList.push(n.consultationId))
        EventConsultationAPI.deleteEventConsultationInfo({eventConsultationIds:temList}).then(request=>{
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

const view = (row: EventConsultationInfo) =>{
  rowDataId.value = row.consultationId
  dialogName.value = "EventConsultation Info - VIEW"
  isEdit.value = 'view'
  dialogFormVisible.value = true
}


const saveFormData=()=>{
  eventConsultationFormModalRef.value.save()
}


watch(
    () => eventConsultationQueryParams.value.page,
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

    <el-input
        v-model="eventConsultationQueryParams.search_name"
        style="width: 200px;margin-left: 10px; margin-right: auto;"
        placeholder="搜索名称"
    >
      <template #suffix>
        <el-icon class="el-input__icon" style="cursor: pointer;" @click="queryList"><search/></el-icon>
      </template>
    </el-input>



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
    <el-table-column fixed prop="consultationTitle" label="活动标题" width="150"/>
    <el-table-column prop="consultationId" label="活动ID" width="120"/>
    <el-table-column prop="consultationThumbnailUrl" label="活动封面" width="120">
      <template #default="scope">
        <el-image  preview-teleported :src="scope.row.consultationThumbnailUrl">
          <template #error>
            <div class="image-slot">
              <el-image preview-teleported src="src/assets/img/zwtp.jpg"/>
            </div>
          </template>
        </el-image>
      </template>
    </el-table-column>
    <el-table-column prop="consultationDescription" label="活动描述" min-width="300"/>
  </el-table>

  <div style="display: flex; justify-content: flex-end; padding: 20px 0 0;">
    <el-pagination
        :page-size="10"
        background
        layout="prev, pager, next"
        :total="formTotal"
        v-model:current-page="eventConsultationQueryParams.page"
    />
  </div>

  <el-dialog v-model="dialogFormVisible" :title="dialogName" width="1200"  draggable  align-center destroy-on-close :close-on-click-modal="false">
    <EventConsultationFormModal :form-data-id="rowDataId" :is-edit="isEdit" ref="eventConsultationFormModalRef" @save="queryList"/>
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