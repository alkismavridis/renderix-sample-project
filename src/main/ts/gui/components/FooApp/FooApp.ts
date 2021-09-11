import AppUI from "business_rules/ui/AppUI";
import App from "business_rules/model/App";

import RenderixComponent from "gui/renderix/RenderixComponent";
import {ElementData, ContentData} from "gui/renderix/ElementData";
import DomReference from "gui/renderix/DomReference";

import FooInput from "gui/components/FooInput/FooInput";
import "./FooApp.scss";


export default class FooApp implements RenderixComponent, AppUI {
    private app:App;
    private inputElement: FooInput;
    private myDiv = new DomReference();
    private rootElement = new DomReference();

    constructor() {
        this.app = new App(this);
    }

    render(props, children: ContentData) : ElementData {
        return ["div", {"/ref": this.rootElement, "class":'FooApp_root'}, [
            ["h1", "Hello there!"],
            ["div", {"class": "FooApp__numDiv", "/ref":this.myDiv}, this.app.num],
            ["button", {".onclick": () => this.app.num = this.app.num - 10}, "-10"],
            ["button", {".onclick": () => this.app.num = 0}, "Reset"],
            ["button", {".onclick": () => this.app.num = this.app.num + 10}, "+10"],
            [FooInput, {"/assign": [this, "inputElement"], placeholder: "Hello", label: "Number:"}, null]
        ]];
    }


    /// AppUI
    updateValue(value:number) {
        this.myDiv.html(value);
        this.inputElement.setPlaceholder("It is now "+ value);
    }

    updateMessage(value:string) {
        this.inputElement.setWarningMessage(value);
    }
}
