from django.http import JsonResponse
from data_2015_fall.models import *
from neomodel import db
import json

class CitationNetworkResponse():
    def __init__(self, title):
        self.title = title
        self.citations = []

    def toDict(self):
        return {
            "title": self.title,
            "citations": [c.toDict() for c in self.citations],
        }


def get_citations(name):
    query = "match (n1)-[:CITED]->(n2) where n1.title='%s' return n2" % name
    results, meta = db.cypher_query(query)
    return [a.title for a in [Article.inflate(row[0]) for row in results]]


def get_citations_network(request, name):
    root = CitationNetworkResponse(name)
    root.citations = [CitationNetworkResponse(title) for title in get_citations(name)]
    for c in root.citations:
        c.citations = [CitationNetworkResponse(title) for title in get_citations(c.title)]
        for c2 in c.citations:
            c2.citations = [CitationNetworkResponse(title) for title in get_citations(c2.title)]
    return JsonResponse(root.toDict())


def get_authors(request, name):
    query = "match (n1)<-[:AUTHORED]-(n2) where n1.title='%s' return n2" % name
    results, meta = db.cypher_query(query)
    return JsonResponse({"authors": [a.toDict() for a in [Author.inflate(row[0]) for row in results]] })


def get_papers(request, name):
    query = "match (n1)-[:AUTHORED]->(n2) where n1.name='%s' return n2" % name
    results, meta = db.cypher_query(query)
    return JsonResponse({"papers": [a.toDict() for a in [Article.inflate(row[0]) for row in results]] })


def get_coauthors(request, name):
    query = "match (n1)-[:COAUTHORED]->(n2) where n1.name='%s' return n2" % name
    results, meta = db.cypher_query(query)
    return JsonResponse({"authors": [a.toDict() for a in [Author.inflate(row[0]) for row in results]] })