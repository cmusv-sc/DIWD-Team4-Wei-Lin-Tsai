package edu.cmu.sv.neo4j;

import java.util.*;

public class Loader {
    private static Map<String, Paper> allPublications = new HashMap<>();
    private Map<String, Long> allAuthors = new HashMap<>();

    public void createNodes() throws Exception {
    	for (Map.Entry<String, Paper> entry: allPublications.entrySet()) {
    		Paper paper = entry.getValue();
			long titleNodeId = GraphDb.createPublication(paper);
			paper.id = titleNodeId;
			for (String author: paper.authors) {
				long authorNodeId;
				if (!allAuthors.containsKey(author)) {
					authorNodeId = GraphDb.createAuthor(author);
					allAuthors.put(author, authorNodeId);
				}
			}
    	}
    }

    public void createRelationships() {
    	Set<String> isCoauthor = new HashSet<>();;
		for (Map.Entry<String, Paper> entry: allPublications.entrySet()) {
			Paper paper = entry.getValue();
			// Create AUTHORED relationship
			for (String author: paper.authors) {
				long authorNodeId = allAuthors.get(author);
				GraphDb.createRelationship(paper.id, authorNodeId, GraphDb.AUTHOR_RELATIONSHIP);
				GraphDb.createRelationship(authorNodeId, paper.id, GraphDb.AUTHOR_RELATIONSHIP);
			}

			// Create COAUTHORED relationship
			for (String author1: paper.authors) {
				for (String author2: paper.authors) {
					long id1 = allAuthors.get(author1);
					long id2 = allAuthors.get(author2);
					if (id1 == id2 || isCoauthor.contains(id1+"->"+id2) || isCoauthor.contains(id2+"->"+id1)) {
						continue;
					} else {
						isCoauthor.add(id1+"->"+id2);
						isCoauthor.add(id2+"->"+id1);
						GraphDb.createRelationship(id1, id2, GraphDb.COAUTHOR_RELATIONSHIP);
						GraphDb.createRelationship(id2, id1, GraphDb.COAUTHOR_RELATIONSHIP);
					}
				}
			}

			// Create CITED relationship
			for (String citationKey: paper.citations) {
				if (allPublications.containsKey(citationKey)) {
					Paper citation = allPublications.get(citationKey);
					GraphDb.createRelationship(paper.id, citation.id, GraphDb.CITATION_RELATIONSHIP);
				}
			}
		}
    }

    public static void main(String args[]) {
        System.setProperty("entityExpansionLimit", "1000000");

        Parser parser = new Parser();
        try {
            System.out.println("Loading XML file...");
        	parser.parse(allPublications);
            System.out.println("Complete loading " + parser.numRecords + " records.");
        } catch (Exception e) {
        	e.printStackTrace();
        }

		Loader loader = new Loader();
		GraphDb.open();
		try {
			System.out.println("Inserting nodes into Neo4j....");
			loader.createNodes();
			System.out.println("Creating relationships...");
			loader.createRelationships();
			System.out.println("Finish.");
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			GraphDb.close();
		}
    }
}
