/**
 * Created by bobo on 2016/12/6.
 */
$(function(){
    function ToTop(){
        this.body = $('body');
        this.tot = $('#to-top');
        this.toTop = 0;
    }
    ToTop.prototype = {
        initClick:function(){
            var self = this;
            self.tot.on('click', function(){
                self.body.animate({
                    scrollTop:0
                });
                self.tot.removeClass('on');
            });
            self.body.on('touchend', function(e){
                self.toTop = $(window).scrollTop();
                //console.log(self.toTop);
                (self.toTop>100)?self.tot.addClass('on'):self.tot.removeClass('on');
            });
        }
    };

    new ToTop().initClick();
});