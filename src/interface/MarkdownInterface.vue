<template>
  <MDEditor style="text-align: left;" :md="modelValue"></MDEditor>
</template>

<script setup lang="ts">
import MDEditor from "../components/MDEditor.vue";

defineProps<{ modelValue: string }>();

</script>
<style scoped>

</style>
