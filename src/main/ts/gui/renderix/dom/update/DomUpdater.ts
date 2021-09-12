import RenderixComponent from "../../api/RenderixComponent";

export default class DomUpdater {
  update(component: RenderixComponent<any>) {
    if(!component.__root__) return;
    component.__root__.replaceWith(component.render());
  }
}
