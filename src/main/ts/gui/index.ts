import FooApp from "./components/FooApp/FooApp";
import Renderix from "./renderix/Renderix";
import  "./css/index.scss";

// Define necessary global scope fields
(window as any).FooApp = FooApp;
(window as any).Renderix = Renderix;
