class ServerItem extends eui.ItemRenderer {
    constructor() {
        super();
        this.skinName = "skins.ServerItemSkin";
    }
    serverNameLabel: eui.Label;



    set data(value: string) {
        this.serverNameLabel.text = value;
    }
}