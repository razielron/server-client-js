const axios = require('axios');
const PORT = 8989;
const BASE_URL = `http://localhost:${PORT}/`;

function getTime() {
    let currentDate = new Date();
    let currentHour = currentDate.getHours();
    let currentMinute = currentDate.getMinutes();

    return {currentHour, currentMinute};
}

async function q1(time) {
    let response = await axios.get(BASE_URL + 'test_get_method', { params: { hour: time.currentHour, minute: time.currentMinute }});

    return response.data;
}

async function q2(time, lastResponse) {
    let response = await axios({
        method: 'post',
        baseURL: BASE_URL,
        url: '/test_post_method',
        data: {
          hour: time.currentHour,
          minute: time.currentMinute,
          requestId: lastResponse
        }
    });

    return response.data.message;
}

async function q3(time, lastResponse) {
    let response = await axios({
        method: 'put',
        baseURL: BASE_URL,
        url: '/test_put_method',
        params: {
            id: lastResponse
        },
        data: {
          hour: (time.currentHour + 21) % 24,
          minute: (time.currentMinute + 13) % 60,
        }
    });

    return response.data.message;
}

async function q4(lastResponse) {
    let response = await axios({
        method: 'delete',
        baseURL: BASE_URL,
        url: '/test_delete_method',
        params: {
            id: lastResponse
        }
    });

    return response.data.message;
}

async function StartClientFlow() {
    let time = getTime();
    let q1Response = await q1(time);
    let q2Response = await q2(time, q1Response);
    let q3Response = await q3(time, q2Response);
    await q4(q3Response);
}

(async () => { await StartClientFlow(); })();