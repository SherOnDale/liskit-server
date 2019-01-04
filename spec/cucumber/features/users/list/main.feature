Feature: List User

  Clients should be able to send to send a request to our API in order to get a list of all existing users.

  Scenario: Client Request

    If the client sends a GET request to /liskit/users, they should receive a response with a 200 status code and payload with list of all users

    When the client creates a GET request to /liskit/users
    And sends the request
    Then our API should respond with a 200 HTTP status code
    And the content type of the response should be JSON
    And the payload of the response should be a JSON object
    And contains an error property set to false
    And contains a message property which says "Successfullly retrieved the user list"
    And contains a payload property of type object
    And the payload contains a property users of type object