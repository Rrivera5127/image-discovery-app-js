define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/topic",
        "esriviewer/ui/window/WindowWidget",
        "./UploaderWidget",
        "esri/IdentityManager",
        "esriviewer/base/DataLoaderSupport",
        "esri/ServerInfo",
        "esri/request",
        "dojo/dom-class"

    ],
    function (declare, lang, topic, WindowWidget, UploaderWidget, IdentityManager, DataLoaderSupport, ServerInfo, esriRequest, domClass) {
        return declare(
            [WindowWidget, DataLoaderSupport],
            {
                defaultPositioning: {
                    x: 450,
                    y: 55
                },
                arcGISServerRestUrl: null,
                windowWidth: "750px",
                windowHeaderText: "Upload Images",
                windowIconAltText: "Upload Images",
                windowIconClass: "commonIcons16 upload",
                positioningParamName: "uploader",
                initListeners: function () {
                    this.inherited(arguments);
                    this.subscribes.push(topic.subscribe(IMAGERY_GLOBALS.EVENTS.UPLOADER.WINDOW.SHOW, lang.hitch(this, this.show)));
                    this.subscribes.push(topic.subscribe(IMAGERY_GLOBALS.EVENTS.UPLOADER.WINDOW.HIDE, lang.hitch(this, this.hide)));
                    this.subscribes.push(topic.subscribe(IMAGERY_GLOBALS.EVENTS.UPLOADER.WINDOW.TOGGLE, lang.hitch(this, this.toggle)));
                },
                show: function () {
                    if (this.uploaderWidget) {
                        if (!this.visible) {
                            this.onBeforeWindowShow();
                            domClass.remove(this.domNode, "windowHidden");

                            if (this.animate) {
                                this._animateWidget();
                            }
                            this.visible = true;
                            if (this.firstShow) {
                                this.firstShow = false;
                                this.onFirstWindowShow();
                            }
                            this.onAfterWindowShow();
                        }
                    }
                    else {
                        this._uploaderShow()
                    }
                },
                /**
                 * @description  hides the window
                 */
                hide: function () {
                    if (this.visible) {
                        this.onBeforeWindowHide();
                        domClass.add(this.domNode, "windowHidden");
                        if (this.animate) {
                            this._removeAnimationClasses();
                        }
                        this.visible = false;
                        this.hidePopups();
                        this.onAfterWindowHide();
                    }
                },

                _uploaderShow: function () {
                    this.loadUploaderWidgetConfiguration(lang.hitch(this, function (fileUploadUrlObj) {
                        if (fileUploadUrlObj && fileUploadUrlObj.token) {
                            this.uploaderWidget = new UploaderWidget({
                                fileUploadEndpoint: fileUploadUrlObj.serviceUrl,
                                token: fileUploadUrlObj.token,
                                folders: fileUploadUrlObj.folders,
                                collectionField: this.collectionField
                            });
                            this.show();
                            this.setContent(this.uploaderWidget.domNode);
                        }
                        else {
                            this.hide();
                        }
                    }));


                },
                loadUploaderWidgetConfiguration: function (callback) {
                    this.inherited(arguments);
                    //load the weather widget config
                    var uploaderWidgetConfiguration = null;
                    topic.publish(VIEWER_GLOBALS.EVENTS.CONFIGURATION.GET_ENTRY, "uploaderWidget", function (uploaderWidgetConf) {
                        uploaderWidgetConfiguration = uploaderWidgetConf;
                    });
                    if (uploaderWidgetConfiguration && lang.isObject(uploaderWidgetConfiguration) && uploaderWidgetConfiguration.configurationUrl) {
                        this.loadJson(uploaderWidgetConfiguration.configurationUrl, lang.hitch(this, function (configuration) {
                                lang.mixin(this, configuration || {});
                                this.getUploaderCredential(lang.hitch(this, function (uploaderCredential) {
                                    if (uploaderCredential) {
                                        this.loadJsonP(VIEWER_UTILS.joinUrl(uploaderCredential.server, "arcgis/rest/self"), {
                                            f: "json",
                                            token: uploaderCredential.token
                                        }, lang.hitch(this, function (res) {
                                            if (res && res.user && res.user.roles) {
                                                var i;
                                                for (i = 0; i < res.user.roles.length; i++) {
                                                    if (this.usernamesToService[res.user.roles[i]]) {
                                                        this.uploaderService = this.usernamesToService[res.user.roles[i]];
                                                        var servicePart = VIEWER_UTILS.joinUrl(this.arcGISServerRestUrl, this.uploaderService);
                                                        servicePart = VIEWER_UTILS.joinUrl(servicePart, "ImageServer");

                                                        var foldersCallback = lang.hitch(this, function (response) {
                                                            callback({
                                                                serviceUrl: servicePart,
                                                                token: uploaderCredential.token,
                                                                folders: this.getFolders(response)
                                                            });
                                                        });


                                                        this.queryFolders(servicePart, uploaderCredential.token, foldersCallback);
                                                        break;

                                                    }
                                                }
                                            }
                                            else {
                                                alert("Could not locate uploader credential");
                                            }
                                        }))

                                    }
                                    else {
                                        alert("Could not locate uploader credential");
                                    }
                                }));
                            }
                        ));
                    }
                }
                ,
                getUploaderCredential: function (callback) {
                        this.requestUserLogin(callback)
                },
                requestUserLogin: function (callback) {
                    this.dialogCancelListener = IdentityManager.on("dialog-cancel", lang.hitch(this, function () {
                        this.hide();
                        this.dialogCancelListener.remove();
                    }));
                    //we want a long lived token
                    IdentityManager.signIn(this.arcGISServerRestUrl, this.serverLoginInfo).then(lang.hitch(this, function (res) {
                        callback(res);
                    }));
                },
                queryFolders: function (serviceUrl, token, callback) {
                    var params = {
                        where: "1=1",
                        returnGeometry: false,
                        returnDistinctValues: true,
                        f: "json",
                        token: token,
                        outFields: this.collectionField
                    };
                    esriRequest({
                        url: VIEWER_UTILS.joinUrl(serviceUrl, "query"),
                        content: params,
                        handleAs: "json",
                        load: callback,
                        error: callback
                    });

                },
                getFolders: function (queryResponse) {
                    var i, currentFeature, folders = [], allFolderNames = [];
                    if (queryResponse && queryResponse.features) {
                        for (i = 0; i < queryResponse.features.length; i++) {
                            currentFeature = queryResponse.features[i];
                            if (currentFeature.attributes && currentFeature.attributes[this.collectionField]) {
                                allFolderNames.push(currentFeature.attributes[this.collectionField]);
                            }
                        }
                    }
                    allFolderNames.sort();
                    for (i = 0; i < allFolderNames.length; i++) {
                        folders.push({name: allFolderNames[i], id: allFolderNames[i]});
                    }
                    return folders;
                }
            });
    })
;
