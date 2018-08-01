const { existingUsers } = require('../helpers/userHelper');

const { defineSupportCode } = require('cucumber');

defineSupportCode(({ When, Then }) => {
    When('I start a DM with {word} user', async function (string) {
        await this.openContactsPickerForDM();
        await this.searchForRecipient(existingUsers[string].name);
        await this.contactSelectorPage.recipientContact(existingUsers[string].name).click();
    });

    When('I create a new room', async function () {
        this.roomName = new Date().getTime();
        await this.chatListPage.buttonCreateNewChat.click();
        await this.chatActionSheetPage.newRoomOption.click();
        await this.roomCreationPage.textInputRoomName.setValue(this.roomName);
        await this.roomCreationPage.hideKeyboardHelper();
        await this.roomCreationPage.nextButton.click();
        await this.roomCreationPage.goButton.click();
        await this.chatPage.buttonExitChat.click();
    });

    When('I exit the current chat', async function () {
        await this.chatPage.buttonExitChat.click();
    });

    Then('I can send a message to the current chat', async function () {
        const message = `Test Message ${new Date()}`;
        await this.chatPage.textInput.setValue(message);
        await this.chatPage.hideKeyboardHelper();
        await this.chatPage.buttonSendMessage.click();
    });

    Then('I send several messages to the current chat', async function () {
        await this.chatPage.buttonUploadToChat.click();
        await this.fileUploadPage.uploadFileFromGallery();
        await this.filesListPage.fileSharePreviewPopup.click();
    });

    Then('I scroll down the chat list', async function () {
        await this.chatListPage.scrollDownHelper();
    });

    Then('I press the top unread message indicator', async function () {
        await this.chatListPage.topUnreadMessageIndicator.click();
    });

    Then('I can see the top unread chat', async function () {
        await this.chatListPage.chatWithTitleIsVisible(process.env.TOPUNREADINDICATOR_TEST_USER);
    });

    Then('I press the bottom unread message indicator', async function () {
        await this.chatListPage.bottomUnreadMessageIndicator.click();
    });

    Then('I can see the bottom unread chat', async function () {
        await this.chatListPage.chatWithTitleIsVisible(process.env.BOTTOMUNREADINDICATOR_TEST_USER);
    });

    Then('I can open a chat with {word}', async function (string) {
        await this.chatListPage.chatWithTitle(string).click();
    });

    Then('I scroll up the chat', async function () {
        await this.app.pause(5000); // wait till chat loads
        await this.chatPage.testAction2();
    });

    Then('I click the chat unread message indicator', async function () {
        await this.chatPage.chatUnreadMessageIndicator.click();
    });

    Then('I can no longer see the unread message indicator', async function () {
        await this.chatPage.chatUnreadMessageIndicatorDisappeared;
    });

    Then('They can send a message to the current chat', async function () {
        const message = `Test Message ${new Date()}`;
        await this.chatPage.textInput.setValue(message);
        await this.chatPage.hideKeyboardHelper();
        await this.chatPage.buttonSendMessage.click();
    });

    Then('I recieve placeholder DM', async function () {
        await this.chatListPage.chatWithTitle(this.username).click();
    });

    Then('They recieve placeholder DM', async function () {
        await this.chatListPage.chatWithTitle(process.env.PLACEHOLDERDM_TEST_USER).click();
    });

    Then('I cannot see their DM', async function () {
        const dmExists = await this.chatListPage.chatWithTitleExists(this.username);
        dmExists.should.be.false; // eslint-disable-line
    });

    Then('They cannot see my DM', async function () {
        const dmExists = await this.chatListPage.chatWithTitleExists(process.env.PLACEHOLDERDM_TEST_USER);
        dmExists.should.be.false; // eslint-disable-line
    });

    Then('User accepts placeholder DM', async function () {
        await this.chatPage.messageDmPlaceholder.click();
    });

    Then('User dismisses placeholder DM', async function () {
        await this.chatPage.dismissDmPlaceholder.click();
    });

    Then('I am in the chat list page', async function () {
        await this.chatListPage.buttonCreateNewChat;
    });
});
