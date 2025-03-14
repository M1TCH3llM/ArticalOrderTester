// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1


// Improts chromium browser objective from playwright library.
// playwrite is a library that allows you to automate browsers.
// chromium refurs to chrome/ broweser engine
const { chromium } = require('playwright');

// This function takes a timestamp string and returns a timestamp in milliseconds.
function convertTimestamp(timestampString) {
  // split the timestampString by space and get the first element
  // this will give us the date part of the timestamp
    const isoString = timestampString.split(' ')[0];
    // create a new date object with the isoString
    const date = new Date(isoString);
    // check if the date is valid
    if (isNaN(date.getTime())) {
      // if the date is invalid return NaN (not a number)
        return NaN;
    }
    // return the time in milliseconds
    return date.getTime();
}
// This function scrapes articles from the Hacker News front page.
async function scrapeArticles(page, articles, pageCount, outOfOrder) {
  // log the page number that is being scraped
    console.log(`Scraping page ${pageCount + 1}...`);

    // wait for the page to load 
    //.athing is the class of the article element
    const newArticles = await page.$$eval('.athing', rows =>
      // map through the rows and get the title and timestamp of each article
        rows.map(row => {
          // get the title of the article
            const title = row.querySelector('.titleline a')?.innerText;
            // get the timestamp of the article
            const timeElement = row.nextElementSibling?.querySelector('.age');
            // get the title and timestamp of the article
            const timestamp = timeElement ? timeElement.getAttribute('title') : null;
            // return the title and timestamp of the article
            return { title, timestamp };
            // filter out articles that do not have a timestamp
        }).filter(article => article.timestamp)
    );
    // push the new articles to the articles array
    articles.push(...newArticles);
    // log the number of articles found on the page
    console.log(`Found ${newArticles.length} articles on page ${pageCount}. Total articles: ${articles.length}`);
      // Indicate to stop if 100 articles reached
    if (articles.length >= 100) return true; 
    // block handles potential errors when clicking the "More" button.
    try {
      // finds more button element
        const moreButton = await page.$('a.morelink');
        // checks if the more button was found
        if (moreButton) {
          //  clicks the more button
            const nextUrl = await moreButton.getAttribute('href');
            // checks if the nextUrl is not null
            if (nextUrl) {
                await page.goto(`https://news.ycombinator.com/${nextUrl}`);
                await page.waitForLoadState('networkidle');
                await page.waitForSelector('.athing');
            }
        } else {
           // Indicate to stop if no more button
            console.error("No 'More' button found.");
            return true;
        }
    } catch (error) {
      // Indicate to stop on error
        console.error("Error clicking 'More' button:", error);
        return true; 
    }
    // Indicate to continue
    return false; 
}
// This function checks if the articles are in order from newest to oldest.
function checkArticlesOrder(articles, testedArticles, lastTestedTimestamp, outOfOrder) {
  // loop through the articles
    for (const article of articles) {
      // convert the timestamp to Unix timestamp using the convertTimestamp function
        const currentTimestamp = convertTimestamp(article.timestamp);

        // check if the current timestamp is greater than the last tested timestamp
        if (lastTestedTimestamp !== null && currentTimestamp > lastTestedTimestamp) {
          // =if out of ourder outOfOrder flag is set to true
            outOfOrder = true;
            // log the out of order articles 
            console.log("❌ Articles are NOT in order.");
           // log the out of order articles
            console.log("Out-of-order articles:");
            const prevDate = new Date(lastTestedTimestamp).toISOString();
            const currDate = new Date(currentTimestamp).toISOString();
            console.log(`  Previous: ${articles[articles.length - articles.length + testedArticles - 1].title} (${prevDate})`);
            console.log(`  Current: ${article.title} (${currDate})`);
            // break the loop and ends test
            break;
        }
        // set the last tested timestamp to the current timestamp
        lastTestedTimestamp = currentTimestamp;
        // increment the tested articles count
        testedArticles++;
    }
    // return the tested articles, last tested timestamp, and out of order flag
    return { testedArticles, lastTestedTimestamp, outOfOrder };
}
// Main function that runs the script
async function ArticalsInOrder() {
    try {
      // launch the browser
        const browser = await chromium.launch();
        // create a new page
        const page = await browser.newPage();
        // navigate to the hacker news website
        await page.goto('https://news.ycombinator.com/newest');

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
            lastTestedTimestamp = convertTimestamp(articlesToTest[0].timestamp);
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