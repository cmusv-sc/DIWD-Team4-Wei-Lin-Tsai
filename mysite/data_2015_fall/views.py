# Create your views here.
from datetime import datetime
from django.shortcuts import render
import simplejson
import urllib2
import logging
import sys
from django.utils.safestring import SafeString
from django.http import JsonResponse
from data_2015_fall.models import *
from neomodel import DoesNotExist


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def pushLog(type,log_para, event):
    FORMAT = '%(asctime)-15s %(clientip)s %(user)-8s %(message)s'
    logging.basicConfig(format=FORMAT)
    logger = logging.getLogger('tcpserver')
    if type == 'warning':
        logger.warning('Calling: %s', event, extra=log_para)
    elif type == 'error':
        logger.error('Error: %s', event, extra=log_para)
    elif type == 'info':
        logger.info('Info: %s', event, extra=log_para)

def searchByAuthor(request):
    query = request.GET['input'].replace(" ", "%20")
    param = request.GET['search_param']
    try:
        if query and param :
            if param == "2":
                url = 'http://127.0.0.1:8000/dblp/coauthors/' + param +'/'+ query
            else:
                url = 'http://127.0.0.1:8000/dblp/coauthors/' + query

            req = urllib2.Request(url)
            f = urllib2.urlopen(req)
            result = f.read()
            result = result[result.find("{",1):-2].replace("\\", "")

            log_para = {'clientip': get_client_ip(request), 'user': 'tempUSER'}
            pushLog('warning', log_para, url)

    except:
        pushLog('error', log_para, sys.exc_info()[0])
        pass

    return result 

def landing(request):

    out = ""
    target = 'index.html'

    try:
        out = searchByAuthor(request)
    except:
        pass

    if "Can't find Author" in out or not out:
      target = 'base.html'

    return render(request,
    target,
    {'out':SafeString(out),
    })

def sign(request):
    return render(request,
    'sign_in_up.html')
    

def demo_wei(request):
    print "here"
    return JsonResponse({'foo': 'bar'})

class CoAuthorNode(object):
    name = ""
    children = []
    def __init__(self, name, children):
        """
        name: str
        children: [CoAuthorNode]
        """
        self.name = name
        self.children = children

    def __hash__(self):
        return hash(self.name)

    def __cmp__(self, other):
        return cmp(self.name, other.name)

    def toDict(self):
        return {
            "name": self.name,
            "children": [c.toDict() for c in self.children]
        }


def findCoAuthors(request, name):
    try:
        root = findCoAuthorsMultiLevel_(1, name)
    except DoesNotExist as e:
        return JsonResponse({'error': "Can't find Author: " + name})
    return JsonResponse({'coauthors': simplejson.dumps(root.toDict())})

def findCoAuthors_(name, visited):
    author = Author.nodes.get(name=name)
    coauthors = set()
    for article in author.articles.all():
        for coauthor in article.authors.all():
            if coauthor.name not in visited and coauthor.name != name:
                coauthors.add(coauthor.name)
    return coauthors

def findCoAuthorsMultiLevel_(depth, name):
    root = Author.nodes.get(name=name)
    root = CoAuthorNode(root.name, [])

    visited = set([root.name])
    root.children = [CoAuthorNode(v, []) for v in findCoAuthors_(root.name, visited)]

    if depth == 1: return root

    # special requirement here.
    # 1. We can't link back to the root
    # 2. For case:
    #       v1 -> v2 -> v3
    #       v1 -> v4 -> v3
    #   We need to add v3 as children for both v2 and v4
    # As a result, instead of dfs/bfs, I directly implement this using Simulation Algorithm.
    for u in root.children:
        u.children = [CoAuthorNode(v, []) for v in findCoAuthors_(u.name, visited)]
    return root

def findCoAuthorsMultiLevel(request, level, name):
    """
    Currently only support <= 2 levels.
    """
    try:
        root = findCoAuthorsMultiLevel_(level, name)
    except DoesNotExist as e:
        return JsonResponse({'error': "Can't find Author: " + name})
    return JsonResponse({'coauthors': simplejson.dumps(root.toDict())})
