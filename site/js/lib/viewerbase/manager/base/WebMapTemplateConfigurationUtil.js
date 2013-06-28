//>>built
define("esriviewer/manager/base/WebMapTemplateConfigurationUtil",["dojo/_base/declare","dojo/_base/lang","dojo/Deferred","esri/request","dojo/_base/array","../../base/DataLoaderSupport","esri/arcgis/utils"],function(_1,_2,_3,_4,_5,_6,_7){return _1([_6],{showOverviewParameter:"showOverview",showLegendParameter:"showLegend",showHeaderParameter:"showHeader",headerTextParameter:"headerText",helpLinkParameter:"helpUrl",contactUsParameter:"contactUsUrl",ignoreProcessingConfigurationEntries:["webmap","geometryServiceUrl","locators","baseViewer","showOverview","showLegend"],appConfigToViewerWindowWidgetConfigLookup:{logging:"logging"},appConfigToViewerWidgetConfigLookup:{drawWidget:"drawWidget",reverseGeocodeWidget:"reverseGeocodeWidget",portalSearchWidget:"portalSearchWidget",reflectivityWidget:"reflectivityWidget",zoomToWidget:"zoomToWidget",timeSliderWidget:"timeSliderWidget",identifyWidget:"identifyWidget",configureWidget:"configureWidget",measureWidget:"measureWidget",socialMediaWidget:"socialMediaWidget",printWidget:"printWidget",weatherWidget:"weatherWidget"},defaultConfigFile:"config/portal/config.json",constructor:function(){this.init();},init:function(){},loadConfiguration:function(_8){this.appId=_8;this.deferred=new _3();this._loadDefaultConfiguration();return this.deferred.promise;},_loadDefaultConfiguration:function(){this.loadJson(this.defaultConfigFile,_2.hitch(this,this._handleDefaultConfigurationLoaded),_2.hitch(this,this._handleDefaultConfigurationLoadError));},_loadTemplateConfiguration:function(){var _9=_4({url:_7.arcgisUrl+"/"+this.appId+"/data",content:{f:"json"},callbackParamName:"callback",load:_2.hitch(this,this.handleTemplateResponse)});},handleTemplateResponse:function(_a){this.templateResponse=_a;this.appConfig={};for(var _b in _a.values){if(_a.values[_b]!==undefined){this.appConfig[_b]=_a.values[_b];}}this._loadWebMapItem(this.appConfig.webmap);},_loadWebMapItem:function(_c){_7.getItem(_c).then(_2.hitch(this,this.handleWebMapItemLoaded));},handleWebMapItemLoaded:function(_d){this.webMapItem=_d;var _e=_2.mixin(this.defaultConfiguration.values,this.appConfig);this.viewerConfiguration=this._applicationConfigurationToViewerConfiguration(_e);this.viewerConfiguration.webMapItem=this.webMapItem;this.handleWebMapConfigurationComplete();},_handleDefaultConfigurationLoaded:function(_f){this.defaultConfiguration=_f;this.portalUrl=this.defaultConfiguration.values.portalConfiguration.url;_7.arcgisUrl=VIEWER_UTILS.joinUrl(this.portalUrl,this.defaultConfiguration.values.portalConfiguration.itemsPath);this._loadTemplateConfiguration();},handleWebMapConfigurationComplete:function(){this.finalizeLoad();},finalizeLoad:function(){this.deferred.resolve(this.viewerConfiguration);},_handleDefaultConfigurationLoadError:function(){alert("Could not load default configuration");},_applicationConfigurationToViewerConfiguration:function(_10){var _11={small:true,display:true,headerText:"Mapping Application",headerImage:"images/logoSmall.png",contact:{label:"Contact Us",url:"http://www.esri.com/about-esri/contact"},help:{label:"Help",url:"http://support.esri.com/en/"}};var _12={webMapItem:_10.webmap,header:_11};for(var key in _10){if(_5.indexOf(this.ignoreProcessingConfigurationEntries,key)>-1){continue;}else{if(key===this.showHeaderParameter){_12.header.display=_10[key];}else{if(key===this.headerTextParameter){_12.header.headerText=_10[key];}else{if(key===this.helpLinkParameter){_12.header.contact.url=_10[key];}else{if(key===this.contactUsParameter){_12.header.help.url=_10[key];}else{if(this.appConfigToViewerWidgetConfigLookup[key]){_12[key]={create:_10[key]};}else{if(this.appConfigToViewerWindowWidgetConfigLookup[key]){_12[key]={window:{create:_10[key]}};}else{_12[key]={create:false};}}}}}}}}this._applyWebMappingApplicationDefaults(_10,_12);return _12;},_applyWebMappingApplicationDefaults:function(_13,_14){var _15=_13[this.showOverviewParameter]!=null&&_13[this.showOverviewParameter];var _16=_13[this.showLegendParameter]!=null&&_13[this.showLegendParameter];_14.map={overview:{create:_15},useBasemapGallery:true,legend:{create:_16}};_14.toolsBar={showToolsDropdown:true,showLayersButton:true,showConfigureLocatorsIcon:false,showBookmarksButton:true};_14.toolsAccordion={create:false};if(this.portalUrl){_14.portal={url:this.portalUrl};}if(_13.geometryServiceUrl){_14.geometryServiceUrl=_13.geometryServiceUrl;}if(_13.locators){_14.locators=_13.locators;}var _17=_14[this.appConfigToViewerWidgetConfigLookup.socialMediaWidget];if(_17){if(_17.create){_17.configurationUrl=this.defaultConfiguration.values.baseViewer.socialMediaWidgetConfiguration.configurationUrl;}}var _18=_14[this.appConfigToViewerWidgetConfigLookup.weatherWidget];if(_18){if(_18.create){_18.configurationUrl=this.defaultConfiguration.values.baseViewer.weatherWidgetConfiguration.configurationUrl;}}var _19=_14[this.appConfigToViewerWidgetConfigLookup.printWidget];if(_19){if(_19.create){_19.printTaskUrl=this.defaultConfiguration.values.baseViewer.printWidgetConfiguration.printTaskUrl;}}var _1a=_14[this.appConfigToViewerWidgetConfigLookup.zoomToWidget];if(_1a){if(_1a.create){_1a.stateJson=this.defaultConfiguration.values.baseViewer.zoomToWidgetConfiguration.stateJson;_1a.countyJson=this.defaultConfiguration.values.baseViewer.zoomToWidgetConfiguration.countyJson;}}}});});