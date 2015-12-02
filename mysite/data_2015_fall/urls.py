
from django.conf.urls import url

from views import *

urlpatterns = [
    url(r'^coauthors/(?P<level>\d+)/(?P<name>.+)$', findCoAuthorsMultiLevel),
    url(r'^coauthors/(?P<name>.+)$', findCoAuthors)
]
