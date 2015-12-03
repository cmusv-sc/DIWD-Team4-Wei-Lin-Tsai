from django.http import JsonResponse
from data_2015_fall.models import *
import Queue
import simplejson

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
    def __init__(self, title, authors, relevance, journal, year, volume):
        self.title = title
        self.authors = authors
        self.relevance = relevance
        self.journal = journal
        self.year = year
        self.volume = volume

    def __hash__(self):
        return hash(self.title)

    def __cmp__(self, other): # for priority queue
        return self.relevance > other.relevance

    def toDict(self):
        return {
            "title": self.title,
            "authors": [a.toDict() for a in self.authors],
            "journal": self.journal,
            "year": self.year,
            "volume": self.volume
        }

# ===================================================
#	Functions 
# ===================================================
def getTopKRelevantPapersWithAuthorsByKeywords(request, keywords, k):
    print "call getTopKRelevantPapersWithAuthorsByKeywords()"
    keywordsList = keywords.lower().split("+")
    
    # calculate its relevance cnt and use priority queue to maintain status 
    pQ = Queue.PriorityQueue()
    for article in Article.nodes:
        lowerTitle = article.title.lower()
        matchCnt = 0
        for keyword in keywordsList:
            if keyword in lowerTitle:
    	       matchCnt += 1
    	if (matchCnt > 0):
            pQ.put(Paper(article.title, article.authors, matchCnt, article.journal, article.year, article.volume))
        if (pQ.qsize() > int(k) + 5): # remove some item if Queue is too large, 5 for margin because qsize is not precise 
            pQ.get()    

    # use list to store the result 
    papers = []
    while not pQ.empty():
        article = pQ.get()
        papers.append(article)
    papers.reverse()
    papers = papers[0:int(k)]
    ''' debug part 
    for p in papers:
        print p.title + " >> " + str(p.relevance) + ":  " +  simplejson.dumps(p.toDict())
    '''
    return JsonResponse({ "papers": [p.toDict() for p in papers] })   