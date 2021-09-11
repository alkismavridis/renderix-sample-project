import RenderixComponent from "gui/renderix/RenderixComponent";
import {ElementData, ContentData} from "gui/renderix/ElementData";
import DomReference from "gui/renderix/DomReference";

import "./FooInput.scss";


export class FooInputProps {
    label?: string;
    placeholder?: string;
    warningMessage?: string;
}


export default class FooInput implements RenderixComponent {
    private rootElement = new DomReference();
    private inpElement = new DomReference();
    private warningDiv = new DomReference();

    /// RENDERING
    render(props:FooInputProps, children:ContentData) : ElementData {
        return ["div", {"class": "FooInput__root", "/ref": this.rootElement}, [
            ["label", null, [
                props.label && ["span", {"class": "FooInput__label"}, props.label],
                ["input", {
                    title: "You hover me!",
                    placeholder: props.placeholder,
                    "/ref": this.inpElement,
                    "/onKeyUpPS": value => console.log(value)
                }, null]
            ]],
            this.renderWarningMessage(props.warningMessage)
        ]];
    }

    renderWarningMessage(message: string) : ElementData {
        return [message? "div" : "!", {"/ref": this.warningDiv, "class":"FooInput__warning"}, message];
    }


    /// UPDATES
    setPlaceholder(value: string) : FooInput {
        this.inpElement.attr("placeholder", value);
        return this;
    }

    setWarningMessage(value: string) : FooInput {
        this.warningDiv.update(
            !!value,
            () => this.renderWarningMessage(value),
            r => r.html(value)
        );

        return this;
    }
}
