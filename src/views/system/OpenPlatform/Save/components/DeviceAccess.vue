<template>
    <div>
        <a-form layout="vertical">
            <a-form-item label="授权模式">
                <a-radio-group v-model:value="currentMode">
                    <a-radio value="WHITELIST">白名单模式</a-radio>
                    <a-radio value="BLACKLIST">黑名单模式</a-radio>
                </a-radio-group>
                <div class="form-item-explain">
                    <p v-if="currentMode === 'WHITELIST'">白名单模式：仅允许访问列表中的设备资源。</p>
                    <p v-else>黑名单模式：禁止访问列表中的设备资源。</p>
                </div>
            </a-form-item>

            <a-button type="primary" @click="showAddRuleModal">添加授权</a-button>

            <a-table :columns="columns" :data-source="displayedRules" row-key="id" style="margin-top: 16px;">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'type'">
                        {{ getRuleTypeText(record.type) }}
                    </template>
                    <template v-if="column.key === 'action'">
                        <a-button type="link" @click="removeRule(record.id)">移除</a-button>
                    </template>
                </template>
            </a-table>

             <a-form-item :wrapper-col="{ span: 24 }" style="text-align: center; margin-top: 24px;">
                <a-button type="primary" @click="handleSave" :loading="loading">保存</a-button>
                <a-button style="margin-left: 8px" @click="loadData">重置</a-button>
            </a-form-item>
        </a-form>

        <!-- 添加授权规则弹窗 -->
        <AddDeviceAccessRuleModal
            v-if="addDeviceAccessRuleModalVisible"
            v-model:visible="addDeviceAccessRuleModalVisible"
            @select="handleAddRule"
        />
    </div>
</template>

<script setup lang="ts" name="OpenPlatformDeviceAccess">
import { ref, watch, computed } from 'vue';
import { onlyMessage } from '@/utils/comm';
import AddDeviceAccessRuleModal from './AddDeviceAccessRuleModal.vue';
import { getDeviceAuthRules, saveDeviceAuthRules } from '@/api/system/openPlatform';

const props = defineProps<{ id: string }>();

const loading = ref(false);
const addDeviceAccessRuleModalVisible = ref(false);

// New state management
const currentMode = ref('WHITELIST'); // Controls the radio buttons
const whitelistRules = ref<any[]>([]);
const blacklistRules = ref<any[]>([]);

// The table will now display rules based on the current mode
const displayedRules = computed(() => {
    return currentMode.value === 'WHITELIST' ? whitelistRules.value : blacklistRules.value;
});

const columns = [
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '资源名称', dataIndex: 'name', key: 'name' },
    { title: '资源ID', dataIndex: 'id', key: 'id' },
    { title: '操作', key: 'action' },
];

const getRuleTypeText = (type: string) => {
  switch (type) {
    case 'DEVICE': return '设备';
    case 'PRODUCT': return '产品';
    case 'ORGANIZATION': return '组织';
    default: return type;
  }
};

const loadData = () => {
    if (props.id) {
        loading.value = true;
        getDeviceAuthRules(props.id).then(resp => {
            if (resp.success && resp.result) {
                const allRules = resp.result.map((item: any) => ({
                    id: item.resourceId,
                    type: item.resourceType.value,
                    name: item.resourceName,
                    mode: item.mode.value
                }));

                whitelistRules.value = allRules.filter((rule:any) => rule.mode === 'WHITELIST');
                blacklistRules.value = allRules.filter((rule:any) => rule.mode === 'BLACKLIST');
            }
        }).catch(() => {
            whitelistRules.value = [];
            blacklistRules.value = [];
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
        // 获取当前选中模式下的规则列表
        const rulesToSave = currentMode.value === 'WHITELIST' ? whitelistRules.value : blacklistRules.value;

        // 将UI数据转换为后端实体格式
        const payload = rulesToSave.map((rule: any) => ({
            platformAppId: props.id,
            mode: currentMode.value,
            resourceType: rule.type,
            resourceId: rule.id,
            resourceName: rule.name
        }));

        // 警告：此操作将使用当前模式的列表覆盖后端的全部规则，另一模式的规则将会丢失。
        const resp = await saveDeviceAuthRules(props.id, payload);
        if (resp.success) {
            onlyMessage('保存成功','success');
        }
    } catch (err) {
        console.error(err);
    } finally {
        loading.value = false;
    }
}

const showAddRuleModal = () => {
    addDeviceAccessRuleModalVisible.value = true;
};

const handleAddRule = (selectedRules: any[]) => {
    const targetList = currentMode.value === 'WHITELIST' ? whitelistRules.value : blacklistRules.value;

    selectedRules.forEach(newRule => {
        const exists = targetList.some((rule: any) => rule.id === newRule.id && rule.type === newRule.type);
        if (!exists) {
            targetList.push({
                id: newRule.id,
                type: newRule.type,
                name: newRule.name || newRule.id,
            });
        }
    });
    addDeviceAccessRuleModalVisible.value = false;
};

const removeRule = (id: string) => {
    const targetList = currentMode.value === 'WHITELIST' ? whitelistRules : blacklistRules;
    targetList.value = targetList.value.filter((rule: any) => rule.id !== id);
};

</script>

<style lang="less" scoped>
.form-item-explain {
    color: #999;
    font-size: 12px;
    margin-top: 4px;
}
</style>
