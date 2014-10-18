var level1offX = 1000;
var level1 = {
    title:"第一章</br>温水 青蛙"
    ,avatarPoint:{x:40,y:677}
    // 诗句
    ,ColorPoint:[
        {div:null,x:40,y:675,width:25,height:25,hue:240,ps:"←→|AD移动"},
        {div:null,x:175,y:675,width:25,height:25,hue:240,ps:"↑|W跳跃"},
        {div:null,x:300,y:675,width:250,height:25,hue:120,ps:"</br>处于温和的环境中</br>感受不到潜在的危险"},
        {div:null,x:650,y:675,width:250,height:25,hue:0,ps:"</br>能做出什么样的选择</br>都是迫于处境的决定</br>"},
        {div:null,x:1975,y:500,width:250,height:25,hue:120,ps:"</br>恭喜你</br>及时做出选择</br>"},
        {div:null,x:level1offX+25,y:25,width:750,height:25,hue:0,ps:"水已经发烫</br>不能再呆下去了</br>"}]
    // 方块
    ,level:[
        [level1offX+0,0,1375,25],
        [level1offX+0,0,25,675],
        [level1offX+25,100,400,25],
        [level1offX+775,25,600,475],
        // [933,505,25,250],
        [level1offX+500,100,275,25],
        [level1offX+207,201,525,25],
        [level1offX+25,200,125,25],
        [level1offX+75,300,250,25],
        [level1offX+400,300,400,25],
        [level1offX+25,400,150,25],
        [level1offX+250,400,525,25],
        [0,650,1000,25]]
    // 事件
    ,eventData:[
        {
            name:"water",
            onlyOnce:false,
            storyMode:false,
            x:level1offX+25,
            y:25,
            width:750,
            height:425,
            judgeType:1,//STAY,
            judgeArg:0,
            callback:function(){
                var pos = [177,208,360,462,751];
                var _x,_y,_width,_height;
                _y = 100;
                var res = parseInt(Math.random()*2);
                if (res==1) {
                    var index = parseInt(Math.random()*5);
                    _x = pos[index]+level1offX;
                }
                else
                {
                    _x = Math.random()* 750 + level1offX+25;
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
            x:level1offX+425,
            y:25,
            width:75,
            height:25,
            judgeType:0,//GETIN,
            judgeArg:0,
            callback:function(){
                global.falildBubble = true;// 进入第一个剧情点
                for (var i = global.BubbleList.length - 1; i >= 0; i--) {
                    global.BubbleList[i].distroy();
                };
                var _poem = getPoem("水已经发烫</br>不能再呆下去了</br>");
                avatar.setExpression("escape");
                this.todolist.addTDL(_poem,TDLItem.prototype.ITEM_TYPE.SCALETO_SIZE,{width:_poem.width,height:_poem.height+400});
            }
        },
        {
            name:"chapterEnd",
            onlyOnce:true,
            storyMode:false,
            x:level1offX+1275,
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
            name:"opendoor",
            onlyOnce:true,
            storyMode:false,
            x:level1offX+825,
            y:500,
            width:50,
            height:25,
            judgeType:0,//GETIN,
            judgeArg:0,
            callback:function(){
                if (global.falildBubble!=true) {
                    this.isRun = 0;
                    return;
                };
                var _tarp = getTrap("gate01");
                this.todolist.addTDL(_tarp,TDLItem.prototype.ITEM_TYPE.MOVETO_POS,{x:_tarp.x,y:_tarp.y+_tarp.height-900});
                // scene.nextChap();
            }
        }]
        // 机关数据
        ,trapData:[
        {
            x:level1offX+933,
            y:505,
            width:25,
            height:250,
            name:"gate01"
        }]
        ,npc:[]
}
var level2 = {
    title:"第二章</br>志同 道合"
    ,avatarPoint:{x:40,y:25}
    ,ColorPoint:[
        {div:null,x:25,y:25,width:100,height:25,hue:240,ps:"遇到新的基友"},
        {div:null,x:575,y:25,width:100,height:25,hue:240,ps:"还有姬友"},
        {div:null,x:1250,y:25,width:100,height:25,hue:240,ps:"以及损友"}
    ]
    ,level:[
        [0,0,2125,25]
        ,[0,0,25,800]
        ,[150,325,125,25]
        ,[475,350,25,25]
        ,[850,275,175,25]
        ,[125,225,25,125]
        ,[1175,350,150,25]
        ,[125,200,125,25]
        ,[250,200,25,125]
        ,[500,325,25,25]
        ,[525,300,100,25]
        ,[625,275,25,25]
        ,[650,250,25,25]
        ,[875,250,125,25]
        ,[900,225,75,25]
        ,[925,200,25,25]
        ,[875,300,50,25]
        ,[950,300,50,25]
        ,[1600,275,525,250]
        ]
    ,eventData:[
        {
            name:"trigger",
            onlyOnce:true,
            storyMode:false,
            x:1525,
            y:25,
            width:50,
            height:25,
            judgeType:0,//GETIN,
            judgeArg:0,
            callback:function(){
                for (var i = 1; i < 7; i++) {
                    var _tarp = getTrap("gate0"+i);
                    if (_tarp!=null) {
                        // var eventObj = this;
                        // var _delay = function(){
                        //     eventObj.todolist.addTDL(_tarp,TDLItem.prototype.ITEM_TYPE.MOVETO_POS,{x:_tarp.x,y:_tarp.y+_tarp.height+600});
                        // }
                        // setTimeout(_delay, 500*i);
                        this.todolist.addTDL(_tarp,TDLItem.prototype.ITEM_TYPE.MOVETO_POS,{x:_tarp.x,y:_tarp.y+_tarp.height+200});
                    };
                };
                
            }
        },
        {
            name:"chapterEnd",
            onlyOnce:true,
            storyMode:false,
            x:2025,
            y:25,
            width:75,
            height:150,
            judgeType:0,//GETIN,
            judgeArg:0,
            callback:function(){
                scene.nextChap();
            }
        }]
    ,trapData:[
        {
            x:1600,
            y:25,
            width:100,
            height:250,
            name:"gate01"
        },
        {
            x:1700,
            y:25,
            width:100,
            height:250,
            name:"gate02"
        },
        {
            x:1800,
            y:25,
            width:100,
            height:250,
            name:"gate03"
        },
        {
            x:1900,
            y:25,
            width:100,
            height:250,
            name:"gate04"
        },
        {
            x:2000,
            y:25,
            width:100,
            height:250,
            name:"gate05"
        },
        {
            x:2100,
            y:25,
            width:100,
            height:250,
            name:"gate06"
        }]
    ,npc:[{
        ai:1    // 捣乱
        ,color:"rgb(255,250,93)"
        ,imgUrl:null//"Image/Anger.png"
        ,x:1500
        ,y:100
        ,width:50
        ,height:50
        }
        ,{
        ai:0    // 调戏多次后跟随
        ,color:"rgb(241,157,188)"
        ,imgUrl:null//"Image/Shame.png"
        ,x:600
        ,y:100
        ,width:50
        ,height:50
        }
        ,{
        ai:2    // 直接跟随
        ,color:"rgb(93,255,254)"
        ,imgUrl:null//"Image/Excited.png"
        ,x:175
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
var leveltest = {
    title:"第?章</br>基友"
    ,avatarPoint:{x:40,y:677}
    ,ColorPoint:[]
    ,level:[
        [0,0,1025,25]
        ,[0,0,25,800]
        ,[150,100,400,25]
        ,[206,125,100,25]
        ,[550,25,75,325]
        ,[700,300,325,50]
        ]
    ,eventData:[
        {
            name:"water",
            onlyOnce:false,
            storyMode:false,
            x:25,
            y:25,
            width:525,
            height:50+275,
            judgeType:1,//STAY,
            judgeArg:0,
            callback:function(){
                if (global.storySchedule!=1) {return};
                var _x,_y,_width,_height;
                _y = 25;
                _x = Math.random()* 525 + 25;
                _width = 25 + Math.random()*25;
                _height = _width;
                new Bubble(_x,_y,_width,_height);
                this.protectTime = 30;
            }
        },
        {
            name:"soap",
            onlyOnce:true,
            storyMode:false,
            x:475,
            y:125,
            width:50,
            height:50,
            judgeType:0,//GETIN,
            judgeArg:0,
            callback:function(){
                global.flag.setItem(0);
                // var _evt = getEvent("water");
                // this.todolist.addTDL(_evt,TDLItem.prototype.ITEM_TYPE.SCALETO_SIZE,{width:_evt.width,height:_evt.height+275});
            }
        },
        {
            name:"chapterEnd",
            onlyOnce:true,
            storyMode:false,
            x:925,
            y:25,
            width:75,
            height:150,
            judgeType:0,//GETIN,
            judgeArg:0,
            callback:function(){
                scene.nextChap();
            }
        },
        {
            name:"trigger",
            onlyOnce:true,
            storyMode:false,
            x:925,
            y:350,
            width:50,
            height:25,
            judgeType:0,//GETIN,
            judgeArg:0,
            callback:function(){
                var _tarp = getTrap("gate01");
                if (_tarp!=null) {
                    this.todolist.addTDL(_tarp,TDLItem.prototype.ITEM_TYPE.MOVETO_POS,{x:_tarp.x+_tarp.width+100,y:_tarp.y});
                };
            }
        }]
    ,trapData:[
        {
            x:625,
            y:300,
            width:75,
            height:50,
            name:"gate01"
        }]
    ,npc:[
        {
            ai:2    // 直接跟随
            ,color:"rgb(93,255,254)"
            ,imgUrl:null//"Image/Excited.png"
            ,x:200
            ,y:25
            ,width:50
            ,height:50
        }
        ]
}
// 基础备份
var base = {
    title:"第三章</br>托付 未来"
    ,avatarPoint:{x:40,y:677}
    ,ColorPoint:[]
    ,level:[
        [0,0,1500,25],
        [0,0,25,800]]
    ,eventData:[]
    ,trapData:[]
    ,npc:[]
}
// var levelData = [level1,level2,level3];
var levelData = [level1,leveltest,level2];
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