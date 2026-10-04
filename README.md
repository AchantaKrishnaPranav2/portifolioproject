# Krishna Pranav | Nature & Wildlife Photography
 
A personal photography portfolio showcasing wildlife, birds, insects, animal portraits and quiet landscapes, all shot with a single camera in natural light.
 
**Live site:** https://achantakrishnapranav2.github.io/portifolioproject/
 
---
 
## About
 
> "Photography is how I pause, look closer, and hold on to the feeling of a moment."
 
This portfolio collects photographs made with patience and a little luck: a kingfisher holding still, a baya weaver at its nest, a dog's eyes in warm light. No studio, no staging, just observation and timing.
 
## Features
 
- **Filterable gallery** with 29 photographs across four categories:
  - Wildlife & Avian (14)
  - Animal Portraits (7)
  - Nature & Twilight (4)
  - Fine Art (4)
- **Lightbox viewer** with keyboard navigation (← / → to browse, `Esc` to close)
- **Photo series**: single-session story collections (Kingfisher, Indian Robin, Baya Weaver, Dog in the Shine, Sacred Light)
- **Stories / field notes** section with write-ups linking to Instagram
- **About** section and a **contact / suggestions** form
- Responsive layout with a "skip to main content" link for accessibility
## Sections
 
| Section | Description |
|---|---|
| Home | Hero image and introduction |
| Gallery | Selected frames and the full filterable collection |
| Series | Grouped photo sets from a single session |
| About | Photographer's bio and approach |
| Stories | Field notes and behind-the-lens posts |
| Contact | Email, suggestions form and social links |
 
## Project Structure
 
```
portifolioproject/
├── index.html
├── images/
│   ├── BIRDS/      # Bird and wildlife photographs
│   ├── DOGS/       # Animal portraits
│   └── ...         # Landscapes, fine art and other shots
└── README.md
```
 
> Adjust the tree above to match your actual files (for example, separate `css/` and `js/` folders if you have them).
 
## Run Locally
 
No build step is needed for a static site.
 
```bash
# Clone the repository
git clone https://github.com/achantakrishnapranav2/portifolioproject.git
cd portifolioproject
 
# Option 1: open index.html directly in your browser
 
# Option 2: serve it locally
python3 -m http.server 8000
# then visit http://localhost:8000
```
 
## Deployment
 
The site is hosted on **GitHub Pages**. To deploy your own copy:
 
1. Push the project to a GitHub repository.
2. Go to **Settings → Pages**.
3. Under **Source**, choose the `main` branch and the root folder.
4. Save. The site will be live at `https://<username>.github.io/<repo-name>/`.
## Adding New Photos
 
1. Add the image file to the appropriate folder inside `images/`.
2. Add a new gallery entry in `index.html` with a title, category, short caption and descriptive alt text.
3. Update the category counts in the filter buttons.
4. Commit and push; GitHub Pages will redeploy automatically.
Tip: compress images (for example with Squoosh or TinyPNG) before adding them, to keep page loads fast.
 
## Connect
 
- **Instagram:** [@kp_lenzz](https://www.instagram.com/kp_lenzz/)
- **Behance:** [krishnaachanta1](https://www.behance.net/krishnaachanta1)
## License & Copyright
 
All photographs © Krishna Pranav. All rights reserved. Images may not be copied, reproduced or used without written permission.
 
The site code may be reused under the [MIT License](LICENSE) (add a LICENSE file if you choose this option).
