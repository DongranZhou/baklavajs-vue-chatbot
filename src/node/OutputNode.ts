import {
  Node,
  CalculateFunction,
  NodeInterface,
} from "baklavajs";

interface Inputs {
  message: string;
}

interface Outputs {
  message: string;
}

export default class OutputNode extends Node<Inputs, Outputs> {
  public constructor() {
    super();
    this.initializeIo();
  }

  public type = "OutputNode";
  public _title = "Output";

  public inputs = {
    message: new NodeInterface("message", ""),
  };
  public outputs = {
    message: new NodeInterface("message", "").setHidden(true),
  };

  public calculate: CalculateFunction<Inputs, Outputs> = async (
    { message },
    { globalValues }
  ): Promise<Outputs> => {
    return {
      message
    };
  };
}
