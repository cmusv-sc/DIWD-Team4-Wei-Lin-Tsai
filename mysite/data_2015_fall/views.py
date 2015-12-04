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
from api.queryByKeywords import *
from api.queryByJournal import *
from api.queryExperts import *
from api.queryCollaborators import *

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


def searchRelatedPapers(input):
    return {
    }

def landing(request):
    """
        out = ""
        target = 'index.html'

        if 'search_param' in request.GET:
            type = request.GET['search_param']
            # TODO: this part should be refactored. Either using ajax to call through
            # rest api, or directly call the function 'findCoAuthor_'.
            if type == 'coauthor':
                out = searchByAuthor(request)
            elif type == 'coauthor L2':
                out = searchByAuthor(request)
            elif type == 'papers':
                out = searchRelatedPapers(request.GET['input'])
            else:
                target = 'base.html'
        else:
            target = 'base.html'

        return render(request,
        target,
        {'out':SafeString(out),
        })
    """
    if not request.COOKIES.get('member'):
        return render(request, 'sign_in_up.html')
    return render(request, 'index.html')

def sign_up(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        passwd = request.POST.get('passwd')
        temp_dict = {email:passwd}
        in_file = open('member.json')
        memberlist = simplejson.load(in_file)
        memberlist.update(temp_dict)
        in_file.close()

        out_file = open('member.json','w')
        simplejson.dump(memberlist,out_file, indent=4)
        out_file.close()

        response =  render(request, 'index.html',{'member':'logout '+ email[0:email.find('@')]})
        response.set_cookie("member",email)

    return response

def sign_out(request):
    response =  render(request, 'sign_in_up.html')
    response.delete_cookie('member')
    return response

def sign_in(request):
    response =  render(request, 'sign_in_up.html')
    if request.method == 'POST':
        email = request.POST.get('email')
        passwd = request.POST.get('passwd')
        in_file = open('member.json','r')
        memberlist = simplejson.load(in_file)
        if email in memberlist and passwd == memberlist[email]:
            response =  render(request, 'index.html',{'member':'logout '+ email[0:email.find('@')]})
            response.set_cookie("member",email)
        in_file.close()
    return response

def sign(request):
    if request.COOKIES.get('member'):
        return render(request,'index.html')
    return render(request,
    'sign_in_up.html')




class CoAuthorNode(object):
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



def findPathDFS(start, end):
    """
    find a path between start and end using DFS
    """
    path = []
    visited = set()
    def visit(u):
        visited.add(u)
        path.append(u)
        if u == end: return True
        for v in findCoAuthors_(u, visited):
            if visit(v): return True
        path.pop()
        return False

    if visit(start):
        return {
            "found": True,
            "path": path
        }
    else:
        return {
            "found": False
        }

def findPathBFS(start, end):
    """
    find a shortest path between start and end using BFS
    """
    pass


def findPathBIBFS(start, end):
    """
    Bidirectional bfs
    """
    def retFound(path):
        return {
            "found": True,
            "path": path
        }

    def retNotFound():
        return {
            "found": False
        }

    def findPathInGraphDFS(graph, start, end):
        def dfs(u, path):
            path.append(u)
            if u == end:
                return True
            for v in graph[u]:
                if dfs(v,path): return True
            return False

        path = []
        dfs(start, path)
        return path

    if start == end: return retFound([start])

    visited = set([start,end])
    frontLayer = set([start])
    tailLayer = set([end])
    frontRevGraph = defaultdict(list)
    tailRevGraph = defaultdict(list)

    def constructPathFromRevGraph(front, tail):
        path1 = findPathInGraphDFS(frontRevGraph, front, start)
        path1.reverse()
        path2 = findPathInGraphDFS(tailRevGraph, tail, end)
        path1.extend(path2)
        return path1

    while frontLayer and tailLayer:
        if len(frontLayer) < len(tailLayer):
            nextLayer = set()
            for u in frontLayer:
                for v in findCoAuthors_(u, {}):
                    if v in tailLayer:
                        return retFound(constructPathFromRevGraph(u, v))
                    elif v in visited:
                        continue

                    frontRevGraph[v].append(u)
                    visited.add(v)
                    nextLayer.add(v)
            frontLayer = nextLayer
        else:
            nextLayer = set()
            for u in tailLayer:
                for v in findCoAuthors_(u, {}):
                    if v in frontLayer:
                        return retFound(constructPathFromRevGraph(v, u))
                    elif v in visited:
                        continue

                    tailRevGraph[v].append(u)
                    visited.add(v)
                    nextLayer.add(v)
            tailLayer = nextLayer

    return retNotFound()

def findPath(request, start, end):
    print findPathBIBFS(start, end)
    return JsonResponse(findPathBIBFS(start, end))

def findCoAuthors(request, name):
    try:
        root = findCoAuthorsMultiLevel_(1, name)
    except DoesNotExist as e:
        return JsonResponse({'error': "Can't find Author: " + name})
    # return JsonResponse({'coauthors': simplejson.dumps(root.toDict())})
    return JsonResponse({
        'coauthors':root.toDict()
    })

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
    return JsonResponse({'coauthors': root.toDict()})
