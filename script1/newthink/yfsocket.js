/**
 * yfsocket.js
 * @author Baiyu
 * @todo 还需真机测试
 * 仅适用于APICloud下,依赖于socketManager组件
 */
(function(window){
	"use strict";
	var yfsocket = function(param, callback){
		this.init(param, callback);
	};

	yfsocket.prototype = {
		callback : null,
		param : null,
		socketManger : null,
		sid : null,

		//初始化
		init:function(param, callback){
			if ('undefined' == typeof(api)) {
				console.log('该插件必需在APICloud中运行');
			} else {
				this.callback = callback;
				this.param = param;
				this.socketManger = api.require('socketManger');

				var sid = api.getPrefs({
					sync : true,
					key: 'SOCKETSID'
				});

				if (sid) {
					this.sid = sid;
				} else {
					this.create(this.param, this.callback);
				}
			}
		},
		//创建socket连接
		create:function(param, callback){
			//合并配置
			mergeParam = {
				type : param.type ? param.type : defaults.type,
				udpMode : param.udpMode ? param.udpMode : defaults.udpMode,
				host : param.host ? param.host : defaults.host,
				port : param.port ? param.port : defaults.port,
				localPort : param.localPort ? param.localPort : defaults.localPort,
				timeout : param.timeout ? param.timeout : defaults.timeout,
				bufferSize : param.bufferSize ? param.bufferSize : defaults.bufferSize,
				charset : param.charset ? param.charset : defaults.charset,
				returnBase64 : param.returnBase64 ? param.returnBase64 : defaults.returnBase64,
			};
			param = mergeParam;

			if (!param.host) {
				console.log('没有指定服务器地址');
			}

			this.socketManger.createSocket(param,function(ret, err){
				if (ret) {
					var stateStr = '';

					if (ret.state > 100 && ret.state < 200) {
						this.sid = ret.sid;
						api.setPrefs({
							'SOCKETSID': ret.sid
						});
						if (ret.state === 101) {
							stateStr = 'socket连接已创建';
						} else if (ret.state === 102) {
							stateStr = 'socket已连接';
						} else if (ret.state === 103) {
							stateStr = 'socket收到消息';

							//收到服务器推送时
							var callbackParam = [];
							if (type == 'tcp') {
								callbackParam = [ret.data];
							} else if(type == 'udp') {
								callbackParam = [ret.data, ret.host, ret.port];
							}
							callback.apply(this, callbackParam);

						}
					} else if(ret.state > 200) {
						if (ret.state === 201) {
							stateStr = 'socket创建失败';
						} else if (ret.state === 202) {
							stateStr = 'socket连接失败';
						} else if (ret.state === 203) {
							stateStr = 'socket异常断开';
						} else if (ret.state === 204) {
							stateStr = 'socket已断开';
						} else if (ret.state === 205) {
							stateStr = 'socket未知错误';
						} else {
							stateStr = 'socket无状态码未知错误';
						}
						this.recreate();
					}

					api.toast({
						msg : stateStr,
						duration : 2000,
						location : 'middle'
					});
					console.log(stateStr);
				} else {
					console.log('yfsocket error:' + JSON.stringify(err));
					this.recreate();
				}
			});
		},
		//关闭socket连接
		close:function(){
			if (this.sid) {
				this.socketManger.closeSocket({
					sid: this.sid
				},function(ret, err){
					if (ret.status) {
						this.sid = null;
						this.socketManger = null;

						api.toast({
							msg : 'socket已成功关闭',
							duration : 2000,
							location : 'middle'
						});
						console.log('socket已成功关闭');
					} else {
						api.toast({
							msg : err.msg,
							duration : 2000,
							location : 'middle'
						});
						console.log(err.msg);
					}
				});
			}
		},
		//写入socket
		write:function(data, host, port){
			if (this.sid) {
				param = {
					sid : this.sid,
					data : data,
					base64 : defaults.writeBase64,
					host : host ? host : '',
					port : port ? port : 0,
				};

				this.socketManger.write(param, function(write_ret, write_err){
					if (write_ret.status) {
						console.log('socket写入成功');
					} else {
						console.log(write_err.msg);
						this.recreate();
					}
				});
			}
		},
		//断线重连
		recreate:function(){
			this.close();
			this.create(this.param, this.callback);
		}
	}

	//默认socket连接配置
	var defaults = {
		type : 'tcp',
		udpMode : 'unicast',
		host : '',
		port : 8282,
		localPort : 8282,
		timeout : 5,
		bufferSize : 16,	//16KB
		charset : 'utf-8',
		returnBase64 : false,	//create收到数据时是否返回base64编码后的数据
		writeBase64 : false,	//write发送的数据是否经过了base64处理,是的话会先decode再发送
	};

	window.yfsocket = yfsocket;
})(window);