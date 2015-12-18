from django.http import JsonResponse
from data_2015_fall.models import *
from neomodel import db


def get_top_k_cited_papers(request, name, year, k):
    query = "match (n1)-[:CITED]->(n2) " \
            "where n2.journal='%s' and n2.year=%s " \
            "return n2,count(n2) as count " \
            "order by count desc " \
            "limit %s" % (name, year, k)
    results, meta = db.cypher_query(query)
    return JsonResponse({"papers": [p.toDict() for p in [Article.inflate(row[0]) for row in results]] })
