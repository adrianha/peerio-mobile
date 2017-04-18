import { observer } from 'mobx-react/native';
import SnackbarBase from './snackbar-base';
import snackbarState from './snackbar-state';

@observer
export default class Snackbar extends SnackbarBase {
    level = 'medium';

    // to override
    getText() { return snackbarState.text; }

    tap() {
        this.hide(() => snackbarState.pop());
    }
}
