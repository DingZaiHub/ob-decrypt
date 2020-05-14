# ob混淆还原工具

## 使用说明
### 依赖
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
