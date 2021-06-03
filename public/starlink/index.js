/*
 * Author: Ian Fowler
 * CS 101 Spring 2021
 * Date: May 13th, 2021
 * CP 3: Starlink
 * JS for populating the page.
 */

/**
 * NOTE TO TA:
 *
 * Please run this with a HTTP server
 *
 * You probably know this, but one way is with http-server. From the docs:
 * To install with npm: npm install --global http-server
 * To install with homebrew: brew install http-server
 * Then go to directory including index.html and run "http-server"
 * https://github.com/http-party/http-server
 *
 * Also, please see modules defined in the ./modules folder.
 */

import { getSatellites, scrapeSatellites } from "./modules/spacex.js";
import { id } from "./modules/dochelper.js";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiYmVhcmFjdWRhMTMiLCJhIjoiY2o0NXUxOGkyMjA5eDJyb2I2cm94aXlpayJ9.tIAW1fzlxzJVB4agfwuJcA";

/**
 * Initialize a mapbox map using the custom style.
 * @returns the initialized map
 */
function initMap() {
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
  let map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/bearacuda13/ckon934wt0vxa17nib4xmcshp",
    center: [30, 30],
    zoom: 1,
  });
  return map;
}

/**
 * Convert the all caps satellite name to a title case name.
 * Example: "STARLINK-138" maps to "Starlink 138"
 * @param {string} name the name of the satellite from the API.
 * @returns the name of the satelltite formated like "Starlink 1329"
 */
function formatSatelliteName(name) {
  const titleCase =
    name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase();
  return titleCase.replace("-", " ");
}

/**
 * Populates a map pin for a satellite.
 * @param {object} sat object providing latitude, longitude and name of sattelite
 * @param {object} map Mapbox map on which to draw the pin.
 */
function addSatellite(sat, map) {
  const name = formatSatelliteName(sat.name);
  new mapboxgl.Marker({
    color: "#FFFFFF",
  })
    .setLngLat([sat.longitude, sat.latitude])
    .setPopup(new mapboxgl.Popup().setHTML(`<p id="pin-label">${name}</p>`))
    .addTo(map);
}

/**
 * Grab satellites, initialize map, and the satellites to the map, and display the
 * number of satellites found.
 */
async function init() {
  let map = initMap();
  const resp = await getSatellites();
  const satellites = scrapeSatellites(resp);
  const description = `Found ${satellites.length} Starlink sattelites.`;
  id("count-heading").textContent = description;
  satellites.forEach((sat) => addSatellite(sat, map));
}

window.addEventListener("load", () => {
  init();
});
