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

async function loadDownloads(){
    const list = document.getElementById("downloadList");

    const snap = await db.collection("lelayu").orderBy("timestamp", "desc").get();
    snap.forEach(doc => {
        const d = doc.data();
        if (!d.pdfUrl) return;

        const li = document.createElement("li");
        li.innerHTML = `<a class="btn" href="${d.pdfUrl}" target="_blank">Download PDF – ${d.nama_almarhum}</a>`;
        list.appendChild(li);
    });
}

loadDownloads();
