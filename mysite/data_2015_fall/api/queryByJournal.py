from django.http import JsonResponse
from data_2015_fall.models import *
import simplejson
from collections import defaultdict

# ===================================================
#	Classes 
# ===================================================
class VolumeContribution(object):
    def __init__(self, volume, authors):
        self.volume = volume
        self.authorsInJson = [];
        for a in authors:
            self.authorsInJson.append(a.toDict())
        self.authorsInJson.sort()
    def toDict(self):
        return {
            "volume": self.volume,
            "authors": [v for v in self.authorsInJson]
        } 

# ===================================================
#	Functions 
# ===================================================
'''
Given a journal name, generate a graph showcasing authors contributing
to each of its volume, taking volume as the base axis.
All journals in first 10k articles:
 Computers in Industry\n
 IJKDB\n
 IJEA\n
 Future Generation Comp. Syst.\n
 Object Oriented Systems\n
 International Journal of Internet and Enterprise Management\n
 Acta Inf.\n
 Game Studies\n
 IEEE Trans. Knowl. Data Eng.\n
 Displays\n
 IJTM\n
 Telematics and Informatics\n
'''
def getAuthorContributionToAJournal(request, name):
    debugInfo = ""
    volumeHash = defaultdict(list)
    # use hash to gather data 
    for article in Article.nodes.filter(journal=name):
        for author in article.authors:
            volumeHash[article.volume].append(author)
    
    # covert to VolumeContribution for json generation
    volumes = []
    for volume, author in volumeHash.iteritems():
        volumes.append(VolumeContribution(volume, author))

    return JsonResponse({ "volumes": [v.toDict() for v in volumes] })   

'''
Backup, don't touch it unless you ask WeiLin
def getAuthorContributionToAJournal(request, name):
    res = ""
    myHash = set()
    volumeHash = defaultdict(list)
    for article in Article.nodes.filter(journal="Game Studies"):
        for author in article.authors:
            if author.name == "Jesper Juul":
                print author.name
                print article.title
                print article.volume
            myHash.add(author.name)
            volumeHash[author.name].append(article.volume)

    for author, volume in volumeHash.iteritems():
        res +=  author + ', ' + ', '.join(volume) + " \n"

    return JsonResponse({name: res})
'''