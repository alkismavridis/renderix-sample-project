import {ContentData, ElementData} from "./ElementData";
import RenderixUtils from "./RenderixUtils";
import Renderix from "./Renderix";

export default class ElementReference {
    private _el: Node;


    /// ELEMENT MANAGEMENT
    getValue() : Node {
        if (this._el instanceof Comment) return null;
        return this._el;
    }

    /** Changes the reference to a new element. No DOM operations are performed. */
    setValue(newValue: Node) : ElementReference {
        this._el = newValue;
        return this;
    }

    /**
        Has no effect if the element is not already mounted.
        Replaces the existing element with a new one in the DOM.
        If null or false is passed, the current element will be removed.
    */
    replaceWith(data: ElementData) : ElementReference {
        const prevElement = this._el;
        if (!prevElement || !prevElement.parentElement) {
            return this;
        }

        const newElement = Renderix.makeElement(data) || document.createComment("");
        prevElement.parentElement.replaceChild(newElement, prevElement);

        this._el = newElement;
        return this;
    }


    /// ELEMENT MANIPULATION
    html(data: ContentData) : ElementReference {
        if (this._el == null) return this;

        if (RenderixUtils.isTextNodeData(data)) {
            this.setTextContent(data + "");
            return this;
        }

        if (this._el instanceof Element) {
            this.setTextContent("");
            Renderix.mount(this._el as Element, data);
        }

        return this;
    }

    private setTextContent(value:string) {
        if (this._el instanceof Element) {
            const el = this._el as Element;
            if (el.innerHTML != value) el.innerHTML = value;
        } else if (this._el instanceof Text) {
            const txt = this._el as Text;
            if (txt.data != value) txt.data = value;
        }
    }

    attr(name:string, value: any) : ElementReference {
        if (this._el instanceof Element === false) return this;
        const element = this._el as Element;

        if (value === false || value == null) {
            if (element.hasAttribute(name)) element.removeAttribute(name);
        } else {
            const stringVal = value + "";
            if (element.getAttribute(name) !== stringVal) {
                element.setAttribute(name, stringVal);
            }
        }

        return this;
    }

    cssClass(name: string, enable: boolean) : ElementReference {
        if (this._el instanceof Element === false) return this;
        const element = this._el as Element;

        if (enable) element.classList.add(name);
        else element.classList.remove(name);

        return this;
    }

    style(name: string, value: string | undefined) : ElementReference {
        if (this._el instanceof HTMLElement === false) return this;
        const element = this._el as HTMLElement;

        element.style[name] = value

        return this;
    }

    /** Appends a child. */
    append(data: ElementData) : ElementReference {
        if (!this.getValue()) return this;

        const createdElement = Renderix.makeElement(data);
        if (createdElement) this._el.appendChild(createdElement);

        return this;
    }


    /// POSITION
    goInside(parent: Node) : ElementReference {
        if (!parent || !this._el) return this;
        parent.appendChild(this._el);

        return this;
    }

    goBefore(sibling: Node) : ElementReference {
        if (!this._el || !sibling || !sibling.parentElement) return this;
        sibling.parentElement.insertBefore(this._el, sibling);

        return this;
    }

    remove() : ElementReference {
        if (!this.getValue() || !this._el.parentElement) return this;

        const newElement = document.createComment("");
        this._el.parentElement.replaceChild(newElement, this._el);
        this._el = newElement;

        return this;
    }


    /// CONVENIENCE METHODS

    /**
        Makes the element appear, dissapear or update itself.

        Parameters:
            show: should the item appear or dissapear?
            createCallback: if the item needs to be created, tell me how (return ElementData)
            updateCallback: if the item needs to be updated (in case it already exists in dom), tell me how.
    */
    update(show:boolean, createCallback:() => ElementData, updateCallback:(el:ElementReference) => void) : ElementReference {
        if (!show) {
            return this.remove();
        }

        if (this.getValue()) {
            updateCallback(this);
            return this;
        } else {
            return this.replaceWith(createCallback());
        }
    }
}
