import {RenderixNode} from "./RenderixNode";
import DomReference from "./DomReference";


export default class RenderixComponent<P> {
    __root__: DomReference;
    props: P;

    /** Props are set. Render is not called yet. */
    onInit() {}

    render(): RenderixNode { throw new Error("Renderix Components must override render()"); }

    update() {
        if (!this.__root__) return;
        this.__root__.replaceWith(this.render()); // TODO make real change detection
    }
};
