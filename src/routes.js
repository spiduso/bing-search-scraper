const Apify = require('apify');

const { utils: { log } } = Apify;

const { BING_WIKI_RICHCARD } = require('./const');

exports.handleStart = async ({ request, $ }, csvFriendliness) => {
    log.info(`[START]: Opened page: ${request.url}`);
    const urlResults = { url: request.url };
    // keyword
    if ($('.b_searchbox').length > 0) {
        log.info(`[START]: keyword - ${$('.b_searchbox').attr('value')}`);
        urlResults.keyword = $('.b_searchbox').attr('value');
    }

    // results count
    const countEl = $('#b_tween > .sb_count');
    if (countEl.length > 0) {
        const splitted = countEl.text().replaceAll(',', '').replaceAll('.', '').split(' ');
        log.info(`[START]: Results found: ${splitted[0]}`);
        urlResults.count = splitted[0];
    } else if ($('#b_results .b_no').length > 0) { // no results, try 2 more times
        if (request.retryCount < 3) {
            throw new Error('No results found, retrying...');
        } else {
            urlResults.count = 0;
            log.info('[START]: Tried 3 times but no result found.');
            await Apify.pushData(urlResults);
            return;
        }
    }

    // Page number
    const pageNumEl = $('.sb_pagS.sb_pagS_bp');
    if (pageNumEl.length > 0) {
        log.info(`[START]: Page number - ${pageNumEl.text()}`);
        urlResults.pageNumber = pageNumEl.text();
    }

    // Include results
    if ($('#sp_requery').length > 0) {
        log.info(`[START]: Subquery - ${$('#sp_requery a').first().text()}`);
        urlResults.subquery = $('#sp_requery a').first().text();
    }

    /*
    // TODO: Ads not tested yet
    const ads = [];
    $('#b_results .b_ad').each((_, el) => {
        const ad = {};
        log.info(`[START]: AD - ${$(el).find('a').first().text()}`);
        ad.title = $(el).find('a').first().text();
        ad.url = $(el).find('a').attr('href');
        ad.description = $(el).find('.b_caption p').text();
        ads.push(ad);
    });
    urlResults.ads = ads;
    */

    // topborder result
    if (!csvFriendliness) {
        const topBorders = [];
        $('#b_results > .b_topborder').each((_, el) => {
            const topborder = { type: 'topborder' };
            topborder.title = $(el).find('.rwrl_cred a').text();
            if (topborder.title) {
                log.info(`[START]: Topborder - ${$(el).find('a').text()}`);
                topborder.description = $(el).find('.rwrl_padref').text();
                topborder.url = $(el).find('.rwrl_cred a').attr('href');
                topBorders.push(topborder);
            }
        });
        urlResults.topBorders = topBorders;

        // news results
        const newsArr = [];
        $('#b_results > .b_nwsAns').each((_, newsEl) => {
            log.info('[START]: News');
            $(newsEl).find('#ans_nws .b_slidesContainer .slide').each((_0, el) => {
                const news = { type: 'news' };
                const text = $(el).find('.b_promtxt').text();
                if (text.length > 0) {
                    news.text = text;
                    news.source = $(el).find('.na_footer_name').text();
                    news.time = $(el).find('.b_secondaryText').text().substr(3);
                    news.url = $(el).find('.b_cap > a').attr('href');
                    newsArr.push(news);
                }
            });
        });
        urlResults.news = newsArr;

        // image results
        const images = [];
        $('#b_results > .b_imgans').each((_, imgEl) => {
            $(imgEl).find('.slide').each((_0, el) => {
                const img = {};
                let url = $(el).find('.imgText').attr('href');
                if (url) {
                    url = new URL(url, `https://www.bing.com`);
                    img.url = url;
                    img.description = $(el).find('.imgText').text();
                    log.info(`[START]: Image - ${$(el).find('.imgText').text()}`);
                    images.push(img);
                }
            });
        });
        urlResults.images = images;

        // video results
        const videos = [];
        $('#b_results > .b_vidAns').each((_, vidEl) => {
            $(vidEl).find('.slide').each((_0, el) => {
                let url = $(el).find('a').attr('href');
                if (url[0] === '/') {
                    url = new URL(url, `https://www.bing.com`);
                }
                const video = { url };
                const title = $(el).find('.mc_vtvc_title').text();
                if (title !== '') {
                    video.channel = $(el).find('.mc_vtvc_meta .mc_vtvc_meta_row_channel').text();
                    video.date = $(el).find('.mc_vtvc_meta .meta_pd_content').text();
                    video.title = title;
                    log.info(`[START]: Video - ${$(el).find('.mc_vtvc_title').text()}`);
                    video.views = $(el).find('.meta_vc_content').text();
                    video.provider = $(el).find('.mc_vtvc_meta_channel > span').first().text();
                    videos.push(video);
                }
            });
        });
        urlResults.videos = videos;
    }
    // generic results
    const pages = [];

    $('#b_results > .b_algo').each((_, algoEl) => {
        const algo = {};
        const title = $(algoEl).find('h2 a').text();
        algo.title = title;
        algo.link = $(algoEl).find('h2 a').attr('href');

        let desc = '';
        let date = '';
        if ($(algoEl).find('.b_caption p').length > 0) {
            log.info(`[START]: Page - ${title}`);
            desc = $(algoEl).find('.b_caption p').text();
            if ($(algoEl).find('.news_dt').length > 0) {
                date = $(algoEl).find('.news_dt').text();
                desc = desc.replace(date, '').substr(3);
                algo.date = date;
            }
        } else if ($(algoEl).find('.b_richcard') > 0) { // rich card
            desc = $(algoEl).find('.b_richcard').text();
            log.info(`[START] - Richcard - ${desc}`);
        } else if (!csvFriendliness && $(algoEl).find('.b_wikiRichcard_noHeroSection').length > 0) { // wiki rich card
            desc = $(algoEl).find('.tab-content').text();
            log.info(`[START]: Wiki richcard - ${desc}`);
            let textUnder = $(algoEl).find('.b_divdef > span').text();
            let source = $(algoEl).find('.b_divdef').text();
            source = source.replace(textUnder, '');
            textUnder = textUnder.substr(3);
            algo.type = BING_WIKI_RICHCARD;
            algo.source = source;
            algo.textUnder = textUnder;
        } else if (!csvFriendliness && $(algoEl).find('.b_algo_group').length > 0) { // result with groups
            log.info(`[START]: AlgoGroup - ${$(algoEl).find('h2').first().text()}`);
            algo.type = 'algoGroup';
            // #region dictionary
            /* TODO: To be finished
            if($(this).find('.rcDictionary').length > 0){
                dictionary = {};
                dictionary['word'] = $(this).find('.rcDicWord').text();
                dictionary['spelling'] = $(this).find('.rcDicSpell').text();
                dictionary['wordType'] = $(this).find('.rcDicPos').first().text();
                let meaning = [];
                $(this).find('.rcDicMean').each(function(){
                    meaning.push($(this).text());
                })
                dictionary['meaning'] = meaning;
                urlResults['dictionary'] = dictionary;
            }
            */
            // #endregion

            // wiki group
            if ($(algoEl).find('.b_wiki_sub').length > 0) {
                const wikiCards = [];
                let wikiCard = {};
                $(algoEl).find('.b_wiki_sub_text').each((_0, el) => {
                    wikiCard = { type: 'text' };
                    const wikiTitle = $(el).find('.b_wiki_sub_title').text();
                    if (wikiTitle) {
                        wikiCard.title = wikiTitle;
                    }
                    wikiCard.description = $(el).find('.b_paractl').text();
                    wikiCard.seeMoreLink = $(el).find('.b_wiki_see_more').attr('href');
                    wikiCards.push(wikiCard);
                });
                $(algoEl).find('.b_wiki_img_wrapper').each((_0, el) => {
                    wikiCard = { type: 'image' };
                    const imageUrl = $(el).find('a').attr('href');
                    wikiCard.imageUrl = imageUrl;
                    wikiCards.push(wikiCard);
                });
                algo.wikiCards = wikiCards;
            }
        } else if (!csvFriendliness && $(algoEl).find('#b_gridCarousel').length > 0) { // TODO: To be tested
            $(algoEl).find('#b_gridCarousel').children('.slide').each((_0, el) => {
                log.info(`[START]: Carousel - ${$(el).text()}`);
            });
        } else if (!csvFriendliness && $(algoEl).find('.b_dList').length > 0) { // List
            const list = [];
            let text = '';
            $(algoEl).find('.lisn_olitem').each((_0, el) => {
                text = $(el).find('span').text();
                if (text) {
                    log.info(`[START]: List - ${text}`);
                    list.push(text);
                }
            });
            algo.list = list;
        }
        // results recommended
        const recommendations = [];
        let recommended = {};
        if (!csvFriendliness && $(algoEl).find('.pageRecoContainer').length > 0) {
            $(algoEl).find('.pageRecoContainer table tr').each((_0, el) => {
                recommended = {};
                recommended.description = $(el).find('a').first().text();
                log.info(`[START]: Page recommendation - ${recommended.description}`);
                recommended.url = $(el).find('a').attr('href');
                recommendations.push(recommended);
            });
            algo.recommendations = recommendations;
        }
        algo.desc = desc;

        pages.push(algo);
    });

    if (csvFriendliness) {
        for (const page of pages) {
            for (const key of Object.keys(urlResults)) {
                page[key] = urlResults[key];
            }
            Apify.pushData(page);
        }
        return;
    }
    urlResults.pages = pages;
    // results created by bing
    $('#b_results > .b_ans').each((_, relatedEl) => {
        // related search
        if ($(relatedEl).find('.b_rs').length > 0) {
            const related = [];
            let item = {};
            $(relatedEl).find('li').each((_0, el) => {
                item = {};
                const text = $(el).text();
                item.text = text;
                log.info(`[START]: Related - ${text}`);
                item.url = new URL($(el).find('a').attr('href'), `https://www.bing.com`);
                related.push(item);
            });
            urlResults.related = related;
        } else if ($(relatedEl).find('#relatedQnAListDisplay').length > 0) { // People also ask
            const questions = [];
            let question = {};
            $('[data-tag=RelatedQnA.Item]').each((_0, el) => {
                question = {};
                question.question = $(el).find('.b_1linetrunc').attr('aria-label');
                question.url = $(el).find('.rwrl_cred a').attr('href');
                question.title = $(el).find('.rwrl_cred a').text();
                log.info(`[START]: Also ask - ${question.title}`);
                question.description = $(el).find('.rwrl_padref').text();
                questions.push(question);
            });
            urlResults.questions = questions;
        } else if ($(relatedEl).find('.exploreAns').length > 0) { // explore answers
            const explore = [];
            let title = '';
            let slide = {};
            $(relatedEl).find('.slide').each((_0, el) => {
                slide = {};
                title = $(el).find('.rel_ent_t').text();
                if (title) {
                    log.info(`[START]: Explore - ${title}`);
                    slide.title = title;
                    slide.imgUrl = new URL($(el).find('a').attr('href'), `https://www.bing.com`);
                    explore.push(slide);
                }
            });
            urlResults.explore = explore;
        }
    });

    // Additional results in right column
    // can be hidden for width smaller than ~1200px
    if ($('#b_context').length > 0) {
        $('#b_context .b_ans').each((_, rightEl) => {
            // see results for
            if ($(rightEl).find('.disambig-outline').length > 0) {
                const resultsFor = [];
                $(rightEl).find('.b_vList').each((_0, el) => {
                    const url = new URL($(el).find('a').attr('href'), `https://www.bing.com`);
                    const title = $(el).find('.b_secondaryFocus').text();
                    const description = $(el).find('span').attr('title');
                    log.info(`[START]: Result for - ${title}`);
                    resultsFor.push({ url, title, description });
                });
                if (resultsFor.length > 0) {
                    urlResults.resultsFor = resultsFor;
                }
            }
            /*
                TBD: Different main result for different markets with same content and visuals (en-US: .b_entityTP vs. de-DE: .b_cbContainer_ent2)
            */
        });
    }
    await Apify.pushData(urlResults);
};
