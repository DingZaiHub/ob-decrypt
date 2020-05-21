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
Windows系统请在系统环境变量中添加如下后重启编辑器，npm\node_modules路径前面根据自己的相应修改：  
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

### 四、使用

1. 将要还原的、**未格式化前**的ob混淆代码复制到本地(一个大数组开头的)
2. 修改config.js配置选项
3. 执行ob-decrypt.js即可
4. 如果有报错，可能暂不适配，等待更新。或将配置选项设置为仅还原解密函数。或可联系本人

### 五、其它

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

### 六、参考

1. 夜幕论坛AST两部曲  
AST一部曲：https://bbs.nightteam.cn/thread-417.htm  
AST二部曲：https://bbs.nightteam.cn/thread-423.htm  

2. “菜鸟学Python编程” 公众号AST系列
