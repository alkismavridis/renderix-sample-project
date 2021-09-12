import {RenderixNode} from "./RenderixNode";
import DomReference from "./DomReference";
import Renderix from "./Renderix";


export default class RenderixComponent<P> {
    __root__: DomReference;
    props: P;

    /** Props are set. Render is not called yet. */
    onInit() {}

    render(): RenderixNode { throw new Error("Renderix Components must override render()"); }

    update() {
        Renderix.update(this);
    }
};
