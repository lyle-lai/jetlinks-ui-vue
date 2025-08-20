<template>
    <div class="help-panel">
        <a-card :title="helpTitle">
            <div v-html="helpContent"></div>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, watch } from 'vue';

const props = defineProps<{ currentTab: string }>();

const helpData: Record<string, { title: string, content: string }> = {
    base: {
        title: '应用注册信息帮助',
        content: `
            <p><strong>应用名称:</strong> 用于识别您的应用，建议使用有意义的名称。</p>
            <p><strong>回调地址:</strong> 用于接收平台推送的事件通知，必须是合法的URL。</p>
            <p><strong>授权类型:</strong> 选择您的应用需要与平台交互的方式。</p>
            <p><strong>应用凭证:</strong> 是您应用与平台通信的唯一身份标识，请妥善保管，不要泄露。</p>
        `,
    },
    deviceAccess: {
        title: '设备数据授权帮助',
        content: `
            <p><strong>白名单模式:</strong> (推荐) 只有明确添加到列表中的设备/产品等资源，您的应用才能访问。这是最安全的模式。</p>
            <p><strong>黑名单模式:</strong> 您的应用可以访问所有设备资源，除了被明确添加到列表中的资源。请谨慎使用此模式。</p>
            <p><strong>如何选择:</strong> 如果您只需要访问一小部分特定设备，请使用白名单。如果您需要访问绝大部分设备，只有少数例外，可以使用黑名单。</p>
        `,
    },
    apiConfig: {
        title: 'API权限配置帮助',
        content: `
            <p><strong>从Swagger导入:</strong> 推荐使用此方式从平台自动加载可用的API列表，避免手动输入错误。</p>
            <p><strong>调用次数限制:</strong> 设置单个API的调用频率，以防止恶意调用或程序错误导致平台资源耗尽。格式为“次数/时间单位”，例如 '60/m' (60次/分钟), '1000/h' (1000次/小时)。</p>
            <p><strong>签名校验:</strong> (推荐开启) 开启后，平台会验证每个API请求的签名，以确保请求未被篡改，大大增强安全性。</p>
        `,
    },
};

const helpTitle = computed(() => helpData[props.currentTab]?.title || '帮助中心');
const helpContent = computed(() => helpData[props.currentTab]?.content || '<p>请在左侧选择一个配置项以查看相关帮助。</p>');

</script>

<style scoped>
.help-panel {
    border-left: 1px solid #f0f0f0;
    padding-left: 16px;
}
</style>
