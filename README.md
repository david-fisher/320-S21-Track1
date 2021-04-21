# How to use docker-compose to build and run the web application

1. After cloning the repo to your local machine, update the .env file in the root directory of the project with the
configuration settings of your database
2. Since we have 3 different frontend components configured in one docker-compose file, if we run docker-compose up, we
end up getting a timeout error. To remedy that, restart docker and paste these 2 commands in your terminal window:
###### export DOCKER_CLIENT_TIMEOUT=120
###### export COMPOSE_HTTP_TIMEOUT=120
3. When Docker compose creates a container, it will first check to see if it can use images already in the local machine's cache. Thus when pulling new code to your         local machine, you must ensure that all the images are new as well, and you are not using old images with new code. We can check all our current images in Docker using the       command "docker image ls". You will see that each Docker image has an associated IMAGE ID. To remove a specific image use the command "docker image rm IMAGEID", where           IMAGEID should be replaced by the image ID of the image you wish to remove. To remove all images on your local machine, use the command "docker rmi $(docker image -a -q)".       WARNING: This command will remove ALL images, meaning even those not associated with the Ethism repository. If you are unsure which images to remove, we recommend you clear     all images in your cache associated with the Ethism repository.
4. Run docker-compose up
5. Once every component is built, the landing page will be accessible at http://localhost:3006

## File structure for this track

###### simulator
1. frontend
2. backend
###### editor
1. frontend
2. backend
###### landing page
1. frontend

NOTE: All of the folders may not have a back end due to last years structure

## How to get started
Each branch/folder has a corresponding README file containing instructions on how to
operate and run each part of the structure. <br />
Follow the instructions there.


## If you wish to run everything at once
###### Run the landing page
1. Run back end(if applicable)
2. Run front end(if applicatble)

###### Run the simulator
1. Run back end(if applicable)
2. Run front end(if applicatble)

###### Run the landing page
1. Run back end(if applicable)
2. Run front end(if applicatble)

###### When done running all in the terminal
Go to where the landing pages has been open on your browser [http://localhost:3006/home]. <br />
You should be able to traverse to Simulator, Editor, and Landing page all from there.
