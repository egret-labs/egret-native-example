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
var TipsPanel = (function (_super) {
    __extends(TipsPanel, _super);
    function TipsPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "skins.TipsPanelSkin";
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAdd, _this);
        return _this;
    }
    TipsPanel.prototype.onAdd = function () {
        var _this = this;
        this.confimeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (_this.confimeCallback) {
                _this.confimeCallback();
            }
        }, this);
    };
    return TipsPanel;
}(eui.Component));
__reflect(TipsPanel.prototype, "TipsPanel");
