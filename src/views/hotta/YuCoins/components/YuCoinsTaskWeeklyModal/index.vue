<script setup lang="ts">

import {nextTick, reactive, ref, watch} from "vue";
import {ElMessage, FormInstance, FormRules, InputInstance} from "element-plus";
import {YuCoinsAPI} from "@/api/hotta/yu-coins";
import {YuCoinsTaskType, YuCoinsTaskWeekly} from "@/types/hotta/yu-coins/basic-info";

const typeList = ref<YuCoinsTaskType[]>([])
const formRef = ref<FormInstance | null>(null);
const resultTypeList = ref([])


const props = defineProps({
    formDataId: {
        type: Number,
    },
    isEdit: {
        type: String,
        required: false
    }
});



const formData = ref<YuCoinsTaskWeekly>({
  taskWeeklyId: '',
  taskTypeIds: '',
  taskWeeklyDate: '',
  delFlag: null
})


const rules = reactive<FormRules<YuCoinsTaskWeekly>>({
  taskWeeklyDate: [
        { required: true, message: '请输入发布日期', trigger: 'blur' },
    ]
})


const emit = defineEmits<{
    (e: 'save'): void
}>()



const save = async () => {
    if (!formRef.value) return;
    await formRef.value.validate(async (valid, fields) => {
        if (valid) {
            if(props.isEdit == 'add' || props.isEdit == 'edit'){
                formData.value.taskTypeIds = resultTypeList.value.join(',')
                const {code, data, message} = await YuCoinsAPI.addEditYuCoinsWeeklyInfo(formData.value)
                if (code === 200) {
                  formData.value.taskWeeklyId = data.taskWeeklyId
                  ElMessage.success('保存成功')
                  emit('save');
                } else {
                    ElMessage.error("保存失败了 "+message)
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
        if(newValue.formDataId  && newValue.isEdit != 'add'  ){
          const request = await YuCoinsAPI.selectIdYuCoinsWeeklyInfo(newValue.formDataId);

          formData.value = request.data
          if(request.data.taskTypeIds){
            resultTypeList.value = request.data.taskTypeIds.split(',').map(n=>Number(n))
          }
        }
        const requestTypeData = await YuCoinsAPI.selectYuCoinsTaskTypeInfo()
        typeList.value = requestTypeData.data
    },
    {immediate: true, deep: true}
)



defineExpose({
    save
})


</script>

<template>
    <el-form ref="formRef" :model="formData" style="width: 100%;overflow-y: auto;padding: 5px" :rules="rules" >
        <el-divider content-position="left">基础信息</el-divider>
        <el-row>
          <el-col :span="24">
            <el-form-item label="域币任务">
              <el-select
                  v-model="resultTypeList"
                  multiple
                  placeholder="Select"
              >

                <el-option
                    v-for="item in typeList"
                    :key="item.taskTypeId"
                    :label="item.taskTypeDetails"
                    :value="item.taskTypeId"
                >
                  <span style="float: left">{{ item.taskTypeDetails }}</span>
                  <span
                      style="
                        float: right;
                        color: var(--el-text-color-secondary);
                        font-size: 13px;
                      "
                  >
                      NPC: {{ item.taskTypeNpc }}
                    </span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="发布日期" prop="taskWeeklyDate">
              <el-date-picker
                  v-model="formData.taskWeeklyDate"
                  type="date"
                  placeholder="发布日期"
                  style="width:100%"
              />
          </el-form-item>
        </el-col>
      </el-row>
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
