var Util = (function () {
	var obj = function () {};

	obj.prototype = {
		post: function (url, params, successCallback, errorCallback, showLoading) {
            var that = this;
            // if(!showLoading){
            //     that.auiShowLoading({});
            // }
			if (api.connectionType == 'none') {
				that.uiShowToast({title: '连接失败，请检查您的网络'});
				return;
			}
            api.ajax({
				url: url,
				method: 'post',
				data: {
					body: params
				},
				headers: {
					"Content-type" : "application/json;charset=UTF-8"
				}
			}, function (ret, err) {
				console.log('============请求:' + url + '============');
				console.log('============参数:' + JSON.stringify(params) + '============');
                // that.auiHideLoading();
				if (ret) {
                    switch (ret.status){
                        case 500:
                            // api.sendEvent({
                            //     name: 'appover',
                            //     extra: {key1: '失败了从头再来'}
                            // });
                            if(ret.msg == '验证码输入错误或已失效'){
                                that.auiShowToast({
                                    title: '验证码输入错误或已失效'
                                })
                            }
                            break;
                        case 200:
                            if(ret.msg == '登录成功'){
                                that.auiShowToast({
                                    title: '登录成功'
                                })
                            } else if(ret.msg == '发送短信成功'){
                                that.auiShowToast({
                                    title: '短信发送成功'
                                })
                            }
	                        console.log('============SUCCESS:' + JSON.stringify(ret) + '============');
	                        successCallback && successCallback(ret.data);
                            break;
	                    default:
		                    successCallback && successCallback();
		                    break;
                    }
				} else {
					console.log('============ERROR:' + JSON.stringify(err) + '============');
					errorCallback && errorCallback(err);
				}
			});
		},

        auiShowMsgBox: function (options, callback) {
            var dialog = new auiDialog({})
            dialog.alert({
                title: options.title || '提示',
                msg: options.msg || '',
                buttons: options.cancelBtn ? ['取消', '确定'] : ['确定']
            },function(ret){
                callback && callback(!(options.cancelBtn && ret.buttonIndex == 1));
            })
        },

        auiShowToast: function (options, callback) {
            var toast = new auiToast({});
            var toastIconHtml = '<i class="aui-iconfont aui-icon-correct"></i><br>';
            switch (options.type) {
                case 'success':
                    toastIconHtml = '<i class="aui-iconfont aui-icon-correct"></i><br>';
                    break;
                case 'fail':
                    toastIconHtml = '<i class="aui-iconfont aui-icon-close"></i><br>';
                    break;
            }
            toast.custom({
                title: options.title || '成功',
                html: toastIconHtml,
                duration: options.duration || 2000
            }, function (ret) {
                callback && callback();
            });
        },

		uiShowToast: function (options, callback) {
			api.toast({
				msg: options.title,
				duration: 2000,
				location: options.location || 'middle'
			});
		},

        auiShowLoading: function (options) {
            var toast = new auiToast({});
            toast.loading({
                title: options.title || '加载中'
            });
        },

        auiHideLoading: function(){
            if(document.querySelector(".aui-toast")){
                document.querySelector(".aui-toast").parentNode.removeChild(document.querySelector(".aui-toast"));
            }
        },

		uiSetRefreshHeaderInfo: function (callback) {
        	var that = this;
	        // api.setCustomRefreshHeaderInfo({
				// bgColor: '#C0C0C0',
				// images: {
				// 	pull: 'widget://image/refresh/pulling.png',
				// 	transform: [
				// 		'widget://image/refresh/transform0.png',
				// 		'widget://image/refresh/transform1.png',
				// 		'widget://image/refresh/transform2.png',
				// 		'widget://image/refresh/transform3.png',
				// 		'widget://image/refresh/transform4.png',
				// 		'widget://image/refresh/transform5.png',
				// 		'widget://image/refresh/transform6.png'
				// 	],
				// 	load: [
				// 		'widget://image/refresh/loading0.png',
				// 		'widget://image/refresh/loading1.png',
				// 		'widget://image/refresh/loading2.png',
				// 		'widget://image/refresh/loading3.png',
				// 		'widget://image/refresh/loading4.png',
				// 	]
				// }
	        // }, function(ret, err) {
				// //在这里从服务器加载数据，加载完成后调用api.refreshHeaderLoadDone()方法恢复组件到默认状态
	        //
	        // });
        	// return;
			api.setRefreshHeaderInfo({
				visible: true,
				loadingImg: 'widget://image/refresh.png',
				bgColor: '#ccc',
				textColor: '#fff',
				textDown: '下拉刷新...',
				textUp: '松开刷新...',
				showTime: true
			}, function(ret, err) {

				if (api.connectionType == 'none') {
					api.refreshHeaderLoadDone();
					that.uiShowToast({title: '连接失败，请检查您的网络'});
					return;
				}

				//在这里从服务器加载数据，加载完成后调用api.refreshHeaderLoadDone()方法恢复组件到默认状态
				console.log($api.jsonToStr(ret));
				callback && callback();
				setTimeout(function () {
					api.refreshHeaderLoadDone();
				}, 500);
			});
		},

		historyBack: function (options, callback) {
			api.historyBack({
				frameName: options.frameName
			}, function (ret, err) {
				if (!ret.status) {
					callback && callback(function () {
						api.closeWin();
					});
				} else {
					callback && callback();
				}
			});
		},

		getExternalPageTitle: function (frameName) {
			var script = "api.sendEvent({name: 'getUrl', extra: {title: window.document.title}});";

			api.execScript({
				frameName: frameName,
				script: script
			});
		},

		apiAddListener: function (options, successCallback, errCallback) {
			api.addEventListener({
				name: options.name,
				extra: options.extra ? options.extra.threshold : 0
			}, function(ret, err) {
				if(ret){
					successCallback && successCallback(ret);
				} else {
					errCallback && errCallback(err);
				}
			});
		},

		apiCheckConection: function (callback) {
        	if (api.connectionType == 'none') {
        		this.uiShowToast({title: '连接失败，请检查您的网络'});
	        } else {
		        callback && callback();
	        }
		},

		apiAjpush: function (ajpush) {

		}

	};
	return new obj();
})();

//
// (function(window){
// 	var u = {};
// 	u.post = function (url, params, successCallback, errorCallback) {
// 		api.ajax({
// 			url: url,
// 			method: 'post',
// 			data: {
// 				body: params
// 			},
// 			headers: {
// 				"Content-type" : "application/json;charset=UTF-8"
// 			}
// 		}, function (ret, err) {
// 			console.log('============请求:' + url + '============');
// 			console.log('============参数:' + JSON.stringify(params) + '============');
// 			if (ret) {
// 				console.log('============SUCCESS:' + JSON.stringify(ret) + '============');
// 				successCallback && successCallback(ret);
// 			} else {
// 				console.log('============ERROR:' + JSON.stringify(err) + '============');
// 				errorCallback && errorCallback();
// 			}
// 		});
// 	};
// 	window.Util = u;
// })(window);


