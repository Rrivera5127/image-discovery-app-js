//>>built
require({cache:{"url:esriviewer/ui/zoomin/template/ZoomInWidgetTemplate.html":"<div>\r\n    <div class=\"zoomWidgetButton defaultBorder fivePixelBorderRadius\" data-dojo-attach-event=\"click: zoomOut\"\r\n         data-dojo-attach-point=\"zoomOutButton\">\r\n        <div class=\"zoomWidgetIcon zoomOutIcon\"></div>\r\n    </div>\r\n    <div class=\"zoomWidgetButton defaultBorder fivePixelBorderRadius\" data-dojo-attach-event=\"click: zoomIn\"\r\n         data-dojo-attach-point=\"zoomInButton\">\r\n        <div class=\"zoomWidgetIcon zoomInIcon\"></div>\r\n    </div>\r\n\r\n</div>"}});define("esriviewer/ui/zoomin/ZoomInWidget",["dojo/_base/declare","dojo/text!./template/ZoomInWidgetTemplate.html","dojo/topic","dojo/_base/lang","../base/UITemplatedWidget","dojo/_base/window","dojo/dom-construct","esri/toolbars/navigation","dojo/dom-class"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9){return _1([_5],{ZOOM_IN:"zoomInType",ZOOM_OUT:"zoomOutType",templateString:_2,isPositionedByConfig:true,defaultPositioning:{x:158,y:44},positioningParamName:"zoomInOut",postCreate:function(){this.inherited(arguments);var _a;_3.publish(VIEWER_GLOBALS.EVENTS.MAP.GET,function(_b){_a=_b;});this.map=_a;this._navigation=new _8(this.map);_7.place(this.domNode,_6.body());},initListeners:function(){this.inherited(arguments);this.toolChangeConnect=_3.subscribe(VIEWER_GLOBALS.EVENTS.MAP.ACTIONS.TOOL_CHANGED,_4.hitch(this,this.deactivate));},deactivate:function(){if(_9.contains(this.zoomOutButton,"active")){_9.remove(this.zoomOutButton,"active");}if(_9.contains(this.zoomInButton,"active")){_9.remove(this.zoomInButton,"active");}this._navigation.deactivate();},zoomIn:function(){if(_9.contains(this.zoomOutButton,"active")){_9.remove(this.zoomOutButton,"active");}if(_9.contains(this.zoomInButton,"active")){_9.remove(this.zoomInButton,"active");this._navigation.deactivate();}else{_3.publish(VIEWER_GLOBALS.EVENTS.MAP.ACTIONS.TOOL_CHANGED);this._navigation.activate(_8.ZOOM_IN);_9.add(this.zoomInButton,"active");}},zoomOut:function(){if(_9.contains(this.zoomInButton,"active")){_9.remove(this.zoomInButton,"active");}if(_9.contains(this.zoomOutButton,"active")){_9.remove(this.zoomOutButton,"active");this._navigation.deactivate();}else{_3.publish(VIEWER_GLOBALS.EVENTS.MAP.ACTIONS.TOOL_CHANGED);this._navigation.activate(_8.ZOOM_OUT);_9.add(this.zoomOutButton,"active");}}});});