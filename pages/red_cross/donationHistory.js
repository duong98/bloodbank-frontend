import React, { useEffect, useState, useCallback } from "react";
import Router from "next/router";
import { connect } from "react-redux";
import PageLayout from "../../src/components/PageLayout.js";
import {
  Card,
  Page,
  ResourceItem,
  ResourceList,
  TextStyle,
  Scrollable,
  Layout,
  DescriptionList,
} from "@shopify/polaris";
import {
  OrdersMajorMonotone,
  HeartMajorMonotone,
  ActivitiesMajorMonotone,
  StoreMajorMonotone,
} from "@shopify/polaris-icons";
import api from "../../config/api";
function donationHistory(props) {
  const [Donations, setDonations] = useState([]);

  const getAcceptedBloodDonation = useCallback(() => {
    api.getAcceptedBloodDonation((isSuccess, response, error) => {
      if (isSuccess) {
        console.log("data", response.data.data);
        for (let i = 0; i < response.data.data.length; i++) {
          response.data.data[i].id = response.data.data[i].blood_id;
        }
        setDonations(response.data.data);
      } else console.log(error.response);
    });
  }, [Donations]);
  useEffect(() => {
    //COMPONENT DID MOUNT
    getAcceptedBloodDonation();
  }, []);
  // useEffect(() => {
  //   //COMPONENT DID MOUNT
  //   if (Donations) getBloodDonation();
  // }, [Donations]);
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
                "Route successfully from 'red_cross/pendingDonation' to 'red_cross/pendingEvents'"
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
                "Route successfully from 'red_cross/pendingDonation' to 'red_cross/pendingOrders'"
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
          onClick: () => {},
        },
        {
          label: "Events History",
          icon: ActivitiesMajorMonotone,
          onClick: () => {
            Router.push("/red_cross/eventsHistory").then(() => {
              console.log(
                "Route successfully from 'red_cross/donationHistory' to 'red_cross/eventsHistorys'"
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
                "Route successfully from 'red_cross/donationHIstory' to 'red_cross/orderHistorys'"
              );
            });
          },
        },
        {
          label: " Donation History",
          icon: HeartMajorMonotone,
          onClick: () => {},
        },
        {
          label: " Blood Store ",
          icon: StoreMajorMonotone,
          onClick: () => {
            Router.push("/red_cross/bloodstore").then(() => {
              console.log(
                "Route successfully from 'red_cross/pendingDonations' to 'red_cross/bloodstore'"
              );
            });
          },
        },
      ]}
    >
      <Page
        title="Donation Management"
        subtitle={
          Donations.length ? "Donation History" : "No Donations available"
        }
      >
        <Layout>
          <Layout.Section>
            <Card title="Donations">
              <Scrollable shadow style={{ height: "500px" }}>
                <ResourceList
                  resourceName={{ singular: "donation", plural: "donations" }}
                  items={Donations}
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
    const { blood_id, blood_type, amount, donor_name, name } = item;
    return (
      <ResourceItem id={blood_id}>
        <br />
        <h3>
          <TextStyle variation="strong">id: {blood_id}</TextStyle>
        </h3>
        <DescriptionList
          items={[
            {
              term: "Event",
              description: name,
            },
            {
              term: "Donor",
              description: donor_name,
            },
            {
              term: "Blood Type",
              description: blood_type,
            },
            {
              term: "Amount",
              description: amount,
            },
          ]}
        />
      </ResourceItem>
    );
  }
}
export default connect((state) => ({
  userName: state.LoginReducer.userName,
  email: state.LoginReducer.email,
  userType: state.LoginReducer.userType,
  userId: state.LoginReducer.userId,
}))(donationHistory);
