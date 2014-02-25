//>>built
define("esriviewer/ui/bookmark/BookmarkController",["dojo/_base/declare","dojo/topic","dojo/has","dojo/cookie","dojo/_base/json","dojo/_base/lang","./CreateBookmarkWidget"],function(_1,_2,_3,_4,_5,_6,_7){return _1([],{cookieExpiration:365,cookieMode:false,constructor:function(){this.initListeners();if(!(_3("ie")<8)){this.storageProvider=dojox.storage.manager.getProvider();this.cookieMode=false;}else{this.storageProvider=null;this.cookieMode=true;}this.bookmarks=this.initializeBookmarks();if(this.bookmarks==null||!_6.isObject(this.bookmarks)){this.bookmarks={};}},initListeners:function(){_2.subscribe(VIEWER_GLOBALS.EVENTS.BOOKMARK.CREATED,_6.hitch(this,this.handleSaveBookmark));_2.subscribe(VIEWER_GLOBALS.EVENTS.BOOKMARK.STORAGE.GET,_6.hitch(this,this.handleGetBookmarks));_2.subscribe(VIEWER_GLOBALS.EVENTS.BOOKMARK.CREATE_WINDOW.SHOW,_6.hitch(this,this.showCreateBookmarkDisplay));_2.subscribe(VIEWER_GLOBALS.EVENTS.BOOKMARK.REMOVED,_6.hitch(this,this.removeBookmark));_2.subscribe(VIEWER_GLOBALS.EVENTS.BOOKMARK.DELETE_STORED,_6.hitch(this,this._deleteStoredBookmarks));},removeBookmark:function(_8){if(this.bookmarks!=null&&_6.isObject(this.bookmarks)&&this.bookmarks[_8]!=null){delete this.bookmarks[_8];this._persistBookmarks();}},handleSaveBookmark:function(_9){if(_9==null||!_6.isObject(_9)){return;}var _a=false;for(var _b in _9){this.bookmarks[_b]=_9[_b];_a=true;}if(_a){this._persistBookmarks();}},_persistBookmarks:function(){if(!this.cookieMode){this._persistToLocalStorage();}else{this._persistToCookies();}},_persistToLocalStorage:function(){this.storageProvider.put(VIEWER_GLOBALS.STORAGE.LABELS.BOOKMARKS,this.bookmarks);},_persistToCookies:function(){_4(VIEWER_GLOBALS.STORAGE.LABELS.BOOKMARKS,_5.toJson(this.bookmarks),{expires:this.cookieExpiration});},_deleteStoredBookmarks:function(){if(!this.cookieMode){this.storageProvider.remove(VIEWER_GLOBALS.STORAGE.LABELS.BOOKMARKS);}else{_4(VIEWER_GLOBALS.STORAGE.LABELS.BOOKMARKS,{},{expire:-1});}},handleGetBookmarks:function(_c){if(_c==null||!_6.isFunction(_c)){return;}_c(this.bookmarks);},initializeBookmarks:function(){if(!this.cookieMode){return this._initializeLocalStorageBookmarks();}else{return this._initializeCookieBookmarks();}},_initializeCookieBookmarks:function(){var _d=_4(VIEWER_GLOBALS.STORAGE.LABELS.BOOKMARKS);if(_d!=null&&_d!=""){return _5.fromJson(_d);}return {};},_initializeLocalStorageBookmarks:function(){if(this.storageProvider.hasKey(VIEWER_GLOBALS.STORAGE.LABELS.BOOKMARKS)){return this.storageProvider.get(VIEWER_GLOBALS.STORAGE.LABELS.BOOKMARKS);}return {};},showCreateBookmarkDisplay:function(){if(this.createBookmarkWidget==null){this.createBookmarkWidget=new _7();_2.publish(VIEWER_GLOBALS.EVENTS.PLACEMENT.GLOBAL.PLACE.CREATE_BOOOKMARK,this.createBookmarkWidget);}this.createBookmarkWidget.show();}});});