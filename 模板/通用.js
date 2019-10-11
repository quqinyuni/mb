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
    var openJS = true;
    var thread = 8;
    var obj = (function (ext3) {
        var config = {
            "快速曝光模式": false,
        };
        var urlReg = /(http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?|http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?)/ig;
        if (ext3 !== "") {
            // var str = /^(.*:.*,.*:.*)$/.test(ext3) ? ext3.split(",") : ext3.split("|");
            var str = ext3.indexOf("跳标签") >= 0 && ext3.indexOf(",") >= 0 ? ext3.split("|") : ext3.split(",");
            str = str.length === 1 ? ext3.split("|") : str;
            str = str.length === 1 ? ext3.split(",") : str;
            for (var i = 0; i < str.length; i++) {
                var _str = str[i].split(":"),
                    strMap = {"是": true, "否": false, "随机": 'a', "开": true, "关": false};
                _str[0] = str[i].split(':')[0];
                if (str[i].indexOf("http") >= 0) {
                    _str[1] = str[i].match(urlReg)[0]
                }
                if (_str[0].indexOf("跳标签") >= 0) {
                    _str[1] = _str[1].replace(/\|/gim, ',');
                }
                config[_str[0]] = strMap[_str[1]] !== undefined ? strMap[_str[1]] : decodeURIComponent(_str[1])
            }
        }
        return config
    })(typeof ext3 == "undefined" ? "" : ext3);
    if (!obj["快速曝光模式"]) {
        thread = 5;
        openJS = true;
    }
    var configs = {
        clearData: true,
        enableProxy: true,
        enableJS: openJS,
        threadNum13229: thread,
        lessLog: true,
        resultCountLimit: targetCount,
        targetCount: targetCount,
        actionTimeout: 180000,
        action: function (actor) {
            local = typeof local == "undefined" ? false : local;
            local === false ? eval(universe.SuperVar.dd) : "";
            var S = SuperVar;
            S.config["快速曝光模式"] == false;
            var osDeviceUrl = "http://api.oneaaa.cn/deviceID3.php?type=get&os=",
                androidName = S.config['参数名'] != undefined ? S.config['参数名'] + '-imei' : 'ty-imei',
                iosName = S.config['参数名'] != undefined ? S.config['参数名'] + '-idfa' : 'ty-idfa',
                ipUrl = "http://pv.sohu.com/cityjson?ie=utf-8",
                start;
            var ipGl = function (returnCitySN) {
                if (S.config['IP过滤']) {
                    try {
                        if (jw_proxyAreas !== '随机' && jw_proxyAreas.indexOf('自治') === -1 && jw_proxyAreas.indexOf('地区') === -1 && jw_proxyAreas.indexOf('盟') === -1 && jw_proxyAreas.indexOf('全国') === -1 &&
                            jw_proxyAreas.indexOf('柳州') === -1 && jw_proxyAreas.indexOf('桂林') === -1 && jw_proxyAreas.indexOf('赤峰') === -1 && jw_proxyAreas.indexOf('乌鲁木齐') === -1 && jw_proxyAreas.indexOf('南宁') === -1) {
                            var cityName = '';
                            if (returnCitySN.cname.indexOf('省') >= 0 && returnCitySN.cname.indexOf('市') >= 0) {
                                cityName = returnCitySN.cname.split('省')[1].split('市')[0]
                            } else if (returnCitySN.cname.indexOf('省') >= 0) {
                                cityName = returnCitySN.cname.split('省')[0]
                            } else if (returnCitySN.cname.indexOf('市') >= 0) {
                                cityName = returnCitySN.cname.split('市')[0]
                            } else {
                                cityName = returnCitySN.cname
                            }
                            if (jw_proxyAreas.indexOf(cityName) === -1 && cityName != 'CHINA') {
                                console.log('过滤 ' + JSON.stringify(returnCitySN));
                                S.config["快速曝光模式"] ? "" : page.skip();
                                return false
                            }
                            var proxyArr = jw_proxyAreas.replace(/b/gi, "").split(",");
                            var proxyBool = (function (proxyArr, returnCitySN) {
                                for (i in proxyArr) {
                                    if (returnCitySN.cname.indexOf(proxyArr[i]) >= 0) {
                                        return true
                                    }
                                }
                                return false
                            })(proxyArr, returnCitySN);
                            if (!proxyBool) {

                            }

                            return true;
                        }
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    console.log("不进行过滤");
                    return true
                }
            };
            var deviceZd = function () {
                if (S.config['定向参数'] && jw_uaType !== "Computer") {
                    if (S.config["快速曝光模式"]) {
                        var deviceid;
                        deviceid = S.Gvar.platform === "iPhone" ? site.requestUrl(osDeviceUrl + iosName, siteOption) : site.requestUrl(osDeviceUrl + androidName, siteOption);
                        if (typeof deviceid.statusCode === 'undefined' || deviceid.statusCode !== 200) {
                            return false
                        }
                        if (deviceid.raw !== undefined) {
                            S.Gvar.platform === "iPhone" ? device.idfa = deviceid.raw : device.imei = deviceid.raw;
                            console.log('指定deviceid：' + deviceid.raw)
                        } else {
                            console.log("指定deviceid不存在");
                            if (!S.config["参数耗尽继续"]) {
                                return false
                            }
                            console.log("使用自身设备库")
                        }
                    } else {
                        page.open(param.platform === "iPhone" ? osDeviceUrl + iosName : osDeviceUrl + androidName, function (s) {
                            if (s != "fail" && page.plainText.length > 0 && page.plainText.length < 60) {
                                param.platform === "iPhone" ? device.idfa = page.plainText : device.imei = page.plainText;
                                console.log('指定deviceid：' + page.plainText);
                            } else {
                                console.log("指定deviceid不存在");
                                if (!S.config["参数耗尽继续"]) {
                                    page.skip();
                                    return 0
                                }
                                console.log("使用自身设备库");
                            }
                            start();
                        });
                    }
                } else {
                    // if (!S.config["快速曝光模式"]) {
                    console.log("不指定设备");
                    start();
                    // }
                }
            };
            var page = actor;
            page.skipBlank = false;
            var stay = S.stayValue(jw_stay) * 1000;
            page.settings.resourceTimeout = 15000;
            page.shot = S.shot;
            S.init();
            if (S.config["关闭屏蔽"]) {
                local = true;
            }
            /*全局变量定义区域*/
            var loadVar = -1, clickCount = 0, pageCount, timeOut;
            var settings, data;
            var imps, clickUrls, landing, _ref = false, _refStay = 100, _url, indexOfTime,loadTime,
                _count = setTimeout("", stay);
            var COUNT = function (m) {
                clearTimeout(_count);
                _count = setTimeout(function () {
                    var z = ((Date.now() - startTimeNow) / 1000),l = loadTime / 1000,t = m / 1000,tq = z - l - t;
                    console.log("总执行时长: " + z + " S ; 落地页加载时长: " + l + " S ; 停留时长: " + t +" S ; 跳前停留: " + tq);
                    page.count(1000);
                }, m - 1000)
            };
            setTimeout(function () {
                if(loadTime === undefined){
                    console.log("未能成功落地加载");
                    page.skip(1000);
                }
            },30000);
            // S.config['索引'] = "";
            /*落地回调*/
            page.onLoadFinished = function (status) {
                var url = page.url;
                _url !== url ? console.log(status + ' 加载 ' + url) : "";
                var _status = S.config["落地成功计数"] ? status == 'success' : true;
                var indexStr = S.config["索引"] === undefined ? url.length > 10 && url !== ipUrl : url.indexOf(S.config["索引"]) >= 0;
                indexStr = S.config["二跳标签"].indexOf("http") >= 0 ? url.length > 10 && url !== ipUrl : indexStr;
                var indexStr2 = S.config["二跳标签"].indexOf("http") >= 0 && S.config["索引"] !== undefined ? url.indexOf(S.config["索引"]) >= 0 : url.length > 10;
                if (indexStr && loadVar === 0 && _status) {
                    loadTime = Date.now() - startTimeNow;
                    _url = url, indexOfTime = Date.now();
                    loadVar = 1;
                    page.shot(7900);
                    setTimeout(function () {
                        if (parseInt(Math.random() * 1000) < S.config['二跳率'] * 10) {
                            if (S.config['二跳标签'].indexOf("http") >= 0) {
                                console.log("打开链接");
                                page.open(S.u2u(S.config['二跳标签']));
                            } else {
                                if (S.config["代码"] !== undefined) {
                                    page.evaluate(function (code) {
                                        eval(code);
                                    }, S.config["代码"])
                                }
                                setTimeout(function () {
                                    S.heatMap();
                                    S.event(S.config['二跳标签'], 's');
                                    // S.click(S.config['二跳标签']);
                                }, 2000);
                                pageCount = setTimeout(function () {
                                    COUNT(500)
                                }, stay)
                            }
                        } else {
                            COUNT(stay);
                        }
                        page.shot(15000);
                    }, S.stayValue(S.config["二跳前停留"]) * 1000)
                } else if (indexStr2 && loadVar === 1 && _url !== url && _status && ((Date.now() - indexOfTime) / 1000) > 8) {
                    loadVar = 2;
                    _url = url, indexOfTime = Date.now();
                    page.shot(7900);
                    clearTimeout(pageCount);
                    setTimeout(function () {
                        if (parseInt(Math.random() * 1000) < S.config['三跳率'] * 10) {
                            if (S.config['三跳标签'].indexOf("http") >= 0) {
                                console.log("打开链接");
                                page.open(S.u2u(S.config['三跳标签']));
                            } else {
                                S.heatMap();
                                S.event(S.config['三跳标签'], "s");
                                // S.click(S.config['三跳标签']);
                            }
                            pageCount = setTimeout(function () {
                                COUNT(500)
                            }, stay);
                        } else {
                            COUNT(stay);
                        }
                    }, S.stayValue(S.config["三跳前停留"]) * 1000)
                } else if (url.length > 10 && loadVar === 2 && _url !== url && _status && ((Date.now() - indexOfTime) / 1000) > 8) {
                    loadVar = 3;
                    _url = url, indexOfTime = Date.now();
                    page.shot(7900);
                    clearTimeout(pageCount);
                    setTimeout(function () {
                        if (parseInt(Math.random() * 1000) < S.config['四跳率'] * 10) {
                            if (S.config['四跳标签'].indexOf("http") >= 0) {
                                console.log("打开链接");
                                page.open(S.u2u(S.config['四跳标签']));
                            } else {
                                S.heatMap();
                                S.event(S.config['四跳标签'], "s");
                                // S.click(S.config['四跳标签']);
                            }
                            pageCount = setTimeout(function () {
                                COUNT(500)
                            }, stay);
                        } else {
                            COUNT(stay);
                        }
                    }, S.stayValue(S.config["四跳前停留"]) * 1000)
                } else if (url.length > 10 && loadVar === 3 && _url !== url && _status && ((Date.now() - indexOfTime) / 1000) > 8) {
                    loadVar = 4;
                    _url = url, indexOfTime = Date.now();
                    page.shot(7900);
                    clearTimeout(pageCount);
                    COUNT(stay);
                }
            };
            page.onResourceRequested = S.onResourceRequested;
            page.onResourceReceived = S.onResourceReceived;
            page.onConsoleMessage = S.onConsoleMessage;
            var page2;
            page.onPageCreated = S.onPageCreated;
            var _stay = 3000;
            var toPv = function () {
                jw_pageView = jw_pageView.toString();
                var pv = parseInt(jw_pageView.split(".")[0]) - 1;
                if (parseInt(Math.random() * 1000) < (jw_pageView.split(".")[1] * 100)) {
                    pv++;
                }
                console.log('pv:' + pv);
                if (pv === 0) {
                    _stay = 2000;
                    return false;
                } else {
                    _stay = pv * 3000 + 3000;
                }
                var ct = 1;
                for (var j = 1; j <= pv; j++) {
                    setTimeout(function () {
                        S.send(imps)
                    }, ct * parseInt(Math.random() * 3000));
                }
            };
            /*通用回传*/
            userAgent = param.userAgent;
            start = function () {
                /*回传处理*/
                imps = S.u2us(S.getUrls(ext1));
                clickUrls = S.u2us(S.getUrls(ext2));
                landing = S.u2us(S.getUrls(jw_url));
                setting = {headers: {'Referer': jw_referer, 'User-Agent': param.userAgent}};
                // console.log("处理后曝光链接: " + JSON.stringify(imps));
                // console.log("处理后点击链接: " + JSON.stringify(clickUrls));
                // console.log("处理后落地: " + landing);
                var run = function (s) {
                    setTimeout(function () {
                        S.send(imps);
                        toPv();
                        if (S.config["请求计数"]) {
                            console.log("请求计数埋点");
                            COUNT(stay + parseInt(Math.random() * 5000));
                        }
                        if (parseInt(Math.random() * 1000) < jw_click * 10) {
                            setTimeout(function () {
                                S.send(clickUrls);
                            }, 1500);
                            if (landing !== "") {
                                setTimeout(function () {
                                    if (typeof landing === "object") {
                                        var landUrl = landing.pop();
                                        S.send(landing);
                                        setTimeout(function () {
                                            loadVar = 0;
                                            page.open(landUrl, setting)
                                        }, 1500)
                                    } else {
                                        loadVar = 0;
                                        page.open(landing, setting)
                                    }
                                }, typeof clickUrls === "object" ? 1000 * clickUrls.length : (_stay === 1000 ? 3000 : _stay))
                            } else {
                                COUNT(4000);
                            }
                        } else {
                            setTimeout(function () {
                                COUNT(1000)
                            }, _stay);
                        }
                    }, _refStay)
                };
                page.open("about:blank", function () {
                    page.onInitialized = S.onInitialized;
                    if (ext1.indexOf("http") >= 0) {
                        if (jw_referer.match(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/ig) != null) {//当存在来源时,打开来源页,然后发送曝光+点击
                            // _refStay = 1000;
                            // page.open(jw_referer, run());
                            run();
                        } else {
                            run();
                        }
                    } else {
                        if (typeof landing === "object") {
                            var landUrl = landing.pop();
                            S.send(landing);
                            setTimeout(function () {
                                loadVar = 0;
                                page.open(landUrl, setting, function (s) {
                                    if (S.config["请求计数"]) {
                                        console.log("请求计数埋点");
                                        COUNT(stay);
                                    }
                                })
                            }, 1500)
                        } else {
                            loadVar = 0;
                            page.open(landing, setting, function (s) {
                                if (S.config["请求计数"]) {
                                    console.log("请求计数埋点");
                                    COUNT(stay);
                                }
                            });
                        }
                    }
                });
            };
            var startTimeNow = Date.now();
            if (!S.config["回传"] && !S.config["IP过滤"]) {
                start();
            } else {
                page.open(ipUrl, function (status) {//http://2019.ip138.com/ic.asp
                    if (status == "fail") {
                        page.skip();
                        return
                    }
                    if (page.plainText.indexOf("cip") < 0) {
                        page.skip();
                        return
                    }
                    eval(page.plainText);
                    ip = returnCitySN.cip;
                    /*IP过滤及指定设备ID*/
                    if (ipGl(returnCitySN)) {
                        deviceZd();
                    }
                });
            }
        }
    };

    if (jw_proxyAreas !== '随机') {
        configs.proxyAreas = jw_proxyAreas;
    }

    configs.proxyUseTimes = jw_proxyUseTimes;

    if (jw_curveType !== 0) {
        configs.hourCountLimit = jw_curve;
    }
    if (typeof local === "undefined" || local === false) {
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
* v2.0 2019年10月10日 14点55分
*/

