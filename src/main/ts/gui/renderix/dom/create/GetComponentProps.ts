import {RenderixNode} from "../../api/RenderixNode";

export default function getComponentProps(data: RenderixNode) {
  switch ((data as any).length) {
    case 1: //tagname only
      return {};

    case 2:  //tagname and options
      return data[1] || {};

    case 3:
      const result = data[1] || {};
      result.children = data[2];
      return result;

    default:
      return {};
  }
}
