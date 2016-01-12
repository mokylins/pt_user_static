var namespace = function() {
    var arg = arguments;
    for (var i = 0; i < arg.length; i++) {
        var arr = arg[i].split(".");
        var win = window;
        for (var j = 0; j < arr.length; j++) {
            win[arr[j]] = win[arr[j]] || {};
            win = win[arr[j]]
        }
    }
    return win;
};

namespace("UserManager");

UserManager.g_server = "https://user-dev.36b.me/";
// UserManager.g_server = "https://user.mokylin.com/";
UserManager.currUser = null;

/********************登录相关**************************/
/**
 * 跳转登陆页面
 */
UserManager.toLoginPage = function (prms, flag) {
    var _url = UserManager.g_server+"login.html?_surl="+encodeURIComponent(prms.sUrl)+"&_furl="+encodeURIComponent(prms.fUrl);
    if(flag){
        return _url;
    }else{
        location.href = _url;
    }
}
/**
 * 用户登陆
 */
UserManager.login = function(prms, callback, failback) {
    $.getJSON(
        UserManager.g_server + "user/login/byemail?function=?", {
            email: prms.uname,
            pwd: prms.pwd,
            validatecode: prms.validatecode
        },
        function(result) {
            if (result.status == 1) {
                UserManager.setCookie("USER_INFO", UserManager._infoSerialize(result.data));
                UserManager.currUser = result.data;
                callback(result);
            } else {
                if (failback) failback(result);
            }
        }
    );
}
/**
 * 第三方登录路径
 * QQ用户
 */
UserManager.loginByQQUrl = function(prms) {
    return UserManager.g_server+"user/login/go2qq?sUrl="+prms.surl;
}
/**
 * 第三方登录路径
 * 微信用户
 */
UserManager.loginByWechatUrl = function(prms) {
    return UserManager.g_server+"user/login/go2weixin?sUrl="+prms.surl;
}

/**
 * 用户注销
 */
UserManager.logout = function(prms, callback, failback) {
    $.getJSON(
        UserManager.g_server + "user/login/out?function=?",
        function(result) {
            if (result.status == 1) {
                UserManager.delCookie("USER_INFO");
                UserManager.currUser = null;
                if (callback) callback(result);
            } else {
                if (result.status == 0) {
                    alert("退出失败");
                } else if (result.status == 5) {
                    alert("系统错误");
                }
                if (failback) failback(result);
            }
        }
    );
}

/**
 * 密码修改
 */
UserManager.modifyPwd = function(prms, callback, failbackl) {
    $.getJSON(
        UserManager.g_server + "user/info/updatepwd?function=?",
        {
            oldpwd: prms.oldpwd,
            pwd: prms.pwd
        },
        function(result) {
            if(result.status == 1){
                if (callback) callback(result);
            }else{
                if (failback) failback(result);
            }
        }
    );
}

/**
 * 查询用户登陆状态
 */
UserManager.isLogined = function() {
    var isLogin = UserManager.getCookie("IS_LOGIN");
    if(isLogin){
        return true;
    }else{
        return false;
    }
}

/**
 * 登陆用户详细信息
 */
UserManager.initUserStatus = function(prms, callback, failback) {
    if(UserManager.isLogined()){
        var info = UserManager._infoUnserialize(UserManager.getCookie("USER_INFO"));
        if(info){
            UserManager.currUser = info;
            callback({status: 1});
        }else{
            UserManager._getUser(callback);
        }
    }else{
        callback({status: 0});
    }
}

UserManager._getUser = function(callback){
    $.getJSON(
        UserManager.g_server + "user/info/all?function=?",
        function(result) {
            if (result.status == 1) {
                UserManager.setCookie("USER_INFO", UserManager._infoSerialize(result.data));
                UserManager.currUser = result.data;
            }
            if (callback) callback(result);
        }
    );
}

/**
 * 是否需要验证码
 */
UserManager.isVerify = function() {
    if (UserManager.getCookie("LOGIN_NEED_CODE") == "1") {
        return true;
    } else {
        return false;
    }
}

/**
 * 刷新验证码
 */
UserManager.getVerifyUrl = function() {
    return UserManager.g_server + "user/validatecode/image?_=" + Date.parse(new Date());
}

/********************注册相关**************************/
/**
 * 跳转注册页面
 */
UserManager.toRegPage = function (prms, flag) {
    var _url = UserManager.g_server+"register.html?_surl="+encodeURIComponent(prms.sUrl)+"&_furl="+encodeURIComponent(prms.fUrl);
    if(flag){
        return _url;
    }else{
        location.href = _url;
    }
}
/**
 * 邮箱注册
 */
UserManager.register = function(prms, callback, failback) {
    $.getJSON(
        UserManager.g_server + "user/register/byemail?function=?", {
            email: prms.email,
            pwd: prms.pwd,
            surl: prms.surl,
            furl: prms.furl
        },
        function(result) {
            if (result.status == 1) {
                if (callback) callback(result);
            } else {
                if (failback) failback(result);
            }
        }
    );
}

/**
 * 是否需要验证码
 */
UserManager.isRegVerify = function() {
    if (UserManager.getCookie("REGISTER_NEED_CODE") == "1") {
        return true;
    } else {
        return false;
    }
}

/**
 * 重置密码请求【邮件发送】
 */
UserManager.requestFindPwd = function(prms, callback, failback) {
    $.getJSON(
        UserManager.g_server + "user/security/requestfindpwd?function=?", {
            email: prms.email,
            surl: prms.surl,
            furl: prms.furl
        },
        function(result) {
            if (result.status == 1) {
                if (callback) callback(result);
            } else {
                if (failback) failback(result);
            }
        }
    );
}

/**
 * 重置密码【邮件发送】
 */
UserManager.doFindPwd = function(prms, callback, failback) {
    $.getJSON(
        UserManager.g_server + "user/security/dofindpwd?function=?", {
            validatecode: prms.validatecode,
            newpwd: prms.newpwd
        },
        function(result) {
            if (result.status == 1) {
                if (callback) callback(result);
            } else {
                if (failback) failback(result);
            }
        }
    );
}

/************ Cookie *************************/
UserManager.getCookie = function(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return UserManager._decode(arr[2]);
    else
        return null;
}
UserManager.setCookie = function(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + UserManager._encode(value) + ";expires=" + exp.toGMTString()+";domain=.36b.me;path=/";
}
UserManager.delCookie = function(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 10000);
    var cval = UserManager.getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
UserManager._encode = function(value) {
    return encodeURIComponent(value);
}
UserManager._decode = function(value) {
    return decodeURIComponent(value);
}
UserManager._infoSerialize = function(obj) {
    var str = '';
    for(var i in obj){
        str += ''+i+'='+obj[i]+'&';
    }

    return str.substring(0, str.length-1);
}
UserManager._infoUnserialize = function(str) {
    if(!str){
        return null;
    }
    var arr = str.split('&'),
        info = {},
        temp;
    for (var i = arr.length - 1; i >= 0; i--) {
        temp = arr[i].split('=');
        info[temp[0]] = temp[1];
    };
    return info;
};
