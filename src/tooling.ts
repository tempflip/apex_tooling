module tooling {
	let q = require('q');
	let request = require('request');

	export class Tooling {
		public accessToken: string;
		public instanceUrl: string;

		constructor (accessToken: string, instanceUrl: string) {
			this.accessToken = accessToken;
			this.instanceUrl = instanceUrl;
		}

		public apexManifest() {
			let url = this.instanceUrl + '/services/data/v36.0/tooling/apexManifest'
			let httpOptions = {
				url: url;
				method: 'GET',
			}
			return this.integration(httpOptions);			
		}

		public sobject(object: string, id?: string) {
			let url = this.instanceUrl + '/services/data/v36.0/tooling/sobjects/'
				+ object
			
			if (id != undefined) {
				url += '/' + id;
			}

			let httpOptions = {
				url: url;
				method: 'GET',
			}

			return this.integration(httpOptions);
		}

		public query(object: string): any {
			let query = 'SELECT Id, Name FROM ' + object;
			let url = this.instanceUrl + '/services/data/v36.0/query/?q=' + query;
			let httpOptions = {
				url: url;
				method: 'GET',
			}
			return this.integration(httpOptions);
		}

		integration(httpOptions: any): any {
			console.log(httpOptions);
			httpOptions.json = true;
			httpOptions.headers = {
				'Authorization': 'Bearer ' + this.accessToken;
			};
			let deferred = q.defer();

			let httpCallback = (err, d) => {
				if (err) {
					deferred.reject();
					return;
				}
				deferred.resolve(d.body);
			}

			request(httpOptions, httpCallback);	
			return deferred.promise;
		}
	}

	export class OrgElements {
		public accessToken: string;
		public instanceUrl: string;
		public ApexClassList: any[];
		public ApexTriggerList: any[];
		tooling: Tooling;

		constructor(accessToken: string, instanceUrl: string) {
			this.accessToken = accessToken;
			this.instanceUrl = instanceUrl;
			this.tooling = new Tooling(this.accessToken, this.instanceUrl);
			this.ApexClassList = [];
			this.ApexTriggerList = [];
		}

		public build(): any {
			let deferred = q.defer();


			let processItemList = (d) => {
				let promiseList = [];

				//d.forEach(processItem);
				for (let apexItem of d) {
					let prom = processItem(apexItem);
					if (prom != undefined) {
						promiseList.push(prom);
					}
				}

				// resolving when all the item data is retrieved
				console.log(promiseList);
				
				q.all(promiseList)
				.done((d) => {
					console.log('viiiiiiiii');
				})
			}
			
			let processItem = (apexItem) => {
				if (apexItem.namespace != null) return;
				
				let deferred = q.defer();
				let objectType;
				let processObjectFunction;
				if (apexItem.type == 'TRIGGER') {
					objectType = 'ApexTrigger';
					processObjectFunction = (d) => {
						this.ApexTriggerList.push(d);
						console.log('resolved', d);
						deferred.resolve();
					}
				}
				else if (apexItem.type == 'CLASS') {
					objectType = 'ApexClass';
					processObjectFunction = (d) => {
						this.ApexClassList.push(d);
						console.log('resolved', d);
						deferred.resolve();
					}
				}

				t = new Tooling(this.accessToken, this.instanceUrl);
				t.sobject(objectType, apexItem.id).done(processObjectFunction);			
				return deferred.promise;
			}

			this.tooling.apexManifest()
				.done(processItemList);




			return deferred.promise;
		}


	}
}

module.exports = tooling;
