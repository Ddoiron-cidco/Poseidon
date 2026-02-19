# Hardware E2E Test Flow (run_poseidon_e2e.sh)

This document describes the chronological logic of the hardware E2E test implemented in
`test/e2e/run_poseidon_e2e.sh`.

## Preconditions
- ROS Noetic is available (`/opt/ros/noetic/setup.bash`).
- Poseidon workspace is built (so `src/workspace/devel/setup.bash` exists).
- Passwordless sudo is available when running as a non-root user.
- The test host can bind to `127.0.0.1` ports 8080/9099/9002.
- A real sonar device (or an externally simulated sonar device) is available at
  `POSEIDON_SONAR_DEVICE` (default: `/dev/sonar`).

## GPSD nodes integration (one-time setup)
If your setup requires GPSD-related nodes, install them in the ROS workspace before running E2E:

```bash
echo -e "\e[35mDownloading GPSD-Client\e[0m"
cd /opt
sudo git clone https://github.com/CIDCO-dev/gps_umd.git
cd /opt/gps_umd
sudo mv gps* /opt/Poseidon/src/workspace/src/
cd /opt
sudo rm -rd gps_umd
```

Then rebuild the workspace so the nodes are available:

```bash
cd /opt/Poseidon/src/workspace
catkin_make
```

## Key environment variables (defaults)
- `POSEIDON_ROOT`: repo root (auto-detected).
- `POSEIDON_E2E_ARTIFACT_DIR`: `test/e2e/artifacts`.
- `POSEIDON_HTTP_PORT`: `8080`.
- `POSEIDON_E2E_BASE_URL`: `http://127.0.0.1:8080`.
- `DIAGNOSTICS_WS_PORT`: `9099`.
- `POSEIDON_TELEMETRY_WS_PORT`: `9002`.
- `POSEIDON_E2E_REUSE_RUNNING`: `0` (start a new stack unless set to 1).
- `POSEIDON_E2E_EXCLUSIVE`: `0` (set to 1 to stop existing services/ports first).
- `POSEIDON_E2E_LAUNCH_AS_ROOT`: `1` (required for I2C/GPIO).
- `POSEIDON_E2E_REQUIRED_NODES`: `Diagnostics`.
- `POSEIDON_CONFIG_PATH`: `config.txt` in the repo.
- `POSEIDON_LOGGER_PATH`: temp dir created by the script.
- `POSEIDON_SONAR_DEVICE`: `/dev/sonar` by default.

## Chronological steps
1) Initialize paths and defaults.
   - Set repo root, artifacts directory, ports, and E2E flags.
   - Create the artifacts directory.

2) Source ROS environment.
   - Source `/opt/ros/noetic/setup.bash` (if present).
   - Source `src/workspace/devel/setup.bash` (if present).

3) Resolve configuration and logging paths.
   - Set `POSEIDON_CONFIG_PATH` to `config.txt` if not provided.
   - Create a temp logger directory and export `POSEIDON_LOGGER_PATH`.

4) Resolve sonar device.
   - Use `POSEIDON_SONAR_DEVICE` if provided.
   - Otherwise default to `/dev/sonar`.

5) Enforce root access.
   - If running as non-root and `POSEIDON_E2E_LAUNCH_AS_ROOT=1`, require passwordless sudo.

6) Register cleanup handler.
   - On exit, stop the HTTP server and terminate the ROS stack
     (including escalating with sudo if it was launched as root).

7) Phase 1: start ROS and wait for readiness.
   - Start a local HTTP server from `www/webroot` on `POSEIDON_HTTP_PORT`.
   - If `POSEIDON_E2E_EXCLUSIVE=1`, stop any existing `ros` systemd service and kill
     websocket ports (9002/9099/9003/9004).
   - Start `launchROSService.sh` (via sudo if required).
   - Wait for TCP ports to open: diagnostics websocket, telemetry websocket, and HTTP.
   - Wait for ROS nodes (by default, `Diagnostics`) to appear.

8) Phase 2: run backend websocket test.
   - Execute `src/workspace/src/diagnostics/tests/test_launchrosservice_websocket.py`.

9) Phase 3: run UI test.
   - In `test/e2e/`, install `node_modules` if missing.
   - Run `node ui_test.js`.

10) If the UI test fails, collect diagnostics.
   - Print a tail of `test/e2e/artifacts/launchROSService.log`.
   - Dump `rostopic list` (first 200), `rostopic hz /imu/data`, and `rostopic hz /depth`.
   - Query the diagnostics websocket for `GNSS Fix`, `IMU Communication`, and
     `Sonar Communication` and print status/messages.

11) Exit.
   - If any phase fails, the script exits non-zero and the cleanup handler runs.
