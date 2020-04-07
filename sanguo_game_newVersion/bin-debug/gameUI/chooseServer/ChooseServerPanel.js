var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var ChooseServerPanel = (function (_super) {
    __extends(ChooseServerPanel, _super);
    function ChooseServerPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "skins.ChooseServerPanelSkin";
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAdd, _this);
        return _this;
    }
    ChooseServerPanel.prototype.onAdd = function () {
        var _this = this;
        // 模拟服务器列表
        var serverList = [];
        for (var i = 1; i < 20; i++) {
            serverList.push("\u670D\u52A1\u5668" + i);
        }
        this.arrayCollection = new eui.ArrayCollection(serverList);
        this.scroller.removeChild(this.scroller.verticalScrollBar);
        this.list.dataProvider = this.arrayCollection;
        this.list.itemRenderer = ServerItem;
        this.black.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.closePanel();
        }, this);
        this.list.touchEnabled = true;
        this.list.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
            if (_this.chooseServerCallback) {
                _this.chooseServerCallback(_this.arrayCollection.source[_this.list.selectedIndex]);
            }
            _this.closePanel();
        }, this);
    };
    ChooseServerPanel.prototype.closePanel = function () {
        this.visible = false;
    };
    return ChooseServerPanel;
}(eui.Component));
__reflect(ChooseServerPanel.prototype, "ChooseServerPanel");
