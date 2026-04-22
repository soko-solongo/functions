<h1>MPS CD | Project 5: Functions by Soko Mungunsukh</h1>

<h2>About</h2>
<p>Eyerest Reminder is a Chrome browser extension that helps screen-heavy users protect their eyes by reminding them a regular break for 1 minute. The user is able to choose between two work-time options: 30 min OR 60 min.</p>
<p>The problem: Most people know they should rest their eyes, but forget to do it. This extension makes it harder to ignore, because a big sheep grows and takes over every open tab making the user impossible to work unless they click "Cancel" which terminates every active flow.</p>

<h2>How to Try</h2>
<p>1. Clone or download this repository to your local file.</p>
<p>2. Open Chrome and go to <code>chrome://extensions</code></p>
<p>3. Enable <strong>Developer Mode</strong> (toggle in the top right corner).</p>
<p>4. Click <strong>Load unpacked</strong> and select the project folder.</p>
<p>5. The yellow/white icon will appear in your Chrome toolbar. Click it, choose your interval, and hit Start.</p>

<h2>Technical & Design Highlights while building this tool</h2>
<p><strong>- Service Worker Architecture:</strong> <code>background.js</code> runs as a persistent service worker that owns the timer and blocker logic entirely, while <code>popup.js</code> only reads storage and listens user clicks.</p>
<p><strong>- Cross-tab Injection:</strong> Uses <code>chrome.scripting.executeScript()</code> and <code>chrome.scripting.insertCSS()</code> to inject the sheep image and blocker styles into every open tab simultaneously.</p>
<p><strong>- Shared State via Storage:</strong> <code>chrome.storage.local</code> acts as shared memory between the background service worker and the popup, syncing timer state and running status across both contexts.</p>
<p><strong>- CSS Scoped Variables:</strong> To avoid polluting host page styles, CSS custom properties are scoped directly to <code>#sheep-blocker</code> and <code>#sheep-cancel</code> IDs instead of <code>:root</code>.</p>
<p><strong>- Growth Animation:</strong> A 5-second CSS keyframe animation grows the sheep from 10vw to 150vw as a visual warning before the full block activates.</p>

<h3>About me</h3>
Soko Mungunsukh is a graduate student from MPS Communication Design program at The New School | Parsons School of Design.
