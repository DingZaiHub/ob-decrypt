# 还原工具各功能说明文档
- [还原工具各功能说明文档](#还原工具各功能说明文档)
    - [1. 将拆分的对象重新合并](#1-将拆分的对象重新合并)
    - [2. 对象替换](#2-对象替换)
    - [3. 自执行实参替换形参](#3-自执行实参替换形参)
    - [4. 反控制流平坦化](#4-反控制流平坦化)
    - [5. 赋值语句的三元表达式类型转换](#5-赋值语句的三元表达式类型转换)
    - [6. 三元表达式转if-else](#6-三元表达式转if-else)
    - [7. var定义的三元表达式转if-else](#7-var定义的三元表达式转if-else)
    - [8. 去除逗号表达式](#8-去除逗号表达式)
    - [9. 去除var定义的逗号表达式](#9-去除var定义的逗号表达式)
    - [10. 常量计算](#10-常量计算)
    - [11. 修改调用方式](#11-修改调用方式)
    - [12. 替换空参数的自执行函数为顺序语句](#12-替换空参数的自执行函数为顺序语句)

### 1. 将拆分的对象重新合并
```javascript
traverse(ast, {VariableDeclarator: {exit: [merge_obj]},});
```
还原前：
```javascript
var _0xb28de8 = {};
_0xb28de8["abcd"] = function(_0x22293f, _0x5a165e) {
    return _0x22293f == _0x5a165e;
};
_0xb28de8.dbca = function(_0xfbac1e, _0x23462f, _0x556555) {
    return _0xfbac1e(_0x23462f, _0x556555);
};
_0xb28de8.aaa = function(_0x57e640) {
    return _0x57e640();
};
_0xb28de8["bbb"] = "eee";
var _0x15e145 = _0xb28de8;
```
还原后：
```javascript
var _0xb28de8 = {
    "abcd": function(_0x22293f, _0x5a165e) {
        return _0x22293f == _0x5a165e;
    },
    "dbca": function(_0xfbac1e, _0x23462f, _0x556555) {
        return _0xfbac1e(_0x23462f, _0x556555);
    },
    "aaa": function(_0x57e640) {
        return _0x57e640();
    },
    "bbb": "eee"
};
```
### 2. 对象替换
```javascript
traverse(ast, {VariableDeclarator: {exit: [callToStr]},});
```
还原前：
```javascript
var _0xb28de8 = {
    "abcd": function(_0x22293f, _0x5a165e) {
        return _0x22293f == _0x5a165e;
    },
    "dbca": function(_0xfbac1e, _0x23462f, _0x556555) {
        return _0xfbac1e(_0x23462f, _0x556555);
    },
    "aaa": function(_0x57e640) {
        return _0x57e640();
    },
    "bbb": "eee"
};
var aa = _0xb28de8("abcd")(123, 456);
var bb = _0xb28de8("dbca")(bcd, 11, 22);
var cc = _0xb28de8("aaa")(dcb);
var dd = _0xb28de8("bbb");
```
还原后:
```javascript
var aa = 123 == 456;
var bb = bcd(11, 22);
var cc = dcb();
var dd = "eee";
```
### 3. 自执行实参替换形参
```javascript
traverse(ast, {ExpressionStatement: convParam,});
```
还原前：
```javascript
(function(_0xb28de8) {
    _0xb28de8.bbb = ccc;
}(window))
```
还原后:
```javascript
(function() {
    window.bbb = ccc;
}())
```
### 4. 反控制流平坦化
```javascript
traverse(ast, {WhileStatement: {exit: [replaceWhile]},});
```
还原前：
```javascript
var _0xb28de8 = "3|1|2".spilt("|"),
    _0x8de8b2 = 0;
while(true) {
    switch(_0xb28de8[_0x8de8b2++]) {
        case '1':
            var a = 1;
            continue;
        case '2':
            var b = 3;
            continue;
        case '3':
            var c = 0;
            continue;
    }
    break;
}
```
还原后:
```javascript
var c = 0;
var a = 1;
var b = 3;
```
### 5. 赋值语句的三元表达式类型转换
```javascript
traverse(ast, {ConditionalExpression: trans_condition,});
```
还原前：
```javascript
a = m ? 11 : 22;
```
还原后:
```javascript
m ? a = 11 : a = 22;
```
### 6. 三元表达式转if-else
```javascript
traverse(ast, {ExpressionStatement: ConditionToIf,});
```
还原前：
```javascript
m ? a = 11 : a = 22;
```
还原后:
```javascript
if (m) {
    a = 11;
} else {
    a = 22;
}
```
### 7. var定义的三元表达式转if-else
```javascript
traverse(ast, {VariableDeclarator: conditionVarToIf,});
```
还原前：
```javascript
var a = m ? 11 : 22;
```
还原后:
```javascript
if (m) {
    var a = 11;
} else {
    var a = 22;
}
```
### 8. 去除逗号表达式
```javascript
traverse(ast, {ExpressionStatement: remove_comma,});
```
还原前：
```javascript
a = 1, b = ddd(), c = null;
```
还原后:
```javascript
a = 1;
b = ddd();
c = null;
```
### 9. 去除var定义的逗号表达式
```javascript
traverse(ast, {VariableDeclaration: remove_var_comma,});
```
还原前：
```javascript
var a = 1, b = ddd(), c = null;
```
还原后:
```javascript
var a = 1;
var b = ddd();
var c = null;
```
### 10. 常量计算
慎用！可能涉及作用域的问题，或其它逻辑错误。
```javascript
traverse(ast, {
    "UnaryExpression|BinaryExpression|ConditionalExpression|CallExpression": eval_constant,
});
```
还原前：
```javascript
var a = !![];
var b = "abc" == "bcd";
var c = 1 << 3 | 2;
var d = parseInt("5" + "0")
```
还原后:
```javascript
var a = true;
var b = false;
var c = 10;
var d = 50;
```
### 11. 修改调用方式
慎用！aa['\]']\['v'\]()转成aa.].v()后代码会出错。
```javascript
traverse(ast, {MemberExpression: formatMember,});
```
还原前：
```javascript
var a = aa['bb']['v']();
```
还原后:
```javascript
var a = aa.bb.v();
```
### 12. 替换空参数的自执行函数为顺序语句
慎用！可能涉及到作用域的问题。
```javascript
traverse(ast, {ExpressionStatement: delConvParam,});
```
还原前：
```javascript
(function() {
    b = 123;
    c = 456;
}())
```
还原后:
```javascript
b = 123;
c = 456;
```
