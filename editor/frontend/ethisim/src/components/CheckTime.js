/*
  * This section is about managing time to prevent sending a combination of multiple
  *    HTTP GET calls (clicking multiple buttons of the sidebar) before a response is returned
  * Set currentTime state and pass the variables in the checkTime function
  * const [currentTime, setCurrentTime] = useState(getCurrentTimeInt());
  */

// gets the current time in hms and converts it to an int
export function getCurrentTimeInt() {
  const d = Date();
  const h = d.substring(16, 18);
  const m = d.substring(19, 21);
  const s = d.substring(22, 24);
  return 60 * (60 * h + m) + s;
}

// checks if at least 1 second has elapsed since last action
// if someone waits a multiple of exactly 24 hours since their last action they will
//    not be able to take an action for an additional second
export function checkTime(currentTime, setCurrentTime) {
  let ret = false;
  // current time difference is at least 1 second, but that SHOULD be ample time for
  // the database to get back to the frontend
  if (getCurrentTimeInt() - currentTime !== 0) {
    ret = true;
  }
  setCurrentTime(getCurrentTimeInt());
  return ret;
}
