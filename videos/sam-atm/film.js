// One fixed world; every cut changes only the camera.
const SAM={...HERO,skin:'#F8FAFC',hand:'#F8FAFC',cloth:'#3B82F6',hood:'#2563AB',face:'#0F172A',finger:'#0F172A'};
const cashAt=t=>({x:kf(t,[[0,1120],[1.5,1120],[2.6,1010],[3.2,1010],[4.4,968],[5.1,968],[6.25,858],[6.7,858]]),y:kf(t,[[0,665],[5.1,665],[6.25,628],[6.7,628],[8.1,732]])});
const walletAt=t=>({x:858,y:686,close:kf(t,[[0,0],[8.4,0],[9.1,1]])});
function sam(t){const cash=cashAt(t),w=walletAt(t),p={x:880,y:548,s:.8,face:1,breath:t*1.8,look:kf(t,[[0,.8],[4.8,.8],[6,.1],[8.6,.1],[9.2,.5]]),lookY:kf(t,[[0,.4],[5,.4],[6.3,.9]]),mouth:kf(t,[[0,.35],[8.4,.35],[9.2,.75]]),blink:blinkAt(t,[1.1,4.6,9.4]),hands:{},tuck:{l:true,r:t>5}};
 const idle=[965,710],tap=[1054,588],grip=[cash.x+48,cash.y-25];
 const r=t<1.4?[kf(t,[[0,idle[0]],[.65,tap[0]],[.9,tap[0]],[1.4,idle[0]]]),kf(t,[[0,idle[1]],[.65,tap[1]],[.9,tap[1]],[1.4,idle[1]]])]:t<3.2?[kf(t,[[1.4,idle[0]],[2.9,grip[0]],[3.2,grip[0]]]),kf(t,[[1.4,idle[1]],[2.9,grip[1]],[3.2,grip[1]]])]:t<8.2?grip:[kf(t,[[8.2,grip[0]],[8.8,925],[9.3,940]]),kf(t,[[8.2,grip[1]],[8.8,696],[9.3,702]])];
 p.hands.r=w2l(p,r);p.hands.l=w2l(p,[w.x-62,w.y+34]);return p;}
function box(x,a,b,w,h,c,r=9){x.fillStyle=c;x.beginPath();x.roundRect(a,b,w,h,r);x.fill();}
function atm(x,t){box(x,1045,330,380,630,'#292B42',20);box(x,1065,352,340,342,'#3C425D',14);box(x,1090,379,290,153,'#111F32');box(x,1103,392,264,127,'#7FC4BA');x.fillStyle='#173F4A';x.textAlign='center';x.font='bold 32px sans-serif';x.fillText(t<1.2?'WITHDRAW':t<2.6?'PROCESSING':'TAKE CASH',1235,447);x.font='20px sans-serif';x.fillText(t<2.6?'ATM':'THANK YOU',1235,483);
 for(let i=0;i<3;i++)for(let j=0;j<3;j++)box(x,1115+j*38,555+i*25,28,16,'#BAC0C8',3);
 box(x,1047,572,31,35,t>.6&&t<.95?'#FACC15':'#56B9A9',4);box(x,1047,648,190,42,'#101625',4);box(x,1052,651,180,5,'#66C1AD',2);box(x,1095,775,277,115,'#24273D');x.fillStyle='#B6B8CB';x.font='bold 33px sans-serif';x.fillText('ATM',1234,305);}
function cashDraw(x,t){const p=cashAt(t);x.save();if(t<3.2){x.beginPath();x.rect(-200,0,1250,1500);x.clip();}if(t>6.7){x.beginPath();x.rect(-200,0,2000,686);x.clip();}
 for(let i=2;i>=0;i--){const a=p.x-66+i*3,b=p.y-31-i*4;box(x,a,b,132,62,'#D1E8AB',3);x.strokeStyle='#668B59';x.lineWidth=2;x.strokeRect(a+7,b+7,118,48);x.fillStyle='#406447';x.font='bold 21px sans-serif';x.textAlign='left';x.fillText('$',a+15,b+39);x.fillText('$',a+103,b+39);x.strokeStyle='#6C925C';x.strokeRect(a+50,b+17,32,28);}
 x.restore();}
function walletBack(x,t){const w=walletAt(t);box(x,w.x-77,w.y-9,154,96,'#342335',8);box(x,w.x-69,w.y-2,138,78,'#725044',6);box(x,w.x-65,w.y+4,130,22,'#1C1824',3);}
function walletFront(x,t){const w=walletAt(t);box(x,w.x-77,w.y+27,154,60,'#815743',8);x.strokeStyle='#BC8D64';x.lineWidth=2;x.setLineDash([4,4]);x.strokeRect(w.x-68,w.y+35,136,42);x.setLineDash([]);if(w.close>0){box(x,w.x-77,w.y-9,154,96*w.close,'#694432',8);box(x,w.x+40,w.y+26,40,25,'#9A6D4B',4);}}
FILM={dur:10,cuts:[0,75,135,255,300],fadeIn:.15,fadeOut:0,
 cam(s,u){return [{x:1100,y:625,z:lerp(1,1.07,ease(u)),b:0},{x:1060,y:590,z:lerp(1.42,1.49,u),b:0},{x:lerp(984,858,ease(seg(u,0,.47))),y:lerp(657,688,ease(u)),z:lerp(3.5,3.75,ease(u)),b:6},{x:1038,y:600,z:lerp(1.4,1.36,u),b:0}][s]},
 draw(t,c){let x=layer('set',c);const sky=x.createLinearGradient(0,0,0,960);sky.addColorStop(0,'#332A50');sky.addColorStop(.65,'#A56673');sky.addColorStop(1,'#D69C79');x.fillStyle=sky;x.fillRect(-1500,-1000,5000,2500);box(x,1000,240,470,720,'#4C425C',12);x.fillStyle='#2F3047';x.fillRect(-1500,960,5000,1000);x.strokeStyle='#787084';x.lineWidth=3;x.beginPath();x.moveTo(-1500,960);x.lineTo(3500,960);x.stroke();for(const q of [250,600,1600,1950]){box(x,q,460,190,500,'#43394F');box(x,q+24,500,142,170,'#BF917A');}
 x=layer('action',c);atm(x,t);softShadow(x,880,962,100,12,.3);const p=actor(x,'Sam',SAM,sam(t),c,'rgba(178,206,245,.6)');walletBack(x,t);cashDraw(x,t);walletFront(x,t);const l=h2w(p,'l'),r=h2w(p,'r');gripHand(x,l[0],l[1],0,SAM,.8);gripHand(x,r[0],r[1],-.2,SAM,.8);contact('wallet-left',l,[796,720]);if(t>=3.2&&t<8.2){const cash=cashAt(t);contact('cash-right',r,[cash.x+48,cash.y-25]);}comp([['set',c.b],['action',0]]);},plants(){return {}}};
say(.7,'key');say(1.5,'motor');say(3.25,'paper');say(5.6,'paper');say(7.1,'paper');say(8.8,'close');

