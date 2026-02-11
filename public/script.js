async function shortenUrl() {
  const longUrl = document.getElementById('longUrl').value;

  if (!longUrl) {
    alert("Please enter a URL");
    return;
  }

  try {
    const response = await fetch('/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: longUrl })
    });

    const data = await response.text();

    document.getElementById('result').innerText = data;

  } catch (error) {
    console.error(error);
    alert("Error connecting to server");
  }
}
