import mysql.connector
import time
import datetime

# I use this file to create tables on my own PC, and insert data to test Machine Learning Module.

# Connect to mysql
conn = mysql.connector.connect(user='root', password='4tb6', database='test')

# initiate a MySQLCursor
cursor = conn.cursor()

#Execute INSERT
cursor.execute("DROP TABLE IF EXISTS patterns")
cursor.execute("DROP TABLE IF EXISTS events")

createTable = """CREATE TABLE IF NOT EXISTS `events` (
  `id` INT NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `deviceId` INT NOT NULL DEFAULT '0',
  `currentStatus` INT DEFAULT NULL,
  `previousStatus` INT DEFAULT NULL,
  `flags` INT DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;"""

createBlankTable = """CREATE TABLE `events` (
  `id` INT NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `deviceId` INT NOT NULL DEFAULT '0',
  `currentStatus` INT DEFAULT NULL,
  `previousStatus` INT DEFAULT NULL,
  `flags` INT DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;"""

createPatternTable = """CREATE TABLE `patterns` (
  `id` INT NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `deviceId` INT NOT NULL DEFAULT '0',
  `pattern_text` VARCHAR(1000),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;"""

cursor.execute(createBlankTable)
cursor.execute(createPatternTable)

#CreatedData#
D = [[0,2017,1,1,9,0,0,0,0,1,0],
[1,2017,1,2,9,2,0,0,0,1,0],
[2,2017,1,3,9,4,0,0,0,0,1],
[3,2017,1,4,9,21,0,0,0,0,1],
[4,2017,1,5,9,32,0,0,0,0,1],
[5,2017,1,6,9,23,0,0,0,0,1],
[6,2017,1,7,9,1,0,0,0,1,0],
[7,2017,1,8,9,4,0,0,0,1,0],
[8,2017,1,9,9,0,0,0,0,1,0],
[9,2017,1,10,9,0,0,0,0,1,0],
[10,2017,1,11,9,18,0,0,0,0,1],
[11,2017,1,12,9,18,0,0,0,0,1],
[12,2017,1,13,8,57,0,0,0,1,0],
[13,2017,1,14,8,59,0,0,0,0,1],
[14,2017,1,15,9,24,0,0,0,0,1],
[15,2017,1,16,9,0,0,0,0,1,0],
[16,2017,1,17,9,2,0,0,0,1,0],
[17,2017,1,18,9,4,0,0,0,0,1],
[18,2017,1,19,9,21,0,0,0,0,1],
[19,2017,1,20,9,32,0,0,0,0,1],
[20,2017,1,21,9,23,0,0,0,0,1],
[21,2017,1,22,9,1,0,0,0,1,0],
[22,2017,1,23,9,4,0,0,0,1,0],
[23,2017,1,24,9,0,0,0,0,1,0],
[24,2017,1,25,9,0,0,0,0,1,0],
[25,2017,1,26,9,18,0,0,0,0,1],
[31,2017,1,27,9,18,0,0,0,0,1],
[42,2017,1,28,8,57,0,0,0,1,0],
[53,2017,1,29,8,59,0,0,0,0,1],
[54,2017,1,30,9,24,0,0,0,0,1]]
Year = []
Mo = []
Da = []
H = []
M = []
S = []
ID = []
DID = []
CS = []
PS = []
Flag = []
for i in range(len(D)):
    ID.append(D[i][0])
    Year.append(D[i][1])
    Mo.append(D[i][2])
    Da.append(D[i][3])
    H.append(D[i][4])
    M.append(D[i][5])
    S.append(D[i][6])
    DID.append(D[i][7])
    CS.append(D[i][8])
    PS.append(D[i][9])
    Flag.append(D[i][10])
timestamp = ''
#CreatedDataEnd#

#InsertCreatedData:
for i in range(len(S)):
    timestamp = '%d-%d-%d %d:%d:%d' % (Year[i],Mo[i],Da[i],H[i],M[i],S[i])
    try:
        cursor.execute("insert into events (id, createdAt, deviceId, currentStatus, previousStatus, flags) values (%s, %s, %s, %s, %s, %s)",(ID[i],timestamp,DID[i],CS[i],PS[i],Flag[i]))
    except:
        print "couldn't insert"
        continue
    
#----Get Query Result---#
def Q():
    values = cursor.fetchall()
    return values

#----Event Insertion Method----#
# input arguments:
# - device ID
# - current state
# - previous state
# - operator(user or HAL)
# action:
# - insert that event into MySQL server.
def insertEvent(thisID,thisCS,thisPS,thisFlag):
    now = datetime.datetime.today()
    cursor.execute("select createdAt from events where deviceId = %s order by createdAt DESC limit 1",(thisID,))
    last = Q()

    # Low pass filter
    CutOffPeriod = 10 #if two events occur within this number of seconds, ignore them.
    if (len(last)>0):
        if (now - last[0][0] >= datetime.timedelta(0,CutOffPeriod)):
            ID = last[1]+1
            cursor.execute('insert into events (id, createdAt, deviceId, currentStatus, previousStatus, flags) values (%s, %s, %s, %s, %s, %s)', (ID, datetime.datetime.today(), thisID, thisCS, thisPS, thisFlag))
            print now, "\t Device ",thisID,"\t Done Insertion."
    else:
        cursor.execute("select id from events order by id DESC limit 1")
        last = Q()
        if len(last):
            ID = last[0][0]+1
        else:
            ID = 0
        cursor.execute('insert into events (id, createdAt, deviceId, currentStatus, previousStatus, flags) values (%s, %s, %s, %s, %s, %s)', (ID, datetime.datetime.today(), thisID, thisCS, thisPS, thisFlag))
        print now, "\t Device ",thisID,"\t Done Insertion."

def SimulateInsert():
    #Alternative:
    #Test
    insertEvent(3,1,0,1) #Device 3 actions
    time.sleep(1)
    insertEvent(1,1,0,1) #
    time.sleep(2)
    insertEvent(2,1,0,1)
    time.sleep(3)
    insertEvent(3,1,0,1)
    time.sleep(0.5)
    insertEvent(1,1,0,1)
    time.sleep(0.2)
    insertEvent(2,1,0,1)
    time.sleep(2)
    insertEvent(4,1,0,1)
    #TestEnd

#SimulateInsert()

# Close Connection
conn.commit()
conn.close()
