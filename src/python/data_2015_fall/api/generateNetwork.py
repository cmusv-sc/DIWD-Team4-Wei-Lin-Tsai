from django.http import JsonResponse
from data_2015_fall.models import *
from neomodel import db


def get_citations(request, name):
    query = "match (n1)-[:CITED]->(n2) where n1.title='%s' return n2" % name
    results, meta = db.cypher_query(query)
    return JsonResponse({"papers": [a.toDict() for a in [Article.inflate(row[0]) for row in results]] })


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