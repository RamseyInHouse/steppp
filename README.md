# Steppp

Easy, lightweight multi-step experiences.

## Usage

### Setting Up Steps

Define steps in your HTML and set an `data-steppp-active` attribute on the initial active step. Steps can be configured in two ways -- either as direct children of a target element:

```html
<div id="steppp">
  <section data-steppp-active>first</section>
  <section>second</section>
  <section>third</section>
</div>
```

...or within an element with a `data-steppp-wrapper` attached.

```html
<div id="steppp">
  <div data-steppp-wrapper>
    <section data-steppp-active>first</section>
    <section>second</section>
    <section>third</section>
  </div>
</div>
```

### Moving From Step to Step

Steppp comes with two API approaches -- an imperative (you dictate when it'll advance in your code) and declarative (behavior is described by setting various `data-steppp-*` attributes).

#### Imperative API

Create a new instance by calling `Steppp` and passing a target element. Functions will be returned for moving forward, backward, or directly to a specific step (see more on this below).

```js
const element = document.getElementById("targetElement");
const { forward, backward, moveTo } = Steppp(element);

document.querySelector("#forward").addEventListener("click", () => {
  forward();
});

document.querySelector("#backward").addEventListener("click", () => {
  backward();
});

document.querySelector("#moveToStepA").addEventListener("click", () => {
  moveTo("step_a");
});
```

#### Declarative API

The declarative approach requires you to create a new instance of Steppp like before, and then place specific `data-steppp-*` attributes in your markup. The elements on which these attributes are placed _must_ exist as children to the target element. As such, wrapping your steps within `data-steppp-wrapper` is required using this approach.

```js
const element = document.getElementById("targetElement");
Steppp(element);
```

Attach `data-steppp-forward` and `data-steppp-backward` attributes to elements in order to move those respective directions:

```html
<div id="steppp">
  <div data-steppp-wrapper>
    <section data-steppp-active>first</section>
    <!-- ...other steps -->
  </div>

  <button data-steppp-forward>Forward</button>
  <button data-steppp-backward>Backward</button>
</div>
```

You can also specify step names to jump directly from one step to another regardless of their "natural" order:

```html
<div id="steppp">
  <div data-steppp-wrapper>
    <section data-steppp-active>
      some step
      <button data-steppp-to="third_step">Go to Step</button>
    </section>
    <!-- ...other steps -->
    <section data-steppp-name="third_step">another step</section>
  </div>
  <button data-steppp-backward>Backward</button>
</div>
```

### Custom Events

Steppp provides several custom events that you can listen for and hook into.

```js
const element = document.getElementById("targetElement");
Steppp(element);
element.addEventListener("steppp:complete", (event) => {
  const { oldStep, newStep, element } = event.detail;
  // do something cool now that the step transition is complete
});
```

#### Available Events

These are the events you can hook into:

| Event Name      | Description                                                                                        |
| --------------- | -------------------------------------------------------------------------------------------------- |
| steppp:invalid  | This event fires when a step transition fails to start because the current step is invalid.        |
| steppp:abort    | This event fires when a step transition fails to start because the next step cannot be determined. |
| steppp:start    | This event fires when a step transition starts.                                                    |
| steppp:complete | This event fires when a step transition completes.                                                 |

