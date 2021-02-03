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
var flightStatus_1 = require("./flightStatus");
var fs = require("fs");
var path_1 = require("path");
var lineByLine = require('n-readlines');
var FSUIPCInterface = /** @class */ (function () {
    function FSUIPCInterface(win) {
        this.win = win;
        this.flightStatus = new rxjs_1.BehaviorSubject(flightStatus_1.flightStatus.preDepature);
        this._lastVsReadings = [];
        this.loggingFilePath = path_1.join(__dirname, 'flight.acars');
        this.didCrash = false;
        this.connectionObs = new rxjs_1.BehaviorSubject(false);
    }
    FSUIPCInterface.prototype.init = function () {
        var _this = this;
        this._api = new msfs_api_1.FsuipcApi();
        console.log('Trying to connect....');
        this.connectToSim();
        this.flightStatus.subscribe(function (status) {
            _this.win.webContents.send('flightStatus', status);
        });
        console.log('Loggin Path', this.loggingFilePath);
    };
    FSUIPCInterface.prototype.connectToSim = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this._connectTimer = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                    var isCrashed, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, , 4]);
                                return [4 /*yield*/, this._api.init()];
                            case 1:
                                _a.sent();
                                this.connectionObs.next(true);
                                this.flightTrackingObs = this._api.listen(3000, fsuipcStrings, true);
                                console.log('Flight Tracking Obs set');
                                return [4 /*yield*/, this.checkForCrash()];
                            case 2:
                                isCrashed = _a.sent();
                                console.log("🚀 ~ file: fsuipc.ts ~ line 62 ~ FSUIPCInterface ~ this._connectTimer=setInterval ~ isCrashed", isCrashed);
                                if (isCrashed) {
                                    // Do stuff to handle crash
                                    this.handleCrash();
                                }
                                console.log('Connected to sim');
                                clearInterval(this._connectTimer);
                                return [3 /*break*/, 4];
                            case 3:
                                error_1 = _a.sent();
                                console.log('Connection error', error_1);
                                if (error_1.code === 2 && this.connectionObs.getValue() === true) {
                                    this.connectionObs.next(false);
                                    console.log('Not connected');
                                }
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); }, 2000);
                return [2 /*return*/];
            });
        });
    };
    FSUIPCInterface.prototype._subscribeToTrackingObs = function () {
        var _this = this;
        console.log('Subsribing to tracking');
        this.flightTrackingObs.subscribe(function (data) { return __awaiter(_this, void 0, void 0, function () {
            var currentStatus, _a, fileExists, error_2, sum, _i, _b, vs, average, sum2, _c, _d, vs, average2, sum4, _e, _f, vs, average4, sum3, _g, _h, vs, average3;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        if (!data) {
                            return [2 /*return*/];
                        }
                        currentStatus = this.flightStatus.getValue();
                        // Enable to log positions as well
                        // if (currentStatus !== flightStatus.preDepature && currentStatus !== flightStatus.parked) {
                        //   this.fileHandle.write(this._positionToString(data) + '\n');
                        // }
                        if (this.didCrash && !this.fileHandle) {
                            this.fileHandle = fs.createWriteStream(this.loggingFilePath, {
                                flags: 'a'
                            });
                        }
                        _a = currentStatus;
                        switch (_a) {
                            case flightStatus_1.flightStatus.preDepature: return [3 /*break*/, 1];
                            case flightStatus_1.flightStatus.taxiOut: return [3 /*break*/, 8];
                            case flightStatus_1.flightStatus.depature: return [3 /*break*/, 9];
                            case flightStatus_1.flightStatus.climb: return [3 /*break*/, 10];
                            case flightStatus_1.flightStatus.levelFlight: return [3 /*break*/, 11];
                            case flightStatus_1.flightStatus.descent: return [3 /*break*/, 12];
                            case flightStatus_1.flightStatus.approach: return [3 /*break*/, 13];
                            case flightStatus_1.flightStatus.landing: return [3 /*break*/, 14];
                            case flightStatus_1.flightStatus.taxiToParking: return [3 /*break*/, 15];
                            case flightStatus_1.flightStatus.goAround: return [3 /*break*/, 16];
                        }
                        return [3 /*break*/, 17];
                    case 1:
                        if (!data.engine1Firing) return [3 /*break*/, 7];
                        this.flightStatus.next(flightStatus_1.flightStatus.taxiOut);
                        console.log('Flight now in taxiOut');
                        this._startDate = new Date();
                        _j.label = 2;
                    case 2:
                        _j.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, fs.promises.access(this.loggingFilePath, fs.constants.F_OK)];
                    case 3:
                        fileExists = _j.sent();
                        return [4 /*yield*/, fs.promises.unlink(this.loggingFilePath)];
                    case 4:
                        _j.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _j.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        // File is deleted, create a new one
                        if (!this.didCrash) {
                            this.fileHandle = fs.createWriteStream(this.loggingFilePath);
                        }
                        this.fileHandle.write(this.type + '\n');
                        this.fileHandle.write(this.flightNumber + '\n');
                        this.fileHandle.write(this._startDate.valueOf() + '\n');
                        this.fileHandle.write(this.origin + '\n');
                        this.fileHandle.write(this.destination + '\n');
                        this.fileHandle.write(this._statusToString(flightStatus_1.flightStatus.taxiOut) + '\n');
                        _j.label = 7;
                    case 7: return [3 /*break*/, 17];
                    case 8:
                        if (data.gs > 80) {
                            this.flightStatus.next(flightStatus_1.flightStatus.depature);
                            this.fileHandle.write(this._statusToString(flightStatus_1.flightStatus.depature) + '\n');
                            console.log('Flight now in depature');
                        }
                        return [3 /*break*/, 17];
                    case 9:
                        if (data.radioAlt > 2000) {
                            this.flightStatus.next(flightStatus_1.flightStatus.climb);
                            this.fileHandle.write(this._statusToString(flightStatus_1.flightStatus.climb) + '\n');
                            console.log('Flight now in climb');
                        }
                        return [3 /*break*/, 17];
                    case 10:
                        this._lastVsReadings.push(data.vs);
                        if (this._lastVsReadings.length > 20) {
                            this._lastVsReadings.shift();
                        }
                        sum = 0;
                        for (_i = 0, _b = this._lastVsReadings; _i < _b.length; _i++) {
                            vs = _b[_i];
                            sum += vs;
                        }
                        average = sum / this._lastVsReadings.length;
                        if (average < 600 && average > -600) {
                            this.flightStatus.next(flightStatus_1.flightStatus.levelFlight);
                            this.fileHandle.write(this._statusToString(flightStatus_1.flightStatus.levelFlight) + '\n');
                            console.log('Flight now in level Flight');
                        }
                        return [3 /*break*/, 17];
                    case 11:
                        this._lastVsReadings.push(data.vs);
                        if (this._lastVsReadings.length > 20) {
                            this._lastVsReadings.shift();
                        }
                        sum2 = 0;
                        for (_c = 0, _d = this._lastVsReadings; _c < _d.length; _c++) {
                            vs = _d[_c];
                            sum2 += vs;
                        }
                        average2 = sum2 / this._lastVsReadings.length;
                        if (average2 < -500) {
                            this.flightStatus.next(flightStatus_1.flightStatus.descent);
                            this.fileHandle.write(this._statusToString(flightStatus_1.flightStatus.descent) + '\n');
                            console.log('Flight now in descent');
                        }
                        if (average2 > 500) {
                            this.flightStatus.next(flightStatus_1.flightStatus.climb);
                            this.fileHandle.write(this._statusToString(flightStatus_1.flightStatus.climb) + '\n');
                            console.log('Flight now in descent');
                        }
                        return [3 /*break*/, 17];
                    case 12:
                        this._lastVsReadings.push(data.vs);
                        if (this._lastVsReadings.length > 20) {
                            this._lastVsReadings.shift();
                        }
                        sum4 = 0;
                        for (_e = 0, _f = this._lastVsReadings; _e < _f.length; _e++) {
                            vs = _f[_e];
                            sum4 += vs;
                        }
                        average4 = sum4 / this._lastVsReadings.length;
                        if (average4 > -200 && average4 < 200) {
                            this.flightStatus.next(flightStatus_1.flightStatus.levelFlight);
                            this.fileHandle.write(this._statusToString(flightStatus_1.flightStatus.levelFlight) + '\n');
                            console.log('Flight now in levelFlight');
                        }
                        if (data.altitude < 10000) {
                            this.flightStatus.next(flightStatus_1.flightStatus.approach);
                            this.fileHandle.write(this._statusToString(flightStatus_1.flightStatus.approach) + '\n');
                            console.log('Flight now in Approach');
                        }
                        return [3 /*break*/, 17];
                    case 13:
                        if (data.radioAlt < 2500) {
                            this.flightStatus.next(flightStatus_1.flightStatus.landing);
                            this.fileHandle.write(this._statusToString(flightStatus_1.flightStatus.landing) + '\n');
                        }
                        return [3 /*break*/, 17];
                    case 14:
                        if (data.planeOnground) {
                            this.flightStatus.next(flightStatus_1.flightStatus.taxiToParking);
                            this.fileHandle.write(this._statusToString(flightStatus_1.flightStatus.taxiToParking) + '\n');
                            console.log('Taxi to parking');
                            console.log('Touchdown VS', data.vsAtTouchdown);
                        }
                        if (data.vs > 1200) {
                            this.flightStatus.next(flightStatus_1.flightStatus.goAround);
                            this.fileHandle.write(this._statusToString(flightStatus_1.flightStatus.goAround) + '\n');
                            console.log('Flight now in Go Around');
                        }
                        return [3 /*break*/, 17];
                    case 15:
                        if (!data.engine1Firing) {
                            this.flightStatus.next(flightStatus_1.flightStatus.parked);
                            this.fileHandle.write(this._statusToString(flightStatus_1.flightStatus.parked) + '\n');
                            console.log('Flight now parked');
                            this.onEndFlight(data);
                        }
                        return [3 /*break*/, 17];
                    case 16:
                        this._lastVsReadings.push(data.vs);
                        if (this._lastVsReadings.length > 20) {
                            this._lastVsReadings.shift();
                        }
                        sum3 = 0;
                        for (_g = 0, _h = this._lastVsReadings; _g < _h.length; _g++) {
                            vs = _h[_g];
                            sum3 += vs;
                        }
                        average3 = sum3 / this._lastVsReadings.length;
                        if (average3 < -800 && data.radioAlt < 2500) {
                            this.flightStatus.next(flightStatus_1.flightStatus.landing);
                            this.fileHandle.write(this._statusToString(flightStatus_1.flightStatus.landing) + '\n');
                            console.log('Flight now in landing');
                        }
                        return [3 /*break*/, 17];
                    case 17: return [2 /*return*/];
                }
            });
        }); }, function (error) {
            // Error code 12 on disconnect
            if (error.code === 12) {
                // Disconected 
                _this.connectionObs.next(false);
                _this.connectToSim();
            }
        });
    };
    FSUIPCInterface.prototype.canStartFreeFlight = function (type, flightNo, origin, destination) {
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
                            this.type = type;
                            this.flightNumber = flightNo;
                            this.origin = origin;
                            this.destination = destination;
                            this._subscribeToTrackingObs();
                            this.flightTrackingObs.pipe(operators_1.first()).subscribe(function (currentInfo) {
                                console.log('Current info', currentInfo);
                                if (currentInfo.gs > config.allowedSpeed) {
                                    reject('Too fast');
                                    return;
                                }
                                // if (currentInfo.engine1Firing) {
                                //   console.error('Engine(s) running');
                                //   reject(false);
                                //   return;
                                // }
                                resolve(currentInfo);
                            });
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    FSUIPCInterface.prototype.canStartFlight = function (type, flightNo, origin, destination) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            this.flightTrackingObs.pipe(operators_1.first()).subscribe(function (currentInfo) { return __awaiter(_this, void 0, void 0, function () {
                                var error_3, depatureAirport, distance;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, this.canStartFreeFlight(type, flightNo, origin, destination)];
                                        case 1:
                                            _a.sent();
                                            return [3 /*break*/, 3];
                                        case 2:
                                            error_3 = _a.sent();
                                            console.error(error_3);
                                            reject(error_3);
                                            return [2 /*return*/];
                                        case 3: return [4 /*yield*/, axios.default.get(config.apiUrl + "/airports/" + origin.toLowerCase())];
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
    FSUIPCInterface.prototype._positionToString = function (data) {
        var positionString = data.latitude + ";" + data.longitude + ";" + data.altitude;
        return positionString;
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Ending flight');
                        this._endDate = new Date();
                        this.win.webContents.send('endFlight', data, this._startDate, this._endDate);
                        console.log('Ending flight with', data, this._startDate, this._endDate);
                        // Delete localLoggin file
                        this.fileHandle.close();
                        return [4 /*yield*/, fs.promises.unlink(this.loggingFilePath)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FSUIPCInterface.prototype._statusToString = function (flightStatus) {
        return "flightStatus;" + flightStatus;
    };
    FSUIPCInterface.prototype._parseLine = function (line) {
        // Check if its a flightStatus or not
        if (line.includes('flightStatus')) {
            // Is Flight status. Split at ;
            var value = line.split(';')[1];
            return {
                type: parseResultType.flightStatus,
                value: flightStatus_1.flightStatus[value]
            };
        }
        else {
            // Is position split at ; multiple times
            var splits = line.split(';');
            var lat = +splits[0];
            var long = +splits[1];
            var altitude = +splits[2];
            return {
                type: parseResultType.postition,
                value: {
                    altitude: altitude,
                    lat: lat,
                    long: long
                }
            };
        }
    };
    FSUIPCInterface.prototype.checkForCrash = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isCrashed, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isCrashed = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs.promises.access(this.loggingFilePath, fs.constants.F_OK)];
                    case 2:
                        _a.sent();
                        isCrashed = true;
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        isCrashed = false;
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, isCrashed];
                }
            });
        });
    };
    // ACARS did crash. Send crash event to the client and resume the tracking
    FSUIPCInterface.prototype.handleCrash = function () {
        return __awaiter(this, void 0, void 0, function () {
            var liner, line, result, value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Handling crash');
                        liner = new lineByLine(this.loggingFilePath);
                        this.type = liner.next().toString();
                        this.flightNumber = liner.next().toString();
                        this._startDate = new Date(liner.next().toString());
                        this.origin = liner.next().toString();
                        this.destination = liner.next().toString();
                        _a.label = 1;
                    case 1:
                        if (!(line = liner.next())) return [3 /*break*/, 3];
                        line = line.toString();
                        return [4 /*yield*/, this._parseLine(line)];
                    case 2:
                        result = _a.sent();
                        console.log(result);
                        if (result.type === parseResultType.flightStatus) {
                            value = result.value;
                            console.log("value", value);
                            console.log('status', flightStatus_1.flightStatus[value]);
                            this.flightStatus.next(flightStatus_1.flightStatus[value]);
                        }
                        return [3 /*break*/, 1];
                    case 3:
                        console.log('Crash handled, status now', this.flightStatus.getValue());
                        this.didCrash = true;
                        this.recoveryInterval = setInterval(this._checkRecovery.bind(this), 500);
                        return [2 /*return*/];
                }
            });
        });
    };
    FSUIPCInterface.prototype._checkRecovery = function () {
        return __awaiter(this, void 0, void 0, function () {
            var connected;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connectionObs.getValue()];
                    case 1:
                        connected = _a.sent();
                        if (connected) {
                            this._subscribeToTrackingObs();
                            clearInterval(this.recoveryInterval);
                            console.log('Flight recovered');
                            this.win.webContents.send('recovery');
                        }
                        return [2 /*return*/];
                }
            });
        });
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
var parseResultType;
(function (parseResultType) {
    parseResultType[parseResultType["flightStatus"] = 0] = "flightStatus";
    parseResultType[parseResultType["postition"] = 1] = "postition";
})(parseResultType || (parseResultType = {}));
//# sourceMappingURL=fsuipc.js.map