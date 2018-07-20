import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import TopDrawer from '../../components/shared/top-drawer';

@observer
export default class MockTopDrawer extends Component {
    render() {
        return (
            <TopDrawer
                headingText="Heading"
                image={icons.imageIcon(require('../../assets/info-icon.png'), vars.iconSizeMedium2x)}
                descriptionText="Max 2 lines. Lorem Ipsum is simply dummy text of the printing and typesetting industry."
                buttonText="ButtonText"
            />
        );
    }
}
