// content.js

// script for ad blocker

// get all the ads on the page

document.addEventListener('DOMContentLoaded', function() {
    const adSelectors = [
        'iframe[src*="ads"]',
        'iframe[src*="doubleclick"]',
        'iframe[src*="advertising"]',
        'iframe[src*="ad"]',
        'iframe[src*="advertisements"]',
        'iframe[src*="advertisment"]',
        'iframe[src*="advertisements"]',
        'div[id*="ad"]',
        'div[class*="sponsored"]',
        'div[id*="sponsored"]',
        'div[class*="banner"]',
        'div[id*="banner"]'
    ];

    