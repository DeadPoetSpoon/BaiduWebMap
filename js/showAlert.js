/**
 * @description info|danger|success|warning
 * @param {String} type 提示类型
 * @param {String} heading 标题
 * @param {String} msg 内容
 */
function showAlert(type,heading,msg){
  'use strict';
  var tag = '<div class="alert alert-dismissable alert-'+type+'"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><h4>'+heading+'</h4> '+msg+'</div>';
  $("#MapInfo").append(tag);
}
export default (type,heading,strongMsg,msg) => { showAlert(type,heading,strongMsg,msg);};