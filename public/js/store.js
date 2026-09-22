class Store {
  constructor() {
    this.state = {
      user: { name: "Admin", company: "Vizualytic Data Solution" },
      employees: [
        {
          id: "VDS-1001",
          name: "Ananya Roy",
          role: "Lead Data Scientist",
          dept: "Analytics",
          salary: 125000,
          status: "Active",
        },
        {
          id: "VDS-1002",
          name: "Rohan Verma",
          role: "Full Stack Engineer",
          dept: "Engineering",
          salary: 95000,
          status: "Active",
        },
      ],
      attendance: { clockedIn: false, startTime: null, secondsWorked: 0 },
    };
    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  addEmployee(emp) {
    this.state.employees.push(emp);
    this.notify();
  }

  toggleClock() {
    this.state.attendance.clockedIn = !this.state.attendance.clockedIn;
    this.state.attendance.startTime = this.state.attendance.clockedIn
      ? new Date()
      : null;
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach((fn) => fn(this.state));
  }
}

export const store = new Store();
