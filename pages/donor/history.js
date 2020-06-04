import React, { useEffect, useState } from "react";
import Router from "next/router";
import { connect } from "react-redux";
import QRCode from "qrcode.react";
import PageLayout from "../../src/components/PageLayout.js";
import {
  Card,
  Layout,
  Page,
  Collapsible,
  Stack,
  Button,
} from "@shopify/polaris";
import {
  CalendarTickMajorMonotone,
  HeartMajorMonotone,
} from "@shopify/polaris-icons";
import api from "../../config/api";
import { useCallback } from "react";

function History(props) {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [activeCollapse, setActiveCollapse] = useState({});

  useEffect(() => {
    // COMPONENT DID UPDATE

    // IF GET USER DATA SUCCESSFULLY THEN GET RUN THESE FUNCTIONS
    if (props.userName)
      api.getRegisteredBloodEvent((isSuccess, response, error) => {
        if (isSuccess) {
          console.log(response);
          setRegisteredEvents(response.data.data);
          setActiveCollapse(
            response.data.data
              .map((data) => {
                return { [data.event_id]: false };
              })
              .reduce((sumValue, currentValue) => {
                return { ...sumValue, ...currentValue };
              })
          );
        } else console.log(error.response);
      });
  }, [props.userName]);

  const autoAddZeroInFront = (number) => {
    return number > 9 ? number : "0" + number;
  };

  const generateDateStringFromStamp = (unixTimeStampValue) => {
    let d = new Date(unixTimeStampValue * 1000);
    return (
      autoAddZeroInFront(d.getHours()) +
      ":" +
      autoAddZeroInFront(d.getMinutes()) +
      ":" +
      autoAddZeroInFront(d.getSeconds()) +
      "   " +
      autoAddZeroInFront(d.getDate()) +
      "/" +
      autoAddZeroInFront(d.getMonth()) +
      "/" +
      autoAddZeroInFront(d.getFullYear())
    );
  };
  const toggleCollapse = useCallback((id) => {
    setActiveCollapse((activeCollapse) => {
      return { ...activeCollapse, ...{ [id]: !activeCollapse[id] } };
    });
  });
  return (
    <PageLayout
      userName={props.userName}
      userType={props.userType}
      expectedUserType={"donor"}
      navigationArray={[
        {
          label: "Donate Blood",
          icon: HeartMajorMonotone,
          onClick: () => {
            Router.push("/donor/event").then(() => {
              console.log(
                "Route successfully from 'donor/FormList' to 'donor/event'"
              );
            });
          },
        },
        {
          label: "Registered Blood Event",
          icon: CalendarTickMajorMonotone,
          onClick: () => {
            //DO NOT THING BECAUSE ALREADY AT THIS ROUTE
          },
        },
      ]}
      pageTitle={"Registered Events - Blood Donation"}
    >
      <Page
        title="Registered Blood Event"
        subtitle="This page contains data on registered blood event"
      >
        <Layout>
          {registeredEvents.map((item) => {
            return (
              <Layout.Section key={item.event_id}>
                <Card>
                  <Card.Header title={item.name} />
                  <Card.Section title="Blood Identifier">
                    <Stack vertical>
                      <Button
                        primary
                        onClick={() => toggleCollapse(item.event_id)}
                      >
                        Blood Identifier
                      </Button>
                      <Collapsible
                        open={activeCollapse[item.event_id]}
                        id="basic-collapsible"
                        transition={{
                          duration: "150ms",
                          timingFunction: "ease",
                        }}
                      >
                        <QRCode value={item.blood_id} />
                        <p>{item.event_id}</p>
                      </Collapsible>
                    </Stack>
                  </Card.Section>
                  <Card.Section>
                    <p>
                      Donated Date:{" "}
                      {generateDateStringFromStamp(item.donate_date)}{" "}
                    </p>
                    <p>
                      Event Date: {generateDateStringFromStamp(item.event_date)}
                    </p>
                    <p>Location: {item.location}</p>
                  </Card.Section>
                </Card>
              </Layout.Section>
            );
          })}
        </Layout>
      </Page>
    </PageLayout>
  );
}

export default connect((state) => ({
  userName: state.LoginReducer.userName,
  email: state.LoginReducer.email,
  userType: state.LoginReducer.userType,
  userId: state.LoginReducer.userId,
}))(History);
