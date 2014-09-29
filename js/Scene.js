/*
以画面左下角为0,0
*/

function Scene(name){
    this.width;
    this.height;
	this.offx			 = 0;
	this.offy			 = 0;
}
Scene.prototype.init    = function(){
    //生成地形
    for (var i = 0; i < this.level.length; i++) {
        new Block(this.level[i][0],this.level[i][1],this.level[i][2],this.level[i][3]);
    };
    //初始化剧情点
    for (var i = 0; i < this.ColorPoint.length; i++) {
        // var div = $("<div class='poemtext'>"+this.ColorPoint[i].ps+"</div>");
        // div.addClass("unselectable");
        // //div.css("backgroundColor","rgb(0,0,0)");
        // div.css({
        //     position:"absolute",
        //     top:100
        // });
        // div.appendTo($("body"));  
        // div.css({
        //     left:(global.SCREEN_WIDTH - div.width())/2
        // })
        // this.ColorPoint[i].div = div;
        // div.hide();
        var poemData = this.ColorPoint[i];
        new PoemBlock(poemData.x,poemData.y,poemData.width,poemData.height,poemData.ps);
    };
    // var div = $(".poemtext");
    // if (div.length==0) {
    //     div = $("<div class='poemtext'>/div>");
    //     div.addClass("unselectable");
    //     //div.css("backgroundColor","rgb(0,0,0)");
    //     div.css({
    //         position:"relative",
    //         top:300
    //     });
    //     div.appendTo($("body"));  
    // }
}
//静态成员变量
Scene.prototype.id = 0;
Scene.prototype.ColorPoint = 
[{div:null,x:200,y:25,width:50,height:25,hue:0,ps:"草泥马奶子"},
{div:null,x:400,y:25,width:50,height:25,hue:0,ps:"野凤不亡，欲火还阳。 </br>涅磐避事，圣世空翔。 </br>凤兮凤兮，唯能呈祥？ </br>孤龙泣血，难挽狂澜。 </br>尘怨未了，忍顾仰望。 </br>雾笼铁幕，假戏皮相。 </br>剑已出鞘，戰鳳脫繮。 </br>洞析天下，青天一闯。 </br>"}]
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
    this.ps             = null; //诗句
    this.init();
    //将想法添加到全局变量中
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
    this.jq.offset({left:cssX,top:cssY});
    // this.jq.offset({left:this.x,bottom:this.y});不支持bottom
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
function PoemBlock(x,y,width,height,ps){
    this.id             = PoemBlock.prototype.id++;
    this.x              = x;
    this.y              = y;
    this.width          = width;
    this.height         = height;
    this.ps             = ps;
    this.jq             = null;
    this.init();
    //将想法添加到全局变量中
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
    this.jq.offset({left:cssX,top:cssY});
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
    if (collider.x+collider.width>=this.x && collider.x<=this.x+this.width &&
    collider.y+collider.height>=this.y && collider.y<=this.y+this.height)
    {
        console.log("碰到的诗句是:"+this.ps);
    }
}
//静态成员变量
PoemBlock.prototype.id = 0;

//其他方法
function showPoem(){
    var index = global.poemPoint;
    if (index == global.poemPointBre) return;
    if (index>=0) {
        var div = scene.ColorPoint[index].div;
        div.fadeIn({duration:1000,queue:false});
    };
    if (global.poemPointBre>=0) {
        var divPre = scene.ColorPoint[global.poemPointBre].div;
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