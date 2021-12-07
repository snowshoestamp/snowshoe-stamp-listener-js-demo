import StampListener from '@snowshoe/stamp_listener';
import axios from 'axios';
import {Notyf} from 'notyf';

const apiKeyInput = document.getElementById('apiKeyInput');

const axiosConfig = {
    baseURL: 'https://api.snowshoestamp.com',
    headers: {
        post: {'SnowShoe-Api-Key': apiKeyInput.value}
    }
};

const notyf = new Notyf({
    duration: 3000,
    position: {x: 'right', y: 'top'},
});

const stampListener = new StampListener({
    stampScreenElementId: 'stamp-screen',
    preventScrolling: true,
    preventZooming: true,
});

// Specify a function to be called when a stamp event occurs.
stampListener.listen((stampDataPoints, reEnableStampScreen) => {
    axiosConfig.headers.post['SnowShoe-Api-Key'] = apiKeyInput.value;
    axios.post('/v3/stamp', {data: stampDataPoints}, axiosConfig)
        .then(response => {
            notyf.success(`Successfully verified stamp: ${response.data.stamp.serial}`);
        })
        .catch((error) => {
            const httpStatusCode = error.response?.status;
            if (httpStatusCode === 401) {
                notyf.error(`Verification failed... the API key is most likely incorrect.`);
            } else if (httpStatusCode === 400) {
                notyf.error(`The stamp is most likely not registered... ${error.response.data.error.message}`);
            } else {
                notyf.error(`Some unlikely issue (like a network connection failure) has occurred. Is your API endpoint correct? ${error}`);
            }
        })
        .finally(() => {
            reEnableStampScreen();
        });
});

