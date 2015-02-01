# Format: FROM repository[:version]
FROM dockerfile/python:latest

# Format: MAINTAINER Name <email@addr.ess>
MAINTAINER J. Bertens <johannes.bertens@gmail.com>

# Get the repository
RUN git clone https://github.com/DJBnjack/docker-server.git

# Install the required packages
RUN pip install -r docker-server/requirements.txt

#Run usr/bin/python on the job manager api
ENTRYPOINT python docker-server/web/webserver.py
