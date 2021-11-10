const Apify = require('apify');

const { utils: { log } } = Apify;

exports.prependUrl = (url) => {
    return 'https://www.bing.com' + `${url}`;
}