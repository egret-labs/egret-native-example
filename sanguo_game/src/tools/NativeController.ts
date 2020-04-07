class NativeController {
    private static _instance: NativeController;
    static get instance() {
        if (!this._instance) {
            this._instance = new NativeController();
        }
        return this._instance;
    }


    constructor() {
        egret.ExternalInterface.addCallback("sendToJS", (msg) => {
            console.log(msg);
            for (let callbackFunc of this.callbackList) {
                callbackFunc(msg);
            }
        });
    }


    public callbackList: ((msg) => void)[] = [];

    public addNativeCallback(callback: (msg) => void) {
        this.callbackList.push(callback);
    }

    sendToNative(message: string) {
        egret.ExternalInterface.call("sendToNative", message); "message from JS"
    }
}