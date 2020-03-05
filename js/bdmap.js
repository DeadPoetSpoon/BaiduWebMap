import {showAlert,popAlert} from './showAlert.js';
//显示欢迎信息,并在10秒后删除
showAlert("info","欢迎！",'这是基于<a href="http://lbsyun.baidu.com/" class="alert-link"><strong>百度API</strong></a>简单实现的WebGIS网页。');
setTimeout(function () {
    popAlert(1);
}, 3000 )
//构造全局变量map
var map = new BMap.Map("BdMapContainer");
//map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  
function initMap() {
    //初始化中心点及缩放层级
    map.centerAndZoom(new BMap.Point(114.365,30.534),17);
    //初始化地图控件
    //平移缩放比例尺
    map.addControl(new BMap.NavigationControl());    
    map.addControl(new BMap.ScaleControl());
    //有问题，map未定义
    // // 添加带有定位的导航控件
    // var navigationControl = new BMap.NavigationControl({
    //     // 靠左上角位置
    //     anchor: BMAP_ANCHOR_TOP_LEFT,
    //     // LARGE类型
    //     type: BMAP_NAVIGATION_CONTROL_LARGE,
    //     // 启用显示定位
    //     enableGeolocation: true
    // });
    // map.addControl(navigationControl);
    // // 添加定位控件
    // var geolocationControl = new BMap.GeolocationControl();
    // geolocationControl.addEventListener("locationSuccess", function(e){
    //     // 定位成功事件
    //     var address = '';
    //     address += e.addressComponent.province;
    //     address += e.addressComponent.city;
    //     address += e.addressComponent.district;
    //     address += e.addressComponent.street;
    //     address += e.addressComponent.streetNumber;
    //     //alert("当前定位地址为：" + address);
    //     showAlert("success","定位成功！","您的位置为：<strong>"+address+"</strong>");
    // });
    // geolocationControl.addEventListener("locationError",function(e){
    //     // 定位失败事件
    //     //alert(e.message);
    //     showAlert("danger","定位失败！","错误信息：<strong>"+e.message+"</strong>");
    // });
    // map.addControl(geolocationControl);
    //切换城市控件
    var size = new BMap.Size(60, 20);
    map.addControl(new BMap.CityListControl({
    anchor: BMAP_ANCHOR_TOP_LEFT,
    offset: size,
    // 切换城市之前事件
    // onChangeBefore: function(){
    //    alert('before');
    // },
    // 切换城市之后事件
    // onChangeAfter:function(){
    //   alert('after');
    // }
    }));
    //添加地图类型切换及缩略图控件
    var mapType1 = new BMap.MapTypeControl(
		{
			mapTypes: [BMAP_NORMAL_MAP,BMAP_HYBRID_MAP],
			anchor: BMAP_ANCHOR_TOP_RIGHT
		}
    );
    var overView = new BMap.OverviewMapControl();
    var overViewOpen = new BMap.OverviewMapControl({isOpen:true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT});
    map.addControl(mapType1);          //2D图，混合图
    map.addControl(overView);          //添加默认缩略地图控件
    map.addControl(overViewOpen);      //右下角，打开
    //启用滚轮
    map.enableScrollWheelZoom(true);
}
function getCurLocation() {
    showAlert("info","开始定位...","请稍后。");
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            var mk = new BMap.Marker(r.point);
            map.addOverlay(mk);
            map.panTo(r.point);
            map.setZoom(8);
            //alert('您的位置：'+r.point.lng+','+r.point.lat);
            var geoc = new BMap.Geocoder();
            geoc.getLocation(r.point, function(rs){
                var addComp = rs.addressComponents;
                //alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
                popAlert(2);
                showAlert("success","定位成功！","您的位置为：<strong>"+addComp.province + ", " + addComp.city + "</strong>("+r.point.lng+","+r.point.lat+")");
            }); 
        }
        else {
            popAlert(2);
            showAlert("danger","定位失败！","错误信息：<strong>"+this.getStatus()+"</strong>");
            //alert('failed'+this.getStatus());
        }        
    });
}
function isLngLat(str) {
    var point = str.split(',');
    var n = Number(point[0]);
    if (!isNaN(n))
    {
        return point[0]<=180&&point[0]>=0&&point[1]<=90&&point[1]>=0?point:false;
    }
    return false;
}
function getLngLatLocation(myGeoCoder,lng,lat) {
    myGeoCoder.getLocation(new BMap.Point(lng,lat), function(rs){
        map.centerAndZoom(new BMap.Point(lng,lat), 16);
        var addComp = rs.addressComponents;
        //alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
        addMarker(new BMap.Point(lng,lat),addComp.province + addComp.city  + addComp.district  + addComp.street  + addComp.streetNumber);
    }); 
}
function getTextLocation(myGeoCoder,text) {
    myGeoCoder.getPoint(text, function(point){
		if (point) {
			map.centerAndZoom(point, 16);
			addMarker(point,text);
		}else{
            //alert("在武汉市，您选择地址没有解析到结果!");
            showAlert("danger","失败！","<strong>"+text+"</strong>输入错误,请重新输入正确的位置信息。");
		}
	},"error");
}
function addMarker(point,text){
    var marker = new BMap.Marker(point);
    marker.closeInfoWindow()
    var label = new BMap.Label("&nbsp"+text,{offset:new BMap.Size(20,-10)})
    label.addEventListener("rightclick",function(){
        map.removeOverlay(label);
    });
    label.setStyle({color:"black",fontSize:"20px",backgroundColor:"black"});
    marker.enableMassClear();
    map.addOverlay(marker);
    marker.setLabel(label);
    marker.setTitle("右键删除标签");
    marker.addEventListener("rightclick", function(){
        map.removeOverlay(marker);
    });
}
//初始化地图
initMap();
//基础面板初始化
//初始化自动补全
var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
    {"input" : "ACSearchCon"
    ,"location" : map
});
ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
	var _value = e.item.value;
	var myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
    $("#ACSearchCon").val(myValue);
    getTextLocation(new BMap.Geocoder(),myValue);
});
$("#Btn_ACSearch").click(function (e) { 
    e.preventDefault();
    var text = $("#ACSearchCon").val();
    if(text.length<1){
        showAlert("danger","输入为空！","<strong>请在输入框输入搜索内容。</strong>");
    }
    getTextLocation(new BMap.Geocoder(),text);
});
//添加定位按钮点击事件
$("#Btn_MyLocal").click(function (e) { 
    e.preventDefault();
    getCurLocation();
});
//添加坐标拾取点击事件
var nClickLngLat = 0;
var lnglatevent = function (e) {
    $("#ClickLngLatCon").val(e.point.lng + ", " + e.point.lat);
}
$("#Btn_ClickLngLat").click(function () { 
    if(nClickLngLat%2==0){
        //console.log("选中");
        map.addEventListener("click",lnglatevent);
    }else{
        //console.log("未选中");
        map.removeEventListener("click",lnglatevent);
    }
    nClickLngLat++;
});
//添加输入搜索按钮点击事件
$("#Btn_SearchLocal").click(function (e) { 
    e.preventDefault();
    var text = $("#SearchLocalCon").val();
    if(text.length<1){
        showAlert("danger","输入为空！","<strong>请在输入框输入搜索内容。</strong>");
        //popAlert(1);
    }
    //console.log(text);
    var textArray = text.split(';');
    var myGeo = new BMap.Geocoder();
    for (var i=0;i<textArray.length;i++){
        var input = isLngLat(textArray[i]);
        if(input){
            getLngLatLocation(myGeo,input[0],input[1]);
        }else{
            getTextLocation(myGeo,textArray[i]);
        }
    }
});
//添加清楚地图覆盖物按钮点击事件
$("#clearOverlay0").click(function (e) { 
    e.preventDefault();
    map.clearOverlays();
});
//添加关键字检索按钮点击事件
$("#Btn_KeySearch").click(function (e) { 
    e.preventDefault();
    if($("#KeySearchCon").val().length==0){
        showAlert("danger","输入为空！","<strong>请在输入框输入搜索内容。</strong>");
        return;
    }
    $("#ShHiRRuseult").show();
    var myKeys = $("#KeySearchCon").val().split(';');
    var local = new BMap.LocalSearch(map, {
		renderOptions:{map: map, panel:"r-result"},
    });
    //console.log(myKeys.length);
    if(myKeys.length==1){
        local.setPageCapacity(4);
    }else if(myKeys.length==2){
        local.setPageCapacity(2);
    }else{
        local.setPageCapacity(1);
    }
    //local.searchInBounds(myKeys, map.getBounds());
    local.search(myKeys);
});
//添加矩形区域检索按钮点击事件，写了两份有点多余
$("#Btn_RectSearch").click(function (e) { 
    e.preventDefault();
    if($("#RectSearchCon").val().length==0){
        showAlert("danger","输入为空！","<strong>请在输入框输入搜索内容。</strong>");
        return;
    }
    $("#ShHiRectRuseult").show();
    //配置颜色
    var styleOptions = {
        strokeColor:"red",    //边线颜色。
        fillColor:"blue",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
        fillOpacity: 0.3,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
    }
    //实例化鼠标绘制工具
    var drawingManager = new BMapLib.DrawingManager(map, {
        isOpen: true, //是否开启绘制模式
        enableDrawingTool: false, //是否显示工具栏
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(5, 5), //偏离值
        },
        circleOptions: styleOptions, //圆的样式
        polylineOptions: styleOptions, //线的样式
        polygonOptions: styleOptions, //多边形的样式
        rectangleOptions: styleOptions //矩形的样式
    });
    //设置模式会绘制矩形
    drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE);
    showAlert("info","请绘制矩形","鼠标拖动来绘制。");
	//添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingManager.addEventListener('rectanglecomplete',function (overlay) {
        popAlert(1);
        var myKeys = $("#RectSearchCon").val().split(';');
        var local = new BMap.LocalSearch(map, {
            renderOptions:{map: map, panel:"Rect-result"},
        });
        if(myKeys.length==1){
            local.setPageCapacity(4);
        }else if(myKeys.length==2){
            local.setPageCapacity(2);
        }else{
            local.setPageCapacity(1);
        }
        //console.log('overlay :', overlay);
        local.searchInBounds(myKeys, overlay.getBounds());
        drawingManager.close();
        map.clearOverlays();
    });    
});
//添加圆形区域检索按钮点击事件，写了两份有点多余
$("#Btn_CircleSearch").click(function (e) { 
    e.preventDefault();
    if($("#CircleSearchCon").val().length==0){
        showAlert("danger","输入为空！","<strong>请在输入框输入搜索内容。</strong>");
        return;
    }
    $("#ShHiCircleRuseult").show();
    //配置颜色
    var styleOptions = {
        strokeColor:"red",    //边线颜色。
        fillColor:"blue",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
        fillOpacity: 0.3,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
    }
    //实例化鼠标绘制工具
    var drawingManager = new BMapLib.DrawingManager(map, {
        isOpen: true, //是否开启绘制模式
        enableDrawingTool: false, //是否显示工具栏
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(5, 5), //偏离值
        },
        circleOptions: styleOptions, //圆的样式
        polylineOptions: styleOptions, //线的样式
        polygonOptions: styleOptions, //多边形的样式
        rectangleOptions: styleOptions //矩形的样式
    });
    //设置模式会绘制矩形
    drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
    showAlert("info","请绘制圆形","鼠标拖动来绘制。");
	//添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingManager.addEventListener('circlecomplete',function (overlay) {
        popAlert(1);
        var myKeys = $("#CircleSearchCon").val().split(';');
        var local = new BMap.LocalSearch(map, {
            renderOptions:{map: map, panel:"Circle-result"},
        });
        if(myKeys.length==1){
            local.setPageCapacity(4);
        }else if(myKeys.length==2){
            local.setPageCapacity(2);
        }else{
            local.setPageCapacity(1);
        }
        //console.log('overlay :', overlay);
        local.searchNearby(myKeys,overlay.getCenter(),overlay.getRadius());
        drawingManager.close();
        //map.clearOverlays();
    });    
});
