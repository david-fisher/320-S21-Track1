FROM ikhurana/kbtesting:apache
# COPY /shibboleth/shibboleth/shibboleth2.xml /etc/shibboleth/shibboleth2.xml
COPY /ssl/ethisim1.pem /etc/pki/tls/certs/ethisim1.pem
COPY /ssl/common.key /etc/pki/tls/private/common.key
COPY /ssl/incommon.sha2.usertrustchain.pem /etc/pki/tls/certs/incommon.sha2.usertrustchain.pem
COPY /shibboleth/conf.d/ethisim.conf /etc/httpd/conf.d/ethisim.conf

COPY --from=dacollins/ethisim:frontend-landing-page /app/build /var/www/html/.
COPY --from=dacollins/ethisim:frontend-simulator /app/build /var/www/html/simulator/.
COPY --from=dacollins/ethisim:frontend-editor /app/build /var/www/html/editor/.

RUN yum install vim -y

EXPOSE 80 443

CMD ["sh", "-c", "/usr/sbin/httpd -D FOREGROUND & /usr/sbin/shibd -f -F -w 30"] 

