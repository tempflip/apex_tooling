module authService {
	let q = require('q');
	let request = require('request'); 

    let SF_TOKEN_ENDPOINT = 'https://login.salesforce.com/services/oauth2/token';
    let SF_TOKEN_ENDPOINT_SANDBOX = 'https://test.salesforce.com/services/oauth2/token';

	export class auth {
		private username: string;
		private password: string;
		private sandbox: boolean;
		private client_id: string;
		private client_secret: string;
		public access_token: string;
		public instance_url: string;

		constructor(username : string, password : string, sandbox : boolean) {
			this.username = username;
			this.password = password;
			this.sandbox = sandbox;
			this.initCreds();
		}
	
		public initCreds() {
			this.client_id = '3MVG9zZht._ZaMunTMRpVihVylV_mVgPakH4vzKq7PsX6hZHze_NFb1KaJrfXLgdOqvc4xcnReDdsCe2UurEv';
			this.client_secret = '4739429935690856819';
		}


		public init() : any {
			let deferred = q.defer();

			if (this.sandbox == true) {
				let url = SF_TOKEN_ENDPOINT_SANDBOX;
			} else {
				let url = SF_TOKEN_ENDPOINT;
			}

			let d = {
				grant_type: 'password',
				client_id: this.client_id,
				client_secret: this.client_secret,
				username: this.username,
				password: this.password,
			};

			let httpCallback = (err, d) => {
				if (err) {
					deferred.reject();
					return;
				}
				let tokenData = JSON.parse(d.body);
				this.access_token = tokenData.access_token;
				this.instance_url = tokenData.instance_url;
				deferred.resolve();
			}

			request({ url: url, method: 'POST', qs: d }, httpCallback);
			return deferred.promise;
		}
	}

}


module.exports = authService;