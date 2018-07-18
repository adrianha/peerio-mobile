import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Image, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { User } from '../../lib/icebear';
import settingsState from '../settings/settings-state';
import plans from '../payments/payments-config';
import { addSystemWarningAction } from '../shared/popups';
import { vars } from '../../styles/styles';
import Text from '../controls/custom-text';
import { tx } from '../utils/translator';

const container = {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: vars.settingsItemHeight
};

const titleStyle = {
    color: vars.textBlack38
};

const descriptionTextStyle = {
    color: vars.peerioBlue,
    fontSize: vars.font.size.smaller
};

@observer
export default class PaymentStorageUsageItem extends SafeComponent {
    renderThrow() {
        const u = User.current;
        if (!u) return null;
        const hideUpgrade = plans.userHasPaidPlan() || process.env.PEERIO_DISABLE_PAYMENTS;
        return (
            <View style={container}>
                <Image source={require('../../assets/icons/cloud-in-circle.png')} style={{ width: 42, height: 42, margin: vars.spacing.small.midi2x }} />
                <View>
                    <Text semibold style={titleStyle}>{tx('title_storageUsed', { percent: u.fileQuotaUsedPercent, storage: u.fileQuotaTotalFmt })}</Text>
                    {!hideUpgrade && <TouchableOpacity pressRetentionOffset={vars.retentionOffset} onPress={() => settingsState.upgrade()}>
                        <Text style={descriptionTextStyle}>{tx('title_unlockMoreStorage')}</Text>
                    </TouchableOpacity>}
                </View>
            </View>
        );
    }
}

addSystemWarningAction('UPGRADE', () => settingsState.upgrade());
