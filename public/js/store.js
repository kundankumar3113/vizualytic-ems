class Store {
  constructor() {
    const savedUser = localStorage.getItem("auth_user");

    this.state = {
      user: savedUser ? JSON.parse(savedUser) : null,

      employees: [],

      attendance: {
        clockedIn: false,
        startTime: null,
        secondsWorked: 0,
      },
    };

    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  setUser(user) {
    this.state.user = user;

    localStorage.setItem("auth_user", JSON.stringify(user));

    this.notify();
  }

  logout() {
    this.state.user = null;

    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");

    this.notify();
  }

  addEmployee(employee) {
    this.state.employees.push(employee);
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

    return () => {
      this.listeners = this.listeners.filter(
        (currentListener) => currentListener !== listener,
      );
    };
  }

  notify() {
    this.listeners.forEach((listener) => {
      listener(this.state);
    });
  }
}

export const store = new Store();
