function Script(){
}
Script.prototype.init    = function(){
}

//ToDoList机制——再现！
//MOVETO_POS时 argu1 为{x:?,y:?}
function TDLItem(target,type,argu1,argu2)
{
    this.isRun      = false;    // 执行中标志，大部分指令只用执行一次。其他需要反复调整
    this.isDone     = false;
    this.target     = target;
    this.type       = type;
    this.itemArgu1  = argu1;
    this.itemArgu2  = argu2;    // 备用
    this.runTimes   = 0;
}
TDLItem.prototype.ITEM_TYPE = {
     MOVETO_POS     :0
    ,MOVEBY_TIME    :1
    ,MOVEBY_DIS     :2
    ,MOVEBY_SPEED   :3
    ,JUMP           :4
    ,WAITBY_TIME    :5
    ,WAITBY_POS     :6
    ,WAITBY_SPEED   :7
    ,RESET_AVATAR   :8
    ,RESET_SPEED    :9
    ,RESET_POWER    :10
    ,SCALETO_SIZE   :11
}
TDLItem.prototype.doItem    = function(){
    this.isRun = true;
    var targetClass = getObjectClass(this.target);
    switch(this.type){
    case this.ITEM_TYPE.MOVETO_POS:
    var _spd = 5;
    if (this.target.x<this.itemArgu1.x) {
        _spd = 5;
    }
    else if (this.target.x>this.itemArgu1.x+this.target.width) {
        _spd = -5
    }
    if (targetClass=="Avatar") {
        this.target.movespeed.x = _spd;
    }
    else if (targetClass=="Bubble"){
        this.target.speed.x = _spd;
    }
    else {
        moveXtoTargetPos(this.target,this.itemArgu1);
        moveYtoTargetPos(this.target,this.itemArgu1);
        this.target.locateCSS();
    }
    break;
    case this.ITEM_TYPE.MOVEBY_TIME:
    break;
    case this.ITEM_TYPE.MOVEBY_DIS:
    break;
    case this.ITEM_TYPE.MOVEBY_SPEED:
    break;
    case this.ITEM_TYPE.JUMP:
    break;
    case this.ITEM_TYPE.WAITBY_TIME:
    break;
    case this.ITEM_TYPE.WAITBY_POS:
    break;
    case this.ITEM_TYPE.WAITBY_SPEED:
    break;
    case this.ITEM_TYPE.RESET_AVATAR:
    break;
    case this.ITEM_TYPE.RESET_SPEED:
    this.target.movespeed = {x:0,y:0};
    break;
    case this.ITEM_TYPE.RESET_POWER:
    break;
    case this.ITEM_TYPE.SCALETO_SIZE:
        scaleWidthtoTargetPos(this.target,this.itemArgu1,0.5);
        scaleHeighttoTargetPos(this.target,this.itemArgu1,0.5);
        this.target.jq.css({
            width:this.target.width,
            height:this.target.height
        });
        this.target.locateCSS();
    break;
    default:
    this.isRun = false;
    }
}
TDLItem.prototype.checkEnd  = function(){
    switch(this.type){
    case this.ITEM_TYPE.MOVETO_POS:
    if (this.target.x+this.target.width>=this.itemArgu1.x && this.target.x<=this.itemArgu1.x &&
        this.target.y+this.target.height>=this.itemArgu1.y && this.target.y<=this.itemArgu1.y)
    {
        this.isDone = true;
        return true;
    };

    break;
    case this.ITEM_TYPE.MOVEBY_TIME:
    break;
    case this.ITEM_TYPE.MOVEBY_DIS:
    break;
    case this.ITEM_TYPE.MOVEBY_SPEED:
    break;
    case this.ITEM_TYPE.JUMP:
    break;
    case this.ITEM_TYPE.WAITBY_TIME:
    break;
    case this.ITEM_TYPE.WAITBY_POS:
    break;
    case this.ITEM_TYPE.WAITBY_SPEED:
    break;
    case this.ITEM_TYPE.RESET_AVATAR:
    break;
    case this.ITEM_TYPE.RESET_SPEED:
    if (this.isRun) {return true};
    break;
    case this.ITEM_TYPE.RESET_POWER:
    break;
    case this.ITEM_TYPE.SCALETO_SIZE:
    if ((this.target.height==this.itemArgu1.height
        &&this.target.width==this.itemArgu1.width)) {
        return true;
    };
    break;
    }
    return false;
}
// 
function ToDoList(){
    this.List   = [];
    this.isRun  = false;    //启动标志，行动完成前，Event对象不响应
    this.isDone = false;
}
ToDoList.prototype.reset    = function(){
    this.isRun  = false;
    this.isDone = false;
    this.List   = [];
}
ToDoList.prototype.init     = function(){
}
ToDoList.prototype.doTDL    = function(){
    if (this.List.length==0) {
        this.isDone = true;
        return false;
    };
    // 检查当前TDL ITEM是否完成
    if(this.List[0].checkEnd())
        this.List.shift();    
    // 是则更换下一个
    // 没有下一个则返回TDL完成
    if (this.List.length==0) {
    // 完成后解除TDL.isRun状态，可重复触发
        this.isDone = true;
        return true;
    }
    else
    {
        this.List[0].doItem();
    }

}
ToDoList.prototype.addTDL   = function(target,type,argu){
    this.List.push(new TDLItem(target,type,argu));
}
// 重用方法
moveXtoTargetPos    = function(self,target,unitDis){
    if (Math.abs(self.x-target.x)<5) {
        self.x = target.x;
    }
    else if (target.x-self.x<0) {
        self.x += 5  
    }
    else if (target.x-self.x>0) {
        self.x -= 5;
    };
}
moveYtoTargetPos    = function(self,target,unitDis){
    if (Math.abs(self.y-target.y)<5) {
        self.y = target.y;
    }
    else if (target.y-self.y<0) {
        self.y += 5  
    }
    else if (target.y-self.y>0) {
        self.y -= 5;
    };
}

scaleWidthtoTargetPos    = function(self,target,unitDis){
    if (Math.abs(self.width-target.width)<unitDis) {
        self.width = target.width;
    }
    else if (target.width-self.width>0) {
        self.width += unitDis  
    }
    else if (target.width-self.width<0) {
        self.width -= unitDis;
    };
}
scaleHeighttoTargetPos    = function(self,target,unitDis){
    if (Math.abs(self.height-target.height)<unitDis) {
        self.height = target.height;
    }
    else if (target.height-self.height>0) {
        self.height += unitDis  
    }
    else if (target.height-self.height<0) {
        self.height -= unitDis;
    };
}