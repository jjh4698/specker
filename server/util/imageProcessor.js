const jwt = require('jwt-simple');
const config = require('../config');
var mkdirp = require('mkdirp');
var async = require('async');


exports.imageSaver = function(file, path){
    var splitedPath = path.split('/');
    var folderPath = `${__dirname}/../assets/${splitedPath[1]}/${splitedPath[2]}`;
    var filePath = `${folderPath}/${splitedPath[3]}`;
    console.log(__dirname);
    console.log(folderPath);
    async.waterfall([
            function(callback){
                mkdirp(folderPath, function(err) {

                    if(err)
                        throw err;
                    callback(null, null);

                });

            },
            function(result, callback){
                require("fs").writeFile(filePath, file, 'base64', function(err) {
                    callback(null,null);
                });
            }
        ],
        function(err, result){
            console.log(err);
            if(err) {
                throw err;
            }
        });

};