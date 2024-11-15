<script setup lang="ts">

import {reactive, ref, watch} from "vue";
import {ElMessage, FormInstance, FormRules, UploadProps} from "element-plus";
import {
  ArmsIdName,
  ArmsMimicryWillpower,
  ItemsBasic,
  MimicryIdName,
  WillpowerIdName
} from '@/types/hotta/arms/basic-info'
import {WillpowerAPI} from "@/api/hotta/willpower";

const formRef = ref<FormInstance | null>(null);

const props = defineProps({
    formDataId: {
        type: Number,
    },
    formDataName:{
        type: String
    }
});


const formData = ref<ArmsMimicryWillpower>({
  armsId: null,
  mimicryId: null,
  willpowerId: null
})

const armsList = ref<ArmsIdName[]>([])
const mimicryList = ref<MimicryIdName[]>([])
const willpowerList = ref<WillpowerIdName[]>([])


const rules = reactive<FormRules<ArmsMimicryWillpower>>({

})

const emit = defineEmits<{
  (e: 'save'): void
}>()


const formLabelWidth = '100px'

const save = async () => {
    if (!formRef.value) return;
    await formRef.value.validate(async (valid, fields) => {
        if (valid) {
          if (formData.value.armsId) {
              const {code,message} = await ArmsAPI.editArmsMimicryWillpower(formData.value)
              if (code === 200) {
                  ElMessage.success(message)
                  emit('save');
              } else {
                  ElMessage.error("修改失败了 "+message)
                  return
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
        if(newValue.formDataId ){

          const requestBind = await ArmsAPI.selectArmsMimicryWillpowerBindInfo(newValue.formDataId);
          if(requestBind.data){
            formData.value = requestBind.data
          }else{
            formData.value.armsId = newValue.formDataId
          }

          const requestList = await ArmsAPI.selectArmsMimicryWillpower();
          armsList.value = requestList.data.armsIdNames
          willpowerList.value = requestList.data.willpowerIdNames
          mimicryList.value = requestList.data.mimicryIdNames

        }
    },
    {immediate: true, deep: true}
)



defineExpose({
    save
})


</script>

<template>
    <el-form ref="formRef" :model="formData" style="width: 100%;height: 200px;overflow-y: auto;padding: 5px" :rules="rules" >
        <el-divider content-position="left">基础信息</el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="武器名称" :label-width="formLabelWidth" >
              <el-select
                  v-model="formData.armsId"
                  filterable
                  placeholder="Select"
                  style="width: 240px"
                  disabled
              >
                <template #label="{ label, value }">
                  <span>{{ label }}</span>
                  <span
                      style="
                      float: right;
                      color: var(--el-text-color-secondary);
                    "
                  >
                    ID: {{ value }}
                  </span>
                </template>
                <el-option
                    v-for="item in armsList"
                    :key="item.armsId"
                    :label="item.armsName"
                    :value="item.armsId"
                >
                  <span style="float: left">{{ item.armsName }}</span>
                  <span
                      style="
                      float: right;
                      color: var(--el-text-color-secondary);
                      font-size: 13px;
                    "
                              >
                    ID: {{ item.armsId }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="意志名称" :label-width="formLabelWidth" >
              <el-select
                  v-model="formData.willpowerId"
                  filterable
                  clearable
                  placeholder="选择"
                  style="width: 240px"
              >
                <el-option
                    v-for="item in willpowerList"
                    :key="item.willpowerId"
                    :label="item.willpowerName"
                    :value="item.willpowerId"
                >
                  <span style="float: left">{{ item.willpowerName }}</span>
                  <span
                      style="
                      float: right;
                      color: var(--el-text-color-secondary);
                      font-size: 13px;
                    "
                  >
                    ID: {{ item.willpowerId }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="拟态名称" :label-width="formLabelWidth" >
              <el-select
                  v-model="formData.mimicryId"
                  filterable
                  clearable
                  placeholder="选择"
                  style="width: 240px"
              >
                <el-option
                    v-for="item in mimicryList"
                    :key="item.mimicryId"
                    :label="item.mimicryName"
                    :value="item.mimicryId"
                >
                  <span style="float: left">{{ item.mimicryName }}</span>
                  <span
                      style="
                      float: right;
                      color: var(--el-text-color-secondary);
                      font-size: 13px;
                    "
                  >
                    ID: {{ item.mimicryId }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
    </el-form>
</template>



<style>

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
