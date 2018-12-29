Feature: Create User

  Clients should be able to send a request to our API in order to create a user. Our API should also validate the structure of the payload and respond with an error if it is invalid.

  @test
  Scenario Outline: Bad Client Requests

    If the client sends a POST request to /liskit/users with a bad payload, they should receive a reponse with a 4xx status code.

    When the client creates a POST request to /liskit/users
    And attaches a generic <payloadType> payload
    And sends the request
    Then our API should respond with a <statusCode> HTTP status code
    And the content type of the response should be JSON
    And the payload of the response should be a JSON object
    And contains an error property set to true
    And contains a message property which says <message>

    Examples:

      | payloadType | statusCode | message                                                       |
      | empty       | 400        | 'Payload should not be empty'                                 |
      | non-JSON    | 415        | 'The "Content-Type" header must always be "application/json"' |
      | malformed   | 400        | "Payload should be in JSON format"                            |