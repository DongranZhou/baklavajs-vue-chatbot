import { markRaw } from "vue";
import { NodeInterface, setType, NodeInterfaceType } from "baklavajs";
import MarkdownInterfaceVue from './MarkdownInterface.vue'

export default class MarkdownInterface extends NodeInterface {
    constructor(name: string) {
        super(name, "");
        this.setComponent(markRaw(MarkdownInterfaceVue));
        this.use(setType, new NodeInterfaceType("string"))
    }
}