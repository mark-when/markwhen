function e(e,t){const n=Object.create(null),r=e.split(",");for(let i=0;i<r.length;i++)n[r[i]]=!0;return t?e=>!!n[e.toLowerCase()]:e=>!!n[e]}const t=e("Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt"),n=e("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly");function r(e){if(w(e)){const t={};for(let n=0;n<e.length;n++){const i=e[n],o=r(k(i)?s(i):i);if(o)for(const e in o)t[e]=o[e]}return t}if(C(e))return e}const i=/;(?![^(]*\))/g,o=/:(.+)/;function s(e){const t={};return e.split(i).forEach((e=>{if(e){const n=e.split(o);n.length>1&&(t[n[0].trim()]=n[1].trim())}})),t}function a(e){let t="";if(k(e))t=e;else if(w(e))for(let n=0;n<e.length;n++){const r=a(e[n]);r&&(t+=r+" ")}else if(C(e))for(const n in e)e[n]&&(t+=n+" ");return t.trim()}const c=e=>null==e?"":C(e)?JSON.stringify(e,l,2):String(e),l=(e,t)=>I(t)?{[`Map(${t.size})`]:[...t.entries()].reduce(((e,[t,n])=>(e[`${t} =>`]=n,e)),{})}:E(t)?{[`Set(${t.size})`]:[...t.values()]}:!C(t)||w(t)||P(t)?t:String(t),u={},d=[],h=()=>{},p=()=>!1,f=/^on[^a-z]/,m=e=>f.test(e),g=e=>e.startsWith("onUpdate:"),v=Object.assign,y=(e,t)=>{const n=e.indexOf(t);n>-1&&e.splice(n,1)},_=Object.prototype.hasOwnProperty,b=(e,t)=>_.call(e,t),w=Array.isArray,I=e=>"[object Map]"===R(e),E=e=>"[object Set]"===R(e),T=e=>"function"==typeof e,k=e=>"string"==typeof e,S=e=>"symbol"==typeof e,C=e=>null!==e&&"object"==typeof e,O=e=>C(e)&&T(e.then)&&T(e.catch),A=Object.prototype.toString,R=e=>A.call(e),P=e=>"[object Object]"===R(e),N=e=>k(e)&&"NaN"!==e&&"-"!==e[0]&&""+parseInt(e,10)===e,L=e(",key,ref,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),x=e=>{const t=Object.create(null);return n=>t[n]||(t[n]=e(n))},M=/-(\w)/g,D=x((e=>e.replace(M,((e,t)=>t?t.toUpperCase():"")))),j=/\B([A-Z])/g,U=x((e=>e.replace(j,"-$1").toLowerCase())),F=x((e=>e.charAt(0).toUpperCase()+e.slice(1))),V=x((e=>e?`on${F(e)}`:"")),$=(e,t)=>e!==t&&(e==e||t==t),B=(e,t)=>{for(let n=0;n<e.length;n++)e[n](t)},z=(e,t,n)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,value:n})},W=e=>{const t=parseFloat(e);return isNaN(t)?e:t},H=new WeakMap,q=[];let K;const G=Symbol(""),J=Symbol("");function X(e,t=u){(function(e){return e&&!0===e._isEffect})(e)&&(e=e.raw);const n=function(e,t){const n=function(){if(!n.active)return e();if(!q.includes(n)){Q(n);try{return te.push(ee),ee=!0,q.push(n),K=n,e()}finally{q.pop(),re(),K=q[q.length-1]}}};return n.id=Z++,n.allowRecurse=!!t.allowRecurse,n._isEffect=!0,n.active=!0,n.raw=e,n.deps=[],n.options=t,n}(e,t);return t.lazy||n(),n}function Y(e){e.active&&(Q(e),e.options.onStop&&e.options.onStop(),e.active=!1)}let Z=0;function Q(e){const{deps:t}=e;if(t.length){for(let n=0;n<t.length;n++)t[n].delete(e);t.length=0}}let ee=!0;const te=[];function ne(){te.push(ee),ee=!1}function re(){const e=te.pop();ee=void 0===e||e}function ie(e,t,n){if(!ee||void 0===K)return;let r=H.get(e);r||H.set(e,r=new Map);let i=r.get(n);i||r.set(n,i=new Set),i.has(K)||(i.add(K),K.deps.push(i))}function oe(e,t,n,r,i,o){const s=H.get(e);if(!s)return;const a=new Set,c=e=>{e&&e.forEach((e=>{(e!==K||e.allowRecurse)&&a.add(e)}))};if("clear"===t)s.forEach(c);else if("length"===n&&w(e))s.forEach(((e,t)=>{("length"===t||t>=r)&&c(e)}));else switch(void 0!==n&&c(s.get(n)),t){case"add":w(e)?N(n)&&c(s.get("length")):(c(s.get(G)),I(e)&&c(s.get(J)));break;case"delete":w(e)||(c(s.get(G)),I(e)&&c(s.get(J)));break;case"set":I(e)&&c(s.get(G))}a.forEach((e=>{e.options.scheduler?e.options.scheduler(e):e()}))}const se=e("__proto__,__v_isRef,__isVue"),ae=new Set(Object.getOwnPropertyNames(Symbol).map((e=>Symbol[e])).filter(S)),ce=pe(),le=pe(!1,!0),ue=pe(!0),de=pe(!0,!0),he={};function pe(e=!1,t=!1){return function(n,r,i){if("__v_isReactive"===r)return!e;if("__v_isReadonly"===r)return e;if("__v_raw"===r&&i===(e?t?ze:Be:t?$e:Ve).get(n))return n;const o=w(n);if(!e&&o&&b(he,r))return Reflect.get(he,r,i);const s=Reflect.get(n,r,i);if(S(r)?ae.has(r):se(r))return s;if(e||ie(n,0,r),t)return s;if(Ze(s)){return!o||!N(r)?s.value:s}return C(s)?e?qe(s):He(s):s}}["includes","indexOf","lastIndexOf"].forEach((e=>{const t=Array.prototype[e];he[e]=function(...e){const n=Ye(this);for(let t=0,i=this.length;t<i;t++)ie(n,0,t+"");const r=t.apply(n,e);return-1===r||!1===r?t.apply(n,e.map(Ye)):r}})),["push","pop","shift","unshift","splice"].forEach((e=>{const t=Array.prototype[e];he[e]=function(...e){ne();const n=t.apply(this,e);return re(),n}}));function fe(e=!1){return function(t,n,r,i){let o=t[n];if(!e&&(r=Ye(r),o=Ye(o),!w(t)&&Ze(o)&&!Ze(r)))return o.value=r,!0;const s=w(t)&&N(n)?Number(n)<t.length:b(t,n),a=Reflect.set(t,n,r,i);return t===Ye(i)&&(s?$(r,o)&&oe(t,"set",n,r):oe(t,"add",n,r)),a}}const me={get:ce,set:fe(),deleteProperty:function(e,t){const n=b(e,t);e[t];const r=Reflect.deleteProperty(e,t);return r&&n&&oe(e,"delete",t,void 0),r},has:function(e,t){const n=Reflect.has(e,t);return S(t)&&ae.has(t)||ie(e,0,t),n},ownKeys:function(e){return ie(e,0,w(e)?"length":G),Reflect.ownKeys(e)}},ge={get:ue,set:(e,t)=>!0,deleteProperty:(e,t)=>!0},ve=v({},me,{get:le,set:fe(!0)});v({},ge,{get:de});const ye=e=>C(e)?He(e):e,_e=e=>C(e)?qe(e):e,be=e=>e,we=e=>Reflect.getPrototypeOf(e);function Ie(e,t,n=!1,r=!1){const i=Ye(e=e.__v_raw),o=Ye(t);t!==o&&!n&&ie(i,0,t),!n&&ie(i,0,o);const{has:s}=we(i),a=r?be:n?_e:ye;return s.call(i,t)?a(e.get(t)):s.call(i,o)?a(e.get(o)):void(e!==i&&e.get(t))}function Ee(e,t=!1){const n=this.__v_raw,r=Ye(n),i=Ye(e);return e!==i&&!t&&ie(r,0,e),!t&&ie(r,0,i),e===i?n.has(e):n.has(e)||n.has(i)}function Te(e,t=!1){return e=e.__v_raw,!t&&ie(Ye(e),0,G),Reflect.get(e,"size",e)}function ke(e){e=Ye(e);const t=Ye(this);return we(t).has.call(t,e)||(t.add(e),oe(t,"add",e,e)),this}function Se(e,t){t=Ye(t);const n=Ye(this),{has:r,get:i}=we(n);let o=r.call(n,e);o||(e=Ye(e),o=r.call(n,e));const s=i.call(n,e);return n.set(e,t),o?$(t,s)&&oe(n,"set",e,t):oe(n,"add",e,t),this}function Ce(e){const t=Ye(this),{has:n,get:r}=we(t);let i=n.call(t,e);i||(e=Ye(e),i=n.call(t,e)),r&&r.call(t,e);const o=t.delete(e);return i&&oe(t,"delete",e,void 0),o}function Oe(){const e=Ye(this),t=0!==e.size,n=e.clear();return t&&oe(e,"clear",void 0,void 0),n}function Ae(e,t){return function(n,r){const i=this,o=i.__v_raw,s=Ye(o),a=t?be:e?_e:ye;return!e&&ie(s,0,G),o.forEach(((e,t)=>n.call(r,a(e),a(t),i)))}}function Re(e,t,n){return function(...r){const i=this.__v_raw,o=Ye(i),s=I(o),a="entries"===e||e===Symbol.iterator&&s,c="keys"===e&&s,l=i[e](...r),u=n?be:t?_e:ye;return!t&&ie(o,0,c?J:G),{next(){const{value:e,done:t}=l.next();return t?{value:e,done:t}:{value:a?[u(e[0]),u(e[1])]:u(e),done:t}},[Symbol.iterator](){return this}}}}function Pe(e){return function(...t){return"delete"!==e&&this}}const Ne={get(e){return Ie(this,e)},get size(){return Te(this)},has:Ee,add:ke,set:Se,delete:Ce,clear:Oe,forEach:Ae(!1,!1)},Le={get(e){return Ie(this,e,!1,!0)},get size(){return Te(this)},has:Ee,add:ke,set:Se,delete:Ce,clear:Oe,forEach:Ae(!1,!0)},xe={get(e){return Ie(this,e,!0)},get size(){return Te(this,!0)},has(e){return Ee.call(this,e,!0)},add:Pe("add"),set:Pe("set"),delete:Pe("delete"),clear:Pe("clear"),forEach:Ae(!0,!1)},Me={get(e){return Ie(this,e,!0,!0)},get size(){return Te(this,!0)},has(e){return Ee.call(this,e,!0)},add:Pe("add"),set:Pe("set"),delete:Pe("delete"),clear:Pe("clear"),forEach:Ae(!0,!0)};function De(e,t){const n=t?e?Me:Le:e?xe:Ne;return(t,r,i)=>"__v_isReactive"===r?!e:"__v_isReadonly"===r?e:"__v_raw"===r?t:Reflect.get(b(n,r)&&r in t?n:t,r,i)}["keys","values","entries",Symbol.iterator].forEach((e=>{Ne[e]=Re(e,!1,!1),xe[e]=Re(e,!0,!1),Le[e]=Re(e,!1,!0),Me[e]=Re(e,!0,!0)}));const je={get:De(!1,!1)},Ue={get:De(!1,!0)},Fe={get:De(!0,!1)},Ve=new WeakMap,$e=new WeakMap,Be=new WeakMap,ze=new WeakMap;function We(e){return e.__v_skip||!Object.isExtensible(e)?0:function(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}((e=>R(e).slice(8,-1))(e))}function He(e){return e&&e.__v_isReadonly?e:Ke(e,!1,me,je,Ve)}function qe(e){return Ke(e,!0,ge,Fe,Be)}function Ke(e,t,n,r,i){if(!C(e))return e;if(e.__v_raw&&(!t||!e.__v_isReactive))return e;const o=i.get(e);if(o)return o;const s=We(e);if(0===s)return e;const a=new Proxy(e,2===s?r:n);return i.set(e,a),a}function Ge(e){return Je(e)?Ge(e.__v_raw):!(!e||!e.__v_isReactive)}function Je(e){return!(!e||!e.__v_isReadonly)}function Xe(e){return Ge(e)||Je(e)}function Ye(e){return e&&Ye(e.__v_raw)||e}function Ze(e){return Boolean(e&&!0===e.__v_isRef)}const Qe={get:(e,t,n)=>{return Ze(r=Reflect.get(e,t,n))?r.value:r;var r},set:(e,t,n,r)=>{const i=e[t];return Ze(i)&&!Ze(n)?(i.value=n,!0):Reflect.set(e,t,n,r)}};function et(e){return Ge(e)?e:new Proxy(e,Qe)}class tt{constructor(e,t){this._object=e,this._key=t,this.__v_isRef=!0}get value(){return this._object[this._key]}set value(e){this._object[this._key]=e}}class nt{constructor(e,t,n){this._setter=t,this._dirty=!0,this.__v_isRef=!0,this.effect=X(e,{lazy:!0,scheduler:()=>{this._dirty||(this._dirty=!0,oe(Ye(this),"set","value"))}}),this.__v_isReadonly=n}get value(){const e=Ye(this);return e._dirty&&(e._value=this.effect(),e._dirty=!1),ie(e,0,"value"),e._value}set value(e){this._setter(e)}}function rt(e,t,n,r){let i;try{i=r?e(...r):e()}catch(o){ot(o,t,n)}return i}function it(e,t,n,r){if(T(e)){const i=rt(e,t,n,r);return i&&O(i)&&i.catch((e=>{ot(e,t,n)})),i}const i=[];for(let o=0;o<e.length;o++)i.push(it(e[o],t,n,r));return i}function ot(e,t,n,r=!0){t&&t.vnode;if(t){let r=t.parent;const i=t.proxy,o=n;for(;r;){const t=r.ec;if(t)for(let n=0;n<t.length;n++)if(!1===t[n](e,i,o))return;r=r.parent}const s=t.appContext.config.errorHandler;if(s)return void rt(s,null,10,[e,i,o])}!function(e,t,n,r=!0){console.error(e)}(e,0,0,r)}let st=!1,at=!1;const ct=[];let lt=0;const ut=[];let dt=null,ht=0;const pt=[];let ft=null,mt=0;const gt=Promise.resolve();let vt=null,yt=null;function _t(e){const t=vt||gt;return e?t.then(this?e.bind(this):e):t}function bt(e){if(!(ct.length&&ct.includes(e,st&&e.allowRecurse?lt+1:lt)||e===yt)){const t=function(e){let t=lt+1,n=ct.length;const r=kt(e);for(;t<n;){const e=t+n>>>1;kt(ct[e])<r?t=e+1:n=e}return t}(e);t>-1?ct.splice(t,0,e):ct.push(e),wt()}}function wt(){st||at||(at=!0,vt=gt.then(St))}function It(e,t,n,r){w(e)?n.push(...e):t&&t.includes(e,e.allowRecurse?r+1:r)||n.push(e),wt()}function Et(e,t=null){if(ut.length){for(yt=t,dt=[...new Set(ut)],ut.length=0,ht=0;ht<dt.length;ht++)dt[ht]();dt=null,ht=0,yt=null,Et(e,t)}}function Tt(e){if(pt.length){const e=[...new Set(pt)];if(pt.length=0,ft)return void ft.push(...e);for(ft=e,ft.sort(((e,t)=>kt(e)-kt(t))),mt=0;mt<ft.length;mt++)ft[mt]();ft=null,mt=0}}const kt=e=>null==e.id?1/0:e.id;function St(e){at=!1,st=!0,Et(e),ct.sort(((e,t)=>kt(e)-kt(t)));try{for(lt=0;lt<ct.length;lt++){const e=ct[lt];e&&!1!==e.active&&rt(e,null,14)}}finally{lt=0,ct.length=0,Tt(),st=!1,vt=null,(ct.length||ut.length||pt.length)&&St(e)}}function Ct(e,t,...n){const r=e.vnode.props||u;let i=n;const o=t.startsWith("update:"),s=o&&t.slice(7);if(s&&s in r){const e=`${"modelValue"===s?"model":s}Modifiers`,{number:t,trim:o}=r[e]||u;o?i=n.map((e=>e.trim())):t&&(i=n.map(W))}let a,c=r[a=V(t)]||r[a=V(D(t))];!c&&o&&(c=r[a=V(U(t))]),c&&it(c,e,6,i);const l=r[a+"Once"];if(l){if(e.emitted){if(e.emitted[a])return}else(e.emitted={})[a]=!0;it(l,e,6,i)}}function Ot(e,t,n=!1){const r=t.emitsCache,i=r.get(e);if(void 0!==i)return i;const o=e.emits;let s={},a=!1;if(!T(e)){const r=e=>{const n=Ot(e,t,!0);n&&(a=!0,v(s,n))};!n&&t.mixins.length&&t.mixins.forEach(r),e.extends&&r(e.extends),e.mixins&&e.mixins.forEach(r)}return o||a?(w(o)?o.forEach((e=>s[e]=null)):v(s,o),r.set(e,s),s):(r.set(e,null),null)}function At(e,t){return!(!e||!m(t))&&(t=t.slice(2).replace(/Once$/,""),b(e,t[0].toLowerCase()+t.slice(1))||b(e,U(t))||b(e,t))}let Rt=null,Pt=null;function Nt(e){const t=Rt;return Rt=e,Pt=e&&e.type.__scopeId||null,t}function Lt(e,t=Rt,n){if(!t)return e;if(e._n)return e;const r=(...n)=>{r._d&&hr(-1);const i=Nt(t),o=e(...n);return Nt(i),r._d&&hr(1),o};return r._n=!0,r._c=!0,r._d=!0,r}function xt(e){const{type:t,vnode:n,proxy:r,withProxy:i,props:o,propsOptions:[s],slots:a,attrs:c,emit:l,render:u,renderCache:d,data:h,setupState:p,ctx:f,inheritAttrs:m}=e;let v;const y=Nt(e);try{let e;if(4&n.shapeFlag){const t=i||r;v=Er(u.call(t,t,d,o,p,h,f)),e=c}else{const n=t;0,v=Er(n.length>1?n(o,{attrs:c,slots:a,emit:l}):n(o,null)),e=t.props?c:Mt(c)}let y=v;if(e&&!1!==m){const t=Object.keys(e),{shapeFlag:n}=y;t.length&&(1&n||6&n)&&(s&&t.some(g)&&(e=Dt(e,s)),y=br(y,e))}0,n.dirs&&(y.dirs=y.dirs?y.dirs.concat(n.dirs):n.dirs),n.transition&&(y.transition=n.transition),v=y}catch(_){cr.length=0,ot(_,e,1),v=_r(sr)}return Nt(y),v}const Mt=e=>{let t;for(const n in e)("class"===n||"style"===n||m(n))&&((t||(t={}))[n]=e[n]);return t},Dt=(e,t)=>{const n={};for(const r in e)g(r)&&r.slice(9)in t||(n[r]=e[r]);return n};function jt(e,t,n){const r=Object.keys(t);if(r.length!==Object.keys(e).length)return!0;for(let i=0;i<r.length;i++){const o=r[i];if(t[o]!==e[o]&&!At(n,o))return!0}return!1}function Ut(e,t,n=!1){const r=Mr||Rt;if(r){const i=null==r.parent?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides;if(i&&e in i)return i[e];if(arguments.length>1)return n&&T(t)?t():t}}const Ft={};function Vt(e,t,n){return $t(e,t,n)}function $t(e,t,{immediate:n,deep:r,flush:i,onTrack:o,onTrigger:s}=u,a=Mr){let c,l,d=!1,p=!1;if(Ze(e)?(c=()=>e.value,d=!!e._shallow):Ge(e)?(c=()=>e,r=!0):w(e)?(p=!0,d=e.some(Ge),c=()=>e.map((e=>Ze(e)?e.value:Ge(e)?Wt(e):T(e)?rt(e,a,2):void 0))):c=T(e)?t?()=>rt(e,a,2):()=>{if(!a||!a.isUnmounted)return l&&l(),it(e,a,3,[f])}:h,t&&r){const e=c;c=()=>Wt(e())}let f=e=>{l=_.options.onStop=()=>{rt(e,a,4)}},m=p?[]:Ft;const g=()=>{if(_.active)if(t){const e=_();(r||d||(p?e.some(((e,t)=>$(e,m[t]))):$(e,m)))&&(l&&l(),it(t,a,3,[e,m===Ft?void 0:m,f]),m=e)}else _()};let v;g.allowRecurse=!!t,v="sync"===i?g:"post"===i?()=>Xn(g,a&&a.suspense):()=>{!a||a.isMounted?function(e){It(e,dt,ut,ht)}(g):g()};const _=X(c,{lazy:!0,onTrack:o,onTrigger:s,scheduler:v});return Br(_,a),t?n?g():m=_():"post"===i?Xn(_,a&&a.suspense):_(),()=>{Y(_),a&&y(a.effects,_)}}function Bt(e,t,n){const r=this.proxy,i=k(e)?e.includes(".")?zt(r,e):()=>r[e]:e.bind(r,r);let o;return T(t)?o=t:(o=t.handler,n=t),$t(i,o.bind(r),n,this)}function zt(e,t){const n=t.split(".");return()=>{let t=e;for(let e=0;e<n.length&&t;e++)t=t[n[e]];return t}}function Wt(e,t=new Set){if(!C(e)||t.has(e)||e.__v_skip)return e;if(t.add(e),Ze(e))Wt(e.value,t);else if(w(e))for(let n=0;n<e.length;n++)Wt(e[n],t);else if(E(e)||I(e))e.forEach((e=>{Wt(e,t)}));else if(P(e))for(const n in e)Wt(e[n],t);return e}function Ht(){const e={isMounted:!1,isLeaving:!1,isUnmounting:!1,leavingVNodes:new Map};return dn((()=>{e.isMounted=!0})),fn((()=>{e.isUnmounting=!0})),e}const qt=[Function,Array],Kt={name:"BaseTransition",props:{mode:String,appear:Boolean,persisted:Boolean,onBeforeEnter:qt,onEnter:qt,onAfterEnter:qt,onEnterCancelled:qt,onBeforeLeave:qt,onLeave:qt,onAfterLeave:qt,onLeaveCancelled:qt,onBeforeAppear:qt,onAppear:qt,onAfterAppear:qt,onAppearCancelled:qt},setup(e,{slots:t}){const n=Dr(),r=Ht();let i;return()=>{const o=t.default&&Qt(t.default(),!0);if(!o||!o.length)return;const s=Ye(e),{mode:a}=s,c=o[0];if(r.isLeaving)return Xt(c);const l=Yt(c);if(!l)return Xt(c);const u=Jt(l,s,r,n);Zt(l,u);const d=n.subTree,h=d&&Yt(d);let p=!1;const{getTransitionKey:f}=l.type;if(f){const e=f();void 0===i?i=e:e!==i&&(i=e,p=!0)}if(h&&h.type!==sr&&(!mr(l,h)||p)){const e=Jt(h,s,r,n);if(Zt(h,e),"out-in"===a)return r.isLeaving=!0,e.afterLeave=()=>{r.isLeaving=!1,n.update()},Xt(c);"in-out"===a&&l.type!==sr&&(e.delayLeave=(e,t,n)=>{Gt(r,h)[String(h.key)]=h,e._leaveCb=()=>{t(),e._leaveCb=void 0,delete u.delayedLeave},u.delayedLeave=n})}return c}}};function Gt(e,t){const{leavingVNodes:n}=e;let r=n.get(t.type);return r||(r=Object.create(null),n.set(t.type,r)),r}function Jt(e,t,n,r){const{appear:i,mode:o,persisted:s=!1,onBeforeEnter:a,onEnter:c,onAfterEnter:l,onEnterCancelled:u,onBeforeLeave:d,onLeave:h,onAfterLeave:p,onLeaveCancelled:f,onBeforeAppear:m,onAppear:g,onAfterAppear:v,onAppearCancelled:y}=t,_=String(e.key),b=Gt(n,e),w=(e,t)=>{e&&it(e,r,9,t)},I={mode:o,persisted:s,beforeEnter(t){let r=a;if(!n.isMounted){if(!i)return;r=m||a}t._leaveCb&&t._leaveCb(!0);const o=b[_];o&&mr(e,o)&&o.el._leaveCb&&o.el._leaveCb(),w(r,[t])},enter(e){let t=c,r=l,o=u;if(!n.isMounted){if(!i)return;t=g||c,r=v||l,o=y||u}let s=!1;const a=e._enterCb=t=>{s||(s=!0,w(t?o:r,[e]),I.delayedLeave&&I.delayedLeave(),e._enterCb=void 0)};t?(t(e,a),t.length<=1&&a()):a()},leave(t,r){const i=String(e.key);if(t._enterCb&&t._enterCb(!0),n.isUnmounting)return r();w(d,[t]);let o=!1;const s=t._leaveCb=n=>{o||(o=!0,r(),w(n?f:p,[t]),t._leaveCb=void 0,b[i]===e&&delete b[i])};b[i]=e,h?(h(t,s),h.length<=1&&s()):s()},clone:e=>Jt(e,t,n,r)};return I}function Xt(e){if(nn(e))return(e=br(e)).children=null,e}function Yt(e){return nn(e)?e.children?e.children[0]:void 0:e}function Zt(e,t){6&e.shapeFlag&&e.component?Zt(e.component.subTree,t):128&e.shapeFlag?(e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback)):e.transition=t}function Qt(e,t=!1){let n=[],r=0;for(let i=0;i<e.length;i++){const o=e[i];o.type===ir?(128&o.patchFlag&&r++,n=n.concat(Qt(o.children,t))):(t||o.type!==sr)&&n.push(o)}if(r>1)for(let i=0;i<n.length;i++)n[i].patchFlag=-2;return n}function en(e){return T(e)?{setup:e,name:e.name}:e}const tn=e=>!!e.type.__asyncLoader,nn=e=>e.type.__isKeepAlive;function rn(e,t){sn(e,"a",t)}function on(e,t){sn(e,"da",t)}function sn(e,t,n=Mr){const r=e.__wdc||(e.__wdc=()=>{let t=n;for(;t;){if(t.isDeactivated)return;t=t.parent}e()});if(cn(t,r,n),n){let e=n.parent;for(;e&&e.parent;)nn(e.parent.vnode)&&an(r,t,n,e),e=e.parent}}function an(e,t,n,r){const i=cn(t,e,r,!0);mn((()=>{y(r[t],i)}),n)}function cn(e,t,n=Mr,r=!1){if(n){const i=n[e]||(n[e]=[]),o=t.__weh||(t.__weh=(...r)=>{if(n.isUnmounted)return;ne(),jr(n);const i=it(t,n,e,r);return jr(null),re(),i});return r?i.unshift(o):i.push(o),o}}const ln=e=>(t,n=Mr)=>(!Fr||"sp"===e)&&cn(e,t,n),un=ln("bm"),dn=ln("m"),hn=ln("bu"),pn=ln("u"),fn=ln("bum"),mn=ln("um"),gn=ln("sp"),vn=ln("rtg"),yn=ln("rtc");function _n(e,t=Mr){cn("ec",e,t)}let bn=!0;function wn(e){const t=Tn(e),n=e.proxy,r=e.ctx;bn=!1,t.beforeCreate&&In(t.beforeCreate,e,"bc");const{data:i,computed:o,methods:s,watch:a,provide:c,inject:l,created:d,beforeMount:p,mounted:f,beforeUpdate:m,updated:g,activated:v,deactivated:y,beforeDestroy:_,beforeUnmount:b,destroyed:I,unmounted:E,render:k,renderTracked:S,renderTriggered:O,errorCaptured:A,serverPrefetch:R,expose:P,inheritAttrs:N,components:L,directives:x,filters:M}=t;if(l&&function(e,t,n=h){w(e)&&(e=On(e));for(const r in e){const n=e[r];C(n)?t[r]="default"in n?Ut(n.from||r,n.default,!0):Ut(n.from||r):t[r]=Ut(n)}}(l,r,null),s)for(const u in s){const e=s[u];T(e)&&(r[u]=e.bind(n))}if(i){const t=i.call(n,n);C(t)&&(e.data=He(t))}if(bn=!0,o)for(const u in o){const e=o[u],t=Wr({get:T(e)?e.bind(n,n):T(e.get)?e.get.bind(n,n):h,set:!T(e)&&T(e.set)?e.set.bind(n):h});Object.defineProperty(r,u,{enumerable:!0,configurable:!0,get:()=>t.value,set:e=>t.value=e})}if(a)for(const u in a)En(a[u],r,n,u);if(c){const e=T(c)?c.call(n):c;Reflect.ownKeys(e).forEach((t=>{!function(e,t){if(Mr){let n=Mr.provides;const r=Mr.parent&&Mr.parent.provides;r===n&&(n=Mr.provides=Object.create(r)),n[e]=t}}(t,e[t])}))}function D(e,t){w(t)?t.forEach((t=>e(t.bind(n)))):t&&e(t.bind(n))}if(d&&In(d,e,"c"),D(un,p),D(dn,f),D(hn,m),D(pn,g),D(rn,v),D(on,y),D(_n,A),D(yn,S),D(vn,O),D(fn,b),D(mn,E),D(gn,R),w(P))if(P.length){const t=e.exposed||(e.exposed=et({}));P.forEach((e=>{t[e]=function(e,t){return Ze(e[t])?e[t]:new tt(e,t)}(n,e)}))}else e.exposed||(e.exposed=u);k&&e.render===h&&(e.render=k),null!=N&&(e.inheritAttrs=N),L&&(e.components=L),x&&(e.directives=x)}function In(e,t,n){it(w(e)?e.map((e=>e.bind(t.proxy))):e.bind(t.proxy),t,n)}function En(e,t,n,r){const i=r.includes(".")?zt(n,r):()=>n[r];if(k(e)){const n=t[e];T(n)&&Vt(i,n)}else if(T(e))Vt(i,e.bind(n));else if(C(e))if(w(e))e.forEach((e=>En(e,t,n,r)));else{const r=T(e.handler)?e.handler.bind(n):t[e.handler];T(r)&&Vt(i,r,e)}}function Tn(e){const t=e.type,{mixins:n,extends:r}=t,{mixins:i,optionsCache:o,config:{optionMergeStrategies:s}}=e.appContext,a=o.get(t);let c;return a?c=a:i.length||n||r?(c={},i.length&&i.forEach((e=>kn(c,e,s,!0))),kn(c,t,s)):c=t,o.set(t,c),c}function kn(e,t,n,r=!1){const{mixins:i,extends:o}=t;o&&kn(e,o,n,!0),i&&i.forEach((t=>kn(e,t,n,!0)));for(const s in t)if(r&&"expose"===s);else{const r=Sn[s]||n&&n[s];e[s]=r?r(e[s],t[s]):t[s]}return e}const Sn={data:Cn,props:Rn,emits:Rn,methods:Rn,computed:Rn,beforeCreate:An,created:An,beforeMount:An,mounted:An,beforeUpdate:An,updated:An,beforeDestroy:An,destroyed:An,activated:An,deactivated:An,errorCaptured:An,serverPrefetch:An,components:Rn,directives:Rn,watch:Rn,provide:Cn,inject:function(e,t){return Rn(On(e),On(t))}};function Cn(e,t){return t?e?function(){return v(T(e)?e.call(this,this):e,T(t)?t.call(this,this):t)}:t:e}function On(e){if(w(e)){const t={};for(let n=0;n<e.length;n++)t[e[n]]=e[n];return t}return e}function An(e,t){return e?[...new Set([].concat(e,t))]:t}function Rn(e,t){return e?v(v(Object.create(null),e),t):t}function Pn(e,t,n,r=!1){const i={},o={};z(o,gr,1),e.propsDefaults=Object.create(null),Nn(e,t,i,o);for(const s in e.propsOptions[0])s in i||(i[s]=void 0);n?e.props=r?i:Ke(i,!1,ve,Ue,$e):e.type.props?e.props=i:e.props=o,e.attrs=o}function Nn(e,t,n,r){const[i,o]=e.propsOptions;let s,a=!1;if(t)for(let c in t){if(L(c))continue;const l=t[c];let u;i&&b(i,u=D(c))?o&&o.includes(u)?(s||(s={}))[u]=l:n[u]=l:At(e.emitsOptions,c)||l!==r[c]&&(r[c]=l,a=!0)}if(o){const t=Ye(n),r=s||u;for(let s=0;s<o.length;s++){const a=o[s];n[a]=Ln(i,t,a,r[a],e,!b(r,a))}}return a}function Ln(e,t,n,r,i,o){const s=e[n];if(null!=s){const e=b(s,"default");if(e&&void 0===r){const e=s.default;if(s.type!==Function&&T(e)){const{propsDefaults:o}=i;n in o?r=o[n]:(jr(i),r=o[n]=e.call(null,t),jr(null))}else r=e}s[0]&&(o&&!e?r=!1:!s[1]||""!==r&&r!==U(n)||(r=!0))}return r}function xn(e,t,n=!1){const r=t.propsCache,i=r.get(e);if(i)return i;const o=e.props,s={},a=[];let c=!1;if(!T(e)){const r=e=>{c=!0;const[n,r]=xn(e,t,!0);v(s,n),r&&a.push(...r)};!n&&t.mixins.length&&t.mixins.forEach(r),e.extends&&r(e.extends),e.mixins&&e.mixins.forEach(r)}if(!o&&!c)return r.set(e,d),d;if(w(o))for(let d=0;d<o.length;d++){const e=D(o[d]);Mn(e)&&(s[e]=u)}else if(o)for(const u in o){const e=D(u);if(Mn(e)){const t=o[u],n=s[e]=w(t)||T(t)?{type:t}:t;if(n){const t=Un(Boolean,n.type),r=Un(String,n.type);n[0]=t>-1,n[1]=r<0||t<r,(t>-1||b(n,"default"))&&a.push(e)}}}const l=[s,a];return r.set(e,l),l}function Mn(e){return"$"!==e[0]}function Dn(e){const t=e&&e.toString().match(/^\s*function (\w+)/);return t?t[1]:""}function jn(e,t){return Dn(e)===Dn(t)}function Un(e,t){return w(t)?t.findIndex((t=>jn(t,e))):T(t)&&jn(t,e)?0:-1}const Fn=e=>"_"===e[0]||"$stable"===e,Vn=e=>w(e)?e.map(Er):[Er(e)],$n=(e,t,n)=>{const r=Lt((e=>Vn(t(e))),n);return r._c=!1,r},Bn=(e,t,n)=>{const r=e._ctx;for(const i in e){if(Fn(i))continue;const n=e[i];if(T(n))t[i]=$n(0,n,r);else if(null!=n){const e=Vn(n);t[i]=()=>e}}},zn=(e,t)=>{const n=Vn(t);e.slots.default=()=>n};function Wn(e,t){if(null===Rt)return e;const n=Rt.proxy,r=e.dirs||(e.dirs=[]);for(let i=0;i<t.length;i++){let[e,o,s,a=u]=t[i];T(e)&&(e={mounted:e,updated:e}),r.push({dir:e,instance:n,value:o,oldValue:void 0,arg:s,modifiers:a})}return e}function Hn(e,t,n,r){const i=e.dirs,o=t&&t.dirs;for(let s=0;s<i.length;s++){const a=i[s];o&&(a.oldValue=o[s].value);let c=a.dir[r];c&&(ne(),it(c,n,8,[e.el,a,e,t]),re())}}function qn(){return{app:null,config:{isNativeTag:p,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let Kn=0;function Gn(e,t){return function(n,r=null){null==r||C(r)||(r=null);const i=qn(),o=new Set;let s=!1;const a=i.app={_uid:Kn++,_component:n,_props:r,_container:null,_context:i,version:Hr,get config(){return i.config},set config(e){},use:(e,...t)=>(o.has(e)||(e&&T(e.install)?(o.add(e),e.install(a,...t)):T(e)&&(o.add(e),e(a,...t))),a),mixin:e=>(i.mixins.includes(e)||i.mixins.push(e),a),component:(e,t)=>t?(i.components[e]=t,a):i.components[e],directive:(e,t)=>t?(i.directives[e]=t,a):i.directives[e],mount(o,c,l){if(!s){const u=_r(n,r);return u.appContext=i,c&&t?t(u,o):e(u,o,l),s=!0,a._container=o,o.__vue_app__=a,u.component.proxy}},unmount(){s&&(e(null,a._container),delete a._container.__vue_app__)},provide:(e,t)=>(i.provides[e]=t,a)};return a}}const Jn={scheduler:bt,allowRecurse:!0},Xn=function(e,t){t&&t.pendingBranch?w(e)?t.effects.push(...e):t.effects.push(e):It(e,ft,pt,mt)},Yn=(e,t,n,r,i=!1)=>{if(w(e))return void e.forEach(((e,o)=>Yn(e,t&&(w(t)?t[o]:t),n,r,i)));if(tn(r)&&!i)return;const o=4&r.shapeFlag?r.component.exposed||r.component.proxy:r.el,s=i?null:o,{i:a,r:c}=e,l=t&&t.r,d=a.refs===u?a.refs={}:a.refs,h=a.setupState;if(null!=l&&l!==c&&(k(l)?(d[l]=null,b(h,l)&&(h[l]=null)):Ze(l)&&(l.value=null)),k(c)){const e=()=>{d[c]=s,b(h,c)&&(h[c]=s)};s?(e.id=-1,Xn(e,n)):e()}else if(Ze(c)){const e=()=>{c.value=s};s?(e.id=-1,Xn(e,n)):e()}else T(c)&&rt(c,a,12,[s,d])};function Zn(e){return function(e,t){const{insert:n,remove:r,patchProp:i,forcePatchProp:o,createElement:s,createText:a,createComment:c,setText:l,setElementText:p,parentNode:f,nextSibling:m,setScopeId:g=h,cloneNode:y,insertStaticContent:_}=e,w=(e,t,n,r=null,i=null,o=null,s=!1,a=null,c=!1)=>{e&&!mr(e,t)&&(r=se(e),Z(e,i,o,!0),e=null),-2===t.patchFlag&&(c=!1,t.dynamicChildren=null);const{type:l,ref:u,shapeFlag:d}=t;switch(l){case or:I(e,t,n,r);break;case sr:E(e,t,n,r);break;case ar:null==e&&T(t,n,r,s);break;case ir:j(e,t,n,r,i,o,s,a,c);break;default:1&d?C(e,t,n,r,i,o,s,a,c):6&d?F(e,t,n,r,i,o,s,a,c):(64&d||128&d)&&l.process(e,t,n,r,i,o,s,a,c,ce)}null!=u&&i&&Yn(u,e&&e.ref,o,t||e,!t)},I=(e,t,r,i)=>{if(null==e)n(t.el=a(t.children),r,i);else{const n=t.el=e.el;t.children!==e.children&&l(n,t.children)}},E=(e,t,r,i)=>{null==e?n(t.el=c(t.children||""),r,i):t.el=e.el},T=(e,t,n,r)=>{[e.el,e.anchor]=_(e.children,t,n,r)},k=({el:e,anchor:t},r,i)=>{let o;for(;e&&e!==t;)o=m(e),n(e,r,i),e=o;n(t,r,i)},S=({el:e,anchor:t})=>{let n;for(;e&&e!==t;)n=m(e),r(e),e=n;r(t)},C=(e,t,n,r,i,o,s,a,c)=>{s=s||"svg"===t.type,null==e?A(t,n,r,i,o,s,a,c):N(e,t,i,o,s,a,c)},A=(e,t,r,o,a,c,l,u)=>{let d,h;const{type:f,props:m,shapeFlag:g,transition:v,patchFlag:_,dirs:b}=e;if(e.el&&void 0!==y&&-1===_)d=e.el=y(e.el);else{if(d=e.el=s(e.type,c,m&&m.is,m),8&g?p(d,e.children):16&g&&P(e.children,d,null,o,a,c&&"foreignObject"!==f,l,u||!!e.dynamicChildren),b&&Hn(e,null,o,"created"),m){for(const t in m)L(t)||i(d,t,null,m[t],c,e.children,o,a,ie);(h=m.onVnodeBeforeMount)&&Qn(h,o,e)}R(d,e,e.scopeId,l,o)}b&&Hn(e,null,o,"beforeMount");const w=(!a||a&&!a.pendingBranch)&&v&&!v.persisted;w&&v.beforeEnter(d),n(d,t,r),((h=m&&m.onVnodeMounted)||w||b)&&Xn((()=>{h&&Qn(h,o,e),w&&v.enter(d),b&&Hn(e,null,o,"mounted")}),a)},R=(e,t,n,r,i)=>{if(n&&g(e,n),r)for(let o=0;o<r.length;o++)g(e,r[o]);if(i){if(t===i.subTree){const t=i.vnode;R(e,t,t.scopeId,t.slotScopeIds,i.parent)}}},P=(e,t,n,r,i,o,s,a,c=0)=>{for(let l=c;l<e.length;l++){const c=e[l]=a?Tr(e[l]):Er(e[l]);w(null,c,t,n,r,i,o,s,a)}},N=(e,t,n,r,s,a,c)=>{const l=t.el=e.el;let{patchFlag:d,dynamicChildren:h,dirs:f}=t;d|=16&e.patchFlag;const m=e.props||u,g=t.props||u;let v;if((v=g.onVnodeBeforeUpdate)&&Qn(v,n,t,e),f&&Hn(t,e,n,"beforeUpdate"),d>0){if(16&d)M(l,t,m,g,n,r,s);else if(2&d&&m.class!==g.class&&i(l,"class",null,g.class,s),4&d&&i(l,"style",m.style,g.style,s),8&d){const a=t.dynamicProps;for(let t=0;t<a.length;t++){const c=a[t],u=m[c],d=g[c];(d!==u||o&&o(l,c))&&i(l,c,u,d,s,e.children,n,r,ie)}}1&d&&e.children!==t.children&&p(l,t.children)}else c||null!=h||M(l,t,m,g,n,r,s);const y=s&&"foreignObject"!==t.type;h?x(e.dynamicChildren,h,l,n,r,y,a):c||q(e,t,l,null,n,r,y,a,!1),((v=g.onVnodeUpdated)||f)&&Xn((()=>{v&&Qn(v,n,t,e),f&&Hn(t,e,n,"updated")}),r)},x=(e,t,n,r,i,o,s)=>{for(let a=0;a<t.length;a++){const c=e[a],l=t[a],u=c.el&&(c.type===ir||!mr(c,l)||6&c.shapeFlag||64&c.shapeFlag)?f(c.el):n;w(c,l,u,null,r,i,o,s,!0)}},M=(e,t,n,r,s,a,c)=>{if(n!==r){for(const l in r){if(L(l))continue;const u=r[l],d=n[l];(u!==d||o&&o(e,l))&&i(e,l,d,u,c,t.children,s,a,ie)}if(n!==u)for(const o in n)L(o)||o in r||i(e,o,n[o],null,c,t.children,s,a,ie)}},j=(e,t,r,i,o,s,c,l,u)=>{const d=t.el=e?e.el:a(""),h=t.anchor=e?e.anchor:a("");let{patchFlag:p,dynamicChildren:f,slotScopeIds:m}=t;f&&(u=!0),m&&(l=l?l.concat(m):m),null==e?(n(d,r,i),n(h,r,i),P(t.children,r,h,o,s,c,l,u)):p>0&&64&p&&f&&e.dynamicChildren?(x(e.dynamicChildren,f,r,o,s,c,l),(null!=t.key||o&&t===o.subTree)&&er(e,t,!0)):q(e,t,r,h,o,s,c,l,u)},F=(e,t,n,r,i,o,s,a,c)=>{t.slotScopeIds=a,null==e?512&t.shapeFlag?i.ctx.activate(t,n,r,s,c):V(t,n,r,i,o,s,c):$(e,t,c)},V=(e,t,n,r,i,o,s)=>{const a=e.component=function(e,t,n){const r=e.type,i=(t?t.appContext:e.appContext)||Lr,o={uid:xr++,vnode:e,type:r,parent:t,appContext:i,root:null,next:null,subTree:null,update:null,render:null,proxy:null,exposed:null,withProxy:null,effects:null,provides:t?t.provides:Object.create(i.provides),accessCache:null,renderCache:[],components:null,directives:null,propsOptions:xn(r,i),emitsOptions:Ot(r,i),emit:null,emitted:null,propsDefaults:u,inheritAttrs:r.inheritAttrs,ctx:u,data:u,props:u,attrs:u,slots:u,refs:u,setupState:u,setupContext:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return o.ctx={_:o},o.root=t?t.root:o,o.emit=Ct.bind(null,o),o}(e,r,i);if(nn(e)&&(a.ctx.renderer=ce),function(e,t=!1){Fr=t;const{props:n,children:r}=e.vnode,i=Ur(e);Pn(e,n,i,t),((e,t)=>{if(32&e.vnode.shapeFlag){const n=t._;n?(e.slots=Ye(t),z(t,"_",n)):Bn(t,e.slots={})}else e.slots={},t&&zn(e,t);z(e.slots,gr,1)})(e,r);const o=i?function(e,t){const n=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,Pr);const{setup:r}=n;if(r){const n=e.setupContext=r.length>1?function(e){const t=t=>{e.exposed=et(t)};return{attrs:e.attrs,slots:e.slots,emit:e.emit,expose:t}}(e):null;Mr=e,ne();const i=rt(r,e,0,[e.props,n]);if(re(),Mr=null,O(i)){if(t)return i.then((t=>{Vr(e,t)})).catch((t=>{ot(t,e,0)}));e.asyncDep=i}else Vr(e,i)}else $r(e)}(e,t):void 0;Fr=!1}(a),a.asyncDep){if(i&&i.registerDep(a,W),!e.el){const e=a.subTree=_r(sr);E(null,e,t,n)}}else W(a,e,t,n,i,o,s)},$=(e,t,n)=>{const r=t.component=e.component;if(function(e,t,n){const{props:r,children:i,component:o}=e,{props:s,children:a,patchFlag:c}=t,l=o.emitsOptions;if(t.dirs||t.transition)return!0;if(!(n&&c>=0))return!(!i&&!a||a&&a.$stable)||r!==s&&(r?!s||jt(r,s,l):!!s);if(1024&c)return!0;if(16&c)return r?jt(r,s,l):!!s;if(8&c){const e=t.dynamicProps;for(let t=0;t<e.length;t++){const n=e[t];if(s[n]!==r[n]&&!At(l,n))return!0}}return!1}(e,t,n)){if(r.asyncDep&&!r.asyncResolved)return void H(r,t,n);r.next=t,function(e){const t=ct.indexOf(e);t>lt&&ct.splice(t,1)}(r.update),r.update()}else t.component=e.component,t.el=e.el,r.vnode=t},W=(e,t,n,r,i,o,s)=>{e.update=X((function(){if(e.isMounted){let t,{next:n,bu:r,u:a,parent:c,vnode:l}=e,u=n;n?(n.el=l.el,H(e,n,s)):n=l,r&&B(r),(t=n.props&&n.props.onVnodeBeforeUpdate)&&Qn(t,c,n,l);const d=xt(e),h=e.subTree;e.subTree=d,w(h,d,f(h.el),se(h),e,i,o),n.el=d.el,null===u&&function({vnode:e,parent:t},n){for(;t&&t.subTree===e;)(e=t.vnode).el=n,t=t.parent}(e,d.el),a&&Xn(a,i),(t=n.props&&n.props.onVnodeUpdated)&&Xn((()=>Qn(t,c,n,l)),i)}else{let s;const{el:a,props:c}=t,{bm:l,m:u,parent:d}=e;if(l&&B(l),(s=c&&c.onVnodeBeforeMount)&&Qn(s,d,t),a&&ue){const n=()=>{e.subTree=xt(e),ue(a,e.subTree,e,i,null)};tn(t)?t.type.__asyncLoader().then((()=>!e.isUnmounted&&n())):n()}else{const s=e.subTree=xt(e);w(null,s,n,r,e,i,o),t.el=s.el}if(u&&Xn(u,i),s=c&&c.onVnodeMounted){const e=t;Xn((()=>Qn(s,d,e)),i)}256&t.shapeFlag&&e.a&&Xn(e.a,i),e.isMounted=!0,t=n=r=null}}),Jn)},H=(e,t,n)=>{t.component=e;const r=e.vnode.props;e.vnode=t,e.next=null,function(e,t,n,r){const{props:i,attrs:o,vnode:{patchFlag:s}}=e,a=Ye(i),[c]=e.propsOptions;let l=!1;if(!(r||s>0)||16&s){let r;Nn(e,t,i,o)&&(l=!0);for(const o in a)t&&(b(t,o)||(r=U(o))!==o&&b(t,r))||(c?!n||void 0===n[o]&&void 0===n[r]||(i[o]=Ln(c,a,o,void 0,e,!0)):delete i[o]);if(o!==a)for(const e in o)t&&b(t,e)||(delete o[e],l=!0)}else if(8&s){const n=e.vnode.dynamicProps;for(let r=0;r<n.length;r++){let s=n[r];const u=t[s];if(c)if(b(o,s))u!==o[s]&&(o[s]=u,l=!0);else{const t=D(s);i[t]=Ln(c,a,t,u,e,!1)}else u!==o[s]&&(o[s]=u,l=!0)}}l&&oe(e,"set","$attrs")}(e,t.props,r,n),((e,t,n)=>{const{vnode:r,slots:i}=e;let o=!0,s=u;if(32&r.shapeFlag){const e=t._;e?n&&1===e?o=!1:(v(i,t),n||1!==e||delete i._):(o=!t.$stable,Bn(t,i)),s=t}else t&&(zn(e,t),s={default:1});if(o)for(const a in i)Fn(a)||a in s||delete i[a]})(e,t.children,n),ne(),Et(void 0,e.update),re()},q=(e,t,n,r,i,o,s,a,c=!1)=>{const l=e&&e.children,u=e?e.shapeFlag:0,d=t.children,{patchFlag:h,shapeFlag:f}=t;if(h>0){if(128&h)return void G(l,d,n,r,i,o,s,a,c);if(256&h)return void K(l,d,n,r,i,o,s,a,c)}8&f?(16&u&&ie(l,i,o),d!==l&&p(n,d)):16&u?16&f?G(l,d,n,r,i,o,s,a,c):ie(l,i,o,!0):(8&u&&p(n,""),16&f&&P(d,n,r,i,o,s,a,c))},K=(e,t,n,r,i,o,s,a,c)=>{t=t||d;const l=(e=e||d).length,u=t.length,h=Math.min(l,u);let p;for(p=0;p<h;p++){const r=t[p]=c?Tr(t[p]):Er(t[p]);w(e[p],r,n,null,i,o,s,a,c)}l>u?ie(e,i,o,!0,!1,h):P(t,n,r,i,o,s,a,c,h)},G=(e,t,n,r,i,o,s,a,c)=>{let l=0;const u=t.length;let h=e.length-1,p=u-1;for(;l<=h&&l<=p;){const r=e[l],u=t[l]=c?Tr(t[l]):Er(t[l]);if(!mr(r,u))break;w(r,u,n,null,i,o,s,a,c),l++}for(;l<=h&&l<=p;){const r=e[h],l=t[p]=c?Tr(t[p]):Er(t[p]);if(!mr(r,l))break;w(r,l,n,null,i,o,s,a,c),h--,p--}if(l>h){if(l<=p){const e=p+1,d=e<u?t[e].el:r;for(;l<=p;)w(null,t[l]=c?Tr(t[l]):Er(t[l]),n,d,i,o,s,a,c),l++}}else if(l>p)for(;l<=h;)Z(e[l],i,o,!0),l++;else{const f=l,m=l,g=new Map;for(l=m;l<=p;l++){const e=t[l]=c?Tr(t[l]):Er(t[l]);null!=e.key&&g.set(e.key,l)}let v,y=0;const _=p-m+1;let b=!1,I=0;const E=new Array(_);for(l=0;l<_;l++)E[l]=0;for(l=f;l<=h;l++){const r=e[l];if(y>=_){Z(r,i,o,!0);continue}let u;if(null!=r.key)u=g.get(r.key);else for(v=m;v<=p;v++)if(0===E[v-m]&&mr(r,t[v])){u=v;break}void 0===u?Z(r,i,o,!0):(E[u-m]=l+1,u>=I?I=u:b=!0,w(r,t[u],n,null,i,o,s,a,c),y++)}const T=b?function(e){const t=e.slice(),n=[0];let r,i,o,s,a;const c=e.length;for(r=0;r<c;r++){const c=e[r];if(0!==c){if(i=n[n.length-1],e[i]<c){t[r]=i,n.push(r);continue}for(o=0,s=n.length-1;o<s;)a=(o+s)/2|0,e[n[a]]<c?o=a+1:s=a;c<e[n[o]]&&(o>0&&(t[r]=n[o-1]),n[o]=r)}}o=n.length,s=n[o-1];for(;o-- >0;)n[o]=s,s=t[s];return n}(E):d;for(v=T.length-1,l=_-1;l>=0;l--){const e=m+l,d=t[e],h=e+1<u?t[e+1].el:r;0===E[l]?w(null,d,n,h,i,o,s,a,c):b&&(v<0||l!==T[v]?J(d,n,h,2):v--)}}},J=(e,t,r,i,o=null)=>{const{el:s,type:a,transition:c,children:l,shapeFlag:u}=e;if(6&u)return void J(e.component.subTree,t,r,i);if(128&u)return void e.suspense.move(t,r,i);if(64&u)return void a.move(e,t,r,ce);if(a===ir){n(s,t,r);for(let e=0;e<l.length;e++)J(l[e],t,r,i);return void n(e.anchor,t,r)}if(a===ar)return void k(e,t,r);if(2!==i&&1&u&&c)if(0===i)c.beforeEnter(s),n(s,t,r),Xn((()=>c.enter(s)),o);else{const{leave:e,delayLeave:i,afterLeave:o}=c,a=()=>n(s,t,r),l=()=>{e(s,(()=>{a(),o&&o()}))};i?i(s,a,l):l()}else n(s,t,r)},Z=(e,t,n,r=!1,i=!1)=>{const{type:o,props:s,ref:a,children:c,dynamicChildren:l,shapeFlag:u,patchFlag:d,dirs:h}=e;if(null!=a&&Yn(a,null,n,e,!0),256&u)return void t.ctx.deactivate(e);const p=1&u&&h;let f;if((f=s&&s.onVnodeBeforeUnmount)&&Qn(f,t,e),6&u)te(e.component,n,r);else{if(128&u)return void e.suspense.unmount(n,r);p&&Hn(e,null,t,"beforeUnmount"),64&u?e.type.remove(e,t,n,i,ce,r):l&&(o!==ir||d>0&&64&d)?ie(l,t,n,!1,!0):(o===ir&&(128&d||256&d)||!i&&16&u)&&ie(c,t,n),r&&Q(e)}((f=s&&s.onVnodeUnmounted)||p)&&Xn((()=>{f&&Qn(f,t,e),p&&Hn(e,null,t,"unmounted")}),n)},Q=e=>{const{type:t,el:n,anchor:i,transition:o}=e;if(t===ir)return void ee(n,i);if(t===ar)return void S(e);const s=()=>{r(n),o&&!o.persisted&&o.afterLeave&&o.afterLeave()};if(1&e.shapeFlag&&o&&!o.persisted){const{leave:t,delayLeave:r}=o,i=()=>t(n,s);r?r(e.el,s,i):i()}else s()},ee=(e,t)=>{let n;for(;e!==t;)n=m(e),r(e),e=n;r(t)},te=(e,t,n)=>{const{bum:r,effects:i,update:o,subTree:s,um:a}=e;if(r&&B(r),i)for(let c=0;c<i.length;c++)Y(i[c]);o&&(Y(o),Z(s,e,t,n)),a&&Xn(a,t),Xn((()=>{e.isUnmounted=!0}),t),t&&t.pendingBranch&&!t.isUnmounted&&e.asyncDep&&!e.asyncResolved&&e.suspenseId===t.pendingId&&(t.deps--,0===t.deps&&t.resolve())},ie=(e,t,n,r=!1,i=!1,o=0)=>{for(let s=o;s<e.length;s++)Z(e[s],t,n,r,i)},se=e=>6&e.shapeFlag?se(e.component.subTree):128&e.shapeFlag?e.suspense.next():m(e.anchor||e.el),ae=(e,t,n)=>{null==e?t._vnode&&Z(t._vnode,null,null,!0):w(t._vnode||null,e,t,null,null,null,n),Tt(),t._vnode=e},ce={p:w,um:Z,m:J,r:Q,mt:V,mc:P,pc:q,pbc:x,n:se,o:e};let le,ue;t&&([le,ue]=t(ce));return{render:ae,hydrate:le,createApp:Gn(ae,le)}}(e)}function Qn(e,t,n,r=null){it(e,t,7,[n,r])}function er(e,t,n=!1){const r=e.children,i=t.children;if(w(r)&&w(i))for(let o=0;o<r.length;o++){const e=r[o];let t=i[o];1&t.shapeFlag&&!t.dynamicChildren&&((t.patchFlag<=0||32===t.patchFlag)&&(t=i[o]=Tr(i[o]),t.el=e.el),n||er(e,t))}}function tr(e,t){return function(e,t,n=!0,r=!1){const i=Rt||Mr;if(i){const n=i.type;if("components"===e){const e=zr(n);if(e&&(e===t||e===D(t)||e===F(D(t))))return n}const o=rr(i[e]||n[e],t)||rr(i.appContext[e],t);return!o&&r?n:o}}("components",e,!0,t)||e}const nr=Symbol();function rr(e,t){return e&&(e[t]||e[D(t)]||e[F(D(t))])}const ir=Symbol(void 0),or=Symbol(void 0),sr=Symbol(void 0),ar=Symbol(void 0),cr=[];let lr=null;function ur(e=!1){cr.push(lr=e?null:[])}let dr=1;function hr(e){dr+=e}function pr(e,t,n,r,i){const o=_r(e,t,n,r,i,!0);return o.dynamicChildren=dr>0?lr||d:null,cr.pop(),lr=cr[cr.length-1]||null,dr>0&&lr&&lr.push(o),o}function fr(e){return!!e&&!0===e.__v_isVNode}function mr(e,t){return e.type===t.type&&e.key===t.key}const gr="__vInternal",vr=({key:e})=>null!=e?e:null,yr=({ref:e})=>null!=e?k(e)||Ze(e)||T(e)?{i:Rt,r:e}:e:null,_r=function(e,t=null,n=null,i=0,o=null,s=!1){e&&e!==nr||(e=sr);if(fr(e)){const r=br(e,t,!0);return n&&kr(r,n),r}c=e,T(c)&&"__vccOpts"in c&&(e=e.__vccOpts);var c;if(t){(Xe(t)||gr in t)&&(t=v({},t));let{class:e,style:n}=t;e&&!k(e)&&(t.class=a(e)),C(n)&&(Xe(n)&&!w(n)&&(n=v({},n)),t.style=r(n))}const l=k(e)?1:(e=>e.__isSuspense)(e)?128:(e=>e.__isTeleport)(e)?64:C(e)?4:T(e)?2:0,u={__v_isVNode:!0,__v_skip:!0,type:e,props:t,key:t&&vr(t),ref:t&&yr(t),scopeId:Pt,slotScopeIds:null,children:null,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetAnchor:null,staticCount:0,shapeFlag:l,patchFlag:i,dynamicProps:o,dynamicChildren:null,appContext:null};kr(u,n),128&l&&e.normalize(u);dr>0&&!s&&lr&&(i>0||6&l)&&32!==i&&lr.push(u);return u};function br(e,t,n=!1){const{props:r,ref:i,patchFlag:o,children:s}=e,a=t?Sr(r||{},t):r;return{__v_isVNode:!0,__v_skip:!0,type:e.type,props:a,key:a&&vr(a),ref:t&&t.ref?n&&i?w(i)?i.concat(yr(t)):[i,yr(t)]:yr(t):i,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:s,target:e.target,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==ir?-1===o?16:16|o:o,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:e.transition,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&br(e.ssContent),ssFallback:e.ssFallback&&br(e.ssFallback),el:e.el,anchor:e.anchor}}function wr(e=" ",t=0){return _r(or,null,e,t)}function Ir(e="",t=!1){return t?(ur(),pr(sr,null,e)):_r(sr,null,e)}function Er(e){return null==e||"boolean"==typeof e?_r(sr):w(e)?_r(ir,null,e.slice()):"object"==typeof e?Tr(e):_r(or,null,String(e))}function Tr(e){return null===e.el?e:br(e)}function kr(e,t){let n=0;const{shapeFlag:r}=e;if(null==t)t=null;else if(w(t))n=16;else if("object"==typeof t){if(1&r||64&r){const n=t.default;return void(n&&(n._c&&(n._d=!1),kr(e,n()),n._c&&(n._d=!0)))}{n=32;const r=t._;r||gr in t?3===r&&Rt&&(1===Rt.slots._?t._=1:(t._=2,e.patchFlag|=1024)):t._ctx=Rt}}else T(t)?(t={default:t,_ctx:Rt},n=32):(t=String(t),64&r?(n=16,t=[wr(t)]):n=8);e.children=t,e.shapeFlag|=n}function Sr(...e){const t=v({},e[0]);for(let n=1;n<e.length;n++){const i=e[n];for(const e in i)if("class"===e)t.class!==i.class&&(t.class=a([t.class,i.class]));else if("style"===e)t.style=r([t.style,i.style]);else if(m(e)){const n=t[e],r=i[e];n!==r&&(t[e]=n?[].concat(n,r):r)}else""!==e&&(t[e]=i[e])}return t}function Cr(e,t){let n;if(w(e)||k(e)){n=new Array(e.length);for(let r=0,i=e.length;r<i;r++)n[r]=t(e[r],r)}else if("number"==typeof e){n=new Array(e);for(let r=0;r<e;r++)n[r]=t(r+1,r)}else if(C(e))if(e[Symbol.iterator])n=Array.from(e,t);else{const r=Object.keys(e);n=new Array(r.length);for(let i=0,o=r.length;i<o;i++){const o=r[i];n[i]=t(e[o],o,i)}}else n=[];return n}function Or(e){const t={};for(const n in e)t[V(n)]=e[n];return t}const Ar=e=>e?Ur(e)?e.exposed?e.exposed:e.proxy:Ar(e.parent):null,Rr=v(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>Ar(e.parent),$root:e=>Ar(e.root),$emit:e=>e.emit,$options:e=>Tn(e),$forceUpdate:e=>()=>bt(e.update),$nextTick:e=>_t.bind(e.proxy),$watch:e=>Bt.bind(e)}),Pr={get({_:e},t){const{ctx:n,setupState:r,data:i,props:o,accessCache:s,type:a,appContext:c}=e;if("__v_skip"===t)return!0;let l;if("$"!==t[0]){const a=s[t];if(void 0!==a)switch(a){case 0:return r[t];case 1:return i[t];case 3:return n[t];case 2:return o[t]}else{if(r!==u&&b(r,t))return s[t]=0,r[t];if(i!==u&&b(i,t))return s[t]=1,i[t];if((l=e.propsOptions[0])&&b(l,t))return s[t]=2,o[t];if(n!==u&&b(n,t))return s[t]=3,n[t];bn&&(s[t]=4)}}const d=Rr[t];let h,p;return d?("$attrs"===t&&ie(e,0,t),d(e)):(h=a.__cssModules)&&(h=h[t])?h:n!==u&&b(n,t)?(s[t]=3,n[t]):(p=c.config.globalProperties,b(p,t)?p[t]:void 0)},set({_:e},t,n){const{data:r,setupState:i,ctx:o}=e;if(i!==u&&b(i,t))i[t]=n;else if(r!==u&&b(r,t))r[t]=n;else if(b(e.props,t))return!1;return("$"!==t[0]||!(t.slice(1)in e))&&(o[t]=n,!0)},has({_:{data:e,setupState:t,accessCache:n,ctx:r,appContext:i,propsOptions:o}},s){let a;return void 0!==n[s]||e!==u&&b(e,s)||t!==u&&b(t,s)||(a=o[0])&&b(a,s)||b(r,s)||b(Rr,s)||b(i.config.globalProperties,s)}},Nr=v({},Pr,{get(e,t){if(t!==Symbol.unscopables)return Pr.get(e,t,e)},has:(e,n)=>"_"!==n[0]&&!t(n)}),Lr=qn();let xr=0;let Mr=null;const Dr=()=>Mr||Rt,jr=e=>{Mr=e};function Ur(e){return 4&e.vnode.shapeFlag}let Fr=!1;function Vr(e,t,n){T(t)?e.render=t:C(t)&&(e.setupState=et(t)),$r(e)}function $r(e,t,n){const r=e.type;e.render||(e.render=r.render||h,e.render._rc&&(e.withProxy=new Proxy(e.ctx,Nr))),Mr=e,ne(),wn(e),re(),Mr=null}function Br(e,t=Mr){t&&(t.effects||(t.effects=[])).push(e)}function zr(e){return T(e)&&e.displayName||e.name}function Wr(e){const t=function(e){let t,n;return T(e)?(t=e,n=h):(t=e.get,n=e.set),new nt(t,n,T(e)||!e.set)}(e);return Br(t.effect),t}const Hr="3.1.1",qr="http://www.w3.org/2000/svg",Kr="undefined"!=typeof document?document:null;let Gr,Jr;const Xr={insert:(e,t,n)=>{t.insertBefore(e,n||null)},remove:e=>{const t=e.parentNode;t&&t.removeChild(e)},createElement:(e,t,n,r)=>{const i=t?Kr.createElementNS(qr,e):Kr.createElement(e,n?{is:n}:void 0);return"select"===e&&r&&null!=r.multiple&&i.setAttribute("multiple",r.multiple),i},createText:e=>Kr.createTextNode(e),createComment:e=>Kr.createComment(e),setText:(e,t)=>{e.nodeValue=t},setElementText:(e,t)=>{e.textContent=t},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>Kr.querySelector(e),setScopeId(e,t){e.setAttribute(t,"")},cloneNode(e){const t=e.cloneNode(!0);return"_value"in e&&(t._value=e._value),t},insertStaticContent(e,t,n,r){const i=r?Jr||(Jr=Kr.createElementNS(qr,"svg")):Gr||(Gr=Kr.createElement("div"));i.innerHTML=e;const o=i.firstChild;let s=o,a=s;for(;s;)a=s,Xr.insert(s,t,n),s=i.firstChild;return[o,a]}};const Yr=/\s*!important$/;function Zr(e,t,n){if(w(n))n.forEach((n=>Zr(e,t,n)));else if(t.startsWith("--"))e.setProperty(t,n);else{const r=function(e,t){const n=ei[t];if(n)return n;let r=D(t);if("filter"!==r&&r in e)return ei[t]=r;r=F(r);for(let i=0;i<Qr.length;i++){const n=Qr[i]+r;if(n in e)return ei[t]=n}return t}(e,t);Yr.test(n)?e.setProperty(U(r),n.replace(Yr,""),"important"):e[r]=n}}const Qr=["Webkit","Moz","ms"],ei={};const ti="http://www.w3.org/1999/xlink";let ni=Date.now,ri=!1;if("undefined"!=typeof window){ni()>document.createEvent("Event").timeStamp&&(ni=()=>performance.now());const e=navigator.userAgent.match(/firefox\/(\d+)/i);ri=!!(e&&Number(e[1])<=53)}let ii=0;const oi=Promise.resolve(),si=()=>{ii=0};function ai(e,t,n,r){e.addEventListener(t,n,r)}function ci(e,t,n,r,i=null){const o=e._vei||(e._vei={}),s=o[t];if(r&&s)s.value=r;else{const[n,a]=function(e){let t;if(li.test(e)){let n;for(t={};n=e.match(li);)e=e.slice(0,e.length-n[0].length),t[n[0].toLowerCase()]=!0}return[U(e.slice(2)),t]}(t);if(r){ai(e,n,o[t]=function(e,t){const n=e=>{const r=e.timeStamp||ni();(ri||r>=n.attached-1)&&it(function(e,t){if(w(t)){const n=e.stopImmediatePropagation;return e.stopImmediatePropagation=()=>{n.call(e),e._stopped=!0},t.map((e=>t=>!t._stopped&&e(t)))}return t}(e,n.value),t,5,[e])};return n.value=e,n.attached=(()=>ii||(oi.then(si),ii=ni()))(),n}(r,i),a)}else s&&(!function(e,t,n,r){e.removeEventListener(t,n,r)}(e,n,s,a),o[t]=void 0)}}const li=/(?:Once|Passive|Capture)$/;const ui=/^on[a-z]/;const di={name:String,type:String,css:{type:Boolean,default:!0},duration:[String,Number,Object],enterFromClass:String,enterActiveClass:String,enterToClass:String,appearFromClass:String,appearActiveClass:String,appearToClass:String,leaveFromClass:String,leaveActiveClass:String,leaveToClass:String},hi=v({},Kt.props,di),pi=(e,t=[])=>{w(e)?e.forEach((e=>e(...t))):e&&e(...t)},fi=e=>!!e&&(w(e)?e.some((e=>e.length>1)):e.length>1);function mi(e){const t={};for(const v in e)v in di||(t[v]=e[v]);if(!1===e.css)return t;const{name:n="v",type:r,duration:i,enterFromClass:o=`${n}-enter-from`,enterActiveClass:s=`${n}-enter-active`,enterToClass:a=`${n}-enter-to`,appearFromClass:c=o,appearActiveClass:l=s,appearToClass:u=a,leaveFromClass:d=`${n}-leave-from`,leaveActiveClass:h=`${n}-leave-active`,leaveToClass:p=`${n}-leave-to`}=e,f=function(e){if(null==e)return null;if(C(e))return[gi(e.enter),gi(e.leave)];{const t=gi(e);return[t,t]}}(i),m=f&&f[0],g=f&&f[1],{onBeforeEnter:y,onEnter:_,onEnterCancelled:b,onLeave:w,onLeaveCancelled:I,onBeforeAppear:E=y,onAppear:T=_,onAppearCancelled:k=b}=t,S=(e,t,n)=>{yi(e,t?u:a),yi(e,t?l:s),n&&n()},O=(e,t)=>{yi(e,p),yi(e,h),t&&t()},A=e=>(t,n)=>{const i=e?T:_,s=()=>S(t,e,n);pi(i,[t,s]),_i((()=>{yi(t,e?c:o),vi(t,e?u:a),fi(i)||wi(t,r,m,s)}))};return v(t,{onBeforeEnter(e){pi(y,[e]),vi(e,o),vi(e,s)},onBeforeAppear(e){pi(E,[e]),vi(e,c),vi(e,l)},onEnter:A(!1),onAppear:A(!0),onLeave(e,t){const n=()=>O(e,t);vi(e,d),ki(),vi(e,h),_i((()=>{yi(e,d),vi(e,p),fi(w)||wi(e,r,g,n)})),pi(w,[e,n])},onEnterCancelled(e){S(e,!1),pi(b,[e])},onAppearCancelled(e){S(e,!0),pi(k,[e])},onLeaveCancelled(e){O(e),pi(I,[e])}})}function gi(e){return W(e)}function vi(e,t){t.split(/\s+/).forEach((t=>t&&e.classList.add(t))),(e._vtc||(e._vtc=new Set)).add(t)}function yi(e,t){t.split(/\s+/).forEach((t=>t&&e.classList.remove(t)));const{_vtc:n}=e;n&&(n.delete(t),n.size||(e._vtc=void 0))}function _i(e){requestAnimationFrame((()=>{requestAnimationFrame(e)}))}let bi=0;function wi(e,t,n,r){const i=e._endId=++bi,o=()=>{i===e._endId&&r()};if(n)return setTimeout(o,n);const{type:s,timeout:a,propCount:c}=Ii(e,t);if(!s)return r();const l=s+"end";let u=0;const d=()=>{e.removeEventListener(l,h),o()},h=t=>{t.target===e&&++u>=c&&d()};setTimeout((()=>{u<c&&d()}),a+1),e.addEventListener(l,h)}function Ii(e,t){const n=window.getComputedStyle(e),r=e=>(n[e]||"").split(", "),i=r("transitionDelay"),o=r("transitionDuration"),s=Ei(i,o),a=r("animationDelay"),c=r("animationDuration"),l=Ei(a,c);let u=null,d=0,h=0;"transition"===t?s>0&&(u="transition",d=s,h=o.length):"animation"===t?l>0&&(u="animation",d=l,h=c.length):(d=Math.max(s,l),u=d>0?s>l?"transition":"animation":null,h=u?"transition"===u?o.length:c.length:0);return{type:u,timeout:d,propCount:h,hasTransform:"transition"===u&&/\b(transform|all)(,|$)/.test(n.transitionProperty)}}function Ei(e,t){for(;e.length<t.length;)e=e.concat(e);return Math.max(...t.map(((t,n)=>Ti(t)+Ti(e[n]))))}function Ti(e){return 1e3*Number(e.slice(0,-1).replace(",","."))}function ki(){return document.body.offsetHeight}const Si=new WeakMap,Ci=new WeakMap,Oi={name:"TransitionGroup",props:v({},hi,{tag:String,moveClass:String}),setup(e,{slots:t}){const n=Dr(),r=Ht();let i,o;return pn((()=>{if(!i.length)return;const t=e.moveClass||`${e.name||"v"}-move`;if(!function(e,t,n){const r=e.cloneNode();e._vtc&&e._vtc.forEach((e=>{e.split(/\s+/).forEach((e=>e&&r.classList.remove(e)))}));n.split(/\s+/).forEach((e=>e&&r.classList.add(e))),r.style.display="none";const i=1===t.nodeType?t:t.parentNode;i.appendChild(r);const{hasTransform:o}=Ii(r);return i.removeChild(r),o}(i[0].el,n.vnode.el,t))return;i.forEach(Ai),i.forEach(Ri);const r=i.filter(Pi);ki(),r.forEach((e=>{const n=e.el,r=n.style;vi(n,t),r.transform=r.webkitTransform=r.transitionDuration="";const i=n._moveCb=e=>{e&&e.target!==n||e&&!/transform$/.test(e.propertyName)||(n.removeEventListener("transitionend",i),n._moveCb=null,yi(n,t))};n.addEventListener("transitionend",i)}))})),()=>{const s=Ye(e),a=mi(s);let c=s.tag||ir;i=o,o=t.default?Qt(t.default()):[];for(let e=0;e<o.length;e++){const t=o[e];null!=t.key&&Zt(t,Jt(t,a,r,n))}if(i)for(let e=0;e<i.length;e++){const t=i[e];Zt(t,Jt(t,a,r,n)),Si.set(t,t.el.getBoundingClientRect())}return _r(c,null,o)}}};function Ai(e){const t=e.el;t._moveCb&&t._moveCb(),t._enterCb&&t._enterCb()}function Ri(e){Ci.set(e,e.el.getBoundingClientRect())}function Pi(e){const t=Si.get(e),n=Ci.get(e),r=t.left-n.left,i=t.top-n.top;if(r||i){const t=e.el.style;return t.transform=t.webkitTransform=`translate(${r}px,${i}px)`,t.transitionDuration="0s",e}}const Ni=e=>{const t=e.props["onUpdate:modelValue"];return w(t)?e=>B(t,e):t};function Li(e){e.target.composing=!0}function xi(e){const t=e.target;t.composing&&(t.composing=!1,function(e,t){const n=document.createEvent("HTMLEvents");n.initEvent(t,!0,!0),e.dispatchEvent(n)}(t,"input"))}const Mi={created(e,{modifiers:{lazy:t,trim:n,number:r}},i){e._assign=Ni(i);const o=r||"number"===e.type;ai(e,t?"change":"input",(t=>{if(t.target.composing)return;let r=e.value;n?r=r.trim():o&&(r=W(r)),e._assign(r)})),n&&ai(e,"change",(()=>{e.value=e.value.trim()})),t||(ai(e,"compositionstart",Li),ai(e,"compositionend",xi),ai(e,"change",xi))},mounted(e,{value:t}){e.value=null==t?"":t},beforeUpdate(e,{value:t,modifiers:{trim:n,number:r}},i){if(e._assign=Ni(i),e.composing)return;if(document.activeElement===e){if(n&&e.value.trim()===t)return;if((r||"number"===e.type)&&W(e.value)===t)return}const o=null==t?"":t;e.value!==o&&(e.value=o)}},Di=["ctrl","shift","alt","meta"],ji={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>"button"in e&&0!==e.button,middle:e=>"button"in e&&1!==e.button,right:e=>"button"in e&&2!==e.button,exact:(e,t)=>Di.some((n=>e[`${n}Key`]&&!t.includes(n)))},Ui=(e,t)=>(n,...r)=>{for(let e=0;e<t.length;e++){const r=ji[t[e]];if(r&&r(n,t))return}return e(n,...r)},Fi={beforeMount(e,{value:t},{transition:n}){e._vod="none"===e.style.display?"":e.style.display,n&&t?n.beforeEnter(e):Vi(e,t)},mounted(e,{value:t},{transition:n}){n&&t&&n.enter(e)},updated(e,{value:t,oldValue:n},{transition:r}){!t!=!n&&(r?t?(r.beforeEnter(e),Vi(e,!0),r.enter(e)):r.leave(e,(()=>{Vi(e,!1)})):Vi(e,t))},beforeUnmount(e,{value:t}){Vi(e,t)}};function Vi(e,t){e.style.display=t?e._vod:"none"}const $i=v({patchProp:(e,t,r,i,o=!1,s,a,c,l)=>{switch(t){case"class":!function(e,t,n){if(null==t&&(t=""),n)e.setAttribute("class",t);else{const n=e._vtc;n&&(t=(t?[t,...n]:[...n]).join(" ")),e.className=t}}(e,i,o);break;case"style":!function(e,t,n){const r=e.style;if(n)if(k(n)){if(t!==n){const t=r.display;r.cssText=n,"_vod"in e&&(r.display=t)}}else{for(const e in n)Zr(r,e,n[e]);if(t&&!k(t))for(const e in t)null==n[e]&&Zr(r,e,"")}else e.removeAttribute("style")}(e,r,i);break;default:m(t)?g(t)||ci(e,t,0,i,a):function(e,t,n,r){if(r)return"innerHTML"===t||!!(t in e&&ui.test(t)&&T(n));if("spellcheck"===t||"draggable"===t)return!1;if("form"===t)return!1;if("list"===t&&"INPUT"===e.tagName)return!1;if("type"===t&&"TEXTAREA"===e.tagName)return!1;if(ui.test(t)&&k(n))return!1;return t in e}(e,t,i,o)?function(e,t,n,r,i,o,s){if("innerHTML"===t||"textContent"===t)return r&&s(r,i,o),void(e[t]=null==n?"":n);if("value"===t&&"PROGRESS"!==e.tagName){e._value=n;const r=null==n?"":n;return e.value!==r&&(e.value=r),void(null==n&&e.removeAttribute(t))}if(""===n||null==n){const r=typeof e[t];if(""===n&&"boolean"===r)return void(e[t]=!0);if(null==n&&"string"===r)return e[t]="",void e.removeAttribute(t);if("number"===r)return e[t]=0,void e.removeAttribute(t)}try{e[t]=n}catch(a){}}(e,t,i,s,a,c,l):("true-value"===t?e._trueValue=i:"false-value"===t&&(e._falseValue=i),function(e,t,r,i,o){if(i&&t.startsWith("xlink:"))null==r?e.removeAttributeNS(ti,t.slice(6,t.length)):e.setAttributeNS(ti,t,r);else{const i=n(t);null==r||i&&!1===r?e.removeAttribute(t):e.setAttribute(t,i?"":r)}}(e,t,i,o))}},forcePatchProp:(e,t)=>"value"===t},Xr);let Bi;const zi=(...e)=>{const t=(Bi||(Bi=Zn($i))).createApp(...e),{mount:n}=t;return t.mount=e=>{const r=function(e){if(k(e)){return document.querySelector(e)}return e}
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */(e);if(!r)return;const i=t._component;T(i)||i.render||i.template||(i.template=r.innerHTML),r.innerHTML="";const o=n(r,!1,r instanceof SVGElement);return r instanceof Element&&(r.removeAttribute("v-cloak"),r.setAttribute("data-v-app","")),o},t};var Wi=function(e,t){return(Wi=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])})(e,t)};function Hi(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]])}return n}function qi(e,t,n,r){return new(n||(n=Promise))((function(i,o){function s(e){try{c(r.next(e))}catch(t){o(t)}}function a(e){try{c(r.throw(e))}catch(t){o(t)}}function c(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,a)}c((r=r.apply(e,t||[])).next())}))}function Ki(e,t){var n,r,i,o,s={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function a(o){return function(a){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;s;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return s.label++,{value:o[1],done:!1};case 5:s.label++,r=o[1],o=[0];continue;case 7:o=s.ops.pop(),s.trys.pop();continue;default:if(!(i=s.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){s=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){s.label=o[1];break}if(6===o[0]&&s.label<i[1]){s.label=i[1],i=o;break}if(i&&s.label<i[2]){s.label=i[2],s.ops.push(o);break}i[2]&&s.ops.pop(),s.trys.pop();continue}o=t.call(e,s)}catch(a){o=[6,a],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,a])}}}function Gi(e){var t="function"==typeof Symbol&&Symbol.iterator,n=t&&e[t],r=0;if(n)return n.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&r>=e.length&&(e=void 0),{value:e&&e[r++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")}function Ji(e,t){var n="function"==typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,i,o=n.call(e),s=[];try{for(;(void 0===t||t-- >0)&&!(r=o.next()).done;)s.push(r.value)}catch(a){i={error:a}}finally{try{r&&!r.done&&(n=o.return)&&n.call(o)}finally{if(i)throw i.error}}return s}function Xi(e,t,n){if(n||2===arguments.length)for(var r,i=0,o=t.length;i<o;i++)!r&&i in t||(r||(r=Array.prototype.slice.call(t,0,i)),r[i]=t[i]);return e.concat(r||Array.prototype.slice.call(t))}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Yi={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"==typeof atob,encodeByteArray:function(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();for(var n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[],i=0;i<e.length;i+=3){var o=e[i],s=i+1<e.length,a=s?e[i+1]:0,c=i+2<e.length,l=c?e[i+2]:0,u=o>>2,d=(3&o)<<4|a>>4,h=(15&a)<<2|l>>6,p=63&l;c||(p=64,s||(h=64)),r.push(n[u],n[d],n[h],n[p])}return r.join("")},encodeString:function(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(function(e){for(var t=[],n=0,r=0;r<e.length;r++){var i=e.charCodeAt(r);i<128?t[n++]=i:i<2048?(t[n++]=i>>6|192,t[n++]=63&i|128):55296==(64512&i)&&r+1<e.length&&56320==(64512&e.charCodeAt(r+1))?(i=65536+((1023&i)<<10)+(1023&e.charCodeAt(++r)),t[n++]=i>>18|240,t[n++]=i>>12&63|128,t[n++]=i>>6&63|128,t[n++]=63&i|128):(t[n++]=i>>12|224,t[n++]=i>>6&63|128,t[n++]=63&i|128)}return t}(e),t)},decodeString:function(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):function(e){for(var t=[],n=0,r=0;n<e.length;){var i=e[n++];if(i<128)t[r++]=String.fromCharCode(i);else if(i>191&&i<224){var o=e[n++];t[r++]=String.fromCharCode((31&i)<<6|63&o)}else if(i>239&&i<365){var s=((7&i)<<18|(63&(o=e[n++]))<<12|(63&(a=e[n++]))<<6|63&e[n++])-65536;t[r++]=String.fromCharCode(55296+(s>>10)),t[r++]=String.fromCharCode(56320+(1023&s))}else{o=e[n++];var a=e[n++];t[r++]=String.fromCharCode((15&i)<<12|(63&o)<<6|63&a)}}return t.join("")}(this.decodeStringToByteArray(e,t))},decodeStringToByteArray:function(e,t){this.init_();for(var n=t?this.charToByteMapWebSafe_:this.charToByteMap_,r=[],i=0;i<e.length;){var o=n[e.charAt(i++)],s=i<e.length?n[e.charAt(i)]:0,a=++i<e.length?n[e.charAt(i)]:64,c=++i<e.length?n[e.charAt(i)]:64;if(++i,null==o||null==s||null==a||null==c)throw Error();var l=o<<2|s>>4;if(r.push(l),64!==a){var u=s<<4&240|a>>2;if(r.push(u),64!==c){var d=a<<6&192|c;r.push(d)}}}return r},init_:function(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(var e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}},Zi=function(){function e(){var e=this;this.reject=function(){},this.resolve=function(){},this.promise=new Promise((function(t,n){e.resolve=t,e.reject=n}))}return e.prototype.wrapCallback=function(e){var t=this;return function(n,r){n?t.reject(n):t.resolve(r),"function"==typeof e&&(t.promise.catch((function(){})),1===e.length?e(n):e(n,r))}},e}();
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Qi(){return"undefined"!=typeof navigator&&"string"==typeof navigator.userAgent?navigator.userAgent:""}function eo(){var e="object"==typeof chrome?chrome.runtime:"object"==typeof browser?browser.runtime:void 0;return"object"==typeof e&&void 0!==e.id}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var to=function(e){function t(n,r,i){var o=e.call(this,r)||this;return o.code=n,o.customData=i,o.name="FirebaseError",Object.setPrototypeOf(o,t.prototype),Error.captureStackTrace&&Error.captureStackTrace(o,no.prototype.create),o}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function n(){this.constructor=e}Wi(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}(t,e),t}(Error),no=function(){function e(e,t,n){this.service=e,this.serviceName=t,this.errors=n}return e.prototype.create=function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];var r=t[0]||{},i=this.service+"/"+e,o=this.errors[e],s=o?ro(o,r):"Error",a=this.serviceName+": "+s+" ("+i+").",c=new to(i,a,r);return c},e}();function ro(e,t){return e.replace(io,(function(e,n){var r=t[n];return null!=r?String(r):"<"+n+"?>"}))}var io=/\{\$([^}]+)}/g;function oo(e,t){if(e===t)return!0;for(var n=Object.keys(e),r=Object.keys(t),i=0,o=n;i<o.length;i++){var s=o[i];if(!r.includes(s))return!1;var a=e[s],c=t[s];if(so(a)&&so(c)){if(!oo(a,c))return!1}else if(a!==c)return!1}for(var l=0,u=r;l<u.length;l++){s=u[l];if(!n.includes(s))return!1}return!0}function so(e){return null!==e&&"object"==typeof e}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ao(e){for(var t=[],n=function(e,n){Array.isArray(n)?n.forEach((function(n){t.push(encodeURIComponent(e)+"="+encodeURIComponent(n))})):t.push(encodeURIComponent(e)+"="+encodeURIComponent(n))},r=0,i=Object.entries(e);r<i.length;r++){var o=i[r];n(o[0],o[1])}return t.length?"&"+t.join("&"):""}function co(e){var t={};return e.replace(/^\?/,"").split("&").forEach((function(e){if(e){var n=e.split("="),r=n[0],i=n[1];t[decodeURIComponent(r)]=decodeURIComponent(i)}})),t}function lo(e){var t=e.indexOf("?");if(!t)return"";var n=e.indexOf("#",t);return e.substring(t,n>0?n:void 0)}var uo=function(){function e(e,t){var n=this;this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then((function(){e(n)})).catch((function(e){n.error(e)}))}return e.prototype.next=function(e){this.forEachObserver((function(t){t.next(e)}))},e.prototype.error=function(e){this.forEachObserver((function(t){t.error(e)})),this.close(e)},e.prototype.complete=function(){this.forEachObserver((function(e){e.complete()})),this.close()},e.prototype.subscribe=function(e,t,n){var r,i=this;if(void 0===e&&void 0===t&&void 0===n)throw new Error("Missing Observer.");void 0===(r=function(e,t){if("object"!=typeof e||null===e)return!1;for(var n=0,r=t;n<r.length;n++){var i=r[n];if(i in e&&"function"==typeof e[i])return!0}return!1}(e,["next","error","complete"])?e:{next:e,error:t,complete:n}).next&&(r.next=ho),void 0===r.error&&(r.error=ho),void 0===r.complete&&(r.complete=ho);var o=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then((function(){try{i.finalError?r.error(i.finalError):r.complete()}catch(e){}})),this.observers.push(r),o},e.prototype.unsubscribeOne=function(e){void 0!==this.observers&&void 0!==this.observers[e]&&(delete this.observers[e],this.observerCount-=1,0===this.observerCount&&void 0!==this.onNoObservers&&this.onNoObservers(this))},e.prototype.forEachObserver=function(e){if(!this.finalized)for(var t=0;t<this.observers.length;t++)this.sendOne(t,e)},e.prototype.sendOne=function(e,t){var n=this;this.task.then((function(){if(void 0!==n.observers&&void 0!==n.observers[e])try{t(n.observers[e])}catch(r){"undefined"!=typeof console&&console.error&&console.error(r)}}))},e.prototype.close=function(e){var t=this;this.finalized||(this.finalized=!0,void 0!==e&&(this.finalError=e),this.task.then((function(){t.observers=void 0,t.onNoObservers=void 0})))},e}();function ho(){}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function po(e,t,n){void 0===t&&(t=1e3),void 0===n&&(n=2);var r=t*Math.pow(n,e),i=Math.round(.5*r*(Math.random()-.5)*2);return Math.min(144e5,r+i)}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fo(e){return e&&e._delegate?e._delegate:e}var mo=function(){function e(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}return e.prototype.setInstantiationMode=function(e){return this.instantiationMode=e,this},e.prototype.setMultipleInstances=function(e){return this.multipleInstances=e,this},e.prototype.setServiceProps=function(e){return this.serviceProps=e,this},e.prototype.setInstanceCreatedCallback=function(e){return this.onInstanceCreated=e,this},e}(),go=function(){function e(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}return e.prototype.get=function(e){var t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){var n=new Zi;if(this.instancesDeferred.set(t,n),this.isInitialized(t)||this.shouldAutoInitialize())try{var r=this.getOrInitializeService({instanceIdentifier:t});r&&n.resolve(r)}catch(i){}}return this.instancesDeferred.get(t).promise},e.prototype.getImmediate=function(e){var t,n=this.normalizeInstanceIdentifier(null==e?void 0:e.identifier),r=null!==(t=null==e?void 0:e.optional)&&void 0!==t&&t;if(!this.isInitialized(n)&&!this.shouldAutoInitialize()){if(r)return null;throw Error("Service "+this.name+" is not available")}try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}},e.prototype.getComponent=function(){return this.component},e.prototype.setComponent=function(e){var t,n;if(e.name!==this.name)throw Error("Mismatching Component "+e.name+" for Provider "+this.name+".");if(this.component)throw Error("Component for "+this.name+" has already been provided");if(this.component=e,this.shouldAutoInitialize()){if(function(e){return"EAGER"===e.instantiationMode}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e))try{this.getOrInitializeService({instanceIdentifier:"[DEFAULT]"})}catch(u){}try{for(var r=Gi(this.instancesDeferred.entries()),i=r.next();!i.done;i=r.next()){var o=Ji(i.value,2),s=o[0],a=o[1],c=this.normalizeInstanceIdentifier(s);try{var l=this.getOrInitializeService({instanceIdentifier:c});a.resolve(l)}catch(u){}}}catch(d){t={error:d}}finally{try{i&&!i.done&&(n=r.return)&&n.call(r)}finally{if(t)throw t.error}}}},e.prototype.clearInstance=function(e){void 0===e&&(e="[DEFAULT]"),this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)},e.prototype.delete=function(){return qi(this,void 0,void 0,(function(){var e;return Ki(this,(function(t){switch(t.label){case 0:return e=Array.from(this.instances.values()),[4,Promise.all(Xi(Xi([],Ji(e.filter((function(e){return"INTERNAL"in e})).map((function(e){return e.INTERNAL.delete()})))),Ji(e.filter((function(e){return"_delete"in e})).map((function(e){return e._delete()})))))];case 1:return t.sent(),[2]}}))}))},e.prototype.isComponentSet=function(){return null!=this.component},e.prototype.isInitialized=function(e){return void 0===e&&(e="[DEFAULT]"),this.instances.has(e)},e.prototype.getOptions=function(e){return void 0===e&&(e="[DEFAULT]"),this.instancesOptions.get(e)||{}},e.prototype.initialize=function(e){var t,n;void 0===e&&(e={});var r=e.options,i=void 0===r?{}:r,o=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(o))throw Error(this.name+"("+o+") has already been initialized");if(!this.isComponentSet())throw Error("Component "+this.name+" has not been registered yet");var s=this.getOrInitializeService({instanceIdentifier:o,options:i});try{for(var a=Gi(this.instancesDeferred.entries()),c=a.next();!c.done;c=a.next()){var l=Ji(c.value,2),u=l[0],d=l[1];o===this.normalizeInstanceIdentifier(u)&&d.resolve(s)}}catch(h){t={error:h}}finally{try{c&&!c.done&&(n=a.return)&&n.call(a)}finally{if(t)throw t.error}}return s},e.prototype.onInit=function(e,t){var n,r=this.normalizeInstanceIdentifier(t),i=null!==(n=this.onInitCallbacks.get(r))&&void 0!==n?n:new Set;i.add(e),this.onInitCallbacks.set(r,i);var o=this.instances.get(r);return o&&e(o,r),function(){i.delete(e)}},e.prototype.invokeOnInitCallbacks=function(e,t){var n,r,i=this.onInitCallbacks.get(t);if(i)try{for(var o=Gi(i),s=o.next();!s.done;s=o.next()){var a=s.value;try{a(e,t)}catch(c){}}}catch(l){n={error:l}}finally{try{s&&!s.done&&(r=o.return)&&r.call(o)}finally{if(n)throw n.error}}},e.prototype.getOrInitializeService=function(e){var t,n=e.instanceIdentifier,r=e.options,i=void 0===r?{}:r,o=this.instances.get(n);if(!o&&this.component&&(o=this.component.instanceFactory(this.container,{instanceIdentifier:(t=n,"[DEFAULT]"===t?void 0:t),options:i}),this.instances.set(n,o),this.instancesOptions.set(n,i),this.invokeOnInitCallbacks(o,n),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,n,o)}catch(s){}return o||null},e.prototype.normalizeInstanceIdentifier=function(e){return void 0===e&&(e="[DEFAULT]"),this.component?this.component.multipleInstances?e:"[DEFAULT]":e},e.prototype.shouldAutoInitialize=function(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode},e}();
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var vo,yo,_o,bo=function(){function e(e){this.name=e,this.providers=new Map}return e.prototype.addComponent=function(e){var t=this.getProvider(e.name);if(t.isComponentSet())throw new Error("Component "+e.name+" has already been registered with "+this.name);t.setComponent(e)},e.prototype.addOrOverwriteComponent=function(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)},e.prototype.getProvider=function(e){if(this.providers.has(e))return this.providers.get(e);var t=new go(e,this);return this.providers.set(e,t),t},e.prototype.getProviders=function(){return Array.from(this.providers.values())},e}();
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */function wo(){for(var e=0,t=0,n=arguments.length;t<n;t++)e+=arguments[t].length;var r=Array(e),i=0;for(t=0;t<n;t++)for(var o=arguments[t],s=0,a=o.length;s<a;s++,i++)r[i]=o[s];return r}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(_o=yo||(yo={}))[_o.DEBUG=0]="DEBUG",_o[_o.VERBOSE=1]="VERBOSE",_o[_o.INFO=2]="INFO",_o[_o.WARN=3]="WARN",_o[_o.ERROR=4]="ERROR",_o[_o.SILENT=5]="SILENT";var Io={debug:yo.DEBUG,verbose:yo.VERBOSE,info:yo.INFO,warn:yo.WARN,error:yo.ERROR,silent:yo.SILENT},Eo=yo.INFO,To=((vo={})[yo.DEBUG]="log",vo[yo.VERBOSE]="log",vo[yo.INFO]="info",vo[yo.WARN]="warn",vo[yo.ERROR]="error",vo),ko=function(e,t){for(var n=[],r=2;r<arguments.length;r++)n[r-2]=arguments[r];if(!(t<e.logLevel)){var i=(new Date).toISOString(),o=To[t];if(!o)throw new Error("Attempted to log a message with an invalid logType (value: "+t+")");console[o].apply(console,wo(["["+i+"]  "+e.name+":"],n))}},So=function(){function e(e){this.name=e,this._logLevel=Eo,this._logHandler=ko,this._userLogHandler=null}return Object.defineProperty(e.prototype,"logLevel",{get:function(){return this._logLevel},set:function(e){if(!(e in yo))throw new TypeError('Invalid value "'+e+'" assigned to `logLevel`');this._logLevel=e},enumerable:!1,configurable:!0}),e.prototype.setLogLevel=function(e){this._logLevel="string"==typeof e?Io[e]:e},Object.defineProperty(e.prototype,"logHandler",{get:function(){return this._logHandler},set:function(e){if("function"!=typeof e)throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"userLogHandler",{get:function(){return this._userLogHandler},set:function(e){this._userLogHandler=e},enumerable:!1,configurable:!0}),e.prototype.debug=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._userLogHandler&&this._userLogHandler.apply(this,wo([this,yo.DEBUG],e)),this._logHandler.apply(this,wo([this,yo.DEBUG],e))},e.prototype.log=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._userLogHandler&&this._userLogHandler.apply(this,wo([this,yo.VERBOSE],e)),this._logHandler.apply(this,wo([this,yo.VERBOSE],e))},e.prototype.info=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._userLogHandler&&this._userLogHandler.apply(this,wo([this,yo.INFO],e)),this._logHandler.apply(this,wo([this,yo.INFO],e))},e.prototype.warn=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._userLogHandler&&this._userLogHandler.apply(this,wo([this,yo.WARN],e)),this._logHandler.apply(this,wo([this,yo.WARN],e))},e.prototype.error=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._userLogHandler&&this._userLogHandler.apply(this,wo([this,yo.ERROR],e)),this._logHandler.apply(this,wo([this,yo.ERROR],e))},e}();
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Co{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map((e=>{if(function(e){const t=e.getComponent();return"VERSION"===(null==t?void 0:t.type)}(e)){const t=e.getImmediate();return`${t.library}/${t.version}`}return null})).filter((e=>e)).join(" ")}}const Oo=new So("@firebase/app"),Ao={"@firebase/app":"fire-core","@firebase/app-compat":"fire-core-compat","@firebase/analytics":"fire-analytics","@firebase/analytics-compat":"fire-analytics-compat","@firebase/app-check":"fire-app-check","@firebase/app-check-compat":"fire-app-check-compat","@firebase/auth":"fire-auth","@firebase/auth-compat":"fire-auth-compat","@firebase/database":"fire-rtdb","@firebase/database-compat":"fire-rtdb-compat","@firebase/functions":"fire-fn","@firebase/functions-compat":"fire-fn-compat","@firebase/installations":"fire-iid","@firebase/installations-compat":"fire-iid-compat","@firebase/messaging":"fire-fcm","@firebase/messaging-compat":"fire-fcm-compat","@firebase/performance":"fire-perf","@firebase/performance-compat":"fire-perf-compat","@firebase/remote-config":"fire-rc","@firebase/remote-config-compat":"fire-rc-compat","@firebase/storage":"fire-gcs","@firebase/storage-compat":"fire-gcs-compat","@firebase/firestore":"fire-fst","@firebase/firestore-compat":"fire-fst-compat","fire-js":"fire-js",firebase:"fire-js-all"},Ro=new Map,Po=new Map;function No(e,t){try{e.container.addComponent(t)}catch(n){Oo.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function Lo(e){const t=e.name;if(Po.has(t))return Oo.debug(`There were multiple attempts to register component ${t}.`),!1;Po.set(t,e);for(const n of Ro.values())No(n,e);return!0}function xo(e,t){return e.container.getProvider(t)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mo=new no("app","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()","bad-app-name":"Illegal App name: '{$appName}","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function."});
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Do{constructor(e,t,n){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new mo("app",(()=>this),"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Mo.create("app-deleted",{appName:this._name})}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jo(e,t={}){if("object"!=typeof t){t={name:t}}const n=Object.assign({name:"[DEFAULT]",automaticDataCollectionEnabled:!1},t),r=n.name;if("string"!=typeof r||!r)throw Mo.create("bad-app-name",{appName:String(r)});const i=Ro.get(r);if(i){if(oo(e,i.options)&&oo(n,i.config))return i;throw Mo.create("duplicate-app",{appName:r})}const o=new bo(r);for(const a of Po.values())o.addComponent(a);const s=new Do(e,n,o);return Ro.set(r,s),s}function Uo(e="[DEFAULT]"){const t=Ro.get(e);if(!t)throw Mo.create("no-app",{appName:e});return t}function Fo(e,t,n){var r;let i=null!==(r=Ao[e])&&void 0!==r?r:e;n&&(i+=`-${n}`);const o=i.match(/\s|\//),s=t.match(/\s|\//);if(o||s){const e=[`Unable to register library "${i}" with version "${t}":`];return o&&e.push(`library name "${i}" contains illegal characters (whitespace or "/")`),o&&s&&e.push("and"),s&&e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),void Oo.warn(e.join(" "))}Lo(new mo(`${i}-version`,(()=>({library:i,version:t})),"VERSION"))}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Vo;Lo(new mo("platform-logger",(e=>new Co(e)),"PRIVATE")),Fo("@firebase/app","0.7.0",Vo),Fo("fire-js","");const $o=new no("auth","Firebase",{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}),Bo=new So("@firebase/auth");
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zo(e,...t){Bo.logLevel<=yo.ERROR&&Bo.error(`Auth (9.0.0): ${e}`,...t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wo(e,...t){throw qo(e,...t)}function Ho(e,...t){return qo(e,...t)}function qo(e,...t){if("string"!=typeof e){const n=t[0],r=[...t.slice(1)];return r[0]&&(r[0].appName=e.name),e._errorFactory.create(n,...r)}return $o.create(e,...t)}function Ko(e,t,...n){if(!e)throw qo(t,...n)}function Go(e){const t="INTERNAL ASSERTION FAILED: "+e;throw zo(t),new Error(t)}function Jo(e,t){e||Go(t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xo=new Map;function Yo(e){Jo(e instanceof Function,"Expected a class definition");let t=Xo.get(e);return t?(Jo(t instanceof e,"Instance stored in cache mismatched with class"),t):(t=new e,Xo.set(e,t),t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Zo(){var e;return"undefined"!=typeof self&&(null===(e=self.location)||void 0===e?void 0:e.href)||""}function Qo(){var e;return"undefined"!=typeof self&&(null===(e=self.location)||void 0===e?void 0:e.protocol)||null}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function es(){return"undefined"==typeof navigator||!navigator||!("onLine"in navigator)||"boolean"!=typeof navigator.onLine||"http:"!==Qo()&&"https:"!==Qo()&&!eo()&&!("connection"in navigator)||navigator.onLine}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ts{constructor(e,t){this.shortDelay=e,this.longDelay=t,Jo(t>e,"Short delay should be less than long delay!"),this.isMobile="undefined"!=typeof window&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Qi())||"object"==typeof navigator&&"ReactNative"===navigator.product}get(){return es()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ns(e,t){Jo(e.emulator,"Emulator should always be set here");const{url:n}=e.emulator;return t?`${n}${t.startsWith("/")?t.slice(1):t}`:n}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rs{static initialize(e,t,n){this.fetchImpl=e,t&&(this.headersImpl=t),n&&(this.responseImpl=n)}static fetch(){return this.fetchImpl?this.fetchImpl:"undefined"!=typeof self&&"fetch"in self?self.fetch:void Go("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){return this.headersImpl?this.headersImpl:"undefined"!=typeof self&&"Headers"in self?self.Headers:void Go("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){return this.responseImpl?this.responseImpl:"undefined"!=typeof self&&"Response"in self?self.Response:void Go("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const is={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"internal-error",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded"},os=new ts(3e4,6e4);
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ss(e,t){return e.tenantId&&!t.tenantId?Object.assign(Object.assign({},t),{tenantId:e.tenantId}):t}async function as(e,t,n,r,i={}){return cs(e,i,(()=>{let i={},o={};r&&("GET"===t?o=r:i={body:JSON.stringify(r)});const s=ao(Object.assign({key:e.config.apiKey},o)).slice(1),a=new(rs.headers());return a.set("Content-Type","application/json"),a.set("X-Client-Version",e._getSdkClientVersion()),e.languageCode&&a.set("X-Firebase-Locale",e.languageCode),rs.fetch()(us(e,e.config.apiHost,n,s),Object.assign({method:t,headers:a,referrerPolicy:"no-referrer"},i))}))}async function cs(e,t,n){e._canInitEmulator=!1;const r=Object.assign(Object.assign({},is),t);try{const t=new ds(e),i=await Promise.race([n(),t.promise]);t.clearNetworkTimeout();const o=await i.json();if("needConfirmation"in o)throw hs(e,"account-exists-with-different-credential",o);if(i.ok&&!("errorMessage"in o))return o;{const t=(i.ok?o.errorMessage:o.error.message).split(" : ")[0];if("FEDERATED_USER_ID_ALREADY_LINKED"===t)throw hs(e,"credential-already-in-use",o);if("EMAIL_EXISTS"===t)throw hs(e,"email-already-in-use",o);Wo(e,r[t]||t.toLowerCase().replace(/[_\s]+/g,"-"))}}catch(i){if(i instanceof to)throw i;Wo(e,"network-request-failed")}}async function ls(e,t,n,r,i={}){const o=await as(e,t,n,r,i);return"mfaPendingCredential"in o&&Wo(e,"multi-factor-auth-required",{serverResponse:o}),o}function us(e,t,n,r){const i=`${t}${n}?${r}`;return e.config.emulator?ns(e.config,i):`${e.config.apiScheme}://${i}`}class ds{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise(((e,t)=>{this.timer=setTimeout((()=>t(Ho(this.auth,"timeout"))),os.get())}))}clearNetworkTimeout(){clearTimeout(this.timer)}}function hs(e,t,n){const r={appName:e.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=Ho(e,t,r);return i.customData._tokenResponse=n,i}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function ps(e){if(e)try{const t=new Date(Number(e));if(!isNaN(t.getTime()))return t.toUTCString()}catch(t){}}function fs(e){return 1e3*Number(e)}function ms(e){const[t,n,r]=e.split(".");if(void 0===t||void 0===n||void 0===r)return zo("JWT malformed, contained fewer than 3 sections"),null;try{const e=function(e){try{return Yi.decodeString(e,!0)}catch(t){console.error("base64Decode failed: ",t)}return null}(n);return e?JSON.parse(e):(zo("Failed to decode base64 JWT payload"),null)}catch(i){return zo("Caught error parsing JWT payload as JSON",i),null}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function gs(e,t,n=!1){if(n)return t;try{return await t}catch(r){throw r instanceof to&&function({code:e}){return"auth/user-disabled"===e||"auth/user-token-expired"===e}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(r)&&e.auth.currentUser===e&&await e.auth.signOut(),r}}class vs{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,null!==this.timerId&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const e=this.errorBackoff;return this.errorBackoff=Math.min(2*this.errorBackoff,96e4),e}{this.errorBackoff=3e4;const e=(null!==(t=this.user.stsTokenManager.expirationTime)&&void 0!==t?t:0)-Date.now()-3e5;return Math.max(0,e)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout((async()=>{await this.iteration()}),t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){return void("auth/network-request-failed"===e.code&&this.schedule(!0))}this.schedule()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ys{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=ps(this.lastLoginAt),this.creationTime=ps(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _s(e){var t;const n=e.auth,r=await e.getIdToken(),i=await gs(e,async function(e,t){return as(e,"POST","/v1/accounts:lookup",t)}(n,{idToken:r}));Ko(null==i?void 0:i.users.length,n,"internal-error");const o=i.users[0];e._notifyReloadListener(o);const s=(null===(t=o.providerUserInfo)||void 0===t?void 0:t.length)?o.providerUserInfo.map((e=>{var{providerId:t}=e,n=Hi(e,["providerId"]);return{providerId:t,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}})):[];const a=(c=e.providerData,l=s,[...c.filter((e=>!l.some((t=>t.providerId===e.providerId)))),...l]);var c,l;const u=e.isAnonymous,d=!(e.email&&o.passwordHash||(null==a?void 0:a.length)),h=!!u&&d,p={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:a,metadata:new ys(o.createdAt,o.lastLoginAt),isAnonymous:h};Object.assign(e,p)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class bs{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){Ko(e.idToken,"internal-error"),Ko(void 0!==e.idToken,"internal-error"),Ko(void 0!==e.refreshToken,"internal-error");const t="expiresIn"in e&&void 0!==e.expiresIn?Number(e.expiresIn):function(e){const t=ms(e);return Ko(t,"internal-error"),Ko(void 0!==t.exp,"internal-error"),Ko(void 0!==t.iat,"internal-error"),Number(t.exp)-Number(t.iat)}(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}async getToken(e,t=!1){return Ko(!this.accessToken||this.refreshToken,e,"user-token-expired"),t||!this.accessToken||this.isExpired?this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null:this.accessToken}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:n,refreshToken:r,expiresIn:i}=await
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function(e,t){const n=await cs(e,{},(()=>{const n=ao({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:r,apiKey:i}=e.config,o=us(e,r,"/v1/token",`key=${i}`);return rs.fetch()(o,{method:"POST",headers:{"X-Client-Version":e._getSdkClientVersion(),"Content-Type":"application/x-www-form-urlencoded"},body:n})}));return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}(e,t);this.updateTokensAndExpiration(n,r,Number(i))}updateTokensAndExpiration(e,t,n){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+1e3*n}static fromJSON(e,t){const{refreshToken:n,accessToken:r,expirationTime:i}=t,o=new bs;return n&&(Ko("string"==typeof n,"internal-error",{appName:e}),o.refreshToken=n),r&&(Ko("string"==typeof r,"internal-error",{appName:e}),o.accessToken=r),i&&(Ko("number"==typeof i,"internal-error",{appName:e}),o.expirationTime=i),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new bs,this.toJSON())}_performRefresh(){return Go("not implemented")}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ws(e,t){Ko("string"==typeof e||void 0===e,"internal-error",{appName:t})}class Is{constructor(e){var{uid:t,auth:n,stsTokenManager:r}=e,i=Hi(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.emailVerified=!1,this.isAnonymous=!1,this.tenantId=null,this.providerData=[],this.proactiveRefresh=new vs(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.metadata=new ys(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const t=await gs(this,this.stsTokenManager.getToken(this.auth,e));return Ko(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return async function(e,t=!1){const n=fo(e),r=await n.getIdToken(t),i=ms(r);Ko(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const o="object"==typeof i.firebase?i.firebase:void 0,s=null==o?void 0:o.sign_in_provider;return{claims:i,token:r,authTime:ps(fs(i.auth_time)),issuedAtTime:ps(fs(i.iat)),expirationTime:ps(fs(i.exp)),signInProvider:s||null,signInSecondFactor:(null==o?void 0:o.sign_in_second_factor)||null}}(this,e)}reload(){return async function(e){const t=fo(e);await _s(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}(this)}_assign(e){this!==e&&(Ko(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map((e=>Object.assign({},e))),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){return new Is(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}))}_onReload(e){Ko(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),t&&await _s(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){const e=await this.getIdToken();return await gs(this,async function(e,t){return as(e,"POST","/v1/accounts:delete",t)}(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map((e=>Object.assign({},e))),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var n,r,i,o,s,a,c,l;const u=null!==(n=t.displayName)&&void 0!==n?n:void 0,d=null!==(r=t.email)&&void 0!==r?r:void 0,h=null!==(i=t.phoneNumber)&&void 0!==i?i:void 0,p=null!==(o=t.photoURL)&&void 0!==o?o:void 0,f=null!==(s=t.tenantId)&&void 0!==s?s:void 0,m=null!==(a=t._redirectEventId)&&void 0!==a?a:void 0,g=null!==(c=t.createdAt)&&void 0!==c?c:void 0,v=null!==(l=t.lastLoginAt)&&void 0!==l?l:void 0,{uid:y,emailVerified:_,isAnonymous:b,providerData:w,stsTokenManager:I}=t;Ko(y&&I,e,"internal-error");const E=bs.fromJSON(this.name,I);Ko("string"==typeof y,e,"internal-error"),ws(u,e.name),ws(d,e.name),Ko("boolean"==typeof _,e,"internal-error"),Ko("boolean"==typeof b,e,"internal-error"),ws(h,e.name),ws(p,e.name),ws(f,e.name),ws(m,e.name),ws(g,e.name),ws(v,e.name);const T=new Is({uid:y,auth:e,email:d,emailVerified:_,displayName:u,isAnonymous:b,photoURL:p,phoneNumber:h,tenantId:f,stsTokenManager:E,createdAt:g,lastLoginAt:v});return w&&Array.isArray(w)&&(T.providerData=w.map((e=>Object.assign({},e)))),m&&(T._redirectEventId=m),T}static async _fromIdTokenResponse(e,t,n=!1){const r=new bs;r.updateFromServerResponse(t);const i=new Is({uid:t.localId,auth:e,stsTokenManager:r,isAnonymous:n});return await _s(i),i}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Es{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return void 0===t?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Es.type="NONE";const Ts=Es;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ks(e,t,n){return`firebase:${e}:${t}:${n}`}class Ss{constructor(e,t,n){this.persistence=e,this.auth=t,this.userKey=n;const{config:r,name:i}=this.auth;this.fullUserKey=ks(this.userKey,r.apiKey,i),this.fullPersistenceKey=ks("persistence",r.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Is._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();return await this.removeCurrentUser(),this.persistence=e,t?this.setCurrentUser(t):void 0}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,n="authUser"){if(!t.length)return new Ss(Yo(Ts),e,n);const r=(await Promise.all(t.map((async e=>{if(await e._isAvailable())return e})))).filter((e=>e));let i=r[0]||Yo(Ts);const o=ks(n,e.config.apiKey,e.name);let s=null;for(const l of t)try{const t=await l._get(o);if(t){const n=Is._fromJSON(e,t);l!==i&&(s=n),i=l;break}}catch(c){}const a=r.filter((e=>e._shouldAllowMigration));return i._shouldAllowMigration&&a.length?(i=a[0],s&&await i._set(o,s.toJSON()),await Promise.all(t.map((async e=>{if(e!==i)try{await e._remove(o)}catch(c){}}))),new Ss(i,e,n)):new Ss(i,e,n)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cs(e){const t=e.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if(Ps(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";if(t.includes("edge/"))return"Edge";if(Os(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(Ls(t))return"Blackberry";if(xs(t))return"Webos";if(As(t))return"Safari";if((t.includes("chrome/")||Rs(t))&&!t.includes("edge/"))return"Chrome";if(Ns(t))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=e.match(t);if(2===(null==n?void 0:n.length))return n[1]}return"Other"}function Os(e=Qi()){return/firefox\//i.test(e)}function As(e=Qi()){const t=e.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function Rs(e=Qi()){return/crios\//i.test(e)}function Ps(e=Qi()){return/iemobile/i.test(e)}function Ns(e=Qi()){return/android/i.test(e)}function Ls(e=Qi()){return/blackberry/i.test(e)}function xs(e=Qi()){return/webos/i.test(e)}function Ms(e=Qi()){return/iphone|ipad|ipod/i.test(e)}function Ds(){return((e=Qi()).indexOf("MSIE ")>=0||e.indexOf("Trident/")>=0)&&10===document.documentMode;var e}function js(e=Qi()){return Ms(e)||Ns(e)||xs(e)||Ls(e)||/windows phone/i.test(e)||Ps(e)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Us(e,t=[]){let n;switch(e){case"Browser":n=Cs(Qi());break;case"Worker":n=`${Cs(Qi())}-${e}`;break;default:n=e}return`${n}/JsCore/9.0.0/${t.length?t.join(","):"FirebaseCore-web"}`}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fs{constructor(e,t){this.app=e,this.config=t,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new $s(this),this.idTokenSubscription=new $s(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=$o,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=t.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Yo(t)),this._initializationPromise=this.queue((async()=>{var n;this._deleted||(this.persistenceManager=await Ss.create(this,e),this._deleted||((null===(n=this._popupRedirectResolver)||void 0===n?void 0:n._shouldInitProactively)&&await this._popupRedirectResolver._initialize(this),await this.initializeCurrentUser(t),this._deleted||(this._isInitialized=!0)))})),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();return this.currentUser||e?this.currentUser&&e&&this.currentUser.uid===e.uid?(this._currentUser._assign(e),void(await this.currentUser.getIdToken())):void(await this._updateCurrentUser(e)):void 0}async initializeCurrentUser(e){var t;let n=await this.assertedPersistence.getCurrentUser();if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const r=null===(t=this.redirectUser)||void 0===t?void 0:t._redirectEventId,i=null==n?void 0:n._redirectEventId,o=await this.tryRedirectSignIn(e);r&&r!==i||!(null==o?void 0:o.user)||(n=o.user)}return n?n._redirectEventId?(Ko(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===n._redirectEventId?this.directlySetCurrentUser(n):this.reloadAndSetCurrentUserOrClear(n)):this.reloadAndSetCurrentUserOrClear(n):this.directlySetCurrentUser(null)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch(n){await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await _s(e)}catch(t){if("auth/network-request-failed"!==t.code)return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=function(){if("undefined"==typeof navigator)return null;const e=navigator;return e.languages&&e.languages[0]||e.language||null}()}async _delete(){this._deleted=!0}async updateCurrentUser(e){const t=e?fo(e):null;return t&&Ko(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e){if(!this._deleted)return e&&Ko(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),this.queue((async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()}))}async signOut(){return(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null)}setPersistence(e){return this.queue((async()=>{await this.assertedPersistence.setPersistence(Yo(e))}))}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new no("auth","Firebase",e())}onAuthStateChanged(e,t,n){return this.registerStateListener(this.authStateSubscription,e,t,n)}onIdTokenChanged(e,t,n){return this.registerStateListener(this.idTokenSubscription,e,t,n)}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:null===(e=this._currentUser)||void 0===e?void 0:e.toJSON()}}async _setRedirectUser(e,t){const n=await this.getOrInitRedirectPersistenceManager(t);return null===e?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Yo(e)||this._popupRedirectResolver;Ko(t,this,"argument-error"),this.redirectPersistenceManager=await Ss.create(this,[Yo(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,n;return this._isInitialized&&await this.queue((async()=>{})),(null===(t=this._currentUser)||void 0===t?void 0:t._redirectEventId)===e?this._currentUser:(null===(n=this.redirectUser)||void 0===n?void 0:n._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue((async()=>this.directlySetCurrentUser(e)))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const n=null!==(t=null===(e=this.currentUser)||void 0===e?void 0:e.uid)&&void 0!==t?t:null;this.lastNotifiedUid!==n&&(this.lastNotifiedUid=n,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,n,r){if(this._deleted)return()=>{};const i="function"==typeof t?t:t.next.bind(t),o=this._isInitialized?Promise.resolve():this._initializationPromise;return Ko(o,this,"internal-error"),o.then((()=>i(this.currentUser))),"function"==typeof t?e.addObserver(t,n,r):e.addObserver(t)}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&(this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh()),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return Ko(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){e&&!this.frameworks.includes(e)&&(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Us(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}_getSdkClientVersion(){return this.clientVersion}}function Vs(e){return fo(e)}class $s{constructor(e){var t,n;this.auth=e,this.observer=null,this.addObserver=(n=new uo((e=>this.observer=e),t)).subscribe.bind(n)}get next(){return Ko(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bs{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Go("not implemented")}_getIdTokenResponse(e){return Go("not implemented")}_linkToIdToken(e,t){return Go("not implemented")}_getReauthenticationResolver(e){return Go("not implemented")}}async function zs(e,t){return async function(e,t){return as(e,"POST","/v1/accounts:sendOobCode",ss(e,t))}(e,t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ws extends Bs{constructor(e,t,n,r=null){super("password",n),this._email=e,this._password=t,this._tenantId=r}static _fromEmailAndPassword(e,t){return new Ws(e,t,"password")}static _fromEmailAndCode(e,t,n=null){return new Ws(e,t,"emailLink",n)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t="string"==typeof e?JSON.parse(e):e;if((null==t?void 0:t.email)&&(null==t?void 0:t.password)){if("password"===t.signInMethod)return this._fromEmailAndPassword(t.email,t.password);if("emailLink"===t.signInMethod)return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
return async function(e,t){return ls(e,"POST","/v1/accounts:signInWithPassword",ss(e,t))}(e,{returnSecureToken:!0,email:this._email,password:this._password});case"emailLink":return async function(e,t){return ls(e,"POST","/v1/accounts:signInWithEmailLink",ss(e,t))}(e,{email:this._email,oobCode:this._password});default:Wo(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":return async function(e,t){return as(e,"POST","/v1/accounts:update",t)}(e,{idToken:t,returnSecureToken:!0,email:this._email,password:this._password});case"emailLink":return async function(e,t){return ls(e,"POST","/v1/accounts:signInWithEmailLink",ss(e,t))}(e,{idToken:t,email:this._email,oobCode:this._password});default:Wo(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Hs(e,t){return ls(e,"POST","/v1/accounts:signInWithIdp",ss(e,t))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qs extends Bs{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new qs(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Wo("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t="string"==typeof e?JSON.parse(e):e,{providerId:n,signInMethod:r}=t,i=Hi(t,["providerId","signInMethod"]);if(!n||!r)return null;const o=new qs(n,r);return Object.assign(o,i),o}_getIdTokenResponse(e){return Hs(e,this.buildRequest())}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,Hs(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Hs(e,t)}buildRequest(){const e={requestUri:"http://localhost",returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=ao(t)}return e}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ks{constructor(e){var t,n,r,i,o,s;const a=co(lo(e)),c=null!==(t=a.apiKey)&&void 0!==t?t:null,l=null!==(n=a.oobCode)&&void 0!==n?n:null,u=function(e){switch(e){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}(null!==(r=a.mode)&&void 0!==r?r:null);Ko(c&&l&&u,"argument-error"),this.apiKey=c,this.operation=u,this.code=l,this.continueUrl=null!==(i=a.continueUrl)&&void 0!==i?i:null,this.languageCode=null!==(o=a.languageCode)&&void 0!==o?o:null,this.tenantId=null!==(s=a.tenantId)&&void 0!==s?s:null}static parseLink(e){const t=function(e){const t=co(lo(e)).link,n=t?co(lo(t)).deep_link_id:null,r=co(lo(e)).deep_link_id;return(r?co(lo(r)).link:null)||r||n||t||e}(e);try{return new Ks(t)}catch(n){return null}}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gs{constructor(){this.providerId=Gs.PROVIDER_ID}static credential(e,t){return Ws._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const n=Ks.parseLink(t);return Ko(n,"argument-error"),Ws._fromEmailAndCode(e,n.code,n.tenantId)}}Gs.PROVIDER_ID="password",Gs.EMAIL_PASSWORD_SIGN_IN_METHOD="password",Gs.EMAIL_LINK_SIGN_IN_METHOD="emailLink";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Js{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xs extends Js{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ys extends Xs{constructor(){super("facebook.com")}static credential(e){return qs._fromParams({providerId:Ys.PROVIDER_ID,signInMethod:Ys.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ys.credentialFromTaggedObject(e)}static credentialFromError(e){return Ys.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e))return null;if(!e.oauthAccessToken)return null;try{return Ys.credential(e.oauthAccessToken)}catch(t){return null}}}Ys.FACEBOOK_SIGN_IN_METHOD="facebook.com",Ys.PROVIDER_ID="facebook.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Zs extends Xs{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return qs._fromParams({providerId:Zs.PROVIDER_ID,signInMethod:Zs.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Zs.credentialFromTaggedObject(e)}static credentialFromError(e){return Zs.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n}=e;if(!t&&!n)return null;try{return Zs.credential(t,n)}catch(r){return null}}}Zs.GOOGLE_SIGN_IN_METHOD="google.com",Zs.PROVIDER_ID="google.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Qs extends Xs{constructor(){super("github.com")}static credential(e){return qs._fromParams({providerId:Qs.PROVIDER_ID,signInMethod:Qs.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Qs.credentialFromTaggedObject(e)}static credentialFromError(e){return Qs.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e))return null;if(!e.oauthAccessToken)return null;try{return Qs.credential(e.oauthAccessToken)}catch(t){return null}}}Qs.GITHUB_SIGN_IN_METHOD="github.com",Qs.PROVIDER_ID="github.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ea extends Xs{constructor(){super("twitter.com")}static credential(e,t){return qs._fromParams({providerId:ea.PROVIDER_ID,signInMethod:ea.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return ea.credentialFromTaggedObject(e)}static credentialFromError(e){return ea.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:n}=e;if(!t||!n)return null;try{return ea.credential(t,n)}catch(r){return null}}}ea.TWITTER_SIGN_IN_METHOD="twitter.com",ea.PROVIDER_ID="twitter.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ta{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,n,r=!1){const i=await Is._fromIdTokenResponse(e,n,r),o=na(n);return new ta({user:i,providerId:o,_tokenResponse:n,operationType:t})}static async _forOperation(e,t,n){await e._updateTokensIfNecessary(n,!0);const r=na(n);return new ta({user:e,providerId:r,_tokenResponse:n,operationType:t})}}function na(e){return e.providerId?e.providerId:"phoneNumber"in e?"phone":null}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ra extends to{constructor(e,t,n,r){var i;super(t.code,t.message),this.operationType=n,this.user=r,this.name="FirebaseError",Object.setPrototypeOf(this,ra.prototype),this.appName=e.name,this.code=t.code,this.tenantId=null!==(i=e.tenantId)&&void 0!==i?i:void 0,this.serverResponse=t.customData.serverResponse}static _fromErrorAndOperation(e,t,n,r){return new ra(e,t,n,r)}}function ia(e,t,n,r){return("reauthenticate"===t?n._getReauthenticationResolver(e):n._getIdTokenResponse(e)).catch((n=>{if("auth/multi-factor-auth-required"===n.code)throw ra._fromErrorAndOperation(e,n,t,r);throw n}))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function oa(e,t,n=!1){const r="signIn",i=await ia(e,r,t),o=await ta._fromIdTokenResponse(e,r,i);return n||await e._updateCurrentUser(o.user),o}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function sa(e,t,n){const r=fo(e),i={requestType:"EMAIL_SIGNIN",email:t};Ko(n.handleCodeInApp,r,"argument-error"),n&&
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(e,t,n){var r;Ko((null===(r=n.url)||void 0===r?void 0:r.length)>0,e,"invalid-continue-uri"),Ko(void 0===n.dynamicLinkDomain||n.dynamicLinkDomain.length>0,e,"invalid-dynamic-link-domain"),t.continueUrl=n.url,t.dynamicLinkDomain=n.dynamicLinkDomain,t.canHandleCodeInApp=n.handleCodeInApp,n.iOS&&(Ko(n.iOS.bundleId.length>0,e,"missing-ios-bundle-id"),t.iosBundleId=n.iOS.bundleId),n.android&&(Ko(n.android.packageName.length>0,e,"missing-android-pkg-name"),t.androidInstallApp=n.android.installApp,t.androidMinimumVersionCode=n.android.minimumVersion,t.androidPackageName=n.android.packageName)}(r,i,n),await zs(r,i)}function aa(e,t){const n=Ks.parseLink(t);return"EMAIL_SIGNIN"===(null==n?void 0:n.operation)}async function ca(e,t,n){const r=fo(e),i=Gs.credentialWithLink(t,n||Zo());return Ko(i._tenantId===(r.tenantId||null),r,"tenant-id-mismatch"),async function(e,t){return oa(Vs(e),t)}(r,i)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class la{constructor(e,t){this.storage=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem("__sak","1"),this.storage.removeItem("__sak"),Promise.resolve(!0)):Promise.resolve(!1)}catch(e){return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ua extends la{constructor(){super(window.localStorage,"LOCAL"),this.listeners={},this.localCache={},this.pollTimer=null,this.safariLocalStorageNotSynced=function(){const e=Qi();return As(e)||Ms(e)}()&&function(){try{return!(!window||window===window.top)}catch(e){return!1}}(),this.fallbackToPolling=js(),this._shouldAllowMigration=!0,this.boundEventHandler=this.onStorageEvent.bind(this)}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const n=this.storage.getItem(t),r=this.localCache[t];n!==r&&e(t,r,n)}}onStorageEvent(e,t=!1){if(!e.key)return void this.forAllChangedKeys(((e,t,n)=>{this.notifyListeners(e,n)}));const n=e.key;if(t?this.detachListener():this.stopPolling(),this.safariLocalStorageNotSynced){const r=this.storage.getItem(n);if(e.newValue!==r)null!==e.newValue?this.storage.setItem(n,e.newValue):this.storage.removeItem(n);else if(this.localCache[n]===e.newValue&&!t)return}const r=()=>{const e=this.storage.getItem(n);(t||this.localCache[n]!==e)&&this.notifyListeners(n,e)},i=this.storage.getItem(n);Ds()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,10):r()}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const r of Array.from(n))r(t?JSON.parse(t):t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval((()=>{this.forAllChangedKeys(((e,t,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:n}),!0)}))}),1e3)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){0===Object.keys(this.listeners).length&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}ua.type="LOCAL";const da=ua;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ha extends la{constructor(){super(window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}ha.type="SESSION";const pa=ha;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class fa{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find((t=>t.isListeningto(e)));if(t)return t;const n=new fa(e);return this.receivers.push(n),n}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:n,eventType:r,data:i}=t.data,o=this.handlersMap[r];if(!(null==o?void 0:o.size))return;t.ports[0].postMessage({status:"ack",eventId:n,eventType:r});const s=Array.from(o).map((async e=>e(t.origin,i))),a=await function(e){return Promise.all(e.map((async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}})))}(s);t.ports[0].postMessage({status:"done",eventId:n,eventType:r,response:a})}_subscribe(e,t){0===Object.keys(this.handlersMap).length&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),t&&0!==this.handlersMap[e].size||delete this.handlersMap[e],0===Object.keys(this.handlersMap).length&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function ma(e="",t=10){let n="";for(let r=0;r<t;r++)n+=Math.floor(10*Math.random());return e+n}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */fa.receivers=[];class ga{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,n=50){const r="undefined"!=typeof MessageChannel?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let i,o;return new Promise(((s,a)=>{const c=ma("",20);r.port1.start();const l=setTimeout((()=>{a(new Error("unsupported_event"))}),n);o={messageChannel:r,onMessage(e){const t=e;if(t.data.eventId===c)switch(t.data.status){case"ack":clearTimeout(l),i=setTimeout((()=>{a(new Error("timeout"))}),3e3);break;case"done":clearTimeout(i),s(t.data.response);break;default:clearTimeout(l),clearTimeout(i),a(new Error("invalid_response"))}}},this.handlers.add(o),r.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:c,data:t},[r.port2])})).finally((()=>{o&&this.removeMessageHandler(o)}))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function va(){return window}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function ya(){return void 0!==va().WorkerGlobalScope&&"function"==typeof va().importScripts}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const _a="firebaseLocalStorageDb";class ba{constructor(e){this.request=e}toPromise(){return new Promise(((e,t)=>{this.request.addEventListener("success",(()=>{e(this.request.result)})),this.request.addEventListener("error",(()=>{t(this.request.error)}))}))}}function wa(e,t){return e.transaction(["firebaseLocalStorage"],t?"readwrite":"readonly").objectStore("firebaseLocalStorage")}function Ia(){const e=indexedDB.open(_a,1);return new Promise(((t,n)=>{e.addEventListener("error",(()=>{n(e.error)})),e.addEventListener("upgradeneeded",(()=>{const t=e.result;try{t.createObjectStore("firebaseLocalStorage",{keyPath:"fbase_key"})}catch(r){n(r)}})),e.addEventListener("success",(async()=>{const n=e.result;n.objectStoreNames.contains("firebaseLocalStorage")?t(n):(n.close(),await function(){const e=indexedDB.deleteDatabase(_a);return new ba(e).toPromise()}(),t(await Ia()))}))}))}async function Ea(e,t,n){const r=wa(e,!0).put({fbase_key:t,value:n});return new ba(r).toPromise()}function Ta(e,t){const n=wa(e,!0).delete(t);return new ba(n).toPromise()}class ka{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then((()=>{}),(()=>{}))}async _openDb(){return this.db||(this.db=await Ia()),this.db}async _withRetries(e){let t=0;for(;;)try{const t=await this._openDb();return await e(t)}catch(n){if(t++>3)throw n;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return ya()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=fa._getInstance(ya()?self:null),this.receiver._subscribe("keyChanged",(async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)}))),this.receiver._subscribe("ping",(async(e,t)=>["keyChanged"]))}async initializeSender(){var e,t;if(this.activeServiceWorker=await async function(){if(!(null===navigator||void 0===navigator?void 0:navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch(e){return null}}(),!this.activeServiceWorker)return;this.sender=new ga(this.activeServiceWorker);const n=await this.sender._send("ping",{},800);n&&(null===(e=n[0])||void 0===e?void 0:e.fulfilled)&&(null===(t=n[0])||void 0===t?void 0:t.value.includes("keyChanged"))&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){var t;if(this.sender&&this.activeServiceWorker&&((null===(t=null===navigator||void 0===navigator?void 0:navigator.serviceWorker)||void 0===t?void 0:t.controller)||null)===this.activeServiceWorker)try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch(t){}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Ia();return await Ea(e,"__sak","1"),await Ta(e,"__sak"),!0}catch(e){}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite((async()=>(await this._withRetries((n=>Ea(n,e,t))),this.localCache[e]=t,this.notifyServiceWorker(e))))}async _get(e){const t=await this._withRetries((t=>async function(e,t){const n=wa(e,!1).get(t),r=await new ba(n).toPromise();return void 0===r?null:r.value}(t,e)));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite((async()=>(await this._withRetries((t=>Ta(t,e))),delete this.localCache[e],this.notifyServiceWorker(e))))}async _poll(){const e=await this._withRetries((e=>{const t=wa(e,!1).getAll();return new ba(t).toPromise()}));if(!e)return[];if(0!==this.pendingWrites)return[];const t=[],n=new Set;for(const{fbase_key:r,value:i}of e)n.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(i)&&(this.notifyListeners(r,i),t.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!n.has(r)&&(this.notifyListeners(r,null),t.push(r));return t}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const r of Array.from(n))r(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval((async()=>this._poll()),800)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){0===Object.keys(this.listeners).length&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&this.stopPolling()}}ka.type="LOCAL";const Sa=ka;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ca(e){return new Promise(((t,n)=>{const r=document.createElement("script");var i,o;r.setAttribute("src",e),r.onload=t,r.onerror=e=>{const t=Ho("internal-error");t.customData=e,n(t)},r.type="text/javascript",r.charset="UTF-8",(null!==(o=null===(i=document.getElementsByTagName("head"))||void 0===i?void 0:i[0])&&void 0!==o?o:document).appendChild(r)}))}new ts(3e4,6e4);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Oa extends Bs{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Hs(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Hs(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Hs(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function Aa(e){return oa(e.auth,new Oa(e),e.bypassAuthState)}function Ra(e){const{auth:t,user:n}=e;return Ko(n,t,"internal-error"),
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function(e,t,n=!1){const{auth:r}=e,i="reauthenticate";try{const o=await gs(e,ia(r,i,t,e),n);Ko(o.idToken,r,"internal-error");const s=ms(o.idToken);Ko(s,r,"internal-error");const{sub:a}=s;return Ko(e.uid===a,r,"user-mismatch"),ta._forOperation(e,i,o)}catch(o){throw"auth/user-not-found"===(null==o?void 0:o.code)&&Wo(r,"user-mismatch"),o}}(n,new Oa(e),e.bypassAuthState)}async function Pa(e){const{auth:t,user:n}=e;return Ko(n,t,"internal-error"),async function(e,t,n=!1){const r=await gs(e,t._linkToIdToken(e.auth,await e.getIdToken()),n);return ta._forOperation(e,"link",r)}(n,new Oa(e),e.bypassAuthState)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Na{constructor(e,t,n,r,i=!1){this.auth=e,this.resolver=n,this.user=r,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise((async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}}))}async onAuthEvent(e){const{urlResponse:t,sessionId:n,postBody:r,tenantId:i,error:o,type:s}=e;if(o)return void this.reject(o);const a={auth:this.auth,requestUri:t,sessionId:n,tenantId:i||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(s)(a))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Aa;case"linkViaPopup":case"linkViaRedirect":return Pa;case"reauthViaPopup":case"reauthViaRedirect":return Ra;default:Wo(this.auth,"internal-error")}}resolve(e){Jo(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Jo(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const La=new ts(2e3,1e4);class xa extends Na{constructor(e,t,n,r,i){super(e,t,r,i),this.provider=n,this.authWindow=null,this.pollId=null,xa.currentPopupAction&&xa.currentPopupAction.cancel(),xa.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return Ko(e,this.auth,"internal-error"),e}async onExecution(){Jo(1===this.filter.length,"Popup operations only handle one event");const e=ma();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch((e=>{this.reject(e)})),this.resolver._isIframeWebStorageSupported(this.auth,(e=>{e||this.reject(Ho(this.auth,"web-storage-unsupported"))})),this.pollUserCancellation()}get eventId(){var e;return(null===(e=this.authWindow)||void 0===e?void 0:e.associatedEvent)||null}cancel(){this.reject(Ho(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,xa.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,n;(null===(n=null===(t=this.authWindow)||void 0===t?void 0:t.window)||void 0===n?void 0:n.closed)?this.pollId=window.setTimeout((()=>{this.pollId=null,this.reject(Ho(this.auth,"popup-closed-by-user"))}),2e3):this.pollId=window.setTimeout(e,La.get())};e()}}xa.currentPopupAction=null;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Ma=new Map;class Da extends Na{constructor(e,t,n=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,n),this.eventId=null}async execute(){let e=Ma.get(this.auth._key());if(!e){try{const t=await async function(e,t){const n=function(e){return ks("pendingRedirect",e.config.apiKey,e.name)}(t),r="true"===await ja(e)._get(n);return await ja(e)._remove(n),r}(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(t)}catch(t){e=()=>Promise.reject(t)}Ma.set(this.auth._key(),e)}return e()}async onAuthEvent(e){if("signInViaRedirect"===e.type)return super.onAuthEvent(e);if("unknown"!==e.type){if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}else this.resolve(null)}async onExecution(){}cleanUp(){}}function ja(e){return Yo(e._redirectPersistence)}async function Ua(e,t,n=!1){const r=Vs(e),i=
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(e,t){return t?Yo(t):(Ko(e._popupRedirectResolver,e,"argument-error"),e._popupRedirectResolver)}(r,t),o=new Da(r,i,n),s=await o.execute();return s&&!n&&(delete s.user._redirectEventId,await r._persistUserIfCurrent(s.user),await r._setRedirectUser(null,t)),s}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fa{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach((n=>{this.isEventForConsumer(e,n)&&(t=!0,this.sendToConsumer(e,n),this.saveEventToCache(e))})),this.hasHandledPotentialRedirect||!function(e){switch(e.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return $a(e);default:return!1}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var n;if(e.error&&!$a(e)){const r=(null===(n=e.error.code)||void 0===n?void 0:n.split("auth/")[1])||"internal-error";t.onError(Ho(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const n=null===t.eventId||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&n}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=6e5&&this.cachedEventUids.clear(),this.cachedEventUids.has(Va(e))}saveEventToCache(e){this.cachedEventUids.add(Va(e)),this.lastProcessedEventTime=Date.now()}}function Va(e){return[e.type,e.eventId,e.sessionId,e.tenantId].filter((e=>e)).join("-")}function $a({type:e,error:t}){return"unknown"===e&&"auth/no-auth-event"===(null==t?void 0:t.code)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Ba=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,za=/^https?/;async function Wa(e){if(e.config.emulator)return;const{authorizedDomains:t}=await async function(e,t={}){return as(e,"GET","/v1/projects",t)}(e);for(const r of t)try{if(Ha(r))return}catch(n){}Wo(e,"unauthorized-domain")}function Ha(e){const t=Zo(),{protocol:n,hostname:r}=new URL(t);if(e.startsWith("chrome-extension://")){const i=new URL(e);return""===i.hostname&&""===r?"chrome-extension:"===n&&e.replace("chrome-extension://","")===t.replace("chrome-extension://",""):"chrome-extension:"===n&&i.hostname===r}if(!za.test(n))return!1;if(Ba.test(e))return r===e;const i=e.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qa=new ts(3e4,6e4);function Ka(){const e=va().___jsl;if(null==e?void 0:e.H)for(const t of Object.keys(e.H))if(e.H[t].r=e.H[t].r||[],e.H[t].L=e.H[t].L||[],e.H[t].r=[...e.H[t].L],e.CP)for(let n=0;n<e.CP.length;n++)e.CP[n]=null}function Ga(e){return new Promise(((t,n)=>{var r,i,o;function s(){Ka(),gapi.load("gapi.iframes",{callback:()=>{t(gapi.iframes.getContext())},ontimeout:()=>{Ka(),n(Ho(e,"network-request-failed"))},timeout:qa.get()})}if(null===(i=null===(r=va().gapi)||void 0===r?void 0:r.iframes)||void 0===i?void 0:i.Iframe)t(gapi.iframes.getContext());else{if(!(null===(o=va().gapi)||void 0===o?void 0:o.load)){const t=`__${"iframefcb"}${Math.floor(1e6*Math.random())}`;return va()[t]=()=>{gapi.load?s():n(Ho(e,"network-request-failed"))},Ca(`https://apis.google.com/js/api.js?onload=${t}`)}s()}})).catch((e=>{throw Ja=null,e}))}let Ja=null;
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Xa=new ts(5e3,15e3),Ya={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"}},Za=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Qa(e){const t=e.config;Ko(t.authDomain,e,"auth-domain-config-required");const n=t.emulator?ns(t,"emulator/auth/iframe"):`https://${e.config.authDomain}/__/auth/iframe`,r={apiKey:t.apiKey,appName:e.name,v:"9.0.0"},i=Za.get(e.config.apiHost);i&&(r.eid=i);const o=e._getFrameworks();return o.length&&(r.fw=o.join(",")),`${n}?${ao(r).slice(1)}`}async function ec(e){const t=await function(e){return Ja=Ja||Ga(e),Ja}(e),n=va().gapi;return Ko(n,e,"internal-error"),t.open({where:document.body,url:Qa(e),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Ya,dontclear:!0},(t=>new Promise((async(n,r)=>{await t.restyle({setHideOnLeave:!1});const i=Ho(e,"network-request-failed"),o=va().setTimeout((()=>{r(i)}),Xa.get());function s(){va().clearTimeout(o),n(t)}t.ping(s).then(s,(()=>{r(i)}))}))))}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tc={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"};class nc{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch(e){}}}function rc(e,t,n,r=500,i=600){const o=Math.max((window.screen.availHeight-i)/2,0).toString(),s=Math.max((window.screen.availWidth-r)/2,0).toString();let a="";const c=Object.assign(Object.assign({},tc),{width:r.toString(),height:i.toString(),top:o,left:s}),l=Qi().toLowerCase();n&&(a=Rs(l)?"_blank":n),Os(l)&&(t=t||"http://localhost",c.scrollbars="yes");const u=Object.entries(c).reduce(((e,[t,n])=>`${e}${t}=${n},`),"");if(function(e=Qi()){var t;return Ms(e)&&!!(null===(t=window.navigator)||void 0===t?void 0:t.standalone)}(l)&&"_self"!==a)return function(e,t){const n=document.createElement("a");n.href=e,n.target=t;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(t||"",a),new nc(null);const d=window.open(t||"",a,u);Ko(d,e,"popup-blocked");try{d.focus()}catch(h){}return new nc(d)}function ic(e,t,n,r,i,o){Ko(e.config.authDomain,e,"auth-domain-config-required"),Ko(e.config.apiKey,e,"invalid-api-key");const s={apiKey:e.config.apiKey,appName:e.name,authType:n,redirectUrl:r,v:"9.0.0",eventId:i};if(t instanceof Js){t.setDefaultLanguage(e.languageCode),s.providerId=t.providerId||"",function(e){for(var t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}(t.getCustomParameters())||(s.customParameters=JSON.stringify(t.getCustomParameters()));for(const[e,t]of Object.entries(o||{}))s[e]=t}if(t instanceof Xs){const e=t.getScopes().filter((e=>""!==e));e.length>0&&(s.scopes=e.join(","))}e.tenantId&&(s.tid=e.tenantId);const a=s;for(const c of Object.keys(a))void 0===a[c]&&delete a[c];return`${function({config:e}){if(!e.emulator)return`https://${e.authDomain}/__/auth/handler`;return ns(e,"emulator/auth/handler")}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e)}?${ao(a).slice(1)}`}const oc=class{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=pa,this._completeRedirectFn=Ua}async _openPopup(e,t,n,r){var i;Jo(null===(i=this.eventManagers[e._key()])||void 0===i?void 0:i.manager,"_initialize() not called before _openPopup()");return rc(e,ic(e,t,n,Zo(),r),ma())}async _openRedirect(e,t,n,r){var i;return await this._originValidation(e),i=ic(e,t,n,Zo(),r),va().location.href=i,new Promise((()=>{}))}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:e,promise:n}=this.eventManagers[t];return e?Promise.resolve(e):(Jo(n,"If manager is not set, promise should be"),n)}const n=this.initAndGetManager(e);return this.eventManagers[t]={promise:n},n}async initAndGetManager(e){const t=await ec(e),n=new Fa(e);return t.register("authEvent",(t=>{Ko(null==t?void 0:t.authEvent,e,"invalid-auth-event");return{status:n.onEvent(t.authEvent)?"ACK":"ERROR"}}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:n},this.iframes[e._key()]=t,n}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send("webStorageSupport",{type:"webStorageSupport"},(n=>{var r;const i=null===(r=null==n?void 0:n[0])||void 0===r?void 0:r.webStorageSupport;void 0!==i&&t(!!i),Wo(e,"internal-error")}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Wa(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return js()||As()||Ms()}};var sc;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ac{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),(null===(e=this.auth.currentUser)||void 0===e?void 0:e.uid)||null}async getToken(e){if(this.assertAuthConfigured(),await this.auth._initializationPromise,!this.auth.currentUser)return null;return{accessToken:await this.auth.currentUser.getIdToken(e)}}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged((t=>{var n;e((null===(n=t)||void 0===n?void 0:n.stsTokenManager.accessToken)||null)}));this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){Ko(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function cc(e=Uo()){const t=xo(e,"auth");return t.isInitialized()?t.getImmediate():function(e,t){const n=xo(e,"auth");if(n.isInitialized()){const e=n.getImmediate();if(oo(n.getOptions(),null!=t?t:{}))return e;Wo(e,"already-initialized")}return n.initialize({options:t})}(e,{popupRedirectResolver:oc,persistence:[Sa,da,pa]})}function lc(){return"undefined"!=typeof navigator?window:"undefined"!=typeof global?global:{}}sc="Browser",Lo(new mo("auth",((e,{options:t})=>{const n=e.getProvider("app").getImmediate(),{apiKey:r,authDomain:i}=n.options;return(e=>{Ko(r&&!r.includes(":"),"invalid-api-key",{appName:e.name}),Ko(!(null==i?void 0:i.includes(":")),"argument-error",{appName:e.name});const n={apiKey:r,authDomain:i,clientPlatform:sc,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Us(sc)},o=new Fs(e,n);return function(e,t){const n=(null==t?void 0:t.persistence)||[],r=(Array.isArray(n)?n:[n]).map(Yo);(null==t?void 0:t.errorMap)&&e._updateErrorMap(t.errorMap),e._initializeWithPersistence(r,null==t?void 0:t.popupRedirectResolver)}(o,t),o})(n)}),"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback(((e,t,n)=>{e.getProvider("auth-internal").initialize()}))),Lo(new mo("auth-internal",(e=>{const t=Vs(e.getProvider("auth").getImmediate());return new ac(t)}),"PRIVATE").setInstantiationMode("EXPLICIT")),Fo("@firebase/auth","0.17.1",function(e){switch(e){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";default:return}}(sc));function uc(e,t){const n=lc().__VUE_DEVTOOLS_GLOBAL_HOOK__;if(n)n.emit("devtools-plugin:setup",e,t);else{const n=lc();(n.__VUE_DEVTOOLS_PLUGINS__=n.__VUE_DEVTOOLS_PLUGINS__||[]).push({pluginDescriptor:e,setupFn:t})}}
/*!
 * vuex v4.0.2
 * (c) 2021 Evan You
 * @license MIT
 */function dc(e,t){Object.keys(e).forEach((function(n){return t(e[n],n)}))}function hc(e,t,n){return t.indexOf(e)<0&&(n&&n.prepend?t.unshift(e):t.push(e)),function(){var n=t.indexOf(e);n>-1&&t.splice(n,1)}}function pc(e,t){e._actions=Object.create(null),e._mutations=Object.create(null),e._wrappedGetters=Object.create(null),e._modulesNamespaceMap=Object.create(null);var n=e.state;mc(e,n,[],e._modules.root,!0),fc(e,n,t)}function fc(e,t,n){var r=e._state;e.getters={},e._makeLocalGettersCache=Object.create(null);var i=e._wrappedGetters,o={};dc(i,(function(t,n){o[n]=function(e,t){return function(){return e(t)}}(t,e),Object.defineProperty(e.getters,n,{get:function(){return o[n]()},enumerable:!0})})),e._state=He({data:t}),e.strict&&function(e){Vt((function(){return e._state.data}),(function(){}),{deep:!0,flush:"sync"})}(e),r&&n&&e._withCommit((function(){r.data=null}))}function mc(e,t,n,r,i){var o=!n.length,s=e._modules.getNamespace(n);if(r.namespaced&&(e._modulesNamespaceMap[s],e._modulesNamespaceMap[s]=r),!o&&!i){var a=vc(t,n.slice(0,-1)),c=n[n.length-1];e._withCommit((function(){a[c]=r.state}))}var l=r.context=function(e,t,n){var r=""===t,i={dispatch:r?e.dispatch:function(n,r,i){var o=yc(n,r,i),s=o.payload,a=o.options,c=o.type;return a&&a.root||(c=t+c),e.dispatch(c,s)},commit:r?e.commit:function(n,r,i){var o=yc(n,r,i),s=o.payload,a=o.options,c=o.type;a&&a.root||(c=t+c),e.commit(c,s,a)}};return Object.defineProperties(i,{getters:{get:r?function(){return e.getters}:function(){return gc(e,t)}},state:{get:function(){return vc(e.state,n)}}}),i}(e,s,n);r.forEachMutation((function(t,n){!function(e,t,n,r){(e._mutations[t]||(e._mutations[t]=[])).push((function(t){n.call(e,r.state,t)}))}(e,s+n,t,l)})),r.forEachAction((function(t,n){var r=t.root?n:s+n,i=t.handler||t;!function(e,t,n,r){(e._actions[t]||(e._actions[t]=[])).push((function(t){var i,o=n.call(e,{dispatch:r.dispatch,commit:r.commit,getters:r.getters,state:r.state,rootGetters:e.getters,rootState:e.state},t);return(i=o)&&"function"==typeof i.then||(o=Promise.resolve(o)),e._devtoolHook?o.catch((function(t){throw e._devtoolHook.emit("vuex:error",t),t})):o}))}(e,r,i,l)})),r.forEachGetter((function(t,n){!function(e,t,n,r){if(e._wrappedGetters[t])return;e._wrappedGetters[t]=function(e){return n(r.state,r.getters,e.state,e.getters)}}(e,s+n,t,l)})),r.forEachChild((function(r,o){mc(e,t,n.concat(o),r,i)}))}function gc(e,t){if(!e._makeLocalGettersCache[t]){var n={},r=t.length;Object.keys(e.getters).forEach((function(i){if(i.slice(0,r)===t){var o=i.slice(r);Object.defineProperty(n,o,{get:function(){return e.getters[i]},enumerable:!0})}})),e._makeLocalGettersCache[t]=n}return e._makeLocalGettersCache[t]}function vc(e,t){return t.reduce((function(e,t){return e[t]}),e)}function yc(e,t,n){var r;return null!==(r=e)&&"object"==typeof r&&e.type&&(n=t,t=e,e=e.type),{type:e,payload:t,options:n}}var _c=0;function bc(e,t){uc({id:"org.vuejs.vuex",app:e,label:"Vuex",homepage:"https://next.vuex.vuejs.org/",logo:"https://vuejs.org/images/icons/favicon-96x96.png",packageName:"vuex",componentStateTypes:["vuex bindings"]},(function(n){n.addTimelineLayer({id:"vuex:mutations",label:"Vuex Mutations",color:wc}),n.addTimelineLayer({id:"vuex:actions",label:"Vuex Actions",color:wc}),n.addInspector({id:"vuex",label:"Vuex",icon:"storage",treeFilterPlaceholder:"Filter stores..."}),n.on.getInspectorTree((function(n){if(n.app===e&&"vuex"===n.inspectorId)if(n.filter){var r=[];kc(r,t._modules.root,n.filter,""),n.rootNodes=r}else n.rootNodes=[Tc(t._modules.root,"")]})),n.on.getInspectorState((function(n){if(n.app===e&&"vuex"===n.inspectorId){var r=n.nodeId;gc(t,r),n.state=function(e,t,n){t="root"===n?t:t[n];var r=Object.keys(t),i={state:Object.keys(e.state).map((function(t){return{key:t,editable:!0,value:e.state[t]}}))};if(r.length){var o=function(e){var t={};return Object.keys(e).forEach((function(n){var r=n.split("/");if(r.length>1){var i=t,o=r.pop();r.forEach((function(e){i[e]||(i[e]={_custom:{value:{},display:e,tooltip:"Module",abstract:!0}}),i=i[e]._custom.value})),i[o]=Sc((function(){return e[n]}))}else t[n]=Sc((function(){return e[n]}))})),t}(t);i.getters=Object.keys(o).map((function(e){return{key:e.endsWith("/")?Ec(e):e,editable:!1,value:Sc((function(){return o[e]}))}}))}return i}((i=t._modules,(s=(o=r).split("/").filter((function(e){return e}))).reduce((function(e,t,n){var r=e[t];if(!r)throw new Error('Missing module "'+t+'" for path "'+o+'".');return n===s.length-1?r:r._children}),"root"===o?i:i.root._children)),"root"===r?t.getters:t._makeLocalGettersCache,r)}var i,o,s})),n.on.editInspectorState((function(n){if(n.app===e&&"vuex"===n.inspectorId){var r=n.nodeId,i=n.path;"root"!==r&&(i=r.split("/").filter(Boolean).concat(i)),t._withCommit((function(){n.set(t._state.data,i,n.state.value)}))}})),t.subscribe((function(e,t){var r={};e.payload&&(r.payload=e.payload),r.state=t,n.notifyComponentUpdate(),n.sendInspectorTree("vuex"),n.sendInspectorState("vuex"),n.addTimelineEvent({layerId:"vuex:mutations",event:{time:Date.now(),title:e.type,data:r}})})),t.subscribeAction({before:function(e,t){var r={};e.payload&&(r.payload=e.payload),e._id=_c++,e._time=Date.now(),r.state=t,n.addTimelineEvent({layerId:"vuex:actions",event:{time:e._time,title:e.type,groupId:e._id,subtitle:"start",data:r}})},after:function(e,t){var r={},i=Date.now()-e._time;r.duration={_custom:{type:"duration",display:i+"ms",tooltip:"Action duration",value:i}},e.payload&&(r.payload=e.payload),r.state=t,n.addTimelineEvent({layerId:"vuex:actions",event:{time:Date.now(),title:e.type,groupId:e._id,subtitle:"end",data:r}})}})}))}var wc=8702998,Ic={label:"namespaced",textColor:16777215,backgroundColor:6710886};function Ec(e){return e&&"root"!==e?e.split("/").slice(-2,-1)[0]:"Root"}function Tc(e,t){return{id:t||"root",label:Ec(t),tags:e.namespaced?[Ic]:[],children:Object.keys(e._children).map((function(n){return Tc(e._children[n],t+n+"/")}))}}function kc(e,t,n,r){r.includes(n)&&e.push({id:r||"root",label:r.endsWith("/")?r.slice(0,r.length-1):r||"Root",tags:t.namespaced?[Ic]:[]}),Object.keys(t._children).forEach((function(i){kc(e,t._children[i],n,r+i+"/")}))}function Sc(e){try{return e()}catch(t){return t}}var Cc=function(e,t){this.runtime=t,this._children=Object.create(null),this._rawModule=e;var n=e.state;this.state=("function"==typeof n?n():n)||{}},Oc={namespaced:{configurable:!0}};Oc.namespaced.get=function(){return!!this._rawModule.namespaced},Cc.prototype.addChild=function(e,t){this._children[e]=t},Cc.prototype.removeChild=function(e){delete this._children[e]},Cc.prototype.getChild=function(e){return this._children[e]},Cc.prototype.hasChild=function(e){return e in this._children},Cc.prototype.update=function(e){this._rawModule.namespaced=e.namespaced,e.actions&&(this._rawModule.actions=e.actions),e.mutations&&(this._rawModule.mutations=e.mutations),e.getters&&(this._rawModule.getters=e.getters)},Cc.prototype.forEachChild=function(e){dc(this._children,e)},Cc.prototype.forEachGetter=function(e){this._rawModule.getters&&dc(this._rawModule.getters,e)},Cc.prototype.forEachAction=function(e){this._rawModule.actions&&dc(this._rawModule.actions,e)},Cc.prototype.forEachMutation=function(e){this._rawModule.mutations&&dc(this._rawModule.mutations,e)},Object.defineProperties(Cc.prototype,Oc);var Ac=function(e){this.register([],e,!1)};function Rc(e,t,n){if(t.update(n),n.modules)for(var r in n.modules){if(!t.getChild(r))return;Rc(e.concat(r),t.getChild(r),n.modules[r])}}function Pc(e){return new Nc(e)}Ac.prototype.get=function(e){return e.reduce((function(e,t){return e.getChild(t)}),this.root)},Ac.prototype.getNamespace=function(e){var t=this.root;return e.reduce((function(e,n){return e+((t=t.getChild(n)).namespaced?n+"/":"")}),"")},Ac.prototype.update=function(e){Rc([],this.root,e)},Ac.prototype.register=function(e,t,n){var r=this;void 0===n&&(n=!0);var i=new Cc(t,n);0===e.length?this.root=i:this.get(e.slice(0,-1)).addChild(e[e.length-1],i);t.modules&&dc(t.modules,(function(t,i){r.register(e.concat(i),t,n)}))},Ac.prototype.unregister=function(e){var t=this.get(e.slice(0,-1)),n=e[e.length-1],r=t.getChild(n);r&&r.runtime&&t.removeChild(n)},Ac.prototype.isRegistered=function(e){var t=this.get(e.slice(0,-1)),n=e[e.length-1];return!!t&&t.hasChild(n)};var Nc=function(e){var t=this;void 0===e&&(e={});var n=e.plugins;void 0===n&&(n=[]);var r=e.strict;void 0===r&&(r=!1);var i=e.devtools;this._committing=!1,this._actions=Object.create(null),this._actionSubscribers=[],this._mutations=Object.create(null),this._wrappedGetters=Object.create(null),this._modules=new Ac(e),this._modulesNamespaceMap=Object.create(null),this._subscribers=[],this._makeLocalGettersCache=Object.create(null),this._devtools=i;var o=this,s=this.dispatch,a=this.commit;this.dispatch=function(e,t){return s.call(o,e,t)},this.commit=function(e,t,n){return a.call(o,e,t,n)},this.strict=r;var c=this._modules.root.state;mc(this,c,[],this._modules.root),fc(this,c),n.forEach((function(e){return e(t)}))},Lc={state:{configurable:!0}};Nc.prototype.install=function(e,t){e.provide(t||"store",this),e.config.globalProperties.$store=this,void 0!==this._devtools&&this._devtools&&bc(e,this)},Lc.state.get=function(){return this._state.data},Lc.state.set=function(e){},Nc.prototype.commit=function(e,t,n){var r=this,i=yc(e,t,n),o=i.type,s=i.payload,a={type:o,payload:s},c=this._mutations[o];c&&(this._withCommit((function(){c.forEach((function(e){e(s)}))})),this._subscribers.slice().forEach((function(e){return e(a,r.state)})))},Nc.prototype.dispatch=function(e,t){var n=this,r=yc(e,t),i=r.type,o=r.payload,s={type:i,payload:o},a=this._actions[i];if(a){try{this._actionSubscribers.slice().filter((function(e){return e.before})).forEach((function(e){return e.before(s,n.state)}))}catch(l){}var c=a.length>1?Promise.all(a.map((function(e){return e(o)}))):a[0](o);return new Promise((function(e,t){c.then((function(t){try{n._actionSubscribers.filter((function(e){return e.after})).forEach((function(e){return e.after(s,n.state)}))}catch(l){}e(t)}),(function(e){try{n._actionSubscribers.filter((function(e){return e.error})).forEach((function(t){return t.error(s,n.state,e)}))}catch(l){}t(e)}))}))}},Nc.prototype.subscribe=function(e,t){return hc(e,this._subscribers,t)},Nc.prototype.subscribeAction=function(e,t){return hc("function"==typeof e?{before:e}:e,this._actionSubscribers,t)},Nc.prototype.watch=function(e,t,n){var r=this;return Vt((function(){return e(r.state,r.getters)}),t,Object.assign({},n))},Nc.prototype.replaceState=function(e){var t=this;this._withCommit((function(){t._state.data=e}))},Nc.prototype.registerModule=function(e,t,n){void 0===n&&(n={}),"string"==typeof e&&(e=[e]),this._modules.register(e,t),mc(this,this.state,e,this._modules.get(e),n.preserveState),fc(this,this.state)},Nc.prototype.unregisterModule=function(e){var t=this;"string"==typeof e&&(e=[e]),this._modules.unregister(e),this._withCommit((function(){delete vc(t.state,e.slice(0,-1))[e[e.length-1]]})),pc(this)},Nc.prototype.hasModule=function(e){return"string"==typeof e&&(e=[e]),this._modules.isRegistered(e)},Nc.prototype.hotUpdate=function(e){this._modules.update(e),pc(this,!0)},Nc.prototype._withCommit=function(e){var t=this._committing;this._committing=!0,e(),this._committing=t},Object.defineProperties(Nc.prototype,Lc);function xc(e){return Array.prototype.slice.call(e)}function Mc(e){return new Promise((function(t,n){e.onsuccess=function(){t(e.result)},e.onerror=function(){n(e.error)}}))}function Dc(e,t,n){var r,i=new Promise((function(i,o){Mc(r=e[t].apply(e,n)).then(i,o)}));return i.request=r,i}function jc(e,t,n){var r=Dc(e,t,n);return r.then((function(e){if(e)return new zc(e,r.request)}))}function Uc(e,t,n){n.forEach((function(n){Object.defineProperty(e.prototype,n,{get:function(){return this[t][n]},set:function(e){this[t][n]=e}})}))}function Fc(e,t,n,r){r.forEach((function(r){r in n.prototype&&(e.prototype[r]=function(){return Dc(this[t],r,arguments)})}))}function Vc(e,t,n,r){r.forEach((function(r){r in n.prototype&&(e.prototype[r]=function(){return this[t][r].apply(this[t],arguments)})}))}function $c(e,t,n,r){r.forEach((function(r){r in n.prototype&&(e.prototype[r]=function(){return jc(this[t],r,arguments)})}))}function Bc(e){this._index=e}function zc(e,t){this._cursor=e,this._request=t}function Wc(e){this._store=e}function Hc(e){this._tx=e,this.complete=new Promise((function(t,n){e.oncomplete=function(){t()},e.onerror=function(){n(e.error)},e.onabort=function(){n(e.error)}}))}function qc(e,t,n){this._db=e,this.oldVersion=t,this.transaction=new Hc(n)}function Kc(e){this._db=e}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Fo("firebase","9.0.1","app"),Uc(Bc,"_index",["name","keyPath","multiEntry","unique"]),Fc(Bc,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),$c(Bc,"_index",IDBIndex,["openCursor","openKeyCursor"]),Uc(zc,"_cursor",["direction","key","primaryKey","value"]),Fc(zc,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach((function(e){e in IDBCursor.prototype&&(zc.prototype[e]=function(){var t=this,n=arguments;return Promise.resolve().then((function(){return t._cursor[e].apply(t._cursor,n),Mc(t._request).then((function(e){if(e)return new zc(e,t._request)}))}))})})),Wc.prototype.createIndex=function(){return new Bc(this._store.createIndex.apply(this._store,arguments))},Wc.prototype.index=function(){return new Bc(this._store.index.apply(this._store,arguments))},Uc(Wc,"_store",["name","keyPath","indexNames","autoIncrement"]),Fc(Wc,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),$c(Wc,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),Vc(Wc,"_store",IDBObjectStore,["deleteIndex"]),Hc.prototype.objectStore=function(){return new Wc(this._tx.objectStore.apply(this._tx,arguments))},Uc(Hc,"_tx",["objectStoreNames","mode"]),Vc(Hc,"_tx",IDBTransaction,["abort"]),qc.prototype.createObjectStore=function(){return new Wc(this._db.createObjectStore.apply(this._db,arguments))},Uc(qc,"_db",["name","version","objectStoreNames"]),Vc(qc,"_db",IDBDatabase,["deleteObjectStore","close"]),Kc.prototype.transaction=function(){return new Hc(this._db.transaction.apply(this._db,arguments))},Uc(Kc,"_db",["name","version","objectStoreNames"]),Vc(Kc,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach((function(e){[Wc,Bc].forEach((function(t){e in t.prototype&&(t.prototype[e.replace("open","iterate")]=function(){var t=xc(arguments),n=t[t.length-1],r=this._store||this._index,i=r[e].apply(r,t.slice(0,-1));i.onsuccess=function(){n(i.result)}})}))})),[Bc,Wc].forEach((function(e){e.prototype.getAll||(e.prototype.getAll=function(e,t){var n=this,r=[];return new Promise((function(i){n.iterateCursor(e,(function(e){e?(r.push(e.value),void 0===t||r.length!=t?e.continue():i(r)):i(r)}))}))})}));const Gc=new no("installations","Installations",{"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."});function Jc(e){return e instanceof to&&e.code.includes("request-failed")}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xc({projectId:e}){return`https://firebaseinstallations.googleapis.com/v1/projects/${e}/installations`}function Yc(e){return{token:e.token,requestStatus:2,expiresIn:(t=e.expiresIn,Number(t.replace("s","000"))),creationTime:Date.now()};var t}async function Zc(e,t){const n=(await t.json()).error;return Gc.create("request-failed",{requestName:e,serverCode:n.code,serverMessage:n.message,serverStatus:n.status})}function Qc({apiKey:e}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e})}function el(e,{refreshToken:t}){const n=Qc(e);return n.append("Authorization",function(e){return`FIS_v2 ${e}`}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(t)),n}async function tl(e){const t=await e();return t.status>=500&&t.status<600?e():t}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function nl(e){return new Promise((t=>{setTimeout(t,e)}))}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const rl=/^[cdef][\w-]{21}$/;function il(){try{const e=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(e),e[0]=112+e[0]%16;const t=function(e){return(t=e,btoa(String.fromCharCode(...t)).replace(/\+/g,"-").replace(/\//g,"_")).substr(0,22);var t}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e);return rl.test(t)?t:""}catch(e){return""}}function ol(e){return`${e.appName}!${e.appId}`}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sl=new Map;function al(e,t){const n=ol(e);cl(n,t),function(e,t){const n=function(){!ll&&"BroadcastChannel"in self&&(ll=new BroadcastChannel("[Firebase] FID Change"),ll.onmessage=e=>{cl(e.data.key,e.data.fid)});return ll}();n&&n.postMessage({key:e,fid:t});0===sl.size&&ll&&(ll.close(),ll=null)}(n,t)}function cl(e,t){const n=sl.get(e);if(n)for(const r of n)r(t)}let ll=null;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ul="firebase-installations-store";let dl=null;function hl(){var e,t,n;return dl||(e=e=>{switch(e.oldVersion){case 0:e.createObjectStore(ul)}},t=Dc(indexedDB,"open",["firebase-installations-database",1]),(n=t.request)&&(n.onupgradeneeded=function(t){e&&e(new qc(n.result,t.oldVersion,n.transaction))}),dl=t.then((function(e){return new Kc(e)}))),dl}async function pl(e,t){const n=ol(e),r=(await hl()).transaction(ul,"readwrite"),i=r.objectStore(ul),o=await i.get(n);return await i.put(t,n),await r.complete,o&&o.fid===t.fid||al(e,t.fid),t}async function fl(e){const t=ol(e),n=(await hl()).transaction(ul,"readwrite");await n.objectStore(ul).delete(t),await n.complete}async function ml(e,t){const n=ol(e),r=(await hl()).transaction(ul,"readwrite"),i=r.objectStore(ul),o=await i.get(n),s=t(o);return void 0===s?await i.delete(n):await i.put(s,n),await r.complete,!s||o&&o.fid===s.fid||al(e,s.fid),s}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function gl(e){let t;const n=await ml(e,(n=>{const r=function(e){return _l(e||{fid:il(),registrationStatus:0})}(n),i=function(e,t){if(0===t.registrationStatus){if(!navigator.onLine){return{installationEntry:t,registrationPromise:Promise.reject(Gc.create("app-offline"))}}const n={fid:t.fid,registrationStatus:1,registrationTime:Date.now()};return{installationEntry:n,registrationPromise:async function(e,t){try{return pl(e,await async function(e,{fid:t}){const n=Xc(e),r=Qc(e),i={fid:t,authVersion:"FIS_v2",appId:e.appId,sdkVersion:"w:0.5.0"},o={method:"POST",headers:r,body:JSON.stringify(i)},s=await tl((()=>fetch(n,o)));if(s.ok){const e=await s.json();return{fid:e.fid||t,registrationStatus:2,refreshToken:e.refreshToken,authToken:Yc(e.authToken)}}throw await Zc("Create Installation",s)}(e,t))}catch(n){throw Jc(n)&&409===n.customData.serverCode?await fl(e):await pl(e,{fid:t.fid,registrationStatus:0}),n}}(e,n)}}return 1===t.registrationStatus?{installationEntry:t,registrationPromise:vl(e)}:{installationEntry:t}}(e,r);return t=i.registrationPromise,i.installationEntry}));return""===n.fid?{installationEntry:await t}:{installationEntry:n,registrationPromise:t}}async function vl(e){let t=await yl(e);for(;1===t.registrationStatus;)await nl(100),t=await yl(e);if(0===t.registrationStatus){const{installationEntry:t,registrationPromise:n}=await gl(e);return n||t}return t}function yl(e){return ml(e,(e=>{if(!e)throw Gc.create("installation-not-found");return _l(e)}))}function _l(e){return 1===(t=e).registrationStatus&&t.registrationTime+1e4<Date.now()?{fid:e.fid,registrationStatus:0}:e;var t;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}async function bl({appConfig:e,platformLoggerProvider:t},n){const r=function(e,{fid:t}){return`${Xc(e)}/${t}/authTokens:generate`}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e,n),i=el(e,n),o=t.getImmediate({optional:!0});o&&i.append("x-firebase-client",o.getPlatformInfoString());const s={installation:{sdkVersion:"w:0.5.0"}},a={method:"POST",headers:i,body:JSON.stringify(s)},c=await tl((()=>fetch(r,a)));if(c.ok){return Yc(await c.json())}throw await Zc("Generate Auth Token",c)}async function wl(e,t=!1){let n;const r=await ml(e.appConfig,(r=>{if(!El(r))throw Gc.create("not-registered");const i=r.authToken;if(!t&&function(e){return 2===e.requestStatus&&!function(e){const t=Date.now();return t<e.creationTime||e.creationTime+e.expiresIn<t+36e5}(e)}(i))return r;if(1===i.requestStatus)return n=async function(e,t){let n=await Il(e.appConfig);for(;1===n.authToken.requestStatus;)await nl(100),n=await Il(e.appConfig);const r=n.authToken;return 0===r.requestStatus?wl(e,t):r}(e,t),r;{if(!navigator.onLine)throw Gc.create("app-offline");const t=function(e){const t={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},e),{authToken:t})}(r);return n=async function(e,t){try{const n=await bl(e,t),r=Object.assign(Object.assign({},t),{authToken:n});return await pl(e.appConfig,r),n}catch(n){if(!Jc(n)||401!==n.customData.serverCode&&404!==n.customData.serverCode){const n=Object.assign(Object.assign({},t),{authToken:{requestStatus:0}});await pl(e.appConfig,n)}else await fl(e.appConfig);throw n}}(e,t),t}}));return n?await n:r.authToken}function Il(e){return ml(e,(e=>{if(!El(e))throw Gc.create("not-registered");const t=e.authToken;return 1===(n=t).requestStatus&&n.requestTime+1e4<Date.now()?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e;var n;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}))}function El(e){return void 0!==e&&2===e.registrationStatus}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Tl(e,t=!1){const n=e;await async function(e){const{registrationPromise:t}=await gl(e);t&&await t}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(n.appConfig);return(await wl(n,t)).token}function kl(e){return Gc.create("missing-app-config-values",{valueName:e})}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sl=e=>{const t=xo(e.getProvider("app").getImmediate(),"installations").getImmediate();return{getId:()=>async function(e){const t=e,{installationEntry:n,registrationPromise:r}=await gl(t.appConfig);return r?r.catch(console.error):wl(t).catch(console.error),n.fid}(t),getToken:e=>Tl(t,e)}};Lo(new mo("installations",(e=>{const t=e.getProvider("app").getImmediate();return{app:t,appConfig:function(e){if(!e||!e.options)throw kl("App Configuration");if(!e.name)throw kl("App Name");const t=["projectId","apiKey","appId"];for(const n of t)if(!e.options[n])throw kl(n);return{appName:e.name,projectId:e.options.projectId,apiKey:e.options.apiKey,appId:e.options.appId}}(t),platformLoggerProvider:xo(t,"platform-logger"),_delete:()=>Promise.resolve()}}),"PUBLIC")),Lo(new mo("installations-internal",Sl,"PRIVATE")),Fo("@firebase/installations","0.5.0");
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Cl="https://www.googletagmanager.com/gtag/js",Ol=new So("@firebase/analytics");
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Al(e){return Promise.all(e.map((e=>e.catch((e=>e)))))}function Rl(e,t,n,r){return async function(i,o,s){try{"event"===i?await async function(e,t,n,r,i){try{let o=[];if(i&&i.send_to){let e=i.send_to;Array.isArray(e)||(e=[e]);const r=await Al(n);for(const n of e){const e=r.find((e=>e.measurementId===n)),i=e&&t[e.appId];if(!i){o=[];break}o.push(i)}}0===o.length&&(o=Object.values(t)),await Promise.all(o),e("event",r,i||{})}catch(o){Ol.error(o)}}(e,t,n,o,s):"config"===i?await async function(e,t,n,r,i,o){const s=r[i];try{if(s)await t[s];else{const e=(await Al(n)).find((e=>e.measurementId===i));e&&await t[e.appId]}}catch(a){Ol.error(a)}e("config",i,o)}(e,t,n,r,o,s):e("set",o)}catch(a){Ol.error(a)}}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Pl=new no("analytics","Analytics",{"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-intialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.'});const Nl=new class{constructor(e={},t=1e3){this.throttleMetadata=e,this.intervalMillis=t}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,t){this.throttleMetadata[e]=t}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}};function Ll(e){return new Headers({Accept:"application/json","x-goog-api-key":e})}async function xl(e,t=Nl,n){const{appId:r,apiKey:i,measurementId:o}=e.options;if(!r)throw Pl.create("no-app-id");if(!i){if(o)return{measurementId:o,appId:r};throw Pl.create("no-api-key")}const s=t.getThrottleMetadata(r)||{backoffCount:0,throttleEndTimeMillis:Date.now()},a=new Dl;return setTimeout((async()=>{a.abort()}),void 0!==n?n:6e4),Ml({appId:r,apiKey:i,measurementId:o},s,a,t)}async function Ml(e,{throttleEndTimeMillis:t,backoffCount:n},r,i=Nl){const{appId:o,measurementId:s}=e;try{await function(e,t){return new Promise(((n,r)=>{const i=Math.max(t-Date.now(),0),o=setTimeout(n,i);e.addEventListener((()=>{clearTimeout(o),r(Pl.create("fetch-throttle",{throttleEndTimeMillis:t}))}))}))}(r,t)}catch(a){if(s)return Ol.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${s} provided in the "measurementId" field in the local Firebase config. [${a.message}]`),{appId:o,measurementId:s};throw a}try{const t=await async function(e){var t;const{appId:n,apiKey:r}=e,i={method:"GET",headers:Ll(r)},o="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig".replace("{app-id}",n),s=await fetch(o,i);if(200!==s.status&&304!==s.status){let e="";try{const n=await s.json();(null===(t=n.error)||void 0===t?void 0:t.message)&&(e=n.error.message)}catch(a){}throw Pl.create("config-fetch-failed",{httpStatus:s.status,responseMessage:e})}return s.json()}(e);return i.deleteThrottleMetadata(o),t}catch(a){if(!function(e){if(!(e instanceof to&&e.customData))return!1;const t=Number(e.customData.httpStatus);return 429===t||500===t||503===t||504===t}(a)){if(i.deleteThrottleMetadata(o),s)return Ol.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${s} provided in the "measurementId" field in the local Firebase config. [${a.message}]`),{appId:o,measurementId:s};throw a}const t=503===Number(a.customData.httpStatus)?po(n,i.intervalMillis,30):po(n,i.intervalMillis),c={throttleEndTimeMillis:Date.now()+t,backoffCount:n+1};return i.setThrottleMetadata(o,c),Ol.debug(`Calling attemptFetch again in ${t} millis`),Ml(e,c,r,i)}}class Dl{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach((e=>e()))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function jl(){if(!("indexedDB"in self)||null==indexedDB)return Ol.warn(Pl.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;try{await new Promise((function(e,t){try{var n=!0,r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=function(){i.result.close(),n||self.indexedDB.deleteDatabase(r),e(!0)},i.onupgradeneeded=function(){n=!1},i.onerror=function(){var e;t((null===(e=i.error)||void 0===e?void 0:e.message)||"")}}catch(o){t(o)}}))}catch(e){return Ol.warn(Pl.create("indexeddb-unavailable",{errorInfo:e}).message),!1}return!0}async function Ul(e,t,n,r,i,o,s){var a;const c=xl(e);c.then((t=>{n[t.measurementId]=t.appId,e.options.measurementId&&t.measurementId!==e.options.measurementId&&Ol.warn(`The measurement ID in the local Firebase config (${e.options.measurementId}) does not match the measurement ID fetched from the server (${t.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)})).catch((e=>Ol.error(e))),t.push(c);const l=jl().then((e=>e?r.getId():void 0)),[u,d]=await Promise.all([c,l]);(function(){const e=window.document.getElementsByTagName("script");for(const t of Object.values(e))if(t.src&&t.src.includes(Cl))return t;return null})()||function(e,t){const n=document.createElement("script");n.src=`${Cl}?l=${e}&id=${t}`,n.async=!0,document.head.appendChild(n)}(o,u.measurementId),i("js",new Date);const h=null!==(a=null==s?void 0:s.config)&&void 0!==a?a:{};return h.origin="firebase",h.update=!0,null!=d&&(h.firebase_id=d),i("config",u.measurementId,h),u.measurementId}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fl{constructor(e){this.app=e}_delete(){return delete Vl[this.app.options.appId],Promise.resolve()}}let Vl={},$l=[];const Bl={};let zl,Wl,Hl=!1;function ql(){const e=[];if(eo()&&e.push("This is a browser extension environment."),navigator&&navigator.cookieEnabled||e.push("Cookies are not available."),e.length>0){const t=e.map(((e,t)=>`(${t+1}) ${e}`)).join(" "),n=Pl.create("invalid-analytics-context",{errorInfo:t});Ol.warn(n.message)}}function Kl(e,t,n){ql();const r=e.options.appId;if(!r)throw Pl.create("no-app-id");if(!e.options.apiKey){if(!e.options.measurementId)throw Pl.create("no-api-key");Ol.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${e.options.measurementId} provided in the "measurementId" field in the local Firebase config.`)}if(null!=Vl[r])throw Pl.create("already-exists",{id:r});if(!Hl){!function(e){let t=[];Array.isArray(window[e])?t=window[e]:window[e]=t}("dataLayer");const{wrappedGtag:e,gtagCore:t}=function(e,t,n,r,i){let o=function(...e){window[r].push(arguments)};return window[i]&&"function"==typeof window[i]&&(o=window[i]),window[i]=Rl(o,e,t,n),{gtagCore:o,wrappedGtag:window[i]}}(Vl,$l,Bl,"dataLayer","gtag");Wl=e,zl=t,Hl=!0}Vl[r]=Ul(e,$l,Bl,t,zl,"dataLayer",n);return new Fl(e)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gl(e=Uo()){const t=xo(e=fo(e),"analytics");return t.isInitialized()?t.getImmediate():function(e,t={}){const n=xo(e,"analytics");if(n.isInitialized()){const e=n.getImmediate();if(oo(t,n.getOptions()))return e;throw Pl.create("already-initialized")}return n.initialize({options:t})}(e)}function Jl(e,t,n,r){e=fo(e),async function(e,t,n,r,i){if(i&&i.global)e("event",n,r);else{const i=await t;e("event",n,Object.assign(Object.assign({},r),{send_to:i}))}}(Wl,Vl[e.app.options.appId],t,n,r).catch((e=>Ol.error(e)))}Lo(new mo("analytics",((e,{options:t})=>Kl(e.getProvider("app").getImmediate(),e.getProvider("installations-internal").getImmediate(),t)),"PUBLIC")),Lo(new mo("analytics-internal",(function(e){try{const t=e.getProvider("analytics").getImmediate();return{logEvent:(e,n,r)=>Jl(t,e,n,r)}}catch(t){throw Pl.create("interop-component-reg-failed",{reason:t})}}),"PRIVATE")),Fo("@firebase/analytics","0.7.0");export{ir as F,Oi as T,Ir as a,_r as b,pr as c,c as d,tr as e,wr as f,Ui as g,cc as h,Wn as i,Pc as j,Fi as k,aa as l,Sr as m,ca as n,ur as o,en as p,jo as q,Cr as r,sa as s,Or as t,Gl as u,Mi as v,Lt as w,zi as x};
