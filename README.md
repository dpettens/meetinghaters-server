# MeetingHaters Server

This is the repository of the backend server for the Android application *MeetingHaters*.

## Routes

All routes are based on the software architectural style REST

### Meetings

Request | Route                                                | Action
--------|------------------------------------------------------|---------------------------
GET     | /api/meetings                                        | Get all meetings of a user
POST    | /api/meetings                                        | Create a meeting
GET     | /api/meetings/:id_owner/:id_meeting                  | Get a meeting
PUT     | /api/meetings/:id_owner/:id_meeting                  | Update a meeting
DELETE  | /api/meetings/:id_owner/:id_meeting                  | Delete a meeting

### Users

Request | Route                                               | Action
--------|-----------------------------------------------------|---------------------------
POST    | /api/authenticate                                   | Authenticate the user
POST    | /api/users                                          | Create a user
GET     | /api/users/:id_user                                 | Get a user
PUT     | /api/users/:id_user                                 | Update a user
DELETE  | /api/users/:id_user                                 | Delete a user

### Meetings + Users

Request | Route                                               | Action
--------|-----------------------------------------------------|---------------------------
GET     | /api/meetings/:id_owner/:id_meeting/users           | Get all users of a meeting
POST    | /api/meetings/:id_owner/:id_meeting/users           | Add a user to a meeting
GET     | /api/meetings/:id_owner/:id_meeting/users/:id_user  | Get user's information of a meeting
PUT     | /api/meetings/:id_owner/:id_meeting/users/:id_user  | Update user's informations of a meeting
DELETE  | /api/meetings/:id_owner/:id_meeting/users/:id_user  | Remove a user of a meeting
