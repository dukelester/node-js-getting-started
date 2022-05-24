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
        callback(err, data);
        
    });
};


//Update data 
lib.update = function(dir, file, data, callback){
    //open the file for writing
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', function(err, fileDescriptor){
        if(!err && fileDescriptor){
            //convert data to string
            var stringData = JSON.stringify(data);
            //truncate the file
            fs.ftruncate(fileDescriptor, function(err){
                if(!err){
                    //write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, function(err){
                        if(!err){
                            fs.close(fileDescriptor, function(err){
                                if(!err){
                                    callback(false);
                                } else {
                                    callback('Error closing existing file');
                                }
                            });
                        } else {
                            callback('Error writing to existing file');
                        }
                    });
                } else {
                    callback('Error truncating file');
                }
            });
        } else {
            callback('Could not open the file for updating, it may not exist yet');
        }
    });
};

//deleting a file from the file system
lib.delete = function(dir, file, callback){
    //unlink the file
    fs.unlink(lib.baseDir + dir + '/' + file + '.json', function(err){
        if(!err){
            callback(false);
        } else {
            callback('Error deleting the file');
        }
    });
};








//export the module
module.exports = lib;