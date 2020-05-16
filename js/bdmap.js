import AlertTool from './showAlert.js';
import DrawTool from './drawtool.js';
import GeoJsonTool from './geojsontool.js';

//显示欢迎信息,*并在10秒后删除*
AlertTool.showAlert("info","欢迎！",'这是基于<a href="http://lbsyun.baidu.com/" class="alert-link"><strong>百度API</strong></a>简单实现的WebGIS网页。');
// setTimeout(function () {
//     AlertTool.popAlert(2);
// }, 3000 )
//=======================================================================
//构造全局变量map
var map = new BMap.Map("BdMapContainer");
var drawtool = new DrawTool(map);
//map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  
function initMap() {
    //初始化中心点及缩放层级
    map.centerAndZoom(new BMap.Point(114.365,30.534),17);
    //初始化地图控件
    //平移缩放比例尺
    map.addControl(new BMap.NavigationControl());    
    map.addControl(new BMap.ScaleControl());
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
    //getCurLocation();
}
//获得当前位置
function getCurLocation() {
    AlertTool.showAlert("info","开始定位...","请稍后。");
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
                AlertTool.popAlert(2);
                AlertTool.showAlert("success","定位成功！","您的位置为：<strong>"+addComp.province + ", " + addComp.city + "</strong>("+r.point.lng+","+r.point.lat+")");
            }); 
        }
        else {
            AlertTool.popAlert(2);
            AlertTool.showAlert("danger","定位失败！","错误信息：<strong>"+this.getStatus()+"</strong>");
            //alert('failed'+this.getStatus());
        }        
    });
}
//判断是否为符合格式0,0的经纬度,并返回经纬度
function isLngLat(str) {
    var point = str.split(',');
    var n = Number(point[0]);
    if (!isNaN(n))
    {
        return point[0]<=180&&point[0]>=0&&point[1]<=90&&point[1]>=0?point:false;
    }
    return false;
}
//获得经纬度坐标
function getLngLatLocation(myGeoCoder,lng,lat) {
    myGeoCoder.getLocation(new BMap.Point(lng,lat), function(rs){
        map.centerAndZoom(new BMap.Point(lng,lat), 16);
        var addComp = rs.addressComponents;
        //alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
        addMarker(new BMap.Point(lng,lat),addComp.province + addComp.city  + addComp.district  + addComp.street  + addComp.streetNumber);
    }); 
}
//获得字符串位置
function getTextLocation(myGeoCoder,text) {
    myGeoCoder.getPoint(text, function(point){
		if (point) {
			map.centerAndZoom(point, 16);
			addMarker(point,text);
		}else{
            //alert("在武汉市，您选择地址没有解析到结果!");
            AlertTool.showAlert("danger","失败！","<strong>"+text+"</strong>输入错误,请重新输入正确的位置信息。");
		}
	},"error");
}
//添加Marker
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
//=======================================================================================
//初始化地图
initMap();
//=======================================================================================
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
        AlertTool.showAlert("danger","输入为空！","<strong>请在输入框输入搜索内容。</strong>");
    }
    getTextLocation(new BMap.Geocoder(),text);
});
//========================================================================================
//添加定位按钮点击事件
$("#Btn_MyLocal").click(function (e) { 
    e.preventDefault();
    getCurLocation();
});
//==========================================================================================
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
//============================================================================================
//添加输入搜索按钮点击事件
$("#Btn_SearchLocal").click(function (e) { 
    e.preventDefault();
    var text = $("#SearchLocalCon").val();
    if(text.length<1){
        AlertTool.showAlert("danger","输入为空！","<strong>请在输入框输入搜索内容。</strong>");
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
//=============================================================================================
//添加清楚地图覆盖物按钮点击事件
$("#clearOverlay0").click(function (e) { 
    e.preventDefault();
    map.clearOverlays();
});
//==============================================================================================
//添加关键字检索按钮点击事件
$("#Btn_KeySearch").click(function (e) { 
    e.preventDefault();
    if($("#KeySearchCon").val().length==0){
        AlertTool.showAlert("danger","输入为空！","<strong>请在输入框输入搜索内容。</strong>");
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
//===================================================================================================
//添加矩形区域检索按钮点击事件，写了两份有点多余，使用ES6类结构解决
$("#Btn_RectSearch").click(function (e) { 
    e.preventDefault();
    if($("#RectSearchCon").val().length==0){
        AlertTool.showAlert("danger","输入为空！","<strong>请在输入框输入搜索内容。</strong>");
        return;
    }
    $("#ShHiRectRuseult").show();
    //设置模式会绘制矩形
    drawtool.setMode(BMAP_DRAWING_RECTANGLE);
    drawtool.open();
    AlertTool.showAlert("info","请绘制矩形","鼠标拖动来绘制。");
    drawtool.addListener('rectanglecomplete',function (overlay) {
        AlertTool.popAlert(1);
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
        //drawingManager.close();
        drawtool.close();
        map.clearOverlays();
    });        
});
//添加圆形区域检索按钮点击事件，写了两份有点多余，使用ES6类结构解决
$("#Btn_CircleSearch").click(function (e) { 
    e.preventDefault();
    if($("#CircleSearchCon").val().length==0){
        AlertTool.showAlert("danger","输入为空！","<strong>请在输入框输入搜索内容。</strong>");
        return;
    }
    $("#ShHiCircleRuseult").show();
    //设置模式会绘制矩形
    drawtool.setMode(BMAP_DRAWING_CIRCLE);
    drawtool.open();
    AlertTool.showAlert("info","请绘制圆形","鼠标拖动来绘制。");
	//添加鼠标绘制工具监听事件，用于获取绘制结果
    drawtool.addListener('circlecomplete',function (overlay) {
        AlertTool.popAlert(1);
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
        //drawingManager.close();
        drawtool.close();
        map.clearOverlays();
    });    
});
//==============================================================================================
//为步行导航添加自动完成对象
var acWaldBe = new BMap.Autocomplete(    //建立一个自动完成的对象
    {"input" : "WalkBeCon"
    ,"location" : map
});
var acWaldFi = new BMap.Autocomplete(    //建立一个自动完成的对象
    {"input" : "WalkFiCon"
    ,"location" : map
});
acWaldBe.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
	var _value = e.item.value;
	var myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
    $("#WalkBeCon").val(myValue);
});
acWaldFi.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
	var _value = e.item.value;
	var myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
    $("#WalkFiCon").val(myValue);
});
//单机按钮事件
$("#Btn_Walk").click(function (e) { 
    if($("#WalkBeCon").val().length==0){
        AlertTool.showAlert("danger","起点输入为空！","<strong>请在输入框输入导航内容。</strong>");
        return;
    }
    if($("#WalkFiCon").val().length==0){
        AlertTool.showAlert("danger","终点输入为空！","<strong>请在输入框输入导航内容。</strong>");
        return;
    }
    e.preventDefault();
    map.clearOverlays();
    var walking = new BMap.WalkingRoute(map, {renderOptions: {map: map, panel: "Walk-result", autoViewport: true}});
	walking.search($("#WalkBeCon").val(), $("#WalkFiCon").val());
});
//==============================================================================================
//为驾车导航自动添加自动完成对象
var acWaldBe = new BMap.Autocomplete(    //建立一个自动完成的对象
    {"input" : "DrivingBeCon"
    ,"location" : map
});
var acWaldFi = new BMap.Autocomplete(    //建立一个自动完成的对象
    {"input" : "DrivingFiCon"
    ,"location" : map
});
acWaldBe.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
	var _value = e.item.value;
	var myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
    $("#DrivingBeCon").val(myValue);
});
acWaldFi.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
	var _value = e.item.value;
	var myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
    $("#DrivingFiCon").val(myValue);
});
//单机按钮事件
$("#Btn_Driving").click(function (e) { 
    if($("#DrivingBeCon").val().length==0){
        AlertTool.showAlert("danger","起点输入为空！","<strong>请在输入框输入导航内容。</strong>");
        return;
    }
    if($("#DrivingFiCon").val().length==0){
        AlertTool.showAlert("danger","终点输入为空！","<strong>请在输入框输入导航内容。</strong>");
        return;
    }
    e.preventDefault();
    map.clearOverlays();
    var routePolicy = [BMAP_DRIVING_POLICY_LEAST_TIME,BMAP_DRIVING_POLICY_LEAST_DISTANCE,BMAP_DRIVING_POLICY_AVOID_HIGHWAYS];
    var route = routePolicy[$("#DrivingSelect").val()];
    var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map,panel: "Driving-result",enableDragging : true, autoViewport: true},policy: route});
    driving.search($("#DrivingBeCon").val(),$("#DrivingFiCon").val());
});
//===================================================================================
var acWaldBe = new BMap.Autocomplete(    //建立一个自动完成的对象
    {"input" : "TransitBeCon"
    ,"location" : map
});
var acWaldFi = new BMap.Autocomplete(    //建立一个自动完成的对象
    {"input" : "TransitFiCon"
    ,"location" : map
});
acWaldBe.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
	var _value = e.item.value;
	var myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
    $("#TransitBeCon").val(myValue);
});
acWaldFi.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
	var _value = e.item.value;
	var myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
    $("#TransitFiCon").val(myValue);
});
//单机按钮事件
$("#Btn_Transit").click(function (e) { 
    if($("#TransitBeCon").val().length==0){
        AlertTool.showAlert("danger","起点输入为空！","<strong>请在输入框输入导航内容。</strong>");
        return;
    }
    if($("#TransitFiCon").val().length==0){
        AlertTool.showAlert("danger","终点输入为空！","<strong>请在输入框输入导航内容。</strong>");
        return;
    }
    e.preventDefault();
    map.clearOverlays();
    var routePolicy = [BMAP_TRANSIT_POLICY_LEAST_TIME,BMAP_TRANSIT_POLICY_LEAST_TRANSFER,BMAP_TRANSIT_POLICY_LEAST_WALKING,BMAP_TRANSIT_POLICY_AVOID_SUBWAYS];
    var route = routePolicy[$("#TransitSelect").val()];
    var transit = new BMap.TransitRoute(map, {renderOptions:{map: map,panel: "Transit-result",enableDragging : true, autoViewport: true},policy: route});
    transit.search($("#TransitBeCon").val(),$("#TransitFiCon").val());
});
//=======================================================================================
//目标计数器
var objNum=0;
//======================================================================================
//画点
$("#Point_Start").click(function (e) { 
    e.preventDefault();
    if(objNum != 0){
        AlertTool.showAlert("danger","编辑未完成!","<strong>请先完成上一项编辑内容。</strong>");
        return;
    }
    map.clearOverlays();
    //新建一个GeoJson对象
    var geoJsonTool = new GeoJsonTool();
    //设置模式会绘制矩形
    drawtool.setMode(BMAP_DRAWING_MARKER);
    drawtool.open();
    AlertTool.showAlert("info","请绘制点","鼠标点击来绘制。");
    drawtool.addListener('markercomplete',function (point) {
        geoJsonTool.addPoint(point.getPosition(),{ObjNum:objNum++});
        geoJsonTool.showJson("#Point_GeoJson");
    });
    $("#Point_Save").click(function (e) { 
        e.preventDefault();
        if($("#Point_SaveName").val().length==0){
            AlertTool.showAlert("danger","文件名输入为空！","<strong>请在输入框输入文件名。</strong>");
            return;
        }
        geoJsonTool.saveJson($("#Point_SaveName").val());
    });
    $("#Point_AddProp").click(function (e) { 
        e.preventDefault();
        if($("#Point_Prop").val().length==0){
            AlertTool.showAlert("danger","属性值输入为空！","<strong>请在输入框输入属性值。</strong>");
            return;
        }
        var props = $("#Point_Prop").val().split(';');
        for(var i=0;i<props.length;i++){
            var strs =  props[i].split(',');
            if(strs.length < 2 || strs.length > 3){
                AlertTool.showAlert("danger","属性值输入错误！","<strong>"+props[i]+"输入错误。</strong>");
            }else if(strs.length == 2){
                geoJsonTool.addProperties(-1,strs[0],strs[1]);
            }else if(strs.length == 3){
                geoJsonTool.addProperties(parseInt(strs[0]),strs[1],strs[2]);
            }
        }
        geoJsonTool.showJson("#Point_GeoJson");
    });
    $("#Point_Stop").click(function (e) { 
        e.preventDefault();
        objNum = 0;
        drawtool.close();
        map.clearOverlays();
        AlertTool.popAlert(2);
    });
});
//======================================================================================
//画线
$("#PolyLine_Start").click(function (e) { 
    e.preventDefault();
    if(objNum != 0){
        AlertTool.showAlert("danger","编辑未完成!","<strong>请先完成上一项编辑内容。</strong>");
        return;
    }
    //清除覆盖物及禁用双击放大
    map.clearOverlays();
    map.disableDoubleClickZoom();
    //新建一个GeoJson对象
    var geoJsonTool = new GeoJsonTool();
    //设置模式会绘制矩形
    drawtool.setMode(BMAP_DRAWING_POLYLINE);
    drawtool.open();
    AlertTool.showAlert("info","请绘制线","鼠标点击来绘制,双击结束线的绘制,再次单击开始绘制下一条线。");
    drawtool.addListener('polylinecomplete',function (polyline) {
        geoJsonTool.addPolyline(polyline.getPath(),{ObjNum:objNum++});
        geoJsonTool.showJson("#PolyLine_GeoJson");
    });
    $("#PolyLine_Save").click(function (e) { 
        e.preventDefault();
        if($("#PolyLine_SaveName").val().length==0){
            AlertTool.showAlert("danger","文件名输入为空！","<strong>请在输入框输入文件名。</strong>");
            return;
        }
        geoJsonTool.saveJson($("#PolyLine_SaveName").val());
    });
    function setPolylineMode (){
        drawtool.setMode(BMAP_DRAWING_POLYLINE);
        drawtool.open();
    }
    map.addEventListener("click",setPolylineMode);
    $("#PolyLine_AddProp").click(function (e) { 
        e.preventDefault();
        if($("#PolyLine_Prop").val().length==0){
            AlertTool.showAlert("danger","属性值输入为空！","<strong>请在输入框输入属性值。</strong>");
            return;
        }
        var props = $("#PolyLine_Prop").val().split(';');
        for(var i=0;i<props.length;i++){
            var strs =  props[i].split(',');
            if(strs.length < 2 || strs.length > 3){
                AlertTool.showAlert("danger","属性值输入错误！","<strong>"+props[i]+"输入错误。</strong>");
            }else if(strs.length == 2){
                geoJsonTool.addProperties(-1,strs[0],strs[1]);
            }else if(strs.length == 3){
                geoJsonTool.addProperties(parseInt(strs[0]),strs[1],strs[2]);
            }
        }
        geoJsonTool.showJson("#PolyLine_GeoJson");
    });
    $("#PolyLine_Stop").click(function (e) { 
        e.preventDefault();
        objNum = 0;
        drawtool.close();
        map.clearOverlays();
        map.enableDoubleClickZoom();
        map.removeEventListener("click",setPolylineMode);
        AlertTool.popAlert(2);
    });
});
//======================================================================================
//画面
$("#Polygon_Start").click(function (e) { 
    e.preventDefault();
    if(objNum != 0){
        AlertTool.showAlert("danger","编辑未完成!","<strong>请先完成上一项编辑内容。</strong>");
        return;
    }
    //清除覆盖物及禁用双击放大
    map.clearOverlays();
    map.disableDoubleClickZoom();
    //新建一个GeoJson对象
    var geoJsonTool = new GeoJsonTool();
    //设置模式会绘制矩形
    drawtool.setMode(BMAP_DRAWING_POLYGON);
    drawtool.open();
    AlertTool.showAlert("info","请绘制面","鼠标点击来绘制,双击结束面的绘制,再次单击开始绘制下一个面。");
    drawtool.addListener('polygoncomplete',function (polygon) {
        geoJsonTool.addPolygon(polygon.getPath(),{ObjNum:objNum++});
        geoJsonTool.showJson("#Polygon_GeoJson");
    });
    $("#Polygon_Save").click(function (e) { 
        e.preventDefault();
        if($("#Polygon_SaveName").val().length==0){
            AlertTool.showAlert("danger","文件名输入为空！","<strong>请在输入框输入文件名。</strong>");
            return;
        }
        geoJsonTool.saveJson($("#Polygon_SaveName").val());
    });
    function setPolygonMode () { 
        drawtool.setMode(BMAP_DRAWING_POLYGON);
        drawtool.open();
    }
    map.addEventListener("click",setPolygonMode);
    $("#Polygon_AddProp").click(function (e) { 
        e.preventDefault();
        if($("#Polygon_Prop").val().length==0){
            AlertTool.showAlert("danger","属性值输入为空！","<strong>请在输入框输入属性值。</strong>");
            return;
        }
        var props = $("#Polygon_Prop").val().split(';');
        for(var i=0;i<props.length;i++){
            var strs =  props[i].split(',');
            if(strs.length < 2 || strs.length > 3){
                AlertTool.showAlert("danger","属性值输入错误！","<strong>"+props[i]+"输入错误。</strong>");
            }else if(strs.length == 2){
                geoJsonTool.addProperties(-1,strs[0],strs[1]);
            }else if(strs.length == 3){
                geoJsonTool.addProperties(parseInt(strs[0]),strs[1],strs[2]);
            }
        }
        geoJsonTool.showJson("#Polygon_GeoJson");
    });
    $("#Polygon_Stop").click(function (e) { 
        e.preventDefault();
        objNum = 0;
        drawtool.close();
        map.clearOverlays();
        map.enableDoubleClickZoom();
        map.removeEventListener("click",setPolygonMode);
        AlertTool.popAlert(2);
    });
});
