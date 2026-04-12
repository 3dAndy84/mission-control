# Mission Control local API migration

This dashboard now runs behind a small local Node/Express server instead of exposing raw JSON files directly to the browser.

## What changed

- `server.js` serves `index.html` at `/`
- JSON is exposed only through `/api/*`
- raw `*.json` files are no longer web-accessible through static hosting
- `/api/health` provides a quick local readiness check
- `deploy/systemd/mission-control.service` can optionally read overrides from an environment file

## Endpoints

- `/`
- `/api/status`
- `/api/watchdog`
- `/api/tasks`
- `/api/cron-jobs`
- `/api/memory`
- `/api/projects`
- `/api/health`

## Local run steps

From this host:

```bash
cd ~/workspace/dashboard
npm install
PORT=3000 npm start
```

Verify locally:

```bash
curl http://127.0.0.1:3000/api/health
curl http://127.0.0.1:3000/api/status
```

Then open:

- `http://127.0.0.1:3000/`

## User-level systemd deployment on this host

1. Install dependencies once:

```bash
cd ~/workspace/dashboard
npm install
```

2. Create the user unit directory and copy the service file:

```bash
mkdir -p ~/.config/systemd/user
cp ~/workspace/dashboard/deploy/systemd/mission-control.service ~/.config/systemd/user/mission-control.service
```

3. Optional: create an environment override file:

```bash
mkdir -p ~/.config/mission-control
cp ~/workspace/dashboard/deploy/systemd/mission-control.env.example ~/.config/mission-control/mission-control.env
```

4. Reload systemd and enable the service:

```bash
systemctl --user daemon-reload
systemctl --user enable --now mission-control.service
```

5. Check status and logs:

```bash
systemctl --user status mission-control.service
journalctl --user -u mission-control.service -n 50 --no-pager
curl http://127.0.0.1:3000/api/health
```

## Notes

- The service expects the repo at `~/workspace/dashboard`
- Default port is `3000`
- If you change `PORT`, restart the user service:

```bash
systemctl --user restart mission-control.service
```

## Remaining deployment blocker

Host-side manual action is still required to install dependencies and register/start the user-level systemd service on the host. The repo changes are ready for that step.
