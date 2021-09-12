import {RenderixNode} from "../api/RenderixNode";

export function isNativeTag(tagName:any) : boolean {
  return typeof tagName === "string";
}

export function isTextNodeData(data:any) : boolean {
  return data === true || typeof data === "string" || typeof data === "number";
}

export function getRenderixNodeOptions(node: RenderixNode): any {
  if(!Array.isArray(node)) return null;
  const arrayData = node as any[];

  return arrayData.length === 3? arrayData[1] : null;
}
