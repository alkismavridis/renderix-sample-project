import RenderixComponent from "../../api/RenderixComponent";
import {RenderixNode} from "../../api/RenderixNode";
import {getRenderixNodeOptions} from "../DomUtils";
import EffectRepository from "../../EffectRepository";

export default class DomUpdater {
  constructor(private readonly effectRepo: EffectRepository) {}


  updateComponent(component: RenderixComponent<any>) {
    if(!component.__root__) return;
    this.updateDom(component.render(), component.__root__.raw);
  }

  updateDom(renderixNode: RenderixNode, root: Node) {
    if (!root) return;

    if (root instanceof Element) {
      this.updateAttributes(root, renderixNode);
    }
  }

  private updateAttributes(element: Element, renderixNode: RenderixNode) {
    const elementData = (element as any)._d;
    const oldOptions = getRenderixNodeOptions(elementData) || {};
    const newOptions = getRenderixNodeOptions(renderixNode) || {};

    for (let key in newOptions) {
      if(!newOptions.hasOwnProperty(key)) continue;

      const oldValue = oldOptions[key];
      const newValue = newOptions[key];

      if (oldValue === newValue) {}
      else if (newValue != null) this.applyOption(element, key, newValue);
      else this.undoOption(element, key);
    }

    for (let key in oldOptions) {
      if(!oldOptions.hasOwnProperty(key)) continue;
      if(newOptions.hasOwnProperty(key)) continue;
      this.undoOption(element, key);
    }
  }


  /// OPTION MANAGEMENT
  private applyOption(element: Element, optionKey: string, optionValue: any) {
    if (optionKey[0] == ".") {
      element[optionKey.substring(1)] = optionValue;
    } else if (optionKey[0] == "/") {
      this.effectRepo.apply(element, optionKey.substring(1), optionValue);
    } else if (optionValue !== false && optionValue != null) {
      element.setAttribute(optionKey, optionValue);
    }
  }

  private undoOption(element: Element, optionKey: string) {
    if (optionKey[0] == ".") {
      element[optionKey.substring(1)] = undefined;
    } else if (optionKey[0] == "/") {
      this.effectRepo.apply(element, optionKey.substring(1), undefined);
    } else {
      element.removeAttribute(optionKey);
    }
  }
}
