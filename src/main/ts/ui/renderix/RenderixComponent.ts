import {ElementData, ContentData} from "./ElementData";


export default interface RenderixComponent {
    render(props:any, children:ContentData): ElementData;
};
