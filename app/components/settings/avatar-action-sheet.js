import { observer } from 'mobx-react/native';
import RNFS from 'react-native-fs';
import ImagePicker from 'react-native-image-crop-picker';
import SafeComponent from '../shared/safe-component';
import { crypto } from '../../lib/icebear';
import { tx } from '../utils/translator';
import ActionSheetLayout from '../layout/action-sheet-layout';
import tm from '../../telemetry';

const { b64ToBytes } = crypto.cryptoUtil;

const SIZE_BASE = 856;
const SIZE1 = 214;
const SIZE2 = 64;

const readFileB64 = async path => RNFS.readFile(path, 'base64');
const readFile = async path => readFileB64(path).then(b64ToBytes);

export { SIZE1, SIZE2 };

async function save(largePath, smallPath) {
    const largeFileB64 = await readFileB64(largePath);
    const largeFile = await b64ToBytes(largeFileB64);
    // console.log(largeFile);
    const smallFile = await readFile(smallPath);
    // console.log(smallFile);
    return {
        buffers: [largeFile.buffer, smallFile.buffer], largeFileB64
    };
}

async function generateResize(path) {
    let result = null;
    try {
        // await FileOpener.open(path, 'image/jpeg');
        console.log(`profile-edit: resizing to ${SIZE1}`);
        const resizedPathLarge = await ImagePicker.resizeImageToMaxSize(path, SIZE1);
        // await FileOpener.open(resizedPathLarge, 'image/png');
        console.log(`profile-edit: resizing to ${SIZE2}`);
        const resizedPathSmall = await ImagePicker.resizeImageToMaxSize(path, SIZE2);
        // await FileOpener.open(resizedPathSmall, 'image/png');
        result = await save(resizedPathLarge, resizedPathSmall);
    } catch (e) {
        console.error(e);
    }
    await ImagePicker.clean();
    return result;
}

async function pickCrop(camera, onSave) {
    const picker = camera ?
        ImagePicker.openCamera.bind(ImagePicker) : ImagePicker.openPicker.bind(ImagePicker);
    const data = await picker({
        width: SIZE_BASE,
        height: SIZE_BASE,
        mediaType: 'photo',
        cropping: true
    });
    if (data) tm.signup.addPhoto();
    console.debug(data);
    onSave(await generateResize(data.path));
}

@observer
export default class AvatarActionSheet extends SafeComponent {
    static show(onSave) {
        const actionButtons = [
            { title: tx('title_chooseFromGallery'), action: () => pickCrop(false, onSave) },
            { title: tx('button_takeAPicture'), action: () => pickCrop(true, onSave) }
        ];
        ActionSheetLayout.show({
            header: null,
            actionButtons,
            hasCancelButton: true
        });
    }
}
