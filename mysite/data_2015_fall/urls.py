
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
    url(r'^citations/(?P<name>.+)$', get_citations_network),
    url(r'^paper_author/(?P<name>.+)$', get_paper_author_network),
    url(r'^journalsdist/(?P<startYear>\d+)/(?P<endYear>\d+)', queryPublicationsBetweenYears),
    url(r'^pubovertime/(?P<name>.+)', queryPubsOfAuthorOverTime),
]
