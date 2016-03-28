var auth = require('./classes/auth.js');

/*var a = new auth.auth('peter@aag.prod.blackthorn', 'aagprod+1984', true)
var resolveToken = function() {
	console.log(a);
}
a.init().then(resolveToken);
*/

var access_token = '00Dq00000000RF1!ARcAQH_ZNpHGzL_ztoPaV5G3SHChvrHAj8_ALkuDSXRcCyp7gHyBsNLScsUapAqwrf.0gmQjAvgVhuPLnmt4gFqGyPJMTHfu';
var instance_url = 'https://aag--blackthorn.cs21.my.salesforce.com';


var tooling = require('./classes/tooling.js');
var t = new tooling.Tooling(access_token, instance_url);
//t.sobject('ApexTrigger', '01qq0000000D7QcAAK').then(function(d) {
//t.query('ApexTrigger').then(function(d) {
//t.apexManifest().then(function(t) {
//	console.log(d);
//})


var o = new tooling.OrgElements(access_token, instance_url);
o.build()
	.then(function() {
		console.log('im done');
	})
