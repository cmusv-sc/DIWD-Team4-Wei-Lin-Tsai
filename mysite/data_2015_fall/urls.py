
from django.conf.urls import url

from views import *

urlpatterns = [
    url(r'^coauthors/(?P<level>\d+)/(?P<name>.+)$', findCoAuthorsMultiLevel),
    url(r'^coauthors/(?P<name>.+)$', findCoAuthors),
    url(r'^papers/(?P<keywords>.+)/(?P<k>\d+)$', getTopKRelevantPapersWithAuthorsByKeywords),
    url(r'^contributions/(?P<name>.+)$', getAuthorContributionToAJournal),
    url(r'^path/(?P<start>.+)/(?P<end>.+)$', findPath),
    url(r'^experts/(?P<keywords>.+)/(?P<k>\d+)$', getTopKExpertsByKeywords),
    url(r'^collaborators/(?P<name>.+)/(?P<keywords>.+)/(?P<k>\d+)$', queryCollaboratorsByNameAndKeyWords),
    url(r'^cited/(?P<name>.+)/(?P<year>\d+)/(?P<k>\d+)$', get_top_k_cited_papers),
    url(r'^cited/(?P<name>.+)$', get_citations)
]
