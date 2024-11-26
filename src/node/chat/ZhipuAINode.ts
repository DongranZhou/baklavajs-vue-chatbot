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
  history: string;
  message: string;
  image: string;
  system: string;
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
  public textModels: Array<string> = [
    "glm-4-flash",
    "glm-4",
    "glm-4-air",
    "glm-4-airx",
    "glm-4-0520",
  ];
  public visionModels: Array<string> = [
    "glm-4v-plus",
    "glm-4v-1106",
    "glm-4v-0409",
  ];

  public inputs = {
    baseURL: new TextInputInterface(
      "baseURL",
      "https://open.bigmodel.cn/api/paas/v4/"
    ),
    apiKey: new TextInputInterface("apiKey", ""),
    model: new SelectInterface("model", this.textModels[0], [
      ...this.textModels,
      ...this.visionModels,
    ]),
    history: new NodeInterface("history", "[]"),
    system: new TextareaInputInterface("system", ""),
    message: new TextareaInputInterface("message", "你好"),
    image: new TextInputInterface("image", ""),
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
    { model, message, history, system, image },
    { globalValues }
  ): Promise<Outputs> => {
    var output = { message: "" };
    if (globalValues?.exec && message && model) {
      let messages = this.getMessages({
        history,
        system,
        message,
        model,
        image,
      } as Inputs);
      let res = await this.openai?.chat.completions.create({
        model,
        messages: messages,
        stream: false,
      });
      if (res?.choices?.length) {
        output.message = res.choices[0].message.content ?? "";
      }
    }
    return output;
  };

  getMessages: (inputs: Inputs) => Array<any> = ({
    system,
    history,
    message,
    image,
    model,
  }) => {
    let messages: Array<any> = JSON.parse(history ?? "[]") ?? [];
    if (this.visionModels.indexOf(model) < 0) {
      messages.push({ role: "user", content: message });
    } 
    else
    {
      if (image) {
        messages.push({
          role: "user",
          content: [{ type: "image_url", image_url: { url:image } },{ type: "text", text: message }],
        });
      } else {
        messages.push({
          role: "user",
          content: [{ type: "text", text: message }],
        });
      }
    }

    if (system) {
      let sysMsg = messages.find((item) => item.role == "system");
      if (sysMsg) {
        sysMsg.content = system;
      } else {
        messages.unshift({ role: "system", content: system });
      }
    }
    return messages;
  };
}
