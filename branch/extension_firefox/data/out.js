try{
(function(){function h(a){return this.transferTo(this.xmldataObj.children,a)}function j(a,d){for(var b,c,e=0;e<a.length;e++){c=a[e];if(c.nodeName=="NAVIMENUITEM")b=new Item,b.unId=c.getAttribute("id"),b.text=c.getAttribute("text"),b.backAction=c.getAttribute("action"),b.terminal=c.getAttribute("terminal")=="true",b.visibled=c.getAttribute("visibled")=="true",b.disabled=c.getAttribute("disabled")=="true";else if(c.nodeName=="NAVIMENU")b=new MainMenu,b.unId=c.getAttribute("id");else continue;d.appendChild(b);
b.SetUserStyle();if(!this.transferTo(c.children,b))return false}return true}var a="root",a=new function(){this.xmldataObj="";this.xmldataToMydata=h;this.transferTo=j};a.xmldataObj=document.getElementById("menudata").children[0];a.xmldataToMydata(root);var a=expandNaviId==""||expandNaviId==null?"i0":expandNaviId,d=false,f=document.getElementById("menudata").getElementsByTagName("naviMenuitem"),g=document.getElementById("menudata").getElementsByTagName("naviMenu");for(i=0;i<f.length;i++)f[i].getAttribute("id")==
a&&(d=true);for(i=0;i<g.length;i++)g[i].getAttribute("id")==a&&(d=true);d==false&&(a="i0");a=root.search(a);naviMenu.innerHTML=a.UserStyle.CreateMenu()})();
}catch(e){
alert("cao firefox"+e);
}
