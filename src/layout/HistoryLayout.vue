<template>
    <ElScrollbar>
        <ElDropdown split-button trigger="click"
            :class="['baklava-node', '--palette', (index == historyStore.currentHistory) ? '--selected' : '']" style="
                margin: 5%;
                padding: 5px 5px;
                text-align: center
              " v-for="(item, index) in historyStore.histories" :key="index" @click="onHistorySelected(index)">
            <div style="width: 100px">
                <ElText>
                    {{ item.name }}
                </ElText>
            </div>
            <template #dropdown>
                <ElDropdownMenu>
                    <ElDropdownItem @click="onHistorySelected(index)">选择</ElDropdownItem>
                    <ElDropdownItem @click="deleteHistory(index)">删除</ElDropdownItem>
                </ElDropdownMenu>
            </template>
        </ElDropdown>
    </ElScrollbar>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useHistoryStore } from '../store/index'

const historyStore = useHistoryStore();
const emits = defineEmits(['onSelected'])
const deleteHistory = (index: number = -1) => {
    if (index < 0) {
        historyStore.deleteHistory(historyStore.currentHistory);
        historyStore.currentHistory = -1;
        emits('onSelected', index)
    } else {
        historyStore.deleteHistory(index);
    }
}

const onHistorySelected = (index: number) => {
    const history = historyStore.getHistory(index);
    if (history) {
        emits('onSelected', index, history)
        historyStore.currentHistory = index;
    }
}

onMounted(() => {
    if (historyStore.histories.length > 0) {
        onHistorySelected(0)
    }
})
</script>