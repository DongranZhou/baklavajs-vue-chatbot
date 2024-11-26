export class UploadHandler {
  xhr: XMLHttpRequest;
  name:string = "";
  
  speed: number = 0;
  progress: number = 0;
  estimated: number = 0;
  completed: boolean = false;

  promise?: Promise<string>;

  onStarted?: () => void;
  onProgress?: () => void;
  onEnded?: () => void;

  constructor(_xhr: XMLHttpRequest,_name:string)
  {
    let _this = this;
    this.name = _name;
    this.xhr = _xhr;
    this.promise = new Promise<string>((resolve, reject) => {
      _this.xhr.upload.onprogress = (ev: ProgressEvent) => {
        let nowTime = new Date().getTime();
        let pertime = (nowTime - lastTime) / 1000;
        lastTime = nowTime;
        _this.speed = (ev.loaded - lastLoaded) / pertime;
        lastLoaded = ev.loaded;
        _this.progress = ev.loaded /ev.total;
        if (_this.speed > 0) {
          _this.estimated = (ev.total - ev.loaded) / _this.speed;
        }
        _this.onProgress?.();
      };
      let lastTime: number = 0;
      let lastLoaded: number = 0;
      _this.xhr.upload.onloadstart = () => {
        _this.progress = 0;
        _this.onStarted?.();
      };
      _this.xhr.upload.onerror = () => {
        _this.completed = true;
        _this.progress = 1;
        _this.onEnded?.();
        reject(_this.xhr.responseText);
      };
      _this.xhr.upload.ontimeout = () => {
        _this.completed = true;
        _this.progress = 1;
        _this.onEnded?.();
        reject(_this.xhr.responseText);
      };
      _this.xhr.upload.onload = () => {
        _this.completed = true;
        _this.progress = 1;
        _this.onEnded?.();
        resolve(_xhr.responseText);
      };
      _this.xhr.upload.onabort = () => {
        _this.completed = true;
        _this.progress = 1;
        _this.onEnded?.();
        reject(_this.xhr.responseText);
      };
    });
  }

  printSpeed = () => {
    var units = "b/s"; //单位名称
    if (this.speed / 1024 > 1) {
      this.speed = this.speed / 1024;
      units = "k/s";
    }
    if (this.speed / 1024 > 1) {
      this.speed = this.speed / 1024;
      units = "M/s";
    }
    return this.speed.toFixed(1) + units;
  }

  printEstimated = () => {
    var seconds = this.estimated % 60;
    var minutes = Math.floor(this.estimated / 60) % 60;
    var hours = Math.floor(this.estimated / 3600) % 24;
    return hours.toFixed(0) + "h" +minutes.toFixed(0) + "m" + seconds.toFixed(0) + "s";
  }

  abort = () => this.xhr?.abort();
}