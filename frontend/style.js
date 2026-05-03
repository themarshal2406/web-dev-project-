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
    const videos = JSON.parse(localStorage.getItem("videos") || "[]");
    const newVideo = { id: Date.now(), title: title };
    videos.push(newVideo);
    localStorage.setItem("videos", JSON.stringify(videos));

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
  const data = JSON.parse(localStorage.getItem("videos") || "[]");

  const container = document.querySelector(".video-section");
  container.innerHTML = "";

  if (data.length === 0) {
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
}

// DELETE VIDEO
async function deleteVideo(id) {
  let videos = JSON.parse(localStorage.getItem("videos") || "[]");
  videos = videos.filter(v => v.id !== id);
  localStorage.setItem("videos", JSON.stringify(videos));

  loadVideos();
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