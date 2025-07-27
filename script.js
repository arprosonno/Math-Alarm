let alarmCount = 0;

document.getElementById("add-alarm").addEventListener("click", () => {
  const dateTimeInput = document.getElementById("alarm-time").value;
  const soundFile = document.getElementById("alarm-sound").files[0];

  if (!dateTimeInput || !soundFile) {
    alert("Please select both time and sound!");
    return;
  }

  const [datePart, timePart] = dateTimeInput.split("T");
  const [year, month, day] = datePart.split("-");
  const [hour, minute] = timePart.split(":");
  const localAlarm = new Date(year, month - 1, day, hour, minute);
  const alarmTime = localAlarm.getTime();
  const now = Date.now();

  if (alarmTime <= now) {
    alert("Please set a future time.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    addNewAlarm(alarmTime, e.target.result);
    alert("Alarm set successfully!");
  };
  reader.readAsDataURL(soundFile);
});

function addNewAlarm(alarmTime, audioSrc) {
  const container = document.getElementById("alarms-container");
  const template = document.getElementById("alarm-template");
  const alarmNode = template.content.cloneNode(true);
  const alarmBox = alarmNode.querySelector(".alarm-box");

  const title = alarmBox.querySelector(".alarm-title");
  const countdown = alarmBox.querySelector(".countdown");
  const mathProblemEl = alarmBox.querySelector(".math-problem");
  const userAnswerInput = alarmBox.querySelector(".user-answer");
  const submitButton = alarmBox.querySelector(".submit-answer");
  const feedback = alarmBox.querySelector(".feedback");
  const audio = alarmBox.querySelector(".alarm-audio");
  const alarmActiveDiv = alarmBox.querySelector(".alarm-active");

  alarmCount++;
  title.textContent = `Alarm ${alarmCount}`;
  audio.src = audioSrc;

  // Create Delete Button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete Alarm";
  deleteBtn.classList.add("delete-alarm");
  alarmBox.appendChild(deleteBtn);

  deleteBtn.addEventListener("click", () => {
    clearInterval(interval);
    audio.pause();
    alarmBox.remove();
  });

  const interval = setInterval(() => {
    const now = Date.now();
    const diff = alarmTime - now;

    if (diff <= 0) {
      clearInterval(interval);
      triggerAlarm();
    } else {
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      countdown.textContent = `⏳ Alarm in ${mins}m ${secs}s`;
    }
  }, 1000);

  let correctAnswer;

  function triggerAlarm() {
    alarmActiveDiv.style.display = "block";
    countdown.textContent = "🚨 Alarm is ringing!";
    const [question, answer] = generateMathProblem();
    mathProblemEl.textContent = question;
    correctAnswer = answer;

    audio.play().catch(() => {
      countdown.textContent = "🔇 Tap to enable sound!";
    });

    submitButton.addEventListener("click", () => {
      const userAns = parseFloat(userAnswerInput.value.trim());
      if (userAns === correctAnswer) {
        feedback.textContent = "✅ Correct! Alarm stopped.";
        feedback.style.color = "lightgreen";
        audio.pause();
        audio.currentTime = 0;
        alarmActiveDiv.style.display = "none";
        countdown.textContent = "✅ Solved.";
      } else {
        feedback.textContent = "❌ Incorrect. Try again.";
        feedback.style.color = "red";
      }
    });
  }

  container.appendChild(alarmBox);
}

function generateMathProblem() {
  const type = Math.floor(Math.random() * 3);
  let question = "", answer = 0;

  switch (type) {
    case 0:
      const a = Math.floor(Math.random() * 900 + 100);
      const b = Math.floor(Math.random() * 900 + 100);
      question = `${a} + ${b}`;
      answer = a + b;
      break;
    case 1:
      const x = Math.floor(Math.random() * 10 + 1);
      const res = x * 5 + 3;
      question = `Solve: 5x + 3 = ${res}`;
      answer = x;
      break;
    case 2:
      const n1 = Math.floor(Math.random() * 50);
      const n2 = Math.floor(Math.random() * 50);
      const n3 = Math.floor(Math.random() * 10 + 1);
      question = `(${n1} + ${n2}) * ${n3}`;
      answer = (n1 + n2) * n3;
      break;
  }

  return [question, answer];
}
