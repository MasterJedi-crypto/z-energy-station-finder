# Z Energy Station Finder

A responsive full-stack application based on a supplied Z Energy UX prototype.

Users can find Z stations, view station details, plan a trip, get in-app directions and manage saved trips.

This project was completed as a collaborative Mission Ready team project.

## My Contribution

My main responsibility was the **Find a Station and Station Details experience**.

I worked on:

- Find a Station search and results
- Station Details
- Map integration and station markers
- Internal directions and route display
- Frontend routing between station search and station details
- API integration for station data
- Responsive UI work
- Testing and debugging alongside the wider team
- Git feature branches and pull request workflow

## Features

- Find stations by Auckland, Wellington or Christchurch
- View search results on a map
- Open detailed station information
- Filter stations by fuel type and services
- Get directions within the application
- Plan a trip using road-route information
- Select preferred fuel and station services
- Save and manage trips for authenticated users
- Responsive desktop and mobile layouts

## Team Contributions

| Developer | Main Contribution |
|---|---|
| Rodrigo | Home page, shared header/navigation and authentication |
| Siobhan | Find a Station, search results, maps and Station Details |
| Koni | Plan My Trip, route planning and saved-trip integration |

## Technology

### Frontend

- React 19
- Vite
- Tailwind CSS
- React Router
- Leaflet
- React Leaflet

### Backend

- Node.js
- Express
- MongoDB
- MongoDB Node.js driver

### Testing and Development

- Vitest
- GitHub Actions
- Git
- GitHub feature branches and pull requests
- API integration testing
- Responsive testing

The final project had **51 automated tests passing across 9 test files** and completed a successful Vite production build.

## Application Journey

1. Open the home page.
2. Select **Find a Station**.
3. Search by city or view the available sample stations.
4. Select a station to view its details.
5. Get directions within the application.
6. Open **Plan My Trip**.
7. Enter a starting point and destination.
8. Select fuel and service preferences.
9. Review the generated route and suitable stations.

## Getting Started

### Requirements

- Node.js
- npm
- Local MongoDB instance

### Installation

```bash
git clone https://github.com/MasterJedi-crypto/z-energy-station-finder.git
cd z-energy-station-finder
npm install