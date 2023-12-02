/*const API_BASE_URL = 'https://api.noroff.dev/api/v1/holidaze';

async function Register(url, data) {
  try {
    const postData = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, postData);
    console.log(response);
    const json = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    console.log(error);
  }
}

const user = {
    "name": "ingu", // Required
    "email": "IngBer61224@stud.noroff.no", // Required
    "password": "Lifu4ct4Leya-", // Required
    "avatar": "https://img.service.com/avatar.jpg", // Optional (default: null)
    "venueManager": false // Optional (default: false)
};

Register(`${API_BASE_URL}/auth/register`, user);*/