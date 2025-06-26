// Collapsible sections
const toggleIngredientsBtn = document.getElementById('toggle-ingredients');
const toggleStepsBtn = document.getElementById('toggle-steps');
const ingredientsSection = document.getElementById('ingredients-section');
const stepsSection = document.getElementById('steps-section');

toggleIngredientsBtn.addEventListener('click', () => {
  const open = ingredientsSection.classList.toggle('open');
  toggleIngredientsBtn.innerHTML = open
    ? '<i class="fa-solid fa-basket-shopping"></i> Hide Ingredients'
    : '<i class="fa-solid fa-basket-shopping"></i> Show Ingredients';
});
toggleStepsBtn.addEventListener('click', () => {
  const open = stepsSection.classList.toggle('open');
  toggleStepsBtn.innerHTML = open
    ? '<i class="fa-solid fa-list-ol"></i> Hide Steps'
    : '<i class="fa-solid fa-list-ol"></i> Show Steps';
});

// Animated Cooking Progress
const stepsList = document.querySelectorAll('.steps-list li');
const startBtn = document.getElementById('start-cooking');
const nextBtn = document.getElementById('next-step');
const progressBar = document.getElementById('progress-bar');
const timerSpan = document.getElementById('timer');

let currentStep = -1;
let timerId = null;
let secondsElapsed = 0;
const totalPrepSeconds = 20 * 60 + 30 * 60; // prep + cook time: 20+30 min

function highlightStep(index) {
  stepsList.forEach((li, i) => {
    li.classList.toggle('active', i === index);
  });
  // Progress bar
  const percent = ((index + 1) / stepsList.length) * 100;
  progressBar.style.width = percent + '%';
}

function resetSteps() {
  stepsList.forEach(li => li.classList.remove('active'));
  progressBar.style.width = '0%';
  currentStep = -1;
  nextBtn.disabled = true;
  timerSpan.textContent = '';
  clearInterval(timerId);
  secondsElapsed = 0;
}

startBtn.addEventListener('click', () => {
  resetSteps();
  currentStep = 0;
  highlightStep(currentStep);
  nextBtn.disabled = false;
  startBtn.disabled = true;
  // Start timer (bonus)
  timerId = setInterval(() => {
    secondsElapsed++;
    const remaining = totalPrepSeconds - secondsElapsed;
    if (remaining < 0) {
      timerSpan.textContent = "Time's up!";
      clearInterval(timerId);
      return;
    }
    const min = Math.floor(remaining / 60);
    const sec = remaining % 60;
    timerSpan.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
  }, 1000);
});

nextBtn.addEventListener('click', () => {
  if (currentStep < stepsList.length - 1) {
    currentStep++;
    highlightStep(currentStep);
    if (currentStep === stepsList.length - 1) {
      nextBtn.disabled = true;
      startBtn.disabled = false;
      clearInterval(timerId);
      timerSpan.textContent = "Done!";
    }
  }
});

// Reset only when steps section is first opened (not during cooking)
stepsSection.addEventListener('transitionend', () => {
  if (stepsSection.classList.contains('open') && currentStep === -1) {
    // Only reset if we haven't started cooking yet
    resetSteps();
    startBtn.disabled = false;
  }
});

// Optional: allow clicking a step to highlight directly
stepsList.forEach((li, idx) => {
  li.addEventListener('click', () => {
    if (currentStep !== -1) {
      currentStep = idx;
      highlightStep(currentStep);
      if (currentStep === stepsList.length - 1) {
        nextBtn.disabled = true;
        startBtn.disabled = false;
        clearInterval(timerId);
        timerSpan.textContent = "Done!";
      } else {
        nextBtn.disabled = false;
      }
    }
  });
});