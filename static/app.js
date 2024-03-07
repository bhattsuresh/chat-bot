var app_url = "http://127.0.4.21:5000/";
var api_url = "http://127.0.4.21:5000/api/";
var span = null;
var div = null;
var app = {};
var icon = null;
var theme = null;






app.init = ()=>{
    head = document.querySelector('head');
    link = document.createElement('link');
 
    link.rel = 'stylesheet';
    link.href=app_url+'static/app.css'
    
    head.appendChild(link);
    
    setTimeout(app.chekApi,1000);
  
};

app.chekApi = ()=>{
   var obj =  document.querySelector('#sb-chat-widget');
   var data = obj.getAttribute('data');
   data = JSON.parse(data);

   app.get(api_url+'check-api',(res)=>{
        if(data.api == res.apikey)
          (theme=('theme' in data)?data.theme:null,res.theme = theme,app.load(res));
        else
          alert("Chat widget api not found!") 
   })
   
   
}

app.load = (data)=>{
     body = document.querySelector('body');
    span = document.createElement('span');
   
    icon = document.createElement('img');
    icon.src = app_url+'static/envelope-regular.svg';

    body.appendChild(span);
    div = document.createElement('div');
    div.className = 'chat-window';
    header = document.createElement('div');
  
    header.className = 'chat-window-header';
    content = document.createElement('div');
    content.className = 'chat-window-content';

    error_ele = app.ele('div');
    error_ele.className = 'sb-chat-error';
    app.addChild(content,[error_ele]);

    footer = document.createElement('div');
    footer.className = 'chat-window-footer';

    span.className = 'chat-wedget';
   

    app.addClass(icon,'sb-chat-icon');
    app.addChild(span,[icon]);

    header_left = app.ele('span');

    header_left.innerHTML = data.is_online ? 'Online':'Offline';
    app.addClass(header_left,'title');

    header_right = app.ele('span');
    header_right.innerHTML ='&times;';
    app.addClass(header_right,'close sb-chat-windo-close');

    app.addChild(header,[header_left,header_right]);

    footer_left = app.ele('input');
    footer_left.placeholder ='Type Here...';
    footer_left.style.fontSize = '12px';
    app.addClass(footer_left,'sb-chat-input');

    footer_right = app.ele('button');
    footer_right.innerHTML ='Send';
    footer_right.style.fontSize = '12px';
    app.addClass(footer_right,'sb-send-btn');

    company = app.ele('p');
    company.innerHTML ='<center><small style="font-size: 9px;letter-spacing: 1px;text-transform: uppercase;">Developed by SB</small></center>';

    app.addChild(footer,[footer_left,footer_right]);

    app.addChild(footer,[company]);

    app.addChild(div,[header,content,footer]);

      body.appendChild(div);
    if(data.theme != null){
        header.style.backgroundColor=data.theme;
        span.style.backgroundColor=data.theme;
        app.selector('.chat-window-footer').style.borderTopColor =data.theme;
        app.selector('.sb-send-btn').style.borderColor =data.theme;
        app.selector('.sb-send-btn').style.backgroundColor =data.theme;
    }
      span.onclick = function(e){

    
            if(icon.src == app_url+'static/envelope-regular.svg'){
                icon.src = app_url+"static/times-solid.svg";
                
                app.selector('.chat-wedget').style.display="none"
                div.classList.add('active');
            }else{
                icon.src =  app_url+'static/envelope-regular.svg'
                div.classList.remove('active');
                app.selector('.chat-wedget').style.display=""
            }
 }

    var close = app.selector('.sb-chat-windo-close');
    close.onclick = function(e){
                icon.src =  app_url+'static/envelope-regular.svg'
                div.classList.remove('active'); 
                app.selector('.chat-wedget').style.display=""
    }


    app.selector('.sb-send-btn').onclick= function(e){
        var msgBox = app.selector('.sb-chat-input');
        var msg = msgBox.value;
        if(msg.length){
            var msgContent = app.ele('div')
            msgContent.innerText= msg;
            msgContent.classList.add('sb-user-sent-msg');
            (msgBox.value ="",app.selector('.chat-window-content').appendChild(msgContent));
            var url = api_url+'send-message';
            var data_ajax = "sender=sb&receiver=1"+"&message="+msg+"&is_company=0";
            app.post(url,data_ajax,(res)=>{
                var msg_reply_content = app.ele('div')
                setTimeout(()=>{
                  msg_reply_content.innerText= res.reply;
                  msg_reply_content.style.backgroundColor=theme;
                },1500);
                msg_reply_content.innerText= 'Typing...';
                msg_reply_content.classList.add('sb-user-reply-msg');
                if(theme != null)
                  
                app.selector('.chat-window-content').appendChild(msg_reply_content);
            })
        }else{
            app.showError('Type something...');
        }

    }

    app.selector('.sb-chat-input').addEventListener("keydown", event => {
          if (event.isComposing || event.keyCode === 229) {
            return;
          }
        if(event.keyCode == 13)
          app.selector('.sb-send-btn').click();
  });

}


app.ele = function(ele){
    return document.createElement(ele);
   }
   
app.addClass =  function(ele,clas){
   
    if(ele.className != clas)
        ele.className += ' '+clas;
   }
   
app.addChild =  function(ele,child=[]){
       for(i in child){
           ele.appendChild(child[i]);
       }
}

app.selector = (ele)=>{
    return document.querySelector(ele);
}


app.init();

/**after app init */


app.showError = (m)=>{
    error_ele.innerHTML = m;
    error_ele.classList.add("active");
    setTimeout(()=>{  error_ele.classList.remove("active"); },1000);
   
}



app.get =(url,run)=>{
	var xhttp = new XMLHttpRequest();
  	
  xhttp.open("GET", url, true);
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      		run(JSON.parse(this.responseText));
    	}
      };
  xhttp.send();
}


app.post =(url,data,run)=>{
	 var xhttp = new XMLHttpRequest();
   xhttp.open("POST", url, true);

  	xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      run(JSON.parse(this.responseText));
    }
  };
  
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(data);
  
}

