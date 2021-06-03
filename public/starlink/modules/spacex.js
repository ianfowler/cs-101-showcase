/*
 * Author: Ian Fowler
 * CS 101 Spring 2021
 * Date: May 12th, 2021
 * CP 3: Starlink
 *
 * JS for pulling data from the r/SpaceX api
 * https://github.com/r-spacex/SpaceX-API/tree/master/docs/v4
 */
import { gen, qs } from "./dochelper.js";

const BASE_URL = "https://api.spacexdata.com/v4/";

/**
 * Return true if all values in a particular object are truthy.
 *
 * @param {object} obj
 * @returns {boolean} true if the every value in the object is truthy
 */
function allValuesTruthy(obj) {
  return Object.values(obj).every((x) => x);
}

/**
 * Call the r/SpaceX api. If successful, returns data.
 * Otherwise, the user is notified as an error.
 *
 * @returns {array} all starlink satellite data if successful.
 */
export async function getSatellites() {
  let url = BASE_URL + "starlink";
  try {
    let data = await fetch(url);
    checkStatus(data);
    data = await data.json();
    return data;
  } catch (err) {
    notifyError();
  }
}

/**
 * Extract the necessary information from the response.
 *
 * @returns {array} - array containing objects containing
 * name, latitude, and longitude.
 */
export function scrapeSatellites(satellites) {
  return satellites
    .map((satellite) => {
      return {
        name: satellite.spaceTrack.OBJECT_NAME,
        latitude: satellite.latitude,
        longitude: satellite.longitude,
      };
    })
    .filter((sat) => allValuesTruthy(sat));
}

/**
 * Notify the user of an error with the API.
 */
function notifyError() {
  let message = gen("p");
  message.textContent = "Apologies, Starlink satellites could not be found.";
  qs("header").appendChild(message);
}

/**
 * Checks the status of a fetch Response, returning the Response object back
 * for further processing if successful, otherwise returns an Error that needs
 * to be caught.
 * @param {object} response - response with status to check for success/error.
 * @returns {object} - The Response object if successful, otherwise an Error that
 * needs to be caught.
 */
function checkStatus(response) {
  if (!response.ok) {
    // response.status >= 200 && response.status < 300
    throw Error("Error in request: " + response.statusText);
  } // else, we got a response back with a good status code (e.g. 200)
  return response; // A Response object.
}
