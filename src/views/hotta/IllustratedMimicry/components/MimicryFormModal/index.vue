<script setup lang="ts">

import {Delete, Plus} from "@element-plus/icons-vue";
import {nextTick, reactive, ref, watch} from "vue";
import {ElMessage, FormInstance, FormRules, InputInstance} from "element-plus";
import {MimicryFavors, MimicryInfo} from "@/types/hotta/mimicry/basic-info";
import {generateKey} from "@/utils";
import {MimicryAPI} from "@/api/hotta/mimicry";

const mimicryFavors = ref()
const formRef = ref<FormInstance | null>(null);

const tagTypes = reactive<String[]>(['primary', 'success', 'info', 'warning', 'danger'])
const props = defineProps({
    formDataId: {
        type: Number,
    },
    isEdit: {
        type: String,
        required: false
    }
});


const inputValue = ref('')
const dynamicTags = ref([])
const inputVisible = ref(false)
const InputRef = ref<InputInstance>()

const handleClose = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

const tagType = (index:number)=> {
  return tagTypes[index % 5]
}


const formData = ref<MimicryInfo>({
  mimicryId: null,
  mimicryName: '',
  mimicryCv: '',
  mimicrySex: '',
  mimicryHeight: null,
  mimicryFactions: '',
  mimicryBirthday: '',
  mimicryLike: '',
  mimicryFavors: [],
})


const rules = reactive<FormRules<MimicryInfo>>({
  mimicryName: [
        { required: true, message: '请输入名称', trigger: 'blur' },
    ]
})


const emit = defineEmits<{
    (e: 'save'): void
}>()


const formLabelWidth = '100px'

const getRowKey = (row: MimicryFavors) => {
    return row.favorsId;
}

const addMimicryFavorsRow = (params: MimicryFavors[]) => {
  const temItemsBasic: MimicryFavors = {favorsId: generateKey(),favorsLevel: '', favorsReward: ''}
  console.log(temItemsBasic)
  params.push(temItemsBasic)

}


const deleteMimicryFavors = () => {
  const selectedIds = mimicryFavors.value.getSelectionRows().map((row:MimicryFavors) => row.favorsId);
  formData.value.mimicryFavors = formData.value.mimicryFavors.filter(item => !selectedIds.includes(item.favorsId));
}

const save = async () => {
    if (!formRef.value) return;
    await formRef.value.validate(async (valid, fields) => {
        if (valid) {
            if(props.isEdit == 'add'){
                if (!formData.value.mimicryId) {
                    formData.value.mimicryLike = dynamicTags.value.join(',')
                    const {code, data, message} = await MimicryAPI.addMimicryInfo(formData.value)
                    if (code === 200) {
                      formData.value.mimicryId = data.mimicryId
                      ElMessage.success('保存成功')
                      emit('save');
                    } else {
                        ElMessage.error("新增失败了 "+message)
                        return
                    }
                }
            }

            if(props.isEdit == 'edit'){
                if (formData.value.mimicryId) {
                    formData.value.mimicryLike = dynamicTags.value.join(',')
                    const {code, data, message} = await MimicryAPI.editMimicryInfo(formData.value)
                    if (code === 200) {
                      formData.value.mimicryId = data.mimicryId
                      ElMessage.success('保存成功')
                      emit('save');
                    } else {
                        ElMessage.error("修改失败了 "+message)
                        return
                    }
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
          const request = await MimicryAPI.selectIdMimicryInfo(newValue.formDataId);
          if(request.data.mimicryLike){
            dynamicTags.value = request.data.mimicryLike.split(',')
          }
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
            <el-form-item label="拟态名称" :label-width="formLabelWidth" prop="mimicryName">
              <el-input  v-model="formData.mimicryName" placeholder="拟态名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="拟态配音" :label-width="formLabelWidth">
              <el-input  v-model="formData.mimicryCv" placeholder="拟态配音"/>
            </el-form-item>
            </el-col>
          <el-col :span="8">
            <el-form-item label="拟态所属" :label-width="formLabelWidth">
              <el-input  v-model="formData.mimicryFactions" placeholder="拟态所属"/>
            </el-form-item>
          </el-col>
        </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="拟态性别" :label-width="formLabelWidth">
            <el-select v-model="formData.mimicrySex" placeholder="拟态性别" > <el-option label="男" value="男" />
              <el-option label="女" value="女" /></el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="拟态身高" :label-width="formLabelWidth">
            <el-input type="number" v-model="formData.mimicryHeight" placeholder="拟态身高"><template #append>cm</template></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="拟态生日" :label-width="formLabelWidth">

            <el-date-picker
                v-model="formData.mimicryBirthday"
                type="date"
                placeholder="拟态生日"
                popper-class="picker-dateNoneYear"
                format="MM月DD日"
                :default-value="new Date(2000, 1, 1)"
                value-format="MM-DD"
                style="width: 100%;"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="拟态喜好" :label-width="formLabelWidth">
            <div style="display: flex;grid-gap: 0.5rem;gap: 0.5rem">
              <el-tag
                  v-for="(tag,index) in dynamicTags"
                  :key="tag"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)"
                  :type="tagType(index)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                  v-if="inputVisible"
                  ref="InputRef"
                  v-model="inputValue"
                  style="width: 70px"
                  size="small"
                  @keyup.enter="handleInputConfirm"
                  @blur="handleInputConfirm"
              />
              <el-button v-else class="button-new-tag" size="small" @click="showInput">
                + 喜好
              </el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
        <el-divider content-position="left">拟态好感度</el-divider>
        <el-table ref="mimicryFavors" :data="formData.mimicryFavors" style="width: 100%" max-height="350" :row-key="getRowKey">
            <el-table-column type="selection" width="55" />
            <el-table-column label="好感等级" width="250">
                <template #default="scope">
                    <el-input v-model="scope.row.favorsLevel" placeholder="好感等级"/>
                </template>
            </el-table-column>
            <el-table-column label="好感奖励">
                <template #header>
                    <div style="display: flex; align-items: center;">
                        <span style="margin-right: auto">描述</span>
                        <el-button text bg :icon="Plus" @click="addMimicryFavorsRow(formData.mimicryFavors)">
                            新增
                        </el-button>
                        <el-button text bg :icon="Delete" @click="deleteMimicryFavors">
                            删除
                        </el-button>
                    </div>

                </template>
                <template #default="scope">
                    <el-input type="textarea" v-model="scope.row.favorsReward" placeholder="好感奖励"
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


.picker-dateNoneYear {
  .el-date-picker__header {
    .el-date-picker__prev-btn {
      > button:first-child {
        display: none;
      }
    }
    .el-date-picker__next-btn {
      > button:last-child {
        display: none;
      }
    }
    > span:nth-child(2) {
      display: none;
    }
  }
}

</style>
