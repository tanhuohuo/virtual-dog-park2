# Virtual Dog Park

A dog encyclopedia and virtual pet website built for a first-year programming lab.

## Project description

Virtual Dog Park is a small website written with plain HTML, CSS and vanilla JavaScript. It
does two things. First, it teaches you about three dog breeds. Second, it lets you adopt one
virtual dog, look after it, and watch it grow. There is no backend, no framework and no
external service involved.

## Features

- **Dog Encyclopedia** - three breeds (Beagle, Golden Retriever, Poodle). Each breed has its
  own illustration and short notes about size, personality and everyday care.
- **Adoption** - choose a breed, type a name (up to 20 characters, not blank) and click Adopt.
- **Feed and Play** - each click adds 10 happiness. Happiness never goes above 100.
- **Next Day** - moves the dog forward one day and takes away 5 happiness. Happiness never
  goes below 0.
- **Growth** - Day 1 is a Puppy, Days 2-3 are a Young Dog, and Day 4 onward is an Adult Dog. A
  growth bar and the dog illustration change size with the stage, and the stage name is also
  written out in text.
- **Saved progress** - the adopted dog is saved in the browser and restored after a refresh.
- **Start Over** - asks for confirmation before deleting the saved dog. Cancel keeps the dog.

## How to preview

A local server is required. Opening the page from a `file://` address will make browser
storage behave inconsistently.

1. Open the `virtual-dog-park` folder in VS Code.
2. Right-click `index.html` in the Explorer.
3. Choose **Open with Live Server**.
4. The page opens at an address such as `http://127.0.0.1:5500`.

Keep using the same browser and the same local address while testing saved progress.

## Growth and happiness rules

| Rule | Value |
| --- | --- |
| Starting state | Day 1, Puppy, happiness 50 |
| Feed or Play | +10 happiness per click |
| Maximum happiness | 100 |
| Next Day | +1 day, -5 happiness |
| Minimum happiness | 0 |
| Day 1 | Puppy |
| Days 2-3 | Young Dog |
| Day 4 onward | Adult Dog |

## Where the saved progress lives

Pet progress is stored with `localStorage` inside your own browser, under the key
`virtualDogParkPetV1`. It holds one dog at a time: its name, breed, day and happiness.

This is **not** an online account and it is **not** uploaded anywhere. The saved dog stays on
this one browser on this one device. Clearing your browser data, or clicking Start Over and
confirming, removes it. Because it is stored only in the browser, `localStorage` is never
committed to Git and no personal information ever reaches the repository.

## Manual testing checklist

Run through these in the browser before submitting:

- [ ] All three breed cards show an illustration and their care notes. No broken images.
- [ ] Adopting with a blank name (or only spaces) is rejected, and a helpful message appears.
- [ ] A name with leading or trailing spaces is trimmed. Spaces inside the name are kept.
- [ ] A valid name is adopted and the dog appears on Day 1, Puppy, happiness 50.
- [ ] Feed and Play each raise happiness by 10, and it stops at 100.
- [ ] Next Day raises the day by 1 and lowers happiness by 5, never below 0.
- [ ] Day 2 and 3 show Young Dog; Day 4 shows Adult Dog. The growth bar has three visibly
      different states.
- [ ] A name containing `<` and `>` is displayed as plain text, not run as HTML.
- [ ] Refreshing the page brings the same dog back with its latest day and happiness.
- [ ] Start Over asks for confirmation. Cancel keeps the dog. Confirm clears the saved dog.
- [ ] Narrow the browser window and check every card stays readable with no sideways scrolling.

## A note on the illustrations

The three SVG dog illustrations are simple drawings created for this project. They are not
photographs and no copyrighted photographs are used anywhere on the site.

## Files

- `index.html` - page structure
- `style.css` - layout and appearance
- `script.js` - adoption, care, growth and saved progress
- `assets/beagle.svg` - Beagle illustration
- `assets/golden-retriever.svg` - Golden Retriever illustration
- `assets/poodle.svg` - Poodle illustration
