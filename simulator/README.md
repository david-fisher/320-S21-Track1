# How to run each component of EthiSim locally
This is the repository containing code for both the front-end and back-end for the simulator part of EthiSim. This README provides instruction on how to install and setup both the front-end and back-end in order to get the software running.

## **Preliminary**

### **Frontend (React JS)**
1. Download node.js version 12.18.4 and npm https://www.npmjs.com/get-npm

### **Backend (Django REST framework)**

#### On MAC
1. Install python3 https://www.python.org/downloads/ 
2. sudo pip3 install pipenv (do it globally)

#### On WINDOWS
1. https://www.python.org/downloads/ (Checkmark all optional features, add Python to environment variables)

### **Database (PostgreSQL)**
We will be developing using CSCF database servers and their credentials. 
One can develop locally by following these instructions.

0. Make sure you can python https://www.python.org/downloads/  and postgres https://www.postgresql.org/download/ installed on your local machine.

1. Setup your local POSTGRES database in creating your database, user, and password.
- You can use the following to guide on how you can setup your local POSTGRES DB: https://medium.com/@rudipy/how-to-connecting-postgresql-with-a-django-application-f479dc949a11

2. Connect local POSTGRES database to Django application
- Navigate to ./simulator/simulator_backend/simulator_backend/ and ./editor/backend/lead directory and add .env files with the following environment variables:

![environment variables](./simulator/steminist_simulator_backend/img/environment_variables.png)

3. Install dependencies, Follow [Simulator backend instructions](#backend).
```
pip install -r requirements.txt or pip3 install -r requirements.txt 
```

4. Apply migrations to your local DB.
- Navigate to ./simulator_backend and run the following command:
```
python manage.py migrate or py install -r requirements.txt 
```

5. Seed the database(add initial data).
- In the same directory as above, run the following command:
```
python manage.py loaddata data/dump.json or py manage.py loaddata data/dump.json
```

6. Run server.
- In the same directory as above, run the following command:
```
python manage.py runserver or py manage.py runserver
```

7. Voila. You can now interact with our API by making the appropriate API calls.
- Downlaod [DBeaver](https://dbeaver.io/) as a database GUI 
- Checkout this [link](https://docs.google.com/document/d/1mPsGafx3xefBldeQFl33UPGe8SpDAjI49Z4wJNDqltI/edit?usp=sharing) for our latest API documentation.
- Checkout this [link](https://www.getpostman.com/collections/d4f0f1fcd253d359e834) for our POSTMAN collection.

### If you run into errors with Postgres, it will be helpful to drop the database and start from scratch:
1. Login as a postgres superuser with the following command and type in the superuser's password(created when you first installed Postgres) when prompted.
There is more than 1 way to do this step.
```
psql -U postgres
```
2. Drop simulator_backend database and create it again.
```
DROP DATABASE simulator_backend;
CREATE DATABASE simulator_backend;
```
3. Grant all privileges to your postgres user.
```
GRANT ALL PRIVILEGES ON DATABASE simulator_backend TO gerrygan;
```
4. Exit postgres command line.
```
\q
```
5. Continue from Step 4 above(Apply migrations to your local DB).

## **How to run EthiSim Landing Page**
The landing page only has a frontend component.

### Frontend
1. `cd landing page/welcome-login`
2. Run `npm i` inside terminal/gitbash, this should install all dependencies.
3. Run `npm start` inside the terminal

The page should open in a browser in localhost:3006 when its ready. <br />
If it does not open up by itself, type [http://localhost:3006/home] and it should open

## **How to run EthiSim Simulator**
The Editor has a frontend, backend, and database component.

### **Frontend**
1. `cd simulator/frontend`
2. Run `npm i` inside terminal/gitbash, this should install all dependencies.
3. Run `npm start` inside the terminal

The page should open in a browser in localhost:3000 when its ready.
If it does not open up by itself, type [http://localhost:3000] and it should open

You are done, but note that you will need to have the back-end and database running as well for the front-end to see current scenarios on the dashboard.

### **Backend**

#### On MAC
1. `cd simulator/steminist_simulator_backend`
2. `pipenv shell`
3. `pipenv install -r requirements.txt`
4. `cd simulator_backend` (simulator/steminist_simulator_backend/simulator_backend)
5. `python3 manage.py runserver`

#### How to run server on MAC
1. `cd simulator/steminist_simulator_backend`
2. `pipenv shell`
3. `cd simulator_backend` (simulator/steminist_simulator_backend/simulator_backend)
4. `python3 manage.py runserver`

#### On WINDOWS
1. `cd simulator/steminist_simulator_backend`
2. `pip install -r requirements.txt` (If you run into errors, insert py -m before each command)
3. `cd simulator_backend` (simulator/steminist_simulator_backend/simulator_backend)
4. `python manage.py runserver` (or `py manage.py runserver`)

#### How to run server on Windows
1. `cd editor/backend/lead`
2. `py -m manage.py runserver`

### **Database**
Follow [Database (PostgreSQL) instructions](#database-postgresql)
