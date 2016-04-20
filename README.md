# MeetingHaters Server

This is the repository of the backend server for the Android application *MeetingHaters*.

## Routes

All routes are based on the software architectural style REST

### Meetings

GET     /api/meetings                                Get all meetings of a user
POST	/api/meetings                                Create a meeting
GET		/api/meetings/:meeting_id                    Get a meeting
PUT		/api/meetings/:meeting_id                    Update a meeting
DELETE	/api/meetings/:meeting_id                    Delete a meeting

### Users

GET		/api/users/:user_id                          Get a user
POST	/api/users/:user_id                          Create a user
PUT     /api/users/:user_id                          Update a user
DELETE  /api/users/:user_id                          Delete a user

### Meetings + Users

GET		/api/meetings/:meeting_id/users              Get all users of a meeting
POST 	/api/meetings/:meeting_id/users/:user_id     Add a user to a meeting
GET		/api/meetings/:meeting_id/users/:user_id     Get user's information of a meeting
PUT 	/api/meetings/:meeting_id/users/:user_id     Update user's informations of a meeting
DELETE 	/api/meetings/:meeting_id/users/:user_id     Remove a user of a meeting
