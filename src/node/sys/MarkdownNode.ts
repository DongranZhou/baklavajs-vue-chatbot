import {
  Node,
  NodeInterface,
  CalculateFunction,
  setType
} from "baklavajs";
import { stringType } from '../../components/interfaceTypes'
import MarkdownInterface from "../../interface/MarkdownInterface";

interface Inputs {
  display: string;
}

interface Outputs {
  display: string;
}

export default class MarkdownNode extends Node<Inputs, Outputs>
{
  public constructor() {
    super();
    this.initializeIo();
  }

  public type = "MarkdownNode";
  public _title = "Markdown";

  public inputs = {
    display: new NodeInterface("display", "").use(setType,stringType),
  };
  public outputs = {
    display: new MarkdownInterface("display").use(setType,stringType),
  };

  public calculate: CalculateFunction<Inputs, Outputs> = async (
    { display },
    {  }
  ): Promise<Outputs> => {
    return {
      display: display,
    };
  };
};