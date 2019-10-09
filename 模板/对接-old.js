var __system__=require('system');var webPage=require('webpage');console._log=console.log;console.log=function(message){__system__.stdout.writeLine(message)};var actor=webPage.create();var param={"screenWidth":1080,"screenHeight":1920,"userAgent":"Mozilla/5.0 (Linux; Android 8.0; vivo x7 Build/OPR6.170623.019) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.2785.49 Mobile Safari/537.36","platform":"Android"};actor.settings.userAgent=param.userAgent;actor.settings.resourceTimeout=15000;actor.viewportSize={width:param.screenWidth,height:param.screenHeight};actor.skipBlank=true;actor.__counting__=false;actor.count=function(ms){var validm=parseInt(ms)>0;if(!validm){console._log('__count__');phantom.clearCookies();actor.close();phantom.exit();return}actor.__counting__=true;setTimeout(function(){console._log('__count__');phantom.clearCookies();actor.close();phantom.exit()},ms)};actor.skip=function(ms){var validm=parseInt(ms)>0;if(!validm){if(actor.__counting__===true){return}console._log('__skip__');phantom.clearCookies();actor.close();phantom.exit();return}setTimeout(function(){if(actor.__counting__===true){return}console._log('__skip__');phantom.clearCookies();actor.close();phantom.exit()},ms)};var actionTimeout=150000;setTimeout(function(){console.log('125000 ms timeout!');actor.skip()},actionTimeout);
var SuperVar = require('./lib/SuperVar.js').SuperVar;
var jw_url = "";
var jw_referer = "";
var ext1 = "";
var ext2 = "";
var ext3 = "";
var jw_click = 100;
var jw_stay = "20-30";
var jw_uaType = "Mobile";// Computer Android iOS Mobile
var jw_pageView = 1;
var jw_proxyAreas = "全国h";
var local = true;
var universe = JSON.parse("{}");
var page = actor;
/*------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/****** 开始 *****/
page.skipBlank = false;
// 截图供本地测试
var shotNumber = 1;
page.shot = SuperVar.shot;
// 设备库引入处
var device;
SuperVar.init();
var stay = SuperVar.stayValue(jw_stay) * 1000;
page.settings.resourceTimeout = 15000;

/*
信息储存区域

*/

/*全局变量定义区域*/
var loadVar = 0, clickCount = 0, S = SuperVar;
var ip, userAgent, ios, android, osv, settings, data, ads, logId = deviceModule.getRandom(32), logKey, auid;

/*本地变量*/
logKey = "xxxTest";
auid = 95270011;

/*落地回调*/
page.onLoadFinished = function (status) {
    var url = page.url;
    console.log(status + ' 加载 ' + url);
    if (url.indexOf('') >= 0 && loadVar === 0) {
        loadVar = 1;
        var adContent = page.evaluate(function () {
            var ad;
            try {
                ad = JSON.parse(document.body.innerText); // innerHTML
            } catch (e) {
                ad = ""
            }
            return ad
        });
        /*请在注释下方对广告进行提取处理*/

        /*请在注释上方方对广告进行提取处理*/
        setTimeout(function () {
            console.log(JSON.stringify(ads));
            loadVar = 999;
            page.open("about:blank", settings)
        }, 3000)
    } else if (loadVar === 999) {
        loadVar = 2;
        console.log("空白页");
        /*请在注释下发对广告进行展示点击及落地和二跳*/

    }
};

page.onResourceRequested = SuperVar.onResourceRequested;
page.onResourceReceived = SuperVar.onResourceReceived;

var onInitialized = SuperVar.onInitialized;
var page2;
page.onPageCreated = SuperVar.onPageCreated;

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
        ip = page.plainText.split('"cip": "')[1].split('", "cid":')[0];
        md5 = SuperVar.md5;
        data = {};
        if (param.platform == "iPhone") {

        } else if (param.platform == "Android") {

        }
        settings = {
            operation: 'POST',
            encoding: 'utf8',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': jw_referer,
                'User-Agent': userAgent
            },
            data: SuperVar.objectToUrl(data)
        };
        page.open(jw_url, settings)
    });
});