from fastapi import FastAPI 
from requests_html import HTML  
import requests

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [

    "*"
]
#  uvicorn wordsapi:app --port 3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def word():
    
    url = "https://www.ef.com/wwen/english-resources/english-vocabulary/top-3000-words/"

    req = requests.get(url)


    if req.status_code == 200:
        parsed_html = HTML(html=req.text)
        targClass = parsed_html.find('.node-type')
        targP = targClass[0].find('p')
        words = targP[1].text.split('\n')
    return {'data':words}