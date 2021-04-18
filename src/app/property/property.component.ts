import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertiesService } from '../Services/properties.service';
import { PropertyDetails } from '../Interfaces/propertyDetails';
import { GMAP } from '../utils/GMAP';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css'],
})
export class PropertyComponent implements OnInit {
  @ViewChild('mapRef', { static: true }) mapElement: ElementRef;

  propertyDetail: PropertyDetails[];

  constructor(
    private route: ActivatedRoute,
    private propertiesService: PropertiesService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      if (localStorage.getItem(params.id) === null) {
        this.propertyDetail = await this.propertiesService.fetchPropertyDetailsFromApi(
          params.id
        );
        localStorage.setItem(params.id, JSON.stringify(this.propertyDetail));
      } else {
        this.propertyDetail = this.propertiesService.fetchPropertyDetailsFromLocalStorage(
          params.id
        );
      }
    });
  }

  showOnMap(lat, lng): void {
    new GMAP().showMap(lat, lng);
    document.getElementById('showMap').setAttribute('disabled', 'disabled');
  }
}
