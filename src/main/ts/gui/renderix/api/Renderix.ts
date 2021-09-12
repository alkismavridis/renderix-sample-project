import EffectRepository from "../EffectRepository";
import DomCreator from "../dom/create/DomCreator";
import {ContentData, RenderixNode} from "./RenderixNode";
import RenderixComponent from "./RenderixComponent";
import DomUpdater from "../dom/update/DomUpdater";


export default class Renderix {
    private static _effects = new EffectRepository();
    private static _creator = new DomCreator(Renderix._effects);
    private static _updater = new DomUpdater();

    static mount(host:Element, data:ContentData) : void {
        this._creator.addContentTo(host, data);
    }

    static makeElement(data: RenderixNode) : Node {
        return this._creator.makeElement(data);
    }

    static update(component: RenderixComponent<any>) {
        return this._updater.update(component);
    }

    static addEffect(name:string, callback: Function) {
        Renderix._effects.add(name, callback);
    }
}
