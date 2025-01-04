<script setup lang="ts">

import {Delete, Plus} from "@element-plus/icons-vue";
import {reactive, ref, watch} from "vue";
import {ElMessage, FormInstance, FormRules, UploadProps} from "element-plus";
import {v4 as uuidv4} from 'uuid';
import type {ItemsBasic} from '@/types/hotta/arms/basic-info'
import {UploadAPI} from "@/api/upload";
import {
  WillpowerClassification,
  WillpowerInfo,
  WillpowerSuit,
  willpowerTypeList
} from "@/types/hotta/willpower/basic-info";
import {WillpowerAPI} from "@/api/hotta/willpower";

const willpowerClassification = ref()
const willpowerSuit = ref()
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



const formData = ref<WillpowerInfo>({
  willpowerId: '',
  willpowerName: '',
  willpowerRarity: '',
  willpowerDescription: '',
  willpowerThumbnailUrl: '',
  willpowerClassification: [],
  willpowerSuit: []
})


const rules = reactive<FormRules<WillpowerInfo>>({
  willpowerName: [
        { required: true, message: '请输入名称', trigger: 'blur' },
    ]
})


const emit = defineEmits<{
    (e: 'save'): void
}>()


const formLabelWidth = '100px'

const getRowKey = (row: ItemsBasic) => {
    return row.itemsId;
}

const addClassificationRow = (params: WillpowerClassification[]) => {
    const temItemsBasic: WillpowerClassification = {itemsId: uuidv4(),classificationType: '', itemsName: '', itemsDescribe: ''}
    params.push(temItemsBasic)
}

const addSuitRow = (params: WillpowerSuit[]) => {
  const temItemsBasic: WillpowerSuit = {itemsId: uuidv4(), itemsName: '', itemsDescribe: ''}
  params.push(temItemsBasic)
}

const deleteWillpowerClassification = () => {
    const selectedIds = willpowerClassification.value.getSelectionRows().map((row:WillpowerClassification) => row.itemsId);
    formData.value.willpowerClassification = formData.value.willpowerClassification.filter(item => !selectedIds.includes(item.itemsId));
}

const deleteWillpowerSuit = () => {
    const selectedIds = willpowerSuit.value.getSelectionRows().map((row:WillpowerSuit) => row.itemsId);
    formData.value.willpowerSuit = formData.value.willpowerSuit.filter(item => !selectedIds.includes(item.itemsId));
}

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
    formData.value.willpowerThumbnailUrl = URL.createObjectURL(file.raw!)
    fileIsEdit.value = true
    fileListRef.value.splice(0, fileListRef.value.length)
    fileListRef.value.push(file.raw)
};

const save = async () => {
    if (!formRef.value) return;
    await formRef.value.validate(async (valid, fields) => {
        if (valid) {
            if(props.isEdit == 'add'){
                if (!formData.value.willpowerId) {
                    const {code, data, message} = await WillpowerAPI.addWillpowerInfo(formData.value)
                    if (code === 200) {
                        formData.value.willpowerId = data.willpowerId
                    } else {
                        ElMessage.error("新增失败了 "+message)
                        return
                    }
                }
                if (fileListRef.value.length <= 0) {
                    ElMessage.success('保存成功')
                    emit('save');
                }
                else {
                    const fileData = new FormData()
                    fileListRef.value.forEach(file => {
                        fileData.append('file', file)
                    })

                    const {code, message} = await UploadAPI.uploadWillpowerImgFile(fileData, formData.value.willpowerId)
                    if (code === 200) {
                        ElMessage.success('保存成功')
                        emit('save');
                    } else {
                        ElMessage.error(message)
                        return
                    }
                }
            }

            if(props.isEdit == 'edit'){
                if (formData.value.willpowerId) {
                    const {code, data, message} = await WillpowerAPI.editWillpowerInfo(formData.value)
                    if (code === 200) {
                        formData.value.willpowerId = data.willpowerId
                    } else {
                        ElMessage.error("修改失败了 "+message)
                        return
                    }
                }
                if (fileListRef.value.length > 0 && fileIsEdit.value) {
                    const fileData = new FormData()
                    fileListRef.value.forEach(file => {
                        fileData.append('file', file)
                    })

                    const {code, message} = await UploadAPI.uploadWillpowerImgFile(fileData, formData.value.willpowerId)
                    if (code === 200) {
                        ElMessage.success('保存成功')
                        emit('save');
                    } else {
                        ElMessage.error(message)
                        return
                    }
                }
                else {
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
        if(newValue.formDataId  && newValue.isEdit != 'add' ){
            const request = await WillpowerAPI.selectIdWillpowerInfo(newValue.formDataId);
            //对于子表的ID处理错了,这里临时改改
            request.data.willpowerClassification.map(n=>n.itemsId = uuidv4())
            request.data.willpowerSuit.map(n=>n.itemsId = uuidv4())
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
    <el-form ref="formRef" :model="formData" style="width: 100%;height: 600px;overflow-y: auto;padding: 5px" :rules="rules" >
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
                        <el-image v-if="formData.willpowerThumbnailUrl" :src="formData.willpowerThumbnailUrl" class="avatar"/>
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus/>
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-col>
            <el-col :span="16">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="意志名称" :label-width="formLabelWidth" prop="willpowerName">
                            <el-input v-model="formData.willpowerName" placeholder="意志名称"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="意志稀有度" :label-width="formLabelWidth">
                            <el-input v-model="formData.willpowerRarity" placeholder="意志稀有度"/>
                        </el-form-item>
                    </el-col>
                </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="意志描述" :label-width="formLabelWidth" prop="armsName">
                    <el-input type="textarea" v-model="formData.willpowerDescription" placeholder="意志描述" :rows="3"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
        </el-row>
        <el-divider content-position="left">意志分类</el-divider>
        <el-table ref="willpowerClassification" :data="formData.willpowerClassification" style="width: 100%" max-height="300" :row-key="getRowKey">
            <el-table-column type="selection" width="55" />
          <el-table-column label="种类" width="150">
            <template #default="scope">
              <el-select
                  v-model="scope.row.classificationType"
                  placeholder="种类"
                  clearable
              >
                <el-option
                    v-for="item in willpowerTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
            <el-table-column label="名称" width="250">
                <template #default="scope">
                    <el-input v-model="scope.row.itemsName" placeholder="名称"/>
                </template>
            </el-table-column>
            <el-table-column label="描述">
                <template #header>
                    <div style="display: flex; align-items: center;">
                        <span style="margin-right: auto">描述</span>
                        <el-button text bg :icon="Plus" @click="addClassificationRow(formData.willpowerClassification)">
                            新增
                        </el-button>
                        <el-button text bg :icon="Delete" @click="deleteWillpowerClassification">
                            删除
                        </el-button>
                    </div>

                </template>
                <template #default="scope">
                    <el-input type="textarea" v-model="scope.row.itemsDescribe" placeholder="描述"
                              autosize="autosize"/>
                </template>
            </el-table-column>
        </el-table>
        <el-divider content-position="left">意志套装</el-divider>
        <el-table ref="willpowerSuit" :data="formData.willpowerSuit" style="width: 100%" max-height="300" :row-key="getRowKey">
            <el-table-column type="selection"  width="55"/>
            <el-table-column label="名称" width="400">
                <template #default="scope">
                    <el-input v-model="scope.row.itemsName" placeholder="名称"/>
                </template>
            </el-table-column>
            <el-table-column label="描述">
                <template #header>
                    <div style="display: flex; align-items: center;">
                        <span style="margin-right: auto">描述</span>
                        <el-button text bg :icon="Plus" @click="addSuitRow(formData.willpowerSuit)">
                            新增
                        </el-button>
                        <el-button text bg :icon="Delete" @click="deleteWillpowerSuit">
                            删除
                        </el-button>
                    </div>

                </template>
                <template #default="scope">
                    <el-input type="textarea" v-model="scope.row.itemsDescribe" placeholder="描述"
                              autosize="autosize"/>
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
