# systemd

Install the unit as a user service from this repo:

```bash
mkdir -p ~/.config/systemd/user
cp deploy/systemd/mission-control.service ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now mission-control.service
systemctl --user status mission-control.service
```

The unit expects the repo to live at `~/workspace/dashboard` and runs `node server.js` on port `3000`.
