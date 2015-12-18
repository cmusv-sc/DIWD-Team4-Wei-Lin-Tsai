from django.conf.urls import patterns, include, url
from django.contrib import admin

# import view functions from trips app
from data_2015_fall.views import landing
from data_2015_fall.views import sign
from data_2015_fall.views import sign_in
from data_2015_fall.views import sign_out
from data_2015_fall.views import sign_up



# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()
urlpatterns = patterns('',
     # Examples:
    # url(r'^$', 'mysite.views.home', name='home'),
    # url(r'^mysite/', include('mysite.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', landing),
    url(r'^sign/', sign),
    url(r'^login/', sign_in),
    url(r'^logout/', sign_out),
    url(r'^register/', sign_up),
    url(r'^dblp/', include('data_2015_fall.urls'))
)
