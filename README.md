mo 
=====
Yet another mini JavaScript loader and dependency manager, **mo***re* but no-*re*peat.
Browser Support
---------------
not test yet.

Examples
--------


``` html
<script src="mo.js"></script>
```

middle school - loads as non-blocking, but has multiple dependents

``` js
mo('boot.js', function () {
	//TODO
});
```
or

``` js
<script>
;(function(l,o,a,d,i,n,g){if(l[a])return;g=function(){l[a][a].push(arguments);return l[a]};g[a]=[];l[a]=g;g=o.createElement('script');g.src=n;n=o[i]||o[d](i)[0];i=o[d]('base')[0];i?n.insertBefore(g,i):n.appendChild(g);})(this,document,'mo','getElementsByTagName','head','mo.js');
mo('boot.js', function () {
	//TODO
});
```

loads as non-blocking, and ALL js files load asynchronously

``` js
mo('pv/pvsurvey201101302039.js', '//ipic.staticsdo.com/external/sdo_beacon.js?143620473756', function () {
    _ximg = ['www.gif'];
    ku_track();
    _st();
});


``` js
//when domready
mo(function() {
	// use your plugin :)
});
```

Exhaustive list of ways to use mo.js
-----------------------------------------

``` js
mo('foo.js', function() {
	// foo.js is ready
});


mo('foo.js', 'bar.js', function() {
	// foo.js & bar.js is ready
})


mo({foo: 'foo.js', bar: 'bar.js'});
mo('foo', function() {
	// foo.js is ready
})('bar', function() {
	// bar.js is ready
});

mo({foo: 'foo.js', bar: {url:'bar.js', deps: 'foo'});
mo('bar', function() {
	// foo.js is ready
	// bar.js is ready
});

//set baseUrl for all relative path
mo('//js.cdn.com/');
mo('lib/moo.js', function () {
	//js.cdn.com/lib/moo.js is ready
});

```