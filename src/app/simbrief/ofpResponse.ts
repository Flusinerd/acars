export interface Attributes {
  version: string;
  encoding: string;
}

export interface Declaration {
  _attributes: Attributes;
}

export interface RequestId {
  _text: string;
}

export interface UserId {
  _text: string;
}

export interface TimeGenerated {
  _text: string;
}

export interface StaticId {
}

export interface OfpLayout {
  _text: string;
}

export interface Airac {
  _text: string;
}

export interface Units {
  _text: string;
}

export interface Params {
  request_id: RequestId;
  user_id: UserId;
  time_generated: TimeGenerated;
  static_id: StaticId;
  ofp_layout: OfpLayout;
  airac: Airac;
  units: Units;
}

export interface Release {
  _text: string;
}

export interface IcaoAirline {
}

export interface FlightNumber {
  _text: string;
}

export interface IsEtops {
  _text: string;
}

export interface DxRmk {
  _text: string;
}

export interface SysRmk {
}

export interface IsDetailedProfile {
  _text: string;
}

export interface CruiseProfile {
  _text: string;
}

export interface ClimbProfile {
  _text: string;
}

export interface DescentProfile {
  _text: string;
}

export interface AlternateProfile {
  _text: string;
}

export interface ReserveProfile {
  _text: string;
}

export interface Costindex {
  _text: string;
}

export interface InitialAltitude {
  _text: string;
}

export interface StepclimbString {
  _text: string;
}

export interface AvgTempDev {
  _text: string;
}

export interface AvgTropopause {
  _text: string;
}

export interface AvgWindComp {
  _text: string;
}

export interface AvgWindDir {
  _text: string;
}

export interface AvgWindSpd {
  _text: string;
}

export interface GcDistance {
  _text: string;
}

export interface RouteDistance {
  _text: string;
}

export interface AirDistance {
  _text: string;
}

export interface TotalBurn {
  _text: string;
}

export interface CruiseTas {
  _text: string;
}

export interface CruiseMach {
  _text: string;
}

export interface Passengers {
  _text: string;
}

export interface Route {
  _text: string;
}

export interface RouteIfps {
  _text: string;
}

export interface RouteNavigraph {
  _text: string;
}

export interface General {
  release: Release;
  icao_airline: IcaoAirline;
  flight_number: FlightNumber;
  is_etops: IsEtops;
  dx_rmk: DxRmk;
  sys_rmk: SysRmk;
  is_detailed_profile: IsDetailedProfile;
  cruise_profile: CruiseProfile;
  climb_profile: ClimbProfile;
  descent_profile: DescentProfile;
  alternate_profile: AlternateProfile;
  reserve_profile: ReserveProfile;
  costindex: Costindex;
  initial_altitude: InitialAltitude;
  stepclimb_string: StepclimbString;
  avg_temp_dev: AvgTempDev;
  avg_tropopause: AvgTropopause;
  avg_wind_comp: AvgWindComp;
  avg_wind_dir: AvgWindDir;
  avg_wind_spd: AvgWindSpd;
  gc_distance: GcDistance;
  route_distance: RouteDistance;
  air_distance: AirDistance;
  total_burn: TotalBurn;
  cruise_tas: CruiseTas;
  cruise_mach: CruiseMach;
  passengers: Passengers;
  route: Route;
  route_ifps: RouteIfps;
  route_navigraph: RouteNavigraph;
}

export interface IcaoCode {
  _text: string;
}

export interface IataCode {
  _text: string;
}

export interface FaaCode {
}

export interface Elevation {
  _text: string;
}

export interface PosLat {
  _text: string;
}

export interface PosLong {
  _text: string;
}

export interface Name {
  _text: string;
}

export interface PlanRwy {
  _text: string;
}

export interface Origin {
  icao_code: IcaoCode;
  iata_code: IataCode;
  faa_code: FaaCode;
  elevation: Elevation;
  pos_lat: PosLat;
  pos_long: PosLong;
  name: Name;
  plan_rwy: PlanRwy;
}

export interface IcaoCode2 {
  _text: string;
}

export interface IataCode2 {
  _text: string;
}

export interface FaaCode2 {
}

export interface Elevation2 {
  _text: string;
}

export interface PosLat2 {
  _text: string;
}

export interface PosLong2 {
  _text: string;
}

export interface Name2 {
  _text: string;
}

export interface PlanRwy2 {
  _text: string;
}

export interface Destination {
  icao_code: IcaoCode2;
  iata_code: IataCode2;
  faa_code: FaaCode2;
  elevation: Elevation2;
  pos_lat: PosLat2;
  pos_long: PosLong2;
  name: Name2;
  plan_rwy: PlanRwy2;
}

export interface IcaoCode3 {
  _text: string;
}

export interface IataCode3 {
  _text: string;
}

export interface FaaCode3 {
}

export interface Elevation3 {
  _text: string;
}

export interface PosLat3 {
  _text: string;
}

export interface PosLong3 {
  _text: string;
}

export interface Name3 {
  _text: string;
}

export interface PlanRwy3 {
  _text: string;
}

export interface CruiseAltitude {
  _text: string;
}

export interface Distance {
  _text: string;
}

export interface GcDistance2 {
  _text: string;
}

export interface AirDistance2 {
  _text: string;
}

export interface TrackTrue {
  _text: string;
}

export interface TrackMag {
  _text: string;
}

export interface Tas {
  _text: string;
}

export interface Gs {
  _text: string;
}

export interface AvgWindComp2 {
  _text: string;
}

export interface AvgWindDir2 {
  _text: string;
}

export interface AvgWindSpd2 {
  _text: string;
}

export interface AvgTropopause2 {
  _text: string;
}

export interface AvgTdv {
  _text: string;
}

export interface Ete {
  _text: string;
}

export interface Burn {
  _text: string;
}

export interface Route2 {
  _text: string;
}

export interface RouteIfps2 {
  _text: string;
}

export interface Alternate {
  icao_code: IcaoCode3;
  iata_code: IataCode3;
  faa_code: FaaCode3;
  elevation: Elevation3;
  pos_lat: PosLat3;
  pos_long: PosLong3;
  name: Name3;
  plan_rwy: PlanRwy3;
  cruise_altitude: CruiseAltitude;
  distance: Distance;
  gc_distance: GcDistance2;
  air_distance: AirDistance2;
  track_true: TrackTrue;
  track_mag: TrackMag;
  tas: Tas;
  gs: Gs;
  avg_wind_comp: AvgWindComp2;
  avg_wind_dir: AvgWindDir2;
  avg_wind_spd: AvgWindSpd2;
  avg_tropopause: AvgTropopause2;
  avg_tdv: AvgTdv;
  ete: Ete;
  burn: Burn;
  route: Route2;
  route_ifps: RouteIfps2;
}

export interface TakeoffAltn {
}

export interface EnrouteAltn {
}

export interface Ident {
  _text: string;
}

export interface Name4 {
  _text: string;
}

export interface Type {
  _text: string;
}

export interface Frequency {
  _text: string;
}

export interface PosLat4 {
  _text: string;
}

export interface PosLong4 {
  _text: string;
}

export interface Stage {
  _text: string;
}

export interface ViaAirway {
  _text: string;
}

export interface IsSidStar {
  _text: string;
}

export interface Distance2 {
  _text: string;
}

export interface TrackTrue2 {
  _text: string;
}

export interface TrackMag2 {
  _text: string;
}

export interface HeadingTrue {
  _text: string;
}

export interface HeadingMag {
  _text: string;
}

export interface AltitudeFeet {
  _text: string;
}

export interface IndAirspeed {
  _text: string;
}

export interface TrueAirspeed {
  _text: string;
}

export interface Mach {
  _text: string;
}

export interface MachThousandths {
  _text: string;
}

export interface WindComponent {
  _text: string;
}

export interface Groundspeed {
  _text: string;
}

export interface TimeLeg {
  _text: string;
}

export interface TimeTotal {
  _text: string;
}

export interface FuelFlow {
  _text: string;
}

export interface FuelLeg {
  _text: string;
}

export interface FuelTotalused {
  _text: string;
}

export interface FuelMinOnboard {
  _text: string;
}

export interface FuelPlanOnboard {
  _text: string;
}

export interface Oat {
  _text: string;
}

export interface OatIsaDev {
  _text: string;
}

export interface WindDir {
  _text: string;
}

export interface WindSpd {
  _text: string;
}

export interface Shear {
  _text: string;
}

export interface TropopauseFeet {
  _text: string;
}

export interface GroundHeight {
  _text: string;
}

export interface Mora {
  _text: string;
}

export interface Fir {
  _text: string;
}

export interface FirUnits {
  _text: string;
}

export interface FirValidLevels {
  _text: string;
}

export interface Altitude {
  _text: string;
}

export interface WindDir2 {
  _text: string;
}

export interface WindSpd2 {
  _text: string;
}

export interface Oat2 {
  _text: string;
}

export interface Level {
  altitude: Altitude;
  wind_dir: WindDir2;
  wind_spd: WindSpd2;
  oat: Oat2;
}

export interface WindData {
  level: Level[];
}

export interface FirCrossing {
}

export interface Fix {
  ident: Ident;
  name: Name4;
  type: Type;
  frequency: Frequency;
  pos_lat: PosLat4;
  pos_long: PosLong4;
  stage: Stage;
  via_airway: ViaAirway;
  is_sid_star: IsSidStar;
  distance: Distance2;
  track_true: TrackTrue2;
  track_mag: TrackMag2;
  heading_true: HeadingTrue;
  heading_mag: HeadingMag;
  altitude_feet: AltitudeFeet;
  ind_airspeed: IndAirspeed;
  true_airspeed: TrueAirspeed;
  mach: Mach;
  mach_thousandths: MachThousandths;
  wind_component: WindComponent;
  groundspeed: Groundspeed;
  time_leg: TimeLeg;
  time_total: TimeTotal;
  fuel_flow: FuelFlow;
  fuel_leg: FuelLeg;
  fuel_totalused: FuelTotalused;
  fuel_min_onboard: FuelMinOnboard;
  fuel_plan_onboard: FuelPlanOnboard;
  oat: Oat;
  oat_isa_dev: OatIsaDev;
  wind_dir: WindDir;
  wind_spd: WindSpd;
  shear: Shear;
  tropopause_feet: TropopauseFeet;
  ground_height: GroundHeight;
  mora: Mora;
  fir: Fir;
  fir_units: FirUnits;
  fir_valid_levels: FirValidLevels;
  wind_data: WindData;
  fir_crossing: FirCrossing;
}

export interface Navlog {
  fix: Fix[];
}

export interface Etops {
}

export interface FlightplanText {
  _text: string;
}

export interface Route3 {
  _text: string;
}

export interface RouteIfps3 {
  _text: string;
}

export interface Callsign {
  _text: string;
}

export interface InitialSpd {
  _text: string;
}

export interface InitialSpdUnit {
  _text: string;
}

export interface InitialAlt {
  _text: string;
}

export interface InitialAltUnit {
  _text: string;
}

export interface Section18 {
  _text: string;
}

export interface FirOrig {
  _text: string;
}

export interface FirDest {
  _text: string;
}

export interface FirAltn {
  _text: string;
}

export interface FirEtops {
}

export interface FirEnroute {
}

export interface Atc {
  flightplan_text: FlightplanText;
  route: Route3;
  route_ifps: RouteIfps3;
  callsign: Callsign;
  initial_spd: InitialSpd;
  initial_spd_unit: InitialSpdUnit;
  initial_alt: InitialAlt;
  initial_alt_unit: InitialAltUnit;
  section18: Section18;
  fir_orig: FirOrig;
  fir_dest: FirDest;
  fir_altn: FirAltn;
  fir_etops: FirEtops;
  fir_enroute: FirEnroute;
}

export interface Icaocode {
  _text: string;
}

export interface Iatacode {
  _text: string;
}

export interface Name5 {
  _text: string;
}

export interface Reg {
  _text: string;
}

export interface Fin {
  _text: string;
}

export interface Selcal {
}

export interface Equip {
  _text: string;
}

export interface MaxPassengers {
  _text: string;
}

export interface Fuelfact {
  _text: string;
}

export interface Aircraft {
  icaocode: Icaocode;
  iatacode: Iatacode;
  name: Name5;
  reg: Reg;
  fin: Fin;
  selcal: Selcal;
  equip: Equip;
  max_passengers: MaxPassengers;
  fuelfact: Fuelfact;
}

export interface Taxi {
  _text: string;
}

export interface EnrouteBurn {
  _text: string;
}

export interface Contingency {
  _text: string;
}

export interface AlternateBurn {
  _text: string;
}

export interface Reserve {
  _text: string;
}

export interface Etops2 {
  _text: string;
}

export interface Extra {
  _text: string;
}

export interface MinTakeoff {
  _text: string;
}

export interface PlanTakeoff {
  _text: string;
}

export interface PlanRamp {
  _text: string;
}

export interface PlanLanding {
  _text: string;
}

export interface AvgFuelFlow {
  _text: string;
}

export interface MaxTanks {
  _text: string;
}

export interface Fuel {
  taxi: Taxi;
  enroute_burn: EnrouteBurn;
  contingency: Contingency;
  alternate_burn: AlternateBurn;
  reserve: Reserve;
  etops: Etops2;
  extra: Extra;
  min_takeoff: MinTakeoff;
  plan_takeoff: PlanTakeoff;
  plan_ramp: PlanRamp;
  plan_landing: PlanLanding;
  avg_fuel_flow: AvgFuelFlow;
  max_tanks: MaxTanks;
}

export interface EstTimeEnroute {
  _text: string;
}

export interface SchedTimeEnroute {
  _text: string;
}

export interface SchedOut {
  _text: string;
}

export interface SchedOff {
  _text: string;
}

export interface SchedOn {
  _text: string;
}

export interface SchedIn {
  _text: string;
}

export interface SchedBlock {
  _text: string;
}

export interface EstOut {
  _text: string;
}

export interface EstOff {
  _text: string;
}

export interface EstOn {
  _text: string;
}

export interface EstIn {
  _text: string;
}

export interface EstBlock {
  _text: string;
}

export interface OrigTimezone {
  _text: string;
}

export interface DestTimezone {
  _text: string;
}

export interface TaxiOut {
  _text: string;
}

export interface TaxiIn {
  _text: string;
}

export interface ReserveTime {
  _text: string;
}

export interface Endurance {
  _text: string;
}

export interface ContfuelTime {
  _text: string;
}

export interface EtopsfuelTime {
  _text: string;
}

export interface ExtrafuelTime {
  _text: string;
}

export interface Times {
  est_time_enroute: EstTimeEnroute;
  sched_time_enroute: SchedTimeEnroute;
  sched_out: SchedOut;
  sched_off: SchedOff;
  sched_on: SchedOn;
  sched_in: SchedIn;
  sched_block: SchedBlock;
  est_out: EstOut;
  est_off: EstOff;
  est_on: EstOn;
  est_in: EstIn;
  est_block: EstBlock;
  orig_timezone: OrigTimezone;
  dest_timezone: DestTimezone;
  taxi_out: TaxiOut;
  taxi_in: TaxiIn;
  reserve_time: ReserveTime;
  endurance: Endurance;
  contfuel_time: ContfuelTime;
  etopsfuel_time: EtopsfuelTime;
  extrafuel_time: ExtrafuelTime;
}

export interface Oew {
  _text: string;
}

export interface PaxCount {
  _text: string;
}

export interface PaxWeight {
  _text: string;
}

export interface Cargo {
  _text: string;
}

export interface Payload {
  _text: string;
}

export interface EstZfw {
  _text: string;
}

export interface MaxZfw {
  _text: string;
}

export interface EstTow {
  _text: string;
}

export interface MaxTow {
  _text: string;
}

export interface MaxTowStruct {
  _text: string;
}

export interface TowLimitCode {
  _text: string;
}

export interface EstLdw {
  _text: string;
}

export interface MaxLdw {
  _text: string;
}

export interface EstRamp {
  _text: string;
}

export interface Weights {
  oew: Oew;
  pax_count: PaxCount;
  pax_weight: PaxWeight;
  cargo: Cargo;
  payload: Payload;
  est_zfw: EstZfw;
  max_zfw: MaxZfw;
  est_tow: EstTow;
  max_tow: MaxTow;
  max_tow_struct: MaxTowStruct;
  tow_limit_code: TowLimitCode;
  est_ldw: EstLdw;
  max_ldw: MaxLdw;
  est_ramp: EstRamp;
}

export interface TimeEnroute {
  _text: string;
}

export interface TimeDifference {
  _text: string;
}

export interface EnrouteBurn2 {
  _text: string;
}

export interface BurnDifference {
  _text: string;
}

export interface RampFuel {
  _text: string;
}

export interface InitialFl {
  _text: string;
}

export interface InitialTas {
  _text: string;
}

export interface InitialMach {
  _text: string;
}

export interface CostIndex {
  _text: string;
}

export interface Minus6000ft {
  time_enroute: TimeEnroute;
  time_difference: TimeDifference;
  enroute_burn: EnrouteBurn2;
  burn_difference: BurnDifference;
  ramp_fuel: RampFuel;
  initial_fl: InitialFl;
  initial_tas: InitialTas;
  initial_mach: InitialMach;
  cost_index: CostIndex;
}

export interface TimeEnroute2 {
  _text: string;
}

export interface TimeDifference2 {
  _text: string;
}

export interface EnrouteBurn3 {
  _text: string;
}

export interface BurnDifference2 {
  _text: string;
}

export interface RampFuel2 {
  _text: string;
}

export interface InitialFl2 {
  _text: string;
}

export interface InitialTas2 {
  _text: string;
}

export interface InitialMach2 {
  _text: string;
}

export interface CostIndex2 {
  _text: string;
}

export interface Minus4000ft {
  time_enroute: TimeEnroute2;
  time_difference: TimeDifference2;
  enroute_burn: EnrouteBurn3;
  burn_difference: BurnDifference2;
  ramp_fuel: RampFuel2;
  initial_fl: InitialFl2;
  initial_tas: InitialTas2;
  initial_mach: InitialMach2;
  cost_index: CostIndex2;
}

export interface TimeEnroute3 {
  _text: string;
}

export interface TimeDifference3 {
  _text: string;
}

export interface EnrouteBurn4 {
  _text: string;
}

export interface BurnDifference3 {
  _text: string;
}

export interface RampFuel3 {
  _text: string;
}

export interface InitialFl3 {
  _text: string;
}

export interface InitialTas3 {
  _text: string;
}

export interface InitialMach3 {
  _text: string;
}

export interface CostIndex3 {
  _text: string;
}

export interface Minus2000ft {
  time_enroute: TimeEnroute3;
  time_difference: TimeDifference3;
  enroute_burn: EnrouteBurn4;
  burn_difference: BurnDifference3;
  ramp_fuel: RampFuel3;
  initial_fl: InitialFl3;
  initial_tas: InitialTas3;
  initial_mach: InitialMach3;
  cost_index: CostIndex3;
}

export interface TimeEnroute4 {
  _text: string;
}

export interface TimeDifference4 {
  _text: string;
}

export interface EnrouteBurn5 {
  _text: string;
}

export interface BurnDifference4 {
  _text: string;
}

export interface RampFuel4 {
  _text: string;
}

export interface InitialFl4 {
  _text: string;
}

export interface InitialTas4 {
  _text: string;
}

export interface InitialMach4 {
  _text: string;
}

export interface CostIndex4 {
  _text: string;
}

export interface Plus2000ft {
  time_enroute: TimeEnroute4;
  time_difference: TimeDifference4;
  enroute_burn: EnrouteBurn5;
  burn_difference: BurnDifference4;
  ramp_fuel: RampFuel4;
  initial_fl: InitialFl4;
  initial_tas: InitialTas4;
  initial_mach: InitialMach4;
  cost_index: CostIndex4;
}

export interface TimeEnroute5 {
  _text: string;
}

export interface TimeDifference5 {
  _text: string;
}

export interface EnrouteBurn6 {
  _text: string;
}

export interface BurnDifference5 {
  _text: string;
}

export interface RampFuel5 {
  _text: string;
}

export interface InitialFl5 {
  _text: string;
}

export interface InitialTas5 {
  _text: string;
}

export interface InitialMach5 {
  _text: string;
}

export interface CostIndex5 {
  _text: string;
}

export interface Plus4000ft {
  time_enroute: TimeEnroute5;
  time_difference: TimeDifference5;
  enroute_burn: EnrouteBurn6;
  burn_difference: BurnDifference5;
  ramp_fuel: RampFuel5;
  initial_fl: InitialFl5;
  initial_tas: InitialTas5;
  initial_mach: InitialMach5;
  cost_index: CostIndex5;
}

export interface Plus6000ft {
}

export interface TimeEnroute6 {
  _text: string;
}

export interface TimeDifference6 {
  _text: string;
}

export interface EnrouteBurn7 {
  _text: string;
}

export interface BurnDifference6 {
  _text: string;
}

export interface RampFuel6 {
  _text: string;
}

export interface InitialFl6 {
  _text: string;
}

export interface InitialTas6 {
  _text: string;
}

export interface InitialMach6 {
  _text: string;
}

export interface CostIndex6 {
  _text: string;
}

export interface HigherCi {
  time_enroute: TimeEnroute6;
  time_difference: TimeDifference6;
  enroute_burn: EnrouteBurn7;
  burn_difference: BurnDifference6;
  ramp_fuel: RampFuel6;
  initial_fl: InitialFl6;
  initial_tas: InitialTas6;
  initial_mach: InitialMach6;
  cost_index: CostIndex6;
}

export interface TimeEnroute7 {
  _text: string;
}

export interface TimeDifference7 {
  _text: string;
}

export interface EnrouteBurn8 {
  _text: string;
}

export interface BurnDifference7 {
  _text: string;
}

export interface RampFuel7 {
  _text: string;
}

export interface InitialFl7 {
  _text: string;
}

export interface InitialTas7 {
  _text: string;
}

export interface InitialMach7 {
  _text: string;
}

export interface CostIndex7 {
  _text: string;
}

export interface LowerCi {
  time_enroute: TimeEnroute7;
  time_difference: TimeDifference7;
  enroute_burn: EnrouteBurn8;
  burn_difference: BurnDifference7;
  ramp_fuel: RampFuel7;
  initial_fl: InitialFl7;
  initial_tas: InitialTas7;
  initial_mach: InitialMach7;
  cost_index: CostIndex7;
}

export interface TimeEnroute8 {
  _text: string;
}

export interface TimeDifference8 {
  _text: string;
}

export interface EnrouteBurn9 {
  _text: string;
}

export interface BurnDifference8 {
  _text: string;
}

export interface RampFuel8 {
  _text: string;
}

export interface InitialFl8 {
  _text: string;
}

export interface InitialTas8 {
  _text: string;
}

export interface InitialMach8 {
  _text: string;
}

export interface CostIndex8 {
  _text: string;
}

export interface ZfwPlus1000 {
  time_enroute: TimeEnroute8;
  time_difference: TimeDifference8;
  enroute_burn: EnrouteBurn9;
  burn_difference: BurnDifference8;
  ramp_fuel: RampFuel8;
  initial_fl: InitialFl8;
  initial_tas: InitialTas8;
  initial_mach: InitialMach8;
  cost_index: CostIndex8;
}

export interface TimeEnroute9 {
  _text: string;
}

export interface TimeDifference9 {
  _text: string;
}

export interface EnrouteBurn10 {
  _text: string;
}

export interface BurnDifference9 {
  _text: string;
}

export interface RampFuel9 {
  _text: string;
}

export interface InitialFl9 {
  _text: string;
}

export interface InitialTas9 {
  _text: string;
}

export interface InitialMach9 {
  _text: string;
}

export interface CostIndex9 {
  _text: string;
}

export interface ZfwMinus1000 {
  time_enroute: TimeEnroute9;
  time_difference: TimeDifference9;
  enroute_burn: EnrouteBurn10;
  burn_difference: BurnDifference9;
  ramp_fuel: RampFuel9;
  initial_fl: InitialFl9;
  initial_tas: InitialTas9;
  initial_mach: InitialMach9;
  cost_index: CostIndex9;
}

export interface Impacts {
  minus_6000ft: Minus6000ft;
  minus_4000ft: Minus4000ft;
  minus_2000ft: Minus2000ft;
  plus_2000ft: Plus2000ft;
  plus_4000ft: Plus4000ft;
  plus_6000ft: Plus6000ft;
  higher_ci: HigherCi;
  lower_ci: LowerCi;
  zfw_plus_1000: ZfwPlus1000;
  zfw_minus_1000: ZfwMinus1000;
}

export interface PilotId {
  _text: string;
}

export interface Cpt {
  _text: string;
}

export interface Fo {
  _text: string;
}

export interface Dx {
  _text: string;
}

export interface Pu {
  _text: string;
}

export interface Fa {
  _text: string;
}

export interface Crew {
  pilot_id: PilotId;
  cpt: Cpt;
  fo: Fo;
  dx: Dx;
  pu: Pu;
  fa: Fa[];
}

export interface SourceId {
  _text: string;
}

export interface AccountId {
  _text: string;
}

export interface NotamId {
  _text: string;
}

export interface NotamPart {
  _text: string;
}

export interface CnsLocationId {
  _text: string;
}

export interface IcaoId {
  _text: string;
}

export interface IcaoName {
  _text: string;
}

export interface TotalParts {
  _text: string;
}

export interface NotamCreatedDtg {
  _text: string;
}

export interface NotamEffectiveDtg {
  _text: string;
}

export interface NotamExpireDtg {
  _text: string;
}

export interface NotamLastmodDtg {
  _text: string;
}

export interface NotamInsertedDtg {
  _text: string;
}

export interface NotamText {
  _text: string;
}

export interface NotamReport {
  _text: string;
}

export interface NotamNrc {
  _text: string;
}

export interface NotamQcode {
  _text: string;
}

export interface Notamdrec {
  source_id: SourceId;
  account_id: AccountId;
  notam_id: NotamId;
  notam_part: NotamPart;
  cns_location_id: CnsLocationId;
  icao_id: IcaoId;
  icao_name: IcaoName;
  total_parts: TotalParts;
  notam_created_dtg: NotamCreatedDtg;
  notam_effective_dtg: NotamEffectiveDtg;
  notam_expire_dtg: NotamExpireDtg;
  notam_lastmod_dtg: NotamLastmodDtg;
  notam_inserted_dtg: NotamInsertedDtg;
  notam_text: NotamText;
  notam_report: NotamReport;
  notam_nrc: NotamNrc;
  notam_qcode: NotamQcode;
}

export interface RecCount {
  _text: string;
}

export interface Notams {
  notamdrec: Notamdrec[];
  "rec - count": RecCount;
}

export interface OrigMetar {
  _text: string;
}

export interface OrigTaf {
  _text: string;
}

export interface DestMetar {
  _text: string;
}

export interface DestTaf {
  _text: string;
}

export interface AltnMetar {
  _text: string;
}

export interface AltnTaf {
  _text: string;
}

export interface ToaltnMetar {
}

export interface ToaltnTaf {
}

export interface EualtnMetar {
}

export interface EualtnTaf {
}

export interface EtopsMetar {
}

export interface EtopsTaf {
}

export interface Weather {
  orig_metar: OrigMetar;
  orig_taf: OrigTaf;
  dest_metar: DestMetar;
  dest_taf: DestTaf;
  altn_metar: AltnMetar;
  altn_taf: AltnTaf;
  toaltn_metar: ToaltnMetar;
  toaltn_taf: ToaltnTaf;
  eualtn_metar: EualtnMetar;
  eualtn_taf: EualtnTaf;
  etops_metar: EtopsMetar;
  etops_taf: EtopsTaf;
}

export interface Sigmets {
}

export interface NatTracks {
}

export interface PlanHtml {
  _text: string;
}

export interface Text {
  nat_tracks: NatTracks;
  plan_html: PlanHtml;
}

export interface Tracks {
}

export interface MetarTaf {
  _text: string;
}

export interface Winds {
  _text: string;
}

export interface Sigwx {
  _text: string;
}

export interface Sigmet {
  _text: string;
}

export interface Notams2 {
  _text: string;
}

export interface Tracks2 {
  _text: string;
}

export interface DatabaseUpdates {
  metar_taf: MetarTaf;
  winds: Winds;
  sigwx: Sigwx;
  sigmet: Sigmet;
  notams: Notams2;
  tracks: Tracks2;
}

export interface Directory {
  _text: string;
}

export interface Name6 {
  _text: string;
}

export interface Link {
  _text: string;
}

export interface Pdf {
  name: Name6;
  link: Link;
}

export interface Name7 {
  _text: string;
}

export interface Link2 {
  _text: string;
}

export interface File {
  name: Name7;
  link: Link2;
}

export interface Files {
  directory: Directory;
  pdf: Pdf;
  file: File[];
}

export interface Directory2 {
  _text: string;
}

export interface Name8 {
  _text: string;
}

export interface Link3 {
  _text: string;
}

export interface Pdf2 {
  name: Name8;
  link: Link3;
}

export interface Name9 {
  _text: string;
}

export interface Link4 {
  _text: string;
}

export interface Abx {
  name: Name9;
  link: Link4;
}

export interface Name10 {
  _text: string;
}

export interface Link5 {
  _text: string;
}

export interface A3e {
  name: Name10;
  link: Link5;
}

export interface Name11 {
  _text: string;
}

export interface Link6 {
  _text: string;
}

export interface Crx {
  name: Name11;
  link: Link6;
}

export interface Name12 {
  _text: string;
}

export interface Link7 {
  _text: string;
}

export interface Psx {
  name: Name12;
  link: Link7;
}

export interface Name13 {
  _text: string;
}

export interface Link8 {
  _text: string;
}

export interface Efb {
  name: Name13;
  link: Link8;
}

export interface Name14 {
  _text: string;
}

export interface Link9 {
  _text: string;
}

export interface Ef2 {
  name: Name14;
  link: Link9;
}

export interface Name15 {
  _text: string;
}

export interface Link10 {
  _text: string;
}

export interface Bbs {
  name: Name15;
  link: Link10;
}

export interface Name16 {
  _text: string;
}

export interface Link11 {
  _text: string;
}

export interface Csf {
  name: Name16;
  link: Link11;
}

export interface Name17 {
  _text: string;
}

export interface Link12 {
  _text: string;
}

export interface Ftr {
  name: Name17;
  link: Link12;
}

export interface Name18 {
  _text: string;
}

export interface Link13 {
  _text: string;
}

export interface Gtn {
  name: Name18;
  link: Link13;
}

export interface Name19 {
  _text: string;
}

export interface Link14 {
  _text: string;
}

export interface Vm5 {
  name: Name19;
  link: Link14;
}

export interface Name20 {
  _text: string;
}

export interface Link15 {
  _text: string;
}

export interface Vmx {
  name: Name20;
  link: Link15;
}

export interface Name21 {
  _text: string;
}

export interface Link16 {
  _text: string;
}

export interface Ffa {
  name: Name21;
  link: Link16;
}

export interface Name22 {
  _text: string;
}

export interface Link17 {
  _text: string;
}

export interface Fsc {
  name: Name22;
  link: Link17;
}

export interface Name23 {
  _text: string;
}

export interface Link18 {
  _text: string;
}

export interface Fs9 {
  name: Name23;
  link: Link18;
}

export interface Name24 {
  _text: string;
}

export interface Link19 {
  _text: string;
}

export interface Mfs {
  name: Name24;
  link: Link19;
}

export interface Name25 {
  _text: string;
}

export interface Link20 {
  _text: string;
}

export interface Fsl {
  name: Name25;
  link: Link20;
}

export interface Name26 {
  _text: string;
}

export interface Link21 {
  _text: string;
}

export interface Fsx {
  name: Name26;
  link: Link21;
}

export interface Name27 {
  _text: string;
}

export interface Link22 {
  _text: string;
}

export interface Fsn {
  name: Name27;
  link: Link22;
}

export interface Name28 {
  _text: string;
}

export interface Link23 {
  _text: string;
}

export interface Kml {
  name: Name28;
  link: Link23;
}

export interface Name29 {
  _text: string;
}

export interface Link24 {
  _text: string;
}

export interface Ify {
  name: Name29;
  link: Link24;
}

export interface Name30 {
  _text: string;
}

export interface Link25 {
  _text: string;
}

export interface I74 {
  name: Name30;
  link: Link25;
}

export interface Name31 {
  _text: string;
}

export interface Link26 {
  _text: string;
}

export interface Ivo {
  name: Name31;
  link: Link26;
}

export interface Name32 {
  _text: string;
}

export interface Link27 {
  _text: string;
}

export interface Xvd {
  name: Name32;
  link: Link27;
}

export interface Name33 {
  _text: string;
}

export interface Link28 {
  _text: string;
}

export interface Xvp {
  name: Name33;
  link: Link28;
}

export interface Name34 {
  _text: string;
}

export interface Link29 {
  _text: string;
}

export interface Ixg {
  name: Name34;
  link: Link29;
}

export interface Name35 {
  _text: string;
}

export interface Link30 {
  _text: string;
}

export interface Jar {
  name: Name35;
  link: Link30;
}

export interface Name36 {
  _text: string;
}

export interface Link31 {
  _text: string;
}

export interface Mdr {
  name: Name36;
  link: Link31;
}

export interface Name37 {
  _text: string;
}

export interface Link32 {
  _text: string;
}

export interface Mda {
  name: Name37;
  link: Link32;
}

export interface Name38 {
  _text: string;
}

export interface Link33 {
  _text: string;
}

export interface Lvd {
  name: Name38;
  link: Link33;
}

export interface Name39 {
  _text: string;
}

export interface Link34 {
  _text: string;
}

export interface Mjc {
  name: Name39;
  link: Link34;
}

export interface Name40 {
  _text: string;
}

export interface Link35 {
  _text: string;
}

export interface Vms {
  name: Name40;
  link: Link35;
}

export interface Name41 {
  _text: string;
}

export interface Link36 {
  _text: string;
}

export interface Pmr {
  name: Name41;
  link: Link36;
}

export interface Name42 {
  _text: string;
}

export interface Link37 {
  _text: string;
}

export interface Pmw {
  name: Name42;
  link: Link37;
}

export interface Name43 {
  _text: string;
}

export interface Link38 {
  _text: string;
}

export interface Mga {
  name: Name43;
  link: Link38;
}

export interface Name44 {
  _text: string;
}

export interface Link39 {
  _text: string;
}

export interface Psm {
  name: Name44;
  link: Link39;
}

export interface Name45 {
  _text: string;
}

export interface Link40 {
  _text: string;
}

export interface Qty {
  name: Name45;
  link: Link40;
}

export interface Name46 {
  _text: string;
}

export interface Link41 {
  _text: string;
}

export interface Sbr {
  name: Name46;
  link: Link41;
}

export interface Name47 {
  _text: string;
}

export interface Link42 {
  _text: string;
}

export interface Sfp {
  name: Name47;
  link: Link42;
}

export interface Name48 {
  _text: string;
}

export interface Link43 {
  _text: string;
}

export interface Tfd {
  name: Name48;
  link: Link43;
}

export interface Name49 {
  _text: string;
}

export interface Link44 {
  _text: string;
}

export interface Ufc {
  name: Name49;
  link: Link44;
}

export interface Name50 {
  _text: string;
}

export interface Link45 {
  _text: string;
}

export interface Vas {
  name: Name50;
  link: Link45;
}

export interface Name51 {
  _text: string;
}

export interface Link46 {
  _text: string;
}

export interface Vfp {
  name: Name51;
  link: Link46;
}

export interface Name52 {
  _text: string;
}

export interface Link47 {
  _text: string;
}

export interface Wae {
  name: Name52;
  link: Link47;
}

export interface Name53 {
  _text: string;
}

export interface Link48 {
  _text: string;
}

export interface Xfm {
  name: Name53;
  link: Link48;
}

export interface Name54 {
  _text: string;
}

export interface Link49 {
  _text: string;
}

export interface Xpe {
  name: Name54;
  link: Link49;
}

export interface Name55 {
  _text: string;
}

export interface Link50 {
  _text: string;
}

export interface Xp9 {
  name: Name55;
  link: Link50;
}

export interface FmsDownloads {
  directory: Directory2;
  pdf: Pdf2;
  abx: Abx;
  a3e: A3e;
  crx: Crx;
  psx: Psx;
  efb: Efb;
  ef2: Ef2;
  bbs: Bbs;
  csf: Csf;
  ftr: Ftr;
  gtn: Gtn;
  vm5: Vm5;
  vmx: Vmx;
  ffa: Ffa;
  fsc: Fsc;
  fs9: Fs9;
  mfs: Mfs;
  fsl: Fsl;
  fsx: Fsx;
  fsn: Fsn;
  kml: Kml;
  ify: Ify;
  i74: I74;
  ivo: Ivo;
  xvd: Xvd;
  xvp: Xvp;
  ixg: Ixg;
  jar: Jar;
  mdr: Mdr;
  mda: Mda;
  lvd: Lvd;
  mjc: Mjc;
  vms: Vms;
  pmr: Pmr;
  pmw: Pmw;
  mga: Mga;
  psm: Psm;
  qty: Qty;
  sbr: Sbr;
  sfp: Sfp;
  tfd: Tfd;
  ufc: Ufc;
  vas: Vas;
  vfp: Vfp;
  wae: Wae;
  xfm: Xfm;
  xpe: Xpe;
  xp9: Xp9;
}

export interface Directory3 {
  _text: string;
}

export interface Name56 {
  _text: string;
}

export interface Link51 {
  _text: string;
}

export interface Map {
  name: Name56;
  link: Link51;
}

export interface Images {
  directory: Directory3;
  map: Map[];
}

export interface Skyvector {
  _text: string;
}

export interface Links {
  skyvector: Skyvector;
}

export interface VatsimPrefile {
  _text: string;
}

export interface IvaoPrefile {
  _text: string;
}

export interface PilotedgePrefile {
  _text: string;
}

export interface PosconPrefile {
  _text: string;
}

export interface MapData {
  _text: string;
}

export interface Airline {
}

export interface Fltnum {
}

export interface Type2 {
  _text: string;
}

export interface Orig {
  _text: string;
}

export interface Dest {
  _text: string;
}

export interface Date {
  _text: string;
}

export interface Dephour {
  _text: string;
}

export interface Depmin {
  _text: string;
}

export interface Route4 {
  _text: string;
}

export interface Stehour {
  _text: string;
}

export interface Stemin {
  _text: string;
}

export interface Reg2 {
}

export interface Fin2 {
}

export interface Selcal2 {
}

export interface Pax {
  _text: string;
}

export interface Altn {
  _text: string;
}

export interface Fl {
}

export interface Cpt2 {
  _text: string;
}

export interface Pid {
  _text: string;
}

export interface Fuelfactor {
  _text: string;
}

export interface Manualzfw {
  _text: string;
}

export interface Addedfuel {
  _text: string;
}

export interface Contpct {
  _text: string;
}

export interface Resvrule {
  _text: string;
}

export interface Taxiout {
  _text: string;
}

export interface Taxiin {
  _text: string;
}

export interface Cargo2 {
  _text: string;
}

export interface Origrwy {
  _text: string;
}

export interface Destrwy {
  _text: string;
}

export interface Climb {
  _text: string;
}

export interface Descent {
  _text: string;
}

export interface Cruisemode {
  _text: string;
}

export interface Cruisesub {
  _text: string;
}

export interface Planformat {
  _text: string;
}

export interface Pounds {
  _text: string;
}

export interface Navlog2 {
  _text: string;
}

export interface Etops3 {
  _text: string;
}

export interface Stepclimbs {
  _text: string;
}

export interface Tlr {
  _text: string;
}

export interface NotamsOpt {
  _text: string;
}

export interface Firnot {
  _text: string;
}

export interface Maps {
  _text: string;
}

export interface Turntoflt {
}

export interface Turntoapt {
}

export interface Turntotime {
}

export interface Turnfrflt {
}

export interface Turnfrapt {
}

export interface Turnfrtime {
}

export interface Fuelstats {
}

export interface Contlabel {
}

export interface StaticId2 {
}

export interface Acdata {
  _text: string;
}

export interface AcdataParsed {
}

export interface ApiParams {
  airline: Airline;
  fltnum: Fltnum;
  type: Type2;
  orig: Orig;
  dest: Dest;
  date: Date;
  dephour: Dephour;
  depmin: Depmin;
  route: Route4;
  stehour: Stehour;
  stemin: Stemin;
  reg: Reg2;
  fin: Fin2;
  selcal: Selcal2;
  pax: Pax;
  altn: Altn;
  fl: Fl;
  cpt: Cpt2;
  pid: Pid;
  fuelfactor: Fuelfactor;
  manualzfw: Manualzfw;
  addedfuel: Addedfuel;
  contpct: Contpct;
  resvrule: Resvrule;
  taxiout: Taxiout;
  taxiin: Taxiin;
  cargo: Cargo2;
  origrwy: Origrwy;
  destrwy: Destrwy;
  climb: Climb;
  descent: Descent;
  cruisemode: Cruisemode;
  cruisesub: Cruisesub;
  planformat: Planformat;
  pounds: Pounds;
  navlog: Navlog2;
  etops: Etops3;
  stepclimbs: Stepclimbs;
  tlr: Tlr;
  notams_opt: NotamsOpt;
  firnot: Firnot;
  maps: Maps;
  turntoflt: Turntoflt;
  turntoapt: Turntoapt;
  turntotime: Turntotime;
  turnfrflt: Turnfrflt;
  turnfrapt: Turnfrapt;
  turnfrtime: Turnfrtime;
  fuelstats: Fuelstats;
  contlabel: Contlabel;
  static_id: StaticId2;
  acdata: Acdata;
  acdata_parsed: AcdataParsed;
}

export interface OFP {
  params: Params;
  general: General;
  origin: Origin;
  destination: Destination;
  alternate: Alternate;
  takeoff_altn: TakeoffAltn;
  enroute_altn: EnrouteAltn;
  navlog: Navlog;
  etops: Etops;
  atc: Atc;
  aircraft: Aircraft;
  fuel: Fuel;
  times: Times;
  weights: Weights;
  impacts: Impacts;
  crew: Crew;
  notams: Notams;
  weather: Weather;
  sigmets: Sigmets;
  text: Text;
  tracks: Tracks;
  database_updates: DatabaseUpdates;
  files: Files;
  fms_downloads: FmsDownloads;
  images: Images;
  links: Links;
  vatsim_prefile: VatsimPrefile;
  ivao_prefile: IvaoPrefile;
  pilotedge_prefile: PilotedgePrefile;
  poscon_prefile: PosconPrefile;
  map_data: MapData;
  api_params: ApiParams;
}

export interface OFPResponse {
  _declaration: Declaration;
  OFP: OFP;
}

