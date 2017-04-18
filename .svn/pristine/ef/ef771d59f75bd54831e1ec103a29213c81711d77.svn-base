//验证手机号
function checkMobile(mobile) {
	if (mobile.length == 0) {
		alert('请输入手机号')
		return false;
	}
	if (mobile.length != 11) {
		alert('请输入有效的手机号码！')
		return false;
	}
	var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
	if (!myreg.test(mobile)) {
		api.toast({
			msg : '请输入有效的手机号码！',
			duration : 2000,
			location : 'middle'
		});
		return false;
	}
	return true;
}

/**
 * [checkPassword 验证密码和确认密码]
 * @param  {[string]} password   [密码]
 * @param  {[string]} repassword [重复密码]
 * @return {[boolean]}            [返回真假]
 */
function checkPassword(password,repassword) {
	if (password.length == 0) {
		alert('请输入密码')
		return false;
	}
	if(typeof(repassword) !="undefined"){
		if(repassword.length==0){
			alert('请输入确认密码')
			return false;
		}
		if(password!=repassword){
		alert('请确认两次密码输入一致')
		return false;
		}
	}

	return true;
}

function checkRegion(region) {
	if (region.length == 0) {
		alert('请选择所在地')
		return false;
	}
	return true;
}

// 注册短信模块，初始化
function register()
{
	smsVerify.register(function(ret, err) {
		if (ret.status) {
			//api.alert({msg: '注册成功'});
			console.log('注册成功');
		} else {
			api.alert({
				msg : err.code + ' 注册失败'
			});
		}
	});
}

/**
 * [sms 发送短信验证码]
 *
 */
function sms() {
	var mobile =$api.byId('mobile').value;

	 if(checkMobile(mobile)){  //验证手机号是否存在
 		var status = $api.attr(sendVerify, 'status');
		if (status != 1) {
			return;
		}
		var mobile = document.getElementById("mobile").value;
		smsVerify.sms({
			phone : mobile,
		}, function(ret, err) {
			if (ret.status) {
				var sendVerify = $api.byId('sendVerify');
				var status = $api.attr(sendVerify, 'status');
				api.parseTapmode();
				$api.removeAttr(sendVerify, 'onclick');
				if (status != 1) {
					return;
				}
				$api.html(sendVerify, '<span id="GetVerify">20</span>S');
				times = 19;
				isinerval = setInterval("CountDown()", 1000);
				var status = $api.attr(sendVerify, 'status','2');
			} else {
				api.alert({
					msg : err.code + ' 短信发送失败'
				});
			}
		});
	 }

}

/**
 * [checkCode 验证短信验证码输入是否正确]
 */
function checkCode(code){
	if(code.length==0){
		alert('请输入验证码');
		return false;
	}
	return true;
}
/**
 * [CountDown 验证码动态数字特效]
 */
function CountDown() {
	if (times < 1) {
		var sendVerify = $api.byId('sendVerify');
		$api.attr(sendVerify, 'onclick', 'sms()');
		$api.attr(sendVerify, 'status', '1');
		api.parseTapmode();
		$api.html(sendVerify, '重新获取');
		clearInterval(isinerval);
		return;
	}
	var getVerify = $api.byId('GetVerify');
	$api.html(getVerify, '' + times + '');
	times--;
}
