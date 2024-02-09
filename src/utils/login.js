import ig from "../libs/instagram.js";

const login = async (username, password) => {
  ig.state.generateDevice(username);

  return await ig.account.login(username, password);
};

export default login;
