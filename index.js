document.addEventListener("DOMContentLoaded", loadAssignments);

const assignmentForm = document.getElementById("assignmentForm");
const assignmentList = document.getElementById("assignmentList");

// Load from local storage
function loadAssignments() {
    let assignments = JSON.parse(localStorage.getItem("assignments")) || [];
    assignments.forEach(addAssignmentToDOM);
}

// Save to local storage
function saveAssignment(assignment) {
    let assignments = JSON.parse(localStorage.getItem("assignments")) || [];
    assignments.push(assignment);
    localStorage.setItem("assignments", JSON.stringify(assignments));
}

// Add assignment to DOM
function addAssignmentToDOM(assignment) {
    const li = document.createElement("li");

    li.innerHTML = `
        <div>
            <strong>${assignment.title}</strong><br>
            Due: ${assignment.dueDate} | Assigned To: ${assignment.assignedTo}
        </div>
        <div>
            <span class="status ${assignment.status}">${assignment.status}</span>
            <button class="complete-btn">✅</button>
        </div>
    `;

    // Mark complete button
    li.querySelector(".complete-btn").addEventListener("click", function() {
        assignment.status = "completed";
        updateLocalStorage();
        refreshList();
    });

    assignmentList.appendChild(li);
}

// Update storage after changes
function updateLocalStorage() {
    const items = [];
    assignmentList.querySelectorAll("li").forEach(li => {
        let [titleLine, details] = li.firstElementChild.innerHTML.split("<br>");
        let title = titleLine.replace("<strong>", "").replace("</strong>", "");
        let dueDate = details.split("|")[0].replace("Due:", "").trim();
        let assignedTo = details.split("|")[1].replace("Assigned To:", "").trim();
        let status = li.querySelector(".status").classList.contains("completed") ? "completed" : "pending";

        items.push({ title, dueDate, assignedTo, status });
    });
    localStorage.setItem("assignments", JSON.stringify(items));
}

// Refresh list
function refreshList() {
    assignmentList.innerHTML = "";
    loadAssignments();
}

// Handle form submission
assignmentForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const dueDate = document.getElementById("dueDate").value;
    const assignedTo = document.getElementById("assignedTo").value;

    const assignment = {
        title,
        dueDate,
        assignedTo,
        status: "pending"
    };

    saveAssignment(assignment);
    addAssignmentToDOM(assignment);

    assignmentForm.reset();
});
