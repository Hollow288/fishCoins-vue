<script setup lang="ts">

import {Delete, Edit, Plus, RefreshRight} from "@element-plus/icons-vue";
import {WillpowerFormModal} from './components'
import {onMounted, reactive, ref} from "vue";
const dialogFormVisible = ref(false)
import {WillpowerInfo, WillpowerPage} from "@/types/hotta/willpower/basic-info";
import {WillpowerAPI} from "@/api/hotta/willpower";
const willpowerQueryParams = ref<WillpowerPage>({page:1,page_size:10,search_name:''})
let tableData = reactive<WillpowerInfo[]>([])
const formTotal = ref<number>(0)
const loading = ref(false)
const dialogName =ref('')
const willpowerFormModalRef = ref()
const rowDataId = ref(null)
const isEdit = ref('')

const queryList = ()=>{
  loading.value = true
  WillpowerAPI.selectPageWillpowerInfo(willpowerQueryParams.value).then(request=>{
    tableData.splice(0, tableData.length, ...request.data.data);
    formTotal.value = request.data.total || 0
    loading.value = false
  })
  dialogFormVisible.value = false
}

const add = () => {
  willpowerFormModalRef.value
  dialogName.value = "Willpower Info - ADD"
  isEdit.value = 'add'
  rowDataId.value = null
  dialogFormVisible.value = true
}

const saveFormData=()=>{
  willpowerFormModalRef.value.save()
}




onMounted(() => queryList())
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
    <el-table-column fixed prop="willpowerName" label="意志名称" width="150"/>
    <el-table-column prop="willpowerId" label="意志ID" width="120"/>
    <el-table-column prop="willpowerThumbnailUrl" label="意志缩略图" width="120">
      <template #default="scope">
        <el-image  preview-teleported :src="scope.row.willpowerThumbnailUrl">
          <template #error>
            <div class="image-slot">
              <el-image preview-teleported src="src/assets/img/zwtp.jpg"/>
            </div>
          </template>
        </el-image>
      </template>
    </el-table-column>
    <el-table-column prop="willpowerDescription" label="意志描述" min-width="300"/>
  </el-table>

  <div style="display: flex; justify-content: flex-end; padding: 20px 0 0;">
    <el-pagination
        :page-size="10"
        background
        layout="prev, pager, next"
        :total="formTotal"
        v-model:current-page="willpowerQueryParams.page"
    />
  </div>

  <el-dialog v-model="dialogFormVisible" :title="dialogName" width="1200"  draggable  align-center destroy-on-close>
    <WillpowerFormModal :form-data-id="rowDataId" :is-edit="isEdit" ref="willpowerFormModalRef" @save="queryList"/>
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