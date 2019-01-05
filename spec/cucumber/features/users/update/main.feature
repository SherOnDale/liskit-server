# Scenario Outline: Invalid Profile

#   IF the client sends a PATCH request to /liskit/users/:id with an invalid payload, they should receive a 400 Bad Request

#   When the client creates a PATCH request to /liskit/users/
#   And attaches <payload> as the payload
#   And sends the request
#   Then our API should respond with a 400 HTTP status code
#   And the payload of the response should be a JSON object
#   And contains an error property set to  true
#   And contains a message property which says "Invalid payload"

#   Examples:
#     | payload            |
#     | {"username": 0}    |
#     | {"password": true} |
#     | {"email": "test"}  |
#     |                    |