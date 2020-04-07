#import "AppDelegate.h"
#import "ViewController.h"
#import <EgretNativeIOS.h>
#import "ZipArchive.h"

@implementation AppDelegate {
    EgretNativeIOS* _native;
}

NSString* _gameUrl = @"http://game.com/game/index.html";
NSString* _zipUrl = @"https://test123.egret.com/native_sanguo3/sanguo_game/sanguo_game.zip";
NSString* _preloadPath = @"/sdcard/egretGame/";




- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    NSString* gameUrl = @"http://tool.egret-labs.org/Weiduan/game/index.html";
    
    _native = [[EgretNativeIOS alloc] init];
    _native.config.showFPS = true;
    _native.config.fpsLogTime = 30;
    _native.config.disableNativeRender = false;
    _native.config.clearCache = false;
    
    
    UIViewController* viewController = [[ViewController alloc] initWithEAGLView:[_native createEAGLView]];
    if (![_native initWithViewController:viewController]) {
        return false;
    }
    [self setExternalInterfaces];
    
    NSString* networkState = [_native getNetworkState];
    if ([networkState isEqualToString:@"NotReachable"]) {
        NSLog(@"Network disconnection");
        __block EgretNativeIOS* native = _native;
        [_native setNetworkStatusChangeCallback:^(NSString* state) {
            NSLog(@"setNetworkStatusChangeCallback:%@",state);
            if (![state isEqualToString:@"NotReachable"]) {
                NSLog(@"Network reconnection");
                dispatch_async(dispatch_get_main_queue(), ^{
                    [native startGame:_gameUrl];
                });
            }
        }];
    }
    
    
    NSArray* paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString* docDir = [paths objectAtIndex:0];
    
    _preloadPath = [docDir stringByAppendingString:_preloadPath];
    _native.config.preloadPath = _preloadPath;
    
    NSLog(@"normalGame:%@",_gameUrl);
    [_native startGame:_gameUrl];
    
    return true;
}

- (void)applicationWillResignActive:(UIApplication *)application {
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    
    [_native pause];
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
    
    [_native resume];
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application {
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    // Saves changes in the application's managed object context before the application terminates.
}

- (void)setExternalInterfaces {
    __block EgretNativeIOS* support = _native;
    [_native setExternalInterface:@"sendToNative" Callback:^(NSString* message) {
        NSString* str = @"Native get message: ";
        str = [str stringByAppendingString:message];
        NSLog(@"%@", str);
        [support callExternalInterface:@"sendToJS" Value:str];
        // 加载游戏
        if([message isEqualToString:@"loadGame"]){
            [self loadGameRes];
        }
    }];
}



- (void)loadGameRes {
//    [_gameBtn setEnabled:false];
    
    NSURLSession* session = [NSURLSession sharedSession];
    NSURL* url = [NSURL URLWithString:_zipUrl];
    NSMutableURLRequest* request = [NSMutableURLRequest requestWithURL:url];
    request.timeoutInterval = 10.0;
    request.HTTPMethod = @"GET";
    
    NSURLSessionDownloadTask* task = [session downloadTaskWithRequest:request
                                                    completionHandler:^(NSURL* location, NSURLResponse* response, NSError* error) {
                                                        if (error != nil) {
                                                            NSLog(@"ERROR: %@", [error localizedDescription]);
                                                            return;
                                                        }
                                                        
                                                        NSError* err;
                                                        NSString* dir = [_preloadPath stringByAppendingString:[AppDelegate getFileDirByUrl:_gameUrl]];
                                                        NSLog(@"taskPath:%@",dir);
                                                        [[NSFileManager defaultManager] createDirectoryAtPath:dir
                                                                                  withIntermediateDirectories:YES
                                                                                                   attributes:nil
                                                                                                        error:&err];
                                                        if (err != nil) {
                                                            NSLog(@"ERROR: create parent file failed: %@", dir);
                                                            NSLog(@"err: %@", [err localizedDescription]);
//                                                            return;
                                                        }
                                                        
                                                        NSString* zipFilePath = [dir stringByAppendingString:@"temp.zip"];
                                                        [[NSFileManager defaultManager] moveItemAtPath:location.path
                                                                                                toPath:zipFilePath
                                                                                                 error:&err];
                                                        if (err != nil) {
                                                            NSLog(@"ERROR: create file failed: %@", zipFilePath);
                                                            NSLog(@"err: %@", [err localizedDescription]);
                                                            return;
                                                        }
                                                        
                                                        ZipArchive* zip = [[ZipArchive alloc] init];
                                                        if (![zip UnzipOpenFile:zipFilePath]) {
                                                            NSLog(@"ERROR: failed to open zip file");
                                                            return;
                                                        }
                                                        bool result = [zip UnzipFileTo:dir overWrite:YES];
                                                        if (!result) {
                                                            NSLog(@"ERROR: failed to unzip files");
                                                            return;
                                                        }
                                                        [zip UnzipCloseFile];
                                                        [[NSFileManager defaultManager] removeItemAtPath:zipFilePath error:nil];
                                                        
                                                        
                                                        
                                                        
                                                        dispatch_async(dispatch_get_main_queue(), ^{
//                                                            [_gameBtn setEnabled:true];
                                                            [_native callExternalInterface:@"sendToJS" Value:@"loadGameComplete"];
                                                            // 去新的游戏目录
                                                        });
                                                    }];
    [task resume];
}


+ (NSString*)getFileDirByUrl:(NSString*)urlString {
    int lastSlash = [urlString rangeOfString:@"/" options:NSBackwardsSearch].location;
    NSString* server = [urlString substringToIndex:lastSlash + 1];
    server = [server stringByReplacingOccurrencesOfString:@"://" withString:@"/"];
    server = [server stringByReplacingOccurrencesOfString:@":" withString:@"#0A"];
    return server;
}

- (void)dealloc {
    [_native destroy];
}

@end
