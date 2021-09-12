import RenderixUtils from "./RenderixUtils";
import DomReference from "./DomReference";

export default class RenderixContext {
    private _effects:any = {
        call: (el:Node, callback) => callback(el),
        style: (el:HTMLElement, styleObject) => Object.assign(el.style, styleObject),

        /*
            examples:
            "/assign": [foo, "bar"], //This will set foo.bar = el;
            ["div", {"/assign": [this, "myDiv"]}, "Hello"] //Result: this.myDiv = el)
        */
        assign: (el:Node, ref) => ref[0][ ref[1] ] = el,

        ref: (el:Node, ref:DomReference) => ref.setValue(el),

        // EVENT HANDLERS
        onClickP: (el:any, callback) => RenderixUtils.addEventListener(el, callback, "onclick", true, false),
        onClickS: (el:any, callback) => RenderixUtils.addEventListener(el, callback, "onclick", false, true),
        onClickPS: (el:any, callback) => RenderixUtils.addEventListener(el, callback, "onclick", true, true),

        onSubmitP: (el:any, callback) => RenderixUtils.addEventListener(el, callback, "onsubmit", true, false),
        onSubmitS: (el:any, callback) => RenderixUtils.addEventListener(el, callback, "onsubmit", false, true),
        onSubmitPS: (el:any, callback) => RenderixUtils.addEventListener(el, callback, "onsubmit", true, true),

        // VALUE HANDLERS
        onChange: (el:any, callback) => RenderixUtils.addValueListener(el, callback, "onchange", false, false),

        onKeyUp: (el:any, callback) => RenderixUtils.addValueListener(el, callback, "onkeyup", false, false),
        onKeyUpP: (el:any, callback) => RenderixUtils.addValueListener(el, callback, "onkeyup", true, false),
        onKeyUpS: (el:any, callback) => RenderixUtils.addValueListener(el, callback, "onkeyup", false, true),
        onKeyUpPS: (el:any, callback) => RenderixUtils.addValueListener(el, callback, "onkeyup", true, true),


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
