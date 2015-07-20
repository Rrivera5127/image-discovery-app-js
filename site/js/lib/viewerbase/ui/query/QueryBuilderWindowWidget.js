//>>built
define("esriviewer/ui/query/QueryBuilderWindowWidget",["dojo/_base/declare","dojo/_base/lang","dojo/topic","dojo/dom-class","../window/WindowWidget","dojox/html/metrics"],function(_1,_2,_3,_4,_5,_6){return _1([_5],{defaultPositioning:{x:400,y:125},pendingQueryLayerCallback:null,minWidth:400,resizable:true,resizeAxis:"xy",windowHeight:"38em",windowHeaderText:"Query Builder",windowIconAltText:"Query Builder",windowIconClass:"commonIcons16 sql",positioningParamName:"queryBuilder",constructor:function(){var _7=_6.getFontMeasurements();this.minHeight=38*_7["1em"];this.firstShowListener=this.on("firstWindowShow",_2.hitch(this,this.handleFirstWindowShow));},postCreate:function(){this.inherited(arguments);_4.add(this.windowContent,"queryBuilderWindowContent");},handleFirstWindowShow:function(){this.firstShowListener.remove();require(["esriviewer/ui/query/QueryBuilderWidget"],_2.hitch(this,function(_8){this.queryBuilderWidget=new _8();this.setContent(this.queryBuilderWidget.domNode);if(this.pendingQueryLayerCallback!=null&&_2.isFunction(this.pendingQueryLayerCallback)){this.pendingQueryLayerCallback();}}));},initListeners:function(){this.inherited(arguments);this.subscribes.push(_3.subscribe(VIEWER_GLOBALS.EVENTS.WINDOW.QUERY_BUILDER.SHOW,_2.hitch(this,this.show)));this.subscribes.push(_3.subscribe(VIEWER_GLOBALS.EVENTS.WINDOW.QUERY_BUILDER.HIDE,_2.hitch(this,this.hide)));this.subscribes.push(_3.subscribe(VIEWER_GLOBALS.EVENTS.WINDOW.QUERY_BUILDER.TOGGLE,_2.hitch(this,this.toggle)));_3.subscribe(VIEWER_GLOBALS.EVENTS.QUERY_BUILDER.SET_IMAGE_SERVICE_LAYER,_2.hitch(this,this.setImageServiceLayer));_3.subscribe(VIEWER_GLOBALS.EVENTS.QUERY_BUILDER.SET_MAP_SERVICE_LAYER,_2.hitch(this,this.setMapServiceLayer));_3.subscribe(VIEWER_GLOBALS.EVENTS.QUERY_BUILDER.SET_FEATURE_SERVICE_LAYER,_2.hitch(this,this.setFeatureServiceLayer));},hide:function(){this.inherited(arguments);if(this.queryBuilderWidget){this.queryBuilderWidget.clearGraphics();}},setImageServiceLayer:function(_9){if(this.queryBuilderWidget==null){this.pendingQueryLayerCallback=_2.hitch(this,function(_a){this.queryBuilderWidget.setImageServiceLayer(_a);this.pendingQueryLayerCallback=null;},_9);}else{this.queryBuilderWidget.setImageServiceLayer(_9);}this.show();},setMapServiceLayer:function(_b,_c){if(this.queryBuilderWidget==null){this.pendingQueryLayerCallback=_2.hitch(this,function(_d,_e){this.queryBuilderWidget.setMapServiceLayer(_d,_e);this.pendingQueryLayerCallback=null;},_b,_c);}else{this.queryBuilderWidget.setMapServiceLayer(_b,_c);}this.show();},setFeatureServiceLayer:function(_f){if(this.queryBuilderWidget==null){this.pendingQueryLayerCallback=_2.hitch(this,function(_10){this.queryBuilderWidget.setFeatureServiceLayer(_10);this.pendingQueryLayerCallback=null;},_f);}else{this.queryBuilderWidget.setFeatureServiceLayer(_f);}this.show();}});});