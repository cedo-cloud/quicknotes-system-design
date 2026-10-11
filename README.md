# QuickNotes API Client & Architecture

A lightweight frontend client for QuickNotes that demonstrates REST API interactions using vanilla JavaScript, accompanied by comprehensive backend design documentation for scaling to 1 million users.

## How to Run
1. Clone this repository.
2. Open `index.html` in your web browser.
3. Use the interface to load, create, and delete notes against the JSONPlaceholder API.

## Documentation
* [API Design Document](docs/api-design.md)
* [Data Model Document](docs/data-model.md)
* [Architecture Document](docs/architecture.md)

## What I Learned
1. **Asynchronous JavaScript:** Mastered `async/await` and `fetch` to manage loading states and handle network errors gracefully without freezing the UI.
2. **System Design:** Learned how to estimate load (RPS/WPS) and design a distributed architecture using load balancers, read replicas, and message queues for high availability.
3. **Database Normalization:** Understood how to model Many-to-Many relationships using junction tables and why SQL is often preferred over NoSQL for strictly structured, relationship-heavy data.