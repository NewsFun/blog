/**
 * Created by bobo on 2016/11/25.
 */
$(function(){
    function Slide(){
        this.block = $('#slide-block');
        this.touch = false;
        this.pageX = 0;
        this.domData = this._getXRange();
        this.step = 1;
        this.range = {min:0,max:10}
    }
    Slide.prototype = {
        on:function(state, callback){
            var self = this;
            if(state == 'move'){
                self.drag(callback);
            }
        },
        drag:function(callback){
            var self = this;
            self.block.on('touchstart', function(){
                self.touch = true;
            });
            self.block.on('touchmove', function(e){
                if(self.touch){
                    e.preventDefault();
                    var touch = e.touches[0];
                    var pageX = touch.pageX;
                    var range = self.domData;
                    if(pageX>=range.minX&&pageX<=range.maxX){
                        self.block.css({
                            "left":pageX
                        });
                        self.pageX = pageX;
                        if(callback) callback();
                    }
                }
            });
            self.block.on('touchend', function(){
                self.touch = false;
            });
        },
        _getXRange:function(){
            var self = this,
                w = self.block.width(),
                way = self.block.prev('.slide-way'),
                ww = way.width(),
                l = way.offset().left;
            var min = ~~l, max = ~~(l+ww-w), xr = ~~(ww-w);
            //console.log(max);
            return{
                minX:min,
                maxX:max,
                xRange:xr
            }
        },
        setRange:function(range){
            var self = this;
            if(range) self.range = range;
            self._setStep(self.range);
        },
        getRange:function(){
            return (this.pageX-this.domData.minX)*this.step+this.range.min;
        },
        setValue:function(value){
            var self = this;
            var left = (value-self.range.min)/self.step+self.domData.minX;
            self.block.css('left', left);
        },
        _setStep:function(range){
            var self = this;
            var min = range.min,
                max = range.max,
                scope = max-min,
                xr = self.domData.xRange;
            self.step = scope/xr;
        }
    };

    function SetFont(){
        this.s = new Slide();
        this.range = {min:12,max:20};
        this.setBtn = $('#set-font');
        this.setBox = $('#JS-font');
        this.header = $('#header');
        this.icons = this.setBox.find('.icon-font');
        this.setting = false;
        this.init = function(){
            var self = this;
            self.s.setRange(self.range);
            self.s.drag(function(){
                var fs = ~~(self.s.getRange());
                self.setFont(fs);
            });
            self.setBtnClick();
            self.fontBtnClick();
        }
    }
    SetFont.prototype = {
        setFont:function(n){
            $('html').css({
                "font-size":n+'px'
            });
            this.s.setValue(n);
        },
        setBtnClick:function(){
            var self = this;
            self.setBtn.on('touchstart', function(){
                if(!self.setting){
                    self.header.css('background', 'white');
                    self.setBox.css('height', '120px');
                }else{
                    self.setBox.css('height', '0');
                    self.header.removeAttr('style');
                }
                self.setting = !self.setting;
            });
        },
        fontBtnClick:function(){
            var self = this;
            self.icons.on('touchstart', function(){
                var s = self.range.min, b = self.range.max, m = ~~((s+b)/2);
                if($(this).hasClass('font-s')){
                    self.setFont(s);
                }else if($(this).hasClass('font-m')){
                    self.setFont(m);
                }else if($(this).hasClass('font-b')){
                    self.setFont(b);
                }
            });
        }
    };
    new SetFont().init();
});