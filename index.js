


function GetRandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    return (Min + Math.round(Rand * Range));
}

// Website you intended to retrieve for users.
var upstream = ''

// Custom pathname for the upstream website.
var upstream_path = '/'

// Website you intended to retrieve for users using mobile devices.
var upstream_mobile = ''

// Countries and regions where you wish to suspend your service.
const blocked_region = ['KP', 'SY', 'PK', 'CU']

// IP addresses which you wish to block from using your service.
const blocked_ip_address = ['0.0.0.0', '127.0.0.1']

// Whether to use HTTPS protocol for upstream address.
const https = true

// Replace texts.
const replace_dict = {
    '$upstream': '$custom_domain',
    '//google.com': ''
}

var inject_js = `<script src="https://cdn.jsdelivr.net/gh/vrcms/cf-worker-simple-site@1.0.7/ui.js"></script>`;        



async function handleRequest(request) {





    const NAME = 'experiment-0'
    // Responses below are place holders, you could set up
    // a custom path for each test (e.g. /control/somepath )
    const TEST_RESPONSE = new Response('Test group') // fetch('/test/sompath', request)
    const CONTROL_RESPONSE = new Response('Control group') // fetch('/control/sompath', request)
    // Determine which group this requester is in.
    //const cookie = request.headers.get('cookie')
    const cookie = getCookie(request, 'gotosite');

    let nowurl = new URL(request.url);

    //if setting a cookie goto the site..
    if (cookie && cookie != 'null') {
        upstream = upstream_mobile = cookie;
        if (nowurl.pathname == '/F' || nowurl.pathname == '/f') {
            return indexpage()
        }

        //goto the site
        return fetchAndApply(request);

    }

    return indexpage();

    //show homepage
    function indexpage() {
        const init = {
            headers: {
                'content-type': 'text/html;charset=UTF-8',
            }
        }

        let response = new Response(someHTML, init)
        return response

    }
}


addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})



async function fetchAndApply(request) {

    const setCache = (key, data) => IPKV.put(key, data)
    const getCache = key => IPKV.get(key)
    const cacheKey = `google-white-ip`
    var cache_ips = await getCache(cacheKey)
    if (cache_ips) {
        cache_ips = JSON.parse(cache_ips);
    }
    if (!cache_ips) cache_ips = [];
    var the_white_ip = '';
    if (cache_ips.length > 20) {
        the_white_ip = cache_ips[Math.floor(Math.random() * cache_ips.length)];
    }

    let response = null;

    const region = request.headers.get('cf-ipcountry').toUpperCase();
    const ip_address = request.headers.get('cf-connecting-ip');
    const user_agent = request.headers.get('user-agent');


    let url = new URL(request.url);
    let url_hostname = url.hostname;
    console.log(url_hostname);



    if (https == true) {
        url.protocol = 'https:';
    } else {
        url.protocol = 'http:';
    }

    if (await device_status(user_agent)) {
        var upstream_domain = upstream;
    } else {
        var upstream_domain = upstream_mobile;
    }

    url.host = upstream_domain;
    if (url.pathname == '/') {
        url.pathname = upstream_path;
    } else {
        url.pathname = upstream_path + url.pathname;
    }

    if (blocked_region.includes(region)) {
        response = new Response('Access denied: The Service is not available in your region[' + region + '] yet.', {
            status: 403
        });
    } else if (blocked_ip_address.includes(ip_address)) {
        response = new Response('Access denied: Your IP address is blocked by WorkersProxy.', {
            status: 403
        });
    } else {
        let method = request.method;
        let request_headers = request.headers;
        let new_request_headers = new Headers(request_headers);

        new_request_headers.set('Host', url.hostname);
        new_request_headers.set('Referer', 'https://' + upstream);
        var num1 = GetRandomNum(38, 141);
        var num2 = GetRandomNum(1, 254);
        var num3 = GetRandomNum(1, 254);
        var num4 = GetRandomNum(1, 254);
        var fakeip = num1 + '.' + num2 + '.' + num3 + '.' + num4;


        new_request_headers.set('X-Forwarded-For', fakeip);
        new_request_headers.set('Accept-Language', 'zh-CN,zh;q=0.9');


        let original_response = await fetch(url.href, {
            method: method,
            headers: new_request_headers
        })

        let original_response_clone = original_response.clone();
        let original_text = null;
        let response_headers = original_response.headers;
        let new_response_headers = new Headers(response_headers);
        let status = original_response.status;

        new_response_headers.set('access-control-allow-origin', '*');
        new_response_headers.set('access-control-allow-credentials', true);
        new_response_headers.delete('content-security-policy');
        new_response_headers.delete('content-security-policy-report-only');
        new_response_headers.delete('clear-site-data');




        //new_response_headers.set('Referer', 'https://'+upstream);

        let content_type = new_response_headers.get('content-type');
        if (!content_type) content_type = new_response_headers.get('Content-Type');
        content_type = content_type.toLowerCase();

        // response = new Response( JSON.stringify(content_type)+'target web site offline[访问的域名'+upstream+'无法打开] ... error code ='+status+'', {
        //         status: status
        //     });

        // return response;    
         //inject html
        class ElementHandler {
            element(element) {
                element.append(inject_js, {html: true});
            }
        }
        

        if (content_type.includes('text/html') && content_type.includes('utf-8')) {
            original_text = await replace_response_text(original_response_clone, upstream_domain, url_hostname);

        } else {
            if (content_type.includes('text/html')) {
                original_text = await original_response_clone.body;                                
                return new HTMLRewriter().on("head", new ElementHandler()).transform(original_response_clone)

            } else {
                original_text = await original_response_clone.body;


            }

        }



        const nowcontentType = content_type;
        //console.log('type=='+nowcontentType);
        //console.log('status=='+status);
        if (status != 200 && status != 301 && status != 302) {

            if (status < 500) {
                return Response.redirect('https://muddy-shape-838b.testpp2020.workers.dev/', 301)
            } else {
                response = new Response('target web site offline[访问的域名' + upstream + '无法打开] ... error code =' + status + '', {
                    status: status
                });
            }

        } else {





            response = new Response(original_text, {
                status,
                headers: new_response_headers
            });
        }




    }
    return response;
}






async function replace_response_text(response, upstream_domain, host_name) {
    let text = await response.text()

    var i, j;
    for (i in replace_dict) {
        j = replace_dict[i]
        if (i == '$upstream') {
            i = upstream_domain
        } else if (i == '$custom_domain') {
            i = host_name
        }

        if (j == '$upstream') {
            j = upstream_domain
        } else if (j == '$custom_domain') {
            j = host_name
        }

        let re = new RegExp(i, 'g')
        text = text.replace(re, j);
    }

    // let replacereg = new RegExp(upstream_domain+'/', 'g');
    // text = text.replace(replacereg, host_name+'/');

    let newre = new RegExp('</head>', 'g');
    text = text.replace(newre, inject_js + '</head>');

    return text;
}


async function device_status(user_agent_info) {
    var agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < agents.length; v++) {
        if (user_agent_info.indexOf(agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

var GB2312UnicodeConverter = {
    ToUnicode: function (str) {
        return escape(str).toLocaleLowerCase().replace(/%u/gi, '\\u');
    }
    , ToGB2312: function (str) {
        return unescape(str.replace(/\\u/gi, '%u'));
    }
};


/**
 * Grabs the cookie with name from the request headers
 * @param {Request} request incoming Request
 * @param {string} name of the cookie to grab
 */
function getCookie(request, name) {
    let result = null
    let cookieString = request.headers.get('cookie')
    if (cookieString) {
        let cookies = cookieString.split(';')
        cookies.forEach(cookie => {
            let cookieName = cookie.split('=')[0].trim()
            if (cookieName === name) {
                let cookieVal = cookie.split('=')[1]
                result = cookieVal
            }
        })
    }
    return result
}

const clearurlbtn = `
<style>
#clearsite {    
    position: fixed;
    right: 0px;
    top: 150px;
    border:1px solid #4183c4;
    padding:5px 5px;

    border-color: #eaeaea;
    background: #fafafa;
    cursor: default;
    
    color: #999;    


    box-shadow: -1px 0 6px rgb(0 0 0 / 20%);
    cursor: pointer;
    z-index:99999;
}
</style>
<button id="clearsite" title="点击返回 click go back https://muddy-shape-838b.testpp2020.workers.dev/">返回Back</button>
<script>
  var btn = document.getElementById("clearsite");
        
        btn.onclick = function(){
            var url = window.location.protocol + '//' + window.location.host;
            window.location.href= url+'/F';
        }

  </script>
`

const someHTML = `<html lang="en"><head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>你好，世界 Hello World!</title>
      <link href="https://cdn.jsdelivr.net/npm/semantic-ui-css@2.4.1/semantic.min.css" rel="stylesheet">
      <link href="https://cdn.jsdelivr.net/gh/sleepwood/cf-worker-dir@0.1.1/style.css" rel="stylesheet">
      <script src="https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/semantic-ui-css@2.4.1/semantic.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/vue@2.6/dist/vue.min.js"></script>
      
  <style>
  #title{
    min-height:800px;
  }
  .urllinke{
    color:red;
    padding:0px 5px;
  }
  .header{
    color:white;
  }

ul,li{
    margin:0;
    padding:0;
    list-style-type:none;
    text-align:left;
}

#app{
    margin-top:-10px;
}

li a{
    padding-left:10px;
}
#sengine{
    text-align: center;
    font-size: 14px;
    margin-bottom: 10px;
    margin-top:5px;
}

  </style>
  </head>
  <body>
    <header><div id="head" class="ui inverted vertical masthead center aligned segment"><div id="nav" class="ui container">
	<div class="ui large secondary inverted menu"><div class="item"><p id="hitokoto"></p></div></div></div>
	<div id="title" class="ui text container"><h1 class="ui inverted header"><i class="bolt icon"></i><div class="content">你好，世界 Hello World!<div class="sub header">Powered by www.dabeizi.com</div></div></h1>
	<div class="ui left corner labeled right icon fluid large input">
	
	<input id="gotosite" type="search" placeholder="请输入……input a domain" autocomplete="off">
  <i id="setsite" class="inverted circular search link icon"></i></div>
	
	<div id="sengine" class="">
	<div class="header item">仅用于浏览，更换网址可在网址后面加上 <span class="urllinke"> /F </span> ，即可回到此页面</div>	
    <div class="header item">Add <span class="urllinke"> /F </span>  on the link , u can come back here</div>	

   
	
	</div>
    
     <div id="app" >
        <ul>
        <li  v-for="(item,index) in sitelist" :key="index" >
        <a href="javascript:;" @click="gotolink(item)" style="color:white;">{{item}}</a>
        
        <a href="javascript:;" @click="removethis(item)">删除/Remove</a></li>
        </ul>
    </div>
    
    
    </div></div></header><footer>
    <div class="footer">Author 
    <a class="ui label" href="https://github.com/vrcms/cf-worker-simple-site" target="_blank"><i class="github icon"></i>mslxd</a> © Base on <a class="ui label"><i class="balance scale icon"></i></a></div></footer>
    


	
	<script>
		
		
		
	  // 在 #app 标签下渲染一个按钮组件
	  var myvue = new Vue({
	    el: '#app',
		data(){
			return{
				nowhost:window.location.host,
				sitelist:[],
				localurl:[],
				protocoloptions:[
					  { text: ' https ', value: 'https' },
					  { text: ' http ', value: 'http' },
				],
				protocol:'https',//默认协议
		    	message: '',
				value:'',//默认域名
			}
		  },
		mounted() {
			
            let defaulturl = [
                "www.baidu.com",
                "stackoverflow.com"
            ];
			
			//本地缓存
			let locallist = localStorage.getItem('cachelist');
			
			if(!locallist) {
				locallist = [];
			}else{
				locallist = JSON.parse(locallist);
			}			
			
			
			//加入默认值
			for (let i = 0; i < defaulturl.length; i++) {
				if(locallist.includes(defaulturl[i])){					
				}else{
					//加入缓存
					locallist.unshift(defaulturl[i]);
				}	
			}
			
			this.sitelist = locallist;
				
		}, 
		methods:{
			gotolink(link){
                console.log('click',link)
				setCookie('gotosite',link);
                document.getElementById("gotosite").value = link;
                setTimeout(()=>{
                    document.getElementById("setsite").click();
                },1000)
                

			},
			removethis(targeturl){
                for (let i = 0; i < this.sitelist.length; i++) {
					if(this.sitelist[i] == targeturl) {
                        this.sitelist.splice(i,1);
				        localStorage.setItem('cachelist', JSON.stringify( this.sitelist ));
                        return;
                    }
				}
				
			},
			onSearch(targeturl){
				
				//skip exists
				for (let i = 0; i < this.sitelist.length; i++) {
					if(this.sitelist[i] == targeturl) return;//exist do nothing
				}
				this.sitelist.push(targeturl);
				localStorage.setItem('cachelist', JSON.stringify( this.sitelist ));
				
                
			},
		},	  
	  });

	 
	 
	</script>

    
    <script>




  var btn = document.getElementById("setsite");

        // 第一种 通过点击事件
        btn.onclick = function(){
            //alert("这是第一种点击方式");
              var val = document.getElementById("gotosite").value;
            setCookie('gotosite',val);
            var pathname = window.location.pathname;
            myvue.onSearch(val);

            if(pathname='/F'){
                var url = window.location.protocol + '//' + window.location.host;            
                window.location.href= url+'?r='+ Math.round( Math.random()*1000 );
            }else{                
                location.reload(true);
            }            
        }

        function setCookie(name,value)
{
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}


  //鼠标聚焦时，回车事件
      $("#gotosite").bind("keypress", function(){
          if (event.keyCode == 13){
          // 触发需要调用的方法
          $("#setsite").click();
          }
      });
  </script>
  
  </body></html>`;

