import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SimbriefService } from './simbrief.service';

@Component({
  selector: 'app-simbrief',
  templateUrl: './simbrief.component.html',
  styleUrls: ['./simbrief.component.scss']
})
export class SimbriefComponent implements OnInit {

  briefing;
  sidebarVisible = false;
  briefingSUB: Subscription;

  constructor(
    private _simbrief: SimbriefService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  async ngOnInit() {
    // const response = await this._simbrief.mockresponse();
    // const pdf = response.OFP.files.directory._text + response.OFP.files.pdf.link._text;
    // const file = await this._simbrief.getUrl(pdf);
    // this.briefing = file;
    // console.log("🚀 ~ file: simbrief.component.ts ~ line 23 ~ SimbriefComponent ~ ngOnInit ~ briefing", this.briefing)
    // this._changeDetectorRef.detectChanges();
    this.briefingSUB = this._simbrief.briefing.subscribe((data) => {
      this.briefing = data?.OFP || null;
      console.log('briefing', this.briefing);
    })
  }

  async getPdf() {
    // const response = await this._simbrief.mockresponse();
    // const pdf = response.OFP.files.directory._text + response.OFP.files.pdf.link._text;
    // return await this._simbrief.getUrl(pdf);
  }

  appendZeros(time: number): string {
    if (time < 10) {
      return '0'+time;
    } else {
      return ''+time;
    }
  }

  getTime(time: number): string {
    const minutes = Math.round(time);
    const hours = Math.floor(minutes/60);
    return ''+hours+':'+this.appendZeros(minutes)+' h';
  }
}
