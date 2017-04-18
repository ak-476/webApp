
/**
 * [dGetUser 获取用户的数据]
 * @return {[type]} [description]
 */
function dGetUser(){
	console.log(JSON.stringify($api.getStorage('user')));
}

/**
 * chorme调试的工具
 * 说明：按如下进行配置
	var chromedebug = null;
	apiready = function() {
	    chromedebug = api.require('chromeDebug');
	    openchromelog();
	}; 
 */
function openchromelog() {
    chromedebug.openDebug(function(ret, err) {
        if (212 == ret.code) {
            alert(JSON.stringify(ret));
        } else {
            console.log(ret);
        }
    });
}