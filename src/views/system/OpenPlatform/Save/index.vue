<template>
    <j-page-container>
        <full-page :fixed="false">
            <div class="save-container">
                <div class="left">
                    <j-scrollbar>
                        <EditForm @change-tab="changeType" />
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
import { ref } from 'vue';
import HelpPanel from './components/HelpPanel.vue';
import EditForm from './components/EditForm.vue';

const rightType = ref<string>('base');
const changeType = (newType: string) => {
    rightType.value = newType;
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