class StartGameButton extends eui.Component {
    constructor() {
        super();
        this.skinName = "skins.StartButtonSkin";
        console.log("StartButtonSkin create");
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, () => {
            console.log("开始游戏");
        }, this);
    }

    public img: eui.Image;
}