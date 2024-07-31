import axios, { AxiosInstance } from "axios";
import { fileList } from "./fileList";

export class hfsClient {
  instalce?: AxiosInstance;
  constructor(baseURL: string = "http://localhost/") {
    this.instalce = axios.create({
      baseURL,
    });
  }
  //获取文件列表
  public get_file_list(uri: string = "/") 
  {
    return this.instalce?.post<fileList>("~/api/get_file_list", { uri });
  }
  //获取文件上传描述
  public get_file_details(uris: Array<string>) {
    return this.instalce?.post("~/api/get_file_details", { uris });
  }
  //创建文件夹
  public create_folder(uri: string, name: string) {
    return this.instalce?.post("~/api/create_folder", { uri, name });
  }
  //删除
  public delete(uri: string) {
    return this.instalce?.post("~/api/delete", { uri });
  }
  //重命名
  public rename(uri: string, dest: string) {
    return this.instalce?.post("~/api/rename", { uri, dest });
  }
  //移动多个文件
  public move_files(uri_from: Array<string>, uri_to: string) {
    return this.instalce?.post("~/api/move_files", { uri_from, uri_to });
  }
  //评论
  public comment(uri: string, comment: string) {
    return this.instalce?.post("~/api/comment", { uri, comment });
  }
  //上传文件
  public upload(uri: string, file: File,filename:string = file.name)
  {
    const formData = new FormData();
    formData.append("file", file, filename ?? file.name);
    return this.instalce?.post(uri, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}
