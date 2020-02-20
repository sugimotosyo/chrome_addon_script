var hostname = location.hostname;
var pathname = location.pathname;
var queryparam = location.search;

if (hostname == "tenshoku.mynavi.jp" && pathname == "/client/entry/index.cfm") {
  if (queryparam.indexOf("fuseaction=ctey_listEntrydata_form") >= 0) {
    $(".label-interview").each((i, elm) => {
      var innerText = $(elm).text();
      if (innerText.indexOf("見送") >= 0 || innerText.indexOf("辞退") >= 0) {
        $(elm)
          .closest(".mainUnit")
          .css("background-color", "gray");
      }
      if (
        innerText.indexOf("内定済") >= 0 ||
        innerText.indexOf("入社手続済") >= 0 ||
        innerText.indexOf("入社手続待") >= 0
      ) {
        $(elm)
          .closest(".mainUnit")
          .css("background-color", "rgb(0, 255, 0)");
      }
    });
  }
}

if (hostname == "tenshoku.mynavi.jp" && pathname == "/client/entrycommunication/index.cfm" && queryparam.indexOf("fuseaction=cten_DataDownload_form") >= 0) {

  $("button").before('<a href="#" class="btn btn-primary" type="button" id="btn_renkei">データを連携</a><br><br>')

  $('#btn_renkei').on('click', function () {
    //$("button").click()
    var attrOnclick = $("button").attr("onclick").replace("location.href='", "")
    var url = "https://tenshoku.mynavi.jp/client/entrycommunication/" + attrOnclick.substring(0, attrOnclick.length - 1)

    $.ajax({
      url: url,
      //dataType: 'html',
      success: function (data) {
        //console.log(data)
        requestGasPostMainabi(data)
      },
      error: function (data) {
        alert('error1');
      }
    });
  });
}

//gas(gasへのポストを行うサーバー処理)への連携
var requestGasPostMainabi = function(data){
    var now = new Date().getTime()
    var url = "https://enjoy-api.enjoy-ps.com/gaspost"
    var baitai = "mainabi"

    $.ajax({
        url: url,
        data: JSON.stringify({value:{ date: now,baitai:baitai,data: data }}),
        type:'POST',
        contentType: 'application/json',
        success: function (data) {
          console.log(data)
          alert("success")
        },
        error: function (data,status) {
          console.log(data)
          alert("error2")
        },        
      });
      window.close()
}
