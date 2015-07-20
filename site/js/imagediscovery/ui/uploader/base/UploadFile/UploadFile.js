define([
        "dojo/_base/declare",
        "dojo/keys",
        "dojo/text!./template/UploadFile.html",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dojo/dom-class",
        "dojo/dom-style",
        "dojo/_base/lang",
        "dojox/uuid/Uuid",
        "dojox/uuid/generateTimeBasedUuid",
        "dojo/dom-attr",
        "dojo/Deferred",
        "dojox/timing",
        "esri/request"

    ],
    function (declare, keys, template, _WidgetBase, _TemplatedMixin, domClass, domStyle, lang, Uuid, generateTimeBasedUuid, domAttr, Deferred, timing, esriRequest) {
        return declare([_WidgetBase, _TemplatedMixin], {
            templateString: template,
            fileUploadEndpoint: "",
            token: null,
            constructor: function (params) {
                this.uploadResponse = null;
                lang.mixin(this, params || {});
            },
            handleUpload: function () {
                this.showThrobber();
                esriRequest({
                    url: this.fileUploadEndpoint,
                    form: this.uploadForm,
                    content: {
                        token: this.token
                    },
                    handleAs: "json",
                    load: lang.hitch(this, this.handleFileUploaded),
                    error: lang.hitch(this, this.handleFileUploadError)
                })
            },
            handleFileUploaded: function (response) {
                this.uploadResponse = response;
                console.log("handleFileUploaded");
                if (response && response.success) {
                    this.showUploadSuccess();
                    window.setTimeout(lang.hitch(this, this.showRemoveUploadItem), 2000);

                }
                else {
                    this.showUploadError();
                }
            },
            handleFileUploadError: function (response) {
                this.uploadResponse = response;
                console.log("handleFileUploadError");
                this.showUploadError();

            },
            handleChange: function () {
                if (this.uploadFileInput.value) {
                    this.handleUpload();
                }
            },
            _onChange: function () {
                this.onChange();
            },
            onChange: function () {

            },
            showRemoveUploadItem: function () {
                if (domClass.contains(this.removeUploadItem, "hidden")) {
                    domClass.remove(this.removeUploadItem, "hidden");
                }
                this.hideUploadSuccess();
            },
            showUploadSuccess: function () {
                this.uploadFileInput.disabled = true;
                if (!domClass.contains(this.uploadFailedIcon, "hidden")) {
                    domClass.add(this.uploadFailedIcon, "hidden");
                }
                if (domClass.contains(this.uploadSuccessIcon, "hidden")) {
                    domClass.remove(this.uploadSuccessIcon, "hidden");
                }
                this.hideThrobber();
                this._onChange();

            },
            hideUploadSuccess: function () {
                if (!domClass.contains(this.uploadSuccessIcon, "hidden")) {
                    domClass.add(this.uploadSuccessIcon, "hidden");
                }
            },
            showUploadError: function () {
                if (domClass.contains(this.uploadFailedIcon, "hidden")) {
                    domClass.remove(this.uploadFailedIcon, "hidden");
                }
                if (!domClass.contains(this.uploadSuccessIcon, "hidden")) {
                    domClass.add(this.uploadSuccessIcon, "hidden");
                }
                this.hideThrobber();
            },
            showThrobber: function () {
                if (domClass.contains(this.loadingContainer, "hidden")) {
                    domClass.remove(this.loadingContainer, "hidden");
                }
            },
            hideThrobber: function () {
                if (!domClass.contains(this.loadingContainer, "hidden")) {
                    domClass.add(this.loadingContainer, "hidden");
                }
            },
            getUploadId: function () {
                if (this.uploadResponse && this.uploadResponse.success && this.uploadResponse.item && this.uploadResponse.item.itemID) {
                    return this.uploadResponse.item.itemID;
                }
                return null;
            },
            handleRemoveItem: function () {
                this._onRemoveItem();
            },
            _onRemoveItem: function () {
                this.onRemoveItem();
            },
            onRemoveItem: function () {

            }
        });
    });
