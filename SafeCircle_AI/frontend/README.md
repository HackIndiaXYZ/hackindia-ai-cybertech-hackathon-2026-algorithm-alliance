# SafeCircle AI Frontend

A plain HTML, CSS, and JavaScript frontend.

## Start the project

Open the SafeCircle-AI folder in VS Code.

Open Terminal → New Terminal.

Run:

```powershell
cd frontend
py -m http.server 5500 --bind 127.0.0.1
```

If the `py` command is unavailable but Python is installed, try:

```powershell
python -m http.server 5500 --bind 127.0.0.1
```

Open:

http://localhost:5500

Keep the terminal running. Press Ctrl+C to stop the server.

Do not open the HTML files by double-clicking.
JavaScript modules need a local HTTP server.

## Demo walkthrough

1. Open Check.
2. Click "Try fake KYC example".
3. Optionally enable saved history.
4. Run the check.
5. Read the reasons and guidance.
6. Save the summary to the demo guardian queue.
7. Open Guardian demo and record a simulated decision.
8. Add the fictional blocked case.
9. Notice that the blocked case has no override action.
10. Try the Safety Coach question.
11. Change explanation style, text size, or contrast in Settings.

## Demo limitations

- Scanning uses illustrative keyword rules, not a trained AI model.
- A result without matching rules is "Not verified", not "Safe".
- No reputation feeds are connected.
- Login and registration do not create or authenticate accounts.
- No guardian is verified or notified.
- Review actions change local demo state only.
- No harmful-content classifier or age enforcement is implemented.
- The frontend cannot block unrelated browser navigation.
- Browser storage does not enforce security permissions.

## QR images

QR decoding uses BarcodeDetector if the browser supports it.

If unavailable, paste the QR destination manually.

Images are processed locally and are not uploaded.

Only HTTP and HTTPS destinations are supported.

Decoded links are never opened automatically.

## Storage

Preferences use localStorage.

Result summaries and demo history use sessionStorage.

Raw submissions are not saved in demo history.

Adding a result to the guardian demo queue saves its summary.

Use fictional content in the demo.

## Connect a backend

In js/config.js, change DEMO_MODE to false only when your
backend is ready.

The frontend expects:

POST /api/scans

Request:

```json
{
  "kind": "message",
  "content": "Fictional message",
  "mode": "child"
}
```

Response:

```json
{
  "id": "server-generated-id",
  "createdAt": "2026-10-26T12:00:00Z",
  "risk": "suspicious",
  "reasons": [
    "Evidence-backed explanation from the backend"
  ],
  "guidance": "An appropriate next step"
}
```

Allowed risk values:

- unknown
- suspicious
- high
- blocked

Authentication forms expect:

- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/logout

Login sends email and password.

Registration sends name, email, and password.

The backend must implement secure authentication, registration
validation, verification, consent, and age-appropriate onboarding.

Registration success does not automatically log the user in.

Requests use credentials: "include" for server-managed sessions.

Configure the backend for the exact frontend origin when using
credentialed CORS. Implement appropriate CSRF protection.

Guardian review, history synchronization, consent management,
and notifications still need their own backend endpoints and
frontend integration.

## Security responsibilities

The backend must:

- Authorize every protected request.
- Verify guardian relationships.
- Enforce all restrictions independently of the frontend.
- Prevent guardian override of confirmed malicious blocks.
- Keep classifier and reputation-service secrets server-side.
- Validate all inputs.
- Protect any URL-fetching feature from access to internal networks.
- Minimize and protect stored personal data.

Never place passwords or secret API keys in frontend code.