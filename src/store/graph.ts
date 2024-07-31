import { defineStore } from "pinia";
import { ref } from "vue";
import { IGraphState } from "baklavajs";
import { uuid } from "../util";

interface GraphState {
  state: IGraphState;
  name: string;
}

export const useGraphStore = defineStore("graphs", () => {
  const graphs = ref<Array<GraphState>>(
    JSON.parse(localStorage.getItem("graphs") || "[]")
  );
  const currentGraph = ref<number>(-1);
  const deleteGraph = (index: number) => {
    graphs.value.splice(index, 1);
    save();
  };
  const saveGraph = (state: IGraphState, name: string) => {
    graphs.value.push({ state, name });
    save();
  };
  const getGraph = (index: number) => {
    return graphs.value[index];
  };
  const save = () => {
    localStorage.setItem("graphs", JSON.stringify(graphs.value));
  };
  const createNewGraph = (): IGraphState => {
    return {
      id: uuid(),
      nodes: [],
      connections: [],
      inputs: [],
      outputs: [],
      panning: { x: 0, y: 0 },
      scaling: 1,
    };
  };
  return {
    currentGraph,
    graphs,
    save,
    deleteGraph,
    saveGraph,
    getGraph,
    createNewGraph,
  };
});
