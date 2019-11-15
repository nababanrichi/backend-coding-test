define({ "api": [  {    "type": "get",    "url": "/health",    "title": "Check App Health Status",    "name": "checkHealth",    "group": "Misc",    "version": "0.1.0",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "text",            "description": "<p>Healthy</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n\"Healthy\"",          "type": "json"        }      ]    },    "filename": "src/app.js",    "groupTitle": "Misc"  },  {    "type": "get",    "url": "/rides",    "title": "Get all Rides at DB",    "name": "getRides",    "group": "Rides",    "version": "0.2.0",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "page",            "description": "<p>Optional, page number.</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "limit",            "description": "<p>Optional, total records will be given max per request.</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": " {\n     \"page\": \"1\",\n     \"limit\": \"1\"\n}",          "type": "json"        }      ]    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object[]",            "optional": false,            "field": "rides",            "description": "<p>List of rides.</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"records\": [\n    {\n       \"rideID\": 1,\n       \"startLat\": 0,\n       \"startLong\": 0,\n       \"endLat\": 0,\n       \"endLong\": 0,\n       \"riderName\": \"Budi\",\n       \"driverName\": \"Anton\",\n       \"driverVehicle\": \"Tesla Model 3 2020\",\n       \"created\": \"2019-11-14 03:17:51\"\n    }\n  ],\n  \"page\": 1,\n  \"limit\": 1,\n  \"total_page\": 1,\n  \"total_record\": 1\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "type": "String",            "optional": false,            "field": "error_code",            "description": "<p>Error Code (e.g.: VALIDATION_ERROR).</p>"          },          {            "group": "Error 4xx",            "type": "String",            "optional": false,            "field": "message",            "description": "<p>Error Message.</p>"          }        ]      },      "examples": [        {          "title": "Server Error:",          "content": "HTTP/1.1 404 Not Found\n{\n  \"error_code\": \"SERVER_ERROR\",\n  \"message\": \"Unknown error\"\n}",          "type": "json"        },        {          "title": "Rides Error:",          "content": "HTTP/1.1 404 Not Found\n{\n  \"error_code\": \"RIDES_NOT_FOUND_ERROR\",\n  \"message\": \"Could not find any rides\"\n}",          "type": "json"        }      ]    },    "filename": "src/app.js",    "groupTitle": "Rides"  },  {    "type": "get",    "url": "/rides/:id",    "title": "Get Rides by ID",    "name": "getRidesById",    "group": "Rides",    "version": "0.1.0",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object[]",            "optional": false,            "field": "rides",            "description": "<p>Rides Record.</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n [\n     {\n         \"rideID\": 1,\n         \"startLat\": 0,\n         \"startLong\": 0,\n         \"endLat\": 0,\n         \"endLong\": 0,\n         \"riderName\": \"Budi\",\n         \"driverName\": \"Anton\",\n         \"driverVehicle\": \"Tesla Model 3 2020\",\n         \"created\": \"2019-11-14 03:17:51\"\n     }\n ]",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "type": "String",            "optional": false,            "field": "error_code",            "description": "<p>Error Code (e.g.: VALIDATION_ERROR).</p>"          },          {            "group": "Error 4xx",            "type": "String",            "optional": false,            "field": "message",            "description": "<p>Error Message.</p>"          }        ]      },      "examples": [        {          "title": "Server Error:",          "content": "HTTP/1.1 404 Not Found\n{\n  \"error_code\": \"SERVER_ERROR\",\n  \"message\": \"Unknown error\"\n}",          "type": "json"        },        {          "title": "Record not Found Error:",          "content": "HTTP/1.1 404 Not Found\n{\n  \"error_code\": \"RIDES_NOT_FOUND_ERROR\",\n  \"message\": \"Could not find any rides\"\n}",          "type": "json"        }      ]    },    "filename": "src/app.js",    "groupTitle": "Rides"  },  {    "type": "post",    "url": "/rides",    "title": "Insert New Rides to DB",    "name": "putRides",    "group": "Rides",    "version": "0.1.0",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "start_lat",            "description": "<p>Start Latitude, need to be between -90 and 90.</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "start_long",            "description": "<p>Start Longitude, need to be between -100 and 100.</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "end_lat",            "description": "<p>End Latitude, need to be between -90 and 90.</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "end_long",            "description": "<p>End Longitude, need to be between -100 and 100.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "rider_name",            "description": "<p>Rider Name, need to be more than 1 char.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "driver_name",            "description": "<p>Driver Name, need to be more than 1 char.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "driver_vehicle",            "description": "<p>Driver Vehicle, need to be more than 1 char.</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": " {\n     \"start_lat\": \"0\",\n     \"start_long\": \"0\",\n     \"end_lat\": \"0\",\n     \"end_long\": \"0\",\n     \"rider_name\": \"Budi\",\n     \"driver_name\": \"Anton\",\n     \"driver_vehicle\": \"Tesla Model 3 2020\"\n}",          "type": "json"        }      ]    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object[]",            "optional": false,            "field": "rides",            "description": "<p>Rides Record.</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n [\n     {\n         \"rideID\": 1,\n         \"startLat\": 0,\n         \"startLong\": 0,\n         \"endLat\": 0,\n         \"endLong\": 0,\n         \"riderName\": \"Budi\",\n         \"driverName\": \"Anton\",\n         \"driverVehicle\": \"Tesla Model 3 2020\",\n         \"created\": \"2019-11-14 03:17:51\"\n     }\n ]",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "type": "String",            "optional": false,            "field": "error_code",            "description": "<p>Error Code (e.g.: VALIDATION_ERROR).</p>"          },          {            "group": "Error 4xx",            "type": "String",            "optional": false,            "field": "message",            "description": "<p>Error Message.</p>"          }        ]      },      "examples": [        {          "title": "Latitude/Longitude Error:",          "content": "HTTP/1.1 404 Not Found\n{\n  \"error_code\": \"VALIDATION_ERROR\",\n  \"message\": \"Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively\"\n}",          "type": "json"        },        {          "title": "Name/Vehicle Error:",          "content": "HTTP/1.1 404 Not Found\n{\n  \"error_code\": \"VALIDATION_ERROR\",\n  \"message\": \"Rider name must be a non empty string\"\n}",          "type": "json"        }      ]    },    "filename": "src/app.js",    "groupTitle": "Rides"  }] });
