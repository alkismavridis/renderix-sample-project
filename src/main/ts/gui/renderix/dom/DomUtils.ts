export function isNativeTag(tagName:any) : boolean {
  return typeof tagName === "string";
}

export function isTextNodeData(data:any) : boolean {
  return data === true || typeof data === "string" || typeof data === "number";
}
