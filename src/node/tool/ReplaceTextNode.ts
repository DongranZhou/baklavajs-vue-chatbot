import {
  Node,
  TextareaInputInterface,
  TextInputInterface,
  NodeInterface,
  CalculateFunction,
} from "baklavajs";

interface Inputs {
  text: string;
  pattern: string;
  replacement: string;
}

interface Outputs {
  text: string;
}

export default class ReplaceTextNode extends Node<Inputs, Outputs> {
  public constructor() {
    super();
    this.initializeIo();
  }

  public type = "ReplaceTextNode";
  public _title = "ReplaceText";

  public inputs = {
    pattern: new TextInputInterface("pattern", ""),
    replacement: new TextInputInterface("replacement", ""),
    text: new TextareaInputInterface("text", ""),
  };
  public outputs = {
    text: new NodeInterface("text", ""),
  };
  public calculate: CalculateFunction<Inputs, Outputs> = async (
    { text, pattern, replacement },
    {}
  ): Promise<Outputs> => {
    if (pattern && text && replacement) {
      const regex = new RegExp(pattern);
      return {
        text: text.replace(regex, replacement),
      };
    }
    return {
      text: "",
    };
  };
}
