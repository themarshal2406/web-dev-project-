function openModal() {
  document.getElementById("addVideoModal").style.display = "block";
}

function closeModal() {
  document.getElementById("addVideoModal").style.display = "none";
}

// ADD VIDEO
async function submitVideo() {
  const title = document.getElementById("title").value.trim();

  if (!title) {
    alert("Enter title");
    return;
  }

  try {
    const res = await fetch("http://localhost:5001/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title })
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Server error");
      return;
    }

    alert("Video added!");
    closeModal();
    loadVideos();

  } catch (err) {
    console.error(err);
    alert("Failed to add video");
  }
}

// LOAD VIDEOS
async function loadVideos() {
  const res = await fetch("http://localhost:5001/products");
  const data = await res.json();

  const container = document.querySelector(".video-section");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<h3>No videos yet 🎬</h3>";
    return;
  }

  data.forEach(video => {
    const thumbnail = `https://picsum.photos/seed/${encodeURIComponent(video.title)}/300/180`;

    container.innerHTML += `
      <div class="video-card">
        <img src="${thumbnail}" class="thumbnail" />

        <div class="video-info">
          <h4 class="video-title">${video.title}</h4>
          <p class="video-meta">Channel • 1K views • 1 day ago</p>
        </div>

        <button class="delete-btn" onclick="deleteVideo(${video.id})">Delete</button>
      </div>
    `;
  });
}

// DELETE VIDEO
async function deleteVideo(id) {
  await fetch(`http://localhost:5001/products/${id}`, {
    method: "DELETE"
  });

  loadVideos();
}

// SEARCH
document.getElementById("searchForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const query = document.querySelector(".search-input").value.toLowerCase();
  const videos = document.querySelectorAll(".video-container");

  videos.forEach(video => {
    const text = video.innerText.toLowerCase();

    if (text.includes(query)) {
      video.style.display = "block";
    } else {
      video.style.display = "none";
    }
  });
});

// LOAD on start
loadVideos();