# Installing mod_wsgi
1. **About mod_wsgi**: The mod_wsgi package implements a simple to use Apache module which can host any Python web application which supports the Python [WSGI](https://www.python.org/dev/peps/pep-3333/) specification

2. **Why mod_wsgi**: The backend team is using Django to handle the backend API calls and hence Django needs to be deployed on the Apache server in order for it to be integrated with Shibboleth which is also deployed on the Apache web server. 

2. Run the following command to install the mod_wsgi package:

	```yum -y install python3-mod_wsgi.x86_64```

3. The module mod_wsgi will then be available, allowing you to serve python on Apache, and therefore the Django framework that the backend will be using.
