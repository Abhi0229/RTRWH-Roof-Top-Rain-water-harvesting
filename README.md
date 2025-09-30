# RTRWH  Roof Top Rain Water Harvesting

An application for onspot assessment of rooftop rain water harvesting (RTRWH) and artificial recharge potential, including recommended unit sizing.

## Highlights
- Fast local assessment workflow
- Simple UI with clear input/output
- Backend API and lightweight frontend

## Tech Stack
- Backend: Python (see ackend/requirements.txt)
- Frontend: Node.js/React (see rontend/package.json)

## Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- Git

## Quick Start
### Backend
`powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
python backend/run.py
`
The API should start locally (see console output for the port).

### Frontend
`powershell
cd frontend
npm install
npm start
`
Open http://localhost:3000 in your browser.

## Project Structure
`
RTRWH-main/
  backend/           # API, models, database access
  frontend/          # React app (UI)
  .gitignore
  LICENSE
  README.md
`

## Environment
Create a .env file if needed (e.g. database path, API base URL). Example:
`
API_BASE_URL=http://localhost:8000
`

## Scripts
- Backend: run python backend/run.py
- Frontend: 
pm start inside rontend

## Contributing
See CONTRIBUTING.md for guidelines.

## Code of Conduct
See CODE_OF_CONDUCT.md.

## License
MIT  see LICENSE.

## Links
- Profile: https://github.com/Abhi0229
- Repo: https://github.com/Abhi0229/RTRWH-Roof-Top-Rain-water-harvesting
