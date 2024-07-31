import {
  Node,
  TextInputInterface,
  NodeInterface,
  SelectInterface,
  TextareaInputInterface,
  CalculateFunction,
} from "baklavajs";
import OpenAI from "openai";

interface Inputs {
  baseURL: string;
  apiKey: string;
  model: string;
  history:string;
  message: string;
}

interface Outputs {
  message: string;
}

export default class ZhipuAINode extends Node<Inputs, Outputs> {
  public constructor() {
    super();
    this.initializeIo();
  }

  public type = "ZhipuAINode";
  public _title = "ZhipuAI";

  public openai: OpenAI | undefined;

  public inputs = {
    baseURL: new TextInputInterface(
      "baseURL",
      "https://open.bigmodel.cn/api/paas/v4/"
    ),
    apiKey: new TextInputInterface(
      "apiKey",
      ""
    ),
    model: new SelectInterface("model", "glm-4", [
      "glm-4-0520",
      "glm-4",
      "glm-4-air",
      "glm-4-airx",
      "glm-4-flash",
    ]),
    history: new NodeInterface("history", ""),
    message: new TextareaInputInterface("message", "你好"),
  };
  public outputs = {
    message: new NodeInterface("message", ""),
  };
  public onPlaced(): void {
    this.events.update.subscribe(this, (data) => {
      if (!data) {
        return;
      }
      if (data.type == "input") {
        if (data.name == "baseURL" || data.name == "apiKey") {
          this.updateModel();
        }
      }
    });
    this.updateModel();
  }

  private async updateModel() {
    var baseURL = this.inputs.baseURL.value;
    var apiKey = this.inputs.apiKey.value;
    if (baseURL) {
      this.openai = new OpenAI({
        apiKey,
        baseURL,
        dangerouslyAllowBrowser: true,
      });
    }
  }

  public calculate: CalculateFunction<Inputs, Outputs> = async (
    { model, message ,history},
    { globalValues }
  ): Promise<Outputs> => {
    var output = { message: "" };
    if (globalValues?.exec && message && model) {
      let _history = JSON.parse(history);
      _history.push({ role: "user", content: message })
      let res = await this.openai?.chat.completions.create({
        model,
        messages: _history,
        stream: false,
      });
      if (res?.choices?.length) {
        output.message = res.choices[0].message.content ?? "";
      }
    }
    return output;
  };
}
