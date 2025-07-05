# 🔗 Deep Linking Test Guide

## Quick Test Instructions

### 1. Test Share Functionality

1. Open the app and go to any user details page
2. Tap the **Share** button (share icon in header)
3. You'll see options:
   - **Share Link**: Opens system share sheet
   - **Copy Deep Link**: Copies `usersmgmt://user/[id]` to clipboard
   - **Copy Web Link**: Copies `https://usersmanagement.app/user/[id]` to clipboard

### 2. Test Deep Link Debugger

1. Go to the **Profile** tab
2. Tap **Deep Link Debugger** under "Developer Tools"
3. Use the test buttons to try different deep links
4. Watch the link history to see what links are received

### 3. Manual Testing

#### Using Package Scripts (Easy):

```bash
npm run test:simple          # Quick test
npm run deeplink:user        # Test user profile
npm run deeplink:users       # Test users list
```

#### Using ADB (Advanced):

```bash
# Test user profile link
adb shell am start -a android.intent.action.VIEW -c android.intent.category.BROWSABLE -d "usersmgmt://user/1" com.yourcompany.usersmanagement

# Test users list
adb shell am start -a android.intent.action.VIEW -c android.intent.category.BROWSABLE -d "usersmgmt://users" com.yourcompany.usersmanagement
```

#### Using Browser:

1. Open any browser on your device
2. Type: `usersmgmt://user/1`
3. The app should open to that user's details

### 4. What Should Happen

✅ **Success**: App opens and navigates to the correct screen  
❌ **Failure**: Nothing happens, or app opens to wrong screen

### 5. Troubleshooting

#### App doesn't open:

- Make sure app is installed
- Check the URL scheme is correct: `usersmgmt://`
- Try rebuilding the app

#### App opens but wrong screen:

- Check the navigation configuration in `RootNavigator.tsx`
- Verify the URL format matches the expected pattern

#### Share links don't work:

- Check if expo-clipboard is installed
- Verify the URLs are correctly formatted

### 6. URL Patterns Supported

| Pattern                      | Screen       | Example                     |
| ---------------------------- | ------------ | --------------------------- |
| `usersmgmt://user/[id]`      | User Details | `usersmgmt://user/123`      |
| `usersmgmt://user/[id]/edit` | Edit User    | `usersmgmt://user/123/edit` |
| `usersmgmt://users`          | Users List   | `usersmgmt://users`         |
| `usersmgmt://profile`        | Profile      | `usersmgmt://profile`       |

### 7. Development vs Production

**Development (Expo Go):**

- URL format: `exp://127.0.0.1:8081/--/user/1`
- Test with: `npx uri-scheme open exp://127.0.0.1:8081/--/user/1 --android`

**Development Build:**

- URL format: `usersmgmt://user/1`
- Test with: `npx uri-scheme open usersmgmt://user/1 --android`

**Production:**

- Same as development build
- Also supports: `https://usersmanagement.app/user/1` (Android App Links)

## Need Help?

1. Use the **Deep Link Debugger** in the Profile tab
2. Check console logs for deep link events
3. Try the simple test script: `npm run test:simple`
