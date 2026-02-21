// Store projects
let projects = JSON.parse(localStorage.getItem('projects')) || [];

function createProject(plan, style, requirements) {
    const project = {
        id: Date.now(),
        plan,
        style,
        requirements,
        status: 'AI Processing',
        progress: 0,
        createdAt: new Date().toISOString(),
        analytics: {
            impressions: Math.floor(Math.random()*1000000),
            ctr: (Math.random()*5+2).toFixed(1),
            conversions: Math.floor(Math.random()*5000),
            roi: (Math.random()*200+100).toFixed(0)
        }
    };
    projects.push(project);
    localStorage.setItem('projects', JSON.stringify(projects));
    return project;
}

// Simulate autonomous workflow
function updateProjectStatus() {
    projects.forEach(p => {
        if (p.status === 'AI Processing') {
            p.progress += 20;
            if (p.progress >= 100) p.status = 'Proof Check';
        } else if (p.status === 'Proof Check') {
            p.status = 'Delivery';
        }
    });
    localStorage.setItem('projects', JSON.stringify(projects));
}

// Payout simulation
let payoutBalance = JSON.parse(localStorage.getItem('payoutBalance')) || { 
    fnb: 0, africanBank: 0, aiFnb: 0, reserveFnb: 0, retained: 0 
};

function processWeeklyPayout(total) {
    payoutBalance.fnb += total * 0.35;
    payoutBalance.africanBank += total * 0.15;
    payoutBalance.aiFnb += total * 0.20;
    payoutBalance.reserveFnb += total * 0.20;
    payoutBalance.retained += total * 0.10;
    localStorage.setItem('payoutBalance', JSON.stringify(payoutBalance));
}

// On dashboard load, display projects and balances
