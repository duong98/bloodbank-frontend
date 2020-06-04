import React, { useEffect, useState, useCallback } from "react";
import Router from "next/router";
import { connect } from "react-redux";
import timeConverter from "../../src/utils/timeConverter";
import PageLayout from "../../src/components/PageLayout.js";
import {
  Card,
  Page,
  ResourceList,
  ResourceItem,
  TextStyle,
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
function orderHistory(props) {
  const [hospitalOrders, setHospitalOrders] = useState([]);

  const getAcceptedOrders = useCallback(() => {
    api.getAcceptedOrders((isSuccess, response, error) => {
      if (isSuccess) {
        for (let i = 0; i < response.data.data.length; i++) {
          response.data.data[i].id = response.data.data[i].blood_id;
        }
        setHospitalOrders(response.data.data);
      } else console.log(error.response);
    });
  }, [hospitalOrders]);
  useEffect(() => {
    //COMPONENT DID MOUNT
    getAcceptedOrders();
  }, []);
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
                "Route successfully from 'red_cross/pendingorders' to 'red_cross/pendingDonation'"
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
          onClick: () => {},
        },
        {
          label: " Donation History",
          icon: HeartMajorMonotone,
          onClick: () => {
            Router.push("/red_cross/donationHistory").then(() => {
              console.log(
                "Route successfully from 'red_cross/orderHIstory' to 'red_cross/donationHistorys'"
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
                "Route successfully from 'red_cross/pendingorders' to 'red_cross/bloodstore'"
              );
            });
          },
        },
      ]}
    >
      <Page
        title="Orders Management"
        subtitle={
          hospitalOrders.length ? "order history" : "No orders available"
        }
      >
        <Layout>
          <Layout.Section>
            <Card title="Accepted Orders">
              <Scrollable shadow style={{ height: "500px" }}>
                <ResourceList
                  resourceName={{ singular: "order", plural: "orders" }}
                  items={hospitalOrders}
                  renderItem={renderItem}
                />
              </Scrollable>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </PageLayout>
  );
  function renderItem(item) {
    const { order_id, blood_type, amount, name, order_date } = item;
    return (
      <ResourceItem id={order_id}>
        <h3>
          <TextStyle variation="strong">{name}</TextStyle>
        </h3>
        <div>{blood_type}</div>
        <div>{amount}</div>
        <div>{timeConverter(order_date)}</div>
      </ResourceItem>
    );
  }
}
export default connect((state) => ({
  userName: state.LoginReducer.userName,
  email: state.LoginReducer.email,
  userType: state.LoginReducer.userType,
  userId: state.LoginReducer.userId,
}))(orderHistory);
