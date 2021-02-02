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
var msfs_api_1 = require("@flusinerd/msfs-api");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var config = require("./config.json");
var axios = require("axios");
var electron_1 = require("electron");
var flightStatus_1 = require("./flightStatus");
var FSUIPCInterface = /** @class */ (function () {
    function FSUIPCInterface(win) {
        this.win = win;
        this.flightStatus = new rxjs_1.BehaviorSubject(flightStatus_1.flightStatus.preDepature);
        this._lastVsReadings = [];
        this.connectionObs = new rxjs_1.BehaviorSubject(false);
    }
    FSUIPCInterface.prototype.init = function () {
        this._api = new msfs_api_1.FsuipcApi();
        console.log('Trying to connect....');
        this.connectToSim();
        this.flightStatus.subscribe(function (status) {
            electron_1.ipcMain.emit('flightStatus', status);
        });
    };
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
                                console.log('trying to connect to sim...');
                                this.connectionObs.next(true);
                                console.log('PRe');
                                this.flightTrackingObs = this._api.listen(3000, fsuipcStrings, true);
                                console.log('Obs set');
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
        this.flightTrackingObs.subscribe(function (data) {
            if (!data) {
                return;
            }
            _this.onEndFlight(data);
            var currentStatus = _this.flightStatus.getValue();
            // Switch for changing flightStatus based on current status
            switch (currentStatus) {
                case flightStatus_1.flightStatus.preDepature:
                    if (data.engine1Firing) {
                        _this.flightStatus.next(flightStatus_1.flightStatus.taxiOut);
                        _this._startDate = new Date();
                        console.log('Flight now in taxiOut');
                    }
                    break;
                case flightStatus_1.flightStatus.taxiOut:
                    if (data.gs > 80) {
                        _this.flightStatus.next(flightStatus_1.flightStatus.depature);
                        console.log('Flight now in depature');
                    }
                    break;
                case flightStatus_1.flightStatus.depature:
                    if (data.radioAlt > 2000) {
                        _this.flightStatus.next(flightStatus_1.flightStatus.climb);
                        console.log('Flight now in climb');
                    }
                    break;
                case flightStatus_1.flightStatus.climb:
                    _this._lastVsReadings.push(data.vs);
                    if (_this._lastVsReadings.length > 20) {
                        _this._lastVsReadings.shift();
                    }
                    var sum = 0;
                    for (var _i = 0, _a = _this._lastVsReadings; _i < _a.length; _i++) {
                        var vs = _a[_i];
                        sum += vs;
                    }
                    var average = sum / _this._lastVsReadings.length;
                    if (average < 600 && average > -600) {
                        _this.flightStatus.next(flightStatus_1.flightStatus.levelFlight);
                        console.log('Flight now in level Flight');
                    }
                    break;
                case flightStatus_1.flightStatus.levelFlight:
                    _this._lastVsReadings.push(data.vs);
                    if (_this._lastVsReadings.length > 20) {
                        _this._lastVsReadings.shift();
                    }
                    var sum2 = 0;
                    for (var _b = 0, _c = _this._lastVsReadings; _b < _c.length; _b++) {
                        var vs = _c[_b];
                        sum2 += vs;
                    }
                    var average2 = sum2 / _this._lastVsReadings.length;
                    if (average2 < -1200) {
                        _this.flightStatus.next(flightStatus_1.flightStatus.descent);
                        console.log('Flight now in descent');
                    }
                    break;
                case flightStatus_1.flightStatus.descent:
                    if (data.altitude < 10000) {
                        _this.flightStatus.next(flightStatus_1.flightStatus.approach);
                        console.log('Flight now in Approach');
                    }
                    break;
                case flightStatus_1.flightStatus.approach:
                    if (data.radioAlt < 2500) {
                        _this.flightStatus.next(flightStatus_1.flightStatus.landing);
                    }
                    break;
                case flightStatus_1.flightStatus.landing:
                    if (data.planeOnground) {
                        _this.flightStatus.next(flightStatus_1.flightStatus.taxiToParking);
                        console.log('Taxi to parking');
                        console.log('Touchdown VS', data.vsAtTouchdown);
                    }
                    if (data.vs > 1200) {
                        _this.flightStatus.next(flightStatus_1.flightStatus.goAround);
                        console.log('Flight now in Go Around');
                    }
                    break;
                case flightStatus_1.flightStatus.taxiToParking:
                    if (!data.engine1Firing) {
                        _this.flightStatus.next(flightStatus_1.flightStatus.parked);
                        console.log('Flight now parked');
                        _this.onEndFlight(data);
                    }
                    break;
                case flightStatus_1.flightStatus.goAround:
                    _this._lastVsReadings.push(data.vs);
                    if (_this._lastVsReadings.length > 20) {
                        _this._lastVsReadings.shift();
                    }
                    var sum3 = 0;
                    for (var _d = 0, _e = _this._lastVsReadings; _d < _e.length; _d++) {
                        var vs = _e[_d];
                        sum3 += vs;
                    }
                    var average3 = sum3 / _this._lastVsReadings.length;
                    if (average3 < -800 && data.radioAlt < 2500) {
                        _this.flightStatus.next(flightStatus_1.flightStatus.landing);
                        console.log('Flight now in landing');
                    }
                    break;
            }
        }, function (error) {
            // Error code 12 on disconnect
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
                                console.log('No connection to sim');
                                reject('No connection to Sim');
                                return [2 /*return*/];
                            }
                            console.log("Obs", this.flightTrackingObs);
                            this.flightTrackingObs.pipe(operators_1.first()).subscribe(function (currentInfo) {
                                console.log('Current info', currentInfo);
                                if (currentInfo.gs > config.allowedSpeed) {
                                    reject('Too fast');
                                    return;
                                }
                                if (currentInfo.engine1Firing) {
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
                                var error_2, depatureAirport, distance;
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
                                        case 3: return [4 /*yield*/, axios.default.get(config.apiUrl + "/airports/" + icao.toLowerCase())];
                                        case 4:
                                            depatureAirport = (_a.sent()).data;
                                            if (!depatureAirport) {
                                                reject('Depature Airport not found');
                                                return [2 /*return*/];
                                            }
                                            distance = this._getDistanceFromLatLonInKm(depatureAirport.lat, depatureAirport.long, currentInfo.latitude, currentInfo.longitude);
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
    FSUIPCInterface.prototype.onEndFlight = function (data) {
        console.log('Ending flight');
        this._endDate = new Date();
        this.win.webContents.send('endFlight', data, this._startDate, this._endDate);
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
    'nearestAirportAltitude',
    'atcTypeCode',
    'vsAtTouchdown',
    'planeOnground',
    'radioAlt',
    'flapsControl',
    'landingLights'
];
//# sourceMappingURL=fsuipc.js.map