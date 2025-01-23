document.addEventListener("DOMContentLoaded", () => {
  const username = "alfarttusie";
  const projectsContainer = document.getElementById("github-projects");

  fetch(`https://api.github.com/users/${username}/repos`)
    .then((response) => response.json())
    .then((repos) => {
      repos.forEach((repo) => {
        const projectDiv = document.createElement("div");
        projectDiv.classList.add("project");

        projectDiv.innerHTML = `
            <h3>${repo.name}</h3>
            <p>${repo.description || "No description available."}</p>
            <a href="${repo.html_url}" target="_blank">View Project</a>
          `;

        projectsContainer.appendChild(projectDiv);
      });
    })
    .catch((error) => console.error("Error fetching repos:", error));
});
