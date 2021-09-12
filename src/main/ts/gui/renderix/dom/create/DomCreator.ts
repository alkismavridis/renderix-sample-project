import {isNativeTag, isTextNodeData} from "../DomUtils";
import EffectRepository from "../../EffectRepository";
import {RenderixNode, ContentData} from "../../api/RenderixNode";
import RenderixComponent from "../../api/RenderixComponent";
import DomReference from "../../api/DomReference";
import EnhancedHtmlNode from "../EnhancedHtmlNode";
import getComponentProps from "./GetComponentProps";

export default class DomCreator {
  constructor(private readonly effectRepo: EffectRepository) {}

  makeElement(data: RenderixNode): Node {
    if (data == null || data === false) return null;

    if (isTextNodeData(data)) {
      return document.createTextNode(data as string);
    }

    return isNativeTag(data[0]) ?
      this.fromElementData(data) :
      this.createRenderixComponent(data);
  }

  addContentTo(parent: Node, content: ContentData): void {
    if (content == null || content === false || !(parent instanceof Element)) return;
    const parentElement = parent as Element;

    if (isTextNodeData(content)) {
      parentElement.innerHTML = content as string;
    } else {
      (content as RenderixNode[]).forEach((d: RenderixNode) => {
        const child = this.makeElement(d);
        if (child) parentElement.appendChild(child);
      });
    }
  }


  /**
   Call this method only if data represent a html element.
   This means, data should be no primitive type and no
   */
  private fromElementData(data: RenderixNode): Element {
    const el = data[0] === "!" ?
      document.createComment("") :
      document.createElement(data[0]);
    bindDataToNode(el, data);

    switch ((data as any[]).length) {
      //case 1: just the tagName. No content. For example, ["br"]

      case 2:		//tagname, content
        this.addContentTo(el, data[1]);
        break;

      case 3:		//tagname, options, content
        this.applyOptions(el, data[1]);
        this.addContentTo(el, data[2]);
        break;
    }

    return el;
  }

  private createRenderixComponent(data: RenderixNode): Node {
    const ComponentClass = data[0];
    if (!ComponentClass) {
      throw new Error("Unknown component: " + data[0]);
    }

    const props = getComponentProps(data);
    const componentInstance = new ComponentClass() as RenderixComponent<any>;
    componentInstance.props = props;
    componentInstance.onInit();

    const renderixNode = componentInstance.render();
    const markup = this.makeElement(renderixNode) || document.createComment("");
    bindDataToNode(markup, data);
    bindComponentToNode(markup, componentInstance);

    componentInstance.__root__ = new DomReference().setValue(markup);
    this.applyEffectsToComponent(componentInstance);

    return markup;
  }


  //SECTION OPTIONS
  private applyOptions(el: Node, attrs: object): void {
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
        this.effectRepo.apply(el, key.substring(1), value);
      }

      //it is an html attribute
      else if (isElement && value !== false && value != null) {
        (el as Element).setAttribute(key, value);
      }
    }
  }

  private applyEffectsToComponent(comp: RenderixComponent<any>): void {
    if (!comp.props) return;

    for (let key in comp.props) {
      if (!comp.props.hasOwnProperty(key)) continue;
      const firstKeyChar = key[0];
      const value = comp.props[key];

      if (firstKeyChar == "/") {
        this.effectRepo.apply(comp, key.substring(1), value);
      }
    }
  }
}

function bindDataToNode(node: Node, data: RenderixNode) {
  (node as EnhancedHtmlNode)._d = data;
}

function bindComponentToNode(node: Node, component: RenderixComponent<any>) {
  (node as EnhancedHtmlNode)._c = component;
}
