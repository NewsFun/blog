/**
 * Created by bobo on 2016/11/23.
 */
$(document).ready(function(){
    function Search(){
        var self = this;
        this.playClass='icon-pause';
        this.stopClass='icon-audio';
        this.audioList = $('.audio');
        this.baseUrl = 'http://tmisc.home.news.cn/tts/';
        //this.src = 'http://tpic.home.news.cn/newsMp3/xhvedio003/M00/0A/DE/wKhMElfL8M8EAAAAAAAAAAAAAAA063.mp3';
        this.audio = new Bo.Audio('.bo-main');
        this.init = function(){
            self.initClick();
        };
    }
    Search.prototype = {
        initClick:function(){
            var self = this;
            self.audioList.on('click', function(){
                $(this).hasClass(self.stopClass)&&self._play($(this));
            });
            self.stop();
        },
        _play:function(tg){
            var self = this;
            var src = self._getUrl(tg), title = tg.prev().text();
            self.audioList.each(function(){
                $(this).removeClass(self.playClass).addClass(self.stopClass);
            });
            tg.removeClass(self.stopClass).addClass(self.playClass);
            self.audio.play({
                title:title,
                src:src
            });
        },
        stop:function(){
            var self = this;
            self.audio.on('close',function(){
                self.audioList.each(function(){
                    $(this).hasClass(self.playClass)&&$(this).removeClass(self.playClass).addClass(self.stopClass);
                });
            });
        },
        _getUrl: function(tg){
            var self = this, dir = '', url = '', gid = tg.data('src');
            if(gid){
                dir = gid%200;
                url = self.baseUrl+dir+'/'+gid+'.mp3';
            }else{
                url = '';
                console.log('未找到稿件id');
            }
            return url;
        }
    };
    new Search().init();
});