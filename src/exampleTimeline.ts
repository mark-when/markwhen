
export const exampleTimeline = `
title: Welcome to Markwhen 👋
description: Markwhen is a text to timeline tool.

// Feel free to delete everything to start making your own timeline.

#Project1: #d336b1

section Welcome #welcome

now: View an example timeline at [markwhen.com/example](https://markwhen.com/example) #welcome

now: View the documentation [here](https://docs.markwhen.com) or join the [discord](https://discord.gg/kQbqP4uz)
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
`;