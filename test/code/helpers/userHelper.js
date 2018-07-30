const existingUsers = {
    create_dm_test: {
        name: process.env.CREATE_DM_TEST_USER,
        passphrase: process.env.CREATE_DM_TEST_PASS
    },
    room_test: {
        name: process.env.CREATE_ROOM_TEST_USER,
        passphrase: process.env.CREATE_ROOM_TEST_PASS
    },
    profile_test: {
        name: process.env.PROFILE_TEST_USER,
        passphrase: process.env.PROFILE_TEST_PASS
    },
    upload_to_files: {
        name: process.env.UPLOAD_TO_FILES_USER,
        passphrase: process.env.UPLOAD_TO_FILES_PASS
    },
    upload_to_chat: {
        name: process.env.UPLOAD_TO_CHAT_USER,
        passphrase: process.env.UPLOAD_TO_CHAT_PASS
    },
    placeholder_test: {
        name: process.env.PLACEHOLDERDM_TEST_USER,
        passphrase: process.env.PLACEHOLDERDM_TEST_PASS
    },
    chatListUnreadReciever: {
        name: process.env.CHATLISTUNREADRECIEVER_TEST_USER,
        passphrase: process.env.CHATLISTUNREADRECIEVER_TEST_PASS
    },
    chatListUnreadSender: {
        name: process.env.CHATLISTUNREADSENDER_TEST_USER,
        passphrase: process.env.CHATLISTUNREADSENDER_TEST_PASS
    },
    chatListUnreadReciever_2: {
        name: process.env.CHATLISTUNREADRECIEVER_TEST_USER_2,
        passphrase: process.env.CHATLISTUNREADRECIEVER_TEST_PASS_2
    },
    chatListUnreadSender_2: {
        name: process.env.CHATLISTUNREADSENDER_TEST_USER_2,
        passphrase: process.env.CHATLISTUNREADSENDER_TEST_PASS_2
    },
    chatunreadsender: {
        name: process.env.CHATUNREADSENDER_TEST_USER,
        passphrase: process.env.CHATUNREADSENDER_TEST_PASS
    },
    chatunreadreciever: {
        name: process.env.CHATUNREADRECIEVER_TEST_USER,
        passphrase: process.env.CHATUNREADRECIEVER_TEST_PASS
    },
    leavechannelnav_inviter: {
        name: process.env.LEAVECHANNELNAV_TEST_USER,
        passphrase: process.env.LEAVECHANNELNAV_TEST_PASS
    },
    leavechannelnav_invitee: {
        name: process.env.LEAVECHANNELNAV1_TEST_USER,
        passphrase: process.env.LEAVECHANNELNAV1_TEST_PASS
    },
    doctor: {
        name: process.env.MCR_DOCTOR_USER,
        passphrase: process.env.MCR_DOCTOR_PASS
    }
};

module.exports = { existingUsers };
