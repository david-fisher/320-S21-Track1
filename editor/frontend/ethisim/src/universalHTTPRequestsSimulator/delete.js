import axios from 'axios';
import { BACK_URL_SIMULATOR } from '../Constants/Config';
// Universal delete request using axios
export default function universalDelete(
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
  axios
    .delete(BACK_URL_SIMULATOR + endpoint, requestBody, { withCredentials: true })
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
