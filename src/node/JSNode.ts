import {
  Node,
  TextareaInputInterface,
  CalculateFunction,
  NodeInterface,
  setType,
} from "baklavajs";
import { stringType } from '../components/interfaceTypes'
import dayjs from 'dayjs'
interface Inputs {
  code: string;
  arg: string;
}

interface Outputs {
  result: string;
}

export default class JSNode extends Node<Inputs, Outputs> {
  public constructor() {
    super();
    this.initializeIo();
  }

  public type = "JS";
  public _title = "javascript";

  public inputs = {
    arg: new TextareaInputInterface("arg", ""),
    code: new TextareaInputInterface("code", ""),
  };
  public outputs = {
    result: new NodeInterface("result", "").use(setType, stringType),
  };

  public calculate: CalculateFunction<Inputs, Outputs> = async (
    { code, arg },
    { }
  ): Promise<Outputs> => {
    if (code) {
      var func = new Function("arg","dayjs",code)
      try{
        return {
          result: func(arg,dayjs),
        };
      }catch(e){

      }
    }
    return {
      result: ""
    }
  };
}
