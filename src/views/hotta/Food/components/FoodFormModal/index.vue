<script setup lang="ts">

import {Delete, Plus} from "@element-plus/icons-vue";
import {reactive, ref, watch} from "vue";
import {ElMessage, FormInstance, FormRules, UploadProps} from "element-plus";
import {UploadAPI} from "@/api/upload";
import {Food, FoodBasic, FoodFormula} from "@/types/hotta/food/basic-info";
import {FoodAPI} from "@/api/hotta/food";
import {v4 as uuidv4} from "uuid";


const formRef = ref<FormInstance | null>(null);
const fileListRef = ref([])
// attach is edit ?
const fileIsEdit = ref<boolean>(false)
const foodFormula = ref()
const foodList = ref<FoodBasic[]>([])

const props = defineProps({
  formDataId: {
    type: Number,
  },
  isEdit: {
    type: String,
    required: false
  }
});


const formData = ref<Food>({
  foodId: '',
  foodName: '',
  foodRarity:'',
  foodType: '',
  foodEffect: '',
  foodSource: '',
  foodDescribe: '',
  foodThumbnailUrl: '',
  foodFormula: []
})


const rules = reactive<FormRules<Food>>({
  foodName: [
    {required: true, message: '请输入食品名称', trigger: 'blur'},
  ]
})


const addFoodFormulaRow = (params: FoodFormula[]) => {
  const temItemsBasic: FoodFormula = {formulaId: uuidv4(), foodId: '', ingredientsId: '',ingredientsNum: ''}
  params.push(temItemsBasic)
}

const deleteFoodFormula = () => {
  const selectedIds = foodFormula.value.getSelectionRows().map((row:FoodFormula) => row.formulaId);
  formData.value.foodFormula = formData.value.foodFormula.filter(item => !selectedIds.includes(item.formulaId));
}

const getRowKey = (row: FoodFormula) => {
  return row.formulaId;
}


const emit = defineEmits<{
  (e: 'save'): void
}>()


const formLabelWidth = '100px'


const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/webp') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

const handleChange = (file) => {
  formData.value.foodThumbnailUrl = URL.createObjectURL(file.raw!)
  fileIsEdit.value = true
  fileListRef.value.splice(0, fileListRef.value.length)
  fileListRef.value.push(file.raw)
};

const save = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      if(props.isEdit == 'add' || props.isEdit == 'edit'){
        formData.value.foodFormula.forEach(temp=>temp.formulaId = '');
        const {code, data, message} = await FoodAPI.addOrEditFoodInfo(formData.value)
        if (code === 200) {
          formData.value.foodId = data.foodId
        } else {
          ElMessage.error("保存失败了 "+message)
          return
        }

        if (fileListRef.value.length > 0 && fileIsEdit.value) {
          const fileData = new FormData()
          fileListRef.value.forEach(file => {
            fileData.append('file', file)
          })

          const {code, message} = await UploadAPI.uploadFoodImgFile(fileData, formData.value.foodId)
          if (code === 200) {
            ElMessage.success('保存成功')
            emit('save');
          } else {
            ElMessage.error(message)
            return
          }
        }else{
          ElMessage.success('保存成功')
          emit('save');
        }
      }

    } else {
      console.log('error submit!', fields);
    }
  });
};


watch(
    () => props,
    async (newValue) => {
      const foodRes = await FoodAPI.selectFoodBasic()
      foodList.value = foodRes.data.foodIdNames

      debugger
      if (newValue.formDataId && newValue.isEdit != 'add') {
        const request = await FoodAPI.selectIdFoodInfo(newValue.formDataId);
        formData.value = request.data
      }
    },
    {immediate: true, deep: true}
)


defineExpose({
  save
})


</script>

<template>
  <el-form ref="formRef" :model="formData" style="width: 100%;max-height: 750px;overflow-y: auto;padding: 5px"
           :rules="rules">
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
            <el-image v-if="formData.foodThumbnailUrl" :src="formData.foodThumbnailUrl" class="avatar"/>
            <el-icon v-else class="avatar-uploader-icon">
              <Plus/>
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-row>
          <el-col :span="12">
            <el-form-item label="食物名称" :label-width="formLabelWidth" prop="foodName">
              <el-input v-model="formData.foodName" placeholder="食物名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="食物种类" :label-width="formLabelWidth" prop="foodType">
              <el-input v-model="formData.foodType" placeholder="食物种类"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="食物稀有度" :label-width="formLabelWidth" prop="foodRarity">
              <el-input v-model="formData.foodRarity" placeholder="食物稀有度"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="食物来源" :label-width="formLabelWidth" prop="foodSource">
              <el-input v-model="formData.foodSource" placeholder="食物来源"/>
            </el-form-item>
          </el-col>
        </el-row>

      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="食物效果" :label-width="formLabelWidth" prop="foodEffect">
          <el-input type="textarea" v-model="formData.foodEffect" placeholder="食物效果" :rows="3"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="食物描述" :label-width="formLabelWidth" prop="foodDescribe">
          <el-input type="textarea" v-model="formData.foodDescribe" placeholder="食物描述" :rows="3"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-divider content-position="left">食物配方</el-divider>
    <el-table ref="foodFormula" :data="formData.foodFormula" style="width: 100%" max-height="300" :row-key="getRowKey">
      <el-table-column type="selection" width="55" />
      <el-table-column label="食材" width="500">
        <template #default="scope">
          <el-select
              v-model="scope.row.ingredientsId"
              placeholder="种类"
              clearable
              filterable
          >
            <el-option
                v-for="item in foodList"
                :key="item.foodId"
                :label="item.foodName"
                :value="item.foodId"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="数量">
        <template #header>
          <div style="display: flex; align-items: center;">
            <span style="margin-right: auto">数量</span>
            <el-button text bg :icon="Plus" @click="addFoodFormulaRow(formData.foodFormula)">
              新增
            </el-button>
            <el-button text bg :icon="Delete" @click="deleteFoodFormula">
              删除
            </el-button>
          </div>

        </template>
        <template #default="scope">
          <el-input type="number" v-model="scope.row.ingredientsNum" placeholder="数量"/>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>


<style scoped>
.avatar-uploader .avatar {
  width: 150px;
  height: 150px;
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
