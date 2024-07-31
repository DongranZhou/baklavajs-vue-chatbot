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
    { model, message,history },
    { globalValues }
  ): Promise<Outputs> => {
    var output = { message: "" };
    if (globalValues?.exec && message) {
      let _history = JSON.parse(history);
      _history.push({ role: "user", content: message });
      const res = await this.ollama?.chat({
        model: model,
        messages: [{ role: "user", content: message }],
      });
      output.message = res?.message?.content ?? "";
    }
    return output;
  };
}
