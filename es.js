self.tagParams=function(e){"use strict";return e.default=(e,t)=>{const{template:s,values:n}=(e=>{const t=[],s=[],{length:n}=e;let r=0;for(;r<=n;){let u=e.indexOf("${",r);if(-1<u){t.push(e.slice(r,u)),u=r=u+2;let l=1;for(;r<n;){const t=e[r++];if(l+="{"===t?1:"}"===t?-1:0,l<1)break}s.push(e.slice(u,r-1))}else t.push(e.slice(r)),r=n+1}return{template:t,values:s}})(e);return[s].concat(Function((t?"with(arguments[0])":"")+("return["+n+"]"))(t))},e}({}).default;
