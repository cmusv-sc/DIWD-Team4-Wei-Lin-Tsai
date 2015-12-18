from neomodel import (StructuredNode, StringProperty, IntegerProperty, ArrayProperty,
    RelationshipTo, RelationshipFrom, Relationship)

# Create your models here.

class Article(StructuredNode):
    title = StringProperty()
    journal = StringProperty()
    year = IntegerProperty()
    volume = StringProperty()
    authors = RelationshipFrom('Author', 'AUTHORED')
    citations = Relationship('Article', 'CITED')

    def toDict(self):
        return {
            "title": self.title,
            "authors": [a.toDict() for a in self.authors],
            "journal": self.journal,
            "year": self.year,
            "volume": self.volume
        }
    def toDictTitleOnly(self):
        return {
            "title": self.title
        }   

class Author(StructuredNode):
    name = StringProperty()
    articles = RelationshipTo('Article', 'AUTHORED')
    coauthors = Relationship('Author', 'COAUTHORED')
    def __str__(self):
        # Call str function here since sometimes the object might not
        # found in the database...
        # Python sucks
        return "<Author: " + str(self.name) + ">"
    def __repr__(self):
        return "<Author: " + repr(self.name) + ">"

    def __hash__(self):
        """
        We use name of the author as the hash value
        """
        return hash(self.name)
    def __cmp__(self, other):
        return cmp(self.name, other.name)

    def toDict(self):
        return {
            "name": self.name
        }
