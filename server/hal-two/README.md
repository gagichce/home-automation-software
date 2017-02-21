# home-automation-software

This is the files for the master controller server.

To install the server (first time run only)

```
npm install
```

To run the master controller..

```
npm start
```

Additionally there are two modes which the server can be run in, DEVELOP and TEST.

To change the mode of the server change the `config` section in the `package.json` file.

```
..

  "config": {
    "development_mode": false,
    "test_mode": false
    ..
  }
..
```

DEVELOP mode will not attempt to connect to the NETCAN device. This is designed for testing the front end without needing the whole hardware setup.

TEST mode will constantly send packets changing the state of all devices.

Both modes can be combined but not sure what advantage that will have, if any..