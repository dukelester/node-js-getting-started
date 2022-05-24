//library for storing and editing data

//dependancies
var fs = require('fs');
var path = require('path');

//container for the module (to be exported)

var lib = {};

//base directory for the data folder
lib.baseDir = path.join(__dirname, '/../.data/');
//write data to the file system
lib.create = function(dir, file, data, callback){
    //open the file for writing
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', function(err, fileDescriptor){
        if(!err && fileDescriptor){
            //convert data to string
            var stringData = JSON.stringify(data);
            //write to file and close it
            fs.writeFile(fileDescriptor, stringData, function(err){
                if(!err){
                    fs.close(fileDescriptor, function(err){
                        if(!err){
                            callback(false);
                        } else {
                            callback('Error closing new file');
                        }
                    });
                } else {
                    callback('Error writing to new file');
                }
            });
        }
        else{
            callback("Could not create the file, it may already exist");
        }
    });
};

//Read data from the file system
lib.read = function(dir, file, callback){
    fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', function(err, data){
        if(!err && data){
            var parsedData = helpers.parseJsonToObject(data);
            callback(false, parsedData);
        } else {
            callback(err, data);
        }
    });
};







//export the module
module.exports = lib;