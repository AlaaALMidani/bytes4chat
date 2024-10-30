import Axios from "axios";

const baseUrl = "https://a3a7-212-8-253-146.ngrok-free.app/";
const CONTACTS = "contacts";
const ADDCONTACTS = "add";

class Fetch {
  static async getUserContacts(data) {
   return  Axios.get(`${baseUrl}${CONTACTS}`, {
      headers: {
        "ngrok-skip-browser-warning": "any",
        'Authorization':'Bearer '
      },
    })
      .then((response) => response.data)
      .then((data) => data)
      .catch((error) => {
        console.log(error);
      });
  }
}
export default Fetch;
