Feature: Chat list unread message indicator

    Scenario: Use top unread message indicator to find chat in chat list
        When I log in as chatunreadsender user
        Then I start a DM with chatunreadreciever user
        Then I send several messages to the current chat
        Then I exit the current chat
        And  I sign out
        When I log in as chatunreadreciever user
        Then I can open a chat with chatunreadsender
        And  I scroll up the chat
        Then I click the chat unread message indicator
        And  I can no longer see the unread message indicator
