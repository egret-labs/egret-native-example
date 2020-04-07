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
var LoadingBar = (function (_super) {
    __extends(LoadingBar, _super);
    function LoadingBar() {
        var _this = _super.call(this) || this;
        _this._max = 100;
        _this._current = 0;
        _this.skinName = "skins.loadingBarSkin";
        _this.progressLabel.text = "(0/0)";
        return _this;
    }
    Object.defineProperty(LoadingBar.prototype, "max", {
        get: function () {
            return this._max;
        },
        set: function (value) {
            this._max = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoadingBar.prototype, "current", {
        get: function () {
            return this._current;
        },
        set: function (value) {
            this._current = value;
            this.$updateValue();
        },
        enumerable: true,
        configurable: true
    });
    LoadingBar.prototype.$updateValue = function () {
        var current = this._current / this._max;
        this.progressLabel.text = "(" + Math.floor(this.current) + "/" + Math.floor(this.max) + ")";
        this.mainBar.width = Math.floor(this.bottomBar.width * current);
    };
    return LoadingBar;
}(eui.Component));
__reflect(LoadingBar.prototype, "LoadingBar");
