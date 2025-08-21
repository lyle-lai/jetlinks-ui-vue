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
            <a-form-item label="授权类型" name="authType" :rules="[{ required: true, message: '请选择授权类型' }]">
                <a-checkbox-group v-model:value="formData.authType">
                    <a-checkbox value="api">API调用授权</a-checkbox>
                    <a-checkbox value="websocket">WebSocket授权</a-checkbox>
                </a-checkbox-group>
            </a-form-item>
            <a-form-item label="应用描述" name="description">
                <a-textarea v-model:value="formData.description" placeholder="请输入应用描述" :rows="3" />
            </a-form-item>

            <template v-if="isEdit">
                <a-divider />
                <h3>应用凭证</h3>
                <h3>应用凭证</h3>
            <a-form-item label="App ID">
                <a-input-group compact>
                    <a-input :value="formData.appId" readonly />
                    <a-button @click="copy(formData.appId, 'App ID')">复制</a-button>
                </a-input-group>
            </a-form-item>
            <a-form-item label="App Key">
                <a-input-group compact>
                    <a-input :value="formData.appKey" readonly placeholder="编辑时此处不回显" />
                    <a-button @click="copy(formData.appKey, 'App Key')">复制</a-button>
                </a-input-group>
            </a-form-item>
            <a-form-item label="App Secret">
                <a-input-password :value="formData.appSecret" readonly placeholder="••••••••">
                    <template #addonAfter>
                        <a-space>
                            <a-button type="link" @click="copy(formData.appSecret, 'App Secret')" :disabled="!formData.appSecret">复制</a-button>
                            <a-button type="link" @click="resetSecret">重置</a-button>
                        </a-space>
                    </template>
                </a-input-password>
                <div class="ant-form-item-extra">
                    出于安全考虑，应用凭证仅在创建和重置时可见，请妥善保存。
                </div>
            </a-form-item>
            </template>

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

onMounted(() => {
    if (props.id) {
        getById(props.id).then(resp => {
            if (resp.success) {
                formData.value = resp.result;
            }
        });
    }
});

const handleSave = async () => {
    try {
        await formRef.value?.validate();
        loading.value = true;
        const api = isEdit.value ? update(props.id, formData.value) : add(formData.value);
        const resp = await api;
        if (resp.success) {
            onlyMessage.success('保存成功');
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

const copy = (value: string, type: string) => {
    if (!value) {
        onlyMessage(`${type} 为空`, 'warning');
        return;
    }
    if (navigator.clipboard) {
        navigator.clipboard.writeText(value).then(() => {
            onlyMessage('复制成功');
        }).catch(err => {
            console.error('Could not copy text: ', err);
            onlyMessage('复制失败', 'error');
        });
    } else {
        onlyMessage('浏览器不支持剪贴板API', 'error');
    }
}

const resetSecret = () => {
    Modal.confirm({
        title: '确认重置？',
        content: '重置后，旧的App Secret将立即失效，请及时更新您的应用配置。',
        onOk: () => {
            // Call API to reset secret
            console.log('Resetting secret...');
            onlyMessage.success('重置成功');
        }
    })
};

</script>
