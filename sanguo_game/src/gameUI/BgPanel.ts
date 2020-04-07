/**
 * 模拟当前游戏版本
 */

class BgPanel extends eui.Component {

    constructor() {
        super();
        this.skinName = "skins.LoginPanelSkin";
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAdd, this);
        this.GAME_VERSION = RES.getRes("version_json").version;
    }

    private GAME_VERSION = "0.9.0";

    public loadingBar: LoadingBar;

    public bg: eui.Image;

    public startButton: eui.Button;

    public tipsPanel: TipsPanel;

    public onAdd() {
        console.log("showBg");


        // 显示初始化
        this.startButton.iconDisplay.source = "startButton_png"
        this.startButton.labelDisplay.text = "";
        this.startButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startGame, this);
    }

    private hasStart: boolean = false;

    /**
     * 模拟开始游戏
     */
    private startGame = () => {
        if (this.hasStart) {
            // 防止连续调用
            return;
        }
        // 网络版本号检查

        this.startButton.visible = false;
        this.hasStart = true;

        return checkGameVersion().then((version: string) => {
            console.log("获取的版本号:", version);
            console.log("GAME_VERSION", this.GAME_VERSION);
            if (this.GAME_VERSION < version) {
                this.needLoadNew();
            } else {
                this.notNeedLoad();
            }
        }).catch(() => {
            // this.startGameCallback(false)
            this.netWorkdDisconnect();
        })
    }

    private netWorkdDisconnect = () => {
        this.tipsPanel.visible = true;
        this.tipsPanel.title.text = "网络连接断开";
        this.tipsPanel.content.text = "网络连接已断开，请再试一次";
        this.hasStart = false;
        this.tipsPanel.confimeCallback = () => {
            this.tipsPanel.visible = false;
            this.startGame();
        }
    }


    private needLoadNew = () => {
        this.tipsPanel.visible = true;
        this.tipsPanel.title.text = "检查到新版本";
        this.tipsPanel.content.text = "需要更新到新版本\n更新成功后将重启游戏";
        this.tipsPanel.confimeCallback = () => {
            this.tipsPanel.visible = false;
            this.showLoadingBar();
            NativeController.instance.addNativeCallback((msg) => {
                if (msg == "loadGameComplete") {
                    this.nativeLoadComplete();
                }
            });
            console.log("开始下载更新");
            NativeController.instance.sendToNative("loadGame");
        }
    }

    private notNeedLoad() {
        this.tipsPanel.visible = true;
        this.tipsPanel.title.text = "成功";
        this.tipsPanel.content.text = "游戏为最新版本，已经进入游戏";
        this.tipsPanel.confimeCallback = () => {
            this.tipsPanel.visible = false;
        }
    }

    // 热更新完成
    private nativeLoadComplete = () => {
        console.log("监听到native回调");
        this.removeLoadingBar();
        this.tipsPanel.title.text = "更新完成";
        this.tipsPanel.content.text = "点击确认重新载入";
        this.tipsPanel.visible = true;
        this.tipsPanel.confimeCallback = () => {
            console.log("调用native重新加载游戏");
            NativeController.instance.sendToNative("reloadGame");
            window.location.reload();
        }
    }


    private LOADING_MAX = 50;

    // 显示加载进度条
    public showLoadingBar() {
        this.loadingBar.current = 0;
        this.loadingBar.max = this.LOADING_MAX;
        this.loadingBar.visible = true;
        egret.startTick(this.updateLoadingBar, this);
    }

    // 移除加载进度条
    public removeLoadingBar() {
        this.loadingBar.visible = false;
        egret.stopTick(this.updateLoadingBar, this);
    }

    private updateLoadingBar = () => {
        this.loadingBar.current += 1;
        if (this.loadingBar.current >= this.LOADING_MAX) {
            this.loadingBar.current = 0;
        }
        return true;
    }
}

/**
 * 检查游戏版本与网络环境
 */
function checkGameVersion() {
    return new Promise((resolve, reject) => {
        const url = "https://registry.npm.taobao.org/egret-native-hotfix-server-stub/";
        const httpRequest = new XMLHttpRequest();
        httpRequest.open("GET", url);
        httpRequest.addEventListener("load", (e) => {
            const ioError = (httpRequest.status >= 400);
            if (ioError) {
                console.error("IO错误", httpRequest.status);
                console.error(e);
                reject();
            }
            let version: any;
            try {

                const content = JSON.parse(httpRequest.responseText);
                for (const key in content.versions) {
                    version = key;
                }
            } catch (e) {
                console.error(e);
                version = "0.0.0";
            }
            resolve(version);
        });
        httpRequest.addEventListener("error", (e) => {
            console.error(e);
            reject();
        });
        httpRequest.send();
    });
}