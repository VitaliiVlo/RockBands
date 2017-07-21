PythonShell = require('python-shell');

var pythonoptions = {
	mode: 'text',
	scriptPath: 'public/python'
};

exports.findLyrics = function(cb) {
	PythonShell.run('parsemetro.py', pythonoptions, function(err, results) {
		cb(err, results);
	});
}

exports.findBands = function(cb) {
	PythonShell.run("parsewikiband.py", pythonoptions, function(err, results) {
		cb(err, results);
	});
}