define([
        "dojo/_base/declare",
        "dojo/keys",
        "dojo/text!./template/UploadFormTemplate.html",
        "dojo/text!./template/DropzoneTemplate.html",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dojo/dom-class",
        "dojo/dom-style",
        "dojo/_base/lang",
        "dojox/uuid/Uuid",
        "dojox/uuid/generateTimeBasedUuid",
        "dojo/dom-attr",
        "dojo/Deferred",
        "dojo/request/xhr",
        "../../lib/dropzone/DropZone",
        'xstyle/css!../../lib/dropzone/DropZone.css'

    ],
    function (declare, keys, template, dropzoneTemplate, _WidgetBase, _TemplatedMixin, domClass, domStyle, lang, Uuid, generateTimeBasedUuid, domAttr, Deferred, xhr, Dropzone, dropzoneTheme) {
        return declare([_WidgetBase, _TemplatedMixin], {
            templateString: template,
            fileUploadEndpoint: "",
            constructor: function (params) {
                Uuid.setGenerator(generateTimeBasedUuid);
                lang.mixin(this, params || {});
                console.log("new upload endpoint: " + this.fileUploadEndpoint);
            },

            postCreate: function () {
                this.inherited(arguments);
                this.tags = [];
                var self = this;
                this.currentDropZone = new Dropzone(this.dropzoneContainer, {
                    clickable: this.addFilesButton,
                    method: "post",
                    previewTemplate: dropzoneTemplate,
                    url: this.fileUploadEndpoint,
                    uploadMultiple: false,
                    parallelUploads: 1,
                    headers:{
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    params: {
                        f: "json",
                        description: "test file upload"
                    },
                    init: function () {
                        this.on("queuecomplete", lang.hitch(self, function () {
                            this.setUploadQueueComplete();

                        }));
                        this.on("addedfile", lang.hitch(self, function () {
                            this.setUploadSending();
                        }));


                    }
                });
            },
            isEnterKey: function (e) {
                return e.keyCode == keys.ENTER;

            },
            setUploadSending: function () {
                domAttr.set(this.addFilesButton, "disabled", true);
                domClass.remove(this.addFilesIcon, "fa-plus");
                domClass.add(this.addFilesIcon, "fa-spin fa-spinner");
                this._hideNode(this.dropzoneContainer);
                this._showNode(this.uploadInProcessContainer);
            },
            setUploadQueueComplete: function () {
                domAttr.set(this.addFilesButton, "disabled", false);
                domClass.add(this.addFilesIcon, "fa-plus");
                domClass.remove(this.addFilesIcon, "fa-spin fa-spinner");
                this._showNode(this.dropzoneContainer);
                this._hideNode(this.uploadInProcessContainer);
            },
            _hideNode: function (node) {
                if (!domClass.contains(node, "hidden")) {
                    domClass.add(node, "hidden");
                }
            },
            _showNode: function (node) {
                if (domClass.contains(node, "hidden")) {
                    domClass.remove(node, "hidden");
                }
            },
            /**
             * @description generates a UUID
             */
            generateUUID: function () {
                var uuid = new Uuid();
                return uuid.toString();
            },
            uploadData: function () {
                var def = new Deferred();
                var files = this.getAddedFiles();
                if (!files || !files.length) {
                    alert("There are no files to upload");
                    def.resolve(false);
                }
                else {

                    this.finalizeFileUpload(files).then(lang.hitch(this, function (data) {
                        var metadataObj = this.getMetadata();
                    }))
                }
                return def;

            },
            finalizeFileUpload: function (files) {
                var title = this.getTitle();
                var spectralJobId = this.currentDropZone.options.params.spectralJobId;
                var finalizeFileUploadUrl = this.joinUrl(this.fileUploadEndpoint, "finalize/" + spectralJobId + "/" + title);
                return xhr.post(finalizeFileUploadUrl, {
                    data: {
                        files: JSON.stringify(files)
                    },
                    handleAs: "json"
                });
            },
            getMetadata: function () {
                var metadata = {};
                var name = this.nameInput.value;
                var date = this.dateInput.value;
                var source = this.sourceInput.value;
                if (name) {
                    metadata.name = name;
                }
                if (date) {
                    metadata.AcquisitionDate = date;
                }
                if (source) {
                    metadata.folder = source;
                }
                return metadata;
            },


            joinUrl: function (url, appendString) {
                if (!url) {
                    url = "";
                }
                if (!appendString) {
                    appendString = "";
                }
                var endingSlash = url.lastIndexOf("/") === url.length - 1;
                if (!endingSlash) {
                    url += "/";
                }
                //strip the starting slash off the appender
                if (appendString[0] === "/") {
                    appendString = appendString.substring(1);
                }
                return url + appendString;
            },
            getAddedFiles: function () {
                var addedFiles = [];
                var i, currentFile;
                if (this.currentDropZone && this.currentDropZone.files) {
                    for (i = 0; i < this.currentDropZone.files.length; i++) {
                        currentFile = this.currentDropZone.files[i];
                        console.log("status: " + currentFile.status);
                        if (currentFile && currentFile.status === "success") {
                            addedFiles.push({
                                name: currentFile.name

                            });

                        }

                    }
                }
                return addedFiles;

            }
        });
    })
;
