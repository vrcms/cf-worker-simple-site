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
function add_html(){
  //add goback botton
  document.write(clearurlbtn)
}


window.onload=function(){
    add_html();
}


