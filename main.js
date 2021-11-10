/**
 * This template is a production ready boilerplate for developing with `CheerioCrawler`.
 * Use this to bootstrap your projects using the most up-to-date code.
 * If you're looking for examples or want to learn more, see README.
 */

const Apify = require('apify');
const { handleStart } = require('./src/routes');
const { BING_DEFAULT_RESULTS_PER_PAGE } = require("./src/const");

const { utils: { log } } = Apify;

Apify.main(async () => {
    const input = await Apify.getInput();
    const {
        queries,
        resultsPerPage,
        maxPagesPerQuery,
        marketCode,
        languageCode,
        maxConcurrency,
    } = input;
    
    const urls = getUrls(queries, marketCode, languageCode, resultsPerPage, maxPagesPerQuery);
    const requestList = await Apify.openRequestList('START', urls);
    const requestQueue = await Apify.openRequestQueue();
    const proxyCountryCode = {countryCode: 'US'}
    const proxyConfiguration = await Apify.createProxyConfiguration();

    const crawler = new Apify.CheerioCrawler({
        requestList,
        requestQueue,
        proxyConfiguration,
        maxConcurrency: maxConcurrency,
        handlePageFunction: async (context) => {
            const { url, userData: { label } } = context.request;
            log.info('Page opened.', { label, url });
            return handleStart(context);
        },
    });

    log.info('Starting the crawl.');
    await crawler.run();
    log.info('Crawl finished.');
});

function getUrls(queries, marketCode, languageCode, resultsPerPage, maxPagesPerQuery){
    const splittedQueries = queries.split('\n');
    const result = [];
    let parameters = '';

    if(marketCode)
        parameters += '&setmkt=' + marketCode;
    if(languageCode)
        parameters += '&setLang=' + languageCode;
    if(resultsPerPage)
        parameters += '&count=' + resultsPerPage;

    // https://www.bing.com/search?q=student&setmkt=en-US&setLang=en"
    for(let i = 0; i < splittedQueries.length; i++){
        if(splittedQueries[i].startsWith('https://www.bing.com/search?q=')){
            const url = splittedQueries[i] + parameters;

            if(maxPagesPerQuery > 1)
                getPagesPerQuery(url, resultsPerPage, maxPagesPerQuery).forEach(x => result.push(x));
            else
                result.push(url);
        }
        else
        {
            const url = 'https://www.bing.com/search?q=' + splittedQueries[i].replaceAll(' ', '%20') + parameters;
            if(maxPagesPerQuery > 1){
                getPagesPerQuery(url, resultsPerPage, maxPagesPerQuery).forEach(x => result.push(x));
            }
            else
                result.push(url);
        }
    }

    return result;
}

function getPagesPerQuery(url, resultsPerPage, maxPagesPerQuery){
    if(!resultsPerPage)
        resultsPerPage = BING_DEFAULT_RESULTS_PER_PAGE;
    
    const result = [url];
    for(let i = 1; i < maxPagesPerQuery; i++){
        result.push(url + '&first=' + resultsPerPage * i)
    }
 
    return result;
}
