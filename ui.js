const clearurlbtn = `
<style>
#clearsite {    
    position: fixed;
    right: 2px;
    top:20%;
	height:35px;
	width: 35px;    


    border:1px solid #4183c4;
    padding:0;

    border-color: #eaeaea;
    background: #fafafa;
    cursor: default;
    
    color: #999;    
   

	background-color: rgba(214,242,255,0.95);
    border-radius: 3px;
    font-size: 0;
    box-shadow: 0 1px 4px 0 rgb(28 32 42 / 36%);
    margin-left: auto;


    cursor: pointer;
    z-index:9999;
}

#clearsite::before {
    content: '';
    display: inline-block;
    width: 35px;
    height: 35px;
    background-image: url(https://cdn.jsdelivr.net/gh/vrcms/cf-worker-simple-site@1.0.6/elevator_icons_v4.svg);
	transform:rotate(-90deg);
    background-repeat: no-repeat;
    background-size: auto;
	background-position: -24px 8px;
}
</style>
<button id="clearsite" title="点击返回 click go back to the CF-WORKER">B</button>
<script>
  var btn = document.getElementById("clearsite");
        
        btn.onclick = function(){
            var url = window.location.protocol + '//' + window.location.host;
            window.location.href= url+'/F';
        }

  </script>
`
function add_html(){    
	var btn = document.getElementById("clearsite");    
    if(!btn){
           //add goback botton          
          document.write(clearurlbtn)
    }  
}


window.onload=function(){
    add_html();
}

add_html();


