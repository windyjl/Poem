function Avatar(x,y,imgUrl,color,aiType){
    this.id             = Avatar.prototype.id++;
    this.x              = x || 0;
    this.y              = y || 0;
    this.color          = color;
    this.width;
    this.height;
    this.speed          = {x:0,y:0};
    this.movespeed      = {x:0,y:0};    // 移动速度，区别于被打飞的speed，在接触地面时不消失
    this.power          = {x:0,y:0};
    this.img			= null;
    this.imgUrl         = imgUrl;
	this.jq			    = null;	//JQ对象
	this.touchX0		= null;	//拖动起点坐标
	this.touchY0		= null;
	this.offx			= 0;
	this.offy			= 0;
    // AI
    this.aiType         = aiType!=null?aiType:0;
    this.aiProtectTime  = 0;
    this.AngryDirection = null;     // AI参数
    this.aiMoveDirection= 0;    //0不动，1向右，-1向左
    this.aiRunChance    = 4;    // 逃离机会总数
    this.aiPatience     = 60*5;
    // 灵魂
    this.ghost          = null;     // $对象，一个表示对方真实想法的图像
    this.gPos           = {x:0,y:0};
    this.gStep          = 0;        // 计数器
    // 气泡对话
    this.bubble         = null;
	// 逻辑变量
	this.isOnAssociable = false;	// 不在指定关系层级范围内的想法 不显示
	this.isOnScreen		= false;	// 离开屏幕范围的相符 不绘制
	this.isCompelete	= false;    // 想法是否已经完成
	this.isClick        = true;     // 区别鼠标“拖动”操作和“点击”的操作
	this.isMouseOver	= false;	//鼠标悬停
	this.isDeleteable	= false;
	
	this.sdi = 
	{
		level:0
	};
	//测试用变量
	this.startTime		= new Date().getTime();
	this.timecount;
	this.flashtest={
		point:[],
		width:[]
	};
    //将方块添加到全局变量中
    global.ActorList.push(this);
}
Avatar.prototype.init   = function(){
    this.jq = $("<div id='avatar'></div>");
    var color = this.color;
    if (color==null) {
        color = "rgb(255,0,0)"
    };
    if (this.imgUrl==null) {
        this.jq.css("backgroundColor",color);
    };
    
    this.jq.css({
        width:"50px",
        height:"50px",
        top:0,
        left:0,
        position:"absolute"
    });
    this.width = this.jq.width();
    this.height = this.jq.height();
    this.jq.appendTo($("#divmap"));
    this.jq.object = this;
    this.jq[0].object = this;
    // 角色图像
    if (this.imgUrl!=null) {
        this.jq.css({ "background-image":"url("+this.imgUrl+")"
                        ,"background-repeat":"round"})
    };
    // 角色灵魂
    this.ghost = $("<div class='ghost'></div>");
    this.ghost.css("backgroundColor","rgba(255,255,255,0.2)");
    this.ghost.css({
        width:"50px",
        height:"50px",
        top:0,
        left:0,
        position:"absolute"
    });
    this.ghost.hide();
    if (this!=avatar) {
        this.setExpression("peace");  // "angry"        
    };
    this.gPos.x = this.x;
    this.gPos.y = this.y;
    this.ghost.appendTo(this.jq);
    // 对话气泡
    this.bubble = $("<div class='bubble'></div>");
    this.bubble.css("backgroundColor","rgba(255,255,255,0.2)");
    this.bubble.css({
            width:"200px",
            // height:"50px",
        top:0,
        left:0,
        position:"absolute"
    });
    this.bubble.hide();
    this.bubble.appendTo(this.jq);
    // this.img = $("<img></img>");
    // this.img.addClass("unselectable");
    // this.img.css({
    //     width:"100%",
    //     height:"100%",
    //     top:0,
    //     left:0,
    //     position:"absolute"
    // });
    // this.img.appendTo(this.jq);
 //    $(jq).addClass('fish');
 //    $(jq).appendTo('div#fish-area');
 //    //$(jq).css({'transition-duration':'500ms'});
 //    this.img = new Image(); //创建一个Image对象，实现图片的预下载  
	// this.img.src = 'Image/fish01.png';  
 //    this.img.object = this;
 //    var fishtag = jq;
 //    this.img.onload = function(){
 //        this.object.width = this.width;
 //        this.object.height = this.height;
 //        $(this).addClass('unselectable fish-img');
 //        $(fishtag).append(this);
 //    }
    // this.sdi.level = parseInt(Math.random()*5) + 1;
    // this.locateCSS();
    // $(jq).css('background-image','url(Image/fish01.png)');
    //调整大小
    // $(jq).height( 200);
    // $(jq).width( 200);
}
Avatar.prototype.distroy = function() {
    this.jq.remove();
    this.ghost.remove();
    for (var i = global.ActorList.length - 1; i >= 0; i--) {
        if (global.ActorList[i] == this)
            global.ActorList.splice(i,1);
    };
};
// 操作-跳
Avatar.prototype.ActionJump = function(){
    if (global.jumpTime>0 && !global.storyMode){
        this.speed.y   = global.jumpSpeed;
        global.jumpTime --;
    }
}
Avatar.prototype.locateCSS = function(){
    // $(jq).offset({
    // 	left:this.tempX - $(this.img).width()/2,
    // 	top:this.tempY - $(this.img).height()/2
    // })

    //CSS坐标转换
    var offset = this.jq.position();
    var cssX,cssY;
    cssX = this.x;
    cssY = global.SCREEN_HEIGHT - this.y - this.height;
    if (cssX!=parseInt(offset.left) || cssY!=parseInt(offset.top)) {
        this.jq.css({left:cssX,top:cssY});
    };
    // ghost 
    // if (global.flag.itemID==0 && this!=avatar) {
    //     this.ghost.show();
    // }
    // else{
    //     this.ghost.hide();
    // }
    var rad = this.gStep%120/60*Math.PI;
    var dis = getDis(avatar,this);
    var shake = {x:0,y:0};
    if (/*this.aiType==1&&*/this.AngryDirection!=null) {
        rad = this.AngryDirection;
        if (this.aiType==0 && dis<50+this.width) {
            shake.x = parseInt(Math.random()*5);
            shake.y = parseInt(Math.random()*5);
        };
    };
    var radius = 30;
    if (dis<200 && this.gState == "Excited") {
        radius += (200 - dis)/2;
    };
    this.gStep++;
    this.gPos.x = Math.cos(rad)*radius;
    this.gPos.y = -Math.sin(rad)*radius - 50;
    this.gPos.x += shake.x;
    this.gPos.y += shake.y;
    this.ghost.css({left:this.gPos.x,top:this.gPos.y});
    // 气泡定位

    this.bubble.css({
        left:(this.width - this.bubble.width())/2,
        top:-50
    })
}
Avatar.prototype.showWords = function(str) {
    this.bubble.html(str);
    this.bubble.show();
};
Avatar.prototype.RunAi  = function() {
    if (this.aiProtectTime>0) {
        this.aiProtectTime--;
        return;
    };
    if (this==avatar) {
        // 主角在热水中
        if (global.chapter!=0) {return};
        var _poem = getPoem("水已经发烫</br>不能再呆下去了</br>");
        if (_poem.y+_poem.height>this.y) {
            this.ActionJump();
        };
    }
    else if (this.aiType==0) {   // 害羞逃离，多次后跟随
        /*
        有限的转向次数，来回多次后不再移动
        靠近时害羞表情抖动
        一段时间后编程爱心
        */
        if (this.aiRunChance>0) {
            // 逃跑阶段
            if (getDis(avatar,this)<150) {
                this.setExpression("Shame");
                if (avatar.x<this.x) {
                    this.movespeed.x = 1;
                    if (this.aiMoveDirection==0||this.aiMoveDirection==-1) {
                        this.aiRunChance --;
                        this.aiMoveDirection = 1;
                    };
                }
                else if (avatar.x>this.x) {
                    this.movespeed.x = -1;
                    if (this.aiMoveDirection==0||this.aiMoveDirection==1) {
                        this.aiRunChance --;
                        this.aiMoveDirection = -1;
                    };
                };
                // if (Math.abs(avatar.x-this.x)<this.width) {
                //     this.movespeed.x *= 4;
                // };
                if (getDis(avatar,this)<100) {
                    this.movespeed.x *= 2.5;
                };
            }
            else if (getDis(avatar,this)>150) {
                // this.setExpression("peace");
                this.hideExpression();
                this.movespeed.x = 0;
            };
        }
        else if (this.aiPatience>0) {
            this.movespeed.x = 0;
            this.setExpression("Shame");
            if (getDis(avatar,this)<50+this.width) {
                this.aiPatience--;  // 靠近时，消耗耐久
            };
            if (this.AngryDirection==null) {
                this.AngryDirection = Math.PI*0.25+Math.random()*Math.PI*0.5;
            };
            // 去完成表情抖动
        }
        else{
            this.setExpression("Heart");
            this.AngryDirection=null
            // 伙伴属性，远了还会靠近
            if (avatar.x<this.x) {
                this.movespeed.x = -2.5;
            }
            else if (avatar.x>this.x) {
                this.movespeed.x = 2.5;
            };
            var dis = getDis(avatar,this);
            if (Math.abs(avatar.x-this.x)<75) {    // 最亲近距离
                this.movespeed.x = 0;
            }
            else{
                this.movespeed.x *= 2;
            }
        }
    }
    else if (this.aiType==1) {  //套乱
        if (getDis(avatar,this)<200) {  //烟雾距离
            this.setExpression("Excited");
            if (this.AngryDirection==null) {
                this.AngryDirection = Math.PI*0.25+Math.random()*Math.PI*0.5;
            };
        }
        else{
            this.setExpression("peace");
            this.AngryDirection = null;
        }
        // 贱人属性，远了还会靠近
        if (avatar.x<this.x) {
            this.movespeed.x = -4;
        }
        else if (avatar.x>this.x) {
            this.movespeed.x = 4;
        };
        var dis = getDis(avatar,this);
        if (Math.abs(avatar.x-this.x)<250 || dis>500) {    // 保持距离
            this.movespeed.x = 0;
        }
        else if (dis<400) {                     // 减速距离
            this.movespeed.x /= 2;
        };
    }
    else if (this.aiType==2) {  //直接跟随
        if (this.aiPatience>0) {
            if (getDis(this,avatar)<this.width && global.flag.itemID == 0) {    // 拿着肥皂来的
                this.aiPatience = 0;
                this.setExpression("Soap_1");
                global.storySchedule = 1;
            };
            return;
        };
        // 伙伴属性，远了还会靠近
        if (avatar.x<this.x) {
            this.movespeed.x = -2.5;
        }
        else if (avatar.x>this.x) {
            this.movespeed.x = 2.5;
        };
        var dis = getDis(avatar,this);
        if (Math.abs(avatar.x-this.x)<150) {    // 好友距离
            this.movespeed.x = 0;
        }
        else{
            this.movespeed.x *= 2;
        }
    };
}
Avatar.prototype.CheckCollision = function(collider){
    if (collider.x+collider.width>=this.x && collider.x<=this.x+this.width &&
        collider.y+collider.height>=this.y && collider.y<=this.y+this.height)
    {
        if (this.AngryDirection!=null && this.aiType == 1) {
            this.setExpression("boom");
            var speed = 20;
            this.speed.x = Math.cos(this.AngryDirection)*speed;
            this.speed.y = Math.sin(this.AngryDirection)*speed;
            this.AngryDirection = null;
            this.aiProtectTime  = 60;
            this.movespeed.x    = 0;
        };
        if (this.aiType==2) {
            this.showWords("嘿！快丢肥皂给我!");
        }
        else if (this.aiType==1) {
            this.showWords("伊——哈——");
        }
        else if (this.aiType==0) {
            this.showWords("雅蠛蝶");
        }
    }
    else {
        this.bubble.hide();
    }
}
Avatar.prototype.setExpression = function(ExpName) {
    if (this.gState!=ExpName)
        this.ghost.css({"background-image":"url(Image/"+ExpName+".png)"
                        ,"background-repeat":"round"
                        ,"backgroundColor":"rgba(255,255,255,0.0)"});
    this.gState = ExpName;
    this.ghost.show();
};
Avatar.prototype.hideExpression = function(ExpName) {
    if (this.gState!=null){
        this.ghost.hide();
        this.gState = null;
    }
};

//静态成员变量
Avatar.prototype.id = 0;