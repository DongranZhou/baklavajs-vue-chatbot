import {
    Node,
    TextInputInterface,
    CalculateFunction,
    NodeInterface,
  } from "baklavajs";
  
  interface Inputs {
    
  }
  
  interface Outputs {
    history: string;
  }
  
  export default class HistoryNode extends Node<Inputs, Outputs> {
    public constructor() {
      super();
      this.initializeIo();
    }
  
    public type = "HistoryNode";
    public _title = "History";
  
    public inputs = {
      
    };
    public outputs = {
      history: new NodeInterface("history", ""),
    };
  
    public calculate: CalculateFunction<Inputs, Outputs> = async (
      {  },
      { globalValues }
    ): Promise<Outputs> => {
      return {
        history: JSON.stringify(globalValues?.history || []),
      };
    };
  }
  