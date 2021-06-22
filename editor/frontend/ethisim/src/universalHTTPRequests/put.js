import axios from 'axios';
import { BACK_URL_EDITOR } from '../Constants/Config';
// Universal put request using axios
export default function universalPut(
  setResponse,
  endpoint,
  onError,
  onSuccess,
  requestBody,
) {
  setResponse({
    data: null,
    loading: true,
    error: null,
  });

  let config = {
    headers: {
      'api-username': process.env.API_USERNAME,
      'api-token': process.env.API_PASSWORD
    }
  }

  axios
    .put(BACK_URL_EDITOR + endpoint, requestBody, config, { withCredentials: true })
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
