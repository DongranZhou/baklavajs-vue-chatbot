/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: Reenable ESLint rule after implementation
import type {AbstractNode, Editor, Graph, NodeInterface, CalculationResult,Connection ,INodeUpdateEventData} from "baklavajs";
import { BaseEngine } from "baklavajs";

export class AsyncForwardEngine<CalculationData = any> extends BaseEngine<CalculationData, []> {
    private order: Map<string, ITopologicalSortingResult> = new Map();
    public constructor(editor: Editor) {
        super(editor);
    }
    public override start() {
        super.start();
        this.recalculateOrder = true;
        void this.calculateWithoutData();
    }

    override override stop(): void {
        super.stop();
    }
    public override async runGraph(
        graph: Graph,
        inputs: Map<string, any>,
        calculationData: CalculationData,
    ): Promise<CalculationResult> {
        const startNodes = this.getStartNodes(graph);
        const forwardMap = this.mapForwardNode(graph);
        const result:CalculationResult = new Map();
        let promises = startNodes.map((n) => this.calculateNode(n, graph, inputs, calculationData, forwardMap,result));
        await Promise.all(promises);
        return result;
    }

    private async calculateNode(
        n: AbstractNode,
        graph:Graph,
        inputs: Map<string, any>,
        calculationData: CalculationData,
        forwardMap:Map<string,AbstractNode[]>,
        result:CalculationResult):Promise<CalculationResult> {
        const inputsForNode: Record<string, any> = {};
        Object.entries(n.inputs).forEach(([k, v]) => {
            inputsForNode[k] = this.getInterfaceValue(inputs, v.id);
        });
        this.events.beforeNodeCalculation.emit({ inputValues: inputsForNode, node: n });
        let r: any;
        if (n.calculate) {
            r = await n.calculate(inputsForNode, { globalValues: calculationData, engine: this });
        } else {
            r = {};
            for (const [k, intf] of Object.entries(n.outputs)) {
                r[k] = this.getInterfaceValue(inputs, intf.id);
            }
        }
        this.validateNodeCalculationOutput(n, r);
        this.events.afterNodeCalculation.emit({ outputValues: r, node: n });
        result.set(n.id, new Map(Object.entries(r)));

        Object.entries(n.outputs).forEach(([intfKey, intf]) => {
            graph.connections
                .filter((c) => c.from.id == intf.id)
                .forEach((c) => {
                    if (c) {
                        const v = this.hooks.transferData.execute(r[intfKey], c);
                        if (c.to.allowMultipleConnections) {
                            if (inputs.has(c.to.id)) {
                                (inputs.get(c.to.id)! as Array<any>).push(v);
                            } else {
                                inputs.set(c.to.id, [v]);
                            }
                        } else {
                            inputs.set(c.to.id, v)
                        }
                    }
                });
        });
        let forwardNodes:AbstractNode[] = []
        Object.values(n.outputs).forEach((o) => {
            forwardNodes.push(...(forwardMap.get(o.id) || []));
        });
        let promises = forwardNodes.map((x) => this.calculateNode(x, graph, inputs, calculationData, forwardMap,result));
        await Promise.all(promises);
        return result;
    }

    protected override async execute(calculationData: CalculationData): Promise<CalculationResult> {
        if (this.recalculateOrder) {
            this.order.clear();
            this.recalculateOrder = false;
        }
        const inputValues = this.getInputValues(this.editor.graph);
        return await this.runGraph(this.editor.graph, inputValues, calculationData);
    }

    private mapForwardNode(graph: Graph): Map<string, AbstractNode[]> {
        const map = new Map<string, AbstractNode[]>();
        graph.nodes.forEach((n) => {
            Object.values(n.inputs).forEach((i) => {
                graph.connections.forEach((c) => {
                    if (c.to.id === i.id) {
                        if (map.has(c.from.id)) {
                            map.get(c.from.id).push(n);
                        } else {
                            map.set(c.from.id, [n]);
                        }
                    }
                });
            });
        });
        return map;
    }
    private getStartNodes(graph: Graph): AbstractNode[] {
        return graph.nodes.filter(n=>Object.values(n.inputs).every(i=>i.connectionCount===0));
    }
    private getInterfaceValue(values: Map<string, any>, id: string): any {
        if (!values.has(id)) {
            return; 
            throw new Error(
                `Could not find value for interface ${id}\n` +
                    "This is likely a Baklava internal issue. Please report it on GitHub.",
            );
        }
        return values.get(id);
    }
    public getInputValues(graph: Graph): Map<string, any> {
        // Gather all values of the unconnected inputs.
        // maps NodeInterface.id -> value
        // The reason it is done here and not during calculation is
        // that this way we prevent race conditions because calculations can be async.
        // For the same reason, we need to gather all output values for nodes that do not have a calculate function.
        const inputValues = new Map<string, any>();
        for (const n of graph.nodes) {
            Object.values(n.inputs).forEach((ni) => {
                if (ni.connectionCount === 0) {
                    inputValues.set(ni.id, ni.value);
                }
            });
            if (!n.calculate) {
                Object.values(n.outputs).forEach((ni) => {
                    inputValues.set(ni.id, ni.value);
                });
            }
        }
        return inputValues;
    }
    protected onChange(recalculateOrder: boolean): void {
        this.recalculateOrder = recalculateOrder || this.recalculateOrder;
        void this.calculateWithoutData();
    }
}
