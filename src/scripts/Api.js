class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "c380b956-47d8-4c9f-8efb-b1f2fe28fd71",
      },
    }).then((res) => res.json());
  }

  // other methods for working with the API
}

export default Api;
