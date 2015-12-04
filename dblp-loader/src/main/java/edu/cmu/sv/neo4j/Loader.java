package edu.cmu.sv.neo4j;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class Loader {
    private static Map<String, Paper> allPublications = new HashMap<>();
    private Map<String, Long> allAuthors = new HashMap<>();

    public void createNodes() throws Exception {
    	for (Paper paper: allPublications.values()) {
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
    	Set<String> allRelationships = new HashSet<>();

		for (Paper paper: allPublications.values()) {
			// Create AUTHORED relationship
			for (String author: paper.authors) {
				long authorNodeId = allAuthors.get(author);
				if (!allRelationships.contains(paper.id + "->" + authorNodeId)) {
					allRelationships.add(paper.id + "->" + authorNodeId);
					GraphDb.createRelationship(paper.id, authorNodeId, GraphDb.AUTHOR_RELATIONSHIP);
				}
				if (!allRelationships.contains(authorNodeId + "->" + paper.id)) {
					allRelationships.add(authorNodeId + "->" + paper.id);
					GraphDb.createRelationship(authorNodeId, paper.id, GraphDb.AUTHOR_RELATIONSHIP);
				}
			}

			// Create CITED relationship
			for (String key: paper.citations) {
				if (allPublications.containsKey(key)) {
					Paper citation = allPublications.get(key);
					GraphDb.createRelationship(paper.id, citation.id, GraphDb.CITATION_RELATIONSHIP);
				}
			}
		}
    }

    public static void main(String args[]) {
        System.out.println("Loading XML file...");
        System.setProperty("entityExpansionLimit", "1000000");

        Parser parser = new Parser();
        try {
        	parser.parse(allPublications);
            System.out.println("Complete Loading " + parser.numRecords + " records into Neo4j.");
        } catch (Exception e) {
        	e.printStackTrace();
        }

		Loader loader = new Loader();
		GraphDb.open();
		try {
			loader.createNodes();
			loader.createRelationships();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			GraphDb.close();
		}
    }
}
