import RenderixUtils from "./RenderixUtils";
import RenderixContext from "./RenderixContext";
import {RenderixNode, ContentData} from "./RenderixNode";
import RenderixComponent from "./RenderixComponent";
import DomReference from "./DomReference";

export default class DomCreator {
  static makeElement(data: RenderixNode, context: RenderixContext): Node {
    if (data == null || data === false) return null;

    if (RenderixUtils.isTextNodeData(data)) {
      return document.createTextNode(data as string);
    }

    return RenderixUtils.isNativeTag(data[0]) ?
      DomCreator.fromElementData(data, context) :
      DomCreator.createRenderixComponent(data, context);
  }

  static addContentTo(parent: Node, content: ContentData, context: RenderixContext): void {
    if (content == null || content === false || !(parent instanceof Element)) return;
    const parentElement = parent as Element;

    if (RenderixUtils.isTextNodeData(content)) {
      parentElement.innerHTML = content as string;
    } else {
      (content as RenderixNode[]).forEach((d: RenderixNode) => {
        const child = DomCreator.makeElement(d, context);
        if (child) parentElement.appendChild(child);
      });
    }
  }


  /**
   Call this method only if data represent a html element.
   This means, data should be no primitive type and no
   */
  private static fromElementData(data: RenderixNode, context: RenderixContext): Element {
    const el = data[0] === "!" ?
      document.createComment("") :
      document.createElement(data[0]);
    DomCreator.attachData(el, data);

    switch ((data as any[]).length) {
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

  private static createRenderixComponent(data: RenderixNode, context: RenderixContext): Node {
    const ComponentClass = data[0];
    if (!ComponentClass) {
      throw new Error("Unknown component: " + data[0]);
    }

    const props = DomCreator.getComponentProps(data);
    const componentInstance = new ComponentClass() as RenderixComponent<any>;
    componentInstance.props = props;
    componentInstance.onInit();

    const renderixNode =  componentInstance.render();
    const markup = DomCreator.makeElement(renderixNode, context) || document.createComment("");
    DomCreator.attachData(markup, data);
    DomCreator.attachComponent(markup, componentInstance);

    componentInstance.__root__ = new DomReference().setValue(markup);
    DomCreator.applyEffectsToComponent(componentInstance, context);

    return markup;
  }


  private static getComponentProps(data: RenderixNode) {
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


  //SECTION OPTIONS
  private static applyOptions(el: Node, attrs: object, context: RenderixContext): void {
    if (!attrs) return;
    const isElement = el instanceof Element;

    for (let key in attrs) {
      if (!attrs.hasOwnProperty(key)) continue;
      const firstKeyChar = key[0];
      const value = attrs[key];

      //It is a direct assignment
      if (firstKeyChar == ".") {
        el[key.substring(1)] = value;
      }

      //It is a special effect
      else if (firstKeyChar == "/") {
        DomCreator.applyEffect(el, key.substring(1), value, context);
      }

      //it is an html attribute
      else if (isElement && value && value !== false && value !== undefined) {
        (el as Element).setAttribute(key, value);
      }
    }
  }

  private static applyEffectsToComponent(comp: RenderixComponent<any>, context: RenderixContext): void {
    if (!comp.props) return;

    for (let key in comp.props) {
      if (!comp.props.hasOwnProperty(key)) continue;
      const firstKeyChar = key[0];
      const value = comp.props[key];

      if (firstKeyChar == "/") {
        DomCreator.applyEffect(comp, key.substring(1), value, context);
      }
    }
  }

  private static applyEffect(el: Node | RenderixComponent<any>, key: string, value: any, context: RenderixContext): void {
    const specialFunc = context.getEffect(key);
    if (!specialFunc) {
      throw new Error("DomCreator. Unknown effect: /" + key);
    }

    specialFunc(el, value);
  }

  private static attachData(node: Node, data: RenderixNode) {
    (node as any)._d = data;
  }

  private static attachComponent(node: Node, component: RenderixComponent<any>) {
    (node as any)._c = component;
  }
}
