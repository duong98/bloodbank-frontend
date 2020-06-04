import StringUtil from "../utils/StringUtils";

const AuthenticationRouteUtils = {
  stringRouteByRole: (role) => {
    console.log(role);
    switch (role) {
      case "donor":
        return "/donor/event";
      case "organizer":
        return "/organizer/manage_event";
      case "red_cross":
        return "/red_cross/pendingEvents";
      default:
        return "/";
    }
  },
};

export default AuthenticationRouteUtils;
