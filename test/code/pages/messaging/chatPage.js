const Page = require('../page');

class ChatPage extends Page {
    get textInput() {
        return this.getWhenVisible(`~textInputMessage`);
    }

    get buttonSendMessage() {
        return this.getWhenVisible('~buttonSendMessage');
    }

    get buttonUploadToChat() {
        return this.getWhenVisible('~buttonUploadToChat');
    }

    get buttonExitChat() {
        return this.getWhenVisible('~buttonBackIcon');
    }

    get addMembersButton() {
        return this.getWhenVisible('~Add members');
    }

    get invitedContactMore() {
        return this.getElementInContainer('~test_recipient-memberList', '~moreButton');
    }

    get removeInvitedButton() {
        return this.getWhenVisible('~Remove');
    }

    get leaveRoomButton() {
        return this.getWhenVisible('~Leave Room');
    }

    get confirmLeaveRoomButton() {
        return this.getWhenVisible('~popupButton-confirm');
    }

    get alertLeftRoom() {
        return this.getWhenVisible('~popupButton-ok');
    }

    get invitedContactRemoved() {
        return this.app.waitForVisible('~test_recipient-memberList', 5000, true);
    }

    chatWithTitle(selector) {
        return this.getWhenVisible(`~${selector}`);
    }

    get chatUnreadMessageIndicator() {
        return this.getWhenPresent('~chatUnreadMessageIndicator');
    }

    get chatUnreadMessageIndicatorDisappeared() {
        return this.waitToDisappear('~chatUnreadMessageIndicator');
    }

    get messageDmPlaceholder() {
        return this.getWhenVisible('~button_message');
    }

    get dismissDmPlaceholder() {
        return this.getWhenVisible('~button_dismiss');
    }
}

module.exports = ChatPage;
