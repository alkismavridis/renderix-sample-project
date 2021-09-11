import AppUI from "business_rules/ui/AppUI";

export default class App {
    private _num = 0;
    private _message = "";

    constructor(private appUI:AppUI) {
        setInterval(() => this.num = this._num + 1, 700);
    }


    /// GETTERS
    get num() : number { return this._num; }
    get message() : string { return this._message; }


    /// ACTIONS
    private setMessage(value: string) {
        if (this._message === value) return;
        this._message = value;
        this.appUI.updateMessage(this._message);
    }

    set num(value:number) {
        if (this._num === value) return;
        this._num = value;
        this.appUI.updateValue(this._num);

        this.setMessage(value > 5 && value < 15? "Between 5 and 15!" : null);
    }
}
