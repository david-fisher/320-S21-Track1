# Instructions for running backend

0. Make sure you can python and postgres installed on your local machine.

1. Setup your local POSTGRES database
- You can use the following to guide on how you can setup your local POSTGRES DV: https://medium.com/@rudipy/how-to-connecting-postgresql-with-a-django-application-f479dc949a11

2. Connect local POSTGRES database to Django application
- Navigate to ./simulator_backend/simulator_backend/ directory and add a .env file with the following environment variables:

![environment variables](./img/environment_variables.png)

3. Install dependencies
```
pip install -r requirements.txt
```

4. Apply migrations to your local DB.
- Navigate to ./simulator_backend and run the following command:
```
python manage.py migrate
```

5. Seed the database(add initial data).
- In the same directory as above, run the following command:
```
python manage.py loaddata 01_intro_pages.json 02_reflection_pages.json 03_action_pages.json 04_stakeholder_page.json
```

6. Run server.
- In the same directory as above, run the following command:
```
python manage.py runserver
```

7. Voila. You can now interact with our API by making the appropriate API calls.
- Downlaod [DBeaver](https://dbeaver.io/) as a database GUI 
- Checkout this [link](https://docs.google.com/document/d/1mPsGafx3xefBldeQFl33UPGe8SpDAjI49Z4wJNDqltI/edit?usp=sharing) for our latest API documentation.
- Checkout this [link](https://www.getpostman.com/collections/d4f0f1fcd253d359e834) for our POSTMAN collection.


## If you run into errors with Postgres, it will be helpful to drop the steminist_backend database and start from scratch:
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
GRANT ALL PRIVILEGES ON DATABASE simulator_backend TO [user];
```
4. Exit postgres command line.
```
\q
```
5. Continue from Step 4 above(Apply migrations to your local DB).
