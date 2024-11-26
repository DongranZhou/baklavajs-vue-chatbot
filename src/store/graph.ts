import { defineStore } from "pinia";
import { ref } from "vue";
import { INodeState, IGraphState, NodeInterface } from "baklavajs";
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
    var cache: any = [];
    localStorage.setItem(
      "graphs",
      JSON.stringify(graphs.value, (k, v) => {
        if (typeof v === "object" && v !== null) {
          if (cache.indexOf(v) !== -1) {
            cache.push(v);
            return ;
          }
        }
        return v;
      })
    );
  };
  const createNewGraph = (): IGraphState => {
    return {
      id: uuid(),
      nodes: [
        {
          id: uuid(),
          type: "InputTextNode",
          title: "InputText",
          inputs: {},
          outputs: {
            message: {
              id: "2f84537d-2f36-4601-af16-a008656f1a5e",
              value: "",
            },
          },
          position: { x: 0, y: 0 },
        },
        {
          id: uuid(),
          type: "OutputNode",
          title: "Output",
          inputs: {
            message: {
              id: "db23c0fe-64c3-4d65-8685-8f8769ad05ef",
              value: "",
            },
          },
          outputs: {},
          position: { x: 300, y: 0 },
        } as any,
      ],
      connections: [
        {
          id: uuid(),
          from: "2f84537d-2f36-4601-af16-a008656f1a5e",
          to: "db23c0fe-64c3-4d65-8685-8f8769ad05ef",
        },
      ],
      inputs: [],
      outputs: [],
      panning: { x: 0, y: 200 },
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
