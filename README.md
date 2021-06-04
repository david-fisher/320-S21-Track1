# Development using Docker

1. Clone the Git repository https://github.com/david-fisher/320-S21-Track1. (The name "EthiSim" will be used  throughout this document to refer to this parent directory, but any name can be used in the  actual implementation).
2. Replace .env file with specified parameters
3. Get localhost-shiboleth from slack and place it within the apache-server. This folder contains files which override shibboleth files found in the base image. These files are setup to allow the host to run only on ethisim1.cs.umass.edu.  These updated files allow the dev to run on a localhost.


## How to use docker-compose to build and run the web application

### Preamble: 
When Docker compose creates a container, it will first check to see if it can use images already in the local machine's cache. Thus when pulling new code to your local machine, you must ensure that all the images are new as well, and you are not using old images with new code. We can check all our current images in Docker using the command _docker images_. You will see that each Docker image has an associated **IMAGE ID**. To remove a specific image use the command _docker image rmi **_IMAGE_ID_**, where **IMAGE_ID** should be replaced with the image ID of the image you wish to remove. To remove all images on your local machine, use the command **docker rmi $(docker image -a -q)**. **WARNING**: This command will remove ALL images, meaning even those not associated with the Ethism repository. If you are unsure which images to remove, we recommend you clear all images in your cache associated with the Ethism repository.

Since the react apps' source code is mounted as a volume on the respective container, the frontend teams won't have to delete the frontend images everytime they change the code. However, the backend teams would have to do so, in case they want to run the backend server inside the docker container, since the backend server doesn't restart on file change. **Team Kubernators** will ensure to communicate if they update any Dockerfiles, in which case the images will have to be removed.

### Steps:
1. After following the steps outlined above, type _docker-compose up -d_ in your terminal window. The _-d_ argument stands for _detach_ and ensures that the containers spin up in the background and the terminal instance can be further used to run other commands.
2. Since we have 3 different frontend components configured in one docker-compose file, there's a possibility, albeit remote, that if we run _docker-compose up -d_, we end up getting a timeout error for the frontend services. To remedy that, restart docker and paste these 2 commands in your terminal window:
      ###### _export DOCKER_CLIENT_TIMEOUT=120_
      ###### _export COMPOSE_HTTP_TIMEOUT=120_

      The default timeout value is 60 and these commands will double it. The timeout value might need to be adjusted to an even higher value depending on your system. 
      Run _docker-compose up -d_ again.

### The following is a list of all the containers that are run after performing the steps outlined above along with their port mappings

1. **frontend-landing-page** - this container can be accessed on http at http://localhost:3007, if using in conjunction with the **shibd** container, it should be accessed on https at https://localhost
2. **frontend-editor** - this container can be accessed on http at http://localhost:3009, if using in conjunction with the **shibd** container, it should be accessed on https at https://localhost/editor
3. **frontend-simulator** - this container can be accessed on http at http://localhost:3002, if using in conjunction with the **shibd** container, it should be accessed on https at https://localhost/simulator
4. **backend-editor** - this container can be accessed on http at http://localhost:8001, if using in conjunction with the **shibd** container, it should be accessed on https at https://localhost:8000
5. **backend-simulator** - this container can be accessed on http at http://localhost:7001, if using in conjunction with the **shibd** container, it should be accessed on https at https://localhost:7000
6. **shibd** - this container runs the customized version of the apache server that is configured to work with shibboleth. The base image for this container resides in the _ikhurana/kbtesting:apache_. However, as mentioned earlier, the shibboleth configuration files present in the base image allow shibboleth to run only on _ethisim1.cs.umass.edu_ host. Those configuration files, along with a few other apache configuration files that are provided to us by Team Atlas and are responsible for handling proxy passes from https to http as well as redirection, are overwritten with the ones present in the apache_server directory in the project. This container effectively acts as an authentication middleware and guards the routes that need to be protected as specified in the requirements. This container can be stopped in case a developer needs to disable https and/or shibboleth by typing in _docker stop shibd_ in their terminal window. In that case, the other containers will have to be accessed using their http urls. 

# How to run each component of EthiSim locally

## **Preliminary:**

### **Frontend (React JS)**:
1. Download node.js version 12.18.4 and npm https://www.npmjs.com/get-npm

### **Backend (Django REST framework)**:
#### On MAC
1. Install python3 https://www.python.org/downloads/ 
2. sudo pip3 install pipenv (do it globally)
#### On WINDOWS
1. https://www.python.org/downloads/ (Checkmark all optional features, add Python to environment variables)

### **Database (PostgreSQL)**:
We will be developing using CSCF database servers and their credentials. 
One can develop locally by following these instructions.

0. Make sure you can python https://www.python.org/downloads/  and postgres https://www.postgresql.org/download/ installed on your local machine.

1. Setup your local POSTGRES database in creating your database, user, and password.
- You can use the following to guide on how you can setup your local POSTGRES DB: https://medium.com/@rudipy/how-to-connecting-postgresql-with-a-django-application-f479dc949a11

2. Connect local POSTGRES database to Django application
- Navigate to ./simulator/simulator_backend/simulator_backend/ and ./editor/backend/lead directory and add .env files with the following environment variables:

![environment variables](./simulator/steminist_simulator_backend/img/environment_variables.png)

3. Install dependencies
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
- Checkout this [link](https://docs.google.com/document/d/1mPsGafx3xefBldeQFl33UPGe8SpDAjI49Z4wJNDqltI/edit?usp=sharing) for our latest API documentation.
- Checkout this [link](https://www.getpostman.com/collections/d4f0f1fcd253d359e834) for our POSTMAN collection.

### If you run into errors with Postgres, it will be helpful to drop the steminist_backend database and start from scratch:
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
## **How to run EthiSim Landing Page**:

The landing page only has a frontend component.
### Frontend:
1. CD into landing page/welcome-login
2. Run [ npm i ] inside terminal/gitbash, this should install all dependencies.
3. Run [ npm start ] inside the terminal

The page should open in a browser in localhost:3006 when its ready. <br />
If it does not open up by itself, type [http://localhost:3006/home] and it should open

## **How to run EthiSim Editor**:
The Editor has a frontend, backend, and database component.

### **Frontend**:
1. CD into the editor/frontend/ethisim
2. Run [ npm i ] inside terminal/gitbash, this should install all dependencies.
3. Run [ npm start ] inside the terminal

The page should open in a browser in localhost:3000 when its ready.
If it does not open up by itself, type [http://localhost:3000] and it should open

You are done, but note that you will need to have the back-end and database running as well for the front-end to see current scenarios on the dashboard.

### **Backend**:
#### On MAC
1. `cd editor/backend`
2. `pipenv shell`
3. `pipenv install -r requirements.txt`
4. `cd lead` (editor/backend/lead)
5. `python3 manage.py runserver`

#### How to run server on MAC:
1. `cd editor/backend`
2. `pipenv shell`
3. `cd lead` (editor/backend/lead)
4. `python3 manage.py runserver`

#### On WINDOWS
1. `cd editor/backend` 
2. `pip install -r requirements.txt` (If you run into errors, insert py -m before each command)
3. `cd lead` (editor/backend/lead)
4. `python manage.py runserver` (or `py manage.py runserver`)

#### How to run server on Windows:
1. `cd editor/backend/lead`
2. `py -m manage.py runserver`

### **Database**
Follow https://github.com/david-fisher/320-S21-Track1#database-postgresql

## **How to run EthiSim Simulator**:
The Editor has a frontend, backend, and database component.

### **Frontend**:
1. CD into the simulator/frontend
2. Run [ npm i ] inside terminal/gitbash, this should install all dependencies.
3. Run [ npm start ] inside the terminal

The page should open in a browser in localhost:3000 when its ready.
If it does not open up by itself, type [http://localhost:3000] and it should open

You are done, but note that you will need to have the back-end and database running as well for the front-end to see current scenarios on the dashboard.

### **Backend**:
#### On MAC
1. `cd simulator/steminist_simulator_backend`
2. `pipenv shell`
3. `pipenv install -r requirements.txt`
4. `cd simulator_backend` (simulator/steminist_simulator_backend/simulator_backend)
5. `python3 manage.py runserver`

#### How to run server on MAC:
1. `cd simulator/steminist_simulator_backend`
2. `pipenv shell`
3. `cd simulator_backend` (simulator/steminist_simulator_backend/simulator_backend)
4. `python3 manage.py runserver`

#### On WINDOWS
1. `cd simulator/steminist_simulator_backend`
2. `pip install -r requirements.txt` (If you run into errors, insert py -m before each command)
3. `cd simulator_backend` (simulator/steminist_simulator_backend/simulator_backend)
4. `python manage.py runserver` (or `py manage.py runserver`)

#### How to run server on Windows:
1. `cd editor/backend/lead`
2. `py -m manage.py runserver`

### **Database**
Read https://github.com/david-fisher/320-S21-Track1#database-postgresql

# Production
 #### Preamble:
 Running the bundled software in a production environment requires a custom Apache+Shibboleth image that is used as a base image for the container that runs all different facets of the software. For the purpose of Demo or Die, the base image will be pulled from Dockerhub where it resides inside **_ikhurana/kbtesting_** repository under the name **_apache_**. **_Team Kubernators_** will provide all the files necessary for the creation of the base image as well as outline steps that need to be performed to successfully use this base image to run the container in the production environment. This guide assumes that you have successfully installed and configured Apache and Shibboleth on your production server.
 
 #### Steps:
1. Clone the Git repository https://github.com/david-fisher/320-S21-Track1 to your local machine.
2. Copy the Dockerfile and the docker-compose.yml file from the root directory of the project to any directory on your production server. (The name "EthiSim" will be used  throughout this document to refer to this parent directory, but any name can be used in the  actual implementation).

##### The following steps need to performed on the production server
3. Create a directory named "configuration" under the /EthiSim directory.
4. Copy the directories "conf" and "conf.d" from the original path /etc/httpd to the /EthiSim/configuration directory.
5. Copy the file "hosts" from the original path /etc/hosts to the /EthiSim/configuration Directory.
6. Copy the file "security:shibboleth.repo" from the original path /etc/yum.repos.d to the  /EthiSim/configuration directory.
7. Copy the directory "shibboleth" from the original path /etc/shibboleth to the /EthiSim/configuration directory.
8. (Optional) Create a file named .htaccess in order to override the Apache routing with React routing. If the user does not want to override the Apache routing, then lines 10 and 11  (those that start with "COPY /.htaccess") in the Dockerfile present in the /EthiSim directory should be commented out.

##### The following steps give a quick rundown on how to create the base image. These steps also need to be performed on the server. For the purpose of Demo or Die, _Team Kubernators_ will be using the base image stored on Dockerhub at the location mentioned earlier.

1. Run the command "**_docker build -t <repository_name>:<image_name> -f Dockerfile-base ._**" where **_<repository_name>_** and **_<image_name>_** should be changed to the user's desired repository name and image name respectively. This command will build the Docker Image.
2. Run the command "**_docker push <repository_name>:<image_name>_**" where _**<repository_name>**_ and **_<image_name>_** should be identical to those in the step above. This command will push the image to Docker Hub.
3. Open the Dockerfile and replace the first line with "**_FROM <repository_name>:<image_name>_**" where **_<repository_name>_** and **_<image_name>_** should be identical to those in the above steps. 
4. Create a directory named "**_ssl_**" under the _**/EthiSim**_ directory.
5. Copy all of the necessary SSL certificates to the _**/EthiSim/ssl**_ directory.
6. Open the **_Dockerfile_** file and update the source for the **COPY** commands in lines 5, 6, and 7 with the names of the SSL certificates placed in the _**/EthiSim/ssl**_ directory.
7. Open the **_docker-compose.yml_** file located in the **_/ethiSim_** directory and update the environment variables that being passed to the container with the appropriate credentials.

After performing all of the steps mentioned above, type **_docker-compose up -d_** on your production server from the **_/EthiSim_** directory to run the bundled software.

# CI/CD
#### Preamble
This github repository has a continuous integration workflow configured in the form of a github action. This workflow builds the software and deploys it on a production enviroment to allow for developers to see how their changes will look when the entire application is up and running. This workflow runs automatically when there is a merge to the main branch of this repository, but it can also be triggered manually from the actions tab. The workflow is contained in the .github folder at the root of this repo.  The workflow performs the following steps when it is run:

1. Check to see if any instance of this workflow is running, if yes wait for already running workflows to finish
2. Build docker images for each component of the software (simulator frontend/backend, editor frontend/backend, and landing-page)
3. Push those built images to dockerhub to the repository dacollins/ethisim
4. Log in to the production server
5. Stop the currently running application and remove its container
6. Pull newly built images from dacollins/ethisim
7. Rebuild the application with the updated images

#### Note
##### This is the file structure for this track

##### simulator
1. frontend
2. backend
##### editor
1. frontend
2. backend
##### landing page
1. frontend

#### Not all the folders may not have a back end due to last years structure

#### How to get started
Each branch/folder has a corresponding README file containing isntructions on how to
operate and run each part of the structure. <br />
Follow the instructions there


##### If you wish to run everything at once
###### Run the landing page
1. Run back end(if applicable)
2. Run front end(if applicatble)

###### Run the simulator
1. Run back end(if applicable)
2. Run front end(if applicatble)

###### Run the editor
1. Run back end(if applicable)
2. Run front end(if applicatble)

