document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const hotels = document.querySelectorAll('.hotel-row'); // Get all hotel rows
  
    searchInput.addEventListener('input', () => {
      searchHotels();
    });
  
    function searchHotels() {
      const searchLocation = searchInput.value.toLowerCase();
  
      hotels.forEach((hotel) => {
        const location = hotel.dataset.location.toLowerCase();
        if (location.includes(searchLocation) || searchLocation === '') {
          hotel.style.display = 'flex';
        } else {
          hotel.style.display = 'none';
        }
      });
    }
  });
  
  
  