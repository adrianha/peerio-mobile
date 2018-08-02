import { telemetry } from '../../lib/icebear';
import { setup } from '../main';

const { S, duration, textInput } = telemetry;

const login = setup(
    {
        duration: (startTime) => {
            return duration(null, S.ONBOARDING, S.SIGN_IN, startTime);
        },

        onLoginWithEmail: () => {
            return textInput(S.USERNAME, null, S.SIGN_IN, S.ERROR, 'Using @');
        },

        toggleAkVisibility: (isVisible) => {
            return [
                S.TOGGLE_VISIBILITY,
                {
                    item: S.ACCOUNT_KEY,
                    visible: isVisible
                }
            ];
        },

        onWhereAccountKeyClick: () => {
            return [
                S.VIEW_LINK, { item: S.WHERE_ACCOUNT_KEY }
            ];
        },

        onNavigateLogin: () => {
            return [
                S.NAVIGATE, { option: S.SIGN_IN }
            ];
        },

        onLoginClick: () => {
            return [
                S.SIGN_IN, { text: S.SIGN_IN }
            ];
        }
    }
);

module.exports = login;
