import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PropertiesService } from '../Services/properties.service';
import { Properties } from '../Interfaces/properties';
import axios from 'axios';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit, AfterViewInit {
  props: Properties[];
  propertiesContainer;
  dropArea;
  sourceId;
  watchList: Properties[] = [];

  constructor(private propertiesService: PropertiesService) {
    this.props = this.propertiesService.fetchPropertiesFromLocalStorage();
    if (localStorage.getItem('RafiaHomesWatchList') !== null) {
      this.watchList = JSON.parse(localStorage.getItem('RafiaHomesWatchList'));
    }
  }

  city = new FormControl('');
  state = new FormControl('');

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.propertiesContainer = document.getElementById('propertiesContainer');
    this.dropArea = document.getElementById('dropArea');

    this.propertiesContainer.ondragstart = this.dragStartHandler;
    this.propertiesContainer.ondragend = this.dragEndHandler;

    this.dropArea.ondragenter = this.dragEnterHandler;
    this.dropArea.ondragover = this.dragOverHandler;
    this.dropArea.ondrop = (e) => {
      const propertyId = e.dataTransfer.getData('text') || this.sourceId;
      if (propertyId !== undefined) {
        const house = this.props.find((item) => {
          return item.property_id === propertyId;
        });
        this.watchList.push(house);
        localStorage.setItem(
          'RafiaHomesWatchList',
          JSON.stringify(this.watchList)
        );
        this.dropArea.innerHTML += `
<div class="row alert alert-dark">
  <div class="col-4">
    <img src="${house.thumbnail}" style="width: 100px!important;">
  </div>
  <div class="col-8">
    <div><em>${house.street_address}</em></div>
<a href="/property/${propertyId}" class="badge text-dark"><i class="bi-info-circle"></i> Learn More</a>
  </div>
</div>
`;
        e.preventDefault();
      }
    };
  }

  async getProperties(): Promise<void> {
    if (this.city.value !== '' && this.state.value !== '') {
      this.props = await this.propertiesService.fetchPropertiesFromAPI(
        this.city.value,
        this.state.value
      );
      localStorage.setItem('RafiaHomes', JSON.stringify(this.props));
    }
  }

  async getMyLocation(): Promise<void> {
    if (!navigator.geolocation) {
      console.log('GeoLocation is not supported in your browser');
    } else {
      await navigator.geolocation.getCurrentPosition((position) => {
        axios
          .get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${environment.gmapApiKey}`
          )
          .then((response) => {
            (document.getElementById('city') as HTMLInputElement).value =
              response.data.results[0].address_components[2].long_name;
            this.city.setValue(
              response.data.results[0].address_components[2].long_name
            );
            (document.getElementById('state') as HTMLInputElement).value =
              response.data.results[0].address_components[4].short_name;
            this.state.setValue(
              response.data.results[0].address_components[4].short_name
            );
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }
  }

  dragStartHandler(e): void {
    e.dataTransfer.setData('text', e.target.id);
    this.sourceId = e.target.id;
  }

  dragEndHandler(e): void {}

  dragEnterHandler(e): void {
    e.preventDefault();
  }

  dragOverHandler(e): void {
    e.preventDefault();
  }

  public removeFromWatchList(id): void {
    const indexNum = this.watchList.findIndex((item) => {
      return item.property_id === id;
    });
    this.watchList.splice(indexNum, 1);
    localStorage.setItem('RafiaHomesWatchList', JSON.stringify(this.watchList));
  }
}
