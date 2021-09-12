import RenderixComponent from "../../renderix/api/RenderixComponent";
import {RenderixNode} from "../../renderix/api/RenderixNode";
import DomReference from "../../renderix/api/DomReference";
import "./FooInput.scss";


interface Props {
    label?: string;
    placeholder?: string;
    warningMessage?: string;
}


export default class FooInput extends RenderixComponent<Props> {
    private rootElement = new DomReference();
    private inpElement = new DomReference();
    private warningDiv = new DomReference();

    /// RENDERING
    render(): RenderixNode {
        return ["div", {"class": "FooInput__root", "/ref": this.rootElement}, [
            this.renderLabel(),
            this.renderWarningMessage(this.props.warningMessage)
        ]];
    }

    private renderLabel() : RenderixNode {
        return ["label", null, [
            this.props.label && ["span", {"class": "FooInput__label"}, this.props.label],
            ["input", {
                title: "You hover me!",
                placeholder: this.props.placeholder,
                "/ref": this.inpElement,
                "/onKeyUpPS": value => console.log(value)
            }, null]
        ]];
    }

    private renderWarningMessage(message: string) : RenderixNode {
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
