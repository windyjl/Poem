var level1 = {
    title:"第一章</br>温水 青蛙"
    ,avatarPoint:{x:40,y:677}
    // 诗句
    ,ColorPoint:[
        {div:null,x:40,y:675,width:25,height:25,hue:240,ps:"←→|AD移动"},
        {div:null,x:175,y:675,width:25,height:25,hue:240,ps:"↑|W跳跃"},
        {div:null,x:25,y:25,width:750,height:75,hue:0,ps:"火锅已经发烫</br>不能再呆下去了</br>"}]
    // 方块
    ,level:[
        [0,0,1375,25],
        [0,0,25,800],
        [25,100,400,25],
        [775,25,600,475],
        // [933,505,25,250],
        [500,100,275,25],
        [207,201,525,25],
        [25,200,125,25],
        [75,300,250,25],
        [400,300,400,25],
        [25,400,150,25],
        [250,400,525,25],
        [25,650,175,25]]
    // 事件
    ,eventData:[
        {
            name:"water",
            onlyOnce:false,
            storyMode:false,
            x:25,
            y:125,
            width:750,
            height:325,
            judgeType:1,//STAY,
            judgeArg:0,
            callback:function(){
                var pos = [177,208,360,462,751];
                var _x,_y,_width,_height;
                _y = 100;
                var res = parseInt(Math.random()*2);
                if (res==1) {
                    var index = parseInt(Math.random()*5);
                    _x = pos[index];
                }
                else
                {
                    _x = Math.random()* 750 + 25;
                }
                _width = 25 + Math.random()*25;
                _height = _width;
                new Bubble(_x,_y,_width,_height);
                this.protectTime = 30;
            }
        },
        {
            name:"cognition",
            onlyOnce:true,
            storyMode:false,
            x:425,
            y:100-1,
            width:75,
            height:25,
            judgeType:0,//GETIN,
            judgeArg:0,
            callback:function(){
                global.storySchedule = 1;// 进入第一个剧情点
                for (var i = global.BubbleList.length - 1; i >= 0; i--) {
                    global.BubbleList[i].distroy();
                };
                var _poem = getPoem("火锅已经发烫</br>不能再呆下去了</br>");
                this.todolist.addTDL(_poem,TDLItem.prototype.ITEM_TYPE.SCALETO_SIZE,{width:_poem.width,height:_poem.height+350});
            }
        },
        {
            name:"chapterEnd",
            onlyOnce:true,
            storyMode:false,
            x:1275,
            y:500,
            width:75,
            height:150,
            judgeType:0,//GETIN,
            judgeArg:0,
            callback:function(){
                scene.nextChap();
            }
        },
        {
            name:"xxx",
            onlyOnce:true,
            storyMode:false,
            x:825,
            y:500,
            width:50,
            height:25,
            judgeType:0,//GETIN,
            judgeArg:0,
            callback:function(){
                if (global.storySchedule!=1) {
                    this.isRun = 0;
                    return;
                };
                var _tarp = getTrap("gate01");
                this.todolist.addTDL(_tarp,TDLItem.prototype.ITEM_TYPE.MOVETO_POS,{x:_tarp.x,y:_tarp.y+_tarp.height+100});
                // scene.nextChap();
            }
        }]
        // 机关数据
        ,trapData:[
        {
            x:933,
            y:505,
            width:25,
            height:250,
            name:"gate01"
        }]
        ,npc:[]
}
var level2 = {
    title:"第二章</br>志同 道合"
    ,avatarPoint:{x:40,y:677}
    ,ColorPoint:[]
    ,level:[
        [0,0,1375,25],
        [0,0,25,800]]
    ,eventData:[]
    ,trapData:[]
    ,npc:[{
        ai:2
        ,color:"rgb(0,255,0)"
        ,x:100
        ,y:100
        ,width:50
        ,height:50
        }
    ]
}
var level3 = {
    title:"第三章</br>托付 未来"
    ,avatarPoint:{x:40,y:677}
    ,ColorPoint:[]
    ,level:[
        [0,0,1375,25],
        [0,0,25,800]]
    ,eventData:[]
    ,trapData:[]
    ,npc:[]
}
var levelData = [level1,level2,level3];
/*
title
avatarPoint
ColorPoint
level
eventData
        {
            name:"xxx",
            onlyOnce:true,
            storyMode:false,
            x:1275,
            y:500,
            width:75,
            height:150,
            judgeType:0,//GETIN,
            judgeArg:0,
            callback:function(){
                scene.nextChap();
            }
        }
trapData
npc{ai,color,x,y,width,height}// 表情交给ai
*/