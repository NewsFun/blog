/**
 * Created by bobo on 2015/5/22.
 */
var W = window.innerWidth, H = window.innerHeight;
var canvas = setCanvas();
var ctx = canvas.getContext('2d'), CW = canvas.width, CH = canvas.height;
ctx.lineCap = 'round';
/*----------绘图方法----------*/
var layout = {
    pencil:function(){
        var pos = {x:10, y:10, width:200, height:100};
        tools('images/pencil.png', pos.x, pos.y, pos.width, pos.height);
        return pos;
    },
    paper:function(){
        var pos = {x:300, y:0, width:CW-400, height:CH-100};
        tools('images/paper.jpg', pos.x, pos.y, pos.width, pos.height);
        return pos;
    },
    eraser:function(){
        var pos = {x:10, y:110, width:200, height:80};
        tools('images/eraser.png', pos.x, pos.y, pos.width, pos.height);
        return pos;
    }
};
/*----------功能函数----------*/
function tools(src, x, y, width, height){
    var tools = new Image();
    tools.src = src;
    tools.onload = function dt(){
        (width && height)?ctx.drawImage(tools, x, y, width, height):ctx.drawImage(tools, x, y);
    };
}
function mousePosition(ev){
    var rect = canvas.getBoundingClientRect();
    return {
        mx: ev.clientX-rect.left * (CW / rect.width),
        my: ev.clientY-rect.top * (CH / rect.height)
    }
}
function setCanvas(){
    var canvas = document.getElementById('myCanvas');
    canvas.setAttribute('width', W+'px');
    canvas.setAttribute('height', H+'px');

    console.log('\u0031\u0032\u0030\u0033\u51fa\u54c1');
    return canvas;
}
/*----------执行方法----------*/
var pcPos = layout.pencil();
var esPos = layout.eraser();
var ppPos = layout.paper();
//console.log(paperPos);

/*----------事件----------*/
canvas.onmousedown = function md(e){
    var mp = mousePosition(e);
    this.drag = true;
    if( mp.mx>ppPos.x &&
        mp.mx<ppPos.x+ppPos.width &&
        mp.my>ppPos.y &&
        mp.my<ppPos.y+ppPos.height
    ){
        ctx.strokeStyle = 'black';//空心
        ctx.lineWidth = 20;
        //ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(mp.mx, mp.my);
    }
};
canvas.onmouseup = function mu(e){
    this.drag = false;
};
canvas.onmousemove = function mv(e){
    var mp = mousePosition(e);
    if(this.drag &&
        mp.mx>ppPos.x &&
        mp.mx<ppPos.x+ppPos.width &&
        mp.my>ppPos.y &&
        mp.my<ppPos.y+ppPos.height
    ){
        ctx.lineTo(mp.mx, mp.my);
        ctx.stroke();//显示线条
    }
};
canvas.click = function(e){
    var mp = mousePosition(e);
    if(mp.mx>pcPos.x && mp.mx<pcPos.x+pcPos.width && mp.my>pcPos.y && mp.my<pcPos.height){
        console.log('pencil');
    }else if(mp.mx>esPos.x && mp.mx<esPos.x+esPos.width && mp.my>esPos.y && mp.my<esPos.y+esPos.height){
        console.log('eraser');
    }
};