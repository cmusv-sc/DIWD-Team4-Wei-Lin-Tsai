from django.http import JsonResponse
from data_2015_fall.models import *
from neomodel import db


def get_citations(request, name):
    query = "match (n1)-[:CITED]->(n2) where n1.title='%s' return n2" % (name)
    results, meta = db.cypher_query(query)
    return JsonResponse({"papers": [p.toDict() for p in [Article.inflate(row[0]) for row in results]] })
