# LEGACY / BACKUP — UI V1

Do not import this folder from the running app.

This is a full visual backup of the pre-rebuild interface:

- `App.jsx` — V1 page
- `index.css` — V1 styles
- `components/` — AmbientBackground, DishReel, FoodCard, DishArt, ResultCard, SpinButton

Business data stays in `src/data/dishes.js`.
Weighted pick + spin math stays in `src/lib/pickDish.js` and `src/hooks/useDishSpin.js`.

Repo had no git history at backup time, so there is no `ui-v1-backup.patch`.
Rollback: point `src/App.jsx` at this tree and restore `src/index.css` from here.
