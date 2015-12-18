package edu.cmu.sv.neo4j;

import java.io.File;
import java.util.*;

import org.neo4j.graphdb.*;
import org.neo4j.unsafe.batchinsert.BatchInserter;
import org.neo4j.unsafe.batchinsert.BatchInserters;

public class GraphDb {
	public static final String DB_PATH = "target/neo4j-dblp";

	/* Properties names */
	public static final String KEY = "key";
	public static final String AUTHOR = "name";
	public static final String TITLE = "title";
    public static final String JOURNAL = "journal";
    public static final String YEAR = "year";
    public static final String VOLUME = "volume";

    /* Relationships */
    public static final String AUTHOR_RELATIONSHIP = "AUTHORED";
    public static final String COAUTHOR_RELATIONSHIP = "COAUTHORED";
    public static final String CITATION_RELATIONSHIP = "CITED";

	public static BatchInserter batchInserter;
	public static GraphDatabaseService graphDb;

	public static long createAuthor(String name) {
		Map<String, Object> properties = new HashMap<String, Object>();
		properties.put(AUTHOR, name);
		Label label = DynamicLabel.label("Author");
		long id = batchInserter.createNode(properties, label);
		return id;
	}

	public static long createPublication(Paper paper) {
		Map<String, Object> properties = new HashMap<String, Object>();
		properties.put(KEY, paper.key);
		if (paper.title != null && !paper.title.isEmpty()) {
			properties.put(TITLE, paper.title);
		}
		if (paper.journal != null && !paper.journal.isEmpty()) {
			properties.put(JOURNAL, paper.journal);
		}
		if (paper.volume != null && !paper.volume.isEmpty()) {
			properties.put(VOLUME, paper.volume);
		}
		if (paper.year != null) {
			properties.put(YEAR, paper.year);
		}
		Label label = DynamicLabel.label("Article");
		long id = batchInserter.createNode(properties, label);
		return id;
	}

	public static void createRelationship(long id1, long id2, String relation) {
		RelationshipType relationship = DynamicRelationshipType.withName(relation);
		batchInserter.createRelationship(id1, id2, relationship, null);
	}

	public static void createIndex() {
		Label label = DynamicLabel.label("Article");
		batchInserter.createDeferredSchemaIndex(label).on(YEAR).create();
	}

	@SuppressWarnings("deprecation")
	public static void open() {
		batchInserter = BatchInserters.inserter(new File(DB_PATH).getAbsolutePath());
	}

	public static void close() {
		batchInserter.shutdown();
	}
}
