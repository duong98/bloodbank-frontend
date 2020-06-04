import React, { useEffect, useState, useCallback } from "react";
import Router from "next/router";
import timeConverter from "../../src/utils/timeConverter";
import { connect } from "react-redux";
import PageLayout from "../../src/components/PageLayout.js";
import {
  Card,
  ResourceItem,
  ResourceList,
  Page,
  TextStyle,
  Avatar,
  Scrollable,
  Layout,
} from "@shopify/polaris";
import {
  OrdersMajorMonotone,
  HeartMajorMonotone,
  ActivitiesMajorMonotone,
  StoreMajorMonotone,
} from "@shopify/polaris-icons";
import api from "../../config/api";
function eventsHistory(props) {
  const [organizeEvents, setOrganizeEvents] = useState([]);

  const getAcceptedBloodEvent = useCallback(() => {
    api.getAcceptedBloodEvent((isSuccess, response, error) => {
      if (isSuccess) setOrganizeEvents(response.data.data);
      else console.log(error.response);
    });
  }, [organizeEvents]);
  useEffect(() => {
    //COMPONENT DID MOUNT
    getAcceptedBloodEvent();
  }, []);
  // useEffect(() => {
  //   //COMPONENT DID MOUNT
  //   getPendingBloodEvent();
  // }, [organizeEvents]);
  const onClickViewDonor = useCallback((eventId) => {}, []);
  return (
    <PageLayout
      userName={props.userName}
      userType={props.userType}
      expectedUserType={"red_cross"}
      navigationArray={[
        {
          label: "Pending Events Requests",
          icon: ActivitiesMajorMonotone,
          onClick: () => {
            //DO NOT THING BECAUSE ALREADY AT THIS ROUTE
            Router.push("/red_cross/pendingEvents").then(() => {
              console.log(
                "Route successfully from 'red_cross/pendingorders' to 'red_cross/pendingEvents'"
              );
            });
          },
        },
        {
          label: " Pending Orders Requests ",
          icon: OrdersMajorMonotone,
          onClick: () => {
            Router.push("/red_cross/pendingOrders").then(() => {
              console.log(
                "Route successfully from 'red_cross/pendingEvents' to 'red_cross/pendingOrders'"
              );
            });
          },
        },
        {
          label: " Testing Blood Donation ",
          icon: HeartMajorMonotone,
          onClick: () => {
            Router.push("/red_cross/testing").then(() => {
              console.log(
                "Route successfully from 'red_cross/pendingorders' to 'red_cross/pendingDonation'"
              );
            });
          },
        },
        {
          label: " Pending Donation ",
          icon: HeartMajorMonotone,
          onClick: () => {
            Router.push("/red_cross/pendingDonation").then(() => {
              console.log(
                "Route successfully from 'red_cross/pendingEvents' to 'red_cross/pendingDonation'"
              );
            });
          },
        },
        {
          label: "Events History",
          icon: ActivitiesMajorMonotone,
          onClick: () => {},
        },
        {
          label: " Orders History ",
          icon: OrdersMajorMonotone,
          onClick: () => {
            Router.push("/red_cross/orderHistory").then(() => {
              console.log(
                "Route successfully from 'red_cross/eventsHistory' to 'red_cross/ordersHistory'"
              );
            });
          },
        },
        {
          label: " Donation History",
          icon: HeartMajorMonotone,
          onClick: () => {
            Router.push("/red_cross/donationHistory").then(() => {
              console.log(
                "Route successfully from 'red_cross/eventsHIstory' to 'red_cross/donationHistorys'"
              );
            });
          },
        },
        {
          label: " Blood Store ",
          icon: StoreMajorMonotone,
          onClick: () => {
            Router.push("/red_cross/bloodstore").then(() => {
              console.log(
                "Route successfully from 'red_cross/pendingEvents' to 'red_cross/bloodstore'"
              );
            });
          },
        },
      ]}
    >
      <Page
        title="Events Management"
        subtitle={
          organizeEvents.length ? "Event history" : "No events available"
        }
      >
        <Layout>
          <Layout.Section>
            <Card title="Events History">
              <Scrollable>
                <ResourceList
                  resourceName={{
                    singular: "event",
                    plural: "events",
                  }}
                  items={organizeEvents}
                  renderItem={(item) => {
                    const { event_id, name, location, event_date } = item;
                    const media = <Avatar size="medium" name={name} />;
                    return (
                      <ResourceItem id={event_id} media={media}>
                        <h3>
                          <TextStyle variation="strong">{name}</TextStyle>
                        </h3>
                        <div>{location}</div>
                        <div>{timeConverter(event_date)}</div>
                      </ResourceItem>
                    );
                  }}
                />
              </Scrollable>
            </Card>
          </Layout.Section>
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
}))(eventsHistory);
