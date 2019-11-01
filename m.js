var __system__=require('system');var webPage=require('webpage');console._log=console.log;console.log=function(message){__system__.stdout.writeLine(message)};var actor=webPage.create();var param={"screenWidth":1080,"screenHeight":1920,"userAgent":"Mozilla/5.0 (Linux; Android 8.0; vivo x7 Build/OPR6.170623.019) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.2785.49 Mobile Safari/537.36","platform":"Android"};actor.settings.userAgent=param.userAgent;actor.settings.resourceTimeout=15000;actor.viewportSize={width:param.screenWidth,height:param.screenHeight};actor.skipBlank=true;actor.__counting__=false;actor.count=function(ms){var validm=parseInt(ms)>0;if(!validm){console._log('__count__');phantom.clearCookies();actor.close();phantom.exit();return}actor.__counting__=true;setTimeout(function(){console._log('__count__');phantom.clearCookies();actor.close();phantom.exit()},ms)};actor.skip=function(ms){var validm=parseInt(ms)>0;if(!validm){if(actor.__counting__===true){return}console._log('__skip__');phantom.clearCookies();actor.close();phantom.exit();return}setTimeout(function(){if(actor.__counting__===true){return}console._log('__skip__');phantom.clearCookies();actor.close();phantom.exit()},ms)};var actionTimeout=150000;setTimeout(function(){console.log('150000 ms timeout!');actor.skip()},actionTimeout);var jw_proxyAreas = "全国h";var jw_proxyUseTimes = 1;var jw_schedule = {'2018-01-01':100};var jw_start = '0';var jw_end = '24';var jw_curveType = '0';var jw_curve = [60,36,12,12,12,12,12,84,288,108,156,108,180,96,84,84,96,84,312,192,132,84,84,72];var local = true;var universe = JSON.parse("{}");
phantom.outputEncoding = 'gb2312';
/*获取参数*/
var fs = require('fs');
var file = fs.read('设置.txt');
var _input = JSON.parse(file);
var uaType = {
    "手机":"Mobile",
    "安卓":"Android",
    "苹果":"iOS",
    "电脑":"Computer"
};
var jw_url = _input.链接;
var jw_referer = "";
var ext1 = "";
var ext2 = "";
var str = "";
for(var i in _input){str+=i+':'+_input[i]+"|"}
var ext3 = str.slice(0,-1);
var jw_click = 100;
var jw_stay = "20-30";
var jw_uaType = uaType[_input.终端];
var jw_pageView = 2.5;
var SuperVar = require('./SuperVar').SuperVar;
var lib = [
    "通用",
    "京东"
];
var __action__ = require("./"+_input.脚本).get().action(actor);
/*
 * 入口
 */
