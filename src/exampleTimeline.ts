
export const exampleTimeline = `
title: Welcome to Markwhen 👋

#Project1: #d336b1

section Welcome #welcome
now: This example timeline showcases some of markwhen's features.

Feel free to delete everything to start making your own timeline #welcome


now: You can also view this example timeline at [markwhen.com/example](https://markwhen.com/example) #welcome

Or you can save this timeline so you can refer to it later, by going to Browser storage & files, and clicking Save current.

now: For more information, view the documentation [here](https://docs.markwhen.com) or join the [discord](https://discord.gg/kQbqP4uz)
#welcome
endSection

section All Projects
group Project 1 #Project1
// Supports ISO8601
2023-01/2023-03: Sub task #John
2023-03/2023-06: Sub task 2 #Michelle
More info about sub task 2

- [ ] We need to get this done
- [x] And this
- [ ] This one is extra

2023-07: Yearly planning
endGroup
 group Project 2 #Project2
2023-04/4 months: Larger sub task #Danielle

// Supports American date formats
03/2023 - 1 year: Longer ongoing task #Michelle

- [x] Sub task 1
- [x] Sub task 2
- [ ] Sub task 3
- [ ] Sub task 4
- [ ] so many checkboxes omg

10/2023 - 2 months: Holiday season
endGroup

group Project 3
01/2024: Project kickoff
02/2024-04/2024: Other stuff
endGroup
endSection

2023-01-03 every other week for 1 year: Biweekly meeting


_-_-_break_-_-_

// The header is everything before any events are defined
// You can add a few things in the header:
// tag color definitions, the page title, and who can view your timeline (if you are a subscriber)

// Notably the \`view\` line only works on the first page.

title: Header

view: *@example.com, myteam@mycompany.com

#Horticulture: purple

// Hex colors are supported
#Transportation: #3ef

2024: First event #Horticulture

06/2024: Other event #Transportation

now: [More documentation](https://docs.markwhen.com/syntax/header.html)
_-_-_break_-_-_
title: Events

// Events that don't have explicit end dates have inferred ranges - for example, when a year is specified, it lasts from the beginning of that year to the end of it.
2024: A year-long event

// Inferred ranges are as granular as their definitions.
09/2024: one month

2025-05-05: one day

Jan 4 2025 8am: instant

// You can also be specific with your ranges
2024/2025: An event that lasts two years

November 8, 2022 9am - November 9, 2023, 10am: one year, one day, and one hour

now: [More documentation](https://docs.markwhen.com/syntax/events.html)

_-_-_break_-_-_
title: Event Descriptions

// Event descriptions last from the date range definition up to the next event

2029-04-25/2029-05-03: Descriptions can be one line

2029-04-25/2029-05-03: Or
they can span
multiple lines

1/27/2025: [] An event can have a checkbox for completion
Put square brackets at the start of the event description

1/27/2026: [x] To mark an event as completed, put an x in the square brackets

1/27/2027: Events can have lists

- [ ] checkbox list item
- [x] a completed checkbox list item
- simple list item
- another simple list item

1/27/2028 - 1 year: 68% Manually indicate an event's completion with a percentage in the description

Partially completed events will have their event bar partially filled that amount

1 year: Links are markdown-style: [This is a link](https://markwhen.com)

1 year: Images are also markdown-style:
![](https://blog.markwhen.com/images/calendar1.png)

1 year: Locations (which are more useful for the map view) can be indicated in a similar way: [Hawaii](location) [Alaska](map)

2024: Refer to other markwhen documents with \`@\` syntax: @rob

now: [More documentation](https://docs.markwhen.com/syntax/event-descriptions.html)
_-_-_break_-_-_
title: Groups and Sections

// Events can be grouped together

group
1/27/2024: Happy birthday
2020-03: Covid started in the US 
endGroup

group Group with title

Feb 2 2025: Interviewing
Feb 8 2025: Write report
Feb 19 2025: Presentation

endGroup

group Groups can contain other groups #big

group Smaller plan #small #nested

1 year: Accomplish something

2 years: Accomplish something else

endGroup

1 year: Things are accomplished

endGroup

section Sections extend across the screen

2023: Start year

section Nested section #nested

2025: End year

endSection
endSection


now: [More documentation](https://docs.markwhen.com/syntax/groups-and-sections.html)

_-_-_break_-_-_
title: Tags

// Specify tag colors in the header (before any event)
#Timeline: #abf

now: Events and groups can have tags


section Tagged events #Timeline
Feb 18 1999: back in the day #Past #The90s
2043: in the future #TheOther90s


now: [More documentation](https://docs.markwhen.com/syntax/event-descriptions.html#tag)
_-_-_break_-_-_
title: Relative dates

2025: Event

1 year: This event happens immediately after the previous event and lasts for 1 year

#after

3 months - 1 month: This event happens 3 months after the previous event and lasts for 1 month
#after

by 2 weeks - 1 month: This event happens 2 weeks before the previous event and lasts 1 month
#before


2023: Event !base

after !base 1 year - 1 month: This event happens 1 year after the event with with id \`base\` and lasts for 1 month
#after

before !base 1 week day - 1 hour: This event happens 1 week day before the event with id \`base\` and lasts 1 hour
#before

_-_-_break_-_-_
title: Recurring events

October 7, 1989 every year for 10 years: ...
2025-03-04 every week for 12 weeks: ...
2022-01/2022-03 every other year x9: ...
Feb 1 2023 every 6 months for 10 times: ...
`;