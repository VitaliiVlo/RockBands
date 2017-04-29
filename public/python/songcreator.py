import pymysql

conn = pymysql.connect(host='localhost', port=3306, user='root', passwd='root', db='rockdb',charset='utf8')

def create(band):
    bandid=0

    cur = conn.cursor()
    cur.execute("SELECT band_id FROM band WHERE bandname='"+band+"'")
    if cur.rowcount!=1:
        print("error with band searching in database")
        return 0
    for row in cur:
        bandid=row[0]
    
    cur.close()

    while True:
        songname=input("songname=")
        print("\n")
        if songname=="qq":
            return 0
        cur1 = conn.cursor()
        cur1.execute("""INSERT INTO song VALUES (NULL,%s,'default',%s)""",(songname,bandid))
        cur1.close()



while True:
    bandname=input("bandname=")
    print("\n")
    if bandname=="qq":
        break
    create(bandname)

conn.commit()
conn.close()
