# Game Format

Grid size defined in script.js. Assuming for now it's 20[x20]

## Rows

Game is defined by an object containing 20 rows, each row has a cells object in order. Showing 2 here as an example.

```js
{
  "rows": [
    {
      "cells": []
    },
    {
      "cells": []
    }
  ]
}
```

## Cell

A cell can be one of the following types:

- `null` - Null: Empty cell
- `HasValue` - String: Cell with a value either already set or expects to be entered by the user.

```js
{
  "type": null,
}
```

If `HasValue`, the cell will have a value property with an empty or non-empty string.

```js
{
  "type": "HasValue",
  "value": "A"
}
```

If empty, the cell must describe its arithmetic in terms of relative position
For example, if this were the first three horizontal cells and this was the last cell to be filled in
by adding the first two. It must also have an answer property.

```js
{
  "type": "HasValue",
  "value": "",
  "answer": "🌧️",
  "arithmetic": [
    {
      "direction": "h",
      "operation": "add",
      "operands": [
        {
          "row": 0,
          "cell": 0
        },
        {
          "row": 0,
          "cell": 1
        }
      ]
    }
  ],
  "choices": [
    "🌧️",
    "🌞",
    "🌪️",
    "🌈",
    "🌊",
    "🌋",
    "🌎",
    "🌙",
    "🌟",
    "🌠",
    "🌡️",
    "🌤️",
    "🌥️",
    "🌦️",
    "🌧️",
    "🌲",
    "🌳",
    "🌴",
    "🌵",
    "🌷",
  ]
}
```