const Apify = require('apify');

const { utils: { log } } = Apify;

const { prependUrl } = require('./helpers');
const {BING_WIKI_RICHCARD} = require('./const');

exports.handleStart = async ({ request, $ }) => {
    log.info(`[START]: Opened page: ${request.url}`);
    
    const urlResults = {'url': request.url};
    
    if($('.b_searchbox').length > 0){
        log.info(`[START]: keyword - ${$('.b_searchbox').attr('value')}`);
        urlResults['keyword'] = $('.b_searchbox').attr('value');
    }

    if($('#b_tween > .sb_count').length > 0){
        const splitted = $('#b_tween > .sb_count').text().replaceAll(',', '').split(' ');
        
        for(let i = 0; i < splitted.length; i++)
        {
            if(!isNaN(splitted[i]))
            {
                log.info(`[START]: Results found: ${splitted[i]}`);
                urlResults['count'] = splitted[i];
            }
        }
    }
    else if($('#b_results .b_no').length > 0){
        urlResults['count'] = 0;
        log.info('[START]: No results');
        log.info($('body').text());
        await Apify.pushData(urlResults);
        return;
    }

    if($('.sb_pagS.sb_pagS_bp').length > 0)
    {
        log.info(`[START]: Page number - ${$('.sb_pagS.sb_pagS_bp').text()}`);
        urlResults['pageNumber'] = $('.sb_pagS.sb_pagS_bp').text();
    }

    if($('#sp_requery').length > 0){
        log.info(`[START]: Subquery - ${$('#sp_requery a').first().text()}`);
        urlResults['subquery'] = $('#sp_requery a').first().text();
    }

    const ads = [];
    $('#b_results .b_ad').each(function(){
        let ad = {};
        log.info(`[START]: AD - ${$(this).find('a').first().text()}`);
        ad['title'] = $(this).find('a').first().text();
        ad['url'] = $(this).find('a').attr('href');
        ad['description'] = $(this).find('.b_caption p').text();
        ads.push(ad);
    })
    if(ads.length > 0)
        urlResults['ads'] = ads;

    const topBorders = [];
    $('#b_results > .b_topborder').each(function(){
        let topborder = {"type":"topborder"};
        log.info(`[START]: Topborder - ${$(this).find('a').text()}`);
        topborder['title'] = $(this).find('.rwrl_cred a').text();
        topborder['description'] = $(this).find('.rwrl_padref').text();
        topborder['url'] = $(this).find('.rwrl_cred a').attr('href');
        topBorders.push(topborder);
    })
    if(topBorders.length > 0)
        urlResults['topBorders'] = topBorders;


    // news results
    const newsArr = [];
    $('#b_results > .b_nwsAns').each(function(index){
        log.info('[START]: News');
        $(this).find('#ans_nws .b_slidesContainer .slide').each(function(index){
            let news = {'type': 'news'};
            let text = $(this).find('.b_promtxt').text();
            if(text.length > 0){
                news['text'] = text;
                news['source'] = $(this).find('.na_footer_name').text();
                news['time'] = $(this).find('.b_secondaryText').text().substr(3);
                news['url'] = $(this).find('.b_cap > a').attr('href');
                newsArr.push(news);
            }
        });
    });
    if(newsArr.length > 0)
        urlResults['news'] = newsArr;

    const images = [];
    $('#b_results > .b_imgans').each(function(){
        $(this).find('.slide').each(function(){
            const img = {};
            let url = $(this).find('.imgText').attr('href');
            if(url){
               url = prependUrl(url);
               img['url'] = url;
               img['description'] = $(this).find('.imgText').text();
               log.info(`[START]: Image - ${$(this).find('.imgText').text()}`);
               images.push(img);
            }
        });
    });
    if(images.length > 0)
        urlResults['images'] = images;

    const videos = [];
    // video results
    $('#b_results > .b_vidAns').each(function(index){
        $(this).find('.slide').each(function(index){
            let url = $(this).find('a').attr('href');
            if(url[0] == '/')
                url = prependUrl(url);
            let video = {url};
            let title = $(this).find('.mc_vtvc_title').text();
            if(title != ""){
                video['channel'] = $(this).find('.mc_vtvc_meta .mc_vtvc_meta_row_channel').text();
                video['date'] = $(this).find('.mc_vtvc_meta .meta_pd_content').text();
                video['title'] = title;
                log.info(`[START]: Video - ${$(this).find('.mc_vtvc_title').text()}`);
                video['views'] = $(this).find('.meta_vc_content').text();
                video['provider'] = $(this).find('.mc_vtvc_meta_channel > span').first().text(); 
                videos.push(video);
            }
        });
    });

    if(videos.length > 0)
        urlResults['videos'] = videos;

    
    const pages = [];
    // algo results
    $('#b_results > .b_algo').each(function(index){
        let algo = {};
        const title = $(this).find('h2 a').text();
        algo['title'] = title;
        algo['link'] = $(this).find('h2 a').attr('href');

        let desc = "";
        let date = "";
        if($(this).find('.b_caption p').length > 0){
            log.info(`[START]: Page - ${title}`);
            desc = $(this).find('.b_caption p').text();
            if($(this).find('.news_dt').length > 0){
                date = $(this).find('.news_dt').text();
                desc = desc.replace(date, '').substr(3);
                algo['date'] = date;
            }
        }
        else if($(this).find('.b_richcard').length > 0){
            /*
            if($(this).find('.b_richcard div div .tab-content div div div .ipText').length > 0){
                desc =log.info($(this).find('.b_richcard div div .tab-content div div div .ipText').text());                
            }
            else if($(this).find('.b_richcard div div .tab-content div ul li div').length > 0){
                desc =log.info($(this).find('.b_richcard div div .tab-content div ul li div').text());          
            }
            else{
                log.info('ale existuje jeste jiny')
            }*/
            desc = $(this).find('.b_richcard').text();
            log.info(`[START] - Richcard - ${desc}`);
        }
        else if($(this).find('.b_wikiRichcard_noHeroSection').length > 0){
           desc = $(this).find('.tab-content').text();
           log.info(`[START]: Wiki richcard - ${desc}`)
           textUnder = $(this).find('.b_divdef > span').text();
           source = $(this).find('.b_divdef').text();
           source = source.replace(textUnder, '');
           textUnder = textUnder.substr(3);
           algo['type'] = BING_WIKI_RICHCARD;
           algo['source'] = source;
           algo['textUnder'] = textUnder;
        }
        else if($(this).find('.b_algo_group').length > 0){
            log.info(`[START]: AlgoGroup - ${$(this).find('h2').first().text()}`);
            algo['type'] = 'algoGroup';
            // dictionary
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
            else if($(this).find('.b_wiki_sub').length > 0){
                const wikiCards = [];
                let wikiCard = {};
                $(this).find('.b_wiki_sub_text').each(function(){
                    wikiCard = {'type':'text'};
                    const title = $(this).find('.b_wiki_sub_title').text();
                    if(title)
                        wikiCard['title'] = title
                    wikiCard['description'] = $(this).find('.b_paractl').text();
                    wikiCard['seeMoreLink'] = $(this).find('.b_wiki_see_more').attr('href');
                    wikiCards.push(wikiCard);
                });
                $(this).find('.b_wiki_img_wrapper').each(function(){
                    wikiCard = {'type':'image'};
                    const imageUrl = $(this).find('a').attr('href');
                    wikiCard['imageUrl'] = imageUrl;
                    wikiCards.push(wikiCard);
                });


                if(wikiCards.length > 0)
                    algo['wikiCards'] = wikiCards;
            }
            else
                desc = $(this).find('div').first().text();
        }
        else if($(this).find('#b_gridCarousel').length > 0){
            $(this).find('#b_gridCarousel').children('.slide').each(function(){
                log.info(`[START]: Carousel - ${$(this).text()}`);
            });
        }
        else if($(this).find('.b_dList').length > 0){
            list = [];
            let text = "";
            $(this).find('.lisn_olitem').each(function(){
                text = $(this).find('span').text();
                if(text){
                    log.info(`[START]: List - ${text}`);
                    list.push(text);
                }
            });
            if(list.length > 0)
                algo['list'] = list;
        }
        
        const recommendations = [];
        let recommended = {};
        if($(this).find('.pageRecoContainer').length > 0){
            $(this).find('.pageRecoContainer table tr').each(function(){
                recommended = {};
                recommended['description'] = $(this).find('a').first().text();
                log.info(`[START]: Page recommendation - ${recommended['description']}`)
                recommended['url'] = $(this).find('a').attr('href');
                recommendations.push(recommended);
            })
            algo['recommendations'] = recommendations;
        }
        
        if(desc)
            algo['desc'] = desc;

        pages.push(algo);
    })

    if(pages.length > 0)
        urlResults['pages'] = pages;

    $('#b_results > .b_ans').each(function(index){
        // related search
        if($(this).find('.b_rs').length > 0){
            const related = [];
            let item = {};
            $(this).find('li').each(function(index){
                item = {};
                let text = $(this).text();
                item['text'] = text;
                log.info(`[START]: Related - ${text}`);
                item['url'] = prependUrl($(this).find('a').attr('href'));
                related.push(item);
            });
            if(related.length > 0)
                urlResults['related'] = related;
        }
        // People also ask
        else if($(this).find('#relatedQnAListDisplay').length > 0){
            const questions = [];
            let question = {};
            $('[data-tag=RelatedQnA.Item]').each(function(){
                question = {};
                question['question'] = $(this).find('.b_1linetrunc').attr('aria-label');
                question['url'] = $(this).find('.rwrl_cred a').attr('href');
                question['title'] = $(this).find('.rwrl_cred a').text();
                log.info(`[START]: Also ask - ${question['title']}`  );
                question['description'] = $(this).find('.rwrl_padref').text();
                questions.push(question);
            })
            if(questions.length > 0)
                urlResults['questions'] = questions;
        }
        // explore answers
        else if($(this).find('.exploreAns').length > 0){
            const explore = [];
            let title = '';
            let slide = {};
            $(this).find('.slide').each(function(){
                slide = {};
                title = $(this).find('.rel_ent_t').text();
                if(title){
                    log.info(`[START]: Explore - ${title}`);
                    slide['title'] = title;
                    slide['imgUrl'] = prependUrl($(this).find('a').attr('href'));
                    explore.push(slide);
                }
            });
            if(explore.length > 0)
                urlResults['explore'] = explore;
        }
    })
    
    // right column
    if($('#b_context').length > 0){
        $('#b_context .b_ans').each(function(){
            // see results for
            if($(this).find('.disambig-outline').length > 0){
                const resultsFor = [];
                $(this).find('.b_vList').each(function(){
                    let url = prependUrl($(this).find('a').attr('href'));
                    let title = $(this).find('.b_secondaryFocus').text();
                    let description = $(this).find('span').attr('title');
                    log.info(`[START]: Result for - ${title}`);
                    resultsFor.push({url, title, description});
                });
                if(resultsFor.length > 0)
                    urlResults['resultsFor'] = resultsFor;
            }
            else if($(this).find('.b_cbContainer_ent2').length > 0){

            }
        });
    }
    await Apify.pushData(urlResults);
};
