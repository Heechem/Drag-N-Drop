# Drag and Drop TO DO App 

[Live Demo](https://drag-todo.netlify.app/)


![image](https://github.com/Heechem/Drag-N-Drop/assets/117024247/abc4501b-0b4f-4235-aab0-3af8d8ccca70)


## Overview

Welcome to the Drag and Drop To-Do App! This application allows you to create and manage tasks through an intuitive drag-and-drop interface. You can organize your tasks by creating columns and easily move them between different columns.

## technologie used :

This project is built using the following technologies:

- React
- TypeScript
- Tailwind CSS
- DnD Kit (Drag and Drop Library)
- Vite (Frontend Build Tool)


## Deployment
The application is hosted on Netlify, and you can access it through the Live Demo link. Enjoy managing your tasks with the power of drag and drop!

---------------------------------------------------------------------------------------------------------------------------------------------------------------------



This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
