// button.js
document.addEventListener('DOMContentLoaded', () => {
    const editProfileBtn = document.getElementById('edit-profile-btn"'); // Henter knappen
    const editProfileForm = document.getElementById('edit-profile-form'); // Henter "Edit Profile"-skjemaet

    if (editProfileBtn) {

      editProfileBtn.addEventListener('click', () => {

        editProfileForm.classList.toggle('hidden');
      });
    }
 
  });