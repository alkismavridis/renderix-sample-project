export default class RenderixUtils {
  static isNativeTag(tagName:any) : boolean {
    return typeof tagName === "string";
  }

  static isTextNodeData(data:any) : boolean {
    return data === true || typeof data === "string" || typeof data === "number";
  }
}
