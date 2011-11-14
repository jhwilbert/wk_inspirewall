#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util
from google.appengine.ext.webapp import template
import google.appengine.ext.db

import simplejson
import models
import datetime
import os
import random
import short_url

class MainHandler(webapp.RequestHandler):
    def get(self):

        """
        Resource URI: /
        Method: GET 
        
        Displays main slideshow interface (main.js)
       
        """      
        db = models.ImageData.all();

        display = {
            "images" : db
        }
        path = os.path.join(os.path.dirname(__file__), 'index.html')
        self.response.out.write(template.render(path, display))

class Admin(webapp.RequestHandler):
    def get(self):

        """
        Resource URI: /admin
        Method: GET 

        Displays main admin interface (admin.js)

        """      
        db = models.ImageData.all();

        display = {
            "images" : db
        }
        path = os.path.join(os.path.dirname(__file__), 'admin.html')
        self.response.out.write(template.render(path, display))
                        
class Bookmarklet(webapp.RequestHandler):
    def get(self):
        
        """
        Resource URI: /bookmarklet
        Static page with bookmarklet.
        
        """    
        path = os.path.join(os.path.dirname(__file__), 'bookmarklet.html')
        self.response.out.write(template.render(path, {}))


class Delete(webapp.RequestHandler):
    def get(self):

        """
        Resource URI: /delete
        Method: POST 
        Parameter: id [string]

        Deletes the specified image id in the table.

        """

        imgid = self.request.get("keyname")
        db = models.ImageData.get_by_key_name(imgid)
        db.delete()
        self.response.out.write(True)
                
class Update(webapp.RequestHandler):
    def get(self):

        """
        Resource URI: /update
        Method: POST 
        Parameter: id [string]
        
        Updates the specified image id in the table Recent to True.
        
        """
                
        imgid = self.request.get("keyname")
        db = models.ImageData.get_by_key_name(imgid)
        db.recent = False
        db.put()
        self.response.out.write(True)
        
class Store(webapp.RequestHandler):
    def get(self):
 
        """
        Resource URI: /store
        Method: POST (url) 
        
        Stores an image URL in the datastore object
       
        """        
        now = datetime.datetime.now()
        
        url = self.request.get("url")
        site = self.request.get("site")
        
        basenum = now.second
        db = models.ImageData(key_name=short_url.encode_url(basenum));
        db.url = url
        db.site = site
        db.dateTime = now
        db.put()
        
        self.response.out.write(True)
        #self.response.http_status_message(200)

class DisplayRecent(webapp.RequestHandler):
    def get(self):

        """
        Resource URI: /display_recent

        Displays list of stored images in JSON format.

        """
        db = models.ImageData.gql("WHERE recent = true")

        displayDict = {}
        counter = 0

        for element in db:
            counter = counter + 1
            displayDict[counter] = { "url" : element.url, "datetime" : str(element.dateTime), 
                                     "key_name" : str(element.key().name()) , "recent" : element.recent  }
        
        # If it doesn't return any images it sends a message to main.js
        if len(displayDict) == 0:
            displayDict = { "empty" : True }
            
        result = simplejson.dumps(displayDict)

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(result)

        
class DisplayAll(webapp.RequestHandler):
    def get(self):
        
        """
        Resource URI: /display_all
        
        Displays list of stored images in JSON format.
        
        """
        db = models.ImageData.all();
        
        displayDict = {}
        counter = 0
        
        for element in db:
            counter = counter + 1
            displayDict[counter] = { "url" : element.url, "datetime" : str(element.dateTime), 
                                     "key_name" : str(element.key().name()) , "recent" : element.recent  }
            
        result = simplejson.dumps(displayDict)
        
        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(result)
        

class Redirect(webapp.RequestHandler):
    def get(self,key):

         """
         Resource URI: /r/keyid
         Method: GET 

         Check if key exists in datastore, if it does it will redirect.

         """      
         db = models.ImageData.get_by_key_name(key) 
         if db == None:
             self.redirect("/")
         else:
             self.redirect(db.site)

def main():
    application = webapp.WSGIApplication([('/', MainHandler),
                                          ('/bookmarklet', Bookmarklet),
                                          ('/update', Update),
                                          ('/delete', Delete),
                                          ('/store', Store),
                                          ('/admin', Admin),
                                          ('/r/([^/]+)', Redirect),
                                          ('/display_recent', DisplayRecent),
                                          ('/display_all', DisplayAll)],
                                         debug=True)
    util.run_wsgi_app(application)


if __name__ == '__main__':
    main()
