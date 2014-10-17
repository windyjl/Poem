// var $ = jQuery.noConflict();
var $id = function(id) { return document.getElementById(id); };
var FPS = 60;
var avatar  = null;
var scene   = null;
var global = {
    wcm:null,
    ctxBG:null,
    bufferCanvas:document.createElement('canvas'),
    tempCanvas: document.createElement('canvas'),
    ActorList:[],
    BlockList:[],
    PoemsList:[],
    EventList:[],
    BubbleList:[],
    TrapList:[],
    btnLeft:false,
    btnRight:false,
    btnUp:false,
    btnDown:false,
    btnCtrl:false,
    btnShift:false,
    dctLeftOrRight:0,   // 0不动
    dctUpOrDown:0,
    touchX0:null,
    touchY0:null,
    touchX:null,
    touchY:null,
    // 背景色变幻
    hueOffsetPre:null,
    hueChange:2,
    poemPointIndex:false,  // 每次检测前置为false，方便PoemBlock判断
    defaultColor:240,
    poemPoint:null,     // 在之前做法中存的是index，现在将存储PoemBlock对象
    poemPointPre:null,
    // 游戏道具
    flag:null,
    // 游戏数据
    gravity:-0.5,
    jumpSpeed:7.5,
    speedx:2.5,
    lockStand:true,     //每次检测到，将组织横向碰撞计算下移速度
    storySchedule:0,
    chapter:0,
    // 操作限制
    jumpTimeLimit:2,
    jumpTime:2,
    storyMode:false,    // 剧情事件，目前用于改变avatar的操作
    // 地图编辑器信息
    chosingBlock:null,
    chosingBlockX0:null,
    chosingBlockY0:null,
    chosingBlockWidth0:null,
    chosingBlockHeight0:null,
    // 全局效率控制
    lockResetCss:false  //当设为true时，更新坐标
};
global.isMouseDown  = false;
global.isDblClick   = true;
global.canRun       = true;
global.isMousemovable    = true;
global.SCREEN_WIDTH = 1024;
global.SCREEN_HEIGHT= 768;
global.divwindow    = null;
global.divmap       = null;
//测试变量
global.timecount    = 0;//new Date().getTime();//记录上一次鼠标点击时的时间
global.updatetimes  = 0;
global.str    = "";
global.mousemovetime= 0;
global.locatetime   = 0;
global.locateCSStime= 0;
global.isSPDpause   = false;
global.isPosUpdate  = false;
var block   = null;
var KEY = {
    UP:38,
    DOWN:40,
    LEFT:37,
    RIGHT:39,
    SPACE:32,
    ENTER:13,
    ESC:27,
    CTRL:17,
    SHIFT:16,
    W:87,
    S:83,
    A:65,
    D:68,
    Z:90,
    X:88,
    Y:89
}
//启动的地方
$(document).ready(function(){
    var re = /(index|\d*?)\.html/;
    var a = re.exec(window.location.href);
    if (a[1]=="index") {
        global.chapter = 0;
    }
    else{
        global.chapter = a[1]-1;
    }
    console.log("当前关卡:"+global.chapter);
    if(!global.isH5suport){
        return;
    }
    init();
});
//初始化使用界面
function init(){
    global.divwindow = $("<div id='divwindow'></div>");
    global.divwindow.css({
        height:global.SCREEN_HEIGHT,
        width:global.SCREEN_WIDTH,
        position:"absolute",
        overflow:"hidden"
    });
    global.divwindow.appendTo($("body")); 
    global.divmap = $("<div id='divmap'></div>");
    global.divmap.css({
        height:global.SCREEN_HEIGHT,
        // width:global.SCREEN_WIDTH,
        position:"absolute",
        // overflow:"hidden"
    });
    global.divmap.appendTo($("#divwindow"));  
    //new Block(200,200,1000,50);
    // initFNobject();
    //初始化各种设定参数
    initConfig();
    //初始化UI
    initUI();
    //注册事件
    initEvent();
    //注册需要jQuery事件帮助的CSS
    // initJqCss();
    //初始化各种方法对象
    var _lvData = levelData[global.chapter];
    avatar = new Avatar(_lvData.avatarPoint.x,_lvData.avatarPoint.y,"Image/frog.png");
    avatar.init();
    // new Bubble(50,50,25,25);
    //初始化游戏道具
    global.flag = new ItemFlag();
    // avatar.img.attr("src","Image/frog.png");
    scene = new Scene();

    // 显示第一章
    scene.showChapTitle(levelData[global.chapter].title,function(){
        $("#curtain").fadeOut(2000);
        scene.init(global.chapter);   //场景的诗影响了测试按钮的生成-position:relative
        run();
    })
};
//初始化各种方法对象
var initFNobject = function(){
    // global.tracker = new Tracker();
}
//初始化各种设定参数
 var initConfig = function(){
    // setStarDustConfig(); 
    
    //SuperVisor参数
    global.sv = {
        cld_gap : 15,
        level_gap : 50,
        isReadSVselfOff:true
    };
}
//初始化事件
var initEvent = function  () {
    //背景鼠标 按下
    $("body").on('mousedown',mousedown);
    // 双击背景 添加想法 
    /* 放弃使用双击调用新建方法 2013年2月20日23点57分51秒
     * 临时启用双击方法  2013年3月6日12点18分49秒
     */
    //$("body").dblclick(bg_dblclick);
    //键盘事件
    $("body").keydown(bg_keydown);
    $("body").keyup(bg_keyup);
    //鼠标弹起，强制结束拖动
    $("body").on("mouseup",mouseup);
    //鼠标单击-观星者
    // $("body").on("click",function(e){
    //   if(global.isClick){
    //   StarGazer(e);
    //   }
    // });
    //浏览器事件
    $(window).bind("onfocus",function(e){
        console.log('窗口事件测试')
        var str = time.getMinutes()+'分'+time.getSeconds()+'秒';
        console.log(str);
        alert(str)
    });
    window.onfocus = function(){
        var time = new Date();
        var str = time.getMinutes()+'分'+time.getSeconds()+'秒';
        console.log('进入：'+str);
    }
    window.onblur = function(){
        var time = new Date();
        var str = time.getMinutes()+'分'+time.getSeconds()+'秒';
        console.log('离开：'+str);
    }
    // $('input.idea').on('mousedown mouseup click', function(e){
        // e.stopPropagation();
    // });
    
    // //窗口-离开
    // $(window).on('onpagehide',function(){
        // global.canRun = false;
    // });
    // $(window).on('onpageshow',function(){
        // global.canRun = true;
    // });
    //窗口大小调整
    $(window).resize(windowResize);
    // Canvas にマウスイベントを登録       鼠标移动事件登录
    //PS：需要使用冒泡，不然点到别的元素不会反馈事件 2013年2月22日15点31分10秒
    document.body.addEventListener("mousemove", updateMousePos, false); // マウス移動時イベント
    document.body.addEventListener("mouseout", resetTouchPos, false); // マウスが画面外に出た際のイベント
    
    // Canvas にタッチ時のイベントを登録     触摸时事件登录
    /*
    document.body.addEventListener("touchmove", updateTouchPos, false);// タッチ移動時イベント
    document.body.addEventListener("touchend", resetTouchPos, false);  // タッチ終了時イベント
    */
    //测试 2012年6月25日18点14分10秒
    // document.body.addEventListener("touchstart", function(){$("#intro").append("开始");}, false);
    // document.body.addEventListener("touchmove", function(){$("#intro").append("移动");}, false);
    // document.body.addEventListener("touchend", function(){$("#intro").append("结束");}, false);
    
}
//初始化UI
var initUI = function(){
    // 初始化幕布
    $("#curtain").css({
        "backgroundColor":"rgb(0,0,0)",
        "width":global.SCREEN_WIDTH,
        "height":global.SCREEN_HEIGHT,
        position:"fixed",
        "z-index":100
    });
    //初始化背景
    var canvas = $id("bg");
    global.ctxBG = canvas.getContext('2d');
    global.bufferCanvas.width = global.SCREEN_WIDTH;
    global.bufferCanvas.height = global.SCREEN_HEIGHT;
    $.each($('canvas').get(),function(){
        this.width = global.SCREEN_WIDTH;
        this.height = global.SCREEN_HEIGHT;
    });
    $('canvas').css({position:"fixed"});
    drawbg();
    tBtn("新建方块",function(){new Block(0,global.BlockList.length*50,100,20)});
    tBtn("记录方块",function(){
        console.log("正在输出当前关卡的")
        for (var i = 0; i < global.BlockList.length; i++) {
            var blk = global.BlockList[i];
            console.log(getObjectClass(blk)+":"+blk.x+","+blk.y+","+blk.width+","+blk.height);
        };
        for (var i = 0; i < global.PoemsList.length; i++) {
            var blk = global.PoemsList[i];
            console.log(getObjectClass(blk)+":"+blk.x+","+blk.y+","+blk.width+","+blk.height);
        };
    });
}
//临时功能
var hideAll = function(e,quantity){
    quantity = quantity?quantity:3;
    $('#idea-area').hide();
    global.sc.isShowJiQing = false;
    $('div.empty-idea').hide();
}
var showAll = function(e,quantity){
    quantity = quantity?quantity:3;
    $('#idea-area').show();
    $('#idea-area').offset({
        left:global.divAllIdea.x,
        top:global.divAllIdea.y
    })
    global.sc.isShowJiQing = true;
    $('div.empty-idea').show();
    $.each(global.idea, function(){
        if($.IdeaSV.isOnScreen(this)){
            $(this).SVcldIdea();
        }
    })
}

//自定义需要jQuery帮助的CSS
var initJqCss = function(){
    $(window).resize(jQcentre);
    jQcentre();
    function jQcentre(){
        $('.JQcentre').css("position",'absolute');
        $('.JQcentre').css("left",($(window).width() - $('.JQcentre').outerWidth())/2);
        $('.JQcentre').css("top",($(window).height() - $('.JQcentre').outerHeight())/2);
    }
}
//主循环
var run = function()
{
    var _run = function()
    {
        global.isMousemovable = true;
        //checkPoemPoint();
        //showPoem();
        drawbg();
        runAi();
        runBubble();    //气泡
        physicalMove();
        syncMapOffset();
        global.ctxBG.drawImage(global.bufferCanvas,0,0);
        followCamera();
        checkEvent();
        // runninglog();
        setTimeout(_run, 1000.0/FPS);
        // global.poemPointBre = global.poemPoint;
        // }
    };
    setTimeout(_run, 1000.0/FPS);
};
var runBubble = function  () {
    if (global.storySchedule!=0) 
        return;
    for (var i = global.BubbleList.length - 1; i >= 0; i--) {
        var _bbl = global.BubbleList[i];
        _bbl.run();
    };
}
// 运行AI
var runAi   = function(){
    for (var i = global.ActorList.length - 1; i >= 0; i--) {
        var actor = global.ActorList[i];
        actor.RunAi();
    };
}
// 检查事件的触发条件，并运行事件所触发的剧本
var checkEvent = function(){
    for (var i = 0; i < global.EventList.length; i++) {
        var _evt = global.EventList[i];
        _evt.checkEvent();
        if (_evt.isRun) {
            _evt.todolist.doTDL();
        };
    }
}
preMapOff = null;// 非正规全局变量
var followCamera = function(){
    var mapOff = 0;
    if (avatar.x<global.SCREEN_WIDTH/2) {
        mapOff = 0;
    }
    else if (avatar.x>scene.width-global.SCREEN_WIDTH/2) {
        mapOff = scene.width-global.SCREEN_WIDTH;
    }
    else{
        mapOff = avatar.x - global.SCREEN_WIDTH/2;
    }
    if (preMapOff==mapOff) {return};
    $("#divmap").css({left:-mapOff});
}
var physicalMove = function()
{
    var multiGravity = 1;
    // 玩家角色的特殊优待
    if (global.btnUp&&avatar.speed.y>0) {multiGravity = 0.5};
    if (global.chosingBlock!=avatar)
        avatar.speed.y += global.gravity*multiGravity;
    if (!global.storyMode) {
        avatar.movespeed.x = global.dctLeftOrRight * global.speedx;
    };
    // 人与气泡
    for (var i = global.BubbleList.length - 1; i >= 0&& global.storySchedule==0 ; i--) {
        global.BubbleList[i].CheckCollision(avatar);
    };
    //诗集检查
    global.poemPointIndex = false;
    for (var i = 0; i < global.PoemsList.length; i++) {
        var _poem = global.PoemsList[i];
        _poem.CheckCollision(avatar);
        if (global.poemPointIndex) {break;}
    };
    // 正常角色碰撞处理
    for (var j = global.ActorList.length - 1; j >= 0; j--) {
        var actor = global.ActorList[j];
        // 非玩家角色重力处理
        if (actor!=avatar && actor!=global.chosingBlock) {
            actor.speed.y += global.gravity;
        };
        // 边界限制
        if (actor.y<0 && actor.speed.y<0) 
        {
            actor.speed.y  = 0;
            actor.y        = 0;
        }
        //物理判断
        for (var i = 0; i < global.BlockList.length; i++) {
            var _blo = global.BlockList[i];
            _blo.CheckCollision(actor);
        };
        // 收尾处理，如果没有碰到poem，将poempoint置空
        if (global.poemPointIndex==false) {
            global.poemPointPre = global.poemPoint;
            global.poemPoint = null;    
            if(global.poemPointPre!=null){
                // 隐藏
                global.poemPointPre.div.fadeOut({duration:400,queue:false});
            }
        };
        // 角色按照速度移动
        actor.x += actor.speed.x + actor.movespeed.x;
        actor.y += actor.speed.y + actor.movespeed.y;
        actor.locateCSS();
    };
    // 人与人的接触
    for (var i = 0; i < global.ActorList.length; i++) {
        var actor = global.ActorList[i];
        if (actor==avatar) {continue};
        actor.CheckCollision(avatar);
    };
    // 人物与地图边界
    if (avatar.x<0) {
        avatar.x = 0;
        avatar.movespeed.x = 0;
    }
    else if (avatar.x+avatar.width>scene.width) {
        avatar.x = scene.width - avatar.width;
        avatar.movespeed.x = 0;
    };
}
global.runninglog = {
    lastTime:0,
    times:0,
    timesPerSecond:2
}
var runninglog = function(){
    global.timecount++;
    // var obj = global.runninglog;
    // var now = new Date().getTime();
    // if((now - obj.lastTime) > (1000 / obj.timesPerSecond)){
        // obj.lastTime = now;
    // }
    drawRunningInformation();
}
var drawRunningInformation = function(source,aimIdea){
    // source = source?source:'';
    // var t = aimIdea?aimIdea:global.idea[0];
    // var p = $(t.spirit).offset();
    // console.log(source+"self:\t"+ t.x + ",\t"+t.y)
    // console.log(source+"temp:\t"+ t.tempX + ",\t"+t.tempY)
    // console.log(source+"offset:\t"+ p.left + ",\t"+p.top)
    // var str = global.offx;
    // console.log(str)
    var aryStr = [];
    var t = global.idea[0];
    if(!t){
        return;
    }
    var d = new Date();
    aryStr.push("运行次数为："+global.timecount+'\t时间：'+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds());
    aryStr.push('第一个Idea的：');
    aryStr.push('坐标 = '+t.x+','+t.y);
    aryStr.push('临时坐标 = '+t.tempX+','+t.tempY);
    aryStr.push('拖动起点 = '+t.touchX0+','+t.touchY0);
    aryStr.push('偏移坐标 = '+t.offx+','+t.offy);
    aryStr.push('---------------');
    aryStr.push('第一个EmptyIdea：');
    var t = global.idea[0].emptyIdea;
    aryStr.push('坐标 = '+t.x+','+t.y);
    aryStr.push('偏移坐标 = '+t.sv.offx+','+t.sv.offy);
    aryStr.push('---------------');
    t = global;
    aryStr.push('全局偏移 = '+t.offx+','+t.offy);
    aryStr.push('拖动起点 = '+t.touchX0+','+t.touchY0);
    aryStr.push('---------------');
    aryStr.push('拖动和暂停冲突'+ global.isPosUpdate&&global.isSPDpause);
    if(global.isPosUpdate&&global.isSPDpause){
        alert('冲突');
    }
    aryStr.push('拖动中：'+ global.isPosUpdate);
    aryStr.push('暂停中：'+global.isSPDpause);
    //数据输入完毕，开始绘制
    global.ctxBG.save();
    global.ctxBG.fillStyle = '#66ccff';
    global.ctxBG.font = 15 + "px 宋体";
    $.each(aryStr,function(index,str){
        global.ctxBG.fillText(str,5,40+index*20);
    })
    global.ctxBG.restore();
}
/*异步绘制图片
 * @param ulr 图片链接
 * @param url 绘制图片的函数，图片用this表示即可
 */
var drawimage = function  (url,callback) {
    var img = new Image(); //创建一个Image对象，实现图片的预下载  
    img.src = url;  
     
    if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数  
        callback.call(img);  
        return; // 直接返回，不用再处理onload事件  
    }
    img.onload = function () { //图片下载完毕时异步调用callback函数。  
        callback.call(img);//将回调函数的this替换为Image对象  
    };  
}
var drawbg  = function(){
    var canvas = global.bufferCanvas;
    var ctx = canvas.getContext("2d");
    //绘制彩色背景
    // console.log(canvas.width+":"+canvas.height)
    gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0,
                         canvas.width/2, canvas.height/2,canvas.width/2);
    //添加渐变色位置
    //gradient.addColorStop("1.0","black");
    //gradient.addColorStop("0.2","rgb(0,0,75)");
    //gradient.addColorStop("0","rgb(0,0,100)");
    // gradient.addColorStop("1.0", "rgb(20, 20, 50)");
    // gradient.addColorStop("0.5", "rgb(30, 65, 160)");
    // gradient.addColorStop("0",   "rgb(54, 145, 220)");

    var hsb1 = rgb2hsb(20,20,50);
    var hsb2 = rgb2hsb(30,65,160);
    var hsb3 = rgb2hsb(54,145,220);
    var hue = hsb1[0];
    var offset = 0;//渐变方向
    //此处应该写成for

    var poemPoint = global.poemPoint;
    // for (var i = scene.ColorPoint.length - 1; i >= 0; i--) {
    //     if (avatar.x>=scene.ColorPoint[i].x && avatar.x<=scene.ColorPoint[i].x+scene.ColorPoint[i].width)
    //         index = i;
    // };
    if (poemPoint != null) {
        // 读取颜色
        hue = poemPoint.hue;
        // 进入颜色区域-初始化
        if (global.hueOffsetPre==null) {
            global.hueOffsetPre=0;
            global.hueTime = global.hueInter;
        };
    }
    // 判断渐变方向
    if (global.hueTime>0) {
        global.hueTime--;
        offset = 0
    }
    else {
        global.hueTime = global.hueInter;
        var nowHue = hsb1[0]+global.hueOffsetPre;
        // while (nowHue>=360) {nowHue-=360};
        var dif = hue-nowHue+360;
        while (dif>=360) {dif-=360};
        if (dif>global.hueChange&&dif>180) {
            offset = -global.hueChange;
        }
        else if (dif>global.hueChange&&dif<=180) {
            offset = global.hueChange;
        };
    }
    if (global.hueOffsetPre!=null) {
        hsb1[0] += global.hueOffsetPre + offset;
        hsb2[0] += global.hueOffsetPre + offset;
        hsb3[0] += global.hueOffsetPre + offset;
        global.hueOffsetPre += offset;
    };
    while (hsb1[0]>=360) {hsb1[0]-=360};
    while (hsb2[0]>=360) {hsb2[0]-=360};
    while (hsb3[0]>=360) {hsb3[0]-=360};
    var rgb1 = hsb2rgb(hsb1[0],hsb1[1],hsb1[2]);
    var rgb2 = hsb2rgb(hsb2[0],hsb2[1],hsb2[2]);
    var rgb3 = hsb2rgb(hsb3[0],hsb3[1],hsb3[2]);


    gradient.addColorStop("1.0", "rgb("+rgb1[0]+", "+rgb1[1]+", "+rgb1[2]+")");
    gradient.addColorStop("0.5", "rgb("+rgb2[0]+", "+rgb2[1]+", "+rgb2[2]+")");
    gradient.addColorStop("0",   "rgb("+rgb3[0]+", "+rgb3[1]+", "+rgb3[2]+")");

    ctx.fillStyle = gradient;
    ctx.fillRect (0,0,canvas.width,canvas.height);
}
var syncMapOffset = function (){
    if (global.isMouseDown) {};
}
//监听事件
var mousedown = function(e){
    // if(global.tracker.isSDTracking){
    //   return;
    // }
    // global.tracker.SPDTpause();//打断拖动缓冲
    // console.log(e);
    // console.log(e.target.object);
    if (e.target.object==null) {return};
    global.chosingBlock = e.target.object;
    global.chosingBlockX0  = global.chosingBlock.x;
    global.chosingBlockY0  = global.chosingBlock.y;
    global.chosingBlockWidth0   = global.chosingBlock.jq.width();
    global.chosingBlockHeight0  = global.chosingBlock.jq.height();
    global.locateType   = global.LCT_GLB_GRAG;
    global.isMouseDown  = true;
    global.isDblClick   = true;/*启动双击判定*/
    global.isClick      = true;
    global.isDragging   = false;//拖动状态，与点击相冲突
    global.touchX0      = e.clientX;
    global.touchY0      = e.clientY;
}
var mouseup = function(e){
    global.chosingBlock = null;
    global.cchosingBlockX0  = null;
    global.cchosingBlockY0  = null;
    global.chosingBlockWidth0   = null;
    global.chosingBlockHeight0  = null;
    //清除有关状态
    global.draggingIdea = null;
    global.isMouseDown = false;
    global.touchX0 = null;//取消拖动起始点 2013年3月3日23点36分05秒
    global.touchY0 = null;
    //posUpdate(true);//用于清空全局偏移,参数用于跳过帧数限制的响应条件
    /*
    //弹起后处理的内容，不需要偏移的
    //$.each(global.idea,function(){this.locate();})
    //[将扩展]单个拖动时，对该想法进行排版   
    if(global.draggingIdea != null){
        global.draggingIdea.locatePos({
                        sorce:2});
        if($.IdeaSV.isOnScreen(global.draggingIdea)){
            global.draggingIdea.locateCSS({sorce:'alpha494'});
            $(global.draggingIdea).SVcldIdea(0);
            $(global.draggingIdea).SVupdateCldPos();
        }
        global.draggingIdea = null;//取消“拖动”状态
    }
    //全局拖动时
    if(global.isDragging && global.draggingIdea == null){
        $.each(global.idea,function(){
            if(!this.sv.isHasParent){
                 $(this).SVupdateCldPos();//临时坐标标变真坐标
            }
        })
        global.isDragging   = false;
    }
    */
    global.isDragging   = false;
}
//关于垃圾桶删除想法图标的操作
var mouseUpOnTrash = function(event){
    var gdi = global.draggingIdea;
    if(gdi!=null){
        gdi.deleteStep();
    }
}
//双击事件
var bg_dblclick = function(event)
{
    if(!global.isDblClick){
        return;
    }
    var content_type = Idea.prototype.CONTENT_TYPE_ARTICLE;
    var idea_relation = Idea.prototype.RELATION_TYPE_FREE;
    if($id("temp") != undefined){
        document.body.removeChild($id("temp"));
    }
    // console.log(this);测试事件发生的对象
    //双击想法  新建子想法
    if(/idea\d+/i.test(event.target.id)){
        return ;//
        idea_relation = Idea.prototype.RELATION_TYPE_INSIDE;
    }
    //双击跳跃图标    新建跳跃想法
    else if(/idea\d+/i.test(event.target.id)){
        idea_relation = Idea.prototype.RELATION_TYPE_JUMP;
    }
    getInput(event.clientX,event.clientY,content_type,idea_relation);
    event.stopPropagation();
    return false;
};
//键盘响应
var bg_keydown = function(event){
    //alert(event.which);
    // if (global.storyMode) {return}; //剧情时不响应
    switch(event.which){
    case KEY.W:
    case KEY.UP:
        if (global.btnUp == false){
            avatar.ActionJump();
        }
        global.btnUp    = true;
        global.dctUpOrDown = 1;
        break;
    case KEY.S:
    case KEY.DOWN:
        global.btnDown  = true;
        global.dctUpOrDown = -1;
        break;
    case KEY.A:
    case KEY.LEFT:
        global.btnLeft  = true;
        global.dctLeftOrRight = -1;
        break;
    case KEY.D:
    case KEY.RIGHT:
        global.btnRight = true;
        global.dctLeftOrRight = 1;
        break;
    case KEY.CTRL:
        global.btnCtrl  = true;
        break;
    case KEY.SHIFT:
        global.btnShift  = true;
        break;
    case KEY.ESC://Esc
        break;
    }
};
//键盘响应
var bg_keyup = function(event){
    // alert(event.which);
    // if (global.storyMode) {return};
    switch(event.which){
    case KEY.W:
    case KEY.UP:
        global.btnUp    = false;
        if (global.btnDown){
            global.dctUpOrDown = -1;
        }else{
            global.dctUpOrDown = 0;
        }
        break;
    case KEY.S:
    case KEY.DOWN:
        global.btnDown  = false;
        if (global.btnUp){
            global.dctUpOrDown = 1;
        }else{
            global.dctUpOrDown = 0;
        }
        break;
    case KEY.A:
    case KEY.LEFT:
        global.btnLeft  = false;
        if (global.btnRight){
            global.dctLeftOrRight = 1;
        }else{
            global.dctLeftOrRight = 0;
        }
        avatar.speed.x  = 0;
        break;
    case KEY.D:
    case KEY.RIGHT:
        global.btnRight = false;
        if (global.btnLeft){
            global.dctLeftOrRight = -1;
        }else{
            global.dctLeftOrRight = 0;
        }
        avatar.speed.x  = 0;
        break;
    case KEY.CTRL:
        global.btnCtrl  = false;
    case KEY.SHIFT:
        global.btnShift = false;
        break;
    case KEY.ESC://Esc
        break;
    }
};
//鼠标移动
var updateMousePos = function(e){
    // var rect = e.target.getBoundingClientRect();
    // global.touchX = e.clientX - rect.left;
    // global.touchY = e.clientY - rect.top;
    global.touchX = e.clientX;
    global.touchY = e.clientY;
    posUpdate();
};
var posUpdate = function(isCalledByFn){
    if(!global.isMousemovable && !isCalledByFn){//老掉牙的办法，减少mousemove响应次数
        return;
    }
    global.mousemovetime++;
    global.isMousemovable = false;
    if (global.chosingBlock==null || global.chosingBlockX0==null || global.chosingBlockY0==null) return;
    var offX = global.touchX - global.touchX0;
    var offY = global.touchY - global.touchY0;
    if (global.btnCtrl)
    {
        cssWidth = global.chosingBlockWidth0 + offX;
        cssHeight = global.chosingBlockHeight0 + offY;
        cssWidth = parseInt(cssWidth/25)*25;
        cssHeight = parseInt(cssHeight/25)*25;
        if (cssWidth<25) cssWidth=25;
        if (cssHeight<25) cssHeight=25;
        global.chosingBlock.jq.css(
            {
                width:cssWidth,
                height:cssHeight
            });
        global.chosingBlock.width = global.chosingBlock.jq.width();
        global.chosingBlock.height = global.chosingBlock.jq.height();
        global.chosingBlock.y = global.chosingBlockY0 + (global.chosingBlockHeight0-cssHeight);
    }
    else
    {
        global.chosingBlock.x = global.chosingBlockX0 + offX;
        global.chosingBlock.y = global.chosingBlockY0 - offY;
        if (global.btnShift) {
            global.chosingBlock.x = parseInt(global.chosingBlock.x/25)*25;
            global.chosingBlock.y = parseInt(global.chosingBlock.y/25)*25;
        };
        global.chosingBlock.locateCSS();
    }
}
//鼠标离开页面
var resetTouchPos = function(e)
{
    var b = (e.clientX > 0 && e.clientX < global.SCREEN_WIDTH)&&(e.clientY > 0 &&e.clientY < global.SCREEN_HEIGHT);
    if(b){
        //这是鼠标在页面内部的不同元素中移动时报告的鼠标离开
        //与鼠标离开页面的事件不同
    }else{
        // global.touchX = null;鼠标离开界面后，以最后一次的位置停放图标
        // global.touchY = null;
        
        // global.touchX0 = null;鼠标离开界面，但初始点击位置仍然存在
        // global.touchY0 = null;
   }
};
//窗口大小调整
var windowResize = function(e){
    return;
    var canvas = $id("bg");
    var scaleX = innerWidth/global.SCREEN_WIDTH;
    var scaleY = innerHeight/global.SCREEN_HEIGHT; 
    global.SCREEN_HEIGHT = innerHeight;
    global.SCREEN_WIDTH = innerWidth;
    $.each($('canvas').get(),function(){
        this.width = global.SCREEN_WIDTH;
        this.height = global.SCREEN_HEIGHT;
    })
    global.bufferCanvas.width = global.SCREEN_WIDTH;
    global.bufferCanvas.height = global.SCREEN_HEIGHT;
    // for (var i=0; i < global.UI.length; i++) {
    //   global.UI[i].resize();
    // };
    //修正图标坐标
    // $.each(global.idea,function(){
      // this.x *= scaleX;
      // this.y *= scaleY;
      // this.locate();
    // })
    //让提示文字居中
    var l = global.SCREEN_WIDTH/4;
    $("#intro").css("left",l);
    //绘制背景颜色
    drawbg();
};
//自定义快捷方法

/*管理Idea们的z-index   
* 只要传入上浮的idea对象即可调整 
*/
var tBtn = function(title,onEvent){
    //测试 保存按钮
    var b = document.createElement("button");
    $(b).addClass("unselectable");
    b.id="jqtest";
    b.innerHTML=title;
    document.body.appendChild(b);
    $(b).css("position","relative");
    $(b).css("z-index",10);
    $(b).css("margin",'5px 0px 0px 5px');
    
    $(b).click(onEvent);
}
//获取字符串前n个字节内的字符串，如果最后一个双字节字符使得字符串长度超出，则放弃
String.prototype.getsubstr=function(n) {
    var res ={
        str:""
    };
    if(n<0){
        alert("getsubstr错误，参数小于0");
    }
    var str = this.substring(0,n);
    var t = 0;
    for (var i=0; str.len() > n;) {
        t = Math.floor((str.len() - n) / 2);
        t = Math.abs(t);
        i += t ==0?1:t;
        str = this.substring(0,n-i);
    };
    
    res.str = str;
    res.index = n - i;
    return res;
};
var showTime = function(){
    if(global.timecount && global.isMouseDown){
        console.log(new Date().getTime() - global.timecount);
    }
    global.timecount = new Date().getTime();
}

var getObjectClass = function (obj) {
    if (obj && obj.constructor && obj.constructor.toString()) {
        /*
         *  for browsers which have name property in the constructor
         *  of the object,such as chrome
         */
        if(obj.constructor.name) {
            return obj.constructor.name;
        }
        var str = obj.constructor.toString();
        /*
         * executed if the return of object.constructor.toString() is
         * "[object objectClass]"
         */
        if(str.charAt(0) == '[')
        {
            var arr = str.match(/\[\w+\s*(\w+)\]/);
        } else {
        /*
         * executed if the return of object.constructor.toString() is
         * "function objectClass () {}"
         * for IE Firefox
         */
        var arr = str.match(/function\s*(\w+)/);
            }
        if (arr && arr.length == 2) {
            return arr[1];
        }
    }
    return undefined;
};
var getImageVoidRate = function (image) {
    var canvas = global.tempCanvas;
    var ctx = canvas.getContext('2d');
    //将增加缩小功能
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image,0,0);
    var imagedata = ctx.getImageData(0, 0, image.width, image.height);
    var countAlpha = 0;
    //求左右边界
    for (var x=0; x < imagedata.width; x++) {
        for (var y=0; y < imagedata.height; y++) {
            var index = (y*imagedata.width+x)*4;
            // imagedata.data[index];   // red
            // imagedata.data[index+1]; // green
            // imagedata.data[index+2]; // blue
            countAlpha += imagedata.data[index+3]==0?0:1; // force alpha to 100%
        };
    };
    return countAlpha/(imagedata.width*imagedata.height);
}
/*
 * 引用内容
 * http://hi.baidu.com/xiaoxiaosir/blog/item/557d261f09ecfbffe1fe0b00.html
 */
String.prototype.len=function() {
    return this.replace(/[^\x00-\xff]/g,"rr").length;    
};

function sortNumber(a,b)
{
    return a - b;
}
function rgb2hsb(rgbR, rgbG, rgbB) {  
    // assert 0 <= rgbR && rgbR <= 255; 
    // assert 0 <= rgbG && rgbG <= 255; 
    // assert 0 <= rgbB && rgbB <= 255; 
    var rgb = [rgbR, rgbG, rgbB];  
    rgb = rgb.sort(sortNumber);
    var max = rgb[2];  
    var min = rgb[0];  
  
    var hsbB = max / 255;  
    var hsbS = max == 0 ? 0 : (max - min) / max;  
    var hsbH = 0;  
    if (max == rgbR && rgbG >= rgbB) {  
        hsbH = (rgbG - rgbB) * 60 / (max - min) + 0;  
    } else if (max == rgbR && rgbG < rgbB) {  
        hsbH = (rgbG - rgbB) * 60 / (max - min) + 360;  
    } else if (max == rgbG) {  
        hsbH = (rgbB - rgbR) * 60 / (max - min) + 120;  
    } else if (max == rgbB) {  
        hsbH = (rgbR - rgbG) * 60 / (max - min) + 240;  
    }  
  
    return [hsbH, hsbS, hsbB];  
}  
  
function hsb2rgb(h, s, v) {  
    // assert Float.compare(h, 0.0f) >= 0 && Float.compare(h, 360.0f) <= 0;
    // assert Float.compare(s, 0.0f) >= 0 && Float.compare(s, 1.0f) <= 0;
    // assert Float.compare(v, 0.0f) >= 0 && Float.compare(v, 1.0f) <= 0;
 
    var r = 0, g = 0, b = 0;  
    var i = parseInt((h / 60) % 6);  
    var f = (h / 60) - i;  
    var p = v * (1 - s);  
    var q = v * (1 - f * s);  
    var t = v * (1 - (1 - f) * s);  
    switch (i) {  
    case 0:  
        r = v;  
        g = t;  
        b = p;  
        break;  
    case 1:  
        r = q;  
        g = v;  
        b = p;  
        break;  
    case 2:  
        r = p;  
        g = v;  
        b = t;  
        break;  
    case 3:  
        r = p;  
        g = q;  
        b = v;  
        break;  
    case 4:  
        r = t;  
        g = p;  
        b = v;  
        break;  
    case 5:  
        r = v;  
        g = p;  
        b = q;  
        break;  
    default:  
        break;  
    }  
    return [parseInt(r * 255.0), parseInt(g * 255.0), parseInt(b * 255.0)];  
}  