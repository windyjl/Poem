function Avatar(x,y,imgUrl){
    this.id             = Avatar.prototype.id++;
    this.x              = x || 0;
    this.y              = y || 0;
    this.tempX			= 0;
    this.tempY			= 0;
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
    this.aiType         = 1;
    this.aiProtectTime  = 0;
    this.AngryDirection = null;     // AI参数

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
	this.init();
    //将方块添加到全局变量中
    global.ActorList.push(this);
}
Avatar.prototype.init   = function(){
    this.jq = $("<div id='avatar'></div>");
    this.jq.css("backgroundColor","rgb(255,0,0)");
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

    if (this.imgUrl!=null) {
        this.jq.css({ "background-image":"url("+this.imgUrl+")"
                        ,"background-repeat":"round"})
    };
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
}
Avatar.prototype.RunAi  = function() {
    if (this.aiProtectTime>0) {
        this.aiProtectTime--;
        return;
    };

    if (this.aiType==0) {
        if (getDis(avatar,this)<100) {
            if (avatar.x<this.x) {
                this.movespeed.x = 5;
            }
            else if (avatar.x>this.x) {
                this.movespeed.x = -5;
            };
            if (getDis(avatar,this)<this.width) {
                this.movespeed.x *= 4;
            };
        }
        else if (getDis(avatar,this)>150) {
            this.movespeed.x = 0;
        };
    }
    else if (this.aiType==1 && global.flag.itemID==0) {
        if (getDis(avatar,this)<200&&this.AngryDirection==null) {
            this.AngryDirection = Math.PI/4+Math.random()*Math.PI/2;
        }
        else{
            this.AngryDirection = null;
            // 贱人属性，远了还会靠近
            if (avatar.x<this.x) {
                this.movespeed.x = -4;
            }
            else if (avatar.x>this.x) {
                this.movespeed.x = 4;
            };
            var dis = getDis(avatar,this);
            if (dis<150) {
                this.movespeed.x = 0;
            }
            else if (dis<400) {
                this.movespeed.x /= 2;
            };

        }
    };
}
Avatar.prototype.CheckCollision = function(collider){
    if (collider.x+collider.width>=this.x && collider.x<=this.x+this.width &&
        collider.y+collider.height>=this.y && collider.y<=this.y+this.height)
    {
        if (this.AngryDirection!=null) {
            var speed = 20;
            this.speed.x = Math.cos(this.AngryDirection)*speed;
            this.speed.y = Math.sin(this.AngryDirection)*speed;
            this.AngryDirection = null;
            this.aiProtectTime  = 60;
            this.movespeed.x    = 0;
        };

    }
}
//静态成员变量
Avatar.prototype.id = 0;