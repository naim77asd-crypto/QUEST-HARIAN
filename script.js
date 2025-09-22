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

// Waktu solat (JAKIM Kangar contoh)
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

// Render calendar 3 bulan ikut progress harian
function renderCalendar(){
  const cal = document.getElementById("calendar");
  cal.innerHTML = "";
  const today = new Date();
  for(let d=0; d<90; d++){
    const dayDiv = document.createElement("div");
    dayDiv.className="day";

    // Untuk demo, mark completed jika semua quest done hari ini
    if(d === 0){ 
      // Hari pertama = hari ini
      const doneCount = completed.filter(c=>c).length;
      if(doneCount === quests.length) dayDiv.className="day complete";
      else if(doneCount >= quests.length/2) dayDiv.className="day partial";
      else dayDiv.className="day empty";
    } else {
      dayDiv.className="day empty"; // Hari lain kosong demo
    }

    dayDiv.innerText = (d+1)%30===0?30:(d+1)%30;
    cal.appendChild(dayDiv);
  }
}

// Lock Main Game ikut waktu solat
function checkGameLock(){
    const btn = document.getElementById("game-button");
    const now = new Date();
    const currentTime = now.getHours()*60 + now.getMinutes();

    // Maghrib contoh
    const maghrib = parseTime(prayerTimes.Maghrib);
    if(currentTime >= maghrib){
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
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
