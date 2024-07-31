import {
  Node,
  SelectInterface,
  TextInputInterface,
  CalculateFunction,
  NodeInterface,
} from "baklavajs";
import axios from "axios";

interface Inputs {
  query: string;
  language: string;
  user: string;
}

interface Outputs {
  message: string;
}

export default class GithubRepositoriesNode extends Node<Inputs, Outputs> {
  public constructor() {
    super();
    this.initializeIo();
  }

  public type = "GithubRepositoriesNode";
  public _title = "GithubRepositories";

  public inputs = {
    query: new TextInputInterface("query", ""),
    language: new SelectInterface("language", "", [
      "",
      "c#",
      "java",
      "javascript",
      "typescript",
      "vue",
      "html",
      "python",
      "php",
      "ruby",
      "go",
      "c++",
    ]),
    user: new TextInputInterface("user", ""),
  };
  public outputs = {
    message: new NodeInterface("message", ""),
  };

  public calculate: CalculateFunction<Inputs, Outputs> = async (
    { query, language, user },
    {  }
  ): Promise<Outputs> => {
    if (query) {
      let url = "https://api.github.com/search/repositories";
      url += "?q=" + encodeURIComponent(query);
      if (language) {
        url += "+language:" + encodeURIComponent(language);
      }
      if (user) {
        url += "+user:" + encodeURIComponent(user);
      }
      let rep = await axios.get(url);
      return {
        message: JSON.stringify(rep),
      };
    }
    return {
      message: "",
    };
  };
}
