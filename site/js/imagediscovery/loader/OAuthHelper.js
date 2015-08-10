///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define(
    [
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/json",
        "dojo/_base/url",
        "dojo/_base/html",
        "dojo/sniff",
        "dojo/on",
        "dojo/_base/Deferred",
        "dojo/io-query",
        "esri/IdentityManager"
    ],
    function (declare, lang, dojoJson, Url, html, sniff, on, Deferred, ioquery, idManager) {

        var OAuthHelper = {

            portal: "http://www.arcgis.com",

            popupCallbackPage: window.location.protocol + "//" + window.location.host + require.toUrl("imagediscovery") + "/loader/oauth-callback.html",

            init: function (parameters) {
                /**
                 * parameters = {
         *   appId:       "<String>",
         *   portal:      "<String>", // deafult is "http://www.arcgis.com"
         *   expiration:   <Number>,  // in minutes
         *   popup:        <Boolean>
         * }
                 */

                lang.mixin(this, parameters);
                this.portalUrl = this.portal + "/sharing/rest";

                // Read OAuth response from the page url fragment if available,
                // and register with identity manager
                this.checkOAuthResponse(window.location.href, true);
            },

            isSignedIn: function () {
                var cred = idManager.findCredential(this.portalUrl);
                console.dir(cred);
                return !!idManager.findCredential(this.portalUrl);
            },

            signIn: function () {
                var deferred = (this.deferred = new Deferred());

                var authParameters = {
                    client_id: this.appId,
                    response_type: "token",
                    expiration: this.expiration, // in minutes. Default is 30.
                    redirect_uri: this.popup ?
                        this.popupCallbackPage : window.location.href.replace(/#.*$/, "")
                };

                var authUrl = this.portal.replace(/^http:/i, "https:") +
                    "/sharing/oauth2/authorize?" +
                    ioquery.objectToQuery(authParameters);

                if (this.popup) {
                    // Internet Explorer 8 throws error if windowName
                    // (second argument below) has hyphen
                    var selfWidth = 600, selfHeight = 500;
                    var left = (window.innerWidth - selfWidth) / 2;
                    var top = (window.innerHeight - selfHeight) / 2;

                    var features = "width=" + selfWidth + ",height=" + selfHeight + ",left=" + left + ",top=" + top + ",location=yes,status=yes,scrollbars=yes";
                    var popWin = window.open(authUrl, "esriOAuth", features);
                    if ((popWin && popWin.closed) || !popWin) {
                        alert("Sign in popup blocked");
                        /*
                         new Message({
                         message:mainNls.oauthHelper.signInBlockedTip
                         });
                         */
                    } else {
                        var intervalId = setInterval(function () {
                            if (!popWin || popWin.closed) {
                                clearInterval(intervalId);
                                if (!deferred.isFulfilled()) {
                                    deferred.reject();
                                }
                            }
                        }, 500);
                        try {
                            if (sniff("chrome") && popWin && popWin.moveBy) {
                                popWin.moveBy(left, 0);
                            }
                            popWin.focus();
                        }
                        catch (e) {
                            console.error('popWin.moveTo exception', e);
                            return deferred;
                        }
                    }
                } else {
                    window.location = authUrl;
                }

                return deferred;
            },

            checkOAuthResponse: function (url, clearHash) {
                // This method will be called from popup callback page as well

                var oauthResponse = this.parseFragment(url);

                if (oauthResponse) {
                    if (clearHash) { // redirection flow
                        // Remove OAuth bits from the URL fragment
                        window.location.hash = "";
                    }

                    if (oauthResponse.error) {
                        var error = new Error(oauthResponse.error);
                        error.details = [oauthResponse.error_description];

                        if (this.deferred) {
                            this.deferred.reject(error);
                        }
                    } else {
                        var credential = this.registerToken(oauthResponse);

                        credential.persist = oauthResponse.persist;
                        if (this.deferred) {
                            this.deferred.resolve(credential);
                        }
                    }
                }
            },

            registerToken: function (oauthResponse) {
                // Register the access token with Identity Manager, so that
                // it can be added to all ArcGIS Online REST API requests

                // idManager.registerToken({
                //   server:  this.portalUrl,
                //   userId:  oauthResponse.username,
                //   token:   oauthResponse.access_token,
                //   expires: oauthResponse.expires_at,
                //   ssl:     oauthResponse.ssl
                // });

                idManager.registerToken(oauthResponse);

                var credential = idManager.findCredential(this.portalUrl, oauthResponse.username);
                return credential;
            },

            parseFragment: function (url) {
                var urlObj = new Url(url),
                    fragment = urlObj.fragment ? ioquery.queryToObject(urlObj.fragment) : null;

                if (fragment) {
                    if (fragment.access_token) {
                        // Convert from String to Number
                        fragment.expires_in = Number(fragment.expires_in);

                        // Calculate universal time
                        fragment.expires_at = (new Date()).getTime() + (fragment.expires_in * 1000);


                        fragment.server = this.portalUrl;
                        fragment.token = fragment.access_token;
                        fragment.userId = fragment.username;
                        fragment.expires = fragment.expires_at;
                        fragment.ssl = (fragment.ssl === "true");
                    } else if (fragment.error) {
                        console.log("[OAuth Error]: ", fragment.error, " - ", fragment.error_description);
                    }
                }

                return fragment;
            }

        };

        window.OAuthHelper = OAuthHelper;

        return OAuthHelper;
    });