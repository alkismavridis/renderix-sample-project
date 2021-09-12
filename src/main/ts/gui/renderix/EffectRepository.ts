import DomReference from "./api/DomReference";

export default class EffectRepository {
    private _effects: any = {
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
        onClickP: (el:any, callback) => this.addEventListener(el, callback, "onclick", true, false),
        onClickS: (el:any, callback) => this.addEventListener(el, callback, "onclick", false, true),
        onClickPS: (el:any, callback) => this.addEventListener(el, callback, "onclick", true, true),

        onSubmitP: (el:any, callback) => this.addEventListener(el, callback, "onsubmit", true, false),
        onSubmitS: (el:any, callback) => this.addEventListener(el, callback, "onsubmit", false, true),
        onSubmitPS: (el:any, callback) => this.addEventListener(el, callback, "onsubmit", true, true),

        // VALUE HANDLERS
        onChange: (el:any, callback) => this.addValueListener(el, callback, "onchange", false, false),

        onKeyUp: (el:any, callback) => this.addValueListener(el, callback, "onkeyup", false, false),
        onKeyUpP: (el:any, callback) => this.addValueListener(el, callback, "onkeyup", true, false),
        onKeyUpS: (el:any, callback) => this.addValueListener(el, callback, "onkeyup", false, true),
        onKeyUpPS: (el:any, callback) => this.addValueListener(el, callback, "onkeyup", true, true),
    };

    get(name:string) : Function {
        return this._effects[name];
    }

    add(name:string, callback: Function) {
        if (this._effects[name]) {
            throw new Error(`RenderixContext: effect ${name} is already registered`);
        }

        this._effects[name] = callback;
    }

    /** Assigns a callback */
    private addValueListener(el:any, callback, key:string, preventDefault:boolean, stopPropagation:boolean) {
        el[key] = (event:any) => {
            if(preventDefault) event.preventDefault();
            if(stopPropagation) event.stopPropagation();
            callback(event.target.value);
        }
    }

    private addEventListener(el:any, callback, key:string, preventDefault:boolean, stopPropagation:boolean) {
        el[key] = (event:any) => {
            if(preventDefault) event.preventDefault();
            if(stopPropagation) event.stopPropagation();
            callback(event);
        }
    }
}
