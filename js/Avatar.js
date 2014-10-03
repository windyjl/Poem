function Avatar(x,y){
    this.id             = Avatar.prototype.id++;
    this.x              = x || 0;
    this.y              = y || 0;
    this.tempX			= 0;
    this.tempY			= 0;
    this.width;
    this.height;
    this.speed          = {x:0,y:0};
    this.power          = {x:0,y:0};
    this.img			= null;
	this.jq			    = null;	//JQ对象
	this.touchX0		= null;	//拖动起点坐标
	this.touchY0		= null;
	this.offx			= 0;
	this.offy			= 0;
    //转身标记
    this.schedule       = 0;       //转身进度标识

	//逻辑变量
	this.isOnAssociable = false;	//不在指定关系层级范围内的想法 不显示
	this.isOnScreen		= false;	//离开屏幕范围的相符 不绘制
	this.isCompelete	= false;	//想法是否已经完成
	this.isClick        = true;	//区别鼠标“拖动”操作和“点击”的操作
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

    // jq = document.createElement('div');
    this.jq.object = this;
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
//静态成员变量
Avatar.prototype.id = 0;