// Function to open the modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
  }
  
  // Function to close the modal
  function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
  }
  
  // Close the modal when clicking outside of the content
  window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
  