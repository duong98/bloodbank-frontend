import React, {useEffect, useState} from "react";
import Router from "next/router";
import {connect} from 'react-redux';
import PageLayout from "../../src/components/PageLayout.js"
import {Card, Layout, Page} from "@shopify/polaris";
import {
    CalendarTickMajorMonotone,
    HeartMajorMonotone
} from "@shopify/polaris-icons";
import api from "../../config/api";

function Event(props) {
    const [bloodEvents, setBloodEvents] = useState([]);
    const [registeredEvents, setRegisteredEvents] = useState([]);

    useEffect(() => {
        //COMPONENT DID MOUNT
        api.getBloodEventsDonors((isSuccess, response, error) => {
            if (isSuccess) setBloodEvents(response.data.data);
            else console.log(error.response);
        });

    }, []);

    useEffect(() => {
        // COMPONENT DID UPDATE

        // IF GET USER DATA SUCCESSFULLY THEN GET RUN THESE FUNCTIONS
        if (props.userName) api.getRegisteredBloodEvent((isSuccess, response, error) => {
            if (isSuccess) setRegisteredEvents(response.data.data);
            else console.log(error.response);
        });

    }, [props.userName]);

    const onClickRegisterEvent = (eventId) => {
        api.postRegisterBloodEvent({event_id: eventId}, (isSuccess, response, error) => {
            //UPDATE REGISTERED EVENT IF SUCCESS
            if (isSuccess) api.getRegisteredBloodEvent((isSuccess, response, error) => {
                if (isSuccess) setRegisteredEvents(response.data.data);
            }); else console.log(error.response);
        })
    };

    const checkIfEventRegistered = (eventId) => {
        //FIND ITEM, CAST TO BOOLEAN TYPE
        return !!registeredEvents.find((item) => {
            return item.event_id === eventId;
        });
    };

    const autoAddZeroInFront = (number) => {
        return number > 9 ? number : "0" + number;
    };

    const generateDateStringFromStamp = (unixTimeStampValue) => {
        let d = new Date(unixTimeStampValue * 1000);
        return (
            autoAddZeroInFront(d.getHours()) + ":" +
            autoAddZeroInFront(d.getMinutes()) + ":" +
            autoAddZeroInFront(d.getSeconds()) + "   " +
            autoAddZeroInFront(d.getDate()) + "/" +
            autoAddZeroInFront(d.getMonth()) + "/" +
            autoAddZeroInFront(d.getFullYear())
        );
    };

    return (
        <PageLayout userName={props.userName}
                    userType={props.userType}
                    expectedUserType={"donor"}
                    navigationArray={[
                        {
                            label: 'Donate Blood',
                            icon: HeartMajorMonotone,
                            onClick: () => {
                                //DO NOT THING BECAUSE ALREADY AT THIS ROUTE
                            },
                        },
                        {
                            label: 'Registered Blood Event',
                            icon: CalendarTickMajorMonotone,
                            onClick: () => {
                                Router.push("/donor/history").then(() => {
                                    console.log("Route successfully from 'donor/event' to 'donor/FormList'");
                                })
                            },
                        },
                    ]}
                    pageTitle={"Events - Blood Donation"}
        >
            <Page title="Donate Blood"
                  subtitle={bloodEvents.length ? "Register Events to donate blood" : "No events available"}
            >
                <Layout>
                    {bloodEvents.map((item) => {
                        return (
                            <Layout.Section key={item.event_id}>
                                <Card>
                                    <Card.Header title={item.name}
                                                 actions={[{
                                                     content: checkIfEventRegistered(item.event_id) ? 'Registered' : 'Register',
                                                     disabled: checkIfEventRegistered(item.event_id),
                                                     onAction: () => {
                                                         onClickRegisterEvent(item.event_id)
                                                     }
                                                 }]}/>
                                    <Card.Section>
                                        <p>Event Date: {generateDateStringFromStamp(item.event_date)}</p>
                                        <p>Event Location: {item.location}</p>
                                    </Card.Section>
                                </Card>
                            </Layout.Section>
                        )
                    })}
                </Layout>
            </Page>
        </PageLayout>
    );

}

export default connect(state => ({
    userName: state.LoginReducer.userName,
    email: state.LoginReducer.email,
    userType: state.LoginReducer.userType,
    userId: state.LoginReducer.userId
}))(Event);
