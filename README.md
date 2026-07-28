# Omed Abdala Portfolio

A responsive three-page portfolio built with semantic HTML, modern CSS and vanilla JavaScript.

## Files
- `index.html` — main storytelling portfolio page
- `works.html` — separate project archive
- `contact.html` — personal introduction, direct contact details, social links and Netlify email form
- `css/styles.css` — responsive design and animation
- `js/app.js` — mobile menu, reveals, filters and project dialogs
- `assets/cv/Omed-Abdala-CV.pdf` — downloadable CV

## Deploy
For GitHub Pages, upload **all files and folders inside this `omedabdala` folder** to the repository root. Do not upload only the HTML files and do not upload the ZIP itself. The `assets/images/projects` folder and `js/app.js` must be committed too.

## Contact links
The contact page currently uses `@omedabdala` for Instagram and `omedabdala` for Behance. Replace those two URLs in `contact.html` if your profile usernames are different.

## Adding another client project

The project cards are generated from one reusable list in `js/app.js`. Search for:

`CLIENT PROJECTS — ADD NEW CLIENTS HERE`

1. Put the new 2000×1400 cover and gallery images in `assets/images/projects/`.
2. Duplicate the Danex project object in `projectList`.
3. Change the unique `id`, title, descriptions, Instagram link, cover and gallery image paths.
4. Keep `showOnHome: true` to include the client on Home. Home displays a maximum of six clients in a 3-column desktop grid; Works displays every project automatically.

No Home or Works HTML card needs to be copied manually.
