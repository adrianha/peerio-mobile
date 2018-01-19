import React, { Component } from 'react';
import { Animated, View, Text, Image, Easing } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable, computed } from 'mobx';
import { vars } from '../../styles/styles';
import loginState from '../login/login-state';
import routerApp from '../routes/router-app';
import { socket } from '../../lib/icebear';
import { promiseWhen } from '../helpers/sugar';
import routerMain from '../routes/router-main';
import { tx } from '../utils/translator';
import SnackBarConnection from '../snackbars/snackbar-connection';

const smallIcon = {
    height: vars.iconSize,
    width: vars.iconSize,
    marginHorizontal: vars.spacing.small.midi,
    transform: [{ scale: 1 }]
};
const bigIcon = {
    height: vars.iconSize,
    width: vars.iconSize,
    marginHorizontal: vars.spacing.small.midi
};

@observer
export default class LoadingScreen extends Component {
    // Animations
    animationStyle;
    fadeValue;
    growValue;
    // States
    @observable loadingStep = 0;
    iconState;
    @observable randomMessage;

    constructor(props) {
        super(props);
        this.fadeValue = new Animated.Value(0.70);
        this.growValue = new Animated.Value(1);
        this.animationStyle = {
            transform: [{ scale: this.growValue }],
            opacity: this.fadeValue
        };
        this.randomMessage = tx(this.randomMessages[Math.floor(Math.random() * this.randomMessages.length)]);
    }

    async componentDidMount() {
        try {
            await loginState.load();
            if (!loginState.loaded) throw new Error('error logging in after return');
            this.goToNextStep();
            await promiseWhen(() => socket.authenticated);
            this.goToNextStep();
            await promiseWhen(() => routerMain.chatStateLoaded);
            this.goToNextStep();
            await promiseWhen(() => routerMain.fileStateLoaded);
            this.goToNextStep();
            await promiseWhen(() => routerMain.contactStateLoaded);
        } catch (e) {
            console.log('loading-screen.js: loading screen error');
            if (!loginState.loaded) routerApp.routes.loginStart.transition();
            console.error(e);
            return;
        }
        this.fadeInOut();
        this.growIcon();
    }

    fadeInOut() {
        Animated.sequence([
            Animated.timing(
                this.fadeValue,
                {
                    toValue: 1,
                    duration: 400,
                    easing: Easing.linear,
                    useNativeDriver: true
                }),
            Animated.timing(
                this.fadeValue,
                {
                    toValue: 0.70,
                    duration: 400,
                    easing: Easing.linear,
                    useNativeDriver: true
                })
        ]).start(() => this.fadeInOut());
    }

    growIcon() {
        Animated.timing(
            this.growValue,
            {
                toValue: 1.5,
                duration: 300,
                easing: Easing.linear,
                useNativeDriver: true
            }).start();
    }

    goToNextStep = () => {
        this.loadingStep++;
        this.growIcon(); // Restarts animation
        this.iconState = this.currentState;
    };

    @computed get currentState() {
        const result = {};
        const numberOfSteps = Object.keys(this.icons).length - 1;
        Object.keys(this.icons).forEach((name, i) => {
            result[name] = {};
            if (!socket.connected) {
                if (i === numberOfSteps) result[name].line = null; // Icon on the far right should not have a line
                else result[name].line = this.lines.dormant;
                result[name].icon = this.icons[name].source.dormant;
                result[name].iconStyle = smallIcon;
                result.statusText = tx('title_waitingToConnect');
            } else if (i < this.loadingStep) {
                if (i === numberOfSteps) result[name].line = null; // Icon on the far right should not have a line
                else result[name].line = this.lines.done;
                result[name].icon = this.icons[name].source.done;
                result[name].iconStyle = smallIcon;
            } else if (i === this.loadingStep) {
                if (i === numberOfSteps) result[name].line = null; // Icon on the far right should not have a line
                else result[name].line = this.lines.inProgress;
                result[name].icon = this.icons[name].source.inProgress;
                result[name].iconStyle = [bigIcon, this.animationStyle];
                result.statusText = tx(this.icons[name].copy);
            } else {
                if (i === numberOfSteps) result[name].line = null; // Icon on the far right should not have a line
                else result[name].line = this.lines.dormant;
                result[name].icon = this.icons[name].source.dormant;
                result[name].iconStyle = smallIcon;
            }
        });
        return result;
    }

    getSource(imageName) {
        return this.imagesNew[this.loadingStep][imageName];
    }

    renderImages = (name) => {
        const lineStyle = {
            height: 3,
            width: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 5
        };
        this.iconState = this.currentState;
        return (
            <View key={name} style={{ flexDirection: 'row', height: vars.iconSizeLarge, justifyContent: 'center', alignItems: 'center' }}>
                <Animated.Image
                    key={`${name}Icon`}
                    source={this.iconState[`${name}`].icon}
                    style={this.iconState[`${name}`].iconStyle}
                    resizeMode="contain"
                />
                {this.iconState[`${name}`].line && <Image
                    key={`${name}Line`}
                    source={this.iconState[`${name}`].line}
                    style={lineStyle}
                    resizeMode="contain"
                />}
            </View>
        );
    };

    render() {
        const container = {
            backgroundColor: 'white',
            flex: 1,
            flexGrow: 1,
            alignItems: 'center'
        };
        const flavorTextStyle = {
            fontSize: vars.font.size.big,
            color: vars.subtleText,
            paddingHorizontal: vars.spacing.medium.maxi2x,
            textAlign: 'center',
            marginTop: vars.loadingScreenMarginTop
        };
        const loadingProgressContainer = {
            flex: 1,
            flexGrow: 1,
            justifyContent: 'flex-end',
            marginBottom: vars.loadingScreenMarginBottom
        };
        const iconContainer = {
            flexDirection: 'row',
            paddingHorizontal: vars.spacing.large.maxi,
            height: vars.iconSizeLarge,
            justifyContent: 'center',
            alignItems: 'center'
        };
        const statusTextStyle = {
            marginTop: vars.spacing.medium.midi2x,
            fontSize: vars.font.size.big,
            color: vars.subtleText,
            textAlign: 'center'
        };
        return (
            <View style={container}>
                {socket.connected && <Text style={flavorTextStyle}>
                    {this.randomMessage}
                </Text>}
                <View style={loadingProgressContainer}>
                    <View style={iconContainer}>
                        {Object.keys(this.icons).map(this.renderImages)}
                    </View>
                    <Text style={statusTextStyle}>
                        {this.iconState.statusText}
                    </Text>
                </View>
                <View style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
                    <SnackBarConnection />
                </View>
            </View>
        );
    }

    randomMessages = [
        'title_randomMessage1',
        'title_randomMessage2',
        'title_randomMessage3',
        'title_randomMessage4'
    ];

    lines = {
        dormant: require('../../assets/loading_screens/line-dormant.png'),
        inProgress: require('../../assets/loading_screens/line-inProgress.png'),
        done: require('../../assets/loading_screens/line-done.png')
    };

    icons = {
        connecting: {
            copy: 'title_connecting',
            source: {
                dormant: require('../../assets/loading_screens/connecting-dormant.png'),
                inProgress: require('../../assets/loading_screens/connecting-inProgress.png'),
                done: require('../../assets/loading_screens/connecting-done.png')
            }
        },
        authenticating: {
            copy: 'title_authenticating',
            source: {
                dormant: require('../../assets/loading_screens/authenticating-dormant.png'),
                inProgress: require('../../assets/loading_screens/authenticating-inProgress.png'),
                done: require('../../assets/loading_screens/authenticating-done.png')
            }
        },
        decrypting: {
            copy: 'title_decrypting',
            source: {
                dormant: require('../../assets/loading_screens/decrypting-dormant.png'),
                inProgress: require('../../assets/loading_screens/decrypting-inProgress.png'),
                done: require('../../assets/loading_screens/decrypting-done.png')
            }
        },
        confirming: {
            copy: 'title_confirming',
            source: {
                dormant: require('../../assets/loading_screens/confirming-dormant.png'),
                inProgress: require('../../assets/loading_screens/confirming-inProgress.png'),
                done: require('../../assets/loading_screens/confirming-done.png')
            }
        },
        done: {
            copy: 'title_done',
            source: {
                dormant: require('../../assets/loading_screens/done-dormant.png'),
                inProgress: require('../../assets/loading_screens/done-inProgress.png'),
                done: require('../../assets/loading_screens/done-done.png')
            }
        }
    };
}
