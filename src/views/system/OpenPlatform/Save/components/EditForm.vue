<template>
    <div class="edit-form-container">
        <a-form layout="vertical">
            <a-tabs v-model:activeKey="activeKey" @change="onTabChange">
                <a-tab-pane key="base" tab="应用注册信息">
                    <BaseInfo :id="id" @created="(newId) => emit('created', newId)" />
                </a-tab-pane>
                <a-tab-pane key="deviceAccess" tab="设备数据授权" :disabled="!id">
                    <!-- 移除v-if，让组件预先加载，但内部逻辑会等待ID存在 -->
                    <DeviceAccess :id="id" />
                </a-tab-pane>
                <a-tab-pane key="apiConfig" tab="API权限配置" :disabled="!id">
                     <!-- 移除v-if，让组件预先加载，但内部逻辑会等待ID存在 -->
                    <ApiConfig :id="id" />
                </a-tab-pane>
            </a-tabs>
        </a-form>
    </div>
</template>

<script setup lang="ts" name="OpenPlatformEditForm">
import { ref, defineEmits, defineProps } from 'vue';
import BaseInfo from './BaseInfo.vue';
import DeviceAccess from './DeviceAccess.vue';
import ApiConfig from './ApiConfig.vue';

const props = defineProps<{ id?: string }>();
const emit = defineEmits(['change-tab', 'created']);

const activeKey = ref('base');

const onTabChange = (key: string) => {
    emit('change-tab', key);
};

</script>

<style lang="less" scoped>
.edit-form-container {
    background-color: #fff;
    padding: 24px;
}
</style>