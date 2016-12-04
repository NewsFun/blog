/**
 * Created by Administrator on 2015/5/21.
 */
(function(){
    /*获取浏览器大小*/
    var getWindow = function(){
        var windowWidth = 0, windowHeight = 0;
        if(typeof(window.innerWidth) == 'number'){
            windowWidth = window.innerWidth;
            windowHeight = window.innerHeight;
        }else{
            if(document.documentElement && document.documentElement.clientWidth){
                windowWidth = document.documentElement.clientWidth;
                windowHeight = document.documentElement.clientHeight;
            }else{
                if (document.body && document.body.clientWidth){
                    windowWidth = document.body.clientWidth;
                    windowHeight = document.body.clientHeight;
                }
            }
        }

        return { wt:windowWidth, ht:windowHeight };
    };
    var ch = getWindow().ht,
        cw = getWindow().wt;
    /*画布初始化，宽高自动最大*/
    window.setCanvas = function(){
        var canvas = document.getElementById('myCanvas');

        canvas.setAttribute('width', cw+'px');
        canvas.setAttribute('height', ch+'px');

        console.log('\u0031\u0032\u0030\u0033\u51fa\u54c1');
        return canvas;
    };
})();

