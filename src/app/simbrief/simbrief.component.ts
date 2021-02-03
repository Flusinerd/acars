import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SimbriefService } from './simbrief.service';

@Component({
  selector: 'app-simbrief',
  templateUrl: './simbrief.component.html',
  styleUrls: ['./simbrief.component.scss']
})
export class SimbriefComponent implements OnInit {

  briefing;
  sidebarVisible = false;

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
  }

  async getPdf() {
    // const response = await this._simbrief.mockresponse();
    // const pdf = response.OFP.files.directory._text + response.OFP.files.pdf.link._text;
    // return await this._simbrief.getUrl(pdf);
  }

}
