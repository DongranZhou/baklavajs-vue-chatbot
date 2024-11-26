import {
  Node,
  TextInputInterface,
  NodeInterface,
  SelectInterface,
  TextareaInputInterface,
  CalculateFunction,
} from "baklavajs";
import OpenAI from "openai";
import ChatMessage from "../../models/ChatMessage";

interface Inputs {
  baseURL: string;
  apiKey: string;
  model: string;
  history: string;
  message: string;
  system:string;
}

interface Outputs {
  message: string;
}

export default class OpenAINode extends Node<Inputs, Outputs> {
  public constructor() {
    super();
    this.initializeIo();
  }

  public type = "OpenAINode";
  public _title = "OpenAI";

  public openai: OpenAI | undefined;

  public inputs = {
    baseURL: new TextInputInterface("baseURL", "http://127.0.0.1:3000/v1"),
    apiKey: new TextInputInterface("apiKey", ""),
    model: new SelectInterface("model", "gpt-4", ['gpt-4', 'gpt-4-0314', 'gpt-4-32k', 'gpt-4-32k-0314', 'gpt-3.5-turbo', 'gpt-3.5-turbo-0301']),
    history: new NodeInterface("history", "[]"),
    system: new TextareaInputInterface("system",""),
    message: new TextareaInputInterface("message", ""),
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
    if (baseURL && apiKey) {
      this.openai = new OpenAI({
        apiKey,
        baseURL,
        dangerouslyAllowBrowser: true,
      });
      var models = await this.openai.models.list();
      if (models?.data?.length) {
        this.inputs.model.items = models.data.map((m) => m.id);
      }
    }
  }

  public calculate: CalculateFunction<Inputs, Outputs> = async (
    { model, message, history ,system},
    { globalValues }
  ): Promise<Outputs> => {
    var output = { message: "" };
    if (globalValues?.exec && message && model) {
      let messages = this.getMessages({ history,system,message } as Inputs);
      let res = await this.openai?.chat.completions.create({
        model,
        messages: messages as any,
        stream: false,
      });
      if (res?.choices?.length) {
        output.message = res.choices[0].message.content ?? "";
      }
    }
    return output;
  };

  getMessages: (inputs: Inputs) => Array<ChatMessage> = ({
    system,
    history,
    message,
  }) => {
    let messages: Array<ChatMessage> = JSON.parse(history ?? "[]") ?? [];
    messages.push({ role: "user", content: message });
    if(system)
    {
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
