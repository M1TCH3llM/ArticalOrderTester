// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
import { convertTimeStamp } from './utils/convertTimestamp.js';
import { scrapeArticles } from './utils/scrapeArticals.js';
import { checkArticlesOrder } from './utils/checkArticlesOrder.js';

// Improts chromium browser objective from playwright library.
// playwrite is a library that allows you to automate browsers.
// chromium refurs to chrome/ broweser engine
import { chromium } from 'playwright';

// Main function that runs the script
async function ArticalsInOrder() {
    try {
      // launch the browser
        const browser = await chromium.launch();
        // create a new page
        const page = await browser.newPage();
        // navigate to the hacker news website
        await page.goto('https://news.ycombinator.com/');

        // initialize variables
        let articles = [];
        // page count
        let pageCount = 0;
        // out of order flag
        let outOfOrder = false;
        // number of articles tested
        let testedArticles = 0;
        // last tested timestamp
        let lastTestedTimestamp = null;

        // loop through the pages and scrape articles
        while (articles.length < 100 && !outOfOrder) {
            // scrape articles calls the scrapeArticles function
            const stop = await scrapeArticles(page, articles, pageCount, outOfOrder);
            // check if stop is true
            if (stop) break;
            // increment the page count
            pageCount++;

            // check the order of the articles 
            // new articals by slicing the articles array, calculated by the difference between the length of the articles array and the number of tested articles
            const newArticles = articles.slice(articles.length - (articles.length - testedArticles));
            // calls the checkArticlesOrder function to check the order of the articles
            const result = checkArticlesOrder(newArticles, testedArticles, lastTestedTimestamp, outOfOrder);
            // update the tested articles, last tested timestamp, and out of order flag
            testedArticles = result.testedArticles;
            //  update the last tested timestamp
            lastTestedTimestamp = result.lastTestedTimestamp;
            // update the out of order flag
            outOfOrder = result.outOfOrder;
            // break the loop if out of order
            if (outOfOrder) break;
        }
        // checks conditions to determan if outOfOrder is false and the number of articles is greater than or equal to 100
        // If both conditions are true, it means the script has collected at least 100 articles, and all of them are in order so far.
        if (!outOfOrder && articles.length >= 100) {
          // creates a new array of articles to test by slicing the first 100 articles
            const articlesToTest = articles.slice(0, 100);
          // and calls the convertTimestamp function to convert the timestamp of the first article to Unix timestamp
            lastTestedTimestamp = convertTimeStamp(articlesToTest[0].timestamp);
          // This line resets the testedArticles counter to 1. We start at one because the first artical has already been used to set the lastTestedTimestamp.
            testedArticles = 1;
            // calls the checkArticlesOrder function to check the order of the articles
            const result = checkArticlesOrder(articlesToTest.slice(1), testedArticles, lastTestedTimestamp, outOfOrder);
            // update the tested articles, last tested timestamp, and out of order flag
            testedArticles = result.testedArticles;
            // update the last tested timestamp
            outOfOrder = result.outOfOrder;
        }
        // log the number of articles tested
        console.log("Number of Articals Tested:" + testedArticles);
        
        // console.log the out of order flag
        if (!outOfOrder) {
            console.log("✅ Articles are in order from newest to oldest.");
        }
        // close the browser
        await browser.close();
        // catch any errors that occur
    } catch (err) {
        console.error("An error occurred:", err);
    }
}
// run the ArticalsInOrder function
ArticalsInOrder();

