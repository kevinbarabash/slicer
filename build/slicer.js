/**
 * @license RequireJS text 2.0.12 Copyright (c) 2010-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */

define("GeometryBuilder",[],function(){function e(e,t,n,r,i){var s=(t-e)/i,o=(r-n)/i,u=new THREE.Geometry,a,f,l,c,h,p,d=0;a=e;for(h=0;h<i;h++){f=a+s,l=n;for(p=0;p<i;p++,d+=5)c=l+o,u.vertices.push(new THREE.Vector3(a,l,0)),u.vertices.push(new THREE.Vector3(f,l,0)),u.vertices.push(new THREE.Vector3(f,c,0)),u.vertices.push(new THREE.Vector3(a,c,0)),u.vertices.push(new THREE.Vector3((a+f)/2,(l+c)/2,0)),u.faces.push(new THREE.Face3(d+0,d+1,d+4)),u.faces.push(new THREE.Face3(d+1,d+2,d+4)),u.faces.push(new THREE.Face3(d+2,d+3,d+4)),u.faces.push(new THREE.Face3(d+3,d+0,d+4)),l=c;a=f}return u}function t(e,t,n,r){var i=new THREE.Geometry,s=e,o=r,u=(t-e)/n,a,f=0;for(a=0;a<n;a++,f+=5){var l=s+u;i.vertices.push(new THREE.Vector3(o,s,0)),s=l}return i.vertices.push(new THREE.Vector3(o,s,0)),i}return{buildGrid:e,buildCurve:t}}),define("text",["module"],function(e){var t,n,r,i,s,o=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"],u=/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,a=/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,f=typeof location!="undefined"&&location.href,l=f&&location.protocol&&location.protocol.replace(/\:/,""),c=f&&location.hostname,h=f&&(location.port||undefined),p={},d=e.config&&e.config()||{};t={version:"2.0.12",strip:function(e){if(e){e=e.replace(u,"");var t=e.match(a);t&&(e=t[1])}else e="";return e},jsEscape:function(e){return e.replace(/(['\\])/g,"\\$1").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r").replace(/[\u2028]/g,"\\u2028").replace(/[\u2029]/g,"\\u2029")},createXhr:d.createXhr||function(){var e,t,n;if(typeof XMLHttpRequest!="undefined")return new XMLHttpRequest;if(typeof ActiveXObject!="undefined")for(t=0;t<3;t+=1){n=o[t];try{e=new ActiveXObject(n)}catch(r){}if(e){o=[n];break}}return e},parseName:function(e){var t,n,r,i=!1,s=e.indexOf("."),o=e.indexOf("./")===0||e.indexOf("../")===0;return s!==-1&&(!o||s>1)?(t=e.substring(0,s),n=e.substring(s+1,e.length)):t=e,r=n||t,s=r.indexOf("!"),s!==-1&&(i=r.substring(s+1)==="strip",r=r.substring(0,s),n?n=r:t=r),{moduleName:t,ext:n,strip:i}},xdRegExp:/^((\w+)\:)?\/\/([^\/\\]+)/,useXhr:function(e,n,r,i){var s,o,u,a=t.xdRegExp.exec(e);return a?(s=a[2],o=a[3],o=o.split(":"),u=o[1],o=o[0],(!s||s===n)&&(!o||o.toLowerCase()===r.toLowerCase())&&(!u&&!o||u===i)):!0},finishLoad:function(e,n,r,i){r=n?t.strip(r):r,d.isBuild&&(p[e]=r),i(r)},load:function(e,n,r,i){if(i&&i.isBuild&&!i.inlineText){r();return}d.isBuild=i&&i.isBuild;var s=t.parseName(e),o=s.moduleName+(s.ext?"."+s.ext:""),u=n.toUrl(o),a=d.useXhr||t.useXhr;if(u.indexOf("empty:")===0){r();return}!f||a(u,l,c,h)?t.get(u,function(n){t.finishLoad(e,s.strip,n,r)},function(e){r.error&&r.error(e)}):n([o],function(e){t.finishLoad(s.moduleName+"."+s.ext,s.strip,e,r)})},write:function(e,n,r,i){if(p.hasOwnProperty(n)){var s=t.jsEscape(p[n]);r.asModule(e+"!"+n,"define(function () { return '"+s+"';});\n")}},writeFile:function(e,n,r,i,s){var o=t.parseName(n),u=o.ext?"."+o.ext:"",a=o.moduleName+u,f=r.toUrl(o.moduleName+u)+".js";t.load(a,r,function(n){var r=function(e){return i(f,e)};r.asModule=function(e,t){return i.asModule(e,f,t)},t.write(e,a,r,s)},s)}};if(d.env==="node"||!d.env&&typeof process!="undefined"&&process.versions&&!!process.versions.node&&!process.versions["node-webkit"])n=require.nodeRequire("fs"),t.get=function(e,t,r){try{var i=n.readFileSync(e,"utf8");i.indexOf("﻿")===0&&(i=i.substring(1)),t(i)}catch(s){r&&r(s)}};else if(d.env==="xhr"||!d.env&&t.createXhr())t.get=function(e,n,r,i){var s=t.createXhr(),o;s.open("GET",e,!0);if(i)for(o in i)i.hasOwnProperty(o)&&s.setRequestHeader(o.toLowerCase(),i[o]);d.onXhr&&d.onXhr(s,e),s.onreadystatechange=function(t){var i,o;s.readyState===4&&(i=s.status||0,i>399&&i<600?(o=new Error(e+" HTTP status: "+i),o.xhr=s,r&&r(o)):n(s.responseText),d.onXhrComplete&&d.onXhrComplete(s,e))},s.send(null)};else if(d.env==="rhino"||!d.env&&typeof Packages!="undefined"&&typeof java!="undefined")t.get=function(e,t){var n,r,i="utf-8",s=new java.io.File(e),o=java.lang.System.getProperty("line.separator"),u=new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(s),i)),a="";try{n=new java.lang.StringBuffer,r=u.readLine(),r&&r.length()&&r.charAt(0)===65279&&(r=r.substring(1)),r!==null&&n.append(r);while((r=u.readLine())!==null)n.append(o),n.append(r);a=String(n.toString())}finally{u.close()}t(a)};else if(d.env==="xpconnect"||!d.env&&typeof Components!="undefined"&&Components.classes&&Components.interfaces)r=Components.classes,i=Components.interfaces,Components.utils["import"]("resource://gre/modules/FileUtils.jsm"),s="@mozilla.org/windows-registry-key;1"in r,t.get=function(e,t){var n,o,u,a={};s&&(e=e.replace(/\//g,"\\")),u=new FileUtils.File(e);try{n=r["@mozilla.org/network/file-input-stream;1"].createInstance(i.nsIFileInputStream),n.init(u,1,0,!1),o=r["@mozilla.org/intl/converter-input-stream;1"].createInstance(i.nsIConverterInputStream),o.init(n,"utf-8",n.available(),i.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER),o.readString(n.available(),a),o.close(),n.close(),t(a.value)}catch(f){throw new Error((u&&u.path||"")+": "+f)}};return t}),define("text!shaders/surfaceVert.glsl",[],function(){return"varying vec3 vPosition;\nvarying mat3 vNormalMatrix;\n\n// FUNC\n\nvoid main(void) {\n    vPosition = position;\n    vPosition.z = func(vPosition.x, vPosition.y);\n    vNormalMatrix = normalMatrix;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition,1.0);\n}\n"}),define("text!shaders/surfaceFrag.glsl",[],function(){return"precision mediump float;\n\nvarying vec3 vPosition;\nvarying mat3 vNormalMatrix;\nuniform vec3 uColor;\n\n// FUNC\n\nvoid main(void) {\n    vec3 light = vec3(0.0, 0.0, 1.0);\n    float d = 0.001;\n\n    float x1 = vPosition.x;\n    float y1 = vPosition.y;\n    float x2 = x1 + d;\n    float y2 = y1 + d;\n\n    vec3 v1 = vec3(x2, y1, func(x2, y1)) - vec3(x1, y1, func(x1, y1));\n    vec3 v2 = vec3(x1, y2, func(x1, y2)) - vec3(x1, y1, func(x1, y1));\n\n    vec3 n = normalize(vNormalMatrix * cross(v1, v2));\n\n    float alpha = 0.2 + 0.7 * ( 1.0 - abs(dot(n, light)) );\n    gl_FragColor = vec4(uColor, alpha);\n}\n"}),define("text!shaders/lineFrag.glsl",[],function(){return"precision mediump float;\n\nuniform vec3 uColor;\n\nvoid main(void) {\n    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n}\n"}),define("text!shaders/lineVert.glsl",[],function(){return"// FUNC\n\nvoid main(void) {\n    vec3 pos = position;\n    pos.z = func(pos.x, pos.y);\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);\n}\n"}),define("ObjectBuilder",["require","GeometryBuilder","text!shaders/surfaceVert.glsl","text!shaders/surfaceFrag.glsl","text!shaders/lineFrag.glsl","text!shaders/lineVert.glsl"],function(e){function o(e){var n=t.buildGrid(-2,2,-2,2,128),i=new THREE.ShaderMaterial({attributes:{},uniforms:{uColor:{type:"v3",value:new THREE.Vector3(1,1,0)}},vertexShader:r(e),fragmentShader:s(e),transparent:!0,side:THREE.DoubleSide,depthTest:!1,depthWrite:!1});return new THREE.Mesh(n,i)}function l(e,n){var r=t.buildCurve(-2,2,128,n),i=new THREE.ShaderMaterial({uniforms:{uColor:{type:"v3",value:new THREE.Vector3(1,0,0)}},attributes:{},vertexShader:f(e),fragmentShader:u,transparent:!0,depthTest:!1,depthWrite:!1});return new THREE.Line(r,i)}function c(){var e=new THREE.Object3D,t=new THREE.LineBasicMaterial({color:255}),n,r=new THREE.Geometry;return r.vertices.push(new THREE.Vector3(0,0,0)),r.vertices.push(new THREE.Vector3(4,0,0)),n=new THREE.Line(r,t),e.add(n),r=new THREE.Geometry,r.vertices.push(new THREE.Vector3(0,0,0)),r.vertices.push(new THREE.Vector3(0,4,0)),n=new THREE.Line(r,t),e.add(n),r=new THREE.Geometry,r.vertices.push(new THREE.Vector3(0,0,0)),r.vertices.push(new THREE.Vector3(0,0,4)),n=new THREE.Line(r,t),e.add(n),e}var t=e("GeometryBuilder"),n=e("text!shaders/surfaceVert.glsl"),r=function(e){return n.replace("// FUNC",e)},i=e("text!shaders/surfaceFrag.glsl"),s=function(e){return i.replace("// FUNC",e)},u=e("text!shaders/lineFrag.glsl"),a=e("text!shaders/lineVert.glsl"),f=function(e){return a.replace("// FUNC",e)};return{buildCurve:l,buildSurface:o,buildAxes:c}}),define("functions",[],function(){var e="float func(float x, float y) {\n  return exp(-(x * x + y * y));\n}",t="float func(float x, float y) {\n  return cos(5.0 * x * y) / 5.0;\n}";return{gauss:e,waves:t}}),define("GimbalFreeOrbitControls",[],function(){THREE.GimbalFreeOrbitControls=function(e,t){function i(e,t,n){r=new THREE.Matrix4,r.makeRotationAxis(t.normalize(),n),r.multiply(e.matrix),e.matrix=r,e.rotation.setFromRotationMatrix(e.matrix)}this.object=e,this.domElement=t!==undefined?t:document;var n=this,r,s,o,u;this.domElement.addEventListener("mousedown",function(e){s=e.pageX,o=e.pageY,u=!0}),document.addEventListener("mousemove",function(t){if(u){var r=t.pageX-s,a=t.pageY-o,f=Math.sqrt(r*r+a*a);if(r===0&&a===0)return;var l=new THREE.Vector3(a/f,r/f,0);i(e,l,f/200),s=t.pageX,o=t.pageY,n.update()}}),document.addEventListener("mouseup",function(e){u&&(u=!1)}),this.update=function(){this.dispatchEvent({type:"change"})}},THREE.GimbalFreeOrbitControls.prototype=Object.create(THREE.EventDispatcher.prototype)}),define("slicer",["require","ObjectBuilder","functions","GimbalFreeOrbitControls"],function(e){var t=e("ObjectBuilder"),n=e("functions");e("GimbalFreeOrbitControls");var r=new THREE.Scene,i=new THREE.Object3D;r.add(i);var s=window.innerWidth/window.innerHeight,o=4.5,u=4.5*s,a=new THREE.OrthographicCamera(u/-2,u/2,o/2,o/-2,0,100);a.position.z=3;var f=!1,l=new THREE.WebGLRenderer({antialias:f});l.setClearColor(3355443),l.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(l.domElement);var c=[];for(var h=0;h<2;h+=.1)c.push(t.buildCurve(n.gauss,h));var p=t.buildSurface(n.gauss),d=t.buildAxes();i.add(p),c.forEach(function(e){i.add(e)}),i.add(d),i.rotation.x=-Math.PI/2.4,i.rotation.z=-Math.PI/1.6;var v=function(){requestAnimationFrame(v,l.domElement),g.update()},m=function(){l.render(r,a)},g=new THREE.GimbalFreeOrbitControls(i,l.domElement);g.addEventListener("change",m),m(),v()});