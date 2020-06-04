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
  Toast,
  TextStyle,
  Frame,
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
function pendingEvents(props) {
  const [organizeEvents, setOrganizeEvents] = useState([]);
  const [toastActive, setToastActive] = useState(false);

  const getPendingBloodEvent = useCallback(() => {
    api.getPendingBloodEvent((isSuccess, response, error) => {
      if (isSuccess) setOrganizeEvents(response.data.data);
      else console.log(error.response);
    });
  }, [organizeEvents]);
  useEffect(() => {
    //COMPONENT DID MOUNT
    getPendingBloodEvent();
  }, []);
  // useEffect(() => {
  //   //COMPONENT DID MOUNT
  //   getPendingBloodEvent();
  // }, [organizeEvents]);
  const showToast =
    toastActive === 1 ? (
      <Frame>
        <Toast
          content="Request Event Accepted"
          onDismiss={() => setToastActive(0)}
        ></Toast>
      </Frame>
    ) : toastActive === 2 ? (
      <Frame>
        <Toast
          content="Request Event Rejected"
          onDismiss={() => setToastActive(0)}
        ></Toast>
      </Frame>
    ) : null;
  const onClickAcceptEvent = useCallback(
    (eventId) => {
      console.log("test", eventId);
      api.postAcceptBloodEvent(null, eventId, (isSuccess, response, error) => {
        //IF SUCCESS Delete the accepted event from the pending list
        if (isSuccess) {
          setOrganizeEvents([
            ...organizeEvents.filter((item) => item.event_id !== eventId),
          ]);
          setToastActive(1);
        } else console.log(error.response);
      });
    },
    [organizeEvents]
  );
  const onClickRejectEvent = useCallback(
    (eventId) => {
      api.postRejectBloodEvent(null, eventId, (isSuccess, response, error) => {
        //IF SUCCESS Delete the rejected event from the pending list
        if (isSuccess) {
          setOrganizeEvents(
            organizeEvents.filter((item) => item.event_id !== eventId)
          );
          setToastActive(2);
        } else console.log(error.response);
      });
    },
    [organizeEvents]
  );
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
          onClick: () => {
            Router.push("/red_cross/eventsHistory").then(() => {
              console.log(
                "Route successfully from 'red_cross/orderHistory' to 'red_cross/eventsHistorys'"
              );
            });
          },
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
          organizeEvents.length
            ? "Event requests process"
            : "No events available"
        }
      >
        <Layout>
          <Layout.Section>
            <Card title="Pending Events">
              <Scrollable>
                <ResourceList
                  resourceName={{
                    singular: "pending event",
                    plural: "pending events",
                  }}
                  items={organizeEvents}
                  renderItem={(item) => {
                    const { event_id, name, location, event_date } = item;
                    const media = <Avatar size="medium" name={name} />;
                    const shortcutActions = [
                      {
                        content: "Accept Event",
                        primary: true,
                        onClick: () => onClickAcceptEvent(event_id),
                      },
                      {
                        content: "Reject Event",
                        onClick: () => onClickRejectEvent(event_id),
                      },
                    ];

                    return (
                      <ResourceItem
                        id={event_id}
                        media={media}
                        shortcutActions={shortcutActions}
                      >
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
        <div style={{ height: "250px" }}>{showToast}</div>
      </Page>
    </PageLayout>
  );
}
export default connect((state) => ({
  userName: state.LoginReducer.userName,
  email: state.LoginReducer.email,
  userType: state.LoginReducer.userType,
  userId: state.LoginReducer.userId,
}))(pendingEvents);
