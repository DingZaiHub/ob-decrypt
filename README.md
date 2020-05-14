# ob混淆还原工具

| Author  | 丁仔 |
| :-----: | :---: |
| Email | 1123279813@qq.com |
| 微信公众号 | 逆向新手 |
| Introduce | Python、爬虫、JS逆向 |

## 使用说明

### 一、ob混淆网站

https://obfuscator.io/

### 二、依赖

1. npm install @babel/core -g  
如果安装了依然报以下错误：
```javascript
Error: Cannot find module '@babel/parser'
```
请在系统环境变量中添加如下，npm\node_modules路径前面根据自己的相应修改：  
```javascript
变量名: NODE_PATH
变量值1：C:\Users\Administrator\AppData\Roaming\npm\node_modules
变量值2：C:\Users\Administrator\AppData\Roaming\npm\node_modules\@babel\core\node_modules
```

### 三、使用

1. 修改config.js配置选项
2. 执行ob-decrypt.js即可
3. 如果有报错，可能暂不适配，等待更新，或可联系本人

### 四、其它

1. 默认输出缩进格式从2个空格调整为4个空格  
打开 npm\node_modules\@babel\core\node_modules\@babel\generator\lib\index.js 文件  
将其中的indent修改如下：
```javascript
indent: {
    adjustMultilineComment: true,
    style: "    ",
    base: 0
}
```

### 五、参考

1. 夜幕论坛AST两部曲  
AST一部曲：https://bbs.nightteam.cn/thread-417.htm  
AST二部曲：https://bbs.nightteam.cn/thread-423.htm  

2. “菜鸟学Python编程” 公众号AST系列
