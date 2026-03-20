# Google Authentication Implementation Guide (LNF System)

This guide explains how to add **Google Sign-In** to your current system:
- Frontend: React (Vite) in `LNF_frontend`
- Backend: Spring Boot in `LNF_Backend`
- Current auth style: username/password login, then store user in `localStorage`

---

## 1) Decide the login flow (recommended for your app)

Use this flow:
1. User clicks **Sign in with Google** in frontend.
2. Google returns an **ID token** (`credential`) to frontend.
3. Frontend sends that token to backend `POST /api/auth/google`.
4. Backend verifies token with Google.
5. Backend finds/creates user in DB.
6. Backend returns login success + user payload.
7. Frontend stores user in `localStorage`, sets auth state, redirects.

This matches your current app behavior and is easy to integrate safely.

---

## 2) Create Google OAuth credentials

1. Open Google Cloud Console.
2. Create/select a project.
3. Configure **OAuth consent screen**.
4. Create **OAuth Client ID** (Web application).
5. Add Authorized JavaScript origins:
   - `http://localhost:5173`
   - Your production frontend URL (Vercel/Netlify domain)
6. Copy the generated **Client ID**.

---

## 3) Add frontend environment variable

In `LNF_frontend/.env` add:

```env
VITE_GOOGLE_CLIENT_ID=your_google_web_client_id
```

For production, add the same variable in your hosting environment settings.

---

## 4) Install frontend package

Run in `LNF_frontend`:

```bash
npm install @react-oauth/google
```

---

## 5) Wire provider at app entry

1. In frontend entry file (usually `client/main.jsx`), wrap your app with:
   - `GoogleOAuthProvider`
2. Pass `clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}`.

This makes Google auth context available across the app.

---

## 6) Add Google button on Sign In page

In `client/pages/SignIn.jsx`:
1. Import `GoogleLogin` from `@react-oauth/google`.
2. Render button below current username/password form.
3. In `onSuccess`, read `credential` (Google ID token).
4. Call backend endpoint:

```http
POST /api/auth/google
Content-Type: application/json

{ "idToken": "<google_credential_here>" }
```

5. On success, keep your current behavior:
   - Save `user` to `localStorage`
   - `setIsAuthenticated(true)`
   - navigate to `/`

---

## 7) Add backend dependency for token verification

In `LNF_Backend/pom.xml`, add Google token verification library (for example):

```xml
<dependency>
  <groupId>com.google.api-client</groupId>
  <artifactId>google-api-client</artifactId>
  <version>2.7.0</version>
</dependency>
```

Then run Maven build to ensure dependency is resolved.

---

## 8) Add backend env + properties

1. Add env variable in backend runtime:

```env
GOOGLE_CLIENT_ID=your_google_web_client_id
```

2. In `LNF_Backend/src/main/resources/application.properties`, add:

```properties
google.client-id=${GOOGLE_CLIENT_ID}
```

---

## 9) Create backend request DTO

Create DTO (example `GoogleAuthRequest`) with one field:
- `idToken` (String)

Backend endpoint will accept this JSON.

---

## 10) Add `/api/auth/google` endpoint

In `AuthController`:
1. Add `@PostMapping("/google")`.
2. Receive `GoogleAuthRequest`.
3. Call service method like `authService.loginWithGoogle(idToken)`.
4. Return response in same style as existing login endpoint:
   - `message`
   - `user` object

Also update security allowlist:
- In `SecurityConfig`, add `/api/auth/google` to `permitAll()`.

---

## 11) Implement Google verification in service

In `AuthService` (or a dedicated `GoogleAuthService`):

1. Verify ID token using `GoogleIdTokenVerifier` and `google.client-id`.
2. Reject request if token invalid/expired.
3. Extract claims:
   - email
   - name
   - sub (Google user ID)
   - picture (optional)
4. Find user by email.
5. If not found, create user.
   - Because your `User.password` is non-null, set a secure random encoded placeholder password.
6. Return login success + user payload.

Important:
- Never trust email from frontend payload directly.
- Always trust only verified token claims from Google.

---

## 12) Update User model (recommended for maintainability)

To avoid auth confusion later, add fields to `User`:
- `authProvider` (LOCAL / GOOGLE)
- `googleSub` (unique)
- `profilePictureUrl` (optional)

If you keep `spring.jpa.hibernate.ddl-auto=update`, schema may auto-update. In production, prefer explicit DB migration scripts.

---

## 13) Frontend UX rules to keep behavior clean

1. If Google login fails, show user-friendly error.
2. Keep existing username/password login unchanged.
3. Keep logout behavior same (`removeItem("user")`, reset auth state).
4. Optionally show “Continue with Google” as primary button on Sign In page.

---

## 14) Test checklist (must pass)

### Local
- Google button appears on Sign In page.
- Google pop-up opens and returns credential.
- `POST /api/auth/google` returns 200 + user.
- New Google user is created on first login.
- Existing Google user logs in without duplicate records.
- User remains authenticated after page refresh (current localStorage behavior).

### Security
- Invalid token returns 401/400.
- Wrong audience/client-id token is rejected.
- Endpoint works under CORS from `localhost:5173` and your production domain.

### Regression
- Existing `/api/auth/login` and `/api/auth/register` still work.

---

## 15) Deployment updates

### Frontend hosting (Vercel/Netlify)
- Add `VITE_GOOGLE_CLIENT_ID`.

### Backend hosting (Railway or other)
- Add `GOOGLE_CLIENT_ID`.

### Google Cloud Console
- Ensure production frontend URL is in Authorized JavaScript origins.

---

## 16) Suggested implementation order (fastest path)

1. Add Google credentials + env variables.
2. Add frontend provider and Google button.
3. Add backend DTO + `/api/auth/google` endpoint.
4. Implement token verification and user upsert.
5. Update security config permit list.
6. Run local tests.
7. Deploy env vars + verify production login.

---

## 17) Optional hardening (next phase)

Your current app tracks auth using localStorage user object only. For stronger security, move to backend-issued JWT/session cookies after successful Google verification. That can be done as Phase 2 after this integration is stable.
