from django.http import JsonResponse
from data_2015_fall.models import *
import simplejson
from collections import defaultdict
from operator import itemgetter

# ===================================================
#	Classes 
# ===================================================
class Expert(object):
    def __init__(self, name):
        self.name = name
    def toDict(self):
        return {
            "name": self.name
        } 


# ===================================================
#	Functions 
# ===================================================
def getTopKExpertsByKeywords(request, keywords, k):
    keywordsList = keywords.split("+")
    expertHash = defaultdict(int) # map expert name to its count
    list1 = []
    # count appearance of author who publish the paper matches keyword
    for keyword in keywordsList:
        for article in Article.nodes.filter(title__icontains=keyword):
            list1.append(article.title)
            for author in article.authors:
                expertHash[author.name]+=1

    experts = []
    for key, value in sorted(expertHash.iteritems(), key=itemgetter(1), reverse=True)[0:int(k)]: 
        experts.append(Expert(key))
        #print key + ", " + str(value) # debug msg

    return JsonResponse({ "experts": [e.toDict() for e in experts] })   