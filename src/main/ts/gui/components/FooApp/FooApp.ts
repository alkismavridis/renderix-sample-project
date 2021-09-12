import App from "../../../business_rules/model/App";
import AppUI from "../../../business_rules/ui/AppUI";
import FooInput from "../FooInput/FooInput";
import DomReference from "../../renderix/api/DomReference";
import RenderixComponent from "../../renderix/api/RenderixComponent";
import {RenderixNode} from "../../renderix/api/RenderixNode";
import "./FooApp.scss";


export default class FooApp extends RenderixComponent<void> implements AppUI {
    private app: App;
    private inputElement: FooInput;
    private myDiv = new DomReference();
    private rootElement = new DomReference();

    constructor() {
        super();
        this.app = new App(this);
    }

    fooLifecycle(markup: Node, updater: () => void) {
        console.log(markup);
        updater();
    }

    render() : RenderixNode {
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
