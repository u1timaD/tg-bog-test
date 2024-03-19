const getData = () => {
  fetch(JSON_URL, {
    method: "GET",
    headers: {
      "X-Master-Key": MASTER_KEY,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data.record);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
};

getData()

// fetch(JSON_URL, {
//   method: 'GET',
//   headers: {
//     'X-Master-Key': MASTER_KEY
//   }
// })
// .then(response => {
//   if (!response.ok) {
//     throw new Error('Network response was not ok');
//   }
//   return response.json();
// })
// .then(data => {
//   console.log(data);
// })
// .catch(error => {
//   console.error('There was a problem with the fetch operation:', error);
// });
