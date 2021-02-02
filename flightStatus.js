"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flightStatus = void 0;
var flightStatus;
(function (flightStatus) {
    flightStatus[flightStatus["preDepature"] = 0] = "preDepature";
    flightStatus[flightStatus["taxiOut"] = 1] = "taxiOut";
    flightStatus[flightStatus["depature"] = 2] = "depature";
    flightStatus[flightStatus["climb"] = 3] = "climb";
    flightStatus[flightStatus["levelFlight"] = 4] = "levelFlight";
    flightStatus[flightStatus["descent"] = 5] = "descent";
    flightStatus[flightStatus["approach"] = 6] = "approach";
    flightStatus[flightStatus["landing"] = 7] = "landing";
    flightStatus[flightStatus["parked"] = 8] = "parked";
    flightStatus[flightStatus["taxiToParking"] = 9] = "taxiToParking";
    flightStatus[flightStatus["goAround"] = 10] = "goAround";
})(flightStatus = exports.flightStatus || (exports.flightStatus = {}));
//# sourceMappingURL=flightStatus.js.map