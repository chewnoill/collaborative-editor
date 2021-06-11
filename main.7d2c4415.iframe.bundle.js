(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{303:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return Editor}));__webpack_require__(850),__webpack_require__(851),__webpack_require__(852);var react__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(0),react__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__),yjs__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(36),y_codemirror__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(470),y_webrtc__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(469),codemirror__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__(96),codemirror__WEBPACK_IMPORTED_MODULE_7___default=__webpack_require__.n(codemirror__WEBPACK_IMPORTED_MODULE_7__),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__=(__webpack_require__(853),__webpack_require__(856),__webpack_require__(467));function Editor(){var ref=react__WEBPACK_IMPORTED_MODULE_3___default.a.useRef();return react__WEBPACK_IMPORTED_MODULE_3___default.a.useEffect((function(){var ydoc=new yjs__WEBPACK_IMPORTED_MODULE_4__.a,provider=new y_webrtc__WEBPACK_IMPORTED_MODULE_6__.a("new-room",ydoc,{signaling:["ws://localhost:4444"]}),yText=ydoc.getText("codemirror");yText.insert(0,"Hello World"),console.log({text:yText.toJSON()});var yUndoManager=new yjs__WEBPACK_IMPORTED_MODULE_4__.b(yText),editor=codemirror__WEBPACK_IMPORTED_MODULE_7___default()(ref.current,{mode:"markdown",lineNumbers:!0}),binding=new y_codemirror__WEBPACK_IMPORTED_MODULE_5__.a(yText,editor,provider.awareness,{yUndoManager:yUndoManager});setTimeout((function(){console.log({text:binding.doc.getText("codemirror").toJSON()})}),2e3)}),[ref]),Object(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div",{ref:ref})}Editor.displayName="Editor"},491:function(module,exports,__webpack_require__){__webpack_require__(492),__webpack_require__(648),__webpack_require__(649),__webpack_require__(868),__webpack_require__(866),__webpack_require__(870),__webpack_require__(871),__webpack_require__(869),__webpack_require__(867),__webpack_require__(872),__webpack_require__(873),module.exports=__webpack_require__(847)},559:function(module,exports){},649:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__(353)},847:function(module,exports,__webpack_require__){"use strict";(function(module){(0,__webpack_require__(353).configure)([__webpack_require__(848),__webpack_require__(865)],module,!1)}).call(this,__webpack_require__(208)(module))},848:function(module,exports,__webpack_require__){var map={"./stories/editor.stories.mdx":849,"./stories/readme.stories.mdx":874};function webpackContext(req){var id=webpackContextResolve(req);return __webpack_require__(id)}function webpackContextResolve(req){if(!__webpack_require__.o(map,req)){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}return map[req]}webpackContext.keys=function webpackContextKeys(){return Object.keys(map)},webpackContext.resolve=webpackContextResolve,module.exports=webpackContext,webpackContext.id=848},849:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"__page",(function(){return __page}));__webpack_require__(18),__webpack_require__(31),__webpack_require__(37),__webpack_require__(11),__webpack_require__(0);var _mdx_js_react__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(48),_storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(95),_editor__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__(303),_excluded=["components"];function _extends(){return(_extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target}).apply(this,arguments)}function _objectWithoutProperties(source,excluded){if(null==source)return{};var key,i,target=function _objectWithoutPropertiesLoose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],excluded.indexOf(key)>=0||Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}var layoutProps={};function MDXContent(_ref){var components=_ref.components,props=_objectWithoutProperties(_ref,_excluded);return Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_5__.b)("wrapper",_extends({},layoutProps,props,{components:components,mdxType:"MDXLayout"}),Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_5__.b)(_storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_6__.c,{title:"Editor",mdxType:"Meta"}),Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_5__.b)(_editor__WEBPACK_IMPORTED_MODULE_7__.a,{mdxType:"Editor"}))}MDXContent.displayName="MDXContent",MDXContent.isMDXComponent=!0;var __page=function __page(){throw new Error("Docs-only story")};__page.parameters={docsOnly:!0};var componentMeta={title:"Editor",includeStories:["__page"]},mdxStoryNameToKey={};componentMeta.parameters=componentMeta.parameters||{},componentMeta.parameters.docs=Object.assign({},componentMeta.parameters.docs||{},{page:function page(){return Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_5__.b)(_storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_6__.a,{mdxStoryNameToKey:mdxStoryNameToKey,mdxComponentMeta:componentMeta},Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_5__.b)(MDXContent,null))}}),__webpack_exports__.default=componentMeta},865:function(module,exports){function webpackEmptyContext(req){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}webpackEmptyContext.keys=function(){return[]},webpackEmptyContext.resolve=webpackEmptyContext,module.exports=webpackEmptyContext,webpackEmptyContext.id=865},873:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var preview_namespaceObject={};__webpack_require__.r(preview_namespaceObject),__webpack_require__.d(preview_namespaceObject,"parameters",(function(){return parameters}));__webpack_require__(18),__webpack_require__(37),__webpack_require__(53),__webpack_require__(843),__webpack_require__(43),__webpack_require__(44),__webpack_require__(844),__webpack_require__(845),__webpack_require__(846);var client_api=__webpack_require__(880),esm=__webpack_require__(7),parameters={actions:{argTypesRegex:"^on[A-Z].*"},controls:{matchers:{color:/(background|color)$/i,date:/Date$/}}};function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _defineProperty(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}Object.keys(preview_namespaceObject).forEach((function(key){var value=preview_namespaceObject[key];switch(key){case"args":case"argTypes":return esm.a.warn("Invalid args/argTypes in config, ignoring.",JSON.stringify(value));case"decorators":return value.forEach((function(decorator){return Object(client_api.b)(decorator,!1)}));case"loaders":return value.forEach((function(loader){return Object(client_api.c)(loader,!1)}));case"parameters":return Object(client_api.d)(function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach((function(key){_defineProperty(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}({},value),!1);case"argTypesEnhancers":return value.forEach((function(enhancer){return Object(client_api.a)(enhancer)}));case"globals":case"globalTypes":var v={};return v[key]=value,Object(client_api.d)(v,!1);default:return console.log(key+" was not supported :( !")}}))},874:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"__page",(function(){return __page}));__webpack_require__(18),__webpack_require__(31),__webpack_require__(37),__webpack_require__(11),__webpack_require__(0);var esm=__webpack_require__(48),blocks=__webpack_require__(95),_excluded=(__webpack_require__(303),["components"]);function _extends(){return(_extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target}).apply(this,arguments)}function _objectWithoutProperties(source,excluded){if(null==source)return{};var key,i,target=function _objectWithoutPropertiesLoose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],excluded.indexOf(key)>=0||Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}var layoutProps={};function MDXContent(_ref){var components=_ref.components,props=_objectWithoutProperties(_ref,_excluded);return Object(esm.b)("wrapper",_extends({},layoutProps,props,{components:components,mdxType:"MDXLayout"}),Object(esm.b)(blocks.c,{title:"README",mdxType:"Meta"}),Object(esm.b)(blocks.b,{mdxType:"Description"},"\n# Collaborative Text Editor\n\n## Getting started\n\nInstall dependencies:\n```bash\nyarn\n```\n\nstart service\n```bash\nyarn service\n```\n\nstart storybook\n```bash\nyarn storybook\n```\n\n## Proposed Schema\n\n`Document`:\n- `origin`: an encoded string representing the entire change history of a document (CRDT)\n- `value`: The raw end state of origin, precaculated, rendered as a string\n\n# Data model\n\n```sql\nCREATE TABLE user (\n  id   uuid,\n  name text\n)\n```\n\n```sql\nCREATE TABLE document (\n  id      uuid,\n  origin text,\n  value text,\n  web_rtc_key text\n)\n```\n\n```sql\nCREATE TABLE user_document (\n  document_id uuid,\n  user_id     uuid\n)\n```\n\n## Deployment\n\nTwo resources are required.\n- javascript bundle & html\n    Should be accessable at some IP and allow anonymous access. Supports SSL.\n- websocket service\n    Online service thats available to accept websocket requests.\n\n## Javascript bundle & HTML\n\nThe only concern of this project, immediatly, \nis the editor. As such, the product of this\nrepository should include a javascript \ncomponents, suitable for using in a React \nfrontend.\n\nStorybook will render the outer UI on the\ndeployed version of the application.\n\n## Websocket Service\n\nA javascript bundle suitable for being\ndeployed to some cloud compute instance. \nThis is a standalone service.\n\n# Problems to be solved:\n\n* How do we secure WebRTC?\n  * Security model that supports direct peer communication\n  * Prevent bad actors from connecting to a data stream.\n  * Allow bad actors to be removed from a data stream, \nonce they have gained access.\n\n* Data storage model\n  * How do prevent unauthorized users from seeing data they aren't allowed to see?\n  * How do we store data in a distributed system?\n  * How do we propogate data to each peer?\n"))}MDXContent.displayName="MDXContent",MDXContent.isMDXComponent=!0;var __page=function __page(){throw new Error("Docs-only story")};__page.parameters={docsOnly:!0};var componentMeta={title:"README",includeStories:["__page"]},mdxStoryNameToKey={};componentMeta.parameters=componentMeta.parameters||{},componentMeta.parameters.docs=Object.assign({},componentMeta.parameters.docs||{},{page:function page(){return Object(esm.b)(blocks.a,{mdxStoryNameToKey:mdxStoryNameToKey,mdxComponentMeta:componentMeta},Object(esm.b)(MDXContent,null))}});__webpack_exports__.default=componentMeta}},[[491,2,3]]]);