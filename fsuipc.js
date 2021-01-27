"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FSUIPCInterface = void 0;
var api_1 = require("@fsuipc/api");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var config = require("./config.json");
var airports = require("./airports.json");
var FSUIPCInterface = /** @class */ (function () {
    function FSUIPCInterface() {
        this.connectionObs = new rxjs_1.BehaviorSubject(false);
        this._api = new api_1.FsuipcApi();
        this.connectToSim();
    }
    FSUIPCInterface.prototype.connectToSim = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this._connectTimer = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                    var error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, this._api.init()];
                            case 1:
                                _a.sent();
                                this.connectionObs.next(true);
                                this.flightTrackingObs = this._api.listen(3000, fsuipcStrings, true);
                                this._subscribeToTrackingObs();
                                console.log('Connected to sim');
                                clearInterval(this._connectTimer);
                                return [3 /*break*/, 3];
                            case 2:
                                error_1 = _a.sent();
                                if (error_1.code === 2 && this.connectionObs.getValue() === true) {
                                    this.connectionObs.next(false);
                                    console.log('Not connected');
                                }
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); }, 2000);
                return [2 /*return*/];
            });
        });
    };
    FSUIPCInterface.prototype._subscribeToTrackingObs = function () {
        var _this = this;
        this.flightTrackingObs.subscribe(function () { }, function (error) {
            // Error code 12 on disconnect
            console.error(error);
            if (error.code === 12) {
                // Disconected 
                _this.connectionObs.next(false);
                _this.connectToSim();
            }
        });
    };
    FSUIPCInterface.prototype.canStartFreeFlight = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (!this.connectionObs.getValue()) {
                                reject('No connection to Sim');
                                return [2 /*return*/];
                            }
                            this.flightTrackingObs.pipe(operators_1.first()).subscribe(function (currentInfo) {
                                if (currentInfo.gs > config.allowedSpeed) {
                                    reject('Too fast');
                                    return;
                                }
                                if (currentInfo.engine1Firing || currentInfo.engine2Firing || currentInfo.engine3Firing || currentInfo.engine4Firing) {
                                    console.error('Engine(s) running');
                                    reject(false);
                                    return;
                                }
                                resolve(currentInfo);
                            });
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    FSUIPCInterface.prototype.canStartFlight = function (icao) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            this.flightTrackingObs.pipe(operators_1.first()).subscribe(function (currentInfo) { return __awaiter(_this, void 0, void 0, function () {
                                var error_2, airport, distance;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, this.canStartFreeFlight()];
                                        case 1:
                                            _a.sent();
                                            return [3 /*break*/, 3];
                                        case 2:
                                            error_2 = _a.sent();
                                            console.error(error_2);
                                            reject(error_2);
                                            return [2 /*return*/];
                                        case 3:
                                            airport = airports[icao];
                                            if (!airport) {
                                                console.error('Cannot find airport', icao);
                                                reject('Cannot find airport');
                                                return [2 /*return*/];
                                            }
                                            if (Math.abs(currentInfo.altitude - airport.elevation) > config.allowedHeight) {
                                                console.error('To High');
                                                reject('Too High');
                                                return [2 /*return*/];
                                            }
                                            distance = this._getDistanceFromLatLonInKm(airport.lat, airport.long, currentInfo.latitude, currentInfo.longitude);
                                            if (distance > config.allowedDistance) {
                                                reject('Too far');
                                                return [2 /*return*/];
                                            }
                                            resolve(currentInfo);
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    FSUIPCInterface.prototype._getDistanceFromLatLonInKm = function (lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this._deg2rad(lat2 - lat1); // this._deg2rad below
        var dLon = this._deg2rad(lon2 - lon1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this._deg2rad(lat1)) * Math.cos(this._deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    };
    FSUIPCInterface.prototype._deg2rad = function (deg) {
        return deg * (Math.PI / 180);
    };
    return FSUIPCInterface;
}());
exports.FSUIPCInterface = FSUIPCInterface;
var fsuipcStrings = [
    'gs',
    'latitude',
    'longitude',
    'altitude',
    'ias',
    'vs',
    'heading',
    'engine1Firing',
    'engine2Firing',
    'engine3Firing',
    'engine4Firing',
];
//# sourceMappingURL=fsuipc.js.map