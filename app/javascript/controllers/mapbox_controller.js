import { Controller } from "@hotwired/stimulus"
import mapboxgl from "mapbox-gl"
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder"

export default class extends Controller {
  static values = {
    apiKey: String,
    markers: Array
  }

  static target = ["latitude", "longitude"]

  connect() {
    mapboxgl.accessToken = this.apiKeyValue
    this.map = new mapboxgl.Map({
      container: this.element,
      style: "mapbox://styles/ayanorii/cl05huof2003o15nuivl7b2y7"
    })

    this.#addMarkersToMap()
    this.#fitMapToMarkers()
    var geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl
    })
    this.map.addControl(
      geocoder
    )

    const latitude = document.querySelector(".latitude")
    const longitude = document.querySelector(".longitude")
    console.log(latitude)
  geocoder.on('result', e => {
      latitude.value = e.result.center[0]
      longitude.value = e.result.center[1]
      console.log(e.result.center);
  });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    });
    this.addMapInputToForm()
  }

  addMapInputToForm(){
    const input = document.querySelector(".mapboxgl-ctrl-geocoder--input")
    input.addEventListener("keyup", (event) => {
      document.getElementById("incident_location").value = input.value
    })
    input.addEventListener("change", (event) => {
      document.getElementById("incident_location").value = input.value
    })
  }

/* --------------------------------- Private -------------------------------- */
  #addMarkersToMap() {
    this.markersValue.forEach((marker) => {
      const popup = new mapboxgl.Popup(
        {
          closeOnClick: false,
          closeButton: false
        }).setHTML(
          `<a href="${window.location.href}/${marker.id}" class="mapbox-icon"></a>`
        )

      new mapboxgl.Marker()
        .setLngLat([marker.lng, marker.lat])
        .addTo(this.map)
        .setPopup(popup)
        .togglePopup();
    });
  }

  #fitMapToMarkers() {
    const bounds = new mapboxgl.LngLatBounds()
    this.markersValue.forEach(marker => bounds.extend([ marker.lng, marker.lat ]))
    this.map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 })
  }
}
