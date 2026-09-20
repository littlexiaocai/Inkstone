"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => InkstonePlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");

// src/vendor/my-rime-worker.txt
var my_rime_worker_default = '(function(){"use strict";function O(n,e){self.onmessage=async i=>{await e;const{name:r,args:a,transferableIndices:c}=i.data,o=[];let s;try{const t=n[r];if(typeof t!="function"){console.error(`${r} is not an exposed worker function`),self.close();return}const p=await t(...a);a.forEach((m,M)=>c.includes(M)&&o.push(m)),s={type:"success",result:p,transferables:o}}catch(t){const{message:p,name:m}=t;s={type:"error",error:{message:p,name:m}}}self.postMessage(s,o)}}function L(n){return(...e)=>{const i={type:"control",name:n,args:e};self.postMessage(i)}}function A(n,e){e=e||{};const{url:i,init:r}=e;return new Promise(a=>{self.Module={...e?.Module,async onRuntimeInitialized(){r&&await r(),a(null)},locateFile(c,o){return(i||o)+c}},importScripts((i||"")+n)})}function T(n,...e){const i=Module.FS[n](...e);if(n!=="mkdir")return i}const l=(n,e)=>e.some(i=>n instanceof i);let I,D;function W(){return I||(I=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function V(){return D||(D=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const _=new WeakMap,f=new WeakMap,b=new WeakMap;function N(n){const e=new Promise((i,r)=>{const a=()=>{n.removeEventListener("success",c),n.removeEventListener("error",o)},c=()=>{i(d(n.result)),a()},o=()=>{r(n.error),a()};n.addEventListener("success",c),n.addEventListener("error",o)});return b.set(e,n),e}function R(n){if(_.has(n))return;const e=new Promise((i,r)=>{const a=()=>{n.removeEventListener("complete",c),n.removeEventListener("error",o),n.removeEventListener("abort",o)},c=()=>{i(),a()},o=()=>{r(n.error||new DOMException("AbortError","AbortError")),a()};n.addEventListener("complete",c),n.addEventListener("error",o),n.addEventListener("abort",o)});_.set(n,e)}let v={get(n,e,i){if(n instanceof IDBTransaction){if(e==="done")return _.get(n);if(e==="store")return i.objectStoreNames[1]?void 0:i.objectStore(i.objectStoreNames[0])}return d(n[e])},set(n,e,i){return n[e]=i,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function z(n){v=n(v)}function H(n){return V().includes(n)?function(...e){return n.apply(g(this),e),d(this.request)}:function(...e){return d(n.apply(g(this),e))}}function K(n){return typeof n=="function"?H(n):(n instanceof IDBTransaction&&R(n),l(n,W())?new Proxy(n,v):n)}function d(n){if(n instanceof IDBRequest)return N(n);if(f.has(n))return f.get(n);const e=K(n);return e!==n&&(f.set(n,e),b.set(e,n)),e}const g=n=>b.get(n);function U(n,e,{blocked:i,upgrade:r,blocking:a,terminated:c}={}){const o=indexedDB.open(n,e),s=d(o);return r&&o.addEventListener("upgradeneeded",t=>{r(d(o.result),t.oldVersion,t.newVersion,d(o.transaction),t)}),i&&o.addEventListener("blocked",t=>i(t.oldVersion,t.newVersion,t)),s.then(t=>{c&&t.addEventListener("close",()=>c()),a&&t.addEventListener("versionchange",p=>a(p.oldVersion,p.newVersion,p))}).catch(()=>{}),s}const J=["get","getKey","getAll","getAllKeys","count"],X=["put","add","delete","clear"],h=new Map;function S(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(h.get(e))return h.get(e);const i=e.replace(/FromIndex$/,""),r=e!==i,a=X.includes(i);if(!(i in(r?IDBIndex:IDBObjectStore).prototype)||!(a||J.includes(i)))return;const c=async function(o,...s){const t=this.transaction(o,a?"readwrite":"readonly");let p=t.store;return r&&(p=p.index(s.shift())),(await Promise.all([p[i](...s),a&&t.done]))[0]};return h.set(e,c),c}z(n=>({...n,get:(e,i,r)=>S(e,i)||n.get(e,i,r),has:(e,i)=>!!S(e,i)||n.has(e,i)}));const G=["continue","continuePrimaryKey","advance"],B={},$=new WeakMap,P=new WeakMap,Q={get(n,e){if(!G.includes(e))return n[e];let i=B[e];return i||(i=B[e]=function(...r){$.set(this,P.get(this)[e](...r))}),i}};async function*Y(...n){let e=this;if(e instanceof IDBCursor||(e=await e.openCursor(...n)),!e)return;e=e;const i=new Proxy(e,Q);for(P.set(i,e),b.set(i,g(e));e;)yield i,e=await($.get(i)||e.continue()),$.delete(i)}function q(n,e){return e===Symbol.asyncIterator&&l(n,[IDBIndex,IDBObjectStore,IDBCursor])||e==="iterate"&&l(n,[IDBIndex,IDBObjectStore])}z(n=>({...n,get(e,i,r){return q(e,i)?Y:n.get(e,i,r)},has(e,i){return q(e,i)||n.has(e,i)}}));const u="hash",w="content";class Z{dbPromise;constructor(e){this.dbPromise=U(e,1,{upgrade(i){i.createObjectStore(u),i.createObjectStore(w)}})}async getDB(){return this.dbPromise.catch(()=>{})}async get(e,i,r){const a=await this.getDB();if(await a?.get(u,e)===i)return a.get(w,e);const o=await fetch(r);if(!o.ok)throw new Error(`Fail to download ${e}`);const s=await o.arrayBuffer();return await a?.put(w,s,e),await a?.put(u,i,e),s}async invalidate(){return(await this.getDB())?.clear(u)}}var nn="\\u6719\\u6708\\u62FC\\u97F3",en="\\u6719\\u6708\\u62FC\\u97F3\\xB7\\u8BED\\u53E5\\u6D41",an="\\u7CA4\\u8BED\\u62FC\\u97F3",rn="\\u7CA4\\u8BED\\u62FC\\u97F3\\xB7IPA",on="\\u81EA\\u7136\\u7801\\u53CC\\u62FC",cn="\\u667A\\u80FDABC\\u53CC\\u62FC",tn="\\u5C0F\\u9E64\\u53CC\\u62FC",sn="\\u5FAE\\u8F6F\\u53CC\\u62FC",pn="\\u62FC\\u97F3\\u52A0\\u52A0\\u53CC\\u62FC",dn="86\\u4E94\\u7B14",mn="86\\u4E94\\u7B14\\xB7\\u62FC\\u97F3",bn="86\\u4E94\\u7B14\\xB7\\u7E41\\u4F53",un="\\u8896\\u73CD\\u7B80\\u62FC",yn="\\u5730\\u7403\\u62FC\\u97F3",ln="X-SAMPA",_n="\\u4E91\\u9F99\\u56FD\\u9645\\u97F3\\u6807",fn="\\u6CE8\\u97F3",vn="\\u6CE8\\u97F3\\xB7\\u5FEB\\u6253",gn="\\u5BAB\\u4FDD\\u62FC\\u97F3\\xB7\\u4E03\\u6307\\u7985",hn="\\u5BAB\\u4FDD\\u62FC\\u97F3\\xB7\\u516B\\u6307\\u7985",$n="\\u5BAB\\u4FDD\\u62FC\\u97F3\\xB7\\u4E5D\\u6307\\u7985",wn="\\u5BAB\\u4FDD\\u62FC\\u97F3\\xB7\\u5341\\u6307\\u7985",jn="\\u4E2D\\u53E4\\u5168\\u62FC",kn="\\u4E2D\\u53E4\\u4E09\\u62FC",Mn="\\u4ED3\\u9889\\u4E94\\u4EE3",xn="\\u4ED3\\u9889\\u4E94\\u4EE3\\xB7\\u5FEB\\u6253",In="\\u4E94\\u7B14\\u753B",Dn="\\u884C\\u521730",zn="\\u4E0A\\u6D77\\u5434\\u8BED\\xB7\\u8001\\u6D3E",Sn="\\u4E0A\\u6D77\\u5434\\u8BED\\xB7\\u65B0\\u6D3E",Bn="\\u82CF\\u5DDE\\u5434\\u8BED",Pn="\\u6253\\u5B57\\u901F\\u8BB0\\u6CD5",qn="\\u5FEB\\u901F\\u4ED3\\u9889",En="\\u901F\\u6210",Fn={luna_pinyin:nn,luna_pinyin_fluency:en,jyut6ping3:an,jyut6ping3_ipa:rn,double_pinyin:on,double_pinyin_abc:cn,double_pinyin_flypy:tn,double_pinyin_mspy:sn,double_pinyin_pyjj:pn,wubi86:dn,wubi_pinyin:mn,wubi_trad:bn,pinyin_simp:un,terra_pinyin:yn,ipa_xsampa:ln,ipa_yunlong:_n,bopomofo:fn,bopomofo_express:vn,combo_pinyin:gn,combo_pinyin_8:hn,combo_pinyin_9:$n,combo_pinyin_10:wn,zyenpheng:jn,sampheng:kn,cangjie5:Mn,cangjie5_express:xn,stroke:In,array30:Dn,wugniu_lopha:zn,wugniu:Sn,soutzoe:Bn,stenotype:Pn,scj6:qn,quick5:En},Cn={},On={dict:"luna_pinyin"},Ln={dict:"luna_pinyin",prism:"luna_quanpin"},An={},Tn={dict:"jyut6ping3",prism:"jyut6ping3_ipa"},Wn={dict:"luna_pinyin",prism:"double_pinyin"},Vn={dict:"luna_pinyin",prism:"double_pinyin_abc"},Nn={dict:"luna_pinyin",prism:"double_pinyin_flypy"},Rn={dict:"luna_pinyin",prism:"double_pinyin_mspy"},Hn={dict:"luna_pinyin",prism:"double_pinyin_pyjj"},Kn={},Un={dict:"wubi86",prism:"wubi_pinyin"},Jn={dict:"wubi86",prism:"wubi_trad"},Xn={},Gn={},Qn={},Yn={},Zn={dict:"terra_pinyin",prism:"bopomofo"},ne={dict:"terra_pinyin",prism:"bopomofo_express"},ee={dict:"luna_pinyin",prism:"combo_pinyin"},ie={dict:"luna_pinyin",prism:"combo_pinyin"},ae={dict:"luna_pinyin",prism:"combo_pinyin"},re={dict:"luna_pinyin",prism:"combo_pinyin"},oe={},ce={dict:"zyenpheng",prism:"sampheng"},te={},se={dict:"cangjie5",prism:"cangjie5_express"},pe={},de={},me={},be={dict:"wugniu_lopha",prism:"wugniu"},ue={},ye={dict:"luna_pinyin",prism:"stenotype"},le={},_e={},fe={luna_pinyin:Cn,luna_pinyin_fluency:On,luna_quanpin:Ln,jyut6ping3:An,jyut6ping3_ipa:Tn,double_pinyin:Wn,double_pinyin_abc:Vn,double_pinyin_flypy:Nn,double_pinyin_mspy:Rn,double_pinyin_pyjj:Hn,wubi86:Kn,wubi_pinyin:Un,wubi_trad:Jn,pinyin_simp:Xn,terra_pinyin:Gn,ipa_xsampa:Qn,ipa_yunlong:Yn,bopomofo:Zn,bopomofo_express:ne,combo_pinyin:ee,combo_pinyin_8:ie,combo_pinyin_9:ae,combo_pinyin_10:re,zyenpheng:oe,sampheng:ce,cangjie5:te,cangjie5_express:se,stroke:pe,array30:de,wugniu_lopha:me,wugniu:be,soutzoe:ue,stenotype:ye,scj6:le,quick5:_e},ve="luna-pinyin",ge="luna-pinyin",he="luna-pinyin",$e="cantonese",we="cantonese",je="double-pinyin",ke="double-pinyin",Me="double-pinyin",xe="double-pinyin",Ie="double-pinyin",De="wubi",ze="wubi",Se="wubi",Be="pinyin-simp",Pe="terra-pinyin",qe="ipa",Ee="ipa",Fe="bopomofo",Ce="bopomofo",Oe="combo-pinyin",Le="combo-pinyin",Ae="combo-pinyin",Te="combo-pinyin",We="middle-chinese",Ve="middle-chinese",Ne="cangjie",Re="cangjie",He="stroke",Ke="array",Ue="wugniu",Je="wugniu",Xe="soutzoe",Ge="stenotype",Qe="scj",Ye="quick",Ze={luna_pinyin:ve,luna_pinyin_fluency:ge,luna_quanpin:he,jyut6ping3:$e,jyut6ping3_ipa:we,double_pinyin:je,double_pinyin_abc:ke,double_pinyin_flypy:Me,double_pinyin_mspy:xe,double_pinyin_pyjj:Ie,wubi86:De,wubi_pinyin:ze,wubi_trad:Se,pinyin_simp:Be,terra_pinyin:Pe,ipa_xsampa:qe,ipa_yunlong:Ee,bopomofo:Fe,bopomofo_express:Ce,combo_pinyin:Oe,combo_pinyin_8:Le,combo_pinyin_9:Ae,combo_pinyin_10:Te,zyenpheng:We,sampheng:Ve,cangjie5:Ne,cangjie5_express:Re,stroke:He,array30:Ke,wugniu_lopha:Ue,wugniu:Je,soutzoe:Xe,stenotype:Ge,scj6:Qe,quick5:Ye},ni=["stroke"],ei=["stroke"],ii=["luna_pinyin","stroke","cangjie5"],ai=["luna_pinyin","stroke","cangjie5"],ri=["luna_pinyin"],oi=["luna_pinyin"],ci=["luna_pinyin"],ti=["luna_pinyin"],si=["luna_pinyin"],pi=["pinyin_simp"],di=["pinyin_simp"],mi=["pinyin_simp"],bi=["stroke"],ui=["stroke"],yi=["terra_pinyin","stroke"],li=["terra_pinyin","stroke"],_i=["luna_pinyin"],fi=["luna_pinyin"],vi=["luna_pinyin"],gi=["luna_pinyin"],hi=["luna_pinyin"],$i=["luna_pinyin"],wi=["luna_quanpin"],ji=["luna_quanpin"],ki=["luna_pinyin"],Mi=["luna_quanpin"],xi=["luna_pinyin"],Ii=["luna_pinyin"],Di=["luna_pinyin"],zi=["luna_pinyin"],Si=["luna_quanpin"],Bi=["luna_quanpin"],Pi={luna_pinyin:ni,luna_pinyin_fluency:ei,jyut6ping3:ii,jyut6ping3_ipa:ai,double_pinyin:ri,double_pinyin_abc:oi,double_pinyin_flypy:ci,double_pinyin_mspy:ti,double_pinyin_pyjj:si,wubi86:pi,wubi_pinyin:di,wubi_trad:mi,pinyin_simp:bi,terra_pinyin:ui,bopomofo:yi,bopomofo_express:li,combo_pinyin:_i,combo_pinyin_8:fi,combo_pinyin_9:vi,combo_pinyin_10:gi,zyenpheng:hi,sampheng:$i,cangjie5:wi,cangjie5_express:ji,stroke:ki,array30:Mi,wugniu_lopha:xi,wugniu:Ii,soutzoe:Di,stenotype:zi,scj6:Si,quick5:Bi},qi=[{name:"jyut6ping3.prism.bin",md5:"e8fe84f1b8c1820fd2c08f7600418bfe"},{name:"jyut6ping3.reverse.bin",md5:"92ed6bb8574780366c1a903f4fb010e8"},{name:"jyut6ping3.schema.yaml",md5:"d0fc61e25feffc2526bb4e98e16bbde6"},{name:"jyut6ping3.table.bin",md5:"546103af8e8794d9ac344820993aeba8"},{name:"jyut6ping3_ipa.prism.bin",md5:"490482d2d6d1feed536d78dd9b02e853"},{name:"jyut6ping3_ipa.schema.yaml",md5:"bc1fc01dbaeb836c2e5aa5017ecd8b94"}],Ei=[{name:"wubi86.prism.bin",md5:"e40fe2db3e26f1f9efb1ea0bde2a343d"},{name:"wubi86.reverse.bin",md5:"fd84814998dbcc3feecc117ee8835ee3"},{name:"wubi86.schema.yaml",md5:"4c66187568b199a1a50026a13e1dde4b"},{name:"wubi86.table.bin",md5:"5f9a629c8ed1b254ebe2897474e9d39b"},{name:"wubi_pinyin.prism.bin",md5:"67b7747db86930810dce46bf26f0d5e0"},{name:"wubi_pinyin.schema.yaml",md5:"4c04a659b6eb7371b3c2ec2607a19671"},{name:"wubi_trad.prism.bin",md5:"330f3f5e67cdc152368431d5707a8d60"},{name:"wubi_trad.schema.yaml",md5:"47aff1514de471d8937c1730944dca85"}],Fi=[{name:"ipa_xsampa.prism.bin",md5:"1f89f323b398e55b41a3d51292e153b4"},{name:"ipa_xsampa.reverse.bin",md5:"204c1a057beff33f33e4e6e2334d9388"},{name:"ipa_xsampa.schema.yaml",md5:"3de5dc8e1373f3445eb3eb6372757725"},{name:"ipa_xsampa.table.bin",md5:"2643f70120a14876bf358e77fae47def"},{name:"ipa_yunlong.prism.bin",md5:"e99012d354473ed9251fde4d664cf360"},{name:"ipa_yunlong.reverse.bin",md5:"bb4ede9eca7365defaa9631dacf2d0c6"},{name:"ipa_yunlong.schema.yaml",md5:"bca1844fbfc48f6141d419cb154cbc00"},{name:"ipa_yunlong.table.bin",md5:"ca7388b30a151620453ef1684408c34f"}],Ci=[{name:"bopomofo.prism.bin",md5:"234e19133234e3c3b096aec7d4cebc25"},{name:"bopomofo.schema.yaml",md5:"2c657fdc0c9ac5894f3e4244949f2ef4"},{name:"bopomofo_express.prism.bin",md5:"166c04c549fe673e7b073b93c84832b0"},{name:"bopomofo_express.schema.yaml",md5:"d15617e84bc8cb6d001dba90c8bf5cfb"}],Oi=[{name:"cangjie5.prism.bin",md5:"4aa8960be265a1ce70f3040f94454ea9"},{name:"cangjie5.reverse.bin",md5:"302de203207d03703306bece4b57d86e"},{name:"cangjie5.schema.yaml",md5:"fa91cc2e81a964b9a5099dcd1e234943"},{name:"cangjie5.table.bin",md5:"1c854e997f5fe1c7690cd7f40bb4df96"},{name:"cangjie5_express.prism.bin",md5:"75fdabf12b40399baf77cb3c8ee62fe8"},{name:"cangjie5_express.schema.yaml",md5:"8777c77fe530913bb23321a0534b66ec"}],Li=[{name:"stroke.prism.bin",md5:"1f26c416eb52ea8f3561138ceb11c6c1"},{name:"stroke.reverse.bin",md5:"a086c66e7d7ce40e4941fcb5d9e349b4"},{name:"stroke.schema.yaml",md5:"44e4e9b9b7560c88374b6227816567d4"},{name:"stroke.table.bin",md5:"797242fa9b16802d8cac5c0f4fafe726"}],Ai=[{name:"array30.prism.bin",md5:"145544e36e59f20cfef6dea90522b2d3"},{name:"array30.reverse.bin",md5:"7f7d287012202461fc5ceb3f9eca2116"},{name:"array30.schema.yaml",md5:"e526324ff344202f5485e87166b73200"},{name:"array30.table.bin",md5:"e6dde610a837ae475807936ae77270d0"}],Ti=[{name:"wugniu.prism.bin",md5:"dbf5abf3515c2fba8a0af549ae9e6061"},{name:"wugniu.schema.yaml",md5:"ee539505db7b3e4503a3a0f4cae62617"},{name:"wugniu_lopha.prism.bin",md5:"f3f5258eafc62e9cd05d697a29dd0e77"},{name:"wugniu_lopha.reverse.bin",md5:"3cd2200a259a83b80fcb356682174ce1"},{name:"wugniu_lopha.schema.yaml",md5:"f548d1bc05160aca287f455e1c94d338"},{name:"wugniu_lopha.table.bin",md5:"89ebfd89994a67472b2378f488338a76"}],Wi=[{name:"soutzoe.prism.bin",md5:"4af9c71a9e69294ca4dab79a4eafcefa"},{name:"soutzoe.reverse.bin",md5:"db12cdab4004bf6efa49542152fb7cfe"},{name:"soutzoe.schema.yaml",md5:"40f575d07cf52d64c1a15c5a58f255a7"},{name:"soutzoe.table.bin",md5:"6239f14f75ec3cbb0d913b6947f8e8c0"}],Vi=[{name:"stenotype.prism.bin",md5:"1df2aa4b1d705d88004246ce33f9b0bb"},{name:"stenotype.schema.yaml",md5:"0a6f54723a56922d7c73aa8fb654ee05"}],Ni=[{name:"scj6.prism.bin",md5:"bd95bef1a1cd46f289c7750337072373"},{name:"scj6.reverse.bin",md5:"efb9d5051b2ce3e4d91a4a8dc4b63027"},{name:"scj6.schema.yaml",md5:"ec5610abdd580e2699f51aa9c36aa8bc"},{name:"scj6.table.bin",md5:"4216472d63de2550ee944ac5e97c557a"}],Ri=[{name:"quick5.prism.bin",md5:"3bde0fa40d486200ce17c45574575cca"},{name:"quick5.reverse.bin",md5:"27444b0d2825ee331e992058d419be34"},{name:"quick5.schema.yaml",md5:"d1fa5bb2d31c5e4130df680aee8c4d0c"},{name:"quick5.table.bin",md5:"25954fec90c31dedb99a45812c7447a9"}],Hi={"luna-pinyin":[{name:"luna_pinyin.prism.bin",md5:"353c5e34c859a9a0e76900df030fa713"},{name:"luna_pinyin.reverse.bin",md5:"d16701cc9cc16ab74f3b60b336409bf1"},{name:"luna_pinyin.schema.yaml",md5:"e9b840d9205f8425a98bd05122ba0fb9"},{name:"luna_pinyin.table.bin",md5:"153ea95bab6e4ee20abff0f5dfec6ead"},{name:"luna_pinyin_fluency.schema.yaml",md5:"2be9abb3c612c1479a7e2712b5b5cd39"},{name:"luna_quanpin.prism.bin",md5:"de0b1974ded4038dc2bea8e4c4e912d2"},{name:"luna_quanpin.schema.yaml",md5:"217dcb807feff1c3a11e664c05f8ac62"}],cantonese:qi,"double-pinyin":[{name:"double_pinyin.prism.bin",md5:"ebe88ee6e183f57f385b26f407508b2d"},{name:"double_pinyin.schema.yaml",md5:"37d4bbe21afc6ecbffef32035853a62f"},{name:"double_pinyin_abc.prism.bin",md5:"6a9b3f79d7c8b0caaf32aa649c02b65d"},{name:"double_pinyin_abc.schema.yaml",md5:"c19a099692bfff3d2292f31cae94f1f3"},{name:"double_pinyin_flypy.prism.bin",md5:"f9f5a25e674bcd94999947baa0ea7212"},{name:"double_pinyin_flypy.schema.yaml",md5:"20da2434e8413cfee9a16862b5de94e7"},{name:"double_pinyin_mspy.prism.bin",md5:"0d0e95e701e381b790d91bea3d9c26cd"},{name:"double_pinyin_mspy.schema.yaml",md5:"da893bb1ccb222953447bc03e28a7aa3"},{name:"double_pinyin_pyjj.prism.bin",md5:"869d45bd575161358073112c6e220dd6"},{name:"double_pinyin_pyjj.schema.yaml",md5:"fa420f3c963b79af67c8c52c27cbffc2"}],wubi:Ei,"pinyin-simp":[{name:"pinyin_simp.prism.bin",md5:"3b1037493ae93c1f7ae64bea9bc16650"},{name:"pinyin_simp.reverse.bin",md5:"a7691b570c4c4a1a8ca6339f9b6338e8"},{name:"pinyin_simp.schema.yaml",md5:"7101abebdd3155a77b545ed7a19b3681"},{name:"pinyin_simp.table.bin",md5:"18cdf4674c35c6694f96ab10df5ee7be"}],"terra-pinyin":[{name:"terra_pinyin.prism.bin",md5:"ab694f25ee6ee00f010de4d9a5df7245"},{name:"terra_pinyin.reverse.bin",md5:"c2b4ebbd44eb9a57aa1f6e263001e83c"},{name:"terra_pinyin.schema.yaml",md5:"e1d2aabdde916f7bb782d4e924b529c7"},{name:"terra_pinyin.table.bin",md5:"aac5fdf8846b9eac8dc031fd6f8f1bdf"}],ipa:Fi,bopomofo:Ci,"combo-pinyin":[{name:"combo_pinyin.prism.bin",md5:"c6d468e4b7f88a824e32602624205ec1"},{name:"combo_pinyin.schema.yaml",md5:"1b0f5fc4b8270db662ce882b4ed96a2d"},{name:"combo_pinyin_10.schema.yaml",md5:"94fed0d8c33755f12ba9ec97cc41da35"},{name:"combo_pinyin_8.schema.yaml",md5:"ebd27fb7db368986561c54ad429dd56d"},{name:"combo_pinyin_9.schema.yaml",md5:"e5fc98fcf97bd2d2461d0e5969a8c535"}],"middle-chinese":[{name:"sampheng.prism.bin",md5:"edccb12d4111233c6c02cccd989c195b"},{name:"sampheng.schema.yaml",md5:"47d5a80503aac65038f641958672829b"},{name:"zyenpheng.prism.bin",md5:"7ad3323279ae37dbdaf2dd4b804b8618"},{name:"zyenpheng.reverse.bin",md5:"0d3b84ce7e7b2714cb4a0eea35536d38"},{name:"zyenpheng.schema.yaml",md5:"e7c18923cb4e305362f0b7ae48b2c329"},{name:"zyenpheng.table.bin",md5:"dc2e6122b5e0753e6c12887d21c38195"}],cangjie:Oi,stroke:Li,array:Ai,wugniu:Ti,soutzoe:Wi,stenotype:Vi,scj:Ni,quick:Ri},Ki="0.1.5",Ui="0.1.2",Ji="0.1.1",Xi="0.1.1",Gi="0.1.3",Qi="0.1.3",Yi="0.1.2",Zi="0.1.1",na="0.1.1",ea="0.1.1",ia="0.1.1",aa="0.1.1",ra={"luna-pinyin":"0.1.1",cantonese:Ki,"double-pinyin":"0.1.1",wubi:Ui,"pinyin-simp":"0.1.1","terra-pinyin":"0.1.1",ipa:Ji,bopomofo:Xi,"combo-pinyin":"0.1.1","middle-chinese":"0.1.1",cangjie:Gi,stroke:Qi,array:Yi,wugniu:Zi,soutzoe:na,stenotype:ea,scj:ia,quick:aa};const j="/rime",oa="/usr/share/rime-data";function ca(n,e){return`https://cdn.jsdelivr.net/npm/@rime-contrib/${n}@${ra[n]}/${e}`}const ta=new Z("ime");async function sa(n){const e=[];function i(a){if(e.includes(a))return[];e.push(a);const c=[];for(const x of Pi[a]||[])c.push(...i(x));const{dict:o,prism:s}=fe[a],t=o||a,p=`${t}.table.bin`,m=`${t}.reverse.bin`,M=`${s||t}.prism.bin`,ua=`${a}.schema.yaml`,F=Ze[a];for(const x of[p,m,M,ua])for(const{name:C,md5:ya}of Hi[F])if(x===C){c.push({name:C,md5:ya,target:F});break}return c}const r=i(n);await Promise.all(r.map(async({name:a,target:c,md5:o})=>{const s=`${oa}/build/${a}`;try{Module.FS.lookupPath(s)}catch{const t=await ta.get(a,o,ca(c,a));Module.FS.writeFile(s,new Uint8Array(t))}}))}async function pa(n){return k||await sa(n),Module.ccall("set_ime","null",["string"],[n]),y("write")}function y(n){let e,i;const r=new Promise((a,c)=>{e=a,i=c});return Module.FS.syncfs(n==="read",a=>{a&&i(a),e(null)}),r}const da=A("rime.js",{url:"https://cdn.jsdelivr.net/npm/@libreservice/my-rime@0.10.9/dist/",async init(){Module.FS.mkdir(j),Module.FS.mount(IDBFS,{},j),await y("read"),Module.ccall("init","null",[],[]);for(const[n,e]of Object.entries(Fn))Module.ccall("set_schema_name","null",["string","string"],[n,e])},Module:{printErr(n){const e=n.match(/[EWID]\\S+ \\S+ \\S+ (.*)/);e?{E:console.error,W:console.warn,I:console.info,D:console.debug}[n[0]](e[1]):console.error(n)}}});let k=!1;const ma=L("deployStatus");globalThis._deployStatus=(n,e)=>{n==="success"&&(k=!0),ma(n,e)};function E(n){for(const e of Module.FS.readdir(n)){if(e==="."||e==="..")continue;const i=`${n}/${e}`,{mode:r}=Module.FS.lstat(i);Module.FS.isDir(r)?(E(i),Module.FS.rmdir(i)):Module.FS.unlink(i)}}async function ba(){E(j),await y("write"),k=!1,Module.ccall("reset","null",[],[])}O({fsOperate:T,resetUserDirectory:ba,setIME:pa,setOption(n,e){return Module.ccall("set_option","null",["string","number"],[n,e])},setPageSize(n){return Module.ccall("set_page_size","null",["number"],[n])},deploy(){return Module.ccall("deploy","null",[],[])},async process(n){const e=JSON.parse(Module.ccall("process","string",["string"],[n]));return"committed"in e&&await y("write"),e},selectCandidateOnCurrentPage(n){return Module.ccall("select_candidate_on_current_page","string",["number"],[n])},changePage(n){return Module.ccall("change_page","string",["boolean"],[n])}},da)})();\n';

// src/emoji.ts
var EMOJI = [
  // —— 笑与开心 ——
  { e: "\u{1F600}", k: ["grin", "smile", "xiao", "kaixin", "haha"] },
  { e: "\u{1F604}", k: ["smile", "happy", "xiao", "kaixin", "gaoxing"] },
  { e: "\u{1F601}", k: ["beam", "grin", "xiao", "leya", "kaixin"] },
  { e: "\u{1F606}", k: ["laugh", "xiao", "daxiao", "haha"] },
  { e: "\u{1F605}", k: ["sweat", "laugh", "hanxiao", "wunai", "ganga"] },
  { e: "\u{1F923}", k: ["rofl", "lol", "xiao", "penxiao", "xiaocry"] },
  { e: "\u{1F602}", k: ["joy", "tears", "xiaoku", "xiao", "ku"] },
  { e: "\u{1F642}", k: ["slight", "smile", "weixiao", "xiao"] },
  { e: "\u{1F643}", k: ["upside", "flip", "wunai", "daozhe"] },
  { e: "\u{1F609}", k: ["wink", "zhayan", "meiyan"] },
  { e: "\u{1F60A}", k: ["blush", "smile", "weixiao", "haixiu", "kaixin"] },
  { e: "\u{1F607}", k: ["angel", "halo", "tianshi", "wugu"] },
  { e: "\u{1F972}", k: ["tear", "smile", "hanlei", "qiangxiao"] },
  { e: "\u{1F979}", k: ["holding", "tears", "gandong", "renzhu"] },
  // —— 爱与喜欢 ——
  { e: "\u{1F970}", k: ["love", "hearts", "xihuan", "ai", "taoxin"] },
  { e: "\u{1F60D}", k: ["heart", "eyes", "ai", "xihuan", "aixin"] },
  { e: "\u{1F929}", k: ["star", "struck", "xingxingyan", "chongbai", "wow"] },
  { e: "\u{1F618}", k: ["kiss", "blow", "feiwen", "qin", "wen"] },
  { e: "\u{1F617}", k: ["kiss", "qin", "wen"] },
  { e: "\u{1F61A}", k: ["kiss", "qin", "wen", "haixiu"] },
  // —— 俏皮 ——
  { e: "\u{1F60B}", k: ["yum", "tasty", "haochi", "chan", "tian"] },
  { e: "\u{1F61B}", k: ["tongue", "tushe", "guilian"] },
  { e: "\u{1F61C}", k: ["wink", "tongue", "tushe", "tiaopi", "guilian"] },
  { e: "\u{1F92A}", k: ["zany", "crazy", "fengle", "guilian", "shagua"] },
  { e: "\u{1F61D}", k: ["tongue", "squint", "tushe", "tiaopi"] },
  { e: "\u{1F911}", k: ["money", "qian", "caimi", "faca"] },
  { e: "\u{1F917}", k: ["hug", "yongbao", "baobao"] },
  // —— 沉默与思考 ——
  { e: "\u{1F92D}", k: ["oops", "giggle", "wuzui", "touxiao"] },
  { e: "\u{1F92B}", k: ["shush", "quiet", "anjing", "xu", "bieshuo"] },
  { e: "\u{1F914}", k: ["think", "hmm", "sikao", "xiang", "yiwen"] },
  { e: "\u{1F928}", k: ["raised", "brow", "huaiyi", "tiaomei"] },
  { e: "\u{1F610}", k: ["neutral", "mianwubiaoqing", "wuyu"] },
  { e: "\u{1F611}", k: ["expressionless", "wuyu", "mianwubiaoqing"] },
  { e: "\u{1F636}", k: ["silent", "nomouth", "wuyan", "bushuohua"] },
  { e: "\u{1F60F}", k: ["smirk", "dexiao", "jianxiao", "huaixiao"] },
  { e: "\u{1F612}", k: ["unamused", "wuyu", "buman", "baiyan"] },
  { e: "\u{1F644}", k: ["roll", "eyes", "baiyan", "wunai"] },
  { e: "\u{1F62C}", k: ["grimace", "ganga", "yingxiao"] },
  { e: "\u{1F925}", k: ["lie", "pinocchio", "shuohuang", "chesuang"] },
  // —— 累与困 ——
  { e: "\u{1F60C}", k: ["relieved", "shifu", "anxin", "manzu"] },
  { e: "\u{1F614}", k: ["pensive", "shiluo", "nanguo", "youshang"] },
  { e: "\u{1F62A}", k: ["sleepy", "kun", "xiang shui"] },
  { e: "\u{1F634}", k: ["sleep", "zzz", "shuijiao", "kun"] },
  { e: "\u{1F971}", k: ["yawn", "dahaqian", "kun", "wuliao"] },
  // —— 不适与震惊 ——
  { e: "\u{1F637}", k: ["mask", "kouzhao", "shengbing", "gaomao"] },
  { e: "\u{1F912}", k: ["fever", "fashao", "shengbing", "bing"] },
  { e: "\u{1F915}", k: ["bandage", "shoushang", "baozha"] },
  { e: "\u{1F922}", k: ["nausea", "exin", "xiang tu"] },
  { e: "\u{1F92E}", k: ["vomit", "outu", "tu", "exin"] },
  { e: "\u{1F927}", k: ["sneeze", "penti", "ganmao"] },
  { e: "\u{1F975}", k: ["hot", "re", "zhongshu"] },
  { e: "\u{1F976}", k: ["cold", "leng", "dongjiang"] },
  { e: "\u{1F974}", k: ["woozy", "yun", "he zui", "hutu"] },
  { e: "\u{1F635}", k: ["dizzy", "yun", "kunhuo"] },
  { e: "\u{1F92F}", k: ["mind", "blown", "zhenjing", "baozha", "wow"] },
  // —— 酷与伪装 ——
  { e: "\u{1F973}", k: ["party", "celebrate", "qingzhu", "kuaile", "shengri"] },
  { e: "\u{1F60E}", k: ["cool", "sunglasses", "ku", "moji"] },
  { e: "\u{1F913}", k: ["nerd", "shudai", "xueba", "yanjing"] },
  { e: "\u{1F9D0}", k: ["monocle", "shencha", "yanjiu", "kan"] },
  { e: "\u{1F920}", k: ["cowboy", "niuzai", "maoxian"] },
  // —— 难过 ——
  { e: "\u{1F615}", k: ["confused", "kunhuo", "nanguo"] },
  { e: "\u{1F641}", k: ["frown", "buxingfu", "nanguo"] },
  { e: "\u{1F62E}", k: ["open", "mouth", "zhangzui", "jingya", "wow"] },
  { e: "\u{1F62F}", k: ["hushed", "jingya", "e"] },
  { e: "\u{1F632}", k: ["astonished", "zhenjing", "jingya", "wow"] },
  { e: "\u{1F633}", k: ["flushed", "haixiu", "lianhong", "ganga"] },
  { e: "\u{1F97A}", k: ["pleading", "kelian", "qiuqiu", "wuqu"] },
  { e: "\u{1F628}", k: ["fearful", "haipa", "kongju"] },
  { e: "\u{1F630}", k: ["anxious", "jiaolv", "jinzhang", "haipa"] },
  { e: "\u{1F625}", k: ["sad", "relieved", "nanguo", "shiluo"] },
  { e: "\u{1F622}", k: ["cry", "ku", "liulei", "nanguo", "shangxin"] },
  { e: "\u{1F62D}", k: ["sob", "loud", "cry", "daku", "ku", "shangxin"] },
  { e: "\u{1F631}", k: ["scream", "jianjiao", "kongju", "haipa"] },
  { e: "\u{1F61E}", k: ["disappointed", "shiwang", "nanguo"] },
  { e: "\u{1F613}", k: ["downcast", "sweat", "hanyan", "leile"] },
  { e: "\u{1F629}", k: ["weary", "leile", "beng kui"] },
  { e: "\u{1F62B}", k: ["tired", "leile", "shoubuliao"] },
  // —— 生气 ——
  { e: "\u{1F624}", k: ["triumph", "buman", "shengqi", "aoman"] },
  { e: "\u{1F620}", k: ["angry", "shengqi", "nu"] },
  { e: "\u{1F621}", k: ["rage", "shengqi", "baonu", "nu"] },
  { e: "\u{1F92C}", k: ["cursing", "maren", "baocu", "shengqi"] },
  // —— 其他脸 ——
  { e: "\u{1F480}", k: ["skull", "kulou", "si", "wanle"] },
  { e: "\u{1F4A9}", k: ["poop", "bianbian", "shi", "lajji"] },
  { e: "\u{1F921}", k: ["clown", "xiaochou", "shazi"] },
  { e: "\u{1F47B}", k: ["ghost", "gui", "wanjie", "haipa"] },
  { e: "\u{1F47D}", k: ["alien", "waixingren", "ufo"] },
  { e: "\u{1F916}", k: ["robot", "jiqiren", "ai", "bot"] },
  { e: "\u{1F608}", k: ["devil", "huai", "emo", "huaixiao"] },
  { e: "\u{1F383}", k: ["pumpkin", "halloween", "nangua", "wanshengjie"] },
  // —— 手势 ——
  { e: "\u{1F44D}", k: ["thumbsup", "good", "zan", "dianzan", "bang", "hao"] },
  { e: "\u{1F44E}", k: ["thumbsdown", "cha", "bu hao", "diffren"] },
  { e: "\u{1F44C}", k: ["ok", "keyi", "meiwenti", "hao"] },
  { e: "\u270C\uFE0F", k: ["victory", "peace", "ye", "shengli"] },
  { e: "\u{1F91E}", k: ["crossed", "fingers", "qiqiu", "haoyun", "zhufu"] },
  { e: "\u{1F91D}", k: ["handshake", "woshou", "hezuo", "chengjiao"] },
  { e: "\u{1F64F}", k: ["pray", "thanks", "baituo", "qiqiu", "ganxie", "xiexie"] },
  { e: "\u{1F44F}", k: ["clap", "gu zhang", "pengchang", "bang"] },
  { e: "\u{1F64C}", k: ["raise", "hands", "wansui", "qingzhu", "taibang"] },
  { e: "\u{1F44B}", k: ["wave", "hi", "bye", "zhaoshou", "nihao", "zaijian"] },
  { e: "\u{1F919}", k: ["callme", "liulian", "dadianhua"] },
  { e: "\u{1F4AA}", k: ["muscle", "strong", "jiayou", "liliang", "qiang"] },
  { e: "\u{1FAE1}", k: ["salute", "jingli", "shoudao", "zunming"] },
  { e: "\u{1FAF6}", k: ["heart", "hands", "bixin", "ai", "xihuan"] },
  { e: "\u{1F449}", k: ["right", "point", "zhi", "youbian"] },
  { e: "\u{1F448}", k: ["left", "point", "zhi", "zuobian"] },
  { e: "\u261D\uFE0F", k: ["up", "point", "zhi", "diyi"] },
  { e: "\u{1F447}", k: ["down", "point", "zhi", "xiamian"] },
  { e: "\u270A", k: ["fist", "quantou", "jiayou"] },
  { e: "\u{1F44A}", k: ["punch", "quantou", "peng"] },
  { e: "\u{1F91B}", k: ["fist", "left", "quantou"] },
  { e: "\u{1F590}", k: ["hand", "shou", "wu"] },
  { e: "\u{1F91A}", k: ["raised", "hand", "shou", "ting"] },
  // —— 人 ——
  { e: "\u{1F64B}", k: ["raise", "hand", "juhhou", "wo", "tiwen"] },
  { e: "\u{1F646}", k: ["ok", "gesture", "keyi", "tongguo"] },
  { e: "\u{1F645}", k: ["no", "buxing", "jujue", "cha"] },
  { e: "\u{1F937}", k: ["shrug", "wunai", "bu zhidao", "suibian"] },
  { e: "\u{1F926}", k: ["facepalm", "wunai", "fuemian", "wuyu"] },
  { e: "\u{1F647}", k: ["bow", "jugong", "daoqian", "baituo"] },
  { e: "\u{1F481}", k: ["info", "jieshao", "fuwu"] },
  { e: "\u{1F9D1}\u200D\u{1F4BB}", k: ["coder", "dev", "chengxuyuan", "xie daima", "gongzuo"] },
  { e: "\u{1F476}", k: ["baby", "baobao", "yinger"] },
  { e: "\u{1F9D3}", k: ["old", "laoren", "changbei"] },
  // —— 心与情绪符号 ——
  { e: "\u2764\uFE0F", k: ["heart", "red", "ai", "aixin", "xihuan", "xin"] },
  { e: "\u{1F9E1}", k: ["orange", "heart", "chengxin", "aixin", "xin"] },
  { e: "\u{1F49B}", k: ["yellow", "heart", "huangxin", "aixin", "xin"] },
  { e: "\u{1F49A}", k: ["green", "heart", "lvxin", "aixin", "xin"] },
  { e: "\u{1F499}", k: ["blue", "heart", "lanxin", "aixin", "xin"] },
  { e: "\u{1F49C}", k: ["purple", "heart", "zixin", "aixin", "xin"] },
  { e: "\u{1F5A4}", k: ["black", "heart", "heixin", "xin"] },
  { e: "\u{1F90D}", k: ["white", "heart", "baixin", "xin"] },
  { e: "\u{1F494}", k: ["broken", "heart", "shixin", "xinsui", "shanxin"] },
  { e: "\u{1F495}", k: ["two", "hearts", "ai", "xin", "lianai"] },
  { e: "\u{1F496}", k: ["sparkling", "heart", "shanshan", "ai", "xin"] },
  { e: "\u{1F4AF}", k: ["hundred", "perfect", "manfen", "yibai", "zan"] },
  { e: "\u{1F4A2}", k: ["anger", "shengqi", "nu"] },
  { e: "\u{1F4A5}", k: ["boom", "baozha", "peng"] },
  { e: "\u2728", k: ["sparkles", "shanguang", "xingxing", "piaoliang", "xin"] },
  { e: "\u{1F4AB}", k: ["dizzy", "xuanyun", "xingxing"] },
  { e: "\u{1F4A6}", k: ["sweat", "han", "shui"] },
  { e: "\u{1F4A4}", k: ["zzz", "shuijiao", "kun"] },
  { e: "\u{1F4AC}", k: ["speech", "duihua", "liaotian", "shuohua"] },
  { e: "\u{1F4AD}", k: ["thought", "xiang", "sikao", "paopao"] },
  // —— 动物 ——
  { e: "\u{1F436}", k: ["dog", "gou", "goudog", "xiaogou"] },
  { e: "\u{1F431}", k: ["cat", "mao", "xiaomao", "miao"] },
  { e: "\u{1F42D}", k: ["mouse", "laoshu", "shu"] },
  { e: "\u{1F430}", k: ["rabbit", "tuzi", "tu"] },
  { e: "\u{1F98A}", k: ["fox", "huli"] },
  { e: "\u{1F43B}", k: ["bear", "xiong"] },
  { e: "\u{1F43C}", k: ["panda", "xiongmao"] },
  { e: "\u{1F428}", k: ["koala", "kaola"] },
  { e: "\u{1F42F}", k: ["tiger", "laohu", "hu"] },
  { e: "\u{1F981}", k: ["lion", "shizi"] },
  { e: "\u{1F437}", k: ["pig", "zhu", "xiaozhu"] },
  { e: "\u{1F438}", k: ["frog", "qingwa", "wa"] },
  { e: "\u{1F435}", k: ["monkey", "houzi", "hou"] },
  { e: "\u{1F414}", k: ["chicken", "ji"] },
  { e: "\u{1F427}", k: ["penguin", "qie"] },
  { e: "\u{1F426}", k: ["bird", "niao"] },
  { e: "\u{1F985}", k: ["eagle", "ying"] },
  { e: "\u{1F41D}", k: ["bee", "mifeng", "feng"] },
  { e: "\u{1F98B}", k: ["butterfly", "hudie"] },
  { e: "\u{1F40C}", k: ["snail", "woniu", "man"] },
  { e: "\u{1F422}", k: ["turtle", "wugui", "gui", "man"] },
  { e: "\u{1F40D}", k: ["snake", "she", "python"] },
  { e: "\u{1F419}", k: ["octopus", "zhangyu"] },
  { e: "\u{1F433}", k: ["whale", "jingyu", "jing"] },
  { e: "\u{1F42C}", k: ["dolphin", "haitun"] },
  { e: "\u{1F41F}", k: ["fish", "yu"] },
  { e: "\u{1F984}", k: ["unicorn", "dujiaoshou"] },
  { e: "\u{1F434}", k: ["horse", "ma"] },
  { e: "\u{1F42E}", k: ["cow", "niu"] },
  { e: "\u{1F411}", k: ["sheep", "yang"] },
  { e: "\u{1F418}", k: ["elephant", "daxiang", "xiang"] },
  // —— 自然与天气 ——
  { e: "\u{1F338}", k: ["blossom", "yinghua", "hua", "chuntian"] },
  { e: "\u{1F339}", k: ["rose", "meigui", "hua"] },
  { e: "\u{1F33B}", k: ["sunflower", "xiangrikui", "hua"] },
  { e: "\u{1F337}", k: ["tulip", "yujinxiang", "hua"] },
  { e: "\u{1F331}", k: ["seedling", "faya", "miao", "chengzhang"] },
  { e: "\u{1F332}", k: ["tree", "shu", "song"] },
  { e: "\u{1F340}", k: ["clover", "siyecao", "haoyun"] },
  { e: "\u{1F341}", k: ["maple", "fengye", "qiutian"] },
  { e: "\u{1F30A}", k: ["wave", "lang", "hai", "shui"] },
  { e: "\u{1F525}", k: ["fire", "hot", "huo", "re", "huobao", "rimen", "bang"] },
  { e: "\u2B50", k: ["star", "xing", "xingxing", "shoucang"] },
  { e: "\u{1F31F}", k: ["glow", "star", "xingxing", "shanguang"] },
  { e: "\u{1F308}", k: ["rainbow", "caihong"] },
  { e: "\u2600\uFE0F", k: ["sun", "taiyang", "qingtian"] },
  { e: "\u{1F319}", k: ["moon", "yueliang", "wanan", "ye"] },
  { e: "\u2601\uFE0F", k: ["cloud", "yun", "yintian"] },
  { e: "\u{1F327}", k: ["rain", "yu", "xiayu"] },
  { e: "\u2744\uFE0F", k: ["snow", "xue", "xuehua", "leng", "dongtian"] },
  { e: "\u26A1", k: ["lightning", "shandian", "dian", "kuai"] },
  // —— 食物与饮品 ——
  { e: "\u{1F34E}", k: ["apple", "pingguo"] },
  { e: "\u{1F34C}", k: ["banana", "xiangjiao"] },
  { e: "\u{1F353}", k: ["strawberry", "caomei"] },
  { e: "\u{1F349}", k: ["watermelon", "xigua", "chigua"] },
  { e: "\u{1F347}", k: ["grapes", "putao"] },
  { e: "\u{1F34A}", k: ["orange", "juzi", "cheng"] },
  { e: "\u{1F951}", k: ["avocado", "niuyouguo"] },
  { e: "\u{1F35E}", k: ["bread", "mianbao"] },
  { e: "\u{1F354}", k: ["burger", "hanbao"] },
  { e: "\u{1F35F}", k: ["fries", "shutiao"] },
  { e: "\u{1F355}", k: ["pizza", "bisa"] },
  { e: "\u{1F32E}", k: ["taco", "juanbing"] },
  { e: "\u{1F35C}", k: ["noodles", "mian", "lamian", "chi"] },
  { e: "\u{1F35A}", k: ["rice", "mifan", "fan", "chi"] },
  { e: "\u{1F363}", k: ["sushi", "shousi"] },
  { e: "\u{1F95F}", k: ["dumpling", "jiaozi"] },
  { e: "\u{1F370}", k: ["cake", "dangao", "tiandian"] },
  { e: "\u{1F382}", k: ["birthday", "cake", "shengri", "dangao"] },
  { e: "\u{1F36B}", k: ["chocolate", "qiaokeli"] },
  { e: "\u{1F366}", k: ["icecream", "bingqilin"] },
  { e: "\u2615", k: ["coffee", "kafei", "tixing"] },
  { e: "\u{1F375}", k: ["tea", "cha", "lvcha"] },
  { e: "\u{1F37A}", k: ["beer", "pijiu", "he"] },
  { e: "\u{1F377}", k: ["wine", "hongjiu", "jiu"] },
  { e: "\u{1F942}", k: ["cheers", "ganbei", "qingzhu"] },
  { e: "\u{1F9CB}", k: ["boba", "naicha", "zhenzhu"] },
  // —— 工作与物件 ——
  { e: "\u{1F4BB}", k: ["laptop", "diannao", "gongzuo", "bijiben"] },
  { e: "\u{1F4F1}", k: ["phone", "shouji"] },
  { e: "\u2328\uFE0F", k: ["keyboard", "jianpan", "daza"] },
  { e: "\u{1F5A5}", k: ["monitor", "xianshiqi", "diannao"] },
  { e: "\u{1F4F7}", k: ["camera", "xiangji", "paizhao"] },
  { e: "\u{1F3A7}", k: ["headphone", "erji", "yinyue"] },
  { e: "\u{1F3B5}", k: ["music", "yinyue", "ge"] },
  { e: "\u{1F4DA}", k: ["books", "shu", "dushu", "xuexi"] },
  { e: "\u{1F4D6}", k: ["book", "shu", "yuedu", "dushu"] },
  { e: "\u{1F4DD}", k: ["memo", "biji", "xie", "jilu"] },
  { e: "\u270F\uFE0F", k: ["pencil", "qianbi", "xie"] },
  { e: "\u{1F4CC}", k: ["pin", "tuding", "zhiding", "biaoji"] },
  { e: "\u{1F4CE}", k: ["clip", "huiwenzhen", "fujian"] },
  { e: "\u{1F517}", k: ["link", "lianjie", "url"] },
  { e: "\u{1F50D}", k: ["search", "sousuo", "cha", "fangdajing"] },
  { e: "\u{1F512}", k: ["lock", "suo", "anquan", "jiami"] },
  { e: "\u{1F511}", k: ["key", "yaoshi", "miyao"] },
  { e: "\u{1F4A1}", k: ["idea", "bulb", "dianzi", "lingqan", "xiangfa"] },
  { e: "\u{1F514}", k: ["bell", "tixing", "lingdang", "tongzhi"] },
  { e: "\u{1F4E3}", k: ["announce", "xuanbu", "laba", "tongzhi"] },
  { e: "\u{1F4C5}", k: ["calendar", "rili", "riqi", "anpai"] },
  { e: "\u23F0", k: ["alarm", "naozhong", "shijian", "tixing"] },
  { e: "\u23F3", k: ["hourglass", "shalou", "dengdai", "shijian"] },
  { e: "\u{1F4B0}", k: ["money", "qian", "jinqian", "shouru"] },
  { e: "\u{1F4B3}", k: ["card", "yinhangka", "zhifu", "xiaofei"] },
  { e: "\u{1F381}", k: ["gift", "liwu", "jingxi"] },
  { e: "\u{1F3C6}", k: ["trophy", "jiangbei", "diyi", "shengli"] },
  { e: "\u{1F3AF}", k: ["target", "mubiao", "bazi", "jingzhun"] },
  { e: "\u{1F680}", k: ["rocket", "huojian", "fashe", "shangxian", "kuai"] },
  { e: "\u{1F6E0}", k: ["tools", "gongju", "xiufu", "weihu"] },
  { e: "\u{1F9EA}", k: ["test", "shiyan", "shiguan", "ceshi"] },
  { e: "\u{1F41B}", k: ["bug", "chongzi", "quexian", "wenti"] },
  { e: "\u2699\uFE0F", k: ["gear", "chilun", "shezhi", "peizhi"] },
  { e: "\u{1F4E6}", k: ["package", "baoguo", "fabu", "xiangzi"] },
  { e: "\u{1F5D1}", k: ["trash", "lajitong", "shanchu"] },
  // —— 符号 ——
  { e: "\u2705", k: ["check", "yes", "wancheng", "duigou", "tongguo", "hao"] },
  { e: "\u274C", k: ["cross", "no", "cuowu", "cha", "shibai"] },
  { e: "\u26A0\uFE0F", k: ["warning", "jinggao", "zhuyi", "weixian"] },
  { e: "\u2753", k: ["question", "wenhao", "yiwen"] },
  { e: "\u2757", k: ["exclaim", "gantanhao", "zhuyi"] },
  { e: "\u{1F6AB}", k: ["forbidden", "jinzhi", "buxing"] },
  { e: "\u27A1\uFE0F", k: ["right", "arrow", "jiantou", "you"] },
  { e: "\u2B05\uFE0F", k: ["left", "arrow", "jiantou", "zuo"] },
  { e: "\u2B06\uFE0F", k: ["up", "arrow", "jiantou", "shang"] },
  { e: "\u2B07\uFE0F", k: ["down", "arrow", "jiantou", "xia"] },
  { e: "\u{1F504}", k: ["refresh", "shuaxin", "xunhuan", "tongbu"] },
  { e: "\u2795", k: ["plus", "jia", "xinzeng"] },
  { e: "\u2796", k: ["minus", "jian", "shanchu"] },
  { e: "\u{1F195}", k: ["new", "xin", "zuixin"] },
  { e: "\xA9\uFE0F", k: ["copyright", "banquan"] },
  { e: "\u2122\uFE0F", k: ["trademark", "shangbiao"] }
];
function searchEmoji(query, limit) {
  const q = query.trim().toLowerCase();
  if (!q) return EMOJI.slice(0, limit);
  const prefix = [];
  const contains = [];
  for (const entry of EMOJI) {
    if (entry.k.some((word) => word.startsWith(q))) prefix.push(entry);
    else if (entry.k.some((word) => word.includes(q))) contains.push(entry);
    if (prefix.length >= limit) break;
  }
  return [...prefix, ...contains].slice(0, limit);
}

// src/main.ts
var PLUGIN_VERSION = "0.7.11";
var PROBE_URL = "https://cdn.jsdelivr.net/npm/@libreservice/my-rime@0.10.9/dist/rime.js";
var INIT_TIMEOUT_MS = 45e3;
var MAX_TRACE = 60;
var REPORT_FOLDER = "\u781A\u53F0\u8BCA\u65AD";
var IME_WARN_COOLDOWN_MS = 30 * 1e3;
var CJK = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/;
var EMOJI_PAGE = 7;
function timeout(promise, ms, label) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} \u8D85\u65F6\uFF08${Math.round(ms / 1e3)} \u79D2\u65E0\u54CD\u5E94\uFF09`)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}
var RimeWorkerClient = class {
  constructor(source, log) {
    this.log = log;
    this.chain = Promise.resolve();
    const browserWorkerSource = "self.process=undefined;self.require=undefined;\n" + source;
    const blob = new Blob([browserWorkerSource], { type: "text/javascript" });
    this.workerUrl = URL.createObjectURL(blob);
    this.worker = new Worker(this.workerUrl);
    this.worker.addEventListener("message", (event) => {
      const message = event.data;
      if (message?.type === "control") {
        this.log(`worker control: ${JSON.stringify(message.args ?? message.name ?? "")}`.slice(0, 200));
        return;
      }
      const pending = this.pending;
      this.pending = void 0;
      if (!pending) return;
      if (message?.type === "success") pending.resolve(message.result);
      else pending.reject(new Error(message?.error?.message ?? "RIME Worker \u8C03\u7528\u5931\u8D25"));
    });
    this.worker.addEventListener("error", (event) => {
      const detail = [
        event.message || "(\u65E0\u9519\u8BEF\u6587\u672C)",
        event.filename ? `\u6587\u4EF6 ${event.filename}` : "",
        event.lineno ? `\u884C ${event.lineno}:${event.colno ?? 0}` : ""
      ].filter(Boolean).join(" \xB7 ");
      const error = new Error(`RIME Worker \u542F\u52A8\u5931\u8D25\uFF1A${detail}`);
      this.fatal = error;
      this.log(`worker error \u2192 ${detail}`);
      const pending = this.pending;
      this.pending = void 0;
      pending?.reject(error);
    });
    this.worker.addEventListener("messageerror", () => {
      this.log("worker messageerror\uFF1A\u6D88\u606F\u65E0\u6CD5\u53CD\u5E8F\u5217\u5316");
    });
  }
  call(name, ...args) {
    if (this.fatal) return Promise.reject(this.fatal);
    const run = () => new Promise((resolve, reject) => {
      this.pending = {
        resolve: (value) => resolve(value),
        reject
      };
      this.worker.postMessage({ name, args, transferableIndices: [] });
    });
    const result = this.chain.then(run, run);
    this.chain = result.catch(() => void 0);
    return result;
  }
  destroy() {
    this.worker.terminate();
    URL.revokeObjectURL(this.workerUrl);
  }
};
var KEY_MAP = {
  Escape: "Escape",
  Backspace: "BackSpace",
  Delete: "Delete",
  Tab: "Tab",
  Enter: "Return",
  ArrowUp: "Up",
  ArrowRight: "Right",
  ArrowDown: "Down",
  ArrowLeft: "Left",
  PageUp: "Page_Up",
  PageDown: "Page_Down",
  " ": "space",
  ",": "comma",
  ".": "period",
  "?": "question",
  "!": "exclam",
  ";": "semicolon",
  ":": "colon",
  "'": "apostrophe"
};
var START_PUNCTUATION = /* @__PURE__ */ new Set([",", ".", "?", "!", ";", ":"]);
var TOGGLE_KEY_LABEL = {
  Shift: "Shift",
  Control: "Control",
  Alt: "Option / Alt",
  Meta: "Command / Win",
  none: "\u5173\u95ED\uFF08\u53EA\u7528\u547D\u4EE4\u6216\u72B6\u6001\u680F\u5207\u6362\uFF09"
};
var DEFAULT_SETTINGS = { toggleKey: "Shift" };
var MODE_LABEL = { chinese: "\u781A\u53F0 \u4E2D", english: "\u781A\u53F0 \u82F1", emoji: "\u781A\u53F0 \u{1F600}" };
var MODE_NOTICE = {
  chinese: "\u4E2D\u6587",
  english: "\u82F1\u6587",
  emoji: "\u8868\u60C5 \u2014 \u6253\u5173\u952E\u8BCD\u641C\u7D22\uFF0C\u5982 xiao / smile / huo\u3002\u6309 Shift \u56DE\u4E2D\u6587"
};
var InkstoneSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("\u4E2D\u82F1\u6587\u5207\u6362\u952E").setDesc("\u5355\u72EC\u6309\u4E00\u4E0B\u8FD9\u4E2A\u952E\uFF08\u4E2D\u95F4\u4E0D\u5939\u522B\u7684\u952E\uFF09\u5728\u4E2D\u6587\u548C\u82F1\u6587\u4E4B\u95F4\u5207\u6362\u3002\u547D\u4EE4\u9762\u677F\u91CC\u7684\u300C\u5207\u6362\u4E2D\u82F1\u6587 (toggle)\u300D\u59CB\u7EC8\u53EF\u7528\uFF0C\u4E5F\u53EF\u4EE5\u5728 Obsidian \u7684\u5FEB\u6377\u952E\u8BBE\u7F6E\u91CC\u81EA\u884C\u7ED1\u5B9A\u3002").addDropdown((dropdown) => {
      for (const [value, label] of Object.entries(TOGGLE_KEY_LABEL)) {
        dropdown.addOption(value, label);
      }
      dropdown.setValue(this.plugin.settings.toggleKey);
      dropdown.onChange(async (value) => {
        this.plugin.settings.toggleKey = value;
        await this.plugin.saveData(this.plugin.settings);
      });
    });
  }
};
var DiagnosticsModal = class extends import_obsidian.Modal {
  constructor(app, report, sensitive = false) {
    super(app);
    this.report = report;
    this.sensitive = sensitive;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("inkstone-diag");
    contentEl.createEl("h3", { text: "\u781A\u53F0\u8F93\u5165\u6CD5 \xB7 \u8BCA\u65AD\u62A5\u544A" });
    contentEl.createEl("p", {
      cls: "inkstone-diag-hint",
      text: this.sensitive ? "\u26A0\uFE0F \u672C\u6B21\u8BB0\u5F55\u5305\u542B\u4F60\u5B9E\u9645\u6572\u4E0B\u7684\u6309\u952E\u5185\u5BB9\u3002\u5916\u53D1\u524D\u8BF7\u5148\u901A\u8BFB\u4E00\u904D\u3002" : "\u53EF\u4EE5\u628A\u8FD9\u4EFD\u62A5\u544A\u53D1\u7ED9\u534F\u52A9\u6392\u67E5\u7684\u4EBA\u3002\u6309\u952E\u5185\u5BB9\u5DF2\u8131\u654F\uFF0C\u53EA\u4FDD\u7559\u7C7B\u522B\uFF08\u5B57\u6BCD/\u6570\u5B57/\u7B26\u53F7\uFF09\u3002"
    });
    const area = contentEl.createEl("textarea", { cls: "inkstone-diag-text" });
    area.value = this.report;
    area.readOnly = true;
    area.rows = 18;
    const actions = contentEl.createDiv({ cls: "inkstone-diag-actions" });
    const copyButton = actions.createEl("button", { text: "\u590D\u5236\u62A5\u544A", cls: "mod-cta" });
    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(this.report);
        copyButton.setText("\u5DF2\u590D\u5236");
      } catch {
        area.select();
        const ok = document.execCommand("copy");
        copyButton.setText(ok ? "\u5DF2\u590D\u5236" : "\u590D\u5236\u5931\u8D25\uFF0C\u8BF7\u624B\u52A8\u9009\u4E2D");
      }
      setTimeout(() => copyButton.setText("\u590D\u5236\u62A5\u544A"), 1600);
    });
    actions.createEl("button", { text: "\u5173\u95ED" }).addEventListener("click", () => this.close());
  }
  onClose() {
    this.contentEl.empty();
  }
};
var InkstonePlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.mode = "chinese";
    this.emojiQuery = "";
    this.emojiHits = [];
    this.ready = false;
    this.composing = false;
    this.inputSequence = 0;
    this.discardThrough = 0;
    this.startedAt = Date.now();
    this.diagnostics = [];
    this.keydownSeen = 0;
    this.keydownCaptured = 0;
    this.skipCounts = {};
    this.lastKeyNote = "(\u5C1A\u672A\u6309\u952E)";
    this.eventTrace = [];
    this.eventCounts = {};
    this.pendingTrace = -1;
    this.toggleArmed = false;
    this.settings = { ...DEFAULT_SETTINGS };
    this.imeConflictStreak = 0;
    this.lastImeWarnAt = 0;
    this.imeTookOver = false;
    this.traceEnabled = false;
    this.traceRawKeys = false;
  }
  async onload() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    this.addSettingTab(new InkstoneSettingTab(this.app, this));
    this.log(`\u63D2\u4EF6 ${PLUGIN_VERSION} \u8F7D\u5165`);
    this.log(this.environmentLine());
    this.createPanel();
    this.registerCommands();
    this.createControls();
    this.registerDomEvent(document, "keydown", (event) => this.onKeydown(event), true);
    this.registerDomEvent(document, "keyup", (event) => this.onKeyup(event), true);
    this.registerInputProbes();
    this.updateStatus("\u6B63\u5728\u52A0\u8F7D\u2026");
    try {
      const t0 = Date.now();
      this.client = new RimeWorkerClient(my_rime_worker_default, (message) => this.log(message));
      this.log(`Worker \u5DF2\u521B\u5EFA\uFF08${Date.now() - t0}ms\uFF09`);
      const t1 = Date.now();
      await timeout(this.client.call("setIME", "pinyin_simp"), INIT_TIMEOUT_MS, "\u52A0\u8F7D RIME \u5F15\u64CE\u4E0E\u8BCD\u5E93");
      this.log(`setIME(pinyin_simp) \u5B8C\u6210\uFF08${Date.now() - t1}ms\uFF09`);
      await timeout(this.client.call("setPageSize", 7), 1e4, "\u8BBE\u7F6E\u5019\u9009\u9875\u5927\u5C0F");
      this.log("setPageSize(7) \u5B8C\u6210");
      this.ready = true;
      this.updateStatus();
      this.log(`\u5C31\u7EEA\uFF0C\u603B\u8017\u65F6 ${Date.now() - this.startedAt}ms`);
      new import_obsidian.Notice(this.readyHint());
    } catch (error) {
      const message = this.errorMessage(error);
      this.initError = message;
      this.log(`\u521D\u59CB\u5316\u5931\u8D25\uFF1A${message}`);
      console.error("RIME initialization failed", error);
      this.updateStatus("\u52A0\u8F7D\u5931\u8D25");
      new import_obsidian.Notice(`\u781A\u53F0\u52A0\u8F7D\u5931\u8D25\uFF1A${message}
\u8FD0\u884C\u547D\u4EE4\u300C\u8BCA\u65AD\u62A5\u544A (report)\u300D\u67E5\u770B\u8BE6\u60C5`, 15e3);
    }
  }
  onunload() {
    this.client?.destroy();
    this.panel?.remove();
  }
  /* ---------------- diagnostics ---------------- */
  log(message) {
    const stamp = String(Date.now() - this.startedAt).padStart(6, " ");
    this.diagnostics.push(`[+${stamp}ms] ${message}`);
  }
  environmentLine() {
    const kind = import_obsidian.Platform.isIosApp ? "iOS/iPadOS App" : import_obsidian.Platform.isAndroidApp ? "Android App" : import_obsidian.Platform.isMacOS ? "macOS \u684C\u9762" : import_obsidian.Platform.isWin ? "Windows \u684C\u9762" : "\u5176\u5B83";
    return `\u73AF\u5883\uFF1A${kind}\uFF5Cmobile=${import_obsidian.Platform.isMobile}\uFF5CObsidian ${this.app.appVersion ?? "?"}`;
  }
  /** Separates "the CDN is unreachable" from "the page context is not allowed to fetch it". */
  async probeNetwork() {
    this.log(`navigator.onLine = ${navigator.onLine}`);
    try {
      const res = await timeout((0, import_obsidian.requestUrl)({ url: PROBE_URL, method: "GET" }), 15e3, "\u7F51\u7EDC\u63A2\u6D4B(requestUrl)");
      this.log(`requestUrl \u63A2\u6D4B \u2192 HTTP ${res.status}\uFF0C${res.arrayBuffer.byteLength} \u5B57\u8282`);
    } catch (error) {
      this.log(`requestUrl \u63A2\u6D4B\u5931\u8D25 \u2192 ${this.errorMessage(error)}`);
    }
    try {
      const res = await timeout(fetch(PROBE_URL, { method: "GET" }), 15e3, "\u7F51\u7EDC\u63A2\u6D4B(fetch)");
      this.log(`fetch \u63A2\u6D4B \u2192 HTTP ${res.status} ${res.ok ? "ok" : "not ok"}`);
    } catch (error) {
      this.log(`fetch \u63A2\u6D4B\u5931\u8D25 \u2192 ${this.errorMessage(error)}\uFF08\u82E5 requestUrl \u6210\u529F\u800C\u6B64\u5904\u5931\u8D25\uFF0C\u8BF4\u660E\u662F\u9875\u9762\u5B89\u5168\u7B56\u7565\u62E6\u622A\uFF0C\u4E0D\u662F\u7F51\u7EDC\u95EE\u9898\uFF09`);
    }
  }
  /* 被动事件探针：只记录，不改变任何行为。用于在 iPad 上看清系统键盘到底发什么事件。 */
  registerInputProbes() {
    const types = ["beforeinput", "input", "compositionstart", "compositionupdate", "compositionend"];
    for (const type of types) {
      const handler = (event) => {
        if (!this.isEditorTarget(event.target)) return;
        this.noteSystemIme(event);
        this.trace(type, `${this.describeEvent(event)} @${this.targetTag(event.target)}`);
      };
      document.addEventListener(type, handler, true);
      this.register(() => document.removeEventListener(type, handler, true));
    }
  }
  /* 英文模式下砚台完全放行按键，打出中文还是英文取决于系统输入源。插件查不到
       系统输入源（网页环境没有这个 API），只能从事件反推。
  
       注意：不能拿「有 composition 事件」当判据。macOS 上那确实意味着输入法在转换，
       但 iOS 的自动改正和预测输入在打普通英文时也走 composition，照那么判会在英文
       键盘下疯狂误报（0.7.2 就是这么错的）。
  
       真正可靠的判据是 compositionend 提交了汉字：自动改正提交的是 ASCII，中文输入
       法提交的是汉字。代价是提醒要等到第一个词上屏之后才出现，可以接受。
  
       只在「当下真的发生了」时提醒。0.7.2 还做过一条「切换到英文模式时，若 10 分钟内
       见过中文输入法就提前提醒」，那是凭记忆猜——输入源随时会变，记忆必然过期，
       必然误报，0.7.8 已删除。 */
  noteSystemIme(event) {
    if (event.type !== "compositionend") return;
    if (!CJK.test(event.data ?? "")) return;
    this.warnSystemImeTookOver();
  }
  /* 系统键盘切到中文时，砚台在任何模式下都不工作——按键在到达插件之前就被系统
       输入法吃掉了。所以话要说「砚台停了」，不是「你在某某模式」：用户需要知道的是
       工具还灵不灵，不是自己处在哪一档。
  
       两条触发路径共用这一条文案：中文模式下按键被 229 连续跳过，以及任何模式下
       系统输入法上屏了汉字。同一种处境，不该有两种说法。 */
  warnSystemImeTookOver() {
    this.imeTookOver = true;
    if (Date.now() - this.lastImeWarnAt < IME_WARN_COOLDOWN_MS) return;
    this.lastImeWarnAt = Date.now();
    new import_obsidian.Notice("\u7CFB\u7EDF\u952E\u76D8\u5207\u5230\u4E2D\u6587\u4E86\uFF0C\u781A\u53F0\u5DF2\u505C\u6B62\u5DE5\u4F5C\u2014\u2014\u6309\u952E\u73B0\u5728\u5F52\u7CFB\u7EDF\u8F93\u5165\u6CD5\u3002\u8981\u7EE7\u7EED\u7528\u781A\u53F0\uFF0C\u8BF7\u628A\u7CFB\u7EDF\u952E\u76D8\u5207\u56DE\u82F1\u6587 ABC\u3002", 8e3);
  }
  describeEvent(event) {
    const input = event;
    if (typeof input.inputType === "string") {
      return `inputType="${input.inputType}" data=${this.redactData(input.data)} comp=${input.isComposing}`;
    }
    const composition = event;
    if (typeof composition.data === "string") return `data=${this.redactData(composition.data)}`;
    return "";
  }
  /* 默认只吐类别，不吐用户敲了什么。诊断 iPad 软键盘要的是「key 是不是 Unidentified」，
     而不是「用户打了什么字」——类别足够回答前者。 */
  redactKey(key) {
    if (this.traceRawKeys) return JSON.stringify(key);
    if (key.length !== 1) return JSON.stringify(key);
    if (/[a-z]/i.test(key)) return "<\u5B57\u6BCD>";
    if (/[0-9]/.test(key)) return "<\u6570\u5B57>";
    if (/\s/.test(key)) return "<\u7A7A\u767D>";
    return "<\u7B26\u53F7>";
  }
  /* code 和 keyCode 同样会泄露按了哪个键（keyCode 81 就是 Q）。但 code="" 和 keyCode=229
     是判定 iOS 软键盘行为的关键信号，不能一刀切抹掉——只把「能还原出字符」的那部分换成类别。 */
  redactCode(code) {
    if (this.traceRawKeys) return JSON.stringify(code);
    if (/^Key[A-Z]$/.test(code)) return "<\u5B57\u6BCD\u952E>";
    if (/^Digit[0-9]$/.test(code)) return "<\u6570\u5B57\u952E>";
    if (/^Numpad[0-9]$/.test(code)) return "<\u5C0F\u952E\u76D8\u6570\u5B57>";
    return JSON.stringify(code);
  }
  redactKeyCode(keyCode) {
    if (this.traceRawKeys) return String(keyCode);
    if (keyCode === 229 || keyCode === 0) return String(keyCode);
    const isContent = keyCode >= 48 && keyCode <= 57 || keyCode >= 65 && keyCode <= 90;
    return isContent ? "<\u5185\u5BB9>" : String(keyCode);
  }
  redactData(data) {
    if (data === null) return "null";
    if (this.traceRawKeys) return JSON.stringify(data);
    return `<${[...data].length} \u5B57\u7B26>`;
  }
  /* shouldCapture 里模式判断排在焦点判断前面，英文模式下所有按键都记成「未启用」，
     焦点信息就丢了。轨迹里单独带一份，排查时才看得出按键到底落在哪。 */
  readyHint() {
    const key = this.settings.toggleKey;
    return key === "none" ? "\u781A\u53F0\u8F93\u5165\u6CD5\u5DF2\u5C31\u7EEA\u2014\u2014\u7528\u547D\u4EE4\u300C\u5207\u6362\u4E2D\u82F1\u6587 (toggle)\u300D\u6216\u70B9\u72B6\u6001\u680F\u5207\u6362" : `\u781A\u53F0\u8F93\u5165\u6CD5\u5DF2\u5C31\u7EEA\u2014\u2014\u6309 ${TOGGLE_KEY_LABEL[key]} \u5728\u4E2D\u82F1\u6587\u4E4B\u95F4\u5207\u6362`;
  }
  targetTag(target) {
    if (!(target instanceof Element)) return "none";
    if (this.isEditorTarget(target)) return "editor";
    const cls = target.className?.toString().trim().split(/\s+/)[0] ?? "";
    return cls || target.tagName.toLowerCase();
  }
  trace(kind, detail) {
    if (!this.traceEnabled) return -1;
    this.eventCounts[kind] = (this.eventCounts[kind] ?? 0) + 1;
    const stamp = String(Date.now() - this.startedAt).padStart(6, " ");
    this.eventTrace.push(`[+${stamp}ms] ${kind} ${detail}`);
    if (this.eventTrace.length > MAX_TRACE) this.eventTrace.shift();
    return this.eventTrace.length - 1;
  }
  markTrace(index, marker) {
    if (index < 0 || index >= this.eventTrace.length) return;
    this.eventTrace[index] += ` \u2192 ${marker}`;
  }
  /* 报告本来只在内存里，iPad 上排查只能靠手抄。写成 Vault 笔记后可以随
     Obsidian Sync 到别的设备，两头都能直接读。脱敏规则与屏幕上的报告一致。 */
  async saveReport() {
    const d = /* @__PURE__ */ new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const stamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
    const path = `${REPORT_FOLDER}/${stamp}.md`;
    try {
      if (!this.app.vault.getAbstractFileByPath(REPORT_FOLDER)) {
        await this.app.vault.createFolder(REPORT_FOLDER);
      }
      const file = await this.app.vault.create(path, "```\n" + this.buildReport() + "\n```\n");
      new import_obsidian.Notice(`\u8BCA\u65AD\u62A5\u544A\u5DF2\u5B58\u5230 ${path}`, 8e3);
      await this.app.workspace.getLeaf(true).openFile(file);
    } catch (error) {
      new import_obsidian.Notice(`\u4FDD\u5B58\u8BCA\u65AD\u62A5\u544A\u5931\u8D25\uFF1A${this.errorMessage(error)}`, 8e3);
    }
  }
  buildReport() {
    const skips = Object.entries(this.skipCounts).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0)).map(([reason, count]) => `    ${reason}: ${count}`).join("\n") || "    (\u65E0)";
    const counts = Object.entries(this.eventCounts).map(([kind, n]) => `  ${kind}: ${n}`).join("\n") || "  (\u65E0)";
    const traceState = !this.traceEnabled ? "\u5173\uFF08\u8FD0\u884C\u547D\u4EE4\u300C\u8BCA\u65AD\uFF1A\u5F00\u59CB/\u505C\u6B62\u8BB0\u5F55\u6309\u952E\u4E8B\u4EF6\u300D\u5F00\u542F\uFF09" : this.traceRawKeys ? "\u5F00 \u2014 \u26A0\uFE0F \u542B\u539F\u59CB\u6309\u952E\u5185\u5BB9" : "\u5F00 \u2014 \u5DF2\u8131\u654F";
    const trace = this.eventTrace.length ? this.eventTrace.map((line) => `  ${line}`).join("\n") : "  (\u65E0)";
    return [
      "\u781A\u53F0\u8F93\u5165\u6CD5 \xB7 \u8BCA\u65AD\u62A5\u544A",
      `\u751F\u6210\u65F6\u95F4\uFF1A${(/* @__PURE__ */ new Date()).toLocaleString()}`,
      `\u63D2\u4EF6\u7248\u672C\uFF1A${PLUGIN_VERSION}`,
      this.environmentLine(),
      `UA\uFF1A${navigator.userAgent}`,
      "",
      "--- \u5F53\u524D\u72B6\u6001 ---",
      `  \u5F15\u64CE\u5C31\u7EEA ready = ${this.ready}`,
      `  \u8F93\u5165\u6A21\u5F0F mode = ${this.mode}`,
      `  \u7EC4\u5408\u4E2D composing = ${this.composing}`,
      `  \u521D\u59CB\u5316\u9519\u8BEF = ${this.initError ?? "(\u65E0)"}`,
      "",
      "--- \u6309\u952E\u6355\u83B7 ---",
      `  \u6536\u5230 keydown\uFF1A${this.keydownSeen}`,
      `  \u88AB\u781A\u53F0\u622A\u83B7\uFF1A${this.keydownCaptured}`,
      `  \u6700\u8FD1\u4E00\u6B21\u6309\u952E\uFF1A${this.lastKeyNote}`,
      "  \u672A\u622A\u83B7\u539F\u56E0\u7EDF\u8BA1\uFF1A",
      skips,
      "",
      "--- \u4E8B\u4EF6\u8BA1\u6570 ---",
      counts,
      "",
      `--- \u6700\u8FD1\u4E8B\u4EF6\u8F68\u8FF9\uFF08\u6700\u591A ${MAX_TRACE} \u6761\uFF09---`,
      `  \u8BB0\u5F55\u72B6\u6001\uFF1A${traceState}`,
      trace,
      "",
      "--- \u521D\u59CB\u5316\u8FC7\u7A0B ---",
      ...this.diagnostics
    ].join("\n");
  }
  /* ---------------- UI ---------------- */
  registerCommands() {
    this.addCommand({
      id: "toggle-chinese-english",
      name: "\u5207\u6362\u4E2D\u82F1\u6587 (toggle)",
      callback: () => this.toggle()
    });
    this.addCommand({
      id: "toggle-emoji",
      name: "\u5207\u6362\u8868\u60C5\u6A21\u5F0F (emoji)",
      callback: () => this.toggleEmoji()
    });
    this.addCommand({
      id: "diagnostics",
      name: "\u8BCA\u65AD\u62A5\u544A (report)",
      callback: () => new DiagnosticsModal(this.app, this.buildReport(), this.traceRawKeys).open()
    });
    this.addCommand({
      id: "toggle-trace",
      name: "\u8BCA\u65AD\uFF1A\u5F00\u59CB/\u505C\u6B62\u8BB0\u5F55\u6309\u952E\u4E8B\u4EF6 (trace)",
      callback: () => {
        this.traceEnabled = !this.traceEnabled;
        if (this.traceEnabled) {
          this.eventTrace = [];
          this.eventCounts = {};
        } else {
          this.traceRawKeys = false;
        }
        new import_obsidian.Notice(this.traceEnabled ? "\u6309\u952E\u4E8B\u4EF6\u8BB0\u5F55\uFF1A\u5F00\uFF08\u5185\u5BB9\u5DF2\u8131\u654F\uFF09\u3002\u590D\u73B0\u95EE\u9898\u540E\u8FD0\u884C\u300C\u8BCA\u65AD\u62A5\u544A (report)\u300D\u3002" : "\u6309\u952E\u4E8B\u4EF6\u8BB0\u5F55\uFF1A\u5173\u3002");
      }
    });
    this.addCommand({
      id: "toggle-trace-raw",
      name: "\u8BCA\u65AD\uFF1A\u8BB0\u5F55\u539F\u59CB\u6309\u952E\u5185\u5BB9 \u654F\u611F (trace raw)",
      callback: () => {
        this.traceRawKeys = !this.traceRawKeys;
        if (this.traceRawKeys && !this.traceEnabled) {
          this.traceEnabled = true;
          this.eventTrace = [];
          this.eventCounts = {};
        }
        new import_obsidian.Notice(this.traceRawKeys ? "\u26A0\uFE0F \u8BB0\u5F55\u5DF2\u5305\u542B\u4F60\u5B9E\u9645\u6572\u4E0B\u7684\u6309\u952E\u5185\u5BB9\uFF0C\u62A5\u544A\u5916\u53D1\u524D\u8BF7\u901A\u8BFB\u3002\u518D\u8FD0\u884C\u4E00\u6B21\u6B64\u547D\u4EE4\u53EF\u5173\u95ED\u3002" : "\u5DF2\u6062\u590D\u8131\u654F\u8BB0\u5F55\u3002", 8e3);
      }
    });
    this.addCommand({
      id: "save-report",
      name: "\u8BCA\u65AD\uFF1A\u628A\u62A5\u544A\u5B58\u8FDB Vault (save report)",
      callback: () => void this.saveReport()
    });
    this.addCommand({
      id: "probe-network",
      name: "\u8BCA\u65AD\uFF1A\u7F51\u7EDC\u63A2\u6D4B (network)",
      callback: () => {
        void this.probeNetwork().then(() => new DiagnosticsModal(this.app, this.buildReport(), this.traceRawKeys).open());
      }
    });
  }
  createControls() {
    this.ribbon = this.addRibbonIcon("languages", "\u781A\u53F0\uFF1A\u5207\u6362\u4E2D\u82F1\u6587", () => this.toggle());
    if (!import_obsidian.Platform.isMobile) {
      this.status = this.addStatusBarItem();
      this.status.addClass("inkstone-status");
      this.status.addEventListener("click", () => this.toggle());
    }
  }
  /* Shift、状态栏、ribbon 都只管中/英——和其他输入法的习惯一致。
     在表情模式下按 Shift 直接回中文，规则简单，不用记之前在哪。
     表情模式改由独立命令进入：iPad 上用系统地球键更顺手，这条留作后路。 */
  toggle() {
    this.setMode(this.mode === "chinese" ? "english" : "chinese");
  }
  toggleEmoji() {
    this.setMode(this.mode === "emoji" ? "chinese" : "emoji");
  }
  setMode(next) {
    this.cancelComposition();
    this.clearEmoji();
    this.mode = next;
    this.updateStatus();
    if (next === "emoji") {
      const view = this.activeEditor();
      if (view) this.renderEmojiPanel(view);
    }
    new import_obsidian.Notice(`\u781A\u53F0\uFF1A${MODE_NOTICE[next]}`);
  }
  updateStatus(override) {
    const active = this.mode !== "english" && this.ready;
    const label = override ?? MODE_LABEL[this.mode];
    if (this.status) {
      this.status.setText(label);
      this.status.toggleClass("is-enabled", active);
    }
    if (this.ribbon) {
      this.ribbon.toggleClass("is-enabled", active);
      this.ribbon.setAttribute("aria-label", `\u781A\u53F0\uFF1A${MODE_NOTICE[this.mode]}`);
      (0, import_obsidian.setIcon)(this.ribbon, this.mode === "emoji" ? "smile" : this.mode === "chinese" && this.ready ? "languages" : "type");
    }
  }
  createPanel() {
    this.panel = document.body.createDiv({ cls: "inkstone-panel" });
    this.panel.setAttribute("aria-live", "polite");
    this.preedit = this.panel.createDiv({ cls: "inkstone-preedit" });
    this.candidates = this.panel.createDiv({ cls: "inkstone-candidates" });
  }
  /* ---------------- input ---------------- */
  isEditorTarget(target) {
    return target instanceof Element && Boolean(target.closest(".markdown-source-view .cm-content"));
  }
  activeEditor() {
    return this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
  }
  skip(reason) {
    this.skipCounts[reason] = (this.skipCounts[reason] ?? 0) + 1;
    if (reason === "\u7CFB\u7EDF\u8F93\u5165\u6CD5\u7EC4\u5408\u4E2D") {
      this.imeConflictStreak += 1;
      if (this.imeConflictStreak === 3 && this.mode === "chinese") {
        this.warnSystemImeTookOver();
      }
    }
    this.markTrace(this.pendingTrace, reason);
    this.pendingTrace = -1;
    return false;
  }
  shouldCapture(event) {
    if (this.mode !== "chinese") return this.skip("\u672A\u542F\u7528");
    if (!this.ready || !this.client) return this.skip("\u5F15\u64CE\u672A\u5C31\u7EEA");
    if (!this.isEditorTarget(event.target)) return this.skip("\u7126\u70B9\u4E0D\u5728\u7F16\u8F91\u5668");
    if (event.isComposing || event.keyCode === 229) return this.skip("\u7CFB\u7EDF\u8F93\u5165\u6CD5\u7EC4\u5408\u4E2D");
    if (event.metaKey || event.ctrlKey || event.altKey) return this.skip("\u5E26\u4FEE\u9970\u952E");
    if (event.shiftKey && event.key.length !== 1) return this.skip("\u5E26\u4FEE\u9970\u952E");
    if (this.composing) {
      return /^[a-z0-9]$/i.test(event.key) || event.key in KEY_MAP ? true : this.skip("\u975E\u62FC\u97F3\u6309\u952E");
    }
    if (event.shiftKey) return this.skip("\u5E26\u4FEE\u9970\u952E");
    return /^[a-z]$/i.test(event.key) || START_PUNCTUATION.has(event.key) ? true : this.skip("\u975E\u62FC\u97F3\u6309\u952E");
  }
  /* 单独按下并松开切换键（中间没有别的键）＝ 中/英切换。默认 Shift，可在设置里改。 */
  isToggleKeyAlone(event) {
    const key = this.settings.toggleKey;
    if (key === "none" || event.key !== key) return false;
    if (key !== "Control" && event.ctrlKey) return false;
    if (key !== "Meta" && event.metaKey) return false;
    if (key !== "Alt" && event.altKey) return false;
    if (key !== "Shift" && event.shiftKey) return false;
    return true;
  }
  onKeyup(event) {
    if (event.key !== this.settings.toggleKey || !this.toggleArmed) return;
    this.toggleArmed = false;
    if (!this.ready || !this.isEditorTarget(event.target)) return;
    this.toggle();
  }
  /* iPadOS 把「点系统表情面板」发成 keydown：key 是那个表情本身，code="Unidentified"，
       keyCode=0。实测它有时不会跟上 beforeinput/input，表情就插不进文档（诊断报告
       2026-09-20-214712 里 🥳 失败、🤩 成功，同样的动作两种结果）。
  
       既然按键送到了，就由砚台自己写进文档，不再看系统脸色。preventDefault 掐掉系统
       那条不稳的插入路径，所以不会重复上屏。
       判据刻意收窄：keyCode 必须为 0、code 未识别、key 含非 ASCII——正常打字碰不到。 */
  isPickerChar(event) {
    if (event.metaKey || event.ctrlKey || event.altKey) return false;
    if (event.keyCode !== 0) return false;
    if (event.code !== "" && event.code !== "Unidentified") return false;
    const key = event.key;
    if (!key) return false;
    if (/^[A-Z][A-Za-z]+$/.test(key)) return false;
    return /[^\x00-\x7F]/.test(key);
  }
  insertPickerChar(event) {
    if (!this.isEditorTarget(event.target)) return void this.skip("\u7126\u70B9\u4E0D\u5728\u7F16\u8F91\u5668");
    const view = this.activeEditor();
    if (!view) return void this.skip("\u7126\u70B9\u4E0D\u5728\u7F16\u8F91\u5668");
    if (this.composing) this.cancelComposition();
    if (this.mode === "emoji") this.clearEmoji();
    event.preventDefault();
    event.stopImmediatePropagation();
    view.editor.replaceSelection(event.key);
    this.keydownCaptured += 1;
    this.markTrace(this.pendingTrace, "\u8868\u60C5\u76F4\u63A5\u4E0A\u5C4F");
    this.pendingTrace = -1;
  }
  /* 「砚台停了」有提示，「砚台回来了」也得有，否则用户不知道什么时候能接着用。
     插件查不到系统输入源，但能从按键反推：系统中文输入法在工作时，按键到达这里
     是 keyCode 229 / isComposing；一旦有正常字符键落进编辑器，就说明系统交还了
     控制权。只在确实被接管过之后报一次，平时不啰嗦。 */
  noteImeReleased(event) {
    if (!this.imeTookOver) return;
    if (event.isComposing || event.keyCode === 229) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key.length !== 1) return;
    if (!this.isEditorTarget(event.target)) return;
    this.imeTookOver = false;
    new import_obsidian.Notice(this.readyHint(), 6e3);
  }
  onKeydown(event) {
    this.toggleArmed = this.isToggleKeyAlone(event);
    this.keydownSeen += 1;
    const target = event.target instanceof Element ? event.target.className.toString().slice(0, 60) : String(event.target);
    this.lastKeyNote = `key=${this.redactKey(event.key)} code=${this.redactCode(event.code)} keyCode=${this.redactKeyCode(event.keyCode)} isComposing=${event.isComposing} target=[${target}]`;
    this.pendingTrace = this.trace("keydown", `key=${this.redactKey(event.key)} code=${this.redactCode(event.code)} kc=${this.redactKeyCode(event.keyCode)} comp=${event.isComposing} @${this.targetTag(event.target)}`);
    this.noteImeReleased(event);
    if (this.isPickerChar(event)) {
      this.insertPickerChar(event);
      return;
    }
    if (this.mode === "emoji") {
      this.handleEmojiMode(event);
      return;
    }
    if (!this.shouldCapture(event)) return;
    const view = this.activeEditor();
    if (!view) return this.skip("\u7126\u70B9\u4E0D\u5728\u7F16\u8F91\u5668");
    const rimeKey = this.toRimeKey(event);
    if (!rimeKey) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    this.keydownCaptured += 1;
    this.imeConflictStreak = 0;
    this.markTrace(this.pendingTrace, "\u622A\u83B7");
    this.pendingTrace = -1;
    const sequence = ++this.inputSequence;
    void this.client.call("process", rimeKey).then((result) => this.applyResult(result, event.key, view, sequence)).catch((error) => {
      console.error("RIME input failed", error);
      this.log(`process("${rimeKey}") \u5931\u8D25\uFF1A${this.errorMessage(error)}`);
      this.cancelComposition();
      new import_obsidian.Notice(`\u781A\u53F0\u8F93\u5165\u5931\u8D25\uFF1A${this.errorMessage(error)}
\u53EF\u8FD0\u884C\u547D\u4EE4\u300C\u8BCA\u65AD\u62A5\u544A (report)\u300D\u67E5\u770B\u8BE6\u60C5`, 8e3);
    });
  }
  handleEmojiMode(event) {
    if (!this.isEditorTarget(event.target)) return void this.skip("\u7126\u70B9\u4E0D\u5728\u7F16\u8F91\u5668");
    if (event.metaKey || event.ctrlKey || event.altKey) return void this.skip("\u5E26\u4FEE\u9970\u952E");
    if (event.isComposing || event.keyCode === 229) return void this.skip("\u7CFB\u7EDF\u8F93\u5165\u6CD5\u7EC4\u5408\u4E2D");
    const view = this.activeEditor();
    if (!view) return void this.skip("\u7126\u70B9\u4E0D\u5728\u7F16\u8F91\u5668");
    if (!this.handleEmojiKey(event, view)) return void this.skip("\u975E\u62FC\u97F3\u6309\u952E");
    event.preventDefault();
    event.stopImmediatePropagation();
    this.keydownCaptured += 1;
    this.imeConflictStreak = 0;
    this.markTrace(this.pendingTrace, "\u622A\u83B7");
    this.pendingTrace = -1;
  }
  toRimeKey(event) {
    if (/^[a-z0-9]$/i.test(event.key)) return event.key.toLowerCase();
    const mapped = KEY_MAP[event.key];
    return mapped ? `{${mapped}}` : void 0;
  }
  applyResult(result, originalKey, view, sequence) {
    if (sequence <= this.discardThrough) return;
    if (result.state === 0) {
      this.composing = false;
      if (result.committed) view.editor.replaceSelection(result.committed);
      this.hidePanel();
      return;
    }
    if (result.state === 1) {
      this.composing = true;
      if (result.committed) view.editor.replaceSelection(result.committed);
      this.renderPanel(result, view);
      return;
    }
    this.composing = false;
    this.hidePanel();
    if (result.state === 3 && originalKey.length === 1) view.editor.replaceSelection(originalKey);
  }
  /* ---------------- 表情模式 ---------------- */
  /* 返回 true 表示这个键归表情模式管，调用方负责 preventDefault。
     查询为空时只吃字母，其余键一律放行，免得表情模式下连空格退格都动不了。 */
  handleEmojiKey(event, view) {
    const key = event.key;
    if (/^[a-z]$/i.test(key)) {
      this.emojiQuery += key.toLowerCase();
      this.renderEmojiPanel(view);
      return true;
    }
    if (key === "Backspace") {
      if (!this.emojiQuery) return false;
      this.emojiQuery = this.emojiQuery.slice(0, -1);
      this.renderEmojiPanel(view);
      return true;
    }
    if (!this.emojiQuery) return false;
    if (key === "Escape") {
      this.clearEmoji();
      return true;
    }
    if (key === " ") {
      this.commitEmoji(0, view);
      return true;
    }
    if (/^[1-9]$/.test(key)) {
      this.commitEmoji(Number(key) - 1, view);
      return true;
    }
    return false;
  }
  commitEmoji(index, view) {
    const hit = this.emojiHits[index];
    if (!hit) return;
    view.editor.replaceSelection(hit.e);
    this.emojiQuery = "";
    this.renderEmojiPanel(view);
  }
  clearEmoji() {
    this.emojiQuery = "";
    this.emojiHits = [];
    this.hidePanel();
  }
  renderEmojiPanel(view) {
    if (!this.panel || !this.preedit || !this.candidates) return;
    this.emojiHits = searchEmoji(this.emojiQuery, EMOJI_PAGE);
    this.preedit.setText(this.emojiQuery ? `\u{1F600} ${this.emojiQuery}` : "\u{1F600} \u6253\u5173\u952E\u8BCD\u641C\u7D22\u8868\u60C5\uFF08xiao / smile / huo\uFF09");
    this.candidates.empty();
    if (!this.emojiHits.length) {
      this.candidates.createEl("button", { text: "\u6CA1\u6709\u5339\u914D\u7684\u8868\u60C5", attr: { type: "button", disabled: "true" } });
    }
    this.emojiHits.forEach((hit, index) => {
      const button = this.candidates.createEl("button", {
        cls: index === 0 ? "is-highlighted" : "",
        text: `${index + 1} ${hit.e}`,
        attr: { type: "button" }
      });
      button.addEventListener("pointerdown", (event) => event.preventDefault());
      button.addEventListener("click", () => this.commitEmoji(index, view));
    });
    this.positionPanel(view);
    this.panel.addClass("is-visible");
  }
  /* 候选栏跟随光标。取不到光标位置时退回底部居中。 */
  caretRect(view) {
    const cm = view.editor.cm;
    const head = cm?.state?.selection.main.head;
    if (cm?.coordsAtPos && typeof head === "number") {
      const coords = cm.coordsAtPos(head);
      if (coords) return coords;
    }
    const selection = window.getSelection();
    if (selection?.rangeCount) {
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      if (rect.top || rect.left) return { left: rect.left, top: rect.top, bottom: rect.bottom };
    }
    return null;
  }
  positionPanel(view) {
    const panel = this.panel;
    if (!panel) return;
    const caret = this.caretRect(view);
    if (!caret) {
      panel.removeClass("is-anchored");
      panel.style.removeProperty("left");
      panel.style.removeProperty("top");
      return;
    }
    panel.addClass("is-anchored");
    const vv = window.visualViewport;
    const minX = vv ? vv.offsetLeft : 0;
    const minY = vv ? vv.offsetTop : 0;
    const maxX = minX + (vv ? vv.width : window.innerWidth);
    const maxY = minY + (vv ? vv.height : window.innerHeight);
    const gap = 6;
    const margin = 8;
    const width = panel.offsetWidth;
    const height = panel.offsetHeight;
    let left = caret.left;
    if (left + width > maxX - margin) left = maxX - margin - width;
    if (left < minX + margin) left = minX + margin;
    let top = caret.bottom + gap;
    if (top + height > maxY - margin) top = caret.top - gap - height;
    if (top < minY + margin) top = minY + margin;
    panel.style.left = `${Math.round(left)}px`;
    panel.style.top = `${Math.round(top)}px`;
  }
  renderPanel(result, view) {
    if (!this.panel || !this.preedit || !this.candidates) return;
    const head = result.head ?? "";
    const body = result.body ?? "";
    const tail = result.tail ?? "";
    this.preedit.setText(`${head}${body}${tail}`);
    this.candidates.empty();
    (result.candidates ?? []).forEach((candidate, index) => {
      const label = result.selectLabels?.[index] ?? String(index + 1);
      const button = this.candidates.createEl("button", {
        cls: index === result.highlighted ? "is-highlighted" : "",
        text: `${label} ${candidate.text}${candidate.comment ? ` ${candidate.comment}` : ""}`,
        attr: { type: "button" }
      });
      button.addEventListener("pointerdown", (event) => event.preventDefault());
      button.addEventListener("click", () => {
        void this.client.call("selectCandidateOnCurrentPage", index).then((raw) => this.applyResult(JSON.parse(raw), "", view, ++this.inputSequence));
      });
    });
    this.positionPanel(view);
    this.panel.addClass("is-visible");
  }
  cancelComposition() {
    this.composing = false;
    this.discardThrough = this.inputSequence;
    this.hidePanel();
    if (this.ready && this.client) void this.client.call("process", "{Escape}");
  }
  hidePanel() {
    this.panel?.removeClass("is-visible");
    this.preedit?.setText("");
    this.candidates?.empty();
  }
  errorMessage(error) {
    if (error instanceof Error) return error.message;
    if (typeof error === "object" && error !== null) {
      const maybe = error;
      if (maybe.message) return maybe.message;
      if (maybe.status) return `HTTP ${maybe.status}`;
    }
    return String(error);
  }
};
