import axios from "axios";

const url = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  ME: "/auth/me",
  GET_USER: "/auth",
  UPDATE_PASSWORD: "/auth/change_password",
  GET_BLOOD_EVENTS: "/event/get_events",
  GET_BLOOD_EVENTS_DONORS: "/red_cross/get_approved_events",
  ADD_BLOOD_EVENT: "/event/create_event",
  GET_BLOOD_EVENT: "/event/search_event",
  DELETE_BLOOD_EVENTS: "/event/delete_events",
  UPDATE_BLOOD_EVENT: "/event/update_event",
  GET_REGISTERED_BLOOD_EVENT: "/blood/blood_form",
  POST_REGISTER_BLOOD_EVENT: "/blood/blood_form",
  UPDATE_PROFILE: "/auth/update",
  GET_PENDING_EVENT: "/red_cross/getpendingEvents",
  POST_ACCEPT_EVENT: "/red_cross/acceptedevent",
  POST_REJECT_EVENT: "/red_cross/rejectevent",
  POST_ACCEPT_ORDER: "/red_cross/acceptedorder",
  GET_PENDING_ORDER: "/red_cross/getpendingOrders",
  POST_REJECT_ORDER: "/red_cross/rejectorder",
  POST_ACCEPT_DONATION: "/red_cross/store",
  POST_REJECT_DONATION: "/red_cross/rejectdonation",
  GET_BLOOD_STORE: "/red_cross/getstore",
  POST_TESTED_DONATION: "/red_cross/testBlood",
  GET_BLOOD_DONATION: "/red_cross/getbloodDonation",
  GET_UNTESTED_BLOOD_DONATION: "/red_cross/getUntestedBloodDonation",
  GET_ACCEPTED_EVENTS: "/red_cross/getAcceptedEvents",
  GET_ACCEPTED_ORDERS: "/red_cross/getAcceptedOrders",
  GET_ACCEPTED_DONATIONS: "/red_cross/getStoredBloodDonations",
};

// merge url of base axios url and required ones
function buildUrl(url) {
  return process.env.host + url;
}

async function login(payload, callback) {
  axios({
    method: "POST",
    url: buildUrl(url.LOGIN),
    data: payload,
  })
    .then((response) => {
      callback(true, response, null);
    })
    .catch((error) => {
      callback(false, null, error);
    });
}

function register(payload, callback) {
  axios({
    method: "POST",
    url: buildUrl(url.REGISTER),
    data: payload,
  })
    .then((response) => {
      callback(true, response, null);
    })
    .catch((error) => {
      callback(false, null, error);
    });
}

function getUserInfo(callback) {
  axios({
    method: "GET",
    url: buildUrl(url.GET_USER),
  })
    .then((response) => {
      callback(true, response, null);
    })
    .catch((error) => {
      callback(false, null, error);
    });
}
function getBloodEventsDonors(callback) {
  axios({
    method: "GET",
    url: buildUrl(url.GET_BLOOD_EVENTS_DONORS),
  })
    .then((response) => {
      callback(true, response, null);
    })
    .catch((error) => {
      callback(false, null, error);
    });
}

function getBloodEvents(payload, callback) {
  axios({
    method: "GET",
    url:
      buildUrl(url.GET_BLOOD_EVENTS) +
      "?offset=" +
      payload.offset +
      "&limit=" +
      payload.limit,
  }).catch((error) => {
    callback(false, null, error);
  });
}
function createBloodEvent(payload, callback) {
  axios({
    method: "POST",
    url: buildUrl(url.ADD_BLOOD_EVENT),
    data: payload,
  })
    .then((response) => {
      callback(true, response, null);
    })
    .catch((error) => {
      callback(false, null, error);
    });
}

function getBloodEvent(payload, callback) {
  axios({
    method: "GET",
    url: buildUrl(url.GET_BLOOD_EVENT) + "/" + payload,
    data: payload,
  })
    .then((response) => {
      callback(true, response, null);
    })
    .catch((error) => {
      callback(false, null, error);
    });
}

function deleteBloodEvents(payload, callback) {
  axios({
    method: "DELETE",
    url: buildUrl(url.DELETE_BLOOD_EVENTS),
    data: payload,
  })
    .then((response) => {
      callback(true, response, null);
    })
    .catch((error) => {
      callback(false, null, error);
    });
}

function updateBloodEvent(payload, callback) {
  axios({
    method: "POST",
    url: buildUrl(url.UPDATE_BLOOD_EVENT) + "/" + payload.event_id,
    data: payload.editedEvent,
  })
    .then((response) => {
      callback(true, response, null);
    })
    .catch((error) => {
      callback(false, null, error);
    });
}
function getRegisteredBloodEvent(callback) {
  axios({
    method: "GET",
    url: buildUrl(url.GET_REGISTERED_BLOOD_EVENT),
  })
    .then((response) => {
      callback(true, response, null);
    })
    .catch((error) => {
      callback(false, null, error);
    });
}
function postRegisterBloodEvent(payload, callback) {
  axios({
    method: "POST",
    url: buildUrl(url.GET_REGISTERED_BLOOD_EVENT),
    data: payload,
  })
    .then((response) => {
      callback(true, response, null);
    })
    .catch((error) => {
      callback(false, null, error);
    });
}

function updateUserProfile(payload, callback) {
  axios({
    method: "POST",
    url: buildUrl(url.UPDATE_PROFILE),
    data: payload,
  })
    .then((response) => {
      callback(true, response, null);
    })
    .catch((error) => {
      callback(false, null, error);
    });
}

function updateUserPassword(payload, callback) {
  axios({
    method: "POST",
    url: buildUrl(url.UPDATE_PASSWORD),
    data: payload,
  })
    .then((response) => {
      callback(true, response, null);
    })
    .catch((error) => {
      callback(false, null, error);
    });
}

function getPendingBloodEvent(callback) {
  axios.interceptors.request.use(
    function (config) {
      config.headers.Authorization = "Bearer " + localStorage.getItem("token");
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
  axios({
    method: "GET",
    url: buildUrl(url.GET_PENDING_EVENT),
  })
    .then((response) => {
      callback(true, response, null);
    })
    .catch((error) => {
      callback(false, null, error);
    });
}
function getAcceptedBloodEvent(callback) {
  axios.interceptors.request.use(
    function (config) {
      config.headers.Authorization = "Bearer " + localStorage.getItem("token");
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
  axios({
    method: "GET",
    url: buildUrl(url.GET_ACCEPTED_EVENTS),
  })
    .then((response) => {
      callback(true, response, null);
    })
    .catch((error) => {
      callback(false, null, error);
    });
}
function getPendingOrders(callback) {
  axios.interceptors.request.use(
    function (config) {
      config.headers.Authorization = "Bearer " + localStorage.getItem("token");
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
  axios({
    method: "GET",
    url: buildUrl(url.GET_PENDING_ORDER),
  })
    .then((response) => {
      callback(true, response, null);
    })
    .catch((error) => {
      callback(false, null, error);
    });
}
function getAcceptedOrders(callback) {
  axios.interceptors.request.use(
    function (config) {
      config.headers.Authorization = "Bearer " + localStorage.getItem("token");
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
  axios({
    method: "GET",
    url: buildUrl(url.GET_ACCEPTED_ORDERS),
  })
    .then((response) => {
      callback(true, response, null);
    })
    .catch((error) => {
      callback(false, null, error);
    });
}
function postAcceptBloodEvent(payload, params, callback) {
  axios.interceptors.request.use(
    function (config) {
      config.headers.Authorization = "Bearer " + localStorage.getItem("token");
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
  axios({
    method: "PUT",
    url: buildUrl(url.POST_ACCEPT_EVENT + "/" + params),
    data: payload,
  })
    .then((response) => {
      callback(true, response, null);
    })
    .catch((error) => {
      callback(false, null, error);
    });
}
function postTestedDonation(payload, params, callback) {
  axios.interceptors.request.use(
    function (config) {
      config.headers.Authorization = "Bearer " + localStorage.getItem("token");
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
  axios({
    method: "POST",
    url: buildUrl(url.POST_TESTED_DONATION + "/" + params),
    data: payload,
  })
    .then((response) => {
      callback(true, response, null);
    })
    .catch((error) => {
      callback(false, null, error);
    });
}
function postAcceptOrder(payload, params, callback) {
  axios.interceptors.request.use(
    function (config) {
      config.headers.Authorization = "Bearer " + localStorage.getItem("token");
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
  axios({
    method: "PUT",
    url: buildUrl(url.POST_ACCEPT_ORDER + "/" + params),
    data: payload,
  })
    .then((response) => {
      callback(true, response, null);
    })
    .catch((error) => {
      callback(false, null, error);
    });
}

function postRejectBloodEvent(payload, params, callback) {
  axios.interceptors.request.use(
    function (config) {
      config.headers.Authorization = "Bearer " + localStorage.getItem("token");
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
  axios({
    method: "PUT",
    url: buildUrl(url.POST_REJECT_EVENT + "/" + params),
    data: payload,
  })
    .then((response) => {
      callback(true, response, null);
    })
    .catch((error) => {
      callback(false, null, error);
    });
}
function postRejectOrder(payload, params, callback) {
  axios.interceptors.request.use(
    function (config) {
      config.headers.Authorization = "Bearer " + localStorage.getItem("token");
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
  axios({
    method: "PUT",
    url: buildUrl(url.POST_REJECT_ORDER + "/" + params),
    data: payload,
  })
    .then((response) => {
      callback(true, response, null);
    })
    .catch((error) => {
      callback(false, null, error);
    });
}
function postRejectDonation(payload, params, callback) {
  axios.interceptors.request.use(
    function (config) {
      config.headers.Authorization = "Bearer " + localStorage.getItem("token");
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
  axios({
    method: "PUT",
    url: buildUrl(url.POST_REJECT_DONATION + "/" + params),
    data: payload,
  })
    .then((response) => {
      callback(true, response, null);
    })
    .catch((error) => {
      callback(false, null, error);
    });
}
function postAcceptedDonation(payload, params, callback) {
  axios.interceptors.request.use(
    function (config) {
      config.headers.Authorization = "Bearer " + localStorage.getItem("token");
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
  axios({
    method: "POST",
    url: buildUrl(url.POST_ACCEPT_DONATION + "/" + params),
    data: payload,
  })
    .then((response) => {
      callback(true, response, null);
    })
    .catch((error) => {
      callback(false, null, error);
    });
}
function getBloodStore(callback) {
  axios.interceptors.request.use(
    function (config) {
      config.headers.Authorization = "Bearer " + localStorage.getItem("token");
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
  axios({
    method: "GET",
    url: buildUrl(url.GET_BLOOD_STORE),
  })
    .then((response) => {
      callback(true, response, null);
    })
    .catch((error) => {
      callback(false, null, error);
    });
}
function getBloodDonation(callback) {
  axios.interceptors.request.use(
    function (config) {
      config.headers.Authorization = "Bearer " + localStorage.getItem("token");
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
  axios({
    method: "GET",
    url: buildUrl(url.GET_BLOOD_DONATION),
  })
    .then((response) => {
      callback(true, response, null);
    })
    .catch((error) => {
      callback(false, null, error);
    });
}
function getAcceptedBloodDonation(callback) {
  axios.interceptors.request.use(
    function (config) {
      config.headers.Authorization = "Bearer " + localStorage.getItem("token");
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
  axios({
    method: "GET",
    url: buildUrl(url.GET_ACCEPTED_DONATIONS),
  })
    .then((response) => {
      callback(true, response, null);
    })
    .catch((error) => {
      callback(false, null, error);
    });
}
function getUntestedBloodDonation(callback) {
  axios.interceptors.request.use(
    function (config) {
      config.headers.Authorization = "Bearer " + localStorage.getItem("token");
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
  axios({
    method: "GET",
    url: buildUrl(url.GET_UNTESTED_BLOOD_DONATION),
  })
    .then((response) => {
      callback(true, response, null);
    })
    .catch((error) => {
      callback(false, null, error);
    });
}
const api = {
  login,
  register,
  getUserInfo,
  getBloodEvent,
  getBloodEvents,
  createBloodEvent,
  deleteBloodEvents,
  updateBloodEvent,
  getRegisteredBloodEvent,
  postRegisterBloodEvent,
  updateUserProfile,
  updateUserPassword,
  getPendingBloodEvent,
  getPendingOrders,
  getBloodStore,
  getUntestedBloodDonation,
  getBloodDonation,
  postAcceptBloodEvent,
  postAcceptedDonation,
  postRejectBloodEvent,
  postRejectDonation,
  postAcceptOrder,
  postRejectOrder,
  postTestedDonation,
  getBloodEventsDonors,
  getAcceptedBloodDonation,
  getAcceptedBloodEvent,
  getAcceptedOrders,
};

export default api;
