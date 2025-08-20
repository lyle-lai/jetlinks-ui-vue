<template>
    <div class="edit-form-container">
        <a-form ref="formRef" :model="formData" layout="vertical">
            <a-tabs v-model:activeKey="activeKey" @change="onTabChange">
                <a-tab-pane key="base" tab="应用注册信息">
                    <BaseInfo v-model="formData" />
                </a-tab-pane>
                <a-tab-pane key="deviceAccess" tab="设备数据授权">
                    <DeviceAccess v-model="formData.deviceAccess" />
                </a-tab-pane>
                <a-tab-pane key="apiConfig" tab="API权限配置">
                    <ApiConfig v-model="formData.apiConfig" />
                </a-tab-pane>
            </a-tabs>
        </a-form>
    </div>
</template>

<script setup lang="ts" name="OpenPlatformEditForm">
import { ref, onMounted, defineEmits, defineExpose } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { FormInstance } from 'ant-design-vue';
import BaseInfo from './BaseInfo.vue';
import DeviceAccess from './DeviceAccess.vue';
import ApiConfig from './ApiConfig.vue';
import type { OpenPlatformItem } from '../../typing.d.ts';
// import { getById, saveOrUpdate } from '@/api/system/openPlatform'; // 待创建的API服务
import { getById, add, update } from '@/api/system/openPlatform';
import { onlyMessage } from '@/utils/comm';

const emit = defineEmits(['change-tab']);
const route = useRoute();
const router = useRouter();

const formRef = ref<FormInstance>();
const loading = ref(false);
const activeKey = ref('base');
const formData = ref<Partial<OpenPlatformItem>>({});

const onTabChange = (key: string) => {
    emit('change-tab', key);
};

onMounted(() => {
    const id = route.query.id as string;
    if (id) {
        getById(id).then(resp => {
            if(resp.success) {
                formData.value = resp.result;
            }
        });
    }
});

const handleSave = async () => {
    try {
        await formRef.value?.validate();
        loading.value = true;
        const api = formData.value.id ? update(formData.value.id, formData.value) : add(formData.value);
        const resp = await api;
        if (resp.success) {
            onlyMessage('保存成功');
            router.push({ path: '/system/OpenPlatform' });
        }
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

defineExpose({
    handleSave
})

</script>

<style lang="less" scoped>
.edit-form-container {
    background-color: #fff;
    padding: 24px;
}

.footer-actions {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}
</style>