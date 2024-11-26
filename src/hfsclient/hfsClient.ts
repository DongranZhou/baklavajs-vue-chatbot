import { fileList } from "./fileList";
import { UploadHandler } from "./uploadHandler";

export class hfsClient {
  public baseURL: string;
  constructor(baseURL: string = "http://127.0.0.1/") {
    this.baseURL = baseURL;
  }
  //获取文件列表
  public get_file_list(uri: string = "/") {
    return this.post<fileList>("~/api/get_file_list", { uri });
  }
  //获取文件上传描述
  public get_file_details(uris: Array<string>) {
    return this.post("~/api/get_file_details", { uris });
  }
  //创建文件夹
  public create_folder(uri: string, name: string) {
    return this.post("~/api/create_folder", { uri, name });
  }
  //删除
  public delete(uri: string) {
    return this.post("~/api/delete", { uri });
  }
  //重命名
  public rename(uri: string, dest: string) {
    return this.post("~/api/rename", { uri, dest });
  }
  //移动多个文件
  public move_files(uri_from: Array<string>, uri_to: string) {
    return this.post("~/api/move_files", { uri_from, uri_to });
  }
  //评论
  public comment(uri: string, comment: string) {
    return this.post("~/api/comment", { uri, comment });
  }
  //上传文件
  public upload(uri: string, file: File | Blob, filename: string) {
    const formData = new FormData();
    formData.append("file", file, filename);

    let xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      this.baseURL.replace(/\/$/gm, "") + "/" + uri.replace(/^\//gm, ""),
      true
    );
    xhr.setRequestHeader("Conten-Type", "multipart/form-data");
    let handler:UploadHandler = new UploadHandler(xhr,filename);
    xhr.send(formData);
    return handler;
  }
  public readText(uri: string) {
    return new Promise<string>((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.timeout = 5000;
      xhr.open(
        "GET",
        this.baseURL.replace(/\/$/gm, "") + "/" + uri.replace(/^\//gm, "")
      );
      xhr.setRequestHeader("Conten-Type", "text/plain");
      xhr.onload = () => {
        if (xhr.status == 200) {
          resolve(xhr.responseText);
        } else {
          reject(xhr.statusText);
        }
      };
      xhr.onerror = () => {
        reject(xhr.responseText);
      };
      xhr.ontimeout = () => {
        reject(xhr.responseText);
      };
      xhr.send();
    });
  }
  public saveText(uri: string, text: string) {
    let indexof = uri.lastIndexOf("/");
    let path = uri.substring(0, indexof) ?? "/";
    let filename = uri.substring(indexof + 1) ?? "text.txt";
    return this.upload(path, new Blob([text]), filename).promise;
  }
  public post<T>(uri: string, data: any) {
    return new Promise<T>((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.timeout = 5000;
      xhr.open(
        "POST",
        this.baseURL.replace(/\/$/gm, "") + "/" + uri.replace(/^\//gm, "")
      );
      xhr.setRequestHeader("Conten-Type", "application/json;charset=UTF-8");
      xhr.onload = () => {
        if (xhr.status == 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(xhr.statusText);
        }
      };
      xhr.onerror = () => {
        reject(xhr.responseText);
      };
      xhr.ontimeout = () => {
        reject(xhr.responseText);
      };
      xhr.send(JSON.stringify(data));
    });
  }
}

