import RenderixContext from "./RenderixContext";
import DomCreator from "./DomCreator";
import {ContentData, RenderixNode} from "./RenderixNode";


export default class Renderix {
    private static _ctx = new RenderixContext();

    static mount(host:Element, data:ContentData) : void {
        DomCreator.addContentTo(host, data, Renderix._ctx);
    }

    static makeElement(data: RenderixNode) : Node {
        return DomCreator.makeElement(data, Renderix._ctx);
    }

    static addEffect(name:string, callback: Function) {
        Renderix._ctx.addEffect(name, callback);
    }
}
