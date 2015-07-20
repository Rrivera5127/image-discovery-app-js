//>>built
define("esriviewer/ui/editor/FeatureServiceEditorWindowWidget",["dojo/_base/declare","dojo/topic","dojo/_base/lang","../window/WindowWidget"],function(_1,_2,_3,_4){return _1([_4],{defaultPositioning:{x:600,y:50},windowWidth:"310px",windowHeaderText:"Feature Edit",windowIconAltText:"Feature Edit",positioningParamName:"featureEdit",windowIconClass:"commonIcons16 pencil",constructor:function(){this.firstShowListener=this.on("firstWindowShow",_3.hitch(this,this.handleFirstWindowShow));},handleFirstWindowShow:function(){this.firstShowListener.remove();require(["esriviewer/ui/editor/FeatureServiceEditor"],_3.hitch(this,function(_5){this.featureServiceEditor=new _5();this.featureServiceEditor.on("setParentWidth",_3.hitch(this,this.setWindowWidthFromInt));this.setContent(this.featureServiceEditor.domNode);}));},initListeners:function(){this.inherited(arguments);this.subscribes.push(_2.subscribe(VIEWER_GLOBALS.EVENTS.WINDOW.FEATURE_EDITOR.SHOW,_3.hitch(this,this.show)));this.subscribes.push(_2.subscribe(VIEWER_GLOBALS.EVENTS.WINDOW.FEATURE_EDITOR.HIDE,_3.hitch(this,this.hide)));this.subscribes.push(_2.subscribe(VIEWER_GLOBALS.EVENTS.WINDOW.FEATURE_EDITOR.TOGGLE,_3.hitch(this,this.toggle)));},hide:function(){this.inherited(arguments);if(this.featureServiceEditor){if(this.featureServiceEditor.currentDrawType!=null){this.featureServiceEditor.clearDraw();}}},show:function(){this.inherited(arguments);if(this.featureServiceEditor){this.featureServiceEditor.showFeatureLayers();}}});});