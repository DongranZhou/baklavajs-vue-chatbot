import {
  Node,
  TextareaInputInterface,
  TextInputInterface,
  NodeInterface,
  CalculateFunction,
} from "baklavajs";
import { JSONPath } from "jsonpath-plus";

interface Inputs {
  json: string;
  path: string;
}

interface Outputs {
  json: string;
}

export default class JsonPathNode extends Node<Inputs, Outputs> {
  public constructor() {
    super();
    this.initializeIo();
  }

  public type = "JsonPathNode";
  public _title = "JsonPath";

  public inputs = {
    path: new TextInputInterface("path", ""),
    json: new TextareaInputInterface("json", ""),
  };
  public outputs = {
    json: new NodeInterface("json", ""),
  };
  public calculate: CalculateFunction<Inputs, Outputs> = async (
    { json, path },
    {}
  ): Promise<Outputs> => {
    if (path && json) {
      const result = JSONPath({ path: path, json: JSON.parse(json) });
      return { json: JSON.stringify(result) };
    }
    return { json: "" };
  };
}
