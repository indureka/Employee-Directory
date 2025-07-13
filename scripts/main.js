// 1. Mock data setup (runs only once)
if (!localStorage.getItem("employees")) {
  const mockData = [
    {
      firstName: "Alice",
      lastName: "Smith",
      email: "alice@example.com",
      department: "HR",
      role: "Manager",
    },
    {
      firstName: "Bob",
      lastName: "Johnson",
      email: "bob@example.com",
      department: "IT",
      role: "Developer",
    },
    {
      firstName: "Charlie",
      lastName: "Lee",
      email: "charlie@example.com",
      department: "Finance",
      role: "Analyst",
    },
  ];
  localStorage.setItem("employees", JSON.stringify(mockData));
}

// 2. DOM operations after page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  let employees = JSON.parse(localStorage.getItem("employees") || "[]");
  let filteredEmployees = [...employees];
  let currentPage = 1;
  let perPage = 10;

  // DOM elements
  const employeeList = document.getElementById("employeeList");
  const searchInput = document.querySelector(".search-input");
  const paginationSelect = document.getElementById("show-count");
  const filterForm = document.getElementById("filterForm");
  const sortSelect = document.getElementById("sort");
  const paginationControls = document.getElementById("paginationControls");
  const filterPanel = document.getElementById("filterPanel");
const filterBtn = document.querySelector(".filter-btn");
const closeBtn = document.getElementById("closeFilter");


// filter button toggles sidebar visibility


filterBtn.addEventListener("click", () => {
  filterPanel.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
  filterPanel.classList.add("hidden");
});


  // Render employee cards
  function renderEmployees() {
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const employeesToShow = filteredEmployees.slice(start, end);

    employeeList.innerHTML = "";

    if (employeesToShow.length === 0) {
      employeeList.innerHTML = "<p>No matching employees found.</p>";
      return;
    }

    employeesToShow.forEach((emp, index) => {
      const card = document.createElement("div");
      card.className = "employee-card";
      card.innerHTML = `
       <p><strong>${emp.firstName} ${emp.lastName}</strong></p>
    <p><strong>Email:</strong> ${emp.email}</p>
    <p><strong>Department:</strong> ${emp.department}</p>
    <p><strong>Role:</strong> ${emp.role}</p>
    <div class="card-actions">
       <button class="edit-btn" data-index="${start + index}">Edit</button>
    <button class="delete-btn" data-index="${start + index}">Delete</button>
    </div>
      `;
      employeeList.appendChild(card);
    });

    // 🔽 Attach Edit button listener
document.querySelectorAll(".edit-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const index = e.target.getAttribute("data-index");
    window.location.href = `form.html?edit=${index}`;
  });
});


// 🔽 Attach Delete button listener
document.querySelectorAll(".delete-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const index = e.target.getAttribute("data-index");
    if (confirm("Are you sure you want to delete this employee?")) {
      employees.splice(index, 1);
      localStorage.setItem("employees", JSON.stringify(employees));
      filteredEmployees = [...employees]; // update filtered list
      renderEmployees(); // re-render UI
    }
  });
});


    renderPaginationControls();
  }

  // Pagination Controls
  function renderPaginationControls() {
    const totalPages = Math.ceil(filteredEmployees.length / perPage);
    paginationControls.innerHTML = "";

    if (totalPages <= 1) return;

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Previous";
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
      currentPage--;
      renderEmployees();
    };

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
      currentPage++;
      renderEmployees();
    };

    paginationControls.appendChild(prevBtn);
    paginationControls.appendChild(
      document.createTextNode(` Page ${currentPage} of ${totalPages} `)
    );
    paginationControls.appendChild(nextBtn);
  }

  // Filter form submit
  filterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const fname = document.getElementById("filterFirstName").value.toLowerCase().trim();
    const dept = document.getElementById("filterDepartment").value.toLowerCase().trim();
    const role = document.getElementById("filterRole").value.toLowerCase().trim();

    filteredEmployees = employees.filter((emp) => {
        const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      return (
          (!fname || fullName.includes(fname)) &&
      (!dept || emp.department.toLowerCase().includes(dept)) &&
      (!role || emp.role.toLowerCase().includes(role))
      );
    });

    currentPage = 1;
    renderEmployees();
  });

  // Reset Filter
  document.querySelector(".reset-btn").addEventListener("click", () => {
    document.getElementById("filterFirstName").value = "";
    document.getElementById("filterDepartment").value = "";
    document.getElementById("filterRole").value = "";

    filteredEmployees = [...employees];
    currentPage = 1;
    renderEmployees();
  });

  // Search Logic
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    filteredEmployees = employees.filter((emp) => {
      return (
        emp.firstName.toLowerCase().includes(query) ||
        emp.lastName.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query)
      );
    });
    currentPage = 1;
    renderEmployees();
  });

  // Sort Logic
  sortSelect.addEventListener("change", () => {
    const value = sortSelect.value;

    filteredEmployees.sort((a, b) => {
      if (value === "firstName") {
        return a.firstName.localeCompare(b.firstName);
      } else if (value === "department") {
        return a.department.localeCompare(b.department);
      }
      return 0;
    });

    currentPage = 1;
    renderEmployees();
  });

  // Items per page logic
  paginationSelect.addEventListener("change", () => {
    perPage = parseInt(paginationSelect.value, 10);
    currentPage = 1;
    renderEmployees();
  });

  // Initial render
  renderEmployees();
});


