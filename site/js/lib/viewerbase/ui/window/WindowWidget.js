//>>built
require({cache:{"url:esriviewer/ui/window/template/WindowWidgetTemplate.html":"<div class=\"windowContainer defaultBorder fivePixelBorderRadius defaultBoxShadow\">\r\n    <div data-dojo-attach-point=\"windowHeader\" class=\"windowHeader\">\r\n        <div class=\"windowCloseImg windowAction close\" data-dojo-attach-point=\"windowCloseImg\"\r\n             title=\"Close\"></div>\r\n        <div class=\"windowMinimizeImg windowAction minimize\" data-dojo-attach-point=\"windowMinimizeImg\"\r\n             title=\"Minimize\"></div>\r\n        <div data-dojo-attach-point=\"headerMoverContainer\" class=\"headerMoverContainer\">\r\n            <div class=\"windowIcon ${windowIconClass}\" title=\"${windowIconAltText}\"></div>\r\n            <span class=\"windowHeaderText\">${windowHeaderText}</span>\r\n        </div>\r\n    </div>\r\n    <div class=\"windowContentOuter\" data-dojo-attach-point=\"windowContentOuter\">\r\n        <div data-dojo-attach-point=\"windowContent\" class=\"windowContent\">\r\n            <div data-dojo-attach-point=\"windowLoadingThrobber\" class=\"windowLoadingThrobber\"></div>\r\n        </div>\r\n    </div>\r\n\r\n\r\n</div>"}});define("esriviewer/ui/window/WindowWidget",["dojo/_base/declare","dojo/text!./template/WindowWidgetTemplate.html","dojo/topic","dojo/_base/window","dojo/_base/lang","dojo/on","dojo/dom-construct","dojo/dom-class","dojo/dom-style","../base/UITemplatedWidget","dojo/dnd/Moveable","dojox/layout/ResizeHandle","dojo/_base/connect","dojo/dom-geometry"],function(_1,_2,_3,_4,_5,on,_6,_7,_8,_9,_a,_b,_c,_d){return _1([_9],{resizeAxis:"xy",animate:true,resizable:false,isPositionedByConfig:true,firstShow:true,showOnLoad:false,visible:false,movable:true,canMinimize:true,windowHeight:null,windowWidth:"35%",positioningParamName:"",windowHeaderText:"Window",windowIconClass:"commonIcons16 application",templateString:_2,closeWindowTitle:"Close Window",windowIconAltText:"Window",constructor:function(){this.animation=VIEWER_GLOBALS.ANIMATIONS.FADE.IN;this.windowTopOffset=(VIEWER_GLOBALS.WINDOW&&VIEWER_GLOBALS.WINDOW.TOP_POSITION_MOVE_OFFSET)?(VIEWER_GLOBALS.WINDOW.TOP_POSITION_MOVE_OFFSET):3;},postCreate:function(){this.inherited(arguments);_6.place(this.domNode,_4.body());this.visible=false;_7.add(this.domNode,"windowHidden");if(this.movable){this._initMover();}else{_8.set(this.windowHeader,"cursor","default");}if(this.windowHeight!=null){_8.set(this.domNode,"height",this.windowHeight);}if(this.windowWidth!=null){_8.set(this.domNode,"width",this.windowWidth);}if(this.resizable){var _e={targetId:this.id,activeResize:true};if(this.minWidth!=null){_e["minWidth"]=this.minWidth;}if(this.minHeight!=null){_e["minHeight"]=this.minHeight;}if(this.resizeAxis){_e["resizeAxis"]=this.resizeAxis;}this.handle=new _b(_e).placeAt(this.domNode);}if(!this.canMinimize){_8.set(this.windowMinimizeImg,"display","none");}if(!this.showOnLoad){this.hide();}else{this.show();}},initListeners:function(){this.inherited(arguments);this.connects.push(on(this.windowCloseImg,"click",_5.hitch(this,this.hide,0)));this.connects.push(on(this.windowMinimizeImg,"click",_5.hitch(this,this.toggleContent)));this.subscribes.push(_3.subscribe("/dojo/resize/stop",_5.hitch(this,this.handleGlobalResizeFired)));this.subscribes.push(_3.subscribe(VIEWER_GLOBALS.EVENTS.WINDOW.REPOSITION_ALL,_5.hitch(this,this.handleReposition)));},loadViewerConfigurationData:function(){var _f=null;_3.publish(VIEWER_GLOBALS.EVENTS.CONFIGURATION.GET_ENTRY,"animationsEnabled",function(_10){_f=_10;});if(_f!=null){this.animate=_f;}},handleReposition:function(){var pos=_d.position(this.domNode);if(pos.y<this.windowTopOffset){_8.set(this.domNode,"top",this.windowTopOffset+"px");}},handleGlobalResizeFired:function(_11){if(this.handle){if(_11.id===this.handle.id){this.onWindowResize();}}},setContent:function(_12){_6.empty(this.windowContent);_6.place(_12,this.windowContent);},toggle:function(){if(this.visible){this.hide();}else{this.show();}},show:function(){if(!this.visible){this.onBeforeWindowShow();_7.remove(this.domNode,"windowHidden");if(this.animate){this._animateWidget();}this.visible=true;if(this.firstShow){this.firstShow=false;this.onFirstWindowShow();}this.onAfterWindowShow();}},hide:function(){if(this.visible){this.onBeforeWindowHide();_7.add(this.domNode,"windowHidden");if(this.animate){this._removeAnimationClasses();}this.visible=false;this.hidePopups();this.onAfterWindowHide();}},_initMover:function(){this.mover=new _a(this.domNode,{handle:this.headerMoverContainer});_c.connect(this.mover,"onMove",VIEWER_UTILS,VIEWER_UTILS.handleContainerMoved);},toggleContent:function(){var _13=_8.get(this.windowContentOuter,"display");if(_13=="none"){this._expand();}else{this._collapse();}},_expand:function(){_7.remove(this.windowHeader,"windowHeaderCollapsed");_8.set(this.windowContentOuter,"display","block");_7.add(this.windowHeader,"windowHeader");if(this.windowHeight!=null){_8.set(this.domNode,"height",this.windowHeight);}this.onWindowExpanded();if(this.handle&&this.handle.resizeHandle){this.handle.resizeHandle.style.display="block";}},_collapse:function(){_7.add(this.windowHeader,"windowHeaderCollapsed");_7.remove(this.windowHeader,"windowHeader");_8.set(this.windowContentOuter,"display","none");if(this.windowHeight!=null){_8.set(this.domNode,"height",null);}this.hidePopups();this.onWindowCollapsed();if(this.handle&&this.handle.resizeHandle){this.handle.resizeHandle.style.display="none";}},hidePopups:function(){},setWindowWidthFromInt:function(_14){_8.set(this.domNode,"width",_14+"px");},onWindowExpanded:function(){},onWindowCollapsed:function(){},onWindowResize:function(){},onBeforeWindowShow:function(){},onBeforeWindowHide:function(){},onAfterWindowShow:function(){},onAfterWindowHide:function(){},onFirstWindowShow:function(){}});});