<template>
    <ElScrollbar>
        <ElDropdown split-button trigger="click"
            :class="['baklava-node', '--palette', (index == graphStore.currentGraph) ? '--selected' : '']" style="
                margin: 5%;
                padding: 5px 5px;
                text-align: center
              " v-for="(item, index) in graphStore.graphs" :key="index" @click="onSceneSelected(index)">
            <div style="width: 100px">
                <ElText>
                    {{ item.name }}
                </ElText>
            </div>
            <template #dropdown>
                <ElDropdownMenu>
                    <ElDropdownItem @click="onSceneSelected(index)">选择</ElDropdownItem>
                    <ElDropdownItem @click="deleteScene(index)">删除</ElDropdownItem>
                </ElDropdownMenu>
            </template>
        </ElDropdown>
    </ElScrollbar>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { useGraphStore, useHistoryStore } from '../store/index'

const emits = defineEmits(['onSelected'])

const graphStore = useGraphStore();

const onSceneSelected = (index: number) => {
    const graph = graphStore.getGraph(index);
    if (graph) {
        emits('onSelected', index, graph)
        graphStore.currentGraph = index;
    }
}

const deleteScene = (index: number = -1) => {
    if (index < 0) {
        graphStore.deleteGraph(graphStore.currentGraph);
        graphStore.currentGraph = -1;
        emits('onSelected', index)
    } else {
        graphStore.deleteGraph(index);
    }
}

onMounted(() => {
    if (graphStore.graphs.length > 0) {
        onSceneSelected(0)
    }
})
</script>