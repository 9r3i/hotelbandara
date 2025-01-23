/* set as the browser */
const HOTEL_BROWSER_APP=true;
/* anonymous async function */
(async function(){
  if(false){return;}
  loopLoader();
  /* prepare abl config namespace and host */
  const ABL_NS='hotel';
  const ABL_HOST='https://hotelbandara.com/api/appbase/hotel.app';
  
  /* prepare registered files */
  const REGISTERED_FILES={
    "abl.js": "https://raw.githubusercontent.com/9r3i/abl.js/master/abl.min.js",
  };
  /* virtual host file */
  const VIRTUAL_HOST="https://raw.githubusercontent.com/9r3i/virtual.js/master/virtual.min.js";

  /* standard virtual initialization -- do not change */
  let vname='virtual.js',
  vtag=document.getElementById(vname),
  vscript=localStorage.getItem('virtual/'+vname);
  if(!vscript){
    vscript=await fetch(VIRTUAL_HOST).then(r=>r.text());
    if(!vscript.match(/function\svirtual/)){
      alert('Error: Failed to load virtual.js');
      return;
    }
  }
  /* execute the virtual script */
  vtag.textContent=vscript;
  /* initialize virtual.js with registered files */
  const app=new virtual(REGISTERED_FILES);
  /* save virtual script */
  app.put(vname,vscript);
  /* load abl file */
  await app.load('abl.js');
  /* start the abl */
  new abl(ABL_NS,ABL_HOST);
  /* auto-update of abl.js */
  await app.update('abl.js');
  /* doing silent self update for virtual.js 
   * uncomment this if you wanna make virtual.js auto-update
   */
  app.files[vname]=VIRTUAL_HOST;
  await app.update(vname);
  /* end-of-script */
})();
/* loop loader */
function loopLoader(){
  let ll=document.getElementById('abl-loader'),
  pp=document.getElementById('splash-progress'),
  ss=document.getElementById('splash-text');
  if(ll&&pp&&ss){
    pp.value=parseInt(ll.style.width,10);
    ss.innerText=ll.style.width+' Loading...';
    if(pp.value>=100){return;}
  }
  return setTimeout(loopLoader,100);
}
