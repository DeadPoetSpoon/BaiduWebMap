export default class GeoJsonTool{
    constructor(){
        this.json = {type:"FeatureCollection",features:[]};
    }
    /**
     * @description 添加点
     * @param {Object} point 百度地图Point对象
     * @param {object} properties Properties对象
     */
    addPoint = function (point,properties) { 
        var p = {type:"Feature",properties:properties};
        p.geometry = {type:"Point",coordinates:[point.lng,point.lat]};
        this.json.features.push(p);
    }
    /**
     * @description 添加线
     * @param {Array} line 百度地图Point对象数组
     * @param {object} properties Properties对象
     */
    addPolyline = function (line,properties) {
        if(line.length <= 1) return;
        var p = {type:"Feature",properties:properties};
        p.geometry = {type:"LineString",coordinates:[]};
        var i = 0;
        for (i = 0; i < line.length; i++) {
            p.geometry.coordinates.push([line[i].lng,line[i].lat]);
        } 
        this.json.features.push(p);
    }
    /**
     * @description 添加面
     * @param {Array} line 百度地图Point对象数组
     * @param {object} properties Properties对象
     */
    addPolygon = function (polygon,properties) {
        if(polygon.length <= 2) return;
        var p = {type:"Feature",properties:properties};
        p.geometry = {type:"Polygon",coordinates:[[]]};
        var i = 0;
        for (i = 0; i < polygon.length; i++) {
            p.geometry.coordinates[0].push([polygon[i].lng,polygon[i].lat]);
        }
        p.geometry.coordinates[0].push([polygon[0].lng,polygon[0].lat]);
        this.json.features.push(p);
    }
    /**
     * @description 为指定对象添加属性
     * @param {Integer} objNum 对象ObjNum属性
     * @param {String} propName 属性名
     * @param {String} prop 属性值
     */
    addProperties = function (objNum,propName,prop) {
        var len = this.json.features.length;
        if(objNum == -1) {
            this.json.features[len-1].properties[propName] = prop;
        }else if(objNum > -1 && objNum < len && Number.isInteger(objNum)) {
            this.json.features[objNum].properties[propName] = prop;
        }else {
            return;
        }
    }
    /**
     * @description 显示Json数据
     * @param {String} selector JQ选择器,指定显示对象
     */
    showJson = function (selector){
        $(selector).text(JSON.stringify(this.json,null,2));
    }
    /**
     * @description 保存文件
     * @param {String} filename 保存文件名
     */
    saveJson = function (filename) {
        //var FileSaver = require('./FileSaver.js');
        var content = JSON.stringify(this.json,null,2);
        var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
        var str = '.json';
        if(filename.slice(-str.length) == str)
            saveAs(blob, filename);
        else
            saveAs(blob,filename+".json");
    }
};
