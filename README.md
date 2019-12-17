# cdn
아이웍스 인터렉티브 CDN
* /{컴포넌트}@{버전}/{업로드파일} 형식으로 등록해 주십시오.
    - 예)/security@1.0.0/security.min.js
* 등록된 파일은 아래와 같이 jsDelivr CDN으로 등록됩니다.
    - 예) https://cdn.jsdelivr.net/gh/iworks-interactive/cdn/security@1.0.0/security.min.js
* GitHub에 등록후 반드시 한번은 브라우저로 CDN 주소를 호출해야 Cache에 저장됩니다.

주요 CDN
* IE에서 지원되지 않는 API CDN
    - polifill : https://cdn.jsdelivr.net/npm/promise-polyfill@8.1/dist/polyfill.min.js
    - fetch : https://cdn.jsdelivr.net/npm/whatwg-fetch@3.0/dist/fetch.umd.min.js
    - formdata : https://cdn.jsdelivr.net/npm/formdata-polyfill@3.0.19/formdata.min.js
    - forge : https://cdn.jsdelivr.net/npm/node-forge@0.9.1/dist/forge.min.js
* 유용한 CDN
    - jquery : https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.4.1.min.js
    - babel : https://unpkg.com/@babel/standalone@7.7.6/babel.min.js
        - babel 사용시 <code><script type="text/babel" data-presets="es2015,stage-2"></code> or <code><script type="text/babel" src="foo.js"></script></code>