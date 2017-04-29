import urllib.request
from bs4 import BeautifulSoup
import pymysql

conn = pymysql.connect(host='localhost', port=3306, user='root', passwd='root', db='rockdb',charset='utf8')


def fun(song,band):
    
    songtitle=song
    
    band=band.lower()
    song=song.lower()
    band=band.replace(" ","_")
    song=song.replace(" ","_")
    
    html=""
    text=""
    try:
        with urllib.request.urlopen('http://www.amalgama-lab.com/songs/'+band[0]+'/'+band+'/'+song+'.html') as response:
            html = response.read()
    except:
        print('http://www.amalgama-lab.com/songs/'+band[0]+'/'+band+'/'+song+'.html')
        print("ERROR--------ERROR "+songtitle)
        return 0
    
    soup = BeautifulSoup(html, 'html.parser')
    i=0
    k=0
    for div in soup.find_all('div', class_='original'):
        k=k+1
        if div.text.replace("\n","")=="":
            i=i+1
        elif div.text.lower().replace("\n","")==songtitle.lower():
            i=i+1
        else:
            i=0
            
        if i==3:
            break
        
        part=div.text.replace("\n","")
        text=text+part+"\n"

    print(k)
    text=text.replace("'","")
    text=text.strip()
    cur1 = conn.cursor()
    cur1.execute("UPDATE song SET words='"+text+"' WHERE songname='"+songtitle+"'")
    print(songtitle)
    cur1.close()

            
cur = conn.cursor()
cur.execute("SELECT song.songname,band.bandname FROM song NATURAL JOIN band")
for row in cur:
    fun(row[0],row[1])
cur.close()
conn.commit()
conn.close()
print("all is OK")


