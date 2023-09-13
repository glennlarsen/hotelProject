async function deleteHotel(url, hotelId) {
    console.log(url, hotelId)
    await fetch(url, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            id: hotelId
        })
    }).then((response) => {
        if(response.ok) {
            const resData = 'hotel deleted...';
            location.reload()
            return Promise.resolve(resData);
        }
        return Promise.reject(response);
    })
    .catch((response) => {
        alert(response.statusText);
    });
}