package edu.cmu.sv.neo4j;

import java.io.FileInputStream;
import java.util.*;

import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

public class Parser {
    private Map<String, Paper> allPublications;
    private Paper paper;
    private String content = null;
    private boolean isNewRecord = false;
    int numRecords = 0;
    
    public void parse(Map<String, Paper> allPublications) throws Exception {
        this.allPublications = allPublications;
        SAXParserFactory saxParserFac = SAXParserFactory.newInstance();
        SAXParser parser = saxParserFac.newSAXParser();
        SAXHandler handler = new SAXHandler();
        parser.parse(new FileInputStream("dblp.xml"), handler);
    }

    class SAXHandler extends DefaultHandler {
		@Override
		public void startElement(String uri, String localName, String qName, Attributes attributes) {
			if (numRecords < 10000) {
				switch (qName) {
				case "article":
				case "inproceedings":
					paper = new Paper();
					isNewRecord = true;
					paper.key = attributes.getValue("key");
				}
			}
		}

		@Override
		public void endElement(String uri, String localName, String qName) throws SAXException {
			if (isNewRecord) {
				switch (qName) {
				case "author":
					paper.authors.add(content);
					break;
				case "title":
					paper.title = content;
					break;
				case "booktitle":
					paper.booktitle = content;
					break;
				case "journal":
					paper.journal = content;
					break;
				case "volume":
					paper.volume = content;
					break;
				case "year":
					paper.year = Integer.parseInt(content);
					break;
				case "cite":
					paper.citations.add(content);
					break;
				case "article":
				case "inproceedings":
					numRecords++;
					isNewRecord = false;
					if (allPublications.containsKey(paper.key)) {
						System.out.println("Duplicate records for publications.");
					}
					allPublications.put(paper.key, paper);
				}
			}
		}

		@Override
		public void characters(char ch[], int start, int length) {
			if (isNewRecord) {
				content = new String(ch, start, length).trim();
			}
		}
    }
}
