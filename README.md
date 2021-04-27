# Development

1. Clone the Git repository https://github.com/david-fisher/320-S21-Track1. (The name "EthiSim" will be used  throughout this document to refer to this parent directory, but any name can be used in the  actual implementation).
2. Replace .env file with specified parameters
3. Get localhost-shiboleth from slack and place it within the apache-server. This folder contains files which override shibboleth files found in the base image. These files are setup to allow the host to run only on ethisim1.cs.umass.edu.  These updated files allow the dev to run on a localhost.


### How to use docker-compose to build and run the web application

1. After following the steps outlined above, type _docker-compose up -d_ in your terminal window. The _-d_ argument ensures that the containers spin up in the background and the terminal instance can be further used to run other commands.
2. Since we have 3 different frontend components configured in one docker-compose file, there's a possibility, albeit remote, that if we run _docker-compose up -d_, we end up getting a timeout error for the frontend services. To remedy that, restart docker and paste these 2 commands in your terminal window:
      ###### _export DOCKER_CLIENT_TIMEOUT=120_
      ###### _export COMPOSE_HTTP_TIMEOUT=120_

      The default timeout value is 60 and these commands will double it. The timeout value might need to be adjusted to an even higher value depending on your system. 
      Run _docker-compose up -d_ again.

### Once every component is built, the landing page will be accessible at http://localhost:3006

### Note
#This is the file structure for this track

###simulator
1. frontend
2. backend
####editor
1. frontend
2. backend
####landing page
1. frontend

### Not all the folders may not have a back end due to last years structure

### How to get started
Each branch/folder has a corresponding README file containing isntructions on how to
operate and run each part of the structure. <br />
Follow the instructions there


#If you wish to run everything at once
###Run the landing page
1. Run back end(if applicable)
2. Run front end(if applicatble)

###Run the simulator
1. Run back end(if applicable)
2. Run front end(if applicatble)

###Run the landing page
1. Run back end(if applicable)
2. Run front end(if applicatble)

###When done running all in the terminal
Go to where the landing pages has been open on your browser [http://localhost:3006/home]. <br />
You should be able to travere to Simulator, Editor, and Landing oage all from there 
