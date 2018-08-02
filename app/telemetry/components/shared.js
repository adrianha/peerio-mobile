/*
    These are the events for components that are shared between multiple views.
    Since they appear in more than one place, they need to know the current route for the `Sublocation` prop.
    Thus, they need to react to TmHelper.currentRoute.
*/
import { telemetry } from '../../lib/icebear';
import { setup } from '../main';
import TmHelper from '../helpers';

const { S, textInput } = telemetry;

const shared = setup({
    styledTextInputOnFocus: (label) => {
        return textInput(label, null, TmHelper.currentRoute, S.IN_FOCUS);
    },

    // Used to send errors when input is blurred
    styledTextInputOnBlur: (label, errorMsg) => {
        let errorMessage = errorMsg;
        if (!errorMsg) return null; // Do not send error event if there is not error message
        if (errorMsg === 'error_usernameNotAvailable') return null; // Do not track this error here
        if (errorMsg === 'error_invalidName') errorMessage = 'Not allowed'; // More presentable on Telemetry
        return textInput(label, null, TmHelper.currentRoute, S.ERROR, errorMessage);
    },

    // Used to send errors when error occurs
    styledTextInputOnError: (label, errorMsg) => {
        if (errorMsg !== 'error_usernameNotAvailable' && errorMsg !== 'error_wrongAK') return null;
        return textInput(label, null, TmHelper.currentRoute, S.ERROR, errorMsg);
    },

    startAccountCreation: () => {
        return [
            S.START_ACCOUNT_CREATION,
            {
                text: S.CREATE_ACCOUNT,
                sublocation: TmHelper.currentRoute
            }
        ];
    }
});


module.exports = shared;
