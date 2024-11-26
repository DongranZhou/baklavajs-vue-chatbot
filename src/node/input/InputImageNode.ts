import {
  Node,
  TextInputInterface,
  CalculateFunction,
  NodeInterface,
  setType,
} from "baklavajs";
import { stringType } from "../../components/interfaceTypes";

interface Inputs {
  
}

interface Outputs {
  image_url: string;
}

export default class InputTextNode extends Node<Inputs, Outputs> {
  public constructor() {
    super();
    this.initializeIo();
  }

  public type = "InputImageNode";
  public _title = "InputImage";

  public inputs = {
    
  };
  public outputs = {
    image_url: new NodeInterface("image_url", "").use(setType, stringType),
  };

  public calculate: CalculateFunction<Inputs, Outputs> = async (
    {  },
    { globalValues }
  ): Promise<Outputs> => {
    return {
      image_url: globalValues?.image_url,
    };
  };
}