;(function(win, doc, undefined){

	var prototype = 'prototype',
        arrProto = Array[prototype],
		toString = Object[prototype].toString,
		hasOwnProperty = Object[prototype].hasOwnProperty,

		TRUE = !0,
		FALSE = !TRUE,

		array = 'Array',
		string = 'String',
		object = 'Object',
		fun = 'Function',

        baseUrl = '//js.ku6cdn.com/',
		metas = {moo: {url: baseUrl + 'comm/lib/moo142.js'}},
		jsReg = /\.js(?:[?#]\w*)*$/,
        httpReg = /^(?:https?:\/)?(?:\.\.?)?\//,
		mods = {},
		stocks = win.mo && win.mo.mo,

		is = function (type, obj){
			return typeOf(obj) === type;
		},

		typeOf = function (obj) {
			return toString.call(obj).replace(/\[\w+\s+(\w+)\]/, '$1');
		},

		forIn = function (o, fn) {
			for(var k in o){
				if (hasOwnProperty.call(o, k) && fn.call(undefined, k, o[k], o) === TRUE) break;
			}
		},

		each = arrProto.forEach ? 
				function (array, fn){arrProto.forEach.call(array, fn);} : 
				function (array, fn){for(var i = 0, l = array.length; i < l; i ++) fn.call(undefined, array[i], i, array)},

        invoke = function (fns, bind, args) {
            return function () {
                args = args || [];
                args.push.apply(args, arguments);
                each(fns, function (fn) {
                    fn.apply(bind, args);
                });
            }
        },

        pass = function (fn, bind, args) {
            var arg;
            while(arg = args.shift()) fn.apply(bind, arg);
        },

		links = function (args, obj){
			var ret = {};
			each(args, function (item) {
				forIn(obj, function (k, type){
					if (is(type, item)){
						(ret[k] = ret[k] || []).push(item);
					}
				});
			});
			return ret;
		},

		keys = Object.keys || function (o) {
	      var ret = [];

	      forIn(o, function (k){ret.push(k);});

	      return ret;
		},


        //dustindiaz.com/smallest-domready-ever
		domready = (function(){
			var queue = [],
				loaded,
                fire = function(){loaded = true;invoke(queue)();};

                (function ready() {
                    /in/.test(doc.readyState) ? setTimeout(ready, 0) : fire();
                })();

			return function (fn){
				if (loaded) fn();
				else queue.push(fn);
			};
		})(),

		cfg = function (key, meta) {
			return meta ? metas[key] = meta : (metas[key] = metas[key] || jsReg.test(key) && {url: key});
		},

		load = (function(){
			var loaded = {},
				loading = {},
				callbacks = {},

				getElementsByTagName = 'getElementsByTagName',
				base = doc[getElementsByTagName]('base')[0],
				head = doc.head || doc[getElementsByTagName]('head')[0],
                stateReg = /[dtn]e/,

				onload = 'onload',
				onerror = 'onerror',
				onreadystatechange = 'onreadystatechange',

				done = function (url){
					var fns = callbacks[url];
					loaded[url] = TRUE;
					loading[url] = FALSE;
					if (fns) {
                        invoke(fns)(url);
						delete callbacks[url];
					}
				};

			return function (meta, callback){
				var url = meta.url,
					charset = meta.charset,
					js = meta.type !== 'css',
					node = doc.createElement(js ? 'script' : 'link'),
                    img;

                url = httpReg.test(url) ? url : baseUrl + url;

				if (loaded[url]) {
					return callback(url);
				}

				if(callback){
					if (loading[url]) {
						return (callbacks[url] = callbacks[url] || []).push(callback);
					} else callbacks[url] = [callback];
				}

				loading[url] = node;

				charset && (node.charset = charset);
				if (js){
					node.async = TRUE;
					node.type = 'text/javascript';
					node.src = url;

                    node[onload] = node[onerror] = node[onreadystatechange] = function (){
                        if (stateReg.test(node.readyState)){
                            done(url);
                            node[onload] = node[onerror] = node[onreadystatechange] = null;
                            js && head.removeChild(node);
                        }
                    }
				} else {
					node.rel = 'stylesheet';
					node.href = url;
                    img = new Image();
                    img[onerror] = function () {
                        done(url);
                        img = img[onerror] = null;
                    };
                    img.src = url;
				}

				base ? head.insertBefore(node, base) : head.appendChild(node);
			}
		})(),

		deps = function (reqs, fn){
            reqs = is(array, reqs) ? reqs : [reqs];
			var key = reqs.join('-'),
				count = reqs.length,
				i = 0, req, meta, list,

				check = function (){
					if (!--count){
                        reqs.push.apply(reqs, arguments);
						mods[key] = TRUE;
						fn && fn.apply(undefined, reqs);
					}
				};

			if (mods[key]){
				return fn && fn.apply(undefined, reqs);
			}

			for(; req = reqs[i++]; ) {
				meta = cfg(req);
                list = meta.deps;
				if (list){
					deps(list, (function (meta){
						return function (){load(meta, check);};
					})(meta));
				} else {
					load(meta, check);
				}
			}
 
		};

	function mo(){
		var params = links(arguments, {fns: fun, arrays: array, metas: object, ids: string}),
            ids = params.ids,
            arrays = params.arrays,
            metas = params.metas,
            fns = params.fns,
            fn = fns ? invoke(fns) : undefined;

        if(ids && !jsReg.test(ids[0])) baseUrl = ids.shift();

        if (arrays) {
            pass(mo, mo, arrays);
        }

        if (metas) {
            fn && (ids = ids || []);
            each(metas, function (meta) {
                forIn(meta, cfg);
                fn && (ids = ids.concat(keys(meta)));
            });
        }

        if(ids){
            if(fn){
                deps(ids, fn);
            } else {
                deps(ids);
            }
        } else {
            fn && domready(fn);
        }

		return mo;
	}

	if(stocks) {
        pass(mo, mo, stocks);
		stocks = undefined;
		delete win.mo.mo;
	}

	win.mo = mo;

})(this, document);