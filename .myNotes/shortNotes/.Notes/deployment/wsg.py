# +++++++++++ WSGI configuration file +++++++++++
# This file contains the WSGI configuration required to serve up your
# web application at http://moto.pythonanywhere.com/
# (Replace 'moto' with your actual username)

import sys

# It is case-sensitive! If your folder is lost_item_manager, use that.
# Make sure this path points to the folder containing app.py
project_home = '/home/moto/lost_item_manager' # <-- VERIFY THIS PATH!

if project_home not in sys.path:
    sys.path = [project_home] + sys.path

# --- THIS IS THE LINE TO CHANGE ---
# from app import app as application
# --- THIS IS THE LINE TO CHANGE ---
from app import app as application