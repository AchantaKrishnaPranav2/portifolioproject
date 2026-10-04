Krishna Pranav | Nature & Wildlife Photography

A personal photography portfolio showcasing wildlife, birds, insects, animal portraits and quiet landscapes, all shot with a single camera in natural light.

Live site: https://achantakrishnapranav2.github.io/portifolioproject/

About

"Photography is how I pause, look closer, and hold on to the feeling of a moment."

This portfolio collects photographs made with patience and a little luck: a kingfisher holding still, a baya weaver at its nest, a dog's eyes in warm light. No studio, no staging, just observation and timing.

Features
Filterable gallery with 29 photographs across four categories:
Wildlife & Avian (14)
Animal Portraits (7)
Nature & Twilight (4)
Fine Art (4)
Lightbox viewer with keyboard navigation (← / → to browse, Esc to close)
Photo series: single-session story collections (Kingfisher, Indian Robin, Baya Weaver, Dog in the Shine, Sacred Light)
Stories / field notes section with write-ups linking to Instagram
About section and a contact / suggestions form
Responsive layout with a "skip to main content" link for accessibility
Sections
Section	Description
Home	Hero image and introduction
Gallery	Selected frames and the full filterable collection
Series	Grouped photo sets from a single session
About	Photographer's bio and approach
Stories	Field notes and behind-the-lens posts
Contact	Email, suggestions form and social links
Project Structure
portifolioproject/
├── index.html
├── images/
│   ├── BIRDS/      # Bird and wildlife photographs
│   ├── DOGS/       # Animal portraits
│   └── ...         # Landscapes, fine art and other shots
└── README.md

Adjust the tree above to match your actual files (for example, separate css/ and js/ folders if you have them).

Run Locally

No build step is needed for a static site.

bash
# Clone the repository
git clone https://github.com/achantakrishnapranav2/portifolioproject.git
cd portifolioproject

# Option 1: open index.html directly in your browser

# Option 2: serve it locally
python3 -m http.server 8000
# then visit http://localhost:8000
Deployment

The site is hosted on GitHub Pages. To deploy your own copy:

Push the project to a GitHub repository.
Go to Settings → Pages.
Under Source, choose the main branch and the root folder.
Save. The site will be live at https://<username>.github.io/<repo-name>/.
Adding New Photos
Add the image file to the appropriate folder inside images/.
Add a new gallery entry in index.html with a title, category, short caption and descriptive alt text.
Update the category counts in the filter buttons.
Commit and push; GitHub Pages will redeploy automatically.

Tip: compress images (for example with Squoosh or TinyPNG) before adding them, to keep page loads fast.

Connect
Instagram: @kp_lenzz
Behance: krishnaachanta1
