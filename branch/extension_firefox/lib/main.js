var pageMod = require("page-mod");
var self = require("self");
var url = self.data.url("out.js");

pageMod.PageMod({
  include: [
	"http://grsinfo.zju.edu.cn/cultivate/menu/cultivate_menu_student.jsp",
	"http://g.zju.edu.cn/cultivate/menu/cultivate_menu_student.jsp"],
  contentScriptWhen: 'end',
  contentScript: "try{var s=document.createElement('script');s.src='"+url+"';document.getElementsByTagName('head')[0].appendChild(s);}catch(e){alert(e)}"
});
