const Page = require('../../page');

class iOSFileUploadPage extends Page {
    async uploadFileFromGallery() {
        await this.app.element('~Upload from gallery').click(); // by accessibility id

        // Wait for permission to show up
        await this.app.pause(3000);
        if (await this.app.alertText()) {
            await this.app.alertAccept();
        }

        // Wait for albums to show up
        await this.app.pause(3000);
        await this.app.element('~Moments').click(); // by name
        await this.app.element('~Photo, Landscape, August 08, 2012, 6:52 PM').click(); // by accessibility id
    }
}

module.exports = iOSFileUploadPage;
