exports.get = function () {
    Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
            'M+': this.getMonth() + 1, //月份
            'd+': this.getDate(), //日
            'h+': this.getHours(), //小时
            'm+': this.getMinutes(), //分
            's+': this.getSeconds(), //秒
            'q+': Math.floor((this.getMonth() + 3) / 3), //季度
            'S': this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        return fmt;
    };
    var date = (new Date()).Format('yyyy-MM-dd');
    var targetCount = typeof jw_schedule[date] === 'undefined' ? 1 : jw_schedule[date]; // 总量
    var startTime = parseInt(jw_start);
    var endTime = parseInt(jw_end);
    var curvePercent; // 曲线比率
    jw_curveType = parseInt(jw_curveType); // 转number
    if (jw_curveType === 1) {
        curvePercent = jw_curve;
    } else if (jw_curveType === 2) {
        curvePercent = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
    } else if (jw_curveType === 3) {
        curvePercent = [60, 36, 12, 12, 12, 12, 12, 84, 288, 108, 156, 108, 180, 96, 84, 84, 96, 84, 312, 192, 132, 84, 84, 72];
    } else if (jw_curveType === 4) {
        curvePercent = [71, 48, 24, 17, 12, 17, 27, 71, 95, 119, 126, 136, 143, 136, 143, 143, 167, 155, 145, 141, 143, 119, 119, 95];
    }
    if (jw_curveType !== 0) { // 曲线数组生成
        var subsectionCount = 0;
        for (var hour = startTime; hour < endTime; hour++) {
            subsectionCount = subsectionCount + Math.abs(curvePercent[hour]);
        }
        for (hour = startTime; hour < endTime; hour++) {
            if (curvePercent[hour] < 0) {
                jw_curve[hour] = targetCount;
            } else {
                jw_curve[hour] = Math.ceil(targetCount * curvePercent[hour] / subsectionCount);
            }
        }
        for (hour = 0; hour < startTime; hour++) {
            jw_curve[hour] = 1;
        }
        for (hour = endTime; hour < 24; hour++) {
            jw_curve[hour] = 1;
        }
    }

    var uiconfigs = {
        inputs: [
            {
                name: 'jw_schedule',
                onLoad: function () {
                    ui.updateCurve = function () {
                        var type = ui('jw_curveType').val(),
                            curvePercent;
                        type = parseInt(type);
                        if (type === 2) {
                            curvePercent = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
                        } else if (type === 3) {
                            curvePercent = [60, 36, 12, 12, 12, 12, 12, 84, 288, 108, 156, 108, 180, 96, 84, 84, 96, 84, 312, 192, 132, 84, 84, 72];
                        } else if (type === 4) {
                            curvePercent = [71, 48, 24, 17, 12, 17, 27, 71, 95, 119, 126, 136, 143, 136, 143, 143, 167, 155, 145, 141, 143, 119, 119, 95];
                        } else if (type === 0) {
                            curvePercent = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        }
                        ui('jw_curve').val(curvePercent).setRange([0, 500]);
                    }
                },
                onChange: function () {
                    ui.updateCurve();
                }
            },
            {
                name: 'jw_curveType',
                onLoad: function () {
                    this.addOption({
                        '0': '无曲线',
                        '1': '自定义',
                        '2': '全天平均',
                        '3': '自然线1',
                        '4': '自然线2'
                    });
                    ui.onCurveTypeChanged = function () {
                        var curveTypeInput = ui('jw_curveType');
                        if (parseInt(curveTypeInput.val()) !== 1) {
                            ui.updateCurve();
                        }
                    };
                    ui.onCurveTypeChanged();
                },
                onChange: function () {
                    ui.onCurveTypeChanged();
                }
            },
            {
                name: 'jw_curve',
                labels: ['0点', '1点', '2点', '3点', '4点', '5点', '6点', '7点', '8点', '9点', '10点', '11点', '12点',
                    '13点', '14点', '15点', '16点', '17点', '18点', '19点', '20点', '21点', '22点', '23点'],
                range: [0, 500]
            },
            {
                name: 'jw_uaType',
                onLoad: function () {
                    this.addOption('Mobile', '手机').addOption('Computer', '电脑').addOption('iOS', '苹果').addOption('Android', '安卓');
                }
            },
            {
                name: 'jw_start',
                onLoad: function () {
                    this.addOption('0').addOption('1').addOption('2').addOption('3').addOption('4').addOption('5').addOption('6').addOption('7').addOption('8')
                        .addOption('9').addOption('10').addOption('11').addOption('12').addOption('13').addOption('14').addOption('15').addOption('16')
                        .addOption('17').addOption('18').addOption('19').addOption('20').addOption('21').addOption('22').addOption('23');
                }
            },
            {
                name: 'jw_end',
                onLoad: function () {
                    this.addOption('1').addOption('2').addOption('3').addOption('4').addOption('5').addOption('6').addOption('7').addOption('8')
                        .addOption('9').addOption('10').addOption('11').addOption('12').addOption('13').addOption('14').addOption('15').addOption('16')
                        .addOption('17').addOption('18').addOption('19').addOption('20').addOption('21').addOption('22').addOption('23').addOption('24');
                }
            }
        ]
    };

    typeof local == "undefined" ? ui.render(uiconfigs) : "";
    var configs = {
        clearData: true,
        enableJS: true,
        enableProxy: true,
        lessLog: true,
        threadNum13229: 5,
        targetCount: targetCount,
        actionTimeout: 150000,
        action: function (actor) { //注意action 不能调用get方法内的任何变量
            var page = actor;
            page.skipBlank = false;
            local = typeof local == "undefined" ? false : local;
            local === false ? eval(universe.SuperVar.dd) : "";
            var S = SuperVar;
            var stay = S.stayValue(jw_stay) * 1000;
            page.settings.resourceTimeout = 15000;
            page.shot = S.shot;
            /*设备库引入*/
            var device;
            S.init();

            /*全局变量定义区域*/
            var loadVar = 0, clickCount = 0;
            // S.config['索引'] = "";
            /*落地回调*/
            var click = function (s, seat, target) {
                typeof clickCount === "undefined" ? clickCount = 0 : "";
                clickCount++;
                console.log("第" + clickCount + "次点击");
                page.evaluate(function (s, seat, target) {
                    var a = document.querySelectorAll(s);
                    var _seat = seat !== undefined && typeof seat === "number" ? seat : parseInt(Math.random() * a.length);
                    var _target = target == undefined ? true : false;
                    console.log("指定第 " + _seat + " 个");
                    var toLink = a[_seat];
                    if (toLink !== undefined && toLink.target !== "") {
                        _target ? toLink.removeAttribute('target') : "";
                    }
                    toLink.click()
                }, s, seat, target)
            };
            page.onLoadFinished = function (status) {
                var url = page.url;
                console.log(status + ' 加载 ' + url);
                if ((url.indexOf('m.jd.com') >= 0 || url.indexOf('pro.jd.com') >= 0 || url.indexOf('h5.m.jd.com') >= 0 || url.indexOf("prodev.m.jd.com") >= 0) && url.indexOf('ccc-x.jd') < 0 && loadVar === 0) {
                    loadVar = 1;
                    page.shot(7900);
                    setTimeout(function () {
                        var tabs = page.evaluate(function () {
                            var box = document.querySelector('#J_babelOptPage > div:nth-child(51) > div > div > span,#J_babelOptPage > div:nth-child(81) > div > div > span') !== null ? document.querySelector('#J_babelOptPage > div:nth-child(51) > div > div > span,#J_babelOptPage > div:nth-child(81) > div > div > span').click() : '';
                            var Nav = document.querySelectorAll("#J_babelOptPage > div.bab_opt_mod.bab_opt_mod_5_7 > div > div.dropdown_pd_tab.pd_nx.tab_words_module.fixed > div li,div#floatingRightFix > ul > li > a,div.anchor_tab_scroller li,div.anchor_tab li,div.it_flex_c.itr_single_line a,div.bab_opt_mod_1_9.show div > div.pd_nav_wrap a,#J_babelOptPage > div.bab_opt_mod.bab_opt_mod_1_21.show > div.pd_tab.pd_2x.tab_words_module > div > div li,#m_2_10 > div.basement_head.tab_nx.tab_words_module > div > ul li,#m_2_11 > div.basement_head.tab_nx.tab_words_module > div > ul li,#m_2_6 > div.basement_head.tab_nx.tab_words_module > div > ul li,#J_babelOptPage > div.bab_opt_mod.bab_opt_mod_1_16.anchor_nav > div.anchor_navigation_module.black.tab_pic_module > div > div.anchor_tab > div ul >li>p.item>span,#app > div > div.recommend.hasChangeTab > div.recommendWrap > div > div div>div >tabs,#app > div > div.fix-container > div > div > div > div.nav-bottom > div div span,#app > div > div.fix-container > div > div > div > div > div.nav-bar span,div.nav-top >div.nav-bar span,#J_babelOptPage > div.bab_opt_mod.bab_opt_mod_1_12 > div.top_nav_module_hd.free_nx > div > div > ul li i,#J_babelOptPage > div.bab_opt_mod.bab_opt_mod_1_20.feeds > div > div.tabs_bar.txt_style > div > ul > li > a div.txt_wrap,#J_babelOptPage > div.bab_opt_mod.bab_opt_mod_2_1.show > div.pd_tab.pd_4x.tab_words_module.fixed > div > div > ul li,#J_babelOptPage > div > div.bab_opt_mod.bab_opt_mod_1_7.module_20443112.anchor_nav > div > div.anchor-tab > ul li,#J_babelOptPage > div > div.bab_opt_mod.bab_opt_mod_1_19.module_20872779.shangpin_putong > div.pd_tab.pd_nx.pd_tab_1 > div > div.sticky-inner-view.nav-fixed > div > ul > a > div,#home > div.sticky-nav-container.nav > div > div.sticky-nav-expand-panel > ul > li > i,#J_babelOptPage > div > div.bab_opt_mod.bab_opt_mod_1_6.module_20766205.anchor_nav > div > div.anchor-tab > ul > li,#J_babelOptPage > div > div.bab_opt_mod.bab_opt_mod_1_9.module_21059848.anchor_nav > div > div.anchor-tab > ul > li,#home > div.sticky-nav-container.nav > div > div > div > ul > li,#root > div:nth-child(2) > div > div > ul li,#J_babelOptPage > div > div.bab_opt_mod.bab_opt_mod_1_10.module_22082534.anchor_nav > div > div.anchor-tab > ul li,#J_babelOptPage > div > div.bab_opt_mod.bab_opt_mod_1_4.module_22016339.anchor_nav > div > div.anchor-tab > ul li,#J_babelOptPage > div > div.bab_opt_mod.bab_opt_mod_1_2.module_23430351.anchor_nav > div > div.anchor-tab > ul li,div.anchor-tab > ul li,ul > li[class*=\"item\"],div.Nav-Tab ");
                            return Nav.length > 0 ? true : false;
                        });
                        if (!tabs) {
                            var _loop = function _loop(i) {
                                setTimeout(function () {
                                    S.scrollTo(1600 * i, 400);
                                    // window.scrollTo(400, 800 * i);
                                }, 500 * i);
                            };
                            for (var i = 1; i < 20; i++) {
                                _loop(i);
                            }
                        } else {
                            var _loop = function _loop(i) {
                                setTimeout(function () {
                                    S.scrollTo(1600 * i, 600);
                                    // window.scrollTo(600, 800 * i);
                                }, 500 * i);
                            };
                            for (var i = 1; i < 20; i++) {
                                _loop(i);
                            }
                            page.evaluate(function (ext2) {
                                setTimeout(function () {
                                    var Nav = document.querySelectorAll("#J_babelOptPage > div.bab_opt_mod.bab_opt_mod_5_7 > div > div.dropdown_pd_tab.pd_nx.tab_words_module.fixed > div li,div#floatingRightFix > ul > li > a,div.anchor_tab_scroller li,div.anchor_tab li,div.it_flex_c.itr_single_line a,div.bab_opt_mod_1_9.show div > div.pd_nav_wrap a,#J_babelOptPage > div.bab_opt_mod.bab_opt_mod_1_21.show > div.pd_tab.pd_2x.tab_words_module > div > div li,#m_2_10 > div.basement_head.tab_nx.tab_words_module > div > ul li,#m_2_11 > div.basement_head.tab_nx.tab_words_module > div > ul li,#m_2_6 > div.basement_head.tab_nx.tab_words_module > div > ul li,#J_babelOptPage > div.bab_opt_mod.bab_opt_mod_1_16.anchor_nav > div.anchor_navigation_module.black.tab_pic_module > div > div.anchor_tab > div ul >li>p.item>span,#app > div > div.recommend.hasChangeTab > div.recommendWrap > div > div div>div >tabs,#app > div > div.fix-container > div > div > div > div.nav-bottom > div div span,#app > div > div.fix-container > div > div > div > div > div.nav-bar span,div.nav-top >div.nav-bar span,#J_babelOptPage > div.bab_opt_mod.bab_opt_mod_1_12 > div.top_nav_module_hd.free_nx > div > div > ul li i,#J_babelOptPage > div.bab_opt_mod.bab_opt_mod_1_20.feeds > div > div.tabs_bar.txt_style > div > ul > li > a div.txt_wrap,#J_babelOptPage > div.bab_opt_mod.bab_opt_mod_2_1.show > div.pd_tab.pd_4x.tab_words_module.fixed > div > div > ul li,#J_babelOptPage > div > div.bab_opt_mod.bab_opt_mod_1_7.module_20443112.anchor_nav > div > div.anchor-tab > ul li,#J_babelOptPage > div > div.bab_opt_mod.bab_opt_mod_1_19.module_20872779.shangpin_putong > div.pd_tab.pd_nx.pd_tab_1 > div > div.sticky-inner-view.nav-fixed > div > ul > a > div,#home > div.sticky-nav-container.nav > div > div.sticky-nav-expand-panel > ul > li > i,#J_babelOptPage > div > div.bab_opt_mod.bab_opt_mod_1_6.module_20766205.anchor_nav > div > div.anchor-tab > ul > li,#J_babelOptPage > div > div.bab_opt_mod.bab_opt_mod_1_9.module_21059848.anchor_nav > div > div.anchor-tab > ul > li,#home > div.sticky-nav-container.nav > div > div > div > ul > li,#root > div:nth-child(2) > div > div > ul li,#J_babelOptPage > div > div.bab_opt_mod.bab_opt_mod_1_10.module_22082534.anchor_nav > div > div.anchor-tab > ul li,#J_babelOptPage > div > div.bab_opt_mod.bab_opt_mod_1_4.module_22016339.anchor_nav > div > div.anchor-tab > ul li,#J_babelOptPage > div > div.bab_opt_mod.bab_opt_mod_1_2.module_23430351.anchor_nav > div > div.anchor-tab > ul li,div.anchor-tab > ul li,ul > li[class*=\"item\"],div.Nav-Tab ");
                                    var toLink = Nav[parseInt(Math.random() * Nav.length)];
                                    if (toLink.getAttribute('target') !== null) {
                                        toLink.removeAttribute('target')
                                    }
                                    toLink.click();

                                    setTimeout(function () {
                                        toLink = Nav[parseInt(Math.random() * Nav.length)];
                                        if (toLink.getAttribute('target') !== null) {
                                            toLink.removeAttribute('target')
                                        }
                                        toLink.click();

                                        setTimeout(function () {
                                            var __loop = function _loop(i, s) {
                                                setTimeout(function () {
                                                    s.click();
                                                }, 1500);
                                            };
                                            for (var i = 0; i < Nav.length; i++) {
                                                if (Nav[i].innerText != ext2) {
                                                } else {
                                                    __loop(i, Nav[i]);
                                                    break;
                                                }
                                            }
                                        }, 2000)
                                    }, 2000 + parseInt(Math.random() * 2000))
                                }, 8000)
                            }, ext2)
                        }
                    }, 3000);
                    setTimeout(function () {
                        if (parseInt(Math.random() * 1000) < jw_click * 10) {
                            // S.click("#J_babelOptPage > div > div.bab_opt_mod.bab_opt_mod_2_14.module_20766227.feeds > div > div.sticky-view > div > div > div > ul > li:nth-child(4) > a > div > div");
                            setTimeout(function () {
                                console.log(S.config["二跳标签"]);
                                S.click(S.config["二跳标签"]);
                            }, 2000);
                        }
                        page.shot(25000);
                        page.count(60000 + parseInt(Math.random() * 10000));
                    }, S.stayValue("20-30") * 1000)
                } else if (url.length > 5 && loadVar === 1 && status === 'success') {
                    loadVar = 2;
                    page.shot(7900);
                    setTimeout(function () {
                        if (parseInt(Math.random() * 1000) < parseInt(ext1) * 10) {
                            page.evaluate(function () {
                                if (document.querySelector("#buyBtn2").innerText === "立即预约" || document.querySelector("#buyBtn2").innerText === "支付定金") {
                                    document.querySelector("#buyBtn2").click();
                                } else if (document.querySelector('#orginBuyBtn > span.txt') !== null && document.querySelector('#orginBuyBtn > span.txt').innerText === "单独购买") {
                                    document.querySelector("#orginBuyBtn").click();
                                    setTimeout(function () {
                                        document.querySelector('#addCart1,#popupConfirm').click();
                                    }, 2000 + parseInt(Math.random() * 500))
                                } else if (document.querySelector("#buyBtn2").innerText === "立即购买") {
                                    document.querySelector("#addCart2").click();
                                    setTimeout(function () {
                                        document.querySelector('#addCart1,#popupConfirm').click();
                                    }, 2000 + parseInt(Math.random() * 500))
                                } else {
                                    document.querySelector("#buyBtn2,#addCart2").click();
                                    setTimeout(function () {
                                        document.querySelector('#addCart1,#popupConfirm').click();
                                    }, 2000 + parseInt(Math.random() * 500))
                                }
                            });
                        }
                        page.count(10000 + parseInt(Math.random() * 5000))
                    }, 25000)
                }
            };

            page.onResourceRequested = S.onResourceRequested;
            page.onResourceReceived = S.onResourceReceived;
            page.onConsoleMessage = S.onConsoleMessage;
            var page2;
            page.onPageCreated = S.onPageCreated;
            var setting = {
                headers: {
                    'Referer': jw_referer,
                    'User-Agent': param.userAgent
                }
            };

            page.open("about:blank", function () {
                page.onInitialized = S.onInitialized;
                if(ext1.length > 100){

                }
                page.open(jw_url);
            });

        }
    };

    if (jw_proxyAreas !== '随机') {
        configs.proxyAreas = jw_proxyAreas;
    }

    configs.proxyUseTimes = jw_proxyUseTimes;

    if (jw_curveType !== 0) {
        configs.hourCountLimit = jw_curve;
    }
    if (typeof local == "undefined") {
        if (jw_uaType === 'Mobile') {
            configs.userAgent = UserAgent.Mobile;
        } else if (jw_uaType === 'Computer') {
            configs.userAgent = UserAgent.Computer;
        } else if (jw_uaType === 'iOS') {
            configs.userAgent = UserAgent.iOS;
        } else if (jw_uaType === 'Android') {
            configs.userAgent = UserAgent.Android;
        }
    }
    return configs;
};

typeof local == "undefined" ? exports.SuperVar = require('SuperVar') : "";
/*
 * v1.0 2019年9月19日 10点14分
 */