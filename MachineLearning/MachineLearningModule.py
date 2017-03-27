import mysql.connector
import time
import datetime

## We do not have recongition functions for weekly, weekday/weekend's patterns or linked events.
## Weekly, weekdays' and weekends' pattern recognition functions will be done soon.
## But linked event recognition module needs time to develop.


# ATTENTION HERE! Please build a suitable connection. I build this connection only for my own test.
conn = mysql.connector.connect(user='root', password='4tb6', database='test', use_unicode=True)
cursor = conn.cursor()


#----Set Search Parameters----#
TimeRange = datetime.timedelta(0, 1800)#the time interval within which we consider events as "similar events"
ThresholdLevel = 0.80 # Recognize a pattern if its confidence level above this value.

#----Get Query Result---#
def Q():
    values = cursor.fetchall()
    return values

#----Insert Pattern---#
def insertPattern(deviceID,pattern_text):
    cursor.execute("select id from patterns order by id Desc limit 1")
    lastPatternID = Q()
    if len(lastPatternID)==0:
        cursor.execute('insert into patterns (id,deviceId,pattern_text) values (%s,%s,%s)', (0,deviceID,pattern_text))
    else:
        cursor.execute('insert into patterns (id,deviceId,pattern_text) values (%s,%s,%s)', (lastPatternID[0][0]+1,deviceID,pattern_text))

#---- Main Function ----#

def OnceEveryDay():
    #----Get today and today's event----#
    cursor.execute("select DATE(createdAt) from events ORDER BY createdAt desc limit 1")
    today = Q()[0][0]
    cursor.execute("select id,createdAt,deviceId,currentStatus,previousStatus,flags from events where DATE(createdAt) = %s ORDER BY createdAt desc",(today,))  #What about the column's order in query?
    EventListToday = Q()

    #----total munber of events----#
    cursor.execute("select count(*) from events")
    NumOfEvent = Q()[0][0] #Type: Integer

    #----find nunmber of dates of events----#
    cursor.execute("select COUNT(DISTINCT DATE(createdAt)) from events order by createdAt")# select dates where the events happens
    TotalEventDate = Q()[0][0] #Type: Integer

    #----find number of dates of events in specific day of week----#
    cursor.execute("select COUNT(DISTINCT DATE(createdAt)) from events where DAYOFWEEK(createdAt) = DAYOFWEEK(%s) ORDER BY createdAt desc",(today,))
    DayOfWeekEventDate = Q()[0][0] #Type: Integer

    #----find number of dates of event on weekdays or weekends----#
    if (today.isoweekday() >= 6):
        cursor.execute("select COUNT(DISTINCT DATE(createdAt)) from events where DAYOFWEEK(createdAt) >= 6 ORDER BY createdAt desc")
        WeekendsEventDate = Q()[0][0] #Type: Integer
    else:
        cursor.execute("select COUNT(DISTINCT DATE(createdAt)) from events where DAYOFWEEK(createdAt) <= 5 ORDER BY createdAt desc")
        WeekdaysEventDate = Q()[0][0] #Type: Integer

    #----find nunmber of devices----#
    cursor.execute("select distinct deviceId from events where DATE(createdAt) = %s",(today,))
    DeviceListToday = [i[0] for i in Q()]
    lenDevices = len(DeviceListToday)

    #----find the number of dates where certain condition matches----#
    Pattern = []    #Currently stores device ID and time to operate.
    PsbltOccur = [] #Stores confidence level for each event.
    ICalEvents = [] #Stores ICal Events in strings.

    for event in EventListToday:
        # event elements in order: (0)event id, (1)event time, (2)device id, (3)current status, (4)previous status, (5)flag
        
        #Calculate statistic probability and confidence level here
        UpperBound = (event[1]+TimeRange).time()
        LowerBound = (event[1]-TimeRange).time()
        cursor.execute("select COUNT(DISTINCT DATE(createdAt)) from events where TIME(createdAt) >= %s and TIME(createdAt) <= %s and deviceId = %s and currentStatus = %s",(LowerBound,UpperBound,event[2],event[3]))
        x = Q()[0][0]
        DateProbability = float(x)/TotalEventDate
        Confidence = (1.0-1.0/(1.2**float(TotalEventDate)))*DateProbability #Sigmoid Function to compensate the influence of sample size.
        PsbltOccur.append([event,Confidence])

        #Store recognized pattern.
        if Confidence>=ThresholdLevel:
            cursor.execute("select TIME(createdAt) from events where TIME(createdAt) >= %s and TIME(createdAt) <= %s and deviceId = %s and currentStatus = %s",(LowerBound,UpperBound,event[2],event[3]))
            y = Q()
            PTime = datetime.datetime.min
            for k in y:
                PTime += (k[0]/len(y))
            PTime = PTime.time()
            Pattern.append([event[2], PTime, event[3], Confidence]) # Pattern elements in order: (0)device id, (1)operation time, (2)turn to which status, (4)pattern confidence level


    # Provide iCal Events
    now = datetime.datetime.now()
    tomorrow = now+datetime.timedelta(1)
    for i in range(len(Pattern)):
        DeviceID = Pattern[i][0]
        TurnToStatus = Pattern[i][2]
        # Dates and Times that will beused in iCal Events
        CreateDate = now.strftime("%Y%m%d")
        CreateTime = now.strftime("%H%M%S")
        EventStartDateTime = datetime.datetime(tomorrow.year,tomorrow.month,tomorrow.day,Pattern[i][1].hour,Pattern[i][1].minute,Pattern[i][1].second)
        EventEndDateTime = EventStartDateTime+datetime.timedelta(0,1)
        EventStartDate = EventStartDateTime.strftime("%Y%m%d")
        EventStartTime = EventStartDateTime.strftime("%H%M%S")
        EventEndDate = EventEndDateTime.strftime("%Y%m%d")
        EventEndTime = EventEndDateTime.strftime("%H%M%S")
        
        # Generate iCal text string
        ICalEvent = """BEGIN:VCALENDAR 
PRODID:iCal 1.0//EN 
VERSION:2.0 
CALSCALE:GREGORIAN 
BEGIN:VEVENT 
DTSTAMP:%sT%sZ 
DTSTART:%sT%s 
DTEND:%sT%s
SUMMARY:Turn Device %s to state %s (confidence:%s)
RRULE:FREQ=DAILY
END:VEVENT 
END:VCALENDAR"""%(CreateDate,CreateTime,EventStartDate,EventStartTime,EventEndDate,EventEndTime,DeviceID,TurnToStatus,Pattern[i][3])
        
        insertPattern(DeviceID,ICalEvent)   #Insert pattern ID, decive ID, and iCal text into patterns table

    conn.commit()
    conn.close()

OnceEveryDay()  #execute main function.
