# 18656-final
18656-final


slack: https://18656-final.slack.com

# Install

requirement:
  python: 2.7 (2.7.6 suggested)

- Install virtualenv

  pip install virtualenv

- Setup env

  virtualenv env

- Activate env

  source env/bin/activate

- Install the requirements

  pip install -r requirements.txt

# Load DBLP into Neo4j

requirement:
  maven

- Clean and Compile

  cd dblp-loader

  mvn clean && mvn compile

- Download dblp.xml file at http://dblp.uni-trier.de/xml/ and extract to dblp-loader/

- Run DBLP parser
  
  mvn exec:java -Dexec.mainClass="edu.cmu.sv.neo4j.Parser" -Dexec.cleanupDaemonThreads=false

- Neo4j configuration

  Set database location to dblp-loader/target/neo4j-dblp/

  Start neo4j and set password to "123456" at http://127.0.0.1:7474/

# Run Django Web App

- Activate env

  source env/bin/activate

- Run server

  cd mysite

  python manage.py runserver

  check http://127.0.0.1:8000/
