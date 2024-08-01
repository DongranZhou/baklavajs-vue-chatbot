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
                <ElButton>系统</ElButton>
                <template #dropdown>
                  <ElDropdownMenu>
                    <ElDropdownItem @click="exportData">导出</ElDropdownItem>
                    <ElDropdownItem>
                      <ElUpload :auto-upload="false" :show-file-list="false" :on-change="importData">
                        <template #trigger>
                          导入
                        </template>
                      </ElUpload>
                    </ElDropdownItem>
                  </ElDropdownMenu>
                </template>
              </ElDropdown>
              <ElDropdown style="margin-left: 10px;" trigger="click">
                <ElButton>对话</ElButton>
                <template #dropdown>
                  <ElDropdownMenu>
                    <ElDropdownItem @click="createNewHistory">新建</ElDropdownItem>
                    <ElDropdownItem @click="saveAsNewHistory">另存</ElDropdownItem>
                    <ElDropdownItem @click="saveHistory">保存</ElDropdownItem>
                    <ElDropdownItem @click="exportHistory">导出</ElDropdownItem>
                    <ElDropdownItem>
                      <ElUpload :auto-upload="false" :show-file-list="false" :on-change="importHistory">
                        <template #trigger>
                          导入
                        </template>
                      </ElUpload>
                    </ElDropdownItem>
                  </ElDropdownMenu>
                </template>
              </ElDropdown>
              <ElDropdown style="margin-left: 10px;" trigger="click">
                <ElButton>图像</ElButton>
                <template #dropdown>
                  <ElDropdownMenu>
                    <ElDropdownItem @click="createNewScene">新建</ElDropdownItem>
                    <ElDropdownItem @click="saveAsNewScene">另存</ElDropdownItem>
                    <ElDropdownItem @click="saveScene">保存</ElDropdownItem>
                    <ElDropdownItem @click="exportScene">导出</ElDropdownItem>
                    <ElDropdownItem>
                      <ElUpload :auto-upload="false" :show-file-list="false" :on-change="importScene">
                        <template #trigger>
                          导入
                        </template>
                      </ElUpload>
                    </ElDropdownItem>
                  </ElDropdownMenu>
                </template>
              </ElDropdown>
            </div>
            <div style="display: flex;">
              <ElRadioGroup v-model="view">
                <ElRadioButton value="history">History</ElRadioButton>
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
          <ChatHistory style="margin:0 2px;" :class="[view == 'history' ? 'full' : '', view == 'both' ? 'half' : '']"
            v-show="view == 'both' || view == 'history'" ref="chat"></ChatHistory>
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
import { ElUpload, ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu, ElMessage, ElRadioButton, ElRadioGroup, ElRow, ElText } from "element-plus";

const graphStore = useGraphStore();
const historyStore = useHistoryStore();

const baklava = ref<InstanceType<typeof BaklavaEditor>>();
const chat = ref<InstanceType<typeof ChatHistory>>();
const dialog = ref<InstanceType<typeof InputDialog>>();
const view = ref("chat")

const running = ref(false);
const inputMessage = ref("");

/**
 * 执行函数，用于处理输入框中的消息
 */
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
/**
 * 导出所有数据（所有对话历史，所有图像）
 */
const exportData = () => {
  exportJson({ graphs: graphStore.graphs, histories: historyStore.histories }, 'data.json');
}
/**
 * 导入所有数据（所有对话历史，所有图像）
 */
const importData = (file: any) => {
  const reader = new FileReader();
  reader.readAsText(file.raw, "utf8")
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      graphStore.graphs = data.graphs;
      historyStore.histories = data.histories;
    } catch (error) {
      console.error(error)
    }
  }
}
/**
 * 保存当前打开的对话及图像
 */
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
/**
 * 打开新图像
 */
const createNewScene = () => {
  const graph = graphStore.createNewGraph();
  if (graph) {
    baklava.value?.setGraph(graph)
    graphStore.currentGraph = -1;
  }
}
/**
 * 当前图像另存为
 */
const saveAsNewScene = () => {
  dialog.value?.openDialog('另存场景为', (input: string) => {
    const graph = baklava.value?.getGraph();
    if (graph) {
      graphStore.saveGraph(graph, input)
    }
  });
}
/**
 * 保存当前图像
 */
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
/**
 * 导出当前图像
 */
const exportScene = () => {
  exportJson(baklava.value?.getGraph(), 'scene.json');
}
/**
 * 导入当前图像
 */
const importScene = (file: any) => {
  const reader = new FileReader();
  reader.readAsText(file.raw, "utf8")
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      baklava.value?.setGraph(data.state);
    } catch (error) {
      console.error(error)
    }
  }
}
/**
 * 选择一个图像
 */
const onSceneSelected = (index: number, graph: any) => {
  if (graph) {
    baklava.value?.setGraph(graph.state)
  }
}
/**
 * 打开新对话
 */
const createNewHistory = () => {
  const history = historyStore.createNewHistory();
  if (history) {
    chat.value?.openHistory(history.history)
    historyStore.currentHistory = -1;
  }
}
/**
 * 当前对话另存为
 */
const saveAsNewHistory = () => {
  dialog.value?.openDialog('另存对话为', (input: string) => {
    const history = chat.value?.getHistory();
    if (history) {
      historyStore.saveHistory(history, input)
    }
  });
}
/**
 * 保存当前对话
 */
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
/**
 * 导出当前对话
 */
const exportHistory = () => {
  exportJson(chat.value?.getHistory(), 'history.json');
}
/**
 * 导入当前对话
 */
const importHistory = (file: any) => {
  const reader = new FileReader();
  reader.readAsText(file.raw, "utf8")
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      chat.value?.openHistory(data)
    } catch (error) {
      console.error(error)
    }
  }
}
/**
 * 选择一个对话
 */
const onHistorySelected = (index: number, history: any) => {
  if (history) {
    chat.value?.openHistory(history.history)
  }
}
/**
 * 将对象转为json文件并下载
 */
const exportJson = (data: any, filename: string = "json.json") => {
  if (!filename) filename = "json.json";
  if (!data) {
    alert("保存的数据为空");
    return;
  }

  if (typeof data === "object") {
    var cache: any = []
    data = JSON.stringify(data, (k, v) => {
      if (typeof v === "object" && v !== null) {
        if (cache.indexOf(v) !== -1) {
          return undefined;
        }
        cache.push(v);
      }
      return v;
    }, 4);
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