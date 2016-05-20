# OAuth client

This is a use case for [`u-machine` module](https://github.com/DmitryMyadzelets/u-machine). The module helps you design complex behavior of your software using state machines.

This folder contains a fully functional [OAuth](https://en.wikipedia.org/wiki/OAuth) client. It uses Facebook as an authentication provider where you should [register your application](https://developers.facebook.com/docs/apps/register). However, you can add any authentication provider such Google, Twitter etc.

## See it working

1. Download or clone the [`u-machine` module](https://github.com/DmitryMyadzelets/u-machine).
2. Go to `u-machine/examples/oauth-client/` and execute `npm install`. It will install packages `express` and `request`.
3. Edit `index.js` file putting your app's id, secret code and url.
4. Launch it: `node .`, open browser and navigate to your app.

## How it is made

![State machine for facebook](https://github.com/DmitryMyadzelets/u-machine/raw/master/examples/oauth-client/mics/facebook-state-machine.png)
