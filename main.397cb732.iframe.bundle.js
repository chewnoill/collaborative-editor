(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{307:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return Editor}));var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(0),react__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__),yjs__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(35),y_codemirror__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(477),y_webrtc__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(475),codemirror__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(101),codemirror__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(codemirror__WEBPACK_IMPORTED_MODULE_4__),y_websocket__WEBPACK_IMPORTED_MODULE_7__=(__webpack_require__(854),__webpack_require__(857),__webpack_require__(476)),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__(83),SIGNALLING_SERVICE=Object({NODE_ENV:"production",NODE_PATH:[],STORYBOOK:"true",PUBLIC_URL:".",DATABASE_URL:"postgres://postgres:password@127.0.0.1:5432/postgres?sslmode=disable"}).STORYBOOK_SIGNAL_URL||"ws://localhost:6006/ws";function Editor(){var ref=react__WEBPACK_IMPORTED_MODULE_0___default.a.useRef();return react__WEBPACK_IMPORTED_MODULE_0___default.a.useEffect((function(){var ydoc=new yjs__WEBPACK_IMPORTED_MODULE_1__.a,provider=new y_webrtc__WEBPACK_IMPORTED_MODULE_3__.a("new-room",ydoc,{signaling:[SIGNALLING_SERVICE]}),yText=ydoc.getText("codemirror"),yUndoManager=new yjs__WEBPACK_IMPORTED_MODULE_1__.b(yText);new y_websocket__WEBPACK_IMPORTED_MODULE_7__.a(SIGNALLING_SERVICE,"new-room",ydoc).on("status",(function(event){console.log(event.status)}));var editor=codemirror__WEBPACK_IMPORTED_MODULE_4___default()(ref.current,{mode:"markdown",lineNumbers:!0});new y_codemirror__WEBPACK_IMPORTED_MODULE_2__.a(yText,editor,provider.awareness,{yUndoManager:yUndoManager})}),[ref]),Object(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div",{ref:ref})}Editor.displayName="Editor"},497:function(module,exports,__webpack_require__){__webpack_require__(498),__webpack_require__(654),__webpack_require__(655),__webpack_require__(873),__webpack_require__(871),__webpack_require__(876),__webpack_require__(877),__webpack_require__(874),__webpack_require__(872),__webpack_require__(878),__webpack_require__(879),module.exports=__webpack_require__(851)},565:function(module,exports){},655:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__(357)},851:function(module,exports,__webpack_require__){"use strict";(function(module){(0,__webpack_require__(357).configure)([__webpack_require__(852),__webpack_require__(870)],module,!1)}).call(this,__webpack_require__(212)(module))},852:function(module,exports,__webpack_require__){var map={"./stories/editor.stories.mdx":853,"./stories/login.stories.mdx":875,"./stories/readme.stories.mdx":880};function webpackContext(req){var id=webpackContextResolve(req);return __webpack_require__(id)}function webpackContextResolve(req){if(!__webpack_require__.o(map,req)){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}return map[req]}webpackContext.keys=function webpackContextKeys(){return Object.keys(map)},webpackContext.resolve=webpackContextResolve,module.exports=webpackContext,webpackContext.id=852},853:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"__page",(function(){return __page}));__webpack_require__(17),__webpack_require__(29),__webpack_require__(37),__webpack_require__(12),__webpack_require__(0);var _mdx_js_react__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(32),_storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(64),_editor__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__(307),_excluded=["components"];function _extends(){return(_extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target}).apply(this,arguments)}function _objectWithoutProperties(source,excluded){if(null==source)return{};var key,i,target=function _objectWithoutPropertiesLoose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],excluded.indexOf(key)>=0||Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}var layoutProps={};function MDXContent(_ref){var components=_ref.components,props=_objectWithoutProperties(_ref,_excluded);return Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_5__.b)("wrapper",_extends({},layoutProps,props,{components:components,mdxType:"MDXLayout"}),Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_5__.b)(_storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_6__.c,{title:"Editor",mdxType:"Meta"}),Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_5__.b)(_editor__WEBPACK_IMPORTED_MODULE_7__.a,{mdxType:"Editor"}))}MDXContent.displayName="MDXContent",MDXContent.isMDXComponent=!0;var __page=function __page(){throw new Error("Docs-only story")};__page.parameters={docsOnly:!0};var componentMeta={title:"Editor",includeStories:["__page"]},mdxStoryNameToKey={};componentMeta.parameters=componentMeta.parameters||{},componentMeta.parameters.docs=Object.assign({},componentMeta.parameters.docs||{},{page:function page(){return Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_5__.b)(_storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_6__.a,{mdxStoryNameToKey:mdxStoryNameToKey,mdxComponentMeta:componentMeta},Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_5__.b)(MDXContent,null))}}),__webpack_exports__.default=componentMeta},870:function(module,exports){function webpackEmptyContext(req){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}webpackEmptyContext.keys=function(){return[]},webpackEmptyContext.resolve=webpackEmptyContext,module.exports=webpackEmptyContext,webpackEmptyContext.id=870},875:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"__page",(function(){return __page}));__webpack_require__(17),__webpack_require__(29),__webpack_require__(37),__webpack_require__(12);var react=__webpack_require__(0),react_default=__webpack_require__.n(react),esm=__webpack_require__(32),blocks=__webpack_require__(64),browser=(__webpack_require__(866),__webpack_require__(48),__webpack_require__(21),__webpack_require__(129),__webpack_require__(52),__webpack_require__(51),__webpack_require__(58),__webpack_require__(67),__webpack_require__(13),__webpack_require__(160),__webpack_require__(474)),browser_default=__webpack_require__.n(browser),jsx_runtime=__webpack_require__(83);function _slicedToArray(arr,i){return function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}(arr)||function _iterableToArrayLimit(arr,i){var _i=arr&&("undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"]);if(null==_i)return;var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}(arr,i)||function _unsupportedIterableToArray(o,minLen){if(!o)return;if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(o);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}(arr,i)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function Me(){var _React$useState2=_slicedToArray(react_default.a.useState(null),2),me=_React$useState2[0],setMe=_React$useState2[1];return react_default.a.useEffect((function(){browser_default()("/api/me").then((function(data){return data.json()})).then((function(data){data.user&&setMe(data.user)}))}),[]),console.log({me:me}),Object(jsx_runtime.jsx)("label",{children:(null==me?void 0:me.username)||"not logged in"})}Me.displayName="Me";var _templateObject;__webpack_require__(869),__webpack_require__(445);var Form=__webpack_require__(231).a.form(_templateObject||(_templateObject=function _taggedTemplateLiteral(strings,raw){return raw||(raw=strings.slice(0)),Object.freeze(Object.defineProperties(strings,{raw:{value:Object.freeze(raw)}}))}(["\n  display: flex;\n  flex-direction: column;\n"])));function LoginForm(){return Object(jsx_runtime.jsxs)(Form,{action:"/api/login",method:"post",children:[Object(jsx_runtime.jsx)("label",{children:"username"})," ",Object(jsx_runtime.jsx)("input",{name:"username",type:"text"}),Object(jsx_runtime.jsx)("label",{children:"password"})," ",Object(jsx_runtime.jsx)("input",{name:"password",type:"password"}),Object(jsx_runtime.jsx)("button",{type:"submit",children:"submit"})]})}LoginForm.displayName="LoginForm";var _excluded=["components"];function _extends(){return(_extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target}).apply(this,arguments)}function _objectWithoutProperties(source,excluded){if(null==source)return{};var key,i,target=function _objectWithoutPropertiesLoose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],excluded.indexOf(key)>=0||Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}var layoutProps={};function MDXContent(_ref){var components=_ref.components,props=_objectWithoutProperties(_ref,_excluded);return Object(esm.b)("wrapper",_extends({},layoutProps,props,{components:components,mdxType:"MDXLayout"}),Object(esm.b)(blocks.c,{title:"Auth",mdxType:"Meta"}),Object(esm.b)("h1",{id:"logging-in"},"Logging in."),Object(esm.b)("p",null,"Enter credentials below and click submit.\nThis should set a cookie in your local session\nthat will be used to authenticate the current\nuser."),Object(esm.b)(LoginForm,{mdxType:"Login"}),Object(esm.b)("p",null,'You are currently logged in as "',Object(esm.b)(Me,{mdxType:"Me"}),'"'))}MDXContent.displayName="MDXContent",MDXContent.isMDXComponent=!0;var __page=function __page(){throw new Error("Docs-only story")};__page.parameters={docsOnly:!0};var componentMeta={title:"Auth",includeStories:["__page"]},mdxStoryNameToKey={};componentMeta.parameters=componentMeta.parameters||{},componentMeta.parameters.docs=Object.assign({},componentMeta.parameters.docs||{},{page:function page(){return Object(esm.b)(blocks.a,{mdxStoryNameToKey:mdxStoryNameToKey,mdxComponentMeta:componentMeta},Object(esm.b)(MDXContent,null))}});__webpack_exports__.default=componentMeta},879:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var preview_namespaceObject={};__webpack_require__.r(preview_namespaceObject),__webpack_require__.d(preview_namespaceObject,"parameters",(function(){return parameters}));__webpack_require__(17),__webpack_require__(37),__webpack_require__(55),__webpack_require__(848),__webpack_require__(45),__webpack_require__(46),__webpack_require__(849),__webpack_require__(445),__webpack_require__(850);var client_api=__webpack_require__(886),esm=__webpack_require__(7),parameters={actions:{argTypesRegex:"^on[A-Z].*"},controls:{matchers:{color:/(background|color)$/i,date:/Date$/}}};function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _defineProperty(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}Object.keys(preview_namespaceObject).forEach((function(key){var value=preview_namespaceObject[key];switch(key){case"args":case"argTypes":return esm.a.warn("Invalid args/argTypes in config, ignoring.",JSON.stringify(value));case"decorators":return value.forEach((function(decorator){return Object(client_api.b)(decorator,!1)}));case"loaders":return value.forEach((function(loader){return Object(client_api.c)(loader,!1)}));case"parameters":return Object(client_api.d)(function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach((function(key){_defineProperty(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}({},value),!1);case"argTypesEnhancers":return value.forEach((function(enhancer){return Object(client_api.a)(enhancer)}));case"globals":case"globalTypes":var v={};return v[key]=value,Object(client_api.d)(v,!1);default:return console.log(key+" was not supported :( !")}}))},880:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"__page",(function(){return __page}));__webpack_require__(17),__webpack_require__(29),__webpack_require__(37),__webpack_require__(12),__webpack_require__(0);var esm=__webpack_require__(32),blocks=__webpack_require__(64),_excluded=(__webpack_require__(307),["components"]);function _extends(){return(_extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target}).apply(this,arguments)}function _objectWithoutProperties(source,excluded){if(null==source)return{};var key,i,target=function _objectWithoutPropertiesLoose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],excluded.indexOf(key)>=0||Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}var layoutProps={};function MDXContent(_ref){var components=_ref.components,props=_objectWithoutProperties(_ref,_excluded);return Object(esm.b)("wrapper",_extends({},layoutProps,props,{components:components,mdxType:"MDXLayout"}),Object(esm.b)(blocks.c,{title:"README",mdxType:"Meta"}),Object(esm.b)(blocks.b,{mdxType:"Description"},"\n# Collaborative Text Editor\n\nUsing CRDTs to build a collaborative text editor, is mostly a solved problem. Turning it into a usable app is a matter of doing regular app work. Adding user accounts, adding authentication and authorization, storing user data. The new complicated bits, syncing a distributed data store over webrtc/websockets, is basically just plug and play.\n\n[Storybook](https://chewnoill.github.io/collaborative-editor/)\n\n[Slides](https://chewnoill.github.io/collaborative-editor/slides)\n\n[Repo](https://github.com/chewnoill/collaborative-editor)\n\n## Getting started\n\nInstall dependencies:\n```shell\nyarn\n```\n\nstart service\n```shell\nyarn service\n```\n\nstart storybook\n```shell\nyarn storybook\n```\n\n## Proposed Schema\n\n`Document`:\n- `origin`: an encoded string representing the entire change history of a document (CRDT)\n- `value`: The raw end state of origin, precaculated, rendered as a string\n\n# Data model\n\n```sql\nCREATE TABLE user (\n  id   uuid,\n  name text\n)\n```\n\n```sql\nCREATE TABLE document (\n  id      uuid,\n  origin text,\n  value text,\n  web_rtc_key text\n)\n```\n\n```sql\nCREATE TABLE user_document (\n  document_id uuid,\n  user_id     uuid\n)\n```\n\n## Deployment\n\nTwo resources are required.\n- javascript bundle & html\n    \n    Should be accessable at some IP and allow anonymous access. Supports SSL.\n- websocket service\n    \n    Online service thats available to accept websocket requests.\n\n## Javascript bundle & HTML\n\nThe only concern of this project, immediatly, \nis the editor. As such, the product of this\nrepository should include a javascript \ncomponents, suitable for using in a React \nfrontend.\n\nStorybook will render the outer UI on the\ndeployed version of the application.\n\n## Websocket Service\n\nA javascript bundle suitable for being\ndeployed to some cloud compute instance. \nThis is a standalone service.\n\n# Problems to be solved:\n\n* How do we secure WebRTC?\n  * Security model that supports direct peer communication\n  * Prevent bad actors from connecting to a data stream.\n  * Allow bad actors to be removed from a data stream, \nonce they have gained access.\n\n* Data storage model\n  * How do prevent unauthorized users from seeing data they aren't allowed to see?\n  * How do we store data in a distributed system?\n  * How do we propogate data to each peer?\n  * How do we persist document changes?\n"))}MDXContent.displayName="MDXContent",MDXContent.isMDXComponent=!0;var __page=function __page(){throw new Error("Docs-only story")};__page.parameters={docsOnly:!0};var componentMeta={title:"README",includeStories:["__page"]},mdxStoryNameToKey={};componentMeta.parameters=componentMeta.parameters||{},componentMeta.parameters.docs=Object.assign({},componentMeta.parameters.docs||{},{page:function page(){return Object(esm.b)(blocks.a,{mdxStoryNameToKey:mdxStoryNameToKey,mdxComponentMeta:componentMeta},Object(esm.b)(MDXContent,null))}});__webpack_exports__.default=componentMeta}},[[497,2,3]]]);