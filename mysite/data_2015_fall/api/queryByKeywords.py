from django.http import JsonResponse
from data_2015_fall.models import *

# ===================================================
#	Classes 
# ===================================================
'''
	A class represnet a paper with following fields 
	title: title of the paper[string]
	authors: array of authors[string]
	relevance: how relevant of this paper in terms of search quiteria[int] 
'''
class Paper(object):
    title = ""
    authors = []
    relevance = 0
    def __init__(self, title, authors, relevance):
        self.title = title
        self.authors = authors
        self.relevance = relevance

    def __hash__(self):
        return hash(self.title)

    def __cmp__(self, other): # TODO, not sure for now 
        return cmp(self.name, other.name)

    def toDict(self):
        return {
            "title": self.title
        }

# ===================================================
#	Functions 
# ===================================================
def demo_wl(request):
    print "wl"
    return JsonResponse({'weilin': 'tsai'})

def getTopKRelevantPapersWithAuthorsByKeywords(request, keywords, k):
    print "call getTopKRelevantPapersWithAuthorsByKeywords()"
    keywordsList = keywords.lower().split("+")
    for word in keywordsList:
        print word
    cnt = 0
    
    for article in Article.nodes:
        lowerTitle = article.title.lower()
        matchCnt = 0
        for keyword in keywordsList:
            if keyword in lowerTitle:
    	       matchCnt += 1
    	if (matchCnt > 1):
            print article.title
            cnt += 1
    	if (cnt > 20):
    		break
    print cnt	
    
    return JsonResponse({keywords: k})