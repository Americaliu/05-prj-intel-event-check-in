const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");

const waterCount = document.getElementById("waterCount");
const zeroCount = document.getElementById("zeroCount");
const powerCount = document.getElementById("powerCount");

const teamStats = document.querySelector(".team-stats"); //Attemdee List

let totalAttendance = 0;

let teamCounts = {
  water: 0,
  zero: 0,
  power: 0,
};

const attendeeList = document.createElement("div"); //Attendee List
attendeeList.id = "attendeeList";

const attendeeListTitle = document.createElement("h3");
attendeeListTitle.textContent = "Attendees";

attendeeList.appendChild(attendeeListTitle);

teamStats.after(attendeeList);

let attendees = []; //Attendee List

function renderAttendees() {
  attendeeList.innerHTML = "<h3>Attendees</h3>";

  attendees.forEach(function (attendee) {
    const attendeeItem = document.createElement("p");

    attendeeItem.classList.add(attendee.team);

    attendeeItem.textContent = `${attendee.name} — ${teamNames[attendee.team]}`;

    attendeeList.appendChild(attendeeItem);
  });
}

const savedData = localStorage.getItem("intelAttendance"); //Local storage

if (savedData) {
  const parsedData = JSON.parse(savedData);

  totalAttendance = parsedData.totalAttendance;
  teamCounts = parsedData.teamCounts;
  attendees = parsedData.attendees || [];
}

const attendanceGoal = 50;

const teamNames = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};

attendeeCount.textContent = totalAttendance; //Local storage

waterCount.textContent = teamCounts.water;
zeroCount.textContent = teamCounts.zero;
powerCount.textContent = teamCounts.power;

const savedProgressPercentage = Math.min(
  (totalAttendance / attendanceGoal) * 100,
  100,
);

progressBar.style.width = `${savedProgressPercentage}%`;
renderAttendees(); //Attendee list Rendering

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const attendeeName = nameInput.value.trim();
  const selectedTeam = teamSelect.value;

  if (attendeeName === "" || selectedTeam === "") {
    return;
  }

  totalAttendance++;
  teamCounts[selectedTeam]++;

  //Attendee List
  attendees.push({
    name: attendeeName,
    team: selectedTeam,
  });

  //Local Storage
  const attendanceData = {
    totalAttendance: totalAttendance,
    teamCounts: teamCounts,
    attendees: attendees,
  };

  localStorage.setItem("intelAttendance", JSON.stringify(attendanceData));
  renderAttendees(); //Attendee List Rendering

  attendeeCount.textContent = totalAttendance;

  waterCount.textContent = teamCounts.water;
  zeroCount.textContent = teamCounts.zero;
  powerCount.textContent = teamCounts.power;

  const progressPercentage = Math.min(
    (totalAttendance / attendanceGoal) * 100,
    100,
  );

  progressBar.style.width = `${progressPercentage}%`;

  greeting.textContent = `Welcome, ${attendeeName}! You've checked in for ${teamNames[selectedTeam]}.`;

  greeting.classList.add("success-message");
  greeting.style.display = "block";

  //Celebration
  if (totalAttendance >= attendanceGoal) {
    let winningTeam = "water";

    if (teamCounts.zero > teamCounts[winningTeam]) {
      winningTeam = "zero";
    }

    if (teamCounts.power > teamCounts[winningTeam]) {
      winningTeam = "power";
    }

    greeting.textContent = `🎉 Goal reached! ${teamNames[winningTeam]} wins with ${teamCounts[winningTeam]} attendees!`;
  }

  form.reset();
});
