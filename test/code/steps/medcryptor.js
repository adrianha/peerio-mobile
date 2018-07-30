const { defineSupportCode } = require('cucumber');

defineSupportCode(({ Then }) => {
    Then('I am invited to a patient space', async function () {
        await this.chatListPage.patientSpace;
    });

    Then('I enter the patient space', async function () {
        await this.chatListPage.patientSpace.click();
    });

    Then('I see the rooms in the patient space', async function () {
        await this.chatListPage.internalRoomsHeader;
        await this.chatListPage.patientRoomsHeader;
    });

    Then('I am invited to an internal room', async function () {
        await this.chatListPage.internalRoom.click();
    });

    Then('I leave the current room', async function () {
        await this.chatPage.buttonExitChat.click();
    });

    Then('I enter a consultation room', async function () {
        await this.chatListPage.consultationRoom.click();
    });

    Then('I leave the patient space', async function () {
        await this.chatPage.buttonExitChat.click();
    });
});
