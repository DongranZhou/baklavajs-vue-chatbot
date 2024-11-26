import {
  Node,
  NumberInterface,
  CalculateFunction,
  NodeInterface,
} from "baklavajs";
import dayjs from "dayjs";

interface Inputs {
  message: string;
  delay:number
}

interface Outputs {
  message: string;
}

export default class DelayNode extends Node<Inputs, Outputs> {
  public constructor() {
    super();
    this.initializeIo();
  }

  public type = "DelayNode";
  public _title = "Delay";

  public inputs = {
    message: new NodeInterface("message", ""),
    delay: new NumberInterface("delay", 0).setPort(false),
  };
  public outputs = {
    message: new NodeInterface("message", ""),
  };

  public calculate: CalculateFunction<Inputs, Outputs> = async (
    { message,delay },
    {  }
  ): Promise<Outputs> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(delay , message , dayjs());
        resolve({
          message: message,
        });
      }, delay);
    });
  };
}
