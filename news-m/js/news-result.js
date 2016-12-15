/**
 * Created by bobo on 2016/12/6.
 */
$(document).ready(function(){
    var dat = $('#data'),
        doc = $(document),
        win = $(window),
        body = $('body'),
        srb = $('input[name="keyword"]'),
        submit = $('#submit'),
        load = $('#loading');
    var winHeight = win.height(),
        dataType = {
            "61":"pic",
            "65":"video"
        },
        pageNo = 0,
        pageSize = 20,
        keyWord = GetQueryString('keyword'),
        callback = 'jsonp',
        baseUrl = ifTest(),
        loading = false;
        //baseUrl = './js/data.json?';

    function GetQueryString(name) {
        var result = null,
            reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"),
            r = window.location.search.substr(1).match(reg);
        if(r!=null) result = decodeURI(r[2]);
        return result;
    }
    function initSearch(){
        srb.val(keyWord);
        getData(keyWord);
        submit.on('touchstart', function(){
            dat.html('');
            getData();
        });
        moreData();
    }
    function getData(keyword){
        if(loading) return;
        showLoading(true);
        var kw = keyword||srb.val();
        $.ajax({
            type:'post',
            url:baseUrl+'pageNo='+pageNo+'&pageSize='+pageSize+'&keyWord='+kw,
            dataType:'jsonp',
            jsonpCallback:callback,
            success:function(data){
                //console.log(baseUrl);
                showLoading(false);
                if(data.code == 200){
                    appendHtml(data.content.resultList);
                    pageNo ++;
                }else{
                    dat.append('<li>'+dat.content+'</li>');
                }
            }
        });
    }
    function appendHtml(data){
        var html = '';
        for(var i = 0;i<data.length;i++){
            html += returnHtml(data[i]);
        }
        dat.append(html);
    }
    function returnHtml(data){
        var html = '';
        var type = dataType[data.attr] || 'text';
        if(data.titleImg){
            html += '<li class="unfix"><a href="'+data.originUrl[0]+'">' +
            '<div class="img-full"><img src="'+data.titleImg+'"></div>' +
            '<div class="content"><p>'+data.title+'</p><i class="iconfont icon-'+type+'"></i></div></a></li>';
        }else{
            html += '<li class="unfix"><a href="'+data.originUrl[0]+'">' +
            '<div class="text"><p>'+data.title+'</p><i class="iconfont icon-'+type+'"></i></div></a></li>';
        }
        return html;
    }
    function moreData(){
        dat.on('touchstart', function(){
            var winTop = win.scrollTop(),
                docHeight = doc.height();
            if(docHeight-winTop-winHeight<200) getData();
        });
        /*
        win.scroll(function(){
            var winTop = win.scrollTop(),
                docHeight = doc.height();
            if(docHeight-winTop-winHeight<200) getData();
        });
        */
    }
    function ifTest(){
        var test = window.location.toString().indexOf('test'), json = '';
        test>-1?json = 'http://xh.zf.news.cn/other/data/news_m/search.php?':json = './js/data.json?';
        return json;
    }
    function showLoading(state){
        if(state){
            loading = true;
            load.removeClass('hidden');
        }else{
            loading = false;
            load.addClass('hidden');
        }
    }
    initSearch();
});