<script setup lang="ts">

import {Plus} from "@element-plus/icons-vue";
import {PropType, reactive, ref} from "vue";
import {UploadProps} from "element-plus";
import {FormOption} from "@/types/form-option";

const {formData, isEdit} = defineProps({
    formData: {
        type: Object,
    },
    isEdit: {
        type: Boolean,
        required: false
    }
});





const emit = defineEmits<{
    (e: 'save'): void
}>()

const form = reactive({
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: '',
})

const formLabelWidth = '100px'


const imageUrl = ref('')

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        ElMessage.error('Avatar picture must be JPG format!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('Avatar picture size can not exceed 2MB!')
        return false
    }
    return true
}

const handleChange = (file) => {
    imageUrl.value = URL.createObjectURL(file.raw!)
};

const save = ()=>{
    console.log("这是子表单的save")
    emit('save')

}

defineExpose({
    save
})


</script>

<template>
    <el-form :model="form">
        <el-row>
            <el-col :span="12">
                <el-form-item label="上传" :label-width="formLabelWidth" style="display: flex">
                    <el-upload
                        class="avatar-uploader"
                        :show-file-list="false"
                        :limit="1"
                        :before-upload="beforeAvatarUpload"
                        :on-change="handleChange"
                    >
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="Input Field 1" :label-width="formLabelWidth">
                            <el-input v-model="form.input1" placeholder="Enter value" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="Input Field 2" :label-width="formLabelWidth">
                            <el-input v-model="form.input2" placeholder="Enter value" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="Input Field 3" :label-width="formLabelWidth">
                            <el-input v-model="form.input3" placeholder="Enter value" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-form-item label="Zones" :label-width="formLabelWidth">
                    <el-select v-model="form.region" placeholder="Please select a zone">
                        <el-option label="Zone No.1" value="shanghai" />
                        <el-option label="Zone No.2" value="beijing" />
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>


<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
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
</style>
