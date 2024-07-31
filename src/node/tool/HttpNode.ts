import {
  Node,
  SelectInterface,
  TextInputInterface,
  CalculateFunction,
  TextareaInputInterface,
  NodeInterface,
  defineDynamicNode,
} from "baklavajs";
import axios from "axios";

export default defineDynamicNode({
  type: "HttpNode",
  title: "HTTP",
  inputs: {
    baseURL: () => new NodeInterface("baseURL", ""),
    url: () => new TextInputInterface("url", ""),
    method: () =>
      new SelectInterface("method", "get", ["get", "post", "postForm"]),
    query: () => new TextareaInputInterface("query", ""),
  },
  outputs: {
    response: () => new NodeInterface("response", ""),
  },
  onUpdate({ method }) {
    if (method == "post") {
      return {
        inputs: {
          data: () => new TextareaInputInterface("data", ""),
        },
      };
    }
    if (method == "postForm") {
      return {
        inputs: {
          form: () => new TextareaInputInterface("form", ""),
        },
      };
    }
    return {};
  },
  async calculate(inputs, { globalValues }) {
    if (globalValues?.exec && inputs.url) {
      if (inputs.method === "get") {
        var rep = await axios.get(inputs.url, {
          baseURL: inputs.baseURL,
          params: JSON.parse(inputs.query),
        });

        return {
          response: rep ? JSON.stringify(rep) : "",
        };
      }
      if (inputs.method === "post") {
        var rep = await axios.post(inputs.url, {
          baseURL: inputs.baseURL,
          params: JSON.parse(inputs.query),
          data: JSON.parse(inputs.data),
        });

        return {
          response: rep ? JSON.stringify(rep) : "",
        };
      }
      if (inputs.method === "postForm") {
        var rep = await axios.postForm(inputs.url, {
          baseURL: inputs.baseURL,
          params: JSON.parse(inputs.query),
          data: JSON.parse(inputs.data),
        });

        return {
          response: rep ? JSON.stringify(rep) : "",
        };
      }
    }
    return {
      response: "",
    };
  },
});
