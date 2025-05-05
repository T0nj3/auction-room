
document.addEventListener('DOMContentLoaded', () => {
  const editProfileBtn = document.getElementById('edit-profile-btn');
    const editProfileForm = document.getElementById('edit-profile-form'); 

    if (editProfileBtn) {

      editProfileBtn.addEventListener('click', () => {

        editProfileForm.classList.toggle('hidden');
      });
    }
 
  });

  document .addEventListener('DOMContentLoaded', () => {
    const createPost = document.getElementById('toggle-create-btn');
    const creatForm = document.getElementById('create-auction-form');
    
    if (createPost) {

      createPost.addEventListener('click', () => {

        creatForm.classList.toggle('hidden');
      });
    }
  });