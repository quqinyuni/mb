var SuperVar = {
    Gvar: {startTimeNow: Date.now()},
    config: (function (ext3) {
        var config = {
            "多曝光": false,
            "包裹型回传": false,
            "回传": true,
            "设备加密": true,
            "IMEI加密": true,
            "IDFA加密": true,
            "请求计数": true,
            "安卓比例": "70",
            "二跳率": "0",
            "二跳前停留": "8-13",
            "二跳标签": "a",
            "三跳率": "0",
            "三跳前停留": "8-13",
            "三跳标签": "a",
            "快速曝光模式": false,
            "设备传参": true,
            "设备型号": true,
            "定向参数": false,
            "IP": true,
            "MAC": true,
            "IP过滤": false,
            "参数耗尽继续": false,
            "GA": false,
            "IP打印": false,
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
        console.log("配置信息:" + JSON.stringify(config));
        return config
    })(typeof ext3 == "undefined" ? "" : ext3),
    stayValue: function (stays) {
        var stay = 1;
        if (stays.indexOf('-') > 0 || stays.indexOf('~') > 0) {
            var stayInfo = stays.split(/[~\-]/);
            if (stayInfo.length === 2) {
                var stay1 = parseInt(stayInfo[0]);
                var stay2 = parseInt(stayInfo[1]);
                stay = parseInt(Math.random() * (stay2 - stay1 + 1) + stay1)
            }
        } else {
            stay = parseInt(stays)
        }
        return stay
    },
    init: function (t) {
        var getAndroidDev = function () {
            var devObj = {
                176: 'huawei',
                284: 'rongyao',
                435: 'mi',
                511: 'hongmi',
                622: 'oppo',
                807: 'samsung',
                873: 'meizu',
                899: 'oneplus',
                1000: 'vivo'
            };
            var rnd = parseInt(Math.random() * 1000);
            for (var k in devObj) {
                if (rnd < k) {
                    return devObj[k]
                }
            }
            return 0
        };
        var _deviceModule = typeof SuperVar.deviceModule !== "undefined" ? SuperVar.deviceModule : deviceModule;
        if (jw_uaType === 'Computer') {
            if (parseInt(Math.random() * 1000 % 100) < 70) {
                device = _deviceModule.win.device()
            } else {
                device = _deviceModule.mac.device()
            }
        } else if (jw_uaType === 'Android') {
            device = _deviceModule.android.device(getAndroidDev())
        } else if (jw_uaType === 'iOS') {
            device = _deviceModule.ios.device()
        } else {
            if (parseInt(Math.random() * 1000 % 100) < SuperVar.config["安卓比例"]) {
                device = _deviceModule.android.device(getAndroidDev())
            } else {
                device = _deviceModule.ios.device()
            }
        }
        // if (!SuperVar.config["快速曝光模式"]) {
        param.screenWidth = parseInt(device.screenWidth);
        param.screenHeight = parseInt(device.screenHeight);
        param.userAgent = device.userAgent;
        param.platform = device.platform;
        actor.settings.userAgent = param.userAgent;
        actor.viewportSize = {width: param.screenWidth, height: param.screenHeight};
        local ? actor.clipRect = {
            top: 0,
            left: 0,
            width: param.screenWidth,
            height: param.screenHeight
        } : "";
        console.log('参数 ' + JSON.stringify(param));
        SuperVar.Gvar.platform = device.platform;
        SuperVar.Gvar.userAgent = device.userAgent;
        SuperVar.Gvar.mac = device.mac;
        SuperVar.Gvar.mdMac1 = SuperVar.md5(device.mac.toUpperCase());
        SuperVar.Gvar.mdMac = SuperVar.md5(device.mac.toUpperCase().replace(/:/g, ''));
        SuperVar.Gvar.tim = _deviceModule.getRandom(5) + "." + _deviceModule.getRandom(7);
        SuperVar.Gvar.u = 'android' + Math.random() + Date.now() + ';';
        SuperVar.Gvar.newUrl = "";
        // es6 to es5
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
    },
    getReferer: function (strReferer) {
        try {
            strReferer = strReferer ? strReferer.replace(/\s/g, '') : "";
            var reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/ig;
            if (strReferer.search(/\d+:\[.*?\]/) >= 0) {
                var str = strReferer.split(";");
                var obj = {}, count = 0;
                var list = [];
                for (var i in str) {
                    if (str[i] == '') {
                        continue
                    } else {
                        var num = parseInt(str[i].split(":[")[0]);
                        var urls = str[i].split(":[")[1].match(reg);
                        obj = {'num': num, 'urls': urls};
                        list.push(obj);
                        count += num
                    }
                }
                var rn = parseInt(Math.random() * count);
                for (var i in list) {
                    var item = list[i];
                    if (rn <= item.num) {
                        return item.urls[parseInt(Math.random() * item.urls.length)]
                    } else {
                        rn -= item.num
                    }
                }
            } else if (strReferer.search(/\[.*?\]/) >= 0) {
                var urls = strReferer.match(reg);
                return urls[parseInt(Math.random() * urls.length)]
            } else {
                return strReferer
            }
        } catch (e) {
            return ""
        }
        return ""
    },
    shot: function (t) {
        local ? setTimeout(function () {
            shotNumber = typeof shotNumber === "undefined" ? 1 : shotNumber;
            actor.render('./img/' + shotNumber + '.png');
            console.log('截图 ' + shotNumber + '.png');
            shotNumber++
        }, t) : ""
    },
    scrollTo: function (top, left) {
        left = left || 0;
        actor.scrollPosition = {top: top, left: left}
    },
    paramInit: function (param) {
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
    },
    jdInit: function (weak) {
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
            window.HTMLVideoElement = function () {
            };
            window.HTMLAudioElement = function () {
            };

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

            function URL(url, base) {
                if (typeof base === 'object') {
                    base = base.href;
                }
                var protocol = '';
                var check = function (u) {
                    var urlReg = /http(s)?:\/\//ig;
                    var urlMatch = u.match(urlReg);
                    if (urlMatch === null) {
                        return false;
                    } else if (urlMatch[0] === 'https://' || urlMatch[0] === 'http://') {
                        protocol = urlMatch[0].replace('//', '');
                        return u;
                    } else {
                        return false;
                    }
                };
                var href = check(url);
                if (!href) {
                    try {
                        if (!check(base)) {
                            throw "Raises a TypeError exception as '" + base + "' is not a valid URL"
                        } else if (base === undefined) {
                            throw "Raises a TypeError exception as '" + url + "' is not a valid URL"
                        } else {
                            var t = base.replace(protocol + '//', '').split('/')[0];
                            if (url.charAt(0) !== '/') {
                                url = '/' + url;
                            }
                            href = protocol + '//' + t + url;
                        }
                    } catch (e) {
                        throw TypeError(e);
                    }
                } else if (href.match(/http(s)?:\/\/.+\//ig) === null) {
                    href += '/';
                }

                var deal = function () {
                    var m = {};
                    var u = href.replace(protocol + '//', '');
                    var t;
                    if (u.indexOf('#') >= 0) {
                        t = u.split('#');
                        m.hash = '#' + t[1];
                        u = t[0];
                    } else {
                        m.hash = '';
                    }
                    if (u.indexOf('?') >= 0) {
                        t = u.split('?');
                        m.search = '?' + t[1];
                        u = t[0];
                    } else {
                        m.search = '';
                    }
                    t = u.split('/');
                    m.host = t[0];
                    m.pathname = u.split(t[0])[1];

                    return m;
                };
                var h = deal();

                this.hash = h.hash;
                this.host = h.host;
                this.hostname = this.host;
                this.href = href;
                this.origin = protocol + '//' + this.host;
                this.password = '';
                this.pathname = h.pathname;
                this.port = '';
                this.protocol = protocol;
                this.search = h.search;
                this.username = '';
                //this.searchParams = URLSearchParams;
            }

            function URLSearchParams(init) {
            }

            window.URL = URL;
            window.FULFILLED = function () {
                
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
            Object.defineProperty(Array.prototype,'includes',{value:function(valueToFind,fromIndex){if(this==null){throw new TypeError('"this" is null or not defined');}var o=Object(this);var len=o.length>>>0;if(len===0){return false}var n=fromIndex|0;var k=Math.max(n>=0?n:len-Math.abs(n),0);function sameValueZero(x,y){return x===y||(typeof x==='number'&&typeof y==='number'&&isNaN(x)&&isNaN(y))}while(k<len){if(sameValueZero(o[k],valueToFind)){return true}k++}return false}});
            String.prototype.includes=function(search,start){'use strict';if(typeof start!=='number'){start=0}if(start+search.length>this.length){return false}else{return this.indexOf(search,start)!==-1}};
        })(window, weak)
    },
    onInitialized: function () {
        var url = actor.evaluate(SuperVar.paramInit, param);
        if (url == 'about:blank' && actor.skipBlank === true) {
            actor.skip(10)
        }
        actor.evaluate(SuperVar.jdInit, SuperVar.config["京东weak"]);
    },
    onPageCreated: function (newPage) {
        newPage.viewportSize = {width: param.screenWidth, height: param.screenHeight};
        newPage.onInitialized = function () {
            var url = newPage.evaluate(SuperVar.paramInit, param);
            newPage.evaluate(SuperVar.jdInit, SuperVar.config["京东weak"])
        };
        page2 = newPage;
        newPage.settings.resourceTimeout = 12000;
        newPage.onResourceRequested = function (requestData, networkRequest) {
            var url = requestData.url;
            var suffix = url.substr(-4).toLowerCase();
            if (suffix === '.mp3' || suffix === '.mp4' || suffix === '.flv' || suffix === '.pdf' || suffix === '.png' || suffix === '.jpg' || suffix === '.dpg' || suffix === 'webp') {
                networkRequest.abort()
            } else if (url.indexOf(';base64') >= 0 && url.indexOf('data:image') >= 0) {
                networkRequest.abort()
            } else if (url.indexOf('player.youku.com') >= 0 || url.indexOf('.jpg!') >= 0) {
                networkRequest.abort()
            } else {
                newPage.evaluate(function () {
                    window['_phantom'] = undefined;
                    window['callPhantom'] = undefined
                });
                networkRequest.setHeader('User-Agent', actor.settings.userAgent)
            }
        };
        newPage.onResourceReceived = function (response) {
            if (response.stage == "end" && response.status != null) {
                console.log("新窗口接收: " + JSON.stringify({url: response.url, status: response.status}))
            }
        };
        var newLoadVar = 0;
        var newPageUrl = '1';
        newPage.onLoadFinished = function (s) {
            console.log(s + ' 新窗加载 ' + newPage.url);
            if (newPageUrl == newPage.url) {
                return
            } else {
                newPageUrl = newPage.url
            }
            if (newLoadVar === 0) {
                newLoadVar = 1;
                setTimeout(function () {
                    newPage.evaluate(function () {
                        var a = document.querySelectorAll('a');
                        var toLink = a[parseInt(Math.random() * a.length)];
                        toLink.setAttribute('target', '_self');
                        toLink.click()
                    }, SuperVar.config['三跳标签']);
                    if (SuperVar.config["对接多广告专用"]) {
                        setTimeout(function () {
                            if (ads.length > 0) {
                                console.log("广告未完成,执行下一轮");
                                SuperVar.Gvar._loop(ads.pop())
                            } else {
                                console.log("广告执行完毕,计数");
                                actor.count(stay - 10000);
                            }
                        }, 10000 + parseInt(Math.random() * 5000))
                    }
                }, 4000 + parseInt(Math.random() * 4000))
            }
        }
    },
    onResourceRequested: function (requestData, networkRequest) {
        var url = requestData.url;
        var suffix = url.substr(-4).toLowerCase();
        if (suffix === '.mp3' || suffix === '.mp4' || suffix === '.flv' || suffix === '.pdf' || suffix === '.png' || suffix === '.jpg' || suffix === '.dpg' || suffix === 'webp' || suffix === 'svg') {
            !local ? networkRequest.abort() : ""
        } else if (url.indexOf(';base64') >= 0 && url.indexOf('data:image') >= 0 || url.indexOf("intent://") >= 0 || url.indexOf("openapp.jdmobile://virtual") >= 0 || url.indexOf("itms-appss://") >= 0 || url.indexOf("tmall://page.tm/appLink?") >= 0 || url.indexOf("g.alicdn.com/??mui/feloader") >= 0) {
            //url.match(/^([^http]+)(s)?.+\/\//).length !== 0
            !local ? networkRequest.abort() : ""
        } else if (url.indexOf('player.youku.com') >= 0 || url.indexOf('.jpg!') >= 0 || url.indexOf("admin.sgmlink.com") >= 0) {
            !local ? networkRequest.abort() : ""
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
    },
    onResourceReceived: function (response) {
        typeof mark === "undefined" ? mark = 0 : "";
        var indexStrArr = {
            "秒针": "e.cn.miaozhen.com",
            "春雨": "chunyuyisheng"
        };
        if (SuperVar.config["请求计数"] && SuperVar.config["计数依据"] !== undefined) {
            if (response.url.indexOf(indexStrArr[SuperVar.config["计数依据"]]) >= 0 && mark === 0) {
                mark = 1;
                if (response.status == null) {
                    mark = -1;
                    actor.skip();
                    return;
                } else {
                    console.log("请求计数,埋点: " + indexStrArr[SuperVar.config["计数依据"]]);
                    actor.count(stay + parseInt(Math.random() * 5000));
                }
            }
        }
        if (response.stage == "end" && response.status != null) {
            if(typeof _input === "undefined") console.log("接收: " + JSON.stringify({url: response.url, status: response.status}))
        }
    },
    onConsoleMessage: function (msg) {
        console.log(msg);
    },
    getUrls: function (urls) {
        try {
            urls = urls ? urls.replace(/\s/g, '') : "";
            var reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/ig;
            if (reg.test(urls)) {
                return urls.split("@=")
            } else {
                return urls
            }
        } catch (e) {
            return ""
        }
    },
    md5: function (s) {
        return SuperVar.CryptoJS().MD5(s).toString()
    },
    CryptoJS: function () {
        var CryptoJS = CryptoJS || function (s, p) {
            var m = {}, l = m.lib = {}, n = function () {
            }, r = l.Base = {
                extend: function (b) {
                    n.prototype = this;
                    var h = new n;
                    b && h.mixIn(b);
                    h.hasOwnProperty("init") || (h.init = function () {
                        h.$super.init.apply(this, arguments)
                    });
                    h.init.prototype = h;
                    h.$super = this;
                    return h
                }, create: function () {
                    var b = this.extend();
                    b.init.apply(b, arguments);
                    return b
                }, init: function () {
                }, mixIn: function (b) {
                    for (var h in b) b.hasOwnProperty(h) && (this[h] = b[h]);
                    b.hasOwnProperty("toString") && (this.toString = b.toString)
                }, clone: function () {
                    return this.init.prototype.extend(this)
                }
            }, q = l.WordArray = r.extend({
                init: function (b, h) {
                    b = this.words = b || [];
                    this.sigBytes = h != p ? h : 4 * b.length
                }, toString: function (b) {
                    return (b || t).stringify(this)
                }, concat: function (b) {
                    var h = this.words, a = b.words, j = this.sigBytes;
                    b = b.sigBytes;
                    this.clamp();
                    if (j % 4) for (var g = 0; g < b; g++) h[j + g >>> 2] |= (a[g >>> 2] >>> 24 - 8 * (g % 4) & 255) << 24 - 8 * ((j + g) % 4); else if (65535 < a.length) for (g = 0; g < b; g += 4) h[j + g >>> 2] = a[g >>> 2]; else h.push.apply(h, a);
                    this.sigBytes += b;
                    return this
                }, clamp: function () {
                    var b = this.words, h = this.sigBytes;
                    b[h >>> 2] &= 4294967295 << 32 - 8 * (h % 4);
                    b.length = s.ceil(h / 4)
                }, clone: function () {
                    var b = r.clone.call(this);
                    b.words = this.words.slice(0);
                    return b
                }, random: function (b) {
                    for (var h = [], a = 0; a < b; a += 4) h.push(4294967296 * s.random() | 0);
                    return new q.init(h, b)
                }
            }), v = m.enc = {}, t = v.Hex = {
                stringify: function (b) {
                    var a = b.words;
                    b = b.sigBytes;
                    for (var g = [], j = 0; j < b; j++) {
                        var k = a[j >>> 2] >>> 24 - 8 * (j % 4) & 255;
                        g.push((k >>> 4).toString(16));
                        g.push((k & 15).toString(16))
                    }
                    return g.join("")
                }, parse: function (b) {
                    for (var a = b.length, g = [], j = 0; j < a; j += 2) g[j >>> 3] |= parseInt(b.substr(j, 2), 16) << 24 - 4 * (j % 8);
                    return new q.init(g, a / 2)
                }
            }, a = v.Latin1 = {
                stringify: function (b) {
                    var a = b.words;
                    b = b.sigBytes;
                    for (var g = [], j = 0; j < b; j++) g.push(String.fromCharCode(a[j >>> 2] >>> 24 - 8 * (j % 4) & 255));
                    return g.join("")
                }, parse: function (b) {
                    for (var a = b.length, g = [], j = 0; j < a; j++) g[j >>> 2] |= (b.charCodeAt(j) & 255) << 24 - 8 * (j % 4);
                    return new q.init(g, a)
                }
            }, u = v.Utf8 = {
                stringify: function (b) {
                    try {
                        return decodeURIComponent(escape(a.stringify(b)))
                    } catch (g) {
                        throw Error("Malformed UTF-8 data");
                    }
                }, parse: function (b) {
                    return a.parse(unescape(encodeURIComponent(b)))
                }
            }, g = l.BufferedBlockAlgorithm = r.extend({
                reset: function () {
                    this._data = new q.init;
                    this._nDataBytes = 0
                }, _append: function (b) {
                    "string" == typeof b && (b = u.parse(b));
                    this._data.concat(b);
                    this._nDataBytes += b.sigBytes
                }, _process: function (b) {
                    var a = this._data, g = a.words, j = a.sigBytes, k = this.blockSize, m = j / (4 * k),
                        m = b ? s.ceil(m) : s.max((m | 0) - this._minBufferSize, 0);
                    b = m * k;
                    j = s.min(4 * b, j);
                    if (b) {
                        for (var l = 0; l < b; l += k) this._doProcessBlock(g, l);
                        l = g.splice(0, b);
                        a.sigBytes -= j
                    }
                    return new q.init(l, j)
                }, clone: function () {
                    var b = r.clone.call(this);
                    b._data = this._data.clone();
                    return b
                }, _minBufferSize: 0
            });
            l.Hasher = g.extend({
                cfg: r.extend(), init: function (b) {
                    this.cfg = this.cfg.extend(b);
                    this.reset()
                }, reset: function () {
                    g.reset.call(this);
                    this._doReset()
                }, update: function (b) {
                    this._append(b);
                    this._process();
                    return this
                }, finalize: function (b) {
                    b && this._append(b);
                    return this._doFinalize()
                }, blockSize: 16, _createHelper: function (b) {
                    return function (a, g) {
                        return (new b.init(g)).finalize(a)
                    }
                }, _createHmacHelper: function (b) {
                    return function (a, g) {
                        return (new k.HMAC.init(b, g)).finalize(a)
                    }
                }
            });
            var k = m.algo = {};
            return m
        }(Math);
        (function (s) {
            function p(a, k, b, h, l, j, m) {
                a = a + (k & b | ~k & h) + l + m;
                return (a << j | a >>> 32 - j) + k
            }

            function m(a, k, b, h, l, j, m) {
                a = a + (k & h | b & ~h) + l + m;
                return (a << j | a >>> 32 - j) + k
            }

            function l(a, k, b, h, l, j, m) {
                a = a + (k ^ b ^ h) + l + m;
                return (a << j | a >>> 32 - j) + k
            }

            function n(a, k, b, h, l, j, m) {
                a = a + (b ^ (k | ~h)) + l + m;
                return (a << j | a >>> 32 - j) + k
            }

            for (var r = CryptoJS, q = r.lib, v = q.WordArray, t = q.Hasher, q = r.algo, a = [], u = 0; 64 > u; u++) a[u] = 4294967296 * s.abs(s.sin(u + 1)) | 0;
            q = q.MD5 = t.extend({
                _doReset: function () {
                    this._hash = new v.init([1732584193, 4023233417, 2562383102, 271733878])
                }, _doProcessBlock: function (g, k) {
                    for (var b = 0; 16 > b; b++) {
                        var h = k + b, w = g[h];
                        g[h] = (w << 8 | w >>> 24) & 16711935 | (w << 24 | w >>> 8) & 4278255360
                    }
                    var b = this._hash.words, h = g[k + 0], w = g[k + 1], j = g[k + 2], q = g[k + 3],
                        r = g[k + 4],
                        s = g[k + 5], t = g[k + 6], u = g[k + 7], v = g[k + 8], x = g[k + 9], y = g[k + 10],
                        z = g[k + 11], A = g[k + 12], B = g[k + 13], C = g[k + 14], D = g[k + 15], c = b[0],
                        d = b[1], e = b[2], f = b[3], c = p(c, d, e, f, h, 7, a[0]),
                        f = p(f, c, d, e, w, 12, a[1]),
                        e = p(e, f, c, d, j, 17, a[2]), d = p(d, e, f, c, q, 22, a[3]),
                        c = p(c, d, e, f, r, 7, a[4]), f = p(f, c, d, e, s, 12, a[5]),
                        e = p(e, f, c, d, t, 17, a[6]), d = p(d, e, f, c, u, 22, a[7]),
                        c = p(c, d, e, f, v, 7, a[8]), f = p(f, c, d, e, x, 12, a[9]),
                        e = p(e, f, c, d, y, 17, a[10]), d = p(d, e, f, c, z, 22, a[11]),
                        c = p(c, d, e, f, A, 7, a[12]), f = p(f, c, d, e, B, 12, a[13]),
                        e = p(e, f, c, d, C, 17, a[14]), d = p(d, e, f, c, D, 22, a[15]),
                        c = m(c, d, e, f, w, 5, a[16]), f = m(f, c, d, e, t, 9, a[17]),
                        e = m(e, f, c, d, z, 14, a[18]), d = m(d, e, f, c, h, 20, a[19]),
                        c = m(c, d, e, f, s, 5, a[20]), f = m(f, c, d, e, y, 9, a[21]),
                        e = m(e, f, c, d, D, 14, a[22]), d = m(d, e, f, c, r, 20, a[23]),
                        c = m(c, d, e, f, x, 5, a[24]), f = m(f, c, d, e, C, 9, a[25]),
                        e = m(e, f, c, d, q, 14, a[26]), d = m(d, e, f, c, v, 20, a[27]),
                        c = m(c, d, e, f, B, 5, a[28]), f = m(f, c, d, e, j, 9, a[29]),
                        e = m(e, f, c, d, u, 14, a[30]), d = m(d, e, f, c, A, 20, a[31]),
                        c = l(c, d, e, f, s, 4, a[32]), f = l(f, c, d, e, v, 11, a[33]),
                        e = l(e, f, c, d, z, 16, a[34]), d = l(d, e, f, c, C, 23, a[35]),
                        c = l(c, d, e, f, w, 4, a[36]), f = l(f, c, d, e, r, 11, a[37]),
                        e = l(e, f, c, d, u, 16, a[38]), d = l(d, e, f, c, y, 23, a[39]),
                        c = l(c, d, e, f, B, 4, a[40]), f = l(f, c, d, e, h, 11, a[41]),
                        e = l(e, f, c, d, q, 16, a[42]), d = l(d, e, f, c, t, 23, a[43]),
                        c = l(c, d, e, f, x, 4, a[44]), f = l(f, c, d, e, A, 11, a[45]),
                        e = l(e, f, c, d, D, 16, a[46]), d = l(d, e, f, c, j, 23, a[47]),
                        c = n(c, d, e, f, h, 6, a[48]), f = n(f, c, d, e, u, 10, a[49]),
                        e = n(e, f, c, d, C, 15, a[50]), d = n(d, e, f, c, s, 21, a[51]),
                        c = n(c, d, e, f, A, 6, a[52]), f = n(f, c, d, e, q, 10, a[53]),
                        e = n(e, f, c, d, y, 15, a[54]), d = n(d, e, f, c, w, 21, a[55]),
                        c = n(c, d, e, f, v, 6, a[56]), f = n(f, c, d, e, D, 10, a[57]),
                        e = n(e, f, c, d, t, 15, a[58]), d = n(d, e, f, c, B, 21, a[59]),
                        c = n(c, d, e, f, r, 6, a[60]), f = n(f, c, d, e, z, 10, a[61]),
                        e = n(e, f, c, d, j, 15, a[62]), d = n(d, e, f, c, x, 21, a[63]);
                    b[0] = b[0] + c | 0;
                    b[1] = b[1] + d | 0;
                    b[2] = b[2] + e | 0;
                    b[3] = b[3] + f | 0
                }, _doFinalize: function () {
                    var a = this._data, k = a.words, b = 8 * this._nDataBytes, h = 8 * a.sigBytes;
                    k[h >>> 5] |= 128 << 24 - h % 32;
                    var l = s.floor(b / 4294967296);
                    k[(h + 64 >>> 9 << 4) + 15] = (l << 8 | l >>> 24) & 16711935 | (l << 24 | l >>> 8) & 4278255360;
                    k[(h + 64 >>> 9 << 4) + 14] = (b << 8 | b >>> 24) & 16711935 | (b << 24 | b >>> 8) & 4278255360;
                    a.sigBytes = 4 * (k.length + 1);
                    this._process();
                    a = this._hash;
                    k = a.words;
                    for (b = 0; 4 > b; b++) h = k[b], k[b] = (h << 8 | h >>> 24) & 16711935 | (h << 24 | h >>> 8) & 4278255360;
                    return a
                }, clone: function () {
                    var a = t.clone.call(this);
                    a._hash = this._hash.clone();
                    return a
                }
            });
            r.MD5 = t._createHelper(q);
            r.HmacMD5 = t._createHmacHelper(q)
        })(Math);
        return CryptoJS
    },
    SHA1: function (str) {
        var S = S || function () {
            return {
                add: function (x, y) {
                    return ((x & 0x7FFFFFFF) + (y & 0x7FFFFFFF)) ^ (x & 0x80000000) ^ (y & 0x80000000)
                }, SHA1hex: function SHA1hex(num) {
                    var sHEXChars = "0123456789abcdef";
                    var str = "";
                    for (var j = 7; j >= 0; j--) str += sHEXChars.charAt((num >> (j * 4)) & 0x0F);
                    return str
                }, AlignSHA1: function AlignSHA1(sIn) {
                    var nblk = ((sIn.length + 8) >> 6) + 1, blks = new Array(nblk * 16);
                    for (var i = 0; i < nblk * 16; i++) blks[i] = 0;
                    for (i = 0; i < sIn.length; i++) blks[i >> 2] |= sIn.charCodeAt(i) << (24 - (i & 3) * 8);
                    blks[i >> 2] |= 0x80 << (24 - (i & 3) * 8);
                    blks[nblk * 16 - 1] = sIn.length * 8;
                    return blks
                }, rol: function rol(num, cnt) {
                    return (num << cnt) | (num >>> (32 - cnt))
                }, ft: function ft(t, b, c, d) {
                    if (t < 20) return (b & c) | ((~b) & d);
                    if (t < 40) return b ^ c ^ d;
                    if (t < 60) return (b & c) | (b & d) | (c & d);
                    return b ^ c ^ d
                }, kt: function kt(t) {
                    return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514
                }, SHA1: function SHA1(sIn) {
                    var x = this.AlignSHA1(sIn);
                    var w = new Array(80);
                    var a = 1732584193;
                    var b = -271733879;
                    var c = -1732584194;
                    var d = 271733878;
                    var e = -1009589776;
                    for (var i = 0; i < x.length; i += 16) {
                        var olda = a;
                        var oldb = b;
                        var oldc = c;
                        var oldd = d;
                        var olde = e;
                        for (var j = 0; j < 80; j++) {
                            if (j < 16) w[j] = x[i + j]; else w[j] = this.rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                            t = this.add(this.add(this.rol(a, 5), this.ft(j, b, c, d)), this.add(this.add(e, w[j]), this.kt(j)));
                            e = d;
                            d = c;
                            c = this.rol(b, 30);
                            b = a;
                            a = t
                        }
                        a = this.add(a, olda);
                        b = this.add(b, oldb);
                        c = this.add(c, oldc);
                        d = this.add(d, oldd);
                        e = this.add(e, olde)
                    }
                    SHA1Value = this.SHA1hex(a) + this.SHA1hex(b) + this.SHA1hex(c) + this.SHA1hex(d) + this.SHA1hex(e);
                    return SHA1Value.toUpperCase()
                }, SHA2: function SHA2(sIn) {
                    return this.SHA1(sIn).toLowerCase()
                }
            }
        };
        return S().SHA1(str)
    },
    u2u: function (url) {
        typeof time === "undefined" ? time = Date.now() : "";
        if (this.config["回传"]) {
            if (this.Gvar.platform == "Android") {
                device.imei.length < 32 ? "" : this.config["设备加密"] = false;
                this.config["设备加密"] = this.config["IMEI加密"] !== undefined ? this.config["IMEI加密"] : this.config["设备加密"];
                url = this.config["设备传参"] ? url.replace(/(__OS__|\{OS\}|\[OS\])/gi, '0')
                        .replace(/(__IMEI__|{imeimd5}|__DEVICEID__|__IMEI2__|\[IMEI\]|\{IMEI\})/gi, this.config["设备加密"] ? this.md5(device.imei) : device.imei)
                        .replace(/{imei}/gi, device.imei)
                        .replace(/{imeisha1}/gi, this.SHA1(device.imei))
                        .replace(/(__AndroidID__|\{androidid\}|\[ANDROIDID\])/gi, this.config["设备加密"] ? this.md5(device.aid) : device.aid)
                        .replace(/(__AndroidID1__|\[ANDROIDID1\]|\{ANDROIDID1\})/gi, device.aid)
                        .replace('ord=[timestamp]', 'ord=' + this.Gvar.tim)
                        .replace('dc_rdid=', 'dc_rdid=' + device.aid)
                        .replace(/__UA__/, escape(this.Gvar.userAgent))
                        .replace(/(__TERM__|\[TERM\]|\{TERM\})/gi, encodeURI(device.md))
                        .replace(/\s*!/g, "")
                        .replace(/__OAID__/gi,device.oaid)
                    : url
            } else if (this.Gvar.platform == "iPhone") {
                this.config["设备加密"] = this.config["IDFA加密"] !== undefined ? this.config["IDFA加密"] : this.config["设备加密"];
                url = this.config["设备传参"] ? url.replace(/(__OS__|\[OS\]|\{OS\})/gi, '1')
                        .replace(/(__IDFA__|{idfamd5}|__DEVICEID__|\[IDFA\]|\{IDFA\})/gi, this.config["设备加密"] ? this.md5(device.idfa) : device.idfa)
                        .replace(/\{idfa\}/gi, device.idfa).replace(/\{idfasha1\}/gi, device.idfa)
                        .replace(/(__OPENUDID__|\{openudid\}|\[openudi\])/gi, device.openudid)
                        .replace('ord=[timestamp]', 'ord=' + this.Gvar.tim)
                        .replace('dc_rdid=', 'dc_rdid=' + device.idfa)
                        .replace(/__UA__/, escape(this.Gvar.userAgent))
                        .replace(/(__TERM__|\[TERM\]|\{TERM\})/gi, encodeURI(device.md2))
                        .replace(/\s*!/g, "")
                    : url
            } else {
                url = url.replace(/__OS__/g, '3')
            }
            url = this.config["MAC"] ? url.replace(/(__MAC1__|\{mac1\})/gi, this.Gvar.mdMac1).replace(/(__MAC__|\{mac\})/gi, this.config["设备加密"] ? this.Gvar.mdMac : this.Gvar.mac) : url;
            url = this.config["IP"] ? url.replace(/__IP__/gi, ip) : url;
            url = url.replace(/__TS__/gi, time)
        }
        return url.replace(/\[/g, "%5B").replace(/\]/g, "%5D").replace(/ /g, "%20").replace(/\{/g, "%7B").replace(/\}/g, "%7D")
    },
    u2us: function (urls) {
        if (typeof urls === 'object') {
            for (var i in urls) {
                urls[i] = this.u2u(urls[i])
            }
            return urls
        }
        return this.u2u(urls)
    },
    send: function send(urls) {
        // if (!SuperVar.config["快速曝光模式"]) {
        actor.evaluate(function (urls,bool) {
            if (typeof urls === 'object') {
                for (i in urls) {
                    if(bool)urls[i] = urls[i].replace(/__TIMESTAMP__/gi,Date.now());
                    urls[i] === "" ? "" : new Image().src = urls[i].replace(/\s+/g, "")
                }
            } else {
                if(bool)urls = urls.replace(/__TIMESTAMP__/gi,Date.now());
                new Image().src = urls.replace(/\s+/g, "").replace(/__TIMESTAMP__/gi,Date.now())
            }
        }, urls,SuperVar.config["回传"])
        // } else {
        //     var i;
        //     if (typeof urls === 'object') {
        //         for (i in urls) {
        //             i = site.requestUrl(urls[i].replace(/\s+/g, ""), siteOption);
        //             console.log("接收:" + JSON.stringify({"url": urls[i], "status: ": i.statusCode}))
        //         }
        //     } else {
        //         site.requestUrl(urls.replace(/\s+/g, ""), siteOption);
        //         console.log("接收:" + JSON.stringify({"url": urls[i], "status: ": i.statusCode}))
        //     }
        // }
    },
    click: function (s, seat, target) {
        typeof clickCount === "undefined" ? clickCount = 0 : "";
        clickCount++;
        console.log("第" + clickCount + "次点击");
        actor.evaluate(function (s, seat, target) {
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
    },
    clickDelay: function (s) {
        actor.evaluate(function (s) {
            var a = document.querySelectorAll(s);
            var toLink = a[parseInt(Math.random() * a.length)];
            var href = toLink.href;
            toLink.removeAttribute('href');
            toLink.click();
            setTimeout(function () {
                window.location.href = href
            }, 1500)
        }, s)
    },
    event: function event(selector, type) {
        var xy, x, y, type = type || "jq";
        if (type === 'jq') {
            xy = actor.evaluate(function (s) {
                var xy = {};
                xy.left = $(s).offset().left;
                xy.top = $(s).offset().top;
                xy.width = $(s).width();
                xy.height = $(s).height();
                return xy
            }, selector);
            console.log('坐标:' + JSON.stringify(xy));
        } else {
            xy = actor.evaluate(function (s) {
                var a = document.querySelectorAll(s);
                var _rnd = parseInt(Math.random() * a.length);
                console.log("第" + _rnd + "个");
                var toLink = a[_rnd];
                try {
                    xy = {
                        left: toLink.getBoundingClientRect().left,
                        top: toLink.getBoundingClientRect().top,
                        width: toLink.getBoundingClientRect().width,
                        height: toLink.getBoundingClientRect().height,
                        _rnd: _rnd
                    }
                } catch (e) {
                    xy = {
                        _rnd: _rnd
                    }
                }
                return xy
            }, selector);
        }
        console.log('坐标:' + JSON.stringify(xy));
        try {
            x = xy.left + parseInt(Math.random() * xy.width);
            y = xy.top + parseInt(Math.random() * xy.height);
            actor.evaluate(function (xy) {
                window.scrollTo(0, xy.top * 0.75)
            }, xy);
            SuperVar.scrollTo(xy.top * 0.75);
            setTimeout(function () {
                actor.sendEvent('mousedown', x, y);
                actor.sendEvent('mouseup', x, y);
                actor.sendEvent('click', x, y);
            }, 3000)
        } catch (e) {
            console.log(e)
        }
        setTimeout(function () {
            SuperVar.click(selector, xy._rnd)
        }, 3000)
    },
    heatMap: function () {
        var width = actor.evaluate(function () {
            return document.documentElement.clientWidth;
        });
        var height = actor.evaluate(function () {
            return document.documentElement.scrollHeight;
        });
        //热力点击
        var x = parseInt(width * Math.random());
        var y = parseInt(height * Math.random());
        actor.sendEvent('mousedown', x, y);
        actor.sendEvent('mouseup', x, y);
    },
    Log: function (type) {
        var action = ["requesr", 'imp', 'ck', 'deeplink'][type];
        SuperVar.send("http://api.oneaaa.cn/log/log.php?key=" + logKey + "&action=" + action + "&id=" + auid)
    },
    objectToUrl: function (b) {
        var x, txt = '';
        for (x in b) {
            txt = txt + '&' + x + '=' + b[x]
        }
        return txt.slice(1)
    },
    urlToObj: function (url, s1, s2) {
        var urlParam = url.split(s1)[1].split(s2);
        var urlObject = {};
        for (var key in urlParam) {
            var value = urlParam[key].split('=');
            urlObject[value[0]] = value[1]
        }
        return urlObject
    },
    Date: function (AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount);
        var Y = dd.getFullYear();
        var M = dd.getMonth() + 1;
        var D = dd.getDate();
        if (M < 10) {
            M = '0' + M
        }
        if (D < 10) {
            D = '0' + D
        }
        return Y + "-" + M + "-" + D
    },
    urlencode: function (clearString) {
        var output = '';
        var x = 0;
        clearString = utf16to8(clearString.toString());
        var regex = /(^[a-zA-Z0-9-_.]*)/;
        while (x < clearString.length) {
            var match = regex.exec(clearString.substr(x));
            if (match != null && match.length > 1 && match[1] != '') {
                output += match[1];
                x += match[1].length
            } else {
                if (clearString[x] == ' ') output += '+'; else {
                    var charCode = clearString.charCodeAt(x);
                    var hexVal = charCode.toString(16);
                    output += '%' + (hexVal.length < 2 ? '0' : '') + hexVal.toUpperCase()
                }
                x++
            }
        }

        function utf16to8(str) {
            var out, i, len, c;
            out = "";
            len = str.length;
            for (i = 0; i < len; i++) {
                c = str.charCodeAt(i);
                if ((c >= 0x0001) && (c <= 0x007F)) {
                    out += str.charAt(i)
                } else if (c > 0x07FF) {
                    out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                    out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
                } else {
                    out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
                }
            }
            return out
        }

        return output
    },
    randomText: function () {
        var _len = 2;
        var i = 0;
        var _str = "";
        var _base = 20000;
        var _range = 1000;
        while (i < _len) {
            i++;
            var _lower = parseInt(Math.random() * _range);
            _str += String.fromCharCode(_base + _lower);
        }
        return _str;
    },
    getTaskId: {
        /*获取 taskId*/
        get: function (startcallback) {
            var execFile = require("child_process").execFile;
            execFile("cat", ["/proc/" + __system__.pid + "/cmdline"], null, function (err, stdout, stderr) {
                if (stderr.length > 0) {
                    console.log("获取pid发生错误");
                    actor.skip(3000);
                    return;
                }
                if (stdout.length > 0) {
                    try {
                        var taskid1;
                        taskid1 = stdout.split("--local-storage-quota=-1.")[1].split("-")[0];
                        startcallback(taskid1);

                    } catch (e) {
                        console.log("解析taskid错误:" + e.toString());
                        actor.skip(3000);
                        return;
                    }
                }
            })
        },

        set: function (taskid) {
            try {
                auid = taskid.trim();
            } catch (e) {
                auid = taskid;
            }
        }
    },
    deviceModule: {
        ver: "1.2",
        imsi: function () {
            var mnctype = ["00", "02", "07", "01", "06", "03", "05", "11"];
            var mcc = "460",
                mnc = mnctype[parseInt(Math.random() * mnctype.length)];
            var M0 = "" + parseInt(Math.random() * 10);
            var M1 = "" + parseInt(Math.random() * 10);
            return mcc + mnc + "" + parseInt(Math.random() * 10) + "" + parseInt(Math.random() * 10) + M0 + M1 + "" + parseInt(Math.random() * 10) + M1 + "" + parseInt(Math.random() * 10) + "" + parseInt(Math.random() * 10) + "" + parseInt(Math.random() * 10) + "" + parseInt(Math.random() * 10);

        },
        getRandom: function (n, c) {
            c = c || 16;
            var str = '';
            var charsArr = ['8', '9', 'a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7'];
            for (var i = 0; i < n; i++) {
                str += charsArr[Math.floor(Math.random() * c)]
            }
            return str;
        },
        getMac: function () {
            var str = this.getRandom(12), mac = '';
            for (var i = 0; i < 12; i += 2) {
                mac += str.substr(i, 2) + ':';
            }
            return mac.slice(0, -1)
        },
        android: {
            lib: {
                brand: ['huawei', 'rongyao', 'mi', 'hongmi', 'oppo', 'samsung', 'meizu', 'oneplus', 'vivo'],
                model: {
                    huawei: [
                        //  0:名称  1:机型  2:系统  3:imei前缀  4:分辨率  5:ppi
                        ['7plus', 'TRT-AL00A Build/HUAWEITRT-AL00A', 8, '86669403', '1280*720', '267.02'],
                        ['Mate 10 Pro', 'BLA-AL00 Build/HUAWEIBLA-AL00', 8, '86621703', '2160*1080', '402.49'],
                        ['Mate 10', 'ALP-AL00 Build/HUAWEIALP-AL00', 8, '86777903', '2560*1440', '497.83'],
                        ['Mate 20 Pro', 'LYA-AL00 Build/HUAWEILYA-AL00', 9, '86000504', '3120*1440', '537.76'],
                        ['Mate 20 RS', 'LYA-AL00P Build/HUAWEILYA-AL00P', 9, '86713104', '3120*1440', '537.76'],
                        ['Mate 20 X', 'EVR-AL00 Build/HUAWEIEVR-AL00', 9, '86472304,86512904', '2244*1080', '345.88'],
                        ['Mate 20 X', 'EVR-AL00 Build/HUAWEIEVR-AL00', 9, '86512904', '2244*1080', '345.88'],
                        ['Mate 20', 'HMA-AL00 Build/HUAWEIHMA-AL00', 9, '86260404', '2244*1080', '381.37'],
                        ['mate8', 'NXT-CL00 Build/HUAWEINXT-CL00', 8, '86840502', '1920*1080', '367.15'],
                        ['mate9', 'MHJA-AL00 Build/HUAWEIMHJA-AL00', 9, '86467703', '1920*1080', '373.37'],
                        ['nova 2S', 'HWI-AL00 Build/HUAWEIHWI-AL00', 8, '86924503', '2160*1080', '402.49'],
                        ['nova 3i', 'INE-AL00 Build/HUAWEIINE-AL00', 8, '86250504', '2340*1080', '409.08'],
                        ['nova 4', 'VCE-AL00 Build/HUAWEIVCE-AL00', 9, '86941804', '2310*1080', '398.44'],
                        ['nova 4e', 'MAR-AL00 Build/HUAWEIMAR-AL00', 9, '86974304', '2312*1080', '414.93'],
                        ['P20 Pro', 'CLT-AL01 Build/HUAWEICLT-AL01', 8, '86483104,86941203', '2240*1080', '407.67'],
                        ['P20', 'EML-AL00 Build/HUAWEIEML-AL00', 8, '86983903', '2244*1080', '429.37'],
                        ['P30 Pro', 'VOG-AL10 Build/HUAWEIVOG-AL10', 9, '86273304,86928704', '2340*1080', '398.33'],
                        ['P30', 'ELE-AL00 Build/HUAWEIELE-AL00', 9, '86948804,86760204', '2340*1080', '422.49'],
                        ['P9 Plus', 'VIE-AL10 Build/HUAWEIVIE-AL10', 8, '86291803', '1920*1080', '400.53'],
                        ['畅享 7', 'SLA-AL00 Build/HUAWEISLA-AL00', 8, '86401020', '1280*720', '293.72'],
                        ['畅享 7S', 'FIG-TL10 Build/HUAWEIFIG-TL10', 8, '86886103', '2160*1080', '427.43'],
                        ['畅享 8e', 'DRA-AL00 Build/HUAWEIDRA-AL00', 8, '86153704', '1440*720', '295.41'],
                        ['畅享 9 Plus', 'JKM-AL00a Build/HUAWEIJKM-AL00a', 8, '86351304', '2340*1080', '396.49'],
                        ['畅享 9', 'DUB-ALL00 Build/HUAWEIDUB-ALL00', 8, '86661204', '1520*720', '268.67'],
                        ['畅享 9e', 'MRD-AL00 Build/HUAWEIMRD-AL00', 9, '86109904', '1560*720', '282.22'],
                        ['畅享 9S', 'POT-AL00a Build/HUAWEIPOT-AL00a', 9, '86952604', '2340*1080', '415.01'],
                        ['畅享 MAX', 'ARS-AL00 Build/HUAWEIARS-AL00', 8, '86722104', '2244*1080', '349.77'],
                        ['华为P10 Plus', 'VKY-L29 Build/HUAWEIVKY-L29', 8, '86294003', '2560*1440', '534.04'],
                        ['华为P10', 'VTR-AL00 Build/HUAWEIVTR-AL00', 8, '86605203', '1920*1080', '431.94'],
                        ['华为P9', 'EVA-CL00 Build/HUAWEIEVA-CL00', 8, '86915602', '1920*1080', '423.64'],
                        ['麦芒4', 'RIO-AL00 Build/HUAWEIRIO-AL00', 8, '86959802', '1920*1080', '400.53'],
                        ['麦芒5', 'MLA-AL10 Build/HUAWEIMLA-AL10', 8, '86789902', '1920*1080', '400.53'],
                        ['麦芒6', 'RNE-AL00 Build/HUAWEIRNE-AL00', 8, '86622003', '2160*1080', '409.31'],
                        ['麦芒7', 'SNE-AL00 Build/HUAWEISNE-AL00', 8, '86053904', '2340*1080', '409.08']
                    ],
                    rongyao: [
                        ['10', 'COL-AL10 Build/HUAWEICOL-AL10', 8, '86428604', '2280*1080', '432'],
                        ['10', 'HRY-AL00 Build/HUAWEIHRY-AL00', 9, '86649304', '2340*1080', '415.01'],
                        ['10', 'HRY-AL00a Build/HUAWEIHRY-AL00a', 9, '86649304', '2340*1080', '415.01'],
                        ['20', 'YAL-AL00 Build/HUAWEIYAL-AL00', 9, '86823704', '2340*1080', '411.69'],
                        ['20i', 'HRY-AL00Ta Build/HUAWEIHRY-AL00Ta', 9, '86177304', '2340*1080', '415.01'],
                        ['4A', 'SCL-AL00 Build/HUAWEISCL-AL00', 7, '86705302', '1280*720', '293.72'],
                        ['8X Max', 'ARE-AL10 Build/HUAWEIARE-AL10', 8, '86977503', '2244*1080', '349.77'],
                        ['8X', 'JSN-AL00a Build/HUAWEIJSN-AL00a', 8, '86865004', '2340*1080', '396.49'],
                        ['9', 'LLD-AL00 Build/HUAWEILLD-AL00', 8, '86367904', '2160*1080', '427.43'],
                        ['9', 'STF-AL10 Build/HUAWEISTF-AL10', 8, '86608903', '1920*1080', '427.75'],
                        ['9i', 'LLD-AL20 Build/HUAWEILLD-AL20', 8, '86130904', '2280*1080', '432'],
                        ['Magic2', 'TNY-AL00 Build/HUAWEITNY-AL00', 9, '86962104', '2340*1080', '403.32'],
                        ['Note10', 'RVL-AL09 Build/HUAWEIRVL-AL09', 8, '86969904', '2220*1080', '355.22'],
                        ['Play', 'COR-AL10 Build/HUAWEICOR-AL10', 8, '86936004', '2340*1080', '409.08'],
                        ['V10', 'BKL-AL00 Build/HUAWEIBKL-AL00', 8, '86860003', '2160*1080', '403.16'],
                        ['V20', 'PCT-AL10 Build/HUAWEIPCT-AL10', 9, '86008704', '2310*1080', '398.44'],
                        ['V9 play', 'JMM-AL00 Build/HUAWEIJMM-AL00', 8, '86800803', '1280*720', '282.42'],
                        ['畅玩5', 'CUN-AL00 Build/HUAWEICUN-AL00', 7, '86369303', '1280*720', '293.72'],
                        ['畅玩5A', 'CAM-TL00 Build/HUAWEICAM-TL00', 8, '86101503', '1280*720', '267.02'],
                        ['畅玩5C', 'NEM-UL10 Build/HUAWEINEM-UL10', 8, '86019203', '1920*1080', '423.64'],
                        ['畅玩5X', 'KIW-TL00 Build/HUAWEIKIW-TL00', 8, '86070803', '1920*1080', '400.53'],
                        ['畅玩6', 'MYA-AL10 Build/HUAWEIMYA-AL10', 8, '86822803', '1280*720', '293.72'],
                        ['畅玩6A', 'DLI-AL10 Build/HUAWEIDLI-AL10', 8, '86413303', '1280*720', '293.72'],
                        ['畅玩6X', 'BLA-AL10 Build/HUAWEIBLA-AL10', 8, '86398203', '1920*1080', '400.53'],
                        ['畅玩7', 'DUA-AL00 Build/HUAWEIDUA-AL00', 8, '86258604', '1440*720', '295.41'],
                        ['畅玩7A', 'AUM-AL00 Build/HUAWEIAUM-AL00', 8, '86667604', '1440*720', '282.45'],
                        ['畅玩7C', 'LND-AL30 Build/HUAWEILND-AL30', 8, '86911503', '1440*720', '268.78'],
                        ['畅玩7X', 'BND-AL10 Build/HUAWEIBND-AL10', 8, '86872203', '2160*1080', '407.24'],
                        ['畅玩8A', 'JAT-AL00 Build/HUAWEIJAT-AL00', 9, '86201404', '1560*720', '282.22'],
                        ['畅玩8C', 'BKK-AL00 Build/HUAWEIBKK-AL00', 8, '86226204', '1520*720', '268.67'],
                        ['畅玩8C', 'BKK-AL10 Build/HUAWEIBKK-AL10', 8, '86226204', '1520*720', '268.67']
                    ],
                    mi: [
                        ['5', 'MI 5 Build/', 7, '86225803', '1920*1080', '427.75'],
                        ['5s Plus', 'MI 5s Plus Build/ ', 7, '86141403', '1920*1080', '386.47'],
                        ['5s', 'MI 5s Build/', 7, '86381703', '1920*1080', '427.75'],
                        ['5X', 'MI 5X Build/', 7, '86730603', '1920*1080', '400.53'],
                        ['6X', 'MI 6X Build/', 8, '86719404', '2160*1080', '403.16'],
                        ['8 SE', 'MI 8SE Build/', 8, '86439604', '2244*1080', '423.53'],
                        ['8', 'MI 8 Build/', 8, '86183804', '2280*1080', '403.01'],
                        ['8', 'MI 8 Build/', 8, '86907103', '2248*1080', '401.61'],
                        ['8', 'MI 8 Build/', 8, '86978503', '2248*1080', '401.61'],
                        ['9', 'MI 9 Build/', 8, '86743604', '2340*1080', '403.32'],
                        ['9SE', 'MI 9SE Build/', 8, '86242704', '2340*1080', '431.69'],
                        ['Max2', 'MI Max2 Build/', 8, '86590203', '1920*1080', '342.07'],
                        ['Max3', 'MI Max3 Build/', 8, '86584704', '2160*1080', '349.99'],
                        ['Play', 'MI Play Build/', 8, '86366704', '2280*1080', '432']
                    ],
                    hongmi: [
                        ['5', 'Redmi 5 Build/', 8, '86823803', '1440*720', '282.45'],
                        ['5A', 'Redmi 5A Build/', 8, '86837403', '1280*720', '269.47'],
                        ['5Plus', 'Redmi 5Plus Build/', 8, '86824103', '2160*1080', '403.16'],
                        ['6', 'Redmi 6 Build/', 8, '86456004', '1440*720', '295.41'],
                        ['6A', 'Redmi 6A Build/', 8, '86911404', '1440*720', '295.41'],
                        ['6Pro', 'Redmi 6Pro Build/', 8, '86592604', '2280*1080', '432'],
                        ['7', 'Redmi 7 Build/', 8, '86011304', '1520*720', '268.67'],
                        ['K20pro', 'Redmi K20pro Build/', 8, '86134804', '2340*1080', '403.32'],
                        ['Note7 Pro', 'Redmi Note7 Pro Build/', 8, '86578704', '2340*1080', '409.08'],
                        ['Note7', 'Redmi Note7 Build/', 8, '86435704', '2340*1080', '409.08'],
                        ['Pro', 'Redmi Pro Build/', 8, '86977302', '1920*1080', '400.53'],
                        ['Redmi 7A', 'Redmi 7A Build/', 8, '86083304', '1440*720', '295.41'],
                        ['Redmi K20', 'Redmi K20 Build/', 8, '86821704', '2340*1080', '403.32'],
                        ['S2', 'Redmi S2 Build/', 8, '86914602', '1440*720', '268.78']
                    ],
                    oppo: [
                        ['A37M', 'OPPO A37M Build/', 8, '86480403', '1280*720', '293.72'],
                        ['A5', 'OPPO A5 Build/', 8, '86462904', '1520*720', '271.27'],
                        ['A5', 'OPPO A5 Build/', 8, '86481504', '1520*720', '271.27'],
                        ['A7', 'OPPO A7 Build/', 8, '86573404', '1520*720', '271.27'],
                        ['A79', 'OPPO A79 Build/', 8, '86805503', '2160*1080', '401.82'],
                        ['A7x', 'OPPO A7x Build/', 8, '86149804', '2340*1080', '409.08'],
                        ['A83', 'OPPO A83 Build/', 8, '86932603', '1440*720', '282.45'],
                        ['A9', 'OPPO A9 Build/', 8, '86794704', '2340*1080', '394.67'],
                        ['A9x', 'OPPO A9x Build/', 8, '86641104', '2340*1080', '394.67'],
                        ['Find X', 'OPPO Find X Build/', 8, '86863303', '2340*1080', '401.43'],
                        ['K1', 'OPPO K1 Build/', 8, '86220404', '2340*1080', '402.69'],
                        ['K3', 'OPPO K3 Build/', 9, '86974704', '2340*1080', '396.49'],
                        ['R15', 'OPPO R15 Build/', 8, '86976103', '2280*1080', '401.73'],
                        ['R15x', 'OPPO R15x Build/', 8, '86660504', '2340*1080', '402.69'],
                        ['R17 Pro', 'OPPO R17 Pro Build/', 8, '86263804', '2340*1080', '402.69'],
                        ['R17', 'OPPO R17 Build/', 8, '86107104', '2340*1080', '402.69'],
                        ['R7', 'OPPO R7 Build/', 8, '86761702', '1920*1080', '440.58'],
                        ['R7SM', 'OPPO R7SM Build/', 8, '86787602', '1920*1080', '400.53'],
                        ['R9M', 'OPPO R9M Build/', 8, '86304803', '1920*1080', '400.53'],
                        ['R9S', 'OPPO R9S Build/', 8, '86253103', '1920*1080', '400.53'],
                        ['Reno Z', 'OPPO Reno Z Build/', 8, '86332204', '2340*1080', '402.69'],
                        ['Reno', 'OPPO Reno Build/', 9, '86657104', '2340*1080', '390.49']
                    ],
                    samsung: [
                        ['A70', 'SM-A7050 Build/', 8, '35591110', ' 2400*1080', '392.81'],
                        ['C7 Pro', 'SM-C7010 Build/', 8, '35473408', '1920*1080', '386.47'],
                        ['C7', 'SM-C7000 Build/', 8, '35881107', '1920*1080', '386.47'],
                        ['Galaxy A40s', 'SM-A3050 Build/', 8, '35541310', '1560*720', '268.46'],
                        ['Galaxy A40s', 'SM-A3058 Build/', 8, '35541310', '1560*720', '268.46'],
                        ['Galaxy A60', 'SM-A6060 Build/', 8, '35540310', '2340*1080', '409.08'],
                        ['Galaxy A6s', 'SM-G6200 Build/', 8, '35923409', '2160*1080', '402.49'],
                        ['Galaxy A8s', 'SM-G8870 Build/', 8, '35280610', '2340*1080', '402.69'],
                        ['Galaxy A9 Star', 'SM-G8850 Build/', 8, '35588809', '2220*1080', '391.87'],
                        ['Galaxy A9s', 'SM-A9200 Build/', 8, '35206310', '2220*1080', '391.87'],
                        ['Galaxy C5', 'SM-C5000 Build/', 8, '35328808', '1920*1080', '423.64'],
                        ['Galaxy C8', 'SM-C7100 Build/', 8, '35977108', '1920*1080', '400.53'],
                        ['Galaxy Folder2', 'SM-G1650 Build/', 8, '35866408', '800*480', '245.51'],
                        ['Galaxy Note8', 'SM-N9508 Build/', 8, '35976908', '2960*1440', '522.49'],
                        ['Galaxy Note9', 'SM-N9600 Build/', 8, '35758609', '2960*1440', '514.33'],
                        ['Galaxy S10', 'SM-G9730 Build/', 8, '35192210', '3040*1440', '551.44'],
                        ['Galaxy S10+', 'SM-G9750 Build/', 8, '35207010', '3040*1440', '525.59'],
                        ['Galaxy S10e', 'SM-G9700 Build/', 8, '35222810', '2280*1080', '434.98'],
                        ['Galaxy S7 active', 'SM-G891A Build/', 8, '35171308', '2560*1440', '575.92'],
                        ['Galaxy S8', 'SM-G9500 Build/', 8, '35705209', '2960*1440', '587.8'],
                        ['Galaxy S8+', 'SM-G9550 Build/', 8, '35473208', '2960*1440', '539.62'],
                        ['Galaxy S9', 'SM-G9608/DS Build/', 8, '35271309', '2960*1440', '567.53'],
                        ['Galaxy S9+', 'SM-G9650/DS Build/', 8, '35820809', '2960*1440', '530.92'],
                        ['NOTE 5', 'SM-9208 Build/', 8, '35532007', '2560*1440', '515.3'],
                        ['S7 edge', 'SM-G9350 Build/', 8, '35615607', '2560*1440', '534.04'],
                        ['W2016', 'SM-W2016 Build/', 8, '35391007', '1280*768', '382.75'],
                        ['W2017', 'SM-W2017 Build/', 8, '35294204', '1920*1080', '524.5'],
                        ['W2018', 'SM-W2018 Build/', 8, '35240809', '1920*1080', '524.5'],
                        ['W2019', 'SM-W2019 Build/', 8, '35234408', '1920*1080', '524.5'],
                        ['领世旗舰8', 'SM-G9298 Build/', 8, '35780808', '1920*1080', '524.5']
                    ],
                    meizu: [
                        ['15', 'M15 Build/', 8, '86677403', '1920*1080', '403.46'],
                        ['16s', 'M16s Build/', 8, '86740104', '2232*1080', '399.93'],
                        ['16th Plus', 'M16th Plus Build/', 8, '86845503', '2160*1080', '371.53'],
                        ['16th', 'M16th Build/', 8, '86677803', '2160*1080', '402.49'],
                        ['16X', 'M16X Build/', 8, '86788403', '2160*1080', '402.49'],
                        ['16xs', 'M16xs Build/', 8, '86994904', '2232*1080', '399.93'],
                        ['2', 'M2 Build/', 7, '86804602', '1280*720', '293.72'],
                        ['3s', 'M3s Build/', 7, '86140003', '1280*720', '287.96'],
                        ['5s', 'M5s Build/', 8, '86326203', '1920*1080', '400.53'],
                        ['6', 'M6 Build/', 8, '86718203', '1280*720', '282.42'],
                        ['6T', 'M6T Build/', 8, '86757403', '1440*720', '282.45'],
                        ['A5', 'M A5 Build/', 8, '86674603', '1280*720', '293.72'],
                        ['E3', 'ME3 Build/', 8, '86690603', '2160*1080', '403.16'],
                        ['M15', 'M15 Build/', 8, '86734303', '1920*1080', '403.46'],
                        ['Max', 'Max Build/', 8, '86193603', '1920*1080', '367.15'],
                        ['Mx4', 'Mx4 Build/', 7, '86209502', '1920*1152', '417.74'],
                        ['MX4Pro', 'MX4Pro Build/', 7, '86586302', '2560*1536', '542.81'],
                        ['MX6', 'MX6 Build/', 8, '86302603', '1920*1080', '400.53'],
                        ['Note2', 'M Note2 Build/', 7, '86908502', '1920*1080', '400.53'],
                        ['Note3', 'M note3 Build/', 8, '86214303', '1920*1080', '400.53'],
                        ['Note5', 'M Note5 Build/', 8, '86254103', '1920*1080', '400.53'],
                        ['Note6', 'M Note6 Build/', 8, '86517603', '1920*1080', '400.53'],
                        ['Note8', 'M Note8 Build/', 8, '86806703', '2160*1080', '402.49'],
                        ['Note9', 'M Note9 Build/', 8, '86630904', '2244*1080', '401.67'],
                        ['Pro6 Plus', 'M Pro6 Plus Build/', 8, '86289103', '2560*1440', '515.3'],
                        ['Pro6', 'M Pro6 Build/', 8, '86901102', '1920*1080', '423.64'],
                        ['pro7', 'M pro7 Build/', 8, '86404403', '1920*1080', '423.64'],
                        ['S6', 'MS6 Build/', 8, '86845003', '1440*720', '282.45'],
                        ['V8', 'MV8 Build/', 8, '86764703', '1440*720', '282.45'],
                        ['X3', 'MX3 Build/', 7, '86284502', '1800*1080', '411.6'],
                        ['X5', 'MX5 Build/', 7, '86724602', '1920*1080', '400.53'],
                        ['X8', 'MX8 Build/', 8, '86908603', '2220*1080', '398.19']
                    ],
                    oneplus: [
                        ['ONEPLUS 5', 'ONE A5000 Build/', 8, '86679003', '1920*1080', '400.53'],
                        ['ONEPLUS 5T', 'ONE A5010 Build/', 8, '86823303', '2160*1080', '401.82'],
                        ['ONEPLUS 6', 'ONE A6000 Build/', 8, '86530004', '2280*1080', '401.73'],
                        ['ONEPLUS 6T', 'ONE A6010 Build/', 8, '86938604', '2340*1080', '402.69'],
                        ['ONEPLUS 7 Pro', 'ONE GM1910 Build/', 9, '86358104', '3120*1440', '515.18']
                    ],
                    vivo: [
                        ['iQOO', 'vivo iQOO Build/', 9, '86766104', '2340*1080', '402.06'],
                        ['NEX', 'vivo NEX Build/', 8, '86899504', '2316*1080', '387.77'],
                        ['NEX', 'vivo NEX Build/', 9, '86307804', '2340*1080', '403.32'],
                        ['S1', 'vivo S1 Build/', 9, '86279604', '2340*1080', '394.67'],
                        ['S1Pro', 'vivo S1Pro Build/', 9, '86975804', '2340*1080', '403.32'],
                        ['U1', 'vivo U1 Build/', 8, '86246604', '1520*720', '271.27'],
                        ['V3MA', 'vivo V3MA Build/', 8, '86250603', '1920*1080', '400.53'],
                        ['X20A', 'vivo X20A Build/', 8, '86803903', '2160*1080', '401.82'],
                        ['x21', 'vivo x21 Build/', 8, '86837504', '2280*1080', '401.73'],
                        ['X21A', 'vivo X21A Build/', 9, '86970603', '2280*1080', '401.73'],
                        ['X21i ', 'vivo X21i Build/', 8, '86898103', '2280*1080', '401.73'],
                        ['X21s', 'vivo X21s Build/', 8, '86874604', '2340*1080', '402.06'],
                        ['X23', 'vivo X23 Build/', 8, '86047204', '2340*1080', '402.06'],
                        ['X27', 'vivo X27 Build/', 9, '86401504', '2340*1080', '403.32'],
                        ['X27Pro', 'vivo X27Pro Build/', 9, '86429504', '2460*1080', '400.99'],
                        ['X5Pro D', 'vivo X5Pro D Build/', 8, '86886102', '1920*1080', '423.64'],
                        ['x7', 'vivo x7 Build/', 8, '86256503', '1920*1080', '423.64'],
                        ['x9', 'vivo x9 Build/', 8, '86350403', '1920*1080', '400.53'],
                        ['X9i', 'vivo X9i Build/', 8, '86453403', '1920*1080', '400.53'],
                        ['x9s plus', 'vivo x9s plus Build/', 8, '86504403', '1920*1080', '376.57'],
                        ['Y3', 'vivo Y3 Build/', 9, '86791104', '1544*720', '296.73'],
                        ['Y31A', 'vivo Y31A Build/', 7, '86226203', '960*540', '234.35'],
                        ['Y55', 'vivo Y55 Build/', 7, '86522603', '1280*720', '282.42'],
                        ['Y66', 'vivo Y66 Build/', 8, '86625103', '1280*720', '267.02'],
                        ['Y67', 'vivo Y67 Build/', 8, '86360003', '1280*720', '267.02'],
                        ['Y69 ', 'vivo Y69 Build/', 8, '86603903', '1280*720', '267.02'],
                        ['Y71', 'vivo Y71 Build/', 8, '86873803', '1440*720', '268.78'],
                        ['Y73', 'vivo Y73 Build/', 8, '86830004', '1440*720', '268.78'],
                        ['Y75S', 'vivo Y75S Build/', 8, '86967803', '1440*720', '268.78'],
                        ['Y81s', 'vivo Y81s Build/', 8, '86906403', '1520*720', '270.4'],
                        ['Y85', 'vivo Y85 Build/', 8, '86987003', '2280*1080', '403.01'],
                        ['Y93', 'vivo Y93 Build/', 8, '86192704', '1520*720', '271.27'],
                        ['Y93s', 'vivo Y93s Build/', 8, '86027004', '1520*720', '271.27'],
                        ['Y97', 'vivo Y97 Build/', 8, '86943704', '2280*1080', '400.45'],
                        ['Z1', 'vivo Z1 Build/', 8, '86654904', '2280*1080', '403.01'],
                        ['Z1i', 'vivo Z1i Build/', 9, '86915503', '2280*1080', '403.01'],
                        ['Z3', 'vivo Z3 Build/', 8, '86747804', '2280*1080', '400.45'],
                        ['Z3x', 'vivo Z3x Build/', 8, '86473604', '2280*1080', '403.01'],
                        ['Z5X', 'vivo Z5X Build/', 9, '86921104', '2340*1080', '394.67'],
                        ['Z5x', 'vivo Z5x Build/', 9, '86921104', '2340*1080', '394.67']
                    ]
                }
            },
            osv: {
                5: ['5.0', '5.0.1', '5.0.2', '5.1', '5.1.1'],
                6: ['6.0', '6.0.1'],
                7: ['7.0', '7.1', '7.1.1', '7.1.2'],
                8: ['8.0', '8.1'],
                9: ['9.0']//'9.0.1'
            },
            build: {
                '5.0': ['LRX21V', 'LRX21T', 'LRX21R', 'LRX21Q', 'LRX21P', 'LRX21O', 'LRX21M', 'LRX21L'],
                '5.0.1': ['LRX22C'],
                '5.0.2': ['LRX22L', 'LRX22G'],
                '5.1': ['LMY47O', 'LMY47M', 'LMY47I', 'LMY47E', 'LMY47D'],
                '5.1.1': ['LMY49M', 'LMY49J', 'LMY49I', 'LMY49H', 'LMY49G', 'LMY49F', 'LMY48Z', 'LYZ28N', 'LMY48Y', 'LMY48X', 'LMY48W', 'LVY48H', 'LYZ28M', 'LMY48U', 'LMY48T', 'LVY48F', 'LYZ28K', 'LMY48P', 'LMY48N', 'LMY48M', 'LVY48E', 'LYZ28J', 'LMY48J', 'LMY48I', 'LVY48C', 'LMY48G', 'LYZ28E', 'LMY47Z', 'LMY48B', 'LMY47X', 'LMY47V'],
                '6.0': ['MMB29N', 'MDB08M', 'MDB08L', 'MDB08K', 'MDB08I', 'MDA89E', 'MDA89D', 'MRA59B', 'MRA58X', 'MRA58V', 'MRA58U', 'MRA58N', 'MRA58K'],
                '6.0.1': ['MOI10E', 'MOB31Z', 'MOB31T', 'MOB31S', 'M4B30Z', 'MOB31K', 'MMB31C', 'M4B30X', 'MOB31H', 'MMB30Y', 'MTC20K', 'MOB31E', 'MMB30W', 'MXC89L', 'MTC20F', 'MOB30Y', 'MOB30X', 'MOB30W', 'MMB30S', 'MMB30R', 'MXC89K', 'MTC19Z', 'MTC19X', 'MOB30P', 'MOB30O', 'MMB30M', 'MMB30K', 'MOB30M', 'MTC19V', 'MOB30J', 'MOB30I', 'MOB30H', 'MOB30G', 'MXC89H', 'MXC89F', 'MMB30J', 'MTC19T', 'M5C14J', 'MOB30D', 'MHC19Q', 'MHC19J', 'MHC19I', 'MMB29X', 'MXC14G', 'MMB29V', 'MXB48T', 'MMB29U', 'MMB29R', 'MMB29Q', 'MMB29T', 'MMB29S', 'MMB29P', 'MMB29O', 'MXB48K', 'MXB48J', 'MMB29M', 'MMB29K'],
                '7.0': ['NBD92Q', 'NBD92N', 'NBD92G', 'NBD92F', 'NBD92E', 'NBD92D', 'NBD91Z', 'NBD91Y', 'NBD91X', 'NBD91U', 'N5D91L', 'NBD91P', 'NRD91K', 'NRD91N', 'NBD90Z', 'NBD90X', 'NBD90W', 'NRD91D', 'NRD90U', 'NRD90T', 'NRD90S', 'NRD90R', 'NRD90M'],
                '7.1': ['NDE63X', 'NDE63V', 'NDE63U', 'NDE63P', 'NDE63L', 'NDE63H'],
                '7.1.1': ['N9F27M', 'NGI77B', 'N8I11F', 'N6F27M', 'N4F27P', 'N9F27L', 'NGI55D', 'N4F27O', 'N8I11B', 'N9F27H', 'N6F27I', 'N4F27K', 'N9F27F', 'N6F27H', 'N4F27I', 'N9F27C', 'N6F27E', 'N4F27E', 'N6F27C', 'N4F27B', 'N6F26Y', 'NOF27D', 'N4F26X', 'N4F26U', 'N6F26U', 'NUF26N', 'NOF27C', 'NOF27B', 'N4F26T', 'NMF27D', 'NMF26X', 'NOF26W', 'NOF26V', 'N6F26R', 'NUF26K', 'N4F26Q', 'N4F26O', 'N6F26Q', 'N4F26M', 'N4F26J', 'N4F26I', 'NMF26V', 'NMF26U', 'NMF26R', 'NMF26Q', 'NMF26O', 'NMF26J', 'NMF26H', 'NMF26F'],
                '7.1.2': ['N2G48H', 'NZH54D', 'NKG47S', 'NHG47Q', 'NJH47F', 'N2G48C', 'NZH54B', 'NKG47M', 'NJH47D', 'NHG47O', 'N2G48B', 'N2G47Z', 'NJH47B', 'NJH34C', 'NKG47L', 'NHG47N', 'N2G47X', 'N2G47W', 'NHG47L', 'N2G47T', 'N2G47R', 'N2G47O', 'NHG47K', 'N2G47J', 'N2G47H', 'N2G47F', 'N2G47E', 'N2G47D'],
                '8.0': ['OPR5.170623.014', 'OPR4.170623.020', 'OPD3.170816.023', 'OPD1.170816.025', 'OPR6.170623.023', 'OPR5.170623.011', 'OPR3.170623.013', 'OPR2.170623.027', 'OPR1.170623.032', 'OPD3.170816.016', 'OPD2.170816.015', 'OPD1.170816.018', 'OPD3.170816.012', 'OPD1.170816.012', 'OPD1.170816.011', 'OPD1.170816.010', 'OPR5.170623.007', 'OPR4.170623.009', 'OPR3.170623.008', 'OPR1.170623.027', 'OPR6.170623.021', 'OPR6.170623.019', 'OPR4.170623.006', 'OPR3.170623.007', 'OPR1.170623.026', 'OPR6.170623.013', 'OPR6.170623.012', 'OPR6.170623.011', 'OPR6.170623.010'],
                '8.1': ['OPM8.181005.003', 'OPM7.181005.003', 'OPM6.171019.030.K1', 'OPM4.171019.021.Z1', 'OPM6.171019.030.H1', 'OPM4.171019.021.Y1', 'OPM6.171019.030.E1', 'OPM4.171019.021.R1', 'OPM4.171019.021.Q1', 'OPM4.171019.021.P1', 'OPM4.171019.021.N1', 'OPM2.171026.006.H1', 'OPM2.171026.006.Google One', 'OPM6.171019.030.B1', 'OPM4.171019.021.E1', 'OPM4.171019.021.D1', 'OPM2.171026.006.C1', 'OPM4.171019.016.C1', 'OPM4.171019.016.B1', 'OPM4.171019.016.A1', 'OPM2.171019.029.B1', 'OPM2.171019.029.A1', 'OPM4.171019.015.A1', 'OPM5.171019.019', 'OPM3.171019.019', 'OPM2.171019.029', 'OPM1.171019.026', 'OPM5.171019.017', 'OPM3.171019.016', 'OPM1.171019.022.A1', 'OPM1.171019.021', 'OPM5.171019.015', 'OPM3.171019.014', 'OPM1.171019.019', 'OPM1.171019.018', 'OPM1.171019.016', 'OPM5.171019.014', 'OPM2.171019.016', 'OPM3.171019.013', 'OPM1.171019.015', 'OPM1.171019.014', 'OPM1.171019.013', 'OPM1.171019.012', 'OPM2.171019.012', 'OPM1.171019.011'],
                '9.0': ['PD1A.180720.031', 'PD1A.180720.030', 'PPR2.181005.003', 'PPR1.181005.003', 'PPR2.180905.006.A1', 'PPR2.180905.006', 'PPR2.180905.005', 'PPR1.180905.003', 'PPR1.180610.011', 'PPR1.180610.010', 'PPR1.180610.009'],
                '9.0.1': ['']
            },
            browser: {
                key: ['baidubrowser', 'MQQBrowser', 'UCBrowser'],
                Chrome: ['59.0.2785.49', '59.0.3071.125', '60.0.3112.116', '61.0.3163.128', '61.0.3163.98', '62.0.3202.84', '63.0.3239.111', '63.0.3239.83', '64.0.3282.123', '64.0.3282.137', '65.0.3325.109', '65.3.0.1', '66.0.3359.126', '66.0.3359.158', '67.0.3396.87', '67.0.3396.97', '68.0.3440.85', '68.0.3440.91'],
                // UCBrowser附属
                //AliApp: ['(DingTalk/4.0.1)','(DingTalk/4.1.0)','(DingTalk/4.1.5)','(DingTalk/4.2.0)','(DingTalk/4.2.1)','(DingTalk/4.2.6)','(DingTalk/4.2.8)','(DingTalk/4.3.1)','(DingTalk/4.3.10)','(DingTalk/4.3.2)','(DingTalk/4.3.3)','(DingTalk/4.3.6)','(DingTalk/4.3.7)','(DingTalk/4.5.0)','(DingTalk/4.5.11)','(DingTalk/4.5.5)','(DingTalk/4.5.8)','(TB/7.0.2)','(TB/7.1.0)','(TB/7.1.1)','(TB/7.1.3)','(TB/7.1.3.1)','(TB/7.1.3.2)','(TB/7.1.4)','(TB/7.1.4.8)','(TB/7.1.5.1)','(TB/7.1.6)','(TB/7.1.6.4)','(TB/7.1.7)','(TB/7.1.7.10)','(TB/7.10.0)','(TB/7.10.0.12)','(TB/7.10.0.23)','(TB/7.10.1)','(TB/7.10.1.22)','(TB/7.10.1.48)','(TB/7.10.1.58)','(TB/7.10.3)','(TB/7.10.3.80)','(TB/7.10.4)','(TB/7.10.5)','(TB/7.10.6)','(TB/7.10.6.27)','(TB/7.11.0)','(TB/7.2.0)','(TB/7.2.1)','(TB/7.2.1.1)','(TB/7.2.1.8)','(TB/7.2.3)','(TB/7.2.3.1)','(TB/7.2.3.2)','(TB/7.2.3.3)','(TB/7.2.3.4)','(TB/7.2.3.7)','(TB/7.2.3.9)','(TB/7.2.4)','(TB/7.3.0.9)','(TB/7.3.1)','(TB/7.3.1.3)','(TB/7.3.1.44)','(TB/7.3.1.7)','(TB/7.3.2)','(TB/7.3.2.15)','(TB/7.3.2.2)','(TB/7.3.2.21)','(TB/7.3.2.24)','(TB/7.3.2.26)','(TB/7.3.2.5)','(TB/7.3.2.82)','(TB/7.3.3)','(TB/7.4.0)','(TB/7.4.1)','(TB/7.4.2)','(TB/7.4.2.1)','(TB/7.4.2.12)','(TB/7.4.2.3)','(TB/7.4.2.33)','(TB/7.4.4)','(TB/7.4.4.47)','(TB/7.4.4.50)','(TB/7.4.4.54)','(TB/7.4.6)','(TB/7.5.0)','(TB/7.5.0.2)','(TB/7.5.0.4)','(TB/7.5.1)','(TB/7.5.3)','(TB/7.5.4)','(TB/7.5.4.9)','(TB/7.6)','(TB/7.6.0)','(TB/7.6.0.10)','(TB/7.6.1)','(TB/7.6.1.1)','(TB/7.6.1.11)','(TB/7.6.1.14)','(TB/7.6.1.17)','(TB/7.6.1.19)','(TB/7.6.1.2)','(TB/7.6.1.3)','(TB/7.6.1.4)','(TB/7.6.1.52)','(TB/7.6.1.53)','(TB/7.6.1.55)','(TB/7.6.1.58)','(TB/7.6.2)','(TB/7.6.3)','(TB/7.6.3.5)','(TB/7.6.3.73)','(TB/7.6.3.75)','(TB/7.6.3.8)','(TB/7.6.4)','(TB/7.6.4.1)','(TB/7.7.0)','(TB/7.7.0.4)','(TB/7.7.0.5)','(TB/7.7.2)','(TB/7.7.2.1)','(TB/7.7.3)','(TB/7.7.4)','(TB/7.7.4.2)','(TB/7.7.4.48)','(TB/7.7.5)','(TB/7.8.0.12)','(TB/7.8.0.13)','(TB/7.8.0.14)','(TB/7.8.0.18)','(TB/7.8.0.19)','(TB/7.8.0.34)','(TB/7.8.2)','(TB/7.8.2.1)','(TB/7.8.3)','(TB/7.8.6)','(TB/7.8.6.6)','(TB/7.8.6.7)','(TB/7.8.7)','(TB/7.8.7.6)','(TB/7.9.0)','(TB/7.9.0.3)','(TB/7.9.1)','(TB/7.9.1.15)','(TB/7.9.2)','(TB/7.9.2.11)','(TB/7.9.2.8)','(TB/7.9.3)','(TB/7.9.4)'],
                baiduboxapp: ['10.8.0.10', '10.8.0.3', '10.8.5.10', '10.8.6.1', '10.8.7.10', '10.9.0.1', '10.9.0.10', '10.9.0.11', '10.9.5.10', '10.11.0.13', '10.12.0.12', '10.13.0.10', '10.13.0.11', '10.13.5.10', '11.0.0.11', '11.0.5.12', '11.1.0.10', '11.1.5.10', '11.2.0.10', '11.9.0.11'],
                baidubrowser: ['7.12.11.0', '7.12.12.0', '7.12.12.0', '7.12.12.0', '7.12.12.0', '7.13.13.0', '7.13.13.0', '7.13.13.0', '7.13.13.0', '7.13.13.0', '7.14.14.0', '7.14.14.0', '7.14.14.0', '7.14.14.0', '7.15.15.0', '7.15.15.0', '7.15.15.0', '7.15.15.0', '7.15.15.0', '7.15.15.0', '7.15.15.0', '7.15.15.0', '7.15.15.0', '7.15.15.0', '7.15.15.0', '7.16.11.0', '7.16.12.0', '7.16.12.0', '7.16.12.0', '7.16.12.0', '7.16.12.0', '7.16.21.0', '7.17.10.0', '7.17.12.0', '7.17.12.0', '7.17.12.0', '7.17.12.0', '7.17.12.0', '7.17.12.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.11.0', '7.18.20.0', '7.18.20.0', '7.18.20.0', '7.18.20.0', '7.18.20.0', '7.18.20.0', '7.18.20.0', '7.18.20.0', '7.18.20.0', '7.18.20.0', '7.18.20.0', '7.18.20.0', '7.18.20.0', '7.18.21.0', '7.18.21.0', '7.18.21.0', '7.18.23.0', '7.2.14.0', '7.2.4.204', '7.5.22.0', '7.7.13.0', '7.8.12.0', '7.8.12.0', '7.8.12.0', '7.8.12.0', '7.8.12.0', '7.8.12.0', '7.8.2.0', '7.9.12.0', '7.9.12.0', '7.9.12.0', '7.9.12.0', '7.9.12.0', '7.9.12.0', '7.9.12.0', '7.9.12.0', '7.9.12.0', '7.9.12.0', '7.9.12.0', '7.9.12.0', '7.9.12.0', '7.9.12.0', '7.9.12.0'],
                MicroMessenger: ['6.0.0.50_r844973.501', '6.0.0.54_r849063.501', '6.0.2.56_r958800.520', '6.0.2.58_r984381.520', '6.1.0.40_r1018582.540', '6.1.0.66_r1062275.542', '6.2.0.52_r1162382.561', '6.2.4.51_rdf8da56.600', '6.2.5.49_r7ead8bf.620', '6.3.13.49_r4080b63.740', '6.3.13.49_r4080b63.741', '6.3.15.49_r8aff805.740', '6.3.15.49_r8aff805.760', '6.3.16.49_r03ae324.780', '6.3.18.800', '6.3.22', '6.3.22.821', '6.3.23.840', '6.3.25.861', '6.3.27.880', '6.3.28.900', '6.3.30.920', '6.3.31.940', '6.3.32.940', '6.3.32.960', '6.3.7.51_rbb7fa12.660', '6.3.8.50_r251a77a.680', '6.3.9', '6.5.10.1060', '6.5.10.1080', '6.5.13.1080', '6.5.13.1100', '6.5.14.1100', '6.5.16.1101', '6.5.16.1120', '6.5.19.1120', '6.5.19.1140', '6.5.22.1140', '6.5.22.1160', '6.5.23.1160', '6.5.23.1180', '6.5.3.980', '6.5.4', '6.5.4.1000', '6.5.6', '6.5.6.1020', '6.5.7.1040', '6.5.7.1041', '6.5.8.1060', '6.6.1.1200(0x26060130)', '6.6.1.1200(0x26060132)', '6.6.1.1200(0x26060133)', '6.6.1.1200(0x26060168)', '6.6.1.1220(0x26060133)', '6.6.1.1220(0x26060134)', '6.6.1.1220(0x26060135)', '6.6.1.1220(0x2606017B)', '6.6.1200(0x26060030)', '6.6.1200(0x26060031)', '6.6.2.1220(0x26060212)', '6.6.2.1220(0x26060234)', '6.6.2.1240(0x26060235)', '6.6.2.1240(0x26060236)', '6.6.2.1240(0x26060240)', '6.6.3.1240(0x26060339)', '6.6.3.1260(0x26060336)', '6.6.3.1260(0x26060339)', '6.6.5.1260(0x26060511)', '6.6.5.1260(0x26060530)', '6.6.5.1260(0x26060531)', '6.6.5.1280(0x26060532)', '6.6.5.1280(0x26060533)', '6.6.5.1280(0x26060536)', '6.6.5.1280(0x26060561)', '6.6.5.1280(0x2606056B)', '6.6.6.1280(0x26060630)', '6.6.6.1300(0x26060632)', '6.6.6.1300(0x26060634)', '6.6.6.1300(0x26060636)', '6.6.6.1300(0x26060637)', '6.6.6.1300(0x26060638)', '6.6.6.1300(0x2606068D)', '6.6.6.1300(0x260606A3)', '6.6.7.1300(0x26060731)', '6.6.7.1300(0x26060732)', '6.6.7.1302(0x26060742)', '6.6.7.1303(0x26060743)', '6.6.7.1320(0x26060734)', '6.6.7.1320(0x26060735)', '6.6.7.1320(0x26060737)', '6.6.7.1320(0x26060739)', '6.6.7.1320(0x2606078B)', '6.6.7.1321(0x26060736)', '6.6.7.1321(0x26060737)', '6.6.7.1321(0x26060739)', '6.6.7.1321(0x26060771)', '6.6.7.1321(0x26060778)', '6.7.1321(0x26070030)', '6.7.2.1321(0x26070232)', '6.7.2.1340(0x26070233)', '6.7.2.1340(0x26070234)', '6.7.2.1340(0x26070235)', '6.7.2.1340(0x26070236)', '6.7.2.1340(0x26070237)', '6.7.2.1340(0x26070238)', '6.7.2.1340(0x26070239)', '6.7.2.1340(0x2607023A)', '6.7.2.1340(0x26070264)', '6.7.2.1340(0x26070275)', '6.7.2.1340(0x26070277)', '6.7.2.1340(0x2607028A)', '6.7.2.1340(0x26070295)', '6.7.3.1340(0x26070331)', '6.7.3.1340(0x26070332)', '6.7.3.1360(0x26070333)', '7.2.0.3270'],
                // MicroMessenger附属
                TBS: ['043012', '043015', '043024', '043042', '043108', '043109', '043114', '043115', '043124', '043128', '043204', '043220', '043221', '043304', '043305', '043307', '043313', '043408', '043409', '043507', '043508', '043520', '043602', '043610', '043613', '043622', '043632', '043657', '043670', '043674', '043712', '043722', '043803', '043804', '043805', '043806', '043807', '043808', '043811', '043903', '043906', '043909', '044003', '044004', '044005', '044022', '044028', '044030', '044033', '044034', '044064', '044068', '044071', '044086', '044088', '044092', '044103', '044106', '044107', '044109', '044112', '044113', '044155', '044156', '044157', '044158', '044203', '044204', '044205', '044207', '044208', '044279', '044299', '044302', '044303', '044304', '044353'],
                MQQBrowser: ['8.1', '8.2', '8.3', '8.4', '8.5', '8.6', '8.7', '8.8', '8.9', '9.9'],
                //QQ: ['6.5.5.2880','6.5.8.2910','6.6.0.2935','6.6.1.2960','6.6.2.2970','6.6.2.2980','6.6.5.3020','6.6.6.3025','6.6.7.3034','6.6.8.3050','6.6.9.3060','6.7.0.3095','6.7.1.3105','7.0.0.3135','7.1.0.3175','7.1.5.3215','7.1.8.3240','7.2.0.3270','7.2.5.3305','7.3.0.3340','7.3.2.3350','7.3.5.3385','7.3.8.3400','7.3.8.3410','7.5.0.3430','7.5.5.3460','7.5.8.3485','7.5.8.3490','7.6.0.3525','7.6.3.3560','7.6.3.3565','7.6.5.3595','7.6.8.3615','7.7.0.3635','7.7.0.3640','7.7.0.3645','7.7.5.3675','7.7.5.3680','7.7.8.3705','7.8.0.3740','8.0.0.3512'],
                UCBrowser: ['10.9.9.739', '11.0.0.818', '11.0.3.845', '11.0.4.842', '11.0.4.846', '11.0.5.841', '11.0.8.855', '11.0.8.858', '11.1.0.870', '11.1.0.882', '11.1.5.871', '11.1.5.890', '11.2.0.880', '11.2.0.915', '11.2.1.888', '11.2.5.884', '11.2.8.885', '11.3.0.907', '11.3.2.960', '11.3.5.908', '11.3.5.972', '11.3.8.909', '11.4.0.921', '11.4.1.939', '11.4.2.936', '11.4.2.995', '11.4.5.1005', '11.4.5.937', '11.4.8.938', '11.4.9.941', '11.5.0.1015', '11.5.0.939', '11.5.1.944', '11.5.2.942', '11.5.4.970', '11.5.5.943', '11.5.6.946', '11.5.8.945', '11.6.0.947', '11.6.1.949', '11.6.2.948', '11.6.4.950', '11.6.6.951', '11.6.7.1025', '11.6.7.9', '11.6.8.952', '11.6.9.1', '11.7.0.953', '11.7.2.954', '11.7.5.955', '11.7.6.956', '11.7.7.957', '11.7.8.958', '11.7.9.959', '11.8.0.960', '11.8.1.961', '11.8.2.962', '11.8.3.963', '11.8.4.964', '11.8.6.966', '11.8.8.1060', '11.8.8.968', '11.8.9.969', '11.9.0.970', '11.9.1.971', '11.9.2.972', '11.9.3.973', '11.9.4.974', '11.9.5.975', '11.9.6.1069', '11.9.6.976', '11.9.7.977', '11.9.8.978', '12.0.0.980', '12.0.2.982', '12.0.3.983', '12.0.4.984', '12.0.5.985', '12.0.6.986', '12.0.8.988', '12.1.0.1085', '12.1.0.990', '12.1.1.991', '12.1.2.992', '12.1.3.993', '12.1.4.994', '12.2.0.1089', '12.2.1.1108', '12.2.5.1102', '12.5.0.1109', '12.8.5.1121', '12.8.8.1140', '12.9.0.1141']
            },
            userAgent: function (osv, model, browserKey) {
                var u = parseInt(Math.random() * 100) < 40 ? 'U; ' : '';
                var version = parseInt(Math.random() * 100) < 60 ? 'Version/4.0 ' : '';

                var chromeArr = this.browser.Chrome;
                var chrome = parseInt(Math.random() * 100) < 75 ? 'Chrome/' + chromeArr[parseInt(Math.random() * chromeArr.length)] + ' ' : '';

                var safari = 'Mobile Safari/537.36';
                var browser = '';
                var browserKeyArr = this.browser.key;
                browserKey = browserKey || parseInt(Math.random() * 100) < 25 ? browserKeyArr[parseInt(Math.random() * browserKeyArr.length)] : '';
                if (browserKey !== '') {
                    var browserArr = this.browser[browserKey];
                    var browserVer = browserArr[parseInt(Math.random() * browserArr.length)];
                    if (browserKey === 'baiduboxapp') {
                        browser = safari + ' T7/' + browserVer.match(/\d*.\d/)[0] + ' baiduboxapp/' + browserVer + ' (Baidu; P1 ' + osv + ')';
                    } else if (browserKey === 'baidubrowser') {
                        browser = safari + ' baidubrowser/' + browserVer + ' (Baidu; P1 ' + osv + ')';
                    } else if (browserKey === 'MicroMessenger') {
                        var mqq = this.browser.MQQBrowser;
                        var tbs = this.browser.TBS;
                        var mqqVer = mqq[parseInt(Math.random() * mqq.length)];
                        var tbsVer = tbs[parseInt(Math.random() * tbs.length)];
                        var netType = parseInt(Math.random() * 100) < 70 ? 'WIFI' : '4G';
                        var language = parseInt(Math.random() * 100) < 90 ? 'zh_CN' : 'en';
                        browser = 'MQQBrowser/' + mqqVer + ' TBS/' + tbsVer + ' ' +
                            safari + ' MicroMessenger/' + browserVer + ' NetType/' + netType + ' Language/' + language;
                    } else {
                        browser = browserKey + '/' + browserVer + ' ' + safari;
                    }
                } else {
                    browser = safari;
                }

                return 'Mozilla/5.0 (Linux; ' + u + 'Android ' + osv + '; ' + model + ')' +
                    ' AppleWebKit/537.36 (KHTML, like Gecko) ' + version + chrome + browser;
            },
            getIMEICheckDigit: function (p) {
                var sum1 = 0;
                var sum2 = 0;
                var temp = 0;
                for (var i = 0; i < 14; i++) {
                    if ((i % 2) !== 0) {
                        temp = (parseInt(p[i])) * 2;
                        if (temp < 10) {
                            sum2 = sum2 + temp
                        } else {
                            sum2 = sum2 + 1 + temp - 10
                        }
                    } else {
                        sum1 = sum1 + parseInt(p[i])
                    }
                }
                var total = sum1 + sum2;
                var Num = 0;
                if ((total % 10) !== 0) {
                    Num = 10 - (total % 10)
                }
                return Num.toString()
            },
            imei: function (p) {
                for (var i = 0; i < 6; i++) {
                    p += Math.floor(Math.random() * 10)
                }
                return p + this.getIMEICheckDigit(p);
            },
            oaid: function uuid() {
                return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                    /** @type {number} */
                    var r = 16 * Math.random() | 0;
                    return ("x" == c ? r : 3 & r | 8).toString(16);
                });
            },
            device: function (brand, name, browserKey) {
                var a = {};

                brand = brand || this.lib.brand[parseInt(Math.random() * this.lib.brand.length)];
                browserKey = browserKey || '';
                var modelArr = this.lib.model[brand];
                var model = modelArr[parseInt(Math.random() * modelArr.length)];
                if (name !== undefined) {
                    for (var mi in modelArr) {
                        if (modelArr[mi][0] === name) {
                            model = modelArr[mi];
                        }
                    }
                }
                var os = 7;
                if (model[2] === 9) {
                    os = 9;
                } else if (model[2] === 8) {
                    os = 8;
                    //os = 8 + parseInt(Math.random() * 2);
                } else {
                    os = model[2] + parseInt(Math.random() * 2);
                }
                a.osv = this.osv[os][parseInt(Math.random() * this.osv[os].length)];

                if (brand !== 'huawei') {
                    if ((brand === 'mi' || brand === 'hongmi') && parseInt(Math.random() * 100) < 30) {
                        var MIUI = {
                            9: '10',
                            8: '10',
                            7: '9',
                            6: '8',
                            5: '8'
                        };
                        model[1] = model[1] + 'MIUI V' + MIUI[os];
                    } else {
                        var bd = this.build[a.osv];
                        model[1] = model[1] + bd[parseInt(Math.random() * bd.length)];
                    }
                }

                a.dev = brand;
                a.md = model[1].split(' Build')[0];

                a.userAgent = this.userAgent(a.osv, model[1], browserKey);
                var imeiArr = model[3].split(',');
                a.imei = this.imei(imeiArr[parseInt(Math.random() * imeiArr.length)]);
                a.rs = model[4];
                var rs = a.rs.split('*');
                a.screenWidth = rs[1];
                a.screenHeight = rs[0];
                a.ppi = model[5];
                a.aid = typeof SuperVar === "undefined" ? deviceModule.getRandom(16) : SuperVar.deviceModule.getRandom(16);
                a.mac = typeof SuperVar === "undefined" ? deviceModule.getMac() : SuperVar.deviceModule.getMac();
                a.oaid = this.oaid();
                a.platform = 'Android';

                return a;
            }
        },
        ios: {
            model: {
                '12.0': ['XS Max|11,4', 'XS Max|11,6', 'XS|12.0'],
                '12.0.1': ['XR|11,8'],
                '11.1': ['X|10,3', 'X|10,6'],
                '11.0': ['8 Plus|10,2', '8 Plus|10,5', '8|10,1', '8|10,4'],
                '10.0.1': ['7 Plus|9,2', '7 Plus|9,4', '7|9,1', '7|9,3'],
                '9.3': ['SE|8,4'],
                '9.0.1': ['6s Plus|8,2', '6s|8,1'],
                '8.0': ['6 Plus|7,1', '6|7,2']
            },
            osv: [
                '12.3.1', '12.3', '12.2', '12.1.4', '12.1.3', '12.1.2', '12.1.1', '12.1', '12.0.1', '12.0',
                '11.4.1', '11.4', '11.3.1', '11.3', '11.2.6', '11.2.5', '11.2.2', '11.2.1', '11.2', '11.1.2', '11.1.1', '11.1',
                '11.0.3', '11.0.2', '11.0.1', '11.0',
                '10.3.3', '10.3.2', '10.3.1', '10.3', '10.2.1', '10.2', '10.1.1', '10.1', '10.0.2', '10.0.1',
                '9.3.5', '9.3.4', '9.3.3', '9.3.2', '9.3.1', '9.3', '9.2.1', '9.2', '9.1', '9.0.2', '9.0.1', '9.0',
                '8.4.1', '8.4', '8.3', '8.2', '8.1.3', '8.1.2', '8.1.1', '8.1', '8.0.2', '8.0'
            ],
            AppleWebKit: ['600.1.17', '600.1.4', '601.1.46', '602.1.50', '602.2.14', '602.3.12', '602.4.2', '602.4.6', '603.1.23', '603.1.30', '603.2.1', '603.2.4', '603.3.8', '604.1.28', '604.1.31', '604.1.38', '604.2.10', '604.3.1', '604.3.3', '604.3.5', '604.4.7', '604.5.2', '604.5.6', '605.1.15'],
            browser: {
                key: ['MQQBrowser', 'UCBrowser'],
                //MicroMessenger: ['6.5.1', '6.5.10', '6.5.11', '6.5.12', '6.5.13', '6.5.14', '6.5.15', '6.5.16', '6.5.17', '6.5.18', '6.5.19', '6.5.2', '6.5.20', '6.5.21', '6.5.22', '6.5.23', '6.5.3', '6.5.4', '6.5.5', '6.5.6', '6.5.7', '6.5.8', '6.5.9', '6.6.0', '6.6.1', '6.6.2', '6.6.3', '6.6.5', '6.6.6', '6.6.7', '6.7.0', '6.7.1', '6.7.2', '6.7.3'],
                Mobile: ['13A342', '13A343', '13A344', '13A404', '13A405', '13A452', '13B143', '13C75', '13D15', '13E233', '13E234', '13E238', '13F69', '13G34', '13G35', '13G36', '14A346', '14A403', '14A456', '14A551', '14B100', '14B150', '14B72', '14B72c', '14C92', '14D10', '14D27', '14E277', '14E304', '14E5239e', '14F5065b', '14F89', '14G60', '15A372', '15A402', '15A403', '15A421', '15A432', '15A5318g', '15A5327g', '15A8391', '15B150', '15B202', '15B5066f', '15B5078e', '15B87', '15B93', '15C114', '15C153', '15C202', '15D100', '15D5046b', '15D60', '15E216', '15E302', '15E5167f', '15E5178f', '15E5189f', '15E5211a', '15F79', '15G77', '16A366', '16A5288q', '16A5308e', '16A5345f', '16A5357b', '16A5362a', '16A5364a', '16A5365b', '16A5366a', '16B5059d'],
                MQQBrowser: ['7.0', '7.0.1', '7.1', '7.1.1', '7.2', '7.2.1', '7.3', '7.4', '7.4.1', '7.5.1', '7.6.0', '7.6.1', '7.7.0', '7.7.1', '7.7.2', '7.8.0', '7.9.0', '8.0.0', '8.0.1', '8.0.2', '8.2.0', '8.2.1', '8.3.0', '8.4.0', '8.4.1', '8.4.2', '8.5.0', '8.5.1', '8.6.1', '8.6.2', '8.6.3', '8.7.0', '8.7.1', '8.8.0', '8.8.1', '8.8.2'],
                Safari: ['600.1.4', '601.1', '602.1', '604.1', '605.1.15', '6531.22.7', '7534.48.3', '7543.48.3', '8536.25', '9537.53'],
                UCBrowser: ['9.3.1.339', '10.0.2.497', '10.0.5.508', '10.1.0.518', '11.5.2.942', '11.6.4.950', '12.5.5.1111'],
                Version: ['8.0', '9.0', '10.0', '11.0', '12.0']
            },
            userAgent: function (osv) {
                osv = osv.replace(/\./g, '_');
                var AppleWebKit = parseInt(Math.random() * 100) > 10 ? ') AppleWebKit/' : '; zh-CN) AppleWebKit/';
                AppleWebKit = AppleWebKit + this.AppleWebKit[parseInt(Math.random() * this.AppleWebKit.length)];

                var browser = '', e = '';
                if (parseInt(Math.random() * 100) < 60) {
                    browser = 'Version/' + this.browser.Version[parseInt(Math.random() * this.browser.Version.length)] + ' ' +
                        'MQQBrowser/' + this.browser.MQQBrowser[parseInt(Math.random() * this.browser.MQQBrowser.length)];
                    if (parseInt(Math.random() * 1000 % 100) < 20) {
                        e = ' MttCustomUA/2 QBWebViewType/1 WKType/1'
                    } else if (parseInt(Math.random() * 1000 % 100) < 30) {
                        e = ' MttCustomUA/2 QBWebViewType/1'
                    } else if (parseInt(Math.random() * 1000 % 100) < 35) {
                        e = ' MttCustomUA/2'
                    }
                } else if (parseInt(Math.random() * 100) < 70) {
                    browser = 'UCBrowser/' + this.browser.UCBrowser[parseInt(Math.random() * this.browser.UCBrowser.length)];
                } else {

                }

                var Mobile = this.browser.Mobile[parseInt(Math.random() * this.browser.Mobile.length)];
                var Safari = this.browser.Safari[parseInt(Math.random() * this.browser.Safari.length)];

                return 'Mozilla/5.0 (iPhone; CPU iPhone OS ' + osv + ' like Mac OS X' + AppleWebKit + '(KHTML, like Gecko) ' +
                    browser + ' Mobile/' + Mobile + ' Safari/' + Safari + e;
            },
            getModel: function (o, name) {
                var model = [];
                var oc = [parseInt(o.join(""))];
                for (var k in this.model) {
                    var s = k.match(/\d\d*/g);
                    var sc = parseInt(s.join(""));
                    if (oc >= sc) {
                        model.push.apply(model, this.model[k]);
                    }
                }
                var md = model[parseInt(Math.random() * model.length)];
                if (name !== undefined) {
                    for (var ni in model) {
                        if (model[ni].indexOf(name + "|") >= 0) {
                            md = model[ni];
                            break;
                        }
                    }
                }
                return md.split('|');
            },
            replace: function () {
                var nativeRandom = Math.random;
                var name = "0000000";
                var tokenCountInDocument = 4294967296;
                var pad = (nativeRandom() * tokenCountInDocument >>> 0).toString(16);
                var s = ((nativeRandom() * tokenCountInDocument & 4294922239 | 16384) >>> 0).toString(16);
                var num = ((nativeRandom() * tokenCountInDocument & 3221225471 | 2147483648) >>> 0).toString(16);
                var h = (nativeRandom() * tokenCountInDocument >>> 0).toString(16);
                return pad.length < 8 && (pad = (name + pad).slice(-8)), s.length < 8 && (s = (name + s).slice(-8)), num.length < 8 && (num = (name + num).slice(-8)), h.length < 8 && (h = (name + h).slice(-8)), [pad, s.slice(0, 4), s.slice(4), num.slice(0, 4), num.slice(4) + h].join("-");
            },
            point: {
                "iPhone XS Max": "414x896",
                "iPhone XS": "375x812",
                "iPhone XR": "414x896",
                "iPhone X": "375x812",
                "iPhone 8 Plus": "414x736",
                "iPhone 8": "375x667",
                "iPhone 7 Plus": "414x736",
                "iPhone 7": "375x667",
                "iPhone SE": "320x568",
                "iPhone 6s Plus": "414x736",
                "iPhone 6s": "375x667",
                "iPhone 6 Plus": "414x736",
                "iPhone 6": "375x667"
            },
            device: function (osv, name) {
                var i = {};
                i.dev = 'Apple';
                i.osv = this.osv[parseInt(Math.random() * this.osv.length)];
                if (osv !== undefined) {
                    for (var oi in this.osv) {
                        if (parseInt(this.osv[oi].split(".").join("")) >= osv) {
                            i.osv = this.osv[oi];
                            break;
                        }
                    }
                }
                var md = this.getModel(i.osv.match(/\d\d*/g), name);
                i.md1 = 'iPhone' + md[1];// 内部
                i.md2 = 'iPhone ' + md[0];// 外部

                if (i.md2 === 'SE') {
                    i.rs = '1136*640';
                    i.ppi = '326';
                } else if (i.md2.indexOf('Plus') >= 0) {
                    i.rs = '1920*1080';
                    i.ppi = '401';
                } else if (i.md2 === 'X') {
                    i.rs = '2436*1125';
                    i.ppi = '458';
                } else if (i.md2 === 'XR') {
                    i.rs = '1792*828';
                    i.ppi = '326';
                } else if (i.md2 === 'XS') {
                    i.rs = '2436*1125';
                    i.ppi = '458';
                } else if (i.md2 === 'XS Max') {
                    i.rs = '2688*1242';
                    i.ppi = '458';
                } else {
                    i.rs = '1334*750';
                    i.ppi = '326'
                }
                var rs = i.rs.split('*');
                i.screenWidth = rs[1];
                i.screenHeight = rs[0];
                i.idfa = this.replace().toUpperCase();
                i.idfv = this.replace().toUpperCase();

                i.userAgent = this.userAgent(i.osv);
                i.mac = typeof SuperVar === "undefined" ? deviceModule.getMac() : SuperVar.deviceModule.getMac();
                i.platform = 'iPhone';
                i.pt = this.point[i.md2];
                i.openudid = typeof SuperVar === "undefined" ? deviceModule.getRandom(40) : SuperVar.deviceModule.getRandom(40);
                i.udid = typeof SuperVar === "undefined" ? deviceModule.getRandom(40) : SuperVar.deviceModule.getRandom(40);
                return i;
            }
        },
        win: {
            AppleWebKit: ['536.10', '536.5', '537.1', '537.11', '537.17', '537.22', '537.31', '537.36', '537.4'],
            browser: {
                Chrome: ['51.0.2704.103', '52.0.2743.116', '55.0.2883.87', '58.0.3029', '58.0.3029.110', '59.0.3071', '60.0.3112', '61.0.3163', '62.0.3202', '63.0.3239', '63.0.3239.132', '64.0.3282', '65.0.3298'],
                Edge: ['14.14393', '16.16299', '17.17134', '18.17763'],
                Firefox: ['56.0', '56.0.1', '56.0.2', '57.0'],
                Gecko: ['20100720', '20110613', '20130328'],
                Safari: ['536.10', '536.5', '537.1', '537.11', '537.17', '537.22', '537.31', '537.36', '537.4']
            },
            userAgent: function (osv) {
                var rnd = parseInt(Math.random() * 100);
                var w = '';
                if (rnd < 30) {
                    w = '; WOW64';
                } else if (rnd < 45) {
                    w = '; Win64; x64';
                }
                var e = '';
                rnd = parseInt(Math.random() * 100);
                if (rnd < 85) {
                    var AppleWebKit = this.AppleWebKit[parseInt(Math.random() * this.AppleWebKit.length)];
                    var Chrome = this.browser.Chrome[parseInt(Math.random() * this.browser.Chrome.length)];
                    var Safari = this.browser.Safari[parseInt(Math.random() * this.browser.Safari.length)];
                    e = ') AppleWebKit/' + AppleWebKit +
                        ' (KHTML, like Gecko) Chrome/' + Chrome + ' Safari/' + Safari;
                    if (rnd < 20) {
                        var Edge = this.browser.Edge[parseInt(Math.random() * this.browser.Edge.length)];
                        e = e + ' Edge/' + Edge;
                    }
                } else if (rnd < 97) {
                    var Gecko = this.browser.Gecko[parseInt(Math.random() * this.browser.Gecko.length)];
                    var Firefox = this.browser.Firefox[parseInt(Math.random() * this.browser.Firefox.length)];
                    e = ') Gecko/' + Gecko + ' Firefox/' + Firefox;
                } else {
                    e = '; Trident/7.0; rv:11.0) like Gecko';
                }
                return 'Mozilla/5.0 (Windows NT ' + osv + w + e;
            },
            device: function (osv) {
                var w = {};
                var rnd = parseInt(Math.random() * 100), NT;
                if (rnd < 3) {
                    NT = '5.1';// xp
                } else if (rnd < 43) {
                    NT = '6.1';// win7
                } else if (rnd < 50) {
                    NT = '6.2';// win8.0
                } else if (rnd < 57) {
                    NT = '6.3';// win8.1
                } else {
                    NT = '10.0';// win10
                }
                osv = osv || NT;
                w.userAgent = this.userAgent(osv);
                w.rs = this.rs[parseInt(Math.random() * this.rs.length)];
                var rs = w.rs.split('*');
                w.screenWidth = rs[0];
                w.screenHeight = rs[1];
                w.mac = typeof SuperVar === "undefined" ? deviceModule.getMac() : SuperVar.deviceModule.getMac();
                w.platform = 'Win32';
                return w;
            },
            rs: [
                //'800*600',
                '1024*768',
                '1152*864',
                '1176*664',
                '1280*720',
                '1280*768',
                '1280*800',
                '1280*960',
                '1280*1024',
                '1360*768',
                '1366*768',
                '1440*900',
                '1600*900',
                '1600*1024',
                '1680*1050',
                '1768*992',
                '1920*1080',
                '1920*1200',
                '2560*1080',
                '2560*1440'
                //'3440*1440',
                //'3840*1080',
                //'3840*2160'
            ]
        },
        mac: {
            AppleWebKit: ['536.10', '536.25', '536.5', '537.1', '537.11', '537.17', '537.22', '537.31', '537.36', '537.4', '601.3.9'],
            osv: ['10_0_0', '10_0_1', '10_0_2', '10_0_3', '10_0_4', '10_1_0', '10_1_1', '10_1_2', '10_1_3', '10_1_4', '10_1_5', '10_2_0', '10_2_1', '10_2_2', '10_2_3', '10_2_4', '10_2_5', '10_2_6', '10_2_7', '10_2_8', '10_3_0', '10_3_1', '10_3_2', '10_3_3', '10_3_4', '10_3_5', '10_3_6', '10_3_7', '10_3_8', '10_3_9', '10_4_0', '10_4_1', '10_4_2', '10_4_3', '10_4_4', '10_4_5', '10_4_6', '10_4_7', '10_4_8', '10_4_9', '10_4_10', '10_4_11', '10_5_1', '10_5_2', '10_5_3', '10_5_4', '10_5_5', '10_5_6', '10_5_7', '10_5_8', '10_6_1', '10_6_2', '10_6_3', '10_6_4', '10_6_5', '10_6_6', '10_6_7', '10_7_1', '10_7_2', '10_7_3', '10_7_4', '10_7_5', '10_8_0', '10_8_1', '10_8_2', '10_8_3', '10_9_0', '10_9_1', '10_9_2', '10_9_3', '10_9_4', '10_10_0', '10_10_1', '10_11_0', '10_11_1', '10_11_2', '10_11_3', '10_11_4', '10_11_5', '10_11_6', '10_12_0', '10_12_1', '10_12_2', '10_12_3', '10_12_4', '10_12_5', '10_12_6', '10_13_0', '10_13_1', '10_13_6', '10_14_5'],
            browser: {
                Chrome: ['58.0.3029', '59.0.3071', '60.0.3112', '61.0.3163', '62.0.3202', '63.0.3239', '64.0.3282', '65.0.3298'],
                Firefox: ['56.0', '56.0.1', '56.0.2', '57.0'],
                Gecko: ['20100720', '20110613', '20130328'],
                Safari: ['536.10', '536.25', '536.5', '537.1', '537.11', '537.17', '537.22', '537.31', '537.36', '537.4', '601.3.9']
            },
            userAgent: function () {
                var U = parseInt(Math.random() * 100) < 90 ? 'U; ' : '';
                var osv = this.osv[parseInt(Math.random() * this.osv.length)];
                var zh = parseInt(Math.random() * 100) < 40 ? '; zh-CN' : '';
                var rnd = parseInt(Math.random() * 100);
                var e = '';
                if (rnd < 85) {
                    var AppleWebKit = this.AppleWebKit[parseInt(Math.random() * this.AppleWebKit.length)];
                    var Chrome = this.browser.Chrome[parseInt(Math.random() * this.browser.Chrome.length)];
                    var Safari = this.browser.Safari[parseInt(Math.random() * this.browser.Safari.length)];
                    e = 'AppleWebKit/' + AppleWebKit + ' (KHTML, like Gecko) Chrome/' + Chrome + ' Safari/' + Safari;
                } else {
                    var Gecko = this.browser.Gecko[parseInt(Math.random() * this.browser.Gecko.length)];
                    var Firefox = this.browser.Firefox[parseInt(Math.random() * this.browser.Firefox.length)];
                    e = 'Gecko/' + Gecko + ' (KHTML, like Gecko) Firefox/' + Firefox;
                }
                var QIHU = parseInt(Math.random() * 100) < 15 ? ' QIHU 360SE' : '';
                return 'Mozilla/5.0 (Macintosh; ' + U + 'Intel Mac OS X ' + osv + zh + ') ' + e + QIHU;
            },
            device: function () {
                var m = {};
                m.userAgent = this.userAgent();
                m.rs = this.rs[parseInt(Math.random() * this.rs.length)];
                var rs = m.rs.split('*');
                m.screenWidth = rs[0];
                m.screenHeight = rs[1];
                m.mac = typeof SuperVar === "undefined" ? deviceModule.getMac() : SuperVar.deviceModule.getMac();
                m.platform = 'MacIntel';
                return m;
            },
            rs: [
                '1024*640',
                '1152*720',
                '1280*800',
                '1366*768',
                '1440*900',
                '1600*900',
                '1680*1050',
                '1920*1080',
                '2560*1400'
            ]
        },
        linux: {
            ua: [
                'Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36',
                'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1',
                'Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16'
            ]
        }
    }
};

/*
 * v2.4_20191101_0946
 */
/*
 * 2019年11月1日 天猫FULFILLED报错,赋值为空,加了oaid.
 * 2019/10/31 send回传timestamp
 * 2019/10/30 修改了onInitialized,为方便对接多广告情况,修改了onPageCreated,提取paramInit,jdInit便于二者调用;ios device内加了udid;增加了getTaskId
 * 2019/10/29 新增Android_oaid函数(android Q 广告ID,具体是否可用待验证),修改了event,重写了Object.assign方法,增加了 imsi
 * 2019/10/23 修改了初始化,增加了IntersectionObserver函数,默认为请求计数,初始化添加了HTMLAudioElement
 * 2019/10/22 到达可控,修改了config
 * 2019/10/21 日常优化
 * 2019/10/18 修改了初始化函数
 * 2019/10/17 修改了deviceModule可以指定设备型号
 * 2019/10/12 添加了Set Map函数 HTMLVideoElement赋空值
 * 2019/10/11 加了沙盒日志打印
 * 2019/9/30 修改了event
 * 2019/9/26 修复了pageopen打开曝光时与包裹型回传所产生的冲突
 * 2019/9/25 更新了device库
 * 2019/9/19 修改了click函数可以自由控制是否去除target
 * 2019/9/18 修改init里读取deviceModule的逻辑
 * 2019/9/17 修复了坐标点击存在不跳转的情况,把device库塞进去了,参考春雨计数规则对请求计数进行了优化,增加了热力图点击
 * 2019/9/16 我也不知道更新了什么,备份下
 * 2019/9/11 更新了dataadmaster的回传规则,兼容了启创的扩展3格式,修改了send,init,
 * 2019/9/10 更新了DC回传规则
 * 2019/9/09 加了PC回传
 * 2019/9/07 修改MAC回传 可明文
 * 2019/9/05 修复了存在两个http时的正则匹配错误
 * 2019/9/04 增加了包裹型回传索引
 * 2019/8/22 修复了多个标签的转换错误,新窗口内加了接收
 * 2019/8/21 getUrls提取admaster时,正则匹配存在问题,更换了提取方式;修复了platform判断的错误
 * 2019/8/20 新增了回传替换确认 replaceCheck(),新窗口内默认进行二跳
 * 2019/8/19 修复了标签内存在:号时的匹配问题
 * 2019/8/17 新增了日期获取函数(针对某些页面的兼容性问题添加了Set Map函数,暂时无用,已注释),新增配置内链接匹配规则
 * 2019/8/16 新增了sha1加密规则,新增了回传规则
 * 2019/8/15 更新了admaster回传
 * 2019/8/8 增加了屏蔽规则
 * 2019/8/2 新增至6跳 修复了标签的兼容问题
 */

exports.SuperVar = SuperVar;