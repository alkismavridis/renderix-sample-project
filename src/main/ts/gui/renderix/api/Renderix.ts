import EffectRepository from "../EffectRepository";
import DomCreator from "../dom/create/DomCreator";
import {ContentData, RenderixNode} from "./RenderixNode";
import RenderixComponent from "./RenderixComponent";
import DomUpdater from "../dom/update/DomUpdater";


export default class Renderix {
    private static effects = new EffectRepository();
    private static creator = new DomCreator(Renderix.effects);
    private static updater = new DomUpdater();

    static mount(host:Element, data:ContentData) : void {
        this.creator.addContentTo(host, data);
    }

    static makeElement(data: RenderixNode) : Node {
        return this.creator.makeElement(data);
    }

    static update(component: RenderixComponent<any>) {
        this.updater.updateComponent(component);
    }

    static addEffect(name:string, callback: Function) {
        Renderix.effects.add(name, callback);
    }
}
