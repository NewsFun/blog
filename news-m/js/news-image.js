/**
 * Created by bobo on 2016/11/25.
 */
$(function(){
    function ImagePage(){
        this.data = $('#data');
        this.swiperBox = $('#swiper-wrapper');
        this.imgMsg = [];
        var self = this;
        var init = function(){
            self.initImage();
        };
        init();
    }
    ImagePage.prototype = {
        initImage:function(){
            var self = this, img = self.data.find('img'), html = '';
            img.each(function(){
                html += '<div class="swiper-slide">'+$(this).prop("outerHTML")+'</div>';
                self.imgMsg.push({
                    "title":$(this).attr('title'),
                    "alt":$(this).attr('alt')
                });
            });
            $('#total-num').html(img.length);
            self.swiperBox.append(html);
            self.initSwiper();
        },
        initSwiper:function(){
            var self = this;
            new Swiper ('.swiper-container', {
                loop: true,
                /*如果需要分页器*/
                pagination: '.swiper-pagination',
                paginationType: 'fraction',
                // 如果需要前进后退按钮
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                onSlideChangeEnd: function(swiper){
                    self.initMsg();
                }
            });
        },
        initMsg:function(){
            var msg = $('.swiper-slide-active').find('img').get(0);
            //console.log(msg.alt);
            $('#alt').html(msg.alt);
        }
    };
    new ImagePage();
});
