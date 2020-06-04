import React, { Component, useEffect, useState } from "react";
import { Provider } from "react-redux";
import store from "../src/redux/store";
import "./global.css";
import "react-datepicker/dist/react-datepicker.css";
import Head from "next/head";
import api from "../config/api";
import Router from "next/router";
import axios from "axios";
import LoginAction from "../src/redux/actions/LoginAction";
import StringUtil from '../src/utils/StringUtils'

import Constants from "../src/utils/Constants";


export default function App({ Component, pageProps }) {

    useEffect(() => {
        //RUN WHEN APP MOUNTED, WHICH IS THE MOMENT USER TYPE ANY URL RELATED TO THIS APP AND PRESS ENTER
        //GET TOKEN FROM LOCAL STORAGE
        let token = "Bearer " + localStorage.getItem("token");

        //AXIOS CONFIGURATION
        axios.defaults.timeout = 30000;
        axios.defaults.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
        };
        axios.defaults.withCredentials = true;

        // this is used to intercept each time a request is sent to the server
        axios.interceptors.request.use(
            async (config) => {
                console.log("url>>>>: " + config.url);
                console.log(
                    "interceptor request begin in Data Async... >>>>>>>>>>>>>>>> = ",
                    "Bearer " + localStorage.getItem("token")
                );
                if (StringUtil.isEmpty(token)) {
                    // do nothing
                    // do
                } else {
                    config.headers.Authorization =
                        "Bearer " + localStorage.getItem("token"); // chan ly.
                }

                return config;
            },
            (error) => {
                Promise.reject(error);
            }
        );

        axios.interceptors.response.use(
            response => {
                return response;
            },

            async error => {
                return Promise.reject(error);
            }
        );

        //GET USER INFO FROM SERVER TO CHECK IF AUTH TOKEN IS VALID
        api.getUserInfo((isSuccess, response, error) => {
            console.log("app.js | getUserInfo | isSuccess: " + isSuccess);
            if (isSuccess) {
                //GOOD TOKEN
                console.log("GetUserData success", response);
                let payload = {
                    name: response.data.data.name,
                    email: response.data.data.email,
                    userId: response.data.data.userId,
                    userType: response.data.data.role
                };


                //HANDLE DATA FOR DONOR
                if (response.data.data.address) payload.address = response.data.data.address;
                if (response.data.data.dob) payload.dob = response.data.data.dob;
                if (response.data.data.blood_type) payload.blood_type = response.data.data.blood_type;

                //SET DATA
                store.dispatch(LoginAction.logIn(payload));
            } else {
                Router.push("/").then(() => {
                    //BAD TOKEN, ROUTE BACK TO SIGN IN PAGE
                    console.log("Route successfully from 'any' to '/' due to authentication failed");
                });
            }
        })
    }, []);

    return (
        <Provider store={store}>
            <Head>
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/@shopify/polaris@4.21.0/styles.min.css"
                />
                <link
                    rel="icon"
                    href=
                    "https://previews.123rf.com/images/3t0n4k/3t0n4k1605/3t0n4k160500033/57480630-blood-donation-logo-on-a-white-background.jpg"
                />
            </Head>
            <Component {...pageProps} />
            <style global jsx>{`
                body {
                    margin: 0px;
                }
            `}</style>
        </Provider>
    );
}
