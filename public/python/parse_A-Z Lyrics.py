import urllib.request
from bs4 import BeautifulSoup
import pymysql

conn = pymysql.connect(host='localhost', port=3306, user='root', passwd='root', db='rockdb',charset='utf8')


def fun(song,band):
    
    songtitle=song
    
    band=band.lower()
    song=song.lower()
    band=band.replace(" ","")
    song=song.replace(" ","")
    
    html=""
    
    try:
        with urllib.request.urlopen('http://www.azlyrics.com/lyrics/'+band+'/'+song+'.html') as response:
            html = response.read()
    except:
        print(songtitle+" error")
        return 0
    
    soup = BeautifulSoup(html, 'html.parser')
    
    for div in soup.find_all("div"):
        div=str(div)
        if div.find("<!-- Usage of azlyrics.com content by any third-party lyrics provider is prohibited by our licensing agreement. Sorry about that. -->")!=-1 and div.count("div")<3:
            div=div.replace("<div>","")
            div=div.replace("</div>","")
            div=div.replace("<br>","")
            div=div.replace("</br>","")
            div=div.replace("<!-- Usage of azlyrics.com content by any third-party lyrics provider is prohibited by our licensing agreement. Sorry about that. -->","")
            div=div.replace("'","")
            div=div.strip()
            cur1 = conn.cursor()
            cur1.execute("UPDATE song SET words='"+div+"' WHERE songname='"+songtitle+"'")
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


