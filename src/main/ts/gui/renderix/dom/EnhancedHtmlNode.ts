import {RenderixNode} from "../api/RenderixNode";
import RenderixComponent from "../api/RenderixComponent";

type NodeExtras = {_d: RenderixNode, _c: RenderixComponent<any>};
type EnhancedHtmlNode = Node & NodeExtras;
export default EnhancedHtmlNode;
