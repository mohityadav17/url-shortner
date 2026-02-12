// ===== SHORTEN URL =====
async function shortenUrl() {
  const longUrl = document.getElementById('longUrl').value.trim();
  const loader = document.getElementById('loader');
  const errorMsg = document.getElementById('errorMsg');
  const resultBox = document.getElementById('result');

  errorMsg.innerText = "";

  if (!longUrl || !longUrl.startsWith("http")) {
    errorMsg.innerText = "Enter a valid URL starting with http or https";
    return;
  }

  loader.style.display = "block";

  try {
    const response = await fetch('/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: longUrl })
    });

    if (!response.ok) {
      throw new Error("API failed");
    }

    const data = await response.json();

    loader.style.display = "none";

    resultBox.innerHTML = `
      <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>
    `;

    // generate QR
    generateQR(data.shortUrl);

    // reload history
    loadHistory();

  } catch (err) {
    loader.style.display = "none";
    errorMsg.innerText = "Server error. Try again.";
    console.error(err);
  }
}

// ===== COPY SHORT LINK =====
function copyLink() {
  const link = document.getElementById('result').innerText;
  navigator.clipboard.writeText(link);
  alert("Copied to clipboard!");
}

// ===== DARK MODE =====
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// ===== LOAD HISTORY =====
async function loadHistory() {
  try {
    const response = await fetch('/history');
    const data = await response.json();

    const list = document.getElementById('historyList');
    if (!list) return;

    list.innerHTML = "";

    data.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <a href="http://localhost:5000/${item.shortCode}" target="_blank">
          http://localhost:5000/${item.shortCode}
        </a>
        <br/>
        <small>Clicks: ${item.clicks}</small>
      `;
      list.appendChild(li);
    });

  } catch (err) {
    console.log("History load error");
  }
}

// ===== GENERATE QR CODE =====
function generateQR(url) {
  const qrBox = document.getElementById("qrBox");
  if (!qrBox) return;

  qrBox.innerHTML = "";

  QRCode.toCanvas(url, { width: 160 }, function (error, canvas) {
    if (error) console.error(error);
    qrBox.appendChild(canvas);
  });
}

// ===== LOAD HISTORY ON PAGE START =====
window.onload = loadHistory;
