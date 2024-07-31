import { AbstractNodeConstructor, IRegisterNodeTypeOptions } from "baklavajs";

import ZhipuAINode from "./chat/ZhipuAINode";
import OllamaNode from "./chat/OllamaNode";
import OpenAINode from "./chat/OpenAINode";

import InputNode from "./InputNode";
import OutputNode from "./OutputNode";

import HttpNode from "./tool/HttpNode";
import MarkdownNode from "./sys/MarkdownNode";
import HFSNode from "./tool/HFSNode";
import JsonPathNode from "./tool/JsonPathNode";
import HistoryNode from "./chat/HistoryNode";
import JSNode from "./JSNode";
import ReplaceTextNode from "./tool/ReplaceTextNode";
import GithubRepositoriesNode from "./GithubRepositoriesNode";
import DelayNode from "./sys/DelayNode";
import MathNode from "./sys/MathNode";
import DateNode from "./sys/DateNode";

const nodes: {
  node: AbstractNodeConstructor;
  options?: IRegisterNodeTypeOptions;
}[] = [
  { node: InputNode },
  { node: OutputNode },

  { node: MarkdownNode, options: { category: "sys"} },
  { node: DelayNode, options: { category: "sys"} },
  { node: MathNode, options: { category: "sys"} },
  { node: DateNode, options: { category: "sys"} },

  { node: OllamaNode, options: { category: "chat" } },
  { node: ZhipuAINode, options: { category: "chat" } },
  { node: OpenAINode, options: { category: "chat" } },
  { node: HistoryNode, options: { category: "chat" } },

  { node: ReplaceTextNode , options: { category: "tool" } },
  { node: JsonPathNode , options: { category: "tool" } },
  { node: HFSNode , options: { category: "tool" } },
  { node: HttpNode, options: { category: "tool" }  },
];

export default nodes;
