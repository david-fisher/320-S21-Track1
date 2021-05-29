FROM ikhurana/kbtesting:apache

RUN yum install vim -y

EXPOSE 80 443 3000 3001 3006 8000 7000

COPY /ssl/server.crt /etc/pki/tls/certs/ethisim1.pem
COPY /ssl/server.key /etc/pki/tls/private/common.key
COPY /apache_server/ethisim.local.conf /etc/httpd/conf.d/ethisim.conf
COPY /apache_server/httpd.dev.conf /etc/httpd/conf/httpd.conf

COPY /apache_server/localhost-shibboleth/attribute-map.xml /etc/shibboleth/attribute-map.xml
COPY /apache_server/localhost-shibboleth/shibboleth2.xml /etc/shibboleth/shibboleth2.xml
COPY /apache_server/localhost-shibboleth/sp-cert.pem /etc/shibboleth/sp-cert.pem
COPY /apache_server/localhost-shibboleth/sp-key.pem /etc/shibboleth/sp-key.pem
COPY /apache_server/localhost-shibboleth/sp-metadata.xml /etc/shibboleth/sp-metadata.xml

CMD ["sh", "-c", "/usr/sbin/httpd -D FOREGROUND & /usr/sbin/shibd -f -F -w 30"]
