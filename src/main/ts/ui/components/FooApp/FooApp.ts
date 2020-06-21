import AppUI from "../../../core/inputs/ui/AppUI";
import App from "../../../core/model/App";

import RenderixComponent from "../../renderix/RenderixComponent";
import {ElementData, ContentData} from "../../renderix/ElementData";
import ElementReference from "../../renderix/ElementReference";

import FooInput from "../FooInput/FooInput";
import "./FooApp.scss";


export default class FooApp implements RenderixComponent, AppUI {
    private app:App;
    private inputElement: FooInput;
    private myDiv = new ElementReference();
    private rootElement = new ElementReference();

    constructor() {
        this.app = new App(this);
    }

    render(props, children: ContentData) : ElementData {
        return ["div", {"/ref": this.rootElement, "class":'FooApp_root'}, [
            ["h1", "Hello there!"],
            ["div", {"class": "FooApp__numDiv", "/ref":this.myDiv}, this.app.num],
            ["button", {".onclick": () => this.app.num = 0}, "Zero"],
            [FooInput, {"/assign": [this, "inputElement"], placeholder: "Hello", label: "Number:"}, null]
        ]];
    }


    /// AppUI
    updateValue(value:number) {
        this.myDiv.html(value);

        this.inputElement
            .setPlaceholder("It is now "+ value)
            .setWarningMessage(value > 5 && value < 15? "Between 5 and 15!" : null);
    }
}
