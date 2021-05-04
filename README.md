# Development

1. Clone the Git repository https://github.com/david-fisher/320-S21-Track1. (The name "EthiSim" will be used  throughout this document to refer to this parent directory, but any name can be used in the  actual implementation).
2. Replace .env file with specified parameters
3. Get localhost-shiboleth from slack and place it within the apache-server. This folder contains files which override shibboleth files found in the base image. These files are setup to allow the host to run only on ethisim1.cs.umass.edu.  These updated files allow the dev to run on a localhost.


### How to use docker-compose to build and run the web application

#### Preamble: 
When Docker compose creates a container, it will first check to see if it can use images already in the local machine's cache. Thus when pulling new code to your local machine, you must ensure that all the images are new as well, and you are not using old images with new code. We can check all our current images in Docker using the command _docker images_. You will see that each Docker image has an associated **IMAGE ID**. To remove a specific image use the command _docker image rmi **_IMAGE_ID_**, where **IMAGE_ID** should be replaced with the image ID of the image you wish to remove. To remove all images on your local machine, use the command **docker rmi $(docker image -a -q)**. **WARNING**: This command will remove ALL images, meaning even those not associated with the Ethism repository. If you are unsure which images to remove, we recommend you clear all images in your cache associated with the Ethism repository.

Since the react apps' source code is mounted as a volume on the respective container, the frontend teams won't have to delete the frontend images everytime they change the code. However, the backend teams would have to do so, in case they want to run the backend server inside the docker container, since the backend server doesn't restart on file change. **Team Kubernators** will ensure to communicate if they update any Dockerfiles, in which case the images will have to be removed.

#### Steps:
1. After following the steps outlined above, type _docker-compose up -d_ in your terminal window. The _-d_ argument stands for _detach_ and ensures that the containers spin up in the background and the terminal instance can be further used to run other commands.
2. Since we have 3 different frontend components configured in one docker-compose file, there's a possibility, albeit remote, that if we run _docker-compose up -d_, we end up getting a timeout error for the frontend services. To remedy that, restart docker and paste these 2 commands in your terminal window:
      ###### _export DOCKER_CLIENT_TIMEOUT=120_
      ###### _export COMPOSE_HTTP_TIMEOUT=120_

      The default timeout value is 60 and these commands will double it. The timeout value might need to be adjusted to an even higher value depending on your system. 
      Run _docker-compose up -d_ again.

#### The following is a list of all the containers that are run after performing the steps outlined above along with their port mappings

1. **frontend-landing-page** - this container can be accessed on http at http://localhost:3007, if using in conjunction with the **shibd** container, it should be accessed on https at https://localhost
2. **frontend-editor** - this container can be accessed on http at http://localhost:3009, if using in conjunction with the **shibd** container, it should be accessed on https at https://localhost/editor
3. **frontend-simulator** - this container can be accessed on http at http://localhost:3002, if using in conjunction with the **shibd** container, it should be accessed on https at https://localhost/simulator
4. **backend-editor** - this container can be accessed on http at http://localhost:8001, if using in conjunction with the **shibd** container, it should be accessed on https at https://localhost:8000
5. **backend-simulator** - this container can be accessed on http at http://localhost:7001, if using in conjunction with the **shibd** container, it should be accessed on https at https://localhost:7000
6. **shibd** - this container runs the customized version of the apache server that is configured to work with shibboleth. The base image for this container resides in the _ikhurana/kbtesting:apache_. However, as mentioned earlier, the shibboleth configuration files present in the base image allow shibboleth to run only on _ethisim1.cs.umass.edu_ host. Those configuration files, along with a few other apache configuration files that are provided to us by Team Atlas and are responsible for handling proxy passes from https to http as well as redirection, are overwritten with the ones present in the apache_server directory in the project. This container effectively acts as an authentication middleware and guards the routes that need to be protected as specified in the requirements. This container can be stopped in case a developer needs to disable https and/or shibboleth by typing in _docker stop shibd_ in their terminal window. In that case, the other containers will have to be accessed using their http urls. 

# Production
 #### Preamble:
 Running the bundled software in a production environment requires a custom Apache+Shibboleth image that is used as a base image for the container that runs all different facets of the software. For the demo, the base image will be pulled from Dockerhub where it resides inside **_ikhurana/kbtesting_** repository under the name **_apache_**. **_Team Kubernators_** will provide all the files necessary for the creation of the base image and outline steps that need to performed to successfully use this base image to run the container in the production environment.
 
 #### Steps:
 Choose a directory to clone the repo
 Clone the Git repository https://github.com/david-fisher/320-S21-Track1. (The name "EthiSim" will be used  throughout this document to refer to this parent directory, but any name can be used in the  actual implementation).
Create a directory named "configuration" under the /EthiSim directory.
Copy the directories "conf" and "conf.d" from the original path /etc/httpd to the /EthiSim/configuration directory.
Copy the file "hosts" from the original path /etc/hosts to the /EthiSim/configuration Directory.
Copy the file "security:shibboleth.repo" from the original path /etc/yum.repos.d to the  /EthiSim/configuration directory.
Copy the directory "shibboleth" from the original path /etc/shibboleth to the /EthiSim/configuration directory.
(Optional) Create a file named .htaccess in order to override the Apache routing with React routing. If the user does not want to override the Apache routing, then lines 10 and 11  (those that start with "COPY /.htaccess") from Dockerfile should be commented out with a "#" at the beginning of those lines.
Run the command "docker build -t <repository_name>:<image_name> -f Dockerfile-base." where <repository_name> and <image_name> should be changed to the user's desired repository name and image name respectively. This command will build the Docker Image.
Run the command "docker push <repository_name>:<image_name>" where <repository_name> and <image_name> should be identical to those in Step 9. This command will push the image to Docker Hub.
Open the Dockerfile and replace the first line with "FROM <repository_name>:<image_name>" where <repository_name> and <image_name> should be identical to those in Steps 9 and 10.
Create a directory named "ssl" under the /EthiSim directory.
Copy all of the necessary SSL certificates to the /EthiSim/ssl directory.
Open the "Dockerfile" file and update the source for the COPY commands in lines 5, 6, and 7 with the names of the SSL certificates placed in the /EthiSim/ssl directory at Step 13.
The EthiSim software will now be up and running at the url specified in the docker-compose-production.yml file



In order to edit the dockerfile 
If the default base image repo is not used, the FROM command should be updated with the base image repo to use.
Open the dockerfile of the project container
Add ssl protocol keys for https
Edit .htaccess file
.env file
Replace parameters with your particular database




In order to edit the dockerfile 
If the default base image repo is not used, the FROM command should be updated with the base image repo to use.
Open the dockerfile of the project container
Add ssl protocol keys for https
Edit .htaccess file
.env file
Replace parameters with your particular database

 
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

