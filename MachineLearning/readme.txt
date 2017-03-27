I splitted the old script into two parts--

MachineLearningModule.py:
	The script that I want to put into the server/master controller.
	This module reads data from the table "events" and outputs newly
	recognized patterns (pattern ID, device ID, and iCal event string)
	into the table "patterns".


TestForPC:
	The script that creates "events" and "pattern" table on a local
	PC and injects some data. One may use this script to create tables
	for MachineLearningModule testing.

Be careful with line DB connection establishment step in both files. You
may need to change those connection parameters to yours.