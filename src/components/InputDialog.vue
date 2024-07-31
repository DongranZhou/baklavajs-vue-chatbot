<template>
  <ElDialog :title="title" v-model="visible">
    <ElForm>
      <ElFormItem label="名称">
        <ElInput v-model="input" />
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" @click="submit">提交</ElButton>
      </ElFormItem>
    </ElForm>
  </ElDialog>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const visible = ref(false)
const title = ref('')
const input = ref('')
const callback = ref<(input: string) => void>(() => { })

const openDialog = (_title: string, _callback: (input: string) => void) => {
  title.value = _title;
  callback.value = _callback
  visible.value = true;
}

const closeDialog = () => {
  visible.value = false
}

const submit = () => {
  callback.value(input.value)
  visible.value = false
}

defineExpose({
  openDialog,
  closeDialog
})
</script>