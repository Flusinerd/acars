import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Md5 } from 'ts-md5/dist/md5';
import * as simbrief from '../../../simbrief.json';
import { md5 } from '../shared/md5';
import * as xmlJs from 'xml-js';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
import { AppConfig } from '../../environments/environment';
import { OFPResponse } from './ofpResponse';

@Injectable({
  providedIn: 'root'
})
export class SimbriefService {

  private _sbform = "sbapiform";
  private _sbworkerurl = "https://www.simbrief.com/ofp/ofp.loader.api.php";
  private _sbworkerid = 'SBworker';
  private _sbcallerid = 'SBcaller';
  private _sbworkerstyle = 'width=600,height=315';
  private _sbworker: Window;
  private _SBloop;

  private _ofp_id;

  private _outputpage_save;
  private _outputpage_calc;
  private _fe_result;
  private _apiRequest = new SBApiRequest();

  private _timestamp;
  private _api_code;

  private _xmlTimer: Subscription;
  private _xmlUrl;
  public briefing = new BehaviorSubject<OFPResponse>(null);

  constructor(
    private _http: HttpClient,
    @Inject('Window') private window: Window
  ) {
    
  }

  simbriefsubmit(outputpage: string, origin: string, destination: string, type: string) {

    /*
    * Ensure any prior requests are cleaned up before continuing..
    */

    if (this._sbworker) {
      this._sbworker.close();
    }

    if (this._SBloop) {
      this.window.clearInterval(this._SBloop);
    }

    this._api_code = null;
    this._ofp_id = null;
    this._fe_result = null;
    this._timestamp = null;
    this._outputpage_save = null;
    this._outputpage_calc = null;
    this._apiRequest = new SBApiRequest();
    this._apiRequest.orig = origin.toUpperCase();
    this._apiRequest.dest = destination.toUpperCase();
    this._apiRequest.type = type.toLowerCase();

    this._do_simbriefsubmit(outputpage);
  }

  private _launchSBworker() {
    this._sbworker = this.window.open('about:blank', this._sbworkerid, this._sbworkerstyle)

    //TEST FOR POPUP BLOCKERS

    if (this._sbworker == null || typeof (this._sbworker) == 'undefined') {
      alert('Please disable your pop-up blocker to generate a flight plan!');
    }
    else {
      if (this.window.focus) {
        this._sbworker.focus();
      }
    }
  }

  private _generateApiHash(origin: string, destination: string, type: string, timestamp: string, outputpage_calc: string, apiKey: string): string {
    console.log("🚀 ~ file: simbrief.service.ts ~ line 80 ~ SimbriefService ~ _generateApiHash ~ apiKey", apiKey)
    console.log("🚀 ~ file: simbrief.service.ts ~ line 80 ~ SimbriefService ~ _generateApiHash ~ outputpage_calc", outputpage_calc)
    console.log("🚀 ~ file: simbrief.service.ts ~ line 80 ~ SimbriefService ~ _generateApiHash ~ timestamp", timestamp)
    console.log('origin', origin);
    console.log('destination', destination);
    console.log('type', type);
    const hash = Md5.hashStr(apiKey + origin + destination + type + timestamp + outputpage_calc) as string;
    console.log('hash', hash);
    return hash;
  }

  private _do_simbriefsubmit(outputpage: string) {
    // Set timestamp
    if (this._timestamp == null || this._timestamp == false) {
      this._timestamp = Math.round(+new Date()/1000);
    }

    // Save output page
    this._outputpage_save = outputpage;
    this._outputpage_calc = outputpage.replace("http://", "");

    /**
     * @todo API Key stuff?!?
     */
    console.log('key', simbrief.key);
    this._api_code = this._generateApiHash(this._apiRequest.orig, this._apiRequest.dest, this._apiRequest.type, this._timestamp, this._outputpage_calc, simbrief.key)


    //IF API_CODE IS SET, FINALIZE FORM
    this._apiRequest.url = this._sbworkerurl;
    this._apiRequest.target = this._sbworkerid;
    this._apiRequest.apicode = this._api_code;
    this._apiRequest.outputpage = this._outputpage_calc;
    this._apiRequest.timestamp = this._timestamp;


    const workerUrl = this._apiRequest.generateUrl();
    console.log('workerurl', workerUrl);
    //LAUNCH FORM

    this.window.name = this._sbcallerid;
    this._launchSBworker();
    this._sbworker.location.href = workerUrl;



    //DETERMINE OFP_ID

    this._ofp_id = this._timestamp + '_' + md5(this._apiRequest.orig + this._apiRequest.dest + this._apiRequest.type) as string;
    console.log("🚀 ~ file: simbrief.service.ts ~ line 129 ~ SimbriefService ~ _do_simbriefsubmit ~ this._ofp_id", this._ofp_id)



    //LOOP TO DETECT WHEN THE WORKER PROCESS IS CLOSED
    console.log('_sbWorker', this._sbworker);
    this._SBloop = setInterval(this._checkSBworker.bind(this), 500);
    this._checkSBworker();

  }

  private _checkSBworker() {
    if (this._sbworker?.closed) {
      console.log('Service Worker Closed');
      this._redirect_caller();
      clearInterval(this._SBloop);
    }
  }

  private _redirect_caller() {

    const url = `http://www.simbrief.com/ofp/flightplans/xml/${this._ofp_id}.xml`;
    console.log('XML URL', url);
    this._xmlUrl = url;

    this._xmlTimer = timer(0, 2000).subscribe(async () => {
      if (this._xmlUrl) {
        const response = await this._getOfp(this._ofp_id).toPromise();
        if (response){
          this._xmlTimer.unsubscribe();
          const res = this._parseXml(response);
          this.briefing.next(res);
        }
      }
    })

    // Redirect to callback with XML
  }

  private _parseXml(xmlResponse): OFPResponse {
    const jsonResponse = JSON.parse(xmlJs.xml2json(xmlResponse, {compact: true})) as OFPResponse;
    return jsonResponse;
  }

  private _getOfp(ofpId: string) {
    return this._http.get(`${AppConfig.apiUrl}/pilots/test?ofpid=${ofpId}`, {responseType: 'text'});
  }

  public async mockresponse(): Promise<OFPResponse> {
    return this._parseXml((await this._http.get(`${AppConfig.apiUrl}/pilots/test`, {responseType: 'text'}).toPromise()));
  }

}



export class SBApiRequest {
  url: string;
  sbWorkerId: string;
  apicode: string;
  outputpage: string;
  timestamp: string;
  type: string;
  orig: string;
  dest: string;
  ofp_id: string;
  target: string;
  airline?: string;
  fltnum?: string;
  callsign?: string;
  units?: string;
  civalue?: string;
  reg?: string;

  constructor() { }

  generateUrl(): string {
    let url = `${this.url}?`;
    for (const key in this) {
      if (Object.prototype.hasOwnProperty.call(this, key) && key !== 'url' && key !== 'sbWorkerId' && key !== 'target') {
        const element = this[key];
        if (element === undefined) {
          continue;
        }
        url += `${key}=${element}&`;
      }
    }
    url = url.slice(0, url.length - 1);
    return url;
  }
}

