function openModal() {
  document.getElementById("addVideoModal").style.display = "block";
}

function closeModal() {
  document.getElementById("addVideoModal").style.display = "none";
}

const API_URL = "http://127.0.0.1:5001/products";

// ADD VIDEO
async function submitVideo() {
  const title = document.getElementById("title").value.trim();

  if (!title) {
    alert("Enter title");
    return;
  }

  try {
    console.log("Sending POST request to:", API_URL);
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: title })
    });

    const data = await res.json();
    console.log("POST response:", data);

    if (!res.ok) {
      console.error("Server error:", data);
      alert("Server error: " + (data.error || "Failed to add video"));
      return;
    }

    alert("Video added!");
    document.getElementById("title").value = ""; // Clear input
    closeModal();
    loadVideos();

  } catch (err) {
    console.error("Fetch error during POST:", err);
    alert("Failed to add video. Check console for details.");
  }
}

// LOAD VIDEOS
async function loadVideos() {
  try {
    console.log("Fetching videos from:", API_URL);
    const res = await fetch(API_URL);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    console.log("GET response:", data);

    const container = document.querySelector(".video-section");
    container.innerHTML = "";

    if (!data || data.length === 0) {
      container.innerHTML = "<h3>No videos yet 🎬</h3>";
      return;
    }

    data.forEach(video => {
      const thumbnail = "./images/default-thumbnail.png";

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
  } catch (err) {
    console.error("Fetch error during GET:", err);
    const container = document.querySelector(".video-section");
    container.innerHTML = "<h3>Failed to load videos. Is the backend running? 🔌</h3>";
  }
}

// DELETE VIDEO
async function deleteVideo(id) {
  try {
    console.log(`Sending DELETE request for video ${id}`);
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      const data = await res.json();
      console.error("Server error:", data);
      alert("Failed to delete video");
      return;
    }

    console.log("Delete successful");
    loadVideos();
  } catch (err) {
    console.error("Fetch error during DELETE:", err);
    alert("Failed to delete video. Check console for details.");
  }
}

// SEARCH
document.getElementById("searchForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const query = document.querySelector(".search-input").value.toLowerCase();
  const videos = document.querySelectorAll(".video-card, .video-container");

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