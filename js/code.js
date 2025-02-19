;function Code(){
this.version='1.0.0';
this.coder=null;
this.CODE_FORM_ACTIVE=false;
window._Code=this;
this.init=function(){
  return this;
};
this.open=function(){
  this.CODE_FORM_ACTIVE=true;
  return this.recoding();
};
this.close=function(){
  this.coder.main.remove();
  this.CODE_FORM_ACTIVE=false;
};
this.recoding=function(){
  this.coder={
    main:this.buildElement('div',null,{'class':'abl-cmain'}),
    back:this.buildElement('div',null,{'class':'abl-cback'}),
    header:this.buildElement('div','Coding',{'class':'abl-chead'}),
    content:this.buildElement('div',null,{'class':'abl-cbody'}),
  };
  this.coder.back.onclick=function(){
    return _Code.close();
  };
  this.coder.header.appendTo(this.coder.main);
  this.coder.content.appendTo(this.coder.main);
  this.coder.back.appendTo(this.coder.main);
  this.coder.main.appendTo(document.body);
  this.coder.main.style.zIndex=Math.pow(0x02,0x40);
  return this.coding(this.coder);
};
this.coding=function(res){
  res.content.innerHTML='';
  window.ABL_RESULT_CONTEXT=null;
  window.ABL_RESULT_NEST_LIMIT=0x01;
  window.ABL_TEXT_CODE=this.codingCode();
  var text=this.buildElement('textarea',null,{
      'class':'abl-textarea-code',
    }),
  exec=this.buildElement('button','Exec',{
      'class':'abl-submit-code abl-submit-code-red',
    }),
  save=this.buildElement('button','Save',{
      'class':'abl-submit-code abl-submit-code-yellow',
    }),
  load=this.buildElement('button','Load',{
      'class':'abl-submit-code abl-submit-code-soft-green',
    }),
  form=this.buildElement('div',null,{'class':'abl-each'},[
    text,exec,save,load,
  ]),
  restime=this.buildElement('pre',null,{
      'class':'abl-result-code',
      'id':'abl-result-time',
    }),
  rescode=this.buildElement('pre',null,{
      'class':'abl-result-code',
      'id':'abl-result-code',
    }),
  saveres=this.buildElement('button','Save Result',{
      'class':'abl-submit-code abl-submit-code-violet',
    }),
  dlres=this.buildElement('div',null,{
      'class':'abl-each-inline',
    }),
  resEl=this.buildElement('div',null,{'class':'abl-each'},[
    restime,rescode,saveres,dlres,
  ]);
  form.appendTo(res.content);
  resEl.appendTo(res.content);
  text.value=window.ABL_TEXT_CODE;
  exec.onclick=function(e){
    window.ABL_TEXT_CODE=text.value;
    try{
      return _Code.codingResult(eval(text.value));
    }catch(e){
      return _Code.codingResult('Error: '+e);
    }
  };
  save.onclick=function(e){
    alert('Saved!');
    return _Code.codingCode(text.value);
  };
  load.onclick=function(e){
    alert('Loaded!');
    text.value=_Code.codingCode();
  };
  saveres.onclick=function(e){
    dlres.innerHTML='';
    var url='data:text/plain;base64,'+btoa(rescode.innerText),
    dl=_Code.buildElement('a','Download Result',{
      'class':'abl-submit-code abl-submit-code-pink',
      'download':'abl-coding-result-'+(new Date).getTime()+'.txt',
      'href':url,
    });
    dl.appendTo(dlres);
  };
};
this.codingResult=function(o){
  var t=document.getElementById('abl-result-time');
  var c=document.getElementById('abl-result-code');
  if(t){t.innerText=(new Date).toString();}
  if(!c){return false;}
  window.ABL_RESULT_CONTEXT=o;
  c.innerText=this.parse(o,window.ABL_RESULT_NEST_LIMIT);
  return true;
};
this.codingCode=function(r){
  var k='abl-coding-code',
      v=localStorage.getItem(k);
  if(r===false){
    localStorage.removeItem(k);
    return true;
  }else if(r){
    var n=typeof r==='object'?JSON.stringify(r):r.toString();
    localStorage.setItem(k,n);
    return n;
  }return v;
};
this.limit=function(x){
  return window.ABL_RESULT_NEST_LIMIT=Math.max(parseInt(x,0xa),0x1);
};
this.parse=function(obj,limit,space,pad){
  var rtext='';  
  space=space?parseInt(space,0xa):0x0;
  limit=limit?parseInt(limit,0xa):0x1;
  pad=pad?parseInt(pad,0xa):0x2;
  if((typeof obj==='object'&&obj!==null)
    ||Array.isArray(obj)){
    var start=Array.isArray(obj)?'[':'{',
        end=Array.isArray(obj)?']':'}';
    if(space==0x0){
      rtext+=(' ').repeat(pad*space)+''+start+'\r\n';
    }
    var len=this.olength(obj),counter=0;
    for(var i in obj){
      counter++;
      var comma=counter<len?',':'',e=obj[i],espace=space+2;
      if((typeof e==='object'&&e!==null)
        ||Array.isArray(e)){
        var estart=Array.isArray(e)?'[':'{',
            eend=Array.isArray(e)?']':'}',
            k=start==='{'?'"'+i+'" : ':'';
        rtext+=(' ').repeat(pad*espace)+''+k+estart+'\r\n';
        if((espace/2)<limit){
          rtext+=this.parse(e,limit,espace,pad);
        }else{
          rtext+=(' ').repeat(pad*(espace+2))
            +'[***LIMITED:'+limit+'***]\r\n';
        }
        rtext+=(' ').repeat(pad*espace)+''+eend+comma+'\r\n';
      }else if(typeof e==='string'||typeof e==='number'){
        var k=typeof e==='number'?e.toString():'"'+e+'"';
        i=start==='{'?'"'+i+'" : ':'';
        rtext+=(' ').repeat(pad*espace)+''+i+k+comma+'\r\n';
      }else if(typeof e==='boolean'){
        var k=e===true?'true':'false';
        i=start==='{'?'"'+i+'" : ':'';
        rtext+=(' ').repeat(pad*espace)+''+i+k+comma+'\r\n';
      }else if(e===null){
        i=start==='{'?'"'+i+'" : ':'';
        rtext+=(' ').repeat(pad*espace)+''+i+'null'+comma+'\r\n';
      }else{
        var k='"['+(typeof e)+']"';
        i=start==='{'?'"'+i+'" : ':'';
        rtext+=(' ').repeat(pad*espace)+''+i+k+comma+'\r\n';
      }
    }
    if(space==0){
      rtext+=(' ').repeat(pad*space)+''+end+'\r\n';
    }
  }else if(typeof obj==='string'){
    rtext+=(' ').repeat(pad*space)+'"'+obj+'"\r\n';
  }else if(typeof obj==='number'){
    rtext+=(' ').repeat(pad*space)+''+obj.toString()+'\r\n';
  }else if(typeof obj==='boolean'){
    rtext+=(' ').repeat(pad*space)+''+(obj===true
      ?'true':'false')+'\r\n';
  }else if(obj===null){
    rtext+=(' ').repeat(pad*space)+'null\r\n';
  }else{
    rtext+=(' ').repeat(pad*space)+'"['+(typeof obj)+']"\r\n';
  }return rtext;
};
this.olength=function(obj){
  var size=0x0,key;
  for(key in obj){
    if(obj.hasOwnProperty(key)){size++;}
  }return size;
};
this.style=function(){
  return '';
};
this.buildElement=function(tag,text,attr,children,html,content){
  let div=document.createElement(typeof tag==='string'?tag:'div');
  div.appendTo=function(el){
    if(typeof el.appendChild==='function'){
      el.appendChild(this);
      return true;
    }return false;
  };
  if(typeof text==='string'){
    div.innerText=text;
  }
  if(typeof attr==='object'&&attr!==null){
    for(let i in attr){
      div.setAttribute(i,attr[i]);
    }
  }
  if(Array.isArray(children)){
    for(let i=0;i<children.length;i++){
      div.appendChild(children[i]);
    }
  }
  if(typeof html==='string'){
    div.innerHTML=html;
  }
  if(typeof content==='string'){
    div.textContent=content;
  }
  div.args={
    tag:tag,
    text:text,
    attr:attr,
    children:children,
    html:html,
    content:content,
  };
  return div;
};
return this.init();
};

