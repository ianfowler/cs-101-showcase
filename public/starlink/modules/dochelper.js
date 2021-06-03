/*
 * Author: Melissa Hovik, Ian Fowler
 * CS 101 Spring 2021
 *
 * Shorthand functions provided in lecture
 * for manipulating the DOM structure.
 */

/**
 * Returns the element that has the ID attribute with the specified value.
 * @param {string} idName - element ID
 * @returns {object} DOM object associated with id.
 */
export function id(idName) {
  return document.getElementById(idName);
}
/**
 * Returns a new element with the given tag name.
 * @param {string} tagName - HTML tag name for new DOM element.
 * @returns {object} New DOM object for given HTML tag.
 */
export function gen(tagName) {
  return document.createElement(tagName);
}

/**
 * Returns the first element matching the given CSS query
 * @param {string} selector - CSS query to find the element
 * @returns {object} Element matching the CSS selector, if any.
 */
export function qs(selector) {
  return document.querySelector(selector);
}
