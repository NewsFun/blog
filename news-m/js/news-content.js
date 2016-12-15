/**
 * Created by bobo on 2016/11/25.
 */
$(document).ready(function(){
    var audio = new Bo.Audio(),
        audioBtn = $('.audio'),
        openClass = 'icon-play',
        closeClass = 'icon-pause',
        uri = 'http://tmisc.home.news.cn/tts/',
        gid = Bo.gid,
        title = $('b.title').text();
    //var testUrl = 'http://tmisc.home.news.cn/tts/61/129392661.mp3';
    function play(){
        audioBtn.on('touchstart', function(){
            changeState($(this));
        });
    }
    function changeState(tg){
        var play = tg.hasClass(openClass);
        if(play){
            tg.removeClass(openClass).addClass(closeClass);
            var arg = {
                src:getUrl(),
                //src:testUrl,
                title:title
            };
            audio.play(arg);
        }else{
            tg.removeClass(closeClass).addClass(openClass);
            audio.pause();
        }
        audio.close(function(){
            if(tg.hasClass(closeClass)) tg.removeClass(closeClass).addClass(openClass);
        });
    }
    function getUrl(){
        var dir = '', url = '';
        if(gid){
            dir = gid%200;
            url = uri+dir+'/'+gid+'.mp3';
        }else{
            url = '';
            console.log('未找到稿件id');
        }
        return url;
    }
    play();
});