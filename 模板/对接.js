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

            /*设备库引入*/
            // var device;
            S.init();

            /*全局变量定义区域*/
            var loadVar = 0, clickCount = 0;
            var ip, userAgent, ios, android, osv, settings, data, ads, logId = S.deviceModule.getRandom(32);
            logKey = "anxiang";

            /*获取 taskId*/
            function togettaskid(startcallback) {
                var execFile = require("child_process").execFile;
                execFile("cat", ["/proc/" + __system__.pid + "/cmdline"], null, function (err, stdout, stderr) {
                    if (stderr.length > 0) {
                        console.log("获取pid发生错误");
                        page.skip(3000);
                        return;
                    }
                    if (stdout.length > 0) {
                        try {
                            var taskid1;
                            taskid1 = stdout.split("--local-storage-quota=-1.")[1].split("-")[0];
                            startcallback(taskid1);

                        } catch (e) {
                            console.log("解析taskid错误:" + e.toString());
                            page.skip(3000);
                            return;
                        }
                    }
                })
            }

            function start1(taskid) {
                try{
                    auid = taskid.trim();
                }catch (e) {
                    auid = taskid;
                }
            }
            local === false ? togettaskid(start1) : "";
            local === true ? start1(95270011) : "";
            local === true ? logKey="xxxTest" : "";

            /*落地回调*/
            page.onLoadFinished = function (status) {
                var url = page.url;
                console.log(status + ' 加载 ' + url);
                if (url.indexOf('') >= 0 && loadVar === 0) {
                    loadVar = 1;
                    var adContent = page.evaluate(function() {
                        var ad;
                        try {
                            ad = JSON.parse(document.body.innerText); // innerHTML
                        }
                        catch (e) {
                            ad = ""
                        }
                        return ad
                    });
                    adContent = typeof local == "undefined" ? "广告信息" : adContent;

                    /* TODO */

                    setTimeout(function () {
                        console.log(JSON.stringify(ad));
                        loadVar = 999;
                        page.open("about:blank", settings)
                    }, 3000)
                }else if (loadVar === 999) {
                    loadVar = 2;
                    console.log("空白页");
                    /*自由发挥*/

                }
            };

            page.onResourceRequested = S.onResourceRequested;
            page.onResourceReceived = S.onResourceReceived;
            page.onConsoleMessage = S.onConsoleMessage;
            var onInitialized = S.onInitialized;
            var page2;
            page.onPageCreated = S.onPageCreated;

            userAgent = param.userAgent;
            page.open("about:blank", function () {
                page.onInitialized = onInitialized;
                page.open('http://pv.sohu.com/cityjson?ie=utf-8', function (status) {
                    if (status == "fail") {
                        page.skip();
                        return;
                    }
                    if (page.plainText.indexOf("cip") < 0) {
                        page.skip();
                        return;
                    }
                    eval(page.plainText);
                    ip = returnCitySN.cip;
                    md5 = SuperVar.md5;
                    data = {

                    };
                    if (param.platform === "iPhone") {

                    } else if (param.platform === "Android") {

                    }
                    settings = {
                        operation: 'POST',
                        encoding: 'utf8',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Referer': jw_referer,
                            'User-Agent': userAgent
                        },
                        data: JSON.stringify(data)
                    };
                    console.log("申请参数:" + settings.data);
                    page.open(jw_url, settings)
                });
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
 * v1.0 2019年9月18日 16点03分
 */