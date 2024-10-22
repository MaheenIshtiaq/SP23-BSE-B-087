const profilePic = document.getElementById('profilePicContainer');
const introductionBox = document.getElementById('introduction');


profilePic.addEventListener('mouseenter', () => {
    introductionBox.style.display = 'block';
});

profilePic.addEventListener('mouseleave', () => {
    introductionBox.style.display = 'none';
});
