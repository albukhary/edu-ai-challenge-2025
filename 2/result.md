**Title**  
Logout Button Unresponsive on Safari Browser

**Description**  
When users attempt to click the logout button while using the Safari browser, the button appears unresponsive and no action is taken. This prevents users from logging out of their session, potentially leading to security or session management concerns.

**Steps to Reproduce**

1. Open the application in Safari (macOS or iOS).
2. Log in with valid credentials.
3. Navigate to the top-right corner and click the "Logout" button.

**Expected vs Actual Behavior**

- **Expected**: User is logged out and redirected to the login page.
- **Actual**: Nothing happens when the "Logout" button is clicked. No visible feedback or redirection.

**Environment**

- Browser: Safari (latest version)
- OS: macOS Ventura / iOS 17
- Device: MacBook Pro / iPhone 14
- App Version: 2.1.4 (if known)

**Severity or Impact**  
Major — Logout functionality is a core security feature and its failure affects all Safari users, preventing proper session termination.
