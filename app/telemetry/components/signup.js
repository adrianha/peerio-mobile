import { telemetry } from '../../lib/icebear';
import { setup } from '../main';
import { getCurrentRoute } from '../helpers';

const { S, duration, textInput } = telemetry;

const signup = setup(
    {
        duration: (item, location, startTime) => {
            return duration(item, location, getCurrentRoute(), startTime);
        },

        swipe: (pageNum, direction) => {
            return [
                S.SWIPE,
                {
                    item: S[`CAROUSEL_CARD_${pageNum}`],
                    option: direction,
                    sublocation: getCurrentRoute()
                }
            ];
        },

        viewLink: (item) => {
            return [
                S.VIEW_LINK,
                {
                    item,
                    sublocation: getCurrentRoute()
                }
            ];
        },

        addPhoto: [
            S.ADD_PHOTO,
            {
                sublocation: getCurrentRoute()
            }
        ],

        next: [
            S.NAVIGATE,
            {
                option: S.NEXT,
                sublocation: getCurrentRoute()
            }
        ],

        back: [
            S.NAVIGATE,
            {
                option: S.BACK,
                sublocation: getCurrentRoute()
            }
        ],


        copy: [
            S.COPY,
            {
                item: S.ACCOUNT_KEY,
                sublocation: getCurrentRoute()
            }
        ],

        akConfirmed: () => {
            return textInput(S.AK_CONFIRMATION, null, getCurrentRoute(), S.IN_FOCUS);
        },

        syncContacts: [
            S.SYNC_CONTACTS,
            {
                location: S.ONBOARDING,
                sublocation: getCurrentRoute()
            }
        ],

        skip: [
            S.NAVIGATE,
            {
                option: S.SKIP,
                location: S.ONBOARDING,
                sublocation: getCurrentRoute()
            }
        ],

        contactPermissionDialog: (selected, sublocation) => {
            const ret = [
                S.ALLOW_ACCESS,
                {
                    option: S.CONTACT_LIST,
                    selected,
                    location: S.ONBOARDING
                }
            ];

            if (sublocation) ret[1].sublocation = sublocation || getCurrentRoute();

            return ret;
        },

        addContact: [
            S.ADD_CONTACT,
            {
                text: S.ADD,
                location: S.ONBOARDING,
                sublocation: getCurrentRoute()
            }
        ],

        inviteContact: [
            S.INVITE_CONTACT,
            {
                option: S.VIA_SYNC,
                location: S.ONBOARDING,
                sublocation: getCurrentRoute()
            }
        ],

        confirmInvite: [
            S.INVITE_CONTACT,
            {
                location: S.ONBOARDING,
                sublocation: getCurrentRoute(),
                option: S.VIA_SYNC,
                action: S.CONFIRMED
            }
        ],

        selectOneContact: (selected) => {
            return [
                S.SELECT,
                {
                    option: S.INDIVIDUAL,
                    item: S.CONTACT_LIST_ITEM,
                    location: S.ONBOARDING,
                    sublocation: getCurrentRoute(),
                    selected
                }
            ];
        },

        selectBulkContacts: (selected) => {
            return [
                S.SELECT,
                {
                    option: S.BULK_SELECT,
                    item: S.CONTACT_LIST_ITEM,
                    location: S.ONBOARDING,
                    sublocation: getCurrentRoute(),
                    selected
                }
            ];
        },

        finishSignup: [S.FINISH_SIGN_UP]
    }
);

module.exports = signup;
