# Blugia2 Project Plan

## Prompt Log

1. **"can you look at other websites for reference"** — Asked to look at reference sites for recreating blugia.net
2. **"So I want to recreate a website I have produced its called blugia.net"** — Goal: recreate blugia.net in React, starting with just the home page and same color schemes
3. **"make sure the footer goes all the way to the bottom of the screen not like what is on blugia.net"** — Footer must be sticky to the bottom of the viewport
4. **"on mobile view of the website blugia.net I have two drop down menus that come out on either side of the screen can you recreate that please?"** — Add two slide-out mobile menus: left = game categories, right = nav/social links
5. **"on the desktop version of the site there should be two information panels on the left and right side of the screen for organized links like the mobile menu except they are just there."** — Add persistent side panels on desktop in a three-column layout
6. **"look at blugia.net or serebii.net for examples"** — Reference sites for the desktop panel layout
7. **"add every prompt I have made or make to plan.md"** — Keep plan.md updated with all user prompts
8. **"the side panels menu and games should fill the block with its own color..."** — Restyle panels: remove Games/Menu headings, each category block gets #2f39b5 bg with white text
9. **"the sub links should each take up a different color or just make the entire panel background color be whitesmoke"** — Panel background: whitesmoke
10. **"3"** — Sub-links on whitesmoke background with dark text
11. **"have the dark text be black"** — Sub-link text color: #000000 black
12. **"on desktop instead of having the sections drop down on the panels can you just display the games without having drop down menus? also change the background color of the panels to whitesmoke."** — Desktop: static display, no dropdowns. Panels already whitesmoke.
13. **"yes. there is some weird spacing between contact and facebook on the right panel can you remove that please. also all of the bottom-borders for each item remove them, and replace full borders with the border color grey"** — Remove gap between Contact/Facebook, remove bottom-borders, add border: 1px solid grey on parent items
14. **"have the border be on the parent items such as GBC GBA NDS and the other contact and facebook items on the other panel"** — Borders only on parent blocks (GBC, GBA, NDS, Home, Forum, Contact, Facebook, Twitter), not sub-links
15. **"please disable the buttons on the right panel and add buttons for pokedex and submissions. also create pages for these two links"** — Replace right panel buttons with Pokedex/Submissions, create pages
16. **"lets disable all of the sections on the left panel except for GBA -> Fire Red. Lets make a page for fire red and disable Unbound"** — Trim left panel to GBA > Fire Red only, create Fire Red page
17. **"lets remove the back to home button on the fire red page and remove any other versions of that type of home button. It feels redundant with the home icon."** — Remove back-to-home buttons, redundant with header
18. **"at the top of the right panel lets create a search bar, that can search the website for any user input string"** — Add search bar to right panel
19. **"lets have the search button have the same background and styling as the other nav buttons"** — Match search bar styling to nav buttons
20. **"add a magnifying glass to it"** — Add magnifying glass icon to search
21. **"lets create a database in json for all of the first 151 pokemon..."** — Create JSON database of 151 Pokemon from PokeAPI (name, dex#, abilities, stats, images, locations)
22. **"lets make the feature we just talked about in btw"** — Build the Pokedex page with grid, detail panel, shiny toggle
23. **"lets make the buttons for shiny and default the same width so they dont move the images when the condition is changed."** — Fixed width shiny/default toggle buttons
24. **"so we are wanting to create the side panel nav buttons that I have previously mentioned. when a user is in fire red all buttons on the right side panel will only be viewable to that games version"** — Game-specific right panel nav (conditional on route)
25. **"the buttons that should show are the legendaries, gifts & trades, pokedex..."** — Fire Red nav: Legendaries, Gifts & Trades, Pokedex pages
26. **"The global nav buttons can still show but only render the games links underneath the nav section."** — Global nav stays, game links below
27. **"as long as there is a page in the fire red category for a pokedex and also a full pokedex to be updated later at the top nav thats what matters"** — Fire Red gets its own Pokedex copy
28. **"lets remove the search function inside the pokedex pages..."** — Remove Pokedex search, add encounter locations from PokeAPI, mobile 3-column grid
29. **"dont worry about listing what levels they appear at..."** — Skip level data for locations
30. **"That looks good but instead of listing the locations as items just list them as text..."** — Locations as comma-separated text, numbered order
31. **"Remove Kanto from the pokemon locations. its redundant."** — Strip "Kanto" prefix from locations
32. **"lets center the pokedex entries into the screen, when a user clicks on a pokedex entry on mobile lets create a pop up..."** — Center grid, mobile modal popup for detail view
33. **"id each card for the pokemon in the dex so that when a user uses the search tool it will automatically bring up the pokemon in the pokedex viewer."** — Deep-link to Pokemon via URL params + auto-select
34. **"Lets actually move the nav buttons underneath the section that acts as the home button..."** — Move global nav into a desktop nav bar under header
35. **"no keep the right panel up because it holds the placeholder info for the games when selected."** — Keep right panel for game-specific content
36. **"dont do this on mobile make it a desktop only feature"** — Nav bar desktop only
37. **"lets move the search bar into the nav section like we discussed..."** — Search bar in nav bar, align left, hover styling
38. **"lets have the text for the search function be black so it shows up on the nav bar. I want the magnifying glass to not be part of the search input..."** — Black search text, persistent magnifying glass icon outside input
39. **"can we create a event listener for the search bar so that when a user presses enter it will go to the closest related item?"** — Enter key navigates to top search result
40. **"shoot we need to add types to the pokedex..."** — Add Pokemon types to schema and fetch from PokeAPI
41. **"lets create a script for the search bar that helps the user find what they are looking for even if they typed the entry incorrectly..."** — Fuzzy search with Levenshtein distance for typo tolerance
42. **"lets replace the text blugia with the image named banner in the assets folder..."** — Replace header text with Banner.png, sized for mobile
43. **"I think the nav bar would look better if the nav elements were actually aligned left, and we move the links from the footer to the right side of the nav bar..."** — Nav left-aligned, social icons (fb/tw) on right, desktop only
44. **"footer shows 'Developed by Noah J. Houser'. on mobile view add all the icons to the bottom of the footer..."** — Mobile: social icons under footer text
45. **"okay looking at the pages for fire red. Are we able to remove the 'Fire Red ---' for each child section of a game?"** — Remove "Fire Red —" prefix from child page titles
46. **"but still be able to find it in the search function..."** — Keep search keywords, just change display titles
47. **"I accidentally had some border thing in the prompt remove that from our plan"** — Clean up plan
48. **"Alright we need to create a user log in database and gitignore it so no ones private info is obtained."** — Local JSON-based auth system, gitignored
49. **"logged in visitors will be able to submit feedback and be able to bookmark pages that would show in the middle part of the nav bar. Lets say they get up to 5 favs due to spacing limitations."** — Auth features: feedback submission, bookmarks (max 5) in nav bar

### Session 2 (2026-03-23)

50. **"Lets first add a prompt that asks the user if they would like to logout before submitting the logout button. Lets add a my profile button in the form of a face navicon and have that in between the socials and logout in the nav bar."** — Logout confirmation dialog, profile icon (face SVG) between socials and logout
51. **"lets create a search function on the profile page that lets users add pages to bookmark."** — Fuzzy search on Profile page to add bookmarks
52. **"lets create a page for fire red about items that appear in fire red and leaf green but do not mention leaf green. Lets create a database of all the items in the game from fire red using PokeApi if its available. The table should include the items name, its purchase price, its sell price, what it does, and where you can find it. If the item can be bought just say PokeMart."** — Fire Red Items page with PokeAPI data (name, buy/sell price, effect, location)
53. **"if it has no price because you cant purchase it leave a '?' in the section for its price but tell us where you find it."** — Non-purchasable items show "?" for price
54. **"on mobile view lets contain the item cards as rows showing a picture of what the item looks like followed by all data we know about it. Anything we cant get from pokeapi leave as a '?' and I can manually update it later."** — Mobile: card rows with sprite + all data, "?" for missing data
55. **"if we have a pokeapi key lets gitignore that as well. Might as well gitignore any key we have unless that prevents us from logging in."** — Gitignore any API keys (none found, PokeAPI is free)
56. **"okay lets add all the nav links that are on desktop view into the right panel for mobile. Make sure they appear before the game section"** — Mobile right slide-out: add Submissions, Pokedex, Profile/Login/Logout before game nav
57. **"id all the items so they show up in the search bar"** — Add all 307 items to fuzzy search with deep-linking (?item=id)
58. **"can you build a sitemap for me and put it at the bottom under the footer"** — Visual sitemap with 3 columns below footer
59. **"make the sitemap xml"** — Generate public/sitemap.xml
60. **"remove the sitemap links you just made and have a link to the xml sitemap at the bottom. maybe create a script that auto updates it every time we add a page"** — Replace visual sitemap with single link to sitemap.xml, auto-generate script from routes
61. **"lets create a filter the submissions form so that it quietly doesnt submit anything if any mention of genitalia or vulgar words are in the string."** — Silent profanity filter on client + server side
62. **"can you add all the prompts ive made today to plan.md"** — Update plan.md with all prompts
63. **"if I gitignore the authentication database will that mean that it wont work on netlify?"** — Question about deployment with gitignored auth data
64. **"I made an account with supabase how can I set that up for the authentication and feedback"** — Migrate auth system to Supabase for production deployment
65. **"Lets keep the Express server for now and build a version that works with supabase"** — Keep Express as local fallback, add Supabase for production
66. **"https://bbzwoswpiuulwmvvxnnh.supabase.co is the link. sb_publishable_... is the publishable key. is that what you needed"** — Provided Supabase credentials
67. **"it said success no rows returned is that fine?"** — Confirmed SQL table creation was successful
68. **"Email address 'blugia@blugia.local' is invalid"** — Supabase rejected .local domain, switched to @users.blugia.net
69. **"did I do something wrong I thought I allowed it to not accept emails"** — Guidance to disable email confirmation in Supabase Auth settings
70. **"can you add a second confirm password to the register field?"** — Added confirm password field to registration form
71. **"how do I know that my account is stored on supabase"** — Check Supabase Dashboard → Authentication → Users
72. **"perfect"** — Confirmed Supabase auth is working
73. **"is there anything in the app that should be gitignored before I push to the web?"** — Reviewed gitignore, everything covered
74. **"can you delete the user Blugia and their password on the express database?"** — Cleared local Express users.json
75. **"if I am not using express server on live is it also gitignored?"** — No, server code is in repo but won't run on Netlify (no secrets in it)
76. **"so with the supabase keys ignored it will run off netlify"** — Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Netlify env vars
77. **"i want to make these variables secret correct?"** — Anon key is designed to be public, secret setting optional
78. **"so what exactly do I add to the variables portion do I need to add as a file"** — No file, just key-value pairs in Netlify dashboard
79. **"how do I view the content feedback"** — Supabase Dashboard → Table Editor → feedback, or SQL Editor query
80. **"can you add the image favicon as the favicon please"** — Replaced favicon.svg with favicon.png from assets
81. **"add all the prompts ive made since the last one to the plan.md file"** — Update plan.md with all recent prompts

## Completed Work

- Scaffolded React + Vite project
- Built landing page with dark theme color palette
- Header with Banner.png branding
- Sticky footer (flexbox min-height: 100vh)
- Mobile: two hamburger slide-out menus (left = game categories, right = nav + global links)
- Desktop: three-column grid layout with persistent left/right side panels
- Responsive breakpoint at 768px
- Panels restyled: whitesmoke bg, #2f39b5 parent blocks, black sub-links
- Pokedex page with 151 Pokemon grid, detail panel, shiny toggle, locations, types
- Mobile Pokedex modal popup, 3-column grid
- Fire Red section with Legendaries, Gifts & Trades, Pokedex, Items sub-pages
- Game-specific right panel nav (conditional on /fire-red/* routes)
- Desktop nav bar with left-aligned links, search bar, social icons on right
- Fuzzy search with Levenshtein distance (typo-tolerant)
- Deep-linking to Pokemon (?pokemon=id) and Items (?item=id)
- Local auth system: Express server, bcrypt password hashing, UUID tokens
- Login/Register page, AuthContext, localStorage session persistence
- Profile page with username, bookmarks list, bookmark search
- Bookmarks (max 5) displayed in nav bar center section
- Logout confirmation dialog
- Profile nav icon (face SVG) between socials and logout
- Submissions page with auth-gated feedback form
- Profanity filter (client + server) — silently discards vulgar submissions
- Fire Red Items page with 307 items from PokeAPI (sprite, name, buy/sell, effect, location)
- Mobile nav links in right slide-out (Submissions, Pokedex, Profile/Login/Logout)
- XML sitemap with auto-generate script (npm run generate-sitemap)
- Sitemap link in footer bar
- data/users.json and data/feedback.json gitignored

### Session 3 (2026-03-24)

82. **"the login feature isnt showing up on live"** — Login not appearing on Netlify production site
83. **"is env.local ignored and thats why its not picking up?"** — Diagnosed as Chrome cache issue
84. **"clearing the cache on chrome fixed it but how do i prevent that in the future"** — Added _headers file for Netlify
85. **"i use netlify"** — Created public/_headers
86. **"can you create a redirect file to my public directory"** — Created public/_redirects for SPA routing
87. **"lets edit the items ui schema so that each item has a different background color"** — Alternating silver/gold rows
88. **"lets make the items.css global so that it will affect other games"** — Moved Items.css to src/styles/
89. **"actually center all the fields except for effect and name"** — Centered all except name/effect
90. **"can we create like a static button that appears when a user scrolls over 300vh"** — Back-to-top button
91. **"change the scroll distance to 100vh"** — Trigger at 100vh
92. **"on mobile view can we move the hamburger menus to the top section with the banner"** — Hamburgers in header
93. **"On mobile have the buy and sell next to each other in the same row"** — Buy/sell side by side
94. **"how intense would it be to design a forum right now"** — Forum assessment
95. **"Medium forum"** — Medium scope chosen
96. **"Public reading" / "Both"** — Public + game/general categories
97. **"I only want users to be able to create 3 posts a month"** — Post rate limits
98. **"I would also like to create a flag for verified users"** — Verified badges and roles
99. **"lets have the button for the forum in the same section as submissions and pokedex"** — Forum nav placement
100. **"lets remove the forum feature entirely"** — Removed forum
101. **"hey remove the second hamburger menu on mobile please"** — Removed old navbar
102. **"completely remove any mention or use of the forum"** — Clean removal confirmed
103. **"something is happening with the authentication when we visit a page that doesnt exist"** — Auth debugging begins
104. **"not just logged out but the login button goes away"** — Loading state stuck
105. **"Is there a way to force it to load first and then load the page?"** — Loading spinner gate
106. **"when I type blugia.net/a/ it goes into a loading screen that never stops"** — getSession() hanging
107. **"Chat gpt said that this line of code is too aggressive"** — Refined to 401/403 only
108. **"Please revert to the commit titled Hotfix Mobile Menus"** — Reverted to c00b292
109. **"something is happening with the authentication when we visit a page that doesnt exist"** — Re-investigated
110. **"is it possible that the site just loads too quickly"** — Timeout racing added
111. **"okay my option for keys are: Publishable Key, Secret Key, Anon Public..."** — Wrong key identified
112. **"This is the anon public key: eyJ..."** — Fixed .env.local
113. **"this is the api URL just for checking purposes"** — URL confirmed
114. **"so we visit the /a/ and the login button shows up but once we visit the login page..."** — UI unresponsive after login
115. **"When I click on login nothing happens"** — Debug logging
116. **"still on the login page"** — window.location workaround
117. **"okay im logged in but havent tried going to /a/ yet"** — localStorage sync approach
118. **"it looks like im logged out and login button is broken"** — All async calls hanging
119. **"when i enter the console it returns []"** — Session not persisting
120. **"yes when I log in a blugia.auth token is created"** — Explicit storage config fixed persistence
121. **"going to /a/ redirected me back to the home page..."** — Auth persists, logout hangs
122. **"I am able to log in but haven't gone to /a/ yet"** — Navigator Lock API root cause found
123. **"going to /a/ redirected me back. Bookmarks visible, logout works."** — Everything working!
124. **"So what is the users and the bookmarks stored locally now?"** — Data in Supabase, token in localStorage
125. **"on mobile view lets add the bookmarks to the right info panel"** — Mobile bookmarks section
126. **"Lets do the same thing for Navigation only on mobile"** — Navigation header
127. **"clicking on a bookmark in mobile view doesnt pull the user to the item"** — Fixed mobile scroll
128. **"please make the right panel bookmarks section only on mobile"** — Desktop hides bookmarks section
129. **"make it so on mobile when you click a bookmark on items list you scroll down"** — Item popup modal on mobile
130. **"Also please add the search function on mobile to the right panel"** — Search in mobile panel
131. **"on mobile view have the magnifying glass just outside of the search input"** — Styled mobile search
132. **"can you help me add my google analytics tag"** — Added GA4 G-GDWZ0ZV327
133. **"I think that it for now just append all the prompts"** — This update

## Completed Work — Session 3

- Netlify _headers (cache-control) and _redirects (SPA routing)
- Items table: alternating silver/gold rows, rounded borders, centered fields
- Shared Items.css in src/styles/ for cross-game reuse
- Back-to-top scroll button (100vh trigger)
- Mobile hamburger menus moved into header/banner
- Buy/sell side by side on mobile item cards
- Forum feature built and removed (using Discord instead)
- Catch-all route for 404s (redirects to /)
- Auth error handling with try/catch/finally
- Fixed wrong Supabase anon key (sb_publishable_ -> eyJ... JWT)
- Fixed Navigator Lock API deadlock in Supabase auth-js v2.100.0
- Synchronous session reading from localStorage on init
- Explicit Supabase storage config (persistSession, storageKey, lock bypass)
- Google Analytics GA4 (G-GDWZ0ZV327)
- Mobile bookmarks section with header in right panel
- Mobile navigation header
- Search bar in mobile right panel
- Item popup modal on mobile (matching Pokedex pattern)
- Mobile-only bookmarks section (hidden on desktop)
- Styled mobile search with magnifying glass icon
