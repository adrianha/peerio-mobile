const Page = require('../page');

class ChatListPage extends Page {
    get buttonCreateNewChat() {
        return this.getWhenVisible('~buttonCreateNewChat');
    }

    chatWithTitle(selector) {
        return this.getWhenVisible(`~${selector}`);
    }

    chatWithTitleIsVisible(selector) {
        return this.checkIfVisible(`~${selector}`);
    }

    chatWithTitleExists(selector) {
        return this.checkIfPresent(`~${selector}`, 25000);
    }

    get topUnreadMessageIndicator() {
        return this.getWhenVisible('~chatlist-unread-indicator-top');
    }

    get bottomUnreadMessageIndicator() {
        return this.getWhenVisible('~chatlist-unread-indicator-bottom');
    }

    get patientSpace() {
        return this.getWhenVisible('~Patient 1');
    }

    get internalRoomsHeader() {
        return this.checkIfVisible('~Internal rooms');
    }

    get patientRoomsHeader() {
        return this.checkIfVisible('~Patient rooms');
    }

    get consultationRoom() {
        return this.getWhenVisible('~Consultation');
    }

    get internalRoom() {
        return this.getWhenVisible('~general');
    }
}

module.exports = ChatListPage;
