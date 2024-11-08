<script setup lang="ts">

import {Delete, Edit, Plus, RefreshRight} from "@element-plus/icons-vue";
import {weaponAttributes} from "@/types/hotta/arms/basic-info";
import {WeaponsFormModal} from "@/views/hotta/IllustratedArms/components";
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

<!--
  <el-table ref="formRef" :data="tableData" style="width: 100%; height: 100%;" size="large" v-loading="loading" @row-dblclick="view">
    <el-table-column type="selection"  width="55"/>
    <el-table-column fixed prop="armsName" label="武器名称" width="150"/>
    <el-table-column prop="armsId" label="武器ID" width="120"/>
    <el-table-column prop="armsAttribute" label="武器属性" width="120">
      <template #default="scope">
        <div style="display: flex; align-items: center;" v-if="scope.row.armsAttribute != null && scope.row.armsAttribute != ''">
          <img  :src="findAttributeImgSrcByValue(scope.row.armsAttribute)" :alt="findAttributeImgSrcByValue(scope.row.armsAttribute)"  style="width: 18px; height: 18px;margin-right: 5px">
          <span>{{ scope.row.armsAttribute }} </span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="armsType" label="武器定位" width="120">
      <template #default="scope">
        <div style="display: flex; align-items: center;" v-if="scope.row.armsType != null && scope.row.armsType != ''">
          <img  :src="findTypeImgSrcByValue(scope.row.armsType)" :alt="findTypeImgSrcByValue(scope.row.armsType)"  style="width: 18px; height: 18px;margin-right: 5px">
          <span>{{ scope.row.armsType }} </span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="armsThumbnailUrl" label="武器缩略图" width="120">
      <template #default="scope">
        <el-image  preview-teleported :src="scope.row.armsThumbnailUrl">
          <template #error>
            <div class="image-slot">
              <el-image preview-teleported src="src/assets/img/zwtp.jpg"/>
            </div>
          </template>
        </el-image>
      </template>
    </el-table-column>
    <el-table-column prop="armsDescription" label="武器描述" min-width="300"/>
    <el-table-column fixed="right" label="操作" width="155" header-align="center">
      <template #default>
        <el-button link  size="small" @click="handleClick">绑定意志</el-button>
        <el-button link  size="small">绑定拟态</el-button>
      </template>
    </el-table-column>
  </el-table>

  <div style="display: flex; justify-content: flex-end; padding: 20px 0 0;">
    <el-pagination
        :page-size="10"
        background
        layout="prev, pager, next"
        :total="formTotal"
        v-model:current-page="armsQueryParams.page"
    />
  </div>

  <el-dialog v-model="dialogFormVisible" :title="dialogName" width="1200"  draggable  align-center destroy-on-close>
    <ArmsFormModal :form-data-id="rowDataId" :is-edit="isEdit" ref="weaponsFormModalRef" @save="queryList"/>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveFormData" v-if="isEdit != 'view'">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
-->
</template>

<style scoped>

</style>