import { fileNode } from "./fileNode";

export interface fileList 
{
  can_archive?:boolean, //是否可以归档
  can_upload?:boolean, //是否可以上传
  can_delete?:boolean, //是否可以删除
  can_overwrite?:boolean, //是否可以覆盖
  can_comment?:boolean, //是否可以评论
  comment?:string, //文件描述
  list?:Array<fileNode> //文件列表
}