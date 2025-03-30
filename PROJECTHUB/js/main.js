// Student Attendance Management System - Main JavaScript

// Mock data for students
let students = [
    { id: 1, name: "Emma Thompson", section: "10-A", status: "present", time: "08:30" },
    { id: 2, name: "James Wilson", section: "10-A", status: "absent", time: "-" },
    { id: 3, name: "Sophia Chen", section: "10-A", status: "late", time: "09:15" },
    { id: 4, name: "Lucas Rodriguez", section: "10-A", status: "present", time: "08:25" },
    { id: 5, name: "Olivia Parker", section: "10-A", status: "present", time: "08:40" },
    { id: 6, name: "Noah Martinez", section: "10-B", status: "present", time: "08:20" },
    { id: 7, name: "Ava Johnson", section: "10-B", status: "absent", time: "-" },
    { id: 8, name: "Ethan Brown", section: "10-B", status: "present", time: "08:35" },
    { id: 9, name: "Isabella Garcia", section: "10-B", status: "late", time: "09:05" },
    { id: 10, name: "William Davis", section: "10-B", status: "present", time: "08:30" },
    { id: 11, name: "Mia Robinson", section: "11-A", status: "present", time: "08:15" },
    { id: 12, name: "Benjamin Lee", section: "11-A", status: "absent", time: "-" },
    { id: 13, name: "Charlotte Walker", section: "11-A", status: "present", time: "08:25" },
    { id: 14, name: "Alexander Hall", section: "11-A", status: "late", time: "09:10" },
    { id: 15, name: "Amelia Wright", section: "11-A", status: "present", time: "08:35" },
];

// Mock attendance history data
const attendanceHistory = {
    weekly: {
        current: {
            days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            present: [85, 88, 92, 85, 90],
            absent: [10, 8, 5, 10, 7],
            late: [5, 4, 3, 5, 3]
        },
        last: {
            days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            present: [82, 85, 90, 88, 87],
            absent: [12, 10, 7, 8, 9],
            late: [6, 5, 3, 4, 4]
        },
        twoWeeks: {
            days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            present: [80, 82, 85, 83, 84],
            absent: [15, 13, 10, 12, 11],
            late: [5, 5, 5, 5, 5]
        }
    },
    monthly: {
        current: {
            weeks: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            present: [87, 89, 91, 88],
            absent: [9, 8, 6, 8],
            late: [4, 3, 3, 4]
        },
        last: {
            weeks: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            present: [85, 86, 88, 87],
            absent: [10, 9, 8, 9],
            late: [5, 5, 4, 4]
        }
    }
};

// Constants for status colors and icons
const statusColor = {
    present: 'bg-green-100 text-green-800',
    absent: 'bg-red-100 text-red-800',
    late: 'bg-yellow-100 text-yellow-800'
};

const statusIcon = {
    present: 'ri-check-line',
    absent: 'ri-close-line',
    late: 'ri-time-line'
};

// DOM Elements
const views = {
    homeView: document.getElementById('homeView'),
    attendanceView: document.getElementById('attendanceView'),
    reportsView: document.getElementById('reportsView'),
    settingsView: document.getElementById('settingsView')
};

const navButtons = {
    homeBtn: document.getElementById('homeBtn'),
    attendanceBtn: document.getElementById('attendanceBtn'),
    reportsBtn: document.getElementById('reportsBtn'),
    settingsBtn: document.getElementById('settingsBtn')
};

// Chart instances
let weeklyChart, monthlyChart, reportOverviewChart, attendanceDistributionChart, trendAnalysisChart;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    document.querySelector('.ri-calendar-line + span').textContent = dateString;
    
    if (document.getElementById('attendanceDate')) {
        document.getElementById('attendanceDate').value = dateString;
    }
    
    if (document.getElementById('reportFromDate')) {
        document.getElementById('reportFromDate').value = dateString;
    }
    
    if (document.getElementById('reportToDate')) {
        document.getElementById('reportToDate').value = dateString;
    }
    
    // Initialize student lists
    populateStudentList();
    
    // Initialize charts
    initializeCharts();
    
    // Setup event listeners
    setupEventListeners();
    
    // Check for dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        toggleDarkMode();
    }
});

// Function to populate student list with filtering and search
function populateStudentList(filter = 'all', searchTerm = '', section = '10-A') {
    const studentList = document.getElementById('studentList');
    if (!studentList) return;
    
    studentList.innerHTML = ''; // Clear existing list
    
    // Filter by section first
    let filteredStudents = students.filter(student => student.section === section);
    
    // Then filter by status if needed
    if (filter !== 'all') {
        filteredStudents = filteredStudents.filter(student => student.status === filter);
    }
    
    // Then filter by search term if provided
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredStudents = filteredStudents.filter(student => 
            student.name.toLowerCase().includes(term) || 
            student.id.toString().includes(term)
        );
    }
    
    if (filteredStudents.length === 0) {
        const emptyEl = document.createElement('div');
        emptyEl.className = 'text-center p-4 text-gray-500';
        emptyEl.textContent = 'No students found';
        studentList.appendChild(emptyEl);
        return;
    }

    filteredStudents.forEach(student => {
        const studentEl = document.createElement('div');
        studentEl.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg';
        studentEl.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <i class="ri-user-line text-gray-500"></i>
                </div>
                <div>
                    <div class="text-sm font-medium">${student.name}</div>
                    <div class="flex items-center gap-1">
                        <span class="text-xs text-gray-500">ID: ${student.id}</span>
                        <span class="text-xs text-gray-500">•</span>
                        <span class="text-xs text-gray-500">${student.time}</span>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <button class="status-btn" data-id="${student.id}" data-status="present">
                    <i class="${student.status === 'present' ? statusIcon.present + ' text-green-600' : 'ri-checkbox-blank-circle-line text-gray-300'}"></i>
                </button>
                <button class="status-btn" data-id="${student.id}" data-status="absent">
                    <i class="${student.status === 'absent' ? statusIcon.absent + ' text-red-600' : 'ri-checkbox-blank-circle-line text-gray-300'}"></i>
                </button>
                <button class="status-btn" data-id="${student.id}" data-status="late">
                    <i class="${student.status === 'late' ? statusIcon.late + ' text-yellow-600' : 'ri-checkbox-blank-circle-line text-gray-300'}"></i>
                </button>
                <span class="px-2 py-1 rounded-full text-xs ${statusColor[student.status]}">${student.status}</span>
            </div>
        `;
        studentList.appendChild(studentEl);
    });

    // Add event listeners to status buttons
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const studentId = parseInt(this.getAttribute('data-id'));
            const newStatus = this.getAttribute('data-status');
            
            // Update student status
            const studentIndex = students.findIndex(s => s.id === studentId);
            if (studentIndex !== -1) {
                students[studentIndex].status = newStatus;
                if (newStatus === 'present' || newStatus === 'late') {
                    const now = new Date();
                    const hours = now.getHours().toString().padStart(2, '0');
                    const minutes = now.getMinutes().toString().padStart(2, '0');
                    students[studentIndex].time = `${hours}:${minutes}`;
                } else {
                    students[studentIndex].time = '-';
                }
                
                // Refresh the list with current filters
                const currentFilter = document.getElementById('statusFilter').value;
                const searchTerm = document.getElementById('studentSearch').value;
                const currentSection = document.getElementById('classSelector').value;
                populateStudentList(currentFilter, searchTerm, currentSection);
                updateAttendanceStats(currentSection);
            }
        });
    });
    
    // Update attendance statistics
    updateAttendanceStats(section);
}

// Function to populate attendance student list
function populateAttendanceList(filter = 'all', searchTerm = '', section = '10-A') {
    const attendanceStudentList = document.getElementById('attendanceStudentList');
    if (!attendanceStudentList) return;
    
    attendanceStudentList.innerHTML = ''; // Clear existing list
    
    // Filter by section first
    let filteredStudents = students.filter(student => student.section === section);
    
    // Then filter by status if needed
    if (filter !== 'all') {
        filteredStudents = filteredStudents.filter(student => student.status === filter);
    }
    
    // Then filter by search term if provided
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredStudents = filteredStudents.filter(student => 
            student.name.toLowerCase().includes(term) || 
            student.id.toString().includes(term)
        );
    }
    
    if (filteredStudents.length === 0) {
        const emptyEl = document.createElement('div');
        emptyEl.className = 'text-center p-4 text-gray-500';
        emptyEl.textContent = 'No students found';
        attendanceStudentList.appendChild(emptyEl);
        return;
    }

    filteredStudents.forEach(student => {
        const studentEl = document.createElement('div');
        studentEl.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg';
        studentEl.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <i class="ri-user-line text-gray-500"></i>
                </div>
                <div>
                    <div class="text-sm font-medium">${student.name}</div>
                    <div class="flex items-center gap-1">
                        <span class="text-xs text-gray-500">ID: ${student.id}</span>
                        <span class="text-xs text-gray-500">•</span>
                        <span class="text-xs text-gray-500">${student.time}</span>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <div class="flex border border-gray-200 rounded-lg overflow-hidden">
                    <button class="attendance-status-btn px-2 py-1 text-xs ${student.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-gray-50 text-gray-500'}" data-id="${student.id}" data-status="present">Present</button>
                    <button class="attendance-status-btn px-2 py-1 text-xs ${student.status === 'absent' ? 'bg-red-100 text-red-800' : 'bg-gray-50 text-gray-500'}" data-id="${student.id}" data-status="absent">Absent</button>
                    <button class="attendance-status-btn px-2 py-1 text-xs ${student.status === 'late' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-50 text-gray-500'}" data-id="${student.id}" data-status="late">Late</button>
                </div>
                <button class="note-btn" data-id="${student.id}">
                    <i class="ri-chat-1-line text-gray-500"></i>
                </button>
            </div>
        `;
        attendanceStudentList.appendChild(studentEl);
    });

    // Add event listeners to attendance status buttons
    document.querySelectorAll('.attendance-status-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const studentId = parseInt(this.getAttribute('data-id'));
            const newStatus = this.getAttribute('data-status');
            
            // Update student status
            const studentIndex = students.findIndex(s => s.id === studentId);
            if (studentIndex !== -1) {
                students[studentIndex].status = newStatus;
                if (newStatus === 'present' || newStatus === 'late') {
                    const now = new Date();
                    const hours = now.getHours().toString().padStart(2, '0');
                    const minutes = now.getMinutes().toString().padStart(2, '0');
                    students[studentIndex].time = `${hours}:${minutes}`;
                } else {
                    students[studentIndex].time = '-';
                }
                
                // Refresh the list with current filters
                const searchTerm = document.getElementById('attendanceStudentSearch').value;
                const currentSection = document.getElementById('attendanceClassSelector').value;
                populateAttendanceList('all', searchTerm, currentSection);
                updateAttendanceCounts(currentSection);
            }
        });
    });

    // Add event listeners to note buttons
    document.querySelectorAll('.note-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const studentId = parseInt(this.getAttribute('data-id'));
            const student = students.find(s => s.id === studentId);
            if (student) {
                const note = prompt(`Add a note for ${student.name}:`, student.note || '');
                if (note !== null) {
                    student.note = note;
                    alert(`Note saved for ${student.name}`);
                }
            }
        });
    });
    
    // Update attendance counts
    updateAttendanceCounts(section);
}

// Function to update attendance statistics
function updateAttendanceStats(section) {
    const sectionStudents = students.filter(student => student.section === section);
    const total = sectionStudents.length;
    const present = sectionStudents.filter(s => s.status === 'present').length;
    const absent = sectionStudents.filter(s => s.status === 'absent').length;
    const late = sectionStudents.filter(s => s.status === 'late').length;
    
    // Update the overview cards
    const presentPercentage = Math.round((present / total) * 100);
    const absentPercentage = Math.round((absent / total) * 100);
    const latePercentage = Math.round((late / total) * 100);
    
    const presentEl = document.querySelector('.grid.grid-cols-3 .text-green-600');
    const absentEl = document.querySelector('.grid.grid-cols-3 .text-red-600');
    const lateEl = document.querySelector('.grid.grid-cols-3 .text-yellow-600');
    
    if (presentEl) presentEl.textContent = `${presentPercentage}%`;
    if (absentEl) absentEl.textContent = `${absentPercentage}%`;
    if (lateEl) lateEl.textContent = `${latePercentage}%`;
}

// Function to update attendance counts in the attendance view
function updateAttendanceCounts(section) {
    const sectionStudents = students.filter(student => student.section === section);
    const total = sectionStudents.length;
    const present = sectionStudents.filter(s => s.status === 'present').length;
    const absent = sectionStudents.filter(s => s.status === 'absent').length;
    const late = sectionStudents.filter(s => s.status === 'late').length;
    
    const totalEl = document.getElementById('totalStudents');
    const presentEl = document.getElementById('presentCount');
    const absentEl = document.getElementById('absentCount');
    const lateEl = document.getElementById('lateCount');
    
    if (totalEl) totalEl.textContent = total;
    if (presentEl) presentEl.textContent = present;
    if (absentEl) absentEl.textContent = absent;
    if (lateEl) lateEl.textContent = late;
}

// Initialize charts
function initializeCharts() {
    // Weekly chart
    const weeklyChartEl = document.getElementById('weeklyChart');
    if (weeklyChartEl) {
        weeklyChart = echarts.init(weeklyChartEl);
        const weeklyOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            legend: {
                data: ['Present', 'Absent', 'Late'],
                bottom: 0
            },
            xAxis: {
                type: 'category',
                data: attendanceHistory.weekly.current.days
            },
            yAxis: {
                type: 'value',
                max: 100
            },
            series: [
                {
                    name: 'Present',
                    data: attendanceHistory.weekly.current.present,
                    type: 'bar',
                    stack: 'total',
                    itemStyle: { color: '#10B981' }
                },
                {
                    name: 'Absent',
                    data: attendanceHistory.weekly.current.absent,
                    type: 'bar',
                    stack: 'total',
                    itemStyle: { color: '#EF4444' }
                },
                {
                    name: 'Late',
                    data: attendanceHistory.weekly.current.late,
                    type: 'bar',
                    stack: 'total',
                    itemStyle: { color: '#F59E0B' }
                }
            ],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                top: '3%',
                containLabel: true
            }
        };
        weeklyChart.setOption(weeklyOption);
    }

    // Monthly chart
    const monthlyChartEl = document.getElementById('monthlyChart');
    if (monthlyChartEl) {
        monthlyChart = echarts.init(monthlyChartEl);
        const monthlyOption = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['Present %', 'Absent %', 'Late %'],
                bottom: 0
            },
            xAxis: {
                type: 'category',
                data: attendanceHistory.monthly.current.weeks
            },
            yAxis: {
                type: 'value',
                max: 100
            },
            series: [
                {
                    name: 'Present %',
                    data: attendanceHistory.monthly.current.present,
                    type: 'line',
                    smooth: true,
                    itemStyle: { color: '#10B981' }
                },
                {
                    name: 'Absent %',
                    data: attendanceHistory.monthly.current.absent,
                    type: 'line',
                    smooth: true,
                    itemStyle: { color: '#EF4444' }
                },
                {
                    name: 'Late %',
                    data: attendanceHistory.monthly.current.late,
                    type: 'line',
                    smooth: true,
                    itemStyle: { color: '#F59E0B' }
                }
            ],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                top: '3%',
                containLabel: true
            }
        };
        monthlyChart.setOption(monthlyOption);
    }

    // Initialize report charts when the reports view is shown
    initializeReportCharts();
}

// Initialize report charts
function initializeReportCharts() {
    // Report Overview Chart
    const reportOverviewChartEl = document.getElementById('reportOverviewChart');
    if (reportOverviewChartEl) {
        reportOverviewChart = echarts.init(reportOverviewChartEl);
        const reportOverviewOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            legend: {
                data: ['Present', 'Absent', 'Late'],
                bottom: 0
            },
            xAxis: {
                type: 'category',
                data: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
            },
            yAxis: {
                type: 'value',
                max: 100
            },
            series: [
                {
                    name: 'Present',
                    data: [85, 88, 90, 87],
                    type: 'bar',
                    stack: 'total',
                    itemStyle: { color: '#10B981' }
                },
                {
                    name: 'Absent',
                    data: [10, 8, 7, 9],
                    type: 'bar',
                    stack: 'total',
                    itemStyle: { color: '#EF4444' }
                },
                {
                    name: 'Late',
                    data: [5, 4, 3, 4],
                    type: 'bar',
                    stack: 'total',
                    itemStyle: { color: '#F59E0B' }
                }
            ],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                top: '3%',
                containLabel: true
            }
        };
        reportOverviewChart.setOption(reportOverviewOption);
    }

    // Attendance Distribution Chart
    const attendanceDistributionChartEl = document.getElementById('attendanceDistributionChart');
    if (attendanceDistributionChartEl) {
        attendanceDistributionChart = echarts.init(attendanceDistributionChartEl);
        const attendanceDistributionOption = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [
                {
                    name: 'Attendance',
                    type: 'pie',
                    radius: '70%',
                    data: [
                        { value: 85, name: 'Present', itemStyle: { color: '#10B981' } },
                        { value: 10, name: 'Absent', itemStyle: { color: '#EF4444' } },
                        { value: 5, name: 'Late', itemStyle: { color: '#F59E0B' } }
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        attendanceDistributionChart.setOption(attendanceDistributionOption);
    }

    // Trend Analysis Chart
    const trendAnalysisChartEl = document.getElementById('trendAnalysisChart');
    if (trendAnalysisChartEl) {
        trendAnalysisChart = echarts.init(trendAnalysisChartEl);
        const trendAnalysisOption = {
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
            },
            yAxis: {
                type: 'value',
                max: 100
            },
            series: [
                {
                    data: [88, 92, 90, 89, 87, 85],
                    type: 'line',
                    smooth: true,
                    areaStyle: {},
                    itemStyle: { color: '#4F46E5' }
                }
            ],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '3%',
                containLabel: true
            }
        };
        trendAnalysisChart.setOption(trendAnalysisOption);
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeSettings = document.getElementById('darkModeSettings');
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    if (darkModeSettings) {
        darkModeSettings.addEventListener('change', function() {
            if (this.checked !== document.body.classList.contains('dark')) {
                toggleDarkMode();
            }
        });
    }

    // Navigation functionality
    setupNavigation();
    
    // Student list filters and search
    setupStudentListFilters();
    
    // Attendance view functionality
    setupAttendanceView();
    
    // Reports view functionality
    setupReportsView();
    
    // Settings view functionality
    setupSettingsView();
    
    // Window resize handler for charts
    window.addEventListener('resize', function() {
        if (weeklyChart) weeklyChart.resize();
        if (monthlyChart) monthlyChart.resize();
        if (reportOverviewChart) reportOverviewChart.resize();
        if (attendanceDistributionChart) attendanceDistributionChart.resize();
        if (trendAnalysisChart) trendAnalysisChart.resize();
    });
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark');
    const icon = document.querySelector('#darkModeToggle i');
    if (document.body.classList.contains('dark')) {
        if (icon) icon.className = 'ri-sun-line text-gray-600';
        localStorage.setItem('darkMode', 'enabled');
        if (document.getElementById('darkModeSettings')) {
            document.getElementById('darkModeSettings').checked = true;
        }
    } else {
        if (icon) icon.className = 'ri-moon-line text-gray-600';
        localStorage.setItem('darkMode', 'disabled');
        if (document.getElementById('darkModeSettings')) {
            document.getElementById('darkModeSettings').checked = false;
        }
    }
    
    // Redraw all charts with new theme
    if (weeklyChart) weeklyChart.dispose();