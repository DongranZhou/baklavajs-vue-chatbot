import {
  TextInputInterface,
  TextareaInputInterface,
  SelectInterface,
  defineDynamicNode,
  NodeInterface,
} from "baklavajs";
import { hfsClient } from "../../hfsclient/hfsClient";

export default defineDynamicNode({
  type: "HFSNode",
  title: "HFS",
  inputs: {
    baseURL: () => new TextInputInterface("baseURL", "http://localhost/~/api/"),
    api: () =>
      new SelectInterface("api", "get_file_list", [
        "get_file_list",
        "get_file_details",
        "create_folder",
        "delete",
        "rename",
        "move_files",
        "comment",
      ]).setPort(false),
  },
  outputs: {
    data: () => new NodeInterface("data", ""),
  },
  onUpdate({ api }) {
    if (api == "get_file_list") {
      return {
        inputs: {
          uri: () => new TextInputInterface("uri", "/"),
        },
      };
    }
    if (api == "get_file_details") {
      return {
        inputs: {
          uris: () => new TextareaInputInterface("uris", ""),
        },
      };
    }
    if (api == "create_folder") {
      return {
        inputs: {
          uri: () => new TextInputInterface("uri", "/"),
          name: () => new TextInputInterface("name", ""),
        },
      };
    }
    if (api == "delete") {
      return {
        inputs: {
          uri: () => new TextInputInterface("uri", "/"),
        },
      };
    }
    if (api == "rename") {
      return {
        inputs: {
          uri: () => new TextInputInterface("uri", "/"),
          dest: () => new TextInputInterface("dest", "/"),
        },
      };
    }
    if (api == "move_files") {
      return {
        inputs: {
          uri_from: () => new TextareaInputInterface("uri_from", ""),
          uri_to: () => new TextInputInterface("uri_to", "/"),
        },
      };
    }
    if (api == "comment") {
      return {
        inputs: {
          uri: () => new TextInputInterface("uri", "/"),
          comment: () => new TextareaInputInterface("comment", ""),
        },
      };
    }
    return {};
  },

  async calculate(inputs, { globalValues }) {
    if (globalValues?.exec) {
      var client: hfsClient = new hfsClient(inputs.baseURL);
      if (inputs.api == "get_file_list") {
        var list = await client.get_file_list(inputs.uri);
        return {
          data: JSON.stringify(list.list),
        };
      }
      if (inputs.api == "get_file_details") {
        var uris = JSON.parse(inputs.uris);
        if (uris?.length) {
          client.get_file_details(uris);
        }
      }
      if (inputs.api == "create_folder") {
        client.create_folder(inputs.uri, inputs.name);
      }
      if (inputs.api == "delete") {
        client.delete(inputs.uri);
      }
      if (inputs.api == "rename") {
        client.rename(inputs.uri, inputs.dest);
      }
      if (inputs.api == "move_files") {
        var uri_from = JSON.parse(inputs.uri_from);
        if (uri_from?.length) {
          client.move_files(uri_from, inputs.uri_to);
        }
      }
      if (inputs.api == "comment") {
        client.comment(inputs.uri, inputs.comment);
      }
    }

    return {
      data: "",
    };
  },
});
