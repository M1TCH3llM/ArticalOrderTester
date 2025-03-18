# Hacker News Newest Validation Script

This project uses Playwright to validate that the first 100 articles on the Hacker News "newest" page are sorted from newest to oldest.

## Prerequisites

-   Node.js and npm installed.

## Installation

1.  Clone the repository.
2.  Navigate to the project directory using your terminal or command prompt.
3.  Run `npm install` to install dependencies.

## Usage

1.  Ensure you are in the project directory in your terminal.
2.  Run the script using the following command:

    ```bash
    node index.js
    ```

3.  The script will:
    -   Launch a Chromium browser.
    -   Navigate to [Hacker News/newest](https://news.ycombinator.com/newest).
    -   Extract the titles and times of the first 100 articles.
    -   Perform a rough check to validate that the articles are sorted by time.
    -   Output a success message if the validation passes, or an error message if it fails.
    -   Close the browser.

4.  Observe the output in your terminal. If the validation is successful, you'll see:

    ```
    Successfully validated the first 100 articles are sorted by time (rough check).
    ```

    If there is an error (e.g., fewer than 100 articles found, or the rough time check fails), an error message will be displayed.

## Note

The time validation in this script is a simplified check. A proper time check would require parsing the relative times and comparing them chronologically. This version verifies that the articles appear in a generally decreasing order of age, but does not guarantee strict chronological sorting.