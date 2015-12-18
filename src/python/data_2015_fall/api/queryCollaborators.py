from django.http import JsonResponse
from data_2015_fall.models import *
import simplejson
from collections import defaultdict
from queryExperts import *

# ===================================================
#	Classes 
# ===================================================
# leverage Class Expert from queryExperts

# ===================================================
#	Functions 
# ===================================================
# Sample query:
#   http://127.0.0.1:8000/dblp/collaborators/Lars%20Jenner/Semantics+Process/100
# Sample result:
#   {"collaborators": [{"name": "Walter Vogler"}, {"name": "Flavio Corradini"}]}
def queryCollaboratorsByNameAndKeyWords(request, name, keywords, k):
    # count all co-authors
    author = Author.nodes.get(name=name)
    coauthorHash = defaultdict(int)
    for article in author.articles:
        for coauthor in article.authors:
            if coauthor != author:
                coauthorHash[coauthor.name]+=1

    # count all authors by keywords 
    keywordsList = keywords.split("+")
    expertHash = defaultdict(int) # map expert name to its count
    # count appearance of author who publish the paper matches keyword
    for keyword in keywordsList:
        for article in Article.nodes.filter(title__icontains=keyword):
            for author in article.authors:
                expertHash[author.name]+=1

    # update weithing by considering both factors
    for a, cnt in coauthorHash.iteritems():
        if expertHash[a] != 0:
            coauthorHash[a] *= expertHash[a]
            #print a + ", " + str(cnt) + ", " + str(expertHash[a])

    #for a, cnt in coauthorHash.iteritems():
    #   print a + ", " + str(cnt)

    experts = []
    for key, value in sorted(coauthorHash.iteritems(), key=itemgetter(1), reverse=True)[0:int(k)]: 
        experts.append(Expert(key))
        #print key + ", " + str(value) # debug msg

    return JsonResponse({ "collaborators": [e.toDict() for e in experts] })    