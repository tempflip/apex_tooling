var a = require('../classes/auth.js');
var SANDBOX = true;

function auth(req, res) {
	res.redirect(new a.Auth(SANDBOX).getRedirectUrl());
}

function oauth(req, res) { 
	console.log('hali' + JSON.stringify( req.query));
	var authInstance = new a.Auth(SANDBOX);

	authInstance.init(req.query.code)
	.then(function() {
		res.status(200).send(JSON.stringify( authInstance));
	})
	.fail(function() {
		res.status(403).send(JSON.stringify( authInstance));
	});
	
}

module.exports = function(app) {
	app.get('/auth', auth);
	app.get('/oauth', oauth);
};