/*
 * weibo.js
 * @author zhangwei  2017-02-18
 * 微博相关通用功能的整合
 */

 var loginUserId = $api.getStorage('user').id;
 /**
  * [photoBrowser 大图浏览功能]
  * @param  {[string]} imgUrls    [大图远程地址列表]
  * @param  {[int]} index         [图片索引值]
  * @param  {[int]} attachment_id [weibo_id]
  */
 function photoBrowser(imgUrls,weibo_id,index){
  	window.event.cancelBubble = true;//禁止向上冒泡
	var imgUrls = imgUrls;
		imgUrls = imgUrls.split(",");// 变成图片数组
	var imageBrowser = api.require('imageBrowser');
	var folder = "weiboList"; //大图文件夹地址名称
	var id     = "bigImgList" + weibo_id; // 大图文件名称
	 bigImgCache(imgUrls,folder,id,function(ret){
		//console.log('大图图片列表'+ JSON.stringify(ret));
			imageBrowser.openImages({
			 imageUrls : ret,//数组
			 activeIndex:index
		   });
	});
}

/**
 * [transmit description]
 * @param  {[type]} transmitInfo [转发信息]
 * @param  {[type]} fwinner      [是否在评论里 或转发列表里点击的转发]
 */
function transmit(transmitInfo,fwinner){
	window.event.cancelBubble = true;//禁止向上冒泡
	//TODO content截取信息
	// alert('类型' + transmitInfo.type);
	if(transmitInfo.type == 1){
		// 原创微博
		if(isDefine(fwinner)){
			// 评论和转发列表的操作
			var transmitInfo = {
				weiboId:transmitInfo.weibo_id,
				thumbImg:transmitInfo.attach ? transmitInfo.attach[0].url : transmitInfo.user_data.avatar ,
				nickname:transmitInfo.user_data.nickname,
				nonceContent: transmitInfo.content,
				inputInfo:{
					inputNickname:transmitInfo.tcNickname,
					inputContent:transmitInfo.tcContent,
				}
			};
		}else{
			//底部转发按钮的操作
			var transmitInfo = {
				weiboId:transmitInfo.weibo_id,
				thumbImg:transmitInfo.attach ? transmitInfo.attach[0].url : transmitInfo.user_data.avatar ,
				nickname:transmitInfo.user_data.nickname,
				nonceContent: transmitInfo.content,
			};
		}
	}else{
		// 转发微博信息
		if(isDefine(fwinner)){
			// 评论和转发列表的操作
			var transmitInfo = {
				weiboId:transmitInfo.original_weibo.weibo_id,
				thumbImg:transmitInfo.original_weibo.attach ? transmitInfo.original_weibo.attach[0].url : transmitInfo.original_weibo.user_data.avatar,
				nickname:transmitInfo.original_weibo.user_data.nickname,
				nonceContent: transmitInfo.original_weibo.content,
				inputInfo:{
					inputNickname:transmitInfo.user_data.nickname,
					inputContent:transmitInfo.content,
				}
			};
		}else{
			//底部转发按钮的操作
			var transmitInfo = {
				weiboId:transmitInfo.original_weibo.weibo_id,
				thumbImg:transmitInfo.original_weibo.attach ? transmitInfo.original_weibo.attach[0].url : transmitInfo.original_weibo.user_data.avatar,
				nickname:transmitInfo.original_weibo.user_data.nickname,
				nonceContent: transmitInfo.original_weibo.content,
				inputInfo:{
					inputNickname:transmitInfo.user_data.nickname,
				}
			};
		}

	}
	// alert('转发信息2' + $api.jsonToStr(transmitInfo));
	openWin('transmit_weibo_win','transmit_weibo_win.html',{transmitInfo:transmitInfo});
}

// 发送评论或回复评论
function comment(id){
	// showToast('开发中',2000,'middle');
	window.event.cancelBubble = true;//禁止向上冒泡
	openWin('send_comment_win','send_comment_win.html',{id:id});
}
// 点赞功能
function praise(id,type){
	window.event.cancelBubble = true;//禁止向上冒泡
	var fullUrl = serverUrl + 'index.php?g=Weibo&m=Weibo&a=praise';
	var data    = {values:{id:id,type:type}};
	runAjax(fullUrl,data,function(ret){
		if(ret.error){
			showToast(ret.error_msg);
		}else{
			// alert(JSON.stringify(ret));
			showToast(ret.data.msg,2000,'middle');
			//TODO 加1或减1
			if(ret.data.type == 'praise'){
				// 加1
			}else{
				// 减1
			}

		}
	});
}


//TODO 待完善
//对微博的相关操作功能

// 微博列表弹出层
function weiboListActionSheet(weiboId,isDel){
	//TODO 判断是否是自己的微博，然后是否显示 删除微博 或 取消关注
	window.event.cancelBubble = true;//禁止向上冒泡
	var actionsheet = new auiActionsheet();
	actionsheet.init({
		frameBounces:true,//当前页面是否弹动,
		title:"请在这里操作",
		destructiveTitle:isDel ? '删除' : false,
		buttons:['取消关注','举报']
	},function(ret){
		if(ret){
			switch(ret.buttonIndex){
				case 1:
					unFollow(weiboId); //取消关注
				break;
				case 2:
				 	OpenWeiboReport(weiboId); //打开举报界面
				break;
				case 3:
					delWeibo(weiboId); //删除微博
				break;
			}
		}
	})

}

/**
 * [openActionsheet 微博详情页弹出操作提示]
 * @param  {[type]}  id              [微博id | 评论Id]
 * @param  {[type]}  transmitInfo    [转发微博的相关信息]
 * @param  {Boolean} tcNickname      [转发列表的微博 或 评论列表 的用户昵称]
 * @param  {Boolean} tcContent       [评论或转发里的内容]
 * @param  {Boolean} isWeibo         [是否是微博]
 * @param  {Boolean} isDel           [是否显示删除按钮]
 */
function openActionsheet(id,transmitInfo,tcNickname,tcContent,isWeibo,isDel){
	//TODO 判断是否是自己的微博 或 评论 来决定是否 显示删除按钮
	window.event.cancelBubble = true;//禁止向上冒泡
	transmitInfo.tcNickname = tcNickname; // 转发 或评论列表的昵称
	transmitInfo.tcContent =  tcContent; // 转发 或评论列表的昵称
	// alert('转发信息2'+ JSON.stringify(transmitInfo));
	// 判断是原创微博还是转发微博
	if(isDefine(isWeibo)){
		var buttons = ['回复','转发','举报','查看该微博'];
	}else{
		var buttons = ['回复','转发','举报']
	}

	var actionsheet = new auiActionsheet();
	 //TODO  过滤
	actionsheet.init({
		frameBounces:true,//当前页面是否弹动,
		title:"请在这里操作",
		destructiveTitle:isDel ? '删除' : false,
		buttons:buttons
	},function(ret){
		if(ret){
			// alert('序号' + ret.buttonIndex);
			switch(ret.buttonIndex){
				case 1:
					comment(id); //打开评论界面
				break;
				case 2:
					transmit(transmitInfo,true); // tc 代表转发和评论里的操作
				break;
				case 3:
				   OpenWeiboReport(id); //打开举报界面
				break;
				case 4:
				   weiboDetail(id); //打开微博详情界面
				break;
				case 5:
				 if(isDefine(isWeibo)){
				 	delWeibo(id,'weiboDetail');
				 }else{
				 	delComment(id);
				 }
				break;
			}
		}
	})
}

// 移除图片功能
function removeImg(thisdel) {
	//thisdel.parentNode.parentNode.removeChild(thisdel.parentNode);
	$api.remove(thisdel.parentNode);
}

// 选择图片功能
function selectPhoto() {
	window.event.cancelBubble = true;//禁止向上冒泡
	UIMediaScanner = api.require('UIMediaScanner');
	UIMediaScanner.open({
		type: 'picture',
		column: 4,
		classify: true,
		max: 4,
		sort: {
			key: 'time',
			order: 'desc'
		},
		texts: {
			stateText: '已选择*项',
			cancelText: '取消',
			finishText: '完成'
		},
		styles: {
			bg: '#fff',
			mark: {
				icon: '',
				position: 'bottom_left',
				size: 30
			},
			nav: {
				bg: '#eee',
				stateColor: '#000',
				stateSize: 18,
				cancelBg: 'rgba(0,0,0,0)',
				cancelColor: '#000',
				cancelSize: 18,
				finishBg: 'rgba(0,0,0,0)',
				finishColor: '#000',
				finishSize: 18
			}
		},
		scrollToBottom: {
			intervalTime: -1,
			anim: true
		},
		showPreview: true,
		showBrowser: true,
		exchange: true,
		rotation: false
	}, function(ret) {
		if (ret) {
			// TODO 判断苹果系统 转换 path
			var strDM = api.systemType;
			if (strDM == 'ios') {
				UIMediaScanner.transPath({
					path: ''
				}, function(ret, err) {
					if (ret) {
						alert(JSON.stringify(ret));
					} else {
						alert(JSON.stringify(err));
					}
				});
			}
			for (i in ret.list) {
				var html = '';
				html += '<div class="aui-col-xs-4">';
				html += '<img class="weiboImg" src="' + ret.list[i].thumbPath + '">';
				html += '<div class="aui-badge removeImg" tapmode onclick="removeImg(this)">X</div>';
				html += '</div>';
				var imgList = document.getElementById('imgList');
				$api.prepend(imgList, html);
			}
		}
	});
}

// at别人
function call() {
	setInputValue('@张伟: ');
	var UIInput = api.require('UIInput');
	UIInput.popupKeyboard({
		 id:0
	});
}


// 打开举报界面
function OpenWeiboReport() {
	openWin('weibo_report', './weibo_report_win.html');
}

function delWeibo(weiboId,type){
	confirm('删除操作','删除删除这条微博么?',function(ret){
		var fullUrl = serverUrl + 'index.php?g=Weibo&m=Weibo&a=delete';
		var data 	= {values:{weibo_id:weiboId}};
		runAjax(fullUrl,data,function(ret){
			if(ret.error){
				showToast(ret.error_msg);
			}else{
				showToast('删除成功');
				if(type == 'weiboList'){
					pushDown(function(ret) {
						weiboList('pushDown', 'weiboListT', 'weiboList');
					});
				}else{
					//TODO 直接执行转发的方法会没有数据，只能发送监听？
					//weiboTransmit(true,weiboId,'transmitListT','transmitList'); //微博转发列表
					api.sendEvent({
						 name: 'updateList',
					});
				}

			}
		});
	})
}

function delComment(commentId){
	confirm('删除操作','删除删除这条评论么?',function(ret){
		var fullUrl = serverUrl + 'index.php?g=Weibo&m=Weibo&a=delcomment';
		var data 	= {values:{comment_id:commentId}};
		runAjax(fullUrl,data,function(ret){
			if(ret.error){
				showToast(ret.error_msg);
			}else{
				showToast('删除成功');
				weiboCommentList(true,weiboId,'commentListT','commentList'); //微博评论列表
			}
		});
	})
}

//用户微博页面
function userAlbum(targetId){
	window.event.cancelBubble = true; //禁止向上冒泡
	openWin('user_album_win'+ Date.parse(new Date()),'../user/user_album_win.html',{targetId:targetId});
}
//@匹配
function  weiboContentReplace(content,atData){
	// alert('替换的数据' + $api.jsonToStr(atData));
    var content = content.replace(/(@(.+?))([\s:\/])/g,'<span style="color:#00bcd4" tapmode onclick="userAlbum(' + atData["羿风"] + ')">$1</span>$3');
   // content =  content.replace(/(@(.+?))([\s:\/])/g, function(){
   //    for(i in arguments){
   //  	}
	 	// return '<span style="color:#00bcd4" tapmode onclick="userAlbum('+ atData[arguments[2]]+ ')">'+ arguments[1]+'</span>' +arguments[3];
   //   });

   // 	console.log('replaced :'+content);
   return content;
}

// 微博详情
function weiboDetail(weiboId) {
	alert('呵呵哒了');
	var time = new Date();
	openWin('weibo_user_detail_win' + time, '../weibo/weibo_user_detail_win.html', {
		weiboId: weiboId
	});
}

// 微博用户介绍页
function weiboUserIntroduce(userId) {
	// alert(oldTime);
	window.event.cancelBubble = true;//禁止向上冒泡
	openWin('weibo_user_introduce_win' + Date.parse(new Date()), 'weibo_user_introduce_win.html', {
		userId: userId
	});
}


// 取消关注
function unFollow(targetId){
	confirm('取消关注','您确定取消关注么?',function(ret){
		var fullUrl = serverUrl + 'index.php?g=Weibo&m=User&a=unfollow';
			var data ={values:{target_uid:targetId,approved:1}};
			runAjax(fullUrl,data,function(ret){
				if(ret.error){
					showToast(ret.error_msg);
				}else{
					showToast(ret.data.msg);
					api.refreshHeaderLoading(); //调用下拉刷新组件
				}
		  });
	});
}

//顶部弹出层

function showPopup() {
	var popup = new auiPopup();
	popup.show(document.getElementById("top"));
}

//测试
function test() {
	showToast('开发中', 2000, 'middle');
}