import axios from 'axios';
import { BACK_URL } from "../constants/config";
// Universal put request using axios
export default function universalPut(
    setResponse,
    endpoint,
    onError,
    onSuccess,
    requestBody
) {
    setResponse({
        data: null,
        loading: true,
        error: null,
    });
    axios
        .put(BACK_URL + endpoint, requestBody)
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
