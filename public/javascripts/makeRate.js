async function makeRate(userId, url) {
  let value = prompt("Rate the hotel from 1 to 5");

  if (value === null) {
    // User canceled the prompt, exit the function
    return;
  }

  value = parseInt(value);

  if (isNaN(value) || value < 1 || value > 5) {
    alert("Please enter a value between 1 and 5.");
    return;
  }

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      UserId: userId,
      Value: value,
    }),
  })
    .then((response) => {
      if (response.ok) {
        const resData = "Made a rate";
        alert(resData);
        location.reload();
        return Promise.resolve(resData);
      }
      return Promise.reject(response);
    })
    .catch((response) => {
      console.log(response);
      alert(response.statusText);
    });
}
