Boneless is meant as a tool to display websites without the overhead of tabs, decorations, and other interface elements that can make it bloaty.

This is NOT meant as a browser. It's meant for displaying websites that don't change often in spare monitors/desktops.

It supports up to 4 different websites displayed at the same time.

It provides 16 different tiling layouts to choose from.

It supports saving configurations as presets, to easily jump between different experiences.

It supports changing the theme color, which affects the top panel and application windows.

Proportions for each tiled webview can be configured.

### Installation

Creating a build is recommended so the application's config files don't reside in the generic Electron directory.
There is a script to create a build (create_builds.sh)
You can modify this to target your platform or architecture.
You will need to install electron-packager before running the script:
>npm install -g electron-packager

Building it is optional.
To run it manually with Electron:
>npm install -g electron
>electron index.js

### Screenshots

![](https://i.imgur.com/AsiATvR.jpg)

![](https://i.imgur.com/ObhnEyN.png)

![](https://i.imgur.com/wLuuIqH.png)