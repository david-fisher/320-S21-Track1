FROM python:3
ENV PYTHONUNBUFFERED 1
WORKDIR /app

COPY requirements.txt /app

RUN pip install -r requirements.txt

COPY . /app

EXPOSE 8000

# We add an additional argument '0.0.0.0:8000' since otherwise 
# Python thinks we're exposing it on 127.0.0.1 when in reality 
# we want the eth0 address, since that can change, and we don't want to hard code it, 
# we use 0.0.0.0 which means "ALL" interfaces. (From stackoverflow, https://stackoverflow.com/questions/49476217/docker-cant-access-django-server)

CMD ["python", "backend/manage.py", "runserver", "0.0.0.0:8000"]
