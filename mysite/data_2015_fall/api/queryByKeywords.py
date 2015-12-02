from django.http import JsonResponse
from data_2015_fall.models import *
import Queue

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

    def __cmp__(self, other): # for priority queue
        return self.relevance > other.relevance

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
    pQ = Queue.PriorityQueue()
    for article in Article.nodes:
        lowerTitle = article.title.lower()
        matchCnt = 0
        for keyword in keywordsList:
            if keyword in lowerTitle:
    	       matchCnt += 1
    	if (matchCnt > 0):
            pQ.put(Paper(article.title, [], matchCnt))
            cnt += 1
        if (pQ.qsize() > int(k) + 5): # remove some item if Queue is too large, 5 for margin because qsize is not precise 
            pQ.get()    
    	#if (cnt > 100):
    	#	break

    while not pQ.empty():
        article = pQ.get()
        print article.title + "  >>>>>  " + str(article.relevance)   

    return JsonResponse({keywords: k})