export default{
  /**
   * @description info|danger|success|warning
   * @param {String} type 提示类型
   * @param {String} heading 标题
   * @param {String} msg 内容
   */
  showAlert: function (type, heading, msg) {
    var tag = '<div style="display: none" class="alert alert-dismissable alert-' + type + '"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><h4>' + heading + '</h4> ' + msg + '</div>';
    $("#MapInfo").append(tag);
    $(".alert").show("slow");
  },
  /**
   * 
   * @param {int} 
   */
  popAlert: function (n) {  
    $("#MapInfo > .alert:last").hide("slow", function () {
      var selector = "#MapInfo > div:nth-last-child(" + n + ")";
      $(selector).remove();
    });
  }
};

/*
function showAlert(type, heading, msg) {
  'use strict';
  var tag = '<div style="display: none" class="alert alert-dismissable alert-' + type + '"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><h4>' + heading + '</h4> ' + msg + '</div>';
  $("#MapInfo").append(tag);
  $(".alert").show("slow");
}
function popAlert(n) {
  $("#MapInfo > .alert:last").hide("slow", function () {
    var selector = "#MapInfo > div:nth-last-child(" + n + ")";
    $(selector).remove();
  });
  //$("#MapInfo > .alert:last").remove();
  //$("#MapInfo > .alert:last").empty();
}
*/
