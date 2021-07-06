import axios from 'axios';

import { BACK_URL_EDITOR } from '../constants/config';

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

  let config = {
    headers: {
      // 'api-user': APIUSER,
      // 'api-token': APIKEY
    }
  }

  axios
    .get(BACK_URL_EDITOR + endpoint, config, { withCredentials: true })
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
