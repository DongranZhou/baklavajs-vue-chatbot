<template>
  <div v-html="content" style="width: 100%;height: 100%;" class="markdown-body"></div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import "github-markdown-css"
import { onMounted, ref, watch} from "vue";

const props = defineProps({
  md: {
    type: String,
    default:""
  },
});
const render = new marked.Renderer()
marked.setOptions({
  renderer: render,
  gfm: true,	
  pedantic: false, 
})
const content = ref("");

watch(()=>props.md,async (newVal)=>{
  content.value = await marked(newVal)
})

onMounted(async ()=>{
  content.value = await marked(props.md)
})
</script>
<style>

</style>