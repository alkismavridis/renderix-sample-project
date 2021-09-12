import Renderix from "../../../../main/ts/gui/renderix/api/Renderix";
import DomUpdater from "../../../../main/ts/gui/renderix/dom/update/DomUpdater";
import {RenderixNode} from "../../../../main/ts/gui/renderix/api/RenderixNode";
import EffectRepository from "../../../../main/ts/gui/renderix/EffectRepository";

test('should apply attribute options on element with no options', () => {
  const afterUpdate = update(
    ["span", "Hello"],
    ["span", {title: "My title", style: "color: red;"}, "Hello"],
  ) as Element;

  expect(afterUpdate.getAttribute("title")).toBe("My title");
  expect(afterUpdate.getAttribute("style")).toBe("color: red;");
});

test('should update attribute options on element', () => {
  const afterUpdate = update(
    ["span", {title: "My title", style: "color: red;"}, "Hello"],
    ["span", {title: "New title", style: "color: blue;"}, "Hello"],
  ) as Element;

  expect(afterUpdate.getAttribute("title")).toBe("New title");
  expect(afterUpdate.getAttribute("style")).toBe("color: blue;");
});

test('should remove specific attribute options on element', () => {
  const afterUpdate = update(
    ["span", {title: "My title", style: "color: red;"}, "Hello"],
    ["span", {title: "New title"}, "Hello"],
  ) as Element;

  expect(afterUpdate.getAttribute("title")).toBe("New title");
  expect(afterUpdate.getAttribute("style")).toBe(null);
});

test('should remove all attributes from element', () => {
  const afterUpdate = update(
    ["span", {title: "My title", style: "color: red;"}, "Hello"],
    ["span", null, "Hello"],
  ) as Element;

  expect(afterUpdate.getAttribute("title")).toBe(null);
  expect(afterUpdate.getAttribute("style")).toBe(null);
});



function update(original: RenderixNode, update: RenderixNode) : Node {
  const node = Renderix.makeElement(original);
  getUpdater().updateDom(update, node);

  return node;
}


function getUpdater(): DomUpdater {
  return new DomUpdater(new EffectRepository());
}
