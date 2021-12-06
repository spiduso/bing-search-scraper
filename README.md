# Bing Search Result Scraper
## Features
The following data can be extracted from Bing search result:
- Organic results
- Ads
- Related queries
- See results for
- Recommended searches
- People Also Ask
- Wiki results
- News, Image, Video results
## Cost of Usage
Actor uses default proxy configuration to minimalize the chance of being blocked. Content and language does not depend on proxy location, since it can be set with input. <br />
Usage depends on complexity of search results created by Bing. On average scraper set on default 10 results per page use 1 CU per 300 pages.
## Input
### Search queries or URLs - ```queries```
*Optional - String*
<hr>
Bing Search queries (e.g. food in NYC) and/or full URLs (e.g. https://www.bing.com/search?q=food+NYC). Enter one item per line.

### Results per page - ```resultsPerPage```
*Optional - Integer*
<hr>
Number of search results per page. By default, Bing Search returns 10 results. The allowed values are between 1 and 100.

### Max pages per query - ```maxPagesPerQuery```
*Optional - Integer*
<hr>
The maximum number of search result pages crawled for each search query or URL. Note that a value greater than one might significantly slow down the actor.

### Market Code - ```marketCode```
*Optional - String*
Bing Search returns content for set market.
<hr>

|Country/Region|Default Language|Market code|
|---|---|---|
Argentina|Spanish|es-AR
Australia|English|en-AU
Austria|German|de-AT
Belgium|Dutch|nl-BE
Belgium|French|fr-BE
Brazil|Portuguese|pt-BR
Canada|English|en-CA
Canada|French|fr-CA
Chile|Spanish|es-CL
Denmark|Danish|da-DK
Finland|Finnish|fi-FI
France|French|fr-FR
Germany|German|de-DE
Hong Kong SAR|Traditional Chinese|zh-HK
India|English|en-IN
Indonesia|English|en-ID
Italy|Italian|it-IT
Japan|Japanese|ja-JP
Korea|Korean|ko-KR
Malaysia|English|en-MY
Mexico|Spanish|es-MX
Netherlands|Dutch|nl-NL
New Zealand|English|en-NZ
Norway|Norwegian|no-NO
People's republic of China|Chinese|zh-CN
Poland|Polish|pl-PL
Republic of the Philippines|English|en-PH
Russia|Russian|ru-RU
South Africa|English|en-ZA
Spain|Spanish|es-ES
Sweden|Swedish|sv-SE
Switzerland|French|fr-CH
Switzerland|German|de-CH
Taiwan|Traditional Chinese|zh-TW
Turkey|Turkish|tr-TR
United Kingdom|English|en-GB
United States|English|en-US
United States|Spanish|es-US

### Language - ```languageCode```
Language for the search results.
*Optional - String*
<hr>

|Language|Language Code|
|---|---|
Arabic|ar
Basque|eu
Bengali|bn
Bulgarian|bg
Catalan|ca
Chinese (Simplified)|zh-hans
Chinese (Traditional)|zh-hant
Croatian|hr
Czech|cs
Danish|da
Dutch|nl
English|en
English-United Kingdom|en-gb
Estonian|et
Finnish|fi
French|fr
Galician|gl
German|de
Gujarati|gu
Hebrew|he
Hindi|hi
Hungarian|hu
Icelandic|is
Italian|it
Japanese|jp
Kannada|kn
Korean|ko
Latvian|lv
Lithuanian|lt
Malay|ms
Malayalam|ml
Marathi|mr
Norwegian (Bokmål)|nb
Polish|pl
Portuguese (Brazil)|pt-br
Portuguese (Portugal)|pt-pt
Punjabi|pa
Romanian|ro
Russian|ru
Serbian (Cyrylic)|sr
Slovak|sk
Slovenian|sl
Spanish|es
Swedish|sv
Tamil|ta
Telugu|te
Thai|th
Turkish|tr
Ukrainian|uk
Vietnamese|vi

## Results
Actor stores its result in the default dataset associated with the run, which you can export to various formats.

The results can be downloaded from the [Get dataset items](https://docs.apify.com/api/v2#/reference/datasets/item-collection/get-items) API endpoint:
```
https://api.apify.com/v2/datasets/[DATASET_ID]/items?format=[FORMAT]
```
where `[DATASET_ID]` is the ID of the dataset and `[FORMAT]` can be `csv`, `html`, `xlsx`, `xml`, `rss` or `json`.

For each Bing search results page, the dataset will contain a single record, which in JSON format looks as follows. Bear in mind that some fields have example values:
```json
{
  "url": "https://www.bing.com/search?q=restaurants+in+NYC&setmkt=en-US&setLang=en&count=20",
  "keyword": "restaurants in NYC",
  "pageNumber": "1",
  "ads": [],
  "topBorders": [
    {
      "type": "topborder",
      "title": "3 Restaurant Stocks to Buy as Portillo’s IPO Puts Food in Focus | M…",
      "description": "McDonald’s ( NYSE:MCD)Chipotle Mexican Grill ( NYSE:CMG)Shake Shack ( NYSE:SHAK)",
      "url": "https://markets.businessinsider.com/news/stocks/3-restaurant-stocks-to-buy-as-portillos-ipo-puts-food-in-focus-1030942104#:~:text=1%20McDonald%E2%80%99s%20%28%20NYSE%3AMCD%29%202%20Chipotle%20Mexican,Grill%20%28%20NYSE%3ACMG%29%203%20Shake%20Shack%20%28%20NYSE%3ASHAK%29"
    }
  ],
  "news": [],
  "images": [
    {
      "url": "https://www.bing.com/images/search?q=restaurants+in+nyc&id=2A4278536950043E64049BF31FF7EF10AE59890E&FORM=IQFRBA&tsc=ImageHoverTitle",
      "description": "The 8 Most Romantic Restaurants In New York City ..."
    },
    {
      "url": "https://www.bing.com/images/search?q=restaurants+in+nyc&id=CB6E30A74EE489542CAC44CC2AF03EADD002B5AD&FORM=IQFRBA&tsc=ImageHoverTitle",
      "description": "NYC’s Best Restaurants For Celebrity Sightings – CBS New York"
    }
  ],
  "videos": [
    {
      "url": "https://www.bing.com/videos/search?q=restaurants+in+NYC&docid=608027044097975381&mid=847D6D6E00C15262FE03847D6D6E00C15262FE03&view=detail&FORM=VIRE",
      "channel": "Sarah Funk",
      "date": "6 months ago",
      "title": "The Best Restaurants in NYC (the NEW 2021 dining guide)",
      "views": "79K views",
      "provider": "YouTube"
    },
    {
      "url": "https://www.bing.com/videos/search?q=restaurants+in+NYC&docid=608028478616464812&mid=9764CA38921564D86ABA9764CA38921564D86ABA&view=detail&FORM=VIRE",
      "channel": "Sarah Funk",
      "date": "Jun 21, 2018",
      "title": "Best Restaurants in NYC | A Culinary Tour with a local New Yorker",
      "views": "270K views",
      "provider": "YouTube"
    }
  ],
  "pages": [
    {
      "title": "THE 10 BEST Restaurants in New York City - Updated ...",
      "link": "https://www.tripadvisor.com/Restaurants-g60763-New_York_City_New_York.html",
      "desc": "Restaurants in New York City 1. Club A Steakhouse. 2. Mei Jin Ramen. 3. Boucherie Union Square. 4. Boucherie West Village. 5. Bua Thai Ramen & Robata Grill. 6. Olio e Piu. 7. Piccola Cucina. 8. Bleecker Street Pizza. 9. La Grande Boucherie. 10. …"
    },
    {
      "title": "THE BEST 10 Restaurants in New York, NY - Last Updated ...",
      "link": "https://www.yelp.com/search?cflt=restaurants&find_loc=new+york%2C+NY",
      "list": [
        "Thursday Kitchen. 1473. $$East Village. “I've been wanting to come to Thursday Kitchen for …",
        "The Cabin NYC. 349. $$East Village. Locally owned & operated. Outdoor seating. Waitlist …",
        "Raku. 552. $$South Village. Proof of vaccination required. “Raku is my favorite Udon in NYC! …",
        "Amélie. 2758. $$$Greenwich Village. “I love quirks; that's the secret to living with myself, and …",
        "Joe’s Shanghai. 6482. $$Chinatown. “The service was excellent, I got the shrimp lo mein-a …",
        "Raku. 1220. $$East Village. Proof of vaccination required. Waitlist opens at 12:00 pm. “FYI: …",
        "Wayla. 418. $$Lower East Side. “Service was above and beyond, shout out to our man / host …",
        "Jane. 3232. $$Greenwich Village. “Great Sunday brunch! Had a reservation for 5 people, we …",
        "Olio e Piú. 2867 $$ Proof of vaccination required. “This is my first time here at this restaurant …",
        "Da Andrea. 1004. $$Greenwich Village. “It was so nice to have a dinner in this wonderful …"
      ],
      "desc": ""
    },
    {
      "title": "New York Restaurants and Dining Guide | NYC.com ...",
      "link": "https://www.nyc.com/restaurants/",
      "desc": "Eleven Madison Park expresses the spirit of grand New York dining with a contemporary accent. Designed by architects Bentel & Bentel, with soaring 30-foot ceilings and windows overlooking beautiful Madison Square Park, the Art-Deco restaurant embodies an urbane sophistication that is at once relaxed and bustling."
    }
  ],
  "explore": [
    {
      "title": "New York City Restaurants",
      "imgUrl": "https://www.bing.com/images/search?q=New+York+City+Restaurants&FORM=IARSLK"
    },
    {
      "title": "Restaurant Modern NYC",
      "imgUrl": "https://www.bing.com/images/search?q=Restaurant+Modern+NYC&FORM=IARSLK"
    }
  ],
  "related": [
    {
      "text": "best trendy restaurants in nyc",
      "url": "https://www.bing.com/search?q=best+trendy+restaurants+in+nyc&FORM=QSRE1"
    },
    {
      "text": "best restaurants nyc 2021",
      "url": "https://www.bing.com/search?q=best+restaurants+nyc+2021&FORM=QSRE2"
    }
  ]
}
```