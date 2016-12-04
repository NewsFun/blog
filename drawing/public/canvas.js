/**
 * Created by bobo on 2016/8/1.
 */
var W = window.innerWidth, H = window.innerHeight;
var canvas = setCanvas();
var ctx = canvas.getContext('2d'), CW = canvas.width, CH = canvas.height;
var drag = false, points = [];
var socket = io();

ctx.lineCap = 'round';
/*----------功能函数----------*/
function $(id){
    var node = document.querySelectorAll(id);
    return node.length>1?node:document.querySelector(id);
}
function tools(clazz){
    switch (clazz){
        case '1px':
        case '5px':
        case '10px':
            break;
        case 'red':
        case 'blue':
        case 'green':
            break;
        case'reset':
            ctx.clearRect(0, 0, W, H);
            break;
    }
}
function mousePosition(ev){
    var e = ev.touches?ev.touches[0]:ev;
    var rect = canvas.getBoundingClientRect();
    return {
        mx: e.clientX-rect.left * (CW / rect.width),
        my: e.clientY-rect.top * (CH / rect.height)
    };
}
function setCanvas(){
    var canvas = $('#canvas');
    canvas.setAttribute('width', W+'px');
    canvas.setAttribute('height', H+'px');

    console.log('\u0031\u0032\u0030\u0033\u51fa\u54c1');
    return canvas;
}
function getStart(data){
    ctx.strokeStyle = 'black';//空心
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(data.mx, data.my);
}
function drawLine(data) {
    ctx.lineTo(data.mx, data.my);
    ctx.stroke();//显示线条
}
function operate(ev){
    var mp;
    switch (ev.type){
        case 'touchstart':
        case 'mousedown':{
            ev.preventDefault();
            mp = mousePosition(ev);
            drag = true;
            getStart(mp);
            points.push(mp);
        }break;
        case 'touchend':
        case 'mouseup':{
            drag = false;
        }break;
        case 'touchmove':
        case 'mousemove':{
            ev.preventDefault();
            mp = mousePosition(ev);
            if(drag){
                drawLine(mp);
                points.push(mp);
            }
        }break;
        default :break;
    }
}
function getMessage(data){
    // console.log(data[0]);
    ctx.moveTo(data[0].mx, data[0].my);
    for (var i = 1; i<data.length; i++) {
        drawLine(data[i]);
    }
}
/*--------------event-------------*/
$('#tools').addEventListener('click', function(ev){
    var target = ev.target;
    tools(target.className);
});
canvas.addEventListener('mousedown', operate);
canvas.addEventListener('mouseup', operate);
canvas.addEventListener('mousemove', operate);

canvas.addEventListener('touchstart', operate);
canvas.addEventListener('touchend', operate);
canvas.addEventListener('touchmove', operate);
/*-------------chat---------------*/
setInterval(function(){
    socket.emit('new message', points);
    points = [];
}, 500);
socket.on('new message', function(data) {
    if(drag) return;
    var pts = data.message;
    if(pts.length>0){
        // console.log(pts);
        getMessage(pts);
    }
});