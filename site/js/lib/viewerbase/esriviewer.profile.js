//>>built
var profile=(function(){var _1=/^esriviewer\/tests\//,_2=function(_3,_4){var _5={"esriviewer/package.json":1,"esriviewer/esriviewer.profile.js":1};return (_4 in _5);};return {resourceTags:{test:function(_6,_7){return _1.test(_7)||_7=="app/tests";},copyOnly:function(_8,_9){return _2(_8,_9);},amd:function(_a,_b){return !_1.test(_b)&&!_2(_a,_b)&&/\.js$/.test(_a);}}};})();