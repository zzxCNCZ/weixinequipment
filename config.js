/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'jtglssbx.bjjtgl.gov.cn';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `https://${host}/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `https://${host}/user`,

        tunnelUrl: `https://${host}/tunnel`,
        // 上传文件地址
        uploadUrl: `https://${host}/up/upload/write`,
    }
};

module.exports = config;