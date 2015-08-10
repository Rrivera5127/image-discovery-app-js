define([
        "dojo/_base/declare",
        'dojo/_base/lang',
        "require",
        "esri/IdentityManager",
        'dojo/cookie',
        'dojo/json',
        "./OAuthHelper"
    ],
    function (declare, lang, require, IdentityManager, cookie, json, OAuthHelper) {
        return declare(
            [],
            {
                cookiePath: "/DHSUpload",
                constructor: function (appId, portalUrl, loginErrorForward) {
                    if (appId && portalUrl) {
                        var _persistUser = false;
                        if (window.location.hash.indexOf("error=access_denied") > -1 || window.location.hash.indexOf("error=invalid_request") > -1) {
                            window.location = loginErrorForward || "http://www.esri.com";
                            return;
                        }
                        if (window.location.hash.indexOf("persist=true") > -1) {
                            _persistUser = true;
                        }
                        OAuthHelper.init({
                            appId: appId,
                            portal: portalUrl,
                            expiration: (7 * 24 * 60),
                            popup: false
                        });
                        if (!OAuthHelper.isSignedIn()) {
                            OAuthHelper.signIn();
                        }
                        /*
                         else {
                         if (_persistUser) {
                         this.persistUser(portalUrl);
                         }
                         }
                         */
                    }
                },
                persistUser: function (portalUrl) {
                    console.log("persistUser");
                    var credential;
                    credential = IdentityManager.findCredential(portalUrl);
                    cookie(this.getCookieKey(portalUrl), json.stringify(credential), {
                        expires: new Date(credential.expires),
                        path: this.cookiePath
                    });
                },

                getCookieKey: function (/*optional*/ _portalUrl) {
                    var cookieKey = 'esri_auth_' + lang.trim(_portalUrl || portalUrl);
                    if (!cookieKey.endWith('/')) {
                        cookieKey += '/';
                    }
                    return cookieKey;
                }
            })
    });
