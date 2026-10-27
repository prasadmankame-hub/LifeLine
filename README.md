# 🩸 LifeLine — Blood Donation Website

LifeLine is a web-based blood donation platform designed to connect blood donors with people who need blood. It provides a simple and accessible way to register as a donor, submit blood requests, and view registered donors.

The website uses Google Sheets as its online data store through Google Apps Script and can be deployed using Vercel.

## 🌐 Project Overview

LifeLine aims to make finding blood donors easier by providing a centralized platform for donor registration and blood requests.

Users can access the website through a web browser on a computer, tablet, or mobile phone. They do not need to download an Excel file or install Google Sheets to submit information.

## ✨ Features

* 🩸 **Donor Registration:** Allows users to register as blood donors.
* 🏥 **Blood Requests:** Allows users to submit blood requirements.
* 👥 **Donor Roll:** Displays registered donor information.
* 🔎 **Blood Group Information:** Helps users identify donors by blood group.
* 📊 **Google Sheets Integration:** Stores donor registrations and blood requests online.
* 📱 **Mobile Access:** Accessible through mobile and desktop browsers, subject to the website's responsive layout.
* ☁️ **Online Deployment:** Supports hosting the website on Vercel.
* 📅 **Date and Time Records:** Can store registration timestamps in Google Sheets.

## 🛠️ Technologies Used

| Technology         | Purpose                                 |
| ------------------ | --------------------------------------- |
| HTML5              | Website structure                       |
| CSS3               | Website styling and layout              |
| JavaScript         | Form handling and frontend interactions |
| Google Apps Script | Backend API for accessing Google Sheets |
| Google Sheets      | Online data storage                     |
| GitHub             | Source code management                  |
| Vercel             | Website hosting                         |

## 📁 Project Structure

```text
LifeLine-Google-Sheets-Website/
│
├── index.html       # Website frontend
├── config.js        # Google Apps Script API configuration
├── Code.gs          # Google Apps Script backend
├── README.md        # Project documentation
└── .gitignore       # Git ignore rules
```

## ⚙️ Setup and Installation

### Step 1: Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

Replace `YOUR-USERNAME` and `YOUR-REPOSITORY` with your actual GitHub username and repository name.

Navigate to the project folder:

```bash
cd YOUR-REPOSITORY
```

Alternatively, download the repository as a ZIP file and extract it.

### Step 2: Create a Google Spreadsheet

1. Open [Google Sheets](https://sheets.google.com/).
2. Create a new spreadsheet.
3. Name it `LifeLine Blood Donation Database`.

The backend setup should create or use the following sheets:

* `Donors`
* `Requests`
* `Summary`

### Step 3: Configure Google Apps Script

1. Open your spreadsheet.
2. Select **Extensions → Apps Script**.
3. Open the `Code.gs` file included in this repository.
4. Copy its contents into the Apps Script editor.
5. Save the script.
6. Run the `setupSheets` function if provided in the code.
7. Follow the authorization prompts.

### Step 4: Deploy Google Apps Script

1. In the Apps Script editor, select **Deploy → New deployment**.
2. Choose **Web app**.
3. Set **Execute as** to `Me`.
4. Configure access appropriately for your intended users.
5. Deploy the script and complete any authorization steps.
6. Copy the Web app URL ending in `/exec`.

The exact access options depend on your Google account and organization settings. Public access should only be enabled if appropriate for your application.

### Step 5: Configure the API URL

Open `config.js` and locate the Google Apps Script URL setting.

Replace the placeholder with your actual deployed Web app URL.

Example:

```javascript
window.LIFELINE_CONFIG = {
  googleScriptUrl: 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL'
};
```

Use your real `/exec` URL, then save the file.

**Important:** This configuration example assumes the frontend code reads `window.LIFELINE_CONFIG.googleScriptUrl`. The property name must match the actual implementation in `index.html`.

## 💻 Run the Website Locally

Make sure Python is installed.

Open a terminal in the directory containing `index.html` and run:

```bash
python -m http.server 8000
```

Open the website in your browser:

http://localhost:8000

Keep the terminal running while testing.

The website can send data to Google Sheets only after the Apps Script endpoint has been configured correctly.

## ☁️ Deploy on Vercel

1. Push the project files to GitHub.
2. Open [Vercel](https://vercel.com/).
3. Sign in using your GitHub account.
4. Select **Add New → Project**.
5. Import your GitHub repository.
6. Configure the project as a static website if it contains only HTML, CSS, and JavaScript.
7. Deploy the project.
8. Open the generated Vercel URL and test the website.

After deployment, users can access the website through the public URL without downloading the source code or spreadsheet.

## 📊 Database Structure

### Donors

Stores information submitted through donor registration.

Example fields may include:

* Donor ID
* Name
* Blood Group
* Contact Information
* City
* Last Donation Date
* Registration Timestamp

### Requests

Stores information submitted through the blood request form.

Example fields may include:

* Request ID
* Patient Name
* Blood Group
* Units Required
* Hospital
* City
* Contact Information
* Request Timestamp

The actual fields must match those implemented in `Code.gs` and the website forms.

## 🧪 Testing

After configuring the Google Apps Script backend:

1. Open the website locally or through Vercel.
2. Submit a test donor registration.
3. Check the `Donors` sheet.
4. Submit a test blood request.
5. Check the `Requests` sheet.
6. Confirm that the Donor Roll displays the expected records.
7. Repeat the tests on a mobile device.

If submissions fail, check the browser console and the Apps Script execution logs.

## 🔐 Security and Privacy

This project handles potentially sensitive personal information.

* Keep the Google spreadsheet private.
* Do not commit passwords, private keys, or other secrets to GitHub.
* Validate and sanitize submitted data.
* Protect the API against spam and unauthorized submissions.
* Obtain consent before displaying donor contact information publicly.
* Restrict access to personal information to authorized users where possible.
* Review the applicable privacy and data-protection requirements before public use.

Google Apps Script web apps exposed to the public require particular care because public endpoints can receive unwanted requests.

## ⚠️ Limitations

Google Sheets is suitable for prototypes, demonstrations, and small projects, but it is not a dedicated production database.

For a larger blood donation platform, consider a database with stronger access controls, transaction handling, and scalability.

The website's ability to display records and save form submissions depends on the frontend and Apps Script implementations being correctly configured and deployed.

## 🚀 Future Enhancements

* Donor search by blood group and city
* Improved form validation
* Secure donor authentication
* Blood request status tracking
* Email or SMS notifications
* Better mobile responsiveness
* Admin dashboard
* Stronger API abuse prevention
* Migration to a dedicated database as usage grows

## 👨‍💻 Author

**Project:** LifeLine Blood Donation Website

**Purpose:** To simplify donor registration and blood request management through an accessible web platform.

## 📄 License

Choose a suitable open-source license before redistributing or modifying this project. If you intend to use an MIT license, add a `LICENSE` file containing the MIT license text.

---

**LifeLine — Every Drop Counts. Every Donor Matters. 🩸**
