export default class DrawTool {
    constructor(map) {
        /**
         * @description style设置
         */
        var styleOptions = {
            strokeColor:"red",    //边线颜色。
            fillColor:"blue",      //填充颜色。当参数为空时，圆形将没有填充效果。
            strokeWeight: 3,       //边线的宽度，以像素为单位。
            strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
            fillOpacity: 0.3,      //填充的透明度，取值范围0 - 1。
            strokeStyle: 'solid' //边线的样式，solid或dashed。
        }
        this.drawingManager = new BMapLib.DrawingManager(map, {
            isOpen: false, //是否开启绘制模式
            enableDrawingTool: false, //是否显示工具栏
            drawingToolOptions: {
                anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                offset: new BMap.Size(5, 5), //偏离值
            },
            circleOptions: styleOptions, //圆的样式
            polylineOptions: styleOptions, //线的样式
            polygonOptions: styleOptions, //多边形的样式
            rectangleOptions: styleOptions //矩形的样式
        })
    }
    /**
    * @description BMAP_DRAWING_MARKER|CIRCLE|POLYLINE|POLYGON|RECTANGLE
    * @param {DEAWING MODE} MODE 
    */
    setMode = function(MODE){
        this.drawingManager.setDrawingMode(MODE);
    }
    /**
     * @description 添加监听器 
     * @param {String} type 类型
     * @param {Function} funp 时间接受函数
     */
    addListener = function (type,funp) { 
        this.drawingManager.addEventListener(type,funp);
    }
    /**
     * @description 开启画图工具
     */
    open = function () { this.drawingManager.open(); }
    /**
     * @description 关闭画图工具
     */
    close = function() { this.drawingManager.close(); }
};
