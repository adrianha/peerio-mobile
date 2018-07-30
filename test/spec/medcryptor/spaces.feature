@medcryptor
Feature: Patient spaces

    Background:
        Given I log in as doctor user

    Scenario: Navigation in a patient space
        Given I am invited to a patient space
        When  I enter the patient space
        Then  I see the rooms in the patient space

        Given I am invited to an internal room
        When  I leave the current room
        Then  I see the rooms in the patient space

        When  I enter a consultation room
        Then  I can send a message to the current chat

        When  I leave the current room
        Then  I see the rooms in the patient space

        When  I leave the patient space
        Then  I am in the chat list page
