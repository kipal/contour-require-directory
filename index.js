// TODO outsourcing for the clientscript. This is the first in the bootstrap!
Object.prototype.isEmpty = function () {
    for (var key in this) {
        if (this[key].hasOwnProperty()) {

            return false;
        }
    }

    return true;
};

String.prototype.repeat = function(nu) {
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

                console.log("<submodule>" + name + "</submodule>");

                if (callback && typeof(callback) === 'function') {
                    callback(null, retval[name]);
                }
            }
        }
    });

    retval.basePath = path;

    return retval;
};
