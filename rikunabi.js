var hostname = location.hostname;
var pathname = location. pathname;

// SCRIPTタグの生成
if(hostname == "saiyo.rikunabi.com" && pathname=="/rnc/docs/cc_s04011.jsp"){
    var el = document.createElement("script");
    // SCRIPTタグのSRC属性に読み込みたいファイルを指定
    el.type="text/javascript";
    el.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js";
    
    // BODY要素の最後に追加
    document.body.appendChild(el);
    el.addEventListener('load', function() {
        // ここにjQueryの記述をする
        $(function() {
            //リクナビ応募者一覧
            if(hostname == "saiyo.rikunabi.com" && pathname=="/rnc/docs/cc_s04011.jsp"){
                setTimeout(rikunabiitirann, 1000);
            }
        })
    
    })
}



var renkei = function(){
    var TARGET_SUMMARIZED_OPERATION = 30
    var TARGET_ACTION_JSP = "cc_i04010.jsp"
    var targetForm ;
    var url = ""
    $("form").each(function(i,form){
        var action = $(form).attr("action")
        var so = $(form).find('input[name="summarizedOperation"]').val()
        if(action.indexOf(TARGET_ACTION_JSP) >= 0 && so==TARGET_SUMMARIZED_OPERATION){
            url = action
            targetForm = form
            return
        }
    })

    //入力チェック
    if($(targetForm).find('input[name="msgInfo"]').length == 0 ){
        alert("チェックされていません。")
        return 
    }

    //ポストする
    $.ajax({
        url: url,
        data:  $(targetForm).serialize(),
        type:'POST',
        success: function (data) {
            //   console.log(data)
            requestGasPostRiknabi(data)
        },
        error: function (data,status) {
          console.log(data)
          alert("error1")
        },        
      });
}

//gas(gasへのポストを行うサーバー処理)への連携
var requestGasPostRiknabi = function(data){
    var now = new Date().getTime()
    var url = "https://enjoy-api.enjoy-ps.com/gaspost"
    var baitai = "rikunabi"

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
}



//リクナビの一覧処理
var rikunabiitirann = function(){
     //連携ボタン追加
     $(".bulkActions").append('<button onclick="renkei();" data-v-a8e346f8="" data-v-5bbe0678="" id="renkei_button" type="button" class="button button--basic button--small">連携する</button>')
    
     var mensetucheckStr = "";
    //行を取得
    var rows = $(".tableWrapper").find(".table__row");
    rows.each((i, row)=>{
        //備考
        var biko = $(row).find(".table__cell--remarksText").text();
        if(biko.indexOf("内定") >= 0 ){
            //内定がある場合に行の背景色を変更
            $(row).css("background-color","#00FF00");
        }
        if(biko.indexOf("辞退") >= 0 ){
            //辞退がある場合に行の背景色を変更
            $(row).css("background-color","#999999");
        }
        if(biko.indexOf("保留") >= 0 ){
            //保留がある場合に行の背景色を変更
            $(row).css("background-color","#DDDDDD");
        }



        //応募日
        var oubobi =  $(row).find(".userapplyDate");
        var date = new Date(oubobi.text().replace("応募",""));
        var now = new Date();
        if (date.getFullYear() == now.getFullYear() && date.getMonth() == now.getMonth()){
            //今月が応募日の場合は応募日に色をつける
            $(oubobi).css("color","red");
        }


        //評価
        if($(row).find(".table__cell--rating").text().indexOf("不合格") >= 0){
            //保留がある場合に行の背景色を変更
            $(row).css("background-color","#999999");
        }
        //進捗
        if($(row).find(".table__cell--progress").text().indexOf("見送り") >= 0 || $(row).find(".table__cell--progress").text().indexOf("辞退") >= 0 ){
            //保留がある場合に行の背景色を変更
            $(row).css("background-color","#999999");
        }
        if($(row).find(".table__cell--progress").text().indexOf("内定") >= 0 || $(row).find(".table__cell--progress").text().indexOf("_入社") >= 0){
             //内定がある場合に行の背景色を変更
             $(row).css("background-color","#00FF00");
        }


        //面接日時
        var mensetuDivs = $(row).find(".table__cell--interviewDate").find("div")
        var mensetubi = "";
        if ( mensetuDivs.length >= 0 ){
            mensetubi = $(mensetuDivs[0]).text();
        }
        var mensetujikan = "" ;
        if ( mensetuDivs.length >= 1 ){
            mensetujikan = $(mensetuDivs[1]).text();
        }

        
        if (mensetubi != ""){
            var mensetubiDate = new Date(mensetubi);
            var now = new Date();

            if(now.getFullYear() == mensetubiDate.getFullYear() && now.getMonth() === mensetubiDate.getMonth() ){
                //当日と明日の面接予定を出す。
                if(now.getDate() == mensetubiDate.getDate() || now.getDate()+1 == mensetubiDate.getDate()){
                    mensetucheckStr = mensetucheckStr +$(row).find(".userName").text()+ mensetubi+mensetujikan+ "<br>"
                }
            }
        }
      
    });

    $(".header").before(mensetucheckStr)
}
