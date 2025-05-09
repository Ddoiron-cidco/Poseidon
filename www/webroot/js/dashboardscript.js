var socket;
var messageTimer;
var depthChart;
var depth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var attitudeChart;
var imu_x = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var imu_y = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var depth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var headingGauge;

$(document).ready(function () {

  chartMetrics();

  displayOverlay();

  connectWebSocket();

  startTimer();

});

function getFixTypeLabel(fixType) {
  const fixTypes = {
    0: "No Fix",
    1: "Dead Reckoning only",
    2: "2D Fix",
    3: "3D Fix",
    4: "GNSS + Dead Reckoning",
    5: "Time only fix"
  };
  return fixTypes[fixType] || `Unknown (${fixType})`;
}


// Function to close the WebSocket and notify the user
function closeWebSocket() {
  socket.close();
  console.log("Attempting to reestablish connection.")
  //alert("Connection lost! Attempting to reestablish.")

  chartMetrics();

  //display overlay...
  displayOverlay();

  // Try to reconnect after a 3 sec delay
  setTimeout(function () {
    connectWebSocket();
  }, 3000); 
}

// Function to start the timer adn reconnect if it goes 2 seconds without data from server
function startTimer() {
  messageTimer = setTimeout(function () {
    closeWebSocket();
  }, 2000); 
}

// Function to reset the timer
function resetTimer() {
  clearTimeout(messageTimer);
  startTimer();
}

// Establishes all the rules for socket connection and error handling
function connectWebSocket() {

  socket = new WebSocket("ws://" + window.location.hostname + ":9002");

  socket.onmessage = function (event) {
    //console.log(event.data);
    resetTimer(); // keep alive

    var msg = JSON.parse(event.data);

    if (msg.telemetry) {
      //console.log("ok")
      processTelemetry(msg.telemetry);
      hideOverlay()
    }
    else if (msg.recordingInfo) {
      var isLogging = msg.recordingInfo.status;
      var mode = msg.loggingMode.the_mode_is;
      processRecordingInfo(isLogging, mode);
    }
    else if (msg.type && msg.type === "gnss_status") {
      updateGnssStatus(msg);
    }
    
  };

  // Displays error info, reconnection is handled by the timer
  socket.onerror = function (event) {
    console.error("Websocket error: ", event)
    closeWebSocket()
  }

  // Displays closing info, reconnection is handled by the timer
  socket.onclose = function (event) {
    console.log('WebSocket connection closed.');
    console.log('Close code:', event.code);
    console.log('Close reason:', event.reason);
  }
}

// Loading screen
function displayOverlay() {
  document.getElementById("overlay-text").innerHTML = "<p class='text-dark text-center'>Loading...</p><img src='./img/loading.gif'/>";//"<p class='text-light'>Loading...</p>"; //"<img href='./img/loading.gif'/>";
  document.getElementById("overlay").style.display = "block";
}

function hideOverlay() {
  document.getElementById("overlay").style.display = "none";
}

function chartMetrics() {
  //Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
  //Chart.defaults.global.defaultFontColor = '#858796'

  var ctxAttitude = document.getElementById("attitudeChart").getContext('2d');
  attitudeChart = new Chart(ctxAttitude, {
    type: 'line',
    data: {
      labels: [, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,],
      datasets: [{ label: "Pitch", data: imu_x, backgroundColor: ['rgba(105, 0, 132, 0)',], borderColor: ['rgba(200, 99, 132, .7)',], borderWidth: 2 },
      { label: "Roll", data: imu_y, backgroundColor: ['rgba(0, 137, 132, 0)',], borderColor: ['rgba(0, 10, 130, .7)',], borderWidth: 2 }]
    },
    options: { responsive: true, animation: false, elements: { point: { radius: 0 } } }
  });

  var ctxDepth = document.getElementById("depthChart").getContext('2d');
  depthChart = new Chart(ctxDepth,
    {
      type: 'line',
      data: {
        labels: [, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,],
        datasets: [{ label: "Depth(m)", data: depth, backgroundColor: ['rgba(0, 137, 132, 0)',], borderColor: ['rgba(0, 10, 130, .7)',], borderWidth: 2 }]
      },
      options: { maintainAspectRatio: false, responsive: true, animation: false, elements: { point: { radius: 0 } } }
    });

  headingGauge = new RadialGauge({
    renderTo: 'imuz',
    minValue: 0,
    maxValue: 360,
    majorTicks: [
      "0",
      "45",
      "90",
      "135",
      "180",
      "225",
      "270",
      "315",
      "0"
    ],
    minorTicks: 22,
    ticksAngle: 360,
    startAngle: 180,
    strokeTicks: false,
    highlights: false,
    colorPlate: "#222",
    colorMajorTicks: "#f5f5f5",
    colorMinorTicks: "#ddd",
    colorNumbers: "#ccc",
    colorNeedle: "rgba(240, 128, 128, 1)",
    colorNeedleEnd: "rgba(255, 160, 122, .9)",
    valueBox: false,
    valueTextShadow: false,
    colorCircleInner: "#fff",
    colorNeedleCircleOuter: "#ccc",
    needleCircleSize: 10,
    needleCircleOuter: false,
    animationRule: "linear",
    needleType: "line",
    needleStart: 25,
    needleEnd: 99,
    needleWidth: 5,
    borders: true,
    borderInnerWidth: 0,
    borderMiddleWidth: 0,
    borderOuterWidth: 3,
    colorBorderOuter: "#ccc",
    colorBorderOuterEnd: "#ccc",
    colorNeedleShadowDown: "#222",
    borderShadowWidth: 0,
    animationDuration: 150,
    animateOnInit: true,
    animation: false
  }).draw();
}

function processTelemetry(state) {
  //console.log(state.gnssFix);
  
  // Vérification de l'état GNSS
  if (state.gnssFix < 0 || !state.position.length) {
    $("#gnssStatus").removeClass("bg-gradient-success bg-gradient-warning").addClass("bg-gradient-danger");
    $("#gnssLongitudeValue").text("");
    $("#gnssLatitudeValue").text("");
    $("#gnssStatusText").text("No GNSS Data...");
  } else {
    $("#gnssStatus").removeClass("bg-gradient-danger bg-gradient-warning").addClass("bg-gradient-success");
    $("#gnssLongitudeValue").text(state.position[0].toFixed(8));
    $("#gnssLatitudeValue").text(state.position[1].toFixed(8));
    $("#gnssStatusText").text("");
  }

  // Vérification de l'état de l'IMU
  if (!state.attitude.length) {
    $("#imuStatus").removeClass("bg-gradient-success bg-gradient-warning").addClass("bg-gradient-danger");
    $("#imuHeadingValue").text("");
    $("#imuPitchValue").text("");
    $("#imuRollValue").text("");
    $("#imuStatusText").text("No IMU Data");
  } else {
    $("#imuStatus").removeClass("bg-gradient-danger bg-gradient-warning").addClass("bg-gradient-success");
    $("#imuHeadingValue").text(state.attitude[0].toFixed(3));
    $("#imuPitchValue").text(state.attitude[1].toFixed(3));
    $("#imuRollValue").text(state.attitude[2].toFixed(3));
    $("#imuStatusText").text("");
  }

  // Vérification de l'état du sonar
  if (!state.depth.length) {
    $("#sonarStatus").removeClass("bg-gradient-success bg-gradient-warning").addClass("bg-gradient-danger");
    $("#sonarDepthValue").text("");
    $("#sonarStatusText").text("No Sonar Data");
  } else {
    $("#sonarStatus").removeClass("bg-gradient-danger bg-gradient-warning").addClass("bg-gradient-success");
    $("#sonarDepthValue").text(state.depth[0].toFixed(2));
    $("#sonarStatusText").text("");
  }

  // Mettre à jour les graphiques
  imu_x.push(state.attitude.length ? state.attitude[1] : 0);
  imu_x.shift();

  imu_y.push(state.attitude.length ? state.attitude[2] : 0);
  imu_y.shift();

  depth.push(state.depth.length ? -state.depth[0] : 0);
  depth.shift();

  attitudeChart.update();
  depthChart.update();

  // Mise à jour du gauge si des données de cap sont disponibles
  headingGauge.value = state.attitude.length ? state.attitude[0] : 0;
  
  // Gestion de l'espace libre sur le disque
  if (state.vitals[3] < 1) {
    $("#hddFreeSpaceOK").removeClass("d-none").addClass("d-block alert alert-danger");
  } else {
    $("#hddFreeSpaceOK").removeClass("d-block alert alert-danger").addClass("d-none");
  }

  //led color
if(state.vitals[8] == 5){//Error
  $("#systemStatus").addClass("d-block").removeClass("d-none").addClass("bg-gradient-danger").removeClass("bg-gradient-warning");
  $("#systemStatusText").text(state.status);
  $("#systemStatusTitle").text("Error:");
}
else if(state.vitals[8] == 4){//NoFix
  $("#systemStatus").addClass("d-block").removeClass("d-none").removeClass("bg-gradient-danger").addClass("bg-gradient-warning");
  $("#systemStatusText").text(state.status);
  $("#systemStatusTitle").text("NoFix");
}
else if(state.vitals[8] == 3){//Warning
  $("#systemStatus").addClass("d-block").removeClass("d-none").removeClass("bg-gradient-danger").addClass("bg-gradient-warning");
  $("#systemStatusText").text(state.status);
  let match = state.status.match(/\[(.*?)\]/);
  let titleText = "Warning:";
  let extractedText = match[1];
  if (extractedText === "INFO") {
    titleText = "Info:";
  }
  $("#systemStatusTitle").text(titleText);
}
else{
  $("#systemStatus").removeClass("d-block").addClass("d-none").removeClass("bg-gradient-danger").removeClass("bg-gradient-warning");
  $("#systemStatusText").text();
}

}

function processRecordingInfo(isLogging, mode) {

  if (mode == "1") {
    hideLoggingButton();
    $("#modeWidget").text("always ON"); 
    if (isLogging) {
      //console.log("logging mode 1 : always ON");
      showRecording();
    }
    else {
      showNotRecording();
    }

  }
  else if (mode == "2") {
    $("#modeWidget").text("Manual");
    if (isLogging) {
      //console.log("logging mode 2 : manual , isLogging");
      showRecordingButton();
      showRecording();
    }
    else {
      //console.log("logging mode 2 : manual , is not logging");
      showNotRecording();
      showNotRecordingButton();
    }
  }
  else if (mode == "3") {
    hideLoggingButton();
    $("#modeWidget").text("speed based");
    if (isLogging) {
      //console.log("logging mode 3 : speed based , isLogging");
      showRecording();
    }
    else {
      //console.log("logging mode 3 : speed based , is not Logging");
      showNotRecording();
    }
  }
}

function startRecording() {
  var cmd = { command: "startLogging" };
  socket.send(JSON.stringify(cmd));
}

function stopRecording() {
  var cmd = { command: "stopLogging" };
  socket.send(JSON.stringify(cmd));
}


function toggleRecording() {
  if ($("#btnRecording").hasClass("btn-success")) {
    var cmd = { command: "startLogging" };
    socket.send(JSON.stringify(cmd));
  } else if ($("#btnRecording").hasClass("btn-danger")) {
    var cmd = { command: "stopLogging" };
    socket.send(JSON.stringify(cmd));
  }
}

// Functions that changes the color and display status of recording buttons
function showRecording() {
  $("#recordingStatus2").removeClass("d-none text-success").addClass("text-danger");
  $("#recordingStatus2").text("Active");
  // $("#modeWidget").removeClass("text-danger text-success").addClass("text-danger");
}

function showNotRecording() {
  $("#recordingStatus2").removeClass("d-none text-danger").addClass("text-success");
  $("#recordingStatus2").text("Inactive");
  // $("#modeWidget").removeClass("text-danger text-success").addClass("text-success");
}

function showRecordingButton() {
  $("#btnRecording").removeClass("btn-success").addClass("btn-danger");
  $("#btnRecordingText").text("Stop Recording");
  $("#RecIcon").removeClass("text-success").addClass("text-danger");
}

function showNotRecordingButton() {
  $("#btnRecording").removeClass("btn-danger").addClass("btn-success");
  $("#btnRecordingText").text("Start Recording");
  $("#RecIcon").removeClass("text-danger").addClass("text-success");
}

function hideLoggingButton() {
  $("#btnRecording").removeClass("d-inline").addClass("d-none");
  $("#RecIcon").removeClass("d-inline").addClass("d-none");
}

// Resize recording button 
if ($(window).width() < 766) {
  $("#btnRecording").toggleClass("d-inline btn-lg");
  $("#btnRecording").parent().toggleClass("m-0 p-0");
  $("#btnRecording").parent().parent().toggleClass("m-0 p-0");
  $("#btnRecording").css('width', '100%');
  $("#btnRecording").css('height', '100%');
  $("#btnRecording").parent().css('width', '100%');
  $("#btnRecording").parent().css('height', '100%');
}

function updateGnssStatus(data) {
  document.getElementById("gnssFixType").innerText = getFixTypeLabel(data.fix_type);
  document.getElementById("gnssNumSV").innerText = data.num_sv;
  document.getElementById("gnssDiffSoln").innerText = data.diff_soln ? "Yes" : "No";
  document.getElementById("gnssHAcc").innerText = data.h_acc.toFixed(2) + " m";
  document.getElementById("gnssVAcc").innerText = data.v_acc.toFixed(2) + " m";
}

