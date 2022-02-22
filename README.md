# [Cascade.page](https://cascade.page)
Inspired by @cheeaun's [life](https://github.com/cheeaun/life).

Cascade.page is a text-to-timeline tool. You write markdown-ish text and it gets converted into a nice looking cascading timeline. 

Use it [here](https://cascade.page).

<br>
<br>

### Table of contents
- [Cascade.page](#cascadepage)
    - [Table of contents](#table-of-contents)
  - [Syntax Quick Reference](#syntax-quick-reference)
  - [Cascade](#cascade)
    - [Header](#header)
      - [Tags and colors](#tags-and-colors)
    - [Events](#events)
      - [Event Description](#event-description)
    - [Date Ranges](#date-ranges)
      - [Dates](#dates)
  - [Saving and sharing](#saving-and-sharing)
  - [Public by default](#public-by-default)

<br>
<br>

## Syntax Quick Reference
| Item                                                                                   | Syntax                                                       | Example                                                                                                                               |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Event                                                                                  | `[DateRange]:[EventDescription]`                             | `08/2015-05/2017: CS degree #Education`                                                                                               |
| DateRange                                                                              | `[Date][-Date]`                                              | `1998-06/01/2000`                                                                                                                     |
| Date. `now` is a special keyword which means what you think it does                    | `[HumanDate\|ISO8601\|now]`                                  | `01/30/1888`                                                                                                                          |
| HumanDate (American format of Month/Day/Year or Month/Year or just Year)               | `[m/d-]yyyy`                                                 | `2002` or `01/2002` or `12/25/1901`                                                                                                   |
| ISO8601 format. The `T` and `Z` are required.                                          | `YYYY-MM-DD`T`HH:MM:SS:MS`Z                                  | `1859-05-09T12:01:01Z`                                                                                                                |
| Event description                                                                      | `([text]\|[Tag]\|[Location]\|[Link]\|[Photos])*`             | Can span multiple lines. Anything after an event up to the next even is considered as part of the description for the previous event. |
| Tag                                                                                    | `#[tag name]`                                                | `1999: The Matrix #Movies`                                                                                                            |
| Location                                                                               | `[location name](location\|map)`                             | `02/23/1836: Battle of the Alamo (The Alamo, TX)[map]`                                                                                |
| Link                                                                                   | `[display text](link)`                                       | `05/25/2021: [cascade.page](https://cascade.page) featured on [Hacker News](https://news.ycombinator.com/item?id=27282842)`           |
| Photos. Has to be a public link! Currently only one photo link per event is supported. | `<something that looks like a google photos shareable link>` | `07/2017: 4th of July in DC https://photos.app.goo.gl/d418j6GSkCD5LGmY8`                                                              |
| Comment                                                                                | `//[text]`                                                   | `// this is a comment`                                                                                                                |
| `tag` should be `color` color. Only applicable in the [header](#header).               | `#[tag name]: <color>`                                       | `#Movies: aquamarine`                                                                                                                 |

<br>
<br>

## Cascade

A Cascade is composed of an optional [header](#header) and one or more [events](#events).
<br>
<br>

### Header

The header of a cascade indicates things about the cascade like visual preferences and metadata. It is the first part of a cascade; that is, **anything before the first event is considered the header**. 

Right now there is only one thing you can include in the header, which is [tag colors](#tags-and-colors). Anything else in the header area (that is, everything before the first event) will be ignored.
<br>
<br>

#### Tags and colors

You can indicate the color you want certain tagged events to appear like so:

```
#Travel: blue
#Education: green
#Economics: #abc // hex color
```

CSS color literals are supported (e.g., `aliceblue` or `mediumvioletred`) as well as hex colors (e.g., `#a13bbb`).

So, if you have an event like the following
```
2012-2013: Germany and Italy #Travel
```
it will be colored as blue in the cascade.
<br>
<br>

### Events
An event is a [Date Range](#date-ranges) followed by a colon followed by an [event description](#event-description):

```
12/2012: End of the world
1961: Year after 1960
Later, 1962 would happen

2020-02-22T12:13:14Z-now: How long the pandemic has been going on?
12/7/1941: Pearl Harbor attacked
Launched US into WWII

2022-02-22T16:27:08.369Z: More specific thing
2021-01-02T06:27:00Z-2022: ongoing project work until the end of 2022
```

<br>
<br>

#### Event Description
An event description is everything after the date range of the event, **up to the next event**. Event descriptions can span multiple lines. For `12/2012: End of the world`, the event description is just `End of the world`. For the following event:
```
1961: Year after 1960
Later, 1962 would happen
```
the event description is 
```
Year after 1960
Later, 1962 would happen
```

Everything not on the first line (where the date range is specified) up to the next event will be put in an overflow box that can be expanded by clicking on the event. Such an overflow is indicated in the timeline with an ellipsis (...). Event descriptions can include [tags](#tags), [links](#links), [locations](locations), and [photos](#photos). 

<br>
<br>


### Date Ranges
A date range is a period from one date to another. Every event has an associated date range, whether it has an end date or not.

If an end date is not specified, the range is as long as its granularity.

| Example   | Inferred Range                                   | Explanation                                         |
| --------- | ------------------------------------------------ | --------------------------------------------------- |
| `2024`    | `2024-01-01T00:00:00Z` to `2025-01-01T00:00:00Z` | From the start of 2024 to the end of 2024           |
| `04/1776` | `1776-04-01T00:00:00Z` to `1776-05-01T00:00:00Z` | From the start of July 1776 to the end of July 1776 |


For example, the event
```
2001: A Space Odyssey
```
starts January 1, 2001, and lasts until December 31, 2001.

#### Dates
An event is indicated by its date(s). 


## Saving and sharing

To save a cascade to your computer, click the `Save...` button while on the Editor tab of the sidebar. It will be saved locally, and you can come back and edit or view it later, as long as it's on the same device. 

You can view cascades that you've saved from the profile tab of the sidebar.

To share a cascade with a link, you will need to make an account. You can make an account by sending yourself a signin link from the profile page. Once signed in, you will need to choose a username from which your cascades will be hosted. For example, if you choose the name `jeff`, all your cascades will be accessible from `https://cascade.page/jeff/...`. If you share a cascade with the same name as your username, it will be accessible from `https://cascade.page/[your username]/`, otherwise, it will be accessible from `https://cascade.page/[your username]/[cascade name]`.

All in all, the steps are:
1. Send yourself a signin link from the profile tab.
2. Click the link to login.
3. Choose a username - all your shared cascades will be available from `https://cascade.page/[your username]/...`
4. Share your cascade

## Public by default

Any cascade you share is public by default - anyone could view it. Any cascade you save locally only on your computer is, of course, only accessible on that device.