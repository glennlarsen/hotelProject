async function addHotel(url) {
 let name = prompt("Provide the new hotel's name");
 if(!name) {
    return;
 }
 let hotelLocation = prompt("Provide the new hotel's location");
 if(!hotelLocation) {
    return;
 }

    await fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            Name: name,
            Location: hotelLocation,
        })
    }).then((response) => {
        if(response.ok) {
            const resData = 'Created a new hotel';
            location.reload()
            return Promise.resolve(resData);
        }
        return Promise.reject(response);
    })
    .catch((response) => {
        alert(response.statusText);
    });
}