
import os
os.environ['NEO4J_REST_URL'] = 'http://neo4j:123456@localhost:7474/db/data/'

from data_2015_fall.models import *
from data_2015_fall.views import findCoAuthorsMultiLevel_


def mockData():
    users = Author.create(
    {'name':'wei'},
    {'name':'jerry'},
    {'name':'zack'},
    {'name':'weilin cai'}
    )

    pubs = Article.create(
    {'title':'pub1', 'journal':'IEEE XXX', 'year' : 2015, 'volumn': 10},
    {'title':'pub2', 'journal':'IEEE XXX', 'year' : 2015, 'volumn':15},
    {'title':'pub3', 'journal':'IEEE XXX', 'year' : 2015, 'volumn':15},
    {'title':'pub4', 'journal':'IEEE XXX', 'year' : 2015, 'volumn':15},
    )
    for user in users:
        user.save()
    for pub in pubs:
        pub.save()


    users[0].articles.connect(pubs[0])
    users[0].articles.connect(pubs[1])
    users[1].articles.connect(pubs[0])
    users[1].articles.connect(pubs[2])
    users[2].articles.connect(pubs[1])
    users[2].articles.connect(pubs[3])
    users[3].articles.connect(pubs[2])
    users[3].articles.connect(pubs[3])


# mockData()
print findCoAuthorsMultiLevel_(1, "wei").toDict()
print findCoAuthorsMultiLevel_(2, "wei").toDict()
