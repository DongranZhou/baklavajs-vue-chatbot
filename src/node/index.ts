import { AbstractNodeConstructor, IRegisterNodeTypeOptions } from "baklavajs";

import HistoryNode from "./chat/HistoryNode";
import ZhipuAINode from "./chat/ZhipuAINode";
import OllamaNode from "./chat/OllamaNode";
import OpenAINode from "./chat/OpenAINode";

import InputTextNode from "./input/InputTextNode";
import InputImageNode from "./input/InputImageNode";
import OutputNode from "./OutputNode";

import HttpNode from "./tool/HttpNode";
import HFSNode from "./tool/HFSNode";
import ReplaceTextNode from "./tool/ReplaceTextNode";
import JsonPathNode from "./tool/JsonPathNode";
import MiHomeNode from "./tool/MiHomeNode";

import JSNode from "./JSNode";
import GithubRepositoriesNode from "./GithubRepositoriesNode";

import MarkdownNode from "./sys/MarkdownNode";
import DelayNode from "./sys/DelayNode";
import MathNode from "./sys/MathNode";
import DateNode from "./sys/DateNode";
import TextNode  from "./sys/TextNode"

const nodes: {
  node: AbstractNodeConstructor;
  options?: IRegisterNodeTypeOptions;
}[] = [
  { node: InputTextNode },
  { node: InputImageNode },
  { node: OutputNode },

  { node: MarkdownNode, options: { category: "sys"} },
  { node: DelayNode, options: { category: "sys"} },
  { node: MathNode, options: { category: "sys"} },
  { node: DateNode, options: { category: "sys"} },
  { node: TextNode, options: { category: "sys"} },

  { node: OllamaNode, options: { category: "chat" } },
  { node: ZhipuAINode, options: { category: "chat" } },
  { node: OpenAINode, options: { category: "chat" } },
  { node: HistoryNode, options: { category: "chat" } },

  { node: ReplaceTextNode , options: { category: "tool" } },
  { node: JsonPathNode , options: { category: "tool" } },
  { node: HFSNode , options: { category: "tool" } },
  { node: HttpNode, options: { category: "tool" }  },
  { node: MiHomeNode, options: { category: "tool" }  },
];

export default nodes;
