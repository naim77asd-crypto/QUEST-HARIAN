<!DOCTYPE html>
<html lang="ms">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Quest Harian 3 Bulan</title>
<style>
body { 
    font-family: Arial, sans-serif; 
    text-align: center; 
    background: #e0f7fa; 
    margin: 0; 
    padding: 0; 
}

h1 { margin: 10px; }

#character { 
    font-size: 60px; 
    margin: 20px; 
    transition: transform 0.5s; 
}

.jump { transform: translateY(-60px);}
.fall { transform: translateY(60px);}
.half-fall { transform: translateY(30px);}

.quest-list { 
    list-style: none; 
    padding: 0; 
}

.quest-item { 
    padding: 10px 15px; 
    margin: 5px auto; 
    width: 90%; 
    max-width: 400px; 
    background: #fff; 
    border-radius: 10px; 
    cursor: pointer; 
    transition: background 0.3s; 
}

.quest-item.completed { 
    background: #81c784; 
    text-decoration: line-through; 
}

.calendar { 
    display: flex; 
    flex-wrap: wrap; 
    justify-content: center; 
    margin-top: 20px; 
}

.day { 
    width: 30px; 
    height: 30px; 
    margin: 2px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    border-radius: 5px; 
    background: #fff; 
    font-size: 12px; 
}

.day.complete { background: #81c784; color: #fff; }
.day.partial { background: #ffb74d; color: #fff; }
.day.empty { background: #eee; }

#game-button {
    margin: 20px;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    background-color: #42a5f5;
    color: #fff;
    transition: background 0.3s;
}

#game-button:disabled {
    background-color: #aaa;
    cursor: not-allowed;
}
</style>
</head>
<body>
<h1>Quest Harian 3 Bulan</h1>
<div id="character">😔</div>
<ul class="quest-list" id="questList"></ul>

<h3>Calendar 3 Bulan</h3>
<div class="calendar" id="calendar"></div>

<button id="game-button">Main Game</button>

<script>
const quests = [
  "Bangun pukul 6",
  "7:25 ke perhimpunan",
  "8:00 Kelas",
  "9:30 Sarapan pagi",
  "10:00 Kelas",
  "12:50 Makan tengah hari",
  "14:00 Kelas",
  "16:50 Habis kelas",
  "17:00 Senaman dumbell",
  "18:00 Makan",
  "18:20 Mandi",
  "Baca Al-Quran selepas Maghrib",
  "Main game 1 jam"
];

// LocalStorage untuk simpan progress harian
let completed = JSON.parse(localStorage.getItem("completed")) || Array(quests.length).fill(false);

// Waktu solat JAKIM Kangar (HH:MM)
const prayerTimes = {
    Fajr: "05:30",
    Dhuhr: "13:10",
    Asr: "16:20",
    Maghrib: "19:00",
    Isha: "20:30"
};

// Render quest list
function renderQuests(){
  const list = document.getElementById("questList");
  list.innerHTML = "";
  completed.forEach((c, i)=>{
    const li = document.createElement("li");
    li.className = "quest-item" + (c ? " completed" : "");
    li.innerText = quests[i];
    li.addEventListener("click", ()=>{
      completed[i] = !completed[i];
      localStorage.setItem("completed", JSON.stringify(completed));
      renderQuests();
      updateCharacter();
      renderCalendar();
      checkGameLock();
    });
    list.appendChild(li);
  });
}

// Update karakter emoji
function updateCharacter(){
  const char = document.getElementById("character");
  const doneCount = completed.filter(c=>c).length;
  if(doneCount === quests.length){
    char.innerText="🕺";
    char.className="jump";
  } else if(doneCount >= quests.length/2){
    char.innerText="🙂";
    char.className="half-fall";
  } else {
    char.innerText="😔";
    char.className="fall";
  }
}

// Render calendar 3 bulan ikut tarikh sebenar
function renderCalendar(){
  const cal = document.getElementById("calendar");
  cal.innerHTML = "";
  const today = new Date();
  for(let d=0; d<90; d++){
    const dayDiv = document.createElement("div");
    dayDiv.className="day";

    // Tentukan tarikh
    const dayDate = new Date();
    dayDate.setDate(today.getDate() + d);

    // Check progress: contoh demo hari ini
    if(dayDate.toDateString() === today.toDateString()){
      const doneCount = completed.filter(c=>c).length;
      if(doneCount === quests.length) dayDiv.className="day complete";
      else if(doneCount >= quests.length/2) dayDiv.className="day partial";
      else dayDiv.className="day empty";
    }

    dayDiv.innerText = dayDate.getDate();
    cal.appendChild(dayDiv);
  }
}

// Lock Main Game ikut waktu solat Maghrib
function checkGameLock(){
    const btn = document.getElementById("game-button");
    const now = new Date();
    const currentTime = now.getHours()*60 + now.getMinutes();
    const maghrib = parseTime(prayerTimes.Maghrib);
    btn.disabled = currentTime < maghrib;
}

// Helper convert "HH:MM" ke menit
function parseTime(t){
    const [h, m] = t.split(":").map(Number);
    return h*60 + m;
}

document.getElementById("game-button").addEventListener("click", ()=>{
    alert("Selamat bermain 1 jam!");
});

// Inisialisasi
renderQuests();
updateCharacter();
renderCalendar();
checkGameLock();
</script>
</body>
</html>
