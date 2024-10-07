
Base Path
All endpoints are prefixed with /api/v1/user.

Endpoints


Register User
POST /api/v1/user/register
Registers a new user.
Request Body: { firstName, lastName, phoneNumber, email, password }
Response: Success: User created; Error: Required fields missing.


Login User
GET /api/v1/user/login
Authenticates user and returns a JWT token.
Request Body: { email, password }
Response: Success: User logged in; Error: User not found or incorrect password.


Get User by Email
GET /api/v1/user/get
Retrieves loggedin user details.
Response: Success: User fetched; Error: User not found.


Update User
PUT /api/v1/user/update
Updates user information (requires authentication).
Request Body: { firstName, lastName, phoneNumber, email }
Response: Success: User updated; Error: User not found.


Delete Logged In User
DELETE /api/v1/user/delete
Deletes the currently logged-in user (requires authentication).
Response: Success: User deleted; Error: User not found.


Delete User by Email
DELETE /api/v1/user/deletebyemail
Deletes a user by email (requires authentication).
Request Body: { email }
Response: Success: User deleted; Error: User not found.

Middleware
isAuthenticated: Ensures that the user is authenticated before accessing protected routes.

Error Handling
Each endpoint returns appropriate HTTP status codes and JSON error messages for validation failures or server errors.

