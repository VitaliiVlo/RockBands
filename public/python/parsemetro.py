import urllib.request
from bs4 import BeautifulSoup
import pymysql

conn = pymysql.connect(host='localhost', port=3306, user='root', passwd='root', db='rockdb',charset='utf8')


def fun(song,band):
    
    songtitle=song
    
    band=band.lower()
    song=song.lower()
    band=band.replace(" ","-")
    song=song.replace(" ","-")
    
    html=""
    
    try:
        with urllib.request.urlopen('http://www.metrolyrics.com/'+song+'-lyrics-'+band+'.html') as response:
            html = response.read()
    except:
        print(songtitle+" ERROR -------------- ERROR")
        return 0
    
    soup = BeautifulSoup(html, 'html.parser')
    text=""

    for div in soup.find_all("p",class_='verse'):
        text=text+div.text+"\n\n"

    if text=="":
        print(songtitle+" ERROR -------------- ERROR")
        return 0

    
    text=text.replace("'","")

    cur1 = conn.cursor()
    cur1.execute("UPDATE song SET words='"+text+"' WHERE songname='"+songtitle+"'")
    print(songtitle)
    cur1.close()
      
cur = conn.cursor()
cur.execute("SELECT song.songname,band.bandname,song.words FROM song NATURAL JOIN band")

for row in cur:
    if row[2]=="default":
        fun(row[0],row[1])
    
cur.close()
conn.commit()
conn.close()
print("all is OK")


