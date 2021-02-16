export interface ITrackingData {
  gs: number;
  ias: number;
  vs: number;
  altitude: number;
  longitude: number;
  latitude: number;
  heading: number;
  engine1Firing: boolean;
  nearestAirportAltitude: number;
  atcTypeCode: string;
  vsAtTouchdown: number;
  planeOnground: boolean;
  radioAlt: number;
  flapsControl: number;
  landingLights: boolean;
  aircraftName: string;
}