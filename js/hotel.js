/* initializing */
;async function hotel_start(){
  let app=new Hotel;
  if(!app.production){
    /* error message -- for development only */
    window.addEventListener('error',function(e){
      let errorText=[
        e.message,
        'URL: '+e.filename,
        'Line: '+e.lineno+', Column: '+e.colno,
        'Stack: '+(e.error&&e.error.stack||'(no stack trace)'),
      ].join('\n');
      alert(errorText);
      console.error(errorText);
    });
  }
  /* check for cordova */
  let appDirect=app.production?false:true;
  window.CORDOVA_LOADED=false;
  if(window.cordova!==undefined){
    document.addEventListener('deviceready',async function(e){
      window.CORDOVA_LOADED=true;
      await app.start(appDirect);
    },false);
  }else{
    await app.start(appDirect);
  }
};

/**
 * hotel.js
 * ~ an hotel app
 * authored by 9r3i
 * https://github.com/9r3i
 * started at july 22nd 2024
 * requires:
 *   - eva.js               --> https://github.com/9r3i/eva.js
 *   - parser.js            --> https://github.com/9r3i/parser.js
 *   - ini.js               --> https://github.com/9r3i/ini.js
 *   - images.js            --> for IMAGES global variable
 *   - nations.js           --> for NATIONS global variable
 *   - code.js              --> for inner coding
 *   - circle-progress.js   --> for fake loader
 *   - qrcode.js            --> for qrcode login
 *   - sweetalert2@11 (cdn) --> for alert
 *   - 
 * before push to vco-server:
 *   1. check #3  --> production, version and versionCode   --> hotel.js
 *   2. minimize  --> ai tool peureut root/dev/js/hotel.js  --> hotel.min.js     --> test
 *   3. obfuscate --> https://obfuscator.io/                --> hotel.min.obf.js --> test
 *   4. reset     --> put back to false and set new version --> hotel.js
 *   5. update    --> update versionCode                    --> hotel.txt and config.abl
 *   6. compile   --> ai abl app config                     --> hotel.app
 *   7. move      --> mv -fv root/dev/hotel.app root/api/appbase
 *   8. status    --> ai vco status
 *   9. push      --> ai vco push
 */
;function Hotel(){
/* set to true before compile to appbase */
this.production=false;
/* the version code */
Object.defineProperty(this,'versionCode',{
  value:157,
  writable:false,
});
/* the version */
Object.defineProperty(this,'version',{
  value:this.versionCode.toString().split('').join('.'),
  writable:false,
});

/* debug all requests -- for development only */
this.debugRequest=false;


/* hosts */
this.hosts={
  appbase     : 'http://localhost//api/appbase/hotel.app',
  eva         : 'http://localhost//api/eva/',
  version     : 'http://localhost//api/appbase/hotel.txt',
  eva_dev     : 'http://127.0.0.1:9304/api/eva/',
  sweetalert  : 'https://cdn.jsdelivr.net/npm/sweetalert2@11',
  repo        : 'https://raw.githubusercontent.com/9r3i/hotelbandara/master/',
  fonts       : 'https://raw.githubusercontent.com/9r3i/hotelbandara/master/',
  hotel       : 'http://localhost//',
  lastReport  : 'http://localhost//dev/report/report.latest.txt',
};

/* user information */
this.user=null;
this.eva=null;
this.parser=null;
this.ini=null;
this.dialog=null;
this.IMAGES=IMAGES||{};
this.main=null;
this.rooms=null;
this.roomStatusInfo=null;
this.apps=[
  'unspecified',
  'account',
  'front_office',
  'food_baverage',
  'engineering',
  'security',
  'marketing',
  'housekeeping',
  'purchasing',
  'accounting',
  'admin',
];
this.paymentMethods={
  cash:'Cash',
  wire_mandiri:'Transfer Mandiri',
  wire_bca:'Transfer BRI',
  card_mandiri:'Mandiri Debt/Credit',
  card_bca:'BRI Debt/Credit',
  petty_cash:'Petty Cash',
  account_receivable:'Account Receivable',
  qris_mandiri:'QRIS Mandiri',
  qris_bca:'QRIS BRI',
};
this.aliases={
  hotel_vendor:'Hotel Bandara Syariah',
  id:'ID',
  name:'Nama Lengkap',
  position:'Jabatan',
  division:'Divisi',
  card_id:'Nomor KTP/SIM',
  card_type:'Jenis ID',
  address:'Alamat Lengkap',
  birthdate:'Tanggal Lahir',
  birthplace:'Tempat Lahir',
  gender:'Jenis Kelamin',
  phone:'Nomor HP',
  email:'Email',
  religion:'Agama',
  nationality:'Kewarganegaraan',
  username:'Username',
  privilege:'Level Keamanan',
  scope:'Cakupan Akses',
  profile_id:'Profile ID',
  active:'Aktif',
  type:'Jenis',
  /* request order */
  ro_number:'No',
  ro_item_id:'Nama Item',
  ro_price:'Harga',
  ro_count:'Jumlah',
  ro_unit:'Satuan',
  ro_subtotal:'Subtotal',
  ro_estimate:'Estimasi',
  ro_note:'Catatan',
  ro_status:'Status',
  /* purchase order */
  po_uid:'Operator',
  po_estimate:'Estimasi Harga',
  po_status:'Status',
  po_note:'Catatan',
  /* suppliers */
  company_name:'Nama Perusahaan',
  contact_name:'Nama Kontak',
  contact_phone:'Nomor Kontak',
  bank_account:'Nomor Rekening',
  bank_name:'Nama Bank',
  supplier_name:'Nama Supllier',
  supplier_cost:'Harga Supplier',
  /* payment methods */
  cash:'Cash',
  wire_mandiri:'Transfer Mandiri',
  wire_bca:'Transfer BCA',
  card_mandiri:'Mandiri Debt/Credit',
  card_bca:'BCA Debt/Credit',
  petty_cash:'Petty Cash',
  account_receivable:'Account Receivable',
  /* market segment */
  publish_rate:'Publish Rate',
  personal:'Personal',
  /* coa */
  coa_code:'Account Code',
  coa_name:'Account Name',
  coa_variable:'Account Variable',
  coa_category:'Account Category',
  /* item */
  item_id:'ID Barang',
  item_name:'Nama Barang',
  item_mark:'Merek',
  item_unit:'Satuan',
  item_count:'Jumlah',
  item_price:'Harga Barang',
  item_type:'Jenis Barang',
  item_sub_total:'Sub Total',
  item_stock:'Stok Barang',
  item_stock_min:'Stok Minimal',
  item_stock_max:'Stok Maksimal',
  category:'Kategori',
  selling_price:'Harga Jual',
  purchase_price:'Harga Beli',
  stock:'Stok',
  stock_min:'Stok Minimun',
  stock_max:'Stok Maksimum',
  group:'Kelompok',
  last_update:'Update Terakhir',
  date_request:'Tanggal Permintaan',
  price_estimation:'Estimasi Harga',
  operator:'Operator',
  status:'Status',
  note:'Catatan',
  total:'Total',
  fax:'Fax',
  /* payment */
  payment_method:'Metode Pembayaran',
  payment_bearer:'Pengemban Dana',
  payment_nominal:'Nominal Pembayaran',
  payment_paid:'Nominal Yang Dibayar',
  payment_time:'Waktu Pembayaran',
  payment_cashback:'Kembalian Pembayaran',
  cashback:'Kembalian',
  /* guest */
  guest_id:'ID Tamu',
  guest_name:'Nama Tamu',
  guest_card_type:'Jenis Kartu',
  guest_card_id:'No Kartu',
  guest_address:'Alamat',
  guest_phone:'Phone',
  guest_email:'Email',
  guest_nationality:'Kewarganegaraan',
  guest_greet:'Panggilan',
  guest_guest_type:'Jenis Tamu',
  checkin_date:'Tanggal Checkin',
  /* transaction */
  transaction_date:'Tanggal Transaksi',
  transaction_type:'Jenis Transaksi',
  transaction_amount:'Jumlah Transaksi',
  transaction_deposit:'Deposit',
  transaction_credit:'Kedit',
  transaction_debt:'Debit',
  transaction_balance:'Balance',
  /* menu */
  menu_id:'ID Menu',
  menu_name:'Nama Menu',
  menu_category:'Kategori',
  menu_type:'Jenis',
  menu_price:'Harga',
  menu_unit:'Satuan',
  menu_count:'Jumlah',
  menu_subtotal:'Subtotal',
  /* room service */
  male:'Laki-laki',
  female:'Perempuan',
  child:'Anak-anak',
  head_count:'Jumlah Kepala',
  estimate_pack:'Estimasi Pack',
  service_time:'Waktu Layanan',
  total_bill:'Total Tagihan',
  regid:'RegID',
  room_number:'Nomor Kamar',
  /* room */
  room_code:'Kode Kamar',
  room_name:'Nama Kamar',
  room_type:'Type Kamar',
  room_floor:'Lantai',
  room_normal_rate:'Normal Rate',
  /* table restaurant */
  table_number:'Nomor Meja',
  table_name:'Nama Pelanggan',
  table_total:'Total Tagihan',
  table_servant:'Pelayanan',
  table_time:'Waktu',
  /* market */
  market_id:'ID',
  market_category:'Kategori',
  market_segment:'Segmen Pasar',
  market_name:'Nama Perusahaan',
  market_telp:'Telepon',
  market_address:'Alamat',
  market_email:'Email',
  market_price:'Potongan Harga',
  /* category */
  regular:'Regular',
  corporate:'Corporate',
  government:'Government',
  airlines:'Airlines',
  travel_agent:'Travel Agent',
  /* accounting general ledger */
  date:'Tanggal',
  information:'Keterangan',
  ref:'Ref',
  credit:'Kredit',
  debt:'Debit',
  deposit:'Deposit',
  balance:'Balance',
  account_name:'Nama Akun',
  account_number:'Nomor Akun',
  /* accounting asset */
  asset_id:'ID',
  asset_name:'Nama Aset',
  asset_nominal:'Harga Aset',
  asset_coa_id:'Nama Akun',
  asset_note:'Catatan',
  asset_year:'Tahun',
  /* accounting adjustment */
  adjustment_regid:'RegID',
  adjustment_id:'ID',
  adjustment_year:'Tahun',
  adjustment_month:'Bulan',
  adjustment_date:'Tanggal',
  adjustment_flow:'Arus Dana',
  adjustment_coa_id:'Nama Akun',
  adjustment_item_id:'Nama Item',
  adjustment_amount:'Amount',
  adjustment_deposit:'Deposit',
  adjustment_balance:'Saldo',
  adjustment_credit:'Kredit',
  adjustment_debt:'Debit',
  adjustment_name:'Nama Transaksi',
  adjustment_note:'Keterangan',
  adjustment_status:'Status',
};
this.positions={
  internship:'Internship',
  trainee:'Trainee',
  casual:'Casual',
  security:'Security',
  gardener:'Gardener',
  chef:'Chef',
  engineering:'Engineering',
  food_baverage_service:'F&B Service',
  front_office_attendant:'Front Office Attendant',
  room_attendant:'Room Attendant',
  executive_chef:'Executive Chef',
  sales_executive:'Sales Executive',
  chief_purchasing:'Chief Purchasing',
  chief_accounting:'Chief Accounting',
  general_manager:'General Manager',
  admin:'Admin',
};
this.divisions={
  unspecified:'Unspecified',
  front_office:'Front Office',
  food_baverage:'Food and Beverage',
  engineering:'Engineering',
  security:'Security',
  marketing:'Marketing',
  housekeeping:'Housekeeping',
  purchasing:'Purchasing',
  accounting:'Accounting',
  admin:'HRD',
  account:'Profile',
};
this.religions=[
  'Islam',
  'Catholic',
  'Protestant',
  'Hinduism',
  'Buddhism',
  'Shinto',
  'Taoism',
  'Sikhism',
  'Judaism',
  'Irreligion',
  'Other'
];
this.months=[
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
/**
 * transaction type pointing to table_name of database
 * this might be the same procedur for regid table
 */
this.transactionTypes={
  0:'',
  1:'purchase_order',
  2:'registration',
  3:'extrabill_cart',
  4:'request_order',
  5:'payment',
  6:'room_service',
  7:'restaurant',
  8:'payment_resto',
  9:'adjustment',
};


/* initialize as contructor */
this.init=function(){
  /* initialize eva */
  let eva_default_config={
    host:this.production?this.hosts.eva:this.hosts.eva_dev,
    apiVersion:'__EVA_VERSION__',
    token:'__EVA_TOKEN__',
  },
  eva_config=localStorage.getItem('eva_config');
  this.eva=new eva(eva_config||eva_default_config);
  this.parser=new parser;
  this.ini=new ini;
  /* load sweetalert */
  this.loadScriptURL(this.hosts.sweetalert);
  /* put the object to global scope */
  window._Hotel=this;
  /* return the object */
  return this;
};
/* start the app */
this.start=async function(app){
  /* check everything is ready */
  let isReady=await this.isEverythingReady();
  if(!isReady){return alert('Error: Something is not ready!');}
  /* statusbar */
  this.statusBar('#7c1111');
  /* setup backbutton */
  document.addEventListener("backbutton",e=>{
    e.preventDefault();
    this.confirm('Close the app?','',yes=>{
      if(yes){
        this.closeApp();
      }
    });
  },false);
  /* remove context menu */
  if(this.production!==false){
    window.addEventListener('contextmenu',function(e){
      e.preventDefault();
      return false;
    },false);
  }
  /* clear body element */
  document.body.innerHTML='';
  /* prepare print style */
  if(typeof ABL_OBJECT==='object'&&ABL_OBJECT!==null&&!Array.isArray(ABL_OBJECT)){
    for(let style of ABL_OBJECT.data.style){
      let elStyle=document.createElement('style');
      elStyle.media='print,screen';
      elStyle.rel='stylesheet';
      elStyle.textContent=style;
      document.head.append(elStyle);
    }
  }else{
    let link=document.createElement('link');
    link.type='text/css';
    link.rel='stylesheet';
    link.href='css/hotel'+(this.production?'.min':'')+'.css';
    document.head.append(link);
  }
  /* check userdata */
  let user=this.userData();
  if(user){
    this.user=user;
    let scopes=user.scope=='*'?this.apps:user.scope.split(',');
    this.user.scope=[];
    for(let scope of scopes){
      if(this.apps.indexOf(scope.trim())>=0){
        this.user.scope.push(scope.trim());
      }
    }
  }
  /* update page */
  this.updatePage();
  /* login page */
  if(!this.isLogin()){
    window.hotelPage=function(){
      _Hotel.start(true);
    };
    this.statusBar('#7c1111');
    let main=app?this.loginPage():this.mainPage();
    document.body.append(main);
    return false;
  }
  /* load basic ui */
  this.main=this.basicUI(this.alias('hotel_vendor'));
  document.body.append(this.main);
  /* movable menu */
  this.menuMovable();
  /* set division header */
  let division=typeof app==='string'?app:this.user.profile.division,
  headerText=this.divisions.hasOwnProperty(division)?this.divisions[division]:division;
  this.main.bodyHeader.innerText=headerText;
  this.main.bodyHeader.dataset.scope=JSON.stringify(this.user.scope);
  this.main.bodyHeader.dataset.app=division;
  this.main.bodyHeader.dataset.text=headerText;
  this.main.bodyHeader.dataset.open='0';
  this.main.bodyHeader.dataset.width=this.main.bodyHeader.offsetWidth+'px';
  this.main.bodyHeader.style.width=this.main.bodyHeader.offsetWidth+'px';
  this.main.bodyHeader.onclick=async function(){
    if(this.dataset.open=='1'){return;}
    this.dataset.open='1';
    this.style.width='200px';
    if(_Hotel.user.scope.length<3){
      await _Hotel.sleep(500);
      this.style.width=this.dataset.width;
      this.dataset.open='0';
      return;
    }
    let divisions=_Hotel.divisions,
    scope=_Hotel.parseJSON(this.dataset.scope),
    apps={};
    for(let i of scope){
      if(i=='account'){continue;}
      apps[i]=divisions[i];
    }
    let sel=_Hotel.select('app',this.dataset.app,apps,e=>{
      _Hotel.start(sel.value);
    });
    this.innerHTML='';
    this.append(sel);
    sel.focus();
    sel.onblur=async e=>{
      await _Hotel.sleep(500);
      this.style.width=this.dataset.width;
      this.dataset.open='0';
      this.innerText=this.dataset.text;
    };
  };
  /* ---------- APPLICATION (per division) ---------- */
  let menus=[],
  appDiv=typeof app==='string'?app:this.user.profile.division,
  appClass=this.getAppClassName(appDiv);
  if(typeof window[appClass]==='function'&&this.apps.indexOf(appDiv)>=0){
    if(this.user.scope.indexOf(appDiv)>=0
      &&this.user.privilege>=4){
      let _AppObject=new window[appClass];
      menus=typeof _AppObject.menus==='function'?_AppObject.menus():[];
      if(typeof _AppObject.dashboard==='function'){
        _AppObject.dashboard();
      }else{
        this.accountPage();
      }
    }else{
      let errorTitle='Error: Access denied!',
      errorMessage='Your access to "'+appDiv+'" division is denied. '
        +'Please, contact your administrator to solve this problem.';
      this.alert(
        errorTitle,
        errorMessage,
        'error'
      );
      this.main.put(errorTitle,errorMessage);
    }
  }else{
    let errorTitle='Error: Application is not available!',
    errorMessage='The application of "'+appDiv+'" division is not available. '
      +'Please, contact your administrator to solve this problem.';
    this.alert(
      errorTitle,
      errorMessage,
      'error'
    );
    this.main.put(errorTitle,errorMessage);
  }
  /* put the menus */
  for(let menu of menus){
    this.main.addMenu(menu.name,menu.icon,menu.callback);
  }
  /* account menus */
  if(this.user.scope.indexOf('account')>=0){
    this.main.addMenu('Profile','user',function(){
      _Hotel.menuHide();
      _Hotel.accountPage();
    });
    this.main.addMenu('Logout','power-off',function(){
      _Hotel.menuHide();
      _Hotel.logout();
    },'#d33');
  }
  /* menu ui fix */
  window.addEventListener('resize',e=>{
    this.menuUIFix();
  },false);
  this.menuUIFix();
};


/* ---------- HELPER ---------- */
this.newRegID=async function(type=0){
  let queries=[
    'insert into regid uid='+this.user.id+'&type='+type,
    'select * from regid where uid='+this.user.id
      +' and type='+type+' order by id desc limit 1',
  ].join(';'),
  res=await this.request('queries',queries);
  return {
    insert:res[0],
    regid:res[1].length>0?res[1][0].id:0,
  };
};
/* room status table -- return: table element -- require: roomStatusSelector */
this.roomStatus=async function(codes=[]){
  codes=Array.isArray(codes)?codes:[];
  /* prepare query */
  let loaded=true,
  id='room-status-'+this.uniqid(),
  queries=['select * from room_status'];
  /* check loaded data */
  if(this.roomStatusInfo===null
    ||this.rooms===null){
    loaded=false;
    queries.push('select * from room');
    queries.push('select * from room_status_info');
  }
  /* execute queries */
  let data=await this.request('queries',queries.join(';')),
  status=data[0],
  floors={},
  statusInfo={},
  table=this.table();
  /* check loaded data */
  if(!loaded){
    loaded=true;
    this.rooms=data[1];
    this.roomStatusInfo=data[2];
  }
  /* set status info */
  for(let sinfo of this.roomStatusInfo){
    if(codes.indexOf(sinfo.code)>=0){
      statusInfo[parseInt(sinfo.code)]=sinfo.name;
    }
  }
  /* set floors */
  for(let room of this.rooms){
    if(!floors.hasOwnProperty(room.floor)){
      floors[room.floor]={
        total:0,
        rooms:[],
      };
    }
    floors[room.floor].total++;
    let scode=_Hotel.getValueByKey('room_id',room.id,'code',status),
    stime=_Hotel.getValueByKey('room_id',room.id,'update',status),
    sname=_Hotel.getValueByKey('code',scode,'name',this.roomStatusInfo),
    sdetail=_Hotel.getValueByKey('code',scode,'detail',this.roomStatusInfo),
    select=codes.indexOf(parseInt(scode))>=0
      ?_Hotel.roomStatusSelector({
        id:id,
        code:scode,
        name:sname,
        statusInfo,
        room,
        table,
      })
      :_Hotel.element('div').text(sname),
    span=_Hotel.element('span',{
      'class':'front-room-span',
    },[
      select,
      _Hotel.element('span').text(sdetail),
      _Hotel.element('div').text(
        _Hotel.parseDatetime(parseInt(stime)*1000)
      ),
    ]),
    nroom=_Hotel.element('div',{
      'class':'front-room-status front-room-status-'+scode,
      title:'',
      id:id+'-'+room.id,
    },[
      _Hotel.element('div',{
        'class':'front-room-inner',
      }).html(
        room.number+' &middot; '+room.code
          +'<br />'+sname
      ),
      span,
    ]);
    nroom.dataset.room_number=room.number+'';
    nroom.dataset.room_code=room.code+'';
    nroom.dataset.status_code=scode+'';
    floors[room.floor].rooms.push(nroom);
  }
  /* print out */
  for(let floor in floors){
    let fr=floors[floor];
    table.head('FLOOR #'+floor+' ('+fr.total+' rooms)',1);
    table.row(_Hotel.element('div',{},fr.rooms));
  }
  /* set class and interval */
  table.classList.add('table-full');
  table.id=id;
  table.codes=codes;
  table.statusInfo=statusInfo;
  table.timer=false;
  table.interval=async function(sec=5){
    clearTimeout(this.timer);
    let _this=this,
    status=await _Hotel.request('query','select * from room_status'),
    el=document.getElementById(this.id);
    if(!el){return this;}
    for(let st of status){
      let nroom=document.getElementById(this.id+'-'+st.room_id);
      if(!nroom||nroom.dataset.status_code==st.code){
        continue;
      }
      nroom.dataset.status_code=st.code+'';
      let scode=st.code,
      stime=st.update,
      sname=_Hotel.getValueByKey('code',scode,'name',_Hotel.roomStatusInfo),
      sdetail=_Hotel.getValueByKey('code',scode,'detail',_Hotel.roomStatusInfo),
      room=_Hotel.getDataById(st.room_id,_Hotel.rooms),
      sndiv=nroom.childNodes[0],
      select=nroom.childNodes[1].childNodes[0],
      span=nroom.childNodes[1].childNodes[1],
      spant=nroom.childNodes[1].childNodes[2];
      nroom.setAttribute('class','front-room-status front-room-status-'+scode);
      sndiv.innerHTML=nroom.dataset.room_number+' &middot; '+nroom.dataset.room_code+'<br />'+sname;
      span.innerText=sdetail;
      spant.innerText=_Hotel.parseDatetime(stime*1000);
      if(this.codes.indexOf(parseInt(scode))>=0){
        if(select.tagName.toLowerCase()=='select'){
          select.dataset.value=scode;
          select.dataset.valueText=sname;
          select.value=scode;
        }else{
          nroom.childNodes[1].removeChild(select);
          select=_Hotel.roomStatusSelector({
            id:this.id,
            code:scode,
            name:sname,
            statusInfo:this.statusInfo,
            room,
          });
          nroom.childNodes[1].insertBefore(select,span);
        }
      }else{
        if(select.tagName.toLowerCase()=='div'){
          select.innerText=sname;
        }else{
          nroom.childNodes[1].removeChild(select);
          select=_Hotel.element('div').text(sname);
          nroom.childNodes[1].insertBefore(select,span);
        }
      }
    }
    this.timer=setTimeout(function(){
      if(!_Hotel.user){return;}
      _this.interval(sec);
    },parseInt(sec,10)*0x3e8);
    return this;
  };
  /* return the table */
  return table;
};
/* room status selector -- return: select element */
this.roomStatusSelector=function(config){
  config=typeof config==='object'&&config!==null?config:{};
  let select=_Hotel.select('room_status',config.code,config.statusInfo);
  select.dataset.value=config.code+'';
  select.dataset.valueText=config.name;
  select.dataset.id=config.id;
  select.room=config.room;
  select.table=config.table;
  select.addEventListener('change',async function(){
    clearTimeout(this.table.timer);
    let nroom=this.parentNode.parentNode,
    scode=this.value,
    sname=_Hotel.getValueByKey('code',scode,'name',_Hotel.roomStatusInfo),
    sdetail=_Hotel.getValueByKey('code',scode,'detail',_Hotel.roomStatusInfo),
    sndiv=nroom.childNodes[0],
    span=this.parentNode.childNodes[1],
    spant=this.parentNode.childNodes[2],
    yes=await _Hotel.confirmX(
      'Change room status?',
      'Room '+this.room.number
        +' from '+this.dataset.valueText
        +' to '+sname
    );
    if(!yes){
      this.value=this.dataset.value;
      return;
    }
    let innerQuery=_Hotel.buildQuery({
      code:this.value,
      update:Math.ceil((new Date).getTime()/1000),
    }),
    query='update room_status ('+innerQuery+') where room_id='+this.room.id,
    res=await _Hotel.request('query',query);
    if(res!=1){
      return _Hotel.alert('Error: Failed to update room status!',res,'error');
    }
    /* change after success */
    nroom.classList.remove('front-room-status-'+this.dataset.value);
    nroom.classList.add('front-room-status-'+scode);
    nroom.dataset.status_code=scode+'';
    sndiv.innerHTML=this.room.number+' &middot; '+this.room.code+'<br />'+sname;
    span.innerText=sdetail;
    spant.innerText=_Hotel.parseDatetime((new Date).getTime());
    this.dataset.value=scode;
    this.dataset.valueText=sname;
    this.parentNode.style.removeProperty('display');
    this.table.interval();
  },false);
  select.addEventListener('focus',function(){
    this.parentNode.style.display='block';
  },false);
  select.addEventListener('blur',async function(){
    this.parentNode.style.removeProperty('display');
  },false);
  return select;
};
/* dialog view -- helper */
this.dialogView=function(type=0,regid=0){
  if(type==1){
    return _Hotel.requestOrderView(regid);
  }else if(type==2){
    return (new HotelFrontOffice).reservationView(regid);
  }else if(type==3){
    return (new HotelFrontOffice).extrabillView(regid);
  }else if(type==4){
    return (new HotelPurchasing).requestOrderView(regid);
  }else if(type==5){
    return (new HotelFrontOffice).paymentView(regid);
  }else if(type==6){
    return (new HotelFoodBaverage).roomServiceView(regid);
  }else if(type==7){
    return (new HotelFoodBaverage).restaurantView(regid);
  }else if(type==8){
    return (new HotelFoodBaverage).paymentView(regid);
  }else if(type==9){
    return _Hotel.adjustmentView(regid);
  }
  return false;
};
/* menu ui fix hover on each one of them */
this.menuUIFix=function(){
  if(window.innerWidth>820||window.innerWidth<=620){
    return;
  }
  let ms=document.getElementsByClassName('menu-each');
  for(let i=0;i<ms.length;i++){
    ms[i].addEventListener('mouseover',function(e){
      let mt=this.childNodes[1],
      mouseY=e.pageY!=null?e.pageY:e.clientY!=null?e.clientY:null;
      mt.style.top=mouseY+'px';
    },false);
  }
};
/* table: adjustment */
this.adjustments=async function(date='all',month,year,coa_id=0,title='Adjustments',readonly=false,columns=null){
  _Hotel.main.loader();
  let defDate=_Hotel.production?(new Date).getDate():'all',
  defCols=[
    'regid',
    'date',
    'name',
    'item_id',
    'coa_id',
    'credit',
    'debt',
    'balance',
    'note',
  ];
  columns=typeof columns==='object'&&columns!==null?columns:defCols;
  year=year||(new Date).getFullYear();
  month=!isNaN(parseInt(month,10))?month:(new Date).getMonth();
  date=date||defDate;
  let tQuery='select * from adjustment where year='+year
    +' and month='+month
    +(date=='all'?'':' and date='+date)
    +(coa_id==0?'':' and coa_id='+coa_id)
    +' order by id desc',
  queries=[
    tQuery,
    'select * from coa',
    'select * from price',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  trans=data[0],
  coa=data[1],
  items=data[2],
  table=_Hotel.table(),
  oMonths=_Hotel.arrayToObject(this.months),
  kdate=Math.floor(year/4)==year?29:28,
  mdates=[31,kdate,31,30,31,30,31,31,30,31,30,31],
  dates=_Hotel.select('date',date,[
    'all',
    ..._Hotel.range(1,mdates[month]),
  ],function(){
    this.object.adjustments(
      this.value,
      parseInt(this.dataset.month),
      this.dataset.year,
      this.dataset.coa_id,
      this.dataset.title,
      this.dataset.readonly==1?true:false,
    );
  },{year,month,coa_id,title,readonly:readonly?'1':'0'}),
  months=_Hotel.select('month',month,oMonths,function(){
    this.object.adjustments(
      this.dataset.date,
      parseInt(this.value),
      this.dataset.year,
      this.dataset.coa_id,
      this.dataset.title,
      this.dataset.readonly==1?true:false,
    );
  },{year,date,coa_id,title,readonly:readonly?'1':'0'}),
  years=_Hotel.select('year',year,this.getYears(),function(){
    this.object.adjustments(
      this.dataset.date,
      parseInt(this.dataset.month),
      this.value,
      this.dataset.coa_id,
      this.dataset.title,
      this.dataset.readonly==1?true:false,
    );
  },{month,date,coa_id,title,readonly:readonly?'1':'0'}),
  add=_Hotel.button('Add','green','plus',function(){
    this.object.adjustmentEdit(
      0,
      this.dataset.coa_id,
      this.dataset.title,
    );
  },{coa_id,title}),
  pbutton=_Hotel.button('Print','orange','print',function(){
    window.print();
  });
  /* set class object */
  dates.object=this;
  months.object=this;
  years.object=this;
  add.object=this;
  /* set coa and items */
  this.coa=coa;
  this.items=items;
  /* put to main */
  _Hotel.main.put(
    title+' &#8213; '+this.months[month]+' '+year,
    _Hotel.element('div',{},[
      months,
      years,
      readonly?pbutton:'',
      table,
    ])
  );
  /* header */
  let colHeader=[],
  colKey=[];
  for(let col of columns){
    if(defCols.indexOf(col)>=0){
      colHeader.push(_Hotel.alias('adjustment_'+col));
      colKey.push(col);
    }
  }
  if(!readonly){
    colHeader.push(add);
  }
  let row=table.row.apply(table,colHeader).header();
  /* total */
  let totalAmount=0,
  totalDeposit=0,
  totalCredit=0,
  totalDebt=0,
  totalBalance=0;
  /* each */
  for(let tran of trans){
    let amount=parseInt(tran.amount,10),
    deposit=parseInt(tran.deposit,10),
    credit=tran.flow==1?amount:0,
    debt=tran.flow==0?amount:0,
    balance=tran.flow==1?totalBalance+amount:totalBalance-amount,
    tdate=[
      tran.year,
      (parseInt(tran.month,10)+1).toString().padStart(2,'0'),
      tran.date.toString().padStart(2,'0'),
    ].join('-'),
    coaName=_Hotel.getValueById(tran.coa_id,'name',coa),
    itemName=_Hotel.getValueById(tran.item_id,'name',items),
    edit=_Hotel.button('Edit','blue','edit',function(){
      this.object.adjustmentEdit(
        this.dataset.regid,
        this.dataset.coa_id,
        this.dataset.title,
      );
    },{regid:tran.regid,coa_id,title}),
    close=_Hotel.button('Close','red','lock',async function(){
      let yes=await _Hotel.confirmX('Close this '+this.dataset.title+'?');
      if(!yes){return;}
      let loader=_Hotel.loader(), 
      queries=[
        'update adjustment (status=1) where regid='+this.dataset.regid,
        'update transaction (status=1) where regid='+this.dataset.regid,
      ].join(';'),
      res=await _Hotel.request('queries',queries);
      loader.remove();
      this.buttons.innerHTML='';
      this.buttons.append(this.view);
    },{regid:tran.regid,coa_id,title}),
    view=_Hotel.button('View','green','search',function(){
      this.object.adjustmentView(this.dataset.regid);
    },{regid:tran.regid,coa_id,title}),
    transfer=_Hotel.button('Transfer','blue','send',function(){
      this.object.coaTransfer(this.dataset.regid);
    },{regid:tran.regid,coa_id,title}),
    buttons=_Hotel.element('div',{
      'class':'td-buttons'
    },tran.status==1?[view,transfer]:[edit,close]);
    /* set table row value */
    let trow={
      regid:tran.regid,
      date:tdate,
      name:tran.name,
      item_id:itemName,
      coa_id:coaName,
      credit:_Hotel.parseNominal(credit),
      debt:_Hotel.parseNominal(debt),
      balance:_Hotel.parseNominal(balance),
      note:tran.note,
    },
    colValue=[];
    for(let col of columns){
      if(defCols.indexOf(col)>=0&&trow.hasOwnProperty(col)){
        colValue.push(trow[col]);
      }
    }
    if(!readonly){
      colValue.push(buttons);
    }
    /* put to the row */
    let row=table.row.apply(table,colValue);
    /* button object */
    edit.object=this;
    view.object=this;
    transfer.object=this;
    /* close property */
    close.view=view;
    close.buttons=buttons;
    /* row column justify */
    let centered=['regid'],
    righted=['credit','debt','balance'];
    for(let i in columns){
      if(centered.indexOf(columns[i])>=0){
        row.childNodes[i].classList.add('td-center');
      }
      if(righted.indexOf(columns[i])>=0){
        row.childNodes[i].classList.add('td-right');
      }
    }
    totalAmount+=amount;
    totalDeposit+=deposit;
    totalCredit+=credit;
    totalDebt+=debt;
    totalBalance=balance;
  }
  /* get total key */
  let totaled={
    credit:_Hotel.parseNominal(totalCredit),
    debt:_Hotel.parseNominal(totalDebt),
    balance:_Hotel.parseNominal(totalCredit-totalDebt),
  },
  rtotal=[],
  ctotal=[];
  for(let i in columns){
    let col=columns[i];
    if(totaled.hasOwnProperty(col)){
      rtotal.push(totaled[col]);
      ctotal.push(i);
    }else{
      rtotal.push('');
    }
  }
  if(!readonly){
    rtotal.push('');
  }
  /* total */
  row=table.row.apply(table,rtotal).header();
  /* justify */
  for(let i of ctotal){
    row.childNodes[i].classList.add('td-right');
  }
};
/* adjustment edit/add */
this.adjustmentEdit=async function(regid=0,coa_id=0,title='Adjustment',def={},nosource=false){
  _Hotel.main.loader();
  let asset={
    regid:0,
    year:(new Date).getFullYear(),
    month:(new Date).getMonth(),
    date:(new Date).getDate(),
    flow:0,
    coa_id:coa_id,
    amount:0,
    deposit:0,
    item_id:0,
    status:0,
    name:'',
    note:'',
  },
  data,query,queries,
  coa=this.coa,
  items=this.items,
  table=_Hotel.table(),
  del=_Hotel.button('Delete','red','trash',async function(){
    let yes=await _Hotel.confirmX('Delete this '+this.dataset.title+'?');
    if(!yes){return;}
    let loader=_Hotel.loader(), 
    queries=[
      'delete from adjustment where regid='+this.dataset.regid,
      'delete from transaction where regid='+this.dataset.regid,
    ].join(';'),
    res=await _Hotel.request('queries',queries);
    loader.remove();
    return this.object.adjustments(null,null,null,this.dataset.coa_id,this.dataset.title);
  },{regid,coa_id,title}),
  save=_Hotel.button('Save','blue','save',async function(){
    let data=_Hotel.formSerialize(),
    source_id=data.source,
    date=[
      data.year,
      (parseInt(data.month,10)+1).toString().padStart(2,'0'),
      data.date.toString().padStart(2,'0'),
    ].join('-');
    if(new Date(date)=='Invalid Date'){
      return _Hotel.alert('Error: Invalid Date!','','error');
    }
    /* new regid */
    delete data.source;
    data.regid=this.dataset.regid;
    if(this.dataset.regid==0){
      let nrd=await _Hotel.newRegID(9);
      data.regid=nrd.regid;
    }
    /* starting queries */
    let tInnerQuery=_Hotel.buildQuery({
      regid:data.regid,
      uid:_Hotel.user.id,
      amount:data.amount,
      deposit:data.deposit,
      flow:data.flow,
      type:9,
      date:data.date,
      month:data.month,
      year:data.year,
    }),
    tQuery=this.dataset.regid==0
      ?'insert into transaction '+tInnerQuery
      :'update transaction ('+tInnerQuery+') where regid='+data.regid,
    innerQuery=_Hotel.buildQuery(data),
    loader=_Hotel.loader(),
    query=this.dataset.regid==0
      ?'insert into adjustment '+innerQuery
      :'update adjustment ('+innerQuery+') where regid='+data.regid,
    queries=[query,tQuery].join(';'),
    res=await _Hotel.request('queries',queries);
    /* source */
    if(this.dataset.regid==0&&source_id&&source_id!=0){
      let nreg=await _Hotel.newRegID(9),
      flow=data.flow;
      data.regid=nreg.regid;
      data.flow=flow==1?0:1;
      data.coa_id=source_id;
      innerQuery=_Hotel.buildQuery(data);
      query='insert into adjustment '+innerQuery;
      tInnerQuery=_Hotel.buildQuery({
        regid:data.regid,
        uid:_Hotel.user.id,
        amount:data.amount,
        deposit:data.deposit,
        flow:data.flow,
        type:9,
        date:data.date,
        month:data.month,
        year:data.year,
      });
      tQuery='insert into transaction '+tInnerQuery;
      queries=[query,tQuery].join(';');
      res=await _Hotel.request('queries',queries);
    }
    /*  */
    /* ending */
    loader.remove();
    let coaName=_Hotel.getValueById(this.dataset.coa_id,'name',this.object.coa),
    title=coaName||this.dataset.title;
    return this.object.adjustments(null,null,null,this.dataset.coa_id,title);
  },{regid,coa_id,title}),
  section=_Hotel.element('div',{
    'class':'section row-buttons',
  },[save,regid!=0?del:'',]);
  /* button object */
  save.object=this;
  del.object=this;
  if(!Array.isArray(coa)||!Array.isArray(items)){
    queries=[
      'select * from coa',
      'select * from price',
    ].join(';');
    data=await _Hotel.request('queries',queries);
    coa=data[0];
    items=data[1];
    this.coa=coa;
    this.items=items;
  }
  /* def to asset */
  for(let i in asset){
    if(def.hasOwnProperty(i)){
      asset[i]=def[i];
    }
  }
  /* no regid */
  if(regid!=0){
    query='select * from adjustment where regid='+regid;
    data=await _Hotel.request('query',query);
    asset=data.length>0?data[0]:asset;
  }
  /* main put */
  table.classList.add('table-register');
  _Hotel.main.put(
    (regid==0?'Add':'Edit')+' '+title+' '+(regid!=0?'#'+regid:''),
    _Hotel.main.double(table,section),
  );
  /* source */
  if(regid==0&&!nosource){
    let source=_Hotel.findSelect({
      key:'source',
      value:0,
      id:'source',
      data:coa,
      placeholder:'(blank means no source)',
    });
    table.row('Source Account Name',source);
  }
  /* passes and hidden input */
  let passes=['id','time','regid'];
  if(regid!=0){
    passes.push('status');
  }
  for(let i in def){
    if(passes.indexOf(i)<0){
      passes.push(i);
      let ihide=_Hotel.input(i,def[i],'hidden');
      section.append(ihide);
    }
  }
  /* each */
  for(let key in asset){
    let value=asset[key],
    val=_Hotel.input(key,value,'text',_Hotel.alias('adjustment_'+key),100);
    if(passes.indexOf(key)>=0){
      continue;
    }else if(key=='amount'||key=='deposit'){
      val.type='number';
      if(key=='amount'){
        val.onkeyup=function(){
          let depoInput=document.querySelector('input[name="deposit"]');
          if(depoInput){
            depoInput.value=this.value;
          }
        };
      }
    }else if(key=='flow'){
      val=_Hotel.radioActive(key,parseInt(value),['Outcome','Income']);
    }else if(key=='year'){
      val=_Hotel.select(key,value,_Hotel.getYears());
    }else if(key=='date'){
      val=_Hotel.select(key,value,_Hotel.range(1,31));
    }else if(key=='month'){
      val=_Hotel.select(key,value,_Hotel.arrayToObject(this.months));
    }else if(key=='status'){
      val=_Hotel.radioActive(key,value,['Open','Close'],true)
    }else if(key=='item_id'){
      val=_Hotel.findSelect({
        key:key,
        value:value,
        id:key,
        data:items,
        placeholder:'Item Name',
      });
    }else if(key=='coa_id'){
      val=coa_id==0
        ?_Hotel.findSelect({
          key:key,
          value:value,
          id:key,
          data:coa,
          placeholder:'Account Name',
        })
        :_Hotel.element('span',{},[
          _Hotel.input(key,value,'hidden'),
          _Hotel.getValueById(coa_id,'name',coa),
        ]);
    }
    let row=table.row(_Hotel.alias('adjustment_'+key),val);
  }
};
/* adjustment view */
this.adjustmentView=async function(regid){
  let dialog=await _Hotel.dialogPage(),
  queries=[
    'select * from adjustment where regid='+regid,
    'select * from price',
    'select * from coa',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  trans=data[0],
  items=data[1],
  coa=data[2],
  content=_Hotel.element('div');
  if(trans.length<1){
    dialog.put('Error: Failed to get data!');
    return;
  }
  /* each */
  for(let tran of trans){
    let table=_Hotel.table(),
    div=_Hotel.element('div',{
      'class':'adjustment-view-inline',
    },[table]);
    content.append(div);
    /* header */
    let coaData=_Hotel.getDataById(tran.coa_id,coa)||{
      name:'',
      variable:'',
    },
    row=table.head(coaData.variable+'<br />'+coaData.name+' #'+regid,2);
    /* each */
    let passes=['id','time','year','month','regid','status','coa_id'];
    for(let key in tran){
      let value=tran[key],
      val=value;
      if(passes.indexOf(key)>=0){
        continue;
      }else if(key=='date'){
        val=_Hotel.parseDate(parseInt(tran.time,10)*1000);
      }else if(key=='coa_id'){
        val=_Hotel.getValueById(value,'name',coa);
      }else if(key=='item_id'){
        val=_Hotel.getValueById(value,'name',items);
      }else if(key=='flow'){
        val=_Hotel.element('span',{
          'class':'balance-'+(value==1?'plus':'minus'),
        }).text(['Outcome','Income'][value]);
      }else if(key=='amount'||key=='deposit'){
        val=_Hotel.parseNominal(value);
      }
      
      row=table.row(_Hotel.alias('adjustment_'+key),val);
    }
  }
  /* put into dialog */
  dialog.put(content);
};
/* coa transfer -- table: adjustment */
this.coaTransfer=async function(regid=0){
  _Hotel.main.loader('Searching...');
  /* search form */
  let table=_Hotel.table(),
  tableX=_Hotel.table(),
  section=_Hotel.element('div',{
    'class':'section row-buttons',
  }),
  input=_Hotel.input('regid','','number','RegID or Ref No...',10),
  submit=_Hotel.button('Search','blue','search',()=>{
    this.coaTransfer(input.value);
  }),
  row=table.row('RegID',input,submit);
  _Hotel.main.put('COA Transfer '+(regid!=0?'#'+regid:''),_Hotel.element('div',{},[
    table,
    _Hotel.main.double(tableX,section),
  ]));
  /* regid zero */
  if(regid==0){
    return;
  }
  /* search by query */
  let queries=[
    'select * from adjustment where regid='+regid,
    'select * from coa',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  adjustments=data[0],
  coa=data[1];
  /* check data */
  if(adjustments.length==0){
    return _Hotel.alert('Error: Data is not found!','','error');
  }
  let adjustment=adjustments[0];
  /* coa parsing */
  let coaParsed={};
  for(let co of coa){
    coaParsed[co.id]=co.name;
  }
  /* child data */
  let coa_id=adjustment.coa_id;
  /* header */
  row=tableX.row(
    'Current COA',
    'Target COA',
  ).header();
  /* coa form */
  let coaTarget=_Hotel.findSelect({
    id:'coa-target',
    key:'coa_id',
    value:0,
    data:coa,
    placeholder:'Target of COA...',
  }),
  coaCurrent=_Hotel.select('coa_current',coa_id,coaParsed),
  coaName=_Hotel.getValueById(coa_id,'name',coa),
  save=_Hotel.button('Save','blue','save',async function(){
    let fdata=_Hotel.formSerialize(),
    loader=_Hotel.loader(),
    coa_id=fdata.coa_id,
    queries=[
      'update adjustment (coa_id='+coa_id+') where regid='+this.dataset.regid,
    ].join(';'),
    res=await _Hotel.request('queries',queries);
    loader.remove();
    return this.object.coaTransfer(this.dataset.regid);
  },{
    regid,
  });
  coaCurrent.disabled=true;
  save.object=this;
  row=tableX.row(coaName,coaTarget);
  section.append(save);
  /* tableX style and class */
  tableX.classList.add('table-register');
  tableX.style.marginBottom='10px';
  /* other readable data */
  row=tableX.row('Readable Data').header();
  row.childNodes[0].setAttribute('colspan',2);
  row=tableX.row('Name',adjustment.name);
  row=tableX.row('Note',adjustment.note);
  row=tableX.row('Amount',_Hotel.parseNominal(adjustment.amount));
  row.childNodes[1].classList.add('td-right');
  row=tableX.row('Status',adjustment.status==1?'Close':'Open');
  row=tableX.row('Flow',adjustment.flow==1?'Income':'Outcome');
  row=tableX.row('Date',_Hotel.parseDate(adjustment.time*1000));
};
/* request order -- table: purchase_order -- transaction_type: 1 */
this.requestOrders=async function(month,year,division){
  year=year||(new Date).getFullYear();
  month=!isNaN(parseInt(month,10))?month:(new Date).getMonth();
  division=division||_Hotel.user.profile.division;
  _Hotel.main.loader();
  let kdate=Math.floor(year/4)==year?29:28,
  kmonth=[31,kdate,31,30,31,30,31,31,30,31,30,31],
  dateTime=Math.floor((new Date([
    year,
    (parseInt(month,10)+1).toString().padStart(2,'0'),
    (1).toString().padStart(2,'0'),
  ].join('-'))).getTime()/1000),
  dateTimeEnd=dateTime+(3600*24*(kmonth[month]+1)),
  whereDivision=division=='purchasing'?'':' and division="'+division+'"',
  queries=[
    'select * from purchase_order where time > '
      +dateTime+' and time < '+dateTimeEnd+' '+whereDivision,
    'select * from price where division="purchasing"',
    'select * from coa',
    'select id,username as name,profile_id from user',
    'select * from employee',
    'select * from item_stock_hk',
    'select * from item_stock_fb',
    'select * from item_stock',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  orders=data[0],
  items=data[1],
  coa=data[2],
  users=data[3],
  employees=data[4],
  stockHK=data[5],
  stockFB=data[6],
  stockWarehouse=data[7],
  syear=_Hotel.select('month',month,_Hotel.arrayToObject(this.months),function(){
    this.object.requestOrders(this.value,this.dataset.year);
  },{month,year}),
  smonth=_Hotel.select('year',year,_Hotel.getYears(),function(){
    this.object.requestOrders(this.dataset.month,this.value);
  },{month,year}),
  table=_Hotel.table();
  /* selector object of this */
  syear.object=this;
  smonth.object=this;
  /* object data */
  this.coa=coa;
  this.items=items;
  this.itemStocks={
    housekeeping:stockHK,
    food_baverage:stockFB,
    purchasing:stockWarehouse,
  };
  /* put content */
  _Hotel.main.put('Request Orders &#8213; '+this.months[month]+' '+year,
    _Hotel.element('div',{},[
      smonth,
      syear,
      table,
    ]),
  );
  /* header */
  let add=_Hotel.button('Add','green','plus',function(){
    this.object.requestOrderEdit(0,this.dataset.division);
  },{month,year,division}),
  row=table.row(
    'RegID',
    'Date',
    _Hotel.alias('po_estimate'),
    _Hotel.alias('po_status'),
    _Hotel.alias('po_uid'),
    _Hotel.alias('po_note'),
    add,
  ).header(),
  statuses=[
    'Pending',
    'Done',
    'Approved',
    'Draft',
  ];
  add.object=this;
  /* each */
  for(let order of orders){
    let nd=new Date(order.time*1000),
    date=[
      nd.getFullYear(),
      (nd.getMonth()+1).toString().padStart(2,'0'),
      nd.getDate().toString().padStart(2,'0'),
    ].join('-'),
    edit=_Hotel.button('Edit','blue','edit',function(){
      this.object.requestOrderEdit(this.dataset.regid);
    },{regid:order.regid}),
    approve=_Hotel.button('Approve','red','send',async function(){
      let yes=await _Hotel.confirmX('Approve this request?');
      if(!yes){return;}
      let queries=[
        'update purchase_order (status=1) where regid='+this.dataset.regid,
      ],
      items=this.object.items,
      order=this.order,
      divisions=['housekeeping','food_baverage'],
      stockWarehouse=this.object.itemStocks.purchasing,
      stockDivision=this.object.itemStocks.hasOwnProperty(order.division)
        ?this.object.itemStocks[order.division]:[],
      sdTables={
        housekeeping:'item_stock_hk',
        food_baverage:'item_stock_fb',
      },
      sdTable=sdTables.hasOwnProperty(order.division)?sdTables[order.division]:'',
      odata=_Hotel.parseJSON(order.data),
      error=false;
      /* check order division */
      if(divisions.indexOf(order.division)<0){
        return _Hotel.alert('Error: Request from "'
          +_Hotel.divisions[order.division]
          +'" is not allowed!','','error');
      }
      /* check the stock */
      for(let od of odata){
        let item=_Hotel.getDataById(od.item_id,items),
        tstock=_Hotel.getDataByKey('item_id',od.item_id,stockWarehouse),
        wstock=tstock?parseInt(tstock.stock,10):0,
        dtstock=_Hotel.getDataByKey('item_id',od.item_id,stockDivision),
        dstock=dtstock?parseInt(dtstock.stock,10):0,
        orderDataCount=parseInt(od.count,10);
        if(!tstock||wstock<orderDataCount){
          error='Error: Warehouse stock "'+item.name+'" is not available!';
          break;
        }
        /* update warehouse, table: item_stock */
        queries.push('update item_stock (stock='
          +(wstock-orderDataCount)
          +') where item_id='+od.item_id);
        /* update warehouse, table: item_stock_hk or item_stock_fb */
        queries.push(dtstock
          ?'update '+sdTable+' (stock='
             +(dstock+orderDataCount)
            +') where item_id='+od.item_id
          :'insert into '+sdTable+' '+_Hotel.buildQuery({
            item_id:od.item_id,
            stock:dstock+orderDataCount,
          })
        );
      }
      /* check the error */
      if(error){
        return _Hotel.alert(error,'','error');
      }
      let loader=_Hotel.loader(),
      res=await _Hotel.request('queries',queries.join(';'));
      loader.remove();
      return _Hotel.requestOrders();
    },{regid:order.regid,division}),
    view=_Hotel.button('View','green','search',function(){
      this.object.requestOrderView(this.dataset.regid);
    },{regid:order.regid}),
    user=_Hotel.getDataById(order.uid,users),
    employee=_Hotel.getDataById(user.profile_id,employees),
    operator=user.name+' ('+_Hotel.divisions[employee.division]+')',
    row=table.row(
      order.regid,
      date,
      _Hotel.parseNominal(order.estimate),
      statuses.hasOwnProperty(order.status)?statuses[order.status]:order.status,
      operator,
      order.note,
      _Hotel.element('div',{
        'class':'td-buttons',
      },[
        view,
        order.status==0||order.status==3?edit:'',
        division=='purchasing'&&order.status==0?approve:'',
      ]),
    );
    edit.object=this;
    view.object=this;
    approve.object=this;
    approve.order=order;
    row.childNodes[0].classList.add('td-center');
    row.childNodes[2].classList.add('td-right');
    row.childNodes[3].classList.add('td-center');
  }
};
this.requestOrderEdit=async function(regid,division){
  _Hotel.main.loader();
  regid=regid||0;
  division=division||_Hotel.user.profile.division;
  /* default */
  let def={
    regid:regid,
    uid:_Hotel.user.id,
    estimate:0,
    status:0,
    note:'',
    data:'[]',
    division:division,
  },
  nregid=0;
  if(regid!=0){
    let query='select * from purchase_order where regid='+regid,
    res=await _Hotel.request('query',query);
    if(res.length<1){
      return _Hotel.alert('Error: Data is not found!','','error');
    }
    def=res[0];
  }else{
    let nregidData=await _Hotel.newRegID(1);
    nregid=nregidData.regid;
  }
  /* table and section */
  let table=_Hotel.table(),
  save=_Hotel.button('Save','blue','save',async function(){
    let fdata=_Hotel.formSerialize(true),
    ndata=_Hotel.objectToArray(_Hotel.parseJSON(fdata.data));
    fdata.data=JSON.stringify(ndata);
    if(regid==0){
      fdata.regid=this.dataset.nregid;
    }
    /*  */
    /* start connection */
    let loader=_Hotel.loader(),
    innerQuery=_Hotel.buildQuery(fdata),
    query=this.dataset.regid==0
      ?'insert into purchase_order '+innerQuery
      :'update purchase_order ('+innerQuery+') where regid='+this.dataset.regid,
    res=await _Hotel.request('query',query);
    loader.remove();
    this.object.requestOrders();
  },{regid,nregid,division}),
  section=_Hotel.element('div',{
    'class':'section row-buttons',
  },[save]),
  row,
  tableData=_Hotel.table(),
  title=(regid==0?'Add':'Edit')+' Request Order '+(regid==0?'':'#'+regid),
  double=_Hotel.main.double(table,section);
  table.classList.add('table-register');
  save.object=this;
  /* put content */
  _Hotel.main.put(title,_Hotel.element('div',{},[
    tableData,
    double
  ]));
  /* each key -- hidden */
  section.append(_Hotel.input('uid',def.uid,'hidden'));
  section.append(_Hotel.input('division',def.division,'hidden'));
  section.append(_Hotel.input('status',def.status,'hidden'));
  /* estimate */
  let estimate={
    span:_Hotel.element('span').text(_Hotel.parseNominal(def.estimate)),
    input:_Hotel.input('estimate',def.estimate,'hidden'),
  };
  section.append(estimate.input);
  row=table.row(_Hotel.alias('ro_estimate'),estimate.span);
  row.childNodes[1].classList.add('tr-right');
  /* status */
  let statusSpan=_Hotel.element('span').text(def.status==0?'Pending':'Approved');
  row=table.row(_Hotel.alias('ro_status'),statusSpan);
  /* note */
  let note=_Hotel.textarea('note',def.note,_Hotel.alias('ro_note'),100);
  row=table.row(_Hotel.alias('ro_note'),note);
  /* table data */
  let add=_Hotel.button('Add','green','plus',function(){
    _Hotel.requestOrderEditAddRow(this.table,null,this.estimate);
  });
  row=tableData.row(
    _Hotel.alias('ro_number'),
    _Hotel.alias('ro_item_id'),
    _Hotel.alias('ro_price'),
    _Hotel.alias('ro_count'),
    _Hotel.alias('ro_unit'),
    _Hotel.alias('ro_subtotal'),
    add,
  ).header();
  add.table=tableData;
  add.estimate=estimate;
  tableData.dataset.counter='0';
  /* each item data */
  let itemData=_Hotel.parseJSON(def.data);
  itemData=Array.isArray(itemData)?itemData:[];
  for(let item of itemData){
    _Hotel.requestOrderEditAddRow(tableData,item,estimate);
  }
  /*  */
};
this.requestOrderEditAddRow=function(table,data,estimate){
  data=data||{
    item_id:0,
    count:0,
    price:0,
    subtotal:0,
    unit:'',
  };
  let items=this.items,
  counter=parseInt(table.dataset.counter,10)+1,
  del=_Hotel.button('Delete','red','trash',function(){
    let tr=document.querySelector('tr[data-counter="'+this.dataset.counter+'"]');
    if(tr){tr.remove();}
  },{counter}),
  count=_Hotel.input('data['+counter+'][count]',data.count,'number',_Hotel.alias('ro_count'),10),
  price={
    span:_Hotel.element('span').text(_Hotel.parseNominal(data.price)),
    input:_Hotel.input('data['+counter+'][price]',data.price,'hidden',_Hotel.alias('ro_price'),10),
  },
  subtotal={
    span:_Hotel.element('span').text(_Hotel.parseNominal(data.subtotal)),
    input:_Hotel.input('data['+counter+'][subtotal]',data.subtotal,'hidden',_Hotel.alias('ro_subtotal'),10),
  },
  unit={
    span:_Hotel.element('span').text(data.unit),
    input:_Hotel.input('data['+counter+'][unit]',data.unit,'hidden',_Hotel.alias('ro_unit'),20),
  },
  item_id=_Hotel.findSelect({
    id:'find-item',
    key:'data['+counter+'][item_id]',
    value:data.item_id,
    data:items,
    placeholder:_Hotel.alias('ro_item_id'),
    inject:{
      unit,
      price,
      subtotal,
      count,
    },
    callback:function(res,inject){
      /* count */
      inject.count.value=0;
      /* price */
      inject.price.span.innerText=_Hotel.parseNominal(res.data.nominal);
      inject.price.input.value=res.data.nominal;
      /* unit */
      inject.unit.span.innerText=res.data.unit;
      inject.unit.input.value=res.data.unit;
      /* subtotal */
      inject.subtotal.span.innerText=_Hotel.parseNominal(0);
      inject.subtotal.input.value=0;
    },
  }),
  row=table.row(
    counter,
    item_id,
    _Hotel.element('div',{},[price.span,price.input]),
    count,
    _Hotel.element('div',{},[unit.span,unit.input]),
    _Hotel.element('div',{},[subtotal.span,subtotal.input]),
    del,
  );
  row.dataset.counter=counter+'';
  table.dataset.counter=counter+'';
  row.childNodes[0].classList.add('td-center');
  row.childNodes[2].classList.add('td-right');
  row.childNodes[5].classList.add('td-right');
  /* count */
  count.estimate=estimate;
  count.subtotal=subtotal;
  count.price=price;
  count.onkeyup=function(){
    /* get subtotal */
    let value=parseInt(this.value,10),
    price=parseInt(this.price.input.value,10),
    subtotal=value*price;
    this.subtotal.span.innerText=_Hotel.parseNominal(subtotal);
    this.subtotal.input.value=subtotal;
    /* get total estimate */
    let total=_Hotel.getGrandTotal();
    this.estimate.span.innerText=_Hotel.parseNominal(total);
    this.estimate.input.value=total;
  };
};
this.requestOrderView=async function(regid){
  let dialog=await _Hotel.dialogPage(),
  queries=[
    'select * from purchase_order where regid='+regid,
    'select * from price',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  orders=data[0],
  items=data[1],
  content=_Hotel.element('div');
  if(orders.length<1){
    dialog.put('Error: Failed to get data!');
    return;
  }
  /* the order */
  let order=orders[0],
  odata=_Hotel.parseJSON(order.data),
  counter=0;
  tableData=_Hotel.table(),
  table=_Hotel.table();
  content.append(tableData);
  content.append(table);
  /* head */
  tableData.head('REQUEST ORDER #'+regid,5);
  /* header */
  row=tableData.row(
    _Hotel.alias('ro_number'),
    _Hotel.alias('ro_item_id'),
    _Hotel.alias('ro_price'),
    _Hotel.alias('ro_count'),
    _Hotel.alias('ro_subtotal'),
  ).header();
  /* order data */
  for(let od of odata){
    counter++;
    let item=_Hotel.getDataById(od.item_id,items),
    row=tableData.row(
      counter,
      item.name,
      _Hotel.parseNominal(od.price),
      od.count+' '+od.unit,
      _Hotel.parseNominal(od.subtotal),
    );
    row.childNodes[0].classList.add('td-center');
    row.childNodes[2].classList.add('td-right');
    row.childNodes[4].classList.add('td-right');
  }
  /* table */
  row=table.row(_Hotel.alias('ro_estimate'),_Hotel.parseNominal(order.estimate));
  row=table.row(_Hotel.alias('ro_status'),order.status==0?'Pending':'Approved');
  row=table.row(_Hotel.alias('ro_note'),order.note);
  /* put into dialog */
  dialog.put(content);
};
/* get grand total */
this.getGrandTotal=function(){
  let fdata=this.formSerialize(true),
  data=this.parseJSON(fdata.data),
  gtotal=0;
  for(let i in data){
    let val=data[i],
    subtotal=parseInt(val.price,10)*parseInt(val.count,10);
    gtotal+=subtotal;
  }return gtotal;
};


/* ---------- PAGES ---------- */
/* qr page */
this.qrPage=function(){
  let main=document.createElement('main'),
  wrapper=document.createElement('div'),
  header=document.createElement('div'),
  body=document.createElement('div'),
  footer=document.createElement('div'),
  loader=document.createElement('img'),
  clear=document.createElement('div');
  /* appending */
  body.append(loader);
  wrapper.append(header);
  wrapper.append(body);
  wrapper.append(footer);
  wrapper.append(clear);
  main.append(wrapper);
  /* class */
  main.classList.add('login-wrapper');
  wrapper.classList.add('login');
  header.classList.add('login-header');
  header.dataset.text='LoginQR';
  body.classList.add('login-body');
  footer.classList.add('login-footer');
  footer.dataset.text='Powered by 9r3i';
  footer.title='Powered by 9r3i';
  /* qrcode */
  body.id='qrcode-oauth';
  loader.alt='';
  loader.src=this.IMAGES['loader.gif'];
  setTimeout(function(){
    _Hotel.QR_OAUTH_ATTEMP=0;
    _Hotel.qrNewOTP();
  },0x3e8);
  /* footer link */
  footer.onclick=async function(){
    let url='https://github.com/9r3i',
    yes=await _Hotel.confirmX('Visit programmer website?','URL: '+url);
    if(!yes){return;}
    _Hotel.openURL(url,'_blank');
  };
  /* return the object */
  return main;
};
this.qrNewOTP=async function(){
  if(this.QR_OAUTH_ATTEMP>=0x03){
    return this.alert('Error: Failed to login!','','error');
  }
  this.QR_OAUTH_ATTEMP++;
  let id='qrcode-oauth',
  host=this.production?this.hosts.eva:this.hosts.eva_dev,
  urlNew=host+'hotel/otp/new/'+this.uniqid(),
  body=document.getElementById(id),
  otp=await fetch(urlNew,{mode:'cors'}).then(r=>r.text());
  if(!body){return;}
  body.dataset.otp=otp;
  body.innerHTML='';
  new QRCode(id,{
    text:otp,
    width:200,
    height:200,
    colorDark:"#000000",
    colorLight:"#ffffff",
    correctLevel:QRCode.CorrectLevel.H
  });
  this.qrCheckOTP();
  await this.sleep(55*1000);
  body=document.getElementById(id);
  if(!body){return;}
  let loader=document.createElement('img');
  loader.alt='';
  loader.src=this.IMAGES['loader.gif'];
  body.dataset.otp='';
  body.innerHTML='';
  body.append(loader);
  return this.qrNewOTP();
};
this.qrCheckOTP=async function(){
  let id='qrcode-oauth',
  body=document.getElementById(id);
  if(!body||!body.dataset.hasOwnProperty('otp')
    ||body.dataset.otp==''){return;}
  let host=this.production?this.hosts.eva:this.hosts.eva_dev,
  urlCheck=host+'hotel/otp/check/'+body.dataset.otp,
  res=await fetch(urlCheck,{mode:'cors'}).then(r=>r.text());
  if(res.toString().match(/^error/i)){
    return this.qrCheckOTP();
  }
  this.userData(this.parseJSON(res));
  this.start();
};
this.qrOauth=async function(otp=''){
  let res=await this.request('oauth',{otp});
  if(res.toString().match(/^error/i)){
    return false;
  }return true;
};
this.qrScan=async function(){
  let dialog=await this.dialogPage(),
  button=this.button('','red','stop',function(){
    if(this.dataset.state=='Stop'){
      this.scanner.stop();
      this.classList.remove('button-red');
      this.classList.add('button-blue');
      this.childNodes[0].classList.remove('fa-stop');
      this.childNodes[0].classList.add('fa-play');
      this.dataset.state='Start';
    }else{
      this.scanner.start();
      this.classList.remove('button-blue');
      this.classList.add('button-red');
      this.childNodes[0].classList.remove('fa-play');
      this.childNodes[0].classList.add('fa-stop');
      this.dataset.state='Stop';
    }
  },{state:'Stop'}),
  video=this.element('video');
  button.classList.add('video-button');
  dialog.put(_Hotel.element('div',{},[video,button]));
  /* initiate scanner */
  let scanner=new QrScanner(video,async result=>{
    scanner.stop();
    let loader=this.loader(),
    res=await this.qrOauth(result.data);
    loader.remove();
    if(!res){
      return this.alert('Error: Failed to login!',res,'error');
    }
    dialog.close();
    return this.alert('Successfully logged in to browser!','','success');
  },{
    onDecodeError:async error=>{
    },
    highlightScanRegion:true,
    highlightCodeOutline:true,
  });
  button.scanner=scanner;
  /* start scanning */
  scanner.start();
};
this.qrScanPlug=async function(){
  /* require: cordova-plugin-qrscanner-11 */
  if(typeof QRScanner!=='object'||QRScanner===null){
    return this.alert('Error: Failed to get scanner!','','error');
  }
  QRScanner.prepare((e,s)=>{
    if(e){
      return this.alert('Error: Failed to prepare camera!',e._message,'error');
    }
    if(!s.authorized){
      return this.alert('Error: Camera access denied!','','error');
    }
    QRScanner.show();
    QRScanner.scan(async (e,r)=>{
      if(e){return;}
      let loader=this.loader(),
      res=await this.qrOauth(r);
      loader.remove();
      QRScanner.hide();
      QRScanner.destroy();
      if(!res){
        return this.alert('Error: Failed to login!',res,'error');
      }
      return this.alert('Successfully logged in to browser!','','success');
    });
  });
};
/* login page */
this.loginPage=function(){
  if(this.isBrowser()){
    return this.qrPage();
  }
  let main=document.createElement('main'),
  wrapper=document.createElement('div'),
  header=document.createElement('div'),
  form=document.createElement('form'),
  table=this.table('login-table'),
  uname=document.createElement('input'),
  pword=document.createElement('input'),
  submit=document.createElement('input'),
  footer=document.createElement('div'),
  clear=document.createElement('div');
  table.row('Username',uname);
  table.row('Password',pword);
  table.row('',submit);
  /* appending */
  form.append(table);
  wrapper.append(header);
  wrapper.append(form);
  wrapper.append(footer);
  wrapper.append(clear);
  main.append(wrapper);
  /* class */
  main.classList.add('login-wrapper');
  wrapper.classList.add('login');
  header.classList.add('login-header');
  header.dataset.text='Login';
  uname.classList.add('login-input');
  uname.name='username';
  uname.type='text';
  uname.placeholder='Username';
  pword.classList.add('login-input');
  pword.name='password';
  pword.type='password';
  pword.placeholder='Password';
  submit.classList.add('login-submit');
  submit.classList.add('signin');
  submit.type='submit';
  submit.name='submit';
  submit.value='Send';
  footer.classList.add('login-footer');
  footer.dataset.text='Powered by 9r3i';
  footer.title='Powered by 9r3i';
  /* event */
  form.uname=uname;
  form.pword=pword;
  form.wrapper=wrapper;
  form.sbutton=submit;
  form.onsubmit=async function(e){
    e.preventDefault();
    this.sbutton.value='Sending...';
    let fdata={};
    for(let i=0;i<this.length;i++){
      if(this[i].name){
        fdata[this[i].name]=this[i].value;
      }
    }
    let loader=_Hotel.loader(),
    res=await _Hotel.request('login',fdata);
    loader.remove();
    this.sbutton.value='Send';
    if(typeof res==='object'&&res!==null&&res.hasOwnProperty('token')){
      _Hotel.userData(res);
      _Hotel.start();
    }else{
      this.wrapper.classList.add('login-shake');
      await _Hotel.sleep(500);
      this.wrapper.classList.remove('login-shake');
    }
  };
  footer.onclick=async function(){
    let url='https://github.com/9r3i',
    yes=await _Hotel.confirmX('Visit programmer website?','URL: '+url);
    if(!yes){return;}
    _Hotel.openURL(url,'_blank');
  };
  /* main set */
  main.form=form;
  /* return the object */
  return main;
};
/* update page */
this.updatePage=async function(){
  let raw=localStorage.getItem('abl-data-hotel').substring(0,15),
  mat=raw.match(/(\d+)/),
  versionCode=mat?parseInt(mat[1],10):this.versionCode;
  if(this.versionCode>=versionCode){
    await this.sleep(5000);
    await this.updatePage();
    return;
  }
  let versionText='v'+versionCode.toString().trim().split('').join('.'),
  yes=await this.confirmX('Update available!','Update now? ('+versionText+')');
  if(!yes){return;}
  await this.sleep(1000);
  this.statusBar('#ffffff');
  window.location.reload();
};
/* update page old */
this.updatePage__OLD=async function(){
  await this.sleep(5000);
  let res=await fetch(this.hosts.version,{
    mode:'cors',
  }).then(r=>r.text()),
  versionCode=parseInt(res,10),
  versionText='v'+res.toString().trim().split('').join('.');
  if(this.versionCode>=versionCode){
    return;
  }
  let yes=await this.confirmX('Update available!','Update now? ('+versionText+')');
  if(!yes){return;}
  /* start resetting */
  if(window.hasOwnProperty('ABL_OBJECT')
    &&typeof window.ABL_OBJECT==='object'
    &&window.ABL_OBJECT!==null){
    ABL_OBJECT.database(false);
  }
  this.loader();
  await this.sleep(1000);
  this.statusBar('#ffffff');
  window.location.reload();
};
/* account page */
this.accountPage=function(){
  let table=this.table(),
  passes=['time'];
  for(let key in this.user.profile){
    if(passes.indexOf(key)>=0){continue;}
    let value=this.user.profile[key];
    if(key=='birthdate'){
      value=this.parseDate(value);
    }else if(key=='gender'){
      value=value==1?'Laki-laki':'Perempuan';
    }else if(key=='division'){
      value=this.aliasDivision(value);
    }else if(key=='religion'){
      value=this.element('span',{
        id:'code-pad',
      }).text(this.aliasPosition(value));
    }else if(key=='position'){
      value=this.aliasPosition(value);
    }
    table.row(this.alias(key),value);
  }
  let row=document.createElement('div'),
  button=this.button('Edit','blue','edit',function(){
    _Hotel.accountEditPage();
  }),
  reset=this.button('Reset','blue','clock-o',async function(){
    let yes=await _Hotel.confirmX('Reset App?');
    if(!yes){return;}
    let loader=_Hotel.loader();
    if(typeof ABL_OBJECT==='object'&&ABL_OBJECT!==null
      &&typeof ABL_OBJECT.database==='function'){
      ABL_OBJECT.database(false);
    }
    _Hotel.statusBar('#FFFFFF');
    await _Hotel.sleep(1000);
    window.location.reload();
    return;
  }),
  changePass=this.button('Change Password','blue','lock',async function(){
    let opass=await _Hotel.promptX('Old Password','','password','Next'),
    npass=await _Hotel.promptX('New Password','','password','Next'),
    cpass=await _Hotel.promptX('Confirm Password','','password','Send');
    if(npass!==cpass){
      return _Hotel.alert('Error: Password is not equal!','','error');
    }
    let loader=_Hotel.loader(),
    res=await _Hotel.request('cpass',{
      old:opass,
      npass:npass,
    });
    loader.remove();
    if(res!='ok'){
      return _Hotel.alert('Error: Failed to change password.',res,'error');
    }
    await _Hotel.alertX('Saved!','','success');
    _Hotel.userData(false);
    _Hotel.user=null;
    _Hotel.loader();
    await _Hotel.sleep(500);
    _Hotel.start(true);
  }),
  reverseAccount=this.button('Reverse','blue','recycle',function(){
    let revData=_Hotel.userData(null,'reverse');
    _Hotel.userData(false,'reverse');
    _Hotel.userData(revData);
    _Hotel.start();
  }),
  scanBrowser=this.button('Scan QR','orange','qrcode',function(){
    if(window.CORDOVA_LOADED){
      _Hotel.qrScanPlug();
    }else{
      _Hotel.qrScan();
    }
  });
  row.classList.add('row-buttons');
  if(!this.isBrowser()){
    row.append(button);
  }
  row.append(reset);
  if(!this.isBrowser()){
    row.append(changePass);
    row.append(scanBrowser);
  }
  if(this.user.hasOwnProperty('reverse')&&this.user.reverse===true){
    row.append(reverseAccount);
  }
  row.classList.add('section');
  table.classList.add('table-register');
  this.main.put('Profile',this.main.double(table,row));
  this.codePage();
};
/* account edit page */
this.accountEditPage=function(){
  let table=this.table(),
  passes=['time'],
  read=[
    'id','name','card_id','card_type','gender','position','division',
    'birthdate','birthplace','religion','nationality',
  ];
  for(let key in this.user.profile){
    let value=this.user.profile[key];
    if(passes.indexOf(key)>=0){
        continue;
    }else if(key=='birthdate'){
      value=this.parseDate(value);
    }else if(key=='gender'){
      value=value==1?'Laki-laki':'Perempuan';
    }else if(key=='division'){
      value=this.aliasDivision(value);
    }else if(key=='position'){
      value=this.aliasPosition(value);
    }else if(key=='address'){
      value=this.textarea(key,value,this.alias(key));
    }else if(read.indexOf(key)<0){
      value=this.input(key,value,'text',this.alias(key));
    }
    table.row(this.alias(key),value);
  }
  table.classList.add('table-register');
  let row=document.createElement('div'),
  button=this.button('Save','blue','save',async function(){
    let loader=_Hotel.loader(),
    fdata=_Hotel.formSerialize();
    delete fdata.data;
    let innerQuery=_Hotel.buildQuery(fdata),
    query='update employee ('+innerQuery+') where id='+_Hotel.user.profile.id,
    res=await _Hotel.request('query',query);
    loader.remove();
    if(res!=1){
      return _Hotel.alert('Error: Failed to save!',res,'error');
    }
    await _Hotel.alertX('Saved!','','success');
    _Hotel.userData(false);
    _Hotel.user=null;
    _Hotel.loader();
    await _Hotel.sleep(500);
    _Hotel.start(true);
  });
  row.append(button);
  row.classList.add('section');
  this.main.put('Edit Profile',this.main.double(table,row));
};
/* iframe for none-logged-in users */
this.mainPage=function(){
  let main=document.createElement('iframe');
  main.src=this.production?'main.html':'../ready/main.html';
  main.style.position='absolute';
  main.style.width='calc(100%)';
  main.style.height=window.innerHeight+'px';
  main.style.top='0px';
  main.style.left='0px';
  main.style.right='0px';
  main.style.bottom='0px';
  main.style.border='0px none';
  main.style.margin='0px';
  main.style.padding='0px';
  main.id='main-page';
  window.addEventListener('resize',function(e){
    let main=document.getElementById('main-page');
    if(!main){return;}
    main.style.width='calc(100%)';
    main.style.height=window.innerHeight+'px';
  },false);
  return main;
};
/* code page */
this.codePage=function(){
  let id='code-pad',
  el=document.getElementById(id);
  if(!el){return;}
  window.CODE_TOUCH_COUNT=0;
  window.CODE_TOUCH_START=false;
  el.addEventListener('click',function(e){
    if(window.CODE_TOUCH_START){
      window.CODE_TOUCH_COUNT++;
      this.classList.add('code-pad-yellow');
      return;
    }
    window.CODE_TOUCH_COUNT=0;
    window.CODE_TOUCH_START=setTimeout(()=>{
      el.classList.remove('code-pad-yellow');
      let id='code-menu-yellow',
      menu=document.getElementById(id);
      if(!menu&&window.CODE_TOUCH_COUNT>=0x07){
        _Hotel.notif('Code is OK!','info');
        let input=_Hotel.input('code');
        input.addEventListener('keyup',function(e){
          if(e.keyCode!=13){return;}
          eval(this.value);
        },false);
        el.innerHTML='';
        el.append(input);
      }
      window.CODE_TOUCH_START=false;
      window.CODE_TOUCH_COUNT=0;
    },0x3e8);
  },false);
};
/* code menu */
this.codeMenu=function(){
  let id='code-menu-yellow',
  menu=document.getElementById(id);
  if(menu){return;}
  menu=_Hotel.main.addMenu('Code','code',function(){
    if(typeof window._Code!=='object'
      ||window._Code===null){
      new Code;
    }
    window._Code.CODE_FORM_ACTIVE=true;
    window._Code.recoding();
  },'yellow');
  menu.id=id;
  _Hotel.notif('Code is ready!','success');
};


/* ---------- EVA REQUEST ---------- */
/* database test */
this.testDB=async function(){
  let tables=await this.request('query','show tables'),
  queries=[];
  console.log('tables:',tables);
  for(let table of tables){
    queries.push('select count(id) as length from '+table);
  }
  let data=await this.request('queries',queries.join(';')),
  tdata=[];
  for(let i in data){
    let d=data[i];
    tdata.push({
      table:tables[i],
      length:d[0].length,
    });
  }
  console.table(tdata);
};
/* uload -- REQUIRES: eva.js */
this.uload=async (path,file)=>{
  let data=new FormData;
  data.append('uid',this.user.id);
  data.append('token',this.user.token);
  data.append('path',path);
  data.append('query','hotel uload EVA.data(data)');
  data.append('file',file);
  let res=await this.eva.request(data);
  return this.decode(res);
};
/* response errors of request */
this.requestErrors={
  'error:maintenance':'Server Maintenance!',
  'error:maintenance_text':'Server sedang dalam proses pemeliharaan, mohon kembali beberapa saat lagi.',
  'error:maintenance_icon':'info',
  'error:active':'Error: Inactive account!',
  'error:active_text':'Akun sedang dibekukan, silahkan hubungi divisi IT untuk mengaktifkan kembali.',
  'error:access':'Error: Access denied!',
  'error:access_text':'Akses ditolak, kemungkinan access_token sudah kadaluarsa.',
  'error:query':'Error: Invalid query data!',
  'error:form':'Error: Invalid request!',
  'error:user':'Error: Invalid username!',
  'error:pass':'Error: Invalid password!',
  'error:login':'Error: Failed to login!',
  'error:token':'Error: Invalid access token!',
  'error:save':'Error: Failed to save!',
  'error:otp_not_found':'Error: OTP is not found!',
  'error:otp_expired':'Error: OTP is expired!',
  'error:otp_used':'Error: OTP had been used!',
  'error:otp_zero':'Error: OTP is still zero!',
  'error:otp_not_zero':'Error: OTP is not zero!',
};
/* request -- REQUIRES: eva.js */
this.request=async (method,query,xid=0,xtoken='')=>{
  let uid=typeof this.user==='object'&&this.user!==null
      &&this.user.hasOwnProperty('id')?this.user.id:xid,
  token=typeof this.user==='object'&&this.user!==null
    &&this.user.hasOwnProperty('token')?this.user.token:xtoken,
  body={
    query:[
      'hotel',
      method,
      '"'+this.encode(query)+'"',
      uid,
      token,
    ].join(' '),
  },
  res=await this.eva.request(body,{
    error:function(e){
      _Hotel.loader(false);
      let title='Error: Koneksi terputus!',
      text=JSON.stringify(e);
      _Hotel.alert(title,text,'error');
    },
  }),
  data=this.decode(res);
  if(!this.production&&this.debugRequest){
    console.log({method,query,res:[res],data});
    console.trace();
  }
  if(!data){
    _Hotel.loader(false);
    _Hotel.alert('Error','Terjadi masalah pada koneksi.','error');
  }else if(typeof data==='string'&&data.match(/^error:/)){
    _Hotel.loader(false);
    let title=this.requestErrors.hasOwnProperty(data)
      ?this.requestErrors[data]:'Error!',
    text=this.requestErrors.hasOwnProperty(data+'_text')
      ?this.requestErrors[data+'_text']:data,
    icon=this.requestErrors.hasOwnProperty(data+'_icon')
      ?this.requestErrors[data+'_icon']:'error';
    _Hotel.alert(title,text,icon);
    if(data=='error:active'||data=='error:access'){
      _Hotel.userData(false);
      _Hotel.user=null;
      _Hotel.loader();
      setTimeout(()=>{
        document.body.setAttribute('class','');
        _Hotel.start(true);
      },1000);
    }
  }else if(typeof data==='object'&&data!==null
    &&data.hasOwnProperty('error')){
    _Hotel.loader(false);
    _Hotel.alert('Error!',JSON.stringify(data.error),'error');
  }
  return data;
};
/* encode -- for request */
this.encode=(data)=>{
  let str=JSON.stringify(data);
  return btoa(str);
};
/* decode -- for request */
this.decode=(data)=>{
  let res=null,
  str=atob(data);
  try{
    res=JSON.parse(str);
  }catch(e){
    res=false;
  }return res;
};


/* ---------- USER ---------- */
/* logout */
this.logout=async function(){
  let yes=await this.confirmX('Logout?');
  if(!yes){return;}
  this.userData(false);
  this.user=null;
  this.loader();
  await this.sleep(500);
  this.start(true);
};
/* logged in */
this.isLogin=()=>{
  return this.user?true:false;
};
/* user data */
this.userData=(ndata,suffix)=>{
  suffix=typeof suffix==='string'?'-'+suffix:'';
  let key='hotel-user'+suffix,
  res=false;
  if(ndata===false){
    localStorage.removeItem(key);
    return true;
  }else if(typeof ndata==='object'&&ndata!==null){
    let dataString=JSON.stringify(ndata);
    localStorage.setItem(key,dataString);
    return true;
  }
  let data=localStorage.getItem(key);
  try{
    res=JSON.parse(data);
  }catch(e){
    res=false;
  }
  return res;
};
/* location - promise */
this.userLocation=function(){
  return new Promise(resolve=>{
    navigator.geolocation.getCurrentPosition(r=>{
      return resolve(r);
    });
  });
};


/* ---------- SWEETALERT - sweetalert2@11 ---------- */
/* reset abl database */
this.reset=()=>{
  this.confirm('Reset the app?','',yes=>{
    if(yes){
      if(window.hasOwnProperty('ABL_OBJECT')
        &&typeof window.ABL_OBJECT==='object'
        &&window.ABL_OBJECT!==null){
        ABL_OBJECT.database(false);
      }
      let loader=this.loader();
      setTimeout(async ()=>{
        this.statusBar('#ffffff');
        window.location.reload();
      },1000);
      return true;
    }return false;
  });
};
/* alert promise -- REQUIRES: sweetalert2@11 */
this.alertX=function(title,text,icon){
  return new Promise(resolve=>{
    this.alert(title,text,icon,resolve);
  });
};
/* alert -- REQUIRES: sweetalert2@11 */
this.alert=(title='',text='',icon='',cb)=>{
  cb=typeof cb==='function'?cb:function(){};
  Swal.fire({
    title:title,
    text:text,
    icon:icon,
    confirmButtonColor:'#303030',
    preConfirm:async (result)=>{
      return cb(result);
    },
  });
};
/* prompt promise -- REQUIRES: sweetalert2@11 */
this.promptX=function(title,text,type,obutton){
  return new Promise(resolve=>{
    this.prompt(title,text,resolve,type,obutton);
  });
};
/* prompt -- REQUIRES: sweetalert2@11 */
this.prompt=(title,text,cb,type='text',obutton='OK')=>{
  title=typeof title==='string'?title:'';
  text=typeof text==='string'?text:'';
  cb=typeof cb==='function'?cb:function(){};
  Swal.fire({
    title:title,
    text:text,
    input:type,
    inputAttributes:{
      autocapitalize:'off',
      autocomplete:'off',
    },
    showCancelButton:true,
    cancelButtonText:'Cancel',
    cancelButtonColor:'#963030',
    confirmButtonText:obutton,
    confirmButtonColor:'#303030',
    showLoaderOnConfirm:true,
    allowOutsideClick:()=>!Swal.isLoading(),
    preConfirm:async (result)=>{
      return cb(result);
    },
  });
};
/* confirm promise -- REQUIRES: sweetalert2@11 */
this.confirmX=function(title,text){
  return new Promise(resolve=>{
    this.confirm(title,text,resolve);
  });
};
/* confifm -- REQUIRES: sweetalert2@11 */
this.confirm=(title,text,cb)=>{
  title=typeof title==='string'?title:'';
  text=typeof text==='string'?text:'';
  cb=typeof cb==='function'?cb:function(){};
  Swal.fire({
    title:title,
    text:text,
    showCancelButton:true,
    cancelButtonText:'No',
    cancelButtonColor:'#963030',
    confirmButtonText:'Yes',
    confirmButtonColor:'#303030',
  }).then(result=>{
    return cb(result.isConfirmed?true:false);
  });
};
/**
 * notif -- REQUIRES: sweetalert2@11
 * icons: success (default), error, warning, info, question
 */
this.notif=(message,icon)=>{
  let Toast=Swal.mixin({
    toast:true,
    position:"top-end",
    showConfirmButton:false,
    timer:1200,
    timerProgressBar:true,
    didOpen:(toast)=>{
      toast.onmouseenter=Swal.stopTimer;
      toast.onmouseleave=Swal.resumeTimer;
    }
  });
  icon=typeof icon==='string'?icon:'success';
  message=typeof message==='string'?message:'';
  Toast.fire({
    icon:icon,
    title:message
  });
};


/* ---------- CHECK and FAKE ---------- */
/* fake loader -- promise and circle-progress */
this.fakeLoaderZ=async function(i=0){
  let cp=new CircleProgress;
  cp.open();
  let res=await this.fakeLoaderX(function(e){
    cp.loading(e);
  },i);
  cp.close();
  return res;
};
/* fake loader -- promise */
this.fakeLoaderX=function(dl,i=0){
  return new Promise(resolve=>{
    this.fakeLoader(resolve,dl,i);
  });
};
/* fake loader -- no-ui */
this.fakeLoader=function(cb,dl,i=0){
  i=typeof i==='number'&&i!==NaN?i:0;
  if(i>=100){
    return typeof cb==='function'?cb(true):false;
  }
  i++;
  if(typeof dl==='function'){
    dl({
      type:'progress',
      loaded:i,
      total:100,
    });
  }
  setTimeout(e=>{
    this.fakeLoader(cb,dl,i);
  },10);
};
/* is everything ready -- with loader */
this.isEverythingReady=async function(){
  /* document */
  let res=await this.isDocumentReady();
  if(!res){return res;}
  /* circle progress */
  res=await this.isCircleProgressReady();
  if(!res){return res;}
  /* open circle progress */
  let cp=new CircleProgress;
  cp.open();
  /* sweet alert */
  res=await this.isSwalReady();
  if(!res){
    cp.close();
    return res;
  }
  /* cordova */
  res=await this.isCordovaReady();
  if(!res){
    cp.close();
    return res;
  }
  /* perform fake loader then close it */
  await this.fakeLoaderX(function(e){
    cp.loading(e);
  },0);
  cp.close();
  /* return the result */
  return res;
};
/* is cordova ready */
this.isCordovaReady=async function(){
  if(!window.CORDOVA_LOADED){
    return true;
  }
  let res=false;
  for(let i of this.range(1,100)){
    if(typeof cordova==='object'
      &&cordova!==null
      &&typeof StatusBar==='object'
      &&StatusBar!==null){
      res=true;
      break;
    }
    await this.sleep(50);
  }return res;
};
/* is swal ready */
this.isSwalReady=async function(){
  let res=false;
  for(let i of this.range(1,200)){
    if(typeof Swal==='function'){
      res=true;
      break;
    }
    await this.sleep(50);
  }return res;
};
/* is circle progress ready */
this.isCircleProgressReady=async function(){
  let res=false;
  for(let i of this.range(1,100)){
    if(typeof CircleProgress==='function'){
      res=true;
      break;
    }
    await this.sleep(10);
  }return res;
};
/* is document ready */
this.isDocumentReady=async function(){
  let res=false;
  for(let i of this.range(1,100)){
    if(typeof document.body==='object'
      &&document.body!==null){
      res=true;
      break;
    }
    await this.sleep(10);
  }return res;
};
/* is browser app -- const HOTEL_BROWSER_APP */
this.isBrowser=function(){
  if(typeof HOTEL_BROWSER_APP==='boolean'
    &&HOTEL_BROWSER_APP===true){
    return true;
  }return false;
};

/* ---------- UI METHODS ---------- */
/* dashboard menu */
this.dashboardMenu=function(menus){
  let menuDiv=[];
  for(let menu of menus){
    let each=this.element('div',{
      'class':'dashboard-menu-each',
      title:menu.name,
    },[
      this.element('i',{
        'class':'fa fa-'+menu.icon,
      }),
      this.element('span',{
        'class':'',
      }).text(menu.name),
    ]);
    each.onclick=menu.callback;
    menuDiv.push(each);
  }
  return menuDiv;
};
/* external page */
this.externalPage=function(url,title='Untitled'){
  let id='website-frame',
  frame=document.querySelector('#'+id),
  fc=document.querySelector('#'+id+'-close'),
  fh=document.querySelector('#'+id+'-head');
  if(frame){frame.parentElement.removeChild(frame);}
  if(fh){fh.parentElement.removeChild(fh);}
  if(fc){fc.parentElement.removeChild(fc);}
  if(typeof url!=='string'){
    frame=document.createElement('div');
  }else{
    let loader=this.loader();
    frame=document.createElement('iframe');
    frame.src=url;
    frame.onload=function(){
      loader.remove();
    };
    frame.onerror=function(){
      loader.remove();
    };
  }
  frame.id=id;
  frame.classList.add(id);
  document.body.appendChild(frame);
  fh=document.createElement('div');
  fh.classList.add(id+'-head');
  fh.id=id+'-head';
  fh.dataset.title=title;
  document.body.appendChild(fh);
  fc=document.createElement('div');
  fc.classList.add(id+'-close');
  fc.id=id+'-close';
  fc.title='Close';
  document.body.appendChild(fc);
  if(!document.body.classList.contains('dont-scroll')){
    document.body.classList.add('dont-scroll');
  }
  let dt=document.querySelector('title');
  if(dt){
    let baseTitle=dt.innerText;
    fc.dataset.title=baseTitle;
    dt.innerText=title;
  }
  window.EXTERNAL_OPEN=true;
  fc.onclick=function(e){
    _Hotel.externalPageClose();
  };
  return {
    content:frame,
    header:fh,
    close:function(){
      _Hotel.externalPageClose();
    },
  };
};
/* external page close */
this.externalPageClose=function(){
  let id='website-frame',
  frame=document.querySelector('#'+id),
  fc=document.querySelector('#'+id+'-close'),
  fh=document.querySelector('#'+id+'-head'),
  dt=document.querySelector('title');
  document.body.classList.remove('dont-scroll');
  window.EXTERNAL_OPEN=false;
  if(frame){frame.parentElement.removeChild(frame);}
  if(fh){fh.parentElement.removeChild(fh);}
  if(fc){
    if(dt){dt.innerText=fc.dataset.title;}
    fc.parentElement.removeChild(fc);
  }return true;
};
/* menu hide */
this.menuHide=function(id='menu'){
  let menu=document.getElementById(id),
  shade=document.getElementById('menu-shadow');
  if(!shade||!menu){return;}
  document.body.classList.remove('dont-scroll');
  menu.classList.remove('menu-show');
  shade.parentElement.removeChild(shade);
};
/* menu show */
this.menuShow=function(id='menu'){
  let menu=document.getElementById(id),
  shade=document.createElement('div');
  if(!menu){return;}
  menu.classList.add('menu-show');
  shade.classList.add('menu-shadow');
  shade.id='menu-shadow';
  shade.onclick=function(e){
    menu.classList.remove('menu-show');
    document.body.classList.remove('dont-scroll');
    this.parentElement.removeChild(this);
  };
  document.body.appendChild(shade);
  document.body.classList.add('dont-scroll');
};
/* menu movable */
this.menuMovable=function(id='menu'){
  if(!window.hasOwnProperty('ontouchstart')){return;}
  let el=document.getElementById(id);
  if(!el){return;}
  window.addEventListener('touchend',function(e){
    if(!window.MENU_MOVABLE_LEFT){return;}
    if(window.EXTERNAL_OPEN){
      window.MENU_MOVABLE_LEFT=false;
      return;
    }
    let isHide=window.MENU_MOVABLE_LEFT.hide,
    x=e.changedTouches?e.changedTouches[0].pageX:e.screenX,
    left=(x-window.MENU_MOVABLE_LEFT.x)+window.MENU_MOVABLE_LEFT.l;
    window.MENU_MOVABLE_LEFT=false;
    if(!isHide){
      _Hotel.menuShow(id);
    }else if(left<-100){
      _Hotel.menuHide(id);
    }
  },false);
  window.addEventListener('touchstart',function(e){
    if(window.EXTERNAL_OPEN||window.innerWidth>620){
      return;
    }
    let x=e.changedTouches?e.changedTouches[0].pageX:e.screenX,
    l=el.offsetLeft;
    if(l===0||x>15){
      if(x>250){
        window.MENU_MOVABLE_LEFT={x:x,l:l,el:el,hide:true};
      }return;
    }window.MENU_MOVABLE_LEFT={x:x,l:l,el:el,hide:false};
  },false);
};
/* basic ui */
this.basicUI=function(htext='Hotel'){
  let main=document.createElement('main'),
  header=document.createElement('div'),
  body=document.createElement('div'),
  mbutton=document.createElement('div'),
  menu=document.createElement('div'),
  mb1=document.createElement('div'),
  mb2=document.createElement('div'),
  mb3=document.createElement('div'),
  mheader=document.createElement('div'),
  bheader=document.createElement('div'),
  bcontent=document.createElement('div'),
  contentTitle=document.createElement('div'),
  contentContent=document.createElement('div'),
  contentContentImg=document.createElement('img'),
  contentContentText=document.createTextNode('Loading...'),
  imgLogo=document.createElement('img'),
  clear=document.createElement('div');
  /* append */
  main.append(header);
  main.append(body);
  header.append(mbutton);
  header.append(menu);
  mbutton.append(mb1);
  mbutton.append(mb2);
  mbutton.append(mb3);
  menu.append(mheader);
  body.append(bheader);
  body.append(bcontent);
  body.append(clear);
  bcontent.append(contentTitle);
  bcontent.append(contentContent);
  contentContent.append(contentContentImg);
  contentContent.append(contentContentText);
  /* add classes and ids */
  main.classList.add('main');
  header.classList.add('header');
  header.id='header';
  header.dataset.text=htext;
  header.dataset.version='v'+this.version+(this.production?'':'-dev');
  mbutton.classList.add('menu-button');
  mbutton.id='menu-button';
  mb1.classList.add('menu-button-strip');
  mb2.classList.add('menu-button-strip');
  mb3.classList.add('menu-button-strip');
  menu.classList.add('menu');
  menu.id='menu';
  mheader.classList.add('menu-header');
  mheader.id='menu-header';
  body.classList.add('body');
  body.id='body';
  bcontent.classList.add('body-content');
  bcontent.id='body-content';
  bheader.classList.add('body-header');
  bheader.id='body-header';
  contentTitle.classList.add('title');
  contentContent.classList.add('content');
  contentContentImg.style.marginRight='10px';
  contentContentImg.src=this.IMAGES.hasOwnProperty('loader.gif')?this.IMAGES['loader.gif']:'';
  contentContentImg.alt='';
  clear.style.clear='both';
  /* image logo */
  imgLogo.alt='';
  imgLogo.src=this.IMAGES['logo.png'];
  imgLogo.classList.add('image-logo');
  header.append(imgLogo);
  /* prepare element */
  main.header=header;
  main.mbutton=mbutton;
  main.menu=menu;
  main.body=body;
  main.bodyContent=bcontent;
  main.bodyHeader=bheader;
  /* ----- OTHER OBJECTS AND METHODS ----- */
  main.base={
    title:contentTitle,
    content:contentContent,
  };
  main.double=function(leftX='',rightX=''){
    let left=document.createElement('div'),
    right=document.createElement('div'),
    wrap=document.createElement('div');
    /* append elements */
    wrap.append(left);
    wrap.append(right);
    /* add class name */
    left.classList.add('content-left');
    right.classList.add('content-right');
    /* add element content */
    if(typeof leftX==='string'){
      left.innerHTML=leftX;
    }else{
      left.append(leftX);
    }
    if(typeof rightX==='string'){
      right.innerHTML=rightX;
    }else{
      right.append(rightX);
    }
    /* add element method */
    wrap.left=left;
    wrap.right=right;
    /* return the wrap */
    return wrap;
  };
  main.triple=function(leftX='',centerX='',rightX=''){
    let left=document.createElement('div'),
    center=document.createElement('div'),
    right=document.createElement('div'),
    wrap=document.createElement('div');
    /* append elements */
    wrap.append(left);
    wrap.append(center);
    wrap.append(right);
    /* add class name */
    left.classList.add('content-triple-left');
    center.classList.add('content-triple-center');
    right.classList.add('content-triple-right');
    /* add element content */
    if(typeof leftX==='string'){
      left.innerHTML=leftX;
    }else{
      left.append(leftX);
    }
    if(typeof centerX==='string'){
      center.innerHTML=centerX;
    }else{
      center.append(centerX);
    }
    if(typeof rightX==='string'){
      right.innerHTML=rightX;
    }else{
      right.append(rightX);
    }
    /* add element method */
    wrap.left=left;
    wrap.center=center;
    wrap.right=right;
    /* return the wrap */
    return wrap;
  };
  main.put=function(title='',content=''){
    this.base.title.innerHTML=title;
    if(typeof content==='object'&&content!==null
      &&typeof content.append==='function'){
      this.base.content.innerHTML='';
      this.base.content.append(content);
    }else{
      this.base.content.innerHTML=content;
    }
  };
  main.loader=function(loadText='Loading...'){
    let img=new Image,
    loader=document.createElement('div'),
    text=document.createTextNode(loadText);
    img.alt='';
    img.style.marginRight='10px';
    img.src=_Hotel.IMAGES.hasOwnProperty('loader.gif')?_Hotel.IMAGES['loader.gif']:'';
    loader.append(img);
    loader.append(text);
    this.put('',loader);
  };
  /* menu functions */
  main.addMenu=function(text,icon,cb,color='#ddd'){
    let div=document.createElement('div'),
    di=document.createElement('i'),
    dt=document.createElement('div');
    div.append(di);
    div.append(dt);
    this.menu.append(div);
    div.classList.add('menu-each');
    di.classList.add('fa');
    di.classList.add('fa-'+icon);
    di.style.color=color;
    dt.classList.add('menu-text');
    dt.innerText=text;
    div.title=text;
    div.callback=typeof cb==='function'?cb:function(){};
    div.onclick=function(){
      _Hotel.menuHide();
      _Hotel.loader(false);
      this.callback();
    };
    return div;
  };
  mbutton.onclick=function(){
    _Hotel.menuShow();
  };
  /* app title */
  let appTitle=document.head.querySelector('title');
  if(appTitle){
    appTitle.innerText=htext;
  }
  /* return the main element */
  return main;
};
/* input */
this.input=function(name='',value='',type='text',placeholder='',maxlength=100,dataset={}){
  let input=document.createElement('input');
  input.name=name;
  input.value=value;
  input.type=type;
  input.placeholder=placeholder;
  input.setAttribute('maxlength',maxlength);
  for(let key in dataset){
    input.dataset[key]=dataset[key];
  }
  if(window.cordova!==undefined&&type=='date'){
    input.classList.add('calendar');
  }
  return input;
};
/* input[type="radio"] */
this.radioActive=function(key='',value=0,data=['Inactive','Active'],reverse=false){
  let div=document.createElement('div'),
  rad0=document.createElement('input'),
  lab0=document.createElement('label'),
  rad1=document.createElement('input'),
  lab1=document.createElement('label');
  rad0.type='radio';
  rad1.type='radio';
  rad0.id='radio-'+data[0];
  lab0.setAttribute('for','radio-'+data[0]);
  rad1.id='radio-'+data[1];
  lab1.setAttribute('for','radio-'+data[1]);
  lab0.classList.add('radio');
  lab0.classList.add('radio-'+(reverse?'active':'inactive'));
  lab1.classList.add('radio');
  lab1.classList.add('radio-'+(reverse?'inactive':'active'));
  rad0.name=key;
  rad1.name=key;
  rad0.value='0';
  rad1.value='1';
  if(value==1){
    rad1.checked='checked';
  }else{
    rad0.checked='checked';
  }
  lab0.innerText=data[0];
  lab1.innerText=data[1];
  div.append(rad0);
  div.append(lab0);
  div.append(rad1);
  div.append(lab1);
  return div;
};
/* input[type="checkbox"] */
this.checkbox=function(name='',value=''){
  let id=this.uniqid(),
  span=document.createElement('span'),
  label=document.createElement('label'),
  input=document.createElement('input');
  input.type='checkbox';
  input.id=id;
  input.name=name;
  input.value=value;
  label.setAttribute('for',id);
  label.classList.add('checkbox');
  span.classList.add('cbox');
  span.append(input);
  span.append(label);
  span.input=input;
  span.label=label;
  return span;
};
/* button */
this.button=function(text='',color='blue',icon='',callback,dataset={}){
  let i=document.createElement('i'),
  t=document.createTextNode(text),
  button=document.createElement('button');
  button.append(i);
  button.append(t);
  button.classList.add('button');
  button.classList.add('button-'+color);
  i.classList.add('fa');
  i.classList.add('fa-'+icon);
  callback=typeof callback==='function'?callback:function(){};
  button.onclick=callback;
  button.icon=i;
  button.text=t;
  button.callback=callback;
  for(let key in dataset){
    button.dataset[key]=dataset[key];
  }
  return button;
};
/* textarea */
this.textarea=function(name='',value='',placeholder='',maxlength=100,dataset={}){
  let textarea=document.createElement('textarea');
  textarea.name=name;
  textarea.value=value;
  textarea.placeholder=placeholder;
  textarea.maxlength=maxlength;
  for(let key in dataset){
    textarea.dataset[key]=dataset[key];
  }
  return textarea;
};
/* select */
this.select=function(name='',value='',data={},callback,dataset={}){
  let select=document.createElement('select');
  select.name=name;
  if(Array.isArray(data)){
    let ndata={};
    for(let i of data){
      ndata[i]=i;
    }
    data=ndata;
  }
  for(let k in data){
    let opt=document.createElement('option');
    opt.value=k;
    opt.textContent=data[k];
    if(value==k){
      opt.selected='selected';
    }
    select.append(opt);
  }
  select.onchange=typeof callback==='function'?callback:function(){};
  for(let key in dataset){
    select.dataset[key]=dataset[key];
  }
  return select;
};
/* table */
this.table=function(cname='table',cellspacing=2,cellpadding=0){
  let table=document.createElement('table'),
  tbody=document.createElement('tbody');
  table.append(tbody);
  table.classList.add(cname);
  table.setAttribute('cellspacing',cellspacing+'px');
  table.setAttribute('cellpadding',cellpadding+'px');
  table.tbody=tbody;
  table.row=function(){
    let tr=document.createElement('tr');
    for(let tk in arguments){
      let td=document.createElement('td');
      if(typeof arguments[tk]==='object'){
        td.append(arguments[tk]);
      }else{
        td.innerHTML=''+arguments[tk]+'';
        if(arguments[tk].toString().match(/^\d+$/)){
          td.classList.add('td-left');
        }
      }
      tr.append(td);
    }
    this.tbody.append(tr);
    tr.header=function(){
      this.classList.add('tr-header');
      return this;
    };
    return tr;
  };
  table.head=function(text='',length=2){
    let tr=document.createElement('tr'),
    td=document.createElement('td');
    td.setAttribute('colspan',''+length+'');
    if(typeof text==='object'){
      td.append(text);
    }else{
      td.innerHTML=text;
    }
    tr.append(td);
    tr.classList.add('tr-head');
    this.tbody.append(tr);
    return tr;
  };
  return table;
};
/* dialog page */
this.dialogPage=async function(){
  let old=document.getElementById('dialog-close');
  if(old){old.close();}
  let main=document.createElement('div'),
  close=document.createElement('div'),
  inner=document.createElement('div'),
  imgc=new Image,
  img=new Image;
  img.src=this.IMAGES['loader.gif'];
  imgc.src=this.IMAGES['icon-plus.png'];
  main.classList.add('dialog');
  main.classList.add('dialog-hide');
  main.append(inner);
  inner.append(img);
  inner.classList.add('dialog-inner');
  inner.classList.add('dialog-loading');
  close.append(imgc);
  close.main=main;
  close.inner=inner;
  close.loader=img;
  close.id='dialog-close';
  close.classList.add('dialog-close');
  close.close=function(){
    this.main.remove();
    this.remove();
    _Hotel.dialog=null;
  };
  close.onclick=function(){
    this.close();
  };
  close.blank=function(){
    this.inner.classList.remove('dialog-loading');
    this.inner.innerHTML='';
    return this;
  };
  close.put=function(el){
    this.inner.classList.remove('dialog-loading');
    this.inner.innerHTML='';
    this.inner.append(el);
    return this;
  };
  this.dialog=close;
  document.body.append(main);
  await this.sleep(10);
  main.classList.remove('dialog-hide');
  await this.sleep(300);
  document.body.append(close);
  return close;
};
/* loader + dialog.close */
this.loader=function(close){
  let id='loader',
  old=document.getElementById(id);
  if(old){old.remove();}
  if(this.dialog){this.dialog.close();}
  if(close===false){return;}
  let outer=document.createElement('div'),
  inner=document.createElement('span');
  outer.append(inner);
  outer.id=id;
  inner.classList.add('loader-inner');
  outer.classList.add('loader-outer');
  document.body.append(outer);
  return outer;
};
/* find with select */
this.findSelect=function(config){
  /**
   * config
   *   - id          = string of main id
   *   - data        = array of data contains id and name
   *   - key         = string of key of input name
   *   - value       = string of default value
   *   - placeholder = string of placeholder
   *   - takenKey    = string of taken key for result; default: id
   *   - callback    = function of callback, parameter #1 is object {id,name,main,data}
   *                   - id of matched
   *                   - name of matched
   *                   - main.slave:
   *                     - input  = element of showed input  --> name
   *                     - result = element of hidden result --> id
   *                     - lists  = element of clickable list
   *                   - data = object of selected data
   *   - inject      = mixed of injected data to parameter #2 
  */
  config=typeof config==='object'&&config!==null?config:{};
  let ti=document.createElement('input'),
  data=config.hasOwnProperty('data')&&Array.isArray(config.data)?config.data:[],
  pmain=document.createElement('div'),
  plist=document.createElement('div'),
  pput=document.createElement('input'),
  takenKey=config.hasOwnProperty('takenKey')?config.takenKey:'id',
  key=config.hasOwnProperty('key')?config.key:'key',
  value=config.hasOwnProperty('value')?config.value:'',
  id=config.hasOwnProperty('id')?config.id:'finder',
  callback=typeof config.callback==='function'?config.callback
    :function(res){
      res.main.slave.result.value=res.id;
      res.main.slave.input.value=res.name;
    },
  inject=config.hasOwnProperty('inject')?config.inject:null;
  ti.type='hidden';
  ti.name=key;
  ti.value=value;
  ti.id='finder-result-'+key;
  pput.type='text';
  pput.value=this.getValueByKey(takenKey,value,'name',data)||'';
  pput.placeholder=config.hasOwnProperty('placeholder')?config.placeholder:'';
  pput.id='finder-input-'+key;
  pput.setAttribute('autocomplete','off');
  plist.classList.add('finder-list');
  plist.classList.add('finder-list-hide');
  pmain.classList.add('finder-main');
  pmain.append(ti);
  pmain.append(pput);
  pmain.append(plist);
  pput.onkeyup=e=>{
    delete pmain.name;
    if(pput.value){
      if(plist.classList.contains('finder-list-hide')){
        plist.classList.remove('finder-list-hide');
      }
    }else{
      plist.classList.add('finder-list-hide');
      return;
    }
    plist.innerHTML='';
    plist.classList.remove('finder-list-hide');
    let vm=new RegExp(pput.value,'i');
    for(let i=0;i<data.length;i++){
      if(data[i].name.match(vm)){
        let pl=document.createElement('div');
        pl.classList.add('finder-list-each');
        pl.innerText=data[i].name;
        pl.dataset.id=data[i].id+'';
        pl.dataset.key=key;
        pl.dataset.takenValue=data[i].hasOwnProperty(takenKey)?data[i][takenKey]:data[i].id;
        pl.dataset.data=JSON.stringify(data[i]);
        pl.onclick=async function(){
          let res=document.getElementById('finder-result-'+this.dataset.key);
          plist.classList.add('finder-list-hide');
          res.value=this.dataset.takenValue;
          pput.value=this.innerText;
          callback({
            id:this.dataset.id,
            name:this.innerText,
            main:pmain,
            data:_Hotel.parseJSON(this.dataset.data),
          },inject);
        };
        plist.append(pl);
      }
    }
  };
  pput.onfocus=e=>{
    delete pmain.name;
    if(pput.value){
      if(plist.classList.contains('finder-list-hide')){
        plist.classList.remove('finder-list-hide');
      }
    }
    plist.innerHTML='';
    plist.classList.remove('finder-list-hide');
    let vm=new RegExp(pput.value,'i');
    for(let i=0;i<data.length;i++){
      if(data[i].name.match(vm)){
        let pl=document.createElement('div');
        pl.classList.add('finder-list-each');
        pl.innerText=data[i].name;
        pl.dataset.id=data[i].id+'';
        pl.dataset.key=key;
        pl.dataset.takenValue=data[i].hasOwnProperty(takenKey)?data[i][takenKey]:data[i].id;
        pl.dataset.data=JSON.stringify(data[i]);
        pl.onclick=async function(){
          let res=document.getElementById('finder-result-'+this.dataset.key);
          plist.classList.add('finder-list-hide');
          res.value=this.dataset.takenValue;
          pput.value=this.innerText;
          callback({
            id:this.dataset.id,
            name:this.innerText,
            main:pmain,
            data:_Hotel.parseJSON(this.dataset.data),
          },inject);
        };
        plist.append(pl);
      }
    }
  };
  pput.onblur=async e=>{
    await this.sleep(200);
    plist.classList.add('finder-list-hide');
    return;
  };
  pmain.id=id;
  pmain.slave={
    result:ti,
    input:pput,
    list:plist,
  };
  return pmain;
};
/* date selection */
this.dateSelection=function(config){
  /**
   * config:
   *   - id    = string of element id
   *   - key   = string of input key 
   *   - value = default value
   *   - min   = minimum date; default: 1960-01-01
   *   - max   = maximum date; default: 2038-12-31
   * return: object of element with property of element: span and input
   */
  config=typeof config==='object'&&config!==null?config:{};
  let key=config.hasOwnProperty('key')?config.key:'key',
  value=config.hasOwnProperty('value')?config.value:'',
  min=config.hasOwnProperty('min')?config.min:'1960-01-01',
  max=config.hasOwnProperty('max')?config.max:'2038-12-31',
  id=config.hasOwnProperty('id')?config.id:'date-selection',
  val=document.createElement('div'),
  vdate=document.createElement('span'),
  idate=_Hotel.input(key,value,'date');
  idate.style.width='20px';
  idate.style.marginRight='10px';
  idate.text=vdate;
  idate.max=max;
  idate.min=min;
  idate.onchange=function(){
    this.text.innerText=_Hotel.parseDate(this.value);
  };
  idate.onfocus=function(){
    this.text.style.backgroundColor='rgba(51,51,51,0.8)';
    this.text.style.color='#fff';
  };
  idate.onblur=function(){
    this.text.style.backgroundColor='transparent';
    this.text.style.color='#333';
  };
  vdate.innerText=_Hotel.parseDate(value);
  vdate.input=idate;
  vdate.style.padding='3px 10px';
  vdate.style.borderRadius='5px';
  vdate.style.lineHeight='30px';
  vdate.style.whiteSpace='nowrap';
  vdate.onclick=function(){
    this.input.focus();
  };
  val.style.whiteSpace='nowrap';
  val.append(idate);
  val.append(vdate);
  val.input=idate;
  val.span=vdate;
  val.id=id;
  return val;
};
/* find row in the table */
this.findRow=function(key='name',callback,holder='Search...',hide=false){
  let find=document.createElement('input');
  find.type=hide?'password':'text';
  find.placeholder=holder;
  find.onkeyup=function(e){
    let rg=new RegExp(this.value,'i'),
    res={
      show:[],
      hide:[],
    },
    nm=document.querySelectorAll('tr[data-'+key+']');
    for(let i=0;i<nm.length;i++){
      if(nm[i].dataset[key].match(rg)){
        nm[i].style.removeProperty('display');
        res.show.push(nm[i]);
      }else{
        nm[i].style.display='none';
        res.hide.push(nm[i]);
      }
    }
    if(typeof callback==='function'){
      callback(res);
    }
  };
  return find;
};



/* ---------- STAND-ALONE METHODS ---------- */
/* create element -- stand-alone */
this.element=function(name='div',attr={},children=[]){
  attr=typeof attr==='object'&&attr!==null?attr:{};
  children=Array.isArray(children)?children:[];
  let main=document.createElement(name);
  /* set attributes */
  for(let k in attr){
    main.setAttribute(k,attr[k]);
  }
  /* add children */
  for(let child of children){
    main.append(child);
  }
  /* add object property and method */
  main.attr=attr;
  main.html=function(html=''){
    this.innerHTML=html;
    return this;
  };
  main.text=function(text=''){
    this.innerText=text;
    return this;
  };
  main.content=function(content=''){
    this.textContent=content;
    return this;
  };
  main.appendTo=function(el){
    if(typeof el==='object'&&el!==null
    &&typeof el.append==='function'){
      el.append(this);
    }return this;
  };
  /* return the element object */
  return main;
};
/* local storage */
this.storage=function(prefix='hotel/'){
  let store={
    __prefix:prefix,
    get:function(key=''){
      key=typeof key!=='string'?JSON.stringify(key):key;
      let res=false,
      raw=localStorage.getItem(this.__prefix+key);
      try{res=JSON.parse(raw);}catch(e){}
      return res;
    },
    set:function(key='',value=''){
      key=typeof key!=='string'?JSON.stringify(key):key;
      value=typeof value!=='string'?JSON.stringify(value):value;
      localStorage.setItem(this.__prefix+key,value);
      return this.keys().indexOf(this.__prefix+key)>=0?true:false;
    },
    delete:function(key=''){
      key=typeof key!=='string'?JSON.stringify(key):key;
      localStorage.removeItem(this.__prefix+key);
      return this.keys().indexOf(this.__prefix+key)<0?true:false;
    },
    keys:function(){
      let res=[],
      length=this.__prefix.length;
      for(let i=0;i<localStorage.length;i++){
        let key=localStorage.key(i);
        if(key.substring(0,length)==this.__prefix){
          res.push(key.substring(length));
        }
      }return res;
    },
    clear:function(){
      let res=0,
      length=this.__prefix.length;
      for(let i=0;i<localStorage.length;i++){
        let key=localStorage.key(i);
        if(key.substring(0,length)==this.__prefix){
          localStorage.removeItem(key);
          res++;
        }
      }return res;
    },
  };
  return store;
};
/* app name to app function */
this.getAppClassName=function(name=''){
  let an=name.split(/[^a-z]+/ig),
  ar=['Hotel'];
  for(let d of an){
    ar.push(d.substring(0,1).toUpperCase());
    ar.push(d.substring(1).replace(/[^a-z]+/ig,''));
  }
  return ar.join('');
};
/* alias position */
this.aliasPosition=function(text=''){
  let aliases=typeof this.positions==='object'&&this.positions!==null?this.positions:{};
  return aliases.hasOwnProperty(text)?aliases[text]:text;
};
/* alias division */
this.aliasDivision=function(text=''){
  let aliases=typeof this.divisions==='object'&&this.divisions!==null?this.divisions:{};
  return aliases.hasOwnProperty(text)?aliases[text]:text;
};
/* alias */
this.alias=function(text=''){
  let aliases=typeof this.aliases==='object'&&this.aliases!==null?this.aliases:{};
  return aliases.hasOwnProperty(text)?aliases[text]:text;
};
/* JSON download */
this.downloadJSON=function(data,out='data'){
  data=JSON.stringify(data);
  let blob=new Blob([data],{type:'application/json'}),
  url=window.URL.createObjectURL(blob),
  a=document.createElement('a');
  a.href=url;
  a.download=out+'.json';
  a.click();
  window.URL.revokeObjectURL(url);
  return url;
};
/* audio play -- search for AUDIOS first */
this.audioPlay=function(url){
  return new Promise(function(resolve,reject){
    var audio=new Audio();
    audio.preload="auto";
    audio.autoplay=true;
    audio.onerror=reject;
    audio.onplay=resolve;
    audio.src=window.hasOwnProperty('AUDIOS')&&AUDIOS.hasOwnProperty(url)?AUDIOS[url]:url;
  });
};
/* serialize a form by elements name */
this.formSerialize=function(idata=false){
  let data={},
  res={},
  form=document.querySelectorAll('[name]');
  for(let i=0;i<form.length;i++){
    if(typeof form[i].value==='undefined'){
      continue;
    }else if(form[i].name.match(/^data/)){
      data[form[i].name]=form[i].value;
    }else if(form[i].type=='radio'){
      if(form[i].checked){
        res[form[i].name]=form[i].value;
      }
    }else{
      res[form[i].name]=form[i].value;
    }
  }
  let query=[];
  for(let k in data){
    query.push(k+'='+data[k]);
  }
  let ndata=this.parser.parseQuery(query.join('&'));
  if(!ndata.hasOwnProperty('data')){
    ndata.data={};
  }
  if(idata){
    res.data=JSON.stringify(ndata.data);
  }
  return res;
};
/* parse date and time -- indonesia */
this.parseDatetime=function(value){
  let date=new Date(value),
  options={
    weekday:'long',
    year:'numeric',
    month:'long',
    day:'numeric',
    hour:'numeric',
    minute:'numeric',
  };
  return date.toLocaleDateString('id-ID',options);
};
/* parse date -- indonesia */
this.parseDate=function(value){
  value=value?value:(new Date).getTime();
  let date=new Date(value),
  options={
    weekday:'long',
    year:'numeric',
    month:'long',
    day:'numeric',
  };
  return date.toLocaleDateString('id-ID',options);
};
/* parse nominal -- IDR (indonesian rupiah) */
this.parseNominal=function(nominal){
  let rupiah=new Intl.NumberFormat('id-ID',{
    style:'currency',
    currency:'IDR',
    maximumFractionDigits:0,
  });
  return rupiah.format(nominal);
};
/* get value by id -- result: value of data */
this.getValueById=function(id,key='',data=[]){
  return this.getValueByKey('id',id,key,data);
};
/* get value by Key -- result: value of data */
this.getValueByKey=function(pkey,value,key='',data=[]){
  let arr=this.getDataByKey(pkey,value,data,false),
  res=arr!==null&&arr.hasOwnProperty(key)?arr[key]:'';
  return res;
};
/* get data by id -- result: object or null */
this.getDataById=function(id,data=[]){
  return this.getDataByKey('id',id,data,false);
};
/* get data by key from dataArray -- result: array (nobreak) or object or null */
this.getDataByKey=function(key,value='',data=[],nobreak=false){
  data=Array.isArray(data)?data:[];
  let res=nobreak?[]:null;
  for(let i of data){
    if(i[key]==value){
      if(nobreak){
        res.push(i);
      }else{
        res=i;
        break;
      }
    }
  }return res;
};
/* sleep ms - promise */
this.sleep=function(ms){
  return new Promise(resolve=>{
    setTimeout(resolve,ms);
  });
};
/* array range */
this.range=function(s,t){
  s=s?s:0;
  t=t?Math.max(s,t):0;
  let r=[];
  for(let i=s;i<=t;i++){
    r.push(i);
  }return r;
};
/* load script by url */
this.loadScriptURL=function(url){
  let scr=document.createElement('script');
  scr.src=url;
  document.head.append(scr);
  return scr;
};
/* buildQuery v2, build http query recusively */
this.buildQuery=function(data,key){
  let ret=[],dkey=null;
    for(let d in data){
      dkey=key?key+'['
            +encodeURIComponent(d)
              .replace(/\(/g,'%28')
              .replace(/\)/g,'%29')
            +']'
          :encodeURIComponent(d)
            .replace(/\(/g,'%28')
            .replace(/\)/g,'%29');
      if(typeof data[d]=='object'&&data[d]!==null){
        ret.push(this.buildQuery(data[d],dkey));
      }else{
        ret.push(
          dkey+"="
            +encodeURIComponent(data[d])
            .replace(/\(/g,'%28')
            .replace(/\)/g,'%29')
        );
      }
  }return ret.join("&");
};
/* parse json to object */
this.parseJSON=function(data){
  let res=false;
  try{
    res=JSON.parse(data);
  }catch(e){
    res=false;
  }return res;
};
/* generate uniqid */
this.uniqid=function(prefix){
  return (typeof prefix==='string'?prefix:'') 
    +(Math.random()*Math.pow(0x0a,0x14)).toString(0x24)
    +(new Date).getTime().toString(0x24);
};
/* object length */
this.objectLength=function(data){
  if(Array.isArray(data)){
    return data.length;
  }
  data=typeof data==='object'&&data!==null?data:{};
  let res=0;
  for(let i in data){
    res++;
  }return res;
};
/* is object */
this.isObject=function(data){
  return typeof data==='object'&&data!==null&&!Array.isArray(data)?true:false;
};
/* object to array */
this.objectToArray=function(data){
  data=this.isObject(data)?data:{};
  let res=[];
  for(let i in data){
    res.push(data[i]);
  }return res;
};
/* array to object */
this.arrayToObject=function(data){
  data=Array.isArray(data)?data:[];
  let res={};
  for(let i in data){
    res[i]=data[i];
  }return res;
};
/* grouped object by key from array */
this.arrayGroup=function(data=[],key='id'){
  let res={};
  for(let d of data){
    if(!d.hasOwnProperty(key)){continue;}
    if(!res.hasOwnProperty(d[key])){
      res[d[key]]=[];
    }
    res[d[key]].push(d);
  }return res;
};
/* get years object for selector */
this.getYears=function(start=2024,length=10){
  let res={};
  for(let i=0;i<length;i++){
    let v=start+i;
    res[v]=v;
  }return res;
};


/* ---------- CORDOVA ---------- */
/* close app */
this.closeApp=function(){
  if(!window.navigator.hasOwnProperty('app')
    ||!window.navigator.app.hasOwnProperty('exitApp')
    ||typeof window.navigator.app.exitApp!=='function'){
    return this.notif('Some requirement is missing.','error');
  }return navigator.app.exitApp();
};
/* status bar -- requires: cordova */
this.statusBar=function(hex){
  /* status bar -- cordova-plugin-statusbar */
  if(typeof StatusBar==='object'&&StatusBar!==null){
    StatusBar.backgroundColorByHexString(hex);
    StatusBar.show();
  }
  /* navigation bar -- cordova-plugin-navigationbar-color */
  if(typeof NavigationBar==='object'&&NavigationBar!==null){
    NavigationBar.backgroundColorByHexString(hex);
    NavigationBar.show();
  }
  /* screen orientation -- cordova-plugin-screen-orientation */
  if(window.hasOwnProperty('screen')
    &&window.screen.hasOwnProperty('orientation')
    &&typeof window.screen.orientation.lock==='function'){
    window.screen.orientation.lock('portrait');
  }
  /* return always true */
  return true;
};
/* open url, require: cordova-plugin-inappbrowser */
this.openURL=function(url,target,options){
  if(window.CORDOVA_LOADED&&cordova.InAppBrowser){
    return cordova.InAppBrowser.open(url,target,options);
  }return window.open(url,target);
};

/* return for construction */
return this.init();
};








/* HotelMarketing */
;function HotelMarketing(){
window._HotelMarketing=this;
this.categories={
  regular:'Regular',
  corporate:'Corporate',
  government:'Government',
  airlines:'Airlines',
  travel_agent:'Travel Agent',
};
this.init=function(){
  return this;
};
this.menus=function(){
  return [
    {
      name:'Markets',
      icon:'suitcase',
      callback:function(){
        _HotelMarketing.markets();
      },
    },
  ];
};
this.dashboard=async function(){
  return await this.markets();
};
this.markets=async function(){
  _Hotel.main.loader();
  let query='select * from market',
  data=await _Hotel.request('query',query),
  markets=data,
  table=_Hotel.table(),
  add=_Hotel.button('Add','green','plus',function(){
    _HotelMarketing.marketEdit();
  }),
  /* header */
  row=table.row(
    _Hotel.alias('market_id'),
    _Hotel.alias('market_category'),
    _Hotel.alias('market_segment'),
    _Hotel.alias('market_name'),
    _Hotel.alias('market_telp'),
    _Hotel.alias('market_price'),
  ).header();
  /* finder */
  row=table.row(
    _Hotel.findRow('id'),
    _Hotel.findRow('category'),
    _Hotel.findRow('segment'),
    _Hotel.findRow('name'),
    _Hotel.findRow('telp'),
    _Hotel.findRow('price'),
  );
  row.childNodes[0].style.maxWidth='90px';
  /* each market */
  for(let market of markets){
    let edit=_Hotel.button('Edit','blue','edit',function(){
      _HotelMarketing.marketEdit(this.dataset.id);
    },{
      id:market.id,
    }),
    category=this.categories.hasOwnProperty(market.category)
      ?this.categories[market.category]:market.category,
    row=table.row(
      market.id,
      category,
      market.segment,
      market.name,
      market.telp,
      _Hotel.parseNominal(market.price),
    );
    row.childNodes[0].classList.add('td-center');
    row.childNodes[5].classList.add('td-right');
    row.dataset.id=market.id;
    row.dataset.category=category;
    row.dataset.segment=market.segment;
    row.dataset.name=market.name;
    row.dataset.telp=market.telp;
    row.dataset.price=_Hotel.parseNominal(market.price);
  }
  _Hotel.main.put('Markets',table);
};
this.marketEdit=async function(id=0){
  _Hotel.main.loader();
  let def={
    id:id,
    category:'travel_agent',
    segment:'Travel Agent',
    name:'',
    telp:'',
    email:'',
    address:'',
  },
  query='select * from market where id='+id,
  data=await _Hotel.request('query',query),
  market=data.length>0?data[0]:def,
  table=_Hotel.table(),
  /* save */
  save=_Hotel.button('Save','blue','save',async function(){
    let fdata=_Hotel.formSerialize(),
    innerQuery=_Hotel.buildQuery(fdata),
    query=this.dataset.id==0
      ?'insert into market '+innerQuery
      :'update market ('+innerQuery+') where id='+this.dataset.id,
    loader=_Hotel.loader(),
    res=await _Hotel.request('query',query);
    loader.remove();
    if(res!=1){
      return _Hotel.alert('Error: Failed to save market!',res,'error');
    }
    return _HotelMarketing.markets();
  },{id}),
  /* delete button */
  del=_Hotel.button('Delete','red','trash',async function(){
    let yes=await _Hotel.confirmX('Delete this market?');
    if(!yes){return;}
    let loader=_Hotel.loader(),
    query='delete from market where id='+this.dataset.id,
    res=await _Hotel.request('query',query);
    loader.remove();
    if(res!=1){
      return _Hotel.alert('Error: Failed to delete market!',res,'error');
    }
    return _HotelMarketing.markets();
  },{id}),
  /* section */
  section=_Hotel.element('div',{
    'class':'section row-buttons',
  },[save,id!=0?del:'']),
  double=_Hotel.main.double(table,section),
  title=(id==0?'Add':'Edit')+' Market '+(id!=0?'#'+id:'');
  _Hotel.main.put(title,double);
  table.classList.add('table-register');
  /* each */
  for(let k in market){
    let key=_Hotel.alias('market_'+k),
    value=market[k],
    val=_Hotel.input(k,value,'text',key,100);
    if(k=='id'||k=='time'){
      continue;
    }else if(k=='category'){
      val=_Hotel.select(k,value,this.categories);
    }else if(k=='telp'){
      val.type='number';
    }else if(k=='email'){
      val.type='email';
    }else if(k=='address'){
      val=_Hotel.textarea(k,value,key,100);
    }
    row=table.row(key,val);
  }
};

return this.init();
};



/* HotelFoodBaverage */
;function HotelFoodBaverage(){
window._HotelFoodBaverage=this;
this.menuTypes=[
  'Tidak Diketahui',
  'Makanan',
  'Minuman',
  'Breakfast',
  'Makanan Ringan',
  'Lainnya',
  'Peralatan',
];
this.menuCategories=[
  'Unknown',
  'Food',
  'Beverage',
  'Package',
  'Dessert',
  'Drugestore',
  'Peralatan',
];
this.unit=[
  '1/2 Lusin',
  'Batang',
  'Biji',
  'Bill',
  'Botol',
  'Box',
  'Buah',
  'Buku',
  'Bungkus',
  'Dus',
  'Ekor',
  'Galon',
  'Gelas',
  'Gram',
  'Ikat',
  'Jerigen',
  'Kaleng',
  'Karung',
  'Keping',
  'Kg',
  'Kotak',
  'Lembar',
  'Liter',
  'Lusin',
  'Meter',
  'Ons',
  'Pack',
  'Pasang',
  'Pcs',
  'Porsi',
  'Potong',
  'Refill',
  'Renceng',
  'Rim',
  'Roll',
  'Sachet',
  'Sak',
  'Set',
  'Sisir',
  'Sisir',
  'Tabung',
  'Unit',
];
this.months=[
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
this.dates=[31,
  Math.floor((new Date).getFullYear()/4)==(new Date).getFullYear()?29:28,
  31,30,31,30,31,31,30,31,30,31];
this.menuList=[];
this.tTypes={
  0:'',
  1:'',
  2:'Registration',
  3:'Extrabill',
  4:'Request Order',
  5:'Payment',
  6:'Room Service',
  7:'Restaurant',
  8:'Payment Restaurant',
  9:'',
};
this.paymentMethods=_Hotel.paymentMethods;
this.groups=[
  'Lancar',
  'Tetap',
];
this.init=function(){
  return this;
};
this.menus=function(){
  let menus=[
    {
      name:'Dashboard',
      icon:'dashboard',
      callback:function(){
        _HotelFoodBaverage.dashboard();
      },
    },
    {
      name:'Petty Cash FB',
      icon:'envelope-o',
      callback:function(){
        _Hotel.adjustments('all',null,null,5,'Petty Cash FB');
      },
    },
    {
      name:'Restaurant',
      icon:'shopping-basket',
      callback:function(){
        _HotelFoodBaverage.restaurant();
      },
    },
    {
      name:'Payments',
      icon:'money',
      callback:function(){
        _HotelFoodBaverage.paymentPage();
      },
    },
    {
      name:'Room Service',
      icon:'glass',
      callback:function(){
        _HotelFoodBaverage.roomService();
      },
    },
    {
      name:'Request Orders',
      icon:'wpforms',
      callback:function(){
        _Hotel.requestOrders();
      },
    },
    {
      name:'Stock Opname',
      icon:'stack-exchange',
      callback:function(){
        _HotelFoodBaverage.opnameStock();
      },
    },
    {
      name:'Menu Lists',
      icon:'list-ul',
      callback:function(){
        _HotelFoodBaverage.menuPage();
      },
    },
  ];
  return menus;
};
this.dashboard=function(){
  let menus=[
    {
      name:'Breakfast Count',
      icon:'spoon',
      callback:function(){
        _HotelFoodBaverage.breakfast();
      },
    },
  ];
  _Hotel.main.put(
    'Dashboard',
    _Hotel.element('div',{
      'class':'dashboard-menu',
    },_Hotel.dashboardMenu(menus))
  );
};

/* breakfast */
this.breakfast=async function(){
  let loader=_Hotel.loader(),
  query='select * from registration where status=0',
  data=await _Hotel.request('query',query),
  total=0;
  for(let room of data){
    let headcount=parseInt(room.head_count_child,10)
      +parseInt(room.head_count_male,10)
      +parseInt(room.head_count_female,10);
    total+=headcount;
  }
  loader.remove();
  _Hotel.alert('Breakfast count: '+total,'','info')
};


/* stock opname */
this.opnameStock=async function(category){
  _Hotel.main.loader();
  let catWhere=typeof category==='number'&&category!==NaN?'and category='+category:'',
  queries=[
    'select * from price where division="purchasing" '+catWhere+' order by name asc',
    'select * from item_stock_fb',
    'select * from coa',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  items=data[0],
  stocks=data[1],
  coa=data[2],
  temp={
    id:0,
    item_id:0,
    stock:0,
    stock_min:0,
    stock_max:10,
    group:0,
    update:0,
  },
  table=_Hotel.table();
  this.coa=coa;
  table.head('FOOD & BEVERAGE STOCK OPNAME',10);
  table.row(
    _Hotel.alias('item_id'),
    _Hotel.alias('item_name'),
    _Hotel.alias('item_mark'),
    _Hotel.alias('category'),
    _Hotel.alias('stock'),
    _Hotel.alias('stock_min'),
    _Hotel.alias('stock_max'),
    _Hotel.alias('group'),
    _Hotel.alias('last_update'),
    '',
  ).header();
  table.row(
    _Hotel.findRow('id'),
    _Hotel.findRow('name'),
    _Hotel.findRow('mark'),
    _Hotel.findRow('category'),
    _Hotel.findRow('stock'),
    _Hotel.findRow('stock_min'),
    _Hotel.findRow('stock_max'),
    _Hotel.findRow('group'),
    _Hotel.findRow('sdate'),
    '',
  );
  for(let row of items){
    let raw=_Hotel.getDataByKey('item_id',row.id,stocks),
    stock=typeof raw==='object'&&raw!==null?raw:temp,
    category=this.getCoaName(row.category),
    sdate=_Hotel.parseDatetime(parseInt(stock.update,10)*1000),
    group=this.groups[stock.group],
    tr=table.row(
      row.id,
      row.name,
      row.mark,
      category,
      stock.stock,
      stock.stock_min,
      stock.stock_max,
      group,
      sdate,
      _Hotel.button('Edit','blue','edit',function(){
        _HotelFoodBaverage.opnameEdit(
          this.dataset.data,
          this.dataset.item
        );
      },{
        data:JSON.stringify(stock),
        item:JSON.stringify(row),
      }),
    );
    tr.dataset.id=row.id;
    tr.dataset.name=row.name;
    tr.dataset.mark=row.mark;
    tr.dataset.category=category;
    tr.dataset.stock=stock.stock;
    tr.dataset.stock_min=stock.stock_min;
    tr.dataset.stock_max=stock.stock_max;
    tr.dataset.group=group;
    tr.dataset.sdate=sdate;
    tr.childNodes[0].classList.add('td-center');
    tr.childNodes[4].classList.add('td-center');
    tr.childNodes[5].classList.add('td-center');
    tr.childNodes[6].classList.add('td-center');
    tr.childNodes[7].classList.add('td-center');
  }
  _Hotel.main.put('Food & Beverage Stock Opname',table);
};
this.opnameEdit=async function(raw,raw_item){
  _Hotel.main.loader();
  let data=_Hotel.parseJSON(raw),
  item=_Hotel.parseJSON(raw_item),
  read_item={
    name:item.name,
    mark:item.mark,
    category:this.getCoaName(item.category),
  },
  table=_Hotel.table(),
  save=_Hotel.button('Save','blue','save',async function(){
    let loader=_Hotel.loader(),
    fdata=_Hotel.formSerialize();
    if(this.dataset.id==0){
      fdata.item_id=this.dataset.item_id;
    }
    fdata.update=Math.ceil((new Date).getTime()/1000);
    let innerQuery=_Hotel.buildQuery(fdata),
    query=this.dataset.id==0
      ?'insert into item_stock_fb '+innerQuery
      :'update item_stock_fb ('+innerQuery+') where id='+this.dataset.id,
    res=await _Hotel.request('query',query);
    loader.remove();
    if(res!=1){
      return _Hotel.alert('Error: Failed to update stock?',res,'error');
    }
    _HotelFoodBaverage.opnameStock();
  },{
    item_id:item.id,
    id:data.id,
  }),
  section=_Hotel.element('div',{
    'class':'row-buttons section',
  },[save]),
  double=_Hotel.main.double(table,section),
  keys=['stock','stock_min','stock_max','group'];
  _Hotel.main.put('Edit Stock',double);
  table.classList.add('table-register');
  for(let key in read_item){
    table.row(
      _Hotel.alias(key),
      read_item[key],
    );
  }
  for(let key of keys){
    let val=_Hotel.input(key,data[key],'number',_Hotel.alias(key),10);
    if(key=='group'){
      val=_Hotel.select(key,data[key],{
        0:'Lancar',
        1:'Tetap',
      });
    }
    table.row(_Hotel.alias(key),val);
  }
};

/* menu */
this.menuPage=async function(){
  _Hotel.main.loader();
  let query='select * from menu',
  data=await _Hotel.request('query',query),
  table=_Hotel.table(),
  add=_Hotel.button('Add','green','plus',function(){
    _HotelFoodBaverage.menuEdit();
  }),
  row=table.row(
    _Hotel.alias('menu_id'),
    _Hotel.alias('menu_name'),
    _Hotel.alias('menu_category'),
    _Hotel.alias('menu_type'),
    _Hotel.alias('menu_price'),
    _Hotel.alias('menu_unit'),
    _Hotel.alias('note'),
    add,
  ).header();
  this.menuList=data;
  row=table.row(
    _Hotel.findRow('id'),
    _Hotel.findRow('name'),
    _Hotel.findRow('category'),
    _Hotel.findRow('type'),
    _Hotel.findRow('price'),
    _Hotel.findRow('unit'),
    _Hotel.findRow('note'),
    '',
  );
  row.childNodes[0].style.maxWidth='90px';
  for(let menu of data){
    let category=this.menuCategories.hasOwnProperty(menu.category)
      ?this.menuCategories[menu.category]:menu.category,
    type=this.menuTypes.hasOwnProperty(menu.type)
      ?this.menuTypes[menu.type]:menu.type;
    price=_Hotel.parseNominal(menu.price),
    edit=_Hotel.button('Edit','blue','edit',function(){
      _HotelFoodBaverage.menuEdit(this.dataset.id);
    },{
      id:menu.id,
    });
    row=table.row(
      menu.id,
      menu.name,
      category,
      type,
      price,
      menu.unit,
      menu.note,
      edit,
    );
    row.dataset.id=menu.id;
    row.dataset.name=menu.name;
    row.dataset.category=category;
    row.dataset.type=type;
    row.dataset.price=price;
    row.dataset.unit=menu.unit;
    row.dataset.note=menu.note;
    row.childNodes[0].classList.add('td-center');
    row.childNodes[4].classList.add('td-right');
  }
  _Hotel.main.put('Menu Lists',_Hotel.element('div',{},[
    _Hotel.element('div').text('Total: '+data.length+' rows'),
    table,
  ]));
};
this.menuEdit=async function(id=0){
  let menu={
    id:0,
    category:1,
    type:1,
    price:10000,
    unit:'Porsi',
    name:'',
    note:'',
  };
  if(id!=0){
    let query='select * from menu where id='+id,
    data=await _Hotel.request('query',query);
    if(data.length<1){
      return _Hotel.alert('Error: Failed to get menu data!',data,'error');
    }
    menu=data[0];
  }
  let table=_Hotel.table(),
  save=_Hotel.button('Save','blue','save',async function(){
    let loader=_Hotel.loader(),
    fdata=_Hotel.formSerialize(),
    innerQuery=_Hotel.buildQuery(fdata),
    query=this.dataset.id!=0
      ?'update menu ('+innerQuery+') where id='+this.dataset.id
      :'insert into menu '+innerQuery,
    res=await _Hotel.request('query',query);
    loader.remove();
    if(res!=1){
      return _Hotel.alert('Error: Failed to save menu!',res,'error');
    }
    return _HotelFoodBaverage.menuPage();
  },{
    id:menu.id,
  }),
  del=_Hotel.button('Delete','red','trash',async function(){
    let yes=await _Hotel.confirmX('Delete this menu?');
    if(!yes){return;}
    let loader=_Hotel.loader(),
    query='delete from menu where id='+this.dataset.id,
    res=await _Hotel.request('query',query);
    loader.remove();
    if(res!=1){
      return _Hotel.alert('Error: Failed to delete menu!',res,'error');
    }
    return _HotelFoodBaverage.menuPage();
  },{
    id:menu.id,
  }),
  buttons=_Hotel.element('div',{
    'class':'section row-buttons',
  },[save,menu.id!=0?del:'']),
  double=_Hotel.main.double(table,buttons),
  title=(menu.id==0?'Add':'Edit')+' Menu '+(menu.id!=0?'#'+menu.id:'');
  _Hotel.main.put(title,double);
  table.classList.add('table-register');
  /* form */
  let form=['category','type','price','unit','name','note'],
  selector={
    category:_Hotel.select('category',menu.category,_Hotel.arrayToObject(this.menuCategories)),
    type:_Hotel.select('type',menu.type,_Hotel.arrayToObject(this.menuTypes)),
    unit:_Hotel.select('unit',menu.unit,this.unit),
  };
  for(let k in menu){
    if(form.indexOf(k)<0){
      continue;
    }
    let key=_Hotel.alias('menu_'+k),
    value=menu[k],
    val=_Hotel.input(k,value,'text',key,100);
    if(k=='note'){
      key=_Hotel.alias('note');
      val=_Hotel.textarea('note',value,_Hotel.alias('note'),100);
    }else if(selector.hasOwnProperty(k)){
      val=selector[k];
    }else if(k=='price'){
      val=_Hotel.input(k,value,'number',key,10);
    }
    table.row(key,val);
  }
};


/* restaurant -- bill */
this.restaurant=async function(){
  _Hotel.main.loader();
  let queries=[
    'select * from restaurant where status=0 order by id asc',
    'select id,username as name from user',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  resto=data[0],
  users=data[1],
  table=_Hotel.table(),
  add=_Hotel.button('New','green','plus',function(){
    _HotelFoodBaverage.restaurantEdit();
  }),
  counter=0,
  paySelected=_Hotel.button('Payments','red','money',function(){
    let boxes=document.querySelectorAll('input[type="checkbox"]'),
    res=[],i=boxes.length;
    while(i--){
      let box=boxes[i];
      if(box.checked){
        res.push(box.value);
      }
    }
    if(res.length<1){
      return _Hotel.alert('Error: Invalid selected!','Please select at least one.','error');
    }
    _HotelFoodBaverage.paymentForm(res);
  },{
    name:'payment',
  });
  /* header */
  row=table.row(
    _Hotel.alias('regid'),
    _Hotel.alias('table_number'),
    _Hotel.alias('table_name'),
    _Hotel.alias('table_total'),
    _Hotel.alias('table_servant'),
    _Hotel.alias('table_time'),
    _Hotel.element('div',{
      'class':'td-buttons',
    },[add,paySelected]),
  ).header();
  /* each serve */
  for(let res of resto){
    counter++;
    let edit=_Hotel.button('Edit','blue','edit',function(){
      _HotelFoodBaverage.restaurantEdit(this.dataset.regid);
    },{
      regid:res.regid+'',
    }),
    view=_Hotel.button('View','green','search',function(){
      _Hotel.dialogView(this.dataset.type,this.dataset.regid);
    },{
      type:7,
      regid:res.regid,
    }),
    pay=_Hotel.button('Payment','red','money',function(){
      _HotelFoodBaverage.paymentForm(this.dataset.regid);
    },{
      regid:res.regid+'',
    }),
    checkBox=_Hotel.checkbox('payment['+counter+']',res.regid),
    uname=_Hotel.getValueById(res.uid,'name',users),
    row=table.row(
      res.regid,
      checkBox,
      res.name,
      _Hotel.parseNominal(res.total),
      uname,
      _Hotel.parseDatetime(res.time*1000),
      _Hotel.element('div',{
        'class':'td-buttons',
      },[view,edit,pay]),
    );
    checkBox.label.innerText=res.number;
    row.childNodes[0].classList.add('td-center');
    row.childNodes[1].classList.add('td-center');
    row.childNodes[3].classList.add('td-right');
  }
  /* put in the main content */
  _Hotel.main.put('Restaurant',table);
  /*  */
  /*  */
  /*  */
  
  
/*
restaurant
- regid       int(10)
- number      int(10,0)
- name        string(100)
- total       int(10,0)
- uid         int(10)
- time        time()

- id          aid()
- status      int(10,0)
- data        string(2048)
*/
};
/* restaurant view -- require: regid */
this.restaurantView=async function(regid){
  let dialog=await _Hotel.dialogPage(),
  queries=[
    'select * from restaurant where regid='+regid,
    'select id,username as name from user',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  services=data[0],
  users=data[1],
  service=_Hotel.getDataByKey('regid',regid,services),
  table=_Hotel.table(),
  row=table.head('Restaurant Service #'+regid,6);
  /* check service */
  if(service===null){
    dialog.put('Error: Failed to get service data!');
    return;
  }
  /* bearer */
  let cols=['regid','name','number'];
  for(let col of cols){
    row=table.row(_Hotel.alias(col=='regid'?col:'table_'+col),service[col]);
    row.childNodes[0].setAttribute('colspan',2);
    row.childNodes[1].setAttribute('colspan',4);
  }
  /* header */
  table.row(
    'No',
    _Hotel.alias('menu_name'),
    _Hotel.alias('menu_category'),
    _Hotel.alias('menu_price'),
    _Hotel.alias('menu_count'),
    _Hotel.alias('menu_subtotal'),
  ).header();
  /* service data each */
  let counter=0,
  sdata=_Hotel.parseJSON(service.data)||[];
  for(let sd of sdata){
    counter++;
    row=table.row(
      counter,
      sd.name,
      sd.category,
      _Hotel.parseNominal(sd.price),
      sd.count+' '+sd.unit,
      _Hotel.parseNominal(sd.subtotal),
    );
    row.childNodes[0].classList.add('td-center');
    row.childNodes[3].classList.add('td-right');
    row.childNodes[4].classList.add('td-right');
    row.childNodes[5].classList.add('td-right');
  }
  /* total */
  row=table.row(
    _Hotel.alias('total'),
    _Hotel.parseNominal(service.total),
  ).header();
  row.childNodes[0].setAttribute('colspan',5);
  row.childNodes[0].classList.add('td-right');
  row.childNodes[1].classList.add('td-right');
  /* operator */
  row=table.row(
    _Hotel.alias('table_servant'),
    _Hotel.getValueById(service.uid,'name',users),
  );
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].setAttribute('colspan',4);
  /* time */
  row=table.row(
    _Hotel.alias('table_time'),
    _Hotel.parseDatetime(service.time*1000),
  );
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].setAttribute('colspan',4);
  /*  */
  dialog.put(table);
};
/* restaurant edit and add */
this.restaurantEdit=async function(regid=0){
  _Hotel.main.loader();
  let def={
    id:0,
    regid:regid,
    uid:_Hotel.user.id,
    total:0,
    status:0,
    number:0,
    name:'',
    data:'[]',
  },
  defTran={
    id:0,
    regid:regid,
    type:7,
    uid:_Hotel.user.id,  
    flow:1,
    deposit:0,
    amount:0,
    date:(new Date).getDate(),
    month:(new Date).getMonth(),
    year:(new Date).getFullYear(),
  },
  newRegIDQueries=[
    'insert into regid uid='+_Hotel.user.id+'&type=7',
    'select * from regid where uid='+_Hotel.user.id+' and type=7 order by id desc limit 1',
  ],
  queries=[
    'select * from restaurant where regid='+regid,
    'select * from menu',
    'select * from transaction where regid='+regid,
  ];
  if(regid==0){
    queries=[...queries,...newRegIDQueries];
  }
  let data=await _Hotel.request('queries',queries.join(';')),
  services=data[0],
  menus=data[1],
  trans=data[2],
  regids=data.length>4?data[4]:[],
  service=_Hotel.getDataByKey('regid',regid,services)||def,
  sdata=_Hotel.parseJSON(service.data)||[],
  tdata=_Hotel.getDataByKey('regid',regid,trans)||defTran,
  table=_Hotel.table(),
  mContent=_Hotel.element('div',{},[table]);
  /* title */
  let title='Restaurant Service &#8213; '+
    (service.id==0?'New Service':'Service Edit #'+regid);
  _Hotel.main.put(title,mContent);
  /* set new regid to service */
  if(regid==0){
    regid=regids.length>0?regids[0].id:0;
    service.regid=regid;
  }
  /* guest */
  let guestName=_Hotel.input(
    'name',
    service.name,
    'text',
    _Hotel.alias('table_name'),
    100
  ),
  /* regid */
  regidInput=_Hotel.input(
    'regid',
    service.regid,
    'number',
    'RegID',
    10
  ),
  /* room number */
  roomNumber=_Hotel.input('number',service.number,'number',_Hotel.alias('table_number'),10),
  /* regid put in row */
  row=table.row('RegID',regidInput);
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].setAttribute('colspan',6);
  /* room number */
  row=table.row(_Hotel.alias('table_number'),roomNumber);
  regidInput.disabled=true;
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].setAttribute('colspan',6);
  /* guest name */
  row=table.row(_Hotel.alias('table_name'),guestName);
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].setAttribute('colspan',6);
  /* total and add */
  let totalHidden=_Hotel.input('total',service.total,'hidden'),
  totalParsed=_Hotel.element('span').text(_Hotel.parseNominal(service.total)),
  add=_Hotel.button('Add','green','plus',function(){
    if(!this.roomNumber.value.match(/^\d+$/)){
      return _Hotel.alert('Error: Cannot find table number!',
        'Please insert table number.','error');
    }
    _HotelFoodBaverage.roomServiceEditAddRow({
      table:this.table,
      menus:this.menus,
      totalHidden:this.totalHidden,
      totalParsed:this.totalParsed,
    });
  });
  add.table=table;
  add.menus=menus;
  add.totalHidden=totalHidden;
  add.totalParsed=totalParsed;
  add.roomNumber=roomNumber;
  /* header */
  table.row(
    'No',
    _Hotel.alias('menu_name'),
    _Hotel.alias('menu_category'),
    _Hotel.alias('menu_price'),
    _Hotel.alias('menu_count'),
    _Hotel.alias('menu_unit'),
    _Hotel.alias('menu_subtotal'),
    add,
  ).header();
  table.dataset.counter='1';
  
  /* service data */
  for(let sd of sdata){
    this.roomServiceEditAddRow({
      table,
      menus,
      totalHidden,
      totalParsed,
      data:sd,
    });
  }
  /* total -- new table */
  table=_Hotel.table();
  mContent.append(table);
  row=table.row(
    _Hotel.alias('total'),
    _Hotel.element('div',{},[
      totalHidden,
      totalParsed,
    ]),
  ).header();
  row.childNodes[0].classList.add('td-right');
  row.childNodes[1].classList.add('td-right');
  row.childNodes[0].style.minWidth='150px';
  row.childNodes[1].style.minWidth='100px';
  /* Operator */
  row=table.row(
    _Hotel.alias('table_servant'),
    _Hotel.element('div',{},[
      _Hotel.input('uid',_Hotel.user.id,'hidden'),
      _Hotel.element('span').text(_Hotel.user.username),
    ]),
  );
  row.childNodes[0].classList.add('td-right');
  /* save */
  let save=_Hotel.button('Save','blue','save',async function(){
    let fdata=_Hotel.formSerialize(true),
    rdata=_Hotel.parseJSON(fdata.data),
    tdata=this.dataset.tid==0
      ?_Hotel.parseJSON(this.dataset.tdata)
      :{
        regid:fdata.regid,
        uid:fdata.uid,
        amount:fdata.total,
      },
    data=_Hotel.objectToArray(rdata);
    fdata.data=JSON.stringify(data);
    tdata.regid=fdata.regid;
    tdata.uid=fdata.uid;
    tdata.amount=fdata.total;
    delete tdata.id;
    let tInnerQuery=_Hotel.buildQuery(tdata),
    tQuery=this.dataset.tid==0
      ?'insert into transaction '+tInnerQuery
      :'update transaction ('+tInnerQuery+') where id='+this.dataset.tid,
    innerQuery=_Hotel.buildQuery(fdata),
    query=this.dataset.id==0
       ?'insert into restaurant '+innerQuery
       :'update restaurant ('+innerQuery+') where id='+this.dataset.id,
    res=await _Hotel.request('queries',[query,tQuery].join(';'));
    if(res.join('')!=11){
      return _Hotel.alert('Error: Failed to save data!',res,'error');
    }
    _HotelFoodBaverage.restaurant();
  },{
    id:service.id,
    tid:tdata.id,
    tdata:JSON.stringify(tdata),
  });
  row=table.row(
    '',
    save,
  );
  /*  */
  /*  */
  /*  */
  /*  */
  
  
/*
restaurant
- regid       int(10)
- number      int(10,0)
- name        string(100)
- total       int(10,0)
- uid         int(10)
- time        time()

- id          aid()
- status      int(10,0)
- data        string(2048)
*/
};

/* payments page */
this.paymentPage=async function(date='all',month,year){
  _Hotel.main.loader();
  let defDate=_Hotel.production?(new Date).getDate():'all';
  year=year||(new Date).getFullYear();
  month=!isNaN(parseInt(month))?parseInt(month):(new Date).getMonth();
  date=date||defDate;
  _Hotel.main.loader();
  let datePadded=date=='all'?'01':date.toString().padStart(2,'0'),
  dateObject=new Date([
    year,
    (parseInt(month)+1).toString().padStart(2,'0'),
    datePadded,
  ].join('-')),
  kdate=Math.floor(year/4)==year?29:28,
  dateRangeLimit=month==1?kdate:this.dates[month],
  dateEndLimit=date=='all'?dateRangeLimit*24*3600:24*3600,
  dateTimeStart=Math.floor(dateObject.getTime()/1000),
  dateTimeEnd=dateTimeStart+dateEndLimit,
  queries=[
    'select * from payment_resto where time > '+dateTimeStart
      +' and time < '+dateTimeEnd+' order by id desc',
    'select id,username as name from user',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  paids=data[0],
  users=data[1],
  table=_Hotel.table(),
  total=0,
  totalPaid=0,
  totalCashback=0,
  row=table.row(
    'RegID',
    _Hotel.alias('payment_bearer'),
    _Hotel.alias('payment_nominal'),
    _Hotel.alias('payment_paid'),
    _Hotel.alias('cashback'),
    _Hotel.alias('payment_method'),
    'Officer',
    '',
  ).header(),
  syear=_Hotel.select('year',year,_Hotel.getYears(),function(){
    _HotelFoodBaverage.paymentPage(this.dataset.date,parseInt(this.dataset.month,10),this.value);
  },{date,month}),
  smonth=_Hotel.select('month',month,_Hotel.arrayToObject(this.months),function(){
    _HotelFoodBaverage.paymentPage(this.dataset.date,parseInt(this.value,10),this.dataset.year);
  },{date,year}),
  sdate=_Hotel.select('date',date,[
    ...['all'],
    ..._Hotel.range(1,dateRangeLimit),
  ],function(){
    _HotelFoodBaverage.paymentPage(this.value,parseInt(this.dataset.month,10),this.dataset.year);
  },{month,year});
  /* search */
  row=table.row(
    _Hotel.findRow('regid'),
    _Hotel.findRow('bearer'),
    '','','',
    _Hotel.findRow('method'),
    _Hotel.findRow('uname'),
    '',
  );
  /* title and put */
  _Hotel.main.put('Payments',_Hotel.element('div',{},[
    _Hotel.element('div',{},[
      syear,smonth,
    ]),
    table,
  ]));
  /* each paid */
  for(let p of paids){
    let uname=_Hotel.getValueById(p.uid,'name',users),
    nominal=_Hotel.parseNominal(p.nominal),
    paid=_Hotel.parseNominal(p.paid),
    cashback=_Hotel.parseNominal(p.cashback),
    method=this.paymentMethods.hasOwnProperty(p.method)
      ?this.paymentMethods[p.method]:p.method,
    view=_Hotel.button('View','green','search',function(){
      _Hotel.dialogView(this.dataset.type,this.dataset.regid);
    },{
      type:8,
      regid:p.regid,
    }),
    receipt=_Hotel.button('Receipt','purple','print',function(){
      _HotelFoodBaverage.paymentReceipt(this.dataset.regid);
    },{
      regid:p.regid,
    }),
    row=table.row(
      p.regid,
      p.bearer,
      nominal,
      paid,
      cashback,
      method,
      uname,
      _Hotel.element('div',{
        'class':'td-buttons'
      },[view,receipt]),
    );
    row.dataset.regid=p.regid;
    row.dataset.bearer=p.bearer;
    row.dataset.method=method;
    row.dataset.uname=uname;
    row.childNodes[0].classList.add('td-center');
    row.childNodes[2].classList.add('td-right');
    row.childNodes[3].classList.add('td-right');
    row.childNodes[4].classList.add('td-right');
    total+=parseInt(p.nominal,10);
    totalPaid+=parseInt(p.paid,10);
    totalCashback+=parseInt(p.cashback,10);
  }
  /* total */
  row=table.row(
    'Total',
    _Hotel.parseNominal(total),
    _Hotel.parseNominal(totalPaid),
    _Hotel.parseNominal(totalCashback),
    '',
  ).header();
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[4].setAttribute('colspan',3);
  row.childNodes[0].classList.add('td-right');
  row.childNodes[1].classList.add('td-right');
  row.childNodes[2].classList.add('td-right');
  row.childNodes[3].classList.add('td-right');
};
/* payment view -- require: regid */
this.paymentView=async function(regid){
  let dialog=await _Hotel.dialogPage(),
  queries=[
    'select id,username as name from user',
    'select * from payment_resto where regid='+regid,
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  users=data[0],
  payment=data[1].length>0?data[1][0]:null,
  pdata=payment?_Hotel.parseJSON(payment.data):[],
  table=_Hotel.table(),
  content=_Hotel.element('div',{
    'class':'',
  },[table]),
  row=table.head('Payment #'+regid,6);
  if(payment==null){
    dialog.put('Error: Failed to get payment data!');
    return;
  }
  /* regid */
  row=table.row(
    'RegID',
    payment.regid.toString().padStart(7,'0'),
  );
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].setAttribute('colspan',4);
  /* officer */
  row=table.row(
    'Officer',
    _Hotel.getValueById(payment.uid,'name',users),
  );
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].setAttribute('colspan',4);
  /* bearer */
  row=table.row(
    _Hotel.alias('payment_bearer'),
    payment.bearer,
  );
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].setAttribute('colspan',4);
  /* header */
  row=table.row(
    'RegID',
    _Hotel.alias('transaction_type'),
    _Hotel.alias('transaction_amount'),
    _Hotel.alias('transaction_deposit'),
    _Hotel.alias('transaction_balance'),
    '',
  ).header();
  /* payment data each */
  for(let p of pdata){
    let balance=parseInt(p.deposit,10)-parseInt(p.amount),
    view=_Hotel.button('View','green','search',function(){
      _Hotel.dialogView(this.dataset.type,this.dataset.regid);
    },{
      type:p.type,
      regid:p.regid,
    });
    row=table.row(
      p.regid,
      this.tTypes[p.type],
      _Hotel.parseNominal(p.amount),
      _Hotel.parseNominal(p.deposit),
      _Hotel.parseNominal(balance),
      view,
    );
    row.childNodes[0].classList.add('td-center');
    row.childNodes[2].classList.add('td-right');
    row.childNodes[3].classList.add('td-right');
    row.childNodes[4].classList.add('td-right');
  }
  /* the rest */
  let rest=['nominal','paid','cashback','method','time','note'],
  digit=['nominal','paid','cashback'];
  for(let r of rest){
    if(!payment.hasOwnProperty(r)){
      continue;
    }
    let key=_Hotel.alias('payment_'+r),
    value=payment[r],
    val=value;
    if(digit.indexOf(r)>=0){
      val=_Hotel.parseNominal(value);
    }else if(r=='time'){
      val=_Hotel.parseDatetime(value*1000);
    }else if(r=='note'){
      key=_Hotel.alias('note');
    }else if(r=='method'){
      val=this.paymentMethods.hasOwnProperty(value)
        ?this.paymentMethods[value]:value;
    }
    row=table.row(key,val,'');
    row.childNodes[0].setAttribute('colspan',3);
    row.childNodes[1].setAttribute('colspan',2);
    row.childNodes[0].classList.add('td-right');
    if(digit.indexOf(r)>=0){
      row.childNodes[1].classList.add('td-right');
    }else if(r=='method'){
      row.childNodes[1].classList.add('td-center');
    }
  }
  /* put into dialog */
  dialog.put(content);
};
/* payment form -- require: regid */
this.paymentForm=async function(regid){
  _Hotel.main.loader();
  let regids=Array.isArray(regid)?regid:[regid],
  regidWhere=regids.map(r=>'regid='+r).join(' or '),
  nrQueries=[
    'insert into regid uid='+_Hotel.user.id+'&type=8',
    'select * from regid where uid='+_Hotel.user.id+' and type=8 order by id desc limit 1',
  ],
  queries=[
    'select * from transaction where '+regidWhere,
    'select id,username as name from user',
    'select * from restaurant where '+regidWhere,
  ];
  if(regids.length>1){
    queries=[...queries,...nrQueries];
  }
  let data=await _Hotel.request('queries',queries.join(';')),
  trans=data[0],
  users=data[1],
  registers=data[2],
  guests=registers.map(r=>r.name),
  insert=data.length>3?data[3]:0,
  newRegid=data.length>3&&insert==1&&data[4].length==1?data[4][0].id:regids[0],
  table=_Hotel.table(),
  totalAmount=0,
  totalDeposit=0,
  counter=0;
  pmethod='cash',
  guestSelector=_Hotel.select('bearer',guests[0],guests),
  /* regid or newRegid */
  row=table.row(
    'RegID',
    newRegid.toString().padStart(7,'0'),
    'Officer',
    _Hotel.user.username
  );
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].setAttribute('colspan',3);
  row.childNodes[2].setAttribute('colspan',1);
  row.childNodes[3].setAttribute('colspan',4);
  /* bearer */
  row=table.row(
    _Hotel.alias('payment_bearer'),
    guestSelector,
    '',
  );
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].setAttribute('colspan',3);
  row.childNodes[2].setAttribute('colspan',5);
  /* table header */
  row=table.row(
    'RegID',
    _Hotel.alias('transaction_type'),
    _Hotel.alias('transaction_amount'),
    _Hotel.alias('transaction_deposit'),
    _Hotel.alias('transaction_balance'),
    _Hotel.alias('payment_method'),
    _Hotel.alias('table_name'),
    _Hotel.alias('transaction_date'),
    'Officer',
    '',
  ).header();
  for(let tran of trans){
    counter++;
    pmethod=_Hotel.getValueByKey('regid',tran.regid,'payment_method',registers);
    let balance_real=parseInt(tran.deposit,10)-parseInt(tran.amount,10),
    balance=_Hotel.parseNominal(balance_real),
    balance_span=_Hotel.element('span',{
      'class':balance_real>=0?'balance-plus':'balance-minus',
    }).text(balance),
    view=_Hotel.button('View','green','search',function(){
      _Hotel.dialogView(this.dataset.type,this.dataset.regid);
    },{
      type:tran.type,
      regid:tran.regid,
    }),
    row=table.row(
      tran.regid,
      this.tTypes[tran.type],
      _Hotel.parseNominal(tran.amount),
      _Hotel.parseNominal(tran.deposit),
      balance_span,
      this.paymentMethods.hasOwnProperty(pmethod)?this.paymentMethods[pmethod]:'-',
      _Hotel.getValueByKey('regid',tran.regid,'name',registers),
      _Hotel.parseDatetime(tran.time*1000),
      _Hotel.getValueById(tran.uid,'name',users),
      _Hotel.element('div',{
        'class':'section-x row-buttons-x',
      },[
        view,
        _Hotel.input('data['+counter+'][id]',tran.id,'hidden'),
        _Hotel.input('data['+counter+'][regid]',tran.regid,'hidden'),
        _Hotel.input('data['+counter+'][type]',tran.type,'hidden'),
        _Hotel.input('data['+counter+'][amount]',tran.amount,'hidden'),
        _Hotel.input('data['+counter+'][deposit]',tran.deposit,'hidden'),
        _Hotel.input('data['+counter+'][flow]',tran.flow,'hidden'),
      ]),
    );
    totalAmount+=parseInt(tran.amount,10);
    totalDeposit+=parseInt(tran.deposit,10);
    row.childNodes[0].classList.add('td-center');
    row.childNodes[2].classList.add('td-right');
    row.childNodes[3].classList.add('td-right');
    row.childNodes[4].classList.add('td-right');
  }
  let totalBalance=totalDeposit-totalAmount;
  row=table.row('').header();
  row.childNodes[0].setAttribute('colspan',10);
  row=table.row(
    'Total',
    _Hotel.parseNominal(totalAmount),
    _Hotel.parseNominal(totalDeposit),
    _Hotel.element('span',{
      'class':totalBalance>=0?'balance-plus':'balance-minus',
    }).text(_Hotel.parseNominal(totalBalance)),
    '',
  );
  row.childNodes[0].classList.add('td-center');
  row.childNodes[1].classList.add('td-right');
  row.childNodes[2].classList.add('td-right');
  row.childNodes[3].classList.add('td-right');
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[4].setAttribute('colspan',5);
  /* payment method */
  let totalPayment=totalBalance*-1,
  paymentMethod=_Hotel.select('method',pmethod,this.paymentMethods);
  row=table.row(
    _Hotel.alias('payment_method'),
    paymentMethod,
    _Hotel.element('div',{},[
      _Hotel.input('regid',newRegid,'hidden'),
      _Hotel.input('uid',_Hotel.user.id,'hidden'),
      _Hotel.input('flow','1','hidden'),
      _Hotel.input('nominal',totalPayment,'hidden'),
      _Hotel.input('type','5','hidden'),
      _Hotel.input('status','1','hidden'),
      _Hotel.alias('note'),
    ]),
    _Hotel.textarea('note','',_Hotel.alias('note'),100),
  );
  row.childNodes[0].classList.add('td-center');
  row.childNodes[2].classList.add('td-right');
  row.childNodes[0].setAttribute('colspan',4);
  row.childNodes[1].setAttribute('colspan',1);
  row.childNodes[2].setAttribute('colspan',1);
  row.childNodes[3].setAttribute('colspan',4);
  row.childNodes[3].setAttribute('rowspan',2);
  /* payment nominal and cashback */
  let inputPaid=_Hotel.input('paid',totalPayment,'number',_Hotel.alias('payment_nominal'),10),
  inputCashback=_Hotel.input('cashback','0','hidden'),
  cashbackParsed=_Hotel.element('span').text(_Hotel.parseNominal(0)),
  paidParsed=_Hotel.element('span').text(_Hotel.parseNominal(totalPayment));
  inputPaid.paidParsed=paidParsed;
  inputPaid.cashback=inputCashback;
  inputPaid.cashbackParsed=cashbackParsed;
  inputPaid.dataset.total=totalPayment;
  inputPaid.addEventListener('keyup',function(){
    let val=parseInt(this.value,10),
    total=parseInt(this.dataset.total,10),
    cashback=val-total;
    this.paidParsed.innerText=_Hotel.parseNominal(val);
    this.cashback.value=cashback;
    this.cashbackParsed.innerText=_Hotel.parseNominal(cashback);
  },false);
  inputCashback.disabled=true;
  /* payment input */
  row=table.row(
    _Hotel.alias('payment_nominal'),
    inputPaid,
    '',
  );
  row.childNodes[0].classList.add('td-center');
  row.childNodes[0].setAttribute('colspan',4);
  row.childNodes[1].setAttribute('colspan',1);
  row.childNodes[2].setAttribute('colspan',1);
  /* payment nominal */
  row=table.row(
    _Hotel.alias('payment_nominal')+' (IDR)',
    paidParsed,
    '',
  );
  row.childNodes[0].classList.add('td-center');
  row.childNodes[1].classList.add('td-right');
  row.childNodes[0].setAttribute('colspan',4);
  row.childNodes[1].setAttribute('colspan',1);
  row.childNodes[2].setAttribute('colspan',5);
  /* cashback nominal */
  row=table.row(
    _Hotel.alias('cashback')+' (IDR)',
    _Hotel.element('div',{},[
      inputCashback,
      cashbackParsed,
    ]),
    '',
  );
  row.childNodes[0].classList.add('td-center');
  row.childNodes[1].classList.add('td-right');
  row.childNodes[0].setAttribute('colspan',4);
  row.childNodes[1].setAttribute('colspan',1);
  row.childNodes[2].setAttribute('colspan',5);
  /* submit */
  row=table.row(
    '',
    _Hotel.button('Pay Now!','red','money',async function(){
      let yes=await _Hotel.confirmX('Pay now?');
      if(!yes){return;}
      let fdata=_Hotel.formSerialize(true),
      tdata=_Hotel.objectToArray(_Hotel.parseJSON(fdata.data)),
      queries=[];
      fdata.data=JSON.stringify(tdata);
      for(let t of tdata){
        queries.push('update transaction (status=1) where id='+t.id);
        if(t.type==7){
          queries.push('update restaurant (status=1) where regid='+t.regid);
        }else if(t.type==6){
          queries.push('update room_service (status=1) where regid='+t.regid);
        }
      }
      queries.push('insert into payment_resto '+_Hotel.buildQuery(fdata));
      queries.push('insert into transaction '+_Hotel.buildQuery({
        regid:fdata.regid,
        type:8,
        amount:0,
        deposit:fdata.nominal,
        flow:1,
        uid:fdata.uid,
        date:(new Date).getDate(),
        month:(new Date).getMonth(),
        year:(new Date).getFullYear(),
        status:1,
      }));
      let coa_method={
        cash:7,
        wire_mandiri:10,
        wire_bca:13,
        card_mandiri:10,
        card_bca:13,
        petty_cash:5,
        account_receivable:18,
        qris_mandiri:10,
        qris_bca:13,
      },
      coa_id=coa_method.hasOwnProperty(fdata.method)?coa_method[fdata.method]:5;
      queries.push('insert into adjustment '+_Hotel.buildQuery({
        year:(new Date).getFullYear(),
        month:(new Date).getMonth(),
        date:(new Date).getDate(),
        amount:fdata.nominal,
        deposit:fdata.nominal,
        flow:1,
        coa_id:coa_id,
        item_id:0,
        name:'Resto Payment by '+fdata.bearer,
        note:'',
        regid:fdata.regid,
        status:1,
      }));
      let loader=_Hotel.loader(),
      res=await _Hotel.request('queries',queries.join(';'));
      loader.remove();
      _HotelFoodBaverage.paymentPage();
    },{
      newRegid:newRegid,
    }),
    '',
  );
  row.childNodes[0].setAttribute('colspan',4);
  row.childNodes[1].setAttribute('colspan',1);
  row.childNodes[2].setAttribute('colspan',5);
  /*  */
  /* put to main */
  _Hotel.main.put('Payments Form',_Hotel.element('div',{},[
    table,
  ]));
};
/* payment receipt for all front_office payment -- require: regid */
this.paymentReceipt=async function(regid){
  _Hotel.main.loader();
  let queries=[
    'select * from payment_resto where regid='+regid,
    'select id,username as name from user',
    'select id,name from coa',
    'select id,name from menu',
  ].join(';'),
  res=await _Hotel.request('queries',queries),
  payment=res[0].length>0?res[0][0]:null,
  users=res[1],
  coa=res[2],
  items=res[3];
  if(payment==null){
    return _Hotel.alert('Error: Failed to get payment data!',payment,'error');
  }
  let data=_Hotel.parseJSON(payment.data)||[],
  types={
    2:'registration',
    3:'extrabill_cart',
    4:'request_order',
    5:'payment',
    6:'room_service',
    7:'restaurant',
    8:'payment_resto',
  };
  queries=[];
  for(let d of data){
    let type=types.hasOwnProperty(d.type)?types[d.type]:d.type;
    queries.push('select * from '+type+' where regid='+d.regid);
  }
  res=await _Hotel.request('queries',queries.join(';'));
  for(let k in data){
    data[k].data=res[k].length>0?res[k][0]:null;
  }
  /* element */
  let header=_Hotel.table(),
  table=_Hotel.table(),
  footer=_Hotel.table(),
  printButton=_Hotel.button('Print','purple','print',function(){
    window.print();
  }),
  row=null;
  _Hotel.main.put('Payment Receipt',_Hotel.element('div',{
    'class':'section',
  },[
    header,table,footer,
    _Hotel.element('div',{
      'class':'section row-buttons',
    },[printButton])
  ]));
  header.style.width='100%';
  table.style.width='100%';
  /* header */
  row=table.row(
    'Receipt No.',
    payment.regid.toString().padStart(7,'0'),
    'Date',
    _Hotel.parseDate(),
  );
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[3].setAttribute('colspan',2);
  row.childNodes[0].style.width='135px';
  row.childNodes[1].style.minWidth='150px';
  row.childNodes[2].style.width='120px';
  row=table.row(
    'Payment Bearer',
    payment.bearer,
    'Servant',
    _Hotel.getValueById(payment.uid,'name',users),
  );
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[3].setAttribute('colspan',2);
  row.childNodes[0].style.width='135px';
  row.childNodes[0].style.minWidth='135px';
  row.childNodes[1].style.minWidth='150px';
  row.childNodes[2].style.width='120px';
  /* body header */
  row=table.row(
    'RegID',
    'Description',
    'Amount (IDR)',
    'Deposit (IDR)',
    'Balance (IDR)',
  ).header();
  row.childNodes[0].style.width='90px';
  row.childNodes[1].setAttribute('colspan',2);
  row.childNodes[2].style.width='120px';
  row.childNodes[3].style.width='120px';
  row.childNodes[4].style.width='120px';
  /* detail of payment data */
  let totalAmount=0,
  totalDeposit=0;
  
  for(let d of data){
    let balance=parseInt(d.deposit,10)-parseInt(d.amount,10),
    type=types.hasOwnProperty(d.type)?types[d.type]:d.type,
    desc=(d.type==7
      ?[
        'Restaurant',
        ..._Hotel.parseJSON(d.data.data).map(r=>[
          r.name,
          r.count+' '+r.unit,
        ].join(' &middot; ')),
       ].join('<br /> &#8213; ')
      :type
    ),
    row=table.row(
      d.regid,
      desc,
      _Hotel.parseNominal(d.amount),
      _Hotel.parseNominal(d.deposit),
      _Hotel.parseNominal(balance),
    );
    row.childNodes[0].classList.add('td-center');
    row.childNodes[1].setAttribute('colspan',2);
    row.childNodes[2].classList.add('td-right');
    row.childNodes[3].classList.add('td-right');
    row.childNodes[4].classList.add('td-right');
    totalAmount+=parseInt(d.amount,10);
    totalDeposit+=parseInt(d.deposit,10);
  }
  /* separator */
  row=table.row('').header();
  row.childNodes[0].setAttribute('colspan',6);
  row.childNodes[0].style.padding='1px';
  row=table.row('').header();
  row.childNodes[0].setAttribute('colspan',6);
  row.childNodes[0].style.padding='1px';
  /* total nominal: amount, deposit and balance */
  row=table.row(
    'Total',
    _Hotel.parseNominal(totalAmount),
    _Hotel.parseNominal(totalDeposit),
    _Hotel.parseNominal(totalDeposit-totalAmount),
  );
  row.childNodes[0].classList.add('td-right');
  row.childNodes[1].classList.add('td-right');
  row.childNodes[2].classList.add('td-right');
  row.childNodes[3].classList.add('td-right');
  row.childNodes[0].setAttribute('colspan',3);
  row.childNodes[1].style.fontWeight='bold';
  row.childNodes[2].style.fontWeight='bold';
  row.childNodes[3].style.fontWeight='bold';
  /* paid */
  row=table.row('Paid (IDR)',_Hotel.parseNominal(payment.paid));
  row.childNodes[0].classList.add('td-right');
  row.childNodes[1].classList.add('td-right');
  row.childNodes[0].setAttribute('colspan',5);
  row.childNodes[1].style.fontWeight='bold';
  /* cashback */
  let balance=parseInt(payment.cashback,10);
  row=table.row('Cashback (IDR)',_Hotel.element('span',{
    'class':balance>=0?'balance-plus':'balance-minus',
    'style':'font-weight:bold;',
  }).text(_Hotel.parseNominal(balance)));
  row.childNodes[0].classList.add('td-right');
  row.childNodes[1].classList.add('td-right');
  row.childNodes[0].setAttribute('colspan',5);
  /* payment method */
  let pmethod=this.paymentMethods.hasOwnProperty(payment.method)
    ?this.paymentMethods[payment.method]:payment.method;
  row=table.row('Payment Method',pmethod);
  row.childNodes[0].setAttribute('colspan',4);
  row.childNodes[0].classList.add('td-right');
  row.childNodes[1].classList.add('td-center');
  row.childNodes[1].setAttribute('colspan',2);
  /* footer */
  row=footer.row('');
  row.childNodes[0].style.padding='2px';
  row.childNodes[0].style.boxShadow='inset 0px 0px 150px #999';
  row=footer.row('Authorized Signature');
  row.childNodes[0].style.padding='5px 20px 10px';
  footer.style.marginTop='150px';
  footer.style.marginRight='30px';
  footer.style.float='right';
};


/* room service -- guest list */
this.roomService=async function(){
  _Hotel.main.loader();
  let queries=[
    'select * from registration where status=0',
    'select * from room_service where status=0 order by id asc',
    'select id,username as name from user',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  rooms=data[0],
  services=data[1],
  users=data[2],
  table=_Hotel.table(),
  add=_Hotel.button('New','green','plus',function(){
    _HotelFoodBaverage.roomServiceEdit();
  }),
  row=table.row(
    'RegID',
    _Hotel.alias('room_number'),
    _Hotel.alias('guest_name'),
    _Hotel.alias('total_bill'),
    _Hotel.alias('service_time'),
    'Operator',
    add,
  ).header();
  /* title */
  _Hotel.main.put('Room Service &#8213; Service List',_Hotel.element('div',{},[
    _Hotel.element('div').text('Total: '+services.length+' rows'),
    table,
  ]));
  /* each service */
  for(let service of services){
    let serve=_Hotel.button('Serve','blue','dropbox',function(){
      _HotelFoodBaverage.roomServiceEdit(this.dataset.regid);
    },{
      regid:service.regid,
    }),
    view=_Hotel.button('View','green','search',function(){
      _Hotel.dialogView(this.dataset.type,this.dataset.regid);
    },{
      type:6,
      regid:service.regid,
    }),
    row=table.row(
      service.regid,
      service.room_number,
      service.guest_name,
      _Hotel.parseNominal(service.total),
      _Hotel.parseDatetime(service.time*1000),
      _Hotel.getValueById(service.uid,'name',users),
      _Hotel.element('div',{
        'class':'td-buttons',
      },[view,serve]),
    );
    row.childNodes[0].classList.add('td-center');
    row.childNodes[1].classList.add('td-center');
    row.childNodes[3].classList.add('td-center');
    row.childNodes[4].classList.add('td-center');
    row.childNodes[5].classList.add('td-center');
    row.childNodes[6].classList.add('td-center');
  }
/*
room_service
- id          aid()
- time        time()
- regid       int(10)
- uid         int(10)
- total       int(10,0)
- status      int(10,0)
- room_number int(10,0)
- guest_name  string(100)
- data        string(2048)
*/
};
/* room service view -- require: regid */
this.roomServiceView=async function(regid){
  let dialog=await _Hotel.dialogPage(),
  queries=[
    'select * from room_service where regid='+regid,
    'select id,username as name from user',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  services=data[0],
  users=data[1],
  service=_Hotel.getDataByKey('regid',regid,services),
  table=_Hotel.table(),
  row=table.head('Room Service #'+regid,6);
  /* check service */
  if(service===null){
    dialog.put('Error: Failed to get service data!');
    return;
  }
  /* bearer */
  let cols=['regid','guest_name','room_number'];
  for(let col of cols){
    row=table.row(_Hotel.alias(col),service[col]);
    row.childNodes[0].setAttribute('colspan',2);
    row.childNodes[1].setAttribute('colspan',4);
  }
  /* header */
  table.row(
    'No',
    _Hotel.alias('menu_name'),
    _Hotel.alias('menu_category'),
    _Hotel.alias('menu_price'),
    _Hotel.alias('menu_count'),
    _Hotel.alias('menu_subtotal'),
  ).header();
  /* service data each */
  let counter=0,
  sdata=_Hotel.parseJSON(service.data)||[];
  for(let sd of sdata){
    counter++;
    row=table.row(
      counter,
      sd.name,
      sd.category,
      _Hotel.parseNominal(sd.price),
      sd.count+' '+sd.unit,
      _Hotel.parseNominal(sd.subtotal),
    );
    row.childNodes[0].classList.add('td-center');
    row.childNodes[3].classList.add('td-right');
    row.childNodes[4].classList.add('td-right');
    row.childNodes[5].classList.add('td-right');
  }
  /* total */
  row=table.row(
    _Hotel.alias('total'),
    _Hotel.parseNominal(service.total),
  ).header();
  row.childNodes[0].setAttribute('colspan',5);
  row.childNodes[0].classList.add('td-right');
  row.childNodes[1].classList.add('td-right');
  /* operator */
  row=table.row(
    'Operator',
    _Hotel.getValueById(service.uid,'name',users),
  );
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].setAttribute('colspan',4);
  /* time */
  row=table.row(
    _Hotel.alias('service_time'),
    _Hotel.parseDatetime(service.time*1000),
  );
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].setAttribute('colspan',4);
  /*  */
  

  
/*
room_service
- id          aid()
- status      int(10,0)

- regid       int(10)
- guest_name  string(100)
- room_number int(10,0)

- data        string(2048)
- total       int(10,0)
- uid         int(10)
- time        time()
*/
  dialog.put(table);
};
/* room service edit -- require: regid */
this.roomServiceEdit=async function(regid=0){
  _Hotel.main.loader();
  let def={
    id:0,
    regid:regid,
    uid:_Hotel.user.id,
    total:0,
    status:0,
    room_number:0,
    guest_name:'',
    data:'[]',
  },
  defRoom={
    regid:regid,
    room_number:0,
    guest_name:'',
  },
  defTran={
    id:0,
    regid:regid,
    type:6,
    uid:_Hotel.user.id,  
    flow:1,
    deposit:0,
    amount:0,
    date:(new Date).getDate(),
    month:(new Date).getMonth(),
    year:(new Date).getFullYear(),
  },
  queries=[
    'select * from registration where status=0',
    'select * from room_service where status=0',
    'select id,username as name from user',
    'select * from menu',
    'select * from transaction where regid='+regid,
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  rooms=data[0],
  services=data[1],
  users=data[2],
  menus=data[3],
  trans=data[4],
  service=_Hotel.getDataByKey('regid',regid,services)||def,
  room=_Hotel.getDataByKey('regid',regid,rooms)||defRoom,
  sdata=_Hotel.parseJSON(service.data)||[],
  tdata=_Hotel.getDataByKey('regid',regid,trans)||defTran,
  table=_Hotel.table(),
  mContent=_Hotel.element('div',{},[table]);
  /* check room */
  service.room_number=room.room_number;
  service.guest_name=room.guest_name;
  /* title */
  let title='Room Service &#8213; '+
    (service.id==0?'New Service':'Service Edit #'+regid);
  _Hotel.main.put(title,mContent);
  /* guest */
  let guestName=_Hotel.input(
    'guest_name',
    service.guest_name,
    'text',
    _Hotel.alias('guest_name'),
    100
  ),
  /* regid */
  regidInput=_Hotel.input(
    'regid',
    service.regid,
    'number',
    'RegID',
    10
  ),
  /* room number */
  roomDef='--- ROOM NUMBER ---',
  roomsX=(service.room_number!=0
    ?rooms
      .map(r=>r.room_number)
      .filter(room_number=>room_number==service.room_number)
    :[roomDef,...rooms
      .map(r=>r.room_number)
      .filter(room_number=>room_number!==null&&!_Hotel.getDataByKey('room_number',room_number,services))
    ]
  ),
  roomNumber=_Hotel.select(
    'room_number',
    service.room_number!=0?service.room_number:roomDef,
    roomsX,
    function(){
      let room=_Hotel.getDataByKey('room_number',this.value,this.rooms),
      el=this.querySelector('option[value="'+this.dataset.roomDef+'"]');
      this.guestName.value=room.guest_name;
      this.regidInput.value=room.regid;
      if(el){el.remove();}
      this.disabled=true;
    }
  ),
  /* regid put in row */
  row=table.row('RegID',regidInput);
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].setAttribute('colspan',6);
  /* room number */
  row=table.row(_Hotel.alias('room_number'),roomNumber);
  guestName.disabled=true;
  regidInput.disabled=true;
  roomNumber.guestName=guestName;
  roomNumber.regidInput=regidInput;
  roomNumber.rooms=rooms;
  roomNumber.dataset.roomDef=roomDef;
  roomNumber.disabled=service.room_number!=0?true:false;
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].setAttribute('colspan',6);
  /* guest name */
  row=table.row(_Hotel.alias('guest_name'),guestName);
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].setAttribute('colspan',6);
  /* total and add */
  let totalHidden=_Hotel.input('total',service.total,'hidden'),
  totalParsed=_Hotel.element('span').text(_Hotel.parseNominal(service.total)),
  add=_Hotel.button('Add','green','plus',function(){
    if(!this.roomNumber.value.match(/^\d+$/)){
      return _Hotel.alert('Error: Cannot find room!',
        'Please select room number.','error');
    }
    _HotelFoodBaverage.roomServiceEditAddRow({
      table:this.table,
      menus:this.menus,
      totalHidden:this.totalHidden,
      totalParsed:this.totalParsed,
    });
  });
  add.table=table;
  add.menus=menus;
  add.totalHidden=totalHidden;
  add.totalParsed=totalParsed;
  add.roomNumber=roomNumber;
  /* header */
  table.row(
    'No',
    _Hotel.alias('menu_name'),
    _Hotel.alias('menu_category'),
    _Hotel.alias('menu_price'),
    _Hotel.alias('menu_count'),
    _Hotel.alias('menu_unit'),
    _Hotel.alias('menu_subtotal'),
    add,
  ).header();
  table.dataset.counter='1';
  
  /* service data */
  for(let sd of sdata){
    this.roomServiceEditAddRow({
      table,
      menus,
      totalHidden,
      totalParsed,
      data:sd,
    });
  }
  /* total -- new table */
  table=_Hotel.table();
  mContent.append(table);
  row=table.row(
    _Hotel.alias('total'),
    _Hotel.element('div',{},[
      totalHidden,
      totalParsed,
    ]),
  ).header();
  row.childNodes[0].classList.add('td-right');
  row.childNodes[1].classList.add('td-right');
  row.childNodes[0].style.minWidth='150px';
  row.childNodes[1].style.minWidth='100px';
  /* Operator */
  row=table.row(
    'Operator',
    _Hotel.element('div',{},[
      _Hotel.input('uid',_Hotel.user.id,'hidden'),
      _Hotel.element('span').text(
        _Hotel.getValueById(_Hotel.user.id,'name',users)
      )
    ]),
  );
  row.childNodes[0].classList.add('td-right');
  /* save */
  let save=_Hotel.button('Save','blue','save',async function(){
    let fdata=_Hotel.formSerialize(true),
    rdata=_Hotel.parseJSON(fdata.data),
    tdata=this.dataset.tid==0
      ?_Hotel.parseJSON(this.dataset.tdata)
      :{
        regid:fdata.regid,
        uid:fdata.uid,
        amount:fdata.total,
      },
    data=_Hotel.objectToArray(rdata);
    fdata.data=JSON.stringify(data);
    tdata.regid=fdata.regid;
    tdata.uid=fdata.uid;
    tdata.amount=fdata.total;
    delete tdata.id;
    if(!fdata.room_number.match(/^\d+$/)){
      return _Hotel.alert(
        'Error: Failed to get room number!',
        'Please select room number.',
        'error'
      );
    }
    let tInnerQuery=_Hotel.buildQuery(tdata),
    tQuery=this.dataset.tid==0
      ?'insert into transaction '+tInnerQuery
      :'update transaction ('+tInnerQuery+') where id='+this.dataset.tid,
    innerQuery=_Hotel.buildQuery(fdata),
    query=this.dataset.id==0
       ?'insert into room_service '+innerQuery
       :'update room_service ('+innerQuery+') where id='+this.dataset.id,
    res=await _Hotel.request('queries',[query,tQuery].join(';'));
    if(res.join('')!=11){
      return _Hotel.alert('Error: Failed to save data!',res,'error');
    }
    _HotelFoodBaverage.roomService();
  },{
    id:service.id,
    tid:tdata.id,
    tdata:JSON.stringify(tdata),
  });
  row=table.row(
    '',
    save,
  );
};
/* room service add row -- service.data */
this.roomServiceEditAddRow=function(config={}){
  config=_Hotel.isObject(config)?config:{};
  let table=config.table||_Hotel.table(),
  menus=config.menus||this.menus,
  counter=table.dataset.counter?parseInt(table.dataset.counter,10):1,
  totalHidden=config.totalHidden||_Hotel.input('total','0','hidden'),
  totalParsed=config.totalParsed||_Hotel.element('span').text(),
  data=config.data||{
    name:'',
    category:0,
    price:0,
    count:0,
    unit:'Porsi',
    subtotal:0,
  },
  del=_Hotel.button('Delete','red','trash',function(){
    let el=document.getElementById('row-'+this.dataset.counter);
    if(el){el.remove();}
    let gtotal=_HotelFoodBaverage.getGrandTotal();
    this.totalHidden.value=gtotal;
    this.totalParsed.innerText=_Hotel.parseNominal(gtotal);
  },{
    counter:counter,
  }),
  dataCategory=_Hotel.element('div',{},[
    _Hotel.input('data['+counter+'][category]',data.category,'hidden'),
    _Hotel.element('span').text(data.category),
  ]),
  dataPrice=_Hotel.element('div',{},[
    _Hotel.input('data['+counter+'][price]',data.price,'hidden'),
    _Hotel.element('span').text(_Hotel.parseNominal(data.price)),
  ]),
  dataCount=_Hotel.input('data['+counter+'][count]',data.count,'number',
    _Hotel.alias('menu_count'),10
  ),
  dataUnit=_Hotel.element('div',{},[
    _Hotel.input('data['+counter+'][unit]',data.unit,'hidden'),
    _Hotel.element('span').text(data.unit),
  ]),
  dataSubtotal=_Hotel.element('div',{},[
    _Hotel.input('data['+counter+'][subtotal]',data.subtotal,'hidden'),
    _Hotel.element('span').text(_Hotel.parseNominal(data.subtotal)),
  ]),
  dataName=_Hotel.findSelect({
    id:'data-name',
    key:'data['+counter+'][name]',
    value:data.name,
    data:menus,
    inject:{
      dataCategory,
      dataPrice,
      dataUnit,
      totalHidden,
      totalParsed,
    },
    callback:function(res,inject){
      res.main.slave.result.value=res.name;
      let menuCategory=_HotelFoodBaverage.menuCategories.hasOwnProperty(res.data.category)
        ?_HotelFoodBaverage.menuCategories[res.data.category]:res.data.category;
      inject.dataCategory.childNodes[0].value=menuCategory;
      inject.dataCategory.childNodes[1].innerText=menuCategory;
      inject.dataPrice.childNodes[0].value=res.data.price;
      inject.dataPrice.childNodes[1].innerText=_Hotel.parseNominal(res.data.price);
      inject.dataUnit.childNodes[0].value=res.data.unit;
      inject.dataUnit.childNodes[1].innerText=res.data.unit;
      let gtotal=_HotelFoodBaverage.getGrandTotal();
      inject.totalHidden.value=gtotal;
      inject.totalParsed.innerText=_Hotel.parseNominal(gtotal);
    },
  }),
  row=table.row(
    counter,
    dataName,
    dataCategory,
    dataPrice,
    dataCount,
    dataUnit,
    dataSubtotal,
    del,
  );
  row.id='row-'+counter;
  row.childNodes[0].classList.add('td-center');
  row.childNodes[3].classList.add('td-right');
  row.childNodes[6].classList.add('td-right');
  del.totalHidden=totalHidden;
  del.totalParsed=totalParsed;
  del.dataSubtotal=dataSubtotal;
  dataName.slave.input.value=data.name;
  dataCount.dataPrice=dataPrice;
  dataCount.dataSubtotal=dataSubtotal;
  dataCount.totalHidden=totalHidden;
  dataCount.totalParsed=totalParsed;
  dataCount.addEventListener('keyup',function(){
    let subtotal=parseInt(this.value,10)
      *parseInt(this.dataPrice.childNodes[0].value,10);
    this.dataSubtotal.childNodes[0].value=subtotal;
    this.dataSubtotal.childNodes[1].innerText=_Hotel.parseNominal(subtotal);
    let gtotal=_HotelFoodBaverage.getGrandTotal();
    this.totalHidden.value=gtotal;
    this.totalParsed.innerText=_Hotel.parseNominal(gtotal);
  },false);
  table.dataset.counter=(counter+1)+'';
};


/* guest names --> from registers */
this.getGuestNames=function(data=[]){
  let res=[];
  for(let d of data){
    if(res.indexOf(d.name)>=0){
      continue;
    }res.push(d.name);
  }return res;
};
/* get grand total */
this.getGrandTotal=function(){
  let fdata=_Hotel.formSerialize(true),
  data=_Hotel.parseJSON(fdata.data),
  gtotal=0;
  for(let i in data){
    let val=data[i],
    subtotal=parseInt(val.price,10)*parseInt(val.count,10);
    gtotal+=subtotal;
  }return gtotal;
};

/* get coa name from this.coa array */
this.getCoaName=function(id){
  return _Hotel.getValueById(parseInt(id),'name',this.coa);
};
/* initiator */
return this.init();
};



/* HotelAccounting */
;function HotelAccounting(){
window._HotelAccounting=this;
this.coa=[];
this.items=[];
this.months=[
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
this.tTypes={
  0:'',
  1:'Purchase Order',
  2:'Room',
  3:'Extrabill',
  4:'Request Order',
  5:'Payment',
  6:'Room Service',
  7:'Restaurant',
  8:'Payment Restaurant',
  9:'Adjustment',
};
this.tStatuses=[
  'Open',
  'Close',
];
this.paymentMethods=_Hotel.paymentMethods;
/* init as constructor */
this.init=function(){
  return this;
};
this.menus=function(){
  return [
    {
      name:'Dashboard',
      icon:'dashboard',
      callback:function(){
        _HotelAccounting.dashboard();
      },
    },
    {
      name:'Manual Input',
      icon:'pencil',
      callback:function(){
        _HotelAccounting.manualInput();
      },
    },
    {
      name:'Fixed Assets',
      icon:'building-o',
      callback:function(){
        _HotelAccounting.assets();
      },
    },
    {
      name:'Adjustments',
      icon:'balance-scale',
      callback:function(){
        _Hotel.adjustments();
      },
    },
    {
      name:'Transactions',
      icon:'money',
      callback:function(){
        _HotelAccounting.transactions();
      },
    },
    {
      name:'Chart of Account',
      icon:'pie-chart',
      callback:function(){
        _HotelAccounting.chartOfAccount();
      },
    },
  ];
};
this.dashboard=async function(){
  _Hotel.main.loader();
  if(this.coa.length==0){
    this.coa=await _Hotel.request('query','select * from coa');
  }
  /* dashboard menus */
  let menuReports=[
    {
      name:'General Ledger',
      icon:'hospital-o',
      callback:function(){
        _HotelAccounting.generalLedger();
      },
    },
    {
      name:'Balance Sheet',
      icon:'balance-scale',
      callback:function(){
        _HotelAccounting.balanceSheet();
      },
    },
    {
      name:'Profit and Loss',
      icon:'bar-chart',
      callback:function(){
        _HotelAccounting.profitLoss();
      },
    },
    {
      name:'Cash Flow',
      icon:'briefcase',
      callback:function(){
        _HotelAccounting.cashFlow();
      },
    },
  ],
  salesReports=[
    {
      name:'Room Sales Report',
      icon:'building-o',
      callback:function(){
        _HotelAccounting.salesReportRoom();
      },
    },
    {
      name:'Daily Room Sales Report',
      icon:'building-o',
      callback:function(){
        (new HotelFrontOffice).dailyReportRoom();
      },
    },
    {
      name:'Resto Sales Report',
      icon:'shopping-basket',
      callback:function(){
        _HotelAccounting.salesReport(1);
      },
    },
  ],
  journals=[
    {
      name:'Journal Form',
      icon:'wpforms',
      callback:function(){
        _HotelAccounting.journalForm();
      },
    },
    {
      name:'Flow Form',
      icon:'wpforms',
      callback:function(){
        _HotelAccounting.flowForm();
      },
    },
    {
      name:'Account Receivable',
      icon:'recycle',
      callback:function(){
        _HotelAccounting.accountReceivable();
      },
    },
    {
      name:'COA Transfer',
      icon:'location-arrow',
      callback:function(){
        _Hotel.coaTransfer();
      },
    },
  ],
  cashBank=[
    {
      name:'Petty Cash Accounting',
      icon:'money',
      callback:function(){
        _Hotel.adjustments('all',null,null,6,'Petty Cash Accounting');
      },
    },
    {
      name:'Petty Cash FB',
      icon:'money',
      callback:function(){
        _Hotel.adjustments('all',null,null,5,'Petty Cash FB');
      },
    },
    {
      name:'Petty Cash FO',
      icon:'money',
      callback:function(){
        _Hotel.adjustments('all',null,null,4,'Petty Cash FO');
      },
    },
    {
      name:'Cash Sales',
      icon:'money',
      callback:function(){
        _Hotel.adjustments('all',null,null,7,'Cash Sales',false,[
          'regid',
          'date',
          'name',
          'coa_id',
          'credit',
          'debt',
          'balance',
          'note',
        ]);
      },
    },
    {
      name:'City Ledger',
      icon:'bank',
      callback:function(){
        _Hotel.adjustments('all',null,null,18,'City Ledger',false,[
          'regid',
          'date',
          'name',
          'coa_id',
          'credit',
          'debt',
          'balance',
          'note',
        ]);
      },
    },
    {
      name:'Mandiri Corporate',
      icon:'bank',
      callback:function(){
        _Hotel.adjustments('all',null,null,9,'Bank Mandiri Giro Corporate',false,[
          'regid',
          'date',
          'name',
          'coa_id',
          'credit',
          'debt',
          'balance',
          'note',
        ]);
      },
    },
    {
      name:'Mandiri Operational',
      icon:'bank',
      callback:function(){
        _Hotel.adjustments('all',null,null,10,'Bank Mandiri Giro Operational',false,[
          'regid',
          'date',
          'name',
          'coa_id',
          'credit',
          'debt',
          'balance',
          'note',
        ]);
      },
    },
    {
      name:'Bank BRI',
      icon:'bank',
      callback:function(){
        _Hotel.adjustments('all',null,null,13,'Bank BRI',false,[
          'regid',
          'date',
          'name',
          'coa_id',
          'credit',
          'debt',
          'balance',
          'note',
        ]);
      },
    },
  ],
  accruedExpenses=[
    {
      name:'Electric',
      icon:'flash',
      callback:function(){
        _Hotel.adjustments('all',null,null,64,'Electric');
      },
    },
    {
      name:'Water',
      icon:'thermometer',
      callback:function(){
        _Hotel.adjustments('all',null,null,65,'Water');
      },
    },
    {
      name:'Telephone',
      icon:'phone',
      callback:function(){
        _Hotel.adjustments('all',null,null,66,'Telephone');
      },
    },
    {
      name:'Employee Insurance',
      icon:'briefcase',
      callback:function(){
        _Hotel.adjustments('all',null,null,67,'Employee Insurance');
      },
    },
    {
      name:'Salary',
      icon:'money',
      callback:function(){
        _Hotel.adjustments('all',null,null,68,'Salary');
      },
    },
  ],
  informations=[
    {
      name:'Cash Info',
      icon:'info',
      callback:function(){
        _HotelAccounting.cashInfo();
      },
    },
    {
      name:'Paid AR',
      icon:'recycle',
      callback:function(){
        _HotelAccounting.paidAR();
      },
    },
  ],
  payments=[
    {
      name:'FO Payments',
      icon:'money',
      callback:function(){
        (new HotelFrontOffice).paymentPage();
      },
    },
    {
      name:'FB Payments',
      icon:'money',
      callback:function(){
        (new HotelFoodBaverage).paymentPage();
      },
    },
  ],
  table=_Hotel.table(),
  left=_Hotel.element('div'),
  right=_Hotel.element('div'),
  double=_Hotel.main.double(left,right),
  row=table.row('Reports').header();
  row=table.row(
    _Hotel.element('div',{
      'class':'dashboard-menu',
    },_Hotel.dashboardMenu(menuReports))
  );
  /* main put */
  _Hotel.main.put('Dashboard',double);
  /* left table */
  left.append(table);
  table.classList.add('table-full');
  /* sales report */
  row=table.row('Sales Reports').header();
  row=table.row(
    _Hotel.element('div',{
      'class':'dashboard-menu',
    },_Hotel.dashboardMenu(salesReports))
  );
  /* journals */
  row=table.row('Journals').header();
  row=table.row(
    _Hotel.element('div',{
      'class':'dashboard-menu',
    },_Hotel.dashboardMenu(journals))
  );
  /* informations */
  row=table.row('Informations').header();
  row=table.row(
    _Hotel.element('div',{
      'class':'dashboard-menu',
    },_Hotel.dashboardMenu(informations))
  );
  /* right table */
  table=_Hotel.table();
  right.append(table);
  table.classList.add('table-full');
  /* petty cashes */
  row=table.row('Cash & Bank').header();
  row=table.row(
    _Hotel.element('div',{
      'class':'dashboard-menu',
    },_Hotel.dashboardMenu(cashBank))
  );
  /* payments */
  row=table.row('Payments').header();
  row=table.row(
    _Hotel.element('div',{
      'class':'dashboard-menu',
    },_Hotel.dashboardMenu(payments))
  );
  /* accrued expenses */
  row=table.row('Accrued Expenses').header();
  row=table.row(
    _Hotel.element('div',{
      'class':'dashboard-menu',
    },_Hotel.dashboardMenu(accruedExpenses))
  );
  /*  */
};
/* dashboard helper */
this.dashboardHelperTable=function(coa,left,right){
  /* other trees */
  let treeIncome={
    88:[89,94,100,105],
  },
  treeOutcome={
    51:[69,73,80,84],
    112:[113,118,123],
    128:[129,146,161],
    180:[181,195,207,221],
    234:[235],
  };
  /* coa menus from tree outcome */
  for(let ti in treeOutcome){
    let tdata=_Hotel.getDataById(ti,coa),
    table=_Hotel.table(),
    treeChild=treeOutcome[ti];
    /* new table to the left or right */
    if(ti<128){
      left.append(table);
    }else{
      right.append(table);
    }
    table.classList.add('table-full');
    for(let tk of treeChild){
      let bdata=_Hotel.getDataById(tk,coa),
      branches=_Hotel.getDataByKey('parent',tk,coa,true),
      row=table.row(bdata.id+' '+bdata.name).header(),
      menus=[];
      for(let branch of branches){
        menus.push({
          name:branch.name,
          icon:'star-o',
          callback:function(){
            _Hotel.adjustments('all',null,null,branch.id,branch.name);
          },
        });
      }
      row=table.row(
        _Hotel.element('div',{
          'class':'dashboard-menu',
        },_Hotel.dashboardMenu(menus))
      );
    }
  }
};
/* manual input */
this.manualInput=async function(){
  _Hotel.main.loader();
  let left=_Hotel.element('div'),
  right=_Hotel.element('div'),
  double=_Hotel.main.double(left,right);
  /* main put */
  _Hotel.main.put('Manual Input',double);
  /* helper table */
  this.dashboardHelperTable(this.coa,left,right);
};

/* general ledger */
this.generalLedger=async function(date='all',month,year){
  _Hotel.main.loader();
  let defDate=_Hotel.production?(new Date).getDate():'all';
  year=year||(new Date).getFullYear();
  month=!isNaN(parseInt(month,10))?month:(new Date).getMonth();
  date=date||defDate;
  let accountNames={
    2:'Room',         /* coa:89 - 3100 */ 
    3:'Extrabill',    /* coa:93 (extrabed) - 3113 */
    4:'Expense',
    5:'Room Payment', 
    6:'Room Service', /* coa:97/104 - 3214 */ 
    7:'Food',         /* coa:95/101 */ 
    8:'Food Payment',
    9:'Adjustment',
  },
  accountNumbers={
    2:3100,
    3:3113,
    4:4400,
    5:3100,
    6:3214,
    7:3210,
    8:3210,
    9:0,
  },
  tQuery='select * from transaction where status=1 and year='+year
    +' and month='+month+(date=='all'?'':' and date='+date)+' order by id asc',
  queries=[
    tQuery,
    'select * from coa',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  trans=data[0],
  coa=data[1],
  error=false;
  table=_Hotel.table(),
  tables=_Hotel.transactionTypes,
  oMonths=_Hotel.arrayToObject(this.months),
  kdate=Math.floor(year/4)==year?29:28,
  mdates=[31,kdate,31,30,31,30,31,31,30,31,30,31],
  dates=_Hotel.select('date',date,[
    'all',
    ..._Hotel.range(1,mdates[month]),
  ],function(){
    _HotelAccounting.generalLedger(this.value,parseInt(this.dataset.month),this.dataset.year);
  },{year,month}),
  months=_Hotel.select('month',month,oMonths,function(){
    _HotelAccounting.generalLedger(this.dataset.date,parseInt(this.value),this.dataset.year);
  },{year,date}),
  years=_Hotel.select('year',year,_Hotel.getYears(),function(){
    _HotelAccounting.generalLedger(this.dataset.date,parseInt(this.dataset.month),this.value);
  },{month,date}),
  pbutton=_Hotel.button('Print','orange','print',function(){
    window.print();
  });
  /* additional data */
  queries=[];
  for(let tran of trans){
    if(!tables.hasOwnProperty(tran.type)){
      error='Error: Unknown type of '+tran.type;
      continue;
    }
    queries.push('select * from '+tables[tran.type]+' where regid='+tran.regid);
  }
  if(error){
    _Hotel.main.put(error,'');
    return;
  }
  let xdatas=await _Hotel.request('queries',queries.join(';')),
  xdata=[];
  for(let xd of xdatas){
    let xdd=xd.length>0?xd[0]:false;
    xdata.push(xdd);
  }
  /* put to main */
  _Hotel.main.put(
    'General Ledger &#8213; '+this.months[month]+' '+year,
    _Hotel.element('div',{},[
      months,
      years,
      pbutton,
      table,
    ])
  );
  /* header */
  let row=table.row(
    _Hotel.alias('date'),
    _Hotel.alias('account_number'),
    _Hotel.alias('account_name'),
    _Hotel.alias('ref'),
    _Hotel.alias('credit'),
    _Hotel.alias('debt'),
    _Hotel.alias('deposit'),
    _Hotel.alias('balance'),
  ).header();
  /*  */
  /* each transaction of parents */
  let totalAmount=0,
  totalDeposit=0,
  totalCredit=0,
  totalDebt=0;
  for(let tk in trans){
    let tran=trans[tk],
    xtran=xdata[tk];
    if(!xtran){
      _Hotel.alert('Error: Invalid data on #'+tran.regid,'','error');
      break;
    }
    let tdate=[
      tran.year,
      (parseInt(tran.month)+1).toString().padStart(2,'0'),
      tran.date.toString().padStart(2,'0'),
    ].join('-'),
    amount=parseInt(tran.amount,10),
    deposit=parseInt(tran.deposit,10),
    credit=tran.flow==1?amount:0,
    debt=tran.flow==0?amount:0,
    balance=deposit-amount,
    aNumber=accountNumbers.hasOwnProperty(tran.type)?accountNumbers[tran.type]:'',
    aName=accountNames.hasOwnProperty(tran.type)?accountNames[tran.type]:'';
    if(tran.type==9){
      let coad=_Hotel.getDataById(xtran.coa_id,coa);
      aNumber=coad.code;
      aName=coad.name;
    }
    let row=table.row(
      tdate,
      aNumber,
      aName,
      '#'+tran.regid,
      _Hotel.parseNominal(credit),
      _Hotel.parseNominal(debt),
      _Hotel.parseNominal(deposit),
      _Hotel.parseNominal(balance),
    );
    row.childNodes[1].classList.add('td-center');
    row.childNodes[3].classList.add('td-center');
    row.childNodes[4].classList.add('td-right');
    row.childNodes[5].classList.add('td-right');
    row.childNodes[6].classList.add('td-right');
    row.childNodes[7].classList.add('td-right');
    totalAmount+=amount;
    totalDeposit+=deposit;
    totalCredit+=credit;
    totalDebt+=debt;
  }
  /* total */
  row=table.row(
    'Total',
    _Hotel.parseNominal(totalCredit),
    _Hotel.parseNominal(totalDebt),
    '',
    _Hotel.parseNominal(totalCredit-totalDebt),
  ).header();
  row.childNodes[0].setAttribute('colspan',4);
  row.childNodes[0].classList.add('td-center');
  row.childNodes[1].classList.add('td-right');
  row.childNodes[2].classList.add('td-right');
  row.childNodes[3].classList.add('td-right');
  row.childNodes[4].classList.add('td-right');
  /*  */
};

/* balance sheet -- Assets = Liabilities + Owner Equity */
this.balanceSheet=async function(month,year){
  _Hotel.main.loader();
  year=year||(new Date).getFullYear();
  month=!isNaN(parseInt(month,10))?month:(new Date).getMonth();
  let parents=[3,8,14,20,30,34,51,53,79,88,112,128,180,234,245],
  variables=[
    "Cash/Bank",
    "Account Receivable",
    "Inventory",
    "Other Current Asset",
    "Fixed Asset",
    "Accumulation Depreciation",
    "Account Payable",
    "Other Current Liability",
    "Equity",
    "Income",
    "Cost of Good Sold",
    "Expense",
  ],
  treeAssets={
    /* assets */
    3:[4,5,6,7], /* cash_bank */
    8:[9,10,11,12,13], /* cash_bank */
    14:[15,16,17,18,19],
    20:[21,22,23,24,25,26,27],
    35:[36,37,38,38,40],
    41:[42,43,44,45],
  },
  treeLE={
    /* liability_equity */
    58:[59,60,61,62],
    63:[64,65,66,67,68],
    69:[70,71,72],
    73:[74,75,76,77,78],
    80:[81,82,83],
    84:[85,86,87,254], /* equity */
  },
  queries=[
    'select * from coa',
    'select * from asset',
    'select * from transaction where status=1 and year='+year+' and month='+month,
    'select * from adjustment where status=1 and year='+year+' and month='+month,
    'select * from price',
    'select * from item_stock',
    'select * from registration where type="registration" and date_arrival like %'+year+'-'+month+'-%',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  coa=data[0],
  assets=data[1],
  transactions=data[2],
  adjustments=data[3],
  items=data[4],
  stocks=data[5],
  registrations=data[6],
  odata={
    coa,
    assets,
    transactions,
    adjustments,
    items,
    stocks,
    registrations,
  },
  table=_Hotel.table(),
  tableX=_Hotel.table(),
  oMonths=_Hotel.arrayToObject(this.months),
  months=_Hotel.select('month',month,oMonths,function(){
    _HotelAccounting.balanceSheet(parseInt(this.value),this.dataset.year);
  },{year}),
  years=_Hotel.select('year',year,_Hotel.getYears(),function(){
    _HotelAccounting.balanceSheet(parseInt(this.dataset.month),this.value);
  },{month}),
  pbutton=_Hotel.button('Print','orange','print',function(){
    window.print();
  });
  /* register table */
  table.classList.add('table-register');
  tableX.classList.add('table-register');
  /* put to main */
  _Hotel.main.put(
    'Balance Sheet &#8213; '+this.months[month]+' '+year,
    _Hotel.element('div',{},[
      months,
      years,
      pbutton,
      _Hotel.main.double(table,tableX),
    ])
  );
  /* header */
  table.head('ASSETS',3);
  /* each per tree assets */
  for(let tk in treeAssets){
    let bdata=_Hotel.getDataById(tk,coa),
    ttk=treeAssets[tk],
    total=0,
    counter=0,
    branches=_Hotel.getDataByKey('parent',tk,coa,true),
    strong=_Hotel.element('strong').text(bdata.code+' '+bdata.name),
    strongTotal=_Hotel.element('strong').text('Total '+bdata.name);
    row=table.row(strong).header();
    row.childNodes[0].setAttribute('colspan',3);
    for(let branch of branches){
      counter++;
      let nominal=this.balanceSheetGetNominal(branch.id,tk,odata),
      row=table.row(branch.code,branch.name,_Hotel.parseNominal(nominal));
      row.childNodes[0].classList.add('td-center');
      row.childNodes[2].classList.add('td-right');
      row.childNodes[0].style.width='90px';
      total+=nominal;
    }
    let strongTotalNominal=_Hotel.element('strong').text(_Hotel.parseNominal(total));
    row=table.row(strongTotal,strongTotalNominal);
    row.childNodes[1].classList.add('td-right');
    row.childNodes[0].setAttribute('colspan',2);
  }
  /* header */
  tableX.head('LIABILITIES & EQUITY',3);
  /* each per tree liabilities and equity */
  for(let tk in treeLE){
    let bdata=_Hotel.getDataById(tk,coa),
    ttk=treeLE[tk],
    counter=0,
    total=0,
    branches=_Hotel.getDataByKey('parent',tk,coa,true),
    strong=_Hotel.element('strong').text(bdata.code+' '+bdata.name),
    strongTotal=_Hotel.element('strong').text('Total '+bdata.name);
    row=tableX.row(strong).header();
    row.childNodes[0].setAttribute('colspan',3);
    for(let branch of branches){
      counter++;
      let nominal=this.balanceSheetGetNominal(branch.id,tk,odata),
      row=tableX.row(branch.code,branch.name,_Hotel.parseNominal(nominal));
      row.childNodes[0].classList.add('td-center');
      row.childNodes[2].classList.add('td-right');
      row.childNodes[0].style.width='90px';
      total+=nominal;
    }
    let strongTotalNominal=_Hotel.element('strong').text(_Hotel.parseNominal(total));
    row=tableX.row(strongTotal,strongTotalNominal);
    row.childNodes[1].classList.add('td-right');
    row.childNodes[0].setAttribute('colspan',2);
  }
  /*  */
  /*  */
};
/* balance sheet get nominal */
this.balanceSheetGetNominal=function(coa_id=0,pid=0,data={}){
  let res=0,
  pidKeys=[3,8,63,69,73,80,84];
  if(pid==35&&data.hasOwnProperty('assets')){
    if(coa_id==40&&data.hasOwnProperty('items')&&data.hasOwnProperty('stocks')){
      for(let i of data.stocks){
        let item=_Hotel.getDataById(i.item_id,data.items);
        if(item.category==coa_id){
          res+=parseInt(i.stock,10)*parseInt(item.nominal,10);
        }
      }
    }
    for(let i of data.assets){
      if(i.coa_id==coa_id){
        res+=parseInt(i.nominal,10);
      }
    }
  }else if(pid==41&&data.hasOwnProperty('assets')){
    let coas={
      42:37,
      43:38,
      44:39,
      45:40,
      253:252,
    },
    depPercent={
      42:0.05,
      43:0.125,
      44:0.2,
      45:0.25,
      253:0,
    },
    percent=depPercent.hasOwnProperty(coa_id)?depPercent[coa_id]:0,
    coaid=coas.hasOwnProperty(coa_id)?coas[coa_id]:coa_id;
    if(coaid==40&&data.hasOwnProperty('items')&&data.hasOwnProperty('stocks')){
      for(let i of data.stocks){
        let item=_Hotel.getDataById(i.item_id,data.items);
        if(item.category==coaid){
          let nominal=parseInt(i.stock,10)*parseInt(item.nominal,10);
          res+=nominal-(nominal*percent);
        }
      }
    }
    for(let i of data.assets){
      if(i.coa_id==coaid){
        let nominal=parseInt(i.nominal,10),
        year=parseInt(i.year,10),
        yearTotal=(new Date).getFullYear()-year,
        dep=(nominal*percent)*yearTotal;
        res+=nominal-dep;
      }
    }
  }else if(pidKeys.indexOf(parseInt(pid,10))>=0&&data.hasOwnProperty('adjustments')){
    for(let i of data.adjustments){
      if(i.coa_id==coa_id){
        if(i.flow==1){
          res+=parseInt(i.deposit,10);
        }else{
          res-=parseInt(i.deposit,10);
        }
      }
    }
  }else if(pid==20&&data.hasOwnProperty('items')&&data.hasOwnProperty('stocks')){
    for(let i of data.stocks){
      let item=_Hotel.getDataById(i.item_id,data.items);
      if(item.category==coa_id){
        res+=parseInt(i.stock,10)*parseInt(item.nominal,10);
      }
    }
  }else if(pid==58&&data.hasOwnProperty('transactions')){
    let base={
      2:'registration',
      3:'extrabill_cart',
      4:'request_order',
      5:'payment',
      6:'room_service',
      7:'restaurant',
      8:'payment_resto',
      9:'adjustment',
    },
    types={
      2:0,
      3:0,
      4:0,
      5:60,
      6:0,
      7:0,
      8:60,
      9:0,
    },
    percents={
      59:0.05,
      60:0.1,
      61:0,
      61:0,
    },
    percent=percents.hasOwnProperty(coa_id)?percents[coa_id]:0;
    for(let i of data.transactions){
      i.coa_id=types.hasOwnProperty(i.type)?types[i.type]:0;
      if(i.coa_id==coa_id){
        if(i.flow==1){
          res+=parseInt(i.deposit,10);
        }else{
          res-=parseInt(i.deposit,10);
        }
      }
    }
    let tax=percent*res;
    res=tax;
  }else if(pid==14&&data.hasOwnProperty('transactions')){
    let base={
      2:'registration',
      3:'extrabill_cart',
      4:'request_order',
      5:'payment',
      6:'room_service',
      7:'restaurant',
      8:'payment_resto',
      9:'adjustment',
    },
    types={
      2:15,
      3:15,
      4:0,
      5:18,
      6:15,
      7:16,
      8:18,
      9:0,
    };
    for(let i of data.transactions){
      i.coa_id=types.hasOwnProperty(i.type)?types[i.type]:0;
      if(i.coa_id==coa_id){
        if(i.flow==1){
          res+=parseInt(i.deposit,10);
        }else{
          res-=parseInt(i.deposit,10);
        }
      }
    }
  }
  return res;
};

/* profit and loss */
this.profitLoss=async function(month,year){
  _Hotel.main.loader();
  year=year||(new Date).getFullYear();
  month=!isNaN(parseInt(month,10))?month:(new Date).getMonth();
  let parents=[3,8,14,20,30,34,51,53,79,88,112,128,180,234,245],
  variables=[
    "Cash/Bank",
    "Account Receivable",
    "Inventory",
    "Other Current Asset",
    "Fixed Asset",
    "Accumulation Depreciation",
    "Account Payable",
    "Other Current Liability",
    "Equity",
    "Income",
    "Cost of Good Sold",
    "Expense",
  ],
  treeIncome={
    88:[89,94,100,105],
    112:[113,118,123],
  },
  treeOutcome={
    128:[129,146,161],
    180:[181,195,207,221],
    234:[235],
  },
  kdate=Math.floor(year/4)==year?29:28,
  kmonth=[31,kdate,31,30,31,30,31,31,30,31,30,31],
  dateTime=Math.floor((new Date([
    year,
    (parseInt(month,10)+1).toString().padStart(2,'0'),
    (1).toString().padStart(2,'0'),
  ].join('-'))).getTime()/1000),
  dateTimeEnd=dateTime+(3600*24*(kmonth[month]+1)),
  queries=[
    'select * from coa',
    'select * from asset',
    'select * from transaction where status=1 and year='+year+' and month='+month,
    'select * from adjustment where status=1 and year='+year+' and month='+month,
    'select * from price',
    'select * from item_stock',
    'select * from registration where type="registration" and date_arrival like %'
      +year+'-'+(parseInt(month,10)+1).toString().padStart(2,'0')+'-%',
    'select * from room',
    'select * from menu',
    'select * from restaurant where status=1 and time > '+dateTime+' and time < '+dateTimeEnd,
    'select * from room_service where status=1 and time > '+dateTime+' and time < '+dateTimeEnd,
    'select * from extrabill_cart where status=1 and time > '+dateTime+' and time < '+dateTimeEnd,
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  coa=data[0],
  assets=data[1],
  transactions=data[2],
  adjustments=data[3],
  items=data[4],
  stocks=data[5],
  registrations=data[6],
  rooms=data[7],
  menus=data[8],
  restaurants=data[9],
  room_services=data[10],
  extrabill_carts=data[11],
  odata={
    coa,
    assets,
    transactions,
    adjustments,
    items,
    stocks,
    registrations,
    rooms,
    menus,
    restaurants,
    room_services,
    extrabill_carts,
  },
  left=_Hotel.element('div'),
  right=_Hotel.element('div'),
  oMonths=_Hotel.arrayToObject(this.months),
  months=_Hotel.select('month',month,oMonths,function(){
    _HotelAccounting.profitLoss(parseInt(this.value),this.dataset.year);
  },{year}),
  years=_Hotel.select('year',year,_Hotel.getYears(),function(){
    _HotelAccounting.profitLoss(parseInt(this.dataset.month),this.value);
  },{month}),
  pbutton=_Hotel.button('Print','orange','print',function(){
    window.print();
  });
  /* put to main */
  _Hotel.main.put(
    'Profit &amp; Loss &#8213; '+this.months[month]+' '+year,
    _Hotel.element('div',{},[
      months,
      years,
      pbutton,
      _Hotel.main.double(left,right),
    ])
  );
  /*  */
  /* each per tree income */
  for(let ti in treeIncome){
    let tdata=_Hotel.getDataById(ti,coa),
    table=_Hotel.table(),
    treeChild=treeIncome[ti],
    strongTotalTree=_Hotel.element('strong').text('Total '+tdata.name),
    totalTree=0,
    row=table.head(tdata.name,3);
    row.childNodes[0].setAttribute('colspan',3);
    table.classList.add('table-register');
    left.append(table);
    for(let tk of treeChild){
      let bdata=_Hotel.getDataById(tk,coa),
      ttk=treeChild[tk],
      total=0,
      counter=0,
      branches=_Hotel.getDataByKey('parent',tk,coa,true),
      strong=_Hotel.element('strong').text(bdata.code+' '+bdata.name),
      strongTotal=_Hotel.element('strong').text('Total '+bdata.name),
      row=table.row(strong).header();
      row.childNodes[0].setAttribute('colspan',3);
      for(let branch of branches){
        counter++;
        let nominal=this.profitLossGetNominal(branch.id,tk,odata),
        row=table.row(branch.code,branch.name,_Hotel.parseNominal(nominal));
        row.childNodes[0].classList.add('td-center');
        row.childNodes[2].classList.add('td-right');
        row.childNodes[0].style.width='90px';
        total+=nominal;
      }
      let strongTotalNominal=_Hotel.element('strong').text(_Hotel.parseNominal(total));
      row=table.row(strongTotal,strongTotalNominal);
      row.childNodes[1].classList.add('td-right');
      row.childNodes[0].setAttribute('colspan',2);
      totalTree+=total;
    }
    let strongTotalTreeNominal=_Hotel.element('strong').text(_Hotel.parseNominal(totalTree));
    row=table.row(strongTotalTree,strongTotalTreeNominal);
    row.childNodes[1].classList.add('td-right');
    row.childNodes[0].setAttribute('colspan',2);
  }
  /* each per tree income */
  for(let ti in treeOutcome){
    let tdata=_Hotel.getDataById(ti,coa),
    table=_Hotel.table(),
    treeChild=treeOutcome[ti],
    strongTotalTree=_Hotel.element('strong').text('Total '+tdata.name),
    totalTree=0,
    row=table.head(tdata.name,3);
    row.childNodes[0].setAttribute('colspan',3);
    table.classList.add('table-register');
    right.append(table);
    for(let tk of treeChild){
      let bdata=_Hotel.getDataById(tk,coa),
      ttk=treeChild[tk],
      total=0,
      counter=0,
      branches=_Hotel.getDataByKey('parent',tk,coa,true),
      strong=_Hotel.element('strong').text(bdata.code+' '+bdata.name),
      strongTotal=_Hotel.element('strong').text('Total '+bdata.name),
      row=table.row(strong).header();
      row.childNodes[0].setAttribute('colspan',3);
      for(let branch of branches){
        counter++;
        let nominal=this.profitLossGetNominal(branch.id,tk,odata),
        row=table.row(branch.code,branch.name,_Hotel.parseNominal(nominal));
        row.childNodes[0].classList.add('td-center');
        row.childNodes[2].classList.add('td-right');
        row.childNodes[0].style.width='90px';
        total+=nominal;
      }
      let strongTotalNominal=_Hotel.element('strong').text(_Hotel.parseNominal(total));
      row=table.row(strongTotal,strongTotalNominal);
      row.childNodes[1].classList.add('td-right');
      row.childNodes[0].setAttribute('colspan',2);
      totalTree+=total;
    }
    let strongTotalTreeNominal=_Hotel.element('strong').text(_Hotel.parseNominal(totalTree));
    row=table.row(strongTotalTree,strongTotalTreeNominal);
    row.childNodes[1].classList.add('td-right');
    row.childNodes[0].setAttribute('colspan',2);
  }
};
/* profit and loss get nominal */
this.profitLossGetNominal=function(coa_id=0,pid=0,data={}){
  let res=0,
  fbPID=[94,100], /* food and beverage */
  pidKeys=[113,118,123,129,146,161,181,195,207,221,235]; /* from adjustment only */
  /* adjustments */
  if(pidKeys.indexOf(parseInt(pid,10))>=0&&data.hasOwnProperty('adjustments')){
    for(let i of data.adjustments){
      if(i.coa_id==coa_id){
        if(i.flow==1){
          res+=parseInt(i.deposit,10);
        }else{
          res-=parseInt(i.deposit,10);
        }
      }
    }
  }else if(pid==89&&data.hasOwnProperty('registrations')
    &&data.hasOwnProperty('items')
    &&data.hasOwnProperty('rooms')){
    let coaRoomTypes={
      90:'Executive',
      91:'Deluxe',
      92:'Superior',
      93:'Extrabed',
    };
    if(coa_id==93){
      let xbed=_Hotel.getDataById(1,data.items),
      xbedPrice=parseInt(xbed.nominal,10);
      for(let i of data.registrations){
        let bedCount=parseInt(i.extra_bed_count,10),
        bedNight=parseInt(i.extra_bed_night,10),
        bedPrice=xbedPrice*bedCount*bedNight;
        res+=bedPrice;
      }
    }else if(coaRoomTypes.hasOwnProperty(coa_id)){
      let roomType=coaRoomTypes[coa_id];
      for(let i of data.registrations){
        let room=_Hotel.getDataByKey('number',i.room_number,data.rooms);
        if(room.name!=roomType){continue;}
        let roomPrice=parseInt(room.normal_rate,10),
        roomNight=parseInt(i.nights,10),
        roomAmount=roomPrice*roomNight;
        res+=roomAmount;
      }
    }
  }else if(fbPID.indexOf(pid)>=0
    &&data.hasOwnProperty('menus')
    &&data.hasOwnProperty('restaurants')
    &&data.hasOwnProperty('room_services')
    ){
    let menuTypes=[
      'Unknown',
      'Food', /* 95 - 97 room_service */
      'Beverage',  /* 101 - 104 room_service */
      'Package',
      'Dessert',
      'Drugestore',
      'Peralatan', /* 98 */
    ],
    coaTypes={
      95:'Food',
      97:'Food',
      101:'Beverage',
      104:'Beverage',
      98:'Peralatan',
    },
    coaDataType={
      95:data.restaurants,
      97:data.room_services,
      101:data.restaurants,
      104:data.room_services,
      98:data.restaurants,
    };
    if(coaTypes.hasOwnProperty(coa_id)){
      let ftype=coaTypes[coa_id],
      cdata=coaDataType[coa_id];
      for(let i of cdata){
        let fdata=_Hotel.parseJSON(i.data);
        if(!Array.isArray(fdata)){continue;}
        for(let fd of fdata){
          if(fd.category!=ftype){continue;}
          let subtotal=parseInt(fd.subtotal,10);
          res+=subtotal;
        }
      }
    }
  }else if(pid==105&&data.hasOwnProperty('extrabill_carts')){
    for(let i of data.extrabill_carts){
      let xdata=_Hotel.parseJSON(i.data);
      if(!Array.isArray(xdata)){continue;}
      for(let xd of xdata){
        if(xd.coa_id!=coa_id){continue;}
        let subtotal=parseInt(xd.subtotal,10);
        res+=subtotal;
      }
    }
  }
  
  return res;
};

/* cash flow */
this.cashFlow=async function(){
  _Hotel.adjustments(null,null,null,0,'Cash Flow',true)
};
this.flowForm=async function(){
  _Hotel.adjustmentEdit(0,0,'Flow Form');
/*
  _Hotel.main.loader();
  let nreg=await _Hotel.newRegID(),
  regid=nreg.regid,
  table=_Hotel.table(),
  section=_Hotel.element('div',{
    'class':'section row-buttons',
  });
  table.classList.add('table-register');
  _Hotel.main.put('Flow Form',_Hotel.main.double(table,section));
                year: 2024
                month: 9
                date: 8
                flow: 1
                coa_id: 6
                amount: 5000000
                deposit: 5000000
                item_id: 0
                name: Dana Awal
                note: 
                regid: 362
                status: 1
*/
};


/* journal form */
this.journalForm=async function(){
  _Hotel.main.loader();
  let itemID=1000000,
  newRegID=await _Hotel.newRegID(9),
  queries=[
    'select * from coa',
    'select * from adjustment where status=0 and item_id='+itemID,
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  coa=data[0],
  adjustments=data[1],
  tableForm=_Hotel.table(),
  tableMain=_Hotel.table(),
  tableTotal=_Hotel.table(),
  sectionForm=_Hotel.element('div',{'class':'section row-buttons'}),
  sectionMain=_Hotel.element('div',{'class':'section row-buttons'}),
  sectionTotal=_Hotel.element('div',{'class':'section row-buttons'}),
  main=_Hotel.element('div',{});
  /* put content */
  main.append(tableForm);
  main.append(sectionForm);
  main.append(tableMain);
  main.append(sectionMain);
  main.append(tableTotal);
  main.append(sectionTotal);
  _Hotel.main.put('Journal Form',main);
  /* coa object */
  let coaObject=[];
  for(let c of coa){
    coaObject.push({
      id:c.id,
      name:c.code+' - '+c.name,
    });
  }
  /* table form */
  let regidSpan=_Hotel.element('div',{},[
    _Hotel.element('span').text(newRegID.regid),
    _Hotel.input('regid',newRegID.regid,'hidden'),
    _Hotel.input('item_id',itemID,'hidden'),
  ]),
  dateInput=_Hotel.dateSelection({
    key:'date',
    value:[
      (new Date).getFullYear(),
      ((new Date).getMonth()+1).toString().padStart(2,'0'),
      (new Date).getDate().toString().padStart(2,'0'),
    ].join('-'),
  }),
  row=tableForm.row('RegID (Reference No)',regidSpan);
  row.childNodes[1].setAttribute('colspan',2);
  row=tableForm.row('Date',dateInput);
  row.childNodes[1].setAttribute('colspan',2);
  row=tableForm.row('Description',_Hotel.textarea('name','','Description...',100));
  row.childNodes[1].setAttribute('colspan',2);
  row=tableForm.row('Account Credit',_Hotel.findSelect({
    id:'coa_credit',
    key:'coa_credit',
    value:0,
    data:coaObject,
  }),_Hotel.input('credit_nominal',0,'number'));
  row=tableForm.row('Account Debt',_Hotel.findSelect({
    id:'coa_debt',
    key:'coa_debt',
    value:0,
    data:coaObject,
  }),_Hotel.input('debt_nominal',0,'number'));
  let post=_Hotel.button('Post','blue','send',async function(){
    let yes=await _Hotel.confirmX('Post this journal?');
    if(!yes){return;}
    let fdata=_Hotel.formSerialize(),
    ndate=new Date(fdata.date),
    ntime=Math.floor(ndate.getTime()/1000),
    data={
      credit:{
        time:ntime,
        year:ndate.getFullYear(),
        month:ndate.getMonth(),
        date:ndate.getDate(),
        flow:1,
        item_id:fdata.item_id,
        name:fdata.name,
        regid:fdata.regid,
        amount:fdata.credit_nominal,
        deposit:fdata.credit_nominal,
        coa_id:fdata.coa_credit,
        status:0,
      },
      debt:{
        time:ntime,
        year:ndate.getFullYear(),
        month:ndate.getMonth(),
        date:ndate.getDate(),
        flow:0,
        item_id:fdata.item_id,
        name:fdata.name,
        regid:fdata.regid,
        amount:fdata.debt_nominal,
        deposit:fdata.debt_nominal,
        coa_id:fdata.coa_debt,
        status:0,
      },
      creditTransaction:{
        uid:_Hotel.user.id,
        time:ntime,
        year:ndate.getFullYear(),
        month:ndate.getMonth(),
        date:ndate.getDate(),
        flow:1,
        regid:fdata.regid,
        amount:fdata.credit_nominal,
        deposit:fdata.credit_nominal,
        status:0,
        type:9,
      },
      debtTransaction:{
        uid:_Hotel.user.id,
        time:ntime,
        year:ndate.getFullYear(),
        month:ndate.getMonth(),
        date:ndate.getDate(),
        flow:0,
        regid:fdata.regid,
        amount:fdata.debt_nominal,
        deposit:fdata.debt_nominal,
        status:0,
        type:9,
      },
    },
    queries=[
      'insert into adjustment '+_Hotel.buildQuery(data.credit),
      'insert into adjustment '+_Hotel.buildQuery(data.debt),
      'insert into transaction '+_Hotel.buildQuery(data.creditTransaction),
      'insert into transaction '+_Hotel.buildQuery(data.debtTransaction),
    ].join(';'),
    loader=_Hotel.loader(),
    res=await _Hotel.request('queries',queries);
    loader.remove();
    return _HotelAccounting.journalForm();
  });
  sectionForm.append(post);
  /* table main -- posted */
  let reset=_Hotel.button('Reset','red','refresh',async function(){
    let yes=await _Hotel.confirmX('Reset posted journals?');
    if(!yes){return;}
    let queries=[
      'delete from adjustment where item_id='+this.dataset.itemID,
    ],
    rows=document.querySelectorAll('tr[data-regid]');
    for(let i=0;i<rows.length;i++){
      queries.push('delete from transaction where regid='+rows[i].dataset.regid);
    }
    let loader=_Hotel.loader(),
    res=await _Hotel.request('queries',queries.join(';'));
    loader.remove();
    return _HotelAccounting.journalForm();
  },{
    itemID,
  });
  /* posted header */
  row=tableMain.row(
    'No',
    'RegID',
    'Date',
    'Account',
    'Description',
    'Credit',
    'Debt',
    reset,
  ).header();
  /* each of posted */
  let counter=0,
  totalCredit=0,
  totalDebt=0;
  for(let adj of adjustments){
    counter++;
    let adate=[
      adj.year,
      (parseInt(adj.month,10)+1).toString().padStart(2,'0'),
      (parseInt(adj.date,10)+0).toString().padStart(2,'0'),
    ].join('-'),
    pdate=_Hotel.parseDate(adate),
    coaName=_Hotel.getValueById(adj.coa_id,'name',coa),
    credit=_Hotel.parseNominal(adj.flow==1?adj.amount:0),
    debt=_Hotel.parseNominal(adj.flow==0?adj.amount:0),
    del=_Hotel.button('Delete','red','trash',async function(){
      let yes=await _Hotel.confirmX('Delete this post?');
      if(!yes){return;}
      let loader=_Hotel.loader(),
      queries=[
        'delete from adjustment where id='+this.dataset.id,
        'delete from transaction where coa_id='+this.dataset.coa_id+' and regid='+this.dataset.regid,
      ].join(';'),
      res=await _Hotel.request('queries',queries);
      loader.remove();
      let row=document.querySelector('tr[data-id="'+this.dataset.id+'"]');
      if(row){row.remove();}
    },{
      regid:adj.regid,
      id:adj.id,
      coa_id:adj.coa_id,
    }),
    row=tableMain.row(
      counter,
      adj.regid,
      pdate,
      coaName,
      adj.name,
      credit,
      debt,
      _Hotel.element('div',{},[
        del,
      ]),
    );
    row.childNodes[0].classList.add('td-center');
    row.childNodes[1].classList.add('td-center');
    row.childNodes[5].classList.add('td-right');
    row.childNodes[6].classList.add('td-right');
    row.dataset.id=adj.id;
    row.dataset.regid=adj.regid;
    if(adj.flow==1){
      totalCredit+=parseInt(adj.amount,10);
    }else{
      totalDebt=parseInt(adj.amount,10);
    }
  }
  row=tableMain.row(
    'Total',
    _Hotel.parseNominal(totalCredit),
    _Hotel.parseNominal(totalDebt),
    '',
  ).header();
  row.childNodes[0].setAttribute('colspan',5);
  row.childNodes[0].classList.add('td-right');
  row.childNodes[1].classList.add('td-right');
  row.childNodes[2].classList.add('td-right');
  /* save button */
  let save=_Hotel.button('Save','blue','save',async function(){
    let yes=await _Hotel.confirmX('Save posted journals?');
    if(!yes){return;}
    let queries=[
      'update adjustment (status=1&item_id=0) where item_id='+this.dataset.itemID,
    ],
    rows=document.querySelectorAll('tr[data-regid]');
    for(let i=0;i<rows.length;i++){
      queries.push('update transaction (status=1) where regid='+rows[i].dataset.regid);
    }
    let loader=_Hotel.loader(),
    res=await _Hotel.request('queries',queries.join(';'));
    loader.remove();
    return _HotelAccounting.journalForm();
  },{
    target:'hidden',
    itemID,
  });
  sectionMain.append(save);
  /*  */
};


/* account_receivable method */
this.accountReceivable=async function(){
  _Hotel.main.loader();
  let queries=[
    'select * from market',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  markets=data[0],
  row,
  coa_id=18,
  table=_Hotel.table(),
  section=_Hotel.element('div',{},[]);
  /* put content */
  _Hotel.main.put('Account Receivable',_Hotel.element('div',{},[table,section]));
  /* set market name */
  let marketObject={},
  marketCategories={
    regular:'Regular',
    corporate:'Corporate',
    government:'Government',
    airlines:'Airlines',
    travel_agent:'Travel Agent',
  };
  for(let market of markets){
    let mcat=marketCategories.hasOwnProperty(market.category)
      ?marketCategories[market.category]:market.category;
    marketObject[market.name]=market.name+' ('+mcat+')';
  }
  let smarket=_Hotel.select('market','personal',marketObject);
  row=table.row('Market Name',smarket);
  row.childNodes[1].setAttribute('colspan',2);
  /* set date range */
  let sdate=_Hotel.dateSelection({
    id:'date-selection',
    key:'date',
    value:[
      (new Date).getFullYear(),
      ((new Date).getMonth()+1).toString().padStart(2,'0'),
      (new Date).getDate().toString().padStart(2,'0'),
    ].join('-'),
  }),
  slength=_Hotel.select('length',1,_Hotel.range(1,31));
  row=table.row('Date Range',sdate,slength);
  /* set button action */
  let sbutton=_Hotel.button('Search','blue','search',async function(){
    _HotelAccounting.accountReceivableResult(this.section,this.dataset.coa_id);
  },{coa_id});
  sbutton.section=section;
  row=table.row('',sbutton);
  row.childNodes[1].setAttribute('colspan',2);
};
/* account receivable search result */
this.accountReceivableResult=async function(section,coa_id){
  let loader=_Hotel.loader(),
  fdata=_Hotel.formSerialize(),
  oneDaySecond=24*3600,
  start=Math.floor((new Date(fdata.date)).getTime()/1000),
  end=start+(oneDaySecond*parseInt(fdata.length,10));
  /* get registration on selected day */
  let queries=[
    'select * from registration where market_name like %'+fdata.market+'% and time > '
      +start+' and time < '+end+' and payment_method="account_receivable"',
    'select * from adjustment where coa_id='+coa_id,
    'select * from coa where parent=8 or parent=3',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  regs=data[0],
  adjustments=data[1],
  coa=data[2],
  row;
  loader.remove();
  /* get section */
  let table=_Hotel.table();
  section.innerHTML='';
  section.append(table);
  /* total input */
  let totalSpan=_Hotel.element('span').text(_Hotel.parseNominal(0)),
  totalInput=_Hotel.input('total',0,'hidden'),
  depositSpan=_Hotel.element('span').text(_Hotel.parseNominal(0)),
  depositInput=_Hotel.input('deposit',0,'number');
  /* table header */
  row=table.row(
    'No',
    'Check',
    'RegID',
    'Guest Name',
    'Market Name',
    'Market Segment',
    'Arrival Date',
    'Departure Date',
    'Total',
  ).header();
  /* each */
  let counter=0;
  for(let reg of regs){
    counter++;
    let adata=_Hotel.getDataByKey('regid',reg.regid,adjustments);
    if(!adata){
      continue;
    }
    let checkbox=_Hotel.checkbox('data['+reg.regid+'][checkbox]',reg.payment_amount),
    row=table.row(
      counter,
      checkbox,
      reg.regid,
      reg.guest_name,
      reg.market_name,
      reg.market_segment,
      reg.date_arrival,
      reg.date_departure,
      _Hotel.parseNominal(reg.payment_amount),
    );
    row.childNodes[8].classList.add('td-right');
    /* checkbox action */
    checkbox.input.onchange=function(){
      let total=parseInt(this.total.value,10),
      value=parseInt(this.dataset.payment_amount,10);
      if(this.checked){
        total+=value;
      }else{
        total-=value;
      }
      this.total.value=total;
      this.totalSpan.innerText=_Hotel.parseNominal(total);
      this.deposit.value=total;
      this.depositSpan.innerText=_Hotel.parseNominal(total);
    };
    checkbox.input.dataset.payment_amount=reg.payment_amount;
    checkbox.input.dataset.regid=reg.regid;
    checkbox.input.dataset.guest_name=reg.guest_name;
    checkbox.input.total=totalInput;
    checkbox.input.totalSpan=totalSpan;
    checkbox.input.deposit=depositInput;
    checkbox.input.depositSpan=depositSpan;
  }
  /* new table */
  table=_Hotel.table();
  section.append(table);
  /* header */
  row=table.row('Payment Form').header();
  row.childNodes[0].setAttribute('colspan',2);
  /* name */
  row=table.row('Name',_Hotel.input('name',fdata.market,'text','Nama...'));
  /* receipant account */
  let coas={};
  for(let co of coa){
    coas[co.id]=co.name;
  }
  let srec=_Hotel.select('coa_id',coas.hasOwnProperty(9)?9:coa[0].id,coas);
  row=table.row('Recipient Account',srec);
  /* total */
  row=table.row('Total Selected',_Hotel.element('div',{},[totalInput,totalSpan]));
  row.childNodes[1].classList.add('td-right');
  /* deposit */
  row=table.row('Deposit',depositInput);
  row=table.row('Deposit (IDR)',depositSpan);
  row.childNodes[1].classList.add('td-right');
  depositInput.span=depositSpan;
  depositInput.onkeyup=function(){
    this.span.innerText=_Hotel.parseNominal(this.value);
  };
  /* transfer date */
  let tdate=_Hotel.dateSelection({
    id:'date-selection',
    key:'payment_date',
    value:[
      (new Date).getFullYear(),
      ((new Date).getMonth()+1).toString().padStart(2,'0'),
      (new Date).getDate().toString().padStart(2,'0'),
    ].join('-'),
  });
  row=table.row('Payment Date',tdate);
  /* evidence -- upload */
  let efile=_Hotel.input('evidence_upload','','file'),
  ebutton=_Hotel.input('evidence_button','Upload','submit'),
  epreview=_Hotel.element('div',{
    id:'evidence-preview',
  }),
  emain=_Hotel.element('div',{
    style:"position:relative;",
  },[
    ebutton,
    efile,
    epreview,
  ]);
  efile.dataset.key='evidence';
  efile.style.position='absolute';
  efile.style.left='0px';
  efile.style.opacity='0';
  efile.accept='image/*';
  efile.onchange=async function(e){
    let file=this.files[0],
    key=this.dataset.key,
    img=new Image,
    fr=new FileReader,
    data=new FormData,
    fname=(new Date).getTime()+'.jpg',
    tff=document.createElement('input'),
    tfv=document.getElementById('evidence-preview');
    tfv.innerHTML='';
    if(file.size>Math.pow(1024,2)){
      return _Hotel.alert('Error: Filesize is too large!','','error');
    }
    fr.onload=()=>{
      img.src=fr.result;
      tfv.append(img);
    };
    fr.readAsDataURL(file);
    tff.name=key;
    tff.type='hidden';
    tff.value=fname;
    tfv.append(tff);
    data.append('uid',_Hotel.user.id);
    data.append('token',_Hotel.user.token);
    data.append('path','finance/evidence/'+fname);
    data.append('query','hotel uload EVA.data(data)');
    data.append('file',file);
    ebutton.value='Uploading...';
    let loader=_Hotel.loader(),
    res=await _Hotel.eva.request(data),
    ress=_Hotel.decode(res);
    loader.remove();
    if(ress=='ok'){
      _Hotel.notif('upload:'+ress,'success');
      efile.remove();
      ebutton.remove();
    }else{
      _Hotel.notif('upload:'+ress,'error');
      ebutton.value='Upload';
      tfv.innerHTML='';
    }
  };
  row=table.row('Evidence',emain);
  /* note */
  row=table.row('Note',_Hotel.textarea('note','','Note...','100'));
  /*  */
  /* button */
  let save=_Hotel.button('Process','red','send',async function(){
    let yes=await _Hotel.confirmX('Process now?');
    if(!yes){return;}
    let fdata=_Hotel.formSerialize(),
    boxes=document.querySelectorAll('input[type="checkbox"]'),
    checked=[],
    queries=[];
    for(let i=0;i<boxes.length;i++){
      if(boxes[i].checked){
        checked.push({
          regid:boxes[i].dataset.regid,
          amount:boxes[i].value,
          guest_name:boxes[i].dataset.guest_name,
        });
        let innerQuery=_Hotel.buildQuery({
          coa_id:fdata.coa_id,
          name:'AR payment by '+fdata.name+' ('+boxes[i].dataset.guest_name+')',
          note:'Paid AR ('+fdata.market+')',
        });
        queries.push('update adjustment ('+innerQuery+') where regid='
          +boxes[i].dataset.regid);
      }
    }
    if(checked.length==0){
      return _Hotel.alert('Error: Select at least one!','','error');
    }
    queries.push('insert into paid_ar '+_Hotel.buildQuery({
      coa_id:fdata.coa_id,
      name:fdata.name,
      amount:fdata.total,
      deposit:fdata.deposit,
      market:fdata.market,
      date:fdata.payment_date,
      note:fdata.note,
      evidence:fdata.evidence,
      data:JSON.stringify(checked),
    }));
    let loader=_Hotel.loader(),
    res=await _Hotel.request('queries',queries.join(';'));
    loader.remove();
    this.section.innerHTML='';
    _HotelAccounting.paidAR();
  },{coa_id});
  save.section=section;
  row=table.row('',save);
};
/* table: paid_ar */
this.paidAR=async function(month,year){
  _Hotel.main.loader();
  year=year||(new Date).getFullYear();
  month=!isNaN(parseInt(month,10))?parseInt(month,10):(new Date).getMonth();
  let queries=[
    'select * from coa',
    'select * from paid_ar where date like %'+year+'-'
      +(month+1).toString().padStart(2,'0')+'% order by id desc',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  coa=data[0],
  par=data[1],
  table=_Hotel.table(),
  row,
  months=_Hotel.select('month',month,_Hotel.arrayToObject(this.months),function(){
    _HotelAccounting.paidAR(this.value,this.dataset.year);
  },{month,year}),
  years=_Hotel.select('year',year,_Hotel.getYears(),function(){
    _HotelAccounting.paidAR(this.dataset.month,this.value);
  },{month,year}),
  counter=0,
  title='Paid AR &#8213; '+this.months[month]+' '+year;
  /* put content */
  _Hotel.main.put(title,_Hotel.element('div',{},[
    months,
    years,
    table,
  ]));
  /* header */
  row=table.row(
    'No',
    'Date',
    'Name (Market)',
    'Account Target',
    'Amount',
    'Deposit',
    'Balance',
    'Note',
    'View',
  ).header();
  /* each */
  for(let p of par){
    counter++;
    let coaName=_Hotel.getValueById(p.coa_id,'name',coa),
    view=_Hotel.button('View','green','search',function(){
      _HotelAccounting.paidARView(this.dataset.id);
    },{id:p.id}),
    edit=_Hotel.button('Edit','blue','edit',function(){
      _HotelAccounting.paidAREdit(this.dataset.id);
    },{id:p.id}),
    amount=parseInt(p.amount,10),
    deposit=parseInt(p.deposit,10),
    balance=deposit-amount,
    row=table.row(
      counter,
      _Hotel.parseDate(p.date),
      p.name+' ('+p.market+')',
      coaName,
      _Hotel.parseNominal(p.amount),
      _Hotel.parseNominal(p.deposit),
      balance<0
        ?_Hotel.element('span',{
          style:'color:#b33;font-weight:bold;white-space:pre;',
        }).text(_Hotel.parseNominal(balance))
        :_Hotel.element('span',{
          style:'color:#7b3;font-weight:bold;',
        }).text('PAID'),
      p.note,
      _Hotel.element('div',{
        'class':'td-buttons',
      },[
        view,
        balance<0?edit:'',
      ]),
    );
    row.childNodes[0].classList.add('td-center');
    row.childNodes[4].classList.add('td-right');
    row.childNodes[5].classList.add('td-right');
    row.childNodes[6].classList.add(balance<0?'td-right':'td-center');
  }
};
/* paid_ar view */
this.paidARView=async function(id){
  let dialog=await _Hotel.dialogPage(),
  queries=[
    'select * from paid_ar where id='+id,
    'select * from coa',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  trans=data[0],
  coa=data[1],
  content=_Hotel.element('div');
  if(trans.length<1){
    dialog.put('Error: Failed to get data!');
    return;
  }
  let ar=trans[0],
  adata=_Hotel.parseJSON(ar.data),
  table=_Hotel.table(),
  passes=['id','time','data','market'],
  aliases={
    coa_id:'Recipient Account',
    name:'Name (Market)',
    note:'Note',
    amount:'Amount',
    date:'Payment Date',
    evidence:'Evidence',
  };
  table.head('PAID AR #'+id);
  content.append(table);
  /* each */
  for(let key in ar){
    let value=ar[key],
    val=value,
    alias=aliases.hasOwnProperty(key)?aliases[key]:key;
    if(passes.indexOf(key)>=0){
      continue;
    }else if(key=='date'){
      val=_Hotel.parseDate(value);
    }else if(key=='name'){
      val=value+' ('+ar.market+')';
    }else if(key=='evidence'){
      val=new Image;
      val.src=_Hotel.IMAGES['loader.gif'];
      let nimg=new Image;
      nimg.val=val;
      nimg.onerror=function(){
        this.val.src=_Hotel.IMAGES['icon-error.png'];
      };
      nimg.onload=function(){
        this.val.src=this.src;
      };
      /* ?query=hotelget.read/$1 */
      nimg.src=(_Hotel.production?_Hotel.hosts.eva:_Hotel.hosts.eva_dev)
        +'hotel/read/finance/evidence/'+value;
    }else if(key=='amount'){
      val=_Hotel.parseNominal(value);
    }
    row=table.row(alias,val);
    if(key=='amount'){
      row.childNodes[1].classList.add('td-right');
    }
  }
  /* table data */
  table=_Hotel.table();
  content.append(table);
  /* header */
  row=table.row(
    'RegID',
    'Guest Name',
    'Amount',
    '',
  ).header();
  /* each data */
  for(let d of adata){
    let view=_Hotel.button('View','green','search',function(){
      _Hotel.dialogView(2,this.dataset.regid);
    },{regid:d.regid}),
    row=table.row(
      d.regid,
      d.guest_name,
      _Hotel.parseNominal(d.amount),
      view,
    );
    row.childNodes[0].classList.add('td-center');
    row.childNodes[2].classList.add('td-right');
  }
  /* put into dialog */
  dialog.put(content);
/*
paid_ar
- id        aid()
- time      time()
- coa_id    int(10)
- amount    int(10,0)
- date      string(20)
- market    string(100)
- name      string(100)
- evidence  string(100)
- note      string(100)
- data      string(2048)
- deposit   int(10,0)
*/
};
/* paid_ar edit */
this.paidAREdit=async function(id){
  _Hotel.main.loader();
  let queries=[
    'select * from paid_ar where id='+id,
    'select * from coa where parent=8 or parent=3',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  paids=data[0],
  coa=data[1];
  if(paids.length==0){
    return _Hotel.alert('Error: Data is not found!','','error');
  }
  let paid=paids[0],
  table=_Hotel.table(),
  section=_Hotel.element('div',{
    'class':'section row-buttons',
  });
  /* put content */
  _Hotel.main.put('Edit Paid AR #'+id,_Hotel.main.double(table,section));
  table.classList.add('table-register');
  /* market */
  row=table.row('Market',paid.market);
  /* name */
  row=table.row('Name',_Hotel.input('name',paid.name,'text','Nama...'));
  /* coa_id -- receipant account */
  let coas={};
  for(let co of coa){
    coas[co.id]=co.name;
  }
  let srec=_Hotel.select('coa_id',paid.coa_id,coas);
  row=table.row('Recipient Account',srec);
  /* amount -- total */
  row=table.row('Total Amount',_Hotel.parseNominal(paid.amount));
  row.childNodes[1].classList.add('td-right');
  /* deposit */
  let depositSpan=_Hotel.element('span').text(_Hotel.parseNominal(paid.deposit)),
  depositInput=_Hotel.input('deposit',paid.deposit,'number');
  row=table.row('Deposit',depositInput);
  row=table.row('Deposit (IDR)',depositSpan);
  row.childNodes[1].classList.add('td-right');
  depositInput.span=depositSpan;
  depositInput.onkeyup=function(){
    this.span.innerText=_Hotel.parseNominal(this.value);
  };
  /* date -- transfer date */
  let tdate=_Hotel.dateSelection({
    id:'date-selection',
    key:'date',
    value:paid.date,
  });
  row=table.row('Payment Date',tdate);
  /* evidence -- upload */
  let efile=_Hotel.input('evidence_upload','','file'),
  ebutton=_Hotel.input('evidence_button','Upload','submit'),
  epreview=_Hotel.element('div',{
    id:'evidence-preview',
  },[
    /* review evidence */
    _Hotel.element('img',{
      alt:'Evidence Review',
      src:(_Hotel.production?_Hotel.hosts.eva:_Hotel.hosts.eva_dev)
        +'hotel/read/finance/evidence/'+paid.evidence,
    }),
    _Hotel.input('evidence',paid.evidence,'hidden'),
  ]),
  emain=_Hotel.element('div',{
    style:"position:relative;",
  },[
    ebutton,
    efile,
    epreview,
  ]);
  efile.dataset.key='evidence';
  efile.style.position='absolute';
  efile.style.left='0px';
  efile.style.opacity='0';
  efile.accept='image/*';
  efile.onchange=async function(e){
    let file=this.files[0],
    key=this.dataset.key,
    img=new Image,
    fr=new FileReader,
    data=new FormData,
    fname=(new Date).getTime()+'.jpg',
    tff=document.createElement('input'),
    tfv=document.getElementById('evidence-preview');
    tfv.innerHTML='';
    if(file.size>Math.pow(1024,2)){
      return _Hotel.alert('Error: Filesize is too large!','','error');
    }
    fr.onload=()=>{
      img.src=fr.result;
      tfv.append(img);
    };
    fr.readAsDataURL(file);
    tff.name=key;
    tff.type='hidden';
    tff.value=fname;
    tfv.append(tff);
    data.append('uid',_Hotel.user.id);
    data.append('token',_Hotel.user.token);
    data.append('path','finance/evidence/'+fname);
    data.append('query','hotel uload EVA.data(data)');
    data.append('file',file);
    ebutton.value='Uploading...';
    let loader=_Hotel.loader(),
    res=await _Hotel.eva.request(data),
    ress=_Hotel.decode(res);
    loader.remove();
    if(ress=='ok'){
      _Hotel.notif('upload:'+ress,'success');
      efile.remove();
      ebutton.remove();
    }else{
      _Hotel.notif('upload:'+ress,'error');
      ebutton.value='Upload';
      tfv.innerHTML='';
    }
  };
  row=table.row('Evidence',emain);
  /* note */
  row=table.row('Note',_Hotel.textarea('note',paid.note,'Note...','100'));
  /* button */
  let save=_Hotel.button('Save','blue','save',async function(){
    let yes=await _Hotel.confirmX('Save now?');
    if(!yes){return;}
    let fdata=_Hotel.formSerialize();
    delete fdata.evidence_button;
    delete fdata.evidence_upload;
    let innerQuery=_Hotel.buildQuery(fdata),
    queries=[
      'update paid_ar ('+innerQuery+') where id='+this.dataset.id,
    ],
    loader=_Hotel.loader(),
    res=await _Hotel.request('queries',queries.join(';'));
    loader.remove();
    _HotelAccounting.paidAR();
  },{id});
  section.append(save);
};



/* cash info */
this.cashInfo=async function(){
  _Hotel.main.loader();
  let coaIds=[4,5,6,7,9,10,11,12,13],
  whereMap='coa_id='+coaIds.join(' or coa_id='),
  queries=[
    'select * from coa',
    'select * from adjustment where '+whereMap,
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  coa=data[0],
  adjustments=data[1],
  table=_Hotel.table(),
  grandTotal=0,
  counter=0;
  _Hotel.main.put('Cash Info',table);
  table.row('No','Code','Account','Nominal').header();
  for(let coa_id of coaIds){
    counter++;
    let total=0,
    coaData=_Hotel.getDataById(coa_id,coa);
    ds=_Hotel.getDataByKey('coa_id',coa_id,adjustments,true);
    for(let d of ds){
      if(d.flow==1){
        total+=parseInt(d.amount,10);
      }else{
        total-=parseInt(d.amount,10);
      }
    }
    let row=table.row(counter,coaData.code,coaData.name,_Hotel.parseNominal(total));
    row.childNodes[0].classList.add('td-center');
    row.childNodes[1].classList.add('td-center');
    row.childNodes[3].classList.add('td-right');
    grandTotal+=total;
  }
  row=table.row('Total',_Hotel.parseNominal(grandTotal)).header();
  row.childNodes[0].classList.add('td-right');
  row.childNodes[1].classList.add('td-right');
  row.childNodes[0].setAttribute('colspan',3);
};

/* sales report */
this.salesReport=async function(tid=0,month,year,dlength){
  _Hotel.main.loader();
  year=year||(new Date).getFullYear();
  month=!isNaN(parseInt(month,10))?month:(new Date).getMonth();
  dlength=!isNaN(parseInt(dlength,10))?dlength:30;
  let tables=['payment','payment_resto'],
  titles=['Room','Restaurant'],
  tname=tables.hasOwnProperty(tid)?tables[tid]:null;
  if(tname==null){
    return _Hotel.alert('Error: Invalid table ID.','','error');
  }
  let kdate=Math.floor(year/4)==year?29:28,
  kmonth=[31,kdate,31,30,31,30,31,31,30,31,30,31],
  dateTime=Math.floor((new Date([
    year,
    (parseInt(month,10)+1).toString().padStart(2,'0'),
    (1).toString().padStart(2,'0'),
  ].join('-'))).getTime()/1000),
  dateTimeEnd=dateTime+(3600*24*(kmonth[month]+1)),
  queries=[
    'select * from '+tname+' where status=1 and time > '+dateTime+' and time < '+dateTimeEnd,
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  payments=data[0],
  table=_Hotel.table(),
  total=0,
  smonth=_Hotel.select('month',month,_Hotel.arrayToObject(this.months),function(){
    _HotelAccounting.salesReport(this.dataset.tid,this.value,this.dataset.year);
  },{tid,year}),
  syear=_Hotel.select('year',year,_Hotel.getYears(),function(){
    _HotelAccounting.salesReport(this.dataset.tid,this.dataset.month,this.value);
  },{tid,month}),
  pbutton=_Hotel.button('Print','orange','print',function(){
    window.print();
  });
  /* put content */
  _Hotel.main.put(
    titles[tid]+' Sales Report &#8213; '+this.months[month]+' '+year,
    _Hotel.element('div',{},[
      smonth,
      syear,
      pbutton,
      table,
    ])
  );
  /* header */
  let row=table.row(
    'RegID',
    'Date',
    'Bearer',
    'Nominal',
    'Method',
  ).header();
  /* each */
  for(let d of payments){
    let nd=new Date(d.time*1000),
    date=[
      nd.getFullYear(),
      (nd.getMonth()+1).toString().padStart(2,'0'),
      nd.getDate().toString().padStart(2,'0'),
    ].join('-'),
    pmethod=this.paymentMethods.hasOwnProperty(d.method)?this.paymentMethods[d.method]:d.method,
    row=table.row(
      d.regid,
      date,
      d.bearer,
      _Hotel.parseNominal(d.nominal),
      pmethod,
    );
    row.childNodes[0].classList.add('td-center');
    row.childNodes[3].classList.add('td-right');
    total+=parseInt(d.nominal,10);
  }
  /* total */
  row=table.row(
    'Total',
    _Hotel.parseNominal(total),
    '',
  ).header();
  row.childNodes[0].setAttribute('colspan',3);
  row.childNodes[0].classList.add('td-right');
  row.childNodes[1].classList.add('td-right');
};

/* room sales report */
this.salesReportRoom=async function(date='all',month,year,type='all'){
  _Hotel.main.loader();
  year=year||(new Date).getFullYear();
  month=!isNaN(parseInt(month,10))?month:(new Date).getMonth();
  date=date||(new Date).getDate();
  let types=['Executive','Deluxe','Superior'];
  type=types.indexOf(type)>=0?type:'all';
  let kdate=Math.floor(year/4)==year?29:28,
  kmonth=[31,kdate,31,30,31,30,31,31,30,31,30,31],
  dateTime=Math.floor((new Date([
    year,
    (parseInt(month,10)+1).toString().padStart(2,'0'),
    (1).toString().padStart(2,'0'),
  ].join('-'))).getTime()/1000),
  dateTimeEnd=dateTime+(3600*24*(kmonth[month]+1)),
  date_arrival=[
    year,
    (parseInt(month,10)+1).toString().padStart(2,'0'),
    date.toString().padStart(2,'0'),
  ].join('-'),
  firstQuery='select * from registration where type="registration" and time > '
    +dateTime+' and time < '+dateTimeEnd,
  secondQuery='select * from registration where type="registration" and date_arrival="'+date_arrival+'"',
  queries=[
    firstQuery,
    'select * from room',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  rooms=data[1],
  regs=data[0],
  table=_Hotel.table(),
  dateSelection=_Hotel.dateSelection({
    /**
     * config:
     *   - id    = string of element id
     *   - key   = string of input key 
     *   - value = default value
     *   - min   = minimum date; default: 1960-01-01
     *   - max   = maximum date; default: 2038-12-31
     * return: object of element with property of element: span and input
     */
    id:'date-selection',
    key:'date_selection',
    value:[
      year,
      (parseInt(month,10)+1).toString().padStart(2,'0'),
      (date).toString().padStart(2,'0'),
    ].join('-'),
  }),
  title='Room Sales Report &#8213; '+this.months[month]+' '+year;
  /* put content */
  _Hotel.main.put(title,_Hotel.element('div',{},[
    _Hotel.select('month',month,_Hotel.arrayToObject(this.months),function(){
      _HotelAccounting.salesReportRoom(
        this.dataset.date,
        this.value,
        this.dataset.year,
        this.dataset.type,
      );
    },{type,year,month,date}),
    _Hotel.select('year',year,_Hotel.getYears(),function(){
      _HotelAccounting.salesReportRoom(
        this.dataset.date,
        this.dataset.month,
        this.value,
        this.dataset.type,
      );
    },{type,year,month,date}),
    _Hotel.button('Print','orange','print',function(){
      window.print();
    }),
    _Hotel.element('div',{},[
      
    ]),
    table,
  ]));
  /* grouping */
  let roomTypes={
    Executive:[],
    Deluxe:[],
    Superior:[],
  };
  for(let reg of regs){
    let room=_Hotel.getDataByKey('number',reg.room_number,rooms);
    if(roomTypes.hasOwnProperty(room.name)){
      roomTypes[room.name].push(reg);
    }
  }
  /* each */
  for(let name in roomTypes){
    row=table.row(name+' ('+roomTypes[name].length+')').header();
    row.childNodes[0].classList.add('td-left');
    row.childNodes[0].setAttribute('colspan',9);
    row=table.row(
      'RegID',
      'Guest Name',
      'Room',
      'Nights',
      'Departure',
      'Amount',
      'Deposit',
      'Discount',
      'Balance',
    ).header();
    let totalAmount=0,
    totalDeposit=0,
    totalDiscount=0;
    for(let reg of roomTypes[name]){
      let amount=parseInt(reg.payment_amount,10),
      discount=parseInt(reg.payment_discount,10),
      deposit=parseInt(reg.payment_deposit,10),
      balance=deposit-(amount-discount);
      row=table.row(
        reg.regid,
        reg.guest_name,
        reg.room_number,
        reg.nights+' night'+(reg.nights>1?'s':''),
        reg.date_departure,
        _Hotel.parseNominal(reg.payment_amount),
        _Hotel.parseNominal(reg.payment_deposit),
        _Hotel.parseNominal(reg.payment_discount),
        _Hotel.parseNominal(balance),
      );
      row.childNodes[0].classList.add('td-center');
      row.childNodes[2].classList.add('td-center');
      row.childNodes[3].classList.add('td-center');
      row.childNodes[5].classList.add('td-right');
      row.childNodes[6].classList.add('td-right');
      row.childNodes[7].classList.add('td-right');
      row.childNodes[8].classList.add('td-right');
      totalAmount+=amount;
      totalDeposit+=deposit;
      totalDiscount+=discount;
    }
    /* total */
    row=table.row(
      'Total',
      _Hotel.parseNominal(totalAmount),
      _Hotel.parseNominal(totalDeposit),
      _Hotel.parseNominal(totalDiscount),
      _Hotel.parseNominal(totalDeposit-(totalAmount-totalDiscount)),
    ).header();
    row.childNodes[0].setAttribute('colspan',5);
    row.childNodes[0].classList.add('td-right');
    row.childNodes[1].classList.add('td-right');
    row.childNodes[2].classList.add('td-right');
    row.childNodes[3].classList.add('td-right');
    row.childNodes[4].classList.add('td-right');

    /* separator */
    row=table.row('.');
    row.childNodes[0].setAttribute('colspan',9);
  }
};


/* table: asset */
this.assets=async function(){
  _Hotel.main.loader();
  let queries=[
    'select * from asset',
    'select * from coa',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  assets=data[0],
  coa=data[1],
  table=_Hotel.table(),
  add=_Hotel.button('Add','green','plus',function(){
    _HotelAccounting.assetEdit();
  }),
  row=table.row(
    'ID',
    _Hotel.alias('asset_name'),
    _Hotel.alias('asset_nominal'),
    _Hotel.alias('asset_coa_id'),
    _Hotel.alias('asset_year'),
    _Hotel.alias('asset_note'),
    add,
  ).header();
  this.coa=coa;
  /* main put */
  _Hotel.main.put('Assets',table);
  /* each asset */
  for(let asset of assets){
    let edit=_Hotel.button('Edit','blue','edit',function(){
      _HotelAccounting.assetEdit(this.dataset.id);
    },{
      id:asset.id,
    }), 
    row=table.row(
      asset.id,
      asset.name,
      _Hotel.parseNominal(asset.nominal),
      _Hotel.getValueById(asset.coa_id,'name',coa),
      asset.year,
      asset.note,
      edit,
    );
    row.childNodes[0].classList.add('td-center');
    row.childNodes[2].classList.add('td-right');
    row.childNodes[4].classList.add('td-center');
  }
};
/* asset edit/add */
this.assetEdit=async function(id=0){
  _Hotel.main.loader();
  let asset={
    id:0,
    coa_id:0,
    nominal:0,
    name:'',
    note:'',
  },
  coa=_Hotel.getDataByKey('parent',35,this.coa,true),
  table=_Hotel.table(),
  del=_Hotel.button('Delete','red','trash',async function(){
    let yes=await _Hotel.confirmX('Delete this asset?');
    if(!yes){return;}
    let loader=_Hotel.loader(),
    query='delete from asset where id='+this.dataset.id,
    res=await _Hotel.request('query',query);
    loader.remove();
    _HotelAccounting.assets();
  },{id}),
  save=_Hotel.button('Save','blue','save',async function(){
    let data=_Hotel.formSerialize(),
    innerQuery=_Hotel.buildQuery(data),
    loader=_Hotel.loader(),
    query=this.dataset.id==0
      ?'insert into asset '+innerQuery
      :'update asset ('+innerQuery+') where id='+this.dataset.id,
    res=await _Hotel.request('query',query);
    loader.remove();
    return _HotelAccounting.assets();
  },{id});
  if(id!=0){
    query='select * from asset where id='+id,
    data=await _Hotel.request('query',query);
    asset=data.length>0?data[0]:asset;
  }
  /* main put */
  table.classList.add('table-register');
  _Hotel.main.put(
    (id==0?'Add':'Edit')+' Asset '+(id!=0?'#'+id:''),
    _Hotel.main.double(
      table,
      _Hotel.element('div',{
        'class':'section row-buttons',
      },[save]),
    ),
  );
  /* set coa fixed assets */
  let coas={};
  for(let co of coa){
    coas[co.id]=co.name;
  }
  /* each */
  for(let key in asset){
    let value=asset[key],
    val=_Hotel.input(key,value,'text',_Hotel.alias('asset_'+key),100);
    if(key=='id'||key=='time'){
      continue;
    }else if(key=='nominal'||key=='year'){
      val.type='number';
    }else if(key=='coa_id'){
      val=_Hotel.select(key,value,coas);
    }
    let row=table.row(_Hotel.alias('asset_'+key),val);
  }
};




/* transactions */
this.transactions=async function(date,month,year){
  _Hotel.main.loader();
  let defDate=_Hotel.production?(new Date).getDate():'all';
  year=year||(new Date).getFullYear();
  month=!isNaN(parseInt(month,10))?month:(new Date).getMonth();
  date=date||defDate;
  let table=_Hotel.table(),
  row,
  counter=0,
  totalPlus=0,
  totalMinus=0,
  totalDeposit=0,
  totalBalance=0,
  allMonths=[...this.months,...['Annually']],
  oMonths=_Hotel.arrayToObject(allMonths),
  kdate=Math.floor(year/4)==year?29:28,
  mdates=[31,kdate,31,30,31,30,31,31,30,31,30,31],
  dates=_Hotel.select('date',date,[
    'all',
    ..._Hotel.range(1,mdates[month]),
  ],function(){
    _HotelAccounting.transactions(this.value,parseInt(this.dataset.month),this.dataset.year);
  },{year,month}),
  months=_Hotel.select('month',month,oMonths,function(){
    _HotelAccounting.transactions(this.dataset.date,parseInt(this.value),this.dataset.year);
  },{year,date}),
  years=_Hotel.select('year',year,this.getyears(),function(){
    _HotelAccounting.transactions(this.dataset.date,parseInt(this.dataset.month),this.value);
  },{month,date}),
  queries=[
    month<12
      ?date=='all'
        ?'select * from transaction where month='+month+' and year='+year+' order by id desc'
        :'select * from transaction where date='+date+' and month='+month
          +' and year='+year+' order by id desc'
      :'select * from transaction where year='+year+' order by id desc',
    'select id,username from user',
    'select * from coa',
    month<12
      ?date=='all'
        ?'select * from adjustment where month='+month+' and year='+year+' order by id desc'
        :'select * from adjustment where date='+date+' and month='+month
          +' and year='+year+' order by id desc'
      :'select * from adjustment where year='+year+' order by id desc',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  trans=data[0],
  users=data[1],
  coa=data[2],
  adjustments=data[3];
  _Hotel.main.put(
    'Transactions &#8213; '+allMonths[month]+' '+year,
    _Hotel.element('div',{},[
      dates,
      months,
      years,
      table,
    ])
  );

  row=table.row(
    'RegID',
    _Hotel.alias('transaction_type'),
    _Hotel.alias('transaction_credit'),
    _Hotel.alias('transaction_debt'),
    _Hotel.alias('transaction_deposit'),
    _Hotel.alias('transaction_balance'),
    'Officer',
    _Hotel.alias('transaction_date'),
    'Status',
    '',
  ).header();
  row=table.row(
    _Hotel.findRow('regid',this.searchKeyUpState),
    _Hotel.findRow('type',this.searchKeyUpState),
    _Hotel.findRow('credit',this.searchKeyUpState),
    _Hotel.findRow('debt',this.searchKeyUpState),
    _Hotel.findRow('deposit',this.searchKeyUpState),
    _Hotel.findRow('balance',this.searchKeyUpState),
    _Hotel.findRow('uname',this.searchKeyUpState),
    _Hotel.findRow('date',this.searchKeyUpState),
    _Hotel.findRow('status',this.searchKeyUpState),
    '',
  );
  row.childNodes[0].style.maxWidth='90px';
  let qs={};
  for(let tran of trans){
    counter++;
    let date=_Hotel.parseDatetime(tran.time*1000),
    uname=_Hotel.getValueById(tran.uid,'username',users),
    deposit=_Hotel.parseNominal(tran.deposit),
    type=this.tTypes.hasOwnProperty(tran.type)?this.tTypes[tran.type]:'',
    balance_real=parseInt(tran.deposit,10)-parseInt(tran.amount,10),
    balance=_Hotel.parseNominal(balance_real),
    balance_span=_Hotel.element('span',{
      'class':balance_real>=0?'balance-plus':'balance-minus',
    }).text(balance),
    credit=_Hotel.parseNominal(tran.flow==1?tran.amount:0),
    debt=_Hotel.parseNominal(tran.flow==1?0:tran.amount),
    loader=_Hotel.element('img',{
      alt:'',
      src:_Hotel.IMAGES['loader.gif'],
      'data-id':tran.id,
    }),
    bclose=_Hotel.button('Close','red','lock',async function(){
      let yes=await _Hotel.confirmX('Close this transaction?');
      if(!yes){return;}
      let loader=_Hotel.loader(),
      pr=document.getElementById('status-'+this.dataset.id),
      row=document.getElementById('row-'+this.dataset.id),
      query='update transaction (status=1) where id='+this.dataset.id,
      tspan=_Hotel.element('span',{
        'class':'balance-minus',
      }).text('Close');
      res=await _Hotel.request('query',query);
      loader.remove();
      if(pr){
        pr.innerText='';
        pr.append(tspan);
      }
      if(row){
        row.dataset.status='Close';
      }
      this.remove();
    },{
      id:tran.id,
    }),
    view=_Hotel.button('View','green','search',async function(){
      _Hotel.dialogView(this.dataset.type,this.dataset.regid);
    },{
      regid:tran.regid,
      type:tran.type,
    });
    if(tran.type==9){
      let adjDatas=_Hotel.getDataByKey('regid',tran.regid,adjustments,true),
      adjData=_Hotel.getDataByKey('flow',tran.flow,adjDatas);
      if(adjData){
        let coaData=_Hotel.getDataById(adjData.coa_id,coa);
        if(coaData){
          type=adjData.name+' ('+coaData.name+')';
        }
      }
    }
    row=table.row(
      tran.regid,
      type,
      credit,
      debt,
      deposit,
      balance_span,
      uname,
      date,
      loader,
      _Hotel.element('div',{
        'class':'td-buttons',
      },[
        view,
        tran.status==0?'':'',
      ]),
    );
    if(tran.flow==1){
      totalPlus+=parseInt(tran.amount,10);
    }else{
      totalMinus+=parseInt(tran.amount,10);
    }
    totalBalance+=balance_real;
    totalDeposit+=parseInt(tran.deposit,10);
    row.dataset.id=tran.id;
    row.dataset.regid=tran.regid;
    row.dataset.type=type;
    row.dataset.typeCode=tran.type;
    row.dataset.credit=credit;
    row.dataset.debt=debt;
    row.dataset.deposit=deposit;
    row.dataset.balance=balance;
    row.dataset.uname=uname;
    row.dataset.date=date;
    row.childNodes[0].classList.add('td-center');
    row.childNodes[2].classList.add('td-right');
    row.childNodes[3].classList.add('td-right');
    row.childNodes[4].classList.add('td-right');
    row.childNodes[5].classList.add('td-right');
    row.childNodes[8].classList.add('td-center');
    row.id='row-'+tran.id;
    /* set fake loader */
    setTimeout(async ()=>{
      let pr=loader.parentNode,
      row=pr.parentNode,
      ts=this.tStatuses[tran.status],
      tspan=_Hotel.element('span',{
        'class':tran.status==1?'balance-minus':'balance-plus',
      }).text(ts);
      pr.innerText='';
      pr.append(tspan);
      pr.id='status-'+tran.id;
      row.dataset.status=ts;
    },counter*10);
    /* set payment data query */
    if([5,8].indexOf(tran.type)>=0){
      let table_name=_Hotel.transactionTypes[tran.type],
      query='select * from '+table_name+' where regid='+tran.regid;
      qs[tran.id]=query;
    }
  }
  row=table.row(
    'Total',
    _Hotel.element('span',{id:'total-credit'}).text(_Hotel.parseNominal(totalPlus)),
    _Hotel.element('span',{id:'total-debt'}).text(_Hotel.parseNominal(totalMinus)),
    '', /* _Hotel.element('span',{id:'total-deposit'}).text(_Hotel.parseNominal(totalDeposit)), */
    _Hotel.element('span',{id:'total-balance'}).text(_Hotel.parseNominal(totalPlus-totalMinus)),
    '','','','',
  ).header();
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[0].classList.add('td-center');
  row.childNodes[1].classList.add('td-right');
  row.childNodes[2].classList.add('td-right');
  row.childNodes[3].classList.add('td-right');
  row.childNodes[4].classList.add('td-right');
  /* get each payment detail */
  let qss=[],qsv=[];
  for(let qk in qs){
    qss.push(qs[qk]);
    qsv.push(qk);
  }
  if(qss.length>0){
    let rdata=await _Hotel.request('queries',qss.join(';'));
    for(let i in rdata){
      let res=rdata[i],
      row=document.getElementById('row-'+qsv[i]),
      pdata=Array.isArray(res)
        &&res.length>0
        &&res[0].hasOwnProperty('data')
        ?_Hotel.parseJSON(res[0].data)||[]:[],
      aregid=_HotelAccounting.arrayRegID(pdata);
      if(aregid.length>1&&row){
        row.dataset.data=JSON.stringify(aregid);
      }
    }
  }
};


/* chart of account */
this.chartOfAccount=async function(){
  _Hotel.main.loader();
  let table=_Hotel.table(),
  queries=[
    'select * from coa',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  coa=data[0],
  add=_Hotel.button('Add','green','plus',function(){
    _HotelAccounting.chartOfAccountEdit();
  }),
  tr=table.row(
    'ID',
    _Hotel.alias('coa_code'),
    _Hotel.alias('coa_name'),
    _Hotel.alias('coa_variable'),
    'PID',
    add,
  ).header();
  _Hotel.main.put('Chart of Account',table);
  this.coa=coa;
  tr=table.row(
    _Hotel.findRow('id'),
    _Hotel.findRow('code'),
    _Hotel.findRow('name'),
    _Hotel.findRow('variable'),
    _Hotel.findRow('parent'),
    '',
  );
  tr.childNodes[0].style.maxWidth='80px';
  tr.childNodes[1].style.maxWidth='110px';
  tr.childNodes[4].style.maxWidth='80px';
  for(let row of coa){
    let edit=_Hotel.button('Edit','blue','edit',function(){
      _HotelAccounting.chartOfAccountEdit(this.dataset.id);
    },{
      id:row.id,
    });
    tr=table.row(
      row.id,
      row.code,
      row.name,
      row.variable,
      row.parent,
      edit,
    );
    tr.dataset.id=row.id;
    tr.dataset.code=row.code;
    tr.dataset.name=row.name;
    tr.dataset.variable=row.variable;
    tr.dataset.parent=row.parent;
    tr.childNodes[0].classList.add('td-center');
    tr.childNodes[1].classList.add('td-center');
    tr.childNodes[4].classList.add('td-center');
  }
};
this.chartOfAccountEdit=async function(id=0){
  _Hotel.main.loader();
  let temp={
    id:id,
    code:0,
    parent:0,
    name:'',
    type:'',
    variable:'',
  },
  data=_Hotel.getDataById(id,this.coa)||temp,
  save=_Hotel.button('Save','blue','save',async function(){
    let fdata=_Hotel.formSerialize();
    fdata.type=fdata.variable;
    let loader=_Hotel.loader(),
    innerQuery=_Hotel.buildQuery(fdata),
    query=this.dataset.id==0
      ?'insert into coa '+innerQuery
      :'update coa ('+innerQuery+') where id='+this.dataset.id,
    res=await _Hotel.request('query',query);
    loader.remove();
    if(res!=1){
      return _Hotel.alert('Error: Failed to save COA!',res,'error');
    }
    _HotelAccounting.chartOfAccount();
  },{
    id:data.id,
  }),
  del=_Hotel.button('Delete','red','trash',async function(){
    let yes=await _Hotel.confirmX('Delete this COA?');
    if(!yes){return;}
    let loader=_Hotel.loader(),
    query='delete from coa where id='+this.dataset.id,
    res=await _Hotel.request('query',query);
    loader.remove();
    if(res!=1){
      return _Hotel.alert('Error: Failed to delete COA!',res,'error');
    }
    _HotelAccounting.chartOfAccount();
  },{
    id:data.id,
  }),
  section=_Hotel.element('div',{
    'class':'section row-buttons',
  },[save,data.id==0?'':del]),
  table=_Hotel.table(),
  double=_Hotel.main.double(table,section),
  parentName=this.getCoaName(data.parent),
  coaCategory=_Hotel.findSelect({
    id:'coa-category',
    key:'parent',
    value:data.parent,
    data:this.coa,
    placeholder:_Hotel.alias('coa_category'),
  }),
  variables=this.getCoaVariables(),
  coaVariable=_Hotel.findSelect({
    id:'coa-variable',
    key:'variable',
    value:data.variable,
    data:variables,
    placeholder:_Hotel.alias('coa_variable'),
    callback:function(res){
      res.main.slave.result.value=res.name;
    }
  }),
  title=(data.id!=0?'Edit':'Add')+' Chart of Account'+(data.id!=0?' #'+data.id:'');
  table.classList.add('table-register');
  _Hotel.main.put(title,double);
  coaCategory.slave.input.value=parentName;
  coaVariable.slave.input.value=data.variable;
  table.row(
    _Hotel.alias('coa_category'),
    coaCategory
  );
  table.row(
    _Hotel.alias('coa_code'),
    _Hotel.input('code',data.code,'number',_Hotel.alias('coa_code'),10)
  );
  table.row(
    _Hotel.alias('coa_name'),
    _Hotel.input('name',data.name,'text',_Hotel.alias('coa_name'),100)
  );
  table.row(
    _Hotel.alias('coa_variable'),
    coaVariable
  );
  table.style.paddingBottom='200px';
/*
            0: (aid) [id:10] => LDB_AID
            1: (time) [time:10] => LDB_TIME
            2: (int) [code:10] => LDB_BLANK
            3: (int) [parent:10] => LDB_BLANK
            4: (string) [name:50] => LDB_BLANK
            5: (string) [type:50] => LDB_BLANK
            6: (string) [variable:50] => LDB_BLANK
*/
};



/* search keyup state */
this.searchKeyUpState=function(res){
  let totalCredit=0,
  totalDebt=0,
  totalDeposit=0,
  elCredit=document.getElementById('total-credit'),
  elDebt=document.getElementById('total-debt'),
  elDeposit=document.getElementById('total-deposit'),
  elBalance=document.getElementById('total-balance');
  if(res.show.length==1&&res.show[0].dataset.hasOwnProperty('data')){
    let aregid=_Hotel.parseJSON(res.show[0].dataset.data)||[];
    if(aregid.length>1){
      for(let eh of res.hide){
        if(aregid.indexOf(eh.dataset.regid)>=0){
          res.show.push(eh);
          eh.style.removeProperty('display');
        }
      }
    }
  }
  for(let el of res.show){
    let credit=parseInt(el.dataset.credit.replace(/[^\d]/g,''),10),
    debt=parseInt(el.dataset.debt.replace(/[^\d]/g,''),10),
    deposit=parseInt(el.dataset.deposit.replace(/[^\d]/g,''),10);
    totalCredit+=credit;
    totalDebt+=debt;
    totalDeposit+=deposit;
  }
  if(elCredit){
    elCredit.innerText=_Hotel.parseNominal(totalCredit);
  }
  if(elDebt){
    elDebt.innerText=_Hotel.parseNominal(totalDebt);
  }
  if(elDeposit){
    elDeposit.innerText=_Hotel.parseNominal(totalDeposit);
  }
  if(elBalance){
    let balance=totalDeposit-(totalCredit+totalDebt);
    elBalance.innerText=_Hotel.parseNominal(totalCredit-totalDebt);
  }
};
/* get years object for selector -- recommended use: _Hotel.getYears() */
this.getyears=function(start=2024,length=10){
  let res={};
  for(let i=0;i<length;i++){
    let v=start+i;
    res[v]=v;
  }return res;
};
/* get coa variables array {id,name of variable}*/
this.getCoaVariables=function(){
  let res=[],
  stored=[],
  coa=this.coa;
  for(let c of coa){
    if(stored.indexOf(c.variable)>=0){
      continue;
    }
    res.push({
      id:c.id,
      name:c.variable,
    });
    stored.push(c.variable);
  }
  return res;
};
/* get coa name from this.coa array */
this.getCoaName=function(id){
  return _Hotel.getValueById(parseInt(id),'name',this.coa);
};

/* array regid */
this.arrayRegID=function(data=[]){
  let res=[];
  for(let d of data){
    if(d.hasOwnProperty('regid')
      &&!res.indexOf(d.regid)>=0){
      res.push(d.regid);
    }
  }return res;
};
/* return the initialization */
return this.init();
};



/* HotelPurchasing */
;function HotelPurchasing(){
/* bring to global variable */
window._HotelPurchasing=this;
this.coa=[];
this.groups=[
  'Lancar',
  'Tetap',
];
/* unit */
this.unit=[
  '1/2 Lusin',
  'Batang',
  'Biji',
  'Bill',
  'Botol',
  'Box',
  'Buah',
  'Buku',
  'Bungkus',
  'Dus',
  'Ekor',
  'Galon',
  'Gelas',
  'Gram',
  'Ikat',
  'Jerigen',
  'Kaleng',
  'Karung',
  'Keping',
  'Kg',
  'Kotak',
  'Lembar',
  'Liter',
  'Lusin',
  'Meter',
  'Ons',
  'Pack',
  'Pasang',
  'Pcs',
  'Porsi',
  'Potong',
  'Refill',
  'Renceng',
  'Rim',
  'Roll',
  'Sachet',
  'Sak',
  'Set',
  'Sisir',
  'Sisir',
  'Tabung',
  'Unit',
];
/* request order statuses */
this.statuses={
  0:'Draft',
  1:'Pending',
  2:'Done',
  3:'Approved',
};
/* item categories */
this.itemCategories=[
  'Unknown',
  'Land (Asset)',
  'Building (Asset)',
  'Equipment (Asset)',
  'Electronic (Asset)',
  'Vehicle (Asset)',
  'Furniture (Asset)',
  'Perishable',
  'Printing Material',
  'Supplies',
  'Drugstore',
  'Groceries',
  'Chemical',
  'Linen',
  'Glass ware, China ware, Silver ware',
  'Electrical Tools, Equipment and Supply',
];
/* suppliers list */
this.suppliersList=[];
/* init as constructor */
this.init=function(){
  return this;
};
this.menus=function(){
  return [
    {
      name:'Warehouse Stock',
      icon:'table',
      callback:function(){
        _HotelPurchasing.opnameStock();
      },
    },
    {
      name:'Cost Journal',
      icon:'wpforms',
      callback:function(){
        _HotelPurchasing.journalForm();
      },
    },
    {
      name:'Request Orders',
      icon:'wpforms',
      callback:function(){
        _HotelPurchasing.requestOrders();
      },
    },
    {
      name:'Purchase Orders',
      icon:'wpforms',
      callback:function(){
        _Hotel.requestOrders();
      },
    },
    {
      name:'Items',
      icon:'list-ul',
      callback:function(){
        _HotelPurchasing.items();
      },
    },
    {
      name:'Suppliers',
      icon:'handshake-o',
      callback:function(){
        _HotelPurchasing.suppliers();
      },
    },
  ];
};
this.dashboard=async function(){
  return await this.opnameStock();
};

/* journal form -- cost journal */
this.journalForm=async function(){
  _Hotel.main.loader();
  let itemID=1000001,
  newRegID=await _Hotel.newRegID(9),
  queries=[
    'select * from coa',
    'select * from adjustment where status=0 and item_id='+itemID,
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  coa=data[0],
  adjustments=data[1],
  tableForm=_Hotel.table(),
  tableMain=_Hotel.table(),
  tableTotal=_Hotel.table(),
  sectionForm=_Hotel.element('div',{'class':'section row-buttons'}),
  sectionMain=_Hotel.element('div',{'class':'section row-buttons'}),
  sectionTotal=_Hotel.element('div',{'class':'section row-buttons'}),
  main=_Hotel.element('div',{});
  /* put content */
  main.append(tableForm);
  main.append(sectionForm);
  main.append(tableMain);
  main.append(sectionMain);
  main.append(tableTotal);
  main.append(sectionTotal);
  _Hotel.main.put('Cost Journal',main);
  /* coa object */
  let coaObject=[];
  for(let c of coa){
    coaObject.push({
      id:c.id,
      name:c.code+' - '+c.name,
    });
  }
  /* table form */
  let regidSpan=_Hotel.element('div',{},[
    _Hotel.element('span').text(newRegID.regid),
    _Hotel.input('regid',newRegID.regid,'hidden'),
    _Hotel.input('item_id',itemID,'hidden'),
  ]),
  dateInput=_Hotel.dateSelection({
    key:'date',
    value:[
      (new Date).getFullYear(),
      ((new Date).getMonth()+1).toString().padStart(2,'0'),
      (new Date).getDate().toString().padStart(2,'0'),
    ].join('-'),
  }),
  row=tableForm.row('RegID (Reference No)',regidSpan);
  row.childNodes[1].setAttribute('colspan',2);
  row=tableForm.row('Date',dateInput);
  row.childNodes[1].setAttribute('colspan',2);
  row=tableForm.row('Description',_Hotel.textarea('name','','Description...',100));
  row.childNodes[1].setAttribute('colspan',2);
  row=tableForm.row('Account Credit',_Hotel.findSelect({
    id:'coa_credit',
    key:'coa_credit',
    value:0,
    data:coaObject,
  }),_Hotel.input('credit_nominal',0,'number'));
  row=tableForm.row('Account Debt',_Hotel.findSelect({
    id:'coa_debt',
    key:'coa_debt',
    value:0,
    data:coaObject,
  }),_Hotel.input('debt_nominal',0,'number'));
  let post=_Hotel.button('Post','blue','send',async function(){
    let yes=await _Hotel.confirmX('Post this journal?');
    if(!yes){return;}
    let fdata=_Hotel.formSerialize(),
    ndate=new Date(fdata.date),
    ntime=Math.floor(ndate.getTime()/1000),
    data={
      credit:{
        time:ntime,
        year:ndate.getFullYear(),
        month:ndate.getMonth(),
        date:ndate.getDate(),
        flow:1,
        item_id:fdata.item_id,
        name:fdata.name,
        regid:fdata.regid,
        amount:fdata.credit_nominal,
        deposit:fdata.credit_nominal,
        coa_id:fdata.coa_credit,
        status:0,
      },
      debt:{
        time:ntime,
        year:ndate.getFullYear(),
        month:ndate.getMonth(),
        date:ndate.getDate(),
        flow:0,
        item_id:fdata.item_id,
        name:fdata.name,
        regid:fdata.regid,
        amount:fdata.debt_nominal,
        deposit:fdata.debt_nominal,
        coa_id:fdata.coa_debt,
        status:0,
      },
      creditTransaction:{
        uid:_Hotel.user.id,
        time:ntime,
        year:ndate.getFullYear(),
        month:ndate.getMonth(),
        date:ndate.getDate(),
        flow:1,
        regid:fdata.regid,
        amount:fdata.credit_nominal,
        deposit:fdata.credit_nominal,
        status:0,
        type:9,
      },
      debtTransaction:{
        uid:_Hotel.user.id,
        time:ntime,
        year:ndate.getFullYear(),
        month:ndate.getMonth(),
        date:ndate.getDate(),
        flow:0,
        regid:fdata.regid,
        amount:fdata.debt_nominal,
        deposit:fdata.debt_nominal,
        status:0,
        type:9,
      },
    },
    queries=[
      'insert into adjustment '+_Hotel.buildQuery(data.credit),
      'insert into adjustment '+_Hotel.buildQuery(data.debt),
      'insert into transaction '+_Hotel.buildQuery(data.creditTransaction),
      'insert into transaction '+_Hotel.buildQuery(data.debtTransaction),
    ].join(';'),
    loader=_Hotel.loader(),
    res=await _Hotel.request('queries',queries);
    loader.remove();
    return _HotelPurchasing.journalForm();
  });
  sectionForm.append(post);
  /* table main -- posted */
  let reset=_Hotel.button('Reset','red','refresh',async function(){
    let yes=await _Hotel.confirmX('Reset posted journals?');
    if(!yes){return;}
    let queries=[
      'delete from adjustment where item_id='+this.dataset.itemID,
    ],
    rows=document.querySelectorAll('tr[data-regid]');
    for(let i=0;i<rows.length;i++){
      queries.push('delete from transaction where regid='+rows[i].dataset.regid);
    }
    let loader=_Hotel.loader(),
    res=await _Hotel.request('queries',queries.join(';'));
    loader.remove();
    return _HotelPurchasing.journalForm();
  },{
    itemID,
  });
  /* posted header */
  row=tableMain.row(
    'No',
    'RegID',
    'Date',
    'Account',
    'Description',
    'Credit',
    'Debt',
    reset,
  ).header();
  /* each of posted */
  let counter=0,
  totalCredit=0,
  totalDebt=0;
  for(let adj of adjustments){
    counter++;
    let adate=[
      adj.year,
      (parseInt(adj.month,10)+1).toString().padStart(2,'0'),
      (parseInt(adj.date,10)+0).toString().padStart(2,'0'),
    ].join('-'),
    pdate=_Hotel.parseDate(adate),
    coaName=_Hotel.getValueById(adj.coa_id,'name',coa),
    credit=_Hotel.parseNominal(adj.flow==1?adj.amount:0),
    debt=_Hotel.parseNominal(adj.flow==0?adj.amount:0),
    del=_Hotel.button('Delete','red','trash',async function(){
      let yes=await _Hotel.confirmX('Delete this post?');
      if(!yes){return;}
      let loader=_Hotel.loader(),
      queries=[
        'delete from adjustment where id='+this.dataset.id,
        'delete from transaction where coa_id='+this.dataset.coa_id+' and regid='+this.dataset.regid,
      ].join(';'),
      res=await _Hotel.request('queries',queries);
      loader.remove();
      let row=document.querySelector('tr[data-id="'+this.dataset.id+'"]');
      if(row){row.remove();}
    },{
      regid:adj.regid,
      id:adj.id,
      coa_id:adj.coa_id,
    }),
    row=tableMain.row(
      counter,
      adj.regid,
      pdate,
      coaName,
      adj.name,
      credit,
      debt,
      _Hotel.element('div',{},[
        del,
      ]),
    );
    row.childNodes[0].classList.add('td-center');
    row.childNodes[1].classList.add('td-center');
    row.childNodes[5].classList.add('td-right');
    row.childNodes[6].classList.add('td-right');
    row.dataset.id=adj.id;
    row.dataset.regid=adj.regid;
    if(adj.flow==1){
      totalCredit+=parseInt(adj.amount,10);
    }else{
      totalDebt=parseInt(adj.amount,10);
    }
  }
  row=tableMain.row(
    'Total',
    _Hotel.parseNominal(totalCredit),
    _Hotel.parseNominal(totalDebt),
    '',
  ).header();
  row.childNodes[0].setAttribute('colspan',5);
  row.childNodes[0].classList.add('td-right');
  row.childNodes[1].classList.add('td-right');
  row.childNodes[2].classList.add('td-right');
  /* save button */
  let save=_Hotel.button('Save','blue','save',async function(){
    let yes=await _Hotel.confirmX('Save posted journals?');
    if(!yes){return;}
    let queries=[
      'update adjustment (status=1&item_id=0) where item_id='+this.dataset.itemID,
    ],
    rows=document.querySelectorAll('tr[data-regid]');
    for(let i=0;i<rows.length;i++){
      queries.push('update transaction (status=1) where regid='+rows[i].dataset.regid);
    }
    let loader=_Hotel.loader(),
    res=await _Hotel.request('queries',queries.join(';'));
    loader.remove();
    return _HotelPurchasing.journalForm();
  },{
    target:'hidden',
    itemID,
  });
  sectionMain.append(save);
  /*  */
};


/* warehouse stock -- stock opname */
this.opnameStock=async function(category){
  _Hotel.main.loader();
  let catWhere=typeof category==='number'&&category!==NaN?'and category='+category:'',
  queries=[
    'select * from price where division="purchasing" '+catWhere+' order by name asc',
    'select * from item_stock',
    'select * from coa',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  items=data[0],
  stocks=data[1],
  coa=data[2],
  temp={
    id:0,
    item_id:0,
    stock:0,
    stock_min:0,
    stock_max:10,
    group:0,
    update:0,
  },
  table=_Hotel.table();
  this.coa=coa;
  table.head('WAREHOUSE STOCK OPNAME',10);
  table.row(
    _Hotel.alias('item_id'),
    _Hotel.alias('item_name'),
    _Hotel.alias('item_mark'),
    _Hotel.alias('category'),
    _Hotel.alias('stock'),
    _Hotel.alias('stock_min'),
    _Hotel.alias('stock_max'),
    _Hotel.alias('group'),
    _Hotel.alias('last_update'),
    '',
  ).header();
  table.row(
    _Hotel.findRow('id'),
    _Hotel.findRow('name'),
    _Hotel.findRow('mark'),
    _Hotel.findRow('category'),
    _Hotel.findRow('stock'),
    _Hotel.findRow('stock_min'),
    _Hotel.findRow('stock_max'),
    _Hotel.findRow('group'),
    _Hotel.findRow('sdate'),
    '',
  );
  for(let row of items){
    let raw=_Hotel.getDataByKey('item_id',row.id,stocks),
    stock=typeof raw==='object'&&raw!==null?raw:temp,
    category=this.getCoaName(row.category),
    sdate=_Hotel.parseDatetime(parseInt(stock.update,10)*1000),
    group=this.groups[stock.group],
    tr=table.row(
      row.id,
      row.name,
      row.mark,
      category,
      stock.stock,
      stock.stock_min,
      stock.stock_max,
      group,
      sdate,
      _Hotel.button('Edit','blue','edit',function(){
        _HotelPurchasing.opnameEdit(
          this.dataset.data,
          this.dataset.item
        );
      },{
        data:JSON.stringify(stock),
        item:JSON.stringify(row),
      }),
    );
    tr.dataset.id=row.id;
    tr.dataset.name=row.name;
    tr.dataset.mark=row.mark;
    tr.dataset.category=category;
    tr.dataset.stock=stock.stock;
    tr.dataset.stock_min=stock.stock_min;
    tr.dataset.stock_max=stock.stock_max;
    tr.dataset.group=group;
    tr.dataset.sdate=sdate;
    tr.childNodes[0].classList.add('td-center');
    tr.childNodes[4].classList.add('td-center');
    tr.childNodes[5].classList.add('td-center');
    tr.childNodes[6].classList.add('td-center');
    tr.childNodes[7].classList.add('td-center');
  }
  _Hotel.main.put('Warehouse Stock Opname',table);
};
this.opnameEdit=async function(raw,raw_item){
  _Hotel.main.loader();
  let data=_Hotel.parseJSON(raw),
  item=_Hotel.parseJSON(raw_item),
  read_item={
    name:item.name,
    mark:item.mark,
    category:this.getCoaName(item.category),
  },
  table=_Hotel.table(),
  save=_Hotel.button('Save','blue','save',async function(){
    let loader=_Hotel.loader(),
    fdata=_Hotel.formSerialize();
    if(this.dataset.id==0){
      fdata.item_id=this.dataset.item_id;
    }
    fdata.update=Math.ceil((new Date).getTime()/1000);
    let innerQuery=_Hotel.buildQuery(fdata),
    query=this.dataset.id==0
      ?'insert into item_stock '+innerQuery
      :'update item_stock ('+innerQuery+') where id='+this.dataset.id,
    res=await _Hotel.request('query',query);
    loader.remove();
    if(res!=1){
      return _Hotel.alert('Error: Failed to update stock?',res,'error');
    }
    _HotelPurchasing.opnameStock();
  },{
    item_id:item.id,
    id:data.id,
  }),
  section=_Hotel.element('div',{
    'class':'row-buttons section',
  },[save]),
  double=_Hotel.main.double(table,section),
  keys=['stock','stock_min','stock_max','group'];
  _Hotel.main.put('Edit Stock',double);
  table.classList.add('table-register');
  for(let key in read_item){
    table.row(
      _Hotel.alias(key),
      read_item[key],
    );
  }
  for(let key of keys){
    let val=_Hotel.input(key,data[key],'number',_Hotel.alias(key),10);
    if(key=='group'){
      val=_Hotel.select(key,data[key],{
        0:'Lancar',
        1:'Tetap',
      });
    }
    table.row(_Hotel.alias(key),val);
  }
};

/* request orders */
this.requestOrders=async function(){
  _Hotel.main.loader();
  let queries=[
    'select * from request_order order by id desc',
    'select id,username from user',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  orders=data[0],
  users=data[1],
  counter=0,
  table=_Hotel.table();
  _Hotel.main.put('Request Orders',table);
  table.row(
    'No',
    'RegID',
    _Hotel.alias('date_request'),
    _Hotel.alias('price_estimation'),
    _Hotel.alias('operator'),
    _Hotel.alias('status'),
    _Hotel.alias('note'),
    _Hotel.button('Add','green','plus',function(){
      _HotelPurchasing.requestOrderAdd();
    }),
  ).header();
  table.row(
    '',
    _Hotel.findRow('regid'),
    _Hotel.findRow('sdate'),
    _Hotel.findRow('estimate'),
    _Hotel.findRow('uname'),
    _Hotel.findRow('statusRO'),
    _Hotel.findRow('note'),
    '',
  );
  for(let row of orders){
    counter++;
    let sdate=_Hotel.parseDate(parseInt(row.time,10)*1000),
    estimate=_Hotel.parseNominal(row.estimate),
    uname=_Hotel.getValueById(row.uid,'username',users),
    statusRO=this.statuses.hasOwnProperty(row.status)?this.statuses[row.status]:'-',
    statusSpan=_Hotel.element('span',{
      id:'status-'+row.regid,
    }).text(statusRO),
    regid=row.regid.toString().padStart(7,'0'),
    edit=_Hotel.button('Edit','blue','edit',function(){
      _HotelPurchasing.requestOrderEdit(this.dataset.regid);
    },{
      regid:row.regid,
    }),
    done=_Hotel.button('Process','red','send',async function(){
      await _HotelPurchasing.requestOrderProcess(this.dataset.regid,this);
    },{
      regid:row.regid,
    }),
    view=_Hotel.button('View','green','search',function(){
      _Hotel.dialogView(this.dataset.type,this.dataset.regid);
    },{
      type:4,
      regid:row.regid,
    }),
    tr=table.row(
      counter,
      regid,
      sdate,
      estimate,
      uname,
      statusSpan,
      row.note,
      row.status<2?edit:(row.status==3?done:view),
    );
    tr.dataset.regid=regid;
    tr.dataset.sdate=sdate;
    tr.dataset.estimate=estimate;
    tr.dataset.uname=uname;
    tr.dataset.statusRO=statusRO;
    tr.dataset.note=row.note;
    tr.childNodes[0].classList.add('td-center');
    tr.childNodes[1].classList.add('td-center');
    tr.childNodes[3].classList.add('td-right');
  }
};
/* request order view */
this.requestOrderView=async function(regid){
  let dialog=await _Hotel.dialogPage(),
  queries=[
    'select * from request_order where regid='+regid,
    'select * from item_order where regid='+regid,
    'select * from price ',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  order=data[0].length>0?data[0][0]:{},
  orderItems=data[1],
  items=data[2],
  status=this.statuses.hasOwnProperty(order.status)?this.statuses[order.status]:'-',
  counter=0,
  table=_Hotel.table(),
  tableX=_Hotel.table();
  dialog.put(_Hotel.element('div',{},[table,tableX]));
  /* table 1 */
  table.head('Request Order #'+regid,5);
  table.row(
    'No',
    _Hotel.alias('item_name'),
    _Hotel.alias('item_count'),
    _Hotel.alias('item_price'),
    _Hotel.alias('item_sub_total'),
  ).header();
  for(let item of orderItems){
    counter++;
    let name=_Hotel.getValueById(item.item_id,'name',items),
    nominal=_Hotel.parseNominal(item.nominal),
    subtotal=_Hotel.parseNominal(parseInt(item.nominal,10)*parseInt(item.count,10)),
    row=table.row(
      counter,
      name,
      item.count,
      nominal,
      subtotal,
    );
    row.childNodes[0].classList.add('td-center');
    row.childNodes[2].classList.add('td-center');
    row.childNodes[3].classList.add('td-right');
    row.childNodes[4].classList.add('td-right');
  }
  /* table 2 */
  tableX.row(
    _Hotel.alias('price_estimation'),
    _Hotel.parseNominal(order.estimate)
  );
  tableX.row(_Hotel.alias('status'),status);
  tableX.row(_Hotel.alias('note'),order.note);
};
/* request order process */
this.requestOrderProcess=async function(regid,button){
  let dialog=await _Hotel.dialogPage(),
  queries=[
    'select * from request_order where regid='+regid,
    'select * from item_order where regid='+regid,
    'select * from price ',
    'select * from item_stock ',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  order=data[0].length>0?data[0][0]:{},
  orderItems=data[1],
  items=data[2],
  stocks=data[3],
  status=this.statuses.hasOwnProperty(order.status)?this.statuses[order.status]:'-',
  counter=0,
  done=_Hotel.button('Process','red','send',async function(){
    let yes=await _Hotel.confirmX('Process this request?');
    if(!yes){return;}
    let loader=_Hotel.loader(),
    itemQueries=[],
    updateTime=Math.ceil((new Date).getTime()/1000);
    for(let item of this.orderItems){
      let stock=_Hotel.getDataByKey('item_id',item.item_id,this.stocks),
      stockCount=parseInt(item.count,10);
      if(stock){
        stockCount+=parseInt(stock.stock,10);
        itemQueries.push('update item_stock (stock='+stockCount
          +'&update='+updateTime+') where item_id='+item.item_id);
      }else{
        itemQueries.push('insert into item_stock '+_Hotel.buildQuery({
          stock:stockCount,
          item_id:item.item_id,
          update:updateTime,
        }));
      }
    }
    let query='update request_order (status=2) where regid='+this.dataset.regid,
    tQuery='insert into transaction '+_Hotel.buildQuery({
      regid:this.dataset.regid,
      uid:_Hotel.user.id,
      amount:this.dataset.amount,
      deposit:this.dataset.amount,
      status:1,
      flow:0,
      type:4,
      date:(new Date).getDate(),
      month:(new Date).getMonth(),
      year:(new Date).getFullYear(),
    }),
    res=await _Hotel.request('queries',[
      query,tQuery,...itemQueries
    ].join(';'));
    loader.remove();
    this.dialog.close();
    this.button.remove();
    let el=document.getElementById('status-'+this.dataset.regid),
    statuses=_HotelPurchasing.statuses,
    newStatus=statuses[2]?statuses[2]:'-';
    if(el){el.innerText=newStatus;}
    _Hotel.alert('Successfully processed!',JSON.stringify(res),'success');
  },{
    regid:regid,
    amount:order.estimate,
  }),
  table=_Hotel.table(),
  tableX=_Hotel.table();
  dialog.put(_Hotel.element('div',{},[table,tableX]));
  /* table 1 */
  table.head('Request Order #'+regid,5);
  table.row(
    'No',
    _Hotel.alias('item_name'),
    _Hotel.alias('item_count'),
    _Hotel.alias('item_price'),
    _Hotel.alias('item_sub_total'),
  ).header();
  for(let item of orderItems){
    counter++;
    let name=_Hotel.getValueById(item.item_id,'name',items),
    nominal=_Hotel.parseNominal(item.nominal),
    subtotal=_Hotel.parseNominal(parseInt(item.nominal,10)*parseInt(item.count,10)),
    row=table.row(
      counter,
      name,
      item.count,
      nominal,
      subtotal,
    );
    row.childNodes[0].classList.add('td-center');
    row.childNodes[2].classList.add('td-center');
    row.childNodes[3].classList.add('td-right');
    row.childNodes[4].classList.add('td-right');
  }
  /* table 2 */
  tableX.row(
    _Hotel.alias('price_estimation'),
    _Hotel.parseNominal(order.estimate)
  );
  tableX.row(_Hotel.alias('status'),status);
  tableX.row(_Hotel.alias('note'),order.note);
  done.dialog=dialog;
  done.button=button;
  done.stocks=stocks;
  done.orderItems=orderItems;
  let buttons=tableX.row(
    _Hotel.element('div',{
      'class':'section row-buttons',
    },[done])
  );
  buttons.childNodes[0].classList.add('td-right');
  buttons.childNodes[0].setAttribute('colspan',2);
};
this.requestOrderEdit=async function(regid=0){
  _Hotel.main.loader();
  let queries=[
    'select * from item_order where regid='+regid,
    'select * from request_order where regid='+regid,
    'select * from price where division="purchasing"',
    'select * from item_stock',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  item_order=data[0],
  request_order=data[1].length>0?data[1][0]:{},
  items=data[2],
  stocks=data[3],
  counter=0,
  table=_Hotel.table(),
  save=_Hotel.button('Save','blue','save',async function(){
    let fdata=_Hotel.formSerialize(true),
    data=_Hotel.parseJSON(fdata.data),
    innerQuery=_Hotel.buildQuery({
      estimate:fdata.estimate,
      uid:fdata.uid,
      status:fdata.status,
      note:fdata.note,
    }),
    queries=[
      'update request_order ('+innerQuery+') where regid='+fdata.regid,
    ];
    for(let i in data){
      let val=data[i],
      nquery=_Hotel.buildQuery({
        regid:this.dataset.regid,
        item_id:val.item_id,
        nominal:val.nominal,
        count:val.count,
      });
      queries.push('update item_order ('+nquery+') where id='+val.id);
    }
    let loader=_Hotel.loader(),
    res=await _Hotel.request('queries',queries.join(';'));
    loader.remove();
    _HotelPurchasing.requestOrders();
  },{
    regid:regid,
  }),
  itemLine={
    regid:regid,
    number:counter,
    item_name:'',
    nominal:0,
    stock:0,
    count:0,
    unit:'Pcs',
    sub_total:0,
    category:0,
  },
  estimationTotal=_Hotel.input('estimate',request_order.estimate,'hidden'),
  estimationParsed=_Hotel.element('span').text(
    _Hotel.parseNominal(request_order.estimate),
  ),
  estimation=_Hotel.element('div',{
    style:'text-align:right;'
  },[
    estimationTotal,
    estimationParsed,
  ]),
  add=_Hotel.button('Add','green','plus',function(){
    let items=_Hotel.parseJSON(this.dataset.items),
    stocks=_Hotel.parseJSON(this.dataset.stocks);
    _HotelPurchasing.requestOrderAddRow({
      items,
      stocks,
      table:this.table,
      estimationTotal:this.estimationTotal,
      estimationParsed:this.estimationParsed,
    });
  },{
    regid:regid,
    items:JSON.stringify(items),
    stocks:JSON.stringify(stocks),
  }),
  tableX=_Hotel.table(),
  section=_Hotel.element('div',{
    'class':'row-buttons section',
  },[
    save,
    _Hotel.input('regid',regid,'hidden'),
    _Hotel.input('uid',request_order.uid,'hidden'),
  ]);
  _Hotel.main.put(
    'Edit Request Order (RegID: #'+regid+')',
    _Hotel.element('div',{},[table,tableX,section])
  );
  table.dataset.counter='1';
  add.table=table;
  add.estimationTotal=estimationTotal;
  add.estimationParsed=estimationParsed;
  table.row(
    'No',
    _Hotel.alias('item_name'),
    _Hotel.alias('category'),
    _Hotel.alias('item_unit'),
    _Hotel.alias('stock'),
    _Hotel.alias('item_count'),
    _Hotel.alias('item_sub_total'),
    '',
  ).header();
  table.style.width='100%';
  /* parse item data */
  for(let row of item_order){
    this.requestOrderAddRow({
      table,
      items,
      stocks,
      estimationTotal,
      estimationParsed,
      data:row,
    });
  }
  tableX.style.marginTop='30px';
  tableX.row(
    _Hotel.alias('price_estimation'),
    estimation,
  ).header();
  tableX.row(
    _Hotel.alias('status'),
    _Hotel.select('status',request_order.status,{
      0:'Draft',
      1:'Pending',
    }),
  );
  tableX.row(
    _Hotel.alias('note'),
    _Hotel.textarea('note',request_order.note,_Hotel.alias('note'),100,{}),
  );
};
this.requestOrderAdd=async function(){
  _Hotel.main.loader();
  let queries=[
    'insert into regid uid='+_Hotel.user.id+'&type=4',
    'select * from regid where uid='+_Hotel.user.id+' and type=4 order by id desc limit 1',
    'select * from price where division="purchasing"',
    'select * from item_stock',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  regid=data[1][0].id,
  items=data[2],
  stocks=data[3],
  table=_Hotel.table(),
  save=_Hotel.button('Save','blue','save',async function(){
    let fdata=_Hotel.formSerialize(true),
    data=_Hotel.parseJSON(fdata.data),
    innerQuery=_Hotel.buildQuery({
      regid:fdata.regid,
      estimate:fdata.estimate,
      uid:fdata.uid,
      status:fdata.status,
      note:fdata.note,
    }),
    queries=[
      'insert into request_order '+innerQuery,
    ];
    for(let i in data){
      let val=data[i],
      nquery=_Hotel.buildQuery({
        regid:this.dataset.regid,
        item_id:val.item_id,
        nominal:val.nominal,
        count:val.count,
      });
      queries.push('insert into item_order '+nquery);
    }
    let loader=_Hotel.loader(),
    res=await _Hotel.request('queries',queries.join(';'));
    loader.remove();
    _HotelPurchasing.requestOrders();
  },{
    regid:regid,
  }),
  estimationTotal=_Hotel.input('estimate','0','hidden'),
  estimationParsed=_Hotel.element('span').text(
    _Hotel.parseNominal(0),
  ),
  estimation=_Hotel.element('div',{
    style:'text-align:right;'
  },[
    estimationTotal,
    estimationParsed,
  ]),
  add=_Hotel.button('Add','green','plus',function(){
    let items=_Hotel.parseJSON(this.dataset.items),
    stocks=_Hotel.parseJSON(this.dataset.stocks);
    _HotelPurchasing.requestOrderAddRow({
      items,
      stocks,
      table:this.table,
      estimationTotal:this.estimationTotal,
      estimationParsed:this.estimationParsed,
    });
  },{
    regid:regid,
    items:JSON.stringify(items),
    stocks:JSON.stringify(stocks),
  }),
  tableX=_Hotel.table(),
  section=_Hotel.element('div',{
    'class':'row-buttons section',
  },[
    save,
    _Hotel.input('regid',regid,'hidden'),
    _Hotel.input('uid',_Hotel.user.id,'hidden'),
  ]);
  _Hotel.main.put('Add Request Order',_Hotel.element('div',{},[table,tableX,section]));
  table.dataset.counter='1';
  add.table=table;
  add.estimationTotal=estimationTotal;
  add.estimationParsed=estimationParsed;
  table.row(
    'No',
    _Hotel.alias('item_name'),
    _Hotel.alias('category'),
    _Hotel.alias('item_unit'),
    _Hotel.alias('stock'),
    _Hotel.alias('item_count'),
    _Hotel.alias('item_sub_total'),
    add,
  ).header();
  table.style.width='100%';
  tableX.style.marginTop='30px';
  tableX.row(
    _Hotel.alias('price_estimation'),
    estimation,
  ).header();
  tableX.row(
    _Hotel.alias('status'),
    _Hotel.select('status','0',{
      0:'Draft',
      1:'Pending',
    }),
  );
  tableX.row(
    _Hotel.alias('note'),
    _Hotel.textarea('note','',_Hotel.alias('note'),100,{}),
  );
};
this.requestOrderAddRow=function(config){
  /*
    config (object)
      - table            object of table element
      - items            array  of items
      - stocks           array  of stocks
      - estimationTotal  object of hidden input element
      - estimationParsed object of span element
      - data             object of default data
                         - item_id
                         - nominal
                         - count
  */
  let counter=config.table.dataset.hasOwnProperty('counter')
    ?parseInt(config.table.dataset.counter,10):1,
  items=config.items,
  data=config.hasOwnProperty('data')?config.data:{
    id:0,
    item_id:0,
    count:0,
    nominal:0,
  },
  item=data.item_id!=0
    ?_Hotel.getDataById(data.item_id,items)
    :{category:'',unit:'',name:''},
  itemStock=_Hotel.getValueByKey('item_id',data.item_id,'stock',config.stocks),
  totalNominal=parseInt(data.count,10)*parseInt(data.nominal,10),
  nominal=_Hotel.input('data['+counter+'][nominal]',data.nominal,'hidden'),
  orid=_Hotel.input('data['+counter+'][id]',data.id,'hidden'),
  category=_Hotel.element('span',{
    id:'item-category-'+counter,
  }).text(_HotelPurchasing.getCoaName(item.category)),
  unit=_Hotel.element('span',{
    id:'item-unit-'+counter,
  }).text(item.unit),
  subTotal=_Hotel.element('span',{
    id:'item-sub-total-'+counter,
  }).text(_Hotel.parseNominal(totalNominal)),
  count=_Hotel.input(
    'data['+counter+'][count]',
    data.count,
    'number',
    _Hotel.alias('item_count'),
    10
  ),
  del=_Hotel.button('Delete','red','trash',async function(){
    let fdata=_Hotel.formSerialize(true),
    data=_Hotel.parseJSON(fdata.data);
    if(data.hasOwnProperty(this.dataset.counter)){
      let idata=data[this.dataset.counter];
      if(idata.id>0){
        let yes=_Hotel.confirm('Delete this row?');
        if(!yes){return;}
        let query='delete from item_order where id='+idata.id,
        res=await _Hotel.request('query',query);
        if(res!=1){
          return _Hotel.alert('Error: Failed to delete row!',res,'error');
        }
      }
    }
    let el=document.getElementById('row-'+this.dataset.counter);
    if(el){el.remove();}
    let gtotal=_HotelPurchasing.getGrandTotalRO();
    config.estimationTotal.value=gtotal;
    config.estimationParsed.innerText=_Hotel.parseNominal(gtotal);
  },{counter}),
  stock=_Hotel.element('span').text(itemStock!=''?itemStock:'0'),
  itemSelect=_Hotel.findSelect({
    id:'item-selector-'+counter,
    key:'data['+counter+'][item_id]',
    value:data.item_id,
    data:items,
    placeholder:_Hotel.alias('item_name'),
    inject:{
      category,
      unit,
      nominal,
      count,
      subTotal,
      stock,
      stocks:config.stocks,
      estimationTotal:config.estimationTotal,
      estimationParsed:config.estimationParsed,
    },
    callback:function(res,inject){
      inject.category.innerText=_HotelPurchasing.getCoaName(res.data.category);
      inject.unit.innerText=res.data.unit;
      inject.nominal.value=res.data.nominal;
      inject.count.value='1';
      subTotal.innerText=_Hotel.parseNominal(parseInt(res.data.nominal,10)*1);
      let gtotal=_HotelPurchasing.getGrandTotalRO();
      inject.estimationTotal.value=gtotal;
      inject.estimationParsed.innerText=_Hotel.parseNominal(gtotal);
      let stock=_Hotel.getValueByKey('item_id',res.data.id,'stock',inject.stocks);
      inject.stock.innerText=stock;
    },
  }),
  tr=config.table.row(
    counter,
    itemSelect,
    category,
    _Hotel.element('div',{},[unit,nominal,orid]),
    stock,
    count,
    subTotal,
    del,
  );
  itemSelect.slave.input.value=item.name;
  tr.id='row-'+counter;
  tr.childNodes[0].classList.add('td-center');
  tr.childNodes[4].classList.add('td-center');
  tr.childNodes[6].classList.add('td-right');
  count.subTotal=subTotal;
  count.nominal=nominal;
  count.estimationTotal=config.estimationTotal;
  count.estimationParsed=config.estimationParsed;
  count.stock=stock;
  count.addEventListener('keyup',async function(){
    let nominal=parseInt(this.nominal.value,10),
    stock=parseInt(this.stock.innerText,10),
    value=parseInt(this.value);
    if(value>stock){
      /* this.value=stock; */
      await _Hotel.sleep(100);
    }else if(value<0){
      this.value=0;
      await _Hotel.sleep(100);
    }
    value=parseInt(this.value);
    let total=nominal*value,
    totalText=_Hotel.parseNominal(total),
    gtotal=_HotelPurchasing.getGrandTotalRO();
    this.subTotal.innerText=totalText;  
    this.estimationTotal.value=gtotal;
    this.estimationParsed.innerText=_Hotel.parseNominal(gtotal);
  },false);
  del.estimationTotal=config.estimationTotal;
  del.estimationParsed=config.estimationParsed;
  let gtotal=_HotelPurchasing.getGrandTotalRO();
  config.estimationTotal.value=gtotal;
  config.estimationParsed.innerText=_Hotel.parseNominal(gtotal);
  config.table.dataset.counter=(counter+1)+'';
  return {
    
  };
};

/* items -- table: price */
this.items=async function(){
  _Hotel.main.loader();
  let queries=[
    'select * from price where division="purchasing"',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  items=data[0],
  table=_Hotel.table(),
  add=_Hotel.button('Add','green','plus',function(){
    _HotelPurchasing.itemAdd();
  });
  table.row(
    _Hotel.alias('item_id'),
    _Hotel.alias('item_name'),
    _Hotel.alias('item_mark'),
    _Hotel.alias('category'),
    _Hotel.alias('selling_price'),
    _Hotel.alias('purchase_price'),
    _Hotel.alias('item_unit'),
    add,
  ).header();
  table.row(
    _Hotel.findRow('id'),
    _Hotel.findRow('name'),
    _Hotel.findRow('mark'),
    _Hotel.findRow('category'),
    _Hotel.findRow('nominal'),
    _Hotel.findRow('purchase'),
    _Hotel.findRow('unit'),
    '',
  );
  for(let row of items){
    let category=this.getCoaName(row.category),
    nominal=_Hotel.parseNominal(row.nominal),
    purchase=_Hotel.parseNominal(row.purchase),
    tr=table.row(
      row.id,
      row.name,
      row.mark,
      category,
      nominal,
      purchase,
      row.unit,
      _Hotel.button('Edit','blue','edit',function(){
        _HotelPurchasing.itemEdit(this.dataset.data);
      },{
        data:JSON.stringify(row)
      }),
    );
    tr.dataset.id=row.id;
    tr.dataset.name=row.name;
    tr.dataset.mark=row.mark;
    tr.dataset.category=category;
    tr.dataset.nominal=nominal;
    tr.dataset.purchase=purchase;
    tr.dataset.unit=row.unit;
    tr.childNodes[0].classList.add('td-center');
    tr.childNodes[4].classList.add('td-right');
    tr.childNodes[5].classList.add('td-right');
  }
  _Hotel.main.put('Items',table);
};
this.itemAdd=function(){
  _Hotel.main.loader();
  let data={
    name:'',
    mark:'',
    category:21,
    unit:'Pcs',
    nominal:0,
    purchase:0,
  },
  table=_Hotel.table(),
  save=_Hotel.button('Save','blue','save',async function(){
    let fdata=_Hotel.formSerialize();
    fdata.division='purchasing';
    let query='insert into price '+_Hotel.buildQuery(fdata),
    res=await _Hotel.request('query',query);
    if(res!=1){
      return _Hotel.alert('Error: Failed to save item!',res,'error');
    }
    _HotelPurchasing.items();
  },{}),
  section=_Hotel.element('div',{
    'class':'row-buttons section',
  },[save]),
  double=_Hotel.main.double(table,section),
  categorySelect=_Hotel.findSelect({
    id:'category-selector',
    key:'category',
    value:data.category,
    data:this.coa,
  });
  table.classList.add('table-register');
  categorySelect.slave.input.value=this.getCoaName(data.category);
  table.row(
    _Hotel.alias('category'),
    categorySelect
  );
  table.row(
    _Hotel.alias('item_name'),
    _Hotel.input('name',data.name,'text',_Hotel.alias('item_name'),100)
  );
  table.row(
    _Hotel.alias('item_mark'),
    _Hotel.input('mark',data.mark,'text',_Hotel.alias('item_mark'),100)
  );
  table.row(
    _Hotel.alias('item_unit'),
    _Hotel.select('unit',data.unit,this.unit)
  );
  table.row(
    _Hotel.alias('selling_price'),
    _Hotel.input('nominal',data.nominal,'number',_Hotel.alias('selling_price'),10)
  );
  table.row(
    _Hotel.alias('purchase_price'),
    _Hotel.input('purchase',data.purchase,'number',_Hotel.alias('purchase_price'),10)
  );
  _Hotel.main.put('Add Item',double);
};
this.itemEdit=async function(raw=''){
  _Hotel.main.loader();
  let data=_Hotel.parseJSON(raw),
  table=_Hotel.table(),
  save=_Hotel.button('Save','blue','save',async function(){
    let fdata=_Hotel.formSerialize(true),
    queries=[],
    dataObject=_Hotel.parseJSON(fdata.data),
    data=_Hotel.objectToArray(dataObject);
    for(let d of data){
      let innerQuery=_Hotel.buildQuery({
        item_id:d.item_id,
        supplier_id:d.supplier_id,
        cost:d.cost,
      });
      if(d.id==0){
        queries.push('insert into item_supplier '+innerQuery);
      }else{
        queries.push('update item_supplier ('+innerQuery+') where id='+d.id);
      }
    }
    delete fdata.data;
    queries.push(
      'update price ('
      +_Hotel.buildQuery(fdata)
      +') where id='+this.dataset.id
    );
    let res=await _Hotel.request('queries',queries.join(';'));
    _HotelPurchasing.items();
  },{
    id:data.id,
  }),
  del=_Hotel.button('Delete','red','trash',async function(){
    let yes=await _Hotel.confirmX('Delete this item?');
    if(!yes){return;}
    let query='delete from price where id='+this.dataset.id,
    res=await _Hotel.request('query',query);
    if(res!=1){
      return _Hotel.alert('Error: Failed to delete item!',res,'error');
    }
    _HotelPurchasing.items();
  },{
    id:data.id,
  }),
  section=_Hotel.element('div',{
    'class':'row-buttons section',
  },[save,del]),
  tableX=_Hotel.table(),
  leftSection=_Hotel.element('div',{},[table,tableX]),
  double=_Hotel.main.double(leftSection,section),
  add=_Hotel.button('Add','green','plus',function(){
    _HotelPurchasing.itemEditSupplierAdd(this.table,this.dataset.id);
  },{
    id:data.id,
  }),
  categorySelect=_Hotel.findSelect({
    id:'category-selector',
    key:'category',
    value:data.category,
    data:this.coa,
  });
  table.classList.add('table-register');
  categorySelect.slave.input.value=this.getCoaName(data.category);
  table.row(
    _Hotel.alias('category'),
    categorySelect
  );
  table.row(
    _Hotel.alias('item_name'),
    _Hotel.input('name',data.name,'text',_Hotel.alias('item_name'),100)
  );
  table.row(
    _Hotel.alias('item_mark'),
    _Hotel.input('mark',data.mark,'text',_Hotel.alias('item_mark'),100)
  );
  table.row(
    _Hotel.alias('item_unit'),
    _Hotel.select('unit',data.unit,this.unit)
  );
  table.row(
    _Hotel.alias('selling_price'),
    _Hotel.input('nominal',data.nominal,'number',_Hotel.alias('selling_price'),10)
  );
  table.row(
    _Hotel.alias('purchase_price'),
    _Hotel.input('purchase',data.purchase,'number',_Hotel.alias('purchase_price'),10)
  );
  _Hotel.main.put('Edit Item #'+data.id,double);
  tableX.row(
    'No',
    _Hotel.alias('supplier_name'),
    _Hotel.alias('supplier_cost'),
    add,
  ).header();
  tableX.dataset.counter='1';
  add.disabled=true;
  add.table=tableX;
  this.itemEditSuppliers(tableX,data.id,add);
};
this.itemEditSuppliers=async function(table,item_id,add){
  let loader=table.row(
    _Hotel.element('img',{
      alt:'',
      src:_Hotel.IMAGES['loader.gif'],
    })
  );
  loader.childNodes[0].setAttribute('colspan',4);
  loader.childNodes[0].classList.add('td-center');
  /* prepare data supplier */
  let queries=[
    'select * from item_supplier where item_id='+item_id,
    'select * from supplier',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  item_suppliers=data[0],
  suppliers=data[1];
  this.suppliersList=suppliers;
  add.disabled=false;
  loader.remove();
  for(let dis of item_suppliers){
    this.itemEditSupplierAdd(table,data.id,dis);
  }
  table.style.paddingBottom='200px';
};
this.itemEditSupplierAdd=async function(table,item_id,data){
  data=typeof data==='object'&&data!==null?data:{
    id:0,
    item_id:item_id,
    supplier_id:0,
    cost:0,
  };
  let suppliers=this.companyToName(this.suppliersList),
  counter=parseInt(table.dataset.counter,10);
  sname=_Hotel.getValueById(data.supplier_id,'name',suppliers),
  slist=_Hotel.findSelect({
    id:'supplier-'+counter,
    key:'data['+counter+'][supplier_id]',
    value:data.supplier_id,
    data:suppliers,
  }),
  del=_Hotel.button('Delete','red','trash',function(){
    let el=document.getElementById(this.dataset.id);
    if(el){el.remove();}
  },{
    id:'row-'+counter,
  }),
  row=table.row(
    counter,
    slist,
    _Hotel.input(
      'data['+counter+'][cost]',
      data.cost,
      'number',
      _Hotel.alias('suppliers_cost'),
      10
    ),
    _Hotel.element('div',{},[
      del,
      _Hotel.input('data['+counter+'][id]',data.id,'hidden'),
      _Hotel.input('data['+counter+'][item_id]',data.item_id,'hidden')
    ]),
  );
  row.id='row-'+counter;
  slist.slave.input.value=sname;
  table.dataset.counter=(counter+1)+'';
};

/* suppliers */
this.suppliers=async function(){
  _Hotel.main.loader();
  let queries=[
    'select * from supplier',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  suppliers=data[0],
  table=_Hotel.table(),
  add=_Hotel.button('Add','green','plus',function(){
    _HotelPurchasing.supplierAdd();
  });
  table.row(
    'ID',
    _Hotel.alias('company_name'),
    _Hotel.alias('contact_name'),
    _Hotel.alias('contact_phone'),
    _Hotel.alias('bank_name'),
    _Hotel.alias('bank_account'),
    _Hotel.alias('Email'),
    add,
  ).header();
  table.row(
    '',
    _Hotel.findRow('company_name'),
    _Hotel.findRow('contact_name'),
    _Hotel.findRow('contact_phone'),
    _Hotel.findRow('bank_name'),
    _Hotel.findRow('bank_account'),
    _Hotel.findRow('email'),
    '',
  );
  for(let row of suppliers){
    let tr=table.row(
      row.id,
      row.company_name,
      row.contact_name,
      row.contact_phone,
      row.bank_name,
      row.bank_account,
      row.email,
      _Hotel.button('Edit','blue','edit',function(){
        _HotelPurchasing.supplierEdit(this.dataset.data);
      },{
        data:JSON.stringify(row),
      }),
    );
    tr.dataset.company_name=row.company_name;
    tr.dataset.contact_name=row.contact_name;
    tr.dataset.contact_phone=row.contact_phone;
    tr.dataset.bank_name=row.bank_name;
    tr.dataset.bank_account=row.bank_account;
    tr.dataset.email=row.email;
    tr.childNodes[0].classList.add('td-center');
    tr.childNodes[6].style.whiteSpace='break-word';
    tr.childNodes[6].style.wordBreak='break-all';
  }
  _Hotel.main.put('Suppliers',table);
};
this.supplierEdit=function(raw=''){
  _Hotel.main.loader();
  let table=_Hotel.table(),
  data=_Hotel.parseJSON(raw),
  save=_Hotel.button('Save','blue','save',async function(){
    let loader=_Hotel.loader(),
    fdata=_Hotel.formSerialize(),
    innerQuery=_Hotel.buildQuery(fdata),
    query='update supplier ('+innerQuery+') where id='+this.dataset.id,
    res=await _Hotel.request('query',query);
    loader.remove();
    if(res!=1){
      return _Hotel.alert('Error: Failed to update supplier!',res,'error');
    }
    _HotelPurchasing.suppliers();
  },{
    id:data.id,
  }),
  del=_Hotel.button('Delete','red','trash',async function(){
    let yes=await _Hotel.confirmX('Delete this supplier?');
    if(!yes){return;}
    let loader=_Hotel.loader(),
    query='delete from supplier where id='+this.dataset.id,
    res=await _Hotel.request('query',query);
    loader.remove();
    if(res!=1){
      return _Hotel.alert('Error: Failed to delete supplier!',res,'error');
    }
    _HotelPurchasing.suppliers();
  },{
    id:data.id,
  }),
  brow=_Hotel.element('div',{
    'class':'row-buttons section',
  },[save,del]),
  double=_Hotel.main.double(table,brow),
  template=[
    {
      name:'company_name',
      value:data.company_name,
      type:'text',
      length:100,
    },
    {
      name:'contact_name',
      value:data.contact_name,
      type:'text',
      length:100,
    },
    {
      name:'contact_phone',
      value:data.contact_phone,
      type:'number',
      length:20,
    },
    {
      name:'bank_name',
      value:data.bank_name,
      type:'string',
      length:50,
    },
    {
      name:'bank_account',
      value:data.bank_account,
      type:'number',
      length:20,
    },
    {
      name:'email',
      value:data.email,
      type:'email',
      length:50,
    },
    {
      name:'phone',
      value:data.phone,
      type:'number',
      length:20,
    },
    {
      name:'fax',
      value:data.fax,
      type:'number',
      length:20,
    },
    {
      name:'address',
      value:data.address,
      type:'text',
      length:100,
    },
  ];
  table.classList.add('table-register');
  _Hotel.main.put('Edit Supplier #'+data.id,double);
  for(let temp of template){
    let td=table.row(
      _Hotel.alias(temp.name),
      _Hotel.input(temp.name,temp.value,temp.type,_Hotel.alias(temp.name),temp.length)
    );
  }
};
this.supplierAdd=function(){
  _Hotel.main.loader();
  let table=_Hotel.table(),
  save=_Hotel.button('Save','blue','save',async function(){
    let loader=_Hotel.loader(),
    fdata=_Hotel.formSerialize(),
    query='insert into supplier '+_Hotel.buildQuery(fdata),
    res=await _Hotel.request('query',query);
    loader.remove();
    if(res!=1){
      return _Hotel.alert('Error: Failed to add supplier!',res,'error');
    }
    _HotelPurchasing.suppliers();
  },{}),
  brow=_Hotel.element('div',{
    'class':'row-buttons section',
  },[save]),
  double=_Hotel.main.double(table,brow),
  template=[
    {
      name:'company_name',
      value:'',
      type:'text',
      length:100,
    },
    {
      name:'contact_name',
      value:'',
      type:'text',
      length:100,
    },
    {
      name:'contact_phone',
      value:'',
      type:'number',
      length:20,
    },
    {
      name:'bank_name',
      value:'',
      type:'string',
      length:50,
    },
    {
      name:'bank_account',
      value:'',
      type:'number',
      length:20,
    },
    {
      name:'email',
      value:'',
      type:'email',
      length:50,
    },
    {
      name:'phone',
      value:'',
      type:'number',
      length:20,
    },
    {
      name:'fax',
      value:'',
      type:'number',
      length:20,
    },
    {
      name:'address',
      value:'',
      type:'text',
      length:100,
    },
  ];
  table.classList.add('table-register');
  _Hotel.main.put('Add Supplier',double);
  for(let temp of template){
    let td=table.row(
      _Hotel.alias(temp.name),
      _Hotel.input(temp.name,temp.value,temp.type,_Hotel.alias(temp.name),temp.length)
    );
  }
};

/* get coa name from this.coa array */
this.getCoaName=function(id){
  return _Hotel.getValueById(parseInt(id),'name',this.coa);
};
/* helpers */
this.companyToName=function(data=[]){
  data=Array.isArray(data)?data:[];
  let res=[];
  for(let k in data){
    let d=data[k];
    res[k]={
      id:d.id,
      name:d.company_name,
    };
  }
  return res;
};
this.getGrandTotalRO=function(){
  let fdata=_Hotel.formSerialize(true),
  data=_Hotel.parseJSON(fdata.data),
  gtotal=0;
  for(let i in data){
    let val=data[i],
    subtotal=parseInt(val.nominal,10)*parseInt(val.count,10);
    gtotal+=subtotal;
  }return gtotal;
};
this.itemCategory=function(k=0){
  return this.itemCategories.hasOwnProperty(k)
    ?this.itemCategories[k]:'-';
};
/* return as constructor */
return this.init();
};



/* HotelHousekeeping */
;function HotelHousekeeping(){
/* bring to global variable */
window._HotelHousekeeping=this;
this.rooms=[];
this.coa=[];
this.items=[];
this.roomStatusInfo={};
this.months=[
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
this.groups=[
  'Lancar',
  'Tetap',
];
this.init=function(){
  return this;
};
this.menus=function(){
  return [
    {
      name:'Stock Opname',
      icon:'table',
      callback:function(){
        _HotelHousekeeping.opnameStock();
      },
    },
    {
      name:'Request Orders',
      icon:'wpforms',
      callback:function(){
        _HotelHousekeeping.requestOrders();
      },
    },
    {
      name:'Room Status',
      icon:'building-o',
      callback:function(){
        _HotelHousekeeping.roomStatus();
      },
    },
  ];
};
this.dashboard=async function(){
  this.opnameStock();
};

/* stock opname -- table: item_stock_hk */
this.opnameStock=async function(category){
  _Hotel.main.loader();
  let catWhere=typeof category==='number'&&category!==NaN?'and category='+category:'',
  queries=[
    'select * from price where division="purchasing" '+catWhere+' order by name asc',
    'select * from item_stock_hk',
    'select * from coa',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  items=data[0],
  stocks=data[1],
  coa=data[2],
  temp={
    id:0,
    item_id:0,
    stock:0,
    stock_min:0,
    stock_max:10,
    group:0,
    update:0,
  },
  table=_Hotel.table();
  this.coa=coa;
  table.head('HOUSEKEEPING STOCK OPNAME',10);
  table.row(
    _Hotel.alias('item_id'),
    _Hotel.alias('item_name'),
    _Hotel.alias('item_mark'),
    _Hotel.alias('category'),
    _Hotel.alias('stock'),
    _Hotel.alias('stock_min'),
    _Hotel.alias('stock_max'),
    _Hotel.alias('group'),
    _Hotel.alias('last_update'),
    '',
  ).header();
  table.row(
    _Hotel.findRow('id'),
    _Hotel.findRow('name'),
    _Hotel.findRow('mark'),
    _Hotel.findRow('category'),
    _Hotel.findRow('stock'),
    _Hotel.findRow('stock_min'),
    _Hotel.findRow('stock_max'),
    _Hotel.findRow('group'),
    _Hotel.findRow('sdate'),
    '',
  );
  for(let row of items){
    let raw=_Hotel.getDataByKey('item_id',row.id,stocks),
    stock=typeof raw==='object'&&raw!==null?raw:temp,
    category=this.getCoaName(row.category),
    sdate=_Hotel.parseDatetime(parseInt(stock.update,10)*1000),
    group=this.groups[stock.group],
    tr=table.row(
      row.id,
      row.name,
      row.mark,
      category,
      stock.stock,
      stock.stock_min,
      stock.stock_max,
      group,
      sdate,
      _Hotel.button('Edit','blue','edit',function(){
        _HotelHousekeeping.opnameEdit(
          this.dataset.data,
          this.dataset.item
        );
      },{
        data:JSON.stringify(stock),
        item:JSON.stringify(row),
      }),
    );
    tr.dataset.id=row.id;
    tr.dataset.name=row.name;
    tr.dataset.mark=row.mark;
    tr.dataset.category=category;
    tr.dataset.stock=stock.stock;
    tr.dataset.stock_min=stock.stock_min;
    tr.dataset.stock_max=stock.stock_max;
    tr.dataset.group=group;
    tr.dataset.sdate=sdate;
    tr.childNodes[0].classList.add('td-center');
    tr.childNodes[4].classList.add('td-center');
    tr.childNodes[5].classList.add('td-center');
    tr.childNodes[6].classList.add('td-center');
    tr.childNodes[7].classList.add('td-center');
  }
  _Hotel.main.put('Housekeeping Stock Opname',table);
};
this.opnameEdit=async function(raw,raw_item){
  _Hotel.main.loader();
  let data=_Hotel.parseJSON(raw),
  item=_Hotel.parseJSON(raw_item),
  read_item={
    name:item.name,
    mark:item.mark,
    category:this.getCoaName(item.category),
  },
  table=_Hotel.table(),
  save=_Hotel.button('Save','blue','save',async function(){
    let loader=_Hotel.loader(),
    fdata=_Hotel.formSerialize();
    if(this.dataset.id==0){
      fdata.item_id=this.dataset.item_id;
    }
    fdata.update=Math.ceil((new Date).getTime()/1000);
    let innerQuery=_Hotel.buildQuery(fdata),
    query=this.dataset.id==0
      ?'insert into item_stock_hk '+innerQuery
      :'update item_stock_hk ('+innerQuery+') where id='+this.dataset.id,
    res=await _Hotel.request('query',query);
    loader.remove();
    if(res!=1){
      return _Hotel.alert('Error: Failed to update stock?',res,'error');
    }
    _HotelHousekeeping.opnameStock();
  },{
    item_id:item.id,
    id:data.id,
  }),
  section=_Hotel.element('div',{
    'class':'row-buttons section',
  },[save]),
  double=_Hotel.main.double(table,section),
  keys=['stock','stock_min','stock_max','group'];
  _Hotel.main.put('Edit Stock',double);
  table.classList.add('table-register');
  for(let key in read_item){
    table.row(
      _Hotel.alias(key),
      read_item[key],
    );
  }
  for(let key of keys){
    let val=_Hotel.input(key,data[key],'number',_Hotel.alias(key),10);
    if(key=='group'){
      val=_Hotel.select(key,data[key],{
        0:'Lancar',
        1:'Tetap',
      });
    }
    table.row(_Hotel.alias(key),val);
  }
};

/* request order -- table: purchase_order -- transaction_type: 1 */
this.requestOrders=async function(month,year){
  _Hotel.requestOrders();
};
/* request order -- table: purchase_order -- transaction_type: 1 */
this.requestOrders_OLD_NOT_USED=async function(month,year){
  year=year||(new Date).getFullYear();
  month=!isNaN(parseInt(month,10))?month:(new Date).getMonth();
  _Hotel.main.loader();
  let kdate=Math.floor(year/4)==year?29:28,
  kmonth=[31,kdate,31,30,31,30,31,31,30,31,30,31],
  dateTime=Math.floor((new Date([
    year,
    (parseInt(month,10)+1).toString().padStart(2,'0'),
    (1).toString().padStart(2,'0'),
  ].join('-'))).getTime()/1000),
  dateTimeEnd=dateTime+(3600*24*(kmonth[month]+1)),
  queries=[
    'select * from purchase_order where time > '+dateTime+' and time < '+dateTimeEnd,
    'select * from price where division="purchasing"',
    'select * from coa',
    'select id,username as name from user',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  orders=data[0],
  items=data[1],
  coa=data[2],
  users=data[3],
  table=_Hotel.table();
  this.coa=coa;
  this.items=items;
  /* put content */
  _Hotel.main.put('Request Orders &#8213; '+this.months[month]+' '+year,
    _Hotel.element('div',{},[
      _Hotel.select('month',month,_Hotel.arrayToObject(this.months),function(){
        _HotelHousekeeping.requestOrders(this.value,this.dataset.year);
      },{month,year}),
      _Hotel.select('year',year,_Hotel.getYears(),function(){
        _HotelHousekeeping.requestOrders(this.dataset.month,this.value);
      },{month,year}),
      table,
    ]),
  );
  /* header */
  let add=_Hotel.button('Add','green','plus',function(){

  }),
  row=table.row(
    'RegID',
    'Date',
    _Hotel.alias('po_estimate'),
    _Hotel.alias('po_status'),
    _Hotel.alias('po_uid'),
    _Hotel.alias('po_note'),
    add,
  ).header(),
  statuses=[
    'Pending',
    'Done',
    'Approved',
    'Draft',
  ];
  /* each */
  for(let order of orders){
    let nd=new Date(order.time*1000),
    date=[
      nd.getFullYear(),
      (nd.getMonth()+1).toString().padStart(2,'0'),
      nd.getDate().toString().padStart(2,'0'),
    ].join('-'),
    edit=_Hotel.button('Edit','blue','edit',function(){

    },{regid:order.regid}),
    row=table.row(
      order.regid,
      date,
      _Hotel.parseNominal(order.estimate),
      statuses.hasOwnProperty(order.status)?statuses[order.status]:order.status,
      _Hotel.getValueById(order.uid,'name',users),
      order.note,
      edit,
    );
  }
  
  /*  */
  /*  */
  
  
/*

purchase_order
            0: (aid) [id:10] => LDB_AID
            1: (int) [regid:10] => LDB_BLANK
            2: (time) [time:10] => LDB_TIME
            3: (int) [uid:10] => LDB_BLANK
            4: (int) [estimate:10] => "0"
            5: (int) [status:2] => "0"
            6: (string) [note:100] => LDB_BLANK
            7: (string) [data:2048] => LDB_BLANK

items
  category: "25"
  division: "purchasing"
  id: 2
  mark: "BINTANG"
  name: "KOPI BUBUK BINTANG"
  nominal: "80000"
  purchase: "75000"
  time: 1723457036​​​​
  unit: "Kg"

*/
};

/* room status */
this.roomStatus=async function(){
  _Hotel.main.loader();
  let allowedStatus=[1,4,5,6,7,10,12,13,17], 
  table=await _Hotel.roomStatus(allowedStatus);
  _Hotel.main.put('Room Status',table);
  table.interval();
};

/* get coa name from this.coa array */
this.getCoaName=function(id){
  return _Hotel.getValueById(parseInt(id),'name',this.coa);
};
return this.init();
};



/* HotelFrontOffice */
;function HotelFrontOffice(){
/* bring to global variable */
window._HotelFrontOffice=this;
this.prices=[];
this.rooms=[];
this.roomStatusInfo={};
this.roomStatusInterval=false;
this.coa=[];
this.extrabills=[];
/* methods cloned from main _Hotel object */
this.paymentMethods=_Hotel.paymentMethods;
this.cartDataMaxLength=2048;
this.extrabillStatus=['Unpaid','Paid'];
this.tTypes={
  0:'',
  1:'',
  2:'Registration',
  3:'Extrabill',
  4:'Request Order',
  5:'Payment',
  6:'Room Service',
  7:'Restaurant',
  8:'Payment Restaurant',
  9:'Expenses',
};
this.units=[
  '1/2 Lusin',
  'Batang',
  'Biji',
  'Bill',
  'Botol',
  'Box',
  'Buah',
  'Buku',
  'Bungkus',
  'Dus',
  'Ekor',
  'Galon',
  'Gelas',
  'Gram',
  'Ikat',
  'Jerigen',
  'Kaleng',
  'Karung',
  'Keping',
  'Kg',
  'Kotak',
  'Lembar',
  'Liter',
  'Lusin',
  'Meter',
  'Ons',
  'Pack',
  'Pasang',
  'Pcs',
  'Porsi',
  'Potong',
  'Refill',
  'Renceng',
  'Rim',
  'Roll',
  'Sachet',
  'Sak',
  'Set',
  'Sisir',
  'Sisir',
  'Tabung',
  'Unit',
];
this.months=[
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
this.greets=[
  'Sir',
  'Madam',
  'Mr',
  'Mrs',
  'Ms',
  'Miss',
];
this.dates=[31,
  Math.floor((new Date).getFullYear()/4)==(new Date).getFullYear()?29:28,
  31,30,31,30,31,31,30,31,30,31];
/* item categories */
this.itemCategories=[
  'Unknown',
  'Land (Asset)',
  'Building (Asset)',
  'Equipment (Asset)',
  'Electronic (Asset)',
  'Vehicle (Asset)',
  'Furniture (Asset)',
  'Perishable',
  'Printing Material',
  'Supplies',
  'Drugstore',
  'Groceries',
  'Chemical',
  'Linen',
  'Glass ware, China ware, Silver ware',
  'Electrical Tools, Equipment and Supply',
];
this.categories={
  regular:'Regular',
  corporate:'Corporate',
  government:'Government',
  airlines:'Airlines',
  travel_agent:'Travel Agent',
};


/* -------------------------- init as contructor ----------------------- */
this.init=function(){
  return this;
};
/* menus -- [required] */
this.menus=function(){
  let menus=[
    {
      name:'Dashboard',
      icon:'dashboard',
      callback:function(){
        _HotelFrontOffice.dashboard();
      },
    },
    {
      name:'Reservation Form',
      icon:'list-alt',
      callback:function(){
        _HotelFrontOffice.reservationPage();
      },
    },
    {
      name:'Payments',
      icon:'money',
      callback:function(){
        _HotelFrontOffice.paymentPage();
      },
    },
    {
      name:'Petty Cash FO',
      icon:'envelope-o',
      callback:function(){
        _Hotel.adjustments(null,null,null,4,'Petty Cash FO');
      },
    },
  ];
  return menus;
};
/* dashboard -- [required] */
this.dashboard=async function(){
  let rooms=[
    {
      name:'Room Calendar',
      icon:'calendar',
      callback:function(){
        _HotelFrontOffice.roomCalendar();
      },
    },
    {
      name:'Reservation Form',
      icon:'list-alt',
      callback:function(){
        _HotelFrontOffice.reservationPage();
      },
    },
    {
      name:'Registrations',
      icon:'table',
      callback:function(){
        _HotelFrontOffice.registers();
      },
    },
    {
      name:'Reservations',
      icon:'table',
      callback:function(){
        _HotelFrontOffice.registers(1,50,'reservation');
      },
    },
    {
      name:'Room Status',
      icon:'building-o',
      callback:function(){
        _HotelFrontOffice.roomStatus();
      },
    },
    {
      name:'Room Prices',
      icon:'money',
      callback:function(){
        _HotelFrontOffice.roomPrices();
      },
    },
    {
      name:'Change Room',
      icon:'wheelchair-alt',
      callback:function(){
        _HotelFrontOffice.changeRoom();
      },
    },
  ],
  extrabills=[
    {
      name:'Extrabills',
      icon:'wpforms',
      callback:function(){
        _HotelFrontOffice.extrabillPage();
      },
    },
    {
      name:'Extrabill Items',
      icon:'list-ul',
      callback:function(){
        _HotelFrontOffice.extrabillItemsPage();
      },
    },
    {
      name:'Minibar Stocks',
      icon:'inbox',
      callback:function(){
        _HotelFrontOffice.minibarStocks();
      },
    },
  ],
  payments=[
    {
      name:'Payments',
      icon:'money',
      callback:function(){
        _HotelFrontOffice.paymentPage();
      },
    },
    {
      name:'Refund',
      icon:'send',
      callback:function(){
        _Hotel.adjustmentEdit(0,4,'Refund',{
          status:1,
          flow:0,
        },true);
      },
    },
    {
      name:'Petty Cash FO',
      icon:'envelope-o',
      callback:function(){
        _Hotel.adjustments(null,null,null,4,'Petty Cash FO');
      },
    },
  ],
  dailyReports=[
    {
      name:'Revenue',
      icon:'bar-chart',
      callback:function(){
        _HotelFrontOffice.dailyReport('all');
      },
    },
    {
      name:'Room Sales',
      icon:'building-o',
      callback:function(){
        _HotelFrontOffice.dailyReportRoom();
      },
    },
    {
      name:'Cash',
      icon:'money',
      callback:function(){
        _HotelFrontOffice.dailyReport('cash');
      },
    },
    {
      name:'Transfer Mandiri',
      icon:'exchange',
      callback:function(){
        _HotelFrontOffice.dailyReport('wire_mandiri');
      },
    },
    {
      name:'Transfer BRI',
      icon:'exchange',
      callback:function(){
        _HotelFrontOffice.dailyReport('wire_bca');
      },
    },
    {
      name:'Mandiri Debt/Credit',
      icon:'credit-card',
      callback:function(){
        _HotelFrontOffice.dailyReport('card_mandiri');
      },
    },
    {
      name:'BRI Debt/Credit',
      icon:'credit-card',
      callback:function(){
        _HotelFrontOffice.dailyReport('card_bca');
      },
    },
    {
      name:'Petty Cash',
      icon:'money',
      callback:function(){
        _HotelFrontOffice.dailyReport('petty_cash');
      },
    },
    {
      name:'QRIS Mandiri',
      icon:'qrcode',
      callback:function(){
        _HotelFrontOffice.dailyReport('qris_mandiri');
      },
    },
    {
      name:'QRIS BRI',
      icon:'qrcode',
      callback:function(){
        _HotelFrontOffice.dailyReport('qris_bca');
      },
    },
    {
      name:'Account Receivable',
      icon:'recycle',
      callback:function(){
        _HotelFrontOffice.dailyReport('account_receivable');
      },
    },
  ],
  others=[
    {
      name:'Markets',
      icon:'suitcase',
      callback:function(){
        _HotelFrontOffice.markets();
      },
    },
    {
      name:'History',
      icon:'history',
      callback:function(){
        _HotelFrontOffice.history();
      },
    },
    {
      name:'Guests',
      icon:'users',
      callback:function(){
        _HotelFrontOffice.tableGuests();
      },
    },
  ],
  table=_Hotel.table(),
  tableRight=_Hotel.table(),
  double=_Hotel.main.double(table,tableRight),
  row=table.row('Rooms & Registrations').header();
  row=table.row(
    _Hotel.element('div',{
      'class':'dashboard-menu',
    },_Hotel.dashboardMenu(rooms))
  );
  /* main put and full table */
  table.classList.add('table-full');
  tableRight.classList.add('table-full');
  _Hotel.main.put('Dashboard',double);
  /* daily reports */
  row=table.row('Daily Reports').header();
  row=table.row(
    _Hotel.element('div',{
      'class':'dashboard-menu',
    },_Hotel.dashboardMenu(dailyReports))
  );
  /* right section */
  /* payments */
  row=tableRight.row('Payments').header();
  row=tableRight.row(
    _Hotel.element('div',{
      'class':'dashboard-menu',
    },_Hotel.dashboardMenu(payments))
  );
  /* extrabills */
  row=tableRight.row('Extrabills').header();
  row=tableRight.row(
    _Hotel.element('div',{
      'class':'dashboard-menu',
    },_Hotel.dashboardMenu(extrabills))
  );
  /* markets history */
  row=tableRight.row('Others').header();
  row=tableRight.row(
    _Hotel.element('div',{
      'class':'dashboard-menu',
    },_Hotel.dashboardMenu(others))
  );
};
/* room calendar */
this.roomCalendar=async function(){
  _Hotel.main.loader();
  let date=new Date,
  limit=30,
  queries=[
    'select * from registration where '+this.arrivalDepartureQuery(),
    'select * from room',
    'select * from room_status_info',
  ].join(';'), 
  data=await _Hotel.request('queries',queries),
  regs=data[0],
  rooms=data[1],
  roomStatusInfo=data[2],
  table=_Hotel.table(),
  tr,
  mcol=0,
  month=[
    'Rooms',
    this.months[date.getMonth()]+' '+date.getFullYear()
  ],
  days=_Hotel.range(1,limit).map(function(r){
    let date=new Date;
    date.setDate(date.getDate()+(r-1));
    return date.getDate();
  });
  this.rooms=rooms;
  this.roomStatusInfo=roomStatusInfo;
  /* table */
  for(let dt of days){
    mcol++;
    if(dt==1){
      mcol--;
      break;
    }
  }
  if(mcol!=limit){
    month.push(
      this.months[date.getMonth()+1]+' '+date.getFullYear()
    );
  }
  tr=table.row.apply(table,month);
  tr.classList.add('tr-header');
  tr.childNodes[0].setAttribute('colspan',2);
  tr.childNodes[1].setAttribute('colspan',mcol);
  if(tr.childNodes.length>2){
    tr.childNodes[2].setAttribute('colspan',limit-mcol);
  }
  /* table header -- dates */
  tr=table.row.apply(table,[...['Number','Type'],...days]);
  tr.classList.add('tr-header');
  /* ---------- DASHBOARD ---------- */
  _Hotel.main.put('Dashboard',table);
  /*  */
  /* rooms */
  for(let room of rooms){
    let roomo=this.getArrayByRoomNumber(room.number,regs,limit);
    row=table.row.apply(table,[room.number,room.code,...roomo]);
    row.classList.add('room-status');
  }
};
/* room status page */
this.roomStatus=async function(){
  _Hotel.main.loader();
  let allowedStatus=_Hotel.range(0,18),
  allowedStatusOld=[6,14,1,18],
  table=await _Hotel.roomStatus(allowedStatus);
  _Hotel.main.put('Room Status',table);
  table.interval();
};
/* registers page -- registers */
this.registers=async function(page=1,limit=50,pageType='registration'){
  _Hotel.main.loader();
  let start=((parseInt(page,10)-1)*parseInt(limit,10)).toString(),
  dateToday=this.getDateToday(),
  queries=[
    'select * from registration where status=0 and type="'+pageType
      +'" order by id desc limit '+start+','+limit,
    'select id,username from user',
    'select id,number,code from room',
    'select * from coa',
    'select * from extrabill',
  ].join(';'),
  table=_Hotel.table(),
  columns=13,
  data=await _Hotel.request('queries',queries),
  registers=data[0],
  users=data[1],
  rooms=data[2],
  titleOne=pageType=='registration'?'REGISTRATIONS':'RESERVATIONS',
  titleTwo=pageType=='registration'?'Registrations':'Reservations',
  counter=0,
  paySelected=_Hotel.button('Payments','red','money',function(){
    let boxes=document.querySelectorAll('input[type="checkbox"]'),
    res=[],i=boxes.length;
    while(i--){
      let box=boxes[i];
      if(box.checked){
        res.push(box.value);
      }
    }
    if(res.length<1){
      return _Hotel.alert('Error: Invalid selected!','Please select at least one.','error');
    }
    _HotelFrontOffice.paymentForm(res);
  },{
    name:'payment',
  }),
  checkinSelected=_Hotel.button('Checkins','orange','send',async function(){
    let boxes=document.querySelectorAll('input[type="checkbox"]'),
    queries=[],
    trs=[],
    i=boxes.length;
    while(i--){
      let box=boxes[i];
      if(box.checked){
        let nights=parseInt(box.dataset.nights,10),
        date_arrival=_HotelFrontOffice.getDateToday(),
        date_departure=_HotelFrontOffice.getDateToday(nights),
        innerQuery=_Hotel.buildQuery({
          type:'registration',
          date_arrival,
          date_departure,
        });
        queries.push('update registration ('+innerQuery+') where id='+box.value);
        trs.push(document.querySelector('tr[data-id="'+box.value+'"]'));
      }
    }
    if(queries.length<1){
      return _Hotel.alert('Error: Invalid selected!','Please select at least one.','error');
    }
    /* confirm */
    let yes=await _Hotel.confirmX('Checkin selected reservations?');
    if(!yes){return;}
    let loader=_Hotel.loader(),
    res=await _Hotel.request('queries',queries.join(';'));
    loader.remove();
    /* remove all selected row */
    let counter=0;
    for(let tr of trs){
      if(tr){
        counter++;
        tr.remove();
      }
    }
    if(trs.length!=counter){
      await _HotelFrontOffice.registers(1,50,this.dataset.type);
    }
  },{
    name:'checkin',
    type:pageType,
  });
  this.coa=data[3];
  this.extrabills=data[4];
  table.head(titleOne,columns);
  _Hotel.main.put(titleTwo+' #'+page,table);
  table.row(
    'RegID',
    'Guest Name',
    'Room Number',
    'Market Segment',
    'Company Name',
    'Arrival Date',
    'Departure Date',
    'Payment Method',
    'Payment Balance',
    'Officer',
    'Note',
    pageType=='reservation'?checkinSelected:paySelected,
  ).header();
  table.row(
    _Hotel.findRow('regid'),
    _Hotel.findRow('guest_name'),
    _Hotel.findRow('room_number_code'),
    _Hotel.findRow('msegment'),
    _Hotel.findRow('mname'),
    _Hotel.findRow('darrival'),
    _Hotel.findRow('ddeparture'),
    _Hotel.findRow('pmethod'),
    _Hotel.findRow('pbalance'),
    _Hotel.findRow('uname'),
    '',''
  );
  /* ---- rows ----- */
  for(let row of registers){
    counter++;
    let balance=parseInt(row.payment_deposit,10)-parseInt(row.payment_amount,10),
    edit=_Hotel.button('Edit','blue','edit',function(){
      _HotelFrontOffice.reservationEdit(this.dataset.regid);
    },{
      regid:row.regid,
    }),
    view=_Hotel.button('View','green','search',function(){
      _Hotel.dialogView(this.dataset.type,this.dataset.regid);
    },{
      type:2,
      regid:row.regid,
    }),
    xbill=_Hotel.button('Extrabill','orange','wpforms',function(){
      _HotelFrontOffice.extrabillEdit(this.dataset.regid);
    },{
      regid:row.regid+'',
    }),
    pay=_Hotel.button('Payment','red','money',function(){
      _HotelFrontOffice.paymentForm(this.dataset.regid);
    },{
      regid:row.regid+'',
    }),
    payReceipt=_Hotel.button('Receipt','purple','print',function(){
      _HotelFrontOffice.paymentReceiptDP(this.dataset.regid);
    },{
      regid:row.regid,
    }),
    del=_Hotel.button('Delete','red','trash',async function(){
      let yes=await _Hotel.confirmX('Delete this reservation?');
      if(!yes){return;}
      let loader=_Hotel.loader(),
      query='delete from registration where id='+this.dataset.id,
      res=await _Hotel.request('query',query);
      loader.remove();
      if(res==1){
        let tr=document.querySelector('tr[data-regid="'+this.dataset.regid+'"]');
        if(tr){
          tr.remove();
        }else{
          await _HotelFrontOffice.registers(1,50,this.dataset.type);
        }
        return;
      }
      _Hotel.alert('Error: Failed to delete reservation.','','error');
    },{
      id:row.id,
      regid:row.regid,
      type:pageType,
    }),
    checkin=_Hotel.button('Checkin','orange','send',async function(){
      let yes=await _Hotel.confirmX('Checkin this reservation?');
      if(!yes){return;}
      let loader=_Hotel.loader(),
      nights=parseInt(this.dataset.nights,10),
      date_arrival=_HotelFrontOffice.getDateToday(),
      date_departure=_HotelFrontOffice.getDateToday(nights),
      innerQuery=_Hotel.buildQuery({
        type:'registration',
        date_arrival,
        date_departure,
      }),
      query='update registration ('+innerQuery+') where id='+this.dataset.id,
      res=await _Hotel.request('query',query);
      loader.remove();
      if(res==1){
        let tr=document.querySelector('tr[data-regid="'+this.dataset.regid+'"]');
        if(tr){
          tr.remove();
        }else{
          await _HotelFrontOffice.registers(1,50,this.dataset.type);
        }
        return;
      }
      _Hotel.alert('Error: Failed to checkin reservation.','','error');
    },{
      id:row.id,
      regid:row.regid,
      type:pageType,
      nights:row.nights,
    }),
    room_number_code=[
      row.room_number,
      _Hotel.getValueByKey('number',row.room_number,'code',rooms),
    ],
    uname=_Hotel.getValueById(row.employee_id,'username',users),
    mname=_Hotel.alias(row.market_name),
    msegment=_Hotel.alias(row.market_segment),
    pmethod=_Hotel.alias(row.payment_method),
    pbalance=_Hotel.parseNominal(balance),
    darrival=_Hotel.parseDate(row.date_arrival),
    ddeparture=_Hotel.parseDate(row.date_departure),
    checkBox=_Hotel.checkbox('payment['+counter+']',row.regid,'Check Payment'),
    checkBoxer=_Hotel.checkbox('checkin['+counter+']',row.id,'Check In'),
    buttons=pageType=='reservation'?[checkin,edit,del]:[view,xbill,edit,pay,payReceipt],
    stars=pageType=='reservation'?[row.regid,checkBoxer]:[row.regid,checkBox];
    /* checkboxer nights */
    checkBoxer.dataset.nights=row.nights;
    /* write a row */
    td=table.row(
      _Hotel.element('div',{},stars),
      row.guest_name,
      room_number_code.join(' &middot; '),
      msegment,
      mname,
      darrival,
      ddeparture,
      pmethod,
      pbalance,
      uname,
      row.note,
      _Hotel.element('div',{
        'class':'td-buttons',
      },buttons),
    );
    td.childNodes[0].classList.add('td-center');
    td.childNodes[2].classList.add('td-center');
    td.childNodes[8].classList.add('td-center');
    td.childNodes[9].classList.add('td-right');
    td.dataset.id=row.id;
    td.dataset.regid=row.regid;
    td.dataset.guest_name=row.guest_name;
    td.dataset.room_number_code=room_number_code.join(' ');
    td.dataset.uname=uname;
    td.dataset.mname=mname;
    td.dataset.msegment=msegment;
    td.dataset.pmethod=pmethod;
    td.dataset.pbalance=pbalance;
    td.dataset.ddeparture=ddeparture;
    td.dataset.darrival=darrival;
  }
  /* ----- navigators ----- */
  let next=_Hotel.button('Next','orange','arrow-right',function(){
    let limit=parseInt(this.dataset.limit,10),
    page=parseInt(this.dataset.page,10);
    _HotelFrontOffice.registers(page+1,limit);
  },{
    page:page,
    limit:limit,
  }),
  prev=_Hotel.button('Previous','orange','arrow-left',function(){
    let limit=parseInt(this.dataset.limit,10),
    page=parseInt(this.dataset.page,10);
    _HotelFrontOffice.registers(page-1,limit);
  },{
    page:page,
    limit:limit,
  }),
  section=_Hotel.element('div',{
    'class':'row-buttons section',
  },[prev,next]),
  row=table.row(section);
  row.childNodes[0].setAttribute('colspan',columns);
  row.classList.add('tr-header');
  if(page<=1){
    prev.style.display='none';
  }
  if(registers.length<limit){
    next.style.display='none';
  }
};


/* reservation view */
this.reservationView=async function(regid){
  let dialog=await _Hotel.dialogPage(),
  data=await _Hotel.request('queries',[
    'select * from guest',
    'select id,username from user',
    'select * from room',
    'select * from registration where regid='+regid,
  ].join(';')),
  wrap=_Hotel.main.triple(),
  guests=data[0],
  users=data[1],
  rooms=data[2],
  rdata=data[3][0],
  room=_Hotel.getDataByKey('number',rdata.room_number,rooms),
  table=_Hotel.table();
  /* check room available */
  if(typeof room!=='object'||room===null){
    let textInfo='Error: Failed to get room information!';
    return _Hotel.alert(textInfo,'','error');
  }
  
  /* ----- market ----- */
  if(true){
    table.head('MARKET');
    table.row('Transaction Type',rdata.type);
    table.row('Category',rdata.market_category);
    table.row('Segment',rdata.market_segment);
    table.row('Name',rdata.market_name);
    table.classList.add('table-register');
    wrap.left.append(table);
  }
  
  /* ----- guest ----- */
  if(true){
    let guest=_Hotel.getDataById(rdata.guest_id,guests);
    table=_Hotel.table();
    table.head('GUEST');
    table.row('Greet',guest.greet);
    table.row('Name',guest.name);
    table.row('Card ID',guest.card_id);
    table.row('Card Type',guest.card_type);
    table.row('Mobile',guest.phone);
    table.row('Nationality',guest.nationality);
    table.row('Address',guest.address);
    table.row('Email',guest.email);
    table.row('Type',guest.guest_type);
    table.classList.add('table-register');
    wrap.left.append(table);
  }
  
  /* ----- date ----- */
  if(true){
    table=_Hotel.table();
    table.head('DATE');
    table.row('Arrival',_Hotel.parseDate(rdata.date_arrival));
    table.row('Nights',rdata.nights);
    table.row('Departure',_Hotel.parseDate(rdata.date_departure));
    table.classList.add('table-register');
    wrap.center.append(table);
  }
  
  /* ----- room ----- */
  if(true){
    table=_Hotel.table();
    table.head('ROOM');
    table.row('Room Number',rdata.room_number+' &middot; '+room.code);
    table.row('Extra Bed',rdata.extra_bed_count);
    table.row('Extra Bed Nights',rdata.extra_bed_night);
    table.classList.add('table-register');
    wrap.center.append(table);
  }
  
  /* ----- head count ----- */
  if(true){
    table=_Hotel.table();
    table.head('HEAD COUNT');
    table.row('Male',rdata.head_count_male);
    table.row('Female',rdata.head_count_female);
    table.row('Child',rdata.head_count_child);
    table.classList.add('table-register');
    wrap.center.append(table);
  }
  
  /* ----- internal ----- */
  if(true){
    let padded_regid=rdata.regid.toString().padStart(7,'0'), 
    employee_name=_Hotel.getValueById(rdata.employee_id,'username',users);
    table=_Hotel.table();
    table.head('REGISTER');
    table.row('Registration ID',padded_regid);
    table.row('Registered By',employee_name);
    table.row('Note',rdata.note);
    table.classList.add('table-register');
    wrap.right.append(table);
  }
  
  /* ----- payment ----- */
  if(true){
    let rate_price=parseInt(room.normal_rate,10)*parseInt(rdata.nights,10),
    balance_price=parseInt(rdata.payment_deposit,10)-rate_price,
    discount_price=0,
    parsed_price=_Hotel.parseNominal(rate_price),
    parsed_balance=_Hotel.parseNominal(balance_price),
    parsed_discount=_Hotel.parseNominal(discount_price),
    payment_deposit_parsed=_Hotel.element('span',{
      id:'payment_deposit_parsed',
    }).html(_Hotel.parseNominal(rdata.payment_deposit));
    table=_Hotel.table();
    table.head('PAYMENT');
    table.row('Method',this.paymentMethods[rdata.payment_method]);
    table.row('Amount (IDR)',parsed_price);
    table.row('Discount (IDR)',parsed_discount);
    table.row('Deposit (IDR)',payment_deposit_parsed);
    table.row('Balance (IDR)',parsed_balance);
    table.classList.add('table-register');
    wrap.right.append(table);
  }
  
  /* ----- print the output ----- */
  wrap.classList.add('content');
  dialog.put(wrap);
};
/* reservation edit */
this.reservationEdit=async function(regid=0){
  _Hotel.main.loader('Getting form ready...');
  let data=await this.prepareData(false,[
    'select * from registration where regid='+regid,
    'select * from transaction where type=2 and regid='+regid,
  ]),
  wrap=_Hotel.main.triple(),
  guests=data.guests,
  markets=data.markets,
  rooms=data.rooms,
  status=data.status,
  infos=data.infos,
  prices=data.prices,
  rdata=data._data[6].length>0?data._data[6][0]:null,
  trans=data._data[7].length>0?data._data[7][0]:null,
  room_number=this.availableRooms(rooms,status,rdata),
  room=_Hotel.getDataByKey('number',room_number.value,rooms),
  table=_Hotel.table();
  this.rooms=rooms;
  this.prices=prices;
  this.roomStatusInfo=infos;
  /* check register */
  if(rdata===null||trans===null){
    return _Hotel.alert('Error: Failed to read data!','RegID '+regid,'error');
  }
  /* check room available */
  if(typeof room!=='object'||room===null){
    let textInfo='No room available!';
    _Hotel.main.put(textInfo,'');
    return _Hotel.alert(textInfo,'','info');
  }
  
  /* ----- market ----- */
  if(true){
    let market_category=_Hotel.select('market_category',rdata.market_category,{
      regular:'Regular',
      corporate:'Corporate',
      government:'Government',
      airlines:'Airlines',
      travel_agent:'Travel Agent',
    },function(){
      let segmentOld=document.querySelector('select[name="'+this.dataset.segment+'"]'),
      segmentParent=segmentOld.parentNode,
      value=this.value,
      nameOld=document.querySelector('select[name="'+this.dataset.name+'"]'),
      nameParent=nameOld.parentNode,
      segments=_Hotel.getDataByKey('category',value,markets,true),
      segmentsArray=segments.map(v=>v.segment),
      firstSegment=segments.length>0?segments[0].segment:'',
      names=_Hotel.getDataByKey('segment',firstSegment,markets,true),
      namesArray=names.map(v=>v.name.toUpperCase()),
      firstName=names.length>0?names[0].name:'',
      segment=_Hotel.select(this.dataset.segment,firstSegment,segmentsArray,function(){
        let nameOld=document.querySelector('select[name="'+this.dataset.name+'"]'),
        nameParent=nameOld.parentNode,
        names=_Hotel.getDataByKey('segment',this.value,markets,true),
        namesArray=names.map(v=>v.name.toUpperCase()),
        firstName=names.length>0?names[0].name:'',
        name=_Hotel.select(this.dataset.name,firstName,namesArray,function(){
          let discount_input=document.querySelector('input[name="payment_discount"]'),
          price=_Hotel.getValueByKey('name',this.value,'price',markets);
          discount_input.value=price;
          _HotelFrontOffice.reservationChangeState();
        });
        nameOld.remove();
        nameParent.append(name);
        let discount_input=document.querySelector('input[name="payment_discount"]'),
        price=_Hotel.getValueByKey('name',firstName,'price',markets);
        discount_input.value=price;
        _HotelFrontOffice.reservationChangeState();
      },{
        name:this.dataset.name,
      }),
      name=_Hotel.select(this.dataset.name,firstName,namesArray,function(){
        let discount_input=document.querySelector('input[name="payment_discount"]'),
        price=_Hotel.getValueByKey('name',this.value,'price',markets);
        discount_input.value=price;
        _HotelFrontOffice.reservationChangeState();
      });
      temp=false;
      segmentOld.remove();
      segmentParent.append(segment);
      nameOld.remove();
      nameParent.append(name);
      let discount_input=document.querySelector('input[name="payment_discount"]'),
      price=_Hotel.getValueByKey('name',firstName,'price',markets);
      discount_input.value=price;
      _HotelFrontOffice.reservationChangeState();
    },{
      segment:'market_segment',
      name:'market_name',
    }),
    market_segments=_Hotel.getDataByKey('category',rdata.market_category,markets,true)
      .map(v=>v.segment),
    market_segment=_Hotel.select('market_segment',rdata.market_segment,market_segments,function(){
      let nameOld=document.querySelector('select[name="'+this.dataset.name+'"]'),
      nameParent=nameOld.parentNode,
      names=_Hotel.getDataByKey('segment',this.value,markets,true),
      namesArray=names.map(v=>v.name.toUpperCase()),
      firstName=names.length>0?names[0].name:'',
      name=_Hotel.select(this.dataset.name,firstName,namesArray,function(){
        let discount_input=document.querySelector('input[name="payment_discount"]'),
        price=_Hotel.getValueByKey('name',this.value,'price',markets);
        discount_input.value=price;
        _HotelFrontOffice.reservationChangeState();
      });
      nameOld.remove();
      nameParent.append(name);
      let discount_input=document.querySelector('input[name="payment_discount"]'),
      price=_Hotel.getValueByKey('name',firstName,'price',markets);
      discount_input.value=price;
      _HotelFrontOffice.reservationChangeState();
    }),
    market_names=_Hotel.getDataByKey('segment',rdata.market_segment,markets,true)
      .map(v=>v.name.toUpperCase()),
    market_name=_Hotel.select('market_name',rdata.market_name,market_names,function(){
      let discount_input=document.querySelector('input[name="payment_discount"]'),
      price=_Hotel.getValueByKey('name',this.value,'price',markets);
      discount_input.value=price;
      _HotelFrontOffice.reservationChangeState();
    }),
    market_transaction=_Hotel.select('type',rdata.type,{
      reservation:'Reservation',
      registration:'Registration',
    });
    table.head('MARKET');
    table.row('Transaction Type',market_transaction);
    table.row('Category',market_category);
    table.row('Segment',market_segment);
    table.row('Name',market_name);
    table.classList.add('table-register');
    wrap.left.append(table);
  }
  
  /* ----- guest ----- */
  if(true){
    let guest=_Hotel.getDataById(rdata.guest_id,guests),
    guest_registered=_Hotel.input('guest_id',rdata.guest_id,'hidden');
    table=_Hotel.table();
    table.head('GUEST');
    table.row('Greet',guest.greet);
    table.row('Name',guest.name);
    table.row('Card ID',guest.card_id);
    table.row('Card Type',guest.card_type);
    table.row('Mobile',guest.phone);
    table.row('Nationality',guest.nationality);
    table.row('Address',guest.address);
    table.row('Email',guest.email);
    table.row('Type',guest.guest_type);
    table.classList.add('table-register');
    wrap.left.append(table);
    wrap.left.append(guest_registered);
  }
  
  /* ----- date ----- */
  if(true){
    let date_arrival_section=_Hotel.dateSelection({
      id:'date_arrival_section',
      key:'date_arrival',
      value:rdata.date_arrival,
      min:this.getDateToday(),
      max:this.getDateToday(120),
    }),
    date_arrival=date_arrival_section.input,
    date_departure=_Hotel.element('div',{},[
      _Hotel.input('date_departure',this.getDateToday(rdata.nights,rdata.date_arrival),'hidden'),
      _Hotel.element('span',{
        id:'date_readable',
      }).text(_Hotel.parseDate(this.getDateToday(rdata.nights,rdata.date_arrival))),
    ]),
    nights=_Hotel.select('nights',rdata.nights,_Hotel.range(1,120),function(){
      let arr=document.querySelector('input[name="'+this.dataset.arrival+'"]'),
      dep=document.querySelector('input[name="'+this.dataset.departure+'"]'),
      read=document.getElementById(this.dataset.date_readable);
      dep.value=_HotelFrontOffice.getDateToday(this.value,arr.value);
      read.innerText=_Hotel.parseDate(_HotelFrontOffice.getDateToday(this.value,arr.value));
    },{
      arrival:'date_arrival',
      departure:'date_departure',
      date_readable:'date_readable',
    });
    table=_Hotel.table();
    table.head('DATE');
    table.row('Arrival',date_arrival_section);
    table.row('Nights',nights);
    table.row('Departure',date_departure);
    table.classList.add('table-register');
    wrap.center.append(table);
    date_departure.disabled=true;
    date_arrival.dataset.departure='date_departure';
    date_arrival.dataset.date_readable='date_readable';
    date_arrival.dataset.nights='nights';
    date_arrival.addEventListener('change',function(){
      let night=document.querySelector('select[name="'+this.dataset.nights+'"]'),
      dep=document.querySelector('input[name="'+this.dataset.departure+'"]'),
      read=document.getElementById(this.dataset.date_readable);
      dep.value=_HotelFrontOffice.getDateToday(night.value,this.value);
      read.innerText=_Hotel.parseDate(_HotelFrontOffice.getDateToday(night.value,this.value));
    },false);
    nights.addEventListener('change',this.reservationChangeState,false);
  }
  
  /* ----- room ----- */
  if(true){
    let extra_bed_count=_Hotel.select('extra_bed_count',rdata.extra_bed_count,_Hotel.range(0,7)),
    extra_bed_night=_Hotel.select('extra_bed_night',rdata.extra_bed_night,_Hotel.range(0,30));
    table=_Hotel.table();
    table.head('ROOM');
    table.row('Room Number',room_number);
    table.row('Extra Bed',extra_bed_count);
    table.row('Extra Bed Nights',extra_bed_night);
    table.classList.add('table-register');
    wrap.center.append(table);
    room_number.disabled=true;
    extra_bed_count.onchange=this.reservationChangeState;
    extra_bed_night.onchange=this.reservationChangeState;
  }
  
  /* ----- head count ----- */
  if(true){
    let head_count_male=_Hotel.select('head_count_male',rdata.head_count_male,[0,1,2]),
    head_count_female=_Hotel.select('head_count_female',rdata.head_count_female,[0,1,2]),
    head_count_child=_Hotel.select('head_count_child',rdata.head_count_child,[0,1,2]);
    table=_Hotel.table();
    table.head('HEAD COUNT');
    table.row('Male',head_count_male);
    table.row('Female',head_count_female);
    table.row('Child',head_count_child);
    table.classList.add('table-register');
    wrap.center.append(table);
  }
  
  /* ----- internal ----- */
  if(true){
    let padded_regid=regid.toString().padStart(7,'0'), 
    registration_id=_Hotel.element('div',{},[
      _Hotel.element('span').text(padded_regid),
      _Hotel.input('regid',regid,'hidden'),
    ]),
    reg_note=_Hotel.textarea('note',rdata.note,'Note','256',{}),
    employee_name=rdata.employee_id==_Hotel.user.profile_id
      ?_Hotel.user.profile.name
      :' --> '+_Hotel.user.username;
    table=_Hotel.table();
    table.head('REGISTER');
    table.row('Registration ID',registration_id);
    table.row('Registered By',employee_name);
    table.row('Note',reg_note);
    table.classList.add('table-register');
    wrap.right.append(table);
  }
  
  /* ----- payment ----- */
  if(true){
    let rate_price=parseInt(room.normal_rate,10)*parseInt(rdata.nights,10),
    discount_price=parseInt(_Hotel.getValueByKey('name',rdata.market_name,'price',markets),10)||0,
    balance_price=parseInt(rdata.payment_deposit,10)-(rate_price-discount_price),
    parsed_price=_Hotel.parseNominal(rate_price),
    parsed_discount=_Hotel.parseNominal(discount_price),
    parsed_balance=_Hotel.parseNominal(balance_price),
    payment_discount_input=_Hotel.input('payment_discount',discount_price,'hidden'),
    payment_method=_Hotel.select('payment_method',rdata.payment_method,this.paymentMethods),
    payment_deposit=_Hotel.input('payment_deposit',rdata.payment_deposit,'number','Deposit',10),
    payment_deposit_parsed=_Hotel.element('span',{
      id:'payment_deposit_parsed',
    }).html(_Hotel.parseNominal(rdata.payment_deposit)),
    payment_discount=_Hotel.element('div',{},[
      _Hotel.element('span',{
        id:'payment_discount_parsed',
      }).html(parsed_discount),
      payment_discount_input,
    ]),
    payment_amount=_Hotel.element('div',{},[
      _Hotel.element('span',{
        id:'payment_amount_parsed',
      }).html(parsed_price),
      _Hotel.input('payment_amount',rate_price,'hidden')
    ]),
    payment_balance=_Hotel.element('div',{},[
      _Hotel.element('span',{
        id:'payment_balance_parsed',
        'class':balance_price<0?'balance-minus':'balance-plus',
      }).html(parsed_balance),
      _Hotel.input('payment_balance',balance_price,'hidden'),    
    ]);
    console.log(discount_price);
    table=_Hotel.table();
    table.head('PAYMENT');
    table.row('Method',payment_method);
    table.row('Amount (IDR)',payment_amount);
    table.row('Discount (IDR)',payment_discount);
    table.row('Deposit',payment_deposit);
    table.row('&nbsp;&nbsp;&#8594; Deposit (IDR)',payment_deposit_parsed);
    table.row('Balance (IDR)',payment_balance);
    table.classList.add('table-register');
    wrap.right.append(table);
    payment_deposit.onkeyup=this.reservationChangeState;
    payment_method.onkeyup=this.reservationChangeState;
    payment_discount_input.onchange=this.reservationChangeState;
  }

  /* ----- submit ----- */
  let submit=_Hotel.button('Save','blue','save',function(){
    let fdata=_Hotel.formSerialize();
    return _HotelFrontOffice.registrationSave(
      fdata,
      this,
      this.dataset.id,
      this.dataset.tid,
    );
  },{
    id:rdata.id,
    tid:trans.id,
  }),
  employee_id=_Hotel.input('employee_id',_Hotel.user.id,'hidden');
  wrap.right.append(employee_id);
  wrap.right.append(submit);
  
  /* ----- print the output ----- */
  let reditTitle=rdata.type=='reservation'?'Reservation':'Registration';
  _Hotel.main.put('Edit '+reditTitle+' #'+regid,wrap);
};
/* reservation page -- FORM - RESERVATION */
this.reservationPage=async function(){
  _Hotel.main.loader('Getting form ready...');
  let data=await this.prepareData(true),
  wrap=_Hotel.main.triple(),
  guests=data.guests,
  markets=data.markets,
  rooms=data.rooms,
  status=data.status,
  infos=data.infos,
  prices=data.prices,
  regids=data.regids,
  regid=_Hotel.getValueByKey('uid',_Hotel.user.id,'id',regids),
  room_number=this.availableRooms(rooms,status),
  room=_Hotel.getDataByKey('number',room_number.value,rooms),
  table=_Hotel.table();
  this.rooms=rooms;
  this.prices=prices;
  this.roomStatusInfo=infos;
  /* check room available */
  if(room_number.dataset.available==0){
    let textInfo='No room available!';
    _Hotel.main.put(textInfo,'');
    return _Hotel.alert(textInfo,'','info');
  }
  if(typeof room!=='object'||room===null){
    room={
      normal_rate:0,
    };
  }
  
  /* ----- market ----- */
  if(true){
    let market_category=_Hotel.select('market_category','regular',{
      regular:'Regular',
      corporate:'Corporate',
      government:'Government',
      airlines:'Airlines',
      travel_agent:'Travel Agent',
    },function(){
      let segmentOld=document.querySelector('select[name="'+this.dataset.segment+'"]'),
      segmentParent=segmentOld.parentNode,
      value=this.value,
      nameOld=document.querySelector('select[name="'+this.dataset.name+'"]'),
      nameParent=nameOld.parentNode,
      segments=_Hotel.getDataByKey('category',value,markets,true),
      segmentsArray=segments.map(v=>v.segment),
      firstSegment=segments.length>0?segments[0].segment:'',
      names=_Hotel.getDataByKey('segment',firstSegment,markets,true),
      namesArray=names.map(v=>v.name.toUpperCase()),
      firstName=names.length>0?names[0].name:'',
      segment=_Hotel.select(this.dataset.segment,firstSegment,segmentsArray,function(){
        let nameOld=document.querySelector('select[name="'+this.dataset.name+'"]'),
        nameParent=nameOld.parentNode,
        names=_Hotel.getDataByKey('segment',this.value,markets,true),
        namesArray=names.map(v=>v.name.toUpperCase()),
        firstName=names.length>0?names[0].name:'',
        name=_Hotel.select(this.dataset.name,firstName,namesArray,function(){
          let discount_input=document.querySelector('input[name="payment_discount"]'),
          price=_Hotel.getValueByKey('name',this.value,'price',markets);
          discount_input.value=price;
          _HotelFrontOffice.reservationChangeState();
        });
        nameOld.remove();
        nameParent.append(name);
        let discount_input=document.querySelector('input[name="payment_discount"]'),
        price=_Hotel.getValueByKey('name',firstName,'price',markets);
        discount_input.value=price;
        _HotelFrontOffice.reservationChangeState();
      },{
        name:this.dataset.name,
      }),
      name=_Hotel.select(this.dataset.name,firstName,namesArray,function(){
        let discount_input=document.querySelector('input[name="payment_discount"]'),
        price=_Hotel.getValueByKey('name',this.value,'price',markets);
        discount_input.value=price;
        _HotelFrontOffice.reservationChangeState();
      });
      temp=false;
      segmentOld.remove();
      segmentParent.append(segment);
      nameOld.remove();
      nameParent.append(name);
      let discount_input=document.querySelector('input[name="payment_discount"]'),
      price=_Hotel.getValueByKey('name',firstName,'price',markets);
      discount_input.value=price;
      _HotelFrontOffice.reservationChangeState();
    },{
      segment:'market_segment',
      name:'market_name',
    }),
    market_segment=_Hotel.select('market_segment','publish_rate',{
      publish_rate:'Publish Rate',
    }),
    market_name=_Hotel.select('market_name','personal',{
      personal:'Personal',
    }),
    market_transaction=_Hotel.select('market_transaction','reservation',{
      reservation:'Reservation',
      registration:'Registration',
    },function(){
      _Hotel.main.base.title.innerText=[
        this.value.substring(0,1).toUpperCase(),
        this.value.substring(1),
      ].join('');
    });
    table.head('MARKET');
    table.row('Transaction Type',market_transaction);
    table.row('Category',market_category);
    table.row('Segment',market_segment);
    table.row('Name',market_name);
    table.classList.add('table-register');
    wrap.left.append(table);
  }
  
  /* ----- guest ----- */
  if(true){
    let guest_registered=_Hotel.input('guest_registered','0','hidden'), 
    guest_id=_Hotel.input('guest_id','','number','Card ID'),
    guest_card=_Hotel.select('guest_card','KTP',['KTP','SIM','Passport','Other']),
    guest_greet=_Hotel.select('guest_greet','Mr',this.greets),
    guest_mobile=_Hotel.input('guest_mobile','','number','Mobile',20),
    guest_address=_Hotel.textarea('guest_address','','Address',100),
    guest_nationality=_Hotel.findSelect({
      id:'guest_nationality_selector',
      key:'guest_nationality',
      value:'Indonesia',
      data:NATIONS.map(r=>{
        return {
          id:r,
          name:r,
        };
      }),
    }),
    guest_email=_Hotel.input('guest_email','','email','Email',50),
    guest_type=_Hotel.select('guest_type','normal',{
      normal:'Normal',
      vip:'VIP',
      vvip:'VVIP',
      incognito:'Incognito',
    }),
    guest_inject={
      guest_id,
      guest_card,
      guest_greet,
      guest_mobile,
      guest_address,
      guest_nationality,
      guest_email,
      guest_type,
      guest_registered,
    },
    guest_name=_Hotel.findSelect({
      id:'guest_name',
      placeholder:'Guest Name',
      key:'guest_name',
      value:'',
      data:guests,
      inject:guest_inject,
      callback:function(res,inj){
        res.main.slave.input  .value = res.name;
        res.main.slave.result .value = res.name;
        inj.guest_id          .value = res.data.card_id;
        inj.guest_card        .value = res.data.card_type;
        inj.guest_greet       .value = res.data.greet;
        inj.guest_mobile      .value = res.data.phone;
        inj.guest_address     .value = res.data.address;
        inj.guest_nationality .value = res.data.nationality;
        inj.guest_email       .value = res.data.email;
        inj.guest_type        .value = res.data.guest_type;
        inj.guest_registered  .value = res.data.id;
      },
    });
    guest_id.addEventListener('blur',function(){
      let val=this.value.replace(/[^\d]+/g,'');
    },false);
    table=_Hotel.table();
    table.head('GUEST');
    table.row('Greet',guest_greet);
    table.row('Name',guest_name);
    table.row('Card ID',guest_id);
    table.row('Card Type',guest_card);
    table.row('Mobile',guest_mobile);
    table.row('Nationality',guest_nationality);
    table.row('Address',guest_address);
    table.row('Email',guest_email);
    table.row('Type',guest_type);
    table.classList.add('table-register');
    wrap.left.append(table);
    wrap.left.append(guest_registered);
    guest_name.guest_names=guests.map(r=>r.name);
    guest_name.guest_registered=guest_registered;
    guest_name.guest_inject=guest_inject;
    guest_name.addEventListener('keyup',function(){
      let val=this.slave.input.value.toUpperCase();
      this.slave.input.value=val;
      this.slave.result.value=val;
      if(this.guest_names.indexOf(val)<0){
        this.guest_registered.value='0';
      }
    },false);
  }
  
  /* ----- date ----- */
  if(true){
    let date_arrival_section=_Hotel.dateSelection({
      id:'date_arrival_section',
      key:'date_arrival',
      value:this.getDateToday(),
      min:this.getDateToday(),
      max:this.getDateToday(120),
    }),
    date_arrival=date_arrival_section.input,
    date_arrival_old=_Hotel.input('date_arrival',this.getDateToday(),'date','',100,{
      departure:'date_departure',
      date_readable:'date_readable',
      nights:'nights',
    }),
    date_departure=_Hotel.element('div',{},[
      _Hotel.input('date_departure',this.getDateToday(1),'hidden'),
      _Hotel.element('span',{
        id:'date_readable',
      }).text(_Hotel.parseDate(this.getDateToday(1))),
    ]),
    nights=_Hotel.select('nights','1',_Hotel.range(1,120),function(){
      let arr=document.querySelector('input[name="'+this.dataset.arrival+'"]'),
      dep=document.querySelector('input[name="'+this.dataset.departure+'"]'),
      read=document.getElementById(this.dataset.date_readable);
      dep.value=_HotelFrontOffice.getDateToday(this.value,arr.value);
      read.innerText=_Hotel.parseDate(_HotelFrontOffice.getDateToday(this.value,arr.value));
    },{
      arrival:'date_arrival',
      departure:'date_departure',
      date_readable:'date_readable',
    });
    table=_Hotel.table();
    table.head('DATE');
    table.row('Arrival',date_arrival_section);
    table.row('Nights',nights);
    table.row('Departure',date_departure);
    table.classList.add('table-register');
    wrap.center.append(table);
    date_departure.disabled=true;
    date_arrival.dataset.departure='date_departure';
    date_arrival.dataset.date_readable='date_readable';
    date_arrival.dataset.nights='nights';
    date_arrival.addEventListener('change',function(){
      let night=document.querySelector('select[name="'+this.dataset.nights+'"]'),
      dep=document.querySelector('input[name="'+this.dataset.departure+'"]'),
      read=document.getElementById(this.dataset.date_readable);
      dep.value=_HotelFrontOffice.getDateToday(night.value,this.value);
      read.innerText=_Hotel.parseDate(_HotelFrontOffice.getDateToday(night.value,this.value));
    },false);
    date_arrival_old.min=this.getDateToday();
    nights.addEventListener('change',this.reservationChangeState,false);
  }
  
  /* ----- room ----- */
  if(true){
    let extra_bed_count=_Hotel.select('extra_bed_count','0',_Hotel.range(0,7)),
    extra_bed_night=_Hotel.select('extra_bed_night','0',_Hotel.range(0,30)),
    checkers=_Hotel.element('div',{
      'class':'room-checker',
      'id':'room-checker',
    },[]);
    table=_Hotel.table();
    table.head('ROOM');
    table.row('Room Number',_Hotel.element('div',{},[room_number,checkers]));
    table.row('Extra Bed',extra_bed_count);
    table.row('Extra Bed Nights',extra_bed_night);
    table.classList.add('table-register');
    wrap.center.append(table);
    room_number.onchange=this.reservationChangeState;
    extra_bed_count.onchange=this.reservationChangeState;
    extra_bed_night.onchange=this.reservationChangeState;
  }
  
  /* ----- head count ----- */
  if(true){
    let head_count_male=_Hotel.select('head_count_male','0',[0,1,2]),
    head_count_female=_Hotel.select('head_count_female','0',[0,1,2]),
    head_count_child=_Hotel.select('head_count_child','0',[0,1,2]);
    table=_Hotel.table();
    table.head('HEAD COUNT');
    table.row('Male',head_count_male);
    table.row('Female',head_count_female);
    table.row('Child',head_count_child);
    table.classList.add('table-register');
    wrap.center.append(table);
  }
  
  /* ----- internal ----- */
  if(true){
    let padded_regid=regid.toString().padStart(7,'0'), 
    registration_id=_Hotel.input('registration_id',padded_regid,'number'),
    reg_note=_Hotel.textarea('note','','Note','256',{}),
    employee_name=_Hotel.user.username;
    table=_Hotel.table();
    table.head('REGISTER');
    table.row('Registration ID',registration_id);
    table.row('Registered By',employee_name);
    table.row('Note',reg_note);
    table.classList.add('table-register');
    wrap.right.append(table);
    registration_id.disabled=true;
  }
  
  /* ----- payment ----- */
  if(true){
    let balance_price=parseInt(room.normal_rate)*-1,
    discount_price=0,
    parsed_price=_Hotel.parseNominal(room.normal_rate),
    parsed_balance=_Hotel.parseNominal(balance_price),
    parsed_discount=_Hotel.parseNominal(discount_price),
    payment_discount_input=_Hotel.input('payment_discount',discount_price,'hidden'),
    payment_method=_Hotel.select('payment_method','cash',this.paymentMethods),
    payment_deposit=_Hotel.input('payment_deposit','0','number','Deposit',10),
    payment_deposit_parsed=_Hotel.element('span',{
      id:'payment_deposit_parsed',
    }).html(_Hotel.parseNominal(0)),
    payment_discount=_Hotel.element('div',{},[
      _Hotel.element('span',{
        id:'payment_discount_parsed',
      }).html(parsed_discount),
      payment_discount_input,
    ]),
    payment_amount=_Hotel.element('div',{},[
      _Hotel.element('span',{
        id:'payment_amount_parsed',
      }).html(parsed_price),
      _Hotel.input('payment_amount',room.normal_rate,'hidden')
    ]),
    payment_balance=_Hotel.element('div',{},[
      _Hotel.element('span',{
        id:'payment_balance_parsed',
        'class':balance_price<0?'balance-minus':'balance-plus',
      }).html(parsed_balance),
      _Hotel.input('payment_balance',balance_price,'hidden'),    
    ]);
    table=_Hotel.table();
    table.head('PAYMENT');
    table.row('Method',payment_method);
    table.row('Amount (IDR)',payment_amount);
    table.row('Discount (IDR)',payment_discount);
    table.row('Deposit',payment_deposit);
    table.row('&nbsp;&nbsp;&#8594; Deposit (IDR)',payment_deposit_parsed);
    table.row('Balance (IDR)',payment_balance);
    table.classList.add('table-register');
    wrap.right.append(table);
    payment_deposit.onkeyup=this.reservationChangeState;
    payment_method.onkeyup=this.reservationChangeState;
    payment_discount_input.onchange=this.reservationChangeState;
  }
  
  /* ----- submit ----- */
  let submit=_Hotel.button('Proceed','blue','send',function(){
    let fdata=_Hotel.formSerialize();
    return _HotelFrontOffice.reservationSend(fdata,this);
  }),
  employee_id=_Hotel.input('employee_id',_Hotel.user.id,'hidden');
  wrap.right.append(employee_id);
  wrap.right.append(submit);
  
  /* ----- print the output ----- */
  _Hotel.main.put('Reservation',wrap);
};


/* change room add */
this.changeRoomAdd=async function(){
  _Hotel.main.loader();
  let queries=[
    'select * from room',
    'select * from registration where status=0',
    'select id,card_id,name from guest',
    'select * from room_status',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  rooms=data[0],
  regs=data[1],
  guests=data[2],
  status=data[3],
  table=_Hotel.table(),
  section=_Hotel.element('div',{
    'class':'section row-buttons',
  });
  /* put content */
  _Hotel.main.put('Add Change Room',_Hotel.main.double(table,section));
  table.classList.add('table-register');
  /* hidden inputs */
  let freg=regs[0],
  guest=_Hotel.getDataById(freg.guest_id,guests),
  guest_name=_Hotel.input('guest_name',guest.name,'hidden'),
  guest_id=_Hotel.input('guest_id',guest.id,'hidden'),
  guest_card_id=_Hotel.input('guest_card_id',guest.card_id,'hidden'),
  uid=_Hotel.input('uid',_Hotel.user.id,'hidden');
  /* room from */
  let roomFrom={},
  firstRoom=regs[0].room_number;
  for(let reg of regs){
    let guest=_Hotel.getDataById(reg.guest_id,guests),
    room=_Hotel.getDataByKey('number',reg.room_number,rooms);
    roomFrom[reg.room_number]=reg.room_number+' ('+room.code+') '+guest.name;
  }
  let roomFromSelect=_Hotel.select('from',firstRoom,roomFrom,function(){
    let reg=_Hotel.getDataByKey('room_number',this.value,this.regs),
    guest=_Hotel.getDataById(reg.guest_id,this.guests);
    this.guest_name.value=guest.name;
    this.guest_id.value=guest.id;
    this.guest_card_id.value=guest.card_id;
  });
  roomFromSelect.rooms=rooms;
  roomFromSelect.guests=guests;
  roomFromSelect.regs=regs;
  roomFromSelect.guest_id=guest_id;
  roomFromSelect.guest_card_id=guest_card_id;
  roomFromSelect.guest_name=guest_name;
  table.row('Room From',roomFromSelect);
  /* room to */
  let roomTo=this.availableRooms(rooms,status);
  table.row('Room To',roomTo);
  /* note */
  table.row('Note',_Hotel.element('div',{},[
    _Hotel.textarea('note','','Note...',100),
    guest_id,
    guest_card_id,
    guest_name,
    uid,
  ]));
  /* submit */
  let save=_Hotel.button('Save','blue','save',function(){
    let fdata=_Hotel.formSerialize(),
    loader=_Hotel.loader(),
    reg=_Hotel.getDataByKey('room_number',fdata.from,this.regs),
    roomFrom=_Hotel.getDataByKey('number',fdata.from,this.rooms),
    roomTo=_Hotel.getDataByKey('number',fdata.room_number,this.rooms);
    fdata.to=fdata.room_number;
    delete fdata.room_number;
    let queries=[
      'update room_status (code=4) where room_id='+roomFrom.id,
      'update room_status (code=14) where room_id='+roomTo.id,
      'update registration (room_number='+fdata.to+') where id='+reg.id,
      'insert into change_room '+_Hotel.buildQuery(fdata),
    ].join(';'),
    res=_Hotel.request('queries',queries);
    loader.remove();
    _HotelFrontOffice.changeRoom();
  });
  save.rooms=rooms;
  save.regs=regs;
  section.append(save);
  /*  */
};
/* change room */
this.changeRoom=async function(){
  _Hotel.main.loader();
  let queries=[
    'select * from room',
    'select * from change_room order by id desc',
    'select id,username as name from user',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  rooms=data[0],
  changes=data[1],
  users=data[2],
  table=_Hotel.table(),
  add=_Hotel.button('Add','green','plus',function(){
    _HotelFrontOffice.changeRoomAdd();
  });
  /* put content */
  _Hotel.main.put('Change Room',table);
  /* header */
  let row=table.row(
    'No',
    _Hotel.alias('Date'),
    _Hotel.alias('card_id'),
    _Hotel.alias('guest_name'),
    _Hotel.alias('Description'),
    _Hotel.alias('Note'),
    _Hotel.alias('Officer'),
    add,
  ).header(),
  counter=0;
  /* each */
  for(let d of changes){
    counter++;
    let nd=new Date(d.time*1000),
    date=[
      nd.getFullYear(),
      (nd.getMonth()+1).toString().padStart(2,'0'),
      nd.getDate().toString().padStart(2,'0'),
    ].join('-'),
    from=_Hotel.getDataByKey('number',d.from,rooms),
    to=_Hotel.getDataByKey('number',d.to,rooms),
    desc='From '+from.name+' '+from.type+' '+from.number
      +' To '+to.name+' '+to.type+' '+to.number,
    oname=_Hotel.getValueById(d.uid,'name',users),
    row=table.row(
      counter,
      date,
      d.guest_card_id,
      d.guest_name,
      desc,
      d.note,
      oname,
      '',
    );
    row.childNodes[0].classList.add('td-center');
  }
  /*  */
};

/* table guests */
this.tableGuests=async function(){
  _Hotel.main.loader();
  let queries=[
    'select * from guest',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  guests=data[0],
  table=_Hotel.table();
  /* put content */
  _Hotel.main.put('Guests',table);
  /* table header */
  let add=_Hotel.button('Add','green','user-plus',function(){
    _HotelFrontOffice.tableGuestEdit();
  }),
  row=table.row(
    _Hotel.alias('guest_id'),
    _Hotel.alias('guest_name'),
    _Hotel.alias('guest_card_type'),
    _Hotel.alias('guest_card_id'),
    add,
  ).header();
  /* finder */
  row=table.row(
    _Hotel.findRow('id'),
    _Hotel.findRow('name'),
    _Hotel.findRow('card_type'),
    _Hotel.findRow('card_id'),
    '',
  );
  row.childNodes[0].style.maxWidth='90px';
  /* each guests */
  for(let guest of guests){
    let edit=_Hotel.button('Edit','blue','edit',function(){
      _HotelFrontOffice.tableGuestEdit(this.dataset.id);
    },{id:guest.id}), 
    row=table.row(
      guest.id,
      guest.name,
      guest.card_type,
      guest.card_id,
      edit,
    );
    row.childNodes[0].classList.add('td-center');
    row.dataset.id=guest.id;
    row.dataset.name=guest.name;
    row.dataset.card_type=guest.card_type;
    row.dataset.card_id=guest.card_id;
  }
};
/* table guest edit/add */
this.tableGuestEdit=async function(id=0){
  _Hotel.main.loader();
  /* default guest data */
  let guest={
    id:0,
    name:'',
    position:'guest',
    card_id:'',
    card_type:'KTP',
    address:'',
    birthdate:'',
    birthplace:'',
    gender:1,
    phone:'',
    email:'',
    nationality:'Indonesia',
    greet:'Mr',
    guest_type:'normal',
  },
  cardTypes=['KTP','SIM','Passport','Other'],
  guestTypes={
    normal:'Normal',
    vip:'VIP',
    vvip:'VVIP',
    incognito:'Incognito',
  },
  greets=this.greets,
  del=_Hotel.button('Delete','red','trash',async function(){
    let yes=await _Hotel.confirmX('Delete this guest?');
    if(!yes){return;}
    let loader=_Hotel.loader(),
    query='delete from guest where id='+this.dataset.id,
    res=await _Hotel.request('query',query);
    loader.remove();
    _HotelFrontOffice.tableGuests();
  },{id}),
  save=_Hotel.button('Save','blue','save',async function(){
    let fdata=_Hotel.formSerialize();
    fdata.gender=fdata.greet=='Mr'||fdata.greet=='Sir'?1:0;
    let loader=_Hotel.loader(),
    innerQuery=_Hotel.buildQuery(fdata),
    query=this.dataset.id==0
      ?'insert into guest '+innerQuery
      :'update guest ('+innerQuery+') where id='+this.dataset.id,
    res=await _Hotel.request('query',query);
    loader.remove();
    _HotelFrontOffice.tableGuests();
  },{id}),
  table=_Hotel.table(),
  section=_Hotel.element('div',{
    'class':'section row-buttons',
  },[save,id==0?'':del]);
  /* none zero id */
  if(id!=0){
    let queries=[
      'select * from guest where id='+id,
    ].join(';'),
    data=await _Hotel.request('queries',queries),
    guests=data[0];
    if(guests.length<1){
      return _Hotel.alert('Error: Failed to get guest data!','','error');
    }
    guest=guests[0];
  }
  /* put content */
  let title=(id==0?'Add':'Edit')+' Guest '+(id==0?'':'#'+id);
  _Hotel.main.put(title,_Hotel.main.double(table,section));
  table.classList.add('table-register');
  /* prepare for each */
  let passes=['id','position','time','gender','religion',
    'group_name','member_id','birthdate','birthplace'];
  /* each guest data */
  for(let key in guest){
    let value=guest[key],
    val=_Hotel.input(key,value,'text'),
    alias=_Hotel.alias('guest_'+key);
    if(passes.indexOf(key)>=0){
      continue;
    }else if(key=='nationality'){
      val=_Hotel.select(key,value,NATIONS);
    }else if(key=='card_type'){
      val=_Hotel.select(key,value,cardTypes);
    }else if(key=='greet'){
      val=_Hotel.select(key,value,greets);
    }else if(key=='guest_type'){
      val=_Hotel.select(key,value,guestTypes);
    }else if(key=='address'){
      val=_Hotel.textarea(key,value,alias);
    }
    let row=table.row(alias,val);
  }
};


/* room prices */
this.roomPrices=async function(){
  _Hotel.main.loader();
  let query='select * from room',
  data=await _Hotel.request('query',query),
  table=_Hotel.table(),
  row=table.row(
    _Hotel.alias('room_number'),
    _Hotel.alias('room_floor'),
    _Hotel.alias('room_code'),
    _Hotel.alias('room_type'),
    _Hotel.alias('room_normal_rate'),
    '',
  ).header();
  _Hotel.main.put('Room Prices',table);
  /* each */
  for(let room of data){
    let nprice=_Hotel.parseNominal(room.normal_rate),
    edit=_Hotel.button('Edit','blue','edit',function(){
      _HotelFrontOffice.roomPriceEdit(this.dataset.id);
    },{
      id:room.id,
    }),
    row=table.row(
      room.number,
      room.floor,
      room.code,
      room.name+' '+room.type,
      nprice,
      edit,
    );
    row.childNodes[0].classList.add('td-center');
    row.childNodes[1].classList.add('td-center');
    row.childNodes[2].classList.add('td-center');
    row.childNodes[4].classList.add('td-right');
  }
};
/* room price edit */
this.roomPriceEdit=async function(id=0){
  _Hotel.main.loader();
  let query='select * from room where id='+id,
  data=await _Hotel.request('query',query),
  section=_Hotel.element('div',{
    'class':'section row-buttons',
  }),
  table=_Hotel.table();
  table.classList.add('table-register');
  _Hotel.main.put(
    'Edit Room Price #'+id,
    _Hotel.main.double(table,section),
  );
  if(data.length==0){
    return _Hotel.alert('Error: Invalid room ID.','','error');
  }
  /* form */
  let room=data[0],
  passes=['id','time','smoking','vip','tax','six_hours','weekend_rate'];
  for(let key in room){
    let value=room[key],
    alias=_Hotel.alias('room_'+key),
    val=value;
    if(passes.indexOf(key)>=0){
      continue;
    }
    if(key=='normal_rate'){
      val=_Hotel.input(key,value,'number',alias,10)
    }
    row=table.row(alias,val);
  }
  /* button */
  let save=_Hotel.button('Save','blue','save',async function(){
    let loader=_Hotel.loader(),
    fdata=_Hotel.formSerialize(),
    innerQuery=_Hotel.buildQuery(fdata),
    query='update room ('+innerQuery+') where id='+this.dataset.id,
    res=await _Hotel.request('query',query);
    loader.remove();
    _HotelFrontOffice.roomPrices();
  },{id});
  section.append(save);
};


/* extra bill page */
this.extrabillPage=async function(){
  _Hotel.main.loader();
  let queries=[
    'select * from extrabill',
    'select * from coa',
    'select * from extrabill_cart order by id desc',
    'select id,username from user',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  prices=data[0],
  coa=data[1],
  xbills=data[2],
  users=data[3],
  table=_Hotel.table(),
  add=_Hotel.button('Add','green','plus',function(){
    _HotelFrontOffice.extrabillEdit();
  }),
  section=_Hotel.element('div',{},[
    _Hotel.element('div').text('Total: '+xbills.length+' rows'),
    table,
  ]),
  row=table.row(
    'RegID',
    'Total',
    'Officer',
    'Date',
    'Status',
    '',
  ).header();
  this.coa=coa;
  this.extrabills=prices;
  _Hotel.main.put('Extrabills',section);
  row=table.row(
    _Hotel.findRow('regid'),
    _Hotel.findRow('total'),
    _Hotel.findRow('uname'),
    _Hotel.findRow('bdate'),
    _Hotel.findRow('bstatus'),
    '',
  );
  for(let cart of xbills){
    let uname=_Hotel.getValueById(cart.uid,'username',users),
    bdate=_Hotel.parseDate(parseInt(cart.time,10)*1000),
    bstatus=this.extrabillStatus[cart.status],
    edit=_Hotel.button('Edit','blue','edit',function(){
      _HotelFrontOffice.extrabillEdit(this.dataset.regid);
    },{
      regid:cart.regid,
    });
    view=_Hotel.button('View','green','search',function(){
      _Hotel.dialogView(this.dataset.type,this.dataset.regid);
    },{
      type:3,
      regid:cart.regid,
    }),
    row=table.row(
      cart.regid.toString().padStart(7,'0'),
      _Hotel.parseNominal(cart.total),
      uname,
      bdate,
      bstatus,
      cart.status==0?edit:view,
    );
    row.id='row-'+cart.regid;
    row.dataset.regid=cart.regid;
    row.dataset.total=cart.total;
    row.dataset.uname=uname;
    row.dataset.bdate=bdate;
    row.dataset.bstatus=bstatus;
    row.childNodes[0].classList.add('td-center');
    row.childNodes[1].classList.add('td-right');
  }
};
/* extra bill view */
this.extrabillView=async function(regid=0){
  let dialog=await _Hotel.dialogPage(),
  queries=[
    'select * from extrabill_cart where regid='+regid,
    'select * from coa',
    'select * from extrabill',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  cart=data[0].length>0?data[0][0]:null;
  if(cart==null){
    return _Hotel.alert('Error: Failed to get extrabill data!','','error')
  }
  this.coa=data[1];
  this.extrabills=data[2];
  let cartData=_Hotel.parseJSON(cart.data),
  table=_Hotel.table(),
  tableX=_Hotel.table();
  dialog.put(_Hotel.element('div',{},[table,tableX]));
  table.dataset.counter='1';
  table.head('Extrabill #'+regid,6);
  table.row(
    'No',
    _Hotel.alias('item_name'),
    _Hotel.alias('category'),
    _Hotel.alias('item_price'),
    _Hotel.alias('item_count'),
    _Hotel.alias('item_sub_total'),
  ).header();
  /* parse item data */
  cartData=Array.isArray(cartData)?cartData:[];
  for(let cdata of cartData){
    this.extrabillViewAddRow({
      table,
      data:cdata,
    });
  }
  tableX.style.marginTop='30px';
  tableX.row(
    _Hotel.alias('total'),
    _Hotel.parseNominal(cart.total),
  ).header();
};
/* extra bill add row */
this.extrabillViewAddRow=function(config){
  let data=config.hasOwnProperty('data')?config.data:{
    item_id:0,
    coa_id:0,
    count:0,
    price:0,
    subtotal:0,
  },
  counter=parseInt(config.table.dataset.counter,10),
  item=_Hotel.getDataById(data.item_id,this.extrabills)
    ||{
      name:'',
      price:0,
      coa_id:0,
  },
  del=_Hotel.button('Delete','red','trash',function(){
    let el=document.getElementById('row-'+this.dataset.counter);
    if(!el){return;}
    el.remove();
    let gtotal=_HotelFrontOffice.getGrandTotal();
    this.totalHidden.value=gtotal;
    this.totalParsed.innerText=_Hotel.parseNominal(gtotal);
  },{
    counter:counter,
  }),
  row=config.table.row(
    config.table.dataset.counter,
    item.name,
    this.getCoaName(data.coa_id),
    _Hotel.parseNominal(data.price),
    data.count,
    _Hotel.parseNominal(data.subtotal),
  ),
  gtotal=this.getGrandTotal();
  /* row */
  row.childNodes[0].classList.add('td-center');
  row.childNodes[3].classList.add('td-right');
  row.childNodes[5].classList.add('td-right');
  row.id='row-'+counter;
};
/* extra bill add and edit form */
this.extrabillEdit=async function(regid=0){
  _Hotel.main.loader();
  let def={
    id:0,
    regid:regid,
    uid:_Hotel.user.id,
    total:0,
    data:'[]',
  },
  deft={
    id:0,
    regid:regid,
    uid:_Hotel.user.id,
    amount:0,
    deposit:0,
    flow:1,
    type:3,
    date:(new Date).getDate(),
    month:(new Date).getMonth(),
    year:(new Date).getFullYear(),
  },
  queries=[
    'select * from extrabill_cart where regid='+regid,
    'select * from transaction where type=3 and regid='+regid,
    'select * from minibar_stock',
  ].join(';'),
  res=await _Hotel.request('queries',queries),
  cart=res[0].length>0?res[0][0]:def,
  tran=res[1].length>0?res[1][0]:deft,
  stocks=res[2],
  cartData=_Hotel.parseJSON(cart.data),
  table=_Hotel.table(),
  save=_Hotel.button('Save','blue','save',async function(){
    let queries=[],
    fdata=_Hotel.formSerialize(true),
    data=_Hotel.parseJSON(fdata.data),
    adata=_Hotel.objectToArray(data),
    tdata=_Hotel.parseJSON(this.dataset.tdata);
    /* set stocks from form data */
    for(let d of adata){
      let stock=_Hotel.getDataByKey('item_id',d.item_id,this.stocks);
      if(stock===null){continue;}
      let itemStock=parseInt(stock.stock,10)-parseInt(d.count,10),
      stime=Math.ceil((new Date).getTime()/0x3e8);
      itemStock=itemStock<0?0:itemStock;
      queries.push('update minibar_stock (stock='+itemStock
        +'&update='+stime+') where item_id='+d.item_id);
    }
    /* set fdata.data */
    fdata.data=JSON.stringify(adata);
    delete tdata.id;
    /* set transaction amount */
    tdata.amount=fdata.total;
    /* start queries */
    let loader=_Hotel.loader(),
    innerQuery=_Hotel.buildQuery(fdata),
    query=this.dataset.id==0
      ?'insert into extrabill_cart '+innerQuery
      :'update extrabill_cart ('+innerQuery+') where id='+this.dataset.id,
    tInnerQuery=_Hotel.buildQuery(tdata),
    tQuery=this.dataset.tid==0
      ?'insert into transaction '+tInnerQuery
      :'update transaction ('+tInnerQuery+') where id='+this.dataset.tid,
    res=await _Hotel.request('queries',[query,tQuery,...queries].join(';'));
    loader.remove();
    if(res.join('').match(/^11/)){
      return _HotelFrontOffice.extrabillPage();
    }
    _Hotel.alert('Error: Failed to save data!',JSON.stringify(res),'error');
  },{
    id:cart.id,
    tid:tran.id,
    tdata:JSON.stringify(tran),
  }),
  totalHidden=_Hotel.input('total','0','hidden'),
  totalParsed=_Hotel.element('span'),
  totalDiv=_Hotel.element('div',{
    style:'text-align:right;'
  },[
    totalHidden,
    totalParsed,
  ]),
  add=_Hotel.button('Add','green','plus',function(){
    let cart=_Hotel.parseJSON(this.dataset.cart);
    _HotelFrontOffice.extrabillAddRow({
      cart,
      table,
      stocks,
      totalHidden,
      totalParsed,
    });
  },{
    cart:JSON.stringify(cart),
  }),
  tableX=_Hotel.table(),
  section=_Hotel.element('div',{
    'class':'row-buttons section',
  },[
    save,
    _Hotel.input('uid',cart.uid,'hidden'),
    _Hotel.input('regid',cart.regid,'hidden'),
  ]);
  save.stocks=stocks;
  _Hotel.main.put(
    'ExtraBill (RegID: #'+cart.regid+')',
    _Hotel.element('div',{},[table,tableX,section])
  );
  table.dataset.counter='1';
  add.table=table;
  add.totalHidden=totalHidden;
  add.totalParsed=totalParsed;
  table.row(
    'No',
    _Hotel.alias('item_name'),
    _Hotel.alias('category'),
    _Hotel.alias('item_price'),
    _Hotel.alias('item_stock'),
    _Hotel.alias('item_count'),
    _Hotel.alias('item_sub_total'),
    add,
  ).header();
  /* parse item data */
  cartData=Array.isArray(cartData)?cartData:[];
  for(let cdata of cartData){
    this.extrabillAddRow({
      table,
      cart,
      stocks,
      totalHidden,
      totalParsed,
      data:cdata,
    });
  }
  tableX.style.marginTop='30px';
  tableX.row(
    _Hotel.alias('total'),
    totalDiv,
  ).header();
};
/* extra bill add row */
this.extrabillAddRow=function(config){
  let data=config.hasOwnProperty('data')?config.data:{
    item_id:0,
    coa_id:0,
    count:0,
    price:0,
    subtotal:0,
  },
  counter=parseInt(config.table.dataset.counter,10),
  item=_Hotel.getDataById(data.item_id,this.extrabills)
    ||{
      name:'',
      price:0,
      coa_id:0,
    },
  coaName=_Hotel.element('div',{},[
    _Hotel.input('data['+counter+'][coa_id]',data.coa_id,'hidden'),
    _Hotel.element('span').text(this.getCoaName(data.coa_id)),
  ]),
  price=_Hotel.element('div',{},[
    _Hotel.input('data['+counter+'][price]',data.price,'hidden'),
    _Hotel.element('span').text(
      _Hotel.parseNominal(data.price)
    ),
  ]),
  itemStock=_Hotel.getValueByKey('item_id',data.item_id,'stock',config.stocks),
  stock=_Hotel.element('span').text(parseInt(itemStock,10)),
  itemSelect=_Hotel.findSelect({
    id:'item_id_'+counter,
    key:'data['+counter+'][item_id]',
    value:data.item_id,
    data:this.extrabills,
    callback:function(res,inject){
      inject.coaName.childNodes[0].value=res.data.coa_id;
      inject.coaName.childNodes[1].innerText=_HotelFrontOffice.getCoaName(res.data.coa_id);
      inject.price.childNodes[0].value=res.data.price;
      inject.price.childNodes[1].innerText=_Hotel.parseNominal(res.data.price);
      let gtotal=_HotelFrontOffice.getGrandTotal();
      inject.totalHidden.value=gtotal;
      inject.totalParsed.innerText=_Hotel.parseNominal(gtotal);
      itemStock=_Hotel.getValueByKey('item_id',res.id,'stock',inject.stocks)||0;
      inject.stock.innerText=itemStock;
    },
    inject:{
      coaName,
      price,
      totalHidden:config.totalHidden,
      totalParsed:config.totalParsed,
      stock,
      stocks:config.stocks,
    }
  }),
  count=_Hotel.input(
    'data['+counter+'][count]',
    data.count,
    'number',
    _Hotel.alias('item_count'),
    10
  ),
  subtotalHidden=_Hotel.input('data['+counter+'][subtotal]',data.subtotal,'hidden'),
  subtotalParsed=_Hotel.element('span').text(
    _Hotel.parseNominal(data.subtotal)
  ),
  subtotal=_Hotel.element('div',{},[subtotalHidden,subtotalParsed]),
  del=_Hotel.button('Delete','red','trash',function(){
    let el=document.getElementById('row-'+this.dataset.counter);
    if(!el){return;}
    el.remove();
    let gtotal=_HotelFrontOffice.getGrandTotal();
    this.totalHidden.value=gtotal;
    this.totalParsed.innerText=_Hotel.parseNominal(gtotal);
  },{
    counter:counter,
  }),
  row=config.table.row(
    config.table.dataset.counter,
    itemSelect,
    coaName,
    price,
    stock,
    count,
    subtotal,
    del,
  ),
  gtotal=this.getGrandTotal();
  /* row */
  row.childNodes[0].classList.add('td-center');
  row.childNodes[3].classList.add('td-right');
  row.childNodes[5].classList.add('td-right');
  row.id='row-'+counter;
  /* delete button */
  del.totalHidden=config.totalHidden;
  del.totalParsed=config.totalParsed;
  /* item select */
  itemSelect.slave.input.value=item.name;
  itemSelect.coaName=coaName;
  itemSelect.price=price;
  itemSelect.subtotal=subtotal;
  itemSelect.totalHidden=config.totalHidden;
  itemSelect.totalParsed=config.totalParsed;
  /* count */
  count.price=price;
  count.subtotal=subtotal;
  count.totalHidden=config.totalHidden;
  count.totalParsed=config.totalParsed;
  count.stock=stock;
  count.coa=coaName;
  count.addEventListener('keyup',function(){
    let price=parseInt(this.price.childNodes[0].value,10),
    itemStock=parseInt(this.stock.innerText,10),
    value=parseInt(this.value,10),
    isMinibar=this.coa.childNodes[0].value==106?true:false;
    if(value>itemStock&&isMinibar){
      value=itemStock;
      this.value=itemStock;
    }
    subtotal=price*value,
    gtotal=_HotelFrontOffice.getGrandTotal();
    /* subtotal */
    this.subtotal.childNodes[0].value=subtotal;
    this.subtotal.childNodes[1].innerText=_Hotel.parseNominal(subtotal);
    /* total */
    this.totalHidden.value=gtotal;
    this.totalParsed.innerText=_Hotel.parseNominal(gtotal);
  },false);
  /* others */
  config.table.dataset.counter=(counter+1)+'';
  config.totalHidden.value=gtotal;
  config.totalParsed.innerText=_Hotel.parseNominal(gtotal);
};

/* ------------------ master ------------------ */
/* extra bill items page */
this.extrabillItemsPage=async function(){
  _Hotel.main.loader();
  let queries=[
    'select * from extrabill',
    'select * from coa',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  prices=data[0],
  coa=data[1],
  table=_Hotel.table(),
  add=_Hotel.button('Add','green','plus',function(){
    _HotelFrontOffice.extrabillItemEdit();
  }),
  section=_Hotel.element('div',{},[
    _Hotel.element('div').text('Total: '+prices.length+' rows'),
    table,
  ]),
  row=table.row(
    _Hotel.alias('item_id'),
    _Hotel.alias('item_type'),
    _Hotel.alias('item_name'),
    _Hotel.alias('item_price'),
    add,
  ).header();
  this.coa=coa;
  _Hotel.main.put('Extrabill Items',section);
  row=table.row(
    _Hotel.findRow('id'),
    _Hotel.findRow('category'),
    _Hotel.findRow('name'),
    _Hotel.findRow('price'),
    '',
  );
  for(let item of prices){
    let cname=_Hotel.getValueById(item.coa_id,'name',coa),
    edit=_Hotel.button('Edit','blue','edit',function(){
      let data=_Hotel.parseJSON(this.dataset.data);
      _HotelFrontOffice.extrabillItemEdit(data);
    },{
      data:JSON.stringify(item),
    });
    row=table.row(
      item.id,
      cname,
      item.name,
      _Hotel.parseNominal(item.price),
      edit,
    );
    row.childNodes[0].classList.add('td-center');
    row.childNodes[3].classList.add('td-right');
    row.dataset.id=item.id;
    row.dataset.name=item.name;
    row.dataset.category=cname;
    row.dataset.price=item.price;
  }
};
/* extra bill edit and add */
this.extrabillItemEdit=function(data){
  _Hotel.main.loader();
  data=typeof data==='object'&&data!==null?data:{
    id:0,
    price:0,
    name:'',
    coa_id:1,
  };
  let table=_Hotel.table(),
  save=_Hotel.button('Save','blue','save',async function(){
    let fdata=_Hotel.formSerialize(),
    innerQuery=_Hotel.buildQuery(fdata),
    query='';
    if(this.dataset.id==0){
      query='insert into extrabill '+innerQuery;
    }else{
      query='update extrabill ('+innerQuery+') where id='+this.dataset.id;
    }
    let res=await _Hotel.request('query',query);
    if(res==1){
      return _HotelFrontOffice.extrabillItemsPage();
    }
    _Hotel.alert('Error: Failed to save data!',res,'error');
  },{
    id:data.id,
  }),
  del=_Hotel.button('Delete','red','trash',async function(){
    let yes=await _Hotel.confirmX('Delete this item?');
    if(!yes){return;}
    let query='delete from extrabill where id='+this.dataset.id,
    res=_Hotel.request('query',query);
    if(res!=1){
      return _Hotel.alert('Error: Failed to delete item!',res,'error');
    }
    _HotelFrontOffice.extrabillItemsPage();
  },{
    id:data.id,
  }),
  section=_Hotel.element('div',{
    'class':'section row-buttons',
  },[save,(data.id==0?'':del)]),
  select=_Hotel.findSelect({
    id:'coa_id',
    key:'coa_id',
    value:data.coa_id,
    data:this.coa,
    placeholder:_Hotel.alias('item_type'),
  }),
  cname=_Hotel.getValueById(data.coa_id,'name',this.coa),
  title=(data.id==0?'Add':'Edit')+' Extrabill Price '+(data.id==0?'':'#'+data.id),
  content=_Hotel.element('div',{
    style:'min-height:400px',
  },[table,section]);
  _Hotel.main.put(title,content);
  select.slave.input.value=cname;
  table.row(
    _Hotel.alias('item_type'),
    select,
  );
  table.row(
    _Hotel.alias('item_name'),
    _Hotel.input('name',data.name,'text',_Hotel.alias('item_name'),100),
  );
  table.row(
    _Hotel.alias('item_price'),
    _Hotel.input('price',data.price,'number',_Hotel.alias('item_price'),10),
  );
};

/* minibar stocks */
this.minibarStocks=async function(){
  _Hotel.main.loader();
  let queries=[
    'select * from extrabill where coa_id=106',
    'select * from minibar_stock',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  items=data[0],
  stocks=data[1],
  table=_Hotel.table(),
  row=table.row(
    _Hotel.alias('item_id'),
    _Hotel.alias('item_name'),
    _Hotel.alias('item_stock'),
    _Hotel.alias('item_stock_min'),
    _Hotel.alias('item_stock_max'),
    _Hotel.alias('last_update'),
    '',
  ).header(),
  defStock={
    id:0,
    item_id:0,
    stock:0,
    stock_min:0,
    stock_max:10,
    update:0,
  };
  _Hotel.main.put('Minibar Stocks',_Hotel.element('div',{},[
    _Hotel.element('span').text('Total: '+items.length+' rows'),
    table,
  ]));
  row=table.row(
    _Hotel.findRow('id'),
    _Hotel.findRow('name'),
    _Hotel.findRow('stock'),
    _Hotel.findRow('stock_min'),
    _Hotel.findRow('stock_max'),
    _Hotel.findRow('udate'),
    '',
  );
  row.childNodes[0].style.maxWidth='90px';
  row.childNodes[2].style.maxWidth='90px';
  row.childNodes[3].style.maxWidth='90px';
  row.childNodes[4].style.maxWidth='90px';
  for(let item of items){
    let stock=_Hotel.getDataByKey('item_id',item.id,stocks)||defStock,
    edit=_Hotel.button('Edit','blue','edit',function(){
      let stock=_Hotel.parseJSON(this.dataset.data);
      _HotelFrontOffice.minibarStockEdit(
        this.dataset.id,
        this.dataset.name,
        stock,
      );
    },{
      id:item.id,
      name:item.name,
      data:JSON.stringify(stock),
    }),
    udate=_Hotel.parseDatetime(stock.update*0x3e8),
    row=table.row(
      item.id,
      item.name,
      stock.stock,
      stock.stock_min,
      stock.stock_max,
      udate,
      edit,
    );
    row.dataset.id=item.id;
    row.dataset.name=item.name;
    row.dataset.udate=udate;
    row.dataset.stock=stock.stock;
    row.dataset.stock_min=stock.stock_min;
    row.dataset.stock_max=stock.stock_max;
    row.childNodes[0].classList.add('td-center');
    row.childNodes[2].classList.add('td-center');
    row.childNodes[3].classList.add('td-center');
    row.childNodes[4].classList.add('td-center');
  }
};
/* minibar stock edit */
this.minibarStockEdit=async function(id,name,stock){
  _Hotel.main.loader();
  let table=_Hotel.table(),
  row=table.row(
    _Hotel.alias('item_name'),
    name,
  ).header(),
  title='Edit Minibar Stock #'+id,
  pkey=['stock','stock_min','stock_max'],
  save=_Hotel.button('Save','blue','save',async function(){
    let fdata=_Hotel.formSerialize();
    fdata.update=Math.ceil((new Date).getTime()/0x3e8);
    let loader=_Hotel.loader(), 
    innerQuery=_Hotel.buildQuery(fdata), 
    query=this.dataset.id==0
      ?'insert into minibar_stock '+innerQuery
      :'update minibar_stock ('+innerQuery+') where id='+this.dataset.id,
    res=await _Hotel.request('query',query);
    loader.remove();
    if(res!=1){
      return _Hotel.alert('Error: Failed to save stock!',res,'error');
    }
    _HotelFrontOffice.minibarStocks();
  },{
    id:stock.id
  }),
  section=_Hotel.element('div',{
    'class':'section row-buttons',
  },[
    save,
    _Hotel.input('item_id',id,'hidden'),
  ]);
  _Hotel.main.put(title,_Hotel.main.double(table,section));
  for(let k of pkey){
    let key=_Hotel.alias('item_'+k),
    value=stock[k],
    val=_Hotel.input(k,value,'number',key,10);
    table.row(key,val);
  }
};


/* item prices page -- diabled */
this.itemPricesPage=async function(){
  _Hotel.main.loader();
  let queries=[
    'select * from price where division="purchasing"',
    'select * from coa',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  prices=data[0],
  coa=data[1],
  table=_Hotel.table(),
  add=_Hotel.button('Add','green','plus',function(){
    _HotelFrontOffice.itemPriceEdit();
  }),
  section=_Hotel.element('div',{},[
    _Hotel.element('div').text('Total: '+prices.length+' rows'),
    table,
  ]),
  row=table.row(
    _Hotel.alias('item_id'),
    _Hotel.alias('item_name'),
    _Hotel.alias('item_mark'),
    _Hotel.alias('category'),
    _Hotel.alias('selling_price'),
    _Hotel.alias('purchase_price'),
    _Hotel.alias('item_unit'),
    add,
  ).header();
  this.coa=coa;
  _Hotel.main.put('Item Prices',section);
  row=table.row(
    _Hotel.findRow('id'),
    _Hotel.findRow('name'),
    _Hotel.findRow('mark'),
    _Hotel.findRow('category'),
    _Hotel.findRow('nominal'),
    _Hotel.findRow('purchase'),
    _Hotel.findRow('unit'),
    '',
  );
  for(let item of prices){
    let cname=this.getCoaName(item.category),
    edit=_Hotel.button('Edit','blue','edit',function(){
      let data=_Hotel.parseJSON(this.dataset.data);
      _HotelFrontOffice.itemPriceEdit(data);
    },{
      data:JSON.stringify(item),
    });
    row=table.row(
      item.id,
      item.name,
      item.mark,
      cname,
      _Hotel.parseNominal(item.nominal),
      _Hotel.parseNominal(item.purchase),
      item.unit,
      edit,
    );
    row.childNodes[0].classList.add('td-center');
    row.childNodes[4].classList.add('td-right');
    row.childNodes[5].classList.add('td-right');
    row.dataset.id=item.id;
    row.dataset.name=item.name;
    row.dataset.mark=item.mark;
    row.dataset.unit=item.unit;
    row.dataset.category=cname;
    row.dataset.nominal=item.nominal;
    row.dataset.purchase=item.purchase;
  }
};
/* item edit and add -- diabled as parent is */
this.itemPriceEdit=function(data){
  _Hotel.main.loader();
  data=typeof data==='object'&&data!==null?data:{
    id:0,
    category:1,
    nominal:0,
    purchase:0,
    division:'purchasing',
    name:'',
    mark:'',
    unit:'Pcs',
  };
  let table=_Hotel.table(),
  save=_Hotel.button('Save','blue','save',async function(){
    let fdata=_Hotel.formSerialize(),
    innerQuery=_Hotel.buildQuery(fdata),
    query='';
    if(this.dataset.id==0){
      query='insert into price '+innerQuery;
    }else{
      query='update price ('+innerQuery+') where id='+this.dataset.id;
    }
    let res=await _Hotel.request('query',query);
    if(res==1){
      return _HotelFrontOffice.itemPricesPage();
    }
    _Hotel.alert('Error: Failed to save data!',res,'error');
  },{
    id:data.id,
  }),
  section=_Hotel.element('div',{
    'class':'section row-buttons',
  },[save]),
  select=_Hotel.findSelect({
    id:'category',
    key:'category',
    value:data.category,
    data:this.coa,
    placeholder:_Hotel.alias('category'),
  }),
  cname=this.getCoaName(data.category),
  division=_Hotel.input('division','purchasing','hidden'),
  content=_Hotel.element('div',{
    style:'min-height:400px',
  },[table,division,section]);
  _Hotel.main.put((data.id=='0'?'Add':'Edit')+' Item Price',content);
  select.slave.input.value=cname;
  table.row(
    _Hotel.alias('category'),
    select,
  );
  table.row(
    _Hotel.alias('item_name'),
    _Hotel.input('name',data.name,'text',_Hotel.alias('item_name'),100),
  );
  table.row(
    _Hotel.alias('item_mark'),
    _Hotel.input('mark',data.mark,'text',_Hotel.alias('item_mark'),100),
  );
  table.row(
    _Hotel.alias('selling_price'),
    _Hotel.input('nominal',data.nominal,'number',_Hotel.alias('selling_price'),10),
  );
  table.row(
    _Hotel.alias('purchase_price'),
    _Hotel.input('purchase',data.purchase,'number',_Hotel.alias('purchase_price'),10),
  );
  /* check another unit */
  if(this.units.indexOf(data.unit)<0){
    this.units.push(data.unit);
  }
  table.row(
    _Hotel.alias('item_unit'),
    _Hotel.select('unit',data.unit,this.units),
  );
};

/* daily report */
this.dailyReport=async function(method='cash',date,month,year,dlength){
  _Hotel.main.loader();
  year=year||(new Date).getFullYear();
  date=date||(new Date).getDate();
  month=!isNaN(parseInt(month,10))?month:(new Date).getMonth();
  dlength=!isNaN(parseInt(dlength,10))?dlength:1;
  let kdate=Math.floor(year/4)==year?29:28,
  kmonth=[31,kdate,31,30,31,30,31,31,30,31,30,31],
  dateTime=Math.floor((new Date([
    year,
    (parseInt(month,10)+1).toString().padStart(2,'0'),
    (date).toString().padStart(2,'0'),
  ].join('-'))).getTime()/1000),
  dayLengthSecond=3600*24*dlength,
  dateTimeEnd=dateTime+dayLengthSecond,
  coa_method={
    cash:7,
    wire_mandiri:10,
    wire_bca:13,
    card_mandiri:10,
    card_bca:13,
    petty_cash:4,
    account_receivable:18,
    qris_mandiri:10,
    qris_bca:13,
  },
  methodAll=[].join(' or '),
  queries=[
    'select * from payment where status=1 and time > '
      +dateTime+' and time < '+dateTimeEnd
      +(method=='all'?'':' and method="'+method+'"'),
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  payments=data[0],
  table=_Hotel.table(),
  total=0,
  title=this.paymentMethods.hasOwnProperty(method)?this.paymentMethods[method]
    :(method=='all'?'Revenue':method),
  dateSelection=_Hotel.dateSelection({
    /**
     * config:
     *   - id    = string of element id
     *   - key   = string of input key 
     *   - value = default value
     *   - min   = minimum date; default: 1960-01-01
     *   - max   = maximum date; default: 2038-12-31
     * return: object of element with property of element: span and input
     */
    id:'date-selection',
    key:'date_selection',
    value:[
      year,
      (parseInt(month,10)+1).toString().padStart(2,'0'),
      (date).toString().padStart(2,'0'),
    ].join('-'),
  }),
  dateLength=_Hotel.select('date_length',dlength,_Hotel.range(1,31),function(){
    _HotelFrontOffice.dailyReport(
      this.dataset.method,
      this.dataset.date,
      this.dataset.month,
      this.dataset.year,
      this.value,
    );
  },{method,date,month,year,dlength}),
  sdate=_Hotel.select('date',date,_Hotel.range(1,kmonth[month]),function(){
    _HotelFrontOffice.dailyReport(
      this.dataset.method,
      this.value,
      this.dataset.month,
      this.dataset.year,
    );
  },{method,date,month,year}),
  smonth=_Hotel.select('month',month,_Hotel.arrayToObject(this.months),function(){
    _HotelFrontOffice.dailyReport(
      this.dataset.method,
      this.dataset.date,
      this.value,
      this.dataset.year,
    );
  },{method,date,month,year}),
  syear=_Hotel.select('year',year,_Hotel.getYears(),function(){
    _HotelFrontOffice.dailyReport(
      this.dataset.method,
      this.dataset.date,
      this.dataset.month,
      this.value,
    );
  },{method,date,month,year}),
  pbutton=_Hotel.button('Print','orange','print',function(){
    window.print();
  }),
  dnext=new Date(dateTimeEnd*1000);
  /* put content */
  let dateTitle=dlength==1?''
    :' to '+(dnext.getDate()-1)+' '+this.months[dnext.getMonth()]+' '+dnext.getFullYear();
  _Hotel.main.put(
    title+' Daily Report &#8213; '
      +date+' '+this.months[month]+' '+year+dateTitle,
    _Hotel.element('div',{},[
      pbutton,
      table,
    ]),
  );
  /* date selection on change */
  dateSelection.onchange=function(){
    let dd=this.input.value.split('-');
    _HotelFrontOffice.dailyReport(
      this.dataset.method,
      parseInt(dd[2]),
      parseInt(dd[1])-1,
      parseInt(dd[0]),
      this.dataset.dlength,
    );
  };
  dateSelection.dataset.dlength=dlength;
  dateSelection.dataset.method=method;
  /* date selection */
  let row=table.row(dateSelection,dateLength);
  row.childNodes[0].setAttribute('colspan',5);
  /* header */
  row=table.row(
    'RegID',
    'Date',
    'Bearer',
    'Nominal',
    'Method',
    'Note',
  ).header();
  /* each */
  for(let d of payments){
    let nd=new Date(d.time*1000),
    date=[
      nd.getFullYear(),
      (nd.getMonth()+1).toString().padStart(2,'0'),
      nd.getDate().toString().padStart(2,'0'),
    ].join('-'),
    pmethod=this.paymentMethods.hasOwnProperty(d.method)?this.paymentMethods[d.method]:d.method,
    row=table.row(
      d.regid,
      date,
      d.bearer,
      _Hotel.parseNominal(d.nominal),
      pmethod,
      d.note,
    );
    row.childNodes[0].classList.add('td-center');
    row.childNodes[3].classList.add('td-right');
    total+=parseInt(d.nominal,10);
  }
  /* total */
  row=table.row(
    'Total',
    _Hotel.parseNominal(total),
    '',
    '',
  ).header();
  row.childNodes[0].setAttribute('colspan',3);
  row.childNodes[0].classList.add('td-right');
  row.childNodes[1].classList.add('td-right');
};

/* room sales daily report */
this.dailyReportRoom=async function(date,month,year,type='all',dlength){
  _Hotel.main.loader();
  year=year||(new Date).getFullYear();
  date=date||(new Date).getDate();
  month=!isNaN(parseInt(month,10))?month:(new Date).getMonth();
  dlength=!isNaN(parseInt(dlength,10))?dlength:1;
  let types=['Executive','Deluxe','Superior'];
  type=types.indexOf(type)>=0?type:'all';
  let kdate=Math.floor(year/4)==year?29:28,
  kmonth=[31,kdate,31,30,31,30,31,31,30,31,30,31],
  dateTime=Math.floor((new Date([
    year,
    (parseInt(month,10)+1).toString().padStart(2,'0'),
    (date).toString().padStart(2,'0'),
  ].join('-'))).getTime()/1000),
  dayLengthSecond=3600*24*dlength,
  dateTimeEnd=dateTime+dayLengthSecond,
  date_arrival=[
    year,
    (parseInt(month,10)+1).toString().padStart(2,'0'),
    date.toString().padStart(2,'0'),
  ].join('-'),
  firstQuery='select * from registration where type="registration" and time > '
    +dateTime+' and time < '+dateTimeEnd,
  secondQuery='select * from registration where type="registration" and date_arrival="'+date_arrival+'"',
  queries=[
    firstQuery,
    'select * from room',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  rooms=data[1],
  regs=data[0],
  table=_Hotel.table(),
  ndate=new Date(dateTimeEnd*1000),
  toDate=dlength==1?''
    :' to '+(ndate.getDate()-1)+' '+this.months[ndate.getMonth()]+' '+ndate.getFullYear(),
  title='Room Sales Daily Report &#8213; '+date+' '+this.months[month]+' '+year+toDate,
  dateSelection=_Hotel.dateSelection({
    /**
     * config:
     *   - id    = string of element id
     *   - key   = string of input key 
     *   - value = default value
     *   - min   = minimum date; default: 1960-01-01
     *   - max   = maximum date; default: 2038-12-31
     * return: object of element with property of element: span and input
     */
    id:'date-selection',
    key:'date_selection',
    value:[
      year,
      (parseInt(month,10)+1).toString().padStart(2,'0'),
      (date).toString().padStart(2,'0'),
    ].join('-'),
  }),
  dateLength=_Hotel.select('date_length',dlength,_Hotel.range(1,31),function(){
    _HotelFrontOffice.dailyReportRoom(
      this.dataset.date,
      this.dataset.month,
      this.dataset.year,
      this.dataset.type,
      this.value,
    );
  },{type,date,month,year,dlength}),
  tableSelect=_Hotel.table();
  /* table select */
  tableSelect.row(dateSelection,dateLength);
  tableSelect.classList.add('non-printable');
  /* date selection on change */
  dateSelection.onchange=function(){
    let dd=this.input.value.split('-');
    _HotelFrontOffice.dailyReportRoom(
      parseInt(dd[2]),
      parseInt(dd[1])-1,
      parseInt(dd[0]),
      this.dataset.type,
      this.dataset.dlength,
    );
  };
  dateSelection.dataset.dlength=dlength;
  dateSelection.dataset.type=type;
  /* other selectors */
  let sdate=_Hotel.select('date',date,_Hotel.range(1,kmonth[month]),function(){
    _HotelFrontOffice.dailyReportRoom(
      this.value,
      this.dataset.month,
      this.dataset.year,
      this.dataset.type,
    );
  },{type,year,month,date}),
  smonth=_Hotel.select('month',month,_Hotel.arrayToObject(this.months),function(){
    _HotelFrontOffice.dailyReportRoom(
      this.dataset.date,
      this.value,
      this.dataset.year,
      this.dataset.type,
    );
  },{type,year,month,date}),
  syear=_Hotel.select('year',year,_Hotel.getYears(),function(){
    _HotelFrontOffice.dailyReportRoom(
      this.dataset.date,
      this.dataset.month,
      this.value,
      this.dataset.type,
    );
  },{type,year,month,date});
  /* put content */
  _Hotel.main.put(title,_Hotel.element('div',{},[
    _Hotel.button('Print','orange','print',function(){
      window.print();
    }),
    tableSelect,
    table,
  ]));
  /* grouping */
  let roomTypes={
    Executive:[],
    Deluxe:[],
    Superior:[],
  };
  for(let reg of regs){
    let room=_Hotel.getDataByKey('number',reg.room_number,rooms);
    if(roomTypes.hasOwnProperty(room.name)){
      roomTypes[room.name].push(reg);
    }
  }
  /* each */
  for(let name in roomTypes){
    row=table.row(name+' ('+roomTypes[name].length+')').header();
    row.childNodes[0].classList.add('td-left');
    row.childNodes[0].setAttribute('colspan',9);
    row=table.row(
      'RegID',
      'Guest Name',
      'Room',
      'Nights',
      'Departure',
      'Amount',
      'Deposit',
      'Discount',
      'Balance',
    ).header();
    let totalAmount=0,
    totalDeposit=0,
    totalDiscount=0;
    for(let reg of roomTypes[name]){
      let amount=parseInt(reg.payment_amount,10),
      discount=parseInt(reg.payment_discount,10),
      deposit=parseInt(reg.payment_deposit,10),
      balance=deposit-(amount-discount);
      row=table.row(
        reg.regid,
        reg.guest_name,
        reg.room_number,
        reg.nights+' night'+(reg.nights>1?'s':''),
        reg.date_departure,
        _Hotel.parseNominal(reg.payment_amount),
        _Hotel.parseNominal(reg.payment_deposit),
        _Hotel.parseNominal(reg.payment_discount),
        _Hotel.parseNominal(balance),
      );
      row.childNodes[0].classList.add('td-center');
      row.childNodes[2].classList.add('td-center');
      row.childNodes[3].classList.add('td-center');
      row.childNodes[5].classList.add('td-right');
      row.childNodes[6].classList.add('td-right');
      row.childNodes[7].classList.add('td-right');
      row.childNodes[8].classList.add('td-right');
      totalAmount+=amount;
      totalDeposit+=deposit;
      totalDiscount+=discount;
    }
    /* total */
    row=table.row(
      'Total',
      _Hotel.parseNominal(totalAmount),
      _Hotel.parseNominal(totalDeposit),
      _Hotel.parseNominal(totalDiscount),
      _Hotel.parseNominal(totalDeposit-(totalAmount-totalDiscount)),
    ).header();
    row.childNodes[0].setAttribute('colspan',5);
    row.childNodes[0].classList.add('td-right');
    row.childNodes[1].classList.add('td-right');
    row.childNodes[2].classList.add('td-right');
    row.childNodes[3].classList.add('td-right');
    row.childNodes[4].classList.add('td-right');

    /* separator */
    row=table.row('.');
    row.childNodes[0].setAttribute('colspan',9);
  }
};


/* markets */
this.markets=async function(){
  _Hotel.main.loader();
  let query='select * from market',
  data=await _Hotel.request('query',query),
  markets=data,
  table=_Hotel.table(),
  add=_Hotel.button('Add','green','plus',function(){
    _HotelFrontOffice.marketEdit();
  }),
  /* header */
  row=table.row(
    _Hotel.alias('market_id'),
    _Hotel.alias('market_category'),
    _Hotel.alias('market_segment'),
    _Hotel.alias('market_name'),
    _Hotel.alias('market_telp'),
    _Hotel.alias('market_price'),
    add,
  ).header();
  /* finder */
  row=table.row(
    _Hotel.findRow('id'),
    _Hotel.findRow('category'),
    _Hotel.findRow('segment'),
    _Hotel.findRow('name'),
    _Hotel.findRow('telp'),
    _Hotel.findRow('price'),
    '',
  );
  row.childNodes[0].style.maxWidth='90px';
  /* each market */
  for(let market of markets){
    let edit=_Hotel.button('Edit','blue','edit',function(){
      _HotelFrontOffice.marketEdit(this.dataset.id);
    },{
      id:market.id,
    }),
    category=this.categories.hasOwnProperty(market.category)
      ?this.categories[market.category]:market.category,
    row=table.row(
      market.id,
      category,
      market.segment,
      market.name,
      market.telp,
      _Hotel.parseNominal(market.price),
      edit,
    );
    row.childNodes[0].classList.add('td-center');
    row.childNodes[5].classList.add('td-right');
    row.dataset.id=market.id;
    row.dataset.category=category;
    row.dataset.segment=market.segment;
    row.dataset.name=market.name;
    row.dataset.telp=market.telp;
    row.dataset.price=_Hotel.parseNominal(market.price);
  }
  _Hotel.main.put('Markets',table);
};
/* market edit/add */
this.marketEdit=async function(id=0){
  _Hotel.main.loader();
  let def={
    id:id,
    category:'travel_agent',
    segment:'Travel Agent',
    name:'',
    telp:'',
    price:0,
    email:'',
    address:'',
  },
  query='select * from market where id='+id,
  data=await _Hotel.request('query',query),
  market=data.length>0?data[0]:def,
  table=_Hotel.table(),
  /* save */
  save=_Hotel.button('Save','blue','save',async function(){
    let fdata=_Hotel.formSerialize(),
    innerQuery=_Hotel.buildQuery(fdata),
    query=this.dataset.id==0
      ?'insert into market '+innerQuery
      :'update market ('+innerQuery+') where id='+this.dataset.id,
    loader=_Hotel.loader(),
    res=await _Hotel.request('query',query);
    loader.remove();
    if(res!=1){
      return _Hotel.alert('Error: Failed to save market!',res,'error');
    }
    return _HotelFrontOffice.markets();
  },{id}),
  /* delete button */
  del=_Hotel.button('Delete','red','trash',async function(){
    let yes=await _Hotel.confirmX('Delete this market?');
    if(!yes){return;}
    let loader=_Hotel.loader(),
    query='delete from market where id='+this.dataset.id,
    res=await _Hotel.request('query',query);
    loader.remove();
    if(res!=1){
      return _Hotel.alert('Error: Failed to delete market!',res,'error');
    }
    return _HotelFrontOffice.markets();
  },{id}),
  /* section */
  section=_Hotel.element('div',{
    'class':'section row-buttons',
  },[save,id!=0?del:'']),
  double=_Hotel.main.double(table,section),
  title=(id==0?'Add':'Edit')+' Market '+(id!=0?'#'+id:'');
  _Hotel.main.put(title,double);
  table.classList.add('table-register');
  /* each */
  for(let k in market){
    let key=_Hotel.alias('market_'+k),
    value=market[k],
    val=_Hotel.input(k,value,'text',key,100);
    if(k=='id'||k=='time'){
      continue;
    }else if(k=='category'){
      val=_Hotel.select(k,value,this.categories);
    }else if(k=='telp'||k=='price'){
      val.type='number';
    }else if(k=='email'){
      val.type='email';
    }else if(k=='address'){
      val=_Hotel.textarea(k,value,key,100);
    }
    row=table.row(key,val);
  }
};



/* payments page */
this.paymentPage=async function(date='all',month,year){
  let defDate=_Hotel.production?(new Date).getDate():'all';
  year=year||(new Date).getFullYear();
  month=!isNaN(parseInt(month))?parseInt(month):(new Date).getMonth();
  date=date||defDate;
  _Hotel.main.loader();
  let datePadded=date=='all'?'01':date.toString().padStart(2,'0'),
  dateObject=new Date([
    year,
    (parseInt(month)+1).toString().padStart(2,'0'),
    datePadded,
  ].join('-')),
  kdate=Math.floor(year/4)==year?29:28,
  dateRangeLimit=month==1?kdate:this.dates[month],
  dateEndLimit=date=='all'?dateRangeLimit*24*3600:24*3600,
  dateTimeStart=Math.floor(dateObject.getTime()/1000),
  dateTimeEnd=dateTimeStart+dateEndLimit,
  queries=[
    'select * from payment where time > '+dateTimeStart
      +' and time < '+dateTimeEnd+' order by id desc',
    'select id,username as name from user',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  paids=data[0],
  users=data[1],
  table=_Hotel.table(),
  total=0,
  totalPaid=0,
  totalCashback=0,
  row=table.row(
    'RegID',
    _Hotel.alias('payment_bearer'),
    _Hotel.alias('payment_nominal'),
    _Hotel.alias('payment_paid'),
    _Hotel.alias('cashback'),
    _Hotel.alias('payment_method'),
    'Officer',
    '',
  ).header(),
  syear=_Hotel.select('year',year,_Hotel.getYears(),function(){
    _HotelFrontOffice.paymentPage(this.dataset.date,parseInt(this.dataset.month,10),this.value);
  },{month,date}),
  smonth=_Hotel.select('month',month,_Hotel.arrayToObject(this.months),function(){
    _HotelFrontOffice.paymentPage(this.dataset.date,parseInt(this.value),this.dataset.year);
  },{year,date}),
  sdate=_Hotel.select('date',date,[
    ...['all'],
    ..._Hotel.range(1,dateRangeLimit),
  ],function(){
    _HotelFrontOffice.paymentPage(this.value,parseInt(this.dataset.month,10),this.dataset.year);
  },{year,month});
  /* search */
  row=table.row(
    _Hotel.findRow('regid'),
    _Hotel.findRow('bearer'),
    '','','',
    _Hotel.findRow('method'),
    _Hotel.findRow('uname'),
    '',
  );
  /* title and put */
  _Hotel.main.put('Payments',_Hotel.element('div',{},[
    _Hotel.element('div',{},[
      syear,smonth,
    ]),
    table,
  ]));
  /* each paid */
  for(let p of paids){
    let uname=_Hotel.getValueById(p.uid,'name',users),
    nominal=_Hotel.parseNominal(p.nominal),
    paid=_Hotel.parseNominal(p.paid),
    cashback=_Hotel.parseNominal(p.cashback),
    method=this.paymentMethods.hasOwnProperty(p.method)
      ?this.paymentMethods[p.method]:p.method,
    view=_Hotel.button('View','green','search',function(){
      _Hotel.dialogView(this.dataset.type,this.dataset.regid);
    },{
      type:5,
      regid:p.regid,
    }),
    receipt=_Hotel.button('Receipt','purple','print',function(){
      _HotelFrontOffice.paymentReceipt(this.dataset.regid);
    },{
      regid:p.regid,
      data:JSON.stringify(p),
    }),
    row=table.row(
      p.regid,
      p.bearer,
      nominal,
      paid,
      cashback,
      method,
      uname,
      _Hotel.element('div',{
        'class':'td-buttons',
      },[view,receipt]),
    );
    row.dataset.regid=p.regid;
    row.dataset.bearer=p.bearer;
    row.dataset.method=method;
    row.dataset.uname=uname;
    row.childNodes[0].classList.add('td-center');
    row.childNodes[2].classList.add('td-right');
    row.childNodes[3].classList.add('td-right');
    row.childNodes[4].classList.add('td-right');
    total+=parseInt(p.nominal,10);
    totalPaid+=parseInt(p.paid,10);
    totalCashback+=parseInt(p.cashback,10);
  }
  /* total */
  row=table.row(
    'Total',
    _Hotel.parseNominal(total),
    _Hotel.parseNominal(totalPaid),
    _Hotel.parseNominal(totalCashback),
    '',
  ).header();
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[4].setAttribute('colspan',3);
  row.childNodes[0].classList.add('td-right');
  row.childNodes[1].classList.add('td-right');
  row.childNodes[2].classList.add('td-right');
  row.childNodes[3].classList.add('td-right');
};
/* payment view -- require: regid */
this.paymentView=async function(regid){
  let dialog=await _Hotel.dialogPage(),
  queries=[
    'select id,username as name from user',
    'select * from payment where regid='+regid,
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  users=data[0],
  payment=data[1].length>0?data[1][0]:null,
  pdata=payment?_Hotel.parseJSON(payment.data):[],
  table=_Hotel.table(),
  row=table.head('Payment #'+regid,6);
  if(payment==null){
    dialog.put('Error: Failed to get payment data!');
    return;
  }
  /* regid */
  row=table.row(
    'RegID',
    payment.regid.toString().padStart(7,'0'),
  );
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].setAttribute('colspan',4);
  /* officer */
  row=table.row(
    'Officer',
    _Hotel.getValueById(payment.uid,'name',users),
  );
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].setAttribute('colspan',4);
  /* bearer */
  row=table.row(
    _Hotel.alias('payment_bearer'),
    payment.bearer,
  );
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].setAttribute('colspan',4);
  /* header */
  row=table.row(
    'RegID',
    _Hotel.alias('transaction_type'),
    _Hotel.alias('transaction_amount'),
    _Hotel.alias('transaction_deposit'),
    _Hotel.alias('transaction_balance'),
    '',
  ).header();
  /* payment data each */
  for(let p of pdata){
    let balance=parseInt(p.deposit,10)-parseInt(p.amount),
    view=_Hotel.button('View','green','search',function(){
      _Hotel.dialogView(this.dataset.type,this.dataset.regid);
    },{
      type:p.type,
      regid:p.regid,
    });
    row=table.row(
      p.regid,
      this.tTypes[p.type],
      _Hotel.parseNominal(p.amount),
      _Hotel.parseNominal(p.deposit),
      _Hotel.parseNominal(balance),
      view,
    );
    row.childNodes[0].classList.add('td-center');
    row.childNodes[2].classList.add('td-right');
    row.childNodes[3].classList.add('td-right');
    row.childNodes[4].classList.add('td-right');
  }
  /* the rest */
  let rest=['nominal','paid','cashback','method','time','note'],
  digit=['nominal','paid','cashback'];
  for(let r of rest){
    if(!payment.hasOwnProperty(r)){
      continue;
    }
    let key=_Hotel.alias('payment_'+r),
    value=payment[r],
    val=value;
    if(digit.indexOf(r)>=0){
      val=_Hotel.parseNominal(value);
    }else if(r=='time'){
      val=_Hotel.parseDatetime(value*1000);
    }else if(r=='note'){
      key=_Hotel.alias('note');
    }else if(r=='method'){
      val=this.paymentMethods.hasOwnProperty(value)
        ?this.paymentMethods[value]:value;
    }
    row=table.row(key,val,'');
    row.childNodes[0].setAttribute('colspan',3);
    row.childNodes[1].setAttribute('colspan',2);
    row.childNodes[0].classList.add('td-right');
    if(digit.indexOf(r)>=0){
      row.childNodes[1].classList.add('td-right');
    }else if(r=='method'){
      row.childNodes[1].classList.add('td-center');
    }
  }
  /* put into dialog */
  dialog.put(table);
};
/* payment form -- require: regid */
this.paymentForm=async function(regid){
  _Hotel.main.loader();
  let regids=Array.isArray(regid)?regid:[regid],
  regidWhere=regids.map(r=>'regid='+r).join(' or '),
  nrQueries=[
    'insert into regid uid='+_Hotel.user.id+'&type=5',
    'select * from regid where uid='+_Hotel.user.id+' and type=5 order by id desc limit 1',
  ],
  queries=[
    'select * from transaction where '+regidWhere,
    'select id,username as name from user',
    'select * from registration where '+regidWhere,
  ];
  if(regids.length>1){
    queries=[...queries,...nrQueries];
  }
  let data=await _Hotel.request('queries',queries.join(';')),
  trans=data[0],
  users=data[1],
  registers=data[2],
  guests=this.getGuestNames(registers),
  insert=data.length>3?data[3]:0,
  newRegid=data.length>3&&insert==1&&data[4].length==1?data[4][0].id:regids[0],
  table=_Hotel.table(),
  totalAmount=0,
  totalDeposit=0,
  counter=0;
  pmethod='cash',
  guestSelector=_Hotel.findSelect({
    id:'guest-bearer',
    key:'bearer',
    value:guests[0].name,
    data:guests,
    callback:function(res){
      res.main.slave.result.value=res.name;
    }
  }),
  /* regid or newRegid */
  row=table.row(
    'RegID',
    newRegid.toString().padStart(7,'0'),
    'Officer',
    _Hotel.user.username
  );
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].setAttribute('colspan',3);
  row.childNodes[2].setAttribute('colspan',1);
  row.childNodes[3].setAttribute('colspan',4);
  /* bearer */
  row=table.row(
    _Hotel.alias('payment_bearer'),
    guestSelector,
    '',
  );
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].setAttribute('colspan',3);
  row.childNodes[2].setAttribute('colspan',5);
  guestSelector.slave.input.value=guests[0].name;
  /* table header */
  row=table.row(
    'RegID',
    _Hotel.alias('transaction_type'),
    _Hotel.alias('transaction_amount'),
    _Hotel.alias('transaction_deposit'),
    _Hotel.alias('transaction_balance'),
    _Hotel.alias('payment_method'),
    _Hotel.alias('guest_name'),
    _Hotel.alias('transaction_date'),
    'Officer',
    '',
  ).header();
  for(let tran of trans){
    counter++;
    pmethod=_Hotel.getValueByKey('regid',tran.regid,'payment_method',registers);
    let balance_real=parseInt(tran.deposit,10)-parseInt(tran.amount,10),
    balance=_Hotel.parseNominal(balance_real),
    balance_span=_Hotel.element('span',{
      'class':balance_real>=0?'balance-plus':'balance-minus',
    }).text(balance),
    view=_Hotel.button('View','green','search',function(){
      _Hotel.dialogView(this.dataset.type,this.dataset.regid);
    },{
      type:tran.type,
      regid:tran.regid,
    }),
    row=table.row(
      tran.regid,
      this.tTypes[tran.type],
      _Hotel.parseNominal(tran.amount),
      _Hotel.parseNominal(tran.deposit),
      balance_span,
      this.paymentMethods.hasOwnProperty(pmethod)?this.paymentMethods[pmethod]:'-',
      _Hotel.getValueByKey('regid',tran.regid,'guest_name',registers),
      _Hotel.parseDatetime(tran.time*1000),
      _Hotel.getValueById(tran.uid,'name',users),
      _Hotel.element('div',{
        'class':'section-x row-buttons-x',
      },[
        view,
        _Hotel.input('data['+counter+'][id]',tran.id,'hidden'),
        _Hotel.input('data['+counter+'][regid]',tran.regid,'hidden'),
        _Hotel.input('data['+counter+'][type]',tran.type,'hidden'),
        _Hotel.input('data['+counter+'][amount]',tran.amount,'hidden'),
        _Hotel.input('data['+counter+'][deposit]',tran.deposit,'hidden'),
        _Hotel.input('data['+counter+'][flow]',tran.flow,'hidden'),
      ]),
    );
    totalAmount+=parseInt(tran.amount,10);
    totalDeposit+=parseInt(tran.deposit,10);
    row.childNodes[0].classList.add('td-center');
    row.childNodes[2].classList.add('td-right');
    row.childNodes[3].classList.add('td-right');
    row.childNodes[4].classList.add('td-right');
  }
  let totalBalance=totalDeposit-totalAmount;
  row=table.row('').header();
  row.childNodes[0].setAttribute('colspan',10);
  row=table.row(
    'Total',
    _Hotel.parseNominal(totalAmount),
    _Hotel.parseNominal(totalDeposit),
    _Hotel.element('span',{
      'class':totalBalance>=0?'balance-plus':'balance-minus',
    }).text(_Hotel.parseNominal(totalBalance)),
    '',
  );
  row.childNodes[0].classList.add('td-center');
  row.childNodes[1].classList.add('td-right');
  row.childNodes[2].classList.add('td-right');
  row.childNodes[3].classList.add('td-right');
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[4].setAttribute('colspan',5);
  /* payment method */
  let totalPayment=totalBalance*-1,
  paymentMethod=_Hotel.select('method',pmethod,this.paymentMethods);
  row=table.row(
    _Hotel.alias('payment_method'),
    paymentMethod,
    _Hotel.element('div',{},[
      _Hotel.input('regid',newRegid,'hidden'),
      _Hotel.input('uid',_Hotel.user.id,'hidden'),
      _Hotel.input('flow','1','hidden'),
      _Hotel.input('nominal',totalPayment,'hidden'),
      _Hotel.input('type','5','hidden'),
      _Hotel.input('status','1','hidden'),
      _Hotel.alias('note'),
    ]),
    _Hotel.textarea('note','',_Hotel.alias('note'),100),
  );
  row.childNodes[0].classList.add('td-center');
  row.childNodes[2].classList.add('td-right');
  row.childNodes[0].setAttribute('colspan',4);
  row.childNodes[1].setAttribute('colspan',1);
  row.childNodes[2].setAttribute('colspan',1);
  row.childNodes[3].setAttribute('colspan',4);
  row.childNodes[3].setAttribute('rowspan',2);
  /* payment nominal and cashback */
  let inputPaid=_Hotel.input('paid',totalPayment,'number',_Hotel.alias('payment_nominal'),10),
  inputCashback=_Hotel.input('cashback','0','hidden'),
  cashbackParsed=_Hotel.element('span').text(_Hotel.parseNominal(0)),
  paidParsed=_Hotel.element('span').text(_Hotel.parseNominal(totalPayment));
  inputPaid.paidParsed=paidParsed;
  inputPaid.cashback=inputCashback;
  inputPaid.cashbackParsed=cashbackParsed;
  inputPaid.dataset.total=totalPayment;
  inputPaid.addEventListener('keyup',function(){
    let val=parseInt(this.value,10),
    total=parseInt(this.dataset.total,10),
    cashback=val-total;
    this.paidParsed.innerText=_Hotel.parseNominal(val);
    this.cashback.value=cashback;
    this.cashbackParsed.innerText=_Hotel.parseNominal(cashback);
  },false);
  inputCashback.disabled=true;
  /* payment input */
  row=table.row(
    _Hotel.alias('payment_nominal'),
    inputPaid,
    '',
  );
  row.childNodes[0].classList.add('td-center');
  row.childNodes[0].setAttribute('colspan',4);
  row.childNodes[1].setAttribute('colspan',1);
  row.childNodes[2].setAttribute('colspan',1);
  /* payment nominal */
  row=table.row(
    _Hotel.alias('payment_nominal')+' (IDR)',
    paidParsed,
    '',
  );
  row.childNodes[0].classList.add('td-center');
  row.childNodes[1].classList.add('td-right');
  row.childNodes[0].setAttribute('colspan',4);
  row.childNodes[1].setAttribute('colspan',1);
  row.childNodes[2].setAttribute('colspan',5);
  /* cashback nominal */
  row=table.row(
    _Hotel.alias('cashback')+' (IDR)',
    _Hotel.element('div',{},[
      inputCashback,
      cashbackParsed,
    ]),
    '',
  );
  row.childNodes[0].classList.add('td-center');
  row.childNodes[1].classList.add('td-right');
  row.childNodes[0].setAttribute('colspan',4);
  row.childNodes[1].setAttribute('colspan',1);
  row.childNodes[2].setAttribute('colspan',5);
  /* submit */
  row=table.row(
    '',
    _Hotel.button('Pay Now!','red','money',async function(){
      let yes=await _Hotel.confirmX('Pay now?');
      console.log(this.dataset.marketName);
      if(!yes){return;}
      let fdata=_Hotel.formSerialize(true),
      tdata=_Hotel.objectToArray(_Hotel.parseJSON(fdata.data)),
      queries=[];
      fdata.data=JSON.stringify(tdata);
      for(let t of tdata){
        queries.push('update transaction (status=1) where id='+t.id);
        if(t.type==2){
          queries.push('update registration (status=1) where regid='+t.regid);
        }else if(t.type==3){
          queries.push('update extrabill_cart (status=1) where regid='+t.regid);
        }else if(t.type==6){
          queries.push('update room_service (status=1) where regid='+t.regid);
        }
      }
      queries.push('insert into payment '+_Hotel.buildQuery(fdata));
      queries.push('insert into transaction '+_Hotel.buildQuery({
        regid:fdata.regid,
        type:5,
        amount:0,
        deposit:fdata.nominal,
        flow:1,
        uid:fdata.uid,
        date:(new Date).getDate(),
        month:(new Date).getMonth(),
        year:(new Date).getFullYear(),
        status:1,
      }));
      let coa_method={
        cash:7,
        wire_mandiri:10,
        wire_bca:13,
        card_mandiri:10,
        card_bca:13,
        petty_cash:4,
        account_receivable:18,
        qris_mandiri:10,
        qris_bca:13,
      },
      coa_id=coa_method.hasOwnProperty(fdata.method)?coa_method[fdata.method]:7,
      pmethod=_Hotel.paymentMethods.hasOwnProperty(fdata.method)
        ?_Hotel.paymentMethods[fdata.method]:fdata.method,
      marketName=this.dataset.marketName,
      preword=fdata.method=='account_receivable'?'Account Receivable by ':'Payment by ';
      queries.push('insert into adjustment '+_Hotel.buildQuery({
        year:(new Date).getFullYear(),
        month:(new Date).getMonth(),
        date:(new Date).getDate(),
        amount:fdata.nominal,
        deposit:fdata.nominal,
        flow:1,
        coa_id:coa_id,
        item_id:0,
        name:preword+fdata.bearer,
        note:''+pmethod+' ('+marketName+')',
        regid:fdata.regid,
        status:1,
      }));
      let loader=_Hotel.loader(),
      res=await _Hotel.request('queries',queries.join(';'));
      loader.remove();
      _HotelFrontOffice.paymentPage();
    },{
      newRegid:newRegid,
      marketName:registers[0].market_name,
    }),
    '',
  );
  row.childNodes[0].setAttribute('colspan',4);
  row.childNodes[1].setAttribute('colspan',1);
  row.childNodes[2].setAttribute('colspan',5);
  /*  */
  /*  */
  /* put to main */
  _Hotel.main.put('Payments Form',_Hotel.element('div',{},[
    table,
  ]));
};
/* payment receipt for down payment -- require: regid */
this.paymentReceiptDP=async function(regid){
  _Hotel.main.loader();
  let query='select * from registration where regid='+regid,
  queries=[
    query,
    'select id,username as name from user',
    'select id,name from coa',
    'select id,name from extrabill',
    'select * from guest',
    'select * from room',
  ].join(';'),
  res=await _Hotel.request('queries',queries),
  data=res[0].length>0?res[0][0]:{},
  users=res[1],
  coa=res[2],
  extrabills=res[3],
  guests=res[4],
  rooms=res[5],
  header=_Hotel.table(), 
  table=_Hotel.table(),
  footer=_Hotel.table(),
  printButton=_Hotel.button('Print','purple','print',function(){
    window.print();
  }),
  row=null;
  _Hotel.main.put('Down Payment Receipt',_Hotel.element('div',{
    'class':'section',
  },[
    header,table,footer,
    _Hotel.element('div',{
      'class':'section row-buttons',
    },[printButton])
  ]));
  header.style.width='100%';
  table.style.width='100%';
  /* find bearer address and company name */
  let companyName=data.market_name,
  guest=_Hotel.getDataById(data.guest_id,guests),
  bearerAddress=guest?guest.address:'',
  bearerPhone=guest?guest.phone:'',
  bearerCardID=guest?guest.card_id:'',
  bearerCardType=guest?guest.card_type:'';
  /* header */
  row=table.row(
    'Receipt No.',
    data.regid.toString().padStart(7,'0'),
    'Date',
    _Hotel.parseDate(data.date_arrival),
  );
  row.childNodes[0].style.width='120px';
  row.childNodes[1].style.minWidth='150px';
  /* bearer */
  row=table.row(
    'Payment Bearer',
    data.guest_name+' ('+companyName+')',
    'Officer',
    _Hotel.user.username,
  );
  /* bearer address */
  row=table.row(
    'Address',
    bearerAddress+'<br />'+bearerPhone,
    'Card ID',
    bearerCardID+' ('+bearerCardType+')',
  );
  /* body */
  row=table.row(
    'Description',
    'Quantity',
    'Amount (IDR)',
  ).header();
  row.childNodes[0].setAttribute('colspan',2);
  /* detail */
  let room=_Hotel.getDataByKey('number',data.room_number,rooms),
  roomType=room?room.code:'',
  ls=parseInt(data.nights,10)>1?'s':'';
  row=table.row(
    [
      'Check-in',
      'Room Number '+data.room_number,
      roomType,
      'Arrival on '+_Hotel.parseDate(data.date_arrival),
      'Departure on '+_Hotel.parseDate(data.date_departure),
    ].join('<br />  &#8213; '),
    data.nights+' night'+ls,
    _Hotel.parseNominal(data.payment_amount),
  );
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[1].classList.add('td-center');
  row.childNodes[2].classList.add('td-right');
  /* separator */
  row=table.row('');
  row.childNodes[0].setAttribute('colspan',4);
  row.childNodes[0].style.padding='1px';
  /* deposit */
  row=table.row('Deposit',_Hotel.parseNominal(data.payment_deposit));
  row.childNodes[0].classList.add('td-right');
  row.childNodes[1].classList.add('td-right');
  row.childNodes[0].setAttribute('colspan',3);
  row.childNodes[1].style.fontWeight='bold';
  /* balance */
  let balance=parseInt(data.payment_deposit,10)-parseInt(data.payment_amount,10);
  row=table.row('Balance',_Hotel.element('span',{
    'class':balance>=0?'balance-plus':'balance-minus',
  }).text(_Hotel.parseNominal(balance)));
  row.childNodes[0].classList.add('td-right');
  row.childNodes[1].classList.add('td-right');
  row.childNodes[0].setAttribute('colspan',3);
  /* payment method */
  let pmethod=this.paymentMethods.hasOwnProperty(data.payment_method)
    ?this.paymentMethods[data.payment_method]:data.payment_method;
  row=table.row('Payment Method',pmethod);
  row.childNodes[0].setAttribute('colspan',3);
  row.childNodes[0].classList.add('td-right');
  row.childNodes[1].classList.add('td-center');
  /* footer */
  row=footer.row('');
  row.childNodes[0].style.padding='2px';
  row.childNodes[0].style.boxShadow='inset 0px 0px 150px #999';
  row=footer.row('Authorized Signature');
  row.childNodes[0].style.padding='5px 20px 10px';
  footer.style.marginTop='150px';
  footer.style.marginRight='30px';
  footer.style.float='right';
};
/* payment receipt for all front_office payment -- require: regid */
this.paymentReceipt=async function(regid,printX='all'){
  _Hotel.main.loader();
  let ptable='payment',
  queries=[
    'select * from '+ptable+' where regid='+regid,
    'select id,username as name from user',
    'select id,name from coa',
    'select id,name from extrabill',
    'select * from guest',
    'select * from room',
  ].join(';'),
  res=await _Hotel.request('queries',queries),
  payment=res[0].length>0?res[0][0]:null,
  users=res[1],
  coa=res[2],
  items=res[3],
  guests=res[4],
  rooms=res[5];
  this.rooms=rooms;
  if(payment==null){
    return _Hotel.alert('Error: Failed to get payment data!',payment,'error');
  }
  let data=_Hotel.parseJSON(payment.data)||[],
  transactionTypes={
    2:'registration',
    3:'extrabill_cart',
    4:'request_order',
    5:'payment',
    6:'room_service',
    7:'restaurant',
    8:'payment_resto',
  },
  types=_Hotel.transactionTypes;
  queries=[];
  for(let d of data){
    let type=types.hasOwnProperty(d.type)?types[d.type]:d.type;
    queries.push('select * from '+type+' where regid='+d.regid);
  }
  res=await _Hotel.request('queries',queries.join(';'));
  for(let k in data){
    data[k].data=res[k].length>0?res[k][0]:null;
  }
  /* element */
  let header=_Hotel.table(),
  table=_Hotel.table(),
  footer=_Hotel.table(),
  printButton=_Hotel.button('Print','purple','print',function(){
    window.print();
  }),
  section=_Hotel.element('div',{
    'class':'section row-buttons',
  },[printButton]),
  row=null;
  _Hotel.main.put('Payment Receipt',_Hotel.element('div',{
    'class':'section',
  },[
    header,table,footer,section
  ]));
  header.style.width='100%';
  table.style.width='100%';
  /* find bearer address and company name */
  let regData=_Hotel.getDataByKey('type',2,data,false),
  companyName=regData.data.market_name,
  guest=_Hotel.getDataById(regData.data.guest_id,guests),
  bearerAddress=guest?guest.address:'',
  bearerPhone=guest?guest.phone:'',
  bearerCardID=guest?guest.card_id:'',
  bearerCardType=guest?guest.card_type:'';
  /* header */
  row=table.row(
    'Receipt No.',
    payment.regid.toString().padStart(7,'0'),
    'Date',
    _Hotel.parseDate(),
  );
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[3].setAttribute('colspan',2);
  row.childNodes[0].style.width='135px';
  row.childNodes[1].style.minWidth='150px';
  row.childNodes[2].style.width='120px';
  /* header bearer name */
  row=table.row(
    'Payment Bearer',
    payment.bearer+' ('+companyName+')',
    'Officer',
    _Hotel.getValueById(payment.uid,'name',users),
  );
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[3].setAttribute('colspan',2);
  row.childNodes[0].style.width='135px';
  row.childNodes[0].style.minWidth='135px';
  row.childNodes[1].style.minWidth='150px';
  row.childNodes[2].style.width='120px';
  /* header bearer address */
  row=table.row('Address',bearerAddress+'<br />'+bearerPhone,'Card ID',bearerCardID+' ('+bearerCardType+')');
  row.childNodes[0].setAttribute('colspan',2);
  row.childNodes[3].setAttribute('colspan',2);
  row.childNodes[0].style.width='135px';
  row.childNodes[0].style.minWidth='135px';
  row.childNodes[1].style.minWidth='150px';
  row.childNodes[2].style.width='120px';
  /* body header */
  row=table.row(
    'RegID',
    'Description',
    'Amount (IDR)',
    'Deposit (IDR)',
    'Balance (IDR)',
  ).header();
  row.childNodes[0].style.width='90px';
  row.childNodes[1].setAttribute('colspan',2);
  row.childNodes[2].style.width='120px';
  row.childNodes[3].style.width='120px';
  row.childNodes[4].style.width='120px';
  /* get print x things */
  let sPrintXID={all:'ALL'};
  for(let d of data){
    sPrintXID[d.id]=d.type==2?'Check-in #'+d.regid
      :d.type==3?'Extrabill #'+d.regid
        :'Room Service #'+d.regid;
  }
  let sPrintX=_Hotel.select('printx',printX||'all',sPrintXID,function(){
    _HotelFrontOffice.paymentReceipt(this.dataset.regid,this.value);
  },{regid});
  section.append(sPrintX);
  /* detail of payment data */
  let totalAmount=0,
  totalDeposit=0;
  for(let d of data){
    if(printX!='all'&&printX!=d.id){continue;}
    let balance=parseInt(d.deposit,10)-parseInt(d.amount,10),
    type=types.hasOwnProperty(d.type)?types[d.type]:d.type,
    desc=(d.type==2
      ?[
        'Check-in on '+_Hotel.parseDate(d.data.date_arrival),
        'Room Number '+d.data.room_number+' &middot; '+
          _Hotel.getValueByKey('number',d.data.room_number,'code',this.rooms),
        d.data.nights+' night'+(d.data.nights>1?'s':'')
          +' &middot; '+(
              parseInt(d.data.head_count_child,10)+
              parseInt(d.data.head_count_male,10)+
              parseInt(d.data.head_count_female,10)
            )+' person'+(
              (
                parseInt(d.data.head_count_child,10)+
                parseInt(d.data.head_count_male,10)+
                parseInt(d.data.head_count_female,10)
              )>1?'s':''),
        'Check-out on '+_Hotel.parseDate(d.data.date_departure),
       ].join('<br /> &#8213; ')
      :d.type==3
        ?[
          'Extrabill',
          ..._Hotel.parseJSON(d.data.data).map(r=>[
            r.count+' '+_Hotel.getValueById(r.item_id,'name',items),
            '('+_Hotel.getValueById(r.coa_id,'name',coa)+')',
          ].join(' &middot; ')),
         ].join('<br /> &#8213; ')
        :d.type==6
          ?[
            'Room Service',
            ..._Hotel.parseJSON(d.data.data).map(r=>[
              r.name,
              r.count+' '+r.unit,
            ].join(' &middot; ')),
           ].join('<br /> &#8213; ')
          :type),
    row=table.row(
      d.regid,
      desc,
      _Hotel.parseNominal(d.amount),
      _Hotel.parseNominal(d.deposit),
      _Hotel.parseNominal(balance),
    );
    row.childNodes[0].classList.add('td-center');
    row.childNodes[1].setAttribute('colspan',2);
    row.childNodes[2].classList.add('td-right');
    row.childNodes[3].classList.add('td-right');
    row.childNodes[4].classList.add('td-right');
    totalAmount+=parseInt(d.amount,10);
    totalDeposit+=parseInt(d.deposit,10);
  }
  /* separator */
  row=table.row('').header();
  row.childNodes[0].setAttribute('colspan',6);
  row.childNodes[0].style.padding='1px';
  row=table.row('').header();
  row.childNodes[0].setAttribute('colspan',6);
  row.childNodes[0].style.padding='1px';
  /* total nominal: amount, deposit and balance */
  row=table.row(
    'Total',
    _Hotel.parseNominal(totalAmount),
    _Hotel.parseNominal(totalDeposit),
    _Hotel.parseNominal(totalDeposit-totalAmount),
  );
  row.childNodes[0].classList.add('td-right');
  row.childNodes[1].classList.add('td-right');
  row.childNodes[2].classList.add('td-right');
  row.childNodes[3].classList.add('td-right');
  row.childNodes[0].setAttribute('colspan',3);
  row.childNodes[1].style.fontWeight='bold';
  row.childNodes[2].style.fontWeight='bold';
  row.childNodes[3].style.fontWeight='bold';
  if(printX=='all'){
    /* paid */
    row=table.row('Paid (IDR)',_Hotel.parseNominal(payment.paid));
    row.childNodes[0].classList.add('td-right');
    row.childNodes[1].classList.add('td-right');
    row.childNodes[0].setAttribute('colspan',5);
    row.childNodes[1].style.fontWeight='bold';
    /* cashback */
    let balance=parseInt(payment.cashback,10);
    row=table.row('Cashback (IDR)',_Hotel.element('span',{
      'class':balance>=0?'balance-plus':'balance-minus',
      'style':'font-weight:bold;',
    }).text(_Hotel.parseNominal(balance)));
    row.childNodes[0].classList.add('td-right');
    row.childNodes[1].classList.add('td-right');
    row.childNodes[0].setAttribute('colspan',5);
  }
  /* payment method */
  let pmethod=this.paymentMethods.hasOwnProperty(payment.method)
    ?this.paymentMethods[payment.method]:payment.method;
  row=table.row('Payment Method',pmethod);
  row.childNodes[0].setAttribute('colspan',4);
  row.childNodes[0].classList.add('td-right');
  row.childNodes[1].classList.add('td-center');
  row.childNodes[1].setAttribute('colspan',2);
  /* footer */
  row=footer.row('');
  row.childNodes[0].style.padding='2px';
  row.childNodes[0].style.boxShadow='inset 0px 0px 150px #999';
  row=footer.row('Authorized Signature');
  row.childNodes[0].style.padding='5px 20px 10px';
  footer.style.marginTop='150px';
  footer.style.marginRight='30px';
  footer.style.float='right';
};



/* history */
this.history=async function(date='all',month,year){
  let defDate=_Hotel.production?(new Date).getDate():'all';
  year=year||(new Date).getFullYear();
  month=!isNaN(parseInt(month))?parseInt(month):(new Date).getMonth();
  date=date||defDate;
  _Hotel.main.loader();
  let datePadded=date=='all'?'01':date.toString().padStart(2,'0'),
  dateObject=new Date([
    year,
    (parseInt(month)+1).toString().padStart(2,'0'),
    datePadded,
  ].join('-')),
  kdate=Math.floor(year/4)==year?29:28,
  dateRangeLimit=month==1?kdate:this.dates[month],
  dateEndLimit=date=='all'?dateRangeLimit*24*3600:24*3600,
  dateTimeStart=Math.floor(dateObject.getTime()/1000),
  dateTimeEnd=dateTimeStart+dateEndLimit,
  query='select * from registration where status=1 and time > '+dateTimeStart
    +' and time  < '+dateTimeEnd+' order by id desc',
  data=await _Hotel.request('query',query),
  table=_Hotel.table(),
  row=table.row(
    'RegID',
    _Hotel.alias('guest_name'),
    _Hotel.alias('checkin_date'),
    _Hotel.alias('market_name'),
    _Hotel.alias('market_category'),
  ).header(),
  syear=_Hotel.select('year',year,_Hotel.getYears(),function(){
    _HotelFrontOffice.history(this.dataset.date,this.dataset.month,this.value);
  },{date,month,year}),
  smonth=_Hotel.select('month',month,_Hotel.arrayToObject(this.months),function(){
    _HotelFrontOffice.history(this.dataset.date,this.value,this.dataset.year);
  },{date,month,year}),
  sdate=_Hotel.select('date',date,[
    ...['all'],
    ..._Hotel.range(1,dateRangeLimit),
  ],function(){
    _HotelFrontOffice.history(this.value,this.dataset.month,this.dataset.year);
  },{date,month,year});
  /* title and put */
  _Hotel.main.put('History',_Hotel.element('div',{},[
    _Hotel.element('div',{},[
      syear,smonth,
    ]),
    table,
  ]));
  /* search */
  row=table.row(
    _Hotel.findRow('regid'),
    _Hotel.findRow('guest_name'),
    _Hotel.findRow('date_arrival'),
    _Hotel.findRow('market_name'),
    _Hotel.findRow('market_category'),
  );
  /* each data */
  for(let reg of data){
    let cDate=_Hotel.parseDate(reg.date_arrival),
    mName=_Hotel.alias(reg.market_name),
    mCategory=_Hotel.alias(reg.market_category),
    row=table.row(
      reg.regid,
      reg.guest_name,
      cDate,
      mName,
      mCategory,
    );
    row.dataset.regid=reg.regid;
    row.dataset.guest_name=reg.guest_name;
    row.dataset.date_arrival=cDate;
    row.dataset.market_name=mName;
    row.dataset.market_category=mCategory;
    row.childNodes[0].classList.add('td-center');
  }
};



/* registration save */
this.registrationSave=async function(data,button,id,tid){
  let buttonText=button.innerHTML.toString(),
  register={
    employee_id       :data.employee_id,
    type              :data.type,
    date_arrival      :data.date_arrival,
    date_departure    :data.date_departure,
    nights            :data.nights,
    market_category   :data.market_category,
    market_segment    :data.market_segment,
    market_name       :data.market_name,
    head_count_child  :data.head_count_child,
    head_count_female :data.head_count_female,
    head_count_male   :data.head_count_male,
    note              :data.note,
    room_number       :data.room_number,
    extra_bed_count   :data.extra_bed_count,
    extra_bed_night   :data.extra_bed_night,
    payment_amount    :data.payment_amount,
    payment_deposit   :data.payment_deposit,
    payment_discount  :data.payment_discount,
    payment_method    :data.payment_method,
  },
  registerQuery=_Hotel.buildQuery(register),
  transaction={
    uid     :data.employee_id,
    flow    :1,
    amount  :data.payment_amount,
    deposit :data.payment_deposit,
    type    :2,
    date    :(new Date).getDate(),
    month   :(new Date).getMonth(),
    year    :(new Date).getFullYear(),
  },
  transactionQuery=_Hotel.buildQuery(transaction),
  queries=[
    'update registration ('+registerQuery+') where id='+id,
    'update transaction ('+transactionQuery+') where id='+tid,
  ].join(';'),
  res=null,
  loader=_Hotel.loader();
  button.innerText='Saving...';
  res=await _Hotel.request('queries',queries);
  loader.remove();
  button.innerHTML=buttonText;
  this.registers();
};
/* reservation send */
this.reservationSend=async function(data,button){
  /* check a valid form */
  if(typeof data!=='object'||data===null){
    return _Hotel.alert('Error: Invalid form!','','error');
  }
  /* check guest name */
  if(data.guest_name==''){
    return _Hotel.alert('Error: Guest name is empty!','','error');
  }
  /* check the selected rooms */
  let checkedRooms=document.querySelectorAll('div[data-room-number]');
  if(data.room_number==''&&checkedRooms.length==0){
    return _Hotel.alert('Error: No room selected!','','error');
  }
  /* parse the selected rooms */
  let roomData=[];
  if(data.room_number==''){
    for(let i=0;i<checkedRooms.length;i++){
      let rnumber=checkedRooms[i].dataset.roomNumber,
      droom=_Hotel.getDataByKey('number',rnumber,this.rooms);
      roomData.push(droom);
    }
  }
  /* button and guest query */
  let buttonText=button.innerHTML.toString(),
  queries=[],
  uniqid=_Hotel.uniqid(data.market_transaction+'_'),
  guest={
    name        : data.guest_name,
    position    : 'guest',
    card_type   : data.guest_card,
    card_id     : data.guest_id.replace(/[^\d]+/g,''),
    phone       : data.guest_mobile,
    email       : data.guest_email,
    nationality : data.guest_nationality,
    guest_type  : data.guest_type,
    address     : data.guest_address,
    gender      : data.guest_greet=='Mr'||data.guest_greet=='Sir'?1:0,
    greet       : data.guest_greet,
    group_name  : uniqid,
  },
  guestQuery=_Hotel.buildQuery(guest),
  register={
    employee_id       :data.employee_id,
    guest_id          :0,
    guest_name        :data.guest_name,
    type              :data.market_transaction,
    regid             :parseInt(data.registration_id,10),
    date_arrival      :data.date_arrival,
    date_departure    :data.date_departure,
    nights            :data.nights,
    market_category   :data.market_category,
    market_segment    :data.market_segment,
    market_name       :data.market_name,
    head_count_child  :data.head_count_child,
    head_count_female :data.head_count_female,
    head_count_male   :data.head_count_male,
    note              :data.note,
    room_number       :data.room_number,
    extra_bed_count   :data.extra_bed_count,
    extra_bed_night   :data.extra_bed_night,
    payment_amount    :data.payment_amount,
    payment_deposit   :data.payment_deposit,
    payment_discount  :data.payment_discount,
    payment_method    :data.payment_method,
  },
  transaction={
    uid     :data.employee_id,
    regid   :parseInt(data.registration_id,10),
    flow    :1,
    amount  :data.payment_amount,
    deposit :data.payment_deposit,
    type    :2,
    date    :(new Date).getDate(),
    month   :(new Date).getMonth(),
    year    :(new Date).getFullYear(),
  },
  coa_method={
    cash:7,
    wire_mandiri:10,
    wire_bca:13,
    card_mandiri:10,
    card_bca:13,
    petty_cash:4,
    account_receivable:18,
    qris_mandiri:10,
    qris_bca:13,
  },
  coa_id=coa_method.hasOwnProperty(data.method)?coa_method[data.method]:7,
  preword=data.method=='account_receivable'
    ?'Account Receivable by '
    :(data.market_transaction=='registration'
      ?'Registration by '
      :'Reservation by '
    ),
  marketName=register.market_name,
  pmethod=_Hotel.paymentMethods.hasOwnProperty(data.payment_method)
    ?_Hotel.paymentMethods[data.payment_method]:data.payment_method;
  adjustment={
    year:(new Date).getFullYear(),
    month:(new Date).getMonth(),
    date:(new Date).getDate(),
    amount:data.payment_deposit,
    deposit:data.payment_deposit,
    flow:1,
    coa_id:coa_id,
    item_id:0,
    name:preword+data.guest_name,
    note:''+pmethod+' ('+marketName+')',
    regid:parseInt(data.registration_id,10),
    status:1,
  },
  payment={
    regid:parseInt(data.registration_id,10),
    status:1,
    flow:1,
    uid:data.employee_id,
    type:2,
    nominal:data.payment_deposit,
    paid:data.payment_deposit,
    cashback:0,
    method:data.payment_method,
    note:'Down Payment for Registration by '+data.guest_name+' ('+marketName+')',
    bearer:data.guest_name,
    data:JSON.stringify([
      {
        regid:parseInt(data.registration_id,10),
        type:2,
        amount:data.payment_amount,
        deposit:data.payment_deposit,
        flow:1
      }
    ]),
  };
  /* check registered guest --> register.guest_id */
  if(data.guest_registered==0){
    let res=await _Hotel.request('queries',[
        'insert into guest '+guestQuery,
        'select id,group_name,time from guest where group_name="'
          +uniqid+'" order by time desc',
      ].join(';')
    );
    if(res[0]==1
      &&Array.isArray(res[1])
      &&res[1].length>=1
      &&res[1][0].hasOwnProperty('id')){
      register.guest_id=res[1][0].id;
    }else{
      return _Hotel.alert('Error: Failed to get guest ID.','','error');
    }
  }else{
    register.guest_id=data.guest_registered;
    queries.push('update guest ('+guestQuery+') where id='+data.guest_registered);
  }
  /* multiple room_number */
  let isDeposited=false;
  if(data.room_number==''){
    let rqueries=[],
    regids=[],
    rkey=0;
    if(roomData.length>0){
      for(let i=0;i<roomData.length;i++){
        rqueries.push('insert into regid uid='+_Hotel.user.id+'&type=2');
        rkey++;
      }
      rqueries.push(
        'select * from regid where uid='
          +_Hotel.user.id+' and type=2 order by id desc limit '
          +(roomData.length)
      );
      let res=await _Hotel.request('queries',rqueries.join(';')),
      regidData=res[rkey],
      ri=regidData.length;
      while(ri--){
        let rd=regidData[ri];
        regids.push(rd.id);
      }
    }
    /* room data */
    for(let i in roomData){
      /* room */
      let droom=roomData[i];
      queries.push('update room_status (code=14) where room_id='+droom.id);
      /* amount, deposit and price/normal_rate */
      let price=parseInt(droom.normal_rate,10),
      depositAll=parseInt(data.payment_deposit,10),
      nights=parseInt(data.nights,10),
      deposit__Old=depositAll>0?Math.floor(depositAll/roomData.length):0,
      deposit=0,
      amount=price*nights;
      if(!isDeposited){
        deposit=depositAll;
        isDeposited=true;
      }
      /* extra bed price base -- could be updated -- 175000 */
      let extra_bed_price_base=_Hotel.getValueByKey('category',93,'nominal',this.prices),
      extra_bed_price=parseInt(extra_bed_price_base,10)
        *parseInt(data.extra_bed_count,10)
        *parseInt(data.extra_bed_night,10);
      amount+=extra_bed_price;
      /* registration */
      let nreg=register;
      nreg.regid=regids[i];
      nreg.room_number=droom.number;
      nreg.payment_amount=amount;
      nreg.payment_deposit=deposit;
      /* transaction */
      let ntran=transaction;
      ntran.regid=regids[i];
      ntran.amount=amount;
      ntran.deposit=deposit;
      /* adjustment */
      let nadj=adjustment;
      nadj.regid=regids[i];
      nadj.amount=deposit;
      nadj.deposit=deposit;
      /* payment */
      let npay=payment;
      npay.regid=regids[i];
      npay.nominal=deposit;
      npay.paid=deposit;
      npay.data=JSON.stringify([
        {
          regid:regids[i],
          type:2,
          amount:amount,
          deposit:deposit,
          flow:1
        }
      ]);
      /* registration table */
      queries.push('insert into registration '+_Hotel.buildQuery(nreg));
      /* transaction table */
      queries.push('insert into transaction '+_Hotel.buildQuery(ntran));
      /* adjustment */
      if(parseInt(deposit,10)>0){
        queries.push('insert into adjustment '+_Hotel.buildQuery(nadj));
        queries.push('insert into payment '+_Hotel.buildQuery(npay));
      }
    }
    /*
    table-->registration
      regid           : parseInt(data.registration_id,10)
      room_number     : data.room_number
      payment_amount  : data.payment_amount
      payment_deposit : data.payment_deposit
    table-->transaction
      regid      : parseInt(data.registration_id,10)
      amount     : data.payment_amount
      deposit    : data.payment_deposit
    table-->adjustment
      regid      : parseInt(data.registration_id,10)
      amount     : data.payment_amount
      deposit    : data.payment_deposit
    table-->payment
      regid      : parseInt(data.registration_id,10)
      nominal    : data.payment_deposit
      paid       : data.payment_deposit
      data       : JSON
    */
  }else{
    /* registration table */
    queries.push('insert into registration '+_Hotel.buildQuery(register));
    /* transaction table */
    queries.push('insert into transaction '+_Hotel.buildQuery(transaction));
    /* adjustment */
    if(parseInt(data.payment_deposit,10)>0){
      queries.push('insert into adjustment '+_Hotel.buildQuery(adjustment));
      queries.push('insert into payment '+_Hotel.buildQuery(payment));
    }
  }

  /* perform loader */
  let loader=_Hotel.loader();
  /* perform button processing */
  let fa=document.createElement('i'),
  ftext=document.createTextNode('Processing...');
  fa.classList.add('fa');
  fa.classList.add('fa-spin');
  fa.classList.add('fa-spinner');
  button.innerText='';
  button.append(fa);
  button.append(ftext);
  /* send the queries */
  let res=await _Hotel.request('queries',queries.join(';'));
  loader.remove();
  button.innerHTML=buttonText;
  this.registers(1,50,data.market_transaction);
};
/* reservation change state -- for the price */
this.reservationChangeState=function(){
  let rooms=_HotelFrontOffice.rooms||[],
  prices=_HotelFrontOffice.prices||[],
  room_number=document.querySelector('select[name="room_number"]'),
  payment_amount_parsed=document.querySelector('span#payment_amount_parsed'),
  payment_amount=document.querySelector('input[name="payment_amount"]'),
  payment_discount_parsed=document.querySelector('span#payment_discount_parsed'),
  payment_discount=document.querySelector('input[name="payment_discount"]'),
  payment_method=document.querySelector('select[name="payment_method"]'),
  payment_deposit=document.querySelector('input[name="payment_deposit"]'),
  payment_deposit_parsed=document.querySelector('span#payment_deposit_parsed'),
  payment_balance_parsed=document.querySelector('span#payment_balance_parsed'),
  payment_balance=document.querySelector('input[name="payment_balance"]'),
  nights=document.querySelector('select[name="nights"]'),
  extra_bed_count=document.querySelector('select[name="extra_bed_count"]'),
  extra_bed_night=document.querySelector('select[name="extra_bed_night"]'),
  /* extra bed price base -- could be updated -- 175000 */
  extra_bed_price_base=_Hotel.getValueByKey('category',93,'nominal',prices),
  extra_bed_price=parseInt(extra_bed_price_base,10)
    *parseInt(extra_bed_count.value,10)
    *parseInt(extra_bed_night.value,10),
  length=parseInt(nights.value,10),
  room_price=0;
  /* room -- multiple rooms */
  if(room_number.disabled){
    let room=_Hotel.getDataByKey('number',room_number.value,rooms);
    if(room){
      room_price=parseInt(room.normal_rate,10);
    }
  }else if(room_number.value!=''){
    let froom=document.querySelector('div[data-room-number="'+room_number.value+'"]');
    if(!froom){
      let room=_Hotel.getDataByKey('number',room_number.value,rooms);
      _HotelFrontOffice.checkerRoom(room.number,room.code,room.normal_rate);
    }
    room_number.value='';
  }else{
    let room=_Hotel.getDataByKey('number',room_number.value,rooms);
    if(room){
      room_price=parseInt(room.normal_rate,10);
    }
  }
  /* set multiple-price */
  let checkedRooms=document.querySelectorAll('div[data-room-number]'),
  ci=checkedRooms.length;
  while(ci--){
    let croom=checkedRooms[ci];
    room_price+=parseInt(croom.dataset.roomPrice,10);
  }

  /* price calculation */
  let deposit=parseInt(payment_deposit.value||0,10),
  discount=parseInt(payment_discount.value||0,10),
  amount=(length*room_price)+extra_bed_price,
  balance=deposit-(amount-discount);
  /* start printing */
  payment_discount_parsed.innerText=_Hotel.parseNominal(discount);
  payment_amount.value=amount;
  payment_amount_parsed.innerText=_Hotel.parseNominal(amount);
  payment_balance.value=balance;
  payment_deposit_parsed.innerText=_Hotel.parseNominal(deposit);
  payment_balance_parsed.innerText=_Hotel.parseNominal(balance);
  if(balance<0){
    payment_balance_parsed.classList.remove('balance-plus');
    payment_balance_parsed.classList.add('balance-minus');
  }else{
    payment_balance_parsed.classList.remove('balance-minus');
    payment_balance_parsed.classList.add('balance-plus');
  }
};
/* avaliable rooms -- output: object of select element */
this.availableRooms=function(rooms,status,rdata){
  let available_rooms={},
  ready_codes=[6],
  room_selector=document.createElement('select');
  room_selector.classList.add('available-rooms');
  room_selector.name='room_number',
  room_available=0,
  room_number=typeof rdata==='object'&&rdata!==null?rdata.room_number:0;
  /* empty option */
  if(typeof rdata!=='object'||rdata===null){
    let opt=document.createElement('option');
    opt.value='';
    opt.textContent='[--- SELECT ROOM ---]';
    opt.selected='selected';
    room_selector.append(opt);
  }
  /* room selector */
  for(let room of rooms){
    let sts=_Hotel.getDataByKey('room_id',room.id,status);
    if(ready_codes.indexOf(parseInt(sts.code))>=0||room_number==room.number){
      let key=[room.name,room.type].join(' ');
      if(!available_rooms.hasOwnProperty(key)){
        available_rooms[key]={};
      }
      available_rooms[key][room.number]=[room.number,atob('tw'),room.code].join(' ');
    }
  }
  for(let akey in available_rooms){
    let optgroup=document.createElement('optgroup');
    optgroup.label=akey;
    room_selector.append(optgroup);
    for(let aid in available_rooms[akey]){
      room_available++;
      let opt=document.createElement('option');
      opt.value=aid;
      opt.innerHTML='&nbsp;&#8594; '+available_rooms[akey][aid];
      room_selector.append(opt);
      if(typeof rdata==='object'&&rdata!==null&&aid==rdata.room_number){
        opt.selected='selected';
        opt.innerHTML='&nbsp;&#8594; '+available_rooms[akey][aid]+' [CURRENT]';
      }
    }
  }
  room_selector.dataset.available=room_available+'';
  return room_selector;
};
/* prepare data -- object of updated data */
this.prepareData=async function(regid=false,qs=[]){
  let guest_columns=[
    'id',
    'name',
    'card_id',
    'card_type',
    'phone',
    'email',
    'nationality',
    'guest_type',
    'address',
    'greet',
  ].join(','),
  queries=[
    'select * from room_status',
    'select * from room',
    'select * from room_status_info',
    'select '+guest_columns+' from guest',
    'select * from market',
    'select * from price where division="front_office" and category=93',
  ];
  if(regid){
    queries.push('insert into regid uid='+_Hotel.user.id+'&type=2');
    queries.push('select * from regid where uid='+_Hotel.user.id+' and type=2 order by id desc limit 1');
  }
  if(Array.isArray(qs)&&qs.length>0){
    queries=[...queries,...qs];
  }
  let data=await _Hotel.request('queries',queries.join(';')),
  res={
    status:data[0],
    rooms:data[1],
    infos:data[2],
    guests:data[3],
    markets:data[4],
    prices:data[5],
    _data:data,
  };
  if(regid){
    res.reginsert=data[6];
    res.regids=data[7];
  }
  return res;
};
/* room checker */
this.checkerRoom=function(number=0,code='',price=0){
  let checked=document.createElement('div'),
  closer=document.createElement('span'),
  innerText=[number,atob('tw'),code].join(' '),
  text=document.createTextNode(innerText),
  space=document.createTextNode(' '),
  checkers=document.getElementById('room-checker');
  checked.dataset.roomNumber=number+'';
  checked.dataset.roomCode=code+'';
  checked.dataset.roomPrice=price+'';
  checked.classList.add('checked-room');
  checked.append(text);
  checked.append(closer);
  if(checkers){
    checkers.append(checked);
    checkers.append(space);
  }
  closer.onclick=function(){
    this.parentNode.remove();
    _HotelFrontOffice.reservationChangeState();
  };
  return checked;
};



/* time query -- prepare */
this.timeQuery=function(date,month,year){
  let defDate=_Hotel.production?(new Date).getDate():'all';
  year=year||(new Date).getFullYear();
  month=!isNaN(parseInt(month))?parseInt(month):(new Date).getMonth();
  date=date||defDate;
  _Hotel.main.loader();
  let datePadded=date=='all'?'01':date.toString().padStart(2,'0'),
  dateObject=new Date([
    year,
    (parseInt(month)+1).toString().padStart(2,'0'),
    datePadded,
  ].join('-')),
  kdate=Math.floor(year/4)==year?29:28,
  dateRangeLimit=month==1?kdate:this.dates[month],
  dateEndLimit=date=='all'?dateRangeLimit*24*3600:24*3600,
  dateTimeStart=Math.floor(dateObject.getTime()/1000),
  dateTimeEnd=dateTimeStart+dateEndLimit;
  return {
    query:'time > and time < ',
  };
};

/* guest names --> from registers */
this.getGuestNames=function(data=[]){
  let res=[],
  stored=[];
  for(let d of data){
    if(stored.indexOf(d.guest_name)>=0){
      continue;
    }
    res.push({
      id:d.guest_id,
      name:d.guest_name,
    });
    stored.push(d.guest_name);
  }
  return res;
};
/* get coa name from this.coa array */
this.getCoaName=function(id){
  return _Hotel.getValueById(parseInt(id),'name',this.coa);
};
/* get data by room_number */
this.getArrayByRoomNumber=function(number=0,data=[],limit=30){
  let res=[],
  today=new Date(this.getDateToday()),
  rooms=_Hotel.getDataByKey('room_number',number,data,true),
  roomo={},
  days=_Hotel.range(1,limit).map(function(r){
    let date=new Date;
    date.setDate(date.getDate()+(r-1));
    return date.getDate();
  });
  for(let room of rooms){
    let d=new Date(room.date_arrival),
    n=parseInt(room.nights),
    t=d.getDate();
    if(d.getTime()>=today.getTime()){
      roomo[t]=t;
    }
    for(let i of _Hotel.range(1,n)){
      d.setDate(t+i);
      let nt=d.getDate();
      if(d.getTime()>=today.getTime()){
        roomo[nt]=nt;
      }
    }
  }
  for(let date of days){
    res.push(
      roomo.hasOwnProperty(date)
      ?_Hotel.element('div',{
          'class':'room-status-occupied',
        }).text('+')
      :' '
    )
  }
  return res;
};
/* arrival and departure date query -- stand-alone */
this.arrivalDepartureQuery=function(){
  let date=new Date;
  date.setDate(date.getDate()-1);
  let newDate=[
    date.getFullYear(),
    (date.getMonth()+1).toString().padStart(2,'0'),
    date.getDate().toString().padStart(2,'0'),
  ].join('-');
  return 'date_arrival > "'+newDate+'" or date_departure > "'+newDate+'"';
};
/* get date -- stand-alone */
this.getDateToday=function(add=0,xdate){
  let d=typeof xdate==='string'?new Date(xdate):new Date;
  d.setDate(d.getDate()+parseInt(add));
  return [
    d.getFullYear(),
    (d.getMonth()+1).toString().padStart(2,'0'),
    d.getDate().toString().padStart(2,'0'),
  ].join('-');
};
/* time to date - 10 digit time to date */
this.timeToDate=function(digit=0){
  let d=new Date(parseInt(digit,10)*1000);
  return [
    d.getFullYear(),
    (d.getMonth()+1).toString().padStart(2,'0'),
    d.getDate().toString().padStart(2,'0'),
  ].join('-');
};
this.getGrandTotal=function(){
  let fdata=_Hotel.formSerialize(true),
  data=_Hotel.parseJSON(fdata.data),
  gtotal=0;
  for(let i in data){
    let val=data[i],
    subtotal=parseInt(val.price,10)*parseInt(val.count,10);
    gtotal+=subtotal;
  }return gtotal;
};
this.itemCategory=function(k=0){
  return this.itemCategories.hasOwnProperty(k)
    ?this.itemCategories[k]:'-';
};
/* initialize */
return this.init();
};



/* HotelAdmin -- HRD */
;function HotelAdmin(){
/* bring to global variable */
window._HotelAdmin=this;
this.statuses={
  0:'Draft',
  1:'Pending',
  2:'Done',
  3:'Approved',
};
/* init as contructor */
this.init=function(){
  return this;
};
/* menus -- [required] */
this.menus=function(){
  let menus=[
    {
      name:'Dashboard',
      icon:'dashboard',
      callback:function(){
        _HotelAdmin.dashboard();
      },
    },
    {
      name:'Request Orders',
      icon:'wpforms',
      callback:function(){
        _HotelAdmin.requestOrders();
      },
    },
    {
      name:'Room Status',
      icon:'building-o',
      callback:function(){
        _HotelAdmin.roomStatus();
      },
    },
    {
      name:'Employees',
      icon:'handshake-o',
      callback:function(){
        _HotelAdmin.employees();
      },
    },
    {
      name:'Users',
      icon:'users',
      callback:function(){
        _HotelAdmin.users();
      },
    },
  ];
  return menus;
};
/* dashboard -- [required] */
this.dashboard=async function(){
  _Hotel.main.loader();
  /* ---------- DASHBOARD ---------- */
  let id='report-of-the-week',
  text='Loading...  &#8213; The Last Report',
  image=_Hotel.element('img',{
    alt:'',
    src:_Hotel.IMAGES['loader.gif'],
    style:'margin-right:10px',
  }),
  pre=_Hotel.element('pre',{
    id,
    style:'white-space:pre-wrap',
  }).html(text);
  pre.insertBefore(image,pre.firstChild);
  _Hotel.main.put('Dashboard',pre);
  let concept=await fetch(_Hotel.hosts.lastReport).then(r=>r.text()),
  el=document.querySelector('pre#'+id);
  if(el){
    el.innerHTML='';
    el.append(concept);
  }
};
/* request orders */
this.requestOrders=async function(){
  _Hotel.main.loader();
  let queries=[
    'select * from request_order order by id desc',
    'select id,username from user',
  ].join(';'),
  data=await _Hotel.request('queries',queries),
  orders=data[0],
  users=data[1],
  counter=0,
  table=_Hotel.table();
  _Hotel.main.put('Request Orders',table);
  table.row(
    'No',
    'RegID',
    _Hotel.alias('date_request'),
    _Hotel.alias('price_estimation'),
    _Hotel.alias('operator'),
    _Hotel.alias('status'),
    _Hotel.alias('note'),
    '',
  ).header();
  table.row(
    '',
    _Hotel.findRow('regid'),
    _Hotel.findRow('sdate'),
    _Hotel.findRow('estimate'),
    _Hotel.findRow('uname'),
    _Hotel.findRow('statusRO'),
    _Hotel.findRow('note'),
    '',
  );
  for(let row of orders){
    counter++;
    let sdate=_Hotel.parseDate(parseInt(row.time,10)*1000),
    estimate=_Hotel.parseNominal(row.estimate),
    uname=_Hotel.getValueById(row.uid,'username',users),
    statusRO=this.statuses.hasOwnProperty(row.status)?this.statuses[row.status]:'-',
    statusSpan=_Hotel.element('span',{
      id:'status-'+row.regid,
    }).text(statusRO),
    regid=row.regid.toString().padStart(7,'0'),
    approve=_Hotel.button('Approve','blue','send',async function(){
      let yes=await _Hotel.confirmX('Approve this request?');
      if(!yes){return;}
      let span=document.getElementById('status-'+this.dataset.regid), 
      loader=_Hotel.loader(),
      query='update request_order (status=3) where regid='
        +this.dataset.regid,
      res=await _Hotel.request('query',query);
      loader.remove();
      if(res==1){
        this.remove();
        if(span){
          span.text('Approved');
        }
        return;
      }
      return _Hotel.alert('Error: Failed to approve request!',res,'error');
    },{
      regid:row.regid,
    }),
    view=_Hotel.button('View','green','search',function(){
      _Hotel.dialogView(this.dataset.type,this.dataset.regid);
    },{
      type:4,
      regid:row.regid,
    }),
    tr=table.row(
      counter,
      regid,
      sdate,
      estimate,
      uname,
      statusSpan,
      row.note,
      _Hotel.element('div',{
        'class':'td-buttons',
      },[view,(row.status!=1?'':approve)]),
    );
    tr.dataset.regid=regid;
    tr.dataset.sdate=sdate;
    tr.dataset.estimate=estimate;
    tr.dataset.uname=uname;
    tr.dataset.statusRO=statusRO;
    tr.dataset.note=row.note;
    tr.childNodes[0].classList.add('td-center');
    tr.childNodes[1].classList.add('td-center');
    tr.childNodes[3].classList.add('td-right');
  }
};
/* room status page */
this.roomStatus=async function(){
  _Hotel.main.loader();
  let allowedStatus=_Hotel.range(0,18),
  table=await _Hotel.roomStatus(allowedStatus);
  _Hotel.main.put('Room Status',table);
  table.interval();
};
/* employee add */
this.employeeAdd=async function(){
  _Hotel.main.loader();
  let wrap=document.createElement('div'),
  table=_Hotel.table(),
  row=document.createElement('div'),
  save=_Hotel.button('Save','blue','save',async function(){
    let fdata=_Hotel.formSerialize();
    delete fdata.data;
    fdata.name=fdata.name.trim();
    let loader=_Hotel.loader(),
    innerQuery=_Hotel.buildQuery(fdata),
    query='insert into employee '+innerQuery,
    res=await _Hotel.request('query',query);
    loader.remove();
    if(res==1){
      await _Hotel.alertX('Saved!','','success');
      return _HotelAdmin.employees();
    }
    return _Hotel.alert('Error: Failed to save!','','error');
  },{}),
  passes=['time'],
  read=['id'],
  select=['nationality','division','position','religion','card_type'],
  number=['phone'],
  cards=['KTP','SIM','Passport','Other'],
  religions=_Hotel.religions,
  user={
    name:'',
    division:'Security',
    position:'security',
    card_id:'',
    card_type:'KTP',
    birthplace:'',
    birthdate:'2001-01-01',
    gender:0,
    address:'',
    phone:'',
    email:'',
    religion:'Islam',
    nationality:'Indonesia',
  };
  table.row('Key','Value');
  table.tbody.childNodes[0].classList.add('tr-head');
  for(let key in user){
    let value=user[key],
    type='text',
    val=value;
    if(passes.indexOf(key)>=0){
      continue;
    }else if(select.indexOf(key)>=0){
      let sdata=key=='division'?_Hotel.divisions
        :key=='position'?_Hotel.positions
          :key=='nationality'&&Array.isArray(NATIONS)?NATIONS
            :key=='religion'?religions
              :key=='card_type'?cards:{};
      val=_Hotel.select(key,value,sdata,function(){
        this.value;
      });
    }else if(key=='address'){
      val=_Hotel.textarea(key,value,_Hotel.alias(key),100);
    }else if(key=='gender'){
      val=this.radioGender(value);
    }else if(key=='birthdate'){
      val=_Hotel.dateSelection({
        id:'birthdate-selection',
        key:key,
        value:value,
        min:'1960-01-01',
        max:'2010-12-31',
      });
    }else if(read.indexOf(key)<0){
      type=number.indexOf(key)>=0?'number':type;
      val=_Hotel.input(key,value,type,_Hotel.alias(key));
      if(key=='name'){
        val.onkeyup=function(){
          this.value=this.value.toUpperCase();
        };
      }
    }
    table.row(_Hotel.alias(key),val);
  }
  wrap.append(table);
  wrap.append(row);
  row.append(save);
  row.classList.add('row-buttons');
  row.classList.add('section');
  _Hotel.main.put('Employee Add ',wrap);
};
/* employee edit */
this.employeeEdit=async function(id){
  _Hotel.main.loader();
  let table=_Hotel.table(),
  row=document.createElement('div'),
  wrap=_Hotel.main.double(table,row),
  save=_Hotel.button('Save','blue','save',async function(){
    let fdata=_Hotel.formSerialize();
    delete fdata.data;
    fdata.time=Math.ceil((new Date).getTime()/1000);
    let loader=_Hotel.loader(),
    innerQuery=_Hotel.buildQuery(fdata),
    query='update employee ('+innerQuery+') where id='+this.dataset.id,
    res=await _Hotel.request('query',query);
    loader.remove();
    if(res==1){
      return _Hotel.alert('Saved!','','success');
    }
    return _Hotel.alert('Error: Failed to save!','','error');
  },{id:id}),
  passes=['time'],
  read=['id'],
  select=['nationality','division','position','religion','card_type'],
  number=['phone'],
  cards=['KTP','SIM','Passport','Other'],
  religions=_Hotel.religions,
  query='select * from employee where id='+id,
  data=await _Hotel.request('query',query),
  user=data.length>0?{
    id:data[0].id,
    name:data[0].name,
    division:data[0].division,
    position:data[0].position,
    card_id:data[0].card_id,
    card_type:data[0].card_type,
    birthplace:data[0].birthplace,
    birthdate:data[0].birthdate,
    gender:data[0].gender,
    address:data[0].address,
    phone:data[0].phone,
    email:data[0].email,
    religion:data[0].religion,
    nationality:data[0].nationality,
    time:data[0].time,
  }:false;
  if(user===false){
    return _Hotel.alert('Error: Failed to get employee data!',data,'error');
  }
  let del=_Hotel.button('Unlock','red','unlock',async function(){
    let yes=await _Hotel.confirmX('Unlock employee?',this.dataset.name);
    if(!yes){return;}
    let loader=_Hotel.loader(),
    data=await _Hotel.request('query','select profile_id from user where profile_id='+this.dataset.id);
    if(data.length>0){
      loader.remove();
      return _Hotel.alert('Employee has been unlocked!','','success');
    }
    let innerQuery=_Hotel.buildQuery({
      username:this.dataset.name.trim(),
      passcode:'$2y$10$.fHBTvCSRm9k3zNL9JK2te8VNtnpjGOviguGXDeCcN7BG9POxHUea',
      profile_id:this.dataset.id,
      privilege:4,
      scope:'account,'+this.dataset.division,
      type:'employee',
    }),
    query='insert into user '+innerQuery,
    res=await _Hotel.request('query',query);
    loader.remove();
    if(res==1){
      await _Hotel.alertX('Employee has been unlocked!','','success');
      return _HotelAdmin.employeeEdit(this.dataset.id);
    }
    return _Hotel.alert('Error: Failed to unlock!',res,'error');
  },{
    id:id,
    name:user.name.trim().toUpperCase(),
    division:user.division,
  });
  for(let key in user){
    let value=user[key],
    type='text',
    val=value;
    if(passes.indexOf(key)>=0){
      continue;
    }else if(select.indexOf(key)>=0){
      let sdata=key=='division'?_Hotel.divisions
        :key=='position'?_Hotel.positions
          :key=='nationality'&&Array.isArray(NATIONS)?NATIONS
            :key=='religion'?religions
              :key=='card_type'?cards:{};
      val=_Hotel.select(key,value,sdata,function(){
        this.value;
      });
    }else if(key=='address'){
      val=_Hotel.textarea(key,value,_Hotel.alias(key),100);
    }else if(key=='gender'){
      val=this.radioGender(value);
    }else if(key=='birthdate'){
      val=_Hotel.dateSelection({
        id:'birthdate-selection',
        key:key,
        value:value,
        min:'1960-01-01',
        max:'2010-12-31',
      });
    }else if(read.indexOf(key)<0){
      type=number.indexOf(key)>=0?'number':type;
      val=_Hotel.input(key,value,type,_Hotel.alias(key));
      if(key=='name'){
        val.onkeyup=function(){
          this.value=this.value.toUpperCase();
        };
      }
    }
    table.row(_Hotel.alias(key),val);
  }
  table.classList.add('table-register');
  row.append(save);
  row.classList.add('row-buttons');
  row.classList.add('section');
  _Hotel.main.put('Employee Edit #'+id,wrap);
  let ndata=await _Hotel.request('query','select profile_id from user where profile_id='+id);
  if(Array.isArray(ndata)&&ndata.length==0){
    row.append(del);
  }
};
/* employees */
this.employees=async function(){
  _Hotel.main.loader();
  let table=_Hotel.table(),
  add=_Hotel.button('Add','green','plus',function(){
    _HotelAdmin.employeeAdd();
  });
  data=await _Hotel.request('query','select * from employee'
    +(_Hotel.user.id!=1?' where id > 1':''));
  data=Array.isArray(data)?data:[];
  table.row(
    _Hotel.alias('id'),
    _Hotel.alias('name'),
    _Hotel.alias('position'),
    _Hotel.alias('division'),
    add,
  ).header();
  table.row(
    _Hotel.findRow('id'),
    _Hotel.findRow('name'),
    _Hotel.findRow('position'),
    _Hotel.findRow('division'),
    '',
  );
  for(let user of data){
    if(user.id==_Hotel.user.profile_id){continue;}
    let edit=_Hotel.button('Edit','blue','edit',function(){
      _HotelAdmin.employeeEdit(this.dataset.id);
    },{id:user.id}),
    tr=table.row(
      user.id,
      user.name,
      _Hotel.aliasPosition(user.position),
      _Hotel.aliasDivision(user.division),
      edit,
    );
    tr.dataset.id=user.id;
    tr.dataset.name=user.name;
    tr.dataset.position=_Hotel.aliasPosition(user.position);
    tr.dataset.division=_Hotel.aliasPosition(user.division);
    tr.childNodes[0].classList.add('td-center');
  }
  _Hotel.main.put('Employees',table);
};
/* user edit */
this.userEdit=async function(id){
  _Hotel.main.loader();
  let table=_Hotel.table(),
  row=document.createElement('div'),
  wrap=_Hotel.main.double(table,row),
  save=_Hotel.button('Save','blue','save',async function(){
    let fdata=_Hotel.formSerialize();
    delete fdata.data;
    let loader=_Hotel.loader(),
    innerQuery=_Hotel.buildQuery(fdata),
    query='update user ('+innerQuery+') where id='+this.dataset.id,
    res=await _Hotel.request('query',query);
    loader.remove();
    if(res!=1){
      return _Hotel.alert('Error: Failed update user!',res,'error');
    }
    await _Hotel.alertX('Saved!','','success');
    _HotelAdmin.users();
  },{id:id}),
  data=await _Hotel.request(
    'query',
    'select id,username,privilege,scope,active,type,profile_id from user'
      +' where id='+id
  );
  if(!Array.isArray(data)||data.length<1){
    return await _Hotel.alertX('Error',JSON.stringify(data),'error');
  }
  let user=data[0],
  loginas=_Hotel.button('LoginAs','blue','sign-in',async function(){
    let loader=_Hotel.loader(),
    data=await _Hotel.request('query','select * from '+this.user.type+' where id='+this.user.profile_id);
    loader.remove();
    let revData=_Hotel.userData();
    _Hotel.userData(revData,'reverse');
    this.user.token=_Hotel.user.token;
    this.user.reverse=true;
    this.user.profile=data[0];
    _Hotel.userData(this.user);
    _Hotel.start();
  },{id}),
  read=['id','username','privilege','type','profile_id'];
  loginas.user=user;
  for(let key in user){
    let value=user[key],
    val=_Hotel.input(key,value,'text',_Hotel.alias(key));
    if(read.indexOf(key)>=0){
      val=value;
    }else if(key=='scope'){
      val=this.scopeSelect(value);
    }else if(key=='active'){
      val=this.radioActive(value);
    }
    table.row(_Hotel.alias(key),val);
  }
  row.append(save);
  row.classList.add('row-buttons');
  row.classList.add('section');
  _Hotel.main.put('User Edit #'+id,wrap);
  if(_Hotel.user.privilege>=8){
    row.append(loginas);
  }
};
/* users */
this.users=async function(){
  _Hotel.main.loader();
  let table=_Hotel.table(),
  data=await _Hotel.request('query','select id,username,privilege,scope,active,type,profile_id from user'
    +' where privilege < '+(parseInt(_Hotel.user.privilege,10)+1));
  data=Array.isArray(data)?data:[];
  table.row(
    _Hotel.alias('id'),
    _Hotel.alias('username'),
    _Hotel.alias('privilege'),
    _Hotel.alias('scope'),
    '',
  ).header();
  table.row(
    _Hotel.findRow('id'),
    _Hotel.findRow('username'),
    _Hotel.findRow('privilege'),
    _Hotel.findRow('scope'),
    '',
  );
  for(let user of data){
    let edit=_Hotel.button('Edit','blue','edit',function(){
      _HotelAdmin.userEdit(this.dataset.id);
    },{id:user.id}),
    active=document.createElement('span');
    active.innerText=user.profile_id;
    active.classList.add('user-'+(user.active=='1'?'active':'inactive'));
    active.dataset.id=user.id;
    active.onclick=async function(){
      let yes=await _Hotel.confirmX('Reset the password?'),
      npass='$2y$10$.fHBTvCSRm9k3zNL9JK2te8VNtnpjGOviguGXDeCcN7BG9POxHUea',
      query='update user (passcode='+npass+') where id='+this.dataset.id;
      if(!yes){return;}
      let loader=_Hotel.loader(),
      res=await _Hotel.request('query',query);
      loader.remove();
      _Hotel.alert('Password updated!',res,'success');
    };
    let scope=[],
    scopes=user.scope=='*'?_Hotel.apps:user.scope.split(',');
    for(let scp of scopes){
      scope.push(_Hotel.aliasDivision(scp));
    }
    let tr=table.row(
      active,
      user.username,
      user.privilege,
      scope.join(', '),
      edit,
    );
    tr.dataset.id=user.id;
    tr.dataset.username=user.username;
    tr.dataset.privilege=user.privilege;
    tr.dataset.scope=scope.join(', ');
    tr.childNodes[0].classList.add('td-center');
    tr.childNodes[2].classList.add('td-center');
  }
  _Hotel.main.put('Users',table);
};

/* ---------- STAND-ALONE ---------- */
this.radioGender=function(value){
  let div=document.createElement('div'),
  rad0=document.createElement('input'),
  lab0=document.createElement('label'),
  rad1=document.createElement('input'),
  lab1=document.createElement('label');
  rad0.type='radio';
  rad1.type='radio';
  rad0.id='gender-female';
  lab0.setAttribute('for','gender-female');
  rad1.id='gender-male';
  lab1.setAttribute('for','gender-male');
  lab0.classList.add('radio');
  lab0.classList.add('radio-female');
  lab1.classList.add('radio');
  lab1.classList.add('radio-male');
  rad0.name='gender';
  rad1.name='gender';
  rad0.value='0';
  rad1.value='1';
  if(value==1){
    rad1.checked='checked';
  }else{
    rad0.checked='checked';
  }
  lab0.innerText='Perempuan';
  lab1.innerText='Laki-Laki';
  div.append(rad0);
  div.append(lab0);
  div.append(rad1);
  div.append(lab1);
  return div;
};
this.scopeSelect=function(value){
  let scopes=value=='*'?_Hotel.apps:value.split(','),
  key='scope',
  val=document.createElement('div'),
  sselect=document.createElement('select'),
  sinput=document.createElement('input'),
  opt=document.createElement('option');
  sinput.type='hidden';
  sinput.value=scopes.join(',');
  sinput.name=key;
  sselect.style.marginBottom='15px';
  val.style.marginBottom='10px';
  val.style.lineHeight='35px';
  val.id='scope-main';
  val.append(sselect);
  val.append(sinput);
  opt.value='';
  opt.textContent='---SCOPE---';
  sselect.append(opt);
  for(let k in _Hotel.divisions){
    opt=document.createElement('option');
    opt.value=k;
    opt.textContent=_Hotel.divisions[k];
    sselect.append(opt);
  }
  for(let scope of scopes){
    let scp=this.scopeSpan(scope),
    ntext=document.createTextNode(' ');
    val.append(scp);
    val.append(ntext);
  }
  sselect.onchange=function(){
    let sp=document.querySelector('input[name="scope"]'),
    ntext=document.createTextNode(' '),
    pr=document.getElementById('scope-main'),
    nscope=_HotelAdmin.scopeSpan(this.value),
    scopes=sp.value.split(',');
    scopes.push(this.value);
    sp.value=scopes.join(',');
    pr.append(nscope);
    pr.append(ntext);
    this.value='';
  };
  return val;
};
this.scopeSpan=function(scope,show=true){
  let scp=document.createElement('span'),
  sdel=document.createElement('span');
  sdel.classList.add('tap-delete');
  sdel.dataset.scope=scope;
  scp.classList.add('tap');
  scp.innerText=_Hotel.divisions[scope];
  scp.id='scope-'+scope;
  if(show){
    scp.append(sdel);
  }
  sdel.onclick=function(){
    let sp=document.querySelector('input[name="scope"]'),
    scopes=sp.value.split(','),
    pr=document.getElementById('scope-'+this.dataset.scope),
    res=[];
    for(let scope of scopes){
      if(scope!=this.dataset.scope){
        res.push(scope);
      }
    }
    sp.value=res.join(',');
    pr.remove();
  };
  return scp;
};
this.radioActive=function(value=0){
  let div=document.createElement('div'),
  rad0=document.createElement('input'),
  lab0=document.createElement('label'),
  rad1=document.createElement('input'),
  lab1=document.createElement('label');
  rad0.type='radio';
  rad1.type='radio';
  rad0.id='radio-inactive';
  lab0.setAttribute('for','radio-inactive');
  rad1.id='radio-active';
  lab1.setAttribute('for','radio-active');
  lab0.classList.add('radio');
  lab0.classList.add('radio-inactive');
  lab1.classList.add('radio');
  lab1.classList.add('radio-active');
  rad0.name='active';
  rad1.name='active';
  rad0.value='0';
  rad1.value='1';
  if(value==1){
    rad1.checked='checked';
  }else{
    rad0.checked='checked';
  }
  lab0.innerText='Inactive';
  lab1.innerText='Active';
  div.append(rad0);
  div.append(lab0);
  div.append(rad1);
  div.append(lab1);
  return div;
};
/* initialize */
return this.init();
};



/* HotelSecurity */
;function HotelSecurity(){
window._HotelSecurity=this;

};



/* HotelEngineering */
;function HotelEngineering(){
window._HotelEngineering=this;
};



/* HotelUnspecified */
;function HotelUnspecified(){
/* bring to global variable */
window._HotelUnspecified=this;
/* init as contructor */
this.init=function(){
  return this;
};
/* menus -- [required] */
this.menus=function(){
  let menus=[
    {
      name:'Dashboard',
      icon:'dashboard',
      callback:function(){
        _HotelUnspecified.dashboard();
      },
    },
  ];
  return menus;
};
/* dashboard -- [required] */
this.dashboard=async function(){
  _Hotel.main.loader();
  await _Hotel.sleep(300);
  /* ---------- DASHBOARD ---------- */
  let lcontent=document.createElement('div'),
  rcontent=document.createElement('div'),
  all=_Hotel.main.double(lcontent,rcontent);
  lcontent.innerHTML='Welcome, '+_Hotel.user.profile.name+'!'
    +'<br />This is <strong>unspecified</strong> section.'
    +'<br />Because you\'re a demo account, you\'re restricted to other sections.'
    +'<br />But you\'re still able to access your account/profile and edit it as your wish.'
    +'<br />'
    +'<br />Hope you enjoy it!'
    +''
    +'';
  rcontent.innerHTML='Thank you very much for coming here!'
    +'<br />We are glad you have successfully logged in to this Administration page.'
    +'<br />'
    +'<br />We are inprogress building this app, because this app using '
      +'<a href="https://github.com/9r3i/abl.js" target="_blank">abl.js</a> '
      +'to update silently in background.'
    +'<br />So, we don\'t need to get reviewed everytime we update the app.'
    +'<br />'
    +'<br />--9r3i'
    +''
    +''
    +'';
  _Hotel.main.put('Dashboard',all);
};
/* initialize */
return this.init();
};


