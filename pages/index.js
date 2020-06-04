import React, {useCallback, useState} from 'react';
import {Layout, Button, TextField, FormLayout, Form, ChoiceList, AppProvider, Toast, Frame} from '@shopify/polaris';
import {connect} from 'react-redux'
import LoginAction from '../src/redux/actions/LoginAction';
import api from '../config/api';
import StringUtil from '../src/utils/StringUtils';
import AuthenticationRouteUtils from '../src/utils/AuthenRouteUtils';
import Router from "next/router";

class HomePage extends React.Component {
    constructor(props) { // must have a constructor to inherit props from parent component
        super(props);
        // bind all the props and state to this function
        this.state = {
            userName: "",
            userType: "donor",
            email: "",
            password: "",
            confirm_password: "",
            loginErrorMessage: "",

            isLoginPage: true,

            activeToast: false,
            toastMessage: "",
        };
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleChangeChoiceList = this.handleChangeChoiceList.bind(this);
    }

    handleChangeChoiceList(value) {
        this.setState({
            userType: value[0]
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.userName) {
            let route = AuthenticationRouteUtils.stringRouteByRole(this.props.userType);
            Router.push(route).then(() => {
                console.log("route successfully from /login to " + route);
            });
        }
    }

    async handleLogin() {
        const {email, password, userType} = this.state;
        // EVALUATE THE INPUTS
        let isEmptyEmail = StringUtil.isEmpty(email);
        let isEmptyPassword = StringUtil.isEmpty(password);
        let isEmail = StringUtil.isEmail(email);
        if (!isEmptyEmail && !isEmptyPassword && isEmail && password.length >= 6) {
            this.setState({
                loginErrorMessage: ""
            });
            let payload = {
                email: email,
                password: password,
                role: userType
            };
            await api.login(payload, this.onHandleLogin.bind(this))
        } else {
            if (isEmptyEmail || isEmptyPassword)
                this.setState({
                    loginErrorMessage: "You need to fill in all the information needed"
                });
            else if (!isEmail)
                this.setState({
                    loginErrorMessage: "Wrong email format"
                });
            else if (password.length < 6) {
                this.setState({
                    loginErrorMessage: "Password length is too short"
                })
            }
        }
    }

    onHandleLogin(isSuccess, response, error) {
        if (isSuccess) {
            console.log("response data: ", response);
            let user = response.data.returnedUser;
            let payload = {
                userType: this.state.userType,
                userId: user.userId,
                name: user.name,
                email: user.email
            };

            //HANDLE DATA FOR DONOR
            if (user.address) payload.address = user.address;
            if (user.dob) payload.dob = user.dob;
            if (user.blood_type) payload.blood_type = user.blood_type;

            localStorage.setItem("token", response.data.token);
            this.props.dispatch(LoginAction.logIn(payload));
            let route = AuthenticationRouteUtils.stringRouteByRole(this.state.userType);
            Router.push(route).then(() => {
                console.log("route successfully from /login to " + route);
            });

        } else {
            console.log("ERROR========================================");
            if (error.response) {
                console.log("response data: " + error.response.data.message || error.response.data.error);

                // UNEXPECTED ERROR GOES HERE
                if (error.response.status === 500) this.setState({
                    loginErrorMessage: "There is something wrong with the server"
                });

                // PREDICTED ERRORS THAT HAVE ALREADY BEEN HANDLED FROM THE SERVER
                else this.setState({
                    loginErrorMessage: error.response.data.error || error.response.data.message
                });
            }
        }
    }

    async handleRegister() {
        const {userName, email, password, confirm_password, userType} = this.state;
        // EVALUATE THE INPUTS
        let isEmptyUserName = StringUtil.isEmpty(userName);
        let isEmptyEmail = StringUtil.isEmpty(email);
        let isEmptyPassword = StringUtil.isEmpty(password);
        let isEmptyConfirmPassword = StringUtil.isEmpty(confirm_password);
        let isEmail = StringUtil.isEmail(email);

        if (isEmptyEmail || isEmptyPassword || isEmptyConfirmPassword || isEmptyUserName)
            this.setState({
                loginErrorMessage: "You need to fill in all the information needed"
            });
        else if (!isEmail)
            this.setState({
                loginErrorMessage: "Wrong email format"
            });
        else if (password.length < 6) {
            this.setState({
                loginErrorMessage: "Password length is too short"
            })
        }
        else if (password !== confirm_password) {
            this.setState({
                loginErrorMessage: "Password does not match"
            })
        } else {
            //EVERYTHING IS OK, API REQUEST
            this.setState({
                loginErrorMessage: ""
            });
            let payload = {
                name: userName,
                email: email,
                password: password,
                role: userType
            };
            await api.register(payload, this.onHandleRegister.bind(this))
        }
    }

    onHandleRegister(isSuccess, response, error) {
        if (isSuccess) this.showToastWithMessage("Register successfully");
        else {
            try {
                this.setState({
                    loginErrorMessage: error.response.data.error.toString()
                });
            } catch (err) {
                this.setState({
                    loginErrorMessage: "Unexpected Error, check your internet connection"
                });
            }
        }
    }

    routeHelloWorld = () => {
        this.setState({
            isLoginPage: false,
            loginErrorMessage: ""
        });
    }

    routeSignIn = () => {
        this.setState({
            isLoginPage: true,
            loginErrorMessage: ""
        });
    }

    toggleActiveToast = () => this.setState({
        activeToast : !this.state.activeToast
    });


    showToastWithMessage = (message) => {
        this.setState({
            toastMessage: message,
            activeToast: true
        });
    };

    render() {
        const ToastSuccessUpdateProfile = this.state.activeToast ? (
            <Toast content={this.state.toastMessage} onDismiss={this.toggleActiveToast} />
        ) : null;

        return (
            <AppProvider>
                <Frame>
                <div className="container">
                    <div className="login-image">
                    </div>
                    <div className="login-form">
                        <p className="login-title">
                            Blood donation system
                        </p>
                        {
                            !this.state.isLoginPage ?
                                <TextField
                                    placeholder="Full Name"
                                    value={this.state.userName}
                                    error={!this.state.isLoginPage ? this.state.loginErrorMessage : null}
                                    onChange={(txt) => {
                                        this.setState({
                                            userName: txt,
                                            loginErrorMessage: ""
                                        })
                                    }}/>
                                : null
                        }
                        { !this.state.isLoginPage ? <br/> : null }
                        <TextField
                            placeholder="Email"
                            value={this.state.email}
                            error={this.state.isLoginPage ? this.state.loginErrorMessage : null}
                            onChange={(txt) => {
                                this.setState({
                                    email: txt,
                                    loginErrorMessage: ""
                                })
                            }}/>
                        <br/>
                        <TextField
                            placeholder="Password"
                            type="password"
                            value={this.state.password}
                            onChange={(txt) => {
                                this.setState({
                                    password: txt,
                                    loginErrorMessage: ""
                                })
                            }}/>
                        <br/>
                        {
                            !this.state.isLoginPage ?
                                <TextField
                                    placeholder="Confirm Password"
                                    type="password"
                                    value={this.state.confirm_password}
                                    onChange={(txt) => {
                                        this.setState({
                                            confirm_password: txt,
                                            loginErrorMessage: ""
                                        })
                                    }}/>
                                : null
                        }
                        { !this.state.isLoginPage ? <br/> : null }
                        <ChoiceList
                            title="Tell us who you are"
                            choices={[
                                {label: 'Donor', value: 'donor'},
                                {label: 'Organizer', value: 'organizer'},
                                {label: 'Red-cross', value: 'red_cross'},
                                {label: 'Hospital', value: 'hospital'},
                            ]}
                            selected={this.state.userType}
                            onChange={this.handleChangeChoiceList}
                        />
                        <br/>
                        <Button destructive onClick={this.state.isLoginPage ? this.handleLogin : this.handleRegister}>
                            {this.state.isLoginPage ? "Login" : "Register"}
                        </Button>
                        <p className="sign-up">
                            {this.state.isLoginPage ? "Do not have an account ? " : "Already have an account ? "}
                            <a onClick={this.state.isLoginPage ? this.routeHelloWorld : this.routeSignIn}>
                                {this.state.isLoginPage ? "Sign up" : "Sign in"}
                            </a>
                        </p>

                    </div>
                </div>
                {ToastSuccessUpdateProfile}
                </Frame>
            </AppProvider>
        );
    }
}

export default connect(state => ({
    userName: state.LoginReducer.userName,
    email: state.LoginReducer.email,
    userType: state.LoginReducer.userType,
    userId: state.LoginReducer.userId
}))(HomePage);