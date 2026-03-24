# Readme Start
The plan of the build for this midterm assignment is to reproduce a website I have created before but finish it. My passion in life is playing videogames and one game I like to play is Pokemon. I like to play romhacks, modified games based on the generation 3 and 4 pokemon games. My only issue is that when I get stuck in a game theres no FAQ or wiki to help you if you hit a wall.

So lets talk about the features of this app and what our intentions and goals are based on the assignment.

## Features

- The first feature of the site is to have a pokedex database that will be stored localy via json, and displayed to each pokemon game based on whats included. Users will be able to search for said pokemon. in a search bar on the site. X

- The second feature is to create a user login database that will be stored locally or through a cloud service X X
    - Create a feature that lets users bookmark up to five links for quick access. X

- The third feature is to create a contribution button that requires a user to be logged in to donate issues that they have in the romhacks they are playing so I can triage issues in games and spend time solving problems. X


- The fourth feature of the webapp is to create an item guide, listing items in a seperate locally stored database and plug and chug the information on items, the game mechanics behind them, and a blank property that will be updated on where to find said item for each game.

- Create a forum for users to also post and talk about the games

Production:

We started using Claude to create the pokedex entries. For this assignment I decided to just go off of the base games un modded as a demo. 

We created a search bar with the help of Claude, originally the search bar would find content that had been categorized and you would click for what you were looking for, however we added subfeatures such as: 
- fuzzysearch.js that allows mistyped user entries to be compared to actual ones allowing spelling mistakes and no spaces to spit out the desired info.

-We created a user authenitcation script with claude. It stores user info in json. Claude installed bcryptjs to help secure the data. and created state hooks to create a json database that will keep everyone organized.

- We set up Supabase to handle our login feature and feedback collector. 

- We also created the form to submit user feedback. If the user isnt logged in they will be politely asked to log in if they would like to submit.

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
