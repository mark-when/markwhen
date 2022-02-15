import { DateTime } from "luxon"

export type DateTimeToDisplay = (dt: DateTime) => string | number

export const granularities: DateTimeToDisplay[][] = [
//            |------------------------------------------------------------------------------------------------ Specificity of this date --------------------------------------------------------------------------------------------------|
// Resolution  second               // minute                                           // hour                                           // day                    // month                                // year                                   // decade
/* second */  [(dt) => dt.second,   (dt) => `${dt.hour}:${dt.minute}:${dt.second}`,     (dt) => `${dt.hour}:${dt.minute}${dt.second}`,    (dt) => dt.toISODate(),   (dt) => dt.toISODate(),                 (dt) => dt.toISODate(),                   (dt) => dt.toISODate()],
/* minute */  [(dt) => dt.second,   (dt) => dt.minute,                                  (dt) => `${dt.hour}:${dt.minute}`,                (dt) => dt.toISODate(),   (dt) => dt.toISODate(),                 (dt) => dt.toISODate(),                   (dt) => dt.toISODate()],
/* hour   */  [(dt) => '',          (dt) => dt.minute,                                  (dt) => dt.hour,                                  (dt) => dt.toISODate(),   (dt) => dt.toISODate(),                 (dt) => dt.toISODate(),                   (dt) => dt.toISODate()],
/* day    */  [(dt) => '',          (dt) => '',                                         (dt) => dt.hour,                                  (dt) => dt.day,           (dt) => `${dt.monthShort} ${dt.year}`,  (dt) => `${dt.monthShort} ${dt.year}`,    (dt) => `${dt.monthShort} ${dt.year}`],
/* month  */  [(dt) => '',          (dt) => '',                                         (dt) => '',                                       (dt) => dt.day,           (dt) => dt.monthShort,                  (dt) => dt.year,                          (dt) => dt.year       ],
/* year   */  [(dt) => '',          (dt) => '',                                         (dt) => '',                                       (dt) => '',               (dt) => dt.month,                       (dt) => dt.year,                          (dt) => dt.year       ],
/* decade */  [(dt) => '',          (dt) => '',                                         (dt) => '',                                       (dt) => '',               (dt) => '',                             (dt) => dt.year,                          (dt) => dt.year       ]
]
