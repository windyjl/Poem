/*
以画面左下角为0,0
*/
function Scene(name){
    this.width          = 0;
    this.height         = 0;
	this.offx			= 0;
	this.offy			= 0;
}
Scene.prototype.init    = function(){
    //生成地形
    for (var i = 0; i < this.level.length; i++) {
        var b = new Block(this.level[i][0],this.level[i][1],this.level[i][2],this.level[i][3]);
        // 记录地图大小
        if (b.x+b.width>this.width) {
            this.width = b.x+b.width;
        };
        if (b.y>this.height-global.SCREEN_HEIGHT/2) {
            this.height = b.x+global.SCREEN_HEIGHT/2;
        };
    };
    global.divmap.css({
        width:this.width,
        height:this.height
    });
    // 初始化剧情点
    for (var i = 0; i < this.ColorPoint.length; i++) {
        var poemData = this.ColorPoint[i];
        new PoemBlock(poemData.x,poemData.y,poemData.width,poemData.height,poemData.hue,poemData.ps);
    };
    // 初始化事件点
    new EventBlock(600,50,50,25,EventBlock.prototype.JUDGETYPE.GETIN,0,function(){alert("你特么踩到我了!")} );
}
//静态成员变量
Scene.prototype.id = 0;
Scene.prototype.ColorPoint = 
[{div:null,x:200,y:50,width:50,height:25,hue:0,ps:"←→|AD移动"},
{div:null,x:400,y:50,width:50,height:25,hue:0,ps:"↑|W跳跃</br>"}]
Scene.prototype.level = [
[0,0,1925,50],
[0,50,25,695],
[150,125,125,25],
[375,225,125,25]];
//地形方块
function Block(x,y,width,height){
    this.id             = Block.prototype.id++;
    this.x              = x;
    this.y              = y;
    this.width          = width;
    this.height         = height;
    this.div            = null; //$对象
    this.init();
    //将方块添加到全局变量中
    global.BlockList.push(this);
}
Block.prototype.init    = function(){
    //初始化碰撞方块显示
    this.jq = $("<div class='block'></div>");
    this.jq.css("backgroundColor","rgb(0,0,0)");
    this.jq.css({
        width:this.width+"px",
        height:this.height+"px",
        position:"absolute"
    });
    this.jq.appendTo($("#divmap"));
    this.jq.object = this;
    this.jq[0].object = this;
    this.locateCSS();
}
Block.prototype.locateCSS = function(){
    //CSS坐标转换
    var cssX,cssY;
    cssX = this.x;
    cssY = global.SCREEN_HEIGHT - this.y - this.height;
    this.jq.css({left:cssX,top:cssY});
    // this.jq.position({left:this.x,bottom:this.y});不支持bottom
}
Block.prototype.CheckCollision = function(coliider){
    var isOutOfY = false;
    var isOutOfX = false;
    var isStand  = coliider.y==this.y+this.height;//主角是否踩着方块
    if (isStand) {
        global.jumpTime = global.jumpTimeLimit;//恢复跳跃机会
        if (global.btnUp==true) {
            avatar.speed.y   = global.jumpSpeed;
            global.jumpTime --;
        };
    }
    //主角在方块上方或下放
    if (coliider.y>=this.y+this.height || coliider.y+coliider.height<this.y) isOutOfY = true;
    //主角在方块左侧或右侧
    if (coliider.x>=this.x+this.width || coliider.x+coliider.width<=this.x) isOutOfX=true;
    if (coliider.x+coliider.speed.x+coliider.width>this.x && coliider.x+coliider.speed.x<this.x+this.width &&
        coliider.y+coliider.speed.y+coliider.height>this.y && coliider.y+coliider.speed.y<this.y+this.height)
    {
        if (isOutOfY==false) {
            if (coliider.speed.x>0){
                coliider.speed.x  = 0;
                coliider.x        = this.x-coliider.width;
            }
            else if (coliider.speed.x<0)
            {
                coliider.speed.x  = 0;
                coliider.x        = this.x+this.width;   
            }
        };
        if (isOutOfX==false) {
            if (coliider.speed.y>0){
                coliider.speed.y  = 0;
                coliider.y        = this.y-coliider.height;
            }
            else if (coliider.speed.y<0)
            {
                coliider.speed.y  = 0;
                coliider.y        = this.y+this.height;   
            }
        };
    }
}
//静态成员变量
Block.prototype.id = 0;

//诗方块
function PoemBlock(x,y,width,height,hue,ps){
    this.id             = PoemBlock.prototype.id++;
    this.x              = x;
    this.y              = y;
    this.width          = width;
    this.height         = height;
    this.hue            = hue;      //色相
    this.ps             = ps;       //诗句
    this.jq             = null;
    this.isActive       = false;
    this.init();
    //将方块添加到全局变量中
    global.BlockList.push(this);
}
PoemBlock.prototype.init    = function(){
    //初始化碰撞方块显示
    this.jq = $("<div class='poemblock'></div>");
    this.jq.css("backgroundColor","rgba(255,150,0,0.2)");
    this.jq.css({
        width:this.width+"px",
        height:this.height+"px",
        position:"absolute"
    });
    this.jq.appendTo($("#divmap"));
    this.jq.object = this;
    this.jq[0].object = this;
    // 初始化诗句显示
    var div = $("<div class='poemtext'>"+this.ps+"</div>");
    div.addClass("unselectable");
    //div.css("backgroundColor","rgb(0,0,0)");
    div.css({
        position:"absolute",
        top:100
    });
    div.appendTo($("body"));  
    div.css({
        left:(global.SCREEN_WIDTH - div.width())/2
    })
    this.div = div;
    div.hide();
    // 初始化结束
    this.locateCSS();
}
PoemBlock.prototype.locateCSS = function(){
    //CSS坐标转换
    var cssX,cssY;
    cssX = this.x;
    cssY = global.SCREEN_HEIGHT - this.y - this.height;
    this.jq.css({left:cssX,top:cssY});
}
/*
    collider主动碰撞者
*/
PoemBlock.prototype.CheckCollision = function(collider){
    // var index = -1;
    // for (var i = scene.ColorPoint.length - 1; i >= 0; i--) {
    //     if (avatar.x>=scene.ColorPoint[i].x && avatar.x<=scene.ColorPoint[i].x+scene.ColorPoint[i].width)
    //         index = i;
    // };
    // global.poemPoint = index;
    if (global.poemPointIndex) {return};
    // else if (this.isActive) {return};
    if (collider.x+collider.width>=this.x && collider.x<=this.x+this.width &&
    collider.y+collider.height>=this.y && collider.y<=this.y+this.height)
    {
        global.poemPointIndex = true;           // 传出已碰撞，避免同一个点有两个poemblock导致无限切换
        this.isActive = true;
        if (global.poemPoint==this) {return};//避免重复赋值
        console.log("碰到的诗句是:"+this.ps);
        global.poemPointPre = global.poemPoint;
        global.poemPoint = this;
        // 显示诗句
        this.div.css({opacity:1});
        this.div.fadeIn({duration:1000,queue:false});
    }
    else{
        this.isActive = false;
    }
}
//静态成员变量
PoemBlock.prototype.id = 0;

//事件方块
function EventBlock(x,y,width,height,judgeType,judgeArg,callback){
    this.id             = EventBlock.prototype.id++;
    this.x              = x;
    this.y              = y;
    this.width          = width;
    this.height         = height;
    this.div            = null; //$对象
    //事件判断（方块事件）
    this.isBlockActive       = false;
    this.intersectTime  = 0;        // 额外，相交时间判断
    this.intersectCountType = 0;    // 额外，相交时间累积方式（单次？累积？）
    //事件判断（callback触发）
    this.onlyOnce       = true;    // 是否单发
    this.isRun          = false;    // 是否已发,脚本只激活为isRun为false的事件，onlyOnce决定了是否重置isRun
    this.judgeType      = judgeType;
    this.judgeArg       = judgeArg;
    this.callback       = callback;
    this.init();
    // 方块列表
    global.BlockList.push(this);
    // 事件列表
    global.EventList.push(this);
}
EventBlock.prototype.init    = function(){
    //初始化碰撞方块显示
    this.jq = $("<div class='block'></div>");
    this.jq.css("backgroundColor","rgba(0,0,255,0.2)");
    this.jq.css({
        width:this.width+"px",
        height:this.height+"px",
        position:"absolute"
    });
    this.jq.appendTo($("#divmap"));
    this.jq.object = this;
    this.jq[0].object = this;
    this.locateCSS();
}
EventBlock.prototype.locateCSS = function(){
    //CSS坐标转换
    var cssX,cssY;
    cssX = this.x;
    cssY = global.SCREEN_HEIGHT - this.y - this.height;
    this.jq.css({left:cssX,top:cssY});
    // this.jq.position({left:this.x,bottom:this.y});不支持bottom
}
// 判断事件条件是否达成
EventBlock.prototype.JUDGETYPE = {
    GETIN:0,    // 进入时成功
    STAY:1,     // 停留一段时间
    LEAVE:2,    // 离开时
    LEAVEAFTER:3// 离开后一段时间
}
EventBlock.prototype.CheckEvent = function(){
    if (this.isRun) {return};
    switch(this.judgeType){
    case this.JUDGETYPE.GETIN:
        if (this.isBlockActive) {
            return true;
        };
        break;
    case this.JUDGETYPE.STAY:
        return false;
        break;
    case this.JUDGETYPE.LEAVE:
        return false;
        break;
    case this.JUDGETYPE.LEAVEAFTER:
        return false;
        break;
    }
}
EventBlock.prototype.CheckCollision = function(collider){
    //
    if (collider.x+collider.width>=this.x && collider.x<=this.x+this.width &&
    collider.y+collider.height>=this.y && collider.y<=this.y+this.height)
    {
        if (!this.isBlockActive) {
            this.isBlockActive = true;
            console.log("哎哟，我被发现了");
        }
    }
    else{
        this.isBlockActive = false;
        if (!this.onlyOnce) {
            this.isRun = false;
        };
    }
    return this.isBlockActive;
}
//静态成员变量
EventBlock.prototype.id = 0;
//其他方法
function showPoem(){
    var index = global.poemPoint;
    if (index == global.poemPointPre) return;
    if (index>=0) {
        var div = scene.ColorPoint[index].div;
        div.fadeIn({duration:1000,queue:false});
    };
    if (global.poemPointPre>=0) {
        var divPre = scene.ColorPoint[global.poemPointPre].div;
        divPre.fadeOut({duration:400,queue:false});  
    };
}
function checkPoemPoint(){
    var index = -1;
    for (var i = scene.ColorPoint.length - 1; i >= 0; i--) {
        if (avatar.x>=scene.ColorPoint[i].x && avatar.x<=scene.ColorPoint[i].x+scene.ColorPoint[i].width)
            index = i;
    };
    global.poemPoint = index;
}