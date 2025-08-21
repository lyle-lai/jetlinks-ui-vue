<template>
    <j-page-container>
        <div class="open-platform-container">
            <pro-search
                :columns="columns"
                target="system-open-platform"
                @search="(params:any)=>queryParams = {...params}"
            />
            <FullPage>
                <j-pro-table
                    ref="tableRef"
                    :columns="columns"
                    modeValue="CARD"
                    :request="queryList"
                    :defaultParams="{
                        sorts: [{ name: 'createTime', order: 'desc' }],
                    }"
                    :params="queryParams"
                    :gridColumn="3"
                >
                    <template #headerLeftRender>
                        <j-permission-button
                            :hasPermission="`${permission}:add`"
                            type="primary"
                            @click="() => table.handleAdd()"
                        >
                            <AIcon type="PlusOutlined"/>
                            注册新应用
                        </j-permission-button>
                    </template>
                    <template #card="slotProps">
                        <CardBox
                            :value="slotProps"
                            :actions="table.getActions(slotProps)"
                            v-bind="slotProps"
                            :status="slotProps.status === 1 ? 'enabled' : 'disabled'"
                            :statusText="slotProps.status === 1 ? '正常' : '禁用'"
                            :statusNames="{
                                enabled: 'processing',
                                disabled: 'error',
                            }"
                        >
                            <template #img>
                                <AIcon type="AppstoreOutlined" style="font-size: 50px" />
                            </template>
                            <template #content>
                                <j-ellipsis
                                    style="
                                        width: calc(100% - 100px);
                                        font-size: 16px;
                                        color: rgb(49, 94, 251);
                                        font-weight: 700;
                                        margin-bottom: 8px;
                                    "
                                >
                                    {{ slotProps.name }}
                                </j-ellipsis>
                                <a-row>
                                    <a-col :span="12">
                                        <div class="card-item-content-text">
                                            App ID
                                        </div>
                                        <j-ellipsis>
                                            {{ slotProps.id }}
                                        </j-ellipsis>
                                    </a-col>
                                    <a-col :span="12">
                                        <div class="card-item-content-text">
                                            归属单位
                                        </div>
                                        <j-ellipsis>
                                            {{ slotProps.ownerName }}
                                        </j-ellipsis>
                                    </a-col>
                                </a-row>
                            </template>
                            <template #actions="item">
                                <j-permission-button
                                    :hasPermission="item.permission"
                                    :tooltip="item.tooltip"
                                    :pop-confirm="item.popConfirm"
                                    @click="item.onClick"
                                    :disabled="item.disabled"
                                >
                                    <AIcon :type="item.icon"/>
                                    <span>{{ item.text }}</span>
                                </j-permission-button>
                            </template>
                        </CardBox>
                    </template>
                    <template #state="slotProps">
                        <j-badge-status
                            :status="slotProps.status === 1 ? 'enabled' : 'disabled'"
                            :text="slotProps.status === 1 ? '正常' : '禁用'"
                            :statusNames="{
                                enabled: 'processing',
                                disabled: 'error',
                            }"
                        ></j-badge-status>
                    </template>
                    <template #action="slotProps">
                        <a-space :size="16">
                            <j-permission-button
                                v-for="i in table.getActions(slotProps, 'table')"
                                :hasPermission="i.permission"
                                type="link"
                                :key="i.key"
                                :tooltip="i.tooltip"
                                :pop-confirm="i.popConfirm"
                                @click="i.onClick"
                                :disabled="i.disabled"
                            >
                                <AIcon :type="i.icon"/>
                            </j-permission-button>
                        </a-space>
                    </template>
                </j-pro-table>
            </FullPage>
        </div>
                <CertificateModal
            v-if="certificateVisible"
            :data="currentApp"
            @close="certificateVisible = false"
        />
    </j-page-container>
</template>

<script setup lang="ts" name="OpenPlatform">
import { ref } from 'vue';
import { useMenuStore } from '@/store/menu';
import { query, enable, disable, remove } from '@/api/system/openPlatform';
import CertificateModal from './components/CertificateModal.vue';
import { onlyMessage } from '@/utils/comm';

const menuStory = useMenuStore();
const permission = 'system/OpenPlatform';
const queryParams = ref({});
const tableRef = ref();
const certificateVisible = ref(false);
const currentApp = ref<any>({});

const columns = [
    { title: '应用名称', dataIndex: 'name', key: 'name', search: { type: 'string' } },
    { title: 'App ID', dataIndex: 'id', key: 'id', search: { type: 'string' } },
    { title: '归属单位', dataIndex: 'ownerName', key: 'ownerName', search: { type: 'string' } },
    { title: '状态', dataIndex: 'status', key: 'status', search: { type: 'select', options: [{ label: '正常', value: 1 }, { label: '禁用', value: 0 }] } },
    { title: '操作', key: 'action', width: '200px', fixed: 'right' },
];

const queryList = (params: any) => {
    return query(params);
};



const table = {
    refresh: () => tableRef.value.reload(),
    handleAdd: () => {
        menuStory.jumpPage('system/OpenPlatform/Save', {});
    },
    handleEdit: (id: string) => {
        menuStory.jumpPage('system/OpenPlatform/Save', { query: { id } });
    },
    handleState: (record: any) => {
        const action = record.status === 1 ? disable : enable;
        action(record.id).then(resp => {
            if (resp.success) {
                onlyMessage('操作成功');
                table.refresh();
            }
        });
    },
    handleDelete: (id: string) => {
        remove(id).then(resp => {
            if (resp.success) {
                onlyMessage('删除成功');
                table.refresh();
            }
        });
    },
    showCertificate: (record: any) => {
        currentApp.value = record;
        certificateVisible.value = true;
    },
    getActions: (data: Partial<Record<string, any>>, type: 'card' | 'table' = 'card') => {
        if (!data) return [];
        const status = data.status; // Use data.status directly (0 or 1)
        const actions = [
            {
                permission: `${permission}:update`,
                key: 'edit',
                text: '编辑',
                tooltip: { title: '编辑' },
                icon: 'EditOutlined',
                onClick: () => table.handleEdit(data.id),
            },
            {
                permission: `${permission}:action`,
                key: 'action',
                text: status === 1 ? '禁用' : '启用', // 1 for enabled, 0 for disabled
                tooltip: { title: status === 1 ? '禁用' : '启用' },
                popConfirm: {
                    title: `确认${status === 1 ? '禁用' : '启用'}`,
                    onConfirm: () => table.handleState(data),
                },
                icon: status === 1 ? 'StopOutlined' : 'PlayCircleOutlined',
            },
            {
                permission: `${permission}:delete`,
                key: 'delete',
                text: '删除',
                tooltip: { title: status === 1 ? '请先禁用再删除' : '删除' },
                popConfirm: {
                    title: '确认删除？',
                    onConfirm: () => table.handleDelete(data.id),
                },
                disabled: status === 1, // Disable delete if status is 1 (enabled)
                icon: 'DeleteOutlined',
            },
            {
                permission: `${permission}:view`,
                key: 'certificate',
                text: '查看凭证',
                tooltip: { title: '查看凭证' },
                icon: 'KeyOutlined',
                onClick: () => table.showCertificate(data),
            }
        ];
        return type === 'card' ? actions : actions.filter(i => i.key !== 'certificate');
    }
}

</script>

<style lang="less" scoped>
.open-platform-container {
    .card-item-content-text {
        color: #0000008c;
        font-size: 12px;
        margin-bottom: 5px;
    }
}
</style>