import RenderixUtils from "./RenderixUtils";
import DomCreator from "./DomCreator";
import ElementReference from "./ElementReference";

export default class RenderixContext {
    /// FIELDS
    private _effects:any = {
        call: (el:Node, callback) => callback(el),
        style: (el:HTMLElement, styleObject) => Object.assign(el.style, styleObject),

        /*
            example: "/assign": [foo, "bar"]
            This will set foo.bar = el;

            One can use it with "this":
            ["div", {"/assign": [this, "myDiv"]}, "Hello"] (Result: this.myDiv = el)
        */
        assign: (el:Node, ref) => ref[0][ ref[1] ] = el,

        ref: (el:Node, ref:ElementReference) => ref.setValue(el)
    };

    getEffect(name:string) : any {
        return this._effects[name];
    }

    addEffect(name:string, callback: Function) {
        if (this._effects[name]) {
            throw new Error(`RenderixContext: effect ${name} is already registered`);
        }

        this._effects[name] = callback;
    }
}
