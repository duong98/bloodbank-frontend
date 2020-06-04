import React, { useEffect, useState, useCallback } from "react";
import Router from "next/router";
import { connect } from "react-redux";
import timeConverter from "../../src/utils/timeConverter";
import PageLayout from "../../src/components/PageLayout.js";
import {
  Card,
  Page,
  Frame,
  Toast,
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
function pendingOrders(props) {
  const [hospitalOrders, setHospitalOrders] = useState([]);
  const [toastActive, setToastActive] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [error, setError] = useState("");
  const getPendingOrders = useCallback(() => {
    api.getPendingOrders((isSuccess, response, error) => {
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
    getPendingOrders();
  }, []);
  const showToast =
    toastActive === 1 ? (
      <Frame>
        <Toast
          content="Order Accepted"
          onDismiss={() => setToastActive(0)}
        ></Toast>
      </Frame>
    ) : toastActive === 2 ? (
      <Frame>
        <Toast
          content="Order Rejected"
          onDismiss={() => setToastActive(0)}
        ></Toast>
      </Frame>
    ) : toastActive === 3 ? (
      <Frame>
        <Toast content={error} onDismiss={() => setToastActive(0)}></Toast>
      </Frame>
    ) : null;
  const onClickAcceptOrder = useCallback(
    (orderId) => {
      api.postAcceptOrder(null, orderId, (isSuccess, response, error) => {
        //IF SUCCESS Delete the accepted order from the pending list
        if (isSuccess) {
          setHospitalOrders([
            ...hospitalOrders.filter((item) => item.order_id !== orderId),
          ]);
        } else {
          setError(error.response.data.err);
          setToastActive(3);
        }
      });
    },
    [hospitalOrders]
  );
  const onClickRejectOrder = useCallback(
    (orderId) => {
      api.postRejectOrder(null, orderId, (isSuccess, response, error) => {
        //IF SUCCESS Delete the rejected order from the pending list
        if (isSuccess) {
          setHospitalOrders([
            ...hospitalOrders.filter((item) => item.order_id !== orderId),
          ]);
        } else console.log(error.response);
      });
    },
    [hospitalOrders]
  );
  const promotedBulkActions = [
    {
      content: "Accept Orders",
      onAction: () => {
        selectedItems.forEach((item, index) => {
          onClickAcceptOrder(item);
          if (index === selectedItems.length) setToastActive(1);
        });
      },
    },
  ];

  const bulkActions = [
    {
      content: "Reject Orders",
      onAction: () => {
        selectedItems.forEach((item) => onClickRejectOrder(item));
        setToastActive(2);
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
                "Route successfully from 'red_cross/pendingorders' to 'red_cross/pendingEvents'"
              );
            });
          },
        },
        {
          label: " Pending Orders Requests ",
          icon: OrdersMajorMonotone,
          onClick: () => {},
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
          hospitalOrders.length
            ? "order requests process"
            : "No orders available"
        }
      >
        <Layout>
          <Layout.Section>
            <Card title="Pending Orders">
              <Scrollable shadow style={{ height: "500px" }}>
                <ResourceList
                  resourceName={{ singular: "order", plural: "orders" }}
                  items={hospitalOrders}
                  renderItem={renderItem}
                  selectedItems={selectedItems}
                  onSelectionChange={(item) => setSelectedItems(item)}
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
}))(pendingOrders);
