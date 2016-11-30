/**
 * Created by Administrator on 2015/5/21.
 */
(function(){
    var Canvas = function(){
        this.config = {
            id:'canvas',
            width:window.innerWidth,
            height:window.innerHeight
        };
        this.canvas = document.getElementById(this.config.id);
    };
    Canvas.prototype = {
        initCanvas:function(config){
            var self = this;
            self.dealSetting(config);

            self.canvas = self.findCanvas(self.config.id);
            self.setSize(self.config.width, self.config.height);

            console.log('\u0031\u0032\u0030\u0033\u51fa\u54c1');
            return self.canvas;
        },
        dealSetting:function(setting){
            if(setting){
                for ( var property in setting) {
                    this.config[property] = setting[property];
                }
            }
        },
        findCanvas:function(id){
            return document.querySelector('canvas[id='+id+']')?document.querySelector('canvas[id='+id+']'):this.createCanvas(id);
        },
        createCanvas:function(id){
            var canvas = document.createElement('canvas');
            canvas.id = id;
            document.body.appendChild(canvas);
            return canvas;
        },
        setSize:function(width, height){
            if(this.canvas){
                this.canvas.setAttribute('width', width+'px');
                this.canvas.setAttribute('height', height+'px');
            }else{
                alert('not found canvas!');
            }
        }
    };

    window.setCanvas = function(config){
        return new Canvas().initCanvas(config);
    };
})();

