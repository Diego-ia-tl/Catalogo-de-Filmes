const backendUrl = '/movies';
console.log('URL do backend utilizada:', backendUrl);

function displayMovies(filteredMovies) {
  const movieList = document.getElementById('movie-list')
  movieList.innerHTML = ''

  filteredMovies.forEach(movie => {
    const movieDiv = document.createElement('div')
    movieDiv.classList.add('movie')

    movieDiv.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}">
            <h2>${movie.title}</h2>
            <p class="movie-desc">${movie.description}</p>
            <button class="trailer-button" onclick="window.open('${movie.link}', '_blank')">Ver Trailer</button>`
    movieList.appendChild(movieDiv)
  })
}

function fetchAndDisplayMovies() {
  fetch(backendUrl)
    .then(response => {
      if (!response.ok) throw new Error('Erro na resposta do backend');
      return response.json();
    })
    .then(movies => {
      displayMovies(movies)
    })
    .catch(error => {
      alert('Erro ao buscar filmes: ' + error.message);
      console.error(error);
    });
}

fetchAndDisplayMovies();

function searchMovies() {
  const query = document.getElementById('searchInput').value.toLowerCase()
  fetch(backendUrl)
    .then(response => {
      if (!response.ok) throw new Error('Erro na resposta do backend');
      return response.json();
    })
    .then(movies => {
      const filteredMovies = movies.filter(
        movie =>
          movie.title.toLowerCase().includes(query) ||
          movie.description.toLowerCase().includes(query)
      )
      displayMovies(filteredMovies)
    })
    .catch(error => {
      alert('Erro ao buscar filmes: ' + error.message);
      console.error(error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
  
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  menuToggle.onclick = () => {
    sidebar.classList.toggle('active');
  };
  window.addEventListener('click', function(event) {
    if (sidebar.classList.contains('active') && !sidebar.contains(event.target) && event.target !== menuToggle) {
      sidebar.classList.remove('active');
    }
  });

  
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.onclick = () => {
    document.body.classList.toggle('dark-mode');
  };

  
  const loginModal = document.getElementById('loginModal');
  const openLogin = document.getElementById('openLogin');
  const closeLogin = document.getElementById('closeLogin');
  const loginBtn = document.getElementById('loginBtn');
  const loginError = document.getElementById('loginError');
  openLogin.onclick = () => loginModal.style.display = 'flex';
  closeLogin.onclick = () => loginModal.style.display = 'none';
  window.onclick = (e) => { if (e.target === loginModal) loginModal.style.display = 'none'; };
  
  
  function showProfilePic(photo) {
    const profilePic = document.getElementById('profilePic');
    if (photo) {
      profilePic.src = photo;
      profilePic.style.display = 'block';
    } else {
      profilePic.style.display = 'none';
    }
  }

 
  loginBtn.onclick = () => {
    const user = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPass').value;
    if (user === 'admin' && pass === '1234') {
      loginModal.style.display = 'none';
      loginError.style.display = 'none';
      showProfilePic('');
      alert('Login realizado com sucesso!');
      return;
    }
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const found = users.find(u => u.user === user && u.pass === pass);
    if (found) {
      loginModal.style.display = 'none';
      loginError.style.display = 'none';
      showProfilePic(found.photo);
      alert('Login realizado com sucesso!');
    } else {
      loginError.style.display = 'block';
    }
  };

  
  const lastUser = localStorage.getItem('lastUser');
  if (lastUser) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const found = users.find(u => u.user === lastUser);
    if (found) showProfilePic(found.photo);
  }

  
  function saveLastUser(user) {
    localStorage.setItem('lastUser', user);
  }
  
  loginBtn.onclick = (() => {
    const original = loginBtn.onclick;
    return function() {
      const user = document.getElementById('loginUser').value;
      const pass = document.getElementById('loginPass').value;
      if (user === 'admin' && pass === '1234') {
        saveLastUser('admin');
      } else {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const found = users.find(u => u.user === user && u.pass === pass);
        if (found) saveLastUser(user);
      }
      if (original) original.apply(this, arguments);
    }
  })();

  
  const registerModal = document.getElementById('registerModal');
  const openRegister = document.getElementById('openRegister');
  const closeRegister = document.getElementById('closeRegister');
  const registerBtn = document.getElementById('registerBtn');
  const registerMsg = document.getElementById('registerMsg');
  const registerPhoto = document.getElementById('registerPhoto');
  const photoPreview = document.getElementById('photoPreview');
  const profileGallery = document.getElementById('profileGallery');
  let selectedProfilePic = '';
  openRegister.onclick = () => registerModal.style.display = 'flex';
  closeRegister.onclick = () => registerModal.style.display = 'none';
  window.onclick = (e) => { if (e.target === registerModal) registerModal.style.display = 'none'; };
  if (profileGallery) {
    profileGallery.querySelectorAll('.profile-pic-option').forEach(img => {
      img.onclick = function() {
        profileGallery.querySelectorAll('.profile-pic-option').forEach(i => i.style.border = '2px solid transparent');
        img.style.border = '2px solid #ff0000';
        selectedProfilePic = img.src;
        photoPreview.src = img.src;
        photoPreview.style.display = 'block';
        registerPhoto.value = '';
      };
    });
  }
  registerPhoto.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        photoPreview.src = evt.target.result;
        photoPreview.style.display = 'block';
        selectedProfilePic = evt.target.result;
        if (profileGallery) profileGallery.querySelectorAll('.profile-pic-option').forEach(i => i.style.border = '2px solid transparent');
      };
      reader.readAsDataURL(file);
    } else {
      photoPreview.style.display = 'none';
      selectedProfilePic = '';
    }
  };
  registerBtn.onclick = () => {
    const user = document.getElementById('registerUser').value;
    const pass = document.getElementById('registerPass').value;
    const photo = selectedProfilePic || photoPreview.src || '';
    if (!user || !pass) {
      registerMsg.style.display = 'block';
      registerMsg.style.color = 'red';
      registerMsg.textContent = 'Preencha todos os campos!';
      setTimeout(() => { registerMsg.style.display = 'none'; }, 1500);
      return;
    }
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.user === user)) {
      registerMsg.style.display = 'block';
      registerMsg.style.color = 'red';
      registerMsg.textContent = 'Usuário já existe!';
      setTimeout(() => { registerMsg.style.display = 'none'; }, 1500);
      return;
    }
    users.push({ user, pass, photo });
    localStorage.setItem('users', JSON.stringify(users));
    registerMsg.style.display = 'block';
    registerMsg.style.color = 'green';
    registerMsg.textContent = 'Cadastro realizado!';
    setTimeout(() => {
      registerMsg.style.display = 'none';
      registerModal.style.display = 'none';
      document.getElementById('registerUser').value = '';
      document.getElementById('registerPass').value = '';
      registerPhoto.value = '';
      photoPreview.style.display = 'none';
    }, 1500);
  };
});