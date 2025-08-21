<template>
    <a-modal
        :visible="true"
        title="查看凭证"
        @cancel="emits('close')"
    >
        <a-form layout="vertical">
            <a-form-item label="App ID">
                <a-input-group compact>
                    <a-input :value="data.id" readonly />
                </a-input-group>
            </a-form-item>
            <a-form-item label="App Key">
                <a-input-group compact>
                    <a-input :value="data.appKey" readonly />
                </a-input-group>
            </a-form-item>
            <a-form-item label="App Secret">
                <a-input-password :value="data.appSecret" readonly placeholder="••••••••"/>
            </a-form-item>
        </a-form>
        <template #footer>
            <a-button @click="emits('close')">关闭</a-button>
            <a-button type="primary" @click="copyAllCredentials">一键复制</a-button>
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { onlyMessage } from '@/utils/comm';

const props = defineProps<{ data: Partial<Record<string, any>> }>();

const emits = defineEmits(['close']);

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

const copyAll = () => {
    const { id, appKey, appSecret } = props.data;
    if (!id && !appKey && !appSecret) {
        onlyMessage('没有可复制的凭证信息', 'warning');
        return;
    }

    const credentialString = `App ID: ${id || ''}\nApp Key: ${appKey || ''}\nApp Secret: ${appSecret || ''}`;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(credentialString).then(() => {
            onlyMessage('凭证信息已复制到剪贴板');
        }).catch(err => {
            console.error('Could not copy text: ', err);
            onlyMessage('复制失败', 'error');
        });
    } else {
        onlyMessage('浏览器不支持剪贴板API', 'error');
    }
}

const copyAllCredentials = () => {
  const { id, appKey, appSecret } = props.data;
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
</script>