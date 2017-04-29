import urllib.request
from bs4 import BeautifulSoup
import pymysql
import re

conn = pymysql.connect(host='localhost', port=3306, user='root', passwd='root', db='rockdb',charset='utf8')


def fun(band):
    
    bandtitle = band;

    band=band.replace(" ","_")
    
    html=""
    
    try:
        with urllib.request.urlopen('https://ru.wikipedia.org/wiki/'+band) as response:
            html = response.read()
    except:
        print(bandtitle+" ERROR -------------- ERROR")
        return 0
    
    soup = BeautifulSoup(html, 'html.parser')
    text=""

    country=""
    genres=""
    year=""
    descr=""

    #el = soup.findAll(attrs={"data-wikidata-property-id":"P136"})
    #for e in el:
    #    print(e.text)

    table = soup.findAll(attrs={"class":"infobox vcard"})
    tablerow = table[0].findAll("tr")
    k=0
    z=-100
    for row in tablerow:
        if len(row.findAll(attrs={"data-wikidata-property-id":"P136"}))==1:
            for p in row.findAll("p"):
                genres=genres+p.text+" "
            z=k
            
        if k==z+1:
            for p in row.findAll("p"):
                mass = re.search("[\d]{4}",p.text)
                year = mass.group(0)
                
        if k==z+2:
            for p in row.findAll("p"):
                somevar = p.text
                somevar = somevar.replace(u'\xa0', u' ')
                masss = somevar.split(" ")
                country = masss[0]
        k=k+1




   
    other = soup.findAll(attrs={"class":"dablink noprint"})

    for el in table:
        el.decompose()
    for el in other:
        el.decompose()

    content = soup.find(attrs={"id":"mw-content-text"})
    for p in content.findAll("p"):
        if p.text=="":
            break
        else:
            descr = descr + p.text + "\n"

    descr=descr.replace("'","")

    cur1 = conn.cursor()
    q = "UPDATE band SET genres='"+genres+"', year='"+year+"', country='"+country+"', description='"+descr+"' WHERE bandname='"+bandtitle+"'"
    cur1.execute(q)
    print(bandtitle)
    cur1.close()
      

cur = conn.cursor()
cur.execute("SELECT bandname,description FROM band")
for row in cur:
    if row[1]=="default":
        fun(row[0])

cur.close()
conn.commit()
conn.close()
print("All is OK - END")

