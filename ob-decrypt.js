const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;
const fs = require('fs');
const config = require('./config').config





// 提取解密函数及解密函数名，返回去掉前3个节点的ast对象
var ast = step1(config.file2decrypt)
// 调用解密函数，返回解密后的ast对象
ast = step2(ast)
if (!config.only_decrypt) {
    // 如果仅还原解密函数为false
    // 对象替换、自执行实参替换形参，返回替换后的ast对象
    ast = step3(ast)
    // 修改调用方式、十六进制文本还原、反控制流平坦化，写入还原后的代码
    step4(ast, config.file2generat, config.compact)
}


function step1(file) {
    // 提取解密函数及解密函数名，返回去掉前3个节点的ast对象
    var jscode = fs.readFileSync(file, {
        encoding: "utf-8"
    });
    // 将源代码解析成ast对象，可直接理解成JS的对象来操作
    var ast = parser.parse(jscode);
    // 提取program.body下前3个节点，即提取出解密代码
    var decrypt_code = ast.program.body.slice(0, 3)
    // 剩下的节点
    var rest_code = ast.program.body.slice(3)
    // 将前3个节点替换进ast
    ast.program.body = decrypt_code
    var {code} = generator(ast, {
        // 禁止自动格式化(针对反调试)
        compact: true
    })
    // 利用eval将前3个节点的代码导入到环境中
    eval(code)
    // 解密函数名(str)
    decryptStr = decrypt_code[2].declarations[0].id.name
    // 解密函数(func)
    decryptFunc = eval(decryptStr)
    // 将剩下的节点替换进ast供后面还原
    ast.program.body = rest_code
    return ast
}
function step2(ast) {
    // 调用解密函数，返回解密后的ast对象
    console.log("还原解密函数中...")
    traverse(ast, {
        // 遍历ast的CallExpression类型，执行funToStr函数
        CallExpression: funToStr
    })
    if (config.only_decrypt) {
        // 仅还原解密函数
        var { code } = generator(ast, {
            // 是否格式化
            compact: config.compact,
            jsescOption: {
                // 自动转义
                minimal: true,
            }
        });
        fs.writeFileSync(config.file2generat, code, {
            encoding: "utf-8"
        })
        console.log("还原完成！")
    } else {
        return ast
    }
    function funToStr(path) {
        var node = path.node;
        // 判断节点类型及函数名，不是则返回
        if (!t.isIdentifier(node.callee, {name: decryptStr})) 
            return;
        // 取调用解密函数的实参值
        if (node.arguments.length === 2) {
            // 如果有两个实参
            var first_arg  = node.arguments[0].value;
            var second_arg = node.arguments[1].value;
            // 调用本地的解密函数
            var value = decryptFunc(first_arg, second_arg);
            // 打印看结果
            if (config.debug) {
                console.log("还原前:" + node.callee.name + '("' + first_arg + '", "' + second_arg + '")', "还原后:" + value);
            }
            // 替换节点，因为计算出来的都是字符串，因此不用做判断
            path.replaceWith(t.StringLiteral(value));
        }
        if (node.arguments.length === 1) {
            // 如果只有一个实参
            var first_arg  = node.arguments[0].value;
            //调用本地的解密函数
            var value = decryptFunc(first_arg);
            //打印看结果
            if (config.debug) {
                console.log("还原前:" + node.callee.name + '("' + first_arg + '")', "还原后:" + value);
            }
            //替换节点，因为计算出来的都是字符串，因此不用做判断
            path.replaceWith(t.StringLiteral(value));
        }
    }
}
function step3(ast) {
    // 对象替换、自执行实参替换形参，返回替换后的ast对象
    traverse(ast, {
        VariableDeclarator: callToStr,
        ExpressionStatement: convParam
    })
    return ast
    function callToStr(path) {
        // TODO BOSS直聘的未适配
        // 将对象进行替换
        var node = path.node;
    
        if (!t.isObjectExpression(node.init))
            return;
    
        var objPropertiesList = node.init.properties;
    
        if (objPropertiesList.length==0)
            return;
    
        var objName = node.id.name;
    
        objPropertiesList.forEach(prop => {
            var key = prop.key.value;
            if(!t.isStringLiteral(prop.value))
            {
                var retStmt = prop.value.body.body[0];
    
                // 该path的最近父节点
                var fnPath = path.getFunctionParent();
                fnPath.traverse({
                    CallExpression: function (_path) {
                        if (!t.isMemberExpression(_path.node.callee))
                            return;
    
                        var _node = _path.node.callee;
                        if (!t.isIdentifier(_node.object) || _node.object.name !== objName)
                            return;
                        if (!t.isStringLiteral(_node.property) || _node.property.value != key)
                            return;
    
                        var args = _path.node.arguments;
    
                        // 二元运算
                        if (t.isBinaryExpression(retStmt.argument) && args.length===2)
                        {
                            _path.replaceWith(t.binaryExpression(retStmt.argument.operator, args[0], args[1]));
                        }
                        // 逻辑运算
                        else if(t.isLogicalExpression(retStmt.argument) && args.length==2)
                        {
                            _path.replaceWith(t.logicalExpression(retStmt.argument.operator, args[0], args[1]));
                        }
                        // 函数调用
                        else if(t.isCallExpression(retStmt.argument) && t.isIdentifier(retStmt.argument.callee))
                        {
                            _path.replaceWith(t.callExpression(args[0], args.slice(1)))
                        }
                    }
                })
            }
            else{
                var retStmt = prop.value.value;
    
                // 该path的最近父节点
                var fnPath = path.getFunctionParent();
                fnPath.traverse({
                    MemberExpression:function (_path) {
                        var _node = _path.node;
                        if (!t.isIdentifier(_node.object) || _node.object.name !== objName)
                            return;
                        if (!t.isStringLiteral(_node.property) || _node.property.value != key)
                            return;
    
                        _path.replaceWith(t.stringLiteral(retStmt))
                    }
                })
    
            }
    
        });
    
        path.remove();
    }
    function convParam(path) {
        // 自执行函数实参替换形参
        var node = path.node;
    
        if (!t.isCallExpression(node.expression))
            return;
    
        if (node.expression.arguments == undefined || node.expression.callee.params == undefined || node.expression.arguments.length > node.expression.callee.params.length)
            return;
    
        var argumentList = node.expression.arguments;
        var paramList = node.expression.callee.params;
        for (var i = 0; i<argumentList.length; i++)
        {
            var argumentName = argumentList[i].name;
            var paramName = paramList[i].name;
    
            path.traverse({
                MemberExpression:function (_path) {
                    var _node = _path.node;
                    if (!t.isIdentifier(_node.object) || _node.object.name !== paramName)
                        return;
    
                    _node.object.name = argumentName;
                }
            });
        }
        node.expression.arguments = [];
        node.expression.callee.params = [];
    }
}
function step4(ast, file2generat, compact) {
    // 修改调用方式、十六进制文本还原、反控制流平坦化，写入还原后的代码
    traverse(ast, {
        MemberExpression: formatMember,
        WhileStatement: replaceWhile,
        StringLiteral: delExtra,
        NumericLiteral: delExtra,
        // ExpressionStatement: delConvParam
    });
    var { code } = generator(ast, {
        // 是否格式化
        compact: compact,
        jsescOption: {
            // 自动转义
            minimal: true,
        }
    });
    fs.writeFileSync(file2generat, code, {
        encoding: "utf-8"
    })
    console.log("还原完成！")
    function formatMember(path) {
        // 将_0x19882c['removeCookie']['toString']()改成_0x19882c.removeCookie.toString()
        var curNode = path.node;
        if(!t.isStringLiteral(curNode.property))
            return;
        if(curNode.computed === undefined || !curNode.computed === true)
            return;
        curNode.property = t.identifier(curNode.property.value);
        curNode.computed = false;
    }
    function delExtra(path) {     
        // 十六进制文本还原
        delete path.node.extra; 
    }
    function replaceWhile(path) {
        // TODO BOSS直聘的未适配
        // 反控制流平坦化    
        var node = path.node;   
        // 判断是否是目标节点   
        if (!(t.isBooleanLiteral(node.test) || t.isUnaryExpression(node.test)))  
            // 如果while中不为true或!![]
            return;    
        if (!(node.test.prefix || node.test.value))
            // 如果while中的值不为true
            return;
        if (!t.isBlockStatement(node.body))         
            return;               
        var body = node.body.body;     
        if (!t.isSwitchStatement(body[0]) || !t.isMemberExpression(body[0].discriminant) || !t.isBreakStatement(body[1]))         
            return;           
        var swithStm = body[0];     
        var arrName = swithStm.discriminant.object.name;          
        // 找到path节点的前一个兄弟节点，即_0x289a30所在的节点，然后获取_0x289a30数组   
        // console.log(path.key)  
        var prevSiblingPath = path.getSibling(0);   
        // console.log(prevSiblingPath.toString())
        var arrNode = prevSiblingPath.node.declarations.filter(declarator => declarator.id.name == arrName)[0];  
        // console.log(arrNode) 
        var idxArr = arrNode.init.callee.object.value.split('|');        
        // SwitchCase节点集合     
        var caseList = swithStm.cases;     
        var resultBody = [];           
        idxArr.map(targetIdx => {     
            var targetBody = caseList[targetIdx].consequent;     
            // 删除ContinueStatement块(continue语句)     
            if (t.isContinueStatement(targetBody[targetBody.length - 1]))         
                targetBody.pop();     
            resultBody = resultBody.concat(targetBody)     
        });
        // 多个节点替换一个节点的话使用replaceWithMultiple方法
        path.replaceWithMultiple(resultBody);
        // 删除_0x289a30所在的节点
        if (path.key == 1) {
            prevSiblingPath.remove();
        } else {
            prevSiblingPath.remove();
            var other_prevSiblingPath = path.getPrevSibling();
            other_prevSiblingPath.remove()
        }
    }
    function delConvParam(path) {   
        // 替换空参数的自执行方法为顺序语句   
        let node = path.node;         
        // 判断条件是否符合         
        if (!t.isCallExpression(node.expression))             
            return;         
        if (node.expression.arguments !== undefined && node.expression.arguments.length > 0)             
            return;         
        if (!t.isFunctionExpression(node.expression.callee))             
            return;         
            // 替换节点         
        path.replaceWith(node.expression.callee.body);     
    }
}

