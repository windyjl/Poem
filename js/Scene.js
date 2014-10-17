/*
以画面左下角为0,0
*/
function Scene(name){
    this.width          = 0;
    this.height         = 0;
	this.offx			= 0;
	this.offy			= 0;
    this.divTitle       = null;
}
Scene.prototype.init    = function(){
    //生成地形
    var _data = levelData[global.chapter];
    for (var i = 0; i < _data.level.length; i++) {
        var b = new Block(_data.level[i][0],_data.level[i][1],_data.level[i][2],_data.level[i][3]);
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
    for (var i = 0; i < _data.ColorPoint.length; i++) {
        var poemData = _data.ColorPoint[i];
        new PoemBlock(poemData.x,poemData.y,poemData.width,poemData.height,poemData.hue,poemData.ps);
    };
    // 初始化事件点
    // new EventBlock(false,true,150,50,50,25,EventBlock.prototype.JUDGETYPE.GETIN,0,function(){
    //     this.todolist.addTDL(avatar,TDLItem.prototype.ITEM_TYPE.MOVETO_POS,{x:300,y:avatar.y});
    //     this.todolist.addTDL(avatar,TDLItem.prototype.ITEM_TYPE.RESET_SPEED,0);
    // });
    // new EventBlock(false,true,300,50,50,25,EventBlock.prototype.JUDGETYPE.GETIN,0,function(){
    //     global.flag.setItem(0);
    // });
    for (var i = _data.eventData.length - 1; i >= 0; i--) {
        var data = _data.eventData[i];
        new EventBlock(data.onlyOnce,data.storyMode,data.x,data.y,data.width,data.height,data.judgeType,data.judgeArg,data.callback,data.name);
    };
    // 初始化机关
    for (var i = _data.trapData.length - 1; i >= 0; i--) {
        var _trap = _data.trapData[i];
        new Trap(_trap.x,_trap.y,_trap.width,_trap.height,_trap.name);
    };
    // 初始化NPC
    for (var i = _data.npc.length - 1; i >= 0; i--) {
        var _npc = _data.npc[i];
        var newpnc = new Avatar(_npc.x,_npc.y,_npc.imgUrl,_npc.color,_npc.ai);
        newpnc.init();
    };
}
Scene.prototype.removeAll = function() {
    for (var i = global.ActorList.length - 1; i >= 0; i--) {
        var _act = global.ActorList[i];
        _act.distroy();
    };
};
Scene.prototype.nextChap = function() {
     global.chapter++;
     scene.divTitle.html("");
     var nextFunction = function(){
         // scene.showChapTitle("第二章</br>志同 道合",function(){
         //    $("#curtain").fadeOut(2000);
         //    scene.init(global.chapter);   //场景的诗影响了测试按钮的生成-position:relative
         // });
        window.location.href="chap"+(parseInt(global.chapter)+1)+".html"; 
     }
     $("#curtain").fadeIn(2000,nextFunction);
 };
Scene.prototype.showChapTitle = function(ChapName,callback) {
    // 初始化诗句显示
    if (this.divTitle==null) {
        this.divTitle = $("<div class='poemtext'>"+ChapName+"</div>");
    }
    else{
        this.divTitle.html(ChapName);
    }
    this.divTitle.addClass("unselectable");
    this.divTitle.css({
        position:"absolute",
        top:100
    });
    this.divTitle.appendTo($("#curtain"));  
    this.divTitle.css({
        left:(global.SCREEN_WIDTH - this.divTitle.width())/2
    });
    this.divTitle.hide();
    this.divTitle.fadeIn(2000,callback);
};
//静态成员变量
Scene.prototype.id = 0;
// Scene.prototype.ColorPoint = [
//     {div:null,x:40,y:675,width:25,height:25,hue:0,ps:"←→|AD移动"},
//     {div:null,x:175,y:675,width:25,height:25,hue:0,ps:"↑|W跳跃"},
//     {div:null,x:25,y:25,width:750,height:75,hue:0,ps:"锅底微微发烫</br>不能再呆下去了</br>"}
// ]
// Scene.prototype.level = [
//     [0,0,1375,25],
//     [0,0,25,800],
//     [25,100,400,25],
//     [775,25,600,475],
//     // [933,505,25,250],
//     [500,100,275,25],
//     [207,201,525,25],
//     [25,200,125,25],
//     [75,300,250,25],
//     [400,300,400,25],
//     [25,400,150,25],
//     [250,400,525,25],
//     [25,650,175,25]
// ];

// Scene.prototype.eventData = [
//     {
//     name:"water",
//     onlyOnce:false,
//     storyMode:false,
//     x:25,
//     y:125,
//     width:750,
//     height:325,
//     judgeType:1,//STAY,
//     judgeArg:0,
//     callback:function(){
//         var pos = [177,208,360,462,751];
//         var _x,_y,_width,_height;
//         _y = 100;
//         var res = parseInt(Math.random()*2);
//         if (res==1) {
//             var index = parseInt(Math.random()*5);
//             _x = pos[index];
//         }
//         else
//         {
//             _x = Math.random()* 750 + 25;
//         }
//         _width = 25 + Math.random()*25;
//         _height = _width;
//         new Bubble(_x,_y,_width,_height);
//         this.protectTime = 30;
//     }},
//     {
//         name:"cognition",
//         onlyOnce:true,
//         storyMode:false,
//         x:425,
//         y:100,
//         width:75,
//         height:25,
//         judgeType:0,//GETIN,
//         judgeArg:0,
//         callback:function(){
//             global.storySchedule = 1;// 进入第一个剧情点
//             var _tarp = getTrap("gate01");
//             this.todolist.addTDL(_tarp,TDLItem.prototype.ITEM_TYPE.MOVETO_POS,{x:_tarp.x,y:_tarp.y+_tarp.height+100});
//             for (var i = global.BubbleList.length - 1; i >= 0; i--) {
//                 global.BubbleList[i].distroy();
//             };
//         }
//     },
//     {
//         name:"chapterEnd",
//         onlyOnce:true,
//         storyMode:false,
//         x:1275,
//         y:500,
//         width:75,
//         height:150,
//         judgeType:0,//GETIN,
//         judgeArg:0,
//         callback:function(){
//             scene.nextChap();
//         }
//     }
// ];
// Scene.prototype.trapData =  [
//     {
//         x:933,
//         y:505,
//         width:25,
//         height:250,
//         name:"gate01"
//     }
// ]
// Scene.prototype.npc = [];
 // [{x:500,y:280}];
//地形方块
function Block(x,y,width,height){
    this.id             = Block.prototype.id++;
    this.x              = x;
    this.y              = y;
    this.width          = width;
    this.height         = height;
    this.jq             = null; //$对象
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
Block.prototype.distroy = function() {
    this.jq.remove();
    for (var i = global.BlockList.length - 1; i >= 0; i--) {
        if (global.BlockList[i] == this)
            global.BlockList.splice(i,1);
    };
};
Block.prototype.locateCSS = function(){
    //CSS坐标转换
    var cssX,cssY;
    cssX = this.x;
    cssY = global.SCREEN_HEIGHT - this.y - this.height;
    this.jq.css({left:cssX,top:cssY});
    // this.jq.position({left:this.x,bottom:this.y});不支持bottom
}
Block.prototype.CheckCollision = function(collider){
    var isOutOfY = false;
    var isOutOfX = false;
    //主角在方块上方或下放
    if (collider.y>=this.y+this.height || collider.y+collider.height<this.y) isOutOfY = true;
    //主角在方块左侧或右侧
    if (collider.x>=this.x+this.width || collider.x+collider.width<=this.x) isOutOfX=true;
    if (collider.x+collider.speed.x+collider.movespeed.x+collider.width>this.x && collider.x+collider.speed.x+collider.movespeed.x<this.x+this.width &&
        collider.y+collider.speed.y+collider.height>this.y && collider.y+collider.speed.y<this.y+this.height)
    {
        if (isOutOfX==false) {
            if (collider.speed.y>0){
                collider.speed.y  = 0;
                collider.y        = this.y-collider.height;
            }
            else if (collider.speed.y<=0)
            {
                collider.speed.y  = 0;
                collider.y        = this.y+this.height;   
            }
        };
        // 2014年10月17日 22:59:07 保证踩着上升的东西时不会判断为在方块里
        var isStand  = collider.y==this.y+this.height;//主角是否踩着方块
        if (isStand) {
            if (collider==avatar) {
                global.jumpTime = global.jumpTimeLimit;//恢复跳跃机会
                if (global.btnUp==true) {
                    avatar.ActionJump();
                };
            }
            else if (collider.speed.y<=0){
                collider.speed.x = 0;
            }
        }
        if (isOutOfY==false && isStand==false) {
            if (collider.speed.x+collider.movespeed.x>0){
                collider.speed.x        = 0;
                collider.movespeed.x    = 0;
                collider.x        = this.x-collider.width;
            }
            else if (collider.speed.x+collider.movespeed.x<0)
            {
                collider.speed.x        = 0;
                collider.movespeed.x    = 0;
                collider.x        = this.x+this.width;   
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
    this.div            = null;     //诗句div
    this.ps             = ps;       //诗句
    this.jq             = null;
    this.isActive       = false;
    this.init();
    //将方块添加到全局变量中
    global.PoemsList.push(this);
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
getPoem = function(PoemString){
    for (var i = global.PoemsList.length - 1; i >= 0; i--) {
        if (global.PoemsList[i].ps==PoemString)
            return global.PoemsList[i];
    };
    return null;
}
PoemBlock.prototype.distroy = function() {
    this.jq.remove();
    this.div.remove();
    for (var i = global.PoemsList.length - 1; i >= 0; i--) {
        if (global.PoemsList[i] == this)
            global.PoemsList.splice(i,1);
    };
};
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
    if (collider!=avatar) {return};
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
//单词触发？锁定操作？
function EventBlock(onlyOnce,storyMode,x,y,width,height,judgeType,judgeArg,callback,name){
    this.id             = EventBlock.prototype.id++;
    this.x              = x;
    this.y              = y;
    this.width          = width;
    this.height         = height;
    this.name           = name;
    this.jq             = null; //$对象
    //事件判断（方块统计）
    this.isBlockActive  = false;
    this.intersectTime  = 0;        // 额外，相交时间判断
    this.intersectCountType = 0;    // 额外，相交时间累积方式（单次？累积？）
    //事件判断（callback触发）
    this.onlyOnce       = onlyOnce; // 是否单发
    this.storyMode      = storyMode;// 如果为真，在触发事件时锁定场景为剧情模式，不接受键盘操作
    this.isRun          = false;    // 是否已发,脚本只激活为isRun为false的事件，onlyOnce决定了是否重置isRun
    this.judgeType      = judgeType;
    this.judgeArg       = judgeArg;
    this.callback       = callback;
    this.protectTime    = 0;
    //携带的剧本
    this.todolist       = new ToDoList();
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
EventBlock.prototype.distroy = function() {
    this.jq.remove();
    for (var i = global.BlockList.length - 1; i >= 0; i--) {
        if (global.BlockList[i] == this)
            global.BlockList.splice(i,1);
    };
    for (var i = global.EventList.length - 1; i >= 0; i--) {
        if (global.EventList[i] == this)
            global.EventList.splice(i,1);
    };
};
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
/*
    确认事件触发条件满足
*重置isRun的条件
 1·不是OnlyOnce
 2·
*/
EventBlock.prototype.checkEvent = function(){
    this.protectTime --;
    if (this.protectTime>0) {
        return;
    };
    if (this.isRun) {
        if (this.todolist.isDone) {
            this.reset();
        };
        return;
    };
    var res = false;
    switch(this.judgeType){
    case this.JUDGETYPE.GETIN:
        if (this.isBlockActive) {
            res = true;
        };
        break;
    case this.JUDGETYPE.STAY:
        if (this.isBlockActive) {
            res = true;
        };
        break;
    case this.JUDGETYPE.LEAVE:
        res = false;
        break;
    case this.JUDGETYPE.LEAVEAFTER:
        res = false;
        break;
    }
    if (res) {
        this.isRun = true;
        if (this.storyMode) {
            global.storyMode = true;
        };
        this.callback();    //执行
    };
}
EventBlock.prototype.reset      = function(){
    this.todolist.reset();
    if (this.storyMode) {
        global.storyMode = false;
    };
    // 是否重置等待运行
    if (!this.onlyOnce&&
        (!this.isBlockActive&&this.judgeType==this.JUDGETYPE.GETIN ||
         this.isBlockActive&&this.judgeType==this.JUDGETYPE.STAY)) {
        this.isRun  = false;
    };
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
        if (!this.onlyOnce&&this.isDone) {
            this.isRun  = false;
        };
    }
    return this.isBlockActive;
}
//静态成员变量
EventBlock.prototype.id = 0;
// 道具栏
function ItemFlag(){
    this.itemID         = -1;
    this.jq             = null; //$对象
    this.init();
}
ItemFlag.prototype.init    = function(){
    this.jq = $("<div id='flag'></div>");
    this.jq.css("backgroundColor","rgb(255,255,255)");
    this.jq.css({
        width:"50px",
        height:"50px",
        top:50,
        right:50,
        position:"absolute"
    });
    this.jq.appendTo($("#divwindow"));
    this.jq.itemNo = -1;

    this.jq.object = this;
    this.jq[0].object = this;
}
ItemFlag.prototype.setItem  = function(itemID){
    this.itemID = itemID;
    switch(itemID)
    {
    case 0:
    this.jq.css({ "background-image":"url(Image/rope.png)"
                    ,"background-repeat":"round"})
    }
}
function Bubble(x,y,width,height)
{
    this.x          = x;
    this.y          = y;
    this.width      = width;
    this.height     = height;
    this.speed      = {x:0,y:2.5};
    this.power      = {x:0,y:0};
    this.powerChangeProtect = 0;
    global.BubbleList.push(this);
    this.init();
}
Bubble.prototype.distroy = function() {
    this.jq.remove();
    for (var i = global.BubbleList.length - 1; i >= 0; i--) {
        if(this ==global.BubbleList[i])
            global.BubbleList.splice(i,1);
    };
};
Bubble.prototype.init   = function(){
    this.jq = $("<div class='bubble'></div>");
    this.jq.css({
        width:this.width,
        height:this.height,
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
    this.jq.css({ "background-image":"url(Image/Bubble.png)"
                    ,"background-repeat":"round"});
}
Bubble.prototype.distroy = function() {
    this.jq.remove();
    for (var i = global.BubbleList.length - 1; i >= 0; i--) {
        if (global.BubbleList[i] == this)
            global.BubbleList.splice(i,1);
    };
};
Bubble.prototype.CheckCollision = function(collider){
    Block.prototype.CheckCollision.call(this,collider);
};
Bubble.prototype.locateCSS = function(){
    //CSS坐标转换
    var offset = this.jq.position();
    var cssX,cssY;
    cssX = this.x;
    cssY = global.SCREEN_HEIGHT - this.y - this.height;
    if (cssX!=parseInt(offset.left) || cssY!=parseInt(offset.top)) {
        this.jq.css({left:cssX,top:cssY});
    };
}
Bubble.prototype.run = function() {
    this.x += this.speed.x;
    this.y += this.speed.y;
    this.locateCSS();
    var isInWater = false;
    for (var i = global.EventList.length - 1; i >= 0; i--) {
        var target = global.EventList[i];
        if (this.x+this.speed.x+this.speed.x+this.width>target.x && this.x+this.speed.x+this.speed.x<target.x+target.width &&
            this.y+this.speed.y+this.height>target.y && this.y+this.speed.y<target.y+target.height)
        {
            if (target.name == "water") {
                isInWater = true;
                break;
            };
        }
    };
    if (isInWater==false) {
        this.distroy();
    };
};
function Trap(x,y,width,height,name)
{
    this.x      = x;
    this.y      = y;
    this.width  = width;
    this.height = height;
    this.name   = name;
    this.div            = null; //$对象
    this.init();
    //将方块添加到全局变量中
    global.BlockList.push(this);
    global.TrapList.push(this);
}
Trap.prototype.init    = function(){
    //初始化碰撞方块显示
    this.jq = $("<div class='trap'></div>");
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
Trap.prototype.distroy = function() {
    this.jq.remove();
    for (var i = global.BlockList.length - 1; i >= 0; i--) {
        if (global.BlockList[i] == this)
            global.BlockList.splice(i,1);
    };
    for (var i = global.TrapList.length - 1; i >= 0; i--) {
        if (global.TrapList[i] == this)
            global.TrapList.splice(i,1);
    };
};
Trap.prototype.locateCSS = function(){
    //CSS坐标转换
    var cssX,cssY;
    cssX = this.x;
    cssY = global.SCREEN_HEIGHT - this.y - this.height;
    this.jq.css({left:cssX,top:cssY});
    // this.jq.position({left:this.x,bottom:this.y});不支持bottom
}
Trap.prototype.CheckCollision = function(collider) {
    Block.prototype.CheckCollision.call(this,collider);
};
getTrap = function(tName)
{
    for (var i = global.TrapList.length - 1; i >= 0; i--) {
        var _trap = global.TrapList[i];
        if (_trap.name==tName)
            return _trap;
    };
}
//其他方法
// function showPoem(){
//     var index = global.poemPoint;
//     if (index == global.poemPointPre) return;
//     if (index>=0) {
//         var div = scene.ColorPoint[index].div;
//         div.fadeIn({duration:1000,queue:false});
//     };
//     if (global.poemPointPre>=0) {
//         var divPre = scene.ColorPoint[global.poemPointPre].div;
//         divPre.fadeOut({duration:400,queue:false});  
//     };
// }
// function checkPoemPoint(){
//     var index = -1;
//     for (var i = scene.ColorPoint.length - 1; i >= 0; i--) {
//         if (avatar.x>=scene.ColorPoint[i].x && avatar.x<=scene.ColorPoint[i].x+scene.ColorPoint[i].width)
//             index = i;
//     };
//     global.poemPoint = index;
// }
function getDis(p1,p2)
{
    var dis;
    var x = p1.x - p2.x;
    var y = p1.y - p2.y;
    dis = Math.sqrt(x*x+y*y);
    return dis;
}