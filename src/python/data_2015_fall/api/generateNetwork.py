from django.http import JsonResponse
from data_2015_fall.models import *
from neomodel import db


class NetworkResponse():
    def __init__(self, name):
        self.name = name
        self.children = []

    def to_dict(self):
        return {
            "name": self.name,
            "children": [c.to_dict() for c in self.children],
        }


def get_citations(name):
    query = "match (n1)-[:CITED]->(n2) where n1.title='%s' return n2" % name
    results, meta = db.cypher_query(query)
    return [a.title for a in [Article.inflate(row[0]) for row in results]]


def get_citations_network(request, name):
    root = NetworkResponse(name)
    root.children = [NetworkResponse(title) for title in get_citations(name)]
    for c in root.children:
        c.children = [NetworkResponse(title) for title in get_citations(c.name)]
        for c2 in c.children:
            c2.children = [NetworkResponse(title) for title in get_citations(c2.name)]
    return JsonResponse(root.to_dict())


def get_authors(name):
    query = "match (n1)<-[:AUTHORED]-(n2) where n1.title={name} return n2"
    results, meta = db.cypher_query(query, {"name": name})
    return [a.name for a in [Author.inflate(row[0]) for row in results]]


def get_papers(name):
    query = "match (n1)-[:AUTHORED]->(n2) where n1.name={name} return n2"
    results, meta = db.cypher_query(query, {"name": name})
    return [a.title for a in [Article.inflate(row[0]) for row in results]]


def get_coauthors(request, name):
    query = "match (n1)-[:COAUTHORED]->(n2) where n1.name={name} return n2"
    results, meta = db.cypher_query(query, {"name": name})
    return JsonResponse({"authors": [a.toDict() for a in [Author.inflate(row[0]) for row in results]]})


def get_paper_author_network(request, name):
    root = NetworkResponse(name)
    root.children = [NetworkResponse(author) for author in get_authors(name)]
    for author in root.children:
        author.children = [NetworkResponse(title) for title in get_papers(author.name)]
        for paper in author.children:
            paper.children = [NetworkResponse(author) for author in get_authors(paper.name)]
    return JsonResponse(root.to_dict())