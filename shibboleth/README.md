### Note: all of the below applies for the OS of the virtual machine provided by CSCF, which is CentOS

## Setting up Shibboleth:
1. (Requires curl) Download the shibboleth repository by running this command:

	```sudo curl --output /etc/yum.repos.d/security:shibboleth.repo  https://download.opensuse.org/repositories/security:/shibboleth/CentOS_8/security:shibboleth.repo```

2. Run this command to install shibboleth:

	```sudo dnf install shibboleth.x86_64```

3. Start the Shibboleth service by running the command:

	```sudo systemctl start shibd.service```

4. Run this command to ensure that you the shibd service starts automatically every time:

	```sudo systemctl enable shibd.service```

5. In the command line, execute the following command to see whether the Shibboleth Service Provider can load the default configuration:

	```sudo shibd -t```

	It is important is that the last line of the output is: **overall configuration is loadable, check console for non-fatal problems**


6. Also test the Apache configuration with the command:

	```sudo apachectl configtest```

	The output of this command should be: **Syntax OK**



## Installing mod_wsgi
1. **About mod_wsgi**: The mod_wsgi package implements a simple to use Apache module which can host any Python web application which supports the Python [WSGI](https://www.python.org/dev/peps/pep-3333/) specification

2. Run the following command to install the mod_wsgi package:

	```yum -y install python3-mod_wsgi.x86_64```

3. The module mod_wsgi will then be available, allowing you to serve python on Apache, and therefore the Django framework that the backend will be using.
