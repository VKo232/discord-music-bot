# qwertyuiop232-bot



### HOW TO RUN
1. `yarn start`

### How it works
- config.ts is where we define the important secret variables
- `index.ts` is the entry point
-  

## Set up FOR NEW DEVELOPERS
- install npm: https://nodejs.org/en/ use 18.14.1 
- install vscode: https://code.visualstudio.com/download
    - get any javascript extension on vscode
- install yarn: `npm install --global yarn`
- install git (64-bit standalone installer):https://git-scm.com/download/win 
- `git checkout https://github.com/VKo232/its-rough.git`
- `git pull` Use this to get the latest updates
- `yarn` installs necessary files

## How to work on a task
1. `git checkout main && git pull` to get the latest updates! 
2. `git checkout -b feat/new-branch` to start working on your feature
3. If you want to push some changes onto your branch
    - `git add .`
    - `git commit -m "A HELPFUL MESSAGE"`
    - `git push`
4. Once you are sure you have finished and want to move it to main
    - `git fetch origin/main`
    - `git rebase origin/main`
    - `git push -f`
    - `git checkout main` to go back to the main branch
5. Then go on github and make a pull request

## connecting to a server
opc@192.18.148.250