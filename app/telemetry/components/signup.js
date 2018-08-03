import { telemetry } from '../../lib/icebear';
import { setup } from '../main';
import TmHelper from '../helpers';

const { S, duration, textInput } = telemetry;

const signup = setup(
    {
        duration: (item, location, startTime) => {
            return duration(item, location, TmHelper.currentRoute, startTime);
        },

        swipe: (pageNum, direction) => {
            return [
                S.SWIPE,
                {
                    item: S[`CAROUSEL_CARD_${pageNum}`],
                    option: direction,
                    sublocation: TmHelper.currentRoute
                }
            ];
        },

        viewLink: (item) => {
            return [
                S.VIEW_LINK,
                {
                    item,
                    sublocation: TmHelper.currentRoute
                }
            ];
        },

        addPhoto: () => {
            return [
                S.ADD_PHOTO,
                {
                    sublocation: TmHelper.currentRoute
                }
            ];
        },

        next: () => {
            return [
                S.NAVIGATE,
                {
                    option: S.NEXT,
                    sublocation: TmHelper.currentRoute
                }
            ];
        },

        back: () => {
            return [
                S.NAVIGATE,
                {
                    option: S.BACK,
                    sublocation: TmHelper.currentRoute
                }
            ];
        },


        copy: () => {
            return [
                S.COPY,
                {
                    item: S.ACCOUNT_KEY,
                    sublocation: TmHelper.currentRoute
                }
            ];
        },

        akConfirmed: () => {
            return textInput(S.AK_CONFIRMATION, null, TmHelper.currentRoute, S.CONFIRMED);
        },

        syncContacts: () => {
            return [
                S.SYNC_CONTACTS,
                {
                    location: S.ONBOARDING,
                    sublocation: TmHelper.currentRoute
                }
            ];
        },

        skip: () => {
            return [
                S.NAVIGATE,
                {
                    option: S.SKIP,
                    location: S.ONBOARDING,
                    sublocation: TmHelper.currentRoute
                }
            ];
        },

        contactPermissionDialog: (selected, sublocation) => {
            const ret = [
                S.ALLOW_ACCESS,
                {
                    option: S.CONTACT_LIST,
                    selected,
                    location: S.ONBOARDING
                }
            ];

            if (sublocation) ret[1].sublocation = sublocation || TmHelper.currentRoute;

            return ret;
        },

        addContact: () => {
            return [
                S.ADD_CONTACT,
                {
                    text: S.ADD,
                    location: S.ONBOARDING,
                    sublocation: TmHelper.currentRoute
                }
            ];
        },

        inviteContact: () => {
            return [
                S.INVITE_CONTACT,
                {
                    option: S.VIA_SYNC,
                    location: S.ONBOARDING,
                    sublocation: TmHelper.currentRoute
                }
            ];
        },

        confirmInvite: () => {
            return [
                S.INVITE_CONTACT,
                {
                    location: S.ONBOARDING,
                    sublocation: TmHelper.currentRoute,
                    option: S.VIA_SYNC,
                    action: S.CONFIRMED
                }
            ];
        },

        selectOneContact: (selected) => {
            return [
                S.SELECT,
                {
                    option: S.INDIVIDUAL,
                    item: S.CONTACT_LIST_ITEM,
                    location: S.ONBOARDING,
                    sublocation: TmHelper.currentRoute,
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
                    sublocation: TmHelper.currentRoute,
                    selected
                }
            ];
        },

        finishSignup: [S.FINISH_SIGN_UP]
    }
);

module.exports = signup;
