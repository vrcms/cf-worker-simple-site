const clearurlbtn = `
<style>
#clearsite {    
    position: fixed;
    right: 5px;
    top:25%;
	width: 60px;    


    border:1px solid #4183c4;
    padding:5px 5px;

    border-color: #eaeaea;
    background: #fafafa;
    cursor: default;
    
    color: #999;    

	

    box-shadow: -1px 0 6px rgb(0 0 0 / 20%);
    cursor: pointer;
    z-index:9999;
}
</style>
<button id="clearsite" title="点击返回 click go back to the CF-WORKER">返回Back</button>
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


