function ChromeExOAuth(a,c,b,d,e,g,f){this.url_request_token=a;this.url_auth_token=c;this.url_access_token=b;this.consumer_key=d;this.consumer_secret=e;this.oauth_scope=g;this.app_name=f&&f.app_name||"ChromeExOAuth Library";this.key_token="oauth_token";this.key_token_secret="oauth_token_secret";this.callback_page=f&&f.callback_page||"chrome_ex_oauth.html";this.auth_params={};if(f&&f.auth_params)for(key in f.auth_params)f.auth_params.hasOwnProperty(key)&&(this.auth_params[key]=f.auth_params[key])}
ChromeExOAuth.initBackgroundPage=function(a){window.chromeExOAuthConfig=a;window.chromeExOAuth=ChromeExOAuth.fromConfig(a);window.chromeExOAuthRedirectStarted=false;window.chromeExOAuthRequestingAccess=false;var c=chrome.extension.getURL(window.chromeExOAuth.callback_page),b={};chrome.tabs.onUpdated.addListener(function(a,e){e.url&&e.url.substr(0,c.length)===c&&e.url!=b[a]&&window.chromeExOAuthRequestingAccess==false&&chrome.tabs.create({url:e.url},function(c){b[c.id]=c.url;chrome.tabs.remove(a)})});
return window.chromeExOAuth};ChromeExOAuth.prototype.authorize=function(a){this.hasToken()?a(this.getToken(),this.getTokenSecret()):(window.chromeExOAuthOnAuthorize=function(c,b){a(c,b)},chrome.tabs.create({url:chrome.extension.getURL(this.callback_page)}))};ChromeExOAuth.prototype.clearTokens=function(){delete localStorage[this.key_token+encodeURI(this.oauth_scope)];delete localStorage[this.key_token_secret+encodeURI(this.oauth_scope)]};ChromeExOAuth.prototype.hasToken=function(){return!!this.getToken()};
ChromeExOAuth.prototype.sendSignedRequest=function(a,c,b){var d=b&&b.method||"GET",e=b&&b.body||null,g=b&&b.headers||{},a=this.signURL(a,d,b&&b.parameters||{});ChromeExOAuth.sendRequest(d,a,g,e,function(a){a.readyState==4&&c(a.responseText,a)})};
ChromeExOAuth.prototype.signURL=function(a,c,b){var d=this.getToken(),e=this.getTokenSecret();if(!d||!e)throw Error("No oauth token or token secret");b=b||{};return OAuthSimple().sign({action:c,path:a,parameters:b,signatures:{consumer_key:this.consumer_key,shared_secret:this.consumer_secret,oauth_secret:e,oauth_token:d}}).signed_url};
ChromeExOAuth.prototype.getAuthorizationHeader=function(a,c,b){var d=this.getToken(),e=this.getTokenSecret();if(!d||!e)throw Error("No oauth token or token secret");b=b||{};return OAuthSimple().getHeaderString({action:c,path:a,parameters:b,signatures:{consumer_key:this.consumer_key,shared_secret:this.consumer_secret,oauth_secret:e,oauth_token:d}})};
ChromeExOAuth.fromConfig=function(a){return new ChromeExOAuth(a.request_url,a.authorize_url,a.access_url,a.consumer_key,a.consumer_secret,a.scope,{app_name:a.app_name,auth_params:a.auth_params})};ChromeExOAuth.initCallbackPage=function(){var a=chrome.extension.getBackgroundPage(),c=ChromeExOAuth.fromConfig(a.chromeExOAuthConfig);a.chromeExOAuthRedirectStarted=true;c.initOAuthFlow(function(b,c){a.chromeExOAuthOnAuthorize(b,c);a.chromeExOAuthRedirectStarted=false;chrome.tabs.getSelected(null,function(a){chrome.tabs.remove(a.id)})})};
ChromeExOAuth.sendRequest=function(a,c,b,d,e){var g=new XMLHttpRequest;g.onreadystatechange=function(a){e(g,a)};g.open(a,c,true);if(b)for(var f in b)b.hasOwnProperty(f)&&g.setRequestHeader(f,b[f]);g.send(d)};ChromeExOAuth.formDecode=function(a){for(var a=a.split("&"),c={},b=0,d;d=a[b];b++){var e=d.split("=");e.length==2&&(d=ChromeExOAuth.fromRfc3986(e[0]),e=ChromeExOAuth.fromRfc3986(e[1]),c[d]=e)}return c};
ChromeExOAuth.getQueryStringParams=function(){var a=window.location.href.split("?");return a.length>=2?(a=a.slice(1).join("?"),ChromeExOAuth.formDecode(a)):{}};ChromeExOAuth.bind=function(a,c){var b=Array.prototype.slice.call(arguments).slice(2);return function(){var d=b.concat(Array.prototype.slice.call(arguments));a.apply(c,d)}};ChromeExOAuth.toRfc3986=function(a){return encodeURIComponent(a).replace(/\!/g,"%21").replace(/\*/g,"%2A").replace(/'/g,"%27").replace(/\(/g,"%28").replace(/\)/g,"%29")};
ChromeExOAuth.fromRfc3986=function(a){a=a.replace(/%21/g,"!").replace(/%2A/g,"*").replace(/%27/g,"'").replace(/%28/g,"(").replace(/%29/g,")");return decodeURIComponent(a)};ChromeExOAuth.addURLParam=function(a,c,b){var d=a.indexOf("?")>=0?"&":"?";return a+d+ChromeExOAuth.toRfc3986(c)+"="+ChromeExOAuth.toRfc3986(b)};ChromeExOAuth.prototype.setToken=function(a){localStorage[this.key_token+encodeURI(this.oauth_scope)]=a};ChromeExOAuth.prototype.getToken=function(){return localStorage[this.key_token+encodeURI(this.oauth_scope)]};
ChromeExOAuth.prototype.setTokenSecret=function(a){localStorage[this.key_token_secret+encodeURI(this.oauth_scope)]=a};ChromeExOAuth.prototype.getTokenSecret=function(){return localStorage[this.key_token_secret+encodeURI(this.oauth_scope)]};
ChromeExOAuth.prototype.initOAuthFlow=function(a){if(this.hasToken())a(this.getToken(),this.getTokenSecret());else{var c=ChromeExOAuth.getQueryStringParams();c.chromeexoauthcallback=="true"?this.getAccessToken(c.oauth_token,c.oauth_verifier,a):this.getRequestToken(function(a){window.location.href=a},{url_callback_param:"chromeexoauthcallback"})}};
ChromeExOAuth.prototype.getRequestToken=function(a,c){if(typeof a!=="function")throw Error("Specified callback must be a function.");var b=ChromeExOAuth.addURLParam(c&&c.url_callback||window&&window.top&&window.top.location&&window.top.location.href,c&&c.url_callback_param||"chromeexoauthcallback","true"),b=OAuthSimple().sign({path:this.url_request_token,parameters:{xoauth_displayname:this.app_name,scope:this.oauth_scope,oauth_callback:b},signatures:{consumer_key:this.consumer_key,shared_secret:this.consumer_secret}}),
d=ChromeExOAuth.bind(this.onRequestToken,this,a);ChromeExOAuth.sendRequest("GET",b.signed_url,null,null,d)};
ChromeExOAuth.prototype.onRequestToken=function(a,c){if(c.readyState==4)if(c.status==200){var b=ChromeExOAuth.formDecode(c.responseText),d=b.oauth_token;this.setTokenSecret(b.oauth_token_secret);var b=ChromeExOAuth.addURLParam(this.url_auth_token,"oauth_token",d),e;for(e in this.auth_params)this.auth_params.hasOwnProperty(e)&&(b=ChromeExOAuth.addURLParam(b,e,this.auth_params[e]));a(b)}else throw Error("Fetching request token failed. Status "+c.status);};
ChromeExOAuth.prototype.getAccessToken=function(a,c,b){if(typeof b!=="function")throw Error("Specified callback must be a function.");var d=window;if(d.chromeExOAuthRequestingAccess==false)d.chromeExOAuthRequestingAccess=true,a=OAuthSimple().sign({path:this.url_access_token,parameters:{oauth_token:a,oauth_verifier:c},signatures:{consumer_key:this.consumer_key,shared_secret:this.consumer_secret,oauth_secret:this.getTokenSecret(this.oauth_scope)}}),b=ChromeExOAuth.bind(this.onAccessToken,
this,b),ChromeExOAuth.sendRequest("GET",a.signed_url,null,null,b)};ChromeExOAuth.prototype.onAccessToken=function(a,c){if(c.readyState==4){var b=window;if(c.status==200){var d=ChromeExOAuth.formDecode(c.responseText),e=d.oauth_token,d=d.oauth_token_secret;this.setToken(e);this.setTokenSecret(d);b.chromeExOAuthRequestingAccess=false;a(e,d)}else throw b.chromeExOAuthRequestingAccess=false,Error("Fetching access token failed with status "+c.status);}};