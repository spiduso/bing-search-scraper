# Apify Bing actor
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

Country/Region|Default Language|Market code
|---|---|---
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

