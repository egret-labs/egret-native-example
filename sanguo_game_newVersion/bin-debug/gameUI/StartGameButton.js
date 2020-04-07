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
var StartGameButton = (function (_super) {
    __extends(StartGameButton, _super);
    function StartGameButton() {
        var _this = _super.call(this) || this;
        _this.skinName = "skins.StartButtonSkin";
        console.log("StartButtonSkin create");
        _this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            console.log("开始游戏");
        }, _this);
        return _this;
    }
    return StartGameButton;
}(eui.Component));
__reflect(StartGameButton.prototype, "StartGameButton");
