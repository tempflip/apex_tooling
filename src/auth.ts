	let q = require('q');
	let request = require('request');


	let LOGIN_ENDPOINT = 'https://login.salesforce.com/services/oauth2/authorize';
	let LOGIN_ENDPOINT_SANDBOX = 'https://test.salesforce.com/services/oauth2/authorize';
    let SF_TOKEN_ENDPOINT = 'https://login.salesforce.com/services/oauth2/token';
    let SF_TOKEN_ENDPOINT_SANDBOX = 'https://test.salesforce.com/services/oauth2/token';
    let REDIRECT_URI = 'http://localhost:8000/oauth';
    let CLIENT_ID = '3MVG9OI03ecbG2Vpw3yS9_j_2ipSTm56YMo63FNoMC0ZIwtpjEnbcXH.QGtvvC_L6JVj7.T3NROmSBoxjEMz6';
    let CLIENT_SECRET = '7679003541658893578';

	export class Auth {
		private sandbox: boolean;
		public access_token: string;
		public instance_url: string;
		public message: string;

		constructor(sandbox: boolean) {
			this.sandbox = sandbox;
		}	

		public getRedirectUrl(): string {

			let url = this.sandbox ? LOGIN_ENDPOINT_SANDBOX : LOGIN_ENDPOINT ;
			url += '?response_type=code'
			url += '&client_id=' + CLIENT_ID;
			url += '&redirect_uri=' + REDIRECT_URI;
			url += '&display=touch';
			return url;
		}

		public init(code: string) : any {
			let deferred = q.defer();

			if (this.sandbox == true) {
				let url = SF_TOKEN_ENDPOINT_SANDBOX;
			} else {
				let url = SF_TOKEN_ENDPOINT;
			}

			let d = {
				grant_type: 'authorization_code',
				code : code
				client_id : CLIENT_ID,
				client_secret: CLIENT_SECRET,
				redirect_uri: REDIRECT_URI
			};

			let httpCallback = (err, d) => {
				if (err) {
					deferred.reject();
					return;
				}
				let tokenData = JSON.parse(d.body);
				if (tokenData.error) {
					this.message = tokenData.error + ' ' + tokenData.error_description;
					deferred.reject();
					return;
				}
				this.access_token = tokenData.access_token;
				this.instance_url = tokenData.instance_url;
				deferred.resolve();
			}
			request({ url: url, method: 'POST', qs: d }, httpCallback);
			return deferred.promise;
		}
	}

