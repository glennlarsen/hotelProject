async function addRoom(url, currentHotelId) {
  let hotelId;

  if (!currentHotelId) {
    hotelId = prompt("Provide hotel id");
    if (hotelId === null) {
      // User canceled the prompt, return to exit the function
      return;
    }
    hotelId = parseInt(hotelId); // Convert to integer if it's not null
  } else {
    hotelId = parseInt(currentHotelId); // Convert to integer if it's not null
  }

  let capacity = prompt("Provide the room capacity");
  if (capacity === null) {
    // User canceled the prompt, return to exit the function
    return;
  }
  capacity = parseInt(capacity);

  let price = prompt("Provide the room price");
  if (price === null) {
    // User canceled the prompt, return to exit the function
    return;
  }
  price = parseFloat(price);

  await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      HotelId: hotelId,
      Capacity: capacity,
      PricePerDay: price,
    }),
  })
    .then((response) => {
      if (response.ok) {
        const resData = "Created a new room";
        location.reload();
        return Promise.resolve(resData);
      }
      return Promise.reject(response);
    })
    .catch((response) => {
      alert(response.statusText);
    });
}
