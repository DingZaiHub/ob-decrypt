// atob函数，后面可能会判断其是否存在，勿删！
!(function () {
    var _0x421970 = function () {
        var _0x156f0f;
        try {
            _0x156f0f = Function("return (function() " + "{}.constructor(\"return this\")( )" + ");")();
        } catch (_0x3da786) {
            _0x156f0f = window;
        }
        return _0x156f0f;
    };
    var _0x2fdc10 = _0x421970();
    var _0x5b0441 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    _0x2fdc10.atob || (_0x2fdc10.atob = function (_0x32e3d3) {
        var _0x37f0d8 = String(_0x32e3d3).replace(/=+$/, "");
        var _0x1dc53f = "";
        for (var _0x3cf0be = 0x0, _0x42233f, _0x11d839, _0x1a56d1 = 0x0; _0x11d839 = _0x37f0d8.charAt(_0x1a56d1++); ~_0x11d839 && (_0x42233f = _0x3cf0be % 0x4 ? _0x42233f * 0x40 + _0x11d839 : _0x11d839, _0x3cf0be++ % 0x4) ? _0x1dc53f += String.fromCharCode(0xff & _0x42233f >> (-0x2 * _0x3cf0be & 0x6)) : 0x0) {
            _0x11d839 = _0x5b0441.indexOf(_0x11d839);
        }
        return _0x1dc53f;
    });
})();
function hi() {
    var _0x55e58f = function () {
        var _0x5d69d2 = true;
        return function (_0x309259, _0x4ce86b) {
            if (_0x5d69d2) {
                var _0x46e4b5 = function () {
                    if (_0x4ce86b) {
                        var _0x20e226 = _0x4ce86b.apply(_0x309259, arguments);
                        _0x4ce86b = null;
                        return _0x20e226;
                    }
                };
            } else {
                var _0x46e4b5 = function () {};
            }
            _0x5d69d2 = false;
            return _0x46e4b5;
        };
    }();
    (function () {
        _0x55e58f(this, function () {
            var _0x413f97 = new RegExp("function *\\( *\\)");
            var _0x1596f6 = new RegExp("\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)", "i");
            var _0x4a5908 = oOADE("init");
            if (!_0x413f97.test(_0x4a5908 + "chain") || !_0x1596f6.test(_0x4a5908 + "input")) {
                _0x4a5908("0");
            } else {
                oOADE();
            }
        })();
    })();
    var _0x2cba31 = function () {
        var _0x105a32 = true;
        return function (_0xc1eb21, _0x59ff7c) {
            if (_0x105a32) {
                var _0x3ff6e2 = function () {
                    if (_0x59ff7c) {
                        var _0x4e0551 = _0x59ff7c.apply(_0xc1eb21, arguments);
                        _0x59ff7c = null;
                        return _0x4e0551;
                    }
                };
            } else {
                var _0x3ff6e2 = function () {};
            }
            _0x105a32 = false;
            return _0x3ff6e2;
        };
    }();
    var _0x4f7790 = _0x2cba31(this, function () {
        var _0x4a204c = function () {};
        var _0x20e852 = function () {
            var _0x3fed8b;
            try {
                _0x3fed8b = Function("return (function() {}.constructor(\"return this\")( ));")();
            } catch (_0x493e48) {
                _0x3fed8b = window;
            }
            return _0x3fed8b;
        };
        var _0x1c3dec = _0x20e852();
        if (!_0x1c3dec.console) {
            _0x1c3dec.console = function (_0x4455af) {
                var _0x239123 = {
                    "log": _0x4455af,
                    "warn": _0x4455af,
                    "debug": _0x4455af,
                    "info": _0x4455af,
                    "error": _0x4455af,
                    "exception": _0x4455af,
                    "table": _0x4455af,
                    "trace": _0x4455af
                };
                return _0x239123;
            }(_0x4a204c);
        } else {
            _0x1c3dec.console.log = _0x4a204c;
            _0x1c3dec.console.warn = _0x4a204c;
            _0x1c3dec.console.debug = _0x4a204c;
            _0x1c3dec.console.info = _0x4a204c;
            _0x1c3dec.console.error = _0x4a204c;
            _0x1c3dec.console.exception = _0x4a204c;
            _0x1c3dec.console.table = _0x4a204c;
            _0x1c3dec.console.trace = _0x4a204c;
        }
    });
    _0x4f7790();
    console.log("Hello World!");
}
hi();
setInterval(function () {
    oOADE();
}, 4000);
function oOADE(_0x47fbbc) {
    function _0xa7e155(_0x5859f0) {
        if (typeof _0x5859f0 === "string") {
            return function (_0x139440) {}.constructor("while (true) {}").apply("counter");
        } else {
            if (("" + _0x5859f0 / _0x5859f0).length !== 1 || _0x5859f0 % 20 === 0) {
                (function () {
                    return true;
                }).constructor("debugger").call("action");
            } else {
                (function () {
                    return false;
                }).constructor("debugger").apply("stateObject");
            }
        }
        _0xa7e155(++_0x5859f0);
    }
    try {
        if (_0x47fbbc) {
            return _0xa7e155;
        } else {
            _0xa7e155(0);
        }
    } catch (_0x4ea382) {}
}
