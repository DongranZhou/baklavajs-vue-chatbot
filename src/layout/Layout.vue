<template>
  <div style="width: 100%; height: 100%; background-color: black">
    <ElContainer style="width: 100%; height: 100%">
      <ElAside style="
            background-color: #1f2d40;
            border: 1px solid #304562;
            border-radius: 3px;
            margin: 5px;
          " width="200px">
        <HistoryLayout @onSelected="onHistorySelected"></HistoryLayout>
      </ElAside>
      <ElContainer>
        <ElHeader height="36px" style="
              background-color: #1f2d40;
              border: 1px solid #304562;
              border-radius: 3px;
              margin: 5px;
            ">
          <div style="
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content:space-between
              ">
            <div style="display: flex;">
              <ElButton @click="saveCurrent">保存</ElButton>
              <ElDropdown style="margin-left: 10px;" trigger="click">
                <ElButton>对话</ElButton>
                <template #dropdown>
                  <ElDropdownMenu>
                    <ElDropdownItem @click="createNewHistory">新建</ElDropdownItem>
                    <ElDropdownItem @click="saveAsNewHistory">另存</ElDropdownItem>
                    <ElDropdownItem @click="saveHistory">保存</ElDropdownItem>
                    <ElDropdownItem @click="exportHistory">导出</ElDropdownItem>
                  </ElDropdownMenu>
                </template>
              </ElDropdown>
              <ElDropdown style="margin-left: 10px;" trigger="click">
                <ElButton>场景</ElButton>
                <template #dropdown>
                  <ElDropdownMenu>
                    <ElDropdownItem @click="createNewScene">新建</ElDropdownItem>
                    <ElDropdownItem @click="saveAsNewScene">另存</ElDropdownItem>
                    <ElDropdownItem @click="saveScene">保存</ElDropdownItem>
                    <ElDropdownItem @click="exportScene">导出</ElDropdownItem>
                  </ElDropdownMenu>
                </template>
              </ElDropdown>
            </div>
            <div style="display: flex;">
              <ElRadioGroup v-model="view">
                <ElRadioButton value="chat">Chat</ElRadioButton>
                <ElRadioButton value="both">Both</ElRadioButton>
                <ElRadioButton value="graph">Graph</ElRadioButton>
              </ElRadioGroup>
            </div>
          </div>
        </ElHeader>
        <ElMain style="
              background-color: #1f2d40;
              border: 1px solid #304562;
              border-radius: 3px;
              margin: 5px;
              padding: 0;
              display: flex;
            ">
          <ChatHistory style="margin:0 2px;" :class="[view == 'chat' ? 'full' : '', view == 'both' ? 'half' : '']"
            v-show="view == 'both' || view == 'chat'" ref="chat"></ChatHistory>
          <BaklavaEditor style="margin:0 2px;" :class="[view == 'graph' ? 'full' : '', view == 'both' ? 'half' : '']"
            v-show="view == 'both' || view == 'graph'" ref="baklava" />
        </ElMain>
        <ElFooter height="100px" style="
              background-color: #1f2d40;
              border: 1px solid #304562;
              border-radius: 3px;
              margin: 5px;
              display: flex;
              align-items: center;
              padding: 0 5px;
            ">
          <ElInput style="height: 90%;display: flex;" v-model="inputMessage" type="textarea" resize="none"></ElInput>
          <ElButton style="height: 90%;width: 120px;margin-left: 10px;" @click="execute" :disabled="running">发送
          </ElButton>
        </ElFooter>
      </ElContainer>
      <ElAside style="
            background-color: #1f2d40;
            border: 1px solid #304562;
            border-radius: 3px;
            margin: 5px;
          " width="200px">
        <SceneLayout @onSelected="onSceneSelected"></SceneLayout>
      </ElAside>
    </ElContainer>
    <InputDialog ref="dialog" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import BaklavaEditor from "../components/BaklavaEditor.vue";
import { useGraphStore, useHistoryStore } from '../store/index'
import ChatHistory from "../components/ChatHistory.vue";
import InputDialog from "../components/InputDialog.vue";
import HistoryLayout from "./HistoryLayout.vue";
import SceneLayout from "./SceneLayout.vue";
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu, ElMessage, ElRadioButton, ElRadioGroup, ElRow, ElText } from "element-plus";

const graphStore = useGraphStore();
const historyStore = useHistoryStore();

const baklava = ref<InstanceType<typeof BaklavaEditor>>();
const chat = ref<InstanceType<typeof ChatHistory>>();
const dialog = ref<InstanceType<typeof InputDialog>>();
const view = ref("chat")

const running = ref(false);
const inputMessage = ref("");
const execute = () => {
  if (inputMessage.value) {
    running.value = true;
    baklava.value?.runOnce({ message: inputMessage.value, exec: true, history: chat.value?.getHistory() }).then((res: any) => {
      if (res) {
        chat.value?.appendMessage({ role: "user", content: inputMessage.value })
        chat.value?.appendMessage({ role: "assistant", content: res })
        inputMessage.value = ''
      }
    }).catch(err => {
      ElMessage.error(err)
    }).finally(() => {
      running.value = false;
    });
  }
};

const saveCurrent = () => {
  if (graphStore.currentGraph == -1 || historyStore.currentHistory == -1) {
    dialog.value?.openDialog('保存', (input: string) => {
      if (graphStore.currentGraph == -1) {
        const graph = baklava.value?.getGraph();
        if (graph) {
          graphStore.saveGraph(graph, input)
          graphStore.currentGraph = graphStore.graphs.length - 1;
        }
      } else {
        if (baklava.value) {
          graphStore.getGraph(graphStore.currentGraph).state = baklava.value.getGraph();
        }
      }
      graphStore.save()

      if (historyStore.currentHistory == -1) {
        const history = chat.value?.getHistory();
        if (history) {
          historyStore.saveHistory(history, input)
          historyStore.currentHistory = historyStore.histories.length - 1;
        }
      } else {
        if (chat.value) {
          historyStore.getHistory(historyStore.currentHistory).history = chat.value.getHistory()
        }
      }
      historyStore.save()
    });
  } else {
    if (baklava.value) {
      graphStore.getGraph(graphStore.currentGraph).state = baklava.value.getGraph();
      graphStore.save();
    }
    if (chat.value) {
      historyStore.getHistory(historyStore.currentHistory).history = chat.value.getHistory()
      historyStore.save();
    }
  }
}

const createNewScene = () => {
  const graph = graphStore.createNewGraph();
  if (graph) {
    baklava.value?.setGraph(graph)
    graphStore.currentGraph = -1;
  }
}

const saveAsNewScene = () => {
  dialog.value?.openDialog('另存场景为', (input: string) => {
    const graph = baklava.value?.getGraph();
    if (graph) {
      graphStore.saveGraph(graph, input)
    }
  });
}

const saveScene = () => {
  if (graphStore.currentGraph == -1) {
    dialog.value?.openDialog('保存场景', (input: string) => {
      const graph = baklava.value?.getGraph();
      if (graph) {
        graphStore.saveGraph(graph, input)
        graphStore.save()
        graphStore.currentGraph = graphStore.graphs.length - 1;
      }
    });
  } else {
    if (baklava.value) {
      graphStore.getGraph(graphStore.currentGraph).state = baklava.value.getGraph();
      graphStore.save()
    }
  }
}

const exportScene = () => {
  exportJson(baklava.value?.getGraph(), 'scene.json');
}

const onSceneSelected = (index: number, graph: any) => {
  if (graph) {
    baklava.value?.setGraph(graph.state)
  }
}

const createNewHistory = () => {
  const history = historyStore.createNewHistory();
  if (history) {
    chat.value?.openHistory(history.history)
    historyStore.currentHistory = -1;
  }
}

const saveAsNewHistory = () => {
  dialog.value?.openDialog('另存对话为', (input: string) => {
    const history = chat.value?.getHistory();
    if (history) {
      historyStore.saveHistory(history, input)
    }
  });
}

const saveHistory = () => {
  if (historyStore.currentHistory == -1) {
    dialog.value?.openDialog('保存对话', (input: string) => {
      const history = chat.value?.getHistory();
      if (history) {
        historyStore.saveHistory(history, input)
        historyStore.save()
        historyStore.currentHistory = historyStore.histories.length - 1;
      }
    });
  } else {
    if (chat.value) {
      historyStore.getHistory(historyStore.currentHistory).history = chat.value.getHistory()
      historyStore.save()
    }
  }
}

const exportHistory = () => {
  exportJson(chat.value?.getHistory(), 'history.json');
}

const onHistorySelected = (index: number, history: any) => {
  if (history) {
    chat.value?.openHistory(history.history)
  }
}

const exportJson = (data: any, filename: string = "json.json") => {
  if (!filename) filename = "json.json";
  if (!data) {
    alert("保存的数据为空");
    return;
  }
  if (typeof data === "object") {
    data = JSON.stringify(data, undefined, 4);
  }
  var blob = new Blob([data], { type: "text/json" });
  const a = document.createElement("a");
  a.download = filename;
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
  const e = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: window,
    detail: 1,
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    button: 0,
    relatedTarget: null
  })
  a.dispatchEvent(e);
}
</script>
<style scoped>
.half {
  width: 50%;
}

.full {
  width: 100%;
}
</style>