//>>built
require({cache:{"url:esriviewer/ui/basemap/template/BasemapGalleryTemplate.html":"<div data-bind=\"visible: visible\" class=\"defaultBackground basemapGalleryContainer\">\r\n    <div data-dojo-attach-point=\"basemapGalleryContents\"></div>\r\n</div>"}});define("esriviewer/ui/basemap/BasemapGalleryWidget",["dojo/_base/declare","dojo/text!./template/BasemapGalleryTemplate.html","dojo/_base/lang","dojo/_base/connect","dojo/topic","../base/UITemplatedWidget","./model/BasemapGalleryViewModel","esri/arcgis/utils"],function(_1,_2,_3,_4,_5,_6,_7,_8){return _1([_6],{configuredPortalBasemapsGroupId:null,animateOnPlace:false,usePortalBasemaps:false,animate:true,_defaultArcGISBasemapTitle:null,templateString:_2,constructor:function(){this.animation=VIEWER_GLOBALS.ANIMATIONS.FADE.IN;},initListeners:function(){_5.subscribe(VIEWER_GLOBALS.EVENTS.MAP.BASEMAP.GALLERY.TOGGLE,_3.hitch(this,this.handleToggleBasemapGallery));_5.subscribe(VIEWER_GLOBALS.EVENTS.MAP.BASEMAP.GALLERY.SHOW,_3.hitch(this,this.handleShowBasemapGallery));_5.subscribe(VIEWER_GLOBALS.EVENTS.MAP.BASEMAP.GALLERY.HIDE,_3.hitch(this,this.handleHideBasemapGallery));_5.subscribe(VIEWER_GLOBALS.EVENTS.MAP.BASEMAP.GALLERY.IS_HIDDEN,_3.hitch(this,this.handleBasemapGalleryIsHidden));_5.subscribe(VIEWER_GLOBALS.EVENTS.MAP.BASEMAP.GALLERY.GET,_3.hitch(this,this.handleGetBasemapGallery));},handleGetBasemapGallery:function(_9){if(_9!=null&&_3.isFunction(_9)){_9(this.basemapGallery);}},loadViewerConfigurationData:function(){var _a;_5.publish(VIEWER_GLOBALS.EVENTS.CONFIGURATION.GET_ENTRY,"map",function(_b){_a=_b;});if(_a){if(_a.useConfiguredPortalBasemaps!=null){this.usePortalBasemaps=_a.useConfiguredPortalBasemaps;}if(_a.basemapGalleryDefault!=null){this._defaultArcGISBasemapTitle=_a.basemapGalleryDefault;}if(_a.configuredPortalBasemapsGroupId!=null){this.configuredPortalBasemapsGroupId=_a.configuredPortalBasemapsGroupId;}}var _c=null;_5.publish(VIEWER_GLOBALS.EVENTS.CONFIGURATION.GET_ENTRY,"animationsEnabled",function(_d){_c=_d;});if(_c!=null){this.animate=_c;}},handleBasemapGalleryIsHidden:function(_e){if(_e!=null&&_3.isFunction(_e)){_e(!this.viewModel.visible());}},handleHideBasemapGallery:function(){if(this.viewModel.visible()){this.viewModel.visible(false);if(this.animate){this._removeAnimationClasses();}}},handleShowBasemapGallery:function(){if(!this.viewModel.visible()){this.viewModel.visible(true);if(this.animate){this._animateWidget();}}},handleToggleBasemapGallery:function(){if(!this.viewModel.visible()){this.handleShowBasemapGallery();}else{this.handleHideBasemapGallery();}},postCreate:function(){this.inherited(arguments);this.viewModel=new _7();ko.applyBindings(this.viewModel,this.domNode);_5.publish(VIEWER_GLOBALS.EVENTS.PLACEMENT.GLOBAL.PLACE.BASEMAP_GALLERY,this);var _f;_5.publish(VIEWER_GLOBALS.EVENTS.MAP.GET,function(_10){_f=_10;});var _11={map:_f,showArcGISBasemaps:true};var _12;_5.publish(VIEWER_GLOBALS.EVENTS.PORTAL.GET_INSTANCE,function(_13){_12=_13;});if(this.usePortalBasemaps&&_12){var _14;_5.publish(VIEWER_GLOBALS.EVENTS.PORTAL.GET_BASEMAPS,_3.hitch(this,function(_15){_14=_15;if(_14&&_14.length>0){_11.showArcGISBasemaps=false;_11.basemaps=_14;}this._initGallery(_11);}),this.configuredPortalBasemapsGroupId);}else{this._initGallery(_11);}},_initGallery:function(_16){require(["esri/dijit/BasemapGallery"],_3.hitch(this,function(_17){this.basemapGallery=new _17(_16,this.basemapGalleryContents);this.basemapGallery.on("load",_3.hitch(this,this.handleBasemapGalleryLoaded));_4.connect(this.basemapGallery,"onSelectionChange",_3.hitch(this,this.handleBasemapSelectionChanged));this.basemapGallery.startup();}));},handleBasemapSelectionChanged:function(evt){this.handleHideBasemapGallery();_5.publish(VIEWER_GLOBALS.EVENTS.MAP.BASEMAP.CHANGED);},_setArcGISBasemapByTitle:function(){if(this._defaultArcGISBasemapTitle){var _18=this._getBasemapIdByTitle(this._defaultArcGISBasemapTitle);if(_18!=null){this.basemapGallery.select(_18);}}},handleBasemapGalleryLoaded:function(){if(this._defaultArcGISBasemapTitle!=null){this._setArcGISBasemapByTitle();}},_getBasemapIdByTitle:function(_19){if(this.basemapGallery&&this.basemapGallery.basemaps){var _1a;for(var i=0;i<this.basemapGallery.basemaps.length;i++){_1a=this.basemapGallery.basemaps[i];if(_1a!=null&&_1a.title!=null){if(_1a.title==_19){return _1a.id;}}}}return null;}});});