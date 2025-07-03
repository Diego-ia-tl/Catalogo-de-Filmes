const backendUrl = 'https://shiny-potato-q7454gqx9xjw2x54j-3000.app.github.dev/movies';
console.log('URL do backend utilizada:', backendUrl);

let currentUser = null;

function getUserFromStorage() {
  return JSON.parse(localStorage.getItem('currentUser'));
}

function setUserToStorage(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

function displayMovies(filteredMovies, showFav = true) {
  const movieList = document.getElementById('movie-list');
  movieList.innerHTML = '';

  filteredMovies.forEach(movie => {
    const movieDiv = document.createElement('div');
    movieDiv.classList.add('movie');

    let favBtn = '';
    if (showFav && currentUser) {
      
      const isFav = (currentUser.favorites || []).map(String).includes(String(movie.id));
      favBtn = `<button class="fav-button" data-id="${movie.id}" style="color:${isFav ? 'gold' : '#888'}">&#9733;</button>`;
    }

    movieDiv.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}">
            <h2>${movie.title}</h2>
            <p class="movie-desc">${movie.description}</p>
            ${favBtn}`;
    movieList.appendChild(movieDiv);
  });

  
  if (showFav && currentUser) {
    document.querySelectorAll('.fav-button').forEach(btn => {
      btn.onclick = function() {
        const movieId = String(this.getAttribute('data-id'));
        toggleFavorite(movieId);
      };
    });
  }
}

function toggleFavorite(movieId) {
  if (!currentUser) return;
  
  const isFav = (currentUser.favorites || []).map(String).includes(String(movieId));
  let newFavs;
  if (isFav) {
    newFavs = currentUser.favorites.filter(id => String(id) !== String(movieId));
  } else {
    newFavs = [...(currentUser.favorites || []), movieId];
  }
  fetch(`https://shiny-potato-q7454gqx9xjw2x54j-3000.app.github.dev/users/${currentUser.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ favorites: newFavs })
  })
  .then(res => res.json())
  .then(() => {
    
    fetch(`https://shiny-potato-q7454gqx9xjw2x54j-3000.app.github.dev/users/${currentUser.id}`)
      .then(r => r.json())
      .then(user => {
        currentUser = user;
        setUserToStorage(user);
        fetchAndDisplayMovies();
      });
  });
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

function showProfileModal() {
  if (!currentUser) return;
  const modal = document.getElementById('profileModal');
  
  const avatarImg = document.getElementById('profileAvatarImg');
  const avatarInitial = document.getElementById('profileAvatarInitial');
  if (currentUser.photo) {
    avatarImg.src = currentUser.photo;
    avatarImg.style.display = 'block';
    avatarInitial.style.display = 'none';
  } else {
    avatarImg.style.display = 'none';
    avatarInitial.textContent = (currentUser.user || '?').charAt(0).toUpperCase();
    avatarInitial.style.display = 'block';
  }
  
  document.getElementById('profileUserName').textContent = currentUser.user || '';
  document.getElementById('profileUserId').textContent = 'ID: ' + (currentUser.id || '');
  modal.style.display = 'flex';
}
 
function showFavorites() {
  if (!currentUser) return;
  const favSection = document.getElementById('favorites-section');
  const favList = document.getElementById('favorites-list');
  favList.innerHTML = '';
  if (!currentUser.favorites || currentUser.favorites.length === 0) {
    favList.innerHTML = '<p style="color:#bbb;">Nenhum filme favoritado.</p>';
  } else {
    fetch(backendUrl)
      .then(response => response.json())
      .then(movies => {
        const favMovies = movies.filter(m => (currentUser.favorites || []).map(String).includes(String(m.id)));
        favMovies.forEach(movie => {
          const div = document.createElement('div');
          div.classList.add('movie');
          div.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}" style="width:60px;border-radius:6px;margin-bottom:6px;">
            <span style="display:block;font-weight:bold;margin-bottom:4px;">${movie.title}</span>
            <button onclick="window.open('${movie.link}', '_blank')">Ver Trailer</button>
          `;
          favList.appendChild(div);
        });
      });
  }
  favSection.style.display = 'flex';
}

function logout() {
  localStorage.removeItem('currentUser');
  currentUser = null;
  updateFavoritesBtnVisibility();
  updateLoginRegisterBtnVisibility();
  fetchAndDisplayMovies();
  document.getElementById('profileModal').style.display = 'none';
  showProfilePic('');
}

document.addEventListener('DOMContentLoaded', function() {
  
  currentUser = getUserFromStorage();
  updateFavoritesBtnVisibility();
  updateLoginRegisterBtnVisibility();
  updateProfileBtnVisibility();
  
  const profileBtn = document.getElementById('openProfile');
  if (profileBtn) {
    profileBtn.onclick = function() {
      showProfileModal();
      const modal = document.getElementById('profileModal');
      if (modal) modal.style.display = 'flex';
    };
  }
  
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
    fetch('https://shiny-potato-q7454gqx9xjw2x54j-3000.app.github.dev/users')
      .then(response => {
        if (!response.ok) throw new Error('Erro ao buscar usuários no servidor');
        return response.json();
      })
      .then(users => {
        const found = users.find(u => u.user === user && u.pass === pass);
        if (found) {
          loginModal.style.display = 'none';
          loginError.style.display = 'none';
          showProfilePic(found.photo);
          alert('Login realizado com sucesso!');
          currentUser = found;
          setUserToStorage(found);
          fetchAndDisplayMovies();
          updateFavoritesBtnVisibility();
          updateLoginRegisterBtnVisibility();
          updateProfileBtnVisibility();
        } else {
          loginError.style.display = 'block';
        }
      })
      .catch(() => {
        loginError.style.display = 'block';
      });
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
  
  window.addEventListener('click', function(e) {
    if (e.target === loginModal) loginModal.style.display = 'none';
    if (e.target === registerModal) registerModal.style.display = 'none';
    const profileModal = document.getElementById('profileModal');
    if (e.target === profileModal) profileModal.style.display = 'none';
  });
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
    
    fetch('https://shiny-potato-q7454gqx9xjw2x54j-3000.app.github.dev/users?user=' + encodeURIComponent(user))
      .then(response => response.json())
      .then(users => {
        if (users.length > 0) {
          registerMsg.style.display = 'block';
          registerMsg.style.color = 'red';
          registerMsg.textContent = 'Usuário já existe!';
          setTimeout(() => { registerMsg.style.display = 'none'; }, 1500);
          return;
        }
        
        fetch('https://shiny-potato-q7454gqx9xjw2x54j-3000.app.github.dev/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user, pass, photo })
        })
        .then(res => {
          if (!res.ok) throw new Error('Erro ao cadastrar usuário');
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
        })
        .catch(() => {
          registerMsg.style.display = 'block';
          registerMsg.style.color = 'red';
          registerMsg.textContent = 'Erro ao cadastrar!';
          setTimeout(() => { registerMsg.style.display = 'none'; }, 1500);
        });
      });
  };
  
  const showFavBtn = document.getElementById('showFavoritesBtn');
  const favSection = document.getElementById('favorites-section');
  const closeFav = document.getElementById('closeFavorites');
  if (showFavBtn) {
    showFavBtn.onclick = function() {
      showFavorites();
    };
  }
  if (closeFav) {
    closeFav.onclick = function() {
      const favSection = document.getElementById('favorites-section');
      favSection.style.display = 'none';
    };
  }
  
  const showAllBtn = document.getElementById('showAllMoviesBtn');
  const allSection = document.getElementById('all-movies-section');
  const closeAll = document.getElementById('closeAllMovies');
  if (showAllBtn) {
    showAllBtn.onclick = function() {
      fetch(backendUrl)
        .then(response => response.json())
        .then(movies => {
          const allMoviesList = document.getElementById('all-movies-list');
          allMoviesList.innerHTML = '';
          movies.forEach(movie => {
            const div = document.createElement('div');
            div.classList.add('movie');
            let descriptionHtml = `<p id="desc-${movie.id}">${movie.description}</p>`;
            
            if (currentUser && currentUser.user === 'admin') {
              descriptionHtml = `
                <textarea id="edit-desc-${movie.id}" style="width:100%;min-height:60px;">${movie.description}</textarea>
                <button style="margin:8px 0 12px 0;" onclick="window.saveDesc && window.saveDesc('${movie.id}')">Salvar Legenda</button>
                <div id="desc-msg-${movie.id}" style="color:green;font-size:0.95em;"></div>
              `;
            }
            div.innerHTML = `
              <img src="${movie.image}" alt="${movie.title}" style="width:120px;float:left;margin-right:18px;border-radius:8px;">
              <h3>${movie.title}</h3>
              ${descriptionHtml}
              <a href="${movie.link}" target="_blank" style="color:#ff0000;font-weight:bold;">Ver Trailer</a>
              <div style="clear:both;"></div>
            `;
            div.style.marginBottom = '32px';
            div.style.overflow = 'auto';
            allMoviesList.appendChild(div);
          });
          allSection.style.display = 'block';
          // Função global para salvar descrição
          window.saveDesc = function(movieId) {
            const textarea = document.getElementById('edit-desc-' + movieId);
            const msg = document.getElementById('desc-msg-' + movieId);
            if (!textarea) return;
            const newDesc = textarea.value;
            fetch(`${backendUrl}/${movieId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ description: newDesc })
            })
            .then(res => {
              if (!res.ok) throw new Error('Erro ao salvar legenda');
              msg.textContent = 'Legenda atualizada!';
              setTimeout(() => { msg.textContent = ''; }, 1500);
            })
            .catch(() => {
              msg.textContent = 'Erro ao salvar!';
              msg.style.color = 'red';
              setTimeout(() => { msg.textContent = ''; msg.style.color = 'green'; }, 2000);
            });
          };
        });
    };
  }
  if (closeAll) {
    closeAll.onclick = function() {
      allSection.style.display = 'none';
    };
  }
  
  if (currentUser) {
    showFavBtn.style.display = 'block';
  }
  
  const profilePic = document.getElementById('profilePic');
  const profileModal = document.getElementById('profileModal');
  const closeProfile = document.getElementById('closeProfile');
  const logoutBtn = document.getElementById('logoutBtn');
  if (profilePic) {
    profilePic.onclick = showProfileModal;
  }
  if (closeProfile) {
    closeProfile.onclick = function(e) {
      e.preventDefault();
      document.getElementById('profileModal').style.display = 'none';
      return false;
    };
  }
  if (logoutBtn) {
    logoutBtn.onclick = function(e) {
      e.preventDefault();
      logout();
      setTimeout(() => {
        const modal = document.getElementById('profileModal');
        if (modal) modal.style.display = 'none';
      }, 100);
      return false;
    };
  }
});


function updateFavoritesBtnVisibility() {
  const showFavBtn = document.getElementById('showFavoritesBtn');
  if (showFavBtn) {
    showFavBtn.style.display = currentUser ? 'block' : 'none';
  }
}


function updateLoginRegisterBtnVisibility() {
  const loginBtn = document.getElementById('openLogin');
  const registerBtn = document.getElementById('openRegister');
  const profileBtn = document.getElementById('openProfile');
  if (loginBtn && registerBtn && profileBtn) {
    if (currentUser) {
      loginBtn.style.display = 'none';
      registerBtn.style.display = 'none';
      profileBtn.style.display = 'inline-block';
    } else {
      loginBtn.style.display = 'inline-block';
      registerBtn.style.display = 'inline-block';
      profileBtn.style.display = 'none';
    }
  }
}


function updateProfileBtnVisibility() {
  const profileBtn = document.getElementById('openProfile');
  if (profileBtn) {
    profileBtn.style.display = currentUser ? 'inline-block' : 'none';
  }
}


window.addEventListener('DOMContentLoaded', updateLoginRegisterBtnVisibility);