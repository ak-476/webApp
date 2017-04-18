/*
 * user.js
 * @author Hongwei  2017-02-25
 * 和用户交互的一些数据
 */


/**
 * [getUser 获取用户的全部信息]
 * @return {[object]} [description]
 * @link http://www.kancloud.cn/hongweizhiyuan/apicloud_function/270057
 */
function getUser(){
	return $api.getStorage('user');
}


/**
 * [getUserID 获取当前用户的ID]
 * @return {[number]} [用户的ID值]
 * @link http://www.kancloud.cn/hongweizhiyuan/apicloud_function/272577
 */
function getUserID(){
	var user = $api.getStorage('user');
	var uid = parseInt(user.id);
	return uid;
}

/**
 * [register 用户注册]
 * @return {[type]} [description]
 * @link TODO
 */
function userRegister() {
	api.openWin({
		name: 'user_register_win',
		url: './user_register_win.html'
	});
}

/**
 * [userLoginTest 测试登录，不用传值直接跳转到指定页面]
 * @link TODO
 */
function userLoginTest() {
	api.openWin({
		name : 'main',
		url : '../main.html',
		slidBackEnabled : false
	});
	api.hideProgress();

}

/**
 * [userLogin 用户登录]
 * @param  {[string]} name          [手机号]
 * @param  {[string]} password        [密码]
 * @param  {[string]} apiUrl          [API的URL地址]
 * @param  {[string]} userStorageName [存储user的 storage的名称]
 * @param  {[type]} mainUrl         [跳转地址]
 * @return {[type]}                 [description]
 * @link TODO
 */
function userLogin(name,password,apiUrl,userStorageName,mainUrl) {

	var name = $api.byId(name);
	var password = $api.byId(password);

	//手机号判断
	if (name.value.length == 0) {
		api.toast({
			msg : '请输入你的手机号码！',
			duration : 2000,
			location : 'middle'
		});
		name.focus();
		return;
	}

	//手机号11位数判断
	if (name.value.length != 11) {
		api.toast({
			msg : '亲，你的手机号的位数不对吧',
			duration : 2000,
			location : 'middle'
		});
		mobile.focus();
		return;
	}


	if (! isNumber(name.value)) {
		api.toast({
			msg : '您的手机号码应该为数字！',
			duration : 2000,
			location : 'middle'
		});
		name.focus();
		return;
	}


	//密码判断
	if (password.value.length == 0) {
		api.toast({
			msg : '亲，请输入密码',
			duration : 2000,
			location : 'middle'
		})
		password.focus();
		return;
	}
	//console.log(serverUrl + apiUrl );
	ajax({
		url : serverUrl + apiUrl ,
		method : 'get',
		cache : 'false',
		timeout : '30',
		dataType : 'json',
		charset : 'utf-8',
		data : {
			values : {
				name : $api.val(name),
				password : $api.val(password)
			}
		}
	}, function(ret, err) {
		//console.log(JSON.stringify(ret));
		if (ret) {
			if (ret.data.msg == 1) {
				$api.setStorage(userStorageName, ret.data.userInfo);//将此用户信息存入缓存
				api.openWin({
					name : 'main',
					url : mainUrl,
					slidBackEnabled : false,
					reload: true
				});
				api.hideProgress();
			} else {
				api.toast({
					msg: '登录失败',
					duration: 2000,
					location: 'middle'
				});
			}

		} else {
			api.toast({
				msg: '你没有在本站注册过吧',
				duration: 2000,
				location: 'middle'
			});
		};
	});
}