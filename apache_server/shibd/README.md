# About Shibboleth :  
Shibboleth is an open-source, single sign-on login system provided under the Apache 2 license. It allows people to sign in using just one identity to various systems run by federations of different organizations or institutions. Thinking about our system, the organization being the University of Massachusetts Amherst.

# Understanding Shibboleth and its Architecture :
1. Infrastructure based on SAML (Security Assertion Markup Language)
2. SAML has 3 principle roles : 

	a. The Principal (User Agent) 
	
	b. IdP (Identity Provider)
	
	c. SP (Service Provider) 
	
3. In the primary use case addressed by SAML, the principal requests a service from the service provider. The service provider requests and obtains an authentication assertion from the identity provider. On the basis of this assertion, the service provider can make an access control decision, that is, it can decide whether to perform the service for the connected principal

# Installing/Setting up Shibboleth :
### Note: all of the below applies for the OS of the virtual machine provided by CSCF, which is CentOS

1. (Requires curl) Download the shibboleth repository by running the following command:

	```curl --output /etc/yum.repos.d/security:shibboleth.repo  https://download.opensuse.org/repositories/security:/shibboleth/CentOS_8/security:shibboleth.repo```

2. Run this command to install shibboleth:

	```dnf install shibboleth.x86_64```

3. Start the Shibboleth service by running the following command:

	```systemctl start shibd.service```

4. Run the following command to ensure that you the shibd service starts automatically every time:

	```systemctl enable shibd.service```

5. In the command line, execute the following command to see whether the Shibboleth Service Provider can load the default configuration:

	```shibd -t```

	It is important is that the last line of the output is: **overall configuration is loadable, check console for non-fatal problems**


6. Also test the Apache configuration with the following command:

	```apachectl configtest```

	The output of this command should be: **Syntax OK**
	
# Important Shibboleth Files (should be located in /etc/shibboleth)
* shibboleth2.xml
	* Most of the native service provider's configuration options are found here
	* This is the main starting point for all changes and tasks excluding altering content rules on Apache
	* The primary configuration file consists of an `<SPConfig>` element that contains one each of several other top-level elements, each representing a category of SP configuration, and optional extensions.
* attribute-map.xml
	* Maps incoming SAML Attributes and/or NameID Formats into local variable/header names within the SP
	* Tells the Shibboleth software which attribute types exists in a federation and how to decode and present that information to applications
* sp-key.pem, sp-cert.pem
	* The SP uses a public/private key pair to sign its messages sent to the IdP, and to decode messages sent to it from the IdP. The IdP uses its own public/private key pair to sign its messages sent to the SP, so the SP can verify the message is genuine.
	* In each case, SPs and IdPs need to be able to verify the certificate offered by the other. This is managed through the exchange of metadata through the federation. The certificates of all the IdPs and SPs in the federation are collected together and signed by the federation's key.
	* The standard SP install creates a suitable key and self-signed certificate (in the same directory as shibboleth2.xml) called sp-key.pem and sp-cert.pem and configures shibboleth2.xml to use them.
* sp-metadata.xml
	* With regard to Shibboleth, metadata refers to configuration data used to provision an SP or IdP to communicate with each other
	* sp-metadata.xml contains metadata about an SP, which you will give to an IdP.
	
