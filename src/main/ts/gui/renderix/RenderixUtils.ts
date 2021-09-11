export default class RenderixUtils {
  static isNativeTag(tagName:any) : boolean {
    return typeof tagName === "string";
  }

  static isTextNodeData(data:any) : boolean {
    return data === true || typeof data === "string" || typeof data === "number";
  }

  /** Assigns a callback */
  static addValueListener(el:any, callback, key:string, preventDefault:boolean, stopPropagation:boolean) {
      el[key] = (event:any) => {
          if(preventDefault) event.preventDefault();
          if(stopPropagation) event.stopPropagation();
          callback(event.target.value);
      }
  }

  static addEventListener(el:any, callback, key:string, preventDefault:boolean, stopPropagation:boolean) {
      el[key] = (event:any) => {
          if(preventDefault) event.preventDefault();
          if(stopPropagation) event.stopPropagation();
          callback(event);
      }
  }
}
