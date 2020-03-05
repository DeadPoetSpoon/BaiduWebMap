import showAlert from './showAlert.js';
//显示欢迎信息
showAlert("info","欢迎！",'这是基于<a href="http://lbsyun.baidu.com/" class="alert-link"><strong>百度API</strong></a>简单实现的WebGIS网页。');
//构造全局变量map
var map = new BMap.Map("BdMapContainer");
//map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  
function initMap() {
    //初始化中心点及缩放层级
    map.centerAndZoom(new BMap.Point(114.365,30.534),17);
    //初始化地图控件
    // 添加带有定位的导航控件
    var navigationControl = new BMap.NavigationControl({
        // 靠左上角位置
        anchor: BMAP_ANCHOR_TOP_LEFT,
        // LARGE类型
        type: BMAP_NAVIGATION_CONTROL_LARGE,
        // 启用显示定位
        enableGeolocation: true
    });
    map.addControl(navigationControl);
    // 添加定位控件
    var geolocationControl = new BMap.GeolocationControl();
    geolocationControl.addEventListener("locationSuccess", function(e){
        // 定位成功事件
        var address = '';
        address += e.addressComponent.province;
        address += e.addressComponent.city;
        address += e.addressComponent.district;
        address += e.addressComponent.street;
        address += e.addressComponent.streetNumber;
        //alert("当前定位地址为：" + address);
        showAlert("success","定位成功！","您的位置为：<strong>"+address+"</strong>");
    });
    geolocationControl.addEventListener("locationError",function(e){
        // 定位失败事件
        //alert(e.message);
        showAlert("danger","定位失败！","错误信息：<strong>"+e.message+"</strong>");
    });
    map.addControl(geolocationControl);
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
    var geoc = new BMap.Geocoder();
    var geolocation = new BMap.Geolocation();
    
}
initMap();