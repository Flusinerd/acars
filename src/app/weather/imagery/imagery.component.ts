import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-imagery',
  templateUrl: './imagery.component.html',
  styleUrls: ['./imagery.component.scss']
})
export class ImageryComponent implements OnInit {

  urls: ImageryImage[] =  [
    new ImageryImage('https://www.aviationweather.gov/data/obs/sat/intl/sat_irbw_a.jpg', 'AREA A (AMERICAS)'),
    new ImageryImage('https://www.aviationweather.gov/data/obs/sat/intl/sat_irbw_b1.jpg', 'AREA B1 (ATLANTIC)'),
    new ImageryImage('https://www.aviationweather.gov/data/obs/sat/intl/sat_irbw_c.jpg', 'AREA C (EUR/AFR)'),
    new ImageryImage('https://www.aviationweather.gov/data/obs/sat/intl/sat_irbw_d.jpg', 'AREA D (AFR/ASI)'),
    new ImageryImage('https://www.aviationweather.gov/data/obs/sat/intl/sat_irbw_e.jpg', 'AREA E (INDIAN OCEAN)'),
    new ImageryImage('https://www.aviationweather.gov/data/obs/sat/intl/sat_irbw_f.jpg', 'AREA F (AUS/JPN)'),
    new ImageryImage('https://www.aviationweather.gov/data/obs/sat/intl/sat_irbw_g.jpg', 'AREA G (NORTH POLE/ASI)'),
    new ImageryImage('https://www.aviationweather.gov/data/obs/sat/intl/sat_irbw_h.jpg', 'AREA H (NORTH POLE/AMR)'),
    new ImageryImage('https://www.aviationweather.gov/data/obs/sat/intl/sat_irbw_i.jpg', 'AREA I (NORTH PACIFIC)'),
    new ImageryImage('https://www.aviationweather.gov/data/obs/sat/intl/sat_irbw_j.jpg', 'AREA J (SOUTH POLE/SAM)'),
    new ImageryImage('https://www.aviationweather.gov/data/obs/sat/intl/sat_irbw_k.jpg', 'AREA K (SOUTH POLE/AUS)'),
    new ImageryImage('https://www.goes.noaa.gov/FULLDISK/GIIR.JPG', 'INDIAN OCEAN'),
    new ImageryImage('https://www.ssd.noaa.gov/eumet/neatl/vis-l.jpg', 'NORTH EAST ATLANTIC VISIBLE'),
    new ImageryImage('https://www.ssd.noaa.gov/eumet/eatl/vis-l.jpg', 'EAST ATLANTIC VISIBLE'),
    new ImageryImage('https://api.sat24.com/mostrecent/EU/infraPolair', 'EUROPE INFRARED'),
    new ImageryImage('https://api.sat24.com/mostrecent/AF/infraPolair', 'AFRICA INFRARED')
  ]

  selectedImageIndex = -1;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  onSelect(): void {
    this._changeDetectorRef.detectChanges();
    console.log(this.selectedImageIndex);
  }

}


export class ImageryImage {
  url: string;
  name: string;

  constructor(url: string, name: string) {
    this.url = url;
    this.name = name;
  }
}