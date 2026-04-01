import{r as y,_ as b,C as T,a as S,E as J,o as be,F as Q,g as D,b as Te,d as Ae,L as ve,i as Se,c as ke,v as Ee,e as x,f as Ce,G as Re,h as Pe,j as _e}from"./index-BPYGS7dv.js";var Fe="firebase",De="12.4.0";/**
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
 */y(Fe,De,"app");const X="@firebase/installations",$="0.6.19";/**
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
 */const Z=1e4,ee=`w:${$}`,te="FIS_v2",$e="https://firebaseinstallations.googleapis.com/v1",Me=60*60*1e3,Oe="installations",Le="Installations";/**
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
 */const Ne={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},m=new J(Oe,Le,Ne);function ne(e){return e instanceof Q&&e.code.includes("request-failed")}/**
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
 */function ae({projectId:e}){return`${$e}/projects/${e}/installations`}function ie(e){return{token:e.token,requestStatus:2,expiresIn:xe(e.expiresIn),creationTime:Date.now()}}async function se(e,t){const a=(await t.json()).error;return m.create("request-failed",{requestName:e,serverCode:a.code,serverMessage:a.message,serverStatus:a.status})}function re({apiKey:e}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e})}function je(e,{refreshToken:t}){const n=re(e);return n.append("Authorization",qe(t)),n}async function oe(e){const t=await e();return t.status>=500&&t.status<600?e():t}function xe(e){return Number(e.replace("s","000"))}function qe(e){return`${te} ${e}`}/**
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
 */async function Ue({appConfig:e,heartbeatServiceProvider:t},{fid:n}){const a=ae(e),i=re(e),s=t.getImmediate({optional:!0});if(s){const l=await s.getHeartbeatsHeader();l&&i.append("x-firebase-client",l)}const r={fid:n,authVersion:te,appId:e.appId,sdkVersion:ee},o={method:"POST",headers:i,body:JSON.stringify(r)},c=await oe(()=>fetch(a,o));if(c.ok){const l=await c.json();return{fid:l.fid||n,registrationStatus:2,refreshToken:l.refreshToken,authToken:ie(l.authToken)}}else throw await se("Create Installation",c)}/**
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
 */function ce(e){return new Promise(t=>{setTimeout(t,e)})}/**
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
 */function Be(e){return btoa(String.fromCharCode(...e)).replace(/\+/g,"-").replace(/\//g,"_")}/**
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
 */const Ve=/^[cdef][\w-]{21}$/,F="";function ze(){try{const e=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(e),e[0]=112+e[0]%16;const n=Ge(e);return Ve.test(n)?n:F}catch{return F}}function Ge(e){return Be(e).substr(0,22)}/**
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
 */function k(e){return`${e.appName}!${e.appId}`}/**
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
 */const le=new Map;function ue(e,t){const n=k(e);de(n,t),Ke(n,t)}function de(e,t){const n=le.get(e);if(n)for(const a of n)a(t)}function Ke(e,t){const n=He();n&&n.postMessage({key:e,fid:t}),We()}let h=null;function He(){return!h&&"BroadcastChannel"in self&&(h=new BroadcastChannel("[Firebase] FID Change"),h.onmessage=e=>{de(e.data.key,e.data.fid)}),h}function We(){le.size===0&&h&&(h.close(),h=null)}/**
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
 */const Ye="firebase-installations-database",Je=1,w="firebase-installations-store";let R=null;function M(){return R||(R=be(Ye,Je,{upgrade:(e,t)=>{switch(t){case 0:e.createObjectStore(w)}}})),R}async function A(e,t){const n=k(e),i=(await M()).transaction(w,"readwrite"),s=i.objectStore(w),r=await s.get(n);return await s.put(t,n),await i.done,(!r||r.fid!==t.fid)&&ue(e,t.fid),t}async function fe(e){const t=k(e),a=(await M()).transaction(w,"readwrite");await a.objectStore(w).delete(t),await a.done}async function E(e,t){const n=k(e),i=(await M()).transaction(w,"readwrite"),s=i.objectStore(w),r=await s.get(n),o=t(r);return o===void 0?await s.delete(n):await s.put(o,n),await i.done,o&&(!r||r.fid!==o.fid)&&ue(e,o.fid),o}/**
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
 */async function O(e){let t;const n=await E(e.appConfig,a=>{const i=Qe(a),s=Xe(e,i);return t=s.registrationPromise,s.installationEntry});return n.fid===F?{installationEntry:await t}:{installationEntry:n,registrationPromise:t}}function Qe(e){const t=e||{fid:ze(),registrationStatus:0};return pe(t)}function Xe(e,t){if(t.registrationStatus===0){if(!navigator.onLine){const i=Promise.reject(m.create("app-offline"));return{installationEntry:t,registrationPromise:i}}const n={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},a=Ze(e,n);return{installationEntry:n,registrationPromise:a}}else return t.registrationStatus===1?{installationEntry:t,registrationPromise:et(e)}:{installationEntry:t}}async function Ze(e,t){try{const n=await Ue(e,t);return A(e.appConfig,n)}catch(n){throw ne(n)&&n.customData.serverCode===409?await fe(e.appConfig):await A(e.appConfig,{fid:t.fid,registrationStatus:0}),n}}async function et(e){let t=await q(e.appConfig);for(;t.registrationStatus===1;)await ce(100),t=await q(e.appConfig);if(t.registrationStatus===0){const{installationEntry:n,registrationPromise:a}=await O(e);return a||n}return t}function q(e){return E(e,t=>{if(!t)throw m.create("installation-not-found");return pe(t)})}function pe(e){return tt(e)?{fid:e.fid,registrationStatus:0}:e}function tt(e){return e.registrationStatus===1&&e.registrationTime+Z<Date.now()}/**
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
 */async function nt({appConfig:e,heartbeatServiceProvider:t},n){const a=at(e,n),i=je(e,n),s=t.getImmediate({optional:!0});if(s){const l=await s.getHeartbeatsHeader();l&&i.append("x-firebase-client",l)}const r={installation:{sdkVersion:ee,appId:e.appId}},o={method:"POST",headers:i,body:JSON.stringify(r)},c=await oe(()=>fetch(a,o));if(c.ok){const l=await c.json();return ie(l)}else throw await se("Generate Auth Token",c)}function at(e,{fid:t}){return`${ae(e)}/${t}/authTokens:generate`}/**
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
 */async function L(e,t=!1){let n;const a=await E(e.appConfig,s=>{if(!ge(s))throw m.create("not-registered");const r=s.authToken;if(!t&&rt(r))return s;if(r.requestStatus===1)return n=it(e,t),s;{if(!navigator.onLine)throw m.create("app-offline");const o=ct(s);return n=st(e,o),o}});return n?await n:a.authToken}async function it(e,t){let n=await U(e.appConfig);for(;n.authToken.requestStatus===1;)await ce(100),n=await U(e.appConfig);const a=n.authToken;return a.requestStatus===0?L(e,t):a}function U(e){return E(e,t=>{if(!ge(t))throw m.create("not-registered");const n=t.authToken;return lt(n)?{...t,authToken:{requestStatus:0}}:t})}async function st(e,t){try{const n=await nt(e,t),a={...t,authToken:n};return await A(e.appConfig,a),n}catch(n){if(ne(n)&&(n.customData.serverCode===401||n.customData.serverCode===404))await fe(e.appConfig);else{const a={...t,authToken:{requestStatus:0}};await A(e.appConfig,a)}throw n}}function ge(e){return e!==void 0&&e.registrationStatus===2}function rt(e){return e.requestStatus===2&&!ot(e)}function ot(e){const t=Date.now();return t<e.creationTime||e.creationTime+e.expiresIn<t+Me}function ct(e){const t={requestStatus:1,requestTime:Date.now()};return{...e,authToken:t}}function lt(e){return e.requestStatus===1&&e.requestTime+Z<Date.now()}/**
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
 */async function ut(e){const t=e,{installationEntry:n,registrationPromise:a}=await O(t);return a?a.catch(console.error):L(t).catch(console.error),n.fid}/**
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
 */async function dt(e,t=!1){const n=e;return await ft(n),(await L(n,t)).token}async function ft(e){const{registrationPromise:t}=await O(e);t&&await t}/**
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
 */function pt(e){if(!e||!e.options)throw P("App Configuration");if(!e.name)throw P("App Name");const t=["projectId","apiKey","appId"];for(const n of t)if(!e.options[n])throw P(n);return{appName:e.name,projectId:e.options.projectId,apiKey:e.options.apiKey,appId:e.options.appId}}function P(e){return m.create("missing-app-config-values",{valueName:e})}/**
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
 */const he="installations",gt="installations-internal",ht=e=>{const t=e.getProvider("app").getImmediate(),n=pt(t),a=S(t,"heartbeat");return{app:t,appConfig:n,heartbeatServiceProvider:a,_delete:()=>Promise.resolve()}},mt=e=>{const t=e.getProvider("app").getImmediate(),n=S(t,he).getImmediate();return{getId:()=>ut(n),getToken:i=>dt(n,i)}};function wt(){b(new T(he,ht,"PUBLIC")),b(new T(gt,mt,"PRIVATE"))}wt();y(X,$);y(X,$,"esm2020");/**
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
 */const v="analytics",It="firebase_id",yt="origin",bt=60*1e3,Tt="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",N="https://www.googletagmanager.com/gtag/js";/**
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
 */const u=new ve("@firebase/analytics");/**
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
 */const At={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},d=new J("analytics","Analytics",At);/**
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
 */function vt(e){if(!e.startsWith(N)){const t=d.create("invalid-gtag-resource",{gtagURL:e});return u.warn(t.message),""}return e}function me(e){return Promise.all(e.map(t=>t.catch(n=>n)))}function St(e,t){let n;return window.trustedTypes&&(n=window.trustedTypes.createPolicy(e,t)),n}function kt(e,t){const n=St("firebase-js-sdk-policy",{createScriptURL:vt}),a=document.createElement("script"),i=`${N}?l=${e}&id=${t}`;a.src=n?n==null?void 0:n.createScriptURL(i):i,a.async=!0,document.head.appendChild(a)}function Et(e){let t=[];return Array.isArray(window[e])?t=window[e]:window[e]=t,t}async function Ct(e,t,n,a,i,s){const r=a[i];try{if(r)await t[r];else{const c=(await me(n)).find(l=>l.measurementId===i);c&&await t[c.appId]}}catch(o){u.error(o)}e("config",i,s)}async function Rt(e,t,n,a,i){try{let s=[];if(i&&i.send_to){let r=i.send_to;Array.isArray(r)||(r=[r]);const o=await me(n);for(const c of r){const l=o.find(p=>p.measurementId===c),f=l&&t[l.appId];if(f)s.push(f);else{s=[];break}}}s.length===0&&(s=Object.values(t)),await Promise.all(s),e("event",a,i||{})}catch(s){u.error(s)}}function Pt(e,t,n,a){async function i(s,...r){try{if(s==="event"){const[o,c]=r;await Rt(e,t,n,o,c)}else if(s==="config"){const[o,c]=r;await Ct(e,t,n,a,o,c)}else if(s==="consent"){const[o,c]=r;e("consent",o,c)}else if(s==="get"){const[o,c,l]=r;e("get",o,c,l)}else if(s==="set"){const[o]=r;e("set",o)}else e(s,...r)}catch(o){u.error(o)}}return i}function _t(e,t,n,a,i){let s=function(...r){window[a].push(arguments)};return window[i]&&typeof window[i]=="function"&&(s=window[i]),window[i]=Pt(s,e,t,n),{gtagCore:s,wrappedGtag:window[i]}}function Ft(e){const t=window.document.getElementsByTagName("script");for(const n of Object.values(t))if(n.src&&n.src.includes(N)&&n.src.includes(e))return n;return null}/**
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
 */const Dt=30,$t=1e3;class Mt{constructor(t={},n=$t){this.throttleMetadata=t,this.intervalMillis=n}getThrottleMetadata(t){return this.throttleMetadata[t]}setThrottleMetadata(t,n){this.throttleMetadata[t]=n}deleteThrottleMetadata(t){delete this.throttleMetadata[t]}}const we=new Mt;function Ot(e){return new Headers({Accept:"application/json","x-goog-api-key":e})}async function Lt(e){var r;const{appId:t,apiKey:n}=e,a={method:"GET",headers:Ot(n)},i=Tt.replace("{app-id}",t),s=await fetch(i,a);if(s.status!==200&&s.status!==304){let o="";try{const c=await s.json();(r=c.error)!=null&&r.message&&(o=c.error.message)}catch{}throw d.create("config-fetch-failed",{httpStatus:s.status,responseMessage:o})}return s.json()}async function Nt(e,t=we,n){const{appId:a,apiKey:i,measurementId:s}=e.options;if(!a)throw d.create("no-app-id");if(!i){if(s)return{measurementId:s,appId:a};throw d.create("no-api-key")}const r=t.getThrottleMetadata(a)||{backoffCount:0,throttleEndTimeMillis:Date.now()},o=new qt;return setTimeout(async()=>{o.abort()},bt),Ie({appId:a,apiKey:i,measurementId:s},r,o,t)}async function Ie(e,{throttleEndTimeMillis:t,backoffCount:n},a,i=we){var o;const{appId:s,measurementId:r}=e;try{await jt(a,t)}catch(c){if(r)return u.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${r} provided in the "measurementId" field in the local Firebase config. [${c==null?void 0:c.message}]`),{appId:s,measurementId:r};throw c}try{const c=await Lt(e);return i.deleteThrottleMetadata(s),c}catch(c){const l=c;if(!xt(l)){if(i.deleteThrottleMetadata(s),r)return u.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${r} provided in the "measurementId" field in the local Firebase config. [${l==null?void 0:l.message}]`),{appId:s,measurementId:r};throw c}const f=Number((o=l==null?void 0:l.customData)==null?void 0:o.httpStatus)===503?x(n,i.intervalMillis,Dt):x(n,i.intervalMillis),p={throttleEndTimeMillis:Date.now()+f,backoffCount:n+1};return i.setThrottleMetadata(s,p),u.debug(`Calling attemptFetch again in ${f} millis`),Ie(e,p,a,i)}}function jt(e,t){return new Promise((n,a)=>{const i=Math.max(t-Date.now(),0),s=setTimeout(n,i);e.addEventListener(()=>{clearTimeout(s),a(d.create("fetch-throttle",{throttleEndTimeMillis:t}))})})}function xt(e){if(!(e instanceof Q)||!e.customData)return!1;const t=Number(e.customData.httpStatus);return t===429||t===500||t===503||t===504}class qt{constructor(){this.listeners=[]}addEventListener(t){this.listeners.push(t)}abort(){this.listeners.forEach(t=>t())}}async function Ut(e,t,n,a,i){if(i&&i.global){e("event",n,a);return}else{const s=await t,r={...a,send_to:s};e("event",n,r)}}async function Bt(e,t,n,a){if(a&&a.global){const i={};for(const s of Object.keys(n))i[`user_properties.${s}`]=n[s];return e("set",i),Promise.resolve()}else{const i=await t;e("config",i,{update:!0,user_properties:n})}}/**
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
 */async function Vt(){if(ke())try{await Ee()}catch(e){return u.warn(d.create("indexeddb-unavailable",{errorInfo:e==null?void 0:e.toString()}).message),!1}else return u.warn(d.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function zt(e,t,n,a,i,s,r){const o=Nt(e);o.then(g=>{n[g.measurementId]=g.appId,e.options.measurementId&&g.measurementId!==e.options.measurementId&&u.warn(`The measurement ID in the local Firebase config (${e.options.measurementId}) does not match the measurement ID fetched from the server (${g.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(g=>u.error(g)),t.push(o);const c=Vt().then(g=>{if(g)return a.getId()}),[l,f]=await Promise.all([o,c]);Ft(s)||kt(s,l.measurementId),i("js",new Date);const p=(r==null?void 0:r.config)??{};return p[yt]="firebase",p.update=!0,f!=null&&(p[It]=f),i("config",l.measurementId,p),l.measurementId}/**
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
 */class Gt{constructor(t){this.app=t}_delete(){return delete I[this.app.options.appId],Promise.resolve()}}let I={},B=[];const V={};let _="dataLayer",Kt="gtag",z,j,G=!1;function Ht(){const e=[];if(Se()&&e.push("This is a browser extension environment."),Ce()||e.push("Cookies are not available."),e.length>0){const t=e.map((a,i)=>`(${i+1}) ${a}`).join(" "),n=d.create("invalid-analytics-context",{errorInfo:t});u.warn(n.message)}}function Wt(e,t,n){Ht();const a=e.options.appId;if(!a)throw d.create("no-app-id");if(!e.options.apiKey)if(e.options.measurementId)u.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${e.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw d.create("no-api-key");if(I[a]!=null)throw d.create("already-exists",{id:a});if(!G){Et(_);const{wrappedGtag:s,gtagCore:r}=_t(I,B,V,_,Kt);j=s,z=r,G=!0}return I[a]=zt(e,B,V,t,z,_,n),new Gt(e)}function Yt(e=Te()){e=D(e);const t=S(e,v);return t.isInitialized()?t.getImmediate():Jt(e)}function Jt(e,t={}){const n=S(e,v);if(n.isInitialized()){const i=n.getImmediate();if(Ae(t,n.getOptions()))return i;throw d.create("already-initialized")}return n.initialize({options:t})}function Qt(e,t,n){e=D(e),Bt(j,I[e.app.options.appId],t,n).catch(a=>u.error(a))}function Xt(e,t,n,a){e=D(e),Ut(j,I[e.app.options.appId],t,n,a).catch(i=>u.error(i))}const K="@firebase/analytics",H="0.10.19";function Zt(){b(new T(v,(t,{options:n})=>{const a=t.getProvider("app").getImmediate(),i=t.getProvider("installations-internal").getImmediate();return Wt(a,i,n)},"PUBLIC")),b(new T("analytics-internal",e,"PRIVATE")),y(K,H),y(K,H,"esm2020");function e(t){try{const n=t.getProvider(v).getImmediate();return{logEvent:(a,i,s)=>Xt(n,a,i,s),setUserProperties:(a,i)=>Qt(n,a,i)}}catch(n){throw d.create("interop-component-reg-failed",{reason:n})}}}Zt();const C={apiKey:"AIzaSyAjJNgtAUcaBOLv-Lv3y8IUCdQaZLTl1S4",authDomain:"sanjay-91691.firebaseapp.com",projectId:"sanjay-91691",storageBucket:"sanjay-91691.firebasestorage.app",messagingSenderId:"501359412230",appId:"1:501359412230:web:26b32c2d5d4790a25c2f87",measurementId:"G-050CVLQ2VF"},en=["apiKey","authDomain","projectId","appId"],W=en.filter(e=>!C[e]);if(W.length>0)throw new Error(`Missing Firebase env values: ${W.join(", ")}`);const Y=Object.entries(C).filter(([,e])=>typeof e=="string"&&e.startsWith("PASTE_")).map(([e])=>e);if(Y.length>0)throw new Error(`Replace placeholder Firebase env values: ${Y.join(", ")}`);const ye=Pe(C),nn=_e(ye),an=new Re,sn=typeof window<"u"&&C.measurementId?Yt(ye):null;export{sn as analytics,ye as app,nn as auth,an as googleProvider};
