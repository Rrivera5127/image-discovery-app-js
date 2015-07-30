define([
        "dojo/_base/declare",
        "dojo/text!./template/UploaderWidgetTemplate.html",
        "xstyle/css!./theme/UploaderWidgetTheme.css",
        "xstyle/css!./lib/font-awesome/css/font-awesome.css",
        "esri/layers/ArcGISImageServiceLayer",
        "dojo/topic",
        "dojo/_base/lang",
        "dojo/sniff",
        "dojo/dom",
        "esriviewer/ui/base/UITemplatedWidget",
        "./model/UploaderViewModel",
        "dojo/dnd/move",
        "dojo/_base/connect",
        "dojo/dom-construct",
        "dojo/_base/array",
        "dojo/dom-style",
        "dijit/form/Button",
        "./base/UploadFile/UploadFile",
        "dojo/dom-class",
        "dojo/dom-attr",
        "esri/config",
        "dijit/form/DateTextBox",
        "esri/request",
        "dojo/date/locale",
        "dojo/store/Memory",
        "dijit/form/ComboBox"


    ],
    //  function (declare, template, theme, topic, lang, sniff, doshareWithOrgm,  UITemplatedWidget, UploaderViewModel, Move, con, domConstruct, domStyle, Button) {
    function (declare, template, theme, fontAwesome, ArcGISImageServiceLayer, topic, lang, sniff, dom, UITemplatedWidget, UploaderViewModel, Move, con, domConstruct, array, domStyle, Button, UploadForm, domClass, domAttr, esriConfig, DateTextBox, esriRequest, locale, Memory, FilteringSelect) {
        return declare(
            [UITemplatedWidget],
            {

                uploadForms: [],
                uploadFilesMixin: {
                    f: "json",
                    itemIds: [],
                    rasterType: "Raster Dataset",
                    buildThumbnail: false,
                    buildPyramids: false,
                    //minimumCellSizeFactor: 0,
                    //maximumCellSizeFactor: 10,
                    attributes: {},
                    geodataTransformApplyMethod: "esriGeodataTransformApplyAppend"
                },
                token: null,
                fileUploadEndpoint: "",
                templateString: template,
                constructor: function (params) {

                    lang.mixin(this, params || {});
                    if (!this.folders) {
                        this.folders = [];
                    }
                    console.log("created:" + this.fileUploadEndpoint);
                },
                postCreate: function () {
                    this.inherited(arguments);
                    //get a map reference
                    var mapRef;
                    topic.publish(VIEWER_GLOBALS.EVENTS.MAP.GET, function (responseMap) {
                        mapRef = responseMap;
                    });
                    this.map = mapRef;
                    this.viewModel = new UploaderViewModel();
                    ko.applyBindings(this.viewModel, this.domNode);
                    this.createNewUploadForm();
                    this.createDateInputContainer();
                    this.createFolderSelect();

                },
                createFolderSelect: function () {
                    this.sourceInput = new FilteringSelect({
                        maxHeight: 150,
                        store: new Memory({
                            data: this.folders
                        }),
                        searchAttr: "name"
                    }, this.folderSelectContainer);
                    this.sourceInput.startup();
                },
                createDateInputContainer: function () {
                    this.dateInput = new DateTextBox(
                        {constraints: {datePattern: "yyyy-MM-dd"}}, this.dateInputContainer);
                },
                createNewUploadForm: function () {
                    var currentUploadForm = new UploadForm({
                        fileUploadEndpoint: VIEWER_UTILS.joinUrl(this.fileUploadEndpoint, "/uploads/upload"),
                        token: this.token
                    });
                    currentUploadForm.on("uploadStart", lang.hitch(this, this.createNewUploadForm));
                    currentUploadForm.on("removeItem", lang.hitch(this, this.removeUploadFile, currentUploadForm));

                    this.uploadForms.push(currentUploadForm);
                    domConstruct.place(currentUploadForm.domNode, this.uploadFormContainer);
                },
                removeUploadFile: function (uploadFile) {
                    domConstruct.destroy(uploadFile.domNode);
                    for (var i = 0; i < this.uploadForms.length; i++) {
                        if (this.uploadForms[i] === uploadFile) {
                            this.uploadForms.splice(i, 1);
                            console.log("found item");
                            break;
                        }
                    }
                },
                _clear: function () {
                    domConstruct.empty(this.uploadFormContainer);
                    this.uploadForms = [];
                    this.clearMetadata();
                    this.createNewUploadForm();
                },
                clear: function () {
                    this._clear();
                    this.showUploadButton();


                },
                clearMetadata: function () {
                    this.dateInput.reset();
                    this.sourceInput.set("value", "");
                },
                getMetadata: function () {
                    var metadata = {};
                    var date = this.dateInput.get("value");
                    var source = this.sourceInput.get("value");
                    if (name) {
                        metadata.name = name;
                    }
                    if (date) {
                        metadata.AcquisitionDate = locale.format(date, {selector: 'date', datePattern: 'yyyy-MM-dd'});
                        ;
                    }
                    if (source) {
                        metadata.folder = source;
                    }
                    return metadata;
                },
                uploadData: function () {
                    var i, currentUploadForm, validUploads = [];
                    for (i = 0; i < this.uploadForms.length; i++) {
                        currentUploadForm = this.uploadForms[i];
                        if (currentUploadForm && currentUploadForm.getUploadId()) {
                            validUploads.push(currentUploadForm.getUploadId());
                        }
                    }
                    if (validUploads.length > 0) {
                        this.setUploading();
                        var params = JSON.parse(JSON.stringify(this.uploadFilesMixin));
                        params.attributes = JSON.stringify(this.getMetadata());
                        params.itemIds = validUploads.join(",");
                        params.token = this.token;
                        params.computeStatistics = this.computeStatsCheckbox.checked;
                        var addUrl = VIEWER_UTILS.joinUrl(this.fileUploadEndpoint, "add");
                        esriRequest({
                            url: addUrl,
                            content: params,
                            handleAs: "json",
                            load: lang.hitch(this, this.handleAddResponse),
                            error: lang.hitch(this, this.handleAddError)
                        }, {usePost: true})
                    }
                    else {
                        alert("There are no files to upload");
                    }
                },
                handleAddError: function (response) {
                    alert("There was an error adding imagery to the dataset");
                },
                handleAddResponse: function (response) {
                    this._clear();
                    if (response) {
                        var processedAddResponse = this._processAddResponse(response);
                        if (processedAddResponse.added && processedAddResponse.added.length) {
                            this.showSuccess(processedAddResponse.added.length, processedAddResponse.rejected.length);
                        }
                        else {
                            this.showSuccessButNoImagery();
                        }
                    }
                    else {
                        alert("There was an error adding imagery to the dataset");
                    }
                },
                _processAddResponse: function (response) {
                    var processedResponse = {
                        added: [],
                        rejected: []
                    };
                    if (!response || !response.addResults || !response.addResults.length) {
                        return response;
                    }
                    var i;
                    for (i = 0; i < response.addResults.length; i++) {
                        if (response.addResults[i].success) {
                            processedResponse.added.push(response.addResults[i]);
                        }
                        else {
                            processedResponse.rejected.push(response.addResults[i]);
                        }
                    }
                    return processedResponse;

                },
                showUploadButton: function () {
                    this._showNode(this.uploadSpectralSignatureButton);
                    domClass.add(this.uploadIcon, "fa-upload");
                    domClass.remove(this.uploadIcon, "fa-spin fa-spinner");
                    domAttr.set(this.uploadSpectralSignatureButton, "disabled", false);
                    domAttr.set(this.clearUploadFormButton, "disabled", false);
                }
                ,
                setUploading: function () {
                    domAttr.set(this.uploadSpectralSignatureButton, "disabled", true);
                    domClass.remove(this.uploadIcon, "fa-upload");
                    domClass.add(this.uploadIcon, "fa-spin fa-spinner");
                    domAttr.set(this.clearUploadFormButton, "disabled", true);

                }
                ,
                showSuccessButNoImagery: function () {
                    this._hideNode(this.uploadImageryActionContainer);
                    this._showNode(this.uploadSuccessButNoImageryContainer);
                    this._hideNode(this.uploadFormContainer);
                    this._hideNode(this.addAnotherFileButtonContainer);
                },
                showSuccess: function (added, rejected) {
                    this._hideNode(this.uploadImageryActionContainer);
                    this._showNode(this.uploadSuccessContainer);
                    this._hideNode(this.uploadFormContainer);
                    this._hideNode(this.addAnotherFileButtonContainer);

                    domAttr.set(this.uploadSuccessAddCount,"innerHTML",added + "");
                    //domAttr.set(this.uploadSuccessRejectCount,"innerHTML",rejected + "");


                },
                clearSuccess: function () {
                    this.clear();
                    this._showNode(this.addAnotherFileButtonContainer);
                    this._showNode(this.uploadImageryActionContainer);
                    this._hideNode(this.uploadSuccessContainer);
                    this._hideNode(this.uploadSuccessButNoImageryContainer);
                    this._showNode(this.uploadFormContainer);
                }
                ,
                _hideNode: function (node) {
                    if (!domClass.contains(node, "hidden")) {
                        domClass.add(node, "hidden");
                    }
                }
                ,
                _showNode: function (node) {
                    if (domClass.contains(node, "hidden")) {
                        domClass.remove(node, "hidden");
                    }
                },
            });
    })
;
