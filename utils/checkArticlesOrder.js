import { convertTimeStamp } from "./convertTimestamp.js";

// This function scrapes articles from the Hacker News front page.
// This function checks if the articles are in order from newest to oldest.
export function checkArticlesOrder(articles, testedArticles, lastTestedTimestamp, outOfOrder) {
    // loop through the articles
      for (const article of articles) {
        // convert the timestamp to Unix timestamp using the convertTimestamp function
          const currentTimestamp = convertTimeStamp(article.timestamp);
  
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