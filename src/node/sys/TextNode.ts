import {
  Node,
  TextareaInputInterface,
  CalculateFunction,
  NodeInterface,
  setType,
} from "baklavajs";
import { stringType } from "../../components/interfaceTypes";

interface Inputs {
  text:string;
}

interface Outputs {
  text: string;
}

export default class TextNode extends Node<Inputs, Outputs> {
  public constructor() {
    super();
    this.initializeIo();
  }

  public type = "TextNode";
  public _title = "Text";

  public inputs = {
    text:new TextareaInputInterface("text", ""),
  };
  public outputs = {
    text: new NodeInterface("text", "").use(setType, stringType),
  };

  public calculate: CalculateFunction<Inputs, Outputs> = async (
    { text },
    { globalValues }
  ): Promise<Outputs> => {
    return {
      text: text,
    };
  };
}
