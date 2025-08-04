<template>
    <div class="doc">
        <div className="url">
            {{ $t('Detail.doc.752327-0') }}
            <a
                :style="{ wordBreak: 'break-all' }"
                href="https://help.aliyun.com/document_detail/87368.html"
                target="_blank"
                rel="noreferrer"
            >
                https://help.aliyun.com/document_detail/87368.html
            </a>
        </div>
        <h1>{{ $t('Detail.doc.752327-1') }}</h1>
        <div>
            {{ $t('Detail.doc.752327-2') }}
        </div>
        <div class="image">
            <a-image width="100%" :src="aliyun2" />
        </div>
        <h1>{{ $t('Detail.doc.752327-3') }}</h1>
        <div>
            <h2>{{ $t('Detail.doc.752327-4') }}</h2>
            <div>
                {{ $t('Detail.doc.752327-5') }}
            </div>
            <div>{{ $t('Detail.doc.752327-6') }}</div>
            <div class="image">
                <a-image
                    width="100%"
                    :src="aliyun3"
                />
            </div>
            <h2>2、AccesskeyID/Secret</h2>
            <div>
                {{ $t('Detail.doc.752327-7') }}
            </div>
            <div class="image">
                <a-image
                    width="100%"
                    :src="aliyun1"
                />
            </div>
            <h2>{{ $t('Detail.doc.752327-8') }}</h2>
            <div>
                {{ $t('Detail.doc.752327-9') }}
            </div>
            <h2>{{ $t('Detail.doc.752327-10') }}</h2>
            <div>
                {{ $t('Detail.doc.752327-11') }}
            </div>
            <div class="image">
                <a-image
                    width="100%"
                    :src="aliyun4"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
// import { getImage } from '@/utils/comm';
import aliyun1 from '../../../../assets/northbound/aliyun1.jpg'
import aliyun2 from '../../../../assets/northbound/aliyun2.png'
import aliyun3 from '../../../../assets/northbound/aliyun3.png'
import aliyun4 from '../../../../assets/northbound/aliyun4.png'
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
    }
}
</style>
