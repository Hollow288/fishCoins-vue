<script setup lang="ts">

import {Plus} from "@element-plus/icons-vue";
import {reactive, ref, watch} from "vue";
import {ElMessage, FormInstance, FormRules, UploadProps} from "element-plus";
import {UploadAPI} from "@/api/upload";
import {
  EventNewsInfo
} from "@/types/hotta/event-news/basic-info";
import {EventNewsAPI} from "@/api/hotta/event-news";


const formRef = ref<FormInstance | null>(null);
const fileListRef = ref([])
// attach is edit ?
const fileIsEdit = ref<boolean>(false)

const props = defineProps({
  formDataId: {
    type: Number,
  },
  isEdit: {
    type: String,
    required: false
  }
});


const formData = ref<EventNewsInfo>({
  newsId: '',
  newsTitle: '',
  newsDescribe: '',
  newsImgUrl: '',
  newsShowImgUrl: '',
  newsStart: '',
  newsEnd: ''
})


const rules = reactive<FormRules<EventNewsInfo>>({
  newsTitle: [
    {required: true, message: '请输入活动标题', trigger: 'blur'},
  ]
})


const emit = defineEmits<{
  (e: 'save'): void
}>()


const formLabelWidth = '100px'


const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/webp') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error('Avatar picture size can not exceed 5MB!')
    return false
  }
  return false
}

const handleChange = (file) => {
  formData.value.newsShowImgUrl = URL.createObjectURL(file.raw!)
  fileIsEdit.value = true
  fileListRef.value.splice(0, fileListRef.value.length)
  fileListRef.value.push(file.raw)
};

const save = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      if (props.isEdit == 'add' || props.isEdit == 'edit') {

        if (fileListRef.value.length > 0 && fileIsEdit.value) {
          const fileData = new FormData()
          fileListRef.value.forEach(file => {
            fileData.append('file', file)
          })

          const {code, data, msg} = await UploadAPI.uploadFile(fileData, "hotta-event-news")
          if (code === 200) {
            formData.value.newsImgUrl = data
          } else {
            ElMessage.error(msg)
            return
          }
        }

        let code: number, msg: string;

        if (props.isEdit === 'add') {
          ({code, msg} = await EventNewsAPI.addEventNewsInfo(formData.value));
        } else if (props.isEdit === 'edit') {
          ({code, msg} = await EventNewsAPI.editEventNewsInfo(formData.value, formData.value.newsId));
        }

        if (code === 200) {
          ElMessage.success("保存成功");
          emit('save');
        } else {
          ElMessage.error(msg);
          return;
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
      if (newValue.formDataId && newValue.isEdit != 'add') {
        const request = await EventNewsAPI.selectIdEventNewsInfo(newValue.formDataId);
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
  <el-form ref="formRef" :model="formData" style="width: 100%;height: 300px;overflow-y: auto;padding: 5px"
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
            <el-image v-if="formData.newsShowImgUrl" :src="formData.newsShowImgUrl" class="avatar"/>
            <el-icon v-else class="avatar-uploader-icon">
              <Plus/>
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-row>
          <el-col :span="24">
            <el-form-item label="活动标题" :label-width="formLabelWidth" prop="newsTitle">
              <el-input v-model="formData.newsTitle" placeholder="活动标题"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间" :label-width="formLabelWidth" prop="newsStart">
              <el-date-picker
                  v-model="formData.newsStart"
                  type="datetime"
                  placeholder="开始时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" :label-width="formLabelWidth" prop="newsEnd">
              <el-date-picker
                  v-model="formData.newsEnd"
                  type="datetime"
                  placeholder="开始时间"
              />
            </el-form-item>
          </el-col>
        </el-row>

      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="活动描述" :label-width="formLabelWidth" prop="newsDescribe">
          <el-input type="textarea" v-model="formData.newsDescribe" placeholder="活动描述" :rows="3"/>
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
