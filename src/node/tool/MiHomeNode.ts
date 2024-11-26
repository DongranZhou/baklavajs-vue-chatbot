import {
  Node,
  SelectInterface,
  TextInputInterface,
  CalculateFunction,
  TextareaInputInterface,
  NodeInterface,
  defineDynamicNode,
  IAdvancedSelectInterfaceItem,
} from "baklavajs";
import axios from "axios";
interface Inputs {
  baseURL: string;
  device: string;
  service: string;
  property: string;
  propertyValue: string;
  action: string;
  actionIn: string;
}

interface Outputs {
  result: string;
}

export default class MiHomeNode extends Node<Inputs, Outputs> {
  public constructor() {
    super();
    this.initializeIo();
  }

  public type = "MiHomeNode";
  public _title = "MiHome";
  public inputs = {
    baseURL: new TextInputInterface(
      "baseURL",
      "http://localhost:5005/api/iotMiHome"
    ),
    device: new SelectInterface("device", "", [{text:"NoDevice",value:""}]),
    service: new SelectInterface("service", "", [{text:"NoService",value:""}]),
    
    property: new SelectInterface("property", "", [{text:"NoProperty",value:""}]),
    propertyValue: new TextInputInterface("propertyValue", ""),
    action: new SelectInterface("action", "", [{text:"NoAction",value:""}]),
    actionIn: new TextInputInterface("actionIn", "[]"),
  };
  public outputs = {
    result: new NodeInterface("result", ""),
  };

  public onPlaced(): void {
    this.events.update.subscribe(this, (data) => {
      if (!data) {
        return;
      }
      if (data.type == "input") {
        this.updateOptions();
      }
    });
    this.updateOptions();
  }

  deviceList: Array<any> = [];
  serviceList: Array<any> = [];
  async updateOptions() {
    let baseURL = this.inputs.baseURL.value;
    let device = this.inputs.device.value;
    let service = this.inputs.service.value;
    if (baseURL) {
      let res1 = await axios.post("/getDeviceList", {  }, { baseURL });
      this.deviceList = res1.data.result;
      if (this.deviceList) {
        this.inputs.device.items = [
          { text: "NoDevice" ,value:""},
          ...this.deviceList.map((item: any) => {
            return { text: item.name, value: item.did };
          })
        ];
        if (device) {
          let _device = this.deviceList.find((item: any) => item.did == device);
          let res2 = await axios.post(
            "/getDeviceSpec",
            { model: _device.model },
            { baseURL }
          );
          this.serviceList = res2.data.result.services;
          if (this.serviceList) {
            this.inputs.service.items = [
              { text: "NoService" ,value:""},
              ...this.serviceList.map((item: any) => {
                return { text: item.description, value: item.iid };
              })
            ];
            if (service) {
              let _service = this.serviceList.find(
                (item: any) => item.iid == service
              );
              if (_service.properties) {
                this.inputs.property.items = [
                  { text: "NoProperty", value: "" },
                  ..._service.properties.map((item: any) => {
                    return { text: item.description, value: item.iid };
                  }),
                ];
              }
              if (_service.actions) {
                this.inputs.action.items = [
                  { text: "NoAction", value: "" },
                  ..._service.actions.map((item: any) => {
                    return { text: item.description, value: item.iid };
                  }),
                ];
              }
            }
          }
        }
      }
    }
  }

  public calculate: CalculateFunction<Inputs, Outputs> = async (
    {
      baseURL,
      device,
      service,
      property,
      propertyValue,
      action,
      actionIn,
    },
    { globalValues }
  ): Promise<Outputs> => {
    if (globalValues?.exec && baseURL && device && service) {
      let _device = this.deviceList.find((item: any) => item.did == device);
      let _service = this.serviceList.find((item: any) => item.iid == service);
      if (property) {
        let _property = _service.properties.find(
          (item: any) => item.iid == property
        );
        if (_property) {
          if (propertyValue.length) {
            let res = await axios.post(
              "/setCloudProperty",
              {
                device: { did: _device.did },
                payload: {
                  siid: _service.iid,
                  piid: _property.iid,
                  value: propertyValue,
                },
              },
              { baseURL }
            );
            return { result: JSON.stringify(res) };
          } else {
            let res = await axios.post(
              "/getCloudProperty",
              {
                device: { did: _device.did },
                payload: { siid: _service.iid, piid: _property.iid },
              },
              { baseURL }
            );
            return { result: JSON.stringify(res.data.result) };
          }
        }
      }
      if (action) {
        let _action = _service.actions.find((item: any) => item.iid == action);
        if (_action) {
          let _actionIn: Array<string> = JSON.parse(actionIn ?? "[]") ?? [];
          debugger;
          let res = await axios.post(
            "/cloudCallAction",
            {
              device: { did: _device.did },
              payload: { siid: _service.iid, aiid: _action.iid, in: _actionIn },
            },
            { baseURL }
          );
          return { result: JSON.stringify(res.data.result) };
        }
      }
    }
    return { result: "" };
  };
}
