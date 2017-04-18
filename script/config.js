var Config = {};

Config.resourcePath = {
	hostApp: 'http://test.51gonggui.com/commonrail/',
	hostWx: 'http://test.51gonggui.com/'
	// hostApp: 'http://192.168.11.58:9999/',
	// hostWx: 'http://192.168.11.58:9999/'

	// hostApp: 'http://192.168.11.9:81/commonrail/',
	// hostWx: 'http://192.168.11.58:9999/'
};

Config.api = {
	//页面初始化cookies
	appCoolie: Config.resourcePath.hostApp + 'app/setCookie.json',
	//登录页短信发送
	appLogin: Config.resourcePath.hostApp + 'app/sendMsgForApp.json',
	//验证码并登录
	appMsgLogin: Config.resourcePath.hostApp + 'app/checkLoginForApp.json',
	//用户退出登录
	appLogout: Config.resourcePath.hostApp + 'api/app/logout.json',
	//首页分类
	appHomeClassify: Config.resourcePath.hostApp + 'app/quickClassifyList.json',
	//首页翻页列表
	appFmsList: Config.resourcePath.hostApp + 'app/fmsList.json',
	//在线问答未读数量
	appGanoread: Config.resourcePath.hostApp + 'api/app/countQaNoRead.json',
	//支付
	appPay: Config.resourcePath.hostApp + 'api/wx/testpay.json'
};



// const HOSTAPP =  'http://192.168.11.58:9999/';
//
// const HOSTWX = 'http://192.168.11.86:9999';
//
// const API = {
// 	//页面初始化cookies
// 	APPCOOKIE: HOSTAPP + 'app/setCookie.json',
// 	//登录页短信发送
// 	APPLOGIN: HOSTAPP + 'app/sendMsgForApp.json',
// 	//验证码并登录
// 	APPMSGLOGIN: HOSTAPP + 'app/checkLoginForApp.json',
// 	//用户退出登录
// 	APPLOGOUT: HOSTAPP + 'api/app/logout.json',
// 	//首页分类
// 	APPQUICKCLASSFYLIST: HOSTAPP + 'app/quickClassifyList.json',
// 	//首页翻页列表
// 	APPPAGELIST: HOSTAPP + 'app/fmsList.json',
// 	//在线问答未读数量
// 	APPQANOREAD: HOSTAPP + 'api/app/countQaNoRead.json',
//
// };



