import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Properties } from '../Interfaces/properties';

import axios from 'axios';
import { PropertyDetails } from '../Interfaces/propertyDetails';

@Injectable({
  providedIn: 'root',
})
export class PropertiesService {
  public async fetchPropertiesFromAPI(
    city: string,
    state: string
  ): Promise<Properties[]> {
    const props: Properties[] = [];
    await axios
      .get(`${environment.rapidApiBaseURL}/list-for-sale`, {
        params: {
          city: `${city}`,
          limit: '12',
          offset: '0',
          state_code: `${state}`,
          sort: 'relevance',
        },
        headers: {
          'x-rapidapi-key': environment.rapidApiKey,
          'x-rapidapi-host': environment.rapidApiHost,
        },
      })
      .then((response) => {
        response.data.properties.map((property) => {
          props.push({
            property_id: property.property_id,
            type: property.prop_type,
            street_address: property.address.line,
            city: property.address.city,
            state: property.address.state,
            zip: property.address.postal_code,
            lat: property.address.lat,
            lng: property.address.lon,
            status: property.prop_status,
            price: property.price,
            thumbnail: property.thumbnail,
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });

    return props;
  }

  public async fetchPropertyDetailsFromApi(
    id: string
  ): Promise<PropertyDetails[]> {
    const props: PropertyDetails[] = [];
    await axios
      .get(`${environment.rapidApiBaseURL}/detail`, {
        params: { property_id: id },
        headers: {
          'x-rapidapi-key': environment.rapidApiKey,
          'x-rapidapi-host': environment.rapidApiHost,
        },
      })
      .then((response) => {
        response.data.properties.map((property) => {
          props.push({
            property_id: property.property_id,
            street_address: property.address.line,
            city: property.address.city,
            state: property.address.state,
            zip: property.address.postal_code,
            lat: property.address.lat,
            lng: property.address.lon,
            description: property.description,
            price: property.price,
            photos: property.photos,
            year_built: property.year_built,
            bedrooms: property.beds,
            baths: property.baths,
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
    return props;
  }

  public fetchPropertiesFromLocalStorage(): Properties[] {
    if (localStorage.getItem('RafiaHomes') !== null) {
      return JSON.parse(localStorage.getItem('RafiaHomes'));
    }
    return null;
  }

  public fetchPropertyDetailsFromLocalStorage(id: string): PropertyDetails[] {
    if (localStorage.getItem(id) !== null) {
      return JSON.parse(localStorage.getItem(id));
    }
    return null;
  }
}
