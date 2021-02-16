import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ImageryImage } from '../imagery/imagery.component';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {

  weatherChartCategories = ['SIGNIFICANT WEATHER', 'WIND AND TEMPERATURE'];
  selectedCategory = -1;

  timeScales = ['+6', '+12']
  selectedTimeScale = -1;

  weatherCharts: ImageryImage[] = [
    new ImageryImage('https://www.aviationweather.gov/data/iffdp/2101.gif', 'US (A)'),
    new ImageryImage('https://www.aviationweather.gov/data/iffdp/2103.gif', 'EUR-SAM (B)'),
    new ImageryImage('https://www.aviationweather.gov/data/iffdp/2104.gif', 'EUR-AFR (C)'),
    new ImageryImage('https://www.aviationweather.gov/data/iffdp/2105.gif', 'EUR-C ASIA (D)'),
    new ImageryImage('https://www.aviationweather.gov/data/iffdp/2106.gif', 'ASIA-AUS (E)'),
    new ImageryImage('https://www.aviationweather.gov/data/iffdp/2107.gif', 'EUR-ASIA (G)'),
    new ImageryImage('https://www.aviationweather.gov/data/iffdp/2108.gif', 'NAM-EUR (H)'),
    new ImageryImage('https://www.aviationweather.gov/data/iffdp/2109.gif', 'S AFR-AUS (K)'),
    new ImageryImage('https://www.aviationweather.gov/data/iffdp/2128.gif', 'PACIFIC (M)'),
    new ImageryImage('https://www.aviationweather.gov/data/iffdp/2129.gif', 'AMERICAS (A)'),
    new ImageryImage('https://www.aviationweather.gov/data/iffdp/2130.gif', 'AMER-AFR (B1)'),
    new ImageryImage('https://www.aviationweather.gov/data/iffdp/2131.gif', 'PACIFIC (F)'),
    new ImageryImage('https://www.aviationweather.gov/data/iffdp/2132.gif', 'N ATLANTIC (H)'),
    new ImageryImage('https://www.aviationweather.gov/data/iffdp/2133.gif', 'N PACIFIC (I)'),
    new ImageryImage('https://www.aviationweather.gov/data/iffdp/2134.gif', 'S PACIFIC (J)'),
    new ImageryImage('https://www.aviationweather.gov/data/iffdp/2135.gif', 'N ATLANTIC'),
  ]
  selectedWeatherChart = -1;

  selectedWeatherRegion = -1;
  windCharts: WeatherChart[] = [
    new WeatherChart('https://www.aviationweather.gov/data/iffdp/2306.gif', 'AMERICAS (A)', 'FL050'),
    new WeatherChart('https://www.aviationweather.gov/data/iffdp/2305.gif', 'AMERICAS (A)', 'FL100'),
    new WeatherChart('https://www.aviationweather.gov/data/iffdp/2304.gif', 'AMERICAS (A)', 'FL180'),
    new WeatherChart('https://www.aviationweather.gov/data/iffdp/2303.gif', 'AMERICAS (A)', 'FL240'),
    new WeatherChart('https://www.aviationweather.gov/data/iffdp/2302.gif', 'AMERICAS (A)', 'FL300'),
    new WeatherChart('https://www.aviationweather.gov/data/iffdp/2301.gif', 'AMERICAS (A)', 'FL340'),
    new WeatherChart('https://www.aviationweather.gov/data/iffdp/2300.gif', 'AMERICAS (A)', 'FL390'),
  ]

  constructor(
    private _changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  onSelect(): void {
    this._changeDetectorRef.detectChanges();
  }
}

export class WeatherChart extends ImageryImage {
  flightLevel: string;

  constructor(url: string, name: string, flightLevel: string) {
    super(url, name);
    this.flightLevel = flightLevel;
  }
}
