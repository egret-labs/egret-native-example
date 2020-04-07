class ChooseServerPanel extends eui.Component {
    constructor() {
        super();
        this.skinName = "skins.ChooseServerPanelSkin";
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAdd, this);
    }

    scroller: eui.Scroller;

    list: eui.List;

    black: eui.Image;


    public chooseServerCallback: (serverName: string) => void;

    private arrayCollection: eui.ArrayCollection;

    onAdd() {
        // 模拟服务器列表
        const serverList = [];
        for (let i = 1; i < 20; i++) {
            serverList.push(`服务器${i}`);
        }
        this.arrayCollection = new eui.ArrayCollection(serverList);

        this.scroller.removeChild(this.scroller.verticalScrollBar);

        this.list.dataProvider = this.arrayCollection;

        this.list.itemRenderer = ServerItem;

        this.black.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.closePanel();
        }, this);

        this.list.touchEnabled = true;
        this.list.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: egret.Event) => {
            if (this.chooseServerCallback) {
                this.chooseServerCallback(this.arrayCollection.source[this.list.selectedIndex]);
            }
            this.closePanel();
        }, this);
    }

    private closePanel() {
        this.visible = false;
    }

}