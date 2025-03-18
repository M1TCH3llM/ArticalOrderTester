

export async function scrapeArticles(page, articles, pageCount, outOfOrder) {
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
          }
      } catch (error) {
        // Indicate to stop on error
          console.error("Error clicking 'More' button:", error);
      }
      // Indicate to continue
      return false; 
  }

