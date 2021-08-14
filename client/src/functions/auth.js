import axios from "axios";

export const createOrUpdateUser = async (details, authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/create-or-update-user`,
    { details },
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const checkUser = async (phoneNumber) => {
  return await axios.post(`${process.env.REACT_APP_API}/check-user`, {
    phoneNumber,
  });
};

export const validateUser = async (authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/validate-user`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const currentUser = async (authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/current-user`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};