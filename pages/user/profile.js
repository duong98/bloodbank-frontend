import React, {useEffect, useState, useCallback} from "react";
import Router from "next/router";
import {connect} from 'react-redux';
import PageLayout from "../../src/components/PageLayout.js"
import {
    Page,
    TextField,
    Select,
    FormLayout,
    Layout,
    Card,
    Button,
    DatePicker,
    Modal,
    TextContainer,
    Toast
} from "@shopify/polaris"
import {ProfileMajorMonotone, LockMajorMonotone, ArrowLeftMinor, TeamMajorMonotone} from "@shopify/polaris-icons";
import AuthenticationRouteUtils from "../../src/utils/AuthenRouteUtils";
import api from "../../config/api";
import store from "../../src/redux/store";
import StringUtil from "../../src/utils/StringUtils";
import LoginAction from "../../src/redux/actions/LoginAction";

function Profile(props) {
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userType, setUserType] = useState("");
    const [userId, setUserId] = useState("");
    const [userAddress, setUserAddress] = useState("");
    const [userBloodType, setUserBloodType] = useState("");
    const [isOpenModalRoute, setIsOpenModalRoute] = useState(false);

    const [userDOB, setUserDOB] = useState({
        start: new Date(0),
        end: new Date(0),
    });
    const [{month, year}, setDate] = useState({
        month: 0,
        year: 2020,
    });
    const handleMonthChange = useCallback(
        (month, year) => setDate({month, year}),
        [],
    );

    const [loadingSaveChange, setLoadingSaveChange] = useState(false);

    const roleOptions = [
        {label: 'Donor', value: 'donor'},
        {label: 'Organizer', value: 'organizer'},
        {label: 'Hospital', value: 'hospital'},
        {label: 'Red Cross', value: 'red_cross'}
    ];

    const handleClickSaveChanges = () => {
        setLoadingSaveChange(true);
        let payload = {
            email: userEmail,
            name: userName,
            address: userAddress,
            dob: userDOB.start / 1000
        };

        api.updateUserProfile(payload, (isSuccess, response, error) => {
            setLoadingSaveChange(false);
            console.log(response);
            if (isSuccess) {
                if (userEmail !== props.email || userName !== props.userName) setIsOpenModalRoute(true);

                props.dispatch(LoginAction.logIn({
                    name: userName,
                    email: userEmail,
                    userId: userId,
                    userType: userType,
                    blood_type: userBloodType,
                    dob: userDOB.start / 1000,
                    address: userAddress,
                }));

                showToastWithMessage("Update profile successfully");
            } else {
                if (error.response) {
                    switch(error.response.status) {
                        case 500: showToastWithMessage("Error: internal server error"); break;
                        case 409: showToastWithMessage("Error: username or email has already been used"); break;
                        default: showToastWithMessage("Unexpected error"); break;
                    }
                } else showToastWithMessage("Unexpected error");
            }
        })
    };

    useEffect(() => {
        if (props.userName) {
            setUserName(props.userName);
            setUserEmail(props.email);
            setUserType(props.userType);
            setUserId(props.userId);

            if (props.blood_type) setUserBloodType(props.blood_type);
            else setUserBloodType("A");

            if (props.address) setUserAddress(props.address);
            if (props.dob) {
                let dobDateObj = new Date(props.dob * 1000);
                setUserDOB({
                    start: dobDateObj,
                    end: dobDateObj
                })
                console.log("profile.js | userEffect | month: " + dobDateObj.getMonth() + " year: " + dobDateObj.getFullYear());
                setDate({
                    month: dobDateObj.getMonth(),
                    year: dobDateObj.getFullYear()
                })
            }
        }
    }, [props.userName]);

    const ModalRouteChangedEmail = (
        <Modal
            open={isOpenModalRoute}
            title="Changed Email"
            primaryAction={{
                content: "Move To Sign-in Page",
                onAction: () => {
                    props.dispatch(LoginAction.logOut());
                    localStorage.setItem("token","");
                    Router.push("/").then(() => {});
                }
            }}
        >
            <Modal.Section>
                <TextContainer>
                    <p>
                        You have updated your username or email. A log-in is required.
                    </p>
                </TextContainer>
            </Modal.Section>
        </Modal>
    );

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
                            },
                        },
                        {
                            label: 'Security',
                            icon: LockMajorMonotone,
                            onClick: () => {
                                //DO NOT THING BECAUSE ALREADY AT THIS ROUTE
                                Router.push("/user/security").then(() => {
                                });
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

                    pageTitle={"Profile - Blood Donation"}
        >
            <Page>
                <Layout.AnnotatedSection
                    title="Profile"
                    description="You can update personal information through this section."
                >
                    <Card sectioned>
                        <FormLayout>
                            <TextField label="Full Name" value={userName} onChange={setUserName}/>
                            <TextField type="email" label="Account email" value={userEmail} onChange={setUserEmail}/>
                            {props.userType === "donor" ? <TextField label="Address" value={userAddress} onChange={setUserAddress}/> : null}

                            {props.userType === "donor" ? "Date Of Birth" : null}
                            {props.userType === "donor" ? <DatePicker
                                month={month}
                                year={year}
                                onChange={setUserDOB}
                                onMonthChange={handleMonthChange}
                                selected={userDOB}
                            /> : null}


                            <TextField label="User Identity" value={userId} disabled={true}/>
                            {props.userType === "donor" ? <TextField label="Blood Type" value={userBloodType} disabled={true}/> : null}
                            <Select label="User Type" value={userType} options={roleOptions} disabled={true}/>

                            <Button primary loading={loadingSaveChange} onClick={handleClickSaveChanges}>Save
                                Changes</Button>
                        </FormLayout>
                    </Card>
                </Layout.AnnotatedSection>
            </Page>
            {ModalRouteChangedEmail}
            {ToastSuccessUpdateProfile}
        </PageLayout>
    );
}

export default connect(state => ({
    userName: state.LoginReducer.userName,
    email: state.LoginReducer.email,
    userType: state.LoginReducer.userType,
    userId: state.LoginReducer.userId,
    address: state.LoginReducer.address,
    blood_type: state.LoginReducer.blood_type,
    dob: state.LoginReducer.dob
}))(Profile);