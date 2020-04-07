/**
 * 模拟当前游戏版本
 */
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
var BgPanel = (function (_super) {
    __extends(BgPanel, _super);
    function BgPanel() {
        var _this = _super.call(this) || this;
        _this.GAME_VERSION = "0.9.0";
        _this.hasStart = false;
        /**
         * 模拟开始游戏
         */
        _this.startGame = function () {
            if (_this.hasStart) {
                // 防止连续调用
                return;
            }
            // 网络版本号检查
            _this.startButton.visible = false;
            _this.hasStart = true;
            return checkGameVersion().then(function (version) {
                console.log("获取的版本号:", version);
                console.log("GAME_VERSION", _this.GAME_VERSION);
                if (_this.GAME_VERSION < version) {
                    _this.needLoadNew();
                }
                else {
                    _this.notNeedLoad();
                }
            }).catch(function () {
                // this.startGameCallback(false)
                _this.netWorkdDisconnect();
            });
        };
        _this.netWorkdDisconnect = function () {
            _this.tipsPanel.visible = true;
            _this.tipsPanel.title.text = "网络连接断开";
            _this.tipsPanel.content.text = "网络连接已断开，请再试一次";
            _this.hasStart = false;
            _this.tipsPanel.confimeCallback = function () {
                _this.tipsPanel.visible = false;
                _this.startGame();
            };
        };
        _this.needLoadNew = function () {
            _this.tipsPanel.visible = true;
            _this.tipsPanel.title.text = "检查到新版本";
            _this.tipsPanel.content.text = "需要更新到新版本\n更新成功后将重启游戏";
            _this.tipsPanel.confimeCallback = function () {
                _this.tipsPanel.visible = false;
                _this.showLoadingBar();
                NativeController.instance.addNativeCallback(function (msg) {
                    if (msg == "loadGameComplete") {
                        _this.nativeLoadComplete();
                    }
                });
                console.log("开始下载更新");
                NativeController.instance.sendToNative("loadGame");
            };
        };
        // 热更新完成
        _this.nativeLoadComplete = function () {
            console.log("监听到native回调");
            _this.removeLoadingBar();
            _this.tipsPanel.title.text = "更新完成";
            _this.tipsPanel.content.text = "点击确认重新载入";
            _this.tipsPanel.visible = true;
            _this.tipsPanel.confimeCallback = function () {
                console.log("调用native重新加载游戏");
                NativeController.instance.sendToNative("reloadGame");
                window.location.reload();
            };
        };
        _this.LOADING_MAX = 50;
        _this.updateLoadingBar = function () {
            _this.loadingBar.current += 1;
            if (_this.loadingBar.current >= _this.LOADING_MAX) {
                _this.loadingBar.current = 0;
            }
            return true;
        };
        _this.skinName = "skins.LoginPanelSkin";
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAdd, _this);
        _this.GAME_VERSION = RES.getRes("version_json").version;
        return _this;
    }
    BgPanel.prototype.onAdd = function () {
        console.log("showBg");
        // 显示初始化
        this.startButton.iconDisplay.source = "startButton_png";
        this.startButton.labelDisplay.text = "";
        this.startButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startGame, this);
    };
    BgPanel.prototype.notNeedLoad = function () {
        var _this = this;
        this.tipsPanel.visible = true;
        this.tipsPanel.title.text = "成功";
        this.tipsPanel.content.text = "游戏为最新版本，已经进入游戏";
        this.tipsPanel.confimeCallback = function () {
            _this.tipsPanel.visible = false;
        };
    };
    // 显示加载进度条
    BgPanel.prototype.showLoadingBar = function () {
        this.loadingBar.current = 0;
        this.loadingBar.max = this.LOADING_MAX;
        this.loadingBar.visible = true;
        egret.startTick(this.updateLoadingBar, this);
    };
    // 移除加载进度条
    BgPanel.prototype.removeLoadingBar = function () {
        this.loadingBar.visible = false;
        egret.stopTick(this.updateLoadingBar, this);
    };
    return BgPanel;
}(eui.Component));
__reflect(BgPanel.prototype, "BgPanel");
/**
 * 检查游戏版本与网络环境
 */
function checkGameVersion() {
    return new Promise(function (resolve, reject) {
        var url = "https://registry.npm.taobao.org/egret-native-hotfix-server-stub/";
        var httpRequest = new XMLHttpRequest();
        httpRequest.open("GET", url);
        httpRequest.addEventListener("load", function (e) {
            var ioError = (httpRequest.status >= 400);
            if (ioError) {
                console.error("IO错误", httpRequest.status);
                console.error(e);
                reject();
            }
            var version;
            try {
                var content = JSON.parse(httpRequest.responseText);
                for (var key in content.versions) {
                    version = key;
                }
            }
            catch (e) {
                console.error(e);
                version = "0.0.0";
            }
            resolve(version);
        });
        httpRequest.addEventListener("error", function (e) {
            console.error(e);
            reject();
        });
        httpRequest.send();
    });
}
