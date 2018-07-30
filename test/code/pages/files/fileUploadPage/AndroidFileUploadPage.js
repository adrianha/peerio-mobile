const Page = require('../../page');
const { selectorWithText, selectorWithPartialResourceId } = require('../../../helpers/androidHelper');

class AndroidFileUploadPage extends Page {
    async uploadFileFromGallery() {
        await this.app.waitForExist(selectorWithText('Upload from gallery')).click(selectorWithText('Upload from gallery'));

        // Select an album from Gallery
        const galleryView = selectorWithPartialResourceId('(.*)root_view');
        await this.app.waitForExist(galleryView).element(galleryView);
        if (process.env.GALLERY_MODE === 'centerTap') {
            await this.galleryTapCenter(galleryView);
        } else {
            await this.galleryTapFirstItem(galleryView);
        }
    }

    async galleryTapCenter(galleryView) {
        // Get gallery size and position
        const galleryX = await this.app.getLocation(galleryView, 'x');
        const galleryY = await this.app.getLocation(galleryView, 'y');

        const galleryW = await this.app.getElementSize(galleryView, 'width');
        const galleryH = await this.app.getElementSize(galleryView, 'height');

        // Tap in the center of gallery
        await this.app.touchPerform([{
            action: 'tap',
            options: {
                x: galleryX + galleryW / 2,
                y: galleryY + galleryH / 2
            }
        }]);

        // Double tap is needed as it doesn't work without it
        await this.app.touchPerform([{
            action: 'tap',
            options: {
                x: galleryX + galleryW / 2,
                y: galleryY + galleryH / 2
            }
        }]);

        await this.app.pause(2000);
        // Select an image from Gallery
        await this.app.waitForExist(galleryView).element(galleryView);

        // Get album size and position
        const photosX = await this.app.getLocation(galleryView, 'x');
        const photosY = await this.app.getLocation(galleryView, 'y');

        const photosW = await this.app.getElementSize(galleryView, 'width');
        const photosH = await this.app.getElementSize(galleryView, 'height');

        // Tap in the center of gallery
        await this.app.touchPerform([{
            action: 'tap',
            options: {
                x: photosX + photosW / 2,
                y: photosY + photosH / 2
            }
        }]);
    }

    async galleryTapFirstItem(galleryView) {
        // Get gallery size and position
        const galleryX = await this.app.getLocation(galleryView, 'x');
        const galleryY = await this.app.getLocation(galleryView, 'y');

        const galleryW = await this.app.getElementSize(galleryView, 'width');
        const galleryH = await this.app.getElementSize(galleryView, 'height');

        await this.app.pause(2000);
        // Assumption: 2 albums per row, 3 per column
        const albumsPerRow = 2;
        const albumsPerColumn = 3;
        // Tap in the center of first album
        await this.app.touchPerform([{
            action: 'tap',
            options: {
                x: galleryX + (galleryW / albumsPerRow) / 2,
                y: galleryY + (galleryH / albumsPerColumn) / 2
            }
        }]);

        await this.app.pause(4000);
        // Select an image from Gallery

        await this.app.waitForExist(galleryView).element(galleryView);

        // Get album size and position
        const photosX = await this.app.getLocation(galleryView, 'x');
        const photosY = await this.app.getLocation(galleryView, 'y');

        const photosW = await this.app.getElementSize(galleryView, 'width');
        const photosH = await this.app.getElementSize(galleryView, 'height');

        // Assumption: 3 albums per row, 4 per column
        const photosPerRow = 3;
        const photosPerColumn = 4;
        // Tap in the center of first photo
        await this.app.touchPerform([{
            action: 'tap',
            options: {
                x: photosX + (photosW / photosPerRow) / 2,
                y: photosY + (photosH / photosPerColumn) / 2
            }
        }]);
    }
}

module.exports = AndroidFileUploadPage;
