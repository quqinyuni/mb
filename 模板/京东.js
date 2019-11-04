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
            if (jw_uaType === "Computer") {
                page.onLoadFinished = function (status) {
                    var url = page.url;
                    console.log(status + ' 加载 ' + url);
                    if ((url.indexOf("prodev.jd.com") >= 0 || url.indexOf('m.jd.com') >= 0 || url.indexOf('pro.jd.com') >= 0 || url.indexOf('h5.m.jd.com') >= 0) && url.indexOf('ccc-x.jd') < 0 && loadVar === 0) {
                        loadVar = 1;
                        if (url.indexOf("prodev.jd.com") >= 0) {
                            page.evaluate(function () {
                                jsonp0({
                                    "msg": "success",
                                    "returnMsg": "success",
                                    "code": "0",
                                    "subCode": "0",
                                    "transParam": "",
                                    "channelPoint": {"babelChannel": "", "pageId": ""},
                                    "skuInfoList": {
                                        "pro_10817725": [{
                                            "image": "//m.360buyimg.com/babel/jfs/t1/93690/35/660/442620/5db18a01E9f495f94/67bb223459d4d474.jpg!q70.dpg",
                                            "pPrice": "187",
                                            "brandName": "",
                                            "srv": "null_10817725_5283008_1_10817725-18140462-6603612622-5283008#1-0-2--0--#1-0-#3-16426110#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/93690/35/660/442620/5db18a01E9f495f94/67bb223459d4d474.jpg!q70.dpg",
                                            "name": "帮宝适 一级帮拉拉裤L72",
                                            "expoSrv": "38012108_10817725-18140462-6603612622-5283008#1-0-2--0--#1-0-#3-16426110#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16426110",
                                            "skuId": "5283008",
                                            "hideCart": "0"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t1/101808/7/648/357478/5db18988E5f77c0f9/b494fd7832500b44.jpg!q70.dpg",
                                            "pPrice": "296",
                                            "brandName": "",
                                            "srv": "null_10817725_4508101_2_10817725-18140462-6603612616-4508101#1-0-2--0--#1-0-#3-16426110#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/101808/7/648/357478/5db18988E5f77c0f9/b494fd7832500b44.jpg!q70.dpg",
                                            "name": "帮宝适 一级帮纸尿裤L120",
                                            "expoSrv": "38012108_10817725-18140462-6603612616-4508101#1-0-2--0--#1-0-#3-16426110#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16426110",
                                            "skuId": "4508101",
                                            "hideCart": "0"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t1/70741/12/7092/157659/5d53e4b9Eabe3c6e3/bd38274560cf5b76.jpg!q70.dpg",
                                            "pPrice": "123",
                                            "brandName": "",
                                            "srv": "null_10817725_4508075_3_10817725-18140462-6603612619-4508075#1-0-2--0--#1-0-#3-16426110#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/70741/12/7092/157659/5d53e4b9Eabe3c6e3/bd38274560cf5b76.jpg!q70.dpg",
                                            "name": "帮宝适 一级帮拉拉裤L46",
                                            "expoSrv": "38012108_10817725-18140462-6603612619-4508075#1-0-2--0--#1-0-#3-16426110#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16426110",
                                            "skuId": "4508075",
                                            "hideCart": "0"
                                        }],
                                        "pro_10917038": [{
                                            "image": "//m.360buyimg.com/babel/jfs/t1/65519/23/14248/170999/5db8383aEe409df3f/0b984a3a197e2209.jpg!q70.dpg",
                                            "pPrice": "1699",
                                            "brandName": "",
                                            "srv": "null_10917038_7641991_1_10917038-18339725-0403617823-7641991#1-0-2--0--#1-0-#3-16656803#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/65519/23/14248/170999/5db8383aEe409df3f/0b984a3a197e2209.jpg!q70.dpg",
                                            "name": "小米电视4X 55英寸 4K超高清 HDR 蓝牙语音遥控 2GB+8GB 人工智能语音网络液晶平板电视L55M5-AD",
                                            "expoSrv": "38012108_10917038-18339725-0403617823-7641991#1-0-2--0--#1-0-#3-16656803#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16656803",
                                            "skuId": "7641991",
                                            "hideCart": "0"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t27709/201/1586417750/361172/4e970d11/5be66bf1N8f00d10e.jpg!q70.dpg",
                                            "pPrice": "999",
                                            "brandName": "",
                                            "srv": "null_10917038_100001063264_2_10917038-18339725-0403617824-100001063264#1-0-2--0--#1-0-#3-16656803#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t27709/201/1586417750/361172/4e970d11/5be66bf1N8f00d10e.jpg!q70.dpg",
                                            "name": "小米电视4X 43英寸 全高清 蓝牙语音遥控 1GB+8GB 人工智能语音网络液晶平板电视L43M5-4X",
                                            "expoSrv": "38012108_10917038-18339725-0403617824-100001063264#1-0-2--0--#1-0-#3-16656803#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16656803",
                                            "skuId": "100001063264",
                                            "hideCart": "1"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t1/101372/32/1069/205632/5db839a8Ef4e1b8bd/5cadabafbb710534.jpg!q70.dpg",
                                            "pPrice": "2999",
                                            "brandName": "",
                                            "srv": "null_10917038_100008268466_3_10917038-18339725-0403617822-100008268466#1-0-2--0--#1-0-#3-16656803#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/101372/32/1069/205632/5db839a8Ef4e1b8bd/5cadabafbb710534.jpg!q70.dpg",
                                            "name": "小米电视4A 70英寸巨屏 4K超高清HDR 内置小爱同学 2GB+16GB AI人工智能网络液晶平板电视L70M5-4A",
                                            "expoSrv": "38012108_10917038-18339725-0403617822-100008268466#1-0-2--0--#1-0-#3-16656803#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16656803",
                                            "skuId": "100008268466",
                                            "hideCart": "0"
                                        }],
                                        "pro_10841964": [{
                                            "image": "//m.360buyimg.com/babel/jfs/t1/98370/36/860/157494/5db445b3E40ad6a77/20dc06c2d8d1c29b.jpg!q70.dpg",
                                            "pPrice": "1699",
                                            "brandName": "",
                                            "srv": "null_10841964_100008793528_1_10841964-18200522-6203566290-100008793528#1-0-2--0--#1-0-#3-16491212#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/98370/36/860/157494/5db445b3E40ad6a77/20dc06c2d8d1c29b.jpg!q70.dpg",
                                            "name": "海尔（Haier）LU55J51 55英寸4K超高清 人工智能 8K解码 语音遥控 超窄边框LED液晶电视2+16G （金色）",
                                            "expoSrv": "38012108_10841964-18200522-6203566290-100008793528#1-0-2--0--#1-0-#3-16491212#_1#2#8175569a2e8331140d68b80c826f33c0ca08a422-0-621037#16491212",
                                            "skuId": "100008793528",
                                            "hideCart": "1"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t1/105124/29/638/146355/5db24b06E0ae15a1c/b6c58d5cc0928566.jpg!q70.dpg",
                                            "pPrice": "1999",
                                            "brandName": "",
                                            "srv": "null_10841964_100003294619_2_10841964-18200522-6203566291-100003294619#1-0-2--0--#1-0-#3-16491212#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/105124/29/638/146355/5db24b06E0ae15a1c/b6c58d5cc0928566.jpg!q70.dpg",
                                            "name": "海尔（Haier）16升零冷水燃气热水器天然气 水气双调恒温智能浴缸注水 8年质保 JSQ31-16WJS2(12T)",
                                            "expoSrv": "38012108_10841964-18200522-6203566291-100003294619#1-0-2--0--#1-0-#3-16491212#_1#2#8175569a2e8331140d68b80c826f33c0ca08a422-0-621037#16491212",
                                            "skuId": "100003294619",
                                            "hideCart": "0"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t1/46875/12/14254/103263/5daecc9aEcac898f2/7c292faad617eab1.jpg!q70.dpg",
                                            "pPrice": "2499",
                                            "brandName": "",
                                            "srv": "null_10841964_100004580123_3_10841964-18200522-6203566289-100004580123#1-0-2--0--#1-0-#3-16491212#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/46875/12/14254/103263/5daecc9aEcac898f2/7c292faad617eab1.jpg!q70.dpg",
                                            "name": "海尔 （Haier）1.5匹变频壁挂式空调挂机 一级能效 自清洁 PMV一键舒适KFR-35GW/03JDM81A",
                                            "expoSrv": "38012108_10841964-18200522-6203566289-100004580123#1-0-2--0--#1-0-#3-16491212#_1#2#8175569a2e8331140d68b80c826f33c0ca08a422-0-621037#16491212",
                                            "skuId": "100004580123",
                                            "hideCart": "0"
                                        }],
                                        "pro_10786598": [{
                                            "image": "//m.360buyimg.com/babel/jfs/t1/33742/27/6312/109262/5cbd94b4E2eaebbd4/2473a88608a50b22.jpg!q70.dpg",
                                            "pPrice": "59.90",
                                            "brandName": "",
                                            "srv": "null_10786598_8139349_1_10786598-18076349-2403585182-8139349#1-0-2--0--#1-0-#3-16354431#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/33742/27/6312/109262/5cbd94b4E2eaebbd4/2473a88608a50b22.jpg!q70.dpg",
                                            "name": "伊利 金典有机纯牛奶250ml*16盒/礼盒装（王菲推荐）",
                                            "expoSrv": "38012108_10786598-18076349-2403585182-8139349#1-0-2--0--#1-0-#3-16354431#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16354431",
                                            "skuId": "8139349",
                                            "hideCart": "0"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t1/74291/36/164/124269/5ce3d810Ed61d2309/4eebab3238ff872c.jpg!q70.dpg",
                                            "pPrice": "69.90",
                                            "brandName": "",
                                            "srv": "null_10786598_100005822120_2_10786598-18076349-2403585178-100005822120#1-0-2--0--#1-0-#3-16354431#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/74291/36/164/124269/5ce3d810Ed61d2309/4eebab3238ff872c.jpg!q70.dpg",
                                            "name": "伊利 舒化无乳糖牛奶高钙型220ml*24盒",
                                            "expoSrv": "38012108_10786598-18076349-2403585178-100005822120#1-0-2--0--#1-0-#3-16354431#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16354431",
                                            "skuId": "100005822120",
                                            "hideCart": "0"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t1/67841/38/11230/220492/5d89c79bEe274eb25/dee77244e92eaf89.jpg!q70.dpg",
                                            "pPrice": "69.90",
                                            "brandName": "",
                                            "srv": "null_10786598_1067048_3_10786598-18076349-2403585184-1067048#1-0-2--0--#1-0-#3-16354431#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/67841/38/11230/220492/5d89c79bEe274eb25/dee77244e92eaf89.jpg!q70.dpg",
                                            "name": "伊利 纯牛奶250ml*24盒",
                                            "expoSrv": "38012108_10786598-18076349-2403585184-1067048#1-0-2--0--#1-0-#3-16354431#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16354431",
                                            "skuId": "1067048",
                                            "hideCart": "0"
                                        }],
                                        "pro_10899266": [{
                                            "image": "//m.360buyimg.com/babel/jfs/t1/52246/31/11250/80656/5d81fba9Eda62a18d/d7281d312556d98b.jpg!q70.dpg",
                                            "pPrice": "6999",
                                            "brandName": "",
                                            "srv": "null_10899266_100008535982_1_10899266-18312154-5703834406-100008535982#1-0-2--0--#1-0-#3-16627229#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/52246/31/11250/80656/5d81fba9Eda62a18d/d7281d312556d98b.jpg!q70.dpg",
                                            "name": "联想(Lenovo)小新Pro13.3英寸英特尔酷睿i7全面屏超轻薄笔记本电脑(六核I7 16G 512G MX250 QHD",
                                            "expoSrv": "38012108_10899266-18312154-5703834406-100008535982#1-0-2--0--#1-0-#3-16627229#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16627229",
                                            "skuId": "100008535982",
                                            "hideCart": "0"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t1/73908/33/14085/153621/5dba4337E1374579e/5ab956b948bcad89.jpg!q70.dpg",
                                            "pPrice": "8299",
                                            "brandName": "",
                                            "srv": "null_10899266_100009083152_2_10899266-18312154-5703834409-100009083152#1-0-2--0--#1-0-#3-16627229#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/73908/33/14085/153621/5dba4337E1374579e/5ab956b948bcad89.jpg!q70.dpg",
                                            "name": "联想(Lenovo)  Y9000X英特尔酷睿i7 15.6英寸高性能标压轻薄笔记本电脑(i7-9750H 16G 1TSSD",
                                            "expoSrv": "38012108_10899266-18312154-5703834409-100009083152#1-0-2--0--#1-0-#3-16627229#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16627229",
                                            "skuId": "100009083152",
                                            "hideCart": "1"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t1/46448/29/14453/124240/5db2f0a9E54a96a38/d0c982edf5882aaf.jpg!q70.dpg",
                                            "pPrice": "3699",
                                            "brandName": "",
                                            "srv": "null_10899266_100003052985_3_10899266-18312154-5703834408-100003052985#1-0-2--0--#1-0-#3-16627229#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/46448/29/14453/124240/5db2f0a9E54a96a38/d0c982edf5882aaf.jpg!q70.dpg",
                                            "name": "联想(Lenovo)小新14英寸 AMD锐龙版R5（全新12nm）轻薄笔记本电脑(R5-3500U 8G 1TB+256G P",
                                            "expoSrv": "38012108_10899266-18312154-5703834408-100003052985#1-0-2--0--#1-0-#3-16627229#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16627229",
                                            "skuId": "100003052985",
                                            "hideCart": "0"
                                        }],
                                        "pro_10848899": [{
                                            "image": "//m.360buyimg.com/babel/jfs/t1/99730/1/154/477811/5da833a6E814e6676/79c4d1ea436ed9ea.jpg!q70.dpg",
                                            "pPrice": "1499",
                                            "brandName": "",
                                            "srv": "null_10848899_100009219518_1_10848899-18211925-0303745929-100009219518#1-0-2--0--#1-0-#3-16507310#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/99730/1/154/477811/5da833a6E814e6676/79c4d1ea436ed9ea.jpg!q70.dpg",
                                            "name": "荣耀20青春版 AMOLED屏幕指纹 4000mAh大电池 20W快充 4800万 手机 6GB+64GB 蓝水翡翠",
                                            "expoSrv": "38012108_10848899-18211925-0303745929-100009219518#1-0-2--0--#1-0-#3-16507310#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16507310",
                                            "skuId": "100009219518",
                                            "hideCart": "0"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t1/26070/26/12789/383055/5c99ecb9Ecd4e6bb9/4494127f19776033.jpg!q70.dpg",
                                            "pPrice": "1799",
                                            "brandName": "",
                                            "srv": "null_10848899_100001364160_2_10848899-18211925-0303745932-100001364160#1-0-2--0--#1-0-#3-16507310#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/26070/26/12789/383055/5c99ecb9Ecd4e6bb9/4494127f19776033.jpg!q70.dpg",
                                            "name": "荣耀V20 游戏手机 麒麟980芯片 魅眼全视屏 4800万深感相机 6GB+128GB 魅海蓝 移动联通电信4G全面屏手机",
                                            "expoSrv": "38012108_10848899-18211925-0303745932-100001364160#1-0-2--0--#1-0-#3-16507310#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16507310",
                                            "skuId": "100001364160",
                                            "hideCart": "0"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t1/105067/27/911/159551/5db6716eE4b9a2232/ebc3f2a9f3e41546.jpg!q70.dpg",
                                            "pPrice": "1799",
                                            "brandName": "",
                                            "srv": "null_10848899_100002544828_3_10848899-18211925-0303745928-100002544828#1-0-2--0--#1-0-#3-16507310#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/105067/27/911/159551/5db6716eE4b9a2232/ebc3f2a9f3e41546.jpg!q70.dpg",
                                            "name": "荣耀V20 游戏手机 麒麟980芯片 魅眼全视屏 4800万深感相机 6GB+128GB 幻夜黑 移动联通电信4G",
                                            "expoSrv": "38012108_10848899-18211925-0303745928-100002544828#1-0-2--0--#1-0-#3-16507310#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16507310",
                                            "skuId": "100002544828",
                                            "hideCart": "0"
                                        }],
                                        "pro_10848900": [{
                                            "image": "//m.360buyimg.com/babel/jfs/t1/59957/6/7465/277562/5d5682c3E58792cdb/39c5bac57c282e04.jpg!q70.dpg",
                                            "pPrice": "5389",
                                            "brandName": "",
                                            "srv": "null_10848900_100006910886_1_10848900-18211926-0203557259-100006910886#1-0-2--0--#1-0-#3-16507311#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/59957/6/7465/277562/5d5682c3E58792cdb/39c5bac57c282e04.jpg!q70.dpg",
                                            "name": "戴尔(DELL)成就5090 英特尔酷睿i5 高性能商用办公台式电脑(i5-9400 8G 256G 1T RX550 4G ",
                                            "expoSrv": "38012108_10848900-18211926-0203557259-100006910886#1-0-2--0--#1-0-#3-16507311#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16507311",
                                            "skuId": "100006910886",
                                            "hideCart": "0"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t1/65226/2/13286/303240/5da81f01E67be96a5/d94a06662233338f.jpg!q70.dpg",
                                            "pPrice": "4899",
                                            "brandName": "",
                                            "srv": "null_10848900_100004051733_2_10848900-18211926-0203557264-100004051733#1-0-2--0--#1-0-#3-16507311#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/65226/2/13286/303240/5da81f01E67be96a5/d94a06662233338f.jpg!q70.dpg",
                                            "name": "戴尔(DELL)灵越AIO 5491 23.8英寸 英特尔酷睿i5微边框一体机台式电脑(十代i5-10210U 8G 512G",
                                            "expoSrv": "38012108_10848900-18211926-0203557264-100004051733#1-0-2--0--#1-0-#3-16507311#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16507311",
                                            "skuId": "100004051733",
                                            "hideCart": "0"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t1/66627/34/13035/303790/5da825c6E4e6a1651/d1d6cd5c7c33695a.jpg!q70.dpg",
                                            "pPrice": "4299",
                                            "brandName": "",
                                            "srv": "null_10848900_100004771275_3_10848900-18211926-0203557260-100004771275#1-0-2--0--#1-0-#3-16507311#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/66627/34/13035/303790/5da825c6E4e6a1651/d1d6cd5c7c33695a.jpg!q70.dpg",
                                            "name": "戴尔灵越5000 14英寸英特尔酷睿i5高性能轻薄窄边框笔记本电脑(十代i5-1035G1 8G 1TSSD)银",
                                            "expoSrv": "38012108_10848900-18211926-0203557260-100004771275#1-0-2--0--#1-0-#3-16507311#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16507311",
                                            "skuId": "100004771275",
                                            "hideCart": "1"
                                        }],
                                        "pro_10784232": [{
                                            "image": "//m.360buyimg.com/babel/jfs/t1/21209/10/14346/237017/5ca5d095E70ccc3a1/547fa5dd49d94ca1.jpg!q70.dpg",
                                            "pPrice": "3770",
                                            "brandName": "",
                                            "srv": "null_10784232_320123_1_10784232-18071317-7403651411-320123#1-0-2--0--#1-0-#3-16348658#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/21209/10/14346/237017/5ca5d095E70ccc3a1/547fa5dd49d94ca1.jpg!q70.dpg",
                                            "name": "天梭(TISSOT)瑞士手表 力洛克系列皮带机械男士手表T006.407.16.053.00",
                                            "expoSrv": "38012108_10784232-18071317-7403651411-320123#1-0-2--0--#1-0-#3-16348658#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16348658",
                                            "skuId": "320123",
                                            "hideCart": "0"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t1/32579/1/9482/212202/5ca5cd6eE7bdc0546/80bc5184f1766c33.jpg!q70.dpg",
                                            "pPrice": "4210",
                                            "brandName": "",
                                            "srv": "null_10784232_207773_2_10784232-18071317-7403651409-207773#1-0-2--0--#1-0-#3-16348658#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/32579/1/9482/212202/5ca5cd6eE7bdc0546/80bc5184f1766c33.jpg!q70.dpg",
                                            "name": "天梭(TISSOT)瑞士手表 力洛克系列钢带机械男士手表T006.407.11.053.00新款",
                                            "expoSrv": "38012108_10784232-18071317-7403651409-207773#1-0-2--0--#1-0-#3-16348658#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16348658",
                                            "skuId": "207773",
                                            "hideCart": "0"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t1/27518/19/14306/202064/5ca5d0daE575981bf/42ef3809bca39354.jpg!q70.dpg",
                                            "pPrice": "1970",
                                            "brandName": "",
                                            "srv": "null_10784232_2429934_3_10784232-18071317-7403651408-2429934#1-0-2--0--#1-0-#3-16348658#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/27518/19/14306/202064/5ca5d0daE575981bf/42ef3809bca39354.jpg!q70.dpg",
                                            "name": "【京选尚品x天梭】天梭(TISSOT)瑞士手表 俊雅系列皮带石英男士手表T063.610.16.058.00",
                                            "expoSrv": "38012108_10784232-18071317-7403651408-2429934#1-0-2--0--#1-0-#3-16348658#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16348658",
                                            "skuId": "2429934",
                                            "hideCart": "0"
                                        }],
                                        "pro_10791925": [{
                                            "image": "//m.360buyimg.com/babel/jfs/t1/65019/24/13215/47685/5da868eeEab487fc7/520971b98602b879.jpg!q70.dpg",
                                            "pPrice": "996",
                                            "brandName": "",
                                            "srv": "null_10791925_4195513_1_10791925-18085323-6203543956-4195513#1-0-2--0--#1-0-#3-16364824#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/65019/24/13215/47685/5da868eeEab487fc7/520971b98602b879.jpg!q70.dpg",
                                            "name": "松下（Panasonic）智能马桶盖 洁身器 抗菌材质 电子坐便盖 储热式洁净升级DL-1309CWS",
                                            "expoSrv": "38012108_10791925-18085323-6203543956-4195513#1-0-2--0--#1-0-#3-16364824#_1#2#8175569a2e8331140d68b80c826f33c0ca08a422-0-621037#16364824",
                                            "skuId": "4195513",
                                            "hideCart": "0"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t1/45450/20/14099/151532/5dad61ebE723fcea1/67740a459ad9632e.jpg!q70.dpg",
                                            "pPrice": "1399",
                                            "brandName": "",
                                            "srv": "null_10791925_42424101682_2_10791925-18085323-6203543955-42424101682#1-0-2--0--#1-0-#3-16364824#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/45450/20/14099/151532/5dad61ebE723fcea1/67740a459ad9632e.jpg!q70.dpg",
                                            "name": "松下（panasonic）智能马桶盖通用即热式日本品牌坐便盖板快速加热洁身器DL-5208CWS 宽幅清洗升级 2019新款",
                                            "expoSrv": "38012108_10791925-18085323-6203543955-42424101682#1-0-2--0--#1-0-#3-16364824#_1#2#8175569a2e8331140d68b80c826f33c0ca08a422-0-621037#16364824",
                                            "skuId": "42424101682",
                                            "hideCart": "0"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t1/61810/39/13162/100181/5da868caE6ccccadb/55b1be819cdfb6ec.jpg!q70.dpg",
                                            "pPrice": "2299",
                                            "brandName": "",
                                            "srv": "null_10791925_3175069_3_10791925-18085323-6203543957-3175069#1-0-2--0--#1-0-#3-16364824#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/61810/39/13162/100181/5da868caE6ccccadb/55b1be819cdfb6ec.jpg!q70.dpg",
                                            "name": "松下（Panasonic）智能马桶盖 洁身器 电子坐便盖 即热式全功能款DL-5230CWS",
                                            "expoSrv": "38012108_10791925-18085323-6203543957-3175069#1-0-2--0--#1-0-#3-16364824#_1#2#8175569a2e8331140d68b80c826f33c0ca08a422-0-621037#16364824",
                                            "skuId": "3175069",
                                            "hideCart": "0"
                                        }],
                                        "pro_10920923": [{
                                            "image": "//m.360buyimg.com/babel/jfs/t10516/138/2705796330/247522/af6d5f81/5cd54594Ndddd0dbc.jpg!q70.dpg",
                                            "pPrice": "6999",
                                            "brandName": "",
                                            "srv": "null_10920923_100005603834_1_10920923-18350816-5003625183-100005603834#1-0-2--0--#1-0-#3-16667263#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t10516/138/2705796330/247522/af6d5f81/5cd54594Ndddd0dbc.jpg!q70.dpg",
                                            "name": "惠普(HP)暗影精灵5 15.6英寸高色域游戏笔记本电脑(i5-9300H 8G 512GSSD GTX1660Ti 6G独显",
                                            "expoSrv": "38012108_10920923-18350816-5003625183-100005603834#1-0-2--0--#1-0-#3-16667263#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16667263",
                                            "skuId": "100005603834",
                                            "hideCart": "1"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t1/75984/19/14332/191194/5dbaef50Ee1315acc/753c979383e1723e.jpg!q70.dpg",
                                            "pPrice": "9399",
                                            "brandName": "",
                                            "srv": "null_10920923_100004037725_2_10920923-18350816-5003625192-100004037725#1-0-2--0--#1-0-#3-16667263#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/75984/19/14332/191194/5dbaef50Ee1315acc/753c979383e1723e.jpg!q70.dpg",
                                            "name": "惠普(HP)暗影精灵5 Super 游戏台式电脑主机（九代i7-9700F 16G 256GSSD+1TB RTX2070S ",
                                            "expoSrv": "38012108_10920923-18350816-5003625192-100004037725#1-0-2--0--#1-0-#3-16667263#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16667263",
                                            "skuId": "100004037725",
                                            "hideCart": "0"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t29863/7/1102676968/247306/4a08926d/5cd5435eNdd381a8c.jpg!q70.dpg",
                                            "pPrice": "7299",
                                            "brandName": "",
                                            "srv": "null_10920923_100005603832_3_10920923-18350816-5003625188-100005603832#1-0-2--0--#1-0-#3-16667263#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t29863/7/1102676968/247306/4a08926d/5cd5435eNdd381a8c.jpg!q70.dpg",
                                            "name": "惠普(HP)暗影精灵5 15.6英寸电竞屏游戏笔记本电脑(i7-9750H 8G 512GSSD GTX1650 4G独显 1",
                                            "expoSrv": "38012108_10920923-18350816-5003625188-100005603832#1-0-2--0--#1-0-#3-16667263#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16667263",
                                            "skuId": "100005603832",
                                            "hideCart": "1"
                                        }],
                                        "pro_10768052": [{
                                            "image": "//m.360buyimg.com/babel/jfs/t1/103214/25/422/231029/5dad744fE45ea37ee/22dc904d4a46e0e3.jpg!q70.dpg",
                                            "pPrice": "73.90",
                                            "brandName": "",
                                            "srv": "null_10768052_4636525_1_10768052-18033425-8603496600-4636525#1-0-2--0--#1-0-#3-16303383#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/103214/25/422/231029/5dad744fE45ea37ee/22dc904d4a46e0e3.jpg!q70.dpg",
                                            "name": "清扬(CLEAR)植觉无硅油洗发水 男士净醒去屑洗发露 咖啡因精华380ml",
                                            "expoSrv": "38012108_10768052-18033425-8603496600-4636525#1-0-2--0--#1-0-#3-16303383#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16303383",
                                            "skuId": "4636525",
                                            "hideCart": "0"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t1/65173/6/13360/319940/5dad196fE64d646e0/caa32f93476734cd.jpg!q70.dpg",
                                            "pPrice": "105",
                                            "brandName": "",
                                            "srv": "null_10768052_6930866_2_10768052-18033425-8603496601-6930866#1-0-2--0--#1-0-#3-16303383#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/65173/6/13360/319940/5dad196fE64d646e0/caa32f93476734cd.jpg!q70.dpg",
                                            "name": "奥妙 除菌除螨洗衣液 18.3斤超值限量大礼包 浓缩天然酵素 持久留香 家庭清洁必备组套（新老包装 随机发货）",
                                            "expoSrv": "38012108_10768052-18033425-8603496601-6930866#1-0-2--0--#1-0-#3-16303383#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16303383",
                                            "skuId": "6930866",
                                            "hideCart": "0"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t1/51896/16/13826/188575/5da98c05Ea2c8b564/0f5d78e07d9323b9.jpg!q70.dpg",
                                            "pPrice": "78",
                                            "brandName": "",
                                            "srv": "null_10768052_3853859_3_10768052-18033425-8603496599-3853859#1-0-2--0--#1-0-#3-16303383#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/51896/16/13826/188575/5da98c05Ea2c8b564/0f5d78e07d9323b9.jpg!q70.dpg",
                                            "name": "多芬(DOVE)滋养美肤沐浴乳套装 深层营润1000g+樱花甜香1000g送清透水润190mlx2+洗护发旅行装50mlx2(",
                                            "expoSrv": "38012108_10768052-18033425-8603496599-3853859#1-0-2--0--#1-0-#3-16303383#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16303383",
                                            "skuId": "3853859",
                                            "hideCart": "0"
                                        }],
                                        "pro_10796423": [{
                                            "image": "//m.360buyimg.com/babel/jfs/t1/54190/27/13878/400669/5da9c764Ec3d0bcf4/17412b68ebdd61ec.jpg!q70.dpg",
                                            "pPrice": "99.90",
                                            "brandName": "",
                                            "srv": "null_10796423_100009150026_1_10796423-18095345-7703642379-100009150026#1-0-2--0--#1-0-#3-16379336#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/54190/27/13878/400669/5da9c764Ec3d0bcf4/17412b68ebdd61ec.jpg!q70.dpg",
                                            "name": "汰渍 全效360度洗衣液超值套装（洁雅百合）3kg*2+500g*6",
                                            "expoSrv": "38012108_10796423-18095345-7703642379-100009150026#1-0-2--0--#1-0-#3-16379336#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16379336",
                                            "skuId": "100009150026",
                                            "hideCart": "0"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t1/62058/28/13763/247339/5db01905E0d393a75/90e8dadc407a4a19.jpg!q70.dpg",
                                            "pPrice": "74.90",
                                            "brandName": "",
                                            "srv": "null_10796423_2788622_2_10796423-18095345-7703642370-2788622#1-0-2--0--#1-0-#3-16379336#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/62058/28/13763/247339/5db01905E0d393a75/90e8dadc407a4a19.jpg!q70.dpg",
                                            "name": "护舒宝 日夜组合 未来感·极护液体卫生巾套装3包(日用240mm*20片+夜用317mm*10片 进口液体材料)",
                                            "expoSrv": "38012108_10796423-18095345-7703642370-2788622#1-0-2--0--#1-0-#3-16379336#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16379336",
                                            "skuId": "2788622",
                                            "hideCart": "0"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t1/71378/17/13319/107493/5daedaf3E04e43645/2019b88e1d1bde49.jpg!q70.dpg",
                                            "pPrice": "181",
                                            "brandName": "",
                                            "srv": "null_10796423_100003829341_3_10796423-18095345-7703642377-100003829341#1-0-2--0--#1-0-#3-16379336#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/71378/17/13319/107493/5daedaf3E04e43645/2019b88e1d1bde49.jpg!q70.dpg",
                                            "name": "吉列引力盒Gillette手动剃须刀刮胡刀吉利非电动锋隐致顺（1刀架1刀头+4刀头+磁力底座）",
                                            "expoSrv": "38012108_10796423-18095345-7703642377-100003829341#1-0-2--0--#1-0-#3-16379336#_1#2#1c887ba1b1235ca92e3e80f0e648d6bb791d65d-0-621037#16379336",
                                            "skuId": "100003829341",
                                            "hideCart": "0"
                                        }],
                                        "pro_10791924": [{
                                            "image": "//m.360buyimg.com/babel/jfs/t1/67870/7/13409/416682/5dac1770Ec347fcd5/686cd05c0ce1f8b3.jpg!q70.dpg",
                                            "pPrice": "1500",
                                            "brandName": "",
                                            "srv": "null_10791924_100009177368_1_10791924-18085322-6303568806-100009177368#1-0-2--0--#1-0-#3-16364820#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/67870/7/13409/416682/5dac1770Ec347fcd5/686cd05c0ce1f8b3.jpg!q70.dpg",
                                            "name": "华为 HUAWEI nova 5z 麒麟810芯片 4800万AI四摄 3200万人像超级夜景  6GB+64GB 幻夜黑 全",
                                            "expoSrv": "38012108_10791924-18085322-6303568806-100009177368#1-0-2--0--#1-0-#3-16364820#_1#2#8175569a2e8331140d68b80c826f33c0ca08a422-0-621037#16364820",
                                            "skuId": "100009177368",
                                            "hideCart": "0"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t1/48976/29/14114/674431/5dafcd8fEb4fa843a/669de2e3dccee91f.jpg!q70.dpg",
                                            "pPrice": "5499",
                                            "brandName": "",
                                            "srv": "null_10791924_100005185603_2_10791924-18085322-6303568807-100005185603#1-0-2--0--#1-0-#3-16364820#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/48976/29/14114/674431/5dafcd8fEb4fa843a/669de2e3dccee91f.jpg!q70.dpg",
                                            "name": "华为 HUAWEI Mate 30 5G 麒麟990 5G旗舰芯片4000万超感光徕卡影像双超级快充8GB+256GB亮黑色5",
                                            "expoSrv": "38012108_10791924-18085322-6303568807-100005185603#1-0-2--0--#1-0-#3-16364820#_1#2#8175569a2e8331140d68b80c826f33c0ca08a422-0-621037#16364820",
                                            "skuId": "100005185603",
                                            "hideCart": "1"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t1/66991/16/2835/201268/5d11cbc6Ee8fc92c3/f1b6954d52a2ff66.jpg!q70.dpg",
                                            "pPrice": "2599",
                                            "brandName": "",
                                            "srv": "null_10791924_100003784331_3_10791924-18085322-6303568812-100003784331#1-0-2--0--#1-0-#3-16364820#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/66991/16/2835/201268/5d11cbc6Ee8fc92c3/f1b6954d52a2ff66.jpg!q70.dpg",
                                            "name": "华为 HUAWEI nova 5 前置3200万人像超级夜景4800万AI四摄40W超级快充8GB+128GB亮黑色全网通双4",
                                            "expoSrv": "38012108_10791924-18085322-6303568812-100003784331#1-0-2--0--#1-0-#3-16364820#_1#2#8175569a2e8331140d68b80c826f33c0ca08a422-0-621037#16364820",
                                            "skuId": "100003784331",
                                            "hideCart": "0"
                                        }],
                                        "pro_10863771": [{
                                            "image": "//m.360buyimg.com/babel/jfs/t1/86238/11/502/235285/5daec505E55654f0a/c446da8629828aa8.jpg!q70.dpg",
                                            "pPrice": "159",
                                            "brandName": "",
                                            "srv": "null_10863771_100008045254_1_10863771-18242274-2203569283-100008045254#1-0-2--0--#1-0-#3-16539114#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/86238/11/502/235285/5daec505E55654f0a/c446da8629828aa8.jpg!q70.dpg",
                                            "name": "美宝莲（MAYBELLINE）定制柔雾粉底轻垫霜 柔雾版 120 14g（fitme气垫 轻薄裸妆 滋润保湿 隔离BB霜 粉底",
                                            "expoSrv": "38012108_10863771-18242274-2203569283-100008045254#1-0-2--0--#1-0-#3-16539114#_1#2#8175569a2e8331140d68b80c826f33c0ca08a422-0-621037#16539114",
                                            "skuId": "100008045254",
                                            "hideCart": "0"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t1/49704/16/14651/182443/5db7df4eE430be647/6442f355933401ed.jpg!q70.dpg",
                                            "pPrice": "199",
                                            "brandName": "",
                                            "srv": "null_10863771_100007391254_2_10863771-18242274-2203569287-100007391254#1-0-2--0--#1-0-#3-16539114#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/49704/16/14651/182443/5db7df4eE430be647/6442f355933401ed.jpg!q70.dpg",
                                            "name": "欧莱雅（LOREAL）恒放溢彩持色哑光遮瑕轻垫霜 蜷川实花联名气垫 N2 14g （ 粉底液 BB霜）",
                                            "expoSrv": "38012108_10863771-18242274-2203569287-100007391254#1-0-2--0--#1-0-#3-16539114#_1#2#8175569a2e8331140d68b80c826f33c0ca08a422-0-621037#16539114",
                                            "skuId": "100007391254",
                                            "hideCart": "0"
                                        }, {
                                            "image": "//m.360buyimg.com/babel/jfs/t1/69571/30/13866/199203/5db663efEd09218e0/0b3a271a3b97bda2.jpg!q70.dpg",
                                            "pPrice": "174",
                                            "brandName": "",
                                            "srv": "null_10863771_100002512307_3_10863771-18242274-2203569289-100002512307#1-0-2--0--#1-0-#3-16539114#_0",
                                            "pictureUrl": "//m.360buyimg.com/babel/jfs/t1/69571/30/13866/199203/5db663efEd09218e0/0b3a271a3b97bda2.jpg!q70.dpg",
                                            "name": "【11.11预售】欧莱雅男士水能玻尿酸保湿护肤(洁面+水凝露+滋润乳+洁面100ml+水凝露50ml+滋润乳24ml)洗面奶",
                                            "expoSrv": "38012108_10863771-18242274-2203569289-100002512307#1-0-2--0--#1-0-#3-16539114#_1#2#8175569a2e8331140d68b80c826f33c0ca08a422-0-621037#16539114",
                                            "skuId": "100002512307",
                                            "hideCart": "0"
                                        }]
                                    }
                                })
                            });
                        }
                        page.shot(7900);
                        setTimeout(function () {
                            var NavLength = page.evaluate(function () {
                                return document.querySelectorAll("div.touch-scroll-view > ul > li,#J_babelOptPage > div > div.bab-opt-mod.bab-opt-mod-1_9.anchor_nav > ul > div.anchor-content > li").length;

                            });

                            if (NavLength.length !== 0) {
                                var _loop = function _loop(i) {
                                    setTimeout(function () {
                                        S.scrollTo(320 * i, 80 * i);
                                        // window.scrollTo(80 * i, 160 * i);
                                    }, 500 * i);
                                };
                                for (var i = 1; i < 5; i++) {
                                    _loop(i);
                                }
                                page.evaluate(function (ext2) {
                                    setTimeout(function () {
                                        var Nav = document.querySelectorAll("div.touch-scroll-view > ul > li,#J_babelOptPage > div > div.bab-opt-mod.bab-opt-mod-1_9.anchor_nav > ul > div.anchor-content > li");
                                        var a = Nav;
                                        var __loop = function _loop(i, s) {
                                            setTimeout(function () {
                                                s.click();
                                            }, 1000 * i);
                                        };

                                        for (var i = 1; i < a.length; i++) {
                                            if (a[i].innerText !== ext2) {
                                                __loop(i, a[i]);
                                            } else {
                                                __loop(i, a[i]);
                                                break;
                                            }
                                        }
                                    }, 7000)
                                }, ext2)
                            } else {
                                var _loop = function _loop(i) {
                                    setTimeout(function () {
                                        S.scrollTo(800 * i, 400 * i);
                                        // window.scrollTo(400 * i, 800 * i);
                                    }, 500 * i);
                                };
                                for (var i = 1; i < 20; i++) {
                                    _loop(i);
                                }
                            }
                        }, 3000);
                        setTimeout(function () {
                            if (parseInt(Math.random() * 1000) < jw_click * 10) {
                                page.evaluate(function (ext3) {
                                    var tab = document.querySelectorAll('#pc > div.floor-nav-pc.f-nav-skin > div:nth-child(6) > div.tabs-container.pre-goods.color-purple.custom-tabs.w990 > div:nth-child(1) > div > div div,#pc > div.floor-nav-pc.f-nav-skin > div:nth-child(7) > div.tabs-container.pre-goods.color-orange.custom-tabs.w990 > div:nth-child(1) > div > div div,#pc > div.floor-nav-pc.f-nav-skin > div:nth-child(7) > div.tabs-container.sel-goods.custom-tabs.w990 > div:nth-child(1) > div > div div');
                                    if (tab.length !== 0) {
                                        tab[parseInt(Math.random() * tab.length)].click();
                                    }
                                    setTimeout(function () {
                                        //'div.section > div.tabs-container.pre-goods.custom-tabs > div.tabs-panels section[style=""] li > div > a:not(.addtoCart),#pc > div.floor-nav-pc.f-nav-skin > div:nth-child(7) > div.tabs-container.sel-goods.custom-tabs.w990 > div.tabs-panels > section[style=""] a:not(.addtoCart)'
                                        var a = document.querySelectorAll(ext3);
                                        if (a.length === 0) {
                                            console.log("无二跳点位,尝试data-v-jump");
                                            a = document.querySelectorAll("div[data-v-jump]");
                                        }
                                        if (a.length === 0) {
                                            console.log("无二跳点位,尝试item");
                                            a = document.querySelectorAll("a[href*='item']");
                                        }
                                        if (a.length === 0) {
                                            console.log("无二跳点位,尝试随机");
                                            a = document.querySelectorAll("a");
                                        }
                                        var toLink = a[parseInt(Math.random() * a.length)];
                                        if (toLink.target !== undefined && toLink.getAttribute('target') !== null) {
                                            toLink.removeAttribute('target')
                                        }
                                        toLink.click();
                                    }, 2000);
                                }, S.config["二跳标签"]);

                            }
                            page.shot(25000);
                            page.count(35000 + parseInt(Math.random() * 10000));
                        }, S.stayValue("10-15") * 1000)
                    } else if (url.length > 5 && loadVar === 1 && status === 'success') {
                        loadVar = 2;
                        page.shot(7900);
                        setTimeout(function () {
                            if (parseInt(Math.random() * 1000) < parseInt(ext1) * 10) {
                                page.evaluate(function () {
                                    document.querySelector("#buyBtn2,#btn-reservation,#InitCartUrl").click();
                                    // setTimeout(function () {
                                    // document.querySelectorAll('#skuPop1 span')[parseInt(Math.random() * document.querySelectorAll('#skuPop1 span').length)].click();
                                    // setTimeout(function () {
                                    //     document.querySelector('#addCart1').click();
                                    // },2000 + parseInt(Math.random() * 500))
                                    // }, 1000 + parseInt(Math.random() * 500))
                                });
                            }
                            page.count(10000 + parseInt(Math.random() * 5000))
                        }, 10000)
                    }
                };
            }
            else {
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
                    if ((url.indexOf("prodev.jd.com") >= 0 || url.indexOf('m.jd.com') >= 0 || url.indexOf("view.m.jd.com") >= 0 || url.indexOf('pro.jd.com') >= 0 || url.indexOf('h5.m.jd.com') >= 0 || url.indexOf("prodev.m.jd.com") >= 0) && url.indexOf('ccc-x.jd') < 0 && loadVar === 0) {
                        loadVar = 1;
                        page.shot(7900);
                        page.shot(15900);
                        setTimeout(function () {
                            var tabs = page.evaluate(function () {
                                var box = document.querySelector('#J_babelOptPage > div:nth-child(51) > div > div > span,#J_babelOptPage > div:nth-child(81) > div > div > span') !== null ? document.querySelector('#J_babelOptPage > div:nth-child(51) > div > div > span,#J_babelOptPage > div:nth-child(81) > div > div > span').click() : '';
                                var Nav = document.querySelectorAll("#J_babelOptPage > div.bab_opt_mod.bab_opt_mod_5_7 > div > div.dropdown_pd_tab.pd_nx.tab_words_module.fixed > div li,div#floatingRightFix > ul > li > a,div.anchor_tab_scroller li,div.anchor_tab li,div.it_flex_c.itr_single_line a,div.bab_opt_mod_1_9.show div > div.pd_nav_wrap a,#J_babelOptPage > div.bab_opt_mod.bab_opt_mod_1_21.show > div.pd_tab.pd_2x.tab_words_module > div > div li,#m_2_10 > div.basement_head.tab_nx.tab_words_module > div > ul li,#m_2_11 > div.basement_head.tab_nx.tab_words_module > div > ul li,#m_2_6 > div.basement_head.tab_nx.tab_words_module > div > ul li,#J_babelOptPage > div.bab_opt_mod.bab_opt_mod_1_16.anchor_nav > div.anchor_navigation_module.black.tab_pic_module > div > div.anchor_tab > div ul >li>p.item>span,#app > div > div.recommend.hasChangeTab > div.recommendWrap > div > div div>div >tabs,#app > div > div.fix-container > div > div > div > div.nav-bottom > div div span,#app > div > div.fix-container > div > div > div > div > div.nav-bar span,div.nav-top >div.nav-bar span,#J_babelOptPage > div.bab_opt_mod.bab_opt_mod_1_12 > div.top_nav_module_hd.free_nx > div > div > ul li i,#J_babelOptPage > div.bab_opt_mod.bab_opt_mod_1_20.feeds > div > div.tabs_bar.txt_style > div > ul > li > a div.txt_wrap,#J_babelOptPage > div.bab_opt_mod.bab_opt_mod_2_1.show > div.pd_tab.pd_4x.tab_words_module.fixed > div > div > ul li,#J_babelOptPage > div > div.bab_opt_mod.bab_opt_mod_1_7.module_20443112.anchor_nav > div > div.anchor-tab > ul li,#J_babelOptPage > div > div.bab_opt_mod.bab_opt_mod_1_19.module_20872779.shangpin_putong > div.pd_tab.pd_nx.pd_tab_1 > div > div.sticky-inner-view.nav-fixed > div > ul > a > div,#home > div.sticky-nav-container.nav > div > div.sticky-nav-expand-panel > ul > li > i,#J_babelOptPage > div > div.bab_opt_mod.bab_opt_mod_1_6.module_20766205.anchor_nav > div > div.anchor-tab > ul > li,#J_babelOptPage > div > div.bab_opt_mod.bab_opt_mod_1_9.module_21059848.anchor_nav > div > div.anchor-tab > ul > li,#home > div.sticky-nav-container.nav > div > div > div > ul > li,#root > div:nth-child(2) > div > div > ul li,#J_babelOptPage > div > div.bab_opt_mod.bab_opt_mod_1_10.module_22082534.anchor_nav > div > div.anchor-tab > ul li,#J_babelOptPage > div > div.bab_opt_mod.bab_opt_mod_1_4.module_22016339.anchor_nav > div > div.anchor-tab > ul li,#J_babelOptPage > div > div.bab_opt_mod.bab_opt_mod_1_2.module_23430351.anchor_nav > div > div.anchor-tab > ul li,div.anchor-tab > ul li,ul > li[class*=\"item\"],div.Nav-Tab ");
                                return Nav.length > 0 ? true : false;
                            });
                            if (!tabs) {
                                var _loop = function _loop(i) {
                                    setTimeout(function () {
                                        if (S.config["P滑动"] === undefined) {
                                            console.log("滑动1");
                                            S.scrollTo(1600 * i, 400);
                                        } else {
                                            page.evaluate(function (i) {
                                                window.scrollTo(400, 800 * i);
                                            },i)
                                        }
                                    }, 250 * i);
                                };
                                for (var i = 1; i < 20; i++) {
                                    _loop(i);
                                }
                            } else {
                                var _loop = function _loop(i) {
                                    setTimeout(function () {
                                        if (S.config["P滑动"] === undefined) {
                                            console.log("滑动1");
                                            S.scrollTo(1600 * i, 400);
                                        } else {
                                            page.evaluate(function (i) {
                                                window.scrollTo(400, 800 * i);
                                            },i)
                                        }
                                    }, 250 * i);
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
                                    // S.click(S.config["二跳标签"]);
                                    page.evaluate(function (ext3) {
                                        var a = document.querySelectorAll(ext3);
                                        if (a.length === 0) {
                                            console.log("无二跳点位,尝试data-v-jump");
                                            a = document.querySelectorAll("div[data-v-jump]");
                                        }
                                        if (a.length === 0) {
                                            console.log("无二跳点位,尝试item");
                                            a = document.querySelectorAll("a[href*='item']");
                                        }
                                        if (a.length === 0) {
                                            console.log("无二跳点位,尝试随机");
                                            a = document.querySelectorAll("a");
                                        }
                                        var toLink = a[parseInt(Math.random() * a.length)];
                                        if (toLink.target !== undefined && toLink.getAttribute('target') !== null) {
                                            toLink.removeAttribute('target')
                                        }
                                        toLink.click();
                                    }, S.config["二跳标签"])
                                }, 2000);
                            }
                            page.shot(25000);
                            page.count(35000 + parseInt(Math.random() * 10000));
                        }, S.stayValue("10-15") * 1000)
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
                        }, 10000)
                    }
                };
            }

            page.onResourceRequested = function (requestData, networkRequest) {
                var url = requestData.url;
                var suffix = url.substr(-4).toLowerCase();
                if (suffix === '.mp3' || suffix === '.mp4' || suffix === '.flv' || suffix === '.pdf' || suffix === '.png' || suffix === '.jpg' || suffix === '.dpg' || suffix === 'webp' || suffix === 'svg') {
                    !local ? networkRequest.abort() : ""
                } else if (url.indexOf(';base64') >= 0 && url.indexOf('data:image') >= 0 || url.indexOf("intent://") >= 0 || url.indexOf("openapp.jdmobile://virtual") >= 0 || url.indexOf("itms-appss://") >= 0 || url.indexOf("tmall://page.tm/appLink?") >= 0 || url.indexOf("g.alicdn.com/??mui/feloader") >= 0) {
                    //url.match(/^([^http]+)(s)?.+\/\//).length !== 0
                    !local ? networkRequest.abort() : ""
                } else if (url.indexOf('player.youku.com') >= 0 || url.indexOf('.jpg!') >= 0 || url.indexOf("admin.sgmlink.com") >= 0) {
                    !local ? networkRequest.abort() : ""
                } else if (url.indexOf("https://lapi.jd.com/locate?callback=jQuery") >= 0) {
                    // networkRequest.abort()
                } else {
                    actor.evaluate(function () {
                        window['_phantom'] = undefined;
                        window['callPhantom'] = undefined
                    })
                }
                if (loadVar === 0 && SuperVar.config["到达率"] !== undefined && parseInt(Math.random() * 1000) > parseInt(SuperVar.config["到达率"]) * 10 && url.length >= 10) {
                    loadVar = 999;
                    console.log("此轮不到达.");
                    setTimeout(function () {
                        actor.count(0);
                    }, 1800);
                }
                if (url.indexOf('lapi.jd.com/locate?callback=jQuery') >= 0 && url.indexOf('source=public') >= 0) {
                    networkRequest.changeUrl('https://lapi.jd.com/locate?callback=jQuery&source=public&_=' + Date.now());
                }
                if (SuperVar.config["包裹型回传"]) {
                    try {
                        var replaceUrl = (url.indexOf('e.cn.miaozhen.com') >= 0 || url.indexOf('click.tanx.com') >= 0 || url.indexOf("mo.open.taobao.com/v1/ck") >= 0 || (url.indexOf("mmstat.com") >= 0 && url.indexOf("__IMEI__") >= 0));
                        var jwUrl = (jw_url.indexOf('e.cn.miaozhen.com') === -1 && jw_url.indexOf('click.tanx.com') === -1 && jw_url.indexOf("mo.open.taobao.com/v1/ck") === -1) && (ext1.indexOf('e.cn.miaozhen.com') === -1 && ext1.indexOf('click.tanx.com') === -1 && ext1.indexOf("mo.open.taobao.com/v1/ck") === -1) && (ext2.indexOf('e.cn.miaozhen.com') === -1 && ext2.indexOf('click.tanx.com') === -1 && ext2.indexOf("mo.open.taobao.com/v1/ck") === -1);
                        if (replaceUrl && jwUrl) {
                            console.log("包裹类型回传，准备进行处理");
                            SuperVar.config["包裹型回传"] = false;
                            var newUrl = url;
                            networkRequest.abort();
                            if (url.indexOf("admaster") >= 0 && url.indexOf("__IMEI__") === -1) {
                                newUrl = url + ',0a__OS__,0c__IMEI__,0d__AndroidID__,n__MAC__,o__OUID__,z__IDFA__,f__IP__,t__TS__,r__TERM__,l__LBSS__'
                            }
                            newUrl = SuperVar.u2us(SuperVar.getUrls(newUrl));
                            console.log("替换后链接: " + newUrl);
                            actor.evaluate(function (url) {
                                window.location.href = url
                            }, newUrl)
                        }
                    } catch (e) {
                        console.log("ERR:" + e)
                    }
                }
            };
            page.onResourceReceived = S.onResourceReceived;
            page.onConsoleMessage = S.onConsoleMessage;
            var onInitialized = function () {
                var url = actor.evaluate(function (param) {
                    var old_screen = window.screen;
                    window.screen = {
                        availHeight: param.screenHeight,
                        availLeft: -param.screenWidth,
                        availTop: old_screen.availTop,
                        availWidth: param.screenWidth,
                        colorDepth: old_screen.colorDepth,
                        height: param.screenHeight,
                        orientation: old_screen.orientation,
                        pixelDepth: old_screen.pixelDepth,
                        width: param.screenWidth
                    };
                    window['_phantom'] = undefined;
                    window['callPhantom'] = undefined;
                    window.orientation = 0;
                    window.innerWidth = param.screenWidth;
                    window.innerHeight = param.screenHeight;
                    var new_navigator = JSON.parse(JSON.stringify(window.navigator));
                    new_navigator.platform = param.platform;
                    new_navigator.geolocation = null;
                    new_navigator.javaEnabled = function () {
                        return false
                    };
                    window.HTMLElement.prototype.play = function () {
                    };
                    window.HTMLElement.prototype.pause = function () {
                    };
                    new_navigator.language = 'zh-CN';
                    window.navigator = new_navigator;
                    window.ontouchstart = function () {
                    };
                    url = window.location.href;
                    return url
                }, param);
                if (url == 'about:blank' && actor.skipBlank === true) {
                    actor.skip(10)
                }
                actor.evaluate(function (weak) {
                    (function (window, weak, undefined) {
                        var final = function (status, value) {
                            var promise = this, fn, st;
                            if (promise._status !== 'PENDING') return;
                            setTimeout(function () {
                                promise._status = status;
                                st = promise._status === 'FULFILLED';
                                queue = promise[st ? '_resolves' : '_rejects'];
                                while (fn = queue.shift()) {
                                    value = fn.call(promise, value) || value
                                }
                                promise[st ? '_value' : '_reason'] = value;
                                promise['_resolves'] = promise['_rejects'] = undefined
                            })
                        };
                        var Promise = function (resolver) {
                            if (!(typeof resolver === 'function')) throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
                            if (!(this instanceof Promise)) return new Promise(resolver);
                            var promise = this;
                            promise._value;
                            promise._reason;
                            promise._status = 'PENDING';
                            promise._resolves = [];
                            promise._rejects = [];
                            var resolve = function (value) {
                                final.apply(promise, ['FULFILLED'].concat([value]))
                            };
                            var reject = function (reason) {
                                final.apply(promise, ['REJECTED'].concat([reason]))
                            };
                            resolver(resolve, reject)
                        };
                        Promise.prototype.then = function (onFulfilled, onRejected) {
                            var promise = this;
                            return new Promise(function (resolve, reject) {
                                function handle(value) {
                                    var ret = typeof onFulfilled === 'function' && onFulfilled(value) || value;
                                    if (ret && typeof ret['then'] == 'function') {
                                        ret.then(function (value) {
                                            resolve(value)
                                        }, function (reason) {
                                            reject(reason)
                                        })
                                    } else {
                                        resolve(ret)
                                    }
                                }

                                function errback(reason) {
                                    reason = typeof onRejected === 'function' && onRejected(reason) || reason;
                                    reject(reason)
                                }

                                if (promise._status === 'PENDING') {
                                    promise._resolves.push(handle);
                                    promise._rejects.push(errback)
                                } else if (promise._status === FULFILLED) {
                                    callback(promise._value)
                                } else if (promise._status === REJECTED) {
                                    errback(promise._reason)
                                }
                            })
                        };
                        Promise.prototype.catch = function (onRejected) {
                            return this.then(undefined, onRejected)
                        };
                        Promise.prototype.delay = function (ms, value) {
                            return this.then(function (ori) {
                                return Promise.delay(ms, value || ori)
                            })
                        };
                        Promise.delay = function (ms, value) {
                            return new Promise(function (resolve, reject) {
                                setTimeout(function () {
                                    resolve(value);
                                    console.log('1')
                                }, ms)
                            })
                        };
                        Promise.resolve = function (arg) {
                            return new Promise(function (resolve, reject) {
                                resolve(arg)
                            })
                        };
                        Promise.reject = function (arg) {
                            return Promise(function (resolve, reject) {
                                reject(arg)
                            })
                        };
                        Promise.all = function (promises) {
                            if (!Array.isArray(promises)) {
                                throw new TypeError('You must pass an array to all.');
                            }
                            return Promise(function (resolve, reject) {
                                var i = 0, result = [], len = promises.length, count = len;

                                function resolver(index) {
                                    return function (value) {
                                        resolveAll(index, value)
                                    }
                                }

                                function rejecter(reason) {
                                    reject(reason)
                                }

                                function resolveAll(index, value) {
                                    result[index] = value;
                                    if (--count == 0) {
                                        resolve(result)
                                    }
                                }

                                for (; i < len; i++) {
                                    promises[i].then(resolver(i), rejecter)
                                }
                            })
                        };
                        Promise.race = function (promises) {
                            if (!Array.isArray(promises)) {
                                throw new TypeError('You must pass an array to race.');
                            }
                            return Promise(function (resolve, reject) {
                                var i = 0, len = promises.length;

                                function resolver(value) {
                                    resolve(value)
                                }

                                function rejecter(reason) {
                                    reject(reason)
                                }

                                for (; i < len; i++) {
                                    promises[i].then(resolver, rejecter)
                                }
                            })
                        };
                        window.Promise = Promise;
                        konghanshu = function () {
                        };
                        window.HTMLVideoElement = konghanshu;
                        window.HTMLAudioElement = konghanshu;

                        function Set(arr) {
                            this.array = arr;
                        }

                        Set.prototype.has = function (item) {
                            for (var i = 0; i < this.array.length; i++) {
                                if (this.array[i] == item) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        };
                        Set.prototype.add = function (item) {

                            if (~this.array.indexOf(item))   //~位非运算符，利用indexOf；
                            {
                                return this.array;
                            } else {
                                this.array.push(item);
                            }
                            return this.array;
                        };
                        Set.prototype.delete = function (item) {
                            for (var i = 0; i < this.array.length; i++) {
                                if (item == this.array[i]) {
                                    this.array.splice(i, 1);
                                    return this.array;
                                }
                            }
                        };
                        Set.prototype.clear = function () {
                            this.array = [];
                            return this.array;
                        };
                        window.Set = Set;

                        function Map() {
                            var items = {};
                            this.has = function (key) {
                                return key in items;
                            },
                                this.set = function (key, value) {
                                    items[key] = value;
                                },
                                this.delete = function (key) {
                                    if (this.has(key)) {
                                        delete items[key];
                                        return true;
                                    }
                                    return false;
                                },
                                this.get = function (key) {
                                    return this.has(key) ? items[key] : undefined;
                                },
                                this.values = function () {
                                    var values = [];
                                    for (var k in items) {
                                        if (this.hasOwnProperty(k)) {
                                            values.push(items[k]);
                                        }
                                    }
                                    return values;
                                },
                                this.forEach = function (callback) {
                                    for (var key in items) {
                                        callback(items[key], key, this)
                                    }

                                },
                                this.clear = function () {
                                    items = {};
                                },
                                this.size = function () {
                                    return Object.Keys(items).length;
                                },
                                this.getItems = function () {
                                    return items;
                                }
                        }

                        if (weak) {
                            window.WeakMap = Map;
                            window.WeakSet = Set;
                        }
                        window.Map = Map;
                        window.Audio = function () {
                        };
                        window.LSprite = function () {
                        };
                        (function () {
                            'use strict';

// Exit early if we're not running in a browser.
                            if (typeof window !== 'object') {
                                return;
                            }

// Exit early if all IntersectionObserver and IntersectionObserverEntry
// features are natively supported.
                            if ('IntersectionObserver' in window &&
                                'IntersectionObserverEntry' in window &&
                                'intersectionRatio' in window.IntersectionObserverEntry.prototype) {

                                // Minimal polyfill for Edge 15's lack of `isIntersecting`
                                // See: https://github.com/w3c/IntersectionObserver/issues/211
                                if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
                                    Object.defineProperty(window.IntersectionObserverEntry.prototype,
                                        'isIntersecting', {
                                            get: function () {
                                                return this.intersectionRatio > 0;
                                            }
                                        });
                                }
                                return;
                            }


                            /**
                             * A local reference to the document.
                             */
                            var document = window.document;


                            /**
                             * An IntersectionObserver registry. This registry exists to hold a strong
                             * reference to IntersectionObserver instances currently observing a target
                             * element. Without this registry, instances without another reference may be
                             * garbage collected.
                             */
                            var registry = [];


                            /**
                             * Creates the global IntersectionObserverEntry constructor.
                             * https://w3c.github.io/IntersectionObserver/#intersection-observer-entry
                             * @param {Object} entry A dictionary of instance properties.
                             * @constructor
                             */
                            function IntersectionObserverEntry(entry) {
                                this.time = entry.time;
                                this.target = entry.target;
                                this.rootBounds = entry.rootBounds;
                                this.boundingClientRect = entry.boundingClientRect;
                                this.intersectionRect = entry.intersectionRect || getEmptyRect();
                                this.isIntersecting = !!entry.intersectionRect;

                                // Calculates the intersection ratio.
                                var targetRect = this.boundingClientRect;
                                var targetArea = targetRect.width * targetRect.height;
                                var intersectionRect = this.intersectionRect;
                                var intersectionArea = intersectionRect.width * intersectionRect.height;

                                // Sets intersection ratio.
                                if (targetArea) {
                                    // Round the intersection ratio to avoid floating point math issues:
                                    // https://github.com/w3c/IntersectionObserver/issues/324
                                    this.intersectionRatio = Number((intersectionArea / targetArea).toFixed(4));
                                } else {
                                    // If area is zero and is intersecting, sets to 1, otherwise to 0
                                    this.intersectionRatio = this.isIntersecting ? 1 : 0;
                                }
                            }


                            /**
                             * Creates the global IntersectionObserver constructor.
                             * https://w3c.github.io/IntersectionObserver/#intersection-observer-interface
                             * @param {Function} callback The function to be invoked after intersection
                             *     changes have queued. The function is not invoked if the queue has
                             *     been emptied by calling the `takeRecords` method.
                             * @param {Object=} opt_options Optional configuration options.
                             * @constructor
                             */
                            function IntersectionObserver(callback, opt_options) {

                                var options = opt_options || {};

                                if (typeof callback != 'function') {
                                    throw new Error('callback must be a function');
                                }

                                if (options.root && options.root.nodeType != 1) {
                                    throw new Error('root must be an Element');
                                }

                                // Binds and throttles `this._checkForIntersections`.
                                this._checkForIntersections = throttle(
                                    this._checkForIntersections.bind(this), this.THROTTLE_TIMEOUT);

                                // Private properties.
                                this._callback = callback;
                                this._observationTargets = [];
                                this._queuedEntries = [];
                                this._rootMarginValues = this._parseRootMargin(options.rootMargin);

                                // Public properties.
                                this.thresholds = this._initThresholds(options.threshold);
                                this.root = options.root || null;
                                this.rootMargin = this._rootMarginValues.map(function (margin) {
                                    return margin.value + margin.unit;
                                }).join(' ');
                            }


                            /**
                             * The minimum interval within which the document will be checked for
                             * intersection changes.
                             */
                            IntersectionObserver.prototype.THROTTLE_TIMEOUT = 100;


                            /**
                             * The frequency in which the polyfill polls for intersection changes.
                             * this can be updated on a per instance basis and must be set prior to
                             * calling `observe` on the first target.
                             */
                            IntersectionObserver.prototype.POLL_INTERVAL = null;

                            /**
                             * Use a mutation observer on the root element
                             * to detect intersection changes.
                             */
                            IntersectionObserver.prototype.USE_MUTATION_OBSERVER = true;


                            /**
                             * Starts observing a target element for intersection changes based on
                             * the thresholds values.
                             * @param {Element} target The DOM element to observe.
                             */
                            IntersectionObserver.prototype.observe = function (target) {
                                var isTargetAlreadyObserved = this._observationTargets.some(function (item) {
                                    return item.element == target;
                                });

                                if (isTargetAlreadyObserved) {
                                    return;
                                }

                                if (!(target && target.nodeType == 1)) {
                                    throw new Error('target must be an Element');
                                }

                                this._registerInstance();
                                this._observationTargets.push({element: target, entry: null});
                                this._monitorIntersections();
                                this._checkForIntersections();
                            };


                            /**
                             * Stops observing a target element for intersection changes.
                             * @param {Element} target The DOM element to observe.
                             */
                            IntersectionObserver.prototype.unobserve = function (target) {
                                this._observationTargets =
                                    this._observationTargets.filter(function (item) {

                                        return item.element != target;
                                    });
                                if (!this._observationTargets.length) {
                                    this._unmonitorIntersections();
                                    this._unregisterInstance();
                                }
                            };


                            /**
                             * Stops observing all target elements for intersection changes.
                             */
                            IntersectionObserver.prototype.disconnect = function () {
                                this._observationTargets = [];
                                this._unmonitorIntersections();
                                this._unregisterInstance();
                            };


                            /**
                             * Returns any queue entries that have not yet been reported to the
                             * callback and clears the queue. This can be used in conjunction with the
                             * callback to obtain the absolute most up-to-date intersection information.
                             * @return {Array} The currently queued entries.
                             */
                            IntersectionObserver.prototype.takeRecords = function () {
                                var records = this._queuedEntries.slice();
                                this._queuedEntries = [];
                                return records;
                            };


                            /**
                             * Accepts the threshold value from the user configuration object and
                             * returns a sorted array of unique threshold values. If a value is not
                             * between 0 and 1 and error is thrown.
                             * @private
                             * @param {Array|number=} opt_threshold An optional threshold value or
                             *     a list of threshold values, defaulting to [0].
                             * @return {Array} A sorted list of unique and valid threshold values.
                             */
                            IntersectionObserver.prototype._initThresholds = function (opt_threshold) {
                                var threshold = opt_threshold || [0];
                                if (!Array.isArray(threshold)) threshold = [threshold];

                                return threshold.sort().filter(function (t, i, a) {
                                    if (typeof t != 'number' || isNaN(t) || t < 0 || t > 1) {
                                        throw new Error('threshold must be a number between 0 and 1 inclusively');
                                    }
                                    return t !== a[i - 1];
                                });
                            };


                            /**
                             * Accepts the rootMargin value from the user configuration object
                             * and returns an array of the four margin values as an object containing
                             * the value and unit properties. If any of the values are not properly
                             * formatted or use a unit other than px or %, and error is thrown.
                             * @private
                             * @param {string=} opt_rootMargin An optional rootMargin value,
                             *     defaulting to '0px'.
                             * @return {Array<Object>} An array of margin objects with the keys
                             *     value and unit.
                             */
                            IntersectionObserver.prototype._parseRootMargin = function (opt_rootMargin) {
                                var marginString = opt_rootMargin || '0px';
                                var margins = marginString.split(/\s+/).map(function (margin) {
                                    var parts = /^(-?\d*\.?\d+)(px|%)$/.exec(margin);
                                    if (!parts) {
                                        throw new Error('rootMargin must be specified in pixels or percent');
                                    }
                                    return {value: parseFloat(parts[1]), unit: parts[2]};
                                });

                                // Handles shorthand.
                                margins[1] = margins[1] || margins[0];
                                margins[2] = margins[2] || margins[0];
                                margins[3] = margins[3] || margins[1];

                                return margins;
                            };


                            /**
                             * Starts polling for intersection changes if the polling is not already
                             * happening, and if the page's visibility state is visible.
                             * @private
                             */
                            IntersectionObserver.prototype._monitorIntersections = function () {
                                if (!this._monitoringIntersections) {
                                    this._monitoringIntersections = true;

                                    // If a poll interval is set, use polling instead of listening to
                                    // resize and scroll events or DOM mutations.
                                    if (this.POLL_INTERVAL) {
                                        this._monitoringInterval = setInterval(
                                            this._checkForIntersections, this.POLL_INTERVAL);
                                    } else {
                                        addEvent(window, 'resize', this._checkForIntersections, true);
                                        addEvent(document, 'scroll', this._checkForIntersections, true);

                                        if (this.USE_MUTATION_OBSERVER && 'MutationObserver' in window) {
                                            this._domObserver = new MutationObserver(this._checkForIntersections);
                                            this._domObserver.observe(document, {
                                                attributes: true,
                                                childList: true,
                                                characterData: true,
                                                subtree: true
                                            });
                                        }
                                    }
                                }
                            };


                            /**
                             * Stops polling for intersection changes.
                             * @private
                             */
                            IntersectionObserver.prototype._unmonitorIntersections = function () {
                                if (this._monitoringIntersections) {
                                    this._monitoringIntersections = false;

                                    clearInterval(this._monitoringInterval);
                                    this._monitoringInterval = null;

                                    removeEvent(window, 'resize', this._checkForIntersections, true);
                                    removeEvent(document, 'scroll', this._checkForIntersections, true);

                                    if (this._domObserver) {
                                        this._domObserver.disconnect();
                                        this._domObserver = null;
                                    }
                                }
                            };


                            /**
                             * Scans each observation target for intersection changes and adds them
                             * to the internal entries queue. If new entries are found, it
                             * schedules the callback to be invoked.
                             * @private
                             */
                            IntersectionObserver.prototype._checkForIntersections = function () {
                                var rootIsInDom = this._rootIsInDom();
                                var rootRect = rootIsInDom ? this._getRootRect() : getEmptyRect();

                                this._observationTargets.forEach(function (item) {
                                    var target = item.element;
                                    var targetRect = getBoundingClientRect(target);
                                    var rootContainsTarget = this._rootContainsTarget(target);
                                    var oldEntry = item.entry;
                                    var intersectionRect = rootIsInDom && rootContainsTarget &&
                                        this._computeTargetAndRootIntersection(target, rootRect);

                                    var newEntry = item.entry = new IntersectionObserverEntry({
                                        time: now(),
                                        target: target,
                                        boundingClientRect: targetRect,
                                        rootBounds: rootRect,
                                        intersectionRect: intersectionRect
                                    });

                                    if (!oldEntry) {
                                        this._queuedEntries.push(newEntry);
                                    } else if (rootIsInDom && rootContainsTarget) {
                                        // If the new entry intersection ratio has crossed any of the
                                        // thresholds, add a new entry.
                                        if (this._hasCrossedThreshold(oldEntry, newEntry)) {
                                            this._queuedEntries.push(newEntry);
                                        }
                                    } else {
                                        // If the root is not in the DOM or target is not contained within
                                        // root but the previous entry for this target had an intersection,
                                        // add a new record indicating removal.
                                        if (oldEntry && oldEntry.isIntersecting) {
                                            this._queuedEntries.push(newEntry);
                                        }
                                    }
                                }, this);

                                if (this._queuedEntries.length) {
                                    this._callback(this.takeRecords(), this);
                                }
                            };


                            /**
                             * Accepts a target and root rect computes the intersection between then
                             * following the algorithm in the spec.
                             * TODO(philipwalton): at this time clip-path is not considered.
                             * https://w3c.github.io/IntersectionObserver/#calculate-intersection-rect-algo
                             * @param {Element} target The target DOM element
                             * @param {Object} rootRect The bounding rect of the root after being
                             *     expanded by the rootMargin value.
                             * @return {?Object} The final intersection rect object or undefined if no
                             *     intersection is found.
                             * @private
                             */
                            IntersectionObserver.prototype._computeTargetAndRootIntersection =
                                function (target, rootRect) {

                                    // If the element isn't displayed, an intersection can't happen.
                                    if (window.getComputedStyle(target).display == 'none') return;

                                    var targetRect = getBoundingClientRect(target);
                                    var intersectionRect = targetRect;
                                    var parent = getParentNode(target);
                                    var atRoot = false;

                                    while (!atRoot) {
                                        var parentRect = null;
                                        var parentComputedStyle = parent.nodeType == 1 ?
                                            window.getComputedStyle(parent) : {};

                                        // If the parent isn't displayed, an intersection can't happen.
                                        if (parentComputedStyle.display == 'none') return;

                                        if (parent == this.root || parent == document) {
                                            atRoot = true;
                                            parentRect = rootRect;
                                        } else {
                                            // If the element has a non-visible overflow, and it's not the <body>
                                            // or <html> element, update the intersection rect.
                                            // Note: <body> and <html> cannot be clipped to a rect that's not also
                                            // the document rect, so no need to compute a new intersection.
                                            if (parent != document.body &&
                                                parent != document.documentElement &&
                                                parentComputedStyle.overflow != 'visible') {
                                                parentRect = getBoundingClientRect(parent);
                                            }
                                        }

                                        // If either of the above conditionals set a new parentRect,
                                        // calculate new intersection data.
                                        if (parentRect) {
                                            intersectionRect = computeRectIntersection(parentRect, intersectionRect);

                                            if (!intersectionRect) break;
                                        }
                                        parent = getParentNode(parent);
                                    }
                                    return intersectionRect;
                                };


                            /**
                             * Returns the root rect after being expanded by the rootMargin value.
                             * @return {Object} The expanded root rect.
                             * @private
                             */
                            IntersectionObserver.prototype._getRootRect = function () {
                                var rootRect;
                                if (this.root) {
                                    rootRect = getBoundingClientRect(this.root);
                                } else {
                                    // Use <html>/<body> instead of window since scroll bars affect size.
                                    var html = document.documentElement;
                                    var body = document.body;
                                    rootRect = {
                                        top: 0,
                                        left: 0,
                                        right: html.clientWidth || body.clientWidth,
                                        width: html.clientWidth || body.clientWidth,
                                        bottom: html.clientHeight || body.clientHeight,
                                        height: html.clientHeight || body.clientHeight
                                    };
                                }
                                return this._expandRectByRootMargin(rootRect);
                            };


                            /**
                             * Accepts a rect and expands it by the rootMargin value.
                             * @param {Object} rect The rect object to expand.
                             * @return {Object} The expanded rect.
                             * @private
                             */
                            IntersectionObserver.prototype._expandRectByRootMargin = function (rect) {
                                var margins = this._rootMarginValues.map(function (margin, i) {
                                    return margin.unit == 'px' ? margin.value :
                                        margin.value * (i % 2 ? rect.width : rect.height) / 100;
                                });
                                var newRect = {
                                    top: rect.top - margins[0],
                                    right: rect.right + margins[1],
                                    bottom: rect.bottom + margins[2],
                                    left: rect.left - margins[3]
                                };
                                newRect.width = newRect.right - newRect.left;
                                newRect.height = newRect.bottom - newRect.top;

                                return newRect;
                            };


                            /**
                             * Accepts an old and new entry and returns true if at least one of the
                             * threshold values has been crossed.
                             * @param {?IntersectionObserverEntry} oldEntry The previous entry for a
                             *    particular target element or null if no previous entry exists.
                             * @param {IntersectionObserverEntry} newEntry The current entry for a
                             *    particular target element.
                             * @return {boolean} Returns true if a any threshold has been crossed.
                             * @private
                             */
                            IntersectionObserver.prototype._hasCrossedThreshold =
                                function (oldEntry, newEntry) {

                                    // To make comparing easier, an entry that has a ratio of 0
                                    // but does not actually intersect is given a value of -1
                                    var oldRatio = oldEntry && oldEntry.isIntersecting ?
                                        oldEntry.intersectionRatio || 0 : -1;
                                    var newRatio = newEntry.isIntersecting ?
                                        newEntry.intersectionRatio || 0 : -1;

                                    // Ignore unchanged ratios
                                    if (oldRatio === newRatio) return;

                                    for (var i = 0; i < this.thresholds.length; i++) {
                                        var threshold = this.thresholds[i];

                                        // Return true if an entry matches a threshold or if the new ratio
                                        // and the old ratio are on the opposite sides of a threshold.
                                        if (threshold == oldRatio || threshold == newRatio ||
                                            threshold < oldRatio !== threshold < newRatio) {
                                            return true;
                                        }
                                    }
                                };


                            /**
                             * Returns whether or not the root element is an element and is in the DOM.
                             * @return {boolean} True if the root element is an element and is in the DOM.
                             * @private
                             */
                            IntersectionObserver.prototype._rootIsInDom = function () {
                                return !this.root || containsDeep(document, this.root);
                            };


                            /**
                             * Returns whether or not the target element is a child of root.
                             * @param {Element} target The target element to check.
                             * @return {boolean} True if the target element is a child of root.
                             * @private
                             */
                            IntersectionObserver.prototype._rootContainsTarget = function (target) {
                                return containsDeep(this.root || document, target);
                            };


                            /**
                             * Adds the instance to the global IntersectionObserver registry if it isn't
                             * already present.
                             * @private
                             */
                            IntersectionObserver.prototype._registerInstance = function () {
                                if (registry.indexOf(this) < 0) {
                                    registry.push(this);
                                }
                            };


                            /**
                             * Removes the instance from the global IntersectionObserver registry.
                             * @private
                             */
                            IntersectionObserver.prototype._unregisterInstance = function () {
                                var index = registry.indexOf(this);
                                if (index != -1) registry.splice(index, 1);
                            };


                            /**
                             * Returns the result of the performance.now() method or null in browsers
                             * that don't support the API.
                             * @return {number} The elapsed time since the page was requested.
                             */
                            function now() {
                                return window.performance && performance.now && performance.now();
                            }


                            /**
                             * Throttles a function and delays its execution, so it's only called at most
                             * once within a given time period.
                             * @param {Function} fn The function to throttle.
                             * @param {number} timeout The amount of time that must pass before the
                             *     function can be called again.
                             * @return {Function} The throttled function.
                             */
                            function throttle(fn, timeout) {
                                var timer = null;
                                return function () {
                                    if (!timer) {
                                        timer = setTimeout(function () {
                                            fn();
                                            timer = null;
                                        }, timeout);
                                    }
                                };
                            }


                            /**
                             * Adds an event handler to a DOM node ensuring cross-browser compatibility.
                             * @param {Node} node The DOM node to add the event handler to.
                             * @param {string} event The event name.
                             * @param {Function} fn The event handler to add.
                             * @param {boolean} opt_useCapture Optionally adds the even to the capture
                             *     phase. Note: this only works in modern browsers.
                             */
                            function addEvent(node, event, fn, opt_useCapture) {
                                if (typeof node.addEventListener == 'function') {
                                    node.addEventListener(event, fn, opt_useCapture || false);
                                } else if (typeof node.attachEvent == 'function') {
                                    node.attachEvent('on' + event, fn);
                                }
                            }


                            /**
                             * Removes a previously added event handler from a DOM node.
                             * @param {Node} node The DOM node to remove the event handler from.
                             * @param {string} event The event name.
                             * @param {Function} fn The event handler to remove.
                             * @param {boolean} opt_useCapture If the event handler was added with this
                             *     flag set to true, it should be set to true here in order to remove it.
                             */
                            function removeEvent(node, event, fn, opt_useCapture) {
                                if (typeof node.removeEventListener == 'function') {
                                    node.removeEventListener(event, fn, opt_useCapture || false);
                                } else if (typeof node.detatchEvent == 'function') {
                                    node.detatchEvent('on' + event, fn);
                                }
                            }


                            /**
                             * Returns the intersection between two rect objects.
                             * @param {Object} rect1 The first rect.
                             * @param {Object} rect2 The second rect.
                             * @return {?Object} The intersection rect or undefined if no intersection
                             *     is found.
                             */
                            function computeRectIntersection(rect1, rect2) {
                                var top = Math.max(rect1.top, rect2.top);
                                var bottom = Math.min(rect1.bottom, rect2.bottom);
                                var left = Math.max(rect1.left, rect2.left);
                                var right = Math.min(rect1.right, rect2.right);
                                var width = right - left;
                                var height = bottom - top;

                                return (width >= 0 && height >= 0) && {
                                    top: top,
                                    bottom: bottom,
                                    left: left,
                                    right: right,
                                    width: width,
                                    height: height
                                };
                            }


                            /**
                             * Shims the native getBoundingClientRect for compatibility with older IE.
                             * @param {Element} el The element whose bounding rect to get.
                             * @return {Object} The (possibly shimmed) rect of the element.
                             */
                            function getBoundingClientRect(el) {
                                var rect;

                                try {
                                    rect = el.getBoundingClientRect();
                                } catch (err) {
                                    // Ignore Windows 7 IE11 "Unspecified error"
                                    // https://github.com/w3c/IntersectionObserver/pull/205
                                }

                                if (!rect) return getEmptyRect();

                                // Older IE
                                if (!(rect.width && rect.height)) {
                                    rect = {
                                        top: rect.top,
                                        right: rect.right,
                                        bottom: rect.bottom,
                                        left: rect.left,
                                        width: rect.right - rect.left,
                                        height: rect.bottom - rect.top
                                    };
                                }
                                return rect;
                            }


                            /**
                             * Returns an empty rect object. An empty rect is returned when an element
                             * is not in the DOM.
                             * @return {Object} The empty rect.
                             */
                            function getEmptyRect() {
                                return {
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    width: 0,
                                    height: 0
                                };
                            }

                            /**
                             * Checks to see if a parent element contains a child element (including inside
                             * shadow DOM).
                             * @param {Node} parent The parent element.
                             * @param {Node} child The child element.
                             * @return {boolean} True if the parent node contains the child node.
                             */
                            function containsDeep(parent, child) {
                                var node = child;
                                while (node) {
                                    if (node == parent) return true;

                                    node = getParentNode(node);
                                }
                                return false;
                            }


                            /**
                             * Gets the parent node of an element or its host element if the parent node
                             * is a shadow root.
                             * @param {Node} node The node whose parent to get.
                             * @return {Node|null} The parent node or null if no parent exists.
                             */
                            function getParentNode(node) {
                                var parent = node.parentNode;

                                if (parent && parent.nodeType == 11 && parent.host) {
                                    // If the parent is a shadow root, return the host element.
                                    return parent.host;
                                }

                                if (parent && parent.assignedSlot) {
                                    // If the parent is distributed in a <slot>, return the parent of a slot.
                                    return parent.assignedSlot.parentNode;
                                }

                                return parent;
                            }


// Exposes the constructors globally.
                            window.IntersectionObserver = IntersectionObserver;
                            window.IntersectionObserverEntry = IntersectionObserverEntry;

                        }());
                        Object.defineProperty(Object, "assign", {
                            enumerable: false,
                            configurable: true,
                            writable: true,
                            value: function (target, firstSource) {
                                "use strict";
                                if (target === undefined || target === null)
                                    throw new TypeError("Cannot convert first argument to object");
                                var to = Object(target);
                                for (var i = 1; i < arguments.length; i++) {
                                    var nextSource = arguments[i];
                                    if (nextSource === undefined || nextSource === null) continue;
                                    var keysArray = Object.keys(Object(nextSource));
                                    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                                        var nextKey = keysArray[nextIndex];
                                        var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                                        if (desc !== undefined && desc.enumerable) to[nextKey] = nextSource[nextKey];
                                    }
                                }
                                return to;
                            }
                        });
                        Object.defineProperty(Array.prototype, 'includes', {
                            value: function (valueToFind, fromIndex) {
                                if (this == null) {
                                    throw new TypeError('"this" is null or not defined');
                                }
                                var o = Object(this);
                                var len = o.length >>> 0;
                                if (len === 0) {
                                    return false
                                }
                                var n = fromIndex | 0;
                                var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

                                function sameValueZero(x, y) {
                                    return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y))
                                }

                                while (k < len) {
                                    if (sameValueZero(o[k], valueToFind)) {
                                        return true
                                    }
                                    k++
                                }
                                return false
                            }
                        });
                        String.prototype.includes = function (search, start) {
                            'use strict';
                            if (typeof start !== 'number') {
                                start = 0
                            }
                            if (start + search.length > this.length) {
                                return false
                            } else {
                                return this.indexOf(search, start) !== -1
                            }
                        };
                    })(window, weak)
                }, SuperVar.config["京东weak"]);
            };
            var page2;
            page.onPageCreated = S.onPageCreated;
            var setting = {
                headers: {
                    'Referer': jw_referer,
                    'User-Agent': param.userAgent
                }
            };

            if (S.config["京东IP过滤"] === undefined) {
                var auid;

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
                    auid = taskid.trim();
                    page.open("about:blank", function () {
                        page.onInitialized = onInitialized;
                        page.open("http://39.106.4.113/ipgl.php?id=" + auid.trim(), function (s) {
                            var bool = page.plainText;
                            if (parseInt(bool) == 1) {
                                page.onInitialized = onInitialized;
                                if (jw_referer !== "") {
                                    page.open(jw_referer, function () {
                                        page.open(jw_url);
                                    })
                                } else {
                                    page.open(jw_url);
                                }
                            } else {
                                page.skip()
                            }
                        });
                    });
                }

                togettaskid(start1);
            } else {
                page.open("about:blank", function () {
                    page.onInitialized = onInitialized;
                    if (jw_referer !== "") {
                        page.open(jw_referer, function () {
                            page.open(jw_url);
                        })
                    } else {
                        page.open(jw_url);
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