<template>
    <div class="doc">
        <div class="url">
            {{ $t('Detail.doc.463951-0') }}
            <a
                href="https://dueros.baidu.com/dbp/bot/index#/iotopenplatform"
                target="_blank"
                rel="noopener noreferrer"
            >
                https://dueros.baidu.com/dbp/bot/index#/iotopenplatform
            </a>
        </div>
        <h1>{{ $t('Detail.doc.463951-1') }}</h1>
        <div>
            {{ $t('Detail.doc.463951-2') }}
        </div>
        <h1>{{ $t('Detail.doc.463951-3') }}</h1>
        <div>
            <div>{{ $t('Detail.doc.463951-4') }}</div>
            <div>
                {{ $t('Detail.doc.463951-5') }}
            </div>
            <div class="image">
                <a-image
                    width="100%"
                    :src="doc"
                />
                <div class="desc">{{ $t('Detail.doc.463951-6') }}</div>
            </div>
            <a-descriptions
                bordered
                size="small"
                :column="1"
                :labelStyle="{ width: '100px' }"
            >
                <a-descriptions-item :label="$t('Detail.doc.463951-7')">{{ $t('Detail.doc.463951-8') }}</a-descriptions-item>
                <a-descriptions-item :label="$t('Detail.doc.463951-9')"
                    >{{ $t('Detail.doc.463951-10') }}</a-descriptions-item
                >
                <a-descriptions-item label="Client_Id">
                    {{ $t('Detail.doc.463951-11') }}
                </a-descriptions-item>
                <a-descriptions-item label="Scope">
                    {{ $t('Detail.doc.463951-12') }}
                </a-descriptions-item>
                <a-descriptions-item :label="$t('Detail.doc.463951-13')">
                    {{ $t('Detail.doc.463951-14') }}
                </a-descriptions-item>
                <a-descriptions-item label="ClientSecret">
                    {{ $t('Detail.doc.463951-15') }}
                </a-descriptions-item>
                <a-descriptions-item label="WebService">
                    {{ $t('Detail.doc.463951-16') }}
                </a-descriptions-item>
            </a-descriptions>
            <div class="image">
                <a-image
                    width="100%"
                    :src="doc1"
                />
                <div class="desc">{{ $t('Detail.doc.463951-17') }}</div>
            </div>
            <a-descriptions
                bordered
                size="small"
                :column="1"
                :labelStyle="{ width: '100px' }"
            >
                <a-descriptions-item :label="$t('Detail.doc.463951-7')">{{ $t('Detail.doc.463951-8') }}</a-descriptions-item>
                <a-descriptions-item label="appId">
                    {{ $t('Detail.doc.463951-18') }}
                </a-descriptions-item>
                <a-descriptions-item label="secureKey">
                    {{ $t('Detail.doc.463951-19') }}
                </a-descriptions-item>
                <a-descriptions-item :label="$t('Detail.doc.463951-20')">
                    {{ $t('Detail.doc.463951-21') }}
                </a-descriptions-item>
                <a-descriptions-item :label="$t('Detail.doc.463951-22')">
                    {{ $t('Detail.doc.463951-23') }}
                </a-descriptions-item>
                <a-descriptions-item label="redirectUrl">
                    {{ $t('Detail.doc.463951-24') }}
                </a-descriptions-item>
                <a-descriptions-item :label="$t('Detail.doc.463951-25')">
                    {{ $t('Detail.doc.463951-26') }}
                </a-descriptions-item>
            </a-descriptions>
            <div>{{ $t('Detail.doc.463951-27') }}</div>
            <div>
                {{ $t('Detail.doc.463951-28') }}
            </div>
        </div>
        <h1>{{ $t('Detail.doc.463951-29') }}</h1>
        <div>
            {{ $t('Detail.doc.463951-30') }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import doc from '../../../../assets/northbound/dueros-doc.jpg'
import doc1 from '../../../../assets/northbound/dueros-doc1.png'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
</script>

<style lang="less" scoped>
.doc {
    height: 100%;
    padding: 24px;
    overflow-y: auto;
    color: rgba(#000, 0.8);
    font-size: 14px;
    background-color: #fafafa;
    &::-webkit-scrollbar {
        width: 5px; /* 滚动条宽度 */
        background-color: #edf5ff; /* 滚动条背景色 */
    }
    &::-webkit-scrollbar-thumb {
        background-color: #d0d0d0; /* 滚动条拖动部分颜色 */
        border-radius: 4px; /* 滚动条拖动部分圆角 */
    }
    .url {
        padding: 8px 16px;
        color: #2f54eb;
        background-color: rgba(#a7bdf7, 0.2);
        word-wrap: break-word;
    }

    h1 {
        margin: 16px 0;
        color: rgba(#000, 0.85);
        font-weight: bold;
        font-size: 14px;

        &:first-child {
            margin-top: 0;
        }
    }

    h2 {
        margin: 6px 0;
        color: rgba(0, 0, 0, 0.8);
        font-size: 14px;
    }

    .image {
        margin: 16px 0;

        .desc {
            width: 100%;
            text-align: center;
            color: rgb(138, 143, 141);
            margin-top: 10px;
        }
    }
}
</style>
