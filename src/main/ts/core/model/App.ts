import AppUI from "../inputs/ui/AppUI";

export default class App {
    private _num = 0;

    constructor(private appUI:AppUI) {
        setInterval(() => this.num = this._num + 1, 700);
    }

    get num() { return this._num; }

    set num(value:number) {
        this._num = value;
        this.appUI.updateValue(this._num);
    }
}
