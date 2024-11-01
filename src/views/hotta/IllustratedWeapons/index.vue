<template>
    <div style="display: flex; justify-content: space-between; width: 100%; padding: 0 0 10px 0">
        <el-button text bg :icon="Plus" @click="add">
            新增
        </el-button>
        <el-select v-model="value" multiple placeholder="属性筛选" style="width: 300px;margin-left: 10px; margin-right: auto;" @change="filterWeaponAttributes">
            <el-option
                    v-for="item in weaponAttributes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
            >
                <div style="display: flex; align-items: center;">
                    <img :src="item.src" :alt="item.src"  style="width: 18px; height: 18px;margin-right: 5px">
                    <span>{{ item.label }}</span>
                </div>
            </el-option>
            <template #tag>
                <img v-for="item in value" :src="findImgSrcByValue(item)" :alt="findImgSrcByValue(item)"  style="width: 18px; height: 18px;margin-right: 5px">
            </template>
        </el-select>

        <div style="display: flex; gap: 5px;">
            <el-button text bg :icon="Edit">
                修改
            </el-button>
            <el-button text bg :icon="Delete">
                删除
            </el-button>
            <el-button :icon="RefreshRight" circle/>
        </div>
    </div>

    <el-table :data="tableData" style="width: 100%; height: 100%;" size="large">
        <el-table-column type="selection" :selectable="selectable" width="55"/>
        <el-table-column fixed prop="date" label="Date" width="150"/>
        <el-table-column prop="name" label="Name" width="120"/>
        <el-table-column prop="state" label="State" width="120"/>
        <el-table-column prop="city" label="City" width="120"/>
        <el-table-column prop="address" label="Address" width="600"/>
        <el-table-column prop="zip" label="Zip" width="120"/>
        <el-table-column fixed="right" label="Operations" min-width="120">
            <template #default>
                <el-button link type="primary" size="small" @click="handleClick">
                    Detail
                </el-button>
                <el-button link type="primary" size="small">Edit</el-button>
            </template>
        </el-table-column>
    </el-table>

    <div style="display: flex; justify-content: flex-end; padding: 20px 0 0;">
        <el-pagination
                background
                layout="prev, pager, next"
                :total="1000"
        />
    </div>




    <el-dialog v-model="dialogFormVisible" title="Shipping address" width="800" draggable >
        <WeaponsFormModal :form-data="rowData" :edit="isEdit" ref="weaponsFormModalRef" @save="queryList"/>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click="saveFormData">
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>



</template>

<script lang="ts" setup>
import {Delete, Edit, Plus, RefreshRight} from "@element-plus/icons-vue";
import {WeaponsFormModal} from './components'
import {reactive, ref} from "vue";
import type { UploadProps } from 'element-plus'


const dialogFormVisible = ref(false)

const weaponsFormModalRef = ref()

const handleClick = () => {
    console.log('click')
}

const value = ref<string[]>([])
const selectable = (row) => ![1, 2].includes(row.id)

const findImgSrcByValue = (value: string) : string =>{
    return weaponAttributes.find(n=>n.value == value).src
}




const weaponAttributes = [
    {
        label: '物理',
        value: '物理',
        src: new URL('@/assets/hotta/weapons-attribute-icon/Phy.png', import.meta.url).href
    },
    {
        label: '火焰',
        value: '火焰',
        src: new URL('@/assets/hotta/weapons-attribute-icon/fire.png', import.meta.url).href
    },
    {
        label: '寒冰',
        value: '寒冰',
        src: new URL('@/assets/hotta/weapons-attribute-icon/ice.png', import.meta.url).href
    },
    {
        label: '雷电',
        value: '雷电',
        src: new URL('@/assets/hotta/weapons-attribute-icon/elec.png', import.meta.url).href
    },
    {
        label: '异能',
        value: '异能',
        src: new URL('@/assets/hotta/weapons-attribute-icon/Extr.png', import.meta.url).href
    },
    {
        label: '物火',
        value: '物火',
        src: new URL('@/assets/hotta/weapons-attribute-icon/phy-fire.png', import.meta.url).href
    },
    {
        label: '火物',
        value: '火物',
        src: new URL('@/assets/hotta/weapons-attribute-icon/fire-phy.png', import.meta.url).href
    },
    {
        label: '冰雷',
        value: '冰雷',
        src: new URL('@/assets/hotta/weapons-attribute-icon/ice-elec.png', import.meta.url).href
    },
    {
        label: '雷冰',
        value: '雷冰',
        src: new URL('@/assets/hotta/weapons-attribute-icon/elec-ice.png', import.meta.url).href
    }
]


const tableData = [
    {
        date: '2016-05-03',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Home',
    },
    {
        date: '2016-05-02',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Office',
    },
    {
        date: '2016-05-01',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Office',
    },
    {
        date: '2016-05-092',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Office',
    },
    {
        date: '2016-605-702',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Office',
    }, {
        date: '20156-405-02',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Office',
    },
    {
        date: '2016-055-02',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Office',
    },
    {
        date: '20616-05-02',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Office',
    },
    {
        date: '206316-05-02',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Office',
    },
    {
        date: '206156-05-02',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
        tag: 'Office',
    }
]


const filterWeaponAttributes = (value: any): void =>{
    debugger
    console.log(value)
}


const add = ()=>{
    debugger
    weaponsFormModalRef.value
    dialogFormVisible.value = true
    console.log("111")
}

const queryList = ()=>{
    console.log("然后触发了父表单的刷新")
}

const saveFormData=()=>{
    weaponsFormModalRef.value.save()
    dialogFormVisible.value = false
}







</script>


