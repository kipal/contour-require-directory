var fs = require('fs');
var join = require('path').join;
var resolve = require('path').resolve;
var dirname = require('path').dirname;

var requireDirectory = module.exports = function(m, path, exclude, callback, priority){
  var defaultDelegate = function(path, filename){
    return filename[0] !== '.' && /\.(js|json|coffee)$/i.test(filename);
  };
  var delegate = defaultDelegate;
  var retval = {};

  // if no path was passed in, assume the equivelant of __dirname from caller
  if(!path){
    path = dirname(m.filename);
  }
  
  for (var i in priority) {
    // e.g. path/filename.js
    priority[i]
    
  }

  // if a RegExp was passed in as exclude, create a delegate that blacklists that RegExp
  // if a function was passed in as exclude, use that function as the delegate
  // default to an always-yes delegate
  if(exclude instanceof RegExp){
    delegate = function(path, filename){
      if(!defaultDelegate(path, filename)){
        return false;
      }else if(exclude.test(path)){
        return false;
      }else{
        return true;
      }
    };
  }else if(exclude && {}.toString.call(exclude) === '[object Function]'){
    delegate = exclude;
  }

  // get the path of each file in specified directory, append to current tree node, recurse
  path = resolve(path);
  // TODO source out to special function
  fs.readdirSync(path).forEach(function(filename){
    var joined = join(path, filename);
    if(fs.statSync(joined).isDirectory()){
      var files = requireDirectory(m, joined, delegate, callback); // this node is a directory; recurse
      if (Object.keys(files).length){
        retval[filename] = files;
      }
    }else{
      if(joined !== m.filename && delegate(joined, filename)){
        var name = filename.substring(0, filename.lastIndexOf('.')); // hash node shouldn't include file extension
        retval[name] = m.require(joined);
        if (callback && typeof(callback) === 'function') {
          callback(null, retval[name]);
        }
      }
    }
  });
  return retval;
};
