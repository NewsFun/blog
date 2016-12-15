/**
 * Created by bobo on 2016/11/22.
 */
(function(window){
    function BoAudio(box, arg){
        var self = this;
        this.parent = $(box||'body');
        this.box = $('#JS-audio');
        this.old = {src:'',title:''};
        this.states = this.initConfig(arg);
        this.audio = new Audio();
        var init = function(){
            self.use('audio.css');
            self.addAudioBox();
            if(self.states.autoPlay) self.play({
                src:self.states.src,
                title:self.states.title
            }, self.states.play);
        };
        init();
    }
    BoAudio.prototype = {
        initConfig:function(param){
            var con = {
                src:'',
                title:'未知音频',
                autoPlay:false,
                play:null,
                pause:null,
                close:null
            };
            for(var i in param){
                con[i] = param[i];
            }
            return con;
        },
        getPath:function(){
            var script = $('script'), src = '';
            script.each(function(){
                var s = $(this).attr('src');
                if(s && s.indexOf('audio.js')>-1){
                    src = s.substring(0, s.lastIndexOf("/") + 1);
                }
            });
            return src;
        },
        use: function (src) {
            var path = this.getPath();
            $('head').append('<link rel="stylesheet" href="'+path+src+'">');
        },
        addAudioBox:function(){
            var self = this;
            if(self.box.length<1){
                var html = '<div id="JS-audio"><div class="ui-audio"><div id="JS-audio-title"></div><div id="JS-audio-close"></div></div></div>';
                self.parent.append(html);
                self.box = $('#JS-audio');
            }
            //self.setPosition();
            self.close();
        },
        play:function(param, callback){
            var self = this;
            if(param) self.states = self.initConfig(param);
            var src = self.states.src,
                tle = self.states.title,
                cbk = callback || self.states.play;
            self.loadAudio(src, function(){
                self.audio.play();
                if(self.old.src != src){
                    self._show(tle);
                    self.old = self.states;
                }
            });
            if(cbk) cbk();
        },
        pause:function(callback){
            var self = this, cbk = callback||self.states.pause;
            self.audio.played && self.audio.pause();
            if(cbk) cbk();
        },
        close:function(callback){
            var self = this, cbk = callback||self.states.close;
            $('#JS-audio-close').on('click', function(){
                self.audio.pause();
                self.box.css({
                    height:'0'
                });
                self.old = {};
                if(cbk) cbk();
            });
        },
        setPosition:function(){
            var self = this;
            var w = self.parent.width(),
                h = self.parent.height(),
                l = self.parent.offset().left,
                t = self.parent.offset().top;
            self.box.css({
                //width:w+'px',
                //left:l+'px'
            });
        },
        on:function(state, data){
            var self = this;
            switch(state){
                case 'play':
                    self.play(data);
                    break;
                case 'pause':
                    self.pause(data);
                    break;
                case 'close':
                    self.close(data);
                    break;
                default :break;
            }
        },
        _show:function(title){
            var self = this;
            self.box.css({
                height:'50px'
            });
            $('#JS-audio-title').text(title);
        },
        loadAudio:function(src, callback){
            var self = this;
            self.audio.src = src;
            self.audio.onloadedmetadata = callback;
        }
    };
    if(!window.Bo) window.Bo = {};
    Bo.Audio = BoAudio;
})(window);