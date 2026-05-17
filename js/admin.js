/**
 * Admin Dashboard Functionality
 * Uses localStorage to persist mock state
 */

const STORAGE_KEY = 'internship_applications';
const INTERNSHIPS_KEY = 'internships_list';

// Initial Mock Data
const initialApplications = [
    { id: 'app-1', name: 'Rahul Sharma', roll: 'CS2023012', profile: 'Software Engineering Intern', company: 'TCS', date: 'Oct 24, 2023', status: 'Pending' },
    { id: 'app-2', name: 'Priya Singh', roll: 'CS2023055', profile: 'UI/UX Design Intern', company: 'Wipro', date: 'Oct 23, 2023', status: 'Approved' },
    { id: 'app-3', name: 'Koushik Mahanta', roll: 'CS2023045', profile: 'Frontend Developer Intern', company: 'Infosys', date: 'Oct 22, 2023', status: 'Pending' },
    { id: 'app-4', name: 'Amit Kumar', roll: 'EC2023089', profile: 'Hardware Intern', company: 'Intel', date: 'Oct 20, 2023', status: 'Rejected' },
    { id: 'app-5', name: 'Neha Gupta', roll: 'CS2023021', profile: 'Data Analyst Intern', company: 'Accenture', date: 'Oct 19, 2023', status: 'Pending' }
];

const initialInternships = [
    { id: 'int-1', role: 'Frontend Developer Intern', company: 'Infosys', location: 'Bangalore', duration: '6 Months', stipend: '20k/mo', description: 'Looking for a passionate frontend developer intern with knowledge of React and modern CSS.', icon: 'fa-code', color: 'bg-primary', deadline: '25 May 2026' },
    { id: 'int-2', role: 'Backend Engineering Intern', company: 'TCS', location: 'Pune', duration: '6 Months', stipend: '15k/mo', description: 'Join our backend team to build scalable microservices using Java Spring Boot.', icon: 'fa-server', color: 'bg-blue', deadline: '30 May 2026' },
    { id: 'int-3', role: 'UI/UX Design Intern', company: 'Wipro', location: 'Bangalore', duration: '3 Months', stipend: '12k/mo', description: 'Assist in user research, wireframing, and prototyping for our upcoming mobile application.', icon: 'fa-pen-nib', color: 'bg-green', deadline: '20 May 2026' },
    { id: 'int-4', role: 'Data Analyst Intern', company: 'Accenture', location: 'Remote', duration: '4 Months', stipend: '18k/mo', description: 'Analyze large datasets and build dashboards using Python and Tableau.', icon: 'fa-chart-pie', color: 'bg-warning', deadline: '15 May 2026' },
    { id: 'int-5', role: 'Hardware Intern', company: 'Intel', location: 'Hyderabad', duration: '6 Months', stipend: '25k/mo', description: 'Work on semiconductor testing and quality assurance.', icon: 'fa-microchip', color: 'bg-purple', deadline: '10 May 2026' }
];

let applications = [];
let internships = [];
let currentReviewId = null;

document.addEventListener('DOMContentLoaded', () => {
    // Only run if we're on the admin page
    if (!document.getElementById('applications-table-body')) return;

    // Load Applications
    const storedApps = localStorage.getItem(STORAGE_KEY);
    if (storedApps) {
        applications = JSON.parse(storedApps);
    } else {
        applications = [...initialApplications];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    }

    // Load Internships
    const storedInts = localStorage.getItem(INTERNSHIPS_KEY);
    if (storedInts) {
        internships = JSON.parse(storedInts);
    } else {
        internships = [...initialInternships];
        localStorage.setItem(INTERNSHIPS_KEY, JSON.stringify(internships));
    }

    renderDashboard();
    initReviewModal();
    initPostInternshipModal();
});

function renderDashboard() {
    renderStats();
    renderTable();
}

function renderStats() {
    const pendingCount = applications.filter(a => a.status === 'Pending').length;
    
    // Some stats are static for the demo, pending and internships are dynamic
    document.getElementById('stat-students').innerText = '1,254';
    document.getElementById('stat-internships').innerText = internships.length;
    document.getElementById('stat-pending').innerText = pendingCount;
    document.getElementById('stat-companies').innerText = '32';
}

function renderTable() {
    const tbody = document.getElementById('applications-table-body');
    tbody.innerHTML = '';

    if (applications.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No applications found.</td></tr>';
        return;
    }

    applications.forEach(app => {
        let statusBadgeClass = '';
        let statusText = '';
        
        if (app.status === 'Pending') {
            statusBadgeClass = 'status-pending';
            statusText = 'Pending Review';
        } else if (app.status === 'Approved') {
            statusBadgeClass = 'status-approved';
            statusText = 'Approved & Forwarded';
        } else if (app.status === 'Rejected') {
            statusBadgeClass = 'status-rejected';
            statusText = 'Rejected';
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${app.name}</strong></td>
            <td>${app.roll}</td>
            <td>${app.profile}</td>
            <td>${app.company}</td>
            <td>${app.date}</td>
            <td><span class="status-badge ${statusBadgeClass}">${statusText}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="openReviewModal('${app.id}')">
                    ${app.status === 'Pending' ? 'Review' : 'Details'}
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Review Modal Logic
function initReviewModal() {
    const modal = document.getElementById('review-modal');
    const closeBtn = document.getElementById('close-review-btn');
    const saveBtn = document.getElementById('save-review-btn');

    if (!modal) return;

    const closeModal = () => {
        modal.classList.add('hidden');
        currentReviewId = null;
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    saveBtn.addEventListener('click', () => {
        if (!currentReviewId) return;
        
        const newStatus = document.getElementById('review-status').value;
        const appIndex = applications.findIndex(a => a.id === currentReviewId);
        
        if (appIndex !== -1) {
            applications[appIndex].status = newStatus;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
            renderDashboard();
            closeModal();
            showToast('Application status updated successfully!');
        }
    });
}

// Global function to open modal
window.openReviewModal = function(appId) {
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    currentReviewId = app.id;
    
    document.getElementById('review-name').innerText = app.name + ' (' + app.roll + ')';
    document.getElementById('review-internship').innerText = app.profile;
    document.getElementById('review-company').innerText = app.company;
    document.getElementById('review-status').value = app.status;

    document.getElementById('review-modal').classList.remove('hidden');
};

// Post Internship Modal Logic
function initPostInternshipModal() {
    const openBtn = document.getElementById('post-internship-btn');
    const modal = document.getElementById('post-internship-modal');
    const closeBtn = document.getElementById('close-post-btn');
    const form = document.getElementById('post-internship-form');

    if (!openBtn || !modal) return;

    const closeModal = () => modal.classList.add('hidden');

    openBtn.addEventListener('click', () => {
        form.reset();
        modal.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newInternship = {
            id: 'int-' + Date.now(),
            role: document.getElementById('post-role').value,
            company: document.getElementById('post-company').value,
            location: document.getElementById('post-location').value,
            stipend: document.getElementById('post-stipend').value,
            duration: document.getElementById('post-duration').value,
            description: 'New internship posting. Requires skills: ' + document.getElementById('post-tags').value,
            icon: 'fa-briefcase',
            color: 'bg-primary',
            deadline: 'TBD'
        };

        internships.unshift(newInternship); // Add to beginning of array
        localStorage.setItem(INTERNSHIPS_KEY, JSON.stringify(internships));
        
        renderDashboard();
        closeModal();
        showToast('New internship posted successfully!');
    });
}

function showToast(message) {
    const notification = document.createElement('div');
    notification.innerText = message;
    notification.style.cssText = 'position:fixed; bottom:20px; right:20px; background:var(--primary-color); color:white; padding:10px 20px; border-radius:5px; z-index:1000; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
