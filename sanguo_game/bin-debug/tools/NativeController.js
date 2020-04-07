var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var NativeController = (function () {
    function NativeController() {
        var _this = this;
        this.callbackList = [];
        egret.ExternalInterface.addCallback("sendToJS", function (msg) {
            console.log(msg);
            for (var _i = 0, _a = _this.callbackList; _i < _a.length; _i++) {
                var callbackFunc = _a[_i];
                callbackFunc(msg);
            }
        });
    }
    Object.defineProperty(NativeController, "instance", {
        get: function () {
            if (!this._instance) {
                this._instance = new NativeController();
            }
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    NativeController.prototype.addNativeCallback = function (callback) {
        this.callbackList.push(callback);
    };
    NativeController.prototype.sendToNative = function (message) {
        egret.ExternalInterface.call("sendToNative", message);
        "message from JS";
    };
    return NativeController;
}());
__reflect(NativeController.prototype, "NativeController");
