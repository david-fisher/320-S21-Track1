# Deploying Django on Apache
Django's primary deployment platform is WSGI (https://wsgi.readthedocs.io/en/latest/what.html). Once a minimal default WSGI configuration is created with **startproject**, a lightweight development Web server can be deployed by using **runserver** command. However, because this lightweight server has not gone through security audits or performance tests (which is gonna stay that way according to official django documentation https://docs.djangoproject.com/en/1.8/ref/django-admin/#runserver-port-or-address-port), this server should not be used in a production setting. 

For our project, we are going to be using Apache as the web server to host Django. To serve python, Apache has a module called mod_wsgi.

## Installing mod_wsgi
mod_wsgi package could be installed using yum package manager with the following command:
	```
	yum -y install python3-mod_wsgi.x86_64
	```

## Configuring mod_wsgi
1. Install the django project. For documentation purposes, we are going to assume the project is installed in */var/www/django/project_name*
2. To avoid different python projects having issues with each other, we are going to create an isolated python environment using python virtual environment:
	
	2.1. Install virtualenv module
		```
		yum install python3-virtualenv.noarch
		```
	
	2.2. Create a virtual environment
		```python3 -m virtualenv djangoenv```
3. Installing project dependencies in the virtual environment

	3.1. Activate the virtual environment
		```
		source djangoenv/bin/activate
		```
		
	3.2. Install all project dependencies - refer the documentation from that django project
	
	3.3. Deactivate the virtual environment
		```
		deactivate
		```
		
4. Insert the following for each project inside the virtual hosts.
	```apache
	WSGIDaemonProcess <process_name> python-home=/path/to/virtualenv python-path=/path/to/project```
	WSGIScriptAlias /location/to/serve/on /path/to/wsgi.py```
	
	<Location /location/to/serve/on>
		WSGIProcessGroup <process_name>
	</Location>
	```
	
	Example:
	```apache
	WSGIDaemonProcess django1 python-home=/var/www/django/new_project/djangoenv python-path=/var/www/django/new_project <br />
	WSGIScriptAlias /django1 /var/www/django/new_project/new_project/wsgi.py`
	<Location /django1>
		WSGIProcessGroup django1
	</Location>
	```
