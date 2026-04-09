let currentUser = null;
// Check if user is logged in
document.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('user');
  if (user) {
    currentUser = JSON.parse(user);
    showSlotsSection();
  } else {
    showLoginSection();
  }
});
// Show sections
function showLoginSection() {
  document.getElementById('loginSection').style.display = 'block';
  document.getElementById('registerSection').style.display = 'none';
  document.getElementById('slotsSection').style.display = 'none';
  document.getElementById('appointmentsSection').style.display = 'none';
}
function showRegisterSection() {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('registerSection').style.display = 'block';
  document.getElementById('slotsSection').style.display = 'none';
  document.getElementById('appointmentsSection').style.display = 'none';
}
function showSlotsSection() {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('registerSection').style.display = 'none';
  document.getElementById('slotsSection').style.display = 'block';
  document.getElementById('appointmentsSection').style.display = 'none';
  loadUserAppointments();
}

// Register form
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  try {
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    if (response.ok) {
      alert('Registration successful! Please login.');
      showLoginSection();
    } else {
      const error = await response.json();
      alert(error.error);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Registration failed');
  }
});

// Login form
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      currentUser = data.user;
      localStorage.setItem('user', JSON.stringify(currentUser));
      showSlotsSection();
    } else {
      const error = await response.json();
      alert(error.error);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Login failed');
  }
});

// Switch between login and register
document.getElementById('showRegister').addEventListener('click', (e) => {
  e.preventDefault();
  showRegisterSection();
});

document.getElementById('showLogin').addEventListener('click', (e) => {
  e.preventDefault();
  showLoginSection();
});

// Load slots
document.getElementById('loadSlots').addEventListener('click', loadSlots);

async function loadSlots() {
  const date = document.getElementById('appointmentDate').value;
  if (!date) {
    alert('Please select a date');
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/slots?date=${date}`);
    const data = await response.json();
    const slotsContainer = document.getElementById('slotsContainer');
    slotsContainer.innerHTML = '';

    data.slots.forEach(slot => {
      const button = document.createElement('button');
      button.className = 'slot-button';
      button.textContent = slot;
      button.addEventListener('click', (e) => selectSlot(slot, date, e.target));
      slotsContainer.appendChild(button);
    });
  } catch (error) {
    console.error('Error loading slots:', error);
  }
}

let selectedSlot = null;

function selectSlot(slot, date, button) {
  selectedSlot = { time: slot, date };
  const buttons = document.querySelectorAll('.slot-button');
  buttons.forEach(btn => btn.classList.remove('selected'));
  button.classList.add('selected');
}

// Book appointment (assuming selectSlot is called)
document.getElementById('slotsContainer').addEventListener('click', async (e) => {
  if (e.target.classList.contains('slot-button') && selectedSlot) {
    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          date: selectedSlot.date,
          time: selectedSlot.time
        })
      });

      if (response.ok) {
        alert('Appointment booked successfully!');
        loadSlots(); // Refresh slots
        loadUserAppointments();
      } else {
        alert('Failed to book appointment');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error booking appointment');
    }
  }
});

// Load user appointments
async function loadUserAppointments() {
  try {
    const response = await fetch('http://localhost:5000/api/appointments');
    const appointments = await response.json();
    const list = document.getElementById('userAppointments');
    list.innerHTML = '';
    const userAppointments = appointments.filter(apt => apt.userId && apt.userId._id === currentUser.id);
    userAppointments.forEach(apt => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${apt.date} ${apt.time}</strong> - ${apt.name} (${apt.email})`;
      list.appendChild(li);
    });
  } catch (error) {
    console.error('Error loading appointments:', error);
  }
}

// Logout (add a logout button in HTML if needed)
document.getElementById('logoutBtn').addEventListener('click', logout);

function logout() {
  localStorage.removeItem('user');
  currentUser = null;
  showLoginSection();
}