import { Loader } from '@googlemaps/js-api-loader';
import { environment } from '../../environments/environment';

export class GMAP {
  loader: Loader;

  constructor() {
    this.loader = new Loader({
      apiKey: environment.gmapApiKey,
    });
  }

  showMap(lat, lng): void {
    this.loader.load().then(() => {
      const latLng = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));

      const map = new google.maps.Map(document.getElementById('map'), {
        center: latLng,
        zoom: 13,
      });

      const marker = new google.maps.Marker({
        position: latLng,
      });

      marker.setMap(map);
    });
  }
}
