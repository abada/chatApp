
Example code for TiDAKeyboardControl
====================================

In this folder you’ll find 2 different files. This is the explanation of both.


`automatic.js`
--------------

This example file shows the preferred way of using this module.

Instead of listening to `keyboardchange` events and moving the ‘toolbar’ accordingly, we just let the module manage it for us.

This happens in three steps.

```js
Ti.UI.createWindow({              /* 1 */
    keyboardPanning: true,        /* 2 */
    lockedViews: [ textareaview ] /* 3 */
});
```

1.	Create a container view which will be the host for keyboard notifications;
2.	setup the notifications with `keyboardPanning: true`;
3.	add our ‘toolbar’ to the list of views whose `.transform` will be managed by *TiDAKeyboardControl*.

`manual.js`
-----------

This example code uses the `"keyboardchange"` event in the host container view to update manually the `.transform` property of our ‘toolbar’.

This kind of implementation may cause a little glitch scrolling up and down the keyboard.
The slowness during the toolbar's repositioning is caused by a performance issue but shows how we can do pretty whatever we want with this module.
