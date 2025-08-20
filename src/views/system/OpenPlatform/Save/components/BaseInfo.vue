<template>
    <div>
        <a-form-item label="应用名称" name="name" :rules="[{ required: true, message: '请输入应用名称' }]">
            <a-input v-model:value="formData.name" placeholder="请输入应用名称" />
        </a-form-item>
        <a-form-item label="应用描述" name="description">
            <a-textarea v-model:value="formData.description" placeholder="请输入应用描述" :rows="3" />
        </a-form-item>

        <template v-if="isEdit">
            <a-divider />
            <h3>应用凭证</h3>
            <a-form-item label="App ID">
                <a-input :value="formData.id" readonly />
            </a-form-item>
            <a-form-item label="App Key">
                <a-input :value="formData.appKey" readonly />
            </a-form-item>
            <a-form-item label="App Secret">
                <a-input-password :value="formData.appSecret" readonly>
<!--                     <template #addonAfter>-->
<!--                        <j-button type="link" @click="resetSecret">重置</j-button>-->
<!--                     </template>-->
                </a-input-password>
            </a-form-item>
            <a-form-item>
                <j-button type="primary" @click="copyAllCredentials">一键复制凭证</j-button>
            </a-form-item>
        </template>
    </div>
</template>

<script setup lang="ts" name="OpenPlatformBaseInfo">
import { ref, watch, computed, defineProps, defineEmits } from 'vue';
import type { OpenPlatformItem } from '../../typing.d.ts';
import { onlyMessage } from '@/utils/comm';

const props = defineProps<{ modelValue: Partial<OpenPlatformItem> }>();
const emit = defineEmits(['update:modelValue']);

const formData = ref<Partial<OpenPlatformItem>>({});

const isEdit = computed(() => !!props.modelValue?.id);

watch(() => props.modelValue, (newData) => {
    formData.value = newData;
}, { immediate: true, deep: true });

watch(formData, (newData) => {
    emit('update:modelValue', newData);
}, { deep: true });

const copyAllCredentials = () => {
    const { id, appKey, appSecret } = formData.value;
    if (!id || !appKey || !appSecret) {
        onlyMessage('凭证不完整', 'warning');
        return;
    }
    const textToCopy = `App ID: ${id}\nApp Key: ${appKey}\nApp Secret: ${appSecret}`;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            onlyMessage('复制成功');
        }).catch(err => {
            console.error('Could not copy text: ', err);
            onlyMessage('复制失败', 'error');
        });
    } else {
        // Fallback for insecure contexts
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        
        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                onlyMessage('复制成功');
            } else {
                onlyMessage('复制失败', 'error');
            }
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
            onlyMessage('复制失败', 'error');
        }

        document.body.removeChild(textArea);
    }
};

const resetSecret = () => {
    // Call API to reset secret
    // Then update formData.value.appSecret
    console.log('Resetting secret...');
    onlyMessage.success('重置成功');
};

</script>