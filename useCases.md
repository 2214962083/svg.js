

# Tagged Animations

The user can tag and control the runner for any animation

```js

var animation = element
  .loop(300, true)
    .tag('first')
    .rotate(360)
    .translate(50)
  .animate(300, 200)
    .tag('second')
    .scale(3)

element.timeline.finish()
element.timeline.pause()
element.timeline.stop()
element.timeline.play()

```


# Absolute Timeline Times

The user can specify their time which is relative to the timelines time.


```js

var animation = element.animate(2000).move(200, 200)

// after 1000 ms
animation.animate(1000, 500, 'absolute').scale(2)


var runner = elemenet.move(0, 0).animate(1000)

// after 500ms
runner.move(200, 200)

```

This block of code would:
- Spend the first 1000ms moving the element
- At this time, it will snap the scale to 1.5 (halfway to 2)
- After this time, the scale and the move should go together


# Rotating While Scaling

The user may want to run multiple animations concurrently and have
control over each animation that they define.

```js

let animationA = element.loop(300, ">").rotate(360)
let animationB = element.loop(200, "><").scale(2)

// Maybe they want to disable a runner - which acts like pausing
animationB.active(false)

// Maybe they want to remove an animation matching a tag
animationB.tag('B')
element.timeline().remove('B')

// They can move around a runner as well
element.timeline()
    .schedule('B', 300, 'absolute') // Moves a runner to start at 300
        // time(currentAbsolute - newAbsolute)
    .shift('B', 300)    // Shifts the runner start time by 300
    // which is sugar to
    .schedule('B', 300, 'relative')
        // seek(shiftTime)

```

Lets demonstrate the difference between the schedule and shift

```
Given this:

    --------
        --------------
                    ----------------

Schedule:
                --------
                --------------
                ----------------

Shift:
            --------
                --------------
                            ----------------
```



# A Sequenced Animation

The user might want to be able to run a long sequenced animation that they have
predesigned as they please.

```js

let timeline = element.loop(300, "><").scale(2)
    .animate(300).rotate(30)
    .animate(300, 200).fill(blue)

// They might want to move forwards or backwards
timeline.seek(-300)

// They might want to set a specific time
timeline.time(200)

// Or a specific position
timeline.position(0.3)

// Maybe they want to clear the timeline
timeline.reset()

```


# User wants to Loop Something

If the user wants to loop something, they should be able to call the loop
method at any time, and it will just change the behaviour of the current
runner. If we are running declaratively, we will throw an error.

## Correct Usages

They can invoke this from the timeline

```js
element.loop(duration, times, swing)
```

If they want to work with absolute times, they should animate first

```js
element.animate(300, 200, true)
    .loop(Infinity, true)
```

Or alternatively, they could equivalently do this:

```js
element.loop({
    now: true,
    times: Infinity,
    delay: 200,
    duration: 300,
    swing: true,
    wait: [200, 300]
})
```

## Error Case



# Declarative Animations

The user might want to have something chase their mouse around. This would
require a declarative animation.

```js

el.animate((curr, target, dt, ctx) => {

    // Find the error and the value
    let error = target - current
    ctx.speed = (ctx.error - error) / dt
    ctx.error = error
    return newPos

})

SVG.on(document, 'mousemove', (ev) => {

  el.timeline(controller)
    .move(ev.pageX, ev.pageY)

})

```


## Springy Mouse Chaser

Pretend we gave the user a springy controller that basically springs to a
target in 300ms for example. They might be constantly changing the target with:

```js

el.animate(Spring(500), 200)
    .tag('declarative')
    .persist()
    .move(10, 10)

el.animate('declarative')
    .move(300, 200)



SVG.on(document, 'mousemove', function (ev) {

  el.animate(springy, 200)
      .tag('declarative')
      .move(ev.pageX, ev.pageY)

})

```


# Repeated Animations

The user might want to duplicate an animation and have it rerun a few times

```js

// User makes two copies of an animation
let animA = el.animate(300, 300, 'now')...(animation)...
let animB = animA.clone() // Deep copy

// Now let the user attach and reschedule their animations
el.timeline()
    .schedule(animA, 500, 'absolute')
    .schedule(animB, 2000, 'absolute')

```

Then the user can loop the timeline, by changing its play mode

```js
el.timeline()
    .loop(times, swing, waits)
```


# Advanced Animations

The user can create their own runners and then attach it to the timeline
themselves if they like.

```js

// They declare their animation
let rotation = () => new SVG.Runner().rotate(500)

// They attach an element, and schedule the runner
let leftAnimation = rotation().element(leftSquare).reverse()

// They might want to animate another
let rightAnimation = rotation().element(rightSquare)

// They can schedule these two runners to a master element
timelineElement.timeline()
    .schedule(leftAnimation, 300, 'absolute')
    .schedule(rightAnimation, 500, 'now')
    .schedule(rightAnimation, 300, 'end')

// Or they can schedule it to a timeline as well
let timeline = new SVG.Timeline()
    .schedule(leftAnimation, 300, 'absolute')
    .schedule(rightAnimation, 500, 'now')

```


# Modifying Controller Parameters

Some user might want to change the speed of a controller, or how the controller
works in the middle of an animation. For example, they might do:

```js

var pid = PID(30, 20, 40)
let animation = el.animate(pid).move(.., ..)


// Some time later, the user slides a slider, and they can do:
slider1.onSlide( v => pid.p(v) )

```


# Bidirectional Scheduling **(TODO)**

We would like to schedule a runner to a timeline, or to do the opposite

```js

// If we have a runner and a timeline
let timeline = new Timeline()...
let runner = new Runner()...

// Since the user can schedule a runner onto a timeline
timeline.schedule(runner, ...rest)

// It should be possible to do the opposite
runner.schedule(timeline, ...rest)

// It could be Implemented like this
runner.schedule = (t, duration, delay, now) {
  this._timeline.remove(this) // Should work even if its not scheduled
  t.schedule(this, duration, delay, now)
  return this
}

// The benefit would be that they could call animate afterwards: eg:
runner.schedule(timeline, ...rest)
    .animate()...

```

# Binding Events

The user might want to react to some events that the runner might emit. We will
emit the following events from the runner:
- start - when a runner first initialises
- finish - when a runner finishes
- step - on every step

Maybe they also want to react to timeline events as well
