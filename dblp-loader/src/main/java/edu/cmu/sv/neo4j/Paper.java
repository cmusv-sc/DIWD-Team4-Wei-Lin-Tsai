package edu.cmu.sv.neo4j;
import java.util.*;


public class Paper {
	public Long id;
    public String key;
    public String title;
    public String booktitle;
    public String journal;
    public String volume;
    public Integer year;
    public Set<String> authors;
    public Set<String> citations;
    
    public Paper(){
        authors = new HashSet<>();
        citations = new HashSet<>();
    }

    @Override
    public String toString(){
        return key+" "+title+" "+booktitle+" "+year+" "+authors.toString();
    }
}
