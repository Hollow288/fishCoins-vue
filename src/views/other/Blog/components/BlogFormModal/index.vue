<script setup lang="ts">
import {reactive, ref, watch} from "vue";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import {Blog} from "@/types/other/blog/basic-info";
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const formRef = ref<FormInstance | null>(null);

const props = defineProps({
  formDataId: {
    type: Number,
  },
  isEdit: {
    type: String,
    required: false
  }
});


const formData = ref<Blog>({
  blogId: '',
  title: '',
  summary: '',
  content: '',
  createdAt: '',
  delFlag: ''
})


const rules = reactive<FormRules<Blog>>({
  title: [
    {required: true, message: '请输入标题', trigger: 'blur'},
  ]
})


const emit = defineEmits<{
  (e: 'save'): void
}>()


const formLabelWidth = '100px'


const save = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      if (props.isEdit == 'add' || props.isEdit == 'edit') {
        let code: number, msg: string;

        if (props.isEdit === 'add') {
          ({code, msg} = await BlogAPI.addBlogInfo(formData.value));
        } else if (props.isEdit === 'edit') {
          ({code, msg} = await BlogAPI.editBlogInfo(formData.value, formData.value.blogId));
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
        const request = await BlogAPI.selectIdBlogInfo(newValue.formDataId);
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
  <el-form ref="formRef" :model="formData" :rules="rules">

    <el-collapse >
      <el-collapse-item title="基本信息" name="1">
        <el-row>
          <el-col :span="24">
            <el-form-item label="标题" :label-width="formLabelWidth" prop="title">
              <el-input  v-model="formData.title" placeholder="标题"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="摘要" :label-width="formLabelWidth" prop="summary">
              <el-input type="textarea" v-model="formData.summary" placeholder="摘要" :rows="2"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item title="正文" name="12">
        <MdEditor v-model="formData.content"/>
      </el-collapse-item>
    </el-collapse>





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
