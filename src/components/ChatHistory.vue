<!-- MyComponent.vue -->

<template>
  <ElScrollbar ref="scroller" class="--el-box-shadow-lighter"
    style="border-radius: 4px;  background-color: #2c3748">
    <div v-for="(message, index) in messages" :key="index" style="margin: 15px;" :class="message.role">
      <ElText class="message-user">{{ message.role }}</ElText>
      <MDEditor class="message-content" :md="message.content"></MDEditor>
    </div>
  </ElScrollbar>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted } from "vue";
import { ElText, ElScrollbar ,ElTag} from "element-plus";
import MDEditor from "../components/MDEditor.vue";

const scroller = ref<InstanceType<typeof ElScrollbar>>()

interface ChatMessage {
  role: string;
  content: string;
}

const messages = ref<Array<ChatMessage>>([])

onMounted(() => {
  scroller.value?.setScrollTop(scroller.value?.wrapRef?.scrollHeight ?? 0)
})

const appendMessage = async (message: ChatMessage) => {
  messages.value.push(message)
  await new Promise((resolve) => setTimeout(resolve, 100))
  scroller.value?.setScrollTop(scroller.value?.wrapRef?.scrollHeight ?? 0)
}

const clearHistory = () => {
  messages.value = []
}


const openHistory = (m: Array<ChatMessage>) => {
  messages.value = JSON.parse(JSON.stringify(m))
}

const getHistory = (): Array<ChatMessage> => {
  return messages.value
}
defineExpose({ openHistory, appendMessage, clearHistory, getHistory })

</script>
<style scoped>
.user {
  direction: rtl;
  text-align: right;
}

.assistant {
  direction: ltr;
  text-align: left;
}

.system {
  text-align: center;
}

.user .message-content {
  background-color: #151a24;
}

.assistant .message-content {
  background-color: #1b202c;
}

.system .message-content {
  background-color: #eaeaec;
  margin: 5px auto;
  color: #a8abb2;
}

.message-content {
  text-align: left;
  margin-top: 5px;
  direction: ltr;
  border-radius: 4px;
  max-width: 260px;
  padding: 5px;
  word-wrap: break-word;
  width: max-content !important;
}
</style>
