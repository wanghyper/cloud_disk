(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["login"],{"03f5":function(e,t,s){"use strict";var i=s("3c9b"),a=s.n(i);a.a},"3c9b":function(e,t,s){},"4f77":function(e,t,s){"use strict";s.r(t);var i=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"phone"},[s("TopBar",{ref:"topbar"}),s("Content",{ref:"content",attrs:{ratio:e.ratio}}),s("BottomBar",{ref:"bottombar"})],1)},a=[],n=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"topbar"},[s("header",[s("div",{staticClass:"user"},[s("i",{staticClass:"icon-user"}),s("span",[e._v(e._s(e.$store.state.userInfo.user_name))])]),s("div",{staticClass:"search"},[s("input",{directives:[{name:"model",rawName:"v-model",value:e.searchText,expression:"searchText"}],attrs:{type:"search",placeholder:"搜索"},domProps:{value:e.searchText},on:{search:e.search,input:function(t){t.target.composing||(e.searchText=t.target.value)}}}),s("i",{staticClass:"icon-search",on:{click:e.search}})]),s("div",{staticClass:"logout",on:{click:e.logout}},[s("i",{staticClass:"icon-exit"}),s("span",[e._v("退出")])])]),s("div",{staticClass:"size"},[s("div",{staticClass:"total"},[s("div",{staticClass:"current",style:{width:e.size.percent}},[s("div",{staticClass:"linear"})])]),s("div",{staticClass:"number"},[e._v("\n      "+e._s(e.size.curSize)+"/"+e._s(e.size.total)+"\n    ")])]),s("div",{staticClass:"fileType"},e._l(e.fileListType,function(t,i){return s("div",{staticClass:"type",class:{curr:i===e.fileTypeIndex},on:{click:function(s){return e.setFileListType(t,i)}}},[e._v("\n      "+e._s(t.alias||t.name)+"\n      "),s("div",{staticClass:"bar"})])}),0)])},o=[],r=(s("a481"),s("87e7")),l={name:"TopBar",data:function(){return{searchText:"",fileListType:[{name:"全部文件",id:"all",alias:"全部"},{name:"图片",id:"image"},{name:"视频",id:"video"},{name:"文档",id:"text"},{name:"音乐",id:"audio"}],fileTypeIndex:0}},methods:{getFileList:function(){this.Content.getFileList()},search:function(){this.$store.commit("setFileListType",{name:"搜索结果",id:"search",filename:this.searchText}),this.$store.commit("setCurrentDir","")},setFileListType:function(e,t){this.fileTypeIndex=t,this.$store.commit("setFileListType",e),this.$store.commit("setCurrentDir","")},formatSize:function(e){var t=e/1e3;if(t>1){var s=t/1e3;return s>1?s.toFixed(1)+"M":t.toFixed(1)+"KB"}return t+"B"},logout:function(){var e=this;r["a"].logout().then(function(t){t.data.status&&(e.$store.commit("setUserInfo",{}),e.$router.replace("./login"))})}},computed:{size:function(){var e=this.$store.state.userInfo.size,t=this.$store.state.userInfo.total;return{percent:(e/t*100).toFixed(1)+"%",curSize:this.formatSize(e),total:this.formatSize(t)}},Content:function(){return this.$parent.$refs.content}},beforeCreate:function(){var e=375;function t(){document.querySelector("html").style.fontSize=window.innerWidth/e*100+"px"}t(),window.onresize=t}},c=l,d=(s("a118"),s("2877")),u=Object(d["a"])(c,n,o,!1,null,"29fc66e4",null),f=u.exports,h=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"content",style:e.clientHeight-160*e.ratio+"px"},[s("div",{staticClass:"breadcrumb"},[s("span",{directives:[{name:"show",rawName:"v-show",value:e.dirPath.length>0,expression:"dirPath.length>0"}],staticClass:"dirpath",on:{click:e.levelBack}},[s("span",[e._v("上一级")]),e._v(" |\n    ")]),s("span",{staticClass:"dirpath"},[s("span",{on:{click:function(t){return e.setDirPath("")}}},[e._v(e._s(e.$store.state.fileListType.name))])]),e._l(e.dirPath,function(t,i){return s("span",{staticClass:"dirpath level"},[s("span",{on:{click:function(t){return e.setDirPath(i+1)}}},[e._v(e._s(t))])])}),s("div",{staticClass:"selectAll",on:{click:e.selectAll}},[s("span",[e._v("全选 ")]),s("i",{class:[e.allSelected?"icon-checkbox-checked":"icon-checkbox-unchecked"]})])],2),s("div",{staticClass:"lists",style:{height:e.clientHeight-190*e.ratio+"px"}},[s("div",{directives:[{name:"show",rawName:"v-show",value:e.fileList.length<1,expression:"fileList.length<1"}],staticClass:"list no-content"},[e._v("空空如也")]),e._l(e.fileList,function(t,i){return s("div",{staticClass:"list"},[s("i",{staticClass:"fileType",class:"icon-file-"+e.classify(t)}),s("div",{staticClass:"info"},[s("div",{staticClass:"name"},[s("span",{on:{click:function(s){return e.openFile(t)}}},[e._v(e._s(t.name))])]),s("span",[e._v("修改时间："+e._s(t.create_time))]),"folder"!==t.type?s("span",[e._v("大小："+e._s(e.formatSize(t.size)))]):e._e()]),s("i",{staticClass:"checkbox",class:[t.hasSelected?"icon-checkbox-checked":"icon-checkbox-unchecked"],on:{click:function(t){return e.setSelect(i)}}})])})],2),s("transition",{attrs:{name:"tip"}},[s("div",{directives:[{name:"show",rawName:"v-show",value:e.showTip,expression:"showTip"}],staticClass:"tip"},[e._v("\n      "+e._s(e.tip)+"\n    ")])])],1)},p=[],v=(s("d25f"),s("28a5"),s("cebc")),m=(s("6d67"),s("ac6a"),s("f3e2"),s("7514"),s("55dd"),s("7f7f"),s("c5f6"),s("2f62")),C={name:"Content",props:{ratio:Number},data:function(){return{clientHeight:window.innerHeight,fileList:[],noFile:!1,sortType:"",allSelected:!1,tip:"",showTip:!1}},methods:{getFileList:function(){var e=this;r["a"].getFileList(this.fileListType,this.currentDir).then(function(t){t.data.status?(e.fileList=t.data.data,e.fileList.length<1&&(e.noFile=!0),e.sortFile("")):e.$router.replace("/login")})},sortFile:function(e){var t=null;if(this.sortType===e&&e)return this.fileList.reverse();t="size"===e?function(e,t){return e.size-t.size}:"time"===e?function(e,t){return e.create_time.localeCompare(t.create_time)}:function(e,t){return"folder"===e.type&&"folder"!==t.type?-1:"folder"!==e.type&&"folder"===t.type?1:e.name.localeCompare(t.name)},this.fileList.sort(t),this.sortType=e},formatSize:function(e){var t=e/1e3;if(t>1){var s=t/1e3;return s>1?s.toFixed(1)+"M":t.toFixed(1)+"KB"}return t+"B"},classify:function(e){if("folder"===e.type)return e.type;var t=[{type:"music",extend:/audio/},{type:"picture",extend:/image/},{type:"text",extend:/text/},{type:"video",extend:/video/},{type:"zip",extend:/gzip|tar|zip/},{type:"excel",extend:/excel|sheet/},{type:"word",extend:/msword|document/},{type:"pdf",extend:/pdf/}],s=t.find(function(t){return t.extend.test(e.type)});return s&&s.type||"other"},openFile:function(e){var t=this.currentDir+e.name;switch(this.classify(e)){case"picture":case"music":case"text":case"video":case"pdf":window.open(r["a"].getFileUrl(t));break;case"folder":this.$store.commit("setCurrentDir",t),this.getFileList();break;default:console.log("other")}},setSelect:function(e){this.allSelected=!1;var t=this.fileList[e];this.$set(t,"hasSelected",!t.hasSelected)},setDirPath:function(e){var t="";e&&(t=this.dirPath.slice(0,e).join("/")),this.$store.commit("setCurrentDir",t),this.getFileList()},levelBack:function(){var e=this.dirPath.slice(0,-1).join("/");this.$store.commit("setCurrentDir",e),this.getFileList()},selectAll:function(){var e=this;this.allSelected=!this.allSelected,this.fileList.forEach(function(t){e.$set(t,"hasSelected",e.allSelected)})},deleteFile:function(){var e=this;if(this.selectedFiles.length<1)this.showToast("请先勾选要删除的项");else if(confirm("确定要删除"+this.selectedFiles.length+"项?")){this.allSelected=!1;var t=this.selectedFiles.map(function(e){return{name:e.name,path:e.path}});r["a"].deleteFile(t).then(function(t){e.$store.commit("setUserInfo",t.data),e.getFileList()})}},downloadFile:function(){var e=this;if(this.selectedFiles.length<1)this.showToast("请先勾选要下载的项");else{var t=this.selectedFiles;t.length>1&&!confirm("确定要一次下载多个文件?")||t.forEach(function(t){if("folder"!==t.type){var s=document.createElement("a");s.style.display="none",s.style.height=0,s.download=t.name,s.href=r["a"].getFileUrl(e.currentDir+t.name),document.body.appendChild(s),s.click(),setTimeout(function(){s.remove()},5e3)}else e.showToast("暂不支持文件夹下载")})}},showToast:function(e){var t=this;clearTimeout(this.timer),this.tip=e,this.showTip=!0,this.timer=setTimeout(function(){t.showTip=!1},1e3)}},computed:Object(v["a"])({dirPath:function(){var e=this.$store.state.currentDir.split("/");return e.splice(-1,1),e},selectedFiles:function(){return this.fileList.filter(function(e){return e.hasSelected})}},Object(m["b"])(["currentDir","fileListType","userInfo"])),watch:{fileListType:function(){this.getFileList()}},created:function(){this.clientHeight=window.innerHeight,this.getFileList()}},w=C,g=(s("9e40"),Object(d["a"])(w,h,p,!1,null,"ae491404",null)),F=g.exports,x=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("footer",{staticClass:"bottombar"},[s("div",{directives:[{name:"show",rawName:"v-show",value:""!==e.activeClass,expression:"activeClass!==''"}],staticClass:"mask",on:{click:function(t){return e.hideUploadList(t)}}},[s("div",{directives:[{name:"show",rawName:"v-show",value:"upload"===e.activeClass,expression:"activeClass==='upload'"}],staticClass:"wrapper"},[s("div",{staticClass:"choseFile"},[s("div",{staticClass:"uploader"},[s("i",{staticClass:"icon-upload"}),s("span",[e._v("选择文件")]),s("input",{attrs:{type:"file",multiple:""},on:{change:function(t){return e.setUploadFiles(t)}}})])]),s("div",{staticClass:"list"},e._l(e.uploadFileList,function(t){return s("div",{staticClass:"files"},[s("div",{staticClass:"name"},[e._v(e._s(t.name))]),s("div",{staticClass:"info"},[s("span",[e._v("大小："+e._s(e.formatSize(t.file.size)))]),s("span",[e._v("状态："+e._s(t.status))]),s("span",[e._v("进度: \n              "),s("span",{staticClass:"progress"},[s("i",{style:{width:t.uploadStatus+"%"}}),s("span",[e._v(e._s(t.uploadStatus+"%"))])])])])])}),0)]),s("div",{directives:[{name:"show",rawName:"v-show",value:"addFolder"===e.activeClass,expression:"activeClass==='addFolder'"}],staticClass:"wrapper"},[s("div",{staticClass:"folder"},[s("input",{directives:[{name:"model",rawName:"v-model",value:e.folderName,expression:"folderName"}],ref:"folder",attrs:{type:"text"},domProps:{value:e.folderName},on:{input:function(t){t.target.composing||(e.folderName=t.target.value)}}}),s("button",{on:{click:e.addFolder}},[e._v("确定")])])])]),s("div",{staticClass:"panel"},[s("div",{staticClass:"upload enable",class:["upload"===e.activeClass?"active":""===e.activeClass?"":"disable"],on:{click:e.showUpload}},[s("i",{staticClass:"icon-upload"}),s("span",[e._v("上传")])]),s("div",{staticClass:"download",class:["download"===e.activeClass?"active":""===e.activeClass?"":"disable"],on:{click:e.downloadFile}},[s("i",{staticClass:"icon-download"}),s("span",[e._v("下载")])]),s("div",{staticClass:"delete",class:["delete"===e.activeClass?"active":""===e.activeClass?"":"disable"],on:{click:e.deleteFile}},[s("i",{staticClass:"icon-delete"}),s("span",[e._v("删除")])]),s("div",{staticClass:"addFolder",class:["addFolder"===e.activeClass?"active":""===e.activeClass?"":"disable"],on:{click:e.showAddFolder}},[s("i",{staticClass:"icon-folder-plus"}),s("span",[e._v("新建")])])])])},y=[],_=s("f499"),b=s.n(_),T={name:"BottomBar",data:function(){return{activeClass:"",uploadFileList:[],folderName:"新建文件夹"}},methods:{showUpload:function(){""===this.activeClass?this.activeClass="upload":"upload"===this.activeClass&&(this.activeClass="")},deleteFile:function(){""===this.activeClass&&this.Content.deleteFile()},downloadFile:function(){""===this.activeClass&&this.Content.downloadFile()},showAddFolder:function(){var e=this;""===this.activeClass?(this.activeClass="addFolder",this.$nextTick(function(){e.$refs.folder.select()})):"addFolder"===this.activeClass&&(this.activeClass="",this.folderName="新建文件夹")},addFolder:function(){var e=this;""!==this.folderName&&r["a"].createDir(this.$store.state.currentDir,this.folderName).then(function(t){t.data.status?(e.showAddFolder(),e.Content.getFileList()):e.Content.showToast(t.data.msg)})},setUploadFiles:function(e){var t=e.target.files;alert(b()(t));for(var s=0,i=0;i<t.length;i++){if(s+=t[i].size,this.userInfo.size+s>=this.userInfo.total)return alert("已超出网盘空间限制！"),void(e.target.files=[]);var a={file:t[i],status:"未上传",uploadStatus:0};this.uploadFileList.unshift(a),this.uploadFiles(a)}e.target.value=""},uploadFiles:function(e){var t=this;if(e.name=e.file.name.split("/").reverse()[0],e.file.size>2e8)e.status="文件过大 ";else{e.status="上传中 ";var s=0;while(this.Content.fileList.find(function(t){return e.name===t.name})){if(s++,s>100)return;if(/\(\d*\)./.test(e.name))e.name=e.name.replace(/\(\d*\)/,"("+s+")");else{var i=e.name.split(".").reverse();i.length>1?(i[1]+="(1)",e.name=i.reverse().join(".")):e.name=e.name+"(1)"}}r["a"].uploadFile(e.file,e.name,this.$store.state.currentDir,function(t){var s=t.loaded/t.total*100;e.uploadStatus=s.toFixed(1)}).then(function(s){t.$store.commit("setUserInfo",s.data),e.status="完成",t.Content.getFileList()}).catch(function(t){console.error(t),e.status="未完成"})}},formatSize:function(e){var t=e/1e3;if(t>1){var s=t/1e3;return s>1?s.toFixed(1)+"M":t.toFixed(1)+"KB"}return t+"B"},hideUploadList:function(e){"mask"===e.target.className&&(this.activeClass="")}},computed:{userInfo:function(){return this.$store.state.userInfo},Content:function(){return this.$parent.$refs.content}}},L=T,$=(s("fe4d"),Object(d["a"])(L,x,y,!1,null,"7202a37a",null)),k=$.exports,S={name:"Phone",components:{TopBar:f,Content:F,BottomBar:k},data:function(){return{contentHeight:0}},created:function(){var e=this,t=375,s=window.innerWidth/t,i=function(){e.ratio=s,document.querySelector("html").style.fontSize=100*s+"px"};i(),window.onresize=i},methods:{invoke:function(e,t){var s=this.$refs.content;"function"===typeof s[e]&&s[e](t)}}},z=S,N=(s("03f5"),Object(d["a"])(z,i,a,!1,null,"853183ec",null));t["default"]=N.exports},"7fa3":function(e,t,s){"use strict";var i=s("ab44"),a=s.n(i);a.a},9540:function(e,t,s){},"9e40":function(e,t,s){"use strict";var i=s("b2f3"),a=s.n(i);a.a},"9eeb":function(e,t,s){},a118:function(e,t,s){"use strict";var i=s("9540"),a=s.n(i);a.a},a21f:function(e,t,s){var i=s("584a"),a=i.JSON||(i.JSON={stringify:JSON.stringify});e.exports=function(e){return a.stringify.apply(a,arguments)}},a55b:function(e,t,s){"use strict";s.r(t);var i=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"login"},[s("h1",[e._v("欢迎登录")]),s("div",{staticClass:"panel"},[s("input",{directives:[{name:"model",rawName:"v-model",value:e.username,expression:"username"}],attrs:{type:"text",placeholder:"用户名"},domProps:{value:e.username},on:{input:function(t){t.target.composing||(e.username=t.target.value)}}}),s("br"),s("input",{directives:[{name:"model",rawName:"v-model",value:e.password,expression:"password"}],attrs:{type:"password",placeholder:"密码"},domProps:{value:e.password},on:{input:function(t){t.target.composing||(e.password=t.target.value)}}}),s("div",{staticClass:"tip"},[e._v(e._s(e.tip))]),s("button",{on:{click:e.commit}},[e._v("登录")])])])},a=[],n=(s("a481"),s("4917"),s("87e7")),o={name:"login",data:function(){return{username:"",password:"",tip:""}},methods:{commit:function(){var e=this;this.username&&this.password?n["a"].login({username:this.username,password:this.password}).then(function(t){if(t.data.status){e.$store.commit("setUserInfo",t.data.userInfo);var s=window.navigator.userAgent.toLowerCase();s.match(/iphone|android/)?e.$router.replace("/phone"):e.$router.replace("/home")}else e.tip="用户名或密码错误!"}):this.tip="请填写用户名或密码!"}}},r=o,l=(s("7fa3"),s("2877")),c=Object(l["a"])(r,i,a,!1,null,null,null);t["default"]=c.exports},ab44:function(e,t,s){},b2f3:function(e,t,s){},f499:function(e,t,s){e.exports=s("a21f")},fe4d:function(e,t,s){"use strict";var i=s("9eeb"),a=s.n(i);a.a}}]);