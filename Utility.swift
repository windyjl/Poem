//
//  Utility.swift
//  DouBanWithlRC
//
//  Created by NOMIS on 9/22/14.
//  Copyright (c) 2014 NOMIS. All rights reserved.
//

import UIKit
enum RequestType{
    case POST
    case GET
    case PUT
    case DELETE
}

class Utility: NSObject {
    
    class func showToast(str:String){
        DPToastView.makeToast(str, gravity: DPToastGravityCenter, duration: 5.0).show()
    }
    
    class func showNotificationWithError(str:String){
        TWMessageBarManager.sharedInstance().showMessageWithTitle("error", description: str, type: TWMessageBarMessageTypeError)
    }
    
    class func doRequest(method:RequestType , url:String , returnData:(responseObject:AnyObject!) -> Void){
        var manager:AFHTTPSessionManager = AFHTTPSessionManager()
        
        func success(dataTask:NSURLSessionDataTask! , responseObject:AnyObject!) -> Void {
            returnData(responseObject: responseObject)
        }
        func failure(dataTask:NSURLSessionDataTask!, error:AnyObject!) -> Void{
            Utility.showNotificationWithError("\(error)")
        }
        switch method{
        case RequestType.POST : manager.POST(url, parameters: nil, success: success, failure: failure); break
        case RequestType.GET : manager.GET(url, parameters: nil, success: success, failure:failure);break
        case RequestType.PUT : manager.PUT(url, parameters: nil, success: success, failure: failure);break
        case RequestType.DELETE : manager.DELETE(url, parameters: nil, success: success, failure: failure);break
        }
    }
}
