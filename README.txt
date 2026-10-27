LIFELINE BLOOD DONATION WEBSITE — GOOGLE SHEETS VERSION
========================================================

FILES
-----
index.html       Your existing website design, updated to use Google Sheets.
config.js        Paste the deployed Apps Script Web App URL here.
Code.gs          Google Apps Script backend that reads/writes the Google Sheet.
README.txt       These setup and deployment instructions.

IMPORTANT
---------
I cannot create or connect a Google Sheet inside your Google account from this folder.
You must create the sheet in your account, install Code.gs, deploy it, and paste its
Web App URL into config.js. After that, the site is ready to upload to GitHub/Vercel.

PART 1 — CREATE YOUR GOOGLE SHEET
---------------------------------
1. Open https://sheets.google.com and create a blank spreadsheet.
2. Name it: LifeLine Blood Donation Database
3. You do not need to create tabs manually; setupSheets() creates:
   - Donors
   - Requests
   - Summary

PART 2 — ADD THE BACKEND SCRIPT
-------------------------------
1. Open your new spreadsheet.
2. Choose Extensions > Apps Script.
3. Delete the starter code in the editor.
4. Open Code.gs from this folder and copy all of it into the Apps Script editor.
5. Click Save and name the project LifeLine Backend.
6. Select setupSheets from the function dropdown and click Run.
7. Approve the permissions Google requests.
8. Return to your spreadsheet and confirm that Donors, Requests, and Summary tabs exist.

PART 3 — DEPLOY THE SCRIPT AS AN API
------------------------------------
1. In Apps Script, click Deploy > New deployment.
2. Click the gear icon / Select type and choose Web app.
3. Description: LifeLine API
4. Execute as: Me
5. Who has access: Anyone
6. Click Deploy and approve any further permission prompt.
7. Copy the Web app URL. It should end in /exec.
   Do not use the /dev URL.

SECURITY NOTE:
The website's public forms need the API to be reachable without visitors signing in.
"Anyone" means strangers can submit requests to this API. Do not store confidential
medical records or publish donor phone/email details without their consent. For a
real production service, add stronger abuse protection and access controls.

PART 4 — CONNECT THIS WEBSITE TO THE SHEET
------------------------------------------
1. Open config.js in this folder with Notepad or VS Code.
2. Replace:
   PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE
   with your real deployed /exec URL, keeping the quote marks.
   Example format:
   googleScriptUrl: 'https://script.google.com/macros/s/DEPLOYMENT_ID/exec'
3. Save config.js.

PART 5 — TEST LOCALLY (OPTIONAL)
--------------------------------
Do not open index.html directly by double-clicking. Use a local static server.
If Python is installed, open CMD in this folder and run:
   python -m http.server 8000
Then open:
   http://localhost:8000

Submit a test donor and request. Check the Donors and Requests tabs in Google Sheets.
If records do not appear, open the Apps Script project, select Executions, and check
whether an execution failed. Confirm the deployed URL ends in /exec and access is Anyone.

PART 6 — UPLOAD TO GITHUB AND DEPLOY TO VERCEL
----------------------------------------------
1. Create a GitHub repository, for example lifeline-blood-donation.
2. Upload these files/folders to the repository root:
   - index.html
   - config.js
   - README.txt
   - Code.gs (kept in the repository as the backend source)
3. Go to https://vercel.com and import the GitHub repository.
4. For a plain HTML website, keep the framework preset as Other and use the repository
   root as the project directory. No build command is required; the output directory
   can be left blank or set to the root according to the Vercel import screen.
5. Deploy. Open the Vercel URL and test both forms.

CHANGING THE SCRIPT LATER
-------------------------
If you edit Code.gs after deployment, go to Deploy > Manage deployments > Edit,
choose a new version, and redeploy. If you create a brand-new deployment, update
config.js with the new /exec URL and push the change to GitHub.

DATE AND TIME
-------------
The Apps Script saves Last Donation Date as a real Google Sheets date formatted
dd-mm-yyyy and Timestamp as a real date-time formatted dd-mm-yyyy hh:mm:ss.
The spreadsheet timezone can be changed in File > Settings.

NOTE ABOUT DONOR PRIVACY
------------------------
The donor roll in this template displays name, blood group, city, age/gender, last
donation date and donation count. Review the existing website and obtain explicit
consent before publishing personal information. Avoid showing phone numbers or
email addresses publicly.
