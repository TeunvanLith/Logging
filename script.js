document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form")
  const regNameInput = document.getElementById("reg-name")
  const regCompanyInput = document.getElementById("reg-company")
  const regPinInput = document.getElementById("reg-pin")
  const loginScreen = document.getElementById("login-screen")
  const loginForm = document.getElementById("login-form")
  const loginNameInput = document.getElementById("login-name")
  const loginPinInput = document.getElementById("login-pin")
  const logbookScreen = document.getElementById("logbook-screen")
  const userNameHeader = document.getElementById("user-name")
  const projectList = document.getElementById("project-list")
  const projectDropdown = document.getElementById("log-project")
  const editProjectDropdown = document.getElementById("edit-project")
  const filterProjectDropdown = document.getElementById("filter-project")
  const projectForm = document.getElementById("project-form")
  const projectNameInput = document.getElementById("project-name")
  const logHoursForm = document.getElementById("log-hours-form")
  const editModal = document.getElementById("edit-modal")
  const editLogForm = document.getElementById("edit-log-form")
  const editDateInput = document.getElementById("edit-date")
  const editHoursInput = document.getElementById("edit-hours")
  const editRemarksInput = document.getElementById("edit-remarks")
  const logoutButton = document.getElementById("logout-button")
  const cancelEditButton = document.getElementById("cancel-edit")
  const closeModalButton = document.getElementById("close-modal")
  const registrationScreen = document.getElementById("registration-screen")
  const toggleSortButton = document.getElementById("toggle-sort")

  let sortAscending = false
  let currentUser = null
  let editingLogId = null

  const API_URL = "http://localhost:5000/api" // Update this with your actual API URL

  // Helper functions for API calls
  async function apiCall(endpoint, method = "GET", data = null) {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    }
    if (data) {
      options.body = JSON.stringify(data)
    }
    const response = await fetch(`${API_URL}${endpoint}`, options)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  }

  // Registration
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const name = regNameInput.value.trim()
    const company = regCompanyInput.value.trim()
    const pin = regPinInput.value.trim()
    if (!name || !company || !pin) {
      return alert("Alle velden zijn verplicht.")
    }
    if (name.indexOf(" ") !== -1) {
      return alert("De naam mag geen spaties bevatten.")
    }
    try {
      await apiCall("/users/register", "POST", { name, company, pin })
      alert("Registratie succesvol! Gebruik jouw naam om in te loggen.")
      registerForm.reset()
      showScreen(loginScreen)
      loginNameInput.value = name
    } catch (error) {
      alert("Registratie mislukt. Probeer een andere naam.")
    }
  })

  // Login
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const name = loginNameInput.value.trim()
    const pin = loginPinInput.value.trim()
    try {
      const user = await apiCall("/users/login", "POST", { name, pin })
      currentUser = user
      loginForm.reset()
      loadLogbook()
      showScreen(logbookScreen)
    } catch (error) {
      alert("Onjuiste naam of pincode.")
    }
  })

  // Load logbook
  async function loadLogbook() {
    if (!currentUser) return
    userNameHeader.textContent = "Welkom, " + currentUser.name
    await refreshProjects()
    await refreshLogs()
  }

  // Projects
  async function refreshProjects() {
    try {
      const projects = await apiCall(`/projects/${currentUser.userId}`)
      renderProjects(projects)
      refreshProjectDropdowns(projects)
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }

  function renderProjects(projects) {
    projectList.innerHTML = ""
    if (projects.length === 0) {
      projectList.innerHTML = "<p class='text-gray-200'>Nog geen projecten.</p>"
      return
    }
    projects.forEach((proj) => {
      const div = document.createElement("div")
      div.className = "bg-gray-50 text-gray-800 p-2 rounded flex items-center gap-2"
      div.style.whiteSpace = "nowrap"
      div.textContent = proj.name
      const deleteBtn = document.createElement("button")
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>'
      deleteBtn.className = "text-red-500 hover:text-red-700"
      deleteBtn.title = "Project verwijderen"
      deleteBtn.addEventListener("click", () => deleteProject(proj._id))
      div.appendChild(deleteBtn)
      projectList.appendChild(div)
    })
  }

  async function deleteProject(projectId) {
    if (confirm("Weet u zeker dat u dit project wilt verwijderen?")) {
      try {
        await apiCall(`/projects/${projectId}`, "DELETE")
        refreshProjects()
      } catch (error) {
        alert("Fout bij het verwijderen van het project.")
      }
    }
  }

  function refreshProjectDropdowns(projects) {
    ;[projectDropdown, editProjectDropdown, filterProjectDropdown].forEach((dropdown) => {
      dropdown.innerHTML = dropdown === filterProjectDropdown ? "<option value='all'>Alle projecten</option>" : ""
      projects.forEach((proj) => {
        const option = document.createElement("option")
        option.value = proj._id
        option.textContent = proj.name
        dropdown.appendChild(option)
      })
    })
  }

  // Add project
  projectForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const projectName = projectNameInput.value.trim()
    if (!projectName) return alert("Voer een projectnaam in.")
    try {
      await apiCall("/projects", "POST", { name: projectName, userId: currentUser.userId })
      projectNameInput.value = ""
      refreshProjects()
    } catch (error) {
      alert("Fout bij het toevoegen van het project.")
    }
  })

  // Logs
  async function refreshLogs() {
    try {
      const logs = await apiCall(`/logs/${currentUser.userId}`)
      renderLogs(logs)
    } catch (error) {
      console.error("Error fetching logs:", error)
    }
  }

  function renderLogs(logs) {
    let filteredLogs = logs
    const selectedProject = filterProjectDropdown.value
    if (selectedProject !== "all") {
      filteredLogs = logs.filter((log) => log.projectId._id === selectedProject)
    }
    filteredLogs.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return sortAscending ? dateA - dateB : dateB - dateA
    })
    renderLogsTable(filteredLogs)
  }

  function renderLogsTable(logs) {
    const logTableBody = document.getElementById("log-table-body")
    logTableBody.innerHTML = ""
    if (logs.length === 0) {
      logTableBody.innerHTML = "<tr><td colspan='5' class='text-gray-200'>Nog geen logs.</td></tr>"
      return
    }
    logs.forEach((log) => {
      const tr = document.createElement("tr")
      tr.innerHTML = `
        <td class="p-2">${log.date.split("T")[0]}</td>
        <td class="p-2">${log.hours}</td>
        <td class="p-2">${log.projectId.name}</td>
        <td class="p-2">${log.remarks || ""}</td>
        <td class="p-2">
          <button class="edit-btn text-blue-500 hover:text-blue-700" data-id="${log._id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="delete-btn text-red-500 hover:text-red-700" data-id="${log._id}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `
      logTableBody.appendChild(tr)
    })
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        editingLogId = this.getAttribute("data-id")
        openEditModal(editingLogId)
      })
    })
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const logId = this.getAttribute("data-id")
        if (confirm("Weet u zeker dat u deze log wilt verwijderen?")) {
          deleteLog(logId)
        }
      })
    })
  }

  // Add log
  logHoursForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const date = document.getElementById("log-date").value
    const hours = document.getElementById("log-hours").value
    const projectId = document.getElementById("log-project").value
    const remarks = document.getElementById("log-remarks").value
    if (!date || !hours || !projectId) {
      return alert("Datum, aantal uur en project zijn verplicht.")
    }
    try {
      await apiCall("/logs", "POST", {
        date,
        hours,
        projectId,
        userId: currentUser.userId,
        remarks,
      })
      logHoursForm.reset()
      refreshLogs()
    } catch (error) {
      alert("Fout bij het toevoegen van de log.")
    }
  })

  // Edit log
  async function openEditModal(logId) {
    try {
      const log = await apiCall(`/logs/${logId}`)
      editDateInput.value = log.date.split("T")[0]
      editHoursInput.value = log.hours
      editRemarksInput.value = log.remarks
      editProjectDropdown.value = log.projectId._id
      editModal.classList.remove("hidden")
    } catch (error) {
      console.error("Error fetching log details:", error)
    }
  }

  editLogForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const date = editDateInput.value
    const hours = editHoursInput.value
    const projectId = editProjectDropdown.value
    const remarks = editRemarksInput.value
    if (!date || !hours || !projectId) {
      return alert("Datum, aantal uur en project zijn verplicht.")
    }
    try {
      await apiCall(`/logs/${editingLogId}`, "PUT", {
        date,
        hours,
        projectId,
        remarks,
      })
      refreshLogs()
      closeEditModal()
    } catch (error) {
      alert("Fout bij het bewerken van de log.")
    }
  })

  async function deleteLog(logId) {
    try {
      await apiCall(`/logs/${logId}`, "DELETE")
      refreshLogs()
    } catch (error) {
      alert("Fout bij het verwijderen van de log.")
    }
  }

  // Filter and sort
  filterProjectDropdown.addEventListener("change", refreshLogs)
  toggleSortButton.addEventListener("click", () => {
    sortAscending = !sortAscending
    toggleSortButton.textContent = sortAscending ? "Oplopend" : "Aflopend"
    refreshLogs()
  })

  // Navigation and UI
  logoutButton.addEventListener("click", () => {
    currentUser = null
    showScreen(loginScreen)
  })

  cancelEditButton.addEventListener("click", closeEditModal)
  closeModalButton.addEventListener("click", closeEditModal)

  function closeEditModal() {
    editModal.classList.add("hidden")
    editingLogId = null
  }

  function showScreen(screen) {
    loginScreen.classList.add("hidden")
    registrationScreen.classList.add("hidden")
    logbookScreen.classList.add("hidden")
    screen.classList.remove("hidden")
  }

  // Start with login screen
  showScreen(loginScreen)
})

