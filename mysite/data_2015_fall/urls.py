
from django.conf.urls import url

from views import *

urlpatterns = [
    url(r'^coauthors/(?P<level>\d+)/(?P<name>.+)$', findCoAuthorsMultiLevel),
    url(r'^coauthors/(?P<name>.+)$', findCoAuthors),
    url(r'^papers/(?P<keywords>.+)/(?P<k>\d+)$', getTopKRelevantPapersWithAuthorsByKeywords),
    url(r'^contributions/(?P<name>.+)$', getAuthorContributionToAJournal),
    url(r'^path/(?P<start>.+)/(?P<end>.+)$', findPath)
]
