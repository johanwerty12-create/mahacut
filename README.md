# The Craft — beginner haircutting school

A responsive haircutting course with eight foundation lessons, eight pattern studies, eleven complete haircut processes, a two-week practice plan, searchable quick reference, knowledge checks, and browser-saved progress. Each full haircut has sixteen illustrated stages, an eight-photo timeline, four finished angles, and a before/after comparison. Practice images link to the matching process stage. Pattern studies have six slides, fade-height and taper comparisons, and approximate guard references. The project uses plain HTML, CSS, and JavaScript, local image assets, and no build step.

## Run locally

Open PowerShell in this project folder and run:

```powershell
node server.cjs
```

Then open <http://127.0.0.1:8000> in a browser. Keep the terminal running while using the site.

Use the same localhost address each time so the browser can find the progress it saved.

Training images are generated illustrations. They demonstrate the progression and visual shape; learners rehearse on a mannequin and check their own tool system before cutting. Contact-sheet crop boundaries are recorded in `haircut-walkthroughs-data.js` to keep individual frames free of neighboring panels.
