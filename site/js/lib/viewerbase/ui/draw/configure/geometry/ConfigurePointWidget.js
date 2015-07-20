//>>built
require({cache:{"url:esriviewer/ui/draw/configure/geometry/template/ConfigurePointTemplate.html":"<div class=\"configureDrawGeometryContainer\">\r\n    <div class=\"annotationOptionContainer\">\r\n        <span class=\"annotationsOptionsLabel\">Marker Style</span>\r\n        <select data-bind=\"options: markerStyles ,value:selectedMarkerStyle, optionsText: 'label', optionsValue: 'value'\"></select>\r\n    </div>\r\n    <div class=\"annotationOptionContainer\">\r\n        <span class=\"annotationsOptionsLabel\">Marker Size</span>\r\n        <select data-bind=\"options: markerSizes ,value:selectedMarkerSize\"></select>\r\n    </div>\r\n    <div class=\"annotationOptionContainer\">\r\n        <span class=\"annotationsOptionsLabel\">Outline Style</span>\r\n        <select data-bind=\"options: outlineStyles ,value:selectedOutlineStyle, optionsText: 'label', optionsValue: 'value'\"></select>\r\n    </div>\r\n    <div class=\"annotationOptionContainer\">\r\n        <span class=\"annotationsOptionsLabel\">Outline Width</span>\r\n        <select data-bind=\"options: outlineWidths ,value:selectedOutlineWidth\"></select>\r\n    </div>\r\n    <div class=\"annotationOptionContainer\">\r\n        <span class=\"annotationsOptionsLabel\">Angle</span>\r\n        <select data-bind=\"options: angles ,value:selectedAngle\"></select>\r\n    </div>\r\n    <div data-dojo-attach-point=\"transparencySliderContainer\"></div>\r\n    <div class=\"colorPickerTextContainer\">\r\n        <span class=\"colorPickerText\"\r\n              data-bind=\"click: setMarkerColorMode,css:{colorPickerTextSelected: markerColorActive}\"> Marker Color</span>\r\n        <span class=\"colorPickerText\"\r\n              data-bind=\"click: setOutlineColorMode,css:{colorPickerTextSelected: outlineColorActive}\"> Outline Color</span>\r\n\r\n    </div>\r\n\r\n    <div class=\"configureDrawColorPickerContainer\" data-dojo-attach-point=\"colorPickerContainer\"></div>\r\n</div>"}});define("esriviewer/ui/draw/configure/geometry/ConfigurePointWidget",["dojo/_base/declare","dojo/text!./template/ConfigurePointTemplate.html","dojo/_base/Color","dojo/_base/lang","./model/ConfigurePointViewModel","./BaseGeometryConfigurationWidget","esri/symbols/SimpleMarkerSymbol","esri/symbols/SimpleLineSymbol"],function(_1,_2,_3,_4,_5,_6,_7,_8){return _1([_6],{templateString:_2,postCreate:function(){this.inherited(arguments);this.viewModel=new _5();this.viewModel.selectedMarkerStyle.subscribe(_4.hitch(this,this.processChange));this.viewModel.selectedMarkerSize.subscribe(_4.hitch(this,this.processChange));this.viewModel.selectedAngle.subscribe(_4.hitch(this,this.processChange));this.viewModel.selectedOutlineWidth.subscribe(_4.hitch(this,this.processChange));this.viewModel.selectedOutlineStyle.subscribe(_4.hitch(this,this.processChange));this.viewModel.markerColorActive.subscribe(_4.hitch(this,this.handleMarkerColorToggled));this.markerColor=new _3([255,0,0,this.getTransparency()/100]);this.outlineColor=new _3([255,0,0,this.getTransparency()/100]);this.colorPicker.set("value",this.markerColor.toHex());ko.applyBindings(this.viewModel,this.domNode);},handleTransparencyChanged:function(){var _9=this.getTransparency()/100;this.outlineColor=new _3([this.outlineColor.r,this.outlineColor.g,this.outlineColor.b,_9]);this.markerColor=new _3([this.markerColor.r,this.markerColor.g,this.markerColor.b,_9]);this.inherited(arguments);},handleMarkerColorToggled:function(_a){if(_a){this.colorPicker.set("value",this.markerColor.toHex());}else{this.colorPicker.set("value",this.outlineColor.toHex());}},handleColorPickerChanged:function(){if(this.viewModel.outlineColorActive()){this.outlineColor=this.getColor();}else{this.markerColor=this.getColor();}this.processChange();},processChange:function(){this.onChange(this.getSymbol());},getSymbol:function(){return new _7(this.viewModel.selectedMarkerStyle(),parseInt(this.viewModel.selectedMarkerSize(),10),new _8(this.viewModel.selectedOutlineStyle(),this.outlineColor,this.viewModel.selectedOutlineWidth()),this.markerColor).setAngle(this.viewModel.selectedAngle());}});});