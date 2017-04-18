/*
 * load.js
 * @author zhangwei  2016-12-27
 * 服务端交互的相关函数
 */


var skip = 0; //数据起始值
var limit = 10; //限制一次出几条

/**
 * [pushUp 上拉加载]
 * @param  {Function} callback [执行跟服务器交互的函数方法]
 * @link [http://www.kancloud.cn/hongweizhiyuan/apicloud_function/268880]
 */
function pushUp(callback) {
	api.addEventListener({
		name: 'scrolltobottom',
	}, function(ret, err) {
		if (callback) {
			callback();
		}
	});
}


/**
 * [pushDown 下拉刷新]
 * @param  {[Function]} callback1 [执行跟服务器交互的函数方法]
 * 两个回调用于需要同时从不同的接口加载数据的情况，也可只用一个
 * @link [http://www.kancloud.cn/hongweizhiyuan/apicloud_function/268902]
 */
function pushDown(callback) {
	api.setRefreshHeaderInfo({
		visible: true,
		bgColor: '#F0F0F0',
		textDown: '下拉刷新...',
		textUp: '松开刷新...',
		showTime: true
	}, function(ret, err) {
		if (callback) {
			callback.apply(this, [ret, err]);
		}
	});
}

/**
 * [ajax 封装api.ajax加入自定义HTTP请求头,以实现APP身份验证和模拟SESSION机制]
 * 使用方法与api.ajax完全一样
 * @author Baiyu
 * @param  {[object]} parmas        [参数对象]
 * @param  {[function]} callback    [回调函数]
 * @link [http://www.kancloud.cn/hongweizhiyuan/apicloud_function/268903]
 */
function ajax(params, callback){
	if(!api){
		console.log('只能运行在APICLOUD环境下');
		return false;
	}

	//返回所有http响应头信息
	var needReturnAll = false;
	if (params.returnAll) {			//调用者需要返回所有结果
		needReturnAll = true;
	} else {						//调用者不需要返回所有结果但系统需要
		params.returnAll = true;
	}

	//请求头加入APP身份识别码
	if (!params.headers) {
		params.headers = {};
	}
	params.headers.NEWAPPAUTH = api.getPrefs({
		sync : true,
		key : 'NEWAPPAUTH'
	});
	//请求头加入模拟SESSID
	var newSessId = api.getPrefs({
		sync : true,
		key : 'NEWSESSID'
	});
	if (newSessId) {
		params.headers.NEWSESSID = newSessId;
	}
	//发起ajax请求
	api.ajax(params, function(ret, err){

		//未出错时处理response中的Set-Cookie,截取并保存到Prefs
		if (!err) {

			var headers = ret.headers;
			var statusCode = ret.statusCode;
			if (headers['Set-Cookie']) {

				var sessionArr = headers['Set-Cookie'].match(/NEWSESSID=[\w\d]+/g);
				for(var i in sessionArr){

					var data = sessionArr[i].split('=');
					var sessionId = $api.trim(data[1]);

					api.removePrefs({
						key : 'NEWSESSID'
					});
					if (sessionId != 'deleted') {
						api.setPrefs({
							key : 'NEWSESSID',
							value : sessionId
						});
						//SESSION已刷新
						api.sendEvent({
							name: 'sessionRefreshed'
						});
					}
				}
			}

			//如果服务器返回201错误代码,表明需要重新登录,这里发送重新登录事件,index.html中会接收到并处理
			if (ret.error == 201 || ret.body.error == 201) {
				api.removePrefs({
					key : 'NEWSESSID'
				});
				api.sendEvent({
					name: 'reloginRequested'
				});
				return false;
			}
		}

		var ret = !needReturnAll && !err ? ret.body : ret;	//根据调用者是否需要返回所有结果来确定要返回ret还是ret.body

		typeof(callback) == 'function' && callback.apply(this, [ret, err]);
	});
}

/**
 * [runAjax ajax函数封装]
 * @param   {[string]}   serverUrl   [服务器接口完整地址]
 * @param   {[object]}   data        [传输的json对象数据]
 * @param   {Function}   callback    [执行update_data函数来更新模板数据]
 * @param   {string}     isProgress  [是否显示模态框加载特效]
 * data 应为对象类型，不是的话方法中也会自动转换
 * @link [http://www.kancloud.cn/hongweizhiyuan/apicloud_function/268904]
 */
function runAjax(serverUrl, data,callback,isProgress) {
	if (!isJson(data)) {
		data = strToJson(data);
	}
	if(isDefine(isProgress)){
		showProgress(); //加载模态
	}
	ajax({
		url: serverUrl,
		method: 'post',
		timeout: 30,
		dataType: 'json',
		returnAll: false,
		data: data
	}, function(ret, err) {
		hideProgress();
		api.refreshHeaderLoadDone();
		if (ret) {
			callback(ret);
		} else {
			netError(); //请求失败
		}
	});
}

/**
 * [updateData 更新模板数据]
 * @param   {[object]} data_    [从服务器端获取的数据]
 * @param   {[string]} dotID    [dot模板的id名称]
 * @param   {[string]} contentId [要插入内容的div标签的id]
 * @link [http://www.kancloud.cn/hongweizhiyuan/apicloud_function/268905]
 */
function updateData(data_, dotID, contentId,callback) {
	var apendText = $api.byId(dotID).text;
	var fnapendText = doT.template(apendText);
	var html = fnapendText(data_);
	var list = $api.byId(contentId);
	$api.append(list, html);
	api.parseTapmode(); //重要，更改dom结构后通知
	if(callback){
		callback(data_);
	}
}

//显示模态加载
function showProgress() {
	api.showProgress({
		animationType: 'zoom',
		title: '努力加载中...',
		text: '先喝杯茶...',
		modal: true
	});
}

//隐藏模态加载
function hideProgress() {
	api.hideProgress();
}

//网络不好的情况下统一定义的错误
function netError(callback) {
	api.toast({
		msg: '网络不好,请稍后再试',
		duration: 2000,
		location: 'bottom'
	});
	if (isDefine(callback)) {
		callback();
	}
}

/**
 * [LoadImage 图片开启缓存]
 * @param {[obj]} ele_ [当前元素]
 */
 function LoadImage(ele_){
	var imageURL = $api.attr(ele_, 'data-url');
	if(imageURL){
		api.imageCache({
			url: imageURL
		}, function(ret, err){
			if( ret.status ){
				ele_.src = ret.url;
				$api.removeAttr(ele_, 'data-url');
			}
		});
	}
 }

/** 数据缓存 相关实现 start */

/**
 * [loadCache 列表页缓存数据方法]
 * @param  {[String]}   folder   [文件夹]
 * @param  {[Int]}      id       [文件id]
 * @param  {[String]}   fullUrl  [远程接口地址]
 * @param  {[Object]}   data     [对象数据]
 * @param  {Function}   callback [要回调的函数]
 */
function loadCache(folder,id,fullUrl,data,callback){
	var cacheDir = api.cacheDir;
	 readFile(cacheDir + '/'+ folder + '/' + id +'.json',function(ret){
		if(ret.status){
		   var jsonData = JSON.parse(ret.data); //json字符串转对象
		   // alert('缓存数据');
			callback(jsonData);
			imageCache($api.domAll('.imgCache')); // 缩略图缓存
		}else{
			runAjax(fullUrl, data, function(ret) {
				if (ret.error) {
					showToast(ret.error_msg);
				} else {
					pullDownTime = Math.round(new Date().getTime()/1000); //设置下拉时间
					console.log('下拉时间1' + pullDownTime);
					//组合图片地址，方便浏览使用
					weiboDataReform(ret.data,function(ret){
						callback(ret);
						writeFile(ret,folder,id); // 写入缓存文件
					})
					imageCache($api.domAll('.imgCache')); //缩略图缓存
				}
			});
		}
	});
}

/**
 * [weiboDataReform 微博数据改造方法]
 * @param  {[Object]}   data     [列表数据]
 * @param  {Function} 	callback [要回调的函数]
 */
function weiboDataReform(data,callback){
	//TODO  转发微博的数据改造
	//TODO  改为大图的地址
	var listData = data.list;
	var cacheList = {};
	for(i in listData){
		if(listData[i].attach){
			listData[i].imgUrls = [];
	        for(j in listData[i].attach){
	            listData[i].imgUrls[j] = listData[i].attach[j].url;
	        }
		}
		//console.log('改造前：' + listData[i].content);
		listData[i].content = weiboContentReplace(listData[i].content,data.at_data);
		//test = weiboContentReplace(listData[i].content,data.at_data);
		  //console.log('改造后的@数据：' + test);
        if(listData[i].type == 2){
   		  listData[i].original_weibo.content = weiboContentReplace(listData[i].original_weibo.content,data.at_data);
        	if(listData[i].original_weibo.attach){
        		listData[i].original_weibo.imgUrls = [];
	        	for(t in listData[i].original_weibo.attach){
	        		listData[i].original_weibo.imgUrls[t] =  listData[i].original_weibo.attach[t].url;
	        	}
        	}
        }
      cacheList[listData[i].weibo_id] = listData[i];
    }
    console.log('改造的数据列表' + $api.jsonToStr(cacheList));
	callback(cacheList);

}

/**
 * [imageCache 图片缓存的实现]
 * @param  {[Array]} thumbImgList [单条微博的缩略图列表数据]
 * @param  {[Array]} bigImgList   [单条微博的大图列表数据]
 */
function imageCache(thumbImgList,bigImgList) {
	if(isDefine(thumbImgList)){
		var selector = thumbImgList;
	}else{
		var selector = bigImgList;
	}
	for (var i = 0; i < selector.length; i++) {
		if(isDefine(thumbImgList)){
		    var imgSelector = selector[i];
			var imageUrl = selector[i].src;
			var pos = imageUrl.lastIndexOf('/');
			var fileName = imageUrl.substring(pos + 1);
			var imagePath = api.cacheDir + '/picture/' + fileName;
		}else{
			var imageUrl = selector[i];
			//console.log('大图地址'+JSON.stringify(imageUrl)); //TODO url地址有空的清空
			var pos = imageUrl.lastIndexOf('/');
			var fileName = imageUrl.substring(pos + 1);
			var imagePath = api.cacheDir + '/picture/' + 'bigImg'+ fileName;
		}

		var fs = api.require('fs');
		!function(imageUrl,imagePath, imgSelector){

			fs.exist({
				path:imagePath
			},function(ret, err){
//				console.log( '判断是否存在' + JSON.stringify(ret));
				  if (ret.exist) {
					if (ret.directory) {
						console.log('文件夹');
					} else {
						 // console.log('选择器'+imgSelector +'图片路径'+ imagePath);
						 if(isDefine(imgSelector)){
						 	imgSelector.src = '';
						    imgSelector.src = imagePath;
						 }
					}
				 }else{

					api.download({
						url: imageUrl,
						savePath: imagePath,
						report: true,
						cache: true,
						allowResume: true
					},function(ret, err){
					// TODO 大图下载时不进这里，但是可以下载成功，原因？
//					  console.log($api.jsonToStr(ret));
						if(ret.state == 1){
//							 console.log('大图下载正确' + $api.jsonToStr(ret));
						}else{
//							 console.log('大图下载失败' + $api.jsonToStr(err));
						}
					});
				 }
			});
		}(imageUrl,imagePath,imgSelector);
	}
}

/**
 * [bigImgCache 大图图片和文件缓存的实现]
 * @param  {[Array]}  bigImgList [大图列表]
 * @param  {[String]} folder     [缓存目录]
 * @param  {[Int]}    id         [文件id]
 */
function bigImgCache(bigImgList,folder,id,callback){
	var cacheDir   	 = api.cacheDir;
	var path         = cacheDir + '/'+ folder + '/' + id +'.json';
	// console.log('路径' + path);
	 readFile(path,function(ret){
		if(ret.status){
//			console.log('文件存在'+JSON.stringify(ret));
			var jsonData = JSON.parse(ret.data);
			var localUrls  = jsonData.localUrls;
			var remoteUrls = jsonData.remoteUrls;
			imageCache('',bigImgList); //判断大图是否存在，不存在则下载
			callback(localUrls);
		}else{
			//大图Json文件不存在的情况下执行此操作！
			 var bigImgCacheList     = {};
			 bigImgCacheList.localUrls = [];
//			 bigImgCacheList.remoteUrls = [];
			 var imgLength    = bigImgList.length; // 图片列表的长度
			// 先调用远程图片地址,同时下载大图缓存到本地。
			callback(bigImgList);
			for (var i = 0; i < bigImgList.length; i++) {
				var bigImgUrl    = bigImgList[i]; //TODO 临时，换大图地址
				var pos          = bigImgUrl.lastIndexOf('/');
				var fileName     = bigImgUrl.substring(pos +1 );
				var bigImgPath   = api.cacheDir + '/picture/' + 'bigImg'+fileName;
				!function(bigImgUrl,bigImgPath,i){
					api.download({
						url: bigImgUrl,
						savePath: bigImgPath,
						report: true,
						cache: true,
						allowResume: true
					},function(ret, err){
						if(ret.state == 1){
							  bigImgCacheList.localUrls[i]  = bigImgPath;
//							  bigImgCacheList.remoteUrls[i] = bigImgUrl;
							  // 循环完成 存储本地图片路径到文件
							   //TODO 偶尔 一两张下载失败原因处理！
							   console.log('图片地址'+i + bigImgUrl);
							  console.log('图片长度'+ imgLength);
							  writeFile(bigImgCacheList,folder,id);
//							  if( parseInt(i+1) == imgLength ){
//								console.log('图片列表'+ JSON.stringify(bigImgCacheList));
//								writeFile(bigImgCacheList,folder,id);
//							  }
						}else{
//							 console.log('下载失败' + $api.jsonToStr(err));
						}
					});
				}(bigImgUrl,bigImgPath,i);
			}
		}
	 });
}

/** 数据缓存 相关实现 end */


/**
 * [使用wifi的ssid加入店内]
 */
function joinToShop(){
	var user = $api.getStorage('user');

	if (user && user.id) {

		var wifi = $api.getStorage('wifi');

		ajax({
			url: serverUrl + 'index.php?g=Shop&m=Shop&a=joinToShopByWifi',
			method: 'post',
			data: {
				values: {
					ssid: wifi.ssid
				}
			}
		}, function(ret, err) {
			if (ret) {
				if (!ret.error) {
					$api.setStorage('shop', ret.data.shop);
					api.toast({
						msg: '进入' + ret.shop_name
					});
				} else {
					console.log('error:' + ret.error + '|' +ret.error_msg);
				}
			} else {
				console.log(JSON.stringify(err));
			}
		});
	}
}

/**
 * [离开店内]
 */
function leaveFromShop(){
	var user = $api.getStorage('user');

	if (user && user.id) {

		var wifi = $api.getStorage('wifi');

		ajax({
			url: serverUrl + 'index.php?g=Shop&m=Shop&a=leaveShop',
			method: 'post',
		}, function(ret, err) {
			if (ret) {
				if (!ret.error) {
					$api.rmStorage('shop');
					api.toast({
						msg: '离开' + ret.shop_name
					});
				} else {
					console.log('error:' + ret.error + '|' +ret.error_msg);
				}
			} else {
				console.log(JSON.stringify(err));
			}
		});
	}
}

/**
 * [检测wifi状态,并执行加入店内]
 */
function checkWifi(){
	var wifi = api.require('wifi');
	wifi.currentWifi(function(ret, err) {
		if (ret.status) {
			//储存wifi相关信息到storage
			$api.setStorage('wifi', {
				ssid: ret.ssid,
				mac: ret.bssid
			});

			//用户加入店内
			joinToShop();
		} else {
			$api.rmStorage('wifi');
			console.log(ret.msg);
		}
	});
}

