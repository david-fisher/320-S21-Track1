import axios from 'axios';

import { BACK_URL_SIMULATOR } from '../Constants/Config';

// Universal fetch request using axios
export default function universalFetch(
  setResponse,
  endpoint,
  onError,
  onSuccess,
) {
  setResponse({
    data: null,
    loading: true,
    error: null,
  });
  axios
    .get(BACK_URL_SIMULATOR + endpoint, { withCredentials: true })
    .then((resp) => {
      setResponse({
        data: resp.data,
        loading: false,
        error: null,
      });
      onSuccess && onSuccess(resp);
    })
    .catch((err) => {
      setResponse({
        data: null,
        loading: false,
        error: err,
      });
      onError && onError(err);
    });
}
