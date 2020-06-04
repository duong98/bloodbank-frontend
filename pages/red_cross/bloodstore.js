import React, { useEffect, useState, useCallback } from "react";
import Router from "next/router";
import { connect } from "react-redux";
import PageLayout from "../../src/components/PageLayout.js";
import { Card, DataTable, Page } from "@shopify/polaris";
import {
  OrdersMajorMonotone,
  HeartMajorMonotone,
  ActivitiesMajorMonotone,
  StoreMajorMonotone,
} from "@shopify/polaris-icons";
import api from "../../config/api";
function bloodstore(props) {
  const [bloods, setBloods] = useState([]);
  const getBloodStore = useCallback(() => {
    api.getBloodStore((isSuccess, response, error) => {
      const data = response.data.data.map((item) => Object.values(item));
      console.log("res", data);
      if (isSuccess) setBloods(data);
      else console.log(error.response);
    });
  }, [bloods]);
  useEffect(() => {
    //COMPONENT DID MOUNT
    getBloodStore();
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
                "Route successfully from 'red_cross/bloodstore' to 'red_cross/pendingEvents'"
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
                "Route successfully from 'red_cross/bloodstore' to 'red_cross/pendingOrders'"
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
                "Route successfully from 'red_cross/bloodstore' to 'red_cross/pendingDonation'"
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
          onClick: () => {},
        },
      ]}
    >
      <Page
        title="Blood Management"
        subtitle={bloods.length ? "Blood Store" : "No Blood available"}
      >
        <Card>
          <DataTable
            columnContentTypes={["text", "numeric"]}
            headings={["Blood Type", "Amount"]}
            rows={bloods}
          />
        </Card>
      </Page>
    </PageLayout>
  );
}
export default connect((state) => ({
  userName: state.LoginReducer.userName,
  email: state.LoginReducer.email,
  userType: state.LoginReducer.userType,
  userId: state.LoginReducer.userId,
}))(bloodstore);
