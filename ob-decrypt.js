const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;
const fs = require('fs');
const config = require('./config').config





// 提取解密函数及解密函数名，返回去掉前3个节点的ast对象
var ast = step1(config.file2decrypt)
// 调用解密函数、十六进制文本还原，返回解密后的ast对象
ast = step2(ast)
if (!config.only_decrypt) {
    // 如果仅还原解密函数为false
    // 将拆分的对象重新合并、对象替换、自执行实参替换形参，返回替换后的ast对象
    ast = step3(ast)
    // 反控制流平坦化、修改调用方式，写入还原后的代码
    step4(ast, config.file2generat, config.compact)
}


function step1(file) {
    // 提取前3个节点的源代码及单独提取出atob函数，返回去掉前3个节点后的ast对象
    var jscode = fs.readFileSync(file, {
        encoding: "utf-8"
    });
    // 将源代码解析成ast对象，可直接理解成JS的对象来操作
    var ast = parser.parse(jscode);
    // 提取program.body下前3个节点，即提取出解密代码
    var decrypt_code = ast.program.body.slice(0, 3)
    // 剩下的节点
    var rest_code = ast.program.body.slice(3)
    
    // 提取atob函数
    var flag = true
    const visitor = {
        // 提取出atob代码，后面可能会做判断
        "ExpressionStatement"(path) {
            path.traverse({
                "StringLiteral"(_path) {
                    delete _path.node.extra
                }
            })
            var code = path.toString()
            if (flag && code.indexOf("atob") != -1) {
                atob_node = path.node
                flag = false
            }
        }
    }
    traverse(ast, visitor)
    ast.program.body = [atob_node]
    var {code} = generator(ast, {
        jsescOption: {
            // 自动转义
            minimal: true,
        }
    })
    const comment = "// atob函数，下方可能会判断其是否存在"
    atob_code = comment + "\n!" + code + "\n"

    // 将前3个节点替换进ast
    ast.program.body = decrypt_code
    var {code} = generator(ast, {
        // 禁止自动格式化(针对反调试)
        compact: true
    })
    // 将前3个节点的源代码赋值到全局变量中，供第二步使用
    global_code = code
    // 解密函数名(str)，供第二步使用
    decryptStr = decrypt_code[2].declarations[0].id.name
    // 将剩下的节点替换进ast供后面还原
    ast.program.body = rest_code
    return ast
}
function step2(ast) {
    // 调用解密函数、十六进制文本还原
    // 返回解密后的ast对象或写入还原后的代码
    console.log("还原解密函数中...")
    // 利用eval将前3个节点的代码导入到环境中
    eval(global_code)
    traverse(ast, {
        CallExpression: funToStr,
        StringLiteral: delExtra,
        NumericLiteral: delExtra,
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
        code = (atob_code + code).replace(/\n\n/g, "\n")
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
        // 调用解密函数
        let value = eval(path.toString())
        if (config.debug) {
            // 是否打印
            console.log("还原前：" + path.toString(), "还原后：" + value);
        }
        path.replaceWith(t.valueToNode(value));
    }
    function delExtra(path) {     
        // 十六进制文本还原
        delete path.node.extra; 
    }
}
function step3(ast) {
    // 去除逗号表达式、将拆分的对象重新合并、对象替换、自执行实参替换形参，返回替换后的ast对象
    traverse(ast, {
        ExpressionStatement: remove_commma,
        VariableDeclarator: {
            exit: [merge_obj]
        },
    });
    traverse(ast, {
        VariableDeclarator: {
            exit: [callToStr]
        },
        ExpressionStatement: convParam,
    });
    return ast
    function remove_commma(path) {
        // 去除逗号表达式
        let {expression} = path.node
        if (!t.isSequenceExpression(expression))
            return;
        let body = []
        expression.expressions.forEach(
            express => {
                body.push(t.expressionStatement(express))
            }
        )
        path.replaceInline(body)
    }
    function merge_obj(path) {
        // 将拆分的对象重新合并
        const {id, init} = path.node;
        if (!t.isObjectExpression(init))
            return;

        let name = id.name;
        let properties = init.properties;

        let scope = path.scope;
        let binding = scope.getBinding(name);
        if (!binding || binding.constantViolations.length > 0) {
            return;
        }
        let paths = binding.referencePaths;
        paths.map(function(refer_path) {
            let bindpath = refer_path.parentPath; 
            if (!t.isVariableDeclarator(bindpath.node)) return;
            let bindname = bindpath.node.id.name;
            bindpath.scope.rename(bindname, name, bindpath.scope.block);
            bindpath.remove();
        });
        scope.traverse(scope.block, {
            AssignmentExpression: function(_path) {
                const left = _path.get("left");
                const right = _path.get("right");
                if (!left.isMemberExpression())
                    return;
                const object = left.get("object");
                const property = left.get("property");
                if (object.isIdentifier({name: name}) && property.isStringLiteral() && _path.scope == scope) {
                    properties.push(t.ObjectProperty(t.valueToNode(property.node.value), right.node));
                    _path.remove();
                }
                if (object.isIdentifier({name: name}) && property.isIdentifier() && _path.scope == scope) {
                    properties.push(t.ObjectProperty(t.valueToNode(property.node.name), right.node));
                    _path.remove();
                }
            }
        })
    }
    function callToStr(path) {
        // 将对象进行替换
        var node = path.node;
    
        if (!t.isObjectExpression(node.init))
            return;
    
        // 获取对象内所有属性
        var objPropertiesList = node.init.properties;
    
        if (objPropertiesList.length==0)
            return;

        // 对象名
        var objName = node.id.name;
        // 是否可删除该对象：发生替换时可删除，否则不删除
        var del_flag = false
        objPropertiesList.forEach(prop => {
            var key = prop.key.value;
            if(t.isFunctionExpression(prop.value))
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
                        if (!(t.isStringLiteral(_node.property) || t.isIdentifier(_node.property)))
                            return;
                        if (!(_node.property.value == key || _node.property.name == key))
                            return;
                        // if (!t.isStringLiteral(_node.property) || _node.property.value != key)
                        //     return;
    
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
                        del_flag = true;
                    }
                })
            }
            else if (t.isStringLiteral(prop.value)){
                var retStmt = prop.value.value;
    
                // 该path的最近父节点
                var fnPath = path.getFunctionParent();
                fnPath.traverse({
                    MemberExpression:function (_path) {
                        var _node = _path.node;
                        if (!t.isIdentifier(_node.object) || _node.object.name !== objName)
                            return;
                        if (!(t.isStringLiteral(_node.property) || t.isIdentifier(_node.property)))
                            return;
                        if (!(_node.property.value == key || _node.property.name == key))
                            return;
                        // if (!t.isStringLiteral(_node.property) || _node.property.value != key)
                        //     return;
    
                        _path.replaceWith(t.stringLiteral(retStmt))
                        del_flag = true;
                    }
                })
            }
        });
        if (del_flag) {
            // 如果发生替换，则删除该对象
            path.remove();
        } 
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
    // 反控制流平坦化、修改调用方式，写入还原后的代码
    traverse(ast, {
        WhileStatement: {
            exit: [replaceWhile]
        },
        MemberExpression: formatMember,
        // ExpressionStatement: delConvParam
    });
    const visitor = {
        // 常量计算
        "UnaryExpression|BinaryExpression|ConditionalExpression|SequenceExpression|LogicalExpression|CallExpression"(path) {
            if (path.type == "UnaryExpression") {
                const {operator, argument} = path.node;
                if (operator == "-" && t.isLiteral(argument)) {
                    return;
                }
            }
            const {confident, value} = path.evaluate();
            confident && path.replaceWith(t.valueToNode(value));
        }
    }
    traverse(ast ,visitor);
    var { code } = generator(ast, {
        // 是否格式化
        compact: compact,
        jsescOption: {
            // 自动转义
            minimal: true,
        }
    });
    code = (atob_code + code).replace(/\n\n/g, "\n")
    fs.writeFileSync(file2generat, code, {
        encoding: "utf-8"
    })
    console.log("还原完成！")
    function replaceWhile(path) {
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
            
        // 获取数组名及自增变量名
        var swithStm = body[0];     
        var arrName = swithStm.discriminant.object.name;    
        var argName = swithStm.discriminant.property.argument.name
        let arr = [];  

        // 找到path节点的前一个兄弟节点，即数组所在的节点，然后获取数组  
        let all_presibling = path.getAllPrevSiblings();
        // console.log(all_presibling)
        all_presibling.forEach(pre_path => {
            const {declarations} = pre_path.node;
            let {id, init} = declarations[0]
            if (arrName == id.name) {
                // 数组节点
                arr = init.callee.object.value.split('|');
                pre_path.remove()
            }
            if (argName == id.name) {
                // 自增变量节点
                pre_path.remove()
            }
        })
                
        // SwitchCase节点集合     
        var caseList = swithStm.cases;  
        // 存放按正确顺序取出的case节点   
        var resultBody = [];           
        arr.map(targetIdx => {     
            var targetBody = caseList[targetIdx].consequent;     
            // 删除ContinueStatement块(continue语句)     
            if (t.isContinueStatement(targetBody[targetBody.length - 1]))         
                targetBody.pop();     
            resultBody = resultBody.concat(targetBody)     
        });
        path.replaceInline(resultBody);
    }
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

