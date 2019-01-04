  Scenario Outline: Invalid Profile

    When the client creates a PATCH request to /liskit/users/
    And attaches <payload> as the payload
    And sends the request
    Then our API should respond with a 400 HTTP status code
    And the payload of the response should be a JSON object