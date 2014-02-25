//>>built
require({cache:{"url:esriviewer/ui/geocode/template/ReverseGeocodeWidgetTemplate.html":"<div class=\"reverseGeocodeContainer\">\r\n    <div class=\"reverseActionsContainerOuter\">\r\n        <div class=\"reverseGeocodeActionsContainer\">\r\n            <div class=\"commonIcons32 pointUnselected fivePixelBorderRadius\"\r\n                 data-bind=\"click: toggleDrawActive, css:{pointSelected: drawActive}\"></div>\r\n        </div>\r\n        <div class=\"reverseGeocodeDistanceContainer\">\r\n            <div class=\"reverseGeocodeDistanceLabel defaultFont\">Distance (m)</div>\r\n            <input class=\"reverseGeocodeDistanceInput\" type=\"text\" data-bind=\"value:reverseGeocodeDistance\"/>\r\n        </div>\r\n    </div>\r\n    <div class=\"reverseGeocodeResultsContainer\" data-bind=\"visible: resultVisible\">\r\n        <div class=\"reverseGeocodeResultsHeader\">Result</div>\r\n        <div class=\"reverseGeocodeResultEntry\" data-bind=\"visible: showStreetResult\">\r\n            <span>Street:</span>\r\n            <span data-bind=\"text:reverseGeocodeStreet\"></span>\r\n        </div>\r\n        <div class=\"reverseGeocodeResultEntry\" data-bind=\"visible: showAddressResult\">\r\n            <span>Address:</span>\r\n            <span data-bind=\"text:reverseGeocodeAddress\"></span>\r\n        </div>\r\n        <div class=\"reverseGeocodeResultEntry\" data-bind=\"visible: showCityResult\">\r\n            <span>City:</span>\r\n            <span data-bind=\"text:reverseGeocodeCity\"></span>\r\n        </div>\r\n        <div class=\"reverseGeocodeResultEntry\" data-bind=\"visible: showStateResult\">\r\n            <span>State:</span>\r\n            <span data-bind=\"text:reverseGeocodeState\"></span>\r\n        </div>\r\n        <div class=\"reverseGeocodeResultEntry\" data-bind=\"visible: showZipResult\">\r\n            <span>Zip:</span>\r\n            <span data-bind=\"text:reverseGeocodeZip\"></span>\r\n        </div>\r\n        <div class=\"reverseGeocodeResultEntry\" data-bind=\"visible: showPostalResult\">\r\n            <span>Postal:</span>\r\n            <span data-bind=\"text:reverseGeocodePostal\"></span>\r\n        </div>\r\n        <div class=\"reverseGeocodeResultEntry\" data-bind=\"visible: showCertaintyResult\">\r\n            <span>Certainty:</span>\r\n            <span data-bind=\"text:reverseGeocodeCertainty\"></span>\r\n            <span>%</span>\r\n        </div>\r\n    </div>\r\n    <div data-bind=\"visible: noResultsVisible\">\r\n        No Address Found\r\n    </div>\r\n</div>"}});define("esriviewer/ui/geocode/ReverseGeocodeWidget",["dojo/_base/declare","dojo/text!./template/ReverseGeocodeWidgetTemplate.html","dojo/topic","dojo/_base/Color","dojo/_base/lang","../base/UITemplatedWidget","../draw/base/MapDrawSupport","./model/ReverseGeocodeViewModel","esri/symbols/SimpleLineSymbol","esri/symbols/SimpleMarkerSymbol"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a){return _1([_6,_7],{templateString:_2,postCreate:function(){this.inherited(arguments);this.viewModel=new _8();this.viewModel.drawActive.subscribe(_5.hitch(this,this.handleDrawActiveChange));ko.applyBindings(this.viewModel,this.domNode);this.initSymbology();this.handleReverseGeocodeErrorCallback=_5.hitch(this,this.handleReverseGeocodeError);this.handleReverseGeocodeResponseCallback=_5.hitch(this,this.handleReverseGeocodeResponse);},initSymbology:function(){this.pointSymbol=new _a(_a.STYLE_X,1,new _9(_9.STYLE_SOLID,new _4("blue")));},handleDrawActiveChange:function(_b){if(_b){this.handlePointDraw();}else{this.clearDraw();}},handlePointDraw:function(){this.setDraw(VIEWER_GLOBALS.EVENTS.MAP.TOOLS.DRAW_POINT);},clearDraw:function(){this.inherited(arguments);_3.publish(VIEWER_GLOBALS.EVENTS.DRAW.USER.DRAW_CANCEL);this.viewModel.drawActive(false);},geometryAdded:function(_c){var _d=this.viewModel.reverseGeocodeDistance();var _e=REG_EXP_UTILS.stripNonNumeric(_d);var _f=parseInt(_e,10);_3.publish(VIEWER_GLOBALS.EVENTS.LOCATOR.REVERSE_GEOCODE,_c,_f,this.handleReverseGeocodeResponseCallback,this.handleReverseGeocodeErrorCallback);this.handlePointDraw();},handleReverseGeocodeResponse:function(_10){if(_10&&_10.address!=null&&_5.isObject(_10.address)){this.viewModel.showResults();if(_10.address.Street!=null){this.viewModel.reverseGeocodeStreet(_10.address.Street);this.viewModel.showStreetResult(true);}else{this.viewModel.reverseGeocodeStreet("");this.viewModel.showStreetResult(false);}if(_10.address.City!=null){this.viewModel.reverseGeocodeCity(_10.address.City);this.viewModel.showCityResult(true);}else{this.viewModel.reverseGeocodeCity("");this.viewModel.showCityResult(false);}if(_10.address.Address!=null){this.viewModel.reverseGeocodeAddress(_10.address.Address);this.viewModel.showAddressResult(true);}else{this.viewModel.reverseGeocodeAddress("");this.viewModel.showAddressResult(false);}if(_10.address.Postal!=null){this.viewModel.reverseGeocodePostal(_10.address.Postal);this.viewModel.showPostalResult(true);}else{this.viewModel.reverseGeocodePostal("");this.viewModel.showPostalResult(false);}if(_10.address.State!=null){this.viewModel.reverseGeocodeState(_10.address.State);this.viewModel.showStateResult(true);}else{this.viewModel.reverseGeocodeState("");this.viewModel.showStateResult(false);}if(_10.address.PostalCode!=null){this.viewModel.reverseGeocodeZip(_10.address.PostalCode);this.viewModel.showZipResult(true);}else{this.viewModel.reverseGeocodeZip("");this.viewModel.showZipResult(false);}if(_10.score!=null){this.viewModel.reverseGeocodeCertainty(_10.score.toString());this.viewModel.showCertaintyResult(true);}else{this.viewModel.reverseGeocodeCertainty("");this.viewModel.showCertaintyResult(false);}}else{this.viewModel.showNoResults();}},handleReverseGeocodeError:function(err){if(err!=null&&_5.isString(err)){VIEWER_UTILS.log("An error was encountered with reverse geocode",VIEWER_GLOBALS.LOG_TYPE.ERROR);VIEWER_UTILS.log(err,VIEWER_GLOBALS.LOG_TYPE.ERROR);_3.publish(VIEWER_GLOBALS.EVENTS.MESSAGING.SHOW,err);}else{VIEWER_UTILS.log("An error was encountered with reverse geocode",VIEWER_GLOBALS.LOG_TYPE.ERROR);if(err!=null&&err.details!=null&&err.details.length>0){if(err.details[0]=="Unable to find address for the specified location."){this.viewModel.showNoResults();return;}}_3.publish(VIEWER_GLOBALS.EVENTS.MESSAGING.SHOW,"Reverse Geocode Failed");}},reset:function(){this.clearDraw();this.viewModel.reverseGeocodeZip("");this.viewModel.reverseGeocodeCertainty("");this.viewModel.reverseGeocodeState("");this.viewModel.reverseGeocodeCity("");this.viewModel.reverseGeocodeStreet("");this.viewModel.hideNoResultsAndResults();}});});