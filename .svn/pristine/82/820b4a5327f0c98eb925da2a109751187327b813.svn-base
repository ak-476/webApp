
//设置本地存储
function set_local(key,val)
{
	$api.setStorage(key,val);
	//set_local(key, val);
}
//获取本地存储
function get_local(key)
{
	return $api.getStorage(key);
	//return get_local(key);
}
//json转字符串
function json2str(j)
{
	return JSON.stringify(j);
}
//字符串转json
function str2json(s)
{
	var json = eval('(' + s + ')');
	return json;
}
//是否是json对象
function is_json(obj) {
	var isjson = typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
	return isjson;
}
//判断字符串是否在array中
function in_array(stringToSearch, arrayToSearch)
{
 	for(s=0;s<arrayToSearch.length;s++)
	{
  		thisEntry = arrayToSearch[s].toString();
  		if(thisEntry == stringToSearch)
		{
   			return true;
  		}
 	}
 	return false;
}
/*
 *Loading
 */
function loading(time) {
	var str = "";
	str += '<div id="zv_Loading"></div><div id="zv_main"></div><div id="Loadbox">';
	str += '<div class="LoadBoxList">';
	str += '<div id="loadbg"><img src="../image/nobg.png" style="width:5em; height:5em"></div>';
	str += '<div id="loadingimgbox"><img src="../image/logo.png" id="loadingimg"></div>';
	str += '<div id="loadingimgboxtxt">加载中...</div>';
	str += '</div>';
	str += '</div>';
	var d = document.createElement('DIV');
	d.innerHTML = str;
	document.body.appendChild(d);
	if (parseInt(time) < 0) {
		document.getElementById("zv_main").style.display = "none";
		document.getElementById("Loadbox").style.display = "none";
		//fadeEffect.init('fadeIn', 1)
	}
	if (parseInt(time) == 0) {
		document.getElementById("zv_main").style.display = "block";
		document.getElementById("Loadbox").style.display = "block";
	}
	if (parseInt(time) > 0) {
		document.getElementById("zv_main").style.display = "block";
		document.getElementById("Loadbox").style.display = "block";
		setTimeout(function()
		{
			$api.css($api.byId("content"),"display:block");
			document.getElementById("zv_main").style.display = "none";
			document.getElementById("Loadbox").style.display = "none";
			//fadeEffect.init('fadeIn', 20)
		},time);
	}
}
/**
 * 判断是否是空
 * @param value
 */
function is_define(value)
{
	if (value == null || value == "" || value == "undefined" || value == undefined || value == "null" || value == "(null)" || value == 'NULL' || typeof (value) == 'undefined')
	{
		return false;
	}
	else
	{
		value = value + "";
		value = value.replace(/\s/g, "");
		if (value == "")
		{
			return false;
		}
		return true;
	}
}
//控制只能输入小数
function input_float(v)
{
    for(var i = v.value.length-1; i >= 0; i--)
    {
        if(!/^\d*\.?\d{0,2}$/.test(v.value))//只能输入两位小数
        {
            v.value=v.value.substr(0,v.value.length-1);
        }
    }
}
//控制只能输入整数
function input_int(v)
{
    v.value= v.value.replace(/[^\d]/g,'');
}
//是否手机号码
function is_mobile(v)
{
	var reg=/^0{0,1}(13[0-9]|18[0-9]|17[0-9]|14[0-9]|15[0-9])[0-9]{8}$/;
	return reg.test(v);
}
/**
 * 根据时间戳获取年、月、日
 * @param String str 时间戳
 * @param Boolean f 是否在原来的基础上*1000，true要*，false或不填就不*
 */
function timetostr(str,f)
{
	var t=(f)?parseInt(str):parseInt(str)*1000;
	var datetime=new Date(t);
	var y=datetime.getFullYear();
	var m=num_two(datetime.getMonth()+1);
	var d=num_two(datetime.getDate());
	var hour=num_two(datetime.getHours());
	var min=num_two(datetime.getMinutes());
	var sec=num_two(datetime.getSeconds());
	return y+"-"+m+"-"+d+" "+hour+":"+min+":"+sec;
}

//自动补零
function num_two(s)
{
	return (parseInt(s)>9)?s:'0'+s;
}

//控制台日志
function log(s)
{
	console.log(s);
}