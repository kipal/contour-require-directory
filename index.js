/*******************************************************************************
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Nándor Kiss
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 ******************************************************************************/
// TODO outsourcing for the clientscript. This is the first in the bootstrap!
Object.prototype.isEmpty = function () {
    for (var key in this) {
        if (this[key].hasOwnProperty()) {

            return false;
        }
    }

    return true;
};

Object.prototype.deepExtend = function (o) {
    for (var i in o) {
        if (o.hasOwnProperty(i)) {
            if ('object' === typeof o[i]) {

                if ('[object Array]' === o[i].toString()) {
                    this[i] = [];
                } else {
                    this[i] = {};
                }

                this[i].deepExtend(o[i]);
            } else {
                this[i] = o[i];
            }
        }
    }
};

String.prototype.repeat = function(n) {
    return new Array(n + 1).join(this);
};

require("./Require.js");
require("./Module.js");



var fs               = require('fs'),
    pathModule       = require('path'),
    requireDirectory = module.exports = function(inModule, path, blackList, callback) {

    var defaultDelegate = function(path, filename){

        return filename[0] !== '.' && /\.(js|json|coffee)$/i.test(filename);
    };

    var delegate = defaultDelegate;
    var retval   = {};

    // if no path was passed in, assume the equivelant of __dirname from caller
    if(!path){
        path = pathModule.dirname(inModule.filename);
    }

    // if a RegExp was passed in as exclude, create a delegate that blacklists that RegExp
    // if a function was passed in as exclude, use that function as the delegate
    // default to an always-yes delegate
    if(blackList instanceof RegExp) {

        delegate = function(path, filename) {

            if(!defaultDelegate(path, filename)) {

                return false;
            } else if(blackList.test(path)) {

                return false;
            } else {

                return true;
            }
        };

    } else if(
            blackList
            && {}.toString.call(blackList) === '[object Function]'
    ) {
        delegate = blackList;
    }

    // get the path of each file in specified directory, append to current tree node, recurse
    path = pathModule.resolve(path);

    fs.readdirSync(path).forEach(function(filename){
        var joined = pathModule.join(path, filename);

        if(fs.statSync(joined).isDirectory()) {
            console.log("<" + filename + ">");
            var files = requireDirectory(inModule, joined, delegate, callback); // this node is a directory; recurse

            if (Object.keys(files).length) {
                retval[filename] = files;

                console.log("</" + filename + ">");
            }

        } else {

            if(joined !== inModule.filename && delegate(joined, filename)) {
                var name     = filename.substring(0, filename.lastIndexOf('.')); // hash node shouldn't include file extension

                retval[name] = inModule.require(joined).getReference();
                console.log("    <Module>" + name + "</Module>");

                if (callback && typeof(callback) === 'function') {
                    callback(null, retval[name]);
                }
            }
        }
    });

    retval.basePath = path;

    return retval;
};
