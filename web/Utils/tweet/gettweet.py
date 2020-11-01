import json
import datetime
import time
import math
from requests_oauthlib import OAuth1Session
from pytz import timezone
from dateutil import parser
import collections as cl

json_token = open("config.json", "r", encoding='utf-8')
token = json.load(json_token)

CK = token["CK"]
CS = token["CS"]
AT = token["AT"]
ATS = token["ATS"]

SEARCH_TWEETS_URL = 'https://api.twitter.com/1.1/search/tweets.json'
RATE_LIMIT_STATUS_URL = "https://api.twitter.com/1.1/application/rate_limit_status.json"
SEARCH_LIMIT_COUNT = 100

SEARCH_WORD = 'らんだむちゃん'

max_id = 0

# ツイート取得対象日
"""start_dt = '20201001'
finish_dt = '20201025'

start_dt = datetime.datetime.strptime(start_dt, '%Y%m%d')
finish_dt = datetime.datetime.strptime(finish_dt, '%Y%m%d')

since = str(start_dt)
until = str(finish_dt)

print(since)"""


f_max_r = open("max_id.json", "r", encoding='utf-8')
json_data = json.load(f_max_r)
max_id = json_data["max_id"]
print(json_data)
print(max_id)
#dicc = cl.OrderedDict()
#dicc["maxid"] = "asdf"
#json.dump(dicc,fid,indent=2,ensure_ascii=False)
f_max_r.close()


params = {
    'q': SEARCH_WORD,
    'count': SEARCH_LIMIT_COUNT,
    'tweet_mode': 'extended',
    'since_id':max_id
}

"""if since != '':
    params['since'] = since
if until != '':
    params['until'] = until"""

client = OAuth1Session(
    CK,
    CS,
    AT,
    ATS
)

res = client.get(SEARCH_TWEETS_URL, params=params)

print(res)


if res.status_code == 200:
    data = json.loads(res.text)

    tweets = data['statuses']
    i = 0

    f_r = open("tweet.json", "r", encoding='utf-8')
    tweet_list = json.load(f_r)


    for tweet in tweets:
        print(i)
        if tweet['user']['id']!= 3233928018 and SEARCH_WORD in tweet['full_text'] :
            #print(tweet)
            print("**********")
            print(tweet['user']['name'])
            print("\n")
            print(tweet['created_at'])
            print("\n")
            print(tweet['full_text'])
            print("**********\n\n\n")
            dic = cl.OrderedDict()
            dic["name"] = tweet['user']['name']
            #dic["id"] = tweet['id']
            dic["tweet"] = tweet['full_text']
            tweet_list.insert(0,dic)

            print(tweet["id"])
            if(tweet["id"]!=0):                
                max_id = max(max_id,tweet["id"])
                       

            #json.dump(tweet['user']['name']
            #        , tweet['full_text']
            #        , ensure_ascii=False
            #        , sort_keys=True
            #        # ,indent=4
            #        , separators=(',', ': '))
            #f.write('\n')

                
            

            #            {
            #{"name":"hogehoge", "tweet":"今なにしてる？"},
            #{"name"...
            #}
        #print(tweet['user']['id'])
        i+=1
    
    f_max_w = open("max_id.json", "w", encoding='utf-8')
    dicc = cl.OrderedDict()
    dicc["max_id"] = max_id
    json.dump(dicc,f_max_w,indent=2,ensure_ascii=False)    
    f_max_w.close()

    
    f = open("tweet.json", "w", encoding='utf-8')
    json.dump(tweet_list,f,indent=2,ensure_ascii=False)
    f.close()
        
