import { action, reaction, when } from 'mobx';
import { warnings, socket, clientApp } from '../../lib/icebear';
import { popupYes, popupSystemWarning } from '../shared/popups';
import { tx } from '../utils/translator';
import RoutedState from '../routes/routed-state';
import uiState from '../layout/ui-state';

class SnackBarState extends RoutedState {
    constructor(props) {
        super(props);
        // wait for locale to load
        when(() => uiState.locale, () => {
            reaction(() => warnings.current, sw => {
                if (!sw) return;
                if (sw.level === 'severe') {
                    popupSystemWarning(tx(sw.title), tx(sw.content, sw.data)).then(() => sw.dismiss());
                }
            });

            reaction(() => clientApp.clientVersionDeprecated, value => {
                if (value) warnings.addSevere('warning_deprecated');
            }, true);
        });
    }

    get text() {
        const w = warnings.current;
        return w ? tx(w.content, w.data) : null;
    }

    @action pop() {
        warnings.current && warnings.current.dismiss();
    }

    @action pushTemporary(text) { warnings.add(text); }
}

const snackbarState = new SnackBarState();
when(() => socket.throttled, () => {
    popupYes(`Authentication error`, '425 Throttled', `Your account has been throttled due to unusual activity`)
        .then(() => { socket.throttled = false; });
});

export default snackbarState;
