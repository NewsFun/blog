/**
 * Created by bobo on 2016/12/7.
 */
(function(global){
    if(!global.Bo) global.Bo = {};

    var HREF = document.location.href;
    //var HREF = 'http://mobile.news.cn/2016-12/07/c_129395384.htm';
    var gid = HREF.match(/.*_(\d+)\.htm/),
        meta = $('meta[name="keywords"]').attr('content'),
        color = ['pink', 'blue', 'purple'],
        keyBox = $('.bo-keyword'),
        box = keyBox.find('ul');
    Bo.getGid = function (){
        gid?Bo.gid = gid[1]:Bo.gid = 129395384;
        return Bo;
    };
    Bo.initPage = function(){
        initKeywords();
        initRecommend();
        return Bo;
    };
    function initRecommend(){
        var recommend = $('.bo-recommend'), lis = recommend.find('li');
        if(lis.length<1) recommend.hide();
    }
    function initKeywords(){
        meta?addKeywords():keyBox.hide();
    }
    function addKeywords(){
        var html = '',
            keywords = meta.split(',');
        for(var i = 0;i<keywords.length;i++){
            html += '<li><a><span class="bg-'+color[i]+'">'+keywords[i]+'</span></a></li>';
        }
        box.append(html);
    }
    Bo.getGid().initPage();
})(window);