//>>built
define("esriviewer/ui/_generic_template_with_window/Window",["dojo/_base/declare","dojo/_base/lang","esriviewer/ui/window/WindowWidget"],function(_1,_2,_3){return _1([_3],{defaultPositioning:{x:400,y:125},windowWidth:"300px",windowHeaderText:"Header Text",windowIconAltText:"Alt Text",windowIconClass:"commonIcons16 information",positioningParamName:"paramName",constructor:function(){this.firstShowListener=this.on("firstWindowShow",_2.hitch(this,this.handleFirstWindowShow));},handleFirstWindowShow:function(){this.firstShowListener.remove();require(["YOUR_WIDGET_PATH"],_2.hitch(this,function(_4){this.yourWidget=new _4();this.setContent(this.yourWidget.domNode);}));},initListeners:function(){this.inherited(arguments);}});});