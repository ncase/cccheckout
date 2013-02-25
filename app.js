
////////////////////////
// Express: Just static

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

/////////////////
// Zip an array of external URLs

var zipstream = require('zipstream');
var request = require('request');

app.get('/zip', function(req, res) {

	// GET list
	var files = req.query["files"];
	files = JSON.parse(files);

	// Zip Response
	res.contentType('zip');
	var zip = zipstream.createZip({ level: 1 });
	zip.pipe(res);

	// Use Config
	zip.addFile( "And here's where the attribution info would go later", { name:"README.txt", store:true }, function(){
		addFileToZip( files, 0, zip, req, res );
	});

});

var addFileToZip = function(files,index,zip,req,res){
	if(files.length==index){
		
		zip.finalize(function(written) {
        	console.log(written + ' total bytes written');
        });

	}else{
		
		var file = files[index];
		var onFileAdded = function(){
			addFileToZip( files, index+1, zip, req, res );
		};

		var path = "audio"+index+".mp3";
		zip.addFile( request(file), { name:path }, onFileAdded );

	}
};


/////////////////
// Hey, listen.

var port = process.env.PORT || 80;
app.listen(port);
console.log('Express server started on port '+port);

