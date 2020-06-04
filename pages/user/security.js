import React, {useCallback, useState} from "react";
import Router from "next/router";
import {connect} from 'react-redux';
import PageLayout from "../../src/components/PageLayout.js"
import {Button, Card, FormLayout, Layout, Page, TextField, Toast} from "@shopify/polaris"
import {ProfileMajorMonotone, LockMajorMonotone, ArrowLeftMinor} from "@shopify/polaris-icons";
import AuthenticationRouteUtils from "../../src/utils/AuthenRouteUtils";
import api from "../../config/api";
import StringUtil from "../../src/utils/StringUtils";


function Security(props) {
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errorPassword, setErrorPassword] = useState("");
    const [errorNewPassword, setErrorNewPassword] = useState("");
    const [errorConfirmPassword, setErrorConfirmPassword] = useState("");

    const [loadingSavePassword, setLoadingSavePassword] = useState(false);

    const resetError = () => {
        setErrorPassword("");
        setErrorNewPassword("");
        setErrorConfirmPassword("");
    };

    const handleClickSavePassword = () => {
        let haveError = false;

        //CLIENT CHECK PASSWORD
        if (password === "") {
            setErrorPassword("This field cannot be blank");
            haveError = true;
        }
        if (newPassword === "") {
            setErrorNewPassword("This field cannot be blank");
            haveError = true;
        }
        if (confirmPassword === "") {
            setErrorConfirmPassword("This field cannot be blank");
            haveError = true;
        }
        else if (newPassword !== confirmPassword) {
            setErrorNewPassword("Password does not match");
            haveError = true;
        }

        if (!haveError) {
            setLoadingSavePassword(true);

            //ERROR CHECK PASSED, SEND HTTP REQUEST
            let payload = {
                password: password,
                new_password: newPassword,
                confirm_password: confirmPassword
            };

            api.updateUserPassword(payload,  (isSuccess, response, error) => {
                setLoadingSavePassword(false);
                if (isSuccess) showToastWithMessage("Password updated");
                else {
                    if (error.response) {
                        let responseData = error.response.data;
                        if (responseData) {
                            if (responseData.password) setErrorPassword(responseData.password);
                            if (responseData.new_password) setErrorNewPassword(responseData.new_password);
                            if (responseData.confirm_password) setErrorConfirmPassword(responseData.confirm_password);
                        }
                    } else showToastWithMessage("Unexpected error occurs");
                }
            });
        } else setLoadingSavePassword(false);

    };

    const [activeToast, setActiveToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const toggleActiveToast = useCallback(() => setActiveToast((active) => !active), []);
    const ToastSuccessUpdateProfile = activeToast ? (
        <Toast content={toastMessage} onDismiss={toggleActiveToast} />
    ) : null;

    const showToastWithMessage = (message) => {
        setToastMessage(message);
        setActiveToast(true);
    };

    return (
        <PageLayout userName={props.userName}
                    userType={props.userType}

                    sideBarTitle={"User Settings"}
                    navigationArray={[
                        {
                            label: 'Profile',
                            icon: ProfileMajorMonotone,
                            onClick: () => {
                                Router.push("/user/profile").then(() => {
                                });
                            },
                        },
                        {
                            label: 'Security',
                            icon: LockMajorMonotone,
                            onClick: () => {
                            },
                        },
                        props.userName ?
                            {
                                label: 'Back to ' + (props.userType.charAt(0).toUpperCase() + StringUtil.roleToString(props.userType).slice(1)) + ' page',
                                icon: ArrowLeftMinor,
                                onClick: () => {
                                    let route = AuthenticationRouteUtils.stringRouteByRole(props.userType);
                                    Router.push(route).then(() => {
                                    });
                                }
                            } : {
                                label: 'Back',
                                icon: ArrowLeftMinor,
                                disabled: true
                            },
                    ]}
                    pageTitle={"Security - Blood Donation"}
        >
            <Page>
                <Layout.AnnotatedSection
                    title="Security"
                    description="Change password frequently to help your account stay secure."
                >
                    <Card sectioned>
                        <FormLayout>
                            <TextField label="Current Password"
                                       type={"password"}
                                       value={password}
                                       error={errorPassword}
                                       onChange={(value) => {
                                           resetError();
                                           setPassword(value);
                                       }}
                            />
                            <TextField label="New Password"
                                       type={"password"}
                                       value={newPassword}
                                       error={errorNewPassword}
                                       onChange={(value) => {
                                           resetError();
                                           setNewPassword(value);
                                       }}
                            />
                            <TextField label="Confirm Password"
                                       type={"password"}
                                       value={confirmPassword}
                                       error={errorConfirmPassword}
                                       onChange={(value) => {
                                           resetError();
                                           setConfirmPassword(value);
                                       }}
                            />
                            <Button primary onClick={handleClickSavePassword} loading={loadingSavePassword}>Save
                                Password</Button>
                        </FormLayout>
                    </Card>
                </Layout.AnnotatedSection>

            </Page>
            {ToastSuccessUpdateProfile}
        </PageLayout>
    );
}

export default connect(state => ({
    userName: state.LoginReducer.userName,
    email: state.LoginReducer.email,
    userType: state.LoginReducer.userType,
    userId: state.LoginReducer.userId
}))(Security);