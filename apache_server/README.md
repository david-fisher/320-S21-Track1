### Note : The entire web application needs a web server to run on. We are going to use Apache for that. Since the machine we are working on is CentOS, working forward CentOS is to be assumed as the OS.

# Why did we choose Apache? 
1. Provides good support for Shibboleth as well as works well with Django(which the backend team is using to handle the api calls). 
	
2. Half of Shibboleth runs within the web server. (https://wiki.shibboleth.net/confluence/display/SP3/Apache)

3. For Apache, this half is implemented in a module which has the ability to process both a variety of Apache commands and rules specified in the service processor configuration and make sense of both.
	
4. This allows for a choice of approaches based on the need for native integration with Apache or for portability between web servers.
	
## How to install Apache:
1. Update the local Apache ```httpd``` package index to reflect the latest upstream changes:

	```sudo yum update httpd```
	
2. Run this command to install Apache:

	```yum install httpd.x86_64```
	
## How to activate Apache:
1. To start the Apache service:

	```systemctl start httpd```
	
2. Set the Apache service to start when the system boots:

	```systemctl enable httpd```
	
## How to verify Apache:
1. To display information about Apache, and verify it’s currently running:

	```systemctl status httpd```
	
You will see an ```active``` status when Apache is running

	Redirecting to /bin/systemctl status httpd.service
	● httpd.service - The Apache HTTP Server
	   Loaded: loaded (/usr/lib/systemd/system/httpd.service; enabled; vendor preset: disabled)
	   Active: active (running) since Wed 2019-02-20 01:29:08 UTC; 5s ago
	     Docs: man:httpd(8)
		   man:apachectl(8)
	 Main PID: 1290 (httpd)
	   Status: "Processing requests..."
	   CGroup: /system.slice/httpd.service
		   ├─1290 /usr/sbin/httpd -DFOREGROUND
		   ├─1291 /usr/sbin/httpd -DFOREGROUND
		   ├─1292 /usr/sbin/httpd -DFOREGROUND
		   ├─1293 /usr/sbin/httpd -DFOREGROUND
		   ├─1294 /usr/sbin/httpd -DFOREGROUND
		   └─1295 /usr/sbin/httpd -DFOREGROUND
	...

	
## How to configure Apache:
In a standard installation, CentOS 7 is set to prevent traffic to Apache

1. Modify your firewall to allow connections on these ports using the following commands:

	```firewall-cmd ––permanent ––add-port=80/tcp```
	
	```firewall-cmd ––permanent ––add-port=443/tcp```
	
2. Once these complete successfully, reload the firewall to apply the changes with the command:

	```firewall-cmd ––reload```	

## Some important Apache Commands:

To stop Apache Service: 
	```systemctl stop httpd```
	
To prevent or disable Apache from starting when the system boots: 
	```systemctl disable httpd```
	
Re-enable Apache at boot: 
	```systemctl enable httpd```
	
To start the Apache service:
	```systemctl start httpd```
	
To Restart Apache and apply any changes: 
	```systemctl restart httpd```





