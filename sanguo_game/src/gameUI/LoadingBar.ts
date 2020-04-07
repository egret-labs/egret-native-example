class LoadingBar extends eui.Component {
    constructor() {
        super();
        this.skinName = "skins.loadingBarSkin";

        this.progressLabel.text = "(0/0)";
    }

    public bottomBar: eui.Image;
    public mainBar: eui.Image;
    public progressLabel: eui.Label;

    private _max: number = 100;

    set max(value: number) {
        this._max = value;
    }

    get max() {
        return this._max;
    }

    private _current: number = 0;

    set current(value: number) {
        this._current = value;
        this.$updateValue();
    }

    get current() {
        return this._current;
    }


    private $updateValue() {
        const current = this._current / this._max;
        this.progressLabel.text = `(${Math.floor(this.current)}/${Math.floor(this.max)})`;
        this.mainBar.width = Math.floor(this.bottomBar.width * current);
    }

}