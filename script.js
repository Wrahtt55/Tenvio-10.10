// Data siswa
const siswa = [
    { nama: "Ayu", gender: "P" },
    { nama: "Bagas", gender: "L" },
    { nama: "Citra", gender: "P" },
    { nama: "Doni", gender: "L" },
    { nama: "Eka", gender: "P" },
    { nama: "Fajar", gender: "L" },
    { nama: "Gita", gender: "P" },
    { nama: "Hadi", gender: "L" },
    { nama: "Indah", gender: "P" },
    { nama: "Joko", gender: "L" },
    { nama: "Kiki", gender: "P" },
    { nama: "Luki", gender: "L" },
    { nama: "Mira", gender: "P" },
    { nama: "Nando", gender: "L" },
    { nama: "Oki", gender: "L" },
    { nama: "Putri", gender: "P" },
    { nama: "Rani", gender: "P" },
    { nama: "Sari", gender: "P" },
    { nama: "Toni", gender: "L" },
    { nama: "Umi", gender: "P" },
    { nama: "Vina", gender: "P" },
    { nama: "Wawan", gender: "L" },
    { nama: "Yuni", gender: "P" },
    { nama: "Zaki", gender: "L" },
    { nama: "Ade", gender: "P" },
    { nama: "Bima", gender: "L" },
    { nama: "Cindy", gender: "P" },
    { nama: "Dedi", gender: "L" },
    { nama: "Eva", gender: "P" },
    { nama: "Firman", gender: "L" },
    { nama: "Gina", gender: "P" },
    { nama: "Hendra", gender: "L" },
    { nama: "Intan", gender: "P" },
    { nama: "Joni", gender: "L" },
    { nama: "Karin", gender: "P" }
];

// DOM Elements
const jumlahKelompokSelect = document.getElementById('jumlah-kelompok');
const tipePembagianSelect = document.getElementById('tipe-pembagian');
const acakBtn = document.getElementById('acak-btn');
const resetBtn = document.getElementById('reset-btn');
const simpanBtn = document.getElementById('simpan-btn');
const progressText = document.getElementById('progress-text');
const kelompokContainer = document.getElementById('kelompok-container');
const siswaList = document.getElementById('siswa-list');
const animationModal = document.getElementById('animation-modal');
const randomAnimation = document.getElementById('random-animation');
const selectedResult = document.getElementById('selected-result');

// State
let kelompok = [];
let siswaTersisa = [];
let siswaTerpilih = [];
let isAnimating = false;
let animationInterval;
let currentGroupIndex = 0;

// Initialize
function init() {
    renderDaftarSiswa();
    loadFromLocalStorage();
}

// Render daftar siswa
function renderDaftarSiswa() {
    siswaList.innerHTML = '';
    siswa.forEach(siswa => {
        const siswaItem = document.createElement('div');
        siswaItem.className = 'siswa-item';
        siswaItem.innerHTML = `
            <span>${siswa.nama}</span>
            <span class="gender">${siswa.gender}</span>
        `;
        siswaList.appendChild(siswaItem);
    });
}

// Buat kelompok
function buatKelompok() {
    const jumlahKelompok = parseInt(jumlahKelompokSelect.value);
    kelompokContainer.innerHTML = '';
    kelompok = [];
    
    for (let i = 0; i < jumlahKelompok; i++) {
        const kelompokDiv = document.createElement('div');
        kelompokDiv.className = 'kelompok';
        kelompokDiv.innerHTML = `
            <div class="kelompok-header">Kelompok ${i + 1}</div>
            <ul class="kelompok-list" id="kelompok-${i}"></ul>
        `;
        kelompokContainer.appendChild(kelompokDiv);
        kelompok.push([]);
    }
    
    // Reset state
    siswaTersisa = [...siswa];
    siswaTerpilih = [];
    currentGroupIndex = 0;
    updateProgress();
    simpanBtn.disabled = true;
}

// Update progress indicator
function updateProgress() {
    const total = siswa.length;
    const terbagi = siswaTerpilih.length;
    progressText.textContent = `${terbagi} dari ${total} siswa sudah dibagi`;
    
    if (terbagi === total) {
        simpanBtn.disabled = false;
    }
}

// Acak siswa
function acakSiswa() {
    if (isAnimating) return;
    
    if (siswaTerpilih.length === siswa.length) {
        alert('Semua siswa sudah terbagi!');
        return;
    }
    
    const tipePembagian = tipePembagianSelect.value;
    
    // Filter siswa yang belum terpilih
    const siswaBelumTerpilih = siswa.filter(s => !siswaTerpilih.includes(s.nama));
    
    // Jika pisah gender, filter berdasarkan gender
    let siswaYangDiacak = [...siswaBelumTerpilih];
    if (tipePembagian === 'pisah-gender') {
        // Cari gender yang belum habis
        const lakiBelumTerpilih = siswaBelumTerpilih.filter(s => s.gender === 'L').length > 0;
        const perempuanBelumTerpilih = siswaBelumTerpilih.filter(s => s.gender === 'P').length > 0;
        
        if (lakiBelumTerpilih && perempuanBelumTerpilih) {
            // Ambil secara bergantian gender
            const lastGender = kelompok.flatMap(k => k[k.length - 1]?.gender).pop();
            const nextGender = lastGender === 'L' ? 'P' : 'L';
            siswaYangDiacak = siswaBelumTerpilih.filter(s => s.gender === nextGender);
        }
    }
    
    if (siswaYangDiacak.length === 0) {
        alert('Tidak ada siswa yang memenuhi kriteria pembagian!');
        return;
    }
    
    // Mulai animasi
    isAnimating = true;
    animationModal.style.display = 'flex';
    selectedResult.textContent = '';
    
    let counter = 0;
    const duration = 10000; // 10 detik
    const interval = 100; // 0.1 detik
    
    animationInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * siswaYangDiacak.length);
        const randomSiswa = siswaYangDiacak[randomIndex];
        randomAnimation.textContent = randomSiswa.nama;
        
        counter += interval;
        if (counter >= duration) {
            clearInterval(animationInterval);
            selesaiAcak(randomSiswa);
        }
    }, interval);
}

// Selesai acak
function selesaiAcak(siswa) {
    randomAnimation.textContent = '';
    selectedResult.textContent = `${siswa.nama} masuk ke Kelompok ${currentGroupIndex + 1}`;
    
    setTimeout(() => {
        // Tambahkan siswa ke kelompok
        kelompok[currentGroupIndex].push(siswa);
        siswaTerpilih.push(siswa.nama);
        
        // Update tampilan
        const kelompokList = document.getElementById(`kelompok-${currentGroupIndex}`);
        const li = document.createElement('li');
        li.textContent = `${siswa.nama} (${siswa.gender})`;
        kelompokList.appendChild(li);
        
        // Update group index (round robin)
        currentGroupIndex = (currentGroupIndex + 1) % parseInt(jumlahKelompokSelect.value);
        
        // Update progress
        updateProgress();
        
        // Tutup modal
        setTimeout(() => {
            animationModal.style.display = 'none';
            isAnimating = false;
        }, 3000);
    }, 100);
}

// Reset semua
function resetSemua() {
    if (isAnimating) {
        clearInterval(animationInterval);
        isAnimating = false;
    }
    
    animationModal.style.display = 'none';
    buatKelompok();
    localStorage.removeItem('kelompokData');
}

// Simpan hasil
function simpanHasil() {
    const data = {
        jumlahKelompok: jumlahKelompokSelect.value,
        tipePembagian: tipePembagianSelect.value,
        kelompok: kelompok,
        timestamp: new Date().toISOString()
    };
    
    // Simpan ke localStorage
    localStorage.setItem('kelompokData', JSON.stringify(data));
    
    // Buat file CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Header
    const headers = [];
    for (let i = 0; i < kelompok.length; i++) {
        headers.push(`Kelompok ${i + 1}`);
    }
    csvContent += headers.join(",") + "\r\n";
    
    // Data
    const maxRows = Math.max(...kelompok.map(k => k.length));
    for (let i = 0; i < maxRows; i++) {
        const row = [];
        for (let j = 0; j < kelompok.length; j++) {
            row.push(kelompok[j][i] ? `${kelompok[j][i].nama} (${kelompok[j][i].gender})` : '');
        }
        csvContent += row.join(",") + "\r\n";
    }
    
    // Download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pembagian_kelompok_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Load dari localStorage
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('kelompokData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        // Set dropdown
        jumlahKelompokSelect.value = data.jumlahKelompok;
        tipePembagianSelect.value = data.tipePembagian;
        
        // Buat kelompok
        buatKelompok();
        
        // Isi data
        kelompok = data.kelompok;
        siswaTerpilih = kelompok.flatMap(k => k.map(s => s.nama));
        
        // Update tampilan
        for (let i = 0; i < kelompok.length; i++) {
            const kelompokList = document.getElementById(`kelompok-${i}`);
            kelompokList.innerHTML = '';
            
            kelompok[i].forEach(siswa => {
                const li = document.createElement('li');
                li.textContent = `${siswa.nama} (${siswa.gender})`;
                kelompokList.appendChild(li);
            });
        }
        
        updateProgress();
        if (siswaTerpilih.length === siswa.length) {
            simpanBtn.disabled = false;
        }
    }
}

// Event Listeners
acakBtn.addEventListener('click', acakSiswa);
resetBtn.addEventListener('click', resetSemua);
simpanBtn.addEventListener('click', simpanHasil);
jumlahKelompokSelect.addEventListener('change', buatKelompok);

// Initialize
init();