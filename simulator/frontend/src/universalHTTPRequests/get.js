import axios from 'axios';

import { BACK_URL } from '../constants/config';

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
    .get(BACK_URL + endpoint)
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
