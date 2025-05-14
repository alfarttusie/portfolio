class GitHubProjectsLoader {
  constructor({
    username,
    email,
    projectsContainerId,
    contactContainerId,
    customProjects = [],
    menuListId,
  }) {
    this.username = username;
    this.email = email;
    this.projectsContainer = document.getElementById(projectsContainerId);
    this.contactContainer = document.getElementById(contactContainerId);
    this.loaderElement = document.getElementById("loader");
    this.customProjects = customProjects;
    this.menuListElement = document.getElementById(menuListId);
  }

  async load() {
    this.renderContact();
    this.showLoader();
    await this.loadProjects();
    this.hideLoader();
  }

  async loadProjects() {
    try {
      const response = await fetch(
        `https://api.github.com/users/${this.username}/repos`
      );
      const repos = await response.json();

      if (!Array.isArray(repos) || repos.length === 0 || repos.message) {
        this.projectsContainer.innerHTML = `<p style="color: #e74c3c;">No repositories found or rate limit exceeded.</p>`;
      } else {
        this.renderProjects(repos);
        this.renderMenuLinks(repos, "GitHub");
      }
    } catch (error) {
      console.error("Error fetching repos:", error);
      this.projectsContainer.innerHTML = `<p style="color: #e74c3c;">Error loading projects.</p>`;
    } finally {
      this.renderCustomProjects();
      this.renderMenuLinks(this.customProjects, "Custom");
    }
  }

  renderProjects(repos) {
    repos.forEach((repo) => {
      const projectDiv = document.createElement("div");
      projectDiv.classList.add("project");

      projectDiv.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || "No description available."}</p>
        <p style="font-size: 0.85rem; color: #aaa;">🌐 GitHub</p>
        <a href="${repo.html_url}" target="_blank">View Project</a>
      `;

      this.projectsContainer.appendChild(projectDiv);
    });
  }

  renderCustomProjects() {
    this.customProjects.forEach((project) => {
      const projectDiv = document.createElement("div");
      projectDiv.classList.add("project");

      projectDiv.innerHTML = `
        <h3>${project.name}</h3>
        <p>${project.description || "No description."}</p>
        <p style="font-size: 0.85rem; color: #aaa;">🌐 ${project.platform}</p>
        <a href="${project.url}" target="_blank">View Project</a>
      `;

      this.projectsContainer.appendChild(projectDiv);
    });
  }

  renderMenuLinks(projects, type) {
    if (!this.menuListElement) return;

    projects.forEach((project) => {
      const li = document.createElement("li");
      const a = document.createElement("a");

      a.textContent = project.name;
      a.href = type === "GitHub" ? project.html_url : project.url;
      a.target = "_blank";

      li.appendChild(a);
      this.menuListElement.appendChild(li);
    });
  }

  renderContact() {
    if (!this.contactContainer) return;
    this.contactContainer.innerHTML = `
      <br>
      <h2>Contact</h2>
      <p>
        Feel free to reach out via email at 
        <a href="mailto:${this.email}">${this.email}</a>
      </p>
    `;
  }

  showLoader() {
    if (this.loaderElement) this.loaderElement.style.display = "block";
  }

  hideLoader() {
    if (this.loaderElement) this.loaderElement.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loader = new GitHubProjectsLoader({
    username: "alfarttusie",
    email: "muhammed@alfarttusie.com",
    projectsContainerId: "github-projects",
    contactContainerId: "contact",
    menuListId: "projects-menu",
    customProjects: [
      {
        name: "CSS Animation – Nvidia-Notification",
        description: "js & css & html Nvidia-Notification",
        url: "https://codepen.io/alfarttusie/pen/vYMWBdP",
        platform: "CodePen",
      },
    ],
  });

  loader.load();
});
