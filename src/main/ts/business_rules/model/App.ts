import AppView from "../ui/AppView";

export default class App {
    private _num = 0;
    private _message = "";

    constructor(private view: AppView) {
        setInterval(() => this.num = this._num + 1, 700);
    }

    get num() : number { return this._num; }
    get message() : string { return this._message; }

    set num(value:number) {
        if (this._num === value) return;
        this._num = value;
        this.view.updateValue(this._num);

        this.setMessage(value > 5 && value < 15? "Between 5 and 15!" : null);
    }

    private setMessage(value: string) {
        if (this._message === value) return;
        this._message = value;
        this.view.updateMessage(this._message);
    }
}
