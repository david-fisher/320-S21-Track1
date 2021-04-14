### Note : The entire web application needs a web server to run on. We are going to use Apache for that. Since the machine we are working on is CentOS, working forward CentOS is to be assumed as the OS.

# What is an Apache web server ? 
1. Apache is an open-source web server that powers about 40% of websites around the world.
2. The most popular HTTP client on the web
3. Able to handle large amounts of traffic with minimal configuration
4. Can accept and route specific traffic to certain ports and domains based on specific address-port combination requests.
5. Efficient and high scalability
6. **Why Apache ?** 

	a. Provides good support for Shibboleth as well as works well with Django(which the backend team is using to handle the api calls). 
	
	b. Half of Shibboleth runs within the web server. (https://wiki.shibboleth.net/confluence/display/SP3/Apache)

	c. For Apache, this half is implemented in a module which has the ability to process both a variety of Apache commands and rules specified in the service processor configuration and make sense of both.
	
	d. This allows for a choice of approaches based on the need for native integration with Apache or for portability between web servers.
	
## Installing Apache:
1. Run this command to install Apache:
	yum install httpd.x86_64
2. 
