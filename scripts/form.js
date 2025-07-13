
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("employeeForm");
  const cancelBtn = document.querySelector(".cancel-btn");

  const params = new URLSearchParams(window.location.search);
  // null if not editing
  const editIndex = params.get("edit"); 
  const employees = JSON.parse(localStorage.getItem("employees") || "[]");

  if (editIndex !== null && employees[editIndex]) {
    const emp = employees[editIndex];
    // Pre-fill form
    document.getElementById("firstName").value = emp.firstName;
    document.getElementById("lastName").value = emp.lastName;
    document.getElementById("email").value = emp.email;
    document.getElementById("department").value = emp.department;
    document.getElementById("role").value = emp.role;
  }


form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Clear all previous errors
  clearErrors();

  // Get input elements
  const firstNameEl = document.getElementById("firstName");
  const lastNameEl = document.getElementById("lastName");
  const emailEl = document.getElementById("email");
  const departmentEl = document.getElementById("department");
  const roleEl = document.getElementById("role");

  const newEmployee = {
    firstName: firstNameEl.value.trim(),
    lastName: lastNameEl.value.trim(),
    email: emailEl.value.trim(),
    department: departmentEl.value.trim(),
    role: roleEl.value.trim()
  };

  let hasError = false;

  // Validation
  if (!newEmployee.firstName) {
    showError(firstNameEl, "First name is required");
    hasError = true;
  }
  if (!newEmployee.lastName) {
    showError(lastNameEl, "Last name is required");
    hasError = true;
  }
  if (!newEmployee.email) {
    showError(emailEl, "Email is required");
    hasError = true;
  } else if (!validateEmail(newEmployee.email)) {
    showError(emailEl, "Invalid email format");
    hasError = true;
  }
  if (!newEmployee.department) {
    showError(departmentEl, "Select a department");
    hasError = true;
  }
  if (!newEmployee.role) {
    showError(roleEl, "Select a role");
    hasError = true;
  }

  if (hasError) return; // Stop if validation fails

  if (editIndex !== null && employees[editIndex]) {
    employees[editIndex] = newEmployee;
  } else {
    employees.push(newEmployee);
  }

  localStorage.setItem("employees", JSON.stringify(employees));
  alert(editIndex !== null ? "Employee updated!" : "Employee added!");
  isFormDirty = false;
  window.location.href = "index.html";
});


let isFormDirty = false;

form.addEventListener("input", () => {
  isFormDirty = true;
});

window.addEventListener("beforeunload", (e) => {
  if (isFormDirty) {
    e.preventDefault();
    e.returnValue = ""; // Modern browsers require this for the warning
  }
});


  cancelBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  function validateEmail(email) {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
  }

function showError(inputEl, message) {
  inputEl.classList.add("input-error");

  const errorEl = document.createElement("div");
  errorEl.className = "error-message";
  errorEl.textContent = message;
  inputEl.parentNode.appendChild(errorEl);
}

function clearErrors() {
  document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
  document.querySelectorAll(".error-message").forEach(el => el.remove());
}


});
