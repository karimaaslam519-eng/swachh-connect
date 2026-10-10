# SwachhConnect — Native Android Mobile Application

**SwachhConnect** is a native Android application built with **Kotlin** and **Jetpack Compose (Material 3)** for smart municipal waste management, doorstep segregation inspection, citizen grievance resolution, and sanitation worker incentive distribution.

---

## 📱 Architecture & Tech Stack

- **Application Name**: SwachhConnect
- **Package Name / Application ID**: `com.Karima.SwachhConnect` (`com.karima.swachhconnect`)
- **Language**: 100% Modern Kotlin
- **UI Framework**: Jetpack Compose with Material 3
- **Architecture**: MVVM (Model-View-ViewModel) + Unidirectional Data Flow with Kotlin Coroutines & `StateFlow`
- **Minimum SDK**: Android 7.0 (API Level 24)
- **Target / Compile SDK**: Android 15 (API Level 35)
- **Bilingual Localization**: English and Tamil (தமிழ்) with `strings.xml` and `values-ta/strings.xml`

---

## 🚀 How to Install on a Physical Android Phone

### Method 1: One-Click Run via Android Studio (Recommended)

1. **Export Project from AI Studio**:
   - In the AI Studio top bar, click the **Settings** / **Options** menu and choose **Download as ZIP** (or **Export to GitHub**).
2. **Open in Android Studio**:
   - Launch **Android Studio** (Ladybug / Koala / Hedgehog or newer).
   - Select **Open** and select the project folder containing `settings.gradle.kts`.
   - Android Studio will automatically sync Gradle and download dependencies.
3. **Connect Your Physical Android Phone**:
   - On your Android phone, enable **Developer Options**:
     - Go to *Settings* -> *About Phone* -> Tap *Build Number* 7 times.
     - Go to *Settings* -> *System* -> *Developer Options* -> Enable **USB Debugging** (or use **Wireless Debugging via QR Code**).
   - Plug your phone into your computer via USB cable.
   - Accept the prompt *"Allow USB Debugging"* on your phone screen.
4. **Run & Install**:
   - Select your physical phone in the device dropdown in the Android Studio toolbar.
   - Click the green **Run ▶** button (or press `Shift + F10`).
   - The app will build, install, and launch directly on your physical phone!

---

### Method 2: Build Standalone APK via Command Line

Run the following command in terminal:

```bash
# Build the Debug APK
./gradlew assembleDebug
```

The installable `.apk` file will be generated at:
```
app/build/outputs/apk/debug/app-debug.apk
```

To install directly to your connected phone:
```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```
Or transfer `app-debug.apk` to your phone via WhatsApp, Google Drive, or USB and tap to install!

---

## 🌟 Modules & Features Implemented in Jetpack Compose

### 1. Resident (Customer) Portal (`CustomerScreen.kt`)
- **Today's Pickup Status Hero**: Live visual state card showing Awaiting Pickup, Collected, or Flagged Improper.
- **Doorstep 4-Digit Verification OTP**: High-visibility OTP card with single-tap code generation/refresh.
- **Assigned Sanitation Champion**: Displays worker profile (Murugan K), ward details, vehicle number (`TN-01-AB-1234`), and direct phone dialer.
- **Live Route Tracking**: Shows real-time truck progression and stops remaining.
- **Segregation Warnings & Fine Clearance**:
  - 3-tier penalty policy enforcement (Tier 1: Warning, Tier 2: Warning, Tier 3: ₹100 Fine).
  - Online simulated fine payment (UPI, Debit/Credit Card, Net Banking).
  - Generates downloadable digital Municipal receipts.
- **Grievance Filing**: Report missed collections, spillage, or driver delays directly to the municipal desk.

### 2. Sanitation Champion (Worker) Portal (`WorkerScreen.kt`)
- **Route Status Control**: One-tap toggle for **Start / End Collection Route**.
- **Worker Privacy Safeguard**: Explicitly isolates GPS broadcasting to active duty route hours only.
- **Door-to-Door Queue**: List of all ward doorsteps with two prominent touch buttons:
  - **Button 1**: *Mark Waste Collected* (1-tap completion).
  - **Button 2**: *Flag Improper Segregation* (Opens modal with mandatory camera photo evidence, violation category, and worker remarks).
  - **Administrative Safeguard**: Reports flag doorsteps for Municipal Admin audit and never directly impose fines.
- **40% Incentive Accrual**: Dedicated balance card showing worker's share (₹40 per ₹100 fine cleared) instantly transferred to their account.

### 3. Municipal Authority (Admin) Portal (`AdminScreen.kt`)
- **11 Key Performance Indicator (KPI) Cards**:
  - Total Households, Active Workers, Pickups Done, Missed Pickups, Flagged Violations, Pending Audits, Warnings Issued, Fines Collected, Worker Incentives Paid, Active Grievances.
- **Photo Evidence Audit Queue**: Review flagged photo proofs and **Approve Fine (₹100)** or **Reject Report**.
- **Citizen Grievance Resolution**: Review and close citizen complaints with resolution notes.
- **Financial Ledger**: Real-time auditing of collected fines and 40% automated worker payouts.

### 4. Bilingual English / Tamil Switcher (`SharedComponents.kt`)
- One-tap switch in the top app bar dynamically toggling between **English** and **தமிழ்** across all screens, dialogs, buttons, and notifications.

### 5. Real-Time SMS Notification Outbox
- Dispatches simulated SMS notices for Warnings, Penalty links, OTP codes, and Payment receipts directly accessible from the top bar icon.
