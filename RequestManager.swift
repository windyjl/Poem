//
//  RequestManager.swift
//  DouBanWithlRC
//
//  Created by NOMIS on 9/20/14.
//  Copyright (c) 2014 NOMIS. All rights reserved.
//

import UIKit

let APP_HOST = "http://www.douban.com/j"




enum RequestMethod : String{
    case doLogin = "/app/login"
    case doGetChannels = "/app/radio/channels"
    case doGetRadioList = "/app/radio/people"
}
class RequestManager:NSObject{
    
    class func doLogin(){
        Utility.doRequest(RequestType.POST, url: "http://www.douban.com/j/app/login") { (responseObject) -> Void in
            
        }
        
    }
    class func doGetChannels(){}
    class func doGetRadioList(){}


}
    