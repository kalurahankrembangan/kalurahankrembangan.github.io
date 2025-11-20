const firebaseConfig = {
   apiKey: "AIzaSyDNk490l2YMUHV54Y_HsGkkiQWxr5KvC7w",
  authDomain: "berita-lelayu-online.firebaseapp.com",
  projectId: "berita-lelayu-online",
  storageBucket: "berita-lelayu-online.firebasestorage.app",
  messagingSenderId: "977984787298",
  appId: "1:977984787298:web:5e173c586718fee5c4d23b",
  measurementId: "G-9KTHZJBP73"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const makamSelect = document.getElementById("makam");
const makamLain = document.getElementById("makam_lainnya");

makamSelect.addEventListener("change", () => {
    makamLain.style.display = (makamSelect.value === "Lainnya") ? "block" : "none";
});

const berdukaList = document.getElementById("berdukaList");
document.getElementById("addBerduka").onclick = () => {
    const div = document.createElement("div");
    div.className = "berduka-item";
    div.innerHTML = `
        <input type="text" placeholder="Nama" class="bd-nama">
        <select class="bd-relasi">
            <option>Simbah</option>
            <option>Bapak</option>
            <option>Ibu</option>
            <option>Garwo</option>
            <option>Putro</option>
            <option>Putro & Putro Mantu</option>
            <option>Adik</option>
            <option>Mbakyu</option>
            <option>Kakang</option>
            <option>Putro Mantu</option>
            <option>Lainnya</option>
        </select>
    `;
    berdukaList.appendChild(div);
};

document.getElementById("lelayuForm").addEventListener("submit", async e => {
    e.preventDefault();

    const berduka = [...document.querySelectorAll(".berduka-item")].map(div => ({
        name: div.querySelector(".bd-nama").value,
        relation: div.querySelector(".bd-relasi").value
    }));

    const data = {
        nama_almarhum: nama_almarhum.value,
        usia: usia.value,
        padukuhan: padukuhan.value,
        hari_mati: hari_mati.value,
        tgl_mati: tgl_mati.value,
        jam_mati: jam_mati.value,
        hari_kubur: hari_kubur.value,
        tgl_kubur: tgl_kubur.value,
        jam_kubur: jam_kubur.value,
        makam_lengkap: (makamSelect.value === "Lainnya") ? makamLain.value : makamSelect.value,
        yang_berduka: berduka,
        timestamp: Date.now()
    };

    await db.collection("lelayu").add(data);

    document.getElementById("status").textContent = "Berhasil! PDF segera muncul di halaman download.";
    e.target.reset();
    berdukaList.innerHTML = "";
});
