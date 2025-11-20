<!DOCTYPE html>
<html lang="id" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- Firebase scripts -->
    <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js"></script>
    <style>
        /* CSS yang sudah Anda berikan di atas */
    </style>
</head>
<body>
    <div class="container">
        <h1>Dashboard Lelayan</h1>
        
        <div class="stats-box">
            <div class="stat">
                <h3>Minggu Ini</h3>
                <p id="weekTotal">0</p>
            </div>
            <div class="stat">
                <h3>Bulan Ini</h3>
                <p id="monthTotal">0</p>
            </div>
        </div>

        <!-- Chart Container -->
        <div class="form-container">
            <h2>Data per Padukuhan</h2>
            <div class="chart-container" style="position: relative; height: 400px; width: 100%;">
                <canvas id="pieChart"></canvas>
            </div>
        </div>

        <div class="menu-buttons">
            <a href="index.html" class="btn">Kembali</a>
        </div>
    </div>

    <script>
        // Firebase config
        const firebaseConfig = {
           apiKey: "AIzaSyDNk490l2YMUHV54Y_HsGkkiQWxr5KvC7w",
  	authDomain: "berita-lelayu-online.firebaseapp.com",
  	projectId: "berita-lelayu-online",
  	storageBucket: "berita-lelayu-online.firebasestorage.app",
  	messagingSenderId: "977984787298",
  	appId: "1:977984787298:web:5e173c586718fee5c4d23b",
  	measurementId: "G-9KTHZJBP73"
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();

        // Add getWeek method to Date prototype
        Date.prototype.getWeek = function() {
            const date = new Date(this.getTime());
            date.setHours(0, 0, 0, 0);
            date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
            const week1 = new Date(date.getFullYear(), 0, 4);
            return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
        };

        function randomColor() {
            return `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
        }

        async function loadDashboard() {
            try {
                const snap = await db.collection("lelayu").get();

                if (snap.empty) {
                    console.log("No documents found in 'lelayu' collection");
                    return;
                }

                const padukuhanCount = {};
                let weekTotal = 0;
                let monthTotal = 0;

                const now = new Date();
                const currentWeek = now.getWeek();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();

                console.log(`Processing ${snap.size} documents...`);

                snap.forEach(doc => {
                    const d = doc.data();
                    console.log("Document data:", d);
                    
                    if (!d.tgl_mati) {
                        console.warn("Document missing tgl_mati:", doc.id);
                        return;
                    }

                    const tanggal = d.tgl_mati.toDate ? d.tgl_mati.toDate() : new Date(d.tgl_mati);

                    // Count per padukuhan
                    if (d.padukuhan) {
                        padukuhanCount[d.padukuhan] = (padukuhanCount[d.padukuhan] || 0) + 1;
                    }

                    // Weekly count (last 7 days)
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    
                    if (tanggal >= oneWeekAgo) {
                        weekTotal++;
                    }

                    // Monthly count
                    if (tanggal.getMonth() === currentMonth && tanggal.getFullYear() === currentYear) {
                        monthTotal++;
                    }
                });

                console.log("Padukuhan count:", padukuhanCount);
                console.log("Week total:", weekTotal);
                console.log("Month total:", monthTotal);

                // Update DOM
                document.getElementById("weekTotal").textContent = weekTotal;
                document.getElementById("monthTotal").textContent = monthTotal;

                // Create Pie Chart
                const ctx = document.getElementById('pieChart').getContext('2d');
                
                if (Object.keys(padukuhanCount).length === 0) {
                    console.log("No data available for chart");
                    // Show message or empty state
                    return;
                }

                new Chart(ctx, {
                    type: "pie",
                    data: {
                        labels: Object.keys(padukuhanCount),
                        datasets: [{
                            data: Object.values(padukuhanCount),
                            backgroundColor: Object.keys(padukuhanCount).map(() => randomColor()),
                            borderColor: "white",
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    color: 'white',
                                    font: {
                                        size: 12
                                    }
                                }
                            },
                            title: {
                                display: true,
                                text: 'Distribusi Lelayan per Padukuhan',
                                color: 'white',
                                font: {
                                    size: 16
                                }
                            }
                        }
                    }
                });

            } catch (error) {
                console.error("Error loading dashboard:", error);
            }
        }

        // Load dashboard when page loads
        document.addEventListener('DOMContentLoaded', function() {
            loadDashboard();
        });
    </script>
</body>
</html>