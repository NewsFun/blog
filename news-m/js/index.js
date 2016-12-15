(function ($, window) {
    // 导入组件库
    var XHW = window.XHW, // 命名空间
        WIDGET = XHW.widget, //组件
        HACKS = XHW.hacks,  // hacks
        TPL = XHW.tpl, // 页面模板
        TD = XHW.typedef, // 数据定义
        API = XHW.api, // 数据接口
        LIB = XHW.lib; // 外部库

    var NavBar = WIDGET.NavBar, // 导航条
        Marquee = WIDGET.Marquee, // 跑马灯
        Page = XHW.Page, // Page
        mkImgSrc = HACKS.mkImgSrc, // 生成图片路径
        getWeather = API.getWeather, // 天气Api
        getArea = LIB.getArea; // 地区列表



    // 页面上下文
    var pageContext = {
        data: {
            dom: {
                scrollbar: $('.scrollbar').get(0),
                content: $('.content').get(0),
                loading: $('.loading').get(0),
                contentBody: $('.content-body').get(0),
                weather: $('.weather').get(0)
            },
            pageType: null
        },
        onReady: function () {
            this.initComponent()
                .initEvent()
                .initHelper()
                .initPage();
        },
        // 初始化组件
        initComponent: function () {
            var self = this,
                dom = self.data.dom,
                scrollbar = dom.scrollbar,
                weather = dom.weather;

            // 初始化侧边栏
            (function initScrollNav() {
                var data = TD.scrollnav;
                var tpl = TPL.scrollnav;
                var htm = Handlebars.compile(tpl)(data);

                $(scrollbar).html(htm);

                dom.scrollnav = new NavBar('.scrollnav', {
                    namespace: {
                        nav_item: 'scrollnav-item',
                        nav_item_active: 'scrollnav-item-active'
                    },
                    onItemChange: pageContext.initPage,
                    context: self,
                    curPos: 0
                });
            })();

            // 初始化天气
            (function () {
                var $weather = $(weather);
                getWeather(function (data) {
                    console.log(data);
                    $weather.find('.weather-location').text(data.location)
                    $weather.find('.weather-ico').attr('src',data.ico)
                    $weather.find('.weather-max').text(data.max)
                    $weather.find('.weather-min').text(data.min);

                }, function () {
                    // $weather.html('');
                    console.log('天气信息加载出错');
                });
            })();

            return this;
        },
        // 初始化事件监听
        initEvent: function () {
            var self = this,
                dom = self.data.dom,
                loading = dom.loading;

            $(document).on('ajaxStart', function () {
                console.log('ajaxStart');
                // 进入加载状态
                $(loading).hide();
            });

            $(document).on('ajaxStop', function () {
                console.log('ajaxStop');
                $(loading).hide();
            });
            return this;
        },

        // 初始化页面
        initPage: function () {
            var self = this,
                dom = self.data.dom,
                contentBody = dom.contentBody,
                pageType = self.data.pageType = dom.scrollnav.getCurrentItemType() || 'home',
                pageNodes = TD.pages[pageType],
                html = '';

            pageNodes.forEach(function (item) {
                html += ('<div class="' + item.nodeWrapper.slice(1) + '">' + '</div>');
            });

            // 初始化容器
            $(contentBody).html(html).attr('class', 'content-body ' + pageType);
            // 加载内容
            self.loadContentData(self.onLoadSuccess, self.onLoadError);
        },
        // 取回远程数据
        loadContentData: function (onLoadSuccess, onLoadError) {
            var self = this,
                pageType = pageContext.data.pageType,
                pageNodes = TD.pages[pageType];

            if (pageType !== 'local') {
                // 请求多个节点的数据
                pageNodes.forEach(function (item, idx) {
                    var nodeId = item.nodeId, // 节点id
                        nodeType = item.nodeType, // 节点类型
                        nodePath = item.nodePath, // 节点路径
                        nodeWrapper = item.nodeWrapper, // 节点容器
                        nodeTpl = item.nodeTpl; // 节点模板类型

                    var url = 'http://qc.wa.news.cn/nodeart/list?nid='+ nodeId + '&pgnum=1&cnt=20&&tp=1&orderby=1';

                    $.ajax({
                        type: 'GET',
                        url: url,
                        dataType: 'jsonp',
                        timeout: 300,
                        context: {
                            pageType: pageType,
                            nodeType: nodeType,
                            nodePath: nodePath,
                            nodeWrapper: nodeWrapper,
                            nodeTpl: nodeTpl
                        },
                        success: onLoadSuccess,
                        error: onLoadError,
                    });
                });
            } else {
                // 初始化本地组件
                $(self.data.dom.contentBody).html(getArea());
            }
        },
        // 数据加载成功
        onLoadSuccess: function (data) {
            data = data.data && data.data.list;
            var tplData = pageContext.mkTplData(data);
            console.log(tplData);

            var pageType = this.pageType;
            var nodeType = this.nodeType;
            var nodePath = this.nodePath;
            var nodeWrapper = this.nodeWrapper;
            var nodeTpl = this.nodeTpl;

            // 根据页面类别和节点类型分块渲染页面
            pageContext.renderContentChunk(tplData, pageType, nodeType, nodeWrapper, nodeTpl);
        },
        // 初始化helper
        initHelper: function () {
            Handlebars.registerHelper('istype', function (doctype, num, options) {
                if (doctype == num) {
                    return options.fn(this);
                } else {
                    return '';
                }
            });

            // Handles

            return this;
        },
        // 分块渲染页面: 主逻辑
        renderContentChunk: function (data, pageType, nodeType, nodeWrapper, nodeTpl) {
            var self = pageContext,
                contentBody = self.data.dom.contentBody, //页面容器
                tplHtml = '', // 模板
                renderHtml = '', // 渲染后的html
                initSwiper = self.initSwiper,
                initMarquee = self.initMarquee;

            // 渲染节点
            function renderPage(data, callback) {
                // 引用模板
                tplHtml = TPL[nodeTpl];
                // 渲染模板
                renderHtml = Handlebars.compile(tplHtml)(data);
                // 渲染页面
                $(contentBody).find(nodeWrapper).html(renderHtml);
                $('img[data-src]').Lazy();
                callback && callback();
            }

            switch (pageType) {
                // 精选页面
                case 'home':
                    if (nodeType === 'swiper') {
                        // 截取头条
                        data = data.slice(0, 4);
                        renderPage(data, initSwiper.bind(self));
                    } else if (nodeType === 'marquee') {
                        // 截取头条
                        data = data.slice(0, 4);
                        renderPage(data, initMarquee.bind(self));
                    } else if (nodeType === 'home_top') {
                        data = data.slice(0, 3);
                        renderPage(data);
                    } else if (nodeType === 'thumbnail-list') {
                        data = data.slice(0, 100);
                        renderPage(data);
                    }
                    break;
                // 视频页面
                case 'video':
                    if (nodeType === 'top-thumbnail') {
                        data = data.slice(0, 1);
                    } else if (nodeType === 'thumbnail-list') {
                        data = data.slice(1);
                    }
                    renderPage(data);
                    break;
                // 音频页面
                case 'audio':
                    if (nodeType === 'top-thumbnail') {
                        data = data.slice(0, 1);
                    } else if (nodeType === 'thumbnail-list') {
                        data = data.slice(1);
                    }
                    renderPage(data);
                    break;
                // 直播页面
                case 'live':
                    if (nodeType === 'top-thumbnail') {
                        data = data.slice(0, 1);
                    } else if (nodeType === 'thumbnail-list') {
                        data = data.slice(1);
                    }
                    renderPage(data);
                    break;
                // 图片页面
                case 'photo':
                    if (nodeType === 'top-swiper') {
                        data = data.slice(0, 4);
                        renderPage(data, initSwiper.bind(self));
                    } else if (nodeType === 'thumbnail-list') {
                        renderPage(data);
                    }
                    break;
                case 'local':
                    if (nodeType === '') {

                    }
                default:
                    if (nodeType === 'swiper') {
                        // 截取头条
                        data = data.slice(0, 4);
                        renderPage(data, initSwiper.bind(self));
                    } else if (nodeType === 'thumbnail-list') {
                        data = data.slice(0, 100);
                        renderPage(data);
                    }
            }
        },
        // 数据加载失败执行
        onLoadError: function () {
            // console.error('load error');
            //alert('测试:请求数据出错!')
        },
        // 转化json到指定格式
        mkTplData: function (data) {
            var tplData = [];
            var entries = null;
            var pageType = pageContext.data.pageType;
            // DEBUG: 引用测试数据
            data = testData;
            // DEBUG: 模拟随机图片
            var imgs = [
                'http://www.xinhuanet.com/photo/titlepic/112006/1120062946_1480994585462_title0h.jpg',
                'http://www.xinhuanet.com/photo/titlepic/112006/1120062956_1480994629438_title0h.jpg',
                'http://www.xinhuanet.com/photo/titlepic/112006/1120062944_1480994553772_title0h.jpg',
                'http://www.xinhuanet.com/photo/titlepic/112006/1120062923_1480994449905_title0h.jpg',
                'http://www.xinhuanet.com/photo/titlepic/112006/1120062912_1480994359909_title0h.jpg',
                'http://www.xinhuanet.com/photo/titlepic/112006/1120062902_1480994301192_title0h.jpg',
                'http://www.xinhuanet.com/photo/titlepic/112006/1120062975_1480994731258_title0h.jpg',
                'http://www.xinhuanet.com/photo/titlepic/112006/1120062884_1480994234413_title0h.jpg',
                'http://www.xinhuanet.com/photo/titlepic/112006/1120062865_1480994137507_title0h.jpg',
                'http://www.xinhuanet.com/photo/titlepic/112006/1120062842_1480994045134_title0h.jpg',
                'http://www.xinhuanet.com/photo/titlepic/112006/1120062824_1480993978241_title0h.jpg',
                'http://www.xinhuanet.com/photo/titlepic/112006/1120062800_1481000321065_title0h.jpg',
                'http://www.xinhuanet.com/photo/titlepic/112006/1120062785_1480993784761_title0h.jpg',
                'http://www.xinhuanet.com/photo/titlepic/112006/1120062710_1480993498505_title0h.jpg',
                'http://www.xinhuanet.com/photo/titlepic/112006/1120062672_1481000297793_title0h.jpg',
                'http://www.xinhuanet.com/photo/titlepic/112006/1120062633_1480993244402_title0h.jpg',
                'http://www.xinhuanet.com/photo/titlepic/112006/1120062524_1481079536582_title0h.jpg',
                'http://www.xinhuanet.com/photo/titlepic/112006/1120062426_1481079952254_title0h.jpg'
            ]

            for (var i = 0; i < data.length; i++) {
                entris = data[i];
                // if(!entris.PicLinks){
                //     entris.Attr = 60;
                // } else {
                //     entris.pic = mkImgSrc(entris.LinkUrl, entris.DocID, entris.PicLinks, entris.IsLink);
                // }
                // debug----------------------------------------------
                if (pageType === 'photo') {
                    entris.LinkUrl = 'test/news-image-m.html';
                } else if (pageType === 'video' || pageType === 'live') {
                    entris.LinkUrl = 'test/news-video-m.html';
                } else if (pageType === 'voice') {
                    entris.LinkUrl = 'test/news-content-m.html';
                } else if (pageType === 'live'){
                    entris.LinkUrl = 'test/news-live-m.html';
                } else if (pageType === 'home'){
                    entris.LinkUrl = 'test/news-content-m.html';
                }
                // end test--------------------------------------------
                tplData.push({
                    doctype: entris.Attr, // 文档类型
                    author: entris.Author, // 作者
                    editor: entris.Editor, // 编辑
                    islink: entris.IsLink, // 是否链接稿
                    linkurl: entris.LinkUrl, // 详情链接
                    piclink: entris.PicLinks, // 图片链接
                    imgarray: entris.imgarray, // 图片链接地址
                    pubtime: entris.PubTime, // 出版时间
                    subtitle: entris.SubTitle, // 副标题
                    abstract: entris.Abstract, //摘要
                    title: entris.Title, // 标题
                    //imgs: entris.imgs, //多图
                    imgs: [
                        imgs[(Math.random() * (imgs.length - 1)).toFixed()],
                        imgs[(Math.random() * (imgs.length - 1)).toFixed()],
                        imgs[(Math.random() * (imgs.length - 1)).toFixed()]
                    ],
                    // imgs: [entris.pic, entris.pic, entris.pic],
                    link: entris.LinkUrl // 链接
                });

            }

            var pageType = pageContext.data.pageType;

            //DEBUG:过滤content,应该放在数据请求之前
            // tplData = tplData.filter(function (item) {
            //     if (pageType === 'video') {
            //         return item.doctype == 51;
            //     } else if (pageType === 'live') {
            //         return item.doctype == 52;
            //     } else if (pageType === 'audio') {
            //         return item.doctype == 63;
            //     } else if (pageType === 'photo') {
            //         return item.doctype == 61;
            //     } else if (pageType === 'home') {
            //         return true;
            //     } else {
            //         return true;
            //     }
            // });

            return tplData;
        },
        // 组件初始化
        initSwiper: function () {
            var self = this,
                dom = self.data.dom;

            dom.swiper = new Swiper('.top-swiper', {
                scrollbar: '.swiper-scrollbar',
                scrollbarHide: false,
                grabCursor: true
            });
        },
        // 组件初始化
        initMarquee: function () {
            var self = this;
            dom = self.data.dom;

            dom.marquee = new Marquee('.top-marquee', {
                speed: 50, // 滚动速度: 像素/秒
                gap: 20 // 项目间隙 : px
            });
        },
    };
    Page(pageContext);
})($, window);
