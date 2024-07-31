import {
  Node,
  SelectInterface,
  TextInputInterface,
  NumberInterface,
  TextareaInputInterface,
  NodeInterface,
  defineDynamicNode,
  setType,
} from "baklavajs";
import { stringType, numberType } from "../../components/interfaceTypes";

export default defineDynamicNode({
  type: "MathNode",
  title: "Math",
  inputs: {
    operation: () =>
      new SelectInterface("operation", "add", [
        "add",
        "sub",
        "mul",
        "div",
        "sin",
        "cos",
        "tan",
        "sqrt",
      ]),
  },
  outputs: {
    result: () => new NodeInterface("result", 0).use(setType, numberType),
  },
  onUpdate({ operation }) {
    if (
      operation == "add" ||
      operation == "sub" ||
      operation == "mul" ||
      operation == "div"
    ) {
      return {
        inputs: {
          a: () => new NumberInterface("a", 0).use(setType, numberType),
          b: () => new NumberInterface("b", 0).use(setType, numberType),
        },
      };
    }
    if (
      operation == "sin" ||
      operation == "cos" ||
      operation == "tan" ||
      operation == "sqrt"
    ) {
      return {
        inputs: {
          a: () => new NumberInterface("a", 0).use(setType, numberType),
        },
      };
    }
    return {};
  },
  async calculate({ operation, a, b }, { globalValues }) {
    if (operation == "add") {
      return {
        result: a + b,
      };
    }
    if (operation == "sub") {
      return {
        result: a - b,
      };
    }
    if (operation == "mul") {
      return {
        result: a * b,
      };
    }
    if (operation == "div") {
      return {
        result: a / b,
      };
    }
    if (operation == "sin") {
      return {
        result: Math.sin(a),
      };
    }
    if (operation == "cos") {
      return {
        result: Math.cos(a),
      };
    }
    if (operation == "tan") {
      return {
        result: Math.tan(a),
      };
    }
    if (operation == "sqrt") {
      return {
        result: Math.sqrt(a),
      };
    }
    return {
      result: 0,
    };
  },
});
