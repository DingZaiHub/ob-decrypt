var config = {
    // 要还原的代码路径
    file2decrypt: "./source.js",
    // 是否生成格式化后的代码，false为格式化，true为禁止格式化
    compact: false,
    // 仅将解密函数还原，其它不还原。如仅还原_0x5323("0x1a", ")^7H")。true为仅还原解密函数
    only_decrypt: false,
    // 开启打印解密函数还原过程的开关，true为打开，false关闭
    debug: false,
    // 要生成的代码路径
    file2generat: "./code.js",
}

module.exports = { config }
