var _hmt = _hmt || [];
(function() {
    var hm = document.createElement('script');
    hm.src = '//hm.baidu.com/hm.js?37aea583c033706204516f8050a4c70e';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(hm, s);
})();

$.getReqParam = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"),
        r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return "";
}

$.contactPrm = function(_surl, _furl){
    if(_surl){
        if(!_furl){
            _furl = _surl;
        }
        return "?_surl="+_surl+"&_furl="+_furl;
    } else return "";
}

$.getPreUrl = function(url){
    return url.substring(0, url.lastIndexOf("/")+1);
}

$.isMobileDevice = function(){
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        // phone
        return true;
    } else {
        // PC
        return false;
    }
}