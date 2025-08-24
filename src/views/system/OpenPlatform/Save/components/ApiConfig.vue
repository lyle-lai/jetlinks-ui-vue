<template>
    <div>
        <a-form layout="vertical">
<!--            <a-button type="primary" @click="showApiSelectModal">从Swagger导入</a-button>-->
            <a-button type="primary" @click="addApiManually" style="margin-left: 8px">添加API</a-button>

            <a-table :columns="columns" :data-source="formData.apis" row-key="key" style="margin-top: 16px;">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'apiPath'">
                        <a-input v-model:value="record.apiPath" placeholder="请输入API路径" />
                    </template>
                    <template v-if="column.key === 'requestMethod'">
                        <a-select v-model:value="record.requestMethod" style="width: 100%">
                            <a-select-option value="GET">GET</a-select-option>
                            <a-select-option value="POST">POST</a-select-option>
                            <a-select-option value="PUT">PUT</a-select-option>
                            <a-select-option value="DELETE">DELETE</a-select-option>
                            <a-select-option value="PATCH">PATCH</a-select-option>
                            <a-select-option value="HEAD">HEAD</a-select-option>
                            <a-select-option value="OPTIONS">OPTIONS</a-select-option>
                            <a-select-option value="TRACE">TRACE</a-select-option>
                        </a-select>
                    </template>
                    <template v-if="column.key === 'rateLimit'">
                        <a-input v-model:value="record.rateLimit" placeholder="例如: 60次/分钟" />
                    </template>
                    <template v-if="column.key === 'signatureVerificationEnabled'">
                        <a-switch v-model:checked="record.signatureVerificationEnabled" />
                    </template>
                    <template v-if="column.key === 'description'">
                        <a-input v-model:value="record.description" placeholder="请输入描述" />
                    </template>
                    <template v-if="column.key === 'action'">
                        <a-button type="link" @click="removeApi(record.key)">移除</a-button>
                    </template>
                </template>
            </a-table>

            <a-form-item :wrapper-col="{ span: 24 }" style="text-align: center; margin-top: 24px;">
                <a-button type="primary" @click="handleSave" :loading="loading">保存</a-button>
                <a-button style="margin-left: 8px" @click="loadData">重置</a-button>
            </a-form-item>
        </a-form>

        <ApiSelectModal v-if="apiSelectModalVisible" v-model:visible="apiSelectModalVisible" @select="handleApiSelect" />
    </div>
</template>

<script setup lang="ts" name="OpenPlatformApiConfig">
import { ref, watch } from 'vue';
import ApiSelectModal from './ApiSelectModal.vue';
import type { ApiInfo } from '../../typing.d.ts';
import { getApiConfig, saveApiConfig } from '@/api/system/openPlatform';
import { onlyMessage } from '@/utils/comm';

const props = defineProps<{ id: string }>();

const loading = ref(false);
const formData = ref<any>({
    apis: []
});
const apiSelectModalVisible = ref(false);

const columns = [
    { title: 'API路径', dataIndex: 'apiPath', key: 'apiPath' },
    { title: '请求方法', dataIndex: 'requestMethod', key: 'requestMethod' },
    { title: '调用次数限制', key: 'rateLimit' },
    { title: '签名校验', dataIndex: 'signatureVerificationEnabled', key: 'signatureVerificationEnabled' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    { title: '操作', key: 'action' },
];

const loadData = () => {
    if (props.id) {
        loading.value = true;
        getApiConfig(props.id).then(resp => {
            if (resp.success) {
                formData.value = { apis: resp.result || [] };
            }
        }).finally(() => {
            loading.value = false;
        });
    }
}

watch(() => props.id, () => {
    loadData();
}, { immediate: true });

const handleSave = async () => {
    loading.value = true;
    try {
        for (const api of formData.value.apis) {
            if (!api.apiPath) {
                onlyMessage('API路径不能为空', 'error');
                loading.value = false;
                return;
            }
            if (!api.requestMethod) {
                onlyMessage('请求方法不能为空', 'error');
                loading.value = false;
                return;
            }
            if (!api.rateLimit) {
                onlyMessage('调用次数限制不能为空', 'error');
                loading.value = false;
                return;
            }
        }

        const payload = formData.value.apis.map((api: ApiInfo & { key?: number }) => {
            const { key, ...rest } = api;
            return {
                ...rest,
                platformAppId: props.id,
            };
        });
        const resp = await saveApiConfig(props.id, payload);
        if (resp.success) {
            onlyMessage('保存成功', 'success');
        }
    } catch (err) {
        console.error(err);
    } finally {
        loading.value = false;
    }
}

const showApiSelectModal = () => {
    apiSelectModalVisible.value = true;
};

const addApiManually = () => {
    if (!formData.value.apis) {
        formData.value.apis = [];
    }
    formData.value.apis.push({ key: Date.now() + Math.random(), apiPath: '', requestMethod: 'GET', rateLimit: '60/m', signatureVerificationEnabled: true, description: '' });
};

const removeApi = (key: string) => {
    formData.value.apis = formData.value.apis.filter((api: ApiInfo & { key?: number }) => api.key !== key);
};

const handleApiSelect = (selectedApis: ApiInfo[]) => {
    if (!formData.value.apis) {
        formData.value.apis = [];
    }
    // Merge logic: filter out duplicates based on apiPath and requestMethod
    const existingApis = new Set(formData.value.apis.map((api: ApiInfo) => `${api.apiPath}-${api.requestMethod}`));
    const newUniqueApis = selectedApis.filter((api: ApiInfo) => !existingApis.has(`${api.apiPath}-${api.requestMethod}`))
        .map(api => ({ ...api, key: Date.now() + Math.random() })); // Add unique key to selected APIs

    formData.value.apis = [...formData.value.apis, ...newUniqueApis];
    apiSelectModalVisible.value = false;
};

</script>
