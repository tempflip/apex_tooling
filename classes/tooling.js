var tooling;
(function (tooling) {
    var q = require('q');
    var request = require('request');
    var Tooling = (function () {
        function Tooling(accessToken, instanceUrl) {
            this.accessToken = accessToken;
            this.instanceUrl = instanceUrl;
        }
        Tooling.prototype.apexManifest = function () {
            var url = this.instanceUrl + '/services/data/v36.0/tooling/apexManifest';
            var httpOptions = {
                url: url,
                method: 'GET'
            };
            return this.integration(httpOptions);
        };
        Tooling.prototype.sobject = function (object, id) {
            var url = this.instanceUrl + '/services/data/v36.0/tooling/sobjects/'
                + object;
            if (id != undefined) {
                url += '/' + id;
            }
            var httpOptions = {
                url: url,
                method: 'GET'
            };
            return this.integration(httpOptions);
        };
        Tooling.prototype.query = function (object) {
            var query = 'SELECT Id, Name FROM ' + object;
            var url = this.instanceUrl + '/services/data/v36.0/query/?q=' + query;
            var httpOptions = {
                url: url,
                method: 'GET'
            };
            return this.integration(httpOptions);
        };
        Tooling.prototype.integration = function (httpOptions) {
            console.log(httpOptions);
            httpOptions.json = true;
            httpOptions.headers = {
                'Authorization': 'Bearer ' + this.accessToken
            };
            var deferred = q.defer();
            var httpCallback = function (err, d) {
                if (err) {
                    deferred.reject();
                    return;
                }
                deferred.resolve(d.body);
            };
            request(httpOptions, httpCallback);
            return deferred.promise;
        };
        return Tooling;
    }());
    tooling.Tooling = Tooling;
    var OrgElements = (function () {
        function OrgElements(accessToken, instanceUrl) {
            this.accessToken = accessToken;
            this.instanceUrl = instanceUrl;
            this.tooling = new Tooling(this.accessToken, this.instanceUrl);
            this.ApexClassList = [];
            this.ApexTriggerList = [];
        }
        OrgElements.prototype.build = function () {
            var _this = this;
            var deferred = q.defer();
            var processItemList = function (d) {
                var promiseList = [];
                //d.forEach(processItem);
                for (var _i = 0, d_1 = d; _i < d_1.length; _i++) {
                    var apexItem = d_1[_i];
                    var prom = processItem(apexItem);
                    if (prom != undefined) {
                        promiseList.push(prom);
                    }
                }
                // resolving when all the item data is retrieved
                console.log(promiseList);
                q.all(promiseList)
                    .done(function (d) {
                    console.log('viiiiiiiii');
                });
            };
            var processItem = function (apexItem) {
                if (apexItem.namespace != null)
                    return;
                var deferred = q.defer();
                var objectType;
                var processObjectFunction;
                if (apexItem.type == 'TRIGGER') {
                    objectType = 'ApexTrigger';
                    processObjectFunction = function (d) {
                        _this.ApexTriggerList.push(d);
                        console.log('resolved', d);
                        deferred.resolve();
                    };
                }
                else if (apexItem.type == 'CLASS') {
                    objectType = 'ApexClass';
                    processObjectFunction = function (d) {
                        _this.ApexClassList.push(d);
                        console.log('resolved', d);
                        deferred.resolve();
                    };
                }
                t = new Tooling(_this.accessToken, _this.instanceUrl);
                t.sobject(objectType, apexItem.id).done(processObjectFunction);
                return deferred.promise;
            };
            this.tooling.apexManifest()
                .done(processItemList);
            return deferred.promise;
        };
        return OrgElements;
    }());
    tooling.OrgElements = OrgElements;
})(tooling || (tooling = {}));
module.exports = tooling;
