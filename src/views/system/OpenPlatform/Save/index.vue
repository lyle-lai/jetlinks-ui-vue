<template>
    <j-page-container :show-footer="false">
        <full-page :fixed="false">
            <div class="save-container">
                <div class="left">
                    <j-scrollbar>
                        <EditForm
                            :id="appId"
                            @change-tab="changeType"
                            @created="onAppCreated"
                        />
                    </j-scrollbar>
                </div>
                <div class="right">
                    <HelpPanel :current-tab="rightType" />
                </div>
            </div>
        </full-page>
    </j-page-container>
</template>

<script setup lang="ts" name="OpenPlatformSave">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HelpPanel from './components/HelpPanel.vue';
import EditForm from './components/EditForm.vue';

const route = useRoute();
const router = useRouter();

const rightType = ref<string>('base');
const appId = ref<string | undefined>(undefined);

onMounted(() => {
    appId.value = route.query.id as string;
});

const changeType = (newType: string) => {
    rightType.value = newType;
};

const onAppCreated = (newId: string) => {
    appId.value = newId;
    // 替换URL，以便刷新时能正确定位到当前应用
    router.replace({ query: { ...route.query, id: newId } });
};
</script>

<style lang="less" scoped>
.save-container {
    padding: 24px;
    display: flex;
    gap: 24px;
    min-height: 100%;

    .left {
        flex: 1;
        height: calc(100vh - 166px);
    }

    .right {
        min-width: 300px;
        width: 25%;
    }
}
</style>
