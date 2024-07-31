import {
  Node,
  NumberInterface,
  TextInputInterface,
  CalculateFunction,
  NodeInterface,
} from "baklavajs";
import dayjs from "dayjs";

interface Inputs {
  format: string;
}

interface Outputs {
  date: string;
  timestemp: number;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export default class DateNode extends Node<Inputs, Outputs> {
  public constructor() {
    super();
    this.initializeIo();
  }

  public type = "DateNode";
  public _title = "Date";

  public inputs = {
    format: new TextInputInterface("format", "YYYY-MM-DD HH:mm:ss"),
  };
  public outputs = {
    date: new NodeInterface("date", ""),
    timestemp: new NodeInterface("timestemp", 0),
    year: new NodeInterface("year", 0),
    month: new NodeInterface("month", 0),
    day: new NodeInterface("day", 0),
    hour: new NodeInterface("hour", 0),
    minute: new NodeInterface("minute", 0),
    second: new NodeInterface("second", 0),
  };

  public calculate: CalculateFunction<Inputs, Outputs> = async (
    { format },
    {}
  ): Promise<Outputs> => {
    return {
      date: dayjs().format(format),
      timestemp: dayjs().valueOf(),
      day: dayjs().date(),
      hour: dayjs().hour(),
      minute: dayjs().minute(),
      second: dayjs().second(),
      month: dayjs().month() + 1,
      year: dayjs().year(),
    };
  };
}
