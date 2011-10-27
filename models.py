#!/usr/bin/env python
from google.appengine.ext import db

class ImageData(db.Model):
  url           = db.TextProperty()
  dateTime      = db.DateTimeProperty()
  viewed        = db.BooleanProperty(required=True, default=False)