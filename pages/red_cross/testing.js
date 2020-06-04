import React, { useEffect, useState, useCallback } from "react";
import Router from "next/router";
import { connect } from "react-redux";
import PageLayout from "../../src/components/PageLayout.js";
import {
  Card,
  Page,
  Frame,
  Toast,
  ResourceItem,
  ResourceList,
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
function testingDonation(props) {
  const [Donations, setDonations] = useState([]);
  const [toastActive, setToastActive] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [fetchStatus, setFetchStatus] = useState(true);

  const getBloodDonation = useCallback(() => {
    api.getUntestedBloodDonation((isSuccess, response, error) => {
      if (isSuccess) {
        for (let i = 0; i < response.data.data.length; i++) {
          response.data.data[i].id = response.data.data[i].blood_id;
        }
        setDonations(response.data.data);
      } else console.log(error.response);
    });
  }, [Donations]);
  useEffect(() => {
    //COMPONENT DID MOUNT
    getBloodDonation();
  }, []);
  // useEffect(() => {
  //   //COMPONENT DID MOUNT
  //   if (Donations) getBloodDonation();
  // }, [Donations]);
  const showToast =
    toastActive === 1 ? (
      <Frame>
        <Toast
          content="Donation tested"
          onDismiss={() => setToastActive(0)}
        ></Toast>
      </Frame>
    ) : toastActive === 2 ? (
      <Frame>
        <Toast
          content="Donation Rejected"
          onDismiss={() => setToastActive(0)}
        ></Toast>
      </Frame>
    ) : null;
  const onClickAcceptDonation = useCallback(
    (donationId) => {
      api.postTestedDonation(null, donationId, (isSuccess, response, error) => {
        //IF SUCCESS Delete the accepted Donation from the pending list
        if (isSuccess) {
        } else {
          setFetchStatus(false);
          console.log(error.response);
        }
      });
    },
    [Donations]
  );
  const onClickRejectDonation = useCallback(
    (donationId) => {
      api.postRejectDonation(null, donationId, (isSuccess, response, error) => {
        //IF SUCCESS Delete the rejected Donation from the pending list
        if (isSuccess) {
        } else {
          setFetchStatus(false);
          console.log(error.response);
        }
      });
    },
    [Donations]
  );
  const promotedBulkActions = [
    {
      content: "Tested Donations",
      onAction: () => {
        selectedItems.forEach((item, index) => {
          onClickAcceptDonation(item);
          if (index === selectedItems.length - 1) {
            setDonations([
              ...Donations.filter(
                (donation) => !selectedItems.includes(donation.id)
              ),
            ]);
            setToastActive(1);
          }
        });
      },
    },
  ];

  const bulkActions = [
    {
      content: "Reject Donations",
      onAction: () => {
        selectedItems.forEach((item, index) => {
          onClickRejectDonation(item);
          if (index === selectedItems.length - 1) {
            setDonations([
              ...Donations.filter(
                (donation) => !selectedItems.includes(donation.id)
              ),
            ]);
            setToastActive(2);
          }
        });
      },
    },
  ];
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
          onClick: () => {},
        },
        {
          label: " Pending Donation ",
          icon: HeartMajorMonotone,
          onClick: () => {
            Router.push("/red_cross/pendingDonation").then(() => {
              console.log(
                "Route successfully from 'red_cross/pendingDonations' to 'red_cross/bloodstore'"
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
                "Route successfully from 'red_cross/pendingDonations' to 'red_cross/bloodstore'"
              );
            });
          },
        },
      ]}
    >
      <Page
        title="Testing Management"
        subtitle={
          Donations.length
            ? "Donation requests testing"
            : "No Donations available"
        }
      >
        <Layout>
          <Layout.Section>
            <Card title="Testing Donations">
              <Scrollable shadow style={{ height: "500px" }}>
                <ResourceList
                  resourceName={{ singular: "donation", plural: "donations" }}
                  items={Donations}
                  renderItem={renderItem}
                  selectedItems={selectedItems}
                  onSelectionChange={(item) => {
                    setSelectedItems(item);
                    console.log(selectedItems);
                  }}
                  promotedBulkActions={promotedBulkActions}
                  bulkActions={bulkActions}
                />
              </Scrollable>
            </Card>
          </Layout.Section>
        </Layout>
        {showToast}
      </Page>
    </PageLayout>
  );
  function renderItem(item) {
    const { blood_id, amount } = item;
    return (
      <ResourceItem id={blood_id}>
        <h3>
          <TextStyle variation="strong">{blood_id}</TextStyle>
        </h3>
        <div>{amount}</div>
      </ResourceItem>
    );
  }
}
export default connect((state) => ({
  userName: state.LoginReducer.userName,
  email: state.LoginReducer.email,
  userType: state.LoginReducer.userType,
  userId: state.LoginReducer.userId,
}))(testingDonation);
