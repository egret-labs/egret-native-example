class TipsPanel extends eui.Component {
    constructor() {
        super();
        this.skinName = "skins.TipsPanelSkin";
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAdd, this);
    }

    confimeBtn: eui.Image;

    black: eui.Image;

    title: eui.Label;

    content: eui.Label;

    public confimeCallback: () => void;

    private onAdd() {
        this.confimeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            if (this.confimeCallback) {
                this.confimeCallback();
            }
        }, this);
    }
}