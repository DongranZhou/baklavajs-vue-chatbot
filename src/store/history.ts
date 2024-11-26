import { defineStore } from "pinia";
import { ref } from "vue";
import ChatMessage from "../models/ChatMessage";

interface ChatHistory {
  history: Array<ChatMessage>;
  name: string;
}

export const useHistoryStore = defineStore("histories", () => {
  const histories = ref<Array<ChatHistory>>(
    JSON.parse(localStorage.getItem("histories") || "[]")
  );
  const currentHistory = ref<number>(-1);
  const deleteHistory = (index: number) => {
    histories.value.splice(index, 1);
    save();
  };
  const saveHistory = (history: Array<ChatMessage>, name: string) => {
    histories.value.push({ history, name });
    save();
  };
  const getHistory = (index: number) => {
    return histories.value[index];
  };
  const save = () => {
    localStorage.setItem("histories", JSON.stringify(histories.value));
  };
  const createNewHistory = () => {
    return {
      history: [],
      name: "",
    };
  };
  return {
    currentHistory,
    histories,
    save,
    deleteHistory,
    saveHistory,
    getHistory,
    createNewHistory,
  };
});
