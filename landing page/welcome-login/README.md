# Getting Started with the Ethisim Landing Page

## How to get the Landing Page Front-end Running
1. Download node.js version 12.18.4 and npm https://www.npmjs.com/get-npm
2. Clone the Github repository
3. cd into this folder (fett-t7/welcome-login)
4. Run "npm install", This should install all dependencies! If this doesn't work see the subsection below
5. To run the front-end, use "npm start" to run the development build at localhost:3001
6. You are done! but note that you will need to have the simulator and editor running as well for the routing to work.

### You can complete all of these steps by just using npm install
#### Install Dependencies
    - npm install react@16.13.1
    - npm install react-device-detect@1.14.0
    - npm install react-dom@16.13.1
    - npm install react-flow-renderer@6.1.3
    - npm install react-router-dom@5.2.0
    - npm install react-scripts@3.4.4
    - npm install @material-ui/core@4.11.0
    - npm install @material-ui/icons@4.9.1
    - npm install @material-ui/lab@4.0.0-alpha.56
    - npm install @testing-library/jest-dom@5.11.4
    - npm install @testing-library/react@11.0.4
    - npm install @testing-library/user-event@12.1.6
    - npm install axios@0.21.0
    - npm install start@5.1.0
    - npm install suneditor-react@2.14.2

#### How to install Prettier, Eslint and Husky
    1. Npm install --save-dev --save-exact prettier will install prettier
    2. Make sure to install eslint before installing eslint-config-prettier which allows prettier and eslint to work together nicely
    3. Npm install eslint --save-dev will install eslint
    4. Run npx eslint --init to set up an configuration file
       - Questions will appear and the directions tell you to use arrow keys to select an answer even though the arrow keys don’t work.
       Think of the options presented to you in each question as an array starting at 0 or 1.
       If you want for example option one out of three for the second question,
       then type in 0 to the command line and press enter and that should select the answer that you want.
       - Answer all the questions before moving forward, if you mess up on one of the answers, just press Ctrl^C and re-run the npx eslint --init command
    5. You might also need to install eslint-plugin-react@latest, if so follow the directions on the command line after finishing the previous step
    6. Make sure prettier and eslint are both installed  before we run npm install --save-dev eslint-config-prettier so prettier and eslint will work together nicely with each other
    7. Then, add eslint-config-prettier to the "extends" array in your .eslintrc.* file. Make sure to put it last, so it gets the chance to override other configs. It might already be there.
    { "extends": [ "some-other-config-you-use", "prettier"]}
    8. To install Husky Make sure Prettier is installed and is in your devDependencies before you proceed and then run npx mrm lint-staged
    9. This will install husky and lint-staged, then add a configuration to the project’s package.json that will automatically format supported files in a pre-commit hook. After this step you are done
