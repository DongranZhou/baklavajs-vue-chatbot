import {
  Node,
  TextInputInterface,
  NodeInterface,
  TextareaInputInterface,
  CalculateFunction,
  SelectInterface,
} from "baklavajs";
import { Ollama } from "ollama/browser";

interface Inputs {
  host: string;
  model: string;
  history:string;
  message: string;
  system:string;
}

interface Outputs {
  message: string;
}

export default class OllamaNode extends Node<Inputs, Outputs> {
  public constructor() {
    super();
    this.initializeIo();
  }

  public type = "OllamaNode";
  public _title = "Ollama";

  public ollama: Ollama | undefined;

  public inputs = {
    host: new TextInputInterface("baseURL", "http://127.0.0.1:11434/"),
    model: new SelectInterface("model", "", [""]).setPort(false),
    history: new NodeInterface("history", "[]"),
    system: new TextareaInputInterface("system", ""),
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
        if (data.name == "host") {
          this.updateModel();
        }
      }
    });
    this.updateModel();
  }

  private async updateModel() {
    var host = this.inputs.host.value;
    if(host)
    {
      this.ollama = new Ollama({ host });
      var models = await this.ollama?.list();
      this.inputs.model.items = models.models.map((x) => x.name);
    }
  }

  public calculate: CalculateFunction<Inputs, Outputs> = async (
    { model, message,history,system },
    { globalValues }
  ): Promise<Outputs> => {
    var output = { message: "" };
    if (globalValues?.exec && message) {
      let messages = this.getMessages({ history,system,message } as Inputs);
      const res = await this.ollama?.chat({
        model: model,
        messages: messages,
      });
      output.message = res?.message?.content ?? "";
    }
    return output;
  };

  getMessages: (inputs: Inputs) => Array<any> = ({
    system,
    history,
    message,
  }) => {
    let messages: Array<any> = JSON.parse(history ?? "[]") ?? [];
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
