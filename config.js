var config = {
    // 要还原的代码路径
    file2decrypt: "./55fbdbe5.js",
    // 仅将解密函数还原，其它不还原。如仅还原_0x5323("0x1a", ")^7H")。true为仅还原解密函数
    only_decrypt: false,
    // 开启打印解密函数还原过程的开关，true为打开，false关闭
    debug: false,
    // 是否去除var定义的逗号表达式及var定义的三元表达式转if-else，这里默认关闭，详见说明文档
    trans_var: false,
    // 常量计算，如"eAj" === "eAj"直接转为true。可能会导致逻辑错误，慎用！
    eval: false,
    // 修改调用方式，如aa['bb']['v']()转aa.bb.v()，但aa[']']转成aa.]代码会出错，慎用！
    trans: false,
    // 要生成的代码路径
    file2generate: "./code.js",
}

module.exports = { config }
