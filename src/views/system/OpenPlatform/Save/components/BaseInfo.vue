<template>
    <div>
        <a-form :model="formData" layout="vertical" ref="formRef">
            <a-form-item label="应用名称" name="name" :rules="[{ required: true, message: '请输入应用名称' }]">
                <a-input v-model:value="formData.name" placeholder="请输入应用名称" />
            </a-form-item>
            <a-form-item label="归属单位" name="ownerName">
                <a-input v-model:value="formData.ownerName" placeholder="请输入归属单位" />
            </a-form-item>
            <a-form-item label="联系人" name="contactPerson">
                <a-input v-model:value="formData.contactPerson" placeholder="请输入联系人" />
            </a-form-item>
            <a-form-item label="回调地址" name="callbackUrl" :rules="[{ type: 'url', message: '请输入正确的URL' }]">
                <a-input v-model:value="formData.callbackUrl" placeholder="请输入回调地址" />
            </a-form-item>
            <a-form-item label="授权类型" name="authorizationTypes" :rules="[{ required: true, message: '请选择授权类型' }]">
                <a-checkbox-group v-model:value="formData.authorizationTypes">
                    <a-checkbox value="api">API调用授权</a-checkbox>
                    <a-checkbox value="websocket">WebSocket授权</a-checkbox>
                </a-checkbox-group>
            </a-form-item>
            <a-form-item label="应用描述" name="description">
                <a-textarea v-model:value="formData.description" placeholder="请输入应用描述" :rows="3" />
            </a-form-item>

            <a-form-item :wrapper-col="{ span: 24 }" style="text-align: center; margin-top: 24px;">
                <a-button type="primary" @click="handleSave" :loading="loading">保存</a-button>
                <a-button style="margin-left: 8px" @click="handleCancel">取消</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script setup lang="ts" name="OpenPlatformBaseInfo">
import { ref, watch, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { OpenPlatformItem } from '../../typing.d.ts';
import { getById, add, update } from '@/api/system/openPlatform'; // 假设已有add, update
import { onlyMessage } from '@/utils/comm';
import { Modal, FormInstance } from 'ant-design-vue';

const props = defineProps<{ id?: string }>();
const emit = defineEmits(['created']);

const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref(false);
const formData = ref<Partial<OpenPlatformItem>>({});

const isEdit = computed(() => !!props.id);

watch(
    () => props.id,
    (newId) => {
        if (newId) {
            getById(newId).then(resp => {
                if (resp.success) {
                    formData.value = resp.result;
                } else {
                    console.error('Failed to fetch data for ID:', newId, resp);
                    onlyMessage('加载数据失败', 'error'); // Add user-friendly message
                }
            }).catch(error => {
                console.error('API call getById failed:', error);
                onlyMessage('加载数据时发生错误', 'error'); // Add user-friendly message
            });
        } else {
            formData.value = {}; // Clear form for new entry if ID is null/undefined
        }
    },
    { immediate: true }
);

const handleSave = async () => {
    try {
        await formRef.value?.validate();
        loading.value = true;
        const api = isEdit.value ? update(props.id, formData.value) : add(formData.value);
        const resp = await api;
        if (resp.success) {
            onlyMessage('保存成功', 'success');
            if (!isEdit.value) {
                emit('created', resp.result.id);
            }
        }
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const handleCancel = () => {
    router.back();
}


</script>
