import FooApp from "./components/FooApp/FooApp";
import Renderix from "./renderix/api/Renderix";
import  "./css/index.scss";


window.addEventListener("load", () => {
  Renderix.mount(
    document.querySelector("body"),
    [[FooApp]]
  );
})
