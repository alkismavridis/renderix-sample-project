import AppUI from "core/inputs/ui/AppUI";

export default class App {
    private _num = 0;
    private _message = "";

    constructor(private appUI:AppUI) {
        setInterval(() => this.num = this._num + 1, 700);
    }


    get num() : number { return this._num; }
    set num(value:number) {
        if (this._num === value) return;
        this._num = value;
        this.appUI.updateValue(this._num);

        this.message = value > 5 && value < 15? "Between 5 and 15!" : null;
    }

    get message() : string { return this._message; }
    set message(value: string) {
        if (this._message === value) return;
        this._message = value;
        this.appUI.updateMessage(this._message);
    }
}
