# -*- coding: utf-8 -*-
"""
    Simple sockjs-tornado chat application. By default will listen on port 8080.
"""
from apscheduler.schedulers.tornado import TornadoScheduler
import requests
import tornado.ioloop
import tornado.web
import os
import sockjs.tornado
import json

def to_image_ids(list_of_image):
    image_ids = []
    for line in list_of_image:
        if line[0] == 'REPOSITORY':
            pass
        else:
            image_ids.append(line[2])

    return image_ids

def get_info(image_id):
    f = os.popen('docker inspect ' + image_id)
    return json.loads(f.read())[0]


class IndexHandler(tornado.web.RequestHandler):
    """Regular HTTP handler to serve the chatroom page"""

    def get(self, uri):
        if uri == 'transfer.js':
            self.render('transfer.js')
        else:
            self.render('index.html')


class ChatConnection(sockjs.tornado.SockJSConnection):
    """Chat connection implementation"""
    # Class level variable
    participants = set()
    scheduler = TornadoScheduler()

    def on_open(self, info):
        # Add client to the clients list
        self.participants.add(self)
        self.on_tick()

        if not self.scheduler.running:
            self.scheduler.start()
            self.scheduler.add_job(self.on_tick, 'interval', seconds=10)

    def on_tick(self):
        images = requests.get("http://localhost:4243/images/json").json()

        containers = requests.get("http://localhost:4243/containers/json").json()

        info = {'images': images, 'containers': containers}
        self.broadcast(self.participants, json.dumps(info))

    def on_close(self):
        # Remove client from the clients list and broadcast leave message
        self.participants.remove(self)


if __name__ == "__main__":
    import logging

    logging.getLogger().setLevel(logging.DEBUG)

    # 1. Create chat router
    ChatRouter = sockjs.tornado.SockJSRouter(ChatConnection, '/chat')

    # 2. Create Tornado application
    app = tornado.web.Application(
        [(r"/([^c]*)", IndexHandler)] + ChatRouter.urls, debug=True
    )

    # 3. Make Tornado app listen on port 80
    app.listen(8080)

    # 4. Start IOLoop
    tornado.ioloop.IOLoop.instance().start()