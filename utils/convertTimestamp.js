

function convertTimeStamp(timestampString) {
    // split the timestampString by space and get the first element
    // this will give us the date part of the timestamp
      const isoString = timestampString.split(' ')[0];
      // create a new date object with the isoString
      const date = new Date(isoString);
      // check if the date is valid
      if (isNaN(date.getTime())) {
        // if the date is invalid return NaN (not a number)
      }
      // return the time in milliseconds
      return date.getTime();
  }
  export { convertTimeStamp };