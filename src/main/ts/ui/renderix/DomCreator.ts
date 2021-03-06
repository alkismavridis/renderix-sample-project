import RenderixUtils from "./RenderixUtils";
import RenderixContext from "./RenderixContext";
import {ElementData, ContentData} from "./ElementData";
import RenderixComponent from "./RenderixComponent";

export default class DomCreator {
  static makeElement(data:ElementData, context:RenderixContext) : Node {
    if(data == null || data === false) return null;

  	if(RenderixUtils.isTextNodeData(data)) {
      return document.createTextNode(data as string);
    }

    return RenderixUtils.isNativeTag(data[0])?
        DomCreator.fromElementData(data, context) :
        DomCreator.fromComponentData(data, context);
  }

  static addContentTo(parent:Node, content:ContentData, context:RenderixContext) : void {
    if (content == null || content === false || !(parent instanceof Element)) return;
    const parentElement = parent as Element;

    if(RenderixUtils.isTextNodeData(content)) {
      parentElement.innerHTML = content as string;
    } else {
        (content as ElementData[]).forEach((d:ElementData) => {
            const child = DomCreator.makeElement(d, context);
            if(child) parentElement.appendChild(child);
        });
    }
  }


  /**
    Call this method only if data represent a html element.
    This means, data should be no primitive type and no
  */
  private static fromElementData(data:ElementData, context:RenderixContext) : Element {
    const el = data[0] === "!"?
        document.createComment("") :
        document.createElement(data[0]);

    switch((data as any[]).length) {
      //case 1: just the tagName. No content. For example, ["br"]

      case 2:		//tagname, content
        DomCreator.addContentTo(el, data[1], context);
        break;

      case 3:		//tagname, options, content
        DomCreator.applyOptions(el, data[1], context);
        DomCreator.addContentTo(el, data[2], context);
        break;
    }

    return el;
  }

  private static fromComponentData(data:ElementData, context:RenderixContext) : Node {
    const ComponentClass = data[0];
    if(!ComponentClass) {
      throw new Error("Unknown component: "+data[0]);
    }

    const componentInstance = new ComponentClass();
    let resultData: ElementData;
    switch((data as any).length) {
      case 1: //tagname only
        resultData = componentInstance.render({}, null);
        break;

      case 2: {  //tagname and options
        const attributes = data[1] || {};
        resultData = componentInstance.render(attributes, null);
        DomCreator.applyEffectsToComponent(componentInstance, attributes, context);
        break;
      }

      case 3: {
        const attributes = data[1] || {};
        resultData = componentInstance.render(attributes, data[2]);
        DomCreator.applyEffectsToComponent(componentInstance, attributes, context);
        break;
      }
    }

    return DomCreator.makeElement(resultData, context);
  }



  //SECTION OPTIONS
  private static applyOptions(el:Node, attrs:object, context:RenderixContext) : void {
    if(!attrs) return;
    const isElement = el instanceof Element;

    for(let key in attrs) {
      if (!attrs.hasOwnProperty(key)) continue;
      const firstKeyChar = key[0];
      const value = attrs[key];

      //It is a direct assignment
      if(firstKeyChar == ".") {
        el[ key.substring(1) ] = value;
      }

      //It is a special effect
      else if(firstKeyChar == "/") {
        DomCreator.applyEffect(el, key.substring(1), value, context);
      }

      //it is an html attribute
      else if (isElement && value && value !== false && value !== undefined) {
        (el as Element).setAttribute(key, value);
      }
    }
  }

  private static applyEffectsToComponent(comp:RenderixComponent, attrs:object, context:RenderixContext) : void {
      if(!attrs) return;

      for(let key in attrs) {
        if (!attrs.hasOwnProperty(key)) continue;
        const firstKeyChar = key[0];
        const value = attrs[key];

        if(firstKeyChar=="/") {
          DomCreator.applyEffect(comp, key.substring(1), value, context);
        }
      }
  }

  private static applyEffect(el:Node | RenderixComponent, key:string, value:any, context:RenderixContext) : void {
    const specialFunc = context.getEffect(key);
    if(!specialFunc) {
      throw new Error("DomCreator. Unknown effect: /" + key);
    }

    specialFunc(el, value);
  }
}
