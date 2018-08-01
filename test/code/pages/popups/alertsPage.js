const Page = require('../page');

class AlertsPage extends Page {
    async dismissNotificationsAlert() {
        try {
            await this.app.waitForExist('~Allow', 5000);
            await this.app.click('~Allow');
        } catch (e) {
            // No push alert present
        }
    }

    get emailConfirmationPopup() {
        return this.getWhenVisible('~popupButton-ok');
    }
}

module.exports = AlertsPage;
