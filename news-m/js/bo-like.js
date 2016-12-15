/**
 * Created by bobo on 2016/11/30.
 */
$(document).ready(function(){
    function Like(){
        var self = this;
        this.su = 'http://dz.news.cn/ai?id='+Bo.gid+'&a=g&v=1&t=0';
        this.gu = 'http://dz.news.cn/gi?id='+Bo.gid+'&a=g&v=1&t=0';
        this.inc = null;
        this.num = 0;
        this.likes = $('.bo-like');
        this.r = true;
        this.go = true;
        this.interval = 1000;
        var init = function(){
            self.addLikeDom();
            self.initClick();
            self.getNum();
        };
        init();
    }
    Like.prototype = {
        initClick:function(){
            var self = this;
            self.likes.on('touchstart', function(){
                if(self.go) self.animate($(this));
                if(self.r){
                    self.r = false;
                    self.updateLike(self.su, self.getNum.bind(self));
                    self.num ++;
                    self.inc.html(self.num);
                }
            });
        },
        animate:function(tg){
            var self = this;
            tg.addClass('dot');
            self.go = false;
            setTimeout(function(){
                tg.removeClass('dot');
                self.go = true;
            }, 600);
        },
        addLikeDom:function(){
            var self = this, html = '<span class="inc"></span>';
            self.likes.each(function(){
                $(this).append(html);
                self.inc = $(this).find('.inc');
            });
        },
        getNum:function(){
            var self = this;
            self.updateLike(self.gu, self.setLikeNum.bind(self));
        },
        updateLike:function(url, callback){
            $.ajax({
                type:'get',
                url:url,
                dataType:'jsonp',
                success:function(data){
                    if(callback) callback(data);
                }
            });
        },
        setLikeNum:function(data){
            var self = this;
            if(data){
                self.inc.html(data.g);
                self.num = data.g;
            }
        }
    };
    new Like();
});