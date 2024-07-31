<template>
  <EditorComponent :view-model="baklava" />
</template>
<script setup lang="ts">
import nodes from '../node/index'
import "@baklavajs/themes/dist/syrup-dark.css";
import { stringType, numberType, booleanType } from './interfaceTypes'

import {
  EditorComponent,
  useBaklava,
  applyResult,
  IEditorState,
  DependencyEngine,
  BaklavaInterfaceTypes,
  IGraphState,
} from "baklavajs";

const baklava = useBaklava();

baklava.settings.enableMinimap = true;
baklava.settings.palette.enabled = false;

nodes.forEach((el) => {
  baklava.editor.registerNodeType(el.node, el.options);
})

const token = Symbol();
const engine = new DependencyEngine(baklava.editor);
engine.events.afterRun.subscribe(token, (result) => {
  engine.pause();
  applyResult(result, baklava.editor);
  engine.resume();
});
engine.start();

const nodeInterfaceTypes = new BaklavaInterfaceTypes(baklava.editor, {
  viewPlugin: baklava,
  engine,
});
nodeInterfaceTypes.addTypes(stringType, numberType, booleanType);

const getGraph = (): IGraphState => {
  return baklava.editor.graph.save();
};

const setGraph = (graph: IGraphState) => {
  baklava.editor.graph.load(graph);
};

const runOnce = (calculationData: any) => {
  return new Promise((resolve, reject) => {
    engine.runOnce(calculationData).then(res => {
      const outputNode = baklava.editor.graph.nodes.find(x => x.type == 'OutputNode');
      if (res && outputNode?.id) {
        const value: any = res?.get(outputNode.id)?.get('message')
        resolve(value);
      } else {
        reject("没有输出节点")
      }
    }).catch(err => {
      reject(err)
    })
  })
}

defineExpose({ getGraph, setGraph, runOnce });
</script>