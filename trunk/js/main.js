function loadjs(src,cb) 
{
    var h = document.getElementsByTagName('head')[0];
    if(h){
        var s = document.createElement('script');
        s.setAttribute('src',src);
        s.setAttribute('type','text/javascript');
        s.onreadystatechange = function(){
            if (this.readyState == 'complete' || this.readyState == 'loaded'){
                try{
                    this.onload();
                }catch(e){}
            }
        };
        s.onload = (cb!==undefined)?cb:null;	
        h.appendChild(s);
    }
}
var oauth = oauth || chrome.extension.getBackgroundPage().oauth;
var App = App || {};

$(function(){
    var apiKey = "AIzaSyBvRRGf1uUfCewgR2Rwm6JSHa0vFmMu3IM";
    var clientId = '142181023024.apps.googleusercontent.com';
    var scope = 'https://www.googleapis.com/auth/calendar';
    
    var HOST = "http://grsinfo.zju.edu.cn/";
    var LOGIN = "login_s_code.jsp";
    var COURSE = "cultivate/selectles/selectbefore/xkhxkbcx.jsp";
    function buildDatetime(day,time) {
        return {
            "dateTime":day+"T"+time+":00+08:00",
            "timeZone":"Asia/Shanghai"
        }
    }
    App.onauth = function() {
        if (oauth.hasToken()) {
            $("#auth").text("退出").click(function(){
                oauth.clearTokens();
                $("#login").slideUp("fast",function(){
                    window.close();
                });
            });
            $("#login").slideDown("slow");
        }
        else {
            $("#auth").click(function(){  
                chrome.tabs.create({
                    "url":chrome.extension.getURL("auth.html")
                });
            });
        }
    }
    App.onload = function() {
        App.onauth();
    }
    App.onlist = function(resp) {
        var eventList = JSON.parser(resp);
        console.log(eventList);
    }
    App.postToGoogle = function(courses) {
        var genCals = "https://www.googleapis.com/calendar/v3/users/me/calendarList";
        oauth.sendSignedRequest(genCals, function(json){
            var result = JSON.parse(json);
            if (!result.error){
                var url = "https://www.googleapis.com/calendar/v3/calendars/"+result.items[result.items.length-1].id+"/events";
                function postSingle(course,callback) {
                    try{
                        var week = ["SU","MO","TU","WE","TH","FR","SA","SU"];
                        var config = Config.getDuration();
                        var semesterconfig = Config.getSemester();
                        var d = new Date(new Date().getFullYear()+"-"+semesterconfig[course.semester].start);
                        d.setTime(d.getTime()+3600000*24*(((course.weekday+7) - d.getDay())%7));
                        var startTime = buildDatetime($.datepicker.formatDate("yy-mm-dd",d),config[course.start-1].start);
                        var endTime = buildDatetime($.datepicker.formatDate("yy-mm-dd",d),config[course.start+course.length-2].end);
                        var date = new Date(semesterconfig[course.semester].end);
                        date.setFullYear((course.semester >= 3)?new Date().getFullYear()+1:new Date().getFullYear());
                        var recurrence = "RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY="+week[course.weekday]+";UNTIL="+$.datepicker.formatDate("yymmdd",date);
                        var request = {
                            'method': 'POST',
                            'parameters': {
                                'key' : apiKey
                            },
                            'headers': {
                                'GData-Version': '3.0',
                                'Content-Type': 'application/json'
                            },
                            'body': JSON.stringify({
                                "end": endTime,
                                "start": startTime,
                                "location": course.pos,
                                "summary": course.name,
                                "description": course.time,
                                "recurrence": [
                                recurrence
                                ],
                                "reminders": {
                                    "useDefault": false,
                                    "overrides": [{
                                        "method": "popup",
                                        "minutes": 15
                                    }]
                                }
                            })
                        };
                        oauth.sendSignedRequest(url, function(json){
                            var result = JSON.parse(json);
                            console.log(result);
                            if (!result.error)
                                callback();
                            else {
                                $(".mask").fadeOut(200);
                                $("#fail").show(300).find("#msg").text("导入失败");
                            }
                        }, request);
                    }catch(e){
                        $(".mask").fadeOut(200);
                        $("#fail").show(300).find("#msg").text("数据格式错误");
                    }
                }
                function postAll() {
                    var course = courses.shift();
                    if (course !== undefined)
                        postSingle(course,postAll);
                    else {
                        $(".mask").fadeOut(200);
                        $("#success").show(300);
                    }
                }
                if (courses instanceof Array) {
                    postAll();
                }
            }
            else {
                $(".mask").fadeOut(200);
                $("#fail").show(300).find("#msg").text(result.error);
            }
        }, null);
    }
    function check_login_info() {
        var form = document.getElementById("login");
        if (!form["user_id"].value || !form["password"].value) {
            $("#fail").show(300).find("#msg").text("请输入完整");
            return false;
        }
        return true;
    }
    $("#login").submit(function(){
        if (check_login_info()){
            var no = $("input[name=user_id]").val();
            var pw = $("input[name=password]").val();
            $.ajax({ 
                type: "POST", 
                url: HOST+LOGIN, 
                dataType:"json", 
                data:{
                    "user_id":no,
                    "password":pw
                },
                timeout:3000,
                success:function(response,text){
                    if (response.redirect == this.url) {
                        window.location.href = response.redirect;
                    }
                }, 
                error: function(xhr, textStatus, errorThrown) {
                    if (/登录/gi.test(xhr.responseText)) {
                        $("#fail").show(300).find("#msg").text("登录失败");
                    }
                    else {
                        $("body").append("<div class='mask'></div>");
                        $.get(HOST+COURSE,function(html){
                            var script = html.match(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi)[0];
                            html = html.replace(/<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>/gi,"");
                            html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,"");
                            document.getElementById("builder").innerHTML = html;
                            script = /<script\b[^>]*>([\s\S]*?)<\/script>/gi.exec(script)[1];
                            var s = document.createElement("script");
                            s.setAttribute("type","text/javascript");
                            s.innerHTML = script;
                            document.getElementsByTagName("head")[0].appendChild(s);
                        
                            var semesters = ["春","夏","秋","冬"];
                            var t1 = document.getElementById("kbT1");
                            var semester1 = semesters.indexOf(t1.previousSibling.textContent.trim().match(/[春夏秋冬]/)[0]);
                            if (semester1 == -1) {
                                semester1 = 4;
                            }
                            var courses1 = Parser.parse(t1,semester1);
                        
                            var t2 = document.getElementById("kbT2");
                            var semester2 = semesters.indexOf(t2.previousSibling.textContent.trim().match(/[春夏秋冬]/)[0]);
                            if (semester2 == -1) {
                                semester2 = 4;
                            }
                            var courses2 = Parser.parse(t2,semester2);
                            App.postToGoogle(courses1.concat(courses2));
                        }).error(function(){
                            $(".mask").fadeOut(200);
                            $("#fail").show(300).find("#msg").text("你确定选课网没挂？");
                        });
                    }
                }
            });
        }
        return false;
    });
    App.onload();
});