import {
  Node,
  TextInputInterface,
  CalculateFunction,
  NodeInterface,
  setType,
} from "baklavajs";
import { stringType } from "../components/interfaceTypes";

interface Inputs {
  
}

interface Outputs {
  message: string;
}

export default class InputNode extends Node<Inputs, Outputs> {
  public constructor() {
    super();
    this.initializeIo();
  }

  public type = "InputNode";
  public _title = "Input";

  public inputs = {
    
  };
  public outputs = {
    message: new NodeInterface("message", "").use(setType, stringType),
  };

  public calculate: CalculateFunction<Inputs, Outputs> = async (
    {  },
    { globalValues }
  ): Promise<Outputs> => {
    return {
      message: globalValues?.message,
    };
  };
}
