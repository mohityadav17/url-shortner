async function shortenUrl() {
  const longUrl = document.getElementById('longUrl').value;
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

    const data = await response.json();

    loader.style.display = "none";

    resultBox.innerHTML = `
      <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>
    `;
    generateQR(data.shortUrl);

    // reload history after new link
    loadHistory();

  } catch (err) {
    loader.style.display = "none";
    errorMsg.innerText = "Server error. Try again.";
  }
}

// copy short link
function copyLink() {
  const link = document.getElementById('result').innerText;
  navigator.clipboard.writeText(link);
  alert("Copied to clipboard!");
}

// dark mode
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// ===== LOAD HISTORY FROM DATABASE =====
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
function generateQR(url) {
  const qrBox = document.getElementById("qrBox");
  qrBox.innerHTML = ""; // clear old QR

  QRCode.toCanvas(url, { width: 160 }, function (error, canvas) {
    if (error) console.error(error);
    qrBox.appendChild(canvas);
  });
}

// load history when page opens
window.onload = loadHistory;
