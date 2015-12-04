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

  source env/bin/activate (if you are using bash)

  csh env/bin/activate.csh (if you are using csh)

- Install the requirements

  pip install -r requirements.txt

# Load DBLP into Neo4j

requirement:
  maven and Java 1.8 (if you use 1.7, some code needs to be updated)

- Clean and Compile

  cd dblp-loader

  mvn clean && mvn compile

- Download dblp.xml file at http://dblp.uni-trier.de/xml/ and extract to dblp-loader/

- Run DBLP parser
  
  mvn exec:java -Dexec.mainClass="edu.cmu.sv.neo4j.Loader" -Dexec.cleanupDaemonThreads=false

- Neo4j configuration

  Set database location to dblp-loader/target/neo4j-dblp/

  Start neo4j and set password to "123456" at http://127.0.0.1:7474/

# Run Django Web App

- Activate env

  source env/bin/activate


- migrate
  
  python manage.py migrate

  You can find a file named "diwd.db" under mysite/mysite after migration

- create superuser

  python manage.py createsuperuser

- Run server

  cd mysite

  python manage.py runserver

  check http://127.0.0.1:8000/

  For admin site, check http://127.0.0.1:8000/admin  (login with the superuser you created)


# Using the django authentication system

  https://docs.djangoproject.com/en/1.9/topics/auth/default/#user-objects
