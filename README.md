# React Discord Clone

> Functional Discord Clone using React, Socket IO, NodeJS, Express and MySQL

Currently learning WebRTC to implement voice!

Originally started off on a test project for learning Functional Components, Hooks, Socket IO and TypeScript ended up being a Discord Clone.

![layout image](public/app.png)

Live Version http://ericellb.github.io/React-Discord-Clone

API https://github.com/ericellb/React-Discord-API

### Important

If you need to use my backend api change the env variable `REACT_APP_API_URL` in `.env` to `https://simple-chat-apix.herokuapp.com`, otherwise host the API yourself and set this environment variable appropriately.

## Features

Implemented Features

- [x] Real time messaging using Socket IO
- [x] Local Authentication
- [x] Loads User Data upon login (Servers, Channels, Private Messages)
- [x] Creation and Joining Servers
- [x] Creation of Channels in a Server
- [x] Server Settings (Change name and delete)
- [x] Channel Settings (Change name and delete)
- [x] Persistent channel history
- [x] Pretty Print Code Blocks enclodes in three `
- [x] Private messaging
- [x] Timestamps for messages
- [x] Show current active users in given server
- [x] Convert to Typescript (Still need to fix a lot of any types i applied)
- [x] Voice Chat (Still work to do, but main functionality works)

Planned Features

- [] Bug fixes + optimize

## License

Copyright Eric Ellbogen 2019

- This project is under the **GNU V3** license. [Find it here](https://github.com/ericellb/React-Discord-Clone/blob/master/LICENSE).
