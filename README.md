# ob混淆还原工具

| Author  | 丁仔 |
| :-----: | :---: |
| Email | 1123279813@qq.com |
| 微信公众号 | 逆向新手 |
| Introduce | Python、爬虫、JS逆向 |

## 使用说明

### 一、ob混淆网站

https://obfuscator.io/  
ob混淆特征：
```javascript
// 开头一个大数组
var _0xa441 = ['\x49\x63\x4b\x72\x77\x70\x2f\x44\x6c\x67\x3d\x3d', ···]
// 自执行函数对数组进行位移
(function (_0x56a234, _0xa44115) {
    var _0x532345 = function (_0x549d7c) {
        while (--_0x549d7c) {
            _0x56a234['push'](_0x56a234['shift']());
        }
    };
    _0x532345(++_0xa44115);
}(_0xa441, 0x1d0));
// 解密函数
var _0x5323 = function (_0x56a234, _0xa44115) {
    // 里面有段自执行函数生成atob函数
    ······
}
// 下方多处调用解密函数，如
var _0x239123 = _0x5323('\x30\x78\x32\x30', '\x70\x59\x48\x73');
```

### 二、依赖

1. npm install @babel/core -g  
如果安装了依然报以下错误：
```javascript
Error: Cannot find module '@babel/parser'
```
Windows系统请在系统环境变量中添加如下后重启编辑器或电脑，npm\node_modules路径前面根据自己的相应修改：  
其它系统请自行搜索更改  
```javascript
变量名: NODE_PATH
变量值1：C:\Users\Administrator\AppData\Roaming\npm\node_modules
变量值2：C:\Users\Administrator\AppData\Roaming\npm\node_modules\@babel\core\node_modules
```

### 三、文件说明

1. config.js：配置选项文件
2. ob-decrypt.js：主要运行代码
3. source.js：示例代码(还原前)
4. code.js：示例代码(还原后)
5. introduction.md：[各功能说明文档](https://github.com/DingZaiHub/ob-decrypt/blob/master/introduction.md)

### 四、使用

1. 将要还原的、**未格式化前**的ob混淆代码复制到本地
2. 修改config.js配置选项
3. 执行ob-decrypt.js即可
4. 如果有报错，可能暂不适配，等待更新。或将配置选项设置为仅还原解密函数。或可联系本人
5. 本工具同样可以解非ob混淆代码。将step1、step2去掉后，按需使用代码下方的traverse即可。

### 五、其它

1. 默认输出缩进格式从2个空格调整为4个空格  
打开 npm\node_modules\\@babel\core\node_modules\\@babel\generator\lib\index.js 文件  
将其中的indent修改如下：
```javascript
indent: {
    adjustMultilineComment: true,
    style: "    ",
    base: 0
}
```
2. 常量计算添加计算parseInt类型  
打开 npm\node_modules\\@babel\core\node_modules\\@babel\traverse\lib\path\evaluation.js 文件  
将其中的VALID_CALLEES修改如下：
```javascript
const VALID_CALLEES = ["String", "Number", "Math","parseInt"];
```


### 六、参考

1. 夜幕论坛AST两部曲  
AST一部曲：https://bbs.nightteam.cn/thread-417.htm  
AST二部曲：https://bbs.nightteam.cn/thread-423.htm  

2. “菜鸟学Python编程” 公众号AST系列

3. “AST入门与实战” 知识星球

### 七、赞赏

如果觉得本工具对你有用，谢谢赞赏~

![](https://imgkr.cn-bj.ufileos.com/bf55aae1-f12b-4a63-9b57-94eaf2ff9798.png)
