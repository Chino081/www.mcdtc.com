# MCDTC Game Server Official Website

A modern game server official website built with Bootstrap, offering features such as server status queries, team profiles, portfolio gallery, FAQ, and more.

## Features

- **Real-time Server Status** - Dynamically fetch and display game server online status, player count, and other information
- **Responsive Design** - Perfectly adapts to desktop, tablet, and mobile devices
- **Team Profile** - Showcase information about server management team members
- **Portfolio Gallery** - Display in-game builds or screenshots
- **FAQ Section** - Common questions and answers area
- **Contact Information** - Includes QQ group, Discord, and other contact details

## File Structure

```
www.mcdtc.com/
├── 404.html                 # Custom 404 error page
├── index.html               # Main page
├── favicon.ico              # Website icon
└── assets/
    ├── css/                 # CSS files
    │   ├── bootstrap.min.css
    │   ├── custom-style.css
    │   ├── font-awesome.min.css
    │   ├── responsive.css
    │   └── style.css
    ├── js/                  # JavaScript files
    │   ├── bootstrap.min.js
    │   ├── custom.js
    │   ├── jquery.easing.min.js
    │   ├── jquery.min.js
    │   └── server-status.js
    ├── fonts/               # Font files
    ├── images/              # Image resources
    └── mp3/                 # Background music
```

## Technology Stack

- **HTML5** - Page structure
- **CSS3** - Styling and design
- **JavaScript (ES6+)** - Interactive logic
- **jQuery** - DOM manipulation and animations
- **Bootstrap 3** - Responsive framework
- **Font Awesome** - Icon library

## Quick Start

1. Clone or download this repository
2. Run using a local server (e.g., VS Code's Live Server extension)
3. Open `index.html` directly in your browser

```bash
# Start a simple server using Python
python -m http.server 8000

# Or using Node.js
npx serve
```

## Custom Configuration

### Modify Server Address

Edit the API endpoint in `assets/js/server-status.js`:

```javascript
const API_ENDPOINT = 'your-server-status-api.com';
```

### Update Contact Information

Locate the `#contact` section in `index.html` and update the corresponding contact details.

## Browser Support

- Chrome/Edge (latest versions)
- Firefox (latest versions)
- Safari (latest versions)
- Opera (latest versions)

## License

This project is intended solely for learning and communication purposes.