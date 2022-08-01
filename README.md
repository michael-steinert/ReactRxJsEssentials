# React and RxJS Essentials

## RxJS

- RxJS is using observable Subjects
- A Subjects can be any Piece of Data
- Observable means that the Value of a Subject could change over Time and it is possible to subscribe to it
- A Subject get a new Value through the Method `next()` and then any Subscriber see those Changes
- A `BehaviorSubject` stores its most recent Value and makes it easy to use
- The Hook `useEffect` is used to subscribe to a Subject
